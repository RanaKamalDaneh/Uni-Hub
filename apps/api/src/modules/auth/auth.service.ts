import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { RoleKey } from '@unihub/shared';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import type { AccessTokenPayload } from '../../common/auth.types';
import { slugify } from '../../common/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { ChangePasswordDto, LoginDto, RegisterDto } from './auth.dto';

const BCRYPT_COST = 12;
// Used to keep login timing similar whether or not the email exists.
const DUMMY_HASH = bcrypt.hashSync('unihub-timing-equaliser', BCRYPT_COST);

export interface SessionContext {
  ip?: string;
  userAgent?: string;
}

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  user: SessionUser;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: RoleKey[];
  permissions: string[];
  locale: 'en' | 'ar';
  avatarKey: string | null;
  providerStatus: string | null;
}

const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto, ctx: SessionContext): Promise<IssuedSession> {
    if (!dto.acceptTerms) {
      throw new BadRequestException({ code: 'TERMS_REQUIRED', message: 'You must accept the terms to continue' });
    }
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException({ code: 'EMAIL_TAKEN', message: 'An account with this email already exists' });

    const role = await this.prisma.role.findUniqueOrThrow({ where: { key: dto.accountType } });
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
          passwordHash,
          roles: { create: { roleId: role.id } },
          profile: { create: { preferredLocale: dto.locale ?? 'en' } },
        },
      });
      if (dto.accountType === 'PROVIDER') {
        await tx.providerProfile.create({
          data: {
            userId: u.id,
            slug: `${slugify(dto.fullName) || 'provider'}-${randomBytes(3).toString('hex')}`,
            title: '',
            bio: '',
            languages: [dto.locale === 'ar' ? 'Arabic' : 'English'],
          },
        });
      }
      return u;
    });

    await this.audit.log({ actorId: user.id, action: 'auth.register', entityType: 'User', entityId: user.id, after: { accountType: dto.accountType }, ...ctx });
    return this.issueSession(user.id, ctx);
  }

  async login(dto: LoginDto, ctx: SessionContext): Promise<IssuedSession> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const ok = await bcrypt.compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' });
    }
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException({ code: 'ACCOUNT_DISABLED', message: 'This account is not active. Please contact support.' });
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await this.audit.log({ actorId: user.id, action: 'auth.login', entityType: 'User', entityId: user.id, ...ctx });
    return this.issueSession(user.id, ctx);
  }

  /**
   * Refresh-token rotation with reuse detection: every refresh revokes the presented token and issues
   * a new one in the same family. Presenting an already-revoked token revokes the entire family.
   */
  async refresh(rawToken: string | undefined, ctx: SessionContext): Promise<IssuedSession> {
    if (!rawToken) throw new UnauthorizedException({ code: 'NO_SESSION', message: 'No active session' });
    const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
    if (!record) throw new UnauthorizedException({ code: 'NO_SESSION', message: 'No active session' });

    if (record.revokedAt) {
      await this.prisma.refreshToken.updateMany({ where: { family: record.family, revokedAt: null }, data: { revokedAt: new Date() } });
      await this.audit.log({ actorId: record.userId, action: 'auth.refresh_reuse_detected', entityType: 'User', entityId: record.userId, ...ctx });
      throw new UnauthorizedException({ code: 'SESSION_REVOKED', message: 'Session expired. Please log in again.' });
    }
    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException({ code: 'SESSION_EXPIRED', message: 'Session expired. Please log in again.' });
    }

    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user || user.status !== 'ACTIVE') {
      await this.revokeFamily(record.family);
      throw new ForbiddenException({ code: 'ACCOUNT_DISABLED', message: 'This account is not active' });
    }

    const session = await this.issueSession(user.id, ctx, record.family);
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date(), replacedBy: hashToken(session.refreshToken) },
    });
    return session;
  }

  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;
    const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
    if (record) await this.revokeFamily(record.family);
  }

  async changePassword(userId: string, dto: ChangePasswordDto, ctx: SessionContext): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new BadRequestException({ code: 'WRONG_PASSWORD', message: 'Current password is incorrect' });
    }
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(dto.newPassword, BCRYPT_COST) } }),
      // Sign out every other session.
      this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    await this.audit.log({ actorId: userId, action: 'auth.change_password', entityType: 'User', entityId: userId, ...ctx });
  }

  async getSessionUser(userId: string): Promise<SessionUser> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        profile: true,
        providerProfile: { select: { verificationStatus: true } },
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    const roles = user.roles.map((r) => r.role.key as RoleKey);
    const permissions = [...new Set(user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.key)))];
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
      permissions,
      locale: user.profile?.preferredLocale ?? 'en',
      avatarKey: user.profile?.avatarKey ?? null,
      providerStatus: user.providerProfile?.verificationStatus ?? null,
    };
  }

  private async issueSession(userId: string, ctx: SessionContext, family?: string): Promise<IssuedSession> {
    const user = await this.getSessionUser(userId);
    const payload: AccessTokenPayload = { sub: user.id, email: user.email, roles: user.roles, perms: user.permissions };
    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = randomBytes(48).toString('base64url');
    const ttlDays = this.config.get<number>('REFRESH_TOKEN_TTL_DAYS') ?? 30;
    const refreshExpiresAt = new Date(Date.now() + ttlDays * 86_400_000);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        family: family ?? randomBytes(16).toString('hex'),
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt,
        ip: ctx.ip,
        userAgent: ctx.userAgent?.slice(0, 255),
      },
    });
    return { accessToken, refreshToken, refreshExpiresAt, user };
  }

  private async revokeFamily(family: string) {
    await this.prisma.refreshToken.updateMany({ where: { family, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}
