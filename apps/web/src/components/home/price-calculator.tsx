'use client';

import { Calculator, Check, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { whatsappLink } from '@/lib/contact';
import type { PackageDto, Paged, ServiceCardDto, ServiceDetailDto } from '@/lib/types';
import { cn, formatMoney, loc } from '@/lib/utils';

/** Field → service → package picker that shows the live package price, delivery time and features. */
export function PriceCalculator({ categories, whatsapp }: { categories: { slug: string; name: string }[]; whatsapp: string | null }) {
  const t = useTranslations('calc');
  const locale = useLocale();
  const [category, setCategory] = useState('');
  const [services, setServices] = useState<ServiceCardDto[]>([]);
  const [slug, setSlug] = useState('');
  const [detail, setDetail] = useState<ServiceDetailDto | null>(null);
  const [pkgId, setPkgId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setServices([]);
    setSlug('');
    setDetail(null);
    if (!category) return;
    let alive = true;
    fetch(`/api/v1/services?category=${encodeURIComponent(category)}&limit=48&sort=price_asc`)
      .then((r) => r.json() as Promise<Paged<ServiceCardDto>>)
      .then((d) => alive && setServices(d.items ?? []))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [category]);

  useEffect(() => {
    setDetail(null);
    if (!slug) return;
    let alive = true;
    setLoading(true);
    fetch(`/api/v1/services/${encodeURIComponent(slug)}`)
      .then((r) => r.json() as Promise<ServiceDetailDto>)
      .then((d) => {
        if (!alive) return;
        setDetail(d);
        const packages = d.packages ?? [];
        setPkgId((packages.find((p) => p.tier === 'STANDARD') ?? packages[0])?.id ?? '');
      })
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  const pkg: PackageDto | undefined = detail?.packages.find((p) => p.id === pkgId);
  const features = pkg ? (locale === 'ar' ? pkg.featuresAr : pkg.featuresEn) : [];
  const price = pkg ? formatMoney(pkg.price, locale, detail?.currency) : '';
  const url = typeof window !== 'undefined' && detail ? `${window.location.origin}/service/${detail.slug}` : '';
  const message = detail && pkg ? t('message', { service: loc(detail, 'title', locale), package: loc(pkg, 'name', locale), price, url }) : '';

  const selectCls =
    'h-12 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:opacity-50';

  return (
    <section id="calculator" className="container scroll-mt-24 pb-20">
      <div className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-fg">
            <Calculator className="h-3.5 w-3.5" aria-hidden /> {t('eyebrow')}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{t('title')}</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">{t('subtitle')}</p>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              {t('category')}
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
                <option value="">{t('choose')}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              {t('service')}
              <select value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!services.length} className={selectCls}>
                <option value="">{t('choose')}</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {loc(s, 'title', locale)}
                  </option>
                ))}
              </select>
            </label>
            {detail && (
              <fieldset>
                <legend className="mb-1.5 text-sm font-semibold text-ink">{t('package')}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {detail.packages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={p.id === pkgId}
                      onClick={() => setPkgId(p.id)}
                      className={cn(
                        'rounded-xl border px-2 py-3 text-center text-sm font-bold transition',
                        p.id === pkgId ? 'border-brand bg-brand text-brand-on' : 'border-line bg-surface text-ink hover:border-brand/50',
                      )}
                    >
                      {loc(p, 'name', locale)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col justify-center rounded-2xl border border-line bg-surface-soft p-6 sm:p-8" aria-live="polite">
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-fg" aria-hidden />
          ) : detail && pkg ? (
            <div key={pkg.id} className="animate-uh-rise">
              <p className="text-sm text-ink-muted">{t('price')}</p>
              <p className="mt-1 text-5xl font-extrabold text-brand-fg">{price}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-ink-muted" aria-hidden /> {t('delivery')}: <b>{t('days', { count: pkg.deliveryDays })}</b>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-ink-muted" aria-hidden /> {t('revisions', { count: pkg.revisions })}
                </span>
              </div>
              {features.length > 0 && (
                <ul className="mt-5 grid gap-2 text-sm text-ink">
                  {features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-fg" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 text-xs text-ink-muted">{t('note')}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {whatsapp && (
                  <a
                    href={whatsappLink(whatsapp, message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1EBE5A]"
                  >
                    <WhatsAppIcon className="h-5 w-5" /> {t('agree')}
                  </a>
                )}
                <Link href={`/service/${detail.slug}`} className="inline-flex h-11 items-center rounded-xl border border-line px-5 text-sm font-bold text-ink transition hover:border-brand">
                  {t('details')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Calculator className="mx-auto h-10 w-10 text-ink-muted/50" aria-hidden />
              <p className="mt-3 text-sm text-ink-muted">{t('empty')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
