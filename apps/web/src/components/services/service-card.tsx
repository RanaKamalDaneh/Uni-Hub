import { BadgeCheck, Clock, Star } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CATEGORY_TONES } from '@/components/category-icon';
import type { ServiceCardDto } from '@/lib/types';
import { cn, formatMoney, loc, providerText } from '@/lib/utils';
import { ServiceLogo } from './service-logo';

/**
 * Service card with the technology logo, a staggered entrance (`index` sets the delay),
 * and hover motion: the card lifts, the logo tilts, a soft colour glow and a light sweep appear.
 */
export async function ServiceCard({ service: s, index = 0 }: { service: ServiceCardDto; index?: number }) {
  const locale = await getLocale();
  const tc = await getTranslations('common');
  const ts = await getTranslations('services');
  const tone = CATEGORY_TONES[s.category.color] ?? CATEGORY_TONES.blue;

  return (
    <Link
      href={`/service/${s.slug}`}
      style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
      className={cn(
        'group relative flex h-full animate-uh-rise flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 ring-4 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift',
        tone.ring,
      )}
    >
      {/* Soft category-coloured glow behind the logo */}
      <span
        aria-hidden
        className={cn('pointer-events-none absolute -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70 start-[-3rem]', tone.bg)}
      />
      {/* Light sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:animate-uh-shine group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <ServiceLogo slug={s.slug} category={s.category} />
        {s.ratingCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
            <Star className="h-4 w-4 fill-amber text-amber" aria-hidden />
            {Number(s.ratingAvg).toFixed(1)}
            <span className="font-normal text-ink-muted">({s.ratingCount})</span>
          </span>
        ) : (
          <span className="rounded-full bg-surface-soft px-2 py-0.5 text-xs font-medium text-ink-muted">{ts('newRating')}</span>
        )}
      </div>

      <p className={cn('relative mt-4 text-xs font-semibold', tone.fg)}>{loc(s.category, 'name', locale)}</p>
      <h3 className="relative mt-1 font-semibold leading-snug text-ink transition-colors group-hover:text-brand-fg">{loc(s, 'title', locale)}</h3>
      <p className="relative mt-1.5 line-clamp-2 text-sm text-ink-muted">{loc(s, 'summary', locale)}</p>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {s.technologies.slice(0, 3).map((tech) => (
          <span key={tech} dir="ltr" className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4" />
      <div className="relative flex items-end justify-between gap-2 border-t border-line pt-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-xs text-ink-muted">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-teal" aria-hidden />
            <span className="truncate">{providerText(s.provider, locale).name}</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {tc('days', { count: s.deliveryDays })}
          </p>
        </div>
        {s.startingPrice && (
          <div className="text-end">
            <p className="text-[11px] text-ink-muted">{tc('from')}</p>
            <p className="text-lg font-bold leading-tight text-ink">{formatMoney(s.startingPrice, locale, s.currency)}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
