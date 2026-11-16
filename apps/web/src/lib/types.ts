export interface CategoryRef {
  slug: string;
  nameEn: string;
  nameAr: string;
  color: string;
  icon: string;
}

export interface CategoryDto extends CategoryRef {
  id: string;
  descriptionEn: string;
  descriptionAr: string;
  serviceCount: number;
}

export interface SubcategoryDto {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  serviceCount: number;
}

export interface CategoryDetailDto extends CategoryDto {
  subcategories: SubcategoryDto[];
}

export interface ServiceCardDto {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  technologies: string[];
  startingPrice: string | null;
  currency: string;
  deliveryDays: number;
  ratingAvg: string;
  ratingCount: number;
  isFeatured: boolean;
  category: CategoryRef;
  subcategory: { slug: string; nameEn: string; nameAr: string } | null;
  provider: ProviderRef;
}

export interface ProviderRef {
  slug: string;
  title: string;
  titleAr?: string | null;
  displayNameAr?: string | null;
  verificationStatus: string;
  user: { fullName: string };
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PackageDto {
  id: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  deliveryDays: number;
  revisions: number;
  featuresEn: string[];
  featuresAr: string[];
}

export interface FaqDto {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
}

export interface ServiceDetailDto extends Omit<ServiceCardDto, 'provider'> {
  overviewEn: string;
  overviewAr: string;
  includedEn: string[];
  includedAr: string[];
  featuresEn: string[];
  featuresAr: string[];
  requirementsEn: string[];
  requirementsAr: string[];
  deliverablesEn: string[];
  deliverablesAr: string[];
  faq: FaqDto[];
  packages: PackageDto[];
  provider: {
    slug: string;
    title: string;
    bio: string;
    bioAr: string | null;
    titleAr: string | null;
    displayNameAr: string | null;
    yearsExperience: number;
    languages: string[];
    verificationStatus: string;
    ratingAvg: string;
    ratingCount: number;
    completedOrders: number;
    createdAt: string;
    user: { fullName: string };
    skills: { name: string; level: number }[];
    portfolio: { id: string; title: string; description: string; url: string | null; technologies: string[] }[];
    _count: { services: number };
  };
  reviews: { id: string; rating: number; comment: string | null; reply: string | null; createdAt: string; author: { fullName: string } }[];
  related: ServiceCardDto[];
}
