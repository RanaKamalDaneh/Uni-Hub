import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { RoleKey } from '@unihub/shared';
import type { AccessTokenPayload, AuthUser } from './auth.types';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY, ROLES_KEY } from './decorators';

export function extractBearer(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}

export function toAuthUser(p: AccessTokenPayload): AuthUser {
  return { id: p.sub, email: p.email, roles: p.roles, permissions: new Set(p.perms) };
}

/**
 * Global guard. Every route requires a valid access token unless marked @Public().
 * On public routes a valid token is still decoded so handlers can personalise responses.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (ctx.getType() !== 'http') return true;
    const req = ctx.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    const token = extractBearer(req.headers.authorization);

    if (token) {
      try {
        req.user = toAuthUser(await this.jwt.verifyAsync<AccessTokenPayload>(token));
      } catch {
        if (!isPublic) throw new UnauthorizedException({ code: 'TOKEN_INVALID', message: 'Session expired' });
      }
    }
    if (!isPublic && !req.user) throw new UnauthorizedException({ code: 'UNAUTHENTICATED', message: 'Login required' });
    return true;
  }
}

/** Global guard enforcing @Roles() and @RequirePermissions(). SUPER_ADMIN passes everything. */
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    if (ctx.getType() !== 'http') return true;
    const roles = this.reflector.getAllAndOverride<RoleKey[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
    const perms = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!roles?.length && !perms?.length) return true;

    const user: AuthUser | undefined = ctx.switchToHttp().getRequest().user;
    if (!user) throw new UnauthorizedException({ code: 'UNAUTHENTICATED', message: 'Login required' });
    if (user.roles.includes('SUPER_ADMIN')) return true;

    if (roles?.length && !roles.some((r) => user.roles.includes(r))) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'You do not have access to this resource' });
    }
    if (perms?.length && !perms.every((p) => user.permissions.has(p))) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Missing permission' });
    }
    return true;
  }
}
