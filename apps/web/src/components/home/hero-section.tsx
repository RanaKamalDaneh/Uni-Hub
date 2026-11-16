import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HeroIllustration } from './hero-illustration';

const CHIPS = [
  { label: 'Python', pos: 'top-[24%] start-[4%]', delay: '0s' },
  { label: 'React', pos: 'top-[17%] end-[6%]', delay: '0.7s' },
  { label: 'SPSS', pos: 'top-[50%] start-[2%]', delay: '1.4s' },
  { label: 'MySQL', pos: 'top-[47%] end-[1%]', delay: '2.1s' },
];

/** Homepage hero: headline with blue highlight, search, popular chips, CTAs and the desk illustration. */
export async function HeroSection() {
  const [t, locale] = await Promise.all([getTranslations('home'), getLocale()]);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const popular = t('popularTerms').split('|');

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="bg-line-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -top-32 end-[-8rem] h-[26rem] w-[26rem] rounded-full bg-brand/10 blur-3xl" />

      <div className="container relative grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        {/* ── Copy ── */}
        <div className="animate-uh-rise">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs font-medium text-ink-muted backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(59,130,246,0.8)]" aria-hidden />
            {t('heroEyebrow')}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
            {t.rich('heroTitleRich', { hl: (chunks) => <span className="text-brand">{chunks}</span> })}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{t('heroDescription')}</p>

          <form
            action="/services"
            method="get"
            role="search"
            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card transition focus-within:border-brand/60"
          >
            <label htmlFor="hero-q" className="sr-only">
              {t('search')}
            </label>
            <Search className="ms-2 h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
            <input
              id="hero-q"
              name="q"
              placeholder={t('searchPlaceholder')}
              className="h-11 w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-muted/80 focus:outline-none"
            />
            <button type="submit" className="h-11 shrink-0 rounded-xl bg-brand px-6 text-sm font-bold text-brand-on transition hover:bg-brand-deep">
              {t('search')}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-muted">{t('popularLabel')}</span>
            {popular.map((term) => (
              <Link
                key={term}
                href={`/services?q=${encodeURIComponent(term.replace(/^(مخطط|تحليل|مراجعة) /, '').replace(/ (Diagram|Analysis)$/i, ''))}`}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand hover:text-brand-fg"
              >
                {term}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-sm font-bold text-brand-on shadow-[0_10px_30px_rgba(59,130,246,0.25)] transition hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              {t('exploreServices')} <Arrow className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/#how"
              className="inline-flex h-12 items-center rounded-xl border border-line bg-surface px-6 text-sm font-bold text-ink transition hover:border-brand hover:text-brand-fg"
            >
              {t('howTitle')}
            </Link>
          </div>
        </div>

        {/* ── Illustration ── */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <HeroIllustration className="h-auto w-full" />
          {CHIPS.map((c) => (
            <span
              key={c.label}
              style={{ animationDelay: c.delay }}
              className={cn(
                'absolute animate-uh-float rounded-lg border border-line bg-surface px-3.5 py-1.5 font-mono text-xs font-medium text-ink shadow-card',
                c.pos,
              )}
              dir="ltr"
            >
              {c.label}
            </span>
          ))}
          {/* status card */}
          <div className="absolute -bottom-[4%] left-0 w-[min(250px,60%)] animate-uh-rise rounded-2xl border border-line bg-surface p-4 shadow-lift [animation-delay:300ms]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-ink-muted">{t('illusTag')}</span>
              <span className="font-semibold text-brand-fg">{t('illusStatus')}</span>
            </div>
            <p className="mt-2 text-sm font-bold text-ink">{t('illusTask')}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-soft">
              <div className="h-full w-[68%] origin-left animate-uh-grow rounded-full bg-brand rtl:ms-auto rtl:origin-right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
