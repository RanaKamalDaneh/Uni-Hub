import { Controller, Get, Injectable, Module, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Active categories with the live count of PUBLISHED services (never a hard-coded number). */
  async listCategories() {
    const [categories, counts] = await Promise.all([
      this.prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { subcategories: { where: { isActive: true } } } } },
      }),
      this.prisma.service.groupBy({ by: ['categoryId'], where: { status: 'PUBLISHED' }, _count: { _all: true } }),
    ]);
    const byCat = new Map(counts.map((c) => [c.categoryId, c._count._all]));
    return categories.map(({ _count, ...c }) => ({
      ...c,
      subcategoryCount: _count.subcategories,
      serviceCount: byCat.get(c.id) ?? 0,
    }));
  }

  async getCategory(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      include: { subcategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) throw new NotFoundException({ code: 'CATEGORY_NOT_FOUND', message: 'Category not found' });
    const counts = await this.prisma.service.groupBy({
      by: ['subcategoryId'],
      where: { categoryId: category.id, status: 'PUBLISHED' },
      _count: { _all: true },
    });
    const bySub = new Map(counts.map((c) => [c.subcategoryId, c._count._all]));
    return {
      ...category,
      serviceCount: counts.reduce((n, c) => n + c._count._all, 0),
      subcategories: category.subcategories.map((s) => ({ ...s, serviceCount: bySub.get(s.id) ?? 0 })),
    };
  }

  /** Public, non-sensitive settings the website needs (e.g. the WhatsApp contact number). */
  async publicSettings() {
    const rows = await this.prisma.systemSetting.findMany({ where: { key: { in: ['contact.whatsapp'] } } });
    const get = (k: string) => rows.find((r) => r.key === k)?.value;
    const whatsapp = String(get('contact.whatsapp') ?? '').replace(/\D/g, '');
    return { whatsapp: whatsapp || null };
  }

  async referenceData() {
    const [universities, academicLevels] = await Promise.all([
      this.prisma.university.findMany({ orderBy: { nameEn: 'asc' } }),
      this.prisma.academicLevel.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { universities, academicLevels };
  }
}

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Public()
  @Get('categories')
  list() {
    return this.catalog.listCategories();
  }

  @Public()
  @Get('categories/:slug')
  get(@Param('slug') slug: string) {
    return this.catalog.getCategory(slug);
  }

  @Public()
  @Get('settings/public')
  publicSettings() {
    return this.catalog.publicSettings();
  }

  @Public()
  @Get('reference-data')
  reference() {
    return this.catalog.referenceData();
  }
}

@Module({ controllers: [CatalogController], providers: [CatalogService], exports: [CatalogService] })
export class CatalogModule {}
