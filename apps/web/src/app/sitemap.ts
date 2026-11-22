import type { MetadataRoute } from 'next';
import { serverApiSafe } from '@/lib/api';
import { SITE_URL } from '@/lib/site';
import type { CategoryDto, Paged, ServiceCardDto } from '@/lib/types';

export const revalidate = 3600;

/** Every public page: home, services index, each category and each service. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, first] = await Promise.all([
    serverApiSafe<CategoryDto[]>('/categories', { revalidate }),
    serverApiSafe<Paged<ServiceCardDto>>('/services?limit=48&page=1', { revalidate }),
  ]);
  const services = [...(first?.items ?? [])];
  for (let page = 2; first && page <= first.pages; page++) {
    const more = await serverApiSafe<Paged<ServiceCardDto>>(`/services?limit=48&page=${page}`, { revalidate });
    services.push(...(more?.items ?? []));
  }
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...(categories ?? []).map((c) => ({ url: `${SITE_URL}/services/${c.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...services.map((s) => ({ url: `${SITE_URL}/service/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
