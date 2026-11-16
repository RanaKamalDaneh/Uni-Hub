import { Controller, Get, Injectable, Module, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Public } from '../../common/decorators';
import { PrismaService } from '../../prisma/prisma.service';

/** Arabic transliterations of common technology names → canonical English terms. */
const AR_TECH_SYNONYMS: Record<string, string> = {
  بايثون: 'Python', بايثن: 'Python', جافا: 'Java', 'سي بلس بلس': 'C++', 'سي شارب': 'C#', جافاسكربت: 'JavaScript',
  'جافا سكربت': 'JavaScript', 'بي اتش بي': 'PHP', رياكت: 'React', 'نكست': 'Next.js', 'نود': 'Node.js', فلاتر: 'Flutter',
  اندرويد: 'Android', 'اي او اس': 'iOS', اكسل: 'Excel', إكسل: 'Excel', 'باور بي اي': 'Power BI', تابلو: 'Tableau',
  'اس بي اس اس': 'SPSS', 'ماي اس كيو ال': 'MySQL', 'اوراكل': 'Oracle', 'مونجو': 'MongoDB', 'سيسكو': 'Cisco',
  'باكيت تريسر': 'Packet Tracer', 'لينكس': 'Linux', 'دوكر': 'Docker', 'لارافيل': 'Laravel', 'جانغو': 'Django',
};

export function expandSearchTerm(q: string): string[] {
  const lower = q.trim().toLowerCase();
  return Object.entries(AR_TECH_SYNONYMS)
    .filter(([ar]) => lower.includes(ar))
    .map(([, en]) => en);
}

export class ListServicesQuery {
  @IsOptional() @IsString() @MaxLength(100) q?: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsString() @MaxLength(80) subcategory?: string;
  @IsOptional() @IsNumber() @Min(0) minPrice?: number;
  @IsOptional() @IsNumber() @Min(0) maxPrice?: number;
  @IsOptional() @IsInt() @Min(1) maxDays?: number;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() featured?: boolean;
  @IsOptional() @IsIn(['popular', 'newest', 'price_asc', 'price_desc', 'rating', 'fastest']) sort?: string;
  @IsOptional() @IsInt() @Min(1) page?: number;
  @IsOptional() @IsInt() @Min(1) @Max(48) limit?: number;
}

const CARD_SELECT = {
  id: true,
  slug: true,
  titleEn: true,
  titleAr: true,
  summaryEn: true,
  summaryAr: true,
  technologies: true,
  startingPrice: true,
  currency: true,
  deliveryDays: true,
  ratingAvg: true,
  ratingCount: true,
  isFeatured: true,
  category: { select: { slug: true, nameEn: true, nameAr: true, color: true, icon: true } },
  subcategory: { select: { slug: true, nameEn: true, nameAr: true } },
  provider: { select: { slug: true, title: true, titleAr: true, displayNameAr: true, verificationStatus: true, user: { select: { fullName: true } } } },
} satisfies Prisma.ServiceSelect;

