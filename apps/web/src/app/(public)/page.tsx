import { ArrowLeft, ArrowRight, MessageCircleMore } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { CategoryIcon } from '@/components/category-icon';
import { HeroSection } from '@/components/home/hero-section';
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
  { logo: 'jupyter', name: 'Jupyter' },
];

function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const [locale, t, tf, tc, categories, whatsapp] = await Promise.all([
    getLocale(),
    getTranslations('home'),
    getTranslations('faq'),
    getTranslations('contact'),
    serverApiSafe<CategoryDto[]>('/categories'),
    getWhatsAppNumber(),
  ]);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const steps = [1, 2, 3].map((n) => ({ n: `0${n}`, title: t(`how${n}Title`), text: t(`how${n}Text`) }));

  return (
    <>
      <HeroSection />

      {/* ── Technologies strip ── */}
      <section className="border-b border-line">
        <div className="container flex flex-col items-center gap-5 py-7 lg:flex-row lg:gap-10">
          <p className="shrink-0 text-sm text-ink-muted">{t('techTitle')}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
            {TECH.map((x) => (
              <li key={x.name} className="group flex items-center gap-2 text-base font-bold text-ink-muted transition hover:text-ink" dir="ltr">
                <img src={`/logos/${x.logo}.svg`} alt="" className="h-6 w-6 opacity-60 grayscale transition group-hover:opacity-100 group-hover:grayscale-0 dark:brightness-0 dark:invert dark:group-hover:brightness-100 dark:group-hover:invert-0" />
                {x.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Service areas ── */}
      <section className="container py-20">
        <SectionTitle
          title={t('areasTitle')}
          subtitle={t('areasSubtitle')}
          action={
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink transition hover:text-brand-fg">
              {t('viewAllCategories')} <Arrow className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        {categories?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/services/${c.slug}`}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group flex animate-uh-rise flex-col rounded-2xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift"
              >
                <CategoryIcon
                  icon={c.icon}
                  color={c.color}
                  className="h-12 w-12 border border-line transition duration-300 group-hover:-rotate-6 group-hover:scale-110"
                />
                <h3 className="mt-6 text-xl font-bold text-ink">{loc(c, 'name', locale)}</h3>
                <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">{loc(c, 'description', locale)}</p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
                  <span className="text-ink-muted">{t('servicesCount', { count: c.serviceCount })}</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-ink transition group-hover:text-brand-fg">
                    {t('explore')} <Arrow className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title={(await getTranslations('errors'))('loadFailed')} />
        )}
      </section>

      {/* ── How we work ── */}
      <section id="how" className="container scroll-mt-24 pb-20">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink">{t('howTitle')}</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="font-mono text-sm font-bold text-brand-fg">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="container scroll-mt-24 pb-20">
        <SectionTitle title={t('faqTitle')} />
        <div className="grid gap-3 lg:grid-cols-2">
          {[1, 2, 3, 5].map((n) => (
            <details key={n} className="group h-fit rounded-2xl border border-line bg-surface p-5 transition open:border-brand/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {tf(`q${n}`)}
                <span className="text-xl text-brand-fg transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{tf(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="container scroll-mt-24 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-brand-light px-8 py-14 text-center">
          <div aria-hidden className="bg-line-grid pointer-events-none absolute inset-0" />
          <MessageCircleMore className="relative mx-auto h-10 w-10 text-brand-fg" aria-hidden />
          <h2 className="relative mt-4 text-3xl font-extrabold text-ink">{t('ctaTitle')}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-ink-muted">{t('ctaText')}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {whatsapp ? (
              <a
                href={whatsappLink(whatsapp, tc('general'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#25D366] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1EBE5A]"
              >
                <WhatsAppIcon className="h-5 w-5" /> {tc('floating')}
              </a>
            ) : (
              <Link href="/services" className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-sm font-bold text-brand-on transition hover:bg-brand-deep">
                {t('exploreServices')} <Arrow className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
