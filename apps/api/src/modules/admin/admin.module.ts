import { Body, Controller, Get, Injectable, Module, NotFoundException, Param, Patch, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import type { Request } from 'express';
import type { AuthUser } from '../../common/auth.types';
import { CurrentUser, RequirePermissions } from '../../common/decorators';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export class UpdateContactDto {
  /**
   * One or more comma-separated numbers, digits only, international format without "+" or leading zeros
   * (e.g. 962791234567,962771234567). Empty clears it.
   */
  @IsString() @Matches(/^(|[1-9]\d{7,14}(,[1-9]\d{7,14}){0,4})$/, { message: 'whatsapp must be up to 5 comma-separated numbers of 8–15 digits in international format, e.g. 962791234567,962771234567' })
  whatsapp!: string;
}

export class UpdatePackageDto {
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(100000) price?: number;
  @IsOptional() @IsInt() @Min(1) @Max(365) deliveryDays?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class AdminServicesQuery {
  @IsOptional() @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsString() @MaxLength(100) q?: string;
}

const meta = (req: Request) => ({ ip: req.ip, userAgent: req.headers['user-agent'] });

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async contact() {
    const row = await this.prisma.systemSetting.findUnique({ where: { key: 'contact.whatsapp' } });
    return { whatsapp: String(row?.value ?? '') };
  }

  async updateContact(dto: UpdateContactDto, user: AuthUser, req: Request) {
    const before = await this.contact();
    await this.prisma.systemSetting.upsert({
      where: { key: 'contact.whatsapp' },
      create: { key: 'contact.whatsapp', value: dto.whatsapp, updatedBy: user.id },
      update: { value: dto.whatsapp, updatedBy: user.id },
    });
    await this.audit.log({ actorId: user.id, action: 'settings.contact.update', entityType: 'SystemSetting', entityId: 'contact.whatsapp', before, after: dto, ...meta(req) });
    return { whatsapp: dto.whatsapp };
  }

  services(query: AdminServicesQuery) {
    const q = query.q?.trim();
    const where: Prisma.ServiceWhereInput = {
      status: 'PUBLISHED',
      category: { isActive: true, ...(query.category ? { slug: query.category } : {}) },
      ...(q ? { OR: [{ titleEn: { contains: q, mode: 'insensitive' } }, { titleAr: { contains: q, mode: 'insensitive' } }] } : {}),
    };
    return this.prisma.service.findMany({
      where,
      orderBy: [{ category: { sortOrder: 'asc' } }, { titleEn: 'asc' }],
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleAr: true,
        startingPrice: true,
        currency: true,
        category: { select: { slug: true, nameEn: true, nameAr: true } },
        packages: { orderBy: { price: 'asc' }, select: { id: true, tier: true, nameEn: true, nameAr: true, price: true, deliveryDays: true, isActive: true } },
      },
    });
  }

  /** Updates one package and keeps the service's denormalised starting price / delivery time in sync. */
  async updatePackage(id: string, dto: UpdatePackageDto, user: AuthUser, req: Request) {
    const before = await this.prisma.servicePackage.findUnique({ where: { id } });
    if (!before) throw new NotFoundException({ code: 'PACKAGE_NOT_FOUND', message: 'Package not found' });

    const updated = await this.prisma.$transaction(async (tx) => {
      const pkg = await tx.servicePackage.update({ where: { id }, data: dto });
      const active = await tx.servicePackage.findMany({ where: { serviceId: pkg.serviceId, isActive: true }, orderBy: { price: 'asc' } });
      if (active.length) {
        await tx.service.update({
          where: { id: pkg.serviceId },
          data: { startingPrice: active[0].price, deliveryDays: Math.min(...active.map((p) => p.deliveryDays)) },
        });
      }
      return pkg;
    });
    await this.audit.log({
      actorId: user.id,
      action: 'service.package.update',
      entityType: 'ServicePackage',
      entityId: id,
      before: { price: before.price, deliveryDays: before.deliveryDays, isActive: before.isActive },
      after: dto,
      ...meta(req),
    });
    return updated;
  }
}

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @RequirePermissions('settings.manage')
  @Get('settings/contact')
  contact() {
    return this.admin.contact();
  }

  @RequirePermissions('settings.manage')
  @Patch('settings/contact')
  updateContact(@Body() dto: UpdateContactDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    return this.admin.updateContact(dto, user, req);
  }

  @RequirePermissions('services.moderate')
  @Get('services')
  services(@Query() query: AdminServicesQuery) {
    return this.admin.services(query);
  }

  @RequirePermissions('services.moderate')
  @Patch('packages/:id')
  updatePackage(@Param('id') id: string, @Body() dto: UpdatePackageDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    return this.admin.updatePackage(id, dto, user, req);
  }
}

@Module({ controllers: [AdminController], providers: [AdminService] })
export class AdminModule {}