const PROVIDER_PUBLIC = {
  slug: true,
  title: true,
  bio: true,
  titleAr: true,
  bioAr: true,
  displayNameAr: true,
  yearsExperience: true,
  languages: true,
  isAvailable: true,
  verificationStatus: true,
  ratingAvg: true,
  ratingCount: true,
  completedOrders: true,
  createdAt: true,
  user: { select: { fullName: true, profile: { select: { avatarKey: true } } } },
  skills: { select: { name: true, level: true }, orderBy: { level: 'desc' as const } },
} satisfies Prisma.ProviderProfileSelect;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListServicesQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where: Prisma.ServiceWhereInput = {
      status: 'PUBLISHED',
      provider: { verificationStatus: 'VERIFIED' },
      category: { isActive: true, ...(query.category ? { slug: query.category } : {}) },
    };
    if (query.subcategory) where.subcategory = { slug: query.subcategory };
    if (query.featured) where.isFeatured = true;
    if (query.maxDays) where.deliveryDays = { lte: query.maxDays };
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.startingPrice = { gte: query.minPrice, lte: query.maxPrice };
    }
    const q = query.q?.trim();
    if (q) {
      // Students often type technology names in Arabic letters (e.g. "بايثون"); search both forms.
      const terms = [q, ...expandSearchTerm(q)];
      where.OR = terms.flatMap((term) => {
        const contains = { contains: term, mode: 'insensitive' as const };
        return [
          { titleEn: contains },
          { titleAr: contains },
          { summaryEn: contains },
          { summaryAr: contains },
          { technologies: { has: term } },
          { subcategory: { OR: [{ nameEn: contains }, { nameAr: contains }] } },
          { category: { OR: [{ nameEn: contains }, { nameAr: contains }] } },
        ];
      });
    }

    const orderBy: Prisma.ServiceOrderByWithRelationInput[] = {
      popular: [{ isFeatured: 'desc' as const }, { viewCount: 'desc' as const }, { titleEn: 'asc' as const }],
      newest: [{ publishedAt: 'desc' as const }],
      price_asc: [{ startingPrice: 'asc' as const }],
      price_desc: [{ startingPrice: 'desc' as const }],
      rating: [{ ratingAvg: 'desc' as const }, { ratingCount: 'desc' as const }],
      fastest: [{ deliveryDays: 'asc' as const }],
    }[query.sort ?? 'popular']!;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, select: CARD_SELECT }),
    ]);
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
  }

  async getBySlug(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: { slug, status: 'PUBLISHED', provider: { verificationStatus: 'VERIFIED' } },
      include: {
        category: true,
        subcategory: true,
        packages: { where: { isActive: true }, orderBy: { price: 'asc' } },
        provider: {
          select: {
            ...PROVIDER_PUBLIC,
            portfolio: { orderBy: { createdAt: 'desc' }, take: 6 },
            _count: { select: { services: { where: { status: 'PUBLISHED' } } } },
          },
        },
        reviews: {
          where: { isHidden: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, rating: true, comment: true, reply: true, createdAt: true, author: { select: { fullName: true } } },
        },
      },
    });
    if (!service) throw new NotFoundException({ code: 'SERVICE_NOT_FOUND', message: 'Service not found' });

    const related = await this.prisma.service.findMany({
      where: {
        id: { not: service.id },
        status: 'PUBLISHED',
        OR: [{ subcategoryId: service.subcategoryId ?? undefined }, { categoryId: service.categoryId }],
      },
      orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
      take: 4,
      select: CARD_SELECT,
    });

    // Best-effort view counter; never blocks or fails the request.
    this.prisma.service.update({ where: { id: service.id }, data: { viewCount: { increment: 1 } } }).catch(() => undefined);

    return { ...service, related };
  }

  featuredProviders(limit = 4) {
    return this.prisma.providerProfile.findMany({
      where: { verificationStatus: 'VERIFIED', services: { some: { status: 'PUBLISHED' } } },
      orderBy: [{ ratingAvg: 'desc' }, { completedOrders: 'desc' }],
      take: Math.min(limit, 12),
      select: { ...PROVIDER_PUBLIC, _count: { select: { services: { where: { status: 'PUBLISHED' } } } } },
    });
  }

  async provider(slug: string) {
    const provider = await this.prisma.providerProfile.findFirst({
      where: { slug, verificationStatus: 'VERIFIED' },
      select: { ...PROVIDER_PUBLIC, portfolio: { orderBy: { createdAt: 'desc' } } },
    });
    if (!provider) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' });
    const services = await this.prisma.service.findMany({
      where: { provider: { slug }, status: 'PUBLISHED' },
      orderBy: [{ isFeatured: 'desc' }, { titleEn: 'asc' }],
      take: 24,
      select: CARD_SELECT,
    });
    return { ...provider, services };
  }
}

@ApiTags('services')
@Controller()
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Get('services')
  list(@Query() query: ListServicesQuery) {
    return this.services.list(query);
  }

  @Public()
  @Get('services/:slug')
  get(@Param('slug') slug: string) {
    return this.services.getBySlug(slug);
  }

  @Public()
  @Get('providers/featured')
  featured(@Query('limit') limit?: string) {
    return this.services.featuredProviders(Number(limit) || 4);
  }

  @Public()
  @Get('providers/:slug')
  provider(@Param('slug') slug: string) {
    return this.services.provider(slug);
  }
}

@Module({ controllers: [ServicesController], providers: [ServicesService], exports: [ServicesService] })
export class ServicesModule {}
