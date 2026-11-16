import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_TONES, CategoryIcon } from '@/components/category-icon';
import { ServiceBrowser, type SearchParams } from '@/components/services/service-browser';
import { ApiError, serverApi } from '@/lib/api';
import type { CategoryDetailDto } from '@/lib/types';
import { cn, loc } from '@/lib/utils';

async function getCategory(slug: string) {
  try {
    return await serverApi<CategoryDetailDto>(`/categories/${encodeURIComponent(slug)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const [c, locale] = await Promise.all([getCategory(category), getLocale()]);
  return { title: loc(c, 'name', locale), description: loc(c, 'description', locale) };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ category: slug }, sp, locale, t] = await Promise.all([params, searchParams, getLocale(), getTranslations('services')]);
  const category = await getCategory(slug);
  const sub = typeof sp.sub === 'string' ? sp.sub : undefined;
  const activeSub = category.subcategories.find((s) => s.slug === sub);
  const tone = CATEGORY_TONES[category.color] ?? CATEGORY_TONES.blue;
  const basePath = `/services/${category.slug}`;
  const chip = 'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition';

  return (
    <>
      <section className={cn('border-b border-line bg-gradient-to-b to-white', tone.hero)}>
        <div className="container py-10">
          <nav className="flex items-center gap-1.5 text-sm text-ink-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-fg">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight className="rtl-flip h-4 w-4" aria-hidden />
            <Link href="/services" className="hover:text-brand-fg">
              {t('breadcrumbServices')}
            </Link>
            <ChevronRight className="rtl-flip h-4 w-4" aria-hidden />
            <span className="font-medium text-ink" aria-current="page">
              {loc(category, 'name', locale)}
            </span>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <CategoryIcon icon={category.icon} color={category.color} className="h-14 w-14 bg-surface shadow-card [&_svg]:h-7 [&_svg]:w-7" />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{loc(category, 'name', locale)}</h1>
              <p className="mt-2 max-w-2xl text-ink-muted">{loc(category, 'description', locale)}</p>
            </div>
          </div>

          <h2 className="mb-3 mt-8 text-sm font-semibold text-ink">{t('subcategories')}</h2>
          <nav className="-mx-4 flex flex-wrap gap-2 px-4" aria-label={t('subcategories')}>
            <Link
              href={basePath}
              className={cn(chip, !activeSub ? 'border-brand bg-brand text-brand-on' : 'border-line bg-surface text-ink hover:border-brand')}
              aria-current={!activeSub ? 'page' : undefined}
            >
              {t('allCategories')} <span className="text-xs opacity-75">{category.serviceCount}</span>
            </Link>
            {category.subcategories.map((s) => (
              <Link
                key={s.id}
                href={`${basePath}?sub=${s.slug}`}
                aria-current={activeSub?.slug === s.slug ? 'page' : undefined}
                className={cn(
                  chip,
                  activeSub?.slug === s.slug ? 'border-brand bg-brand text-brand-on' : 'border-line bg-surface text-ink hover:border-brand hover:text-brand-fg',
                )}
              >
                {loc(s, 'name', locale)}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="container py-10">
        <ServiceBrowser searchParams={sp} basePath={basePath} category={category.slug} subcategory={activeSub?.slug} />
      </section>
    </>
  );
}
