import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CategoryIcon } from '@/components/category-icon';
import { ServiceBrowser, type SearchParams } from '@/components/services/service-browser';
import { serverApi } from '@/lib/api';
import type { CategoryDto } from '@/lib/types';
import { loc } from '@/lib/utils';

export async function generateMetadata() {
  const t = await getTranslations('services');
  return { title: t('title'), description: t('subtitle') };
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [t, locale, categories, sp] = await Promise.all([
    getTranslations('services'),
    getLocale(),
    serverApi<CategoryDto[]>('/categories'),
    searchParams,
  ]);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-brand-light/60 to-white">
        <div className="container py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 max-w-2xl text-ink-muted">{t('subtitle')}</p>
          <nav className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2" aria-label={t('subcategories')}>
            <span className="inline-flex shrink-0 items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-on">
              {t('allCategories')}
            </span>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/services/${c.slug}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface py-1.5 pe-4 ps-1.5 text-sm font-medium text-ink transition hover:border-brand hover:text-brand-fg"
              >
                <CategoryIcon icon={c.icon} color={c.color} className="h-7 w-7 rounded-full [&_svg]:h-4 [&_svg]:w-4" />
                {loc(c, 'name', locale)}
                <span className="text-xs text-ink-muted">{c.serviceCount}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="container py-10">
        <ServiceBrowser searchParams={sp} basePath="/services" />
      </section>
    </>
  );
}
