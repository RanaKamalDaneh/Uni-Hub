import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/card';
import { serverApi } from '@/lib/api';
import type { Paged, ServiceCardDto } from '@/lib/types';
import { ServiceCard } from './service-card';

export type SearchParams = Record<string, string | string[] | undefined>;

const SORTS = ['popular', 'newest', 'rating'] as const;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/**
 * Server-rendered search, filters and pagination. Filters are a plain GET form, so the page
 * works without JavaScript and every result page has a shareable URL.
 */
export async function ServiceBrowser({
  searchParams,
  basePath,
  category,
  subcategory,
}: {
  searchParams: SearchParams;
  basePath: string;
  category?: string;
  subcategory?: string;
}) {
  const t = await getTranslations('services');
  const q = one(searchParams.q);
  const sort = (SORTS as readonly string[]).includes(one(searchParams.sort)) ? one(searchParams.sort) : 'popular';
  const page = Math.max(1, Number(one(searchParams.page)) || 1);

  const params = new URLSearchParams({ sort, page: String(page), limit: '12' });
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);

  const data = await serverApi<Paged<ServiceCardDto>>(`/services?${params}`);

  const pageHref = (p: number) => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (subcategory) next.set('sub', subcategory);
    if (sort !== 'popular') next.set('sort', sort);
    if (p > 1) next.set('page', String(p));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const hasFilters = !!(q || sort !== 'popular');
  const selectCls =
    'h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10';

  return (
    <div>
      <form method="get" action={basePath} className="mb-6 rounded-2xl border border-line bg-surface p-3 shadow-card">
        {subcategory && <input type="hidden" name="sub" value={subcategory} />}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label htmlFor="svc-q" className="sr-only">
            {t('search')}
          </label>
          <input
            id="svc-q"
            name="q"
            defaultValue={q}
            placeholder={t('searchPlaceholder')}
            className="h-10 flex-1 rounded-xl border border-line px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="hidden h-4 w-4 text-ink-muted sm:block" aria-hidden />
            <label className="sr-only" htmlFor="svc-sort">
              {t('sortLabel')}
            </label>
            <select id="svc-sort" name="sort" defaultValue={sort} className={selectCls}>
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {t(`sort_${s}`)}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" className="h-10">
              {t('apply')}
            </Button>
          </div>
        </div>
      </form>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted" aria-live="polite">
          {data.relaxed ? null : t('results', { count: data.total })}
        </p>
        {hasFilters && (
          <Link href={subcategory ? `${basePath}?sub=${subcategory}` : basePath} className="text-sm font-semibold text-brand-fg hover:underline">
            {t('reset')}
          </Link>
        )}
      </div>

      {data.relaxed && data.items.length > 0 && (
        <div role="status" className="mb-5 flex items-start gap-3 rounded-2xl border border-brand/40 bg-brand-light p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-fg" aria-hidden />
          <div>
            <p className="text-sm font-bold text-ink">{t('closestTitle')}</p>
            <p className="mt-1 text-sm text-ink-muted">{t('closestHint')}</p>
          </div>
        </div>
      )}

      {data.items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title={`${t('emptyTitle')} ${t('emptyHint')}`}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={basePath}>{t('reset')}</Link>
            </Button>
          }
        />
      )}

      {data.pages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
          {page > 1 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={pageHref(page - 1)} rel="prev">
                <ChevronLeft className="rtl-flip" aria-hidden /> {t('prev')}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="rtl-flip" aria-hidden /> {t('prev')}
            </Button>
          )}
          <span className="text-sm text-ink-muted">{t('pageOf', { page, pages: data.pages })}</span>
          {page < data.pages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={pageHref(page + 1)} rel="next">
                {t('next')} <ChevronRight className="rtl-flip" aria-hidden />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              {t('next')} <ChevronRight className="rtl-flip" aria-hidden />
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
