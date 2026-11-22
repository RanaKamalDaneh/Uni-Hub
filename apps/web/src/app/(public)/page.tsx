import { ArrowLeft, ArrowRight, MessageCircleMore } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CategoryIcon } from '@/components/category-icon';
import { HeroSection } from '@/components/home/hero-section';
import { RequestWizard } from '@/components/home/request-wizard';
import { SeasonBanner } from '@/components/home/season-banner';
import { StatsCounter } from '@/components/home/stats-counter';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { EmptyState } from '@/components/ui/card';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { serverApiSafe } from '@/lib/api';
import { getWhatsAppNumber, whatsappLink } from '@/lib/contact';
import type { CategoryDto } from '@/lib/types';
import { loc } from '@/lib/utils';

const TECH = [
  { logo: 'python', name: 'Python' },
  { logo: 'react', name: 'React' },
  { logo: 'mysql', name: 'MySQL' },
  { logo: 'oracle', name: 'Oracle' },
  { logo: 'spss', name: 'IBM SPSS' },
  { logo: 'flutter', name: 'Flutter' },
  { logo: 'pytorch', name: 'PyTorch' },
  { logo: 'tensorflow', name: 'TensorFlow' },
  { logo: 'java', name: 'Java' },
  { logo: 'jupyter', name: 'Jupyter' },
  { logo: 'pandas', name: 'pandas' },
  { logo: 'nextjs', name: 'Next.js' },
  { logo: 'cplusplus', name: 'C++' },
  { logo: 'figma', name: 'Figma' },
  { logo: 'latex', name: 'LaTeX' },
  { logo: 'android', name: 'Android' },
];

/** Accent colour per category tone (hex for borders/glows, RGB triplet for the spotlight). */
const ACCENTS: Record<string, { hex: string; rgb: string }> = {
  blue: { hex: '#3b82f6', rgb: '59 130 246' },
  violet: { hex: '#8b5cf6', rgb: '139 92 246' },
  teal: { hex: '#14b8a6', rgb: '20 184 166' },
  indigo: { hex: '#6366f1', rgb: '99 102 241' },
  purple: { hex: '#a855f7', rgb: '168 85 247' },
  royal: { hex: '#2563eb', rgb: '37 99 235' },
  orange: { hex: '#f59e0b', rgb: '245 158 11' },
  green: { hex: '#22c55e', rgb: '34 197 94' },
  cyan: { hex: '#06b6d4', rgb: '6 182 212' },
};

function SectionTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div data-reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-fg">{eyebrow}</p>}
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        <span aria-hidden className="uh-gradient-bg mt-4 block h-1 w-16 rounded-full" />
        {subtitle && <p className="mt-4 max-w-2xl text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const [locale, t, tf, tc, ts, categories, whatsapp] = await Promise.all([
    getLocale(),
    getTranslations('home'),
    getTranslations('faq'),
    getTranslations('contact'),
    getTranslations('stats'),
    serverApiSafe<CategoryDto[]>('/categories'),
    getWhatsAppNumber(),
  ]);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const cats = categories ?? [];
  const wizardCats = cats.map((c) => ({ slug: c.slug, name: loc(c, 'name', locale), icon: c.icon, color: c.color }));
  const stats = [
    { value: cats.reduce((n, c) => n + c.serviceCount, 0), label: ts('services'), suffix: '+' },
    { value: cats.length, label: ts('categories') },
    { value: 3, label: ts('packages') },
    { value: 2, label: ts('languages') },
  ];
  const steps = [1, 2, 3].map((n) => ({ n: `0${n}`, title: t(`how${n}Title`), text: t(`how${n}Text`) }));

  return (
    <>
      <SeasonBanner />
      <HeroSection />

      {/* ── Technologies marquee ── */}
      <section className="border-b border-line bg-surface-soft/60">
        <div className="container flex flex-col items-center gap-4 py-7 lg:flex-row lg:gap-10">
          <p className="shrink-0 text-sm font-semibold text-ink-muted">{t('techTitle')}</p>
          <div className="uh-marquee-wrap uh-marquee-mask w-full overflow-hidden">
            <ul className="uh-marquee flex w-max items-center gap-4">
              {[...TECH, ...TECH].map((x, i) => (
                <li
                  key={i}
                  aria-hidden={i >= TECH.length}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink shadow-card transition hover:-translate-y-1 hover:border-brand/50"
                  dir="ltr"
                >
                  <img src={`/logos/${x.logo}.svg`} alt="" className="h-6 w-6 dark:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.6))]" />
                  {x.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {cats.length > 0 && <StatsCounter items={stats} />}

      {/* ── Service areas ── */}
      <section className="relative overflow-hidden pb-20 pt-4">
        <div aria-hidden className="uh-blob -start-32 top-20 h-80 w-80 bg-blue-500" />
        <div aria-hidden className="uh-blob -end-24 bottom-10 h-96 w-96 bg-violet-500 [animation-delay:-6s]" />
        <div aria-hidden className="uh-blob start-1/3 top-1/2 h-72 w-72 bg-cyan-400 [animation-delay:-11s]" />
        <div className="container relative">
          <SectionTitle
            title={t('areasTitle')}
            subtitle={t('areasSubtitle')}
            action={
              <Link href="/services" className="group inline-flex items-center gap-1.5 text-sm font-bold text-ink transition hover:text-brand-fg">
                {t('viewAllCategories')} <Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
              </Link>
            }
          />
          {cats.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((c, i) => {
                const a = ACCENTS[c.color] ?? ACCENTS.blue;
                return (
                  <div key={c.id} data-reveal style={{ '--d': `${(i % 3) * 110}ms` } as React.CSSProperties}>
                    <Link
                      href={`/services/${c.slug}`}
                      style={{ '--accent': a.hex, '--accent-rgb': a.rgb } as React.CSSProperties}
                      className="uh-glow-card uh-spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
                    >
                      {/* colour wash that grows on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:scale-[2.2] group-hover:opacity-30"
                        style={{ background: a.hex }}
                      />
                      <CategoryIcon
                        icon={c.icon}
                        color={c.color}
                        className="relative h-14 w-14 transition duration-500 group-hover:-rotate-[8deg] group-hover:scale-110 [&_svg]:h-7 [&_svg]:w-7"
                      />
                      <h3 className="relative mt-6 text-xl font-bold text-ink">{loc(c, 'name', locale)}</h3>
                      <p className="relative mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">{loc(c, 'description', locale)}</p>
                      <div className="relative mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
                        <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ color: a.hex, background: `rgb(${a.rgb} / 0.12)` }}>
                          {t('servicesCount', { count: c.serviceCount })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-ink transition group-hover:text-brand-fg">
                          {t('explore')} <Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                        </span>
                      </div>
                      {/* accent bar */}
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition duration-500 group-hover:scale-x-100 rtl:origin-right" style={{ background: a.hex }} />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title={(await getTranslations('errors'))('loadFailed')} />
          )}
        </div>
      </section>

      {wizardCats.length > 0 && (
        <div data-reveal>
          <RequestWizard categories={wizardCats} whatsapp={whatsapp} />
        </div>
      )}
      <TestimonialsSection />

      {/* ── How we work ── */}
      <section id="how" className="container scroll-mt-24 pb-20">
        <div data-reveal="zoom" className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-12">
          <div aria-hidden className="uh-blob -end-20 -top-20 h-64 w-64 bg-blue-500" />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-ink">
            <span className="uh-gradient-text">{t('howTitle')}</span>
          </h2>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
            {/* connecting line */}
            <span aria-hidden className="absolute inset-x-[16%] top-7 hidden h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-40 md:block" />
            {steps.map((s, i) => (
              <li key={s.n} data-reveal style={{ '--d': `${i * 160}ms` } as React.CSSProperties} className="relative text-center">
                <span
                  className="uh-gradient-bg uh-pulse relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-lg font-extrabold text-white shadow-lift"
                  style={{ animationDelay: `${i * 0.7}s` }}
                >
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="container scroll-mt-24 pb-20">
        <SectionTitle title={t('faqTitle')} />
        <div className="grid gap-3 lg:grid-cols-2">
          {[1, 2, 3, 5].map((n, i) => (
            <details
              key={n}
              data-reveal
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className="group h-fit rounded-2xl border border-line bg-surface p-5 transition hover:border-brand/40 open:border-brand/50 open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {tf(`q${n}`)}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-xl text-brand-fg transition duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-brand-on" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 animate-uh-rise text-sm leading-relaxed text-ink-muted">{tf(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="container scroll-mt-24 pb-24">
        <div data-reveal="zoom" className="uh-gradient-bg relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-lift">
          <div aria-hidden className="bg-line-grid pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden className="absolute -start-10 -top-10 h-40 w-40 animate-uh-float rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-12 -end-8 h-52 w-52 animate-uh-float rounded-full bg-white/10 [animation-delay:1.5s]" />
          <MessageCircleMore className="relative mx-auto h-12 w-12 animate-uh-float" aria-hidden />
          <h2 className="relative mt-4 text-3xl font-extrabold sm:text-4xl">{t('ctaTitle')}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">{t('ctaText')}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {whatsapp ? (
              <a
                href={whatsappLink(whatsapp, tc('general'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#25D366] px-7 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-[#1EBE5A]"
              >
                <WhatsAppIcon className="h-5 w-5" /> {tc('floating')}
              </a>
            ) : (
              <Link href="/services" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-blue-700 shadow-lift transition hover:-translate-y-0.5">
                {t('exploreServices')} <Arrow className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
