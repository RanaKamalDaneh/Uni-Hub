import {
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Cpu,
  Globe2,
  MessageSquareQuote,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_TONES, CategoryIcon } from '@/components/category-icon';
import { PackageSelector } from '@/components/services/package-selector';
import { ServiceCard } from '@/components/services/service-card';
import { ServiceLogo } from '@/components/services/service-logo';
import { Card, EmptyState } from '@/components/ui/card';
import { ApiError, serverApi } from '@/lib/api';
import { getWhatsAppNumber } from '@/lib/contact';
import type { ServiceDetailDto } from '@/lib/types';
import { cn, formatMoney, loc, providerText } from '@/lib/utils';

const LANGUAGE_AR: Record<string, string> = { Arabic: 'العربية', English: 'الإنجليزية', French: 'الفرنسية', German: 'الألمانية', Turkish: 'التركية' };

async function getService(slug: string) {
  try {
    return await serverApi<ServiceDetailDto>(`/services/${encodeURIComponent(slug)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, locale] = await Promise.all([getService(slug), getLocale()]);
  const title = loc(s, 'title', locale);
  const description = loc(s, 'summary', locale);
  return { title, description, alternates: { canonical: `/service/${slug}` }, openGraph: { title, description, url: `/service/${slug}` } };
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <h2 id={`${id}-h`} className="mb-4 flex items-center gap-2.5 text-xl font-bold text-ink">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand-fg">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function CheckList({ items, tone = 'teal' }: { items: string[]; tone?: 'teal' | 'blue' }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3.5 text-sm text-ink">
          <CheckCircle2 className={cn('mt-0.5 h-5 w-5 shrink-0', tone === 'teal' ? 'text-teal' : 'text-brand-fg')} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, locale, t, tc, whatsapp] = await Promise.all([
    getService(slug),
    getLocale(),
    getTranslations('services'),
    getTranslations('common'),
    getWhatsAppNumber(),
  ]);
  const ar = locale === 'ar';
  const tone = CATEGORY_TONES[s.category.color] ?? CATEGORY_TONES.blue;
  const pv = s.provider;
  const pt = providerText(pv, locale);
  const memberSince = new Intl.DateTimeFormat(ar ? 'ar-JO' : 'en-GB', { month: 'long', year: 'numeric' }).format(new Date(pv.createdAt));

  return (
    <>
      {/* ── Header ── */}
      <section className={cn('border-b border-line bg-gradient-to-b to-white', tone.hero)}>
        <div className="container py-8 lg:py-10">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-brand-fg">
              {t('breadcrumbServices')}
            </Link>
            <ChevronRight className="rtl-flip h-4 w-4" aria-hidden />
            <Link href={`/services/${s.category.slug}`} className="hover:text-brand-fg">
              {loc(s.category, 'name', locale)}
            </Link>
            {s.subcategory && (
              <>
                <ChevronRight className="rtl-flip h-4 w-4" aria-hidden />
                <Link href={`/services/${s.category.slug}?sub=${s.subcategory.slug}`} className="hover:text-brand-fg">
                  {loc(s.subcategory, 'name', locale)}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-6 flex items-start gap-4">
            <ServiceLogo slug={s.slug} category={s.category} size="lg" float className="hidden sm:inline-flex" />
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{loc(s, 'title', locale)}</h1>
              <p className="mt-2 max-w-3xl text-lg text-ink-muted">{loc(s, 'summary', locale)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <BadgeCheck className="h-4 w-4 text-teal" aria-hidden /> {pt.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-ink-muted">
                  {s.ratingCount > 0 ? (
                    <>
                      <Star className="h-4 w-4 fill-amber text-amber" aria-hidden /> {Number(s.ratingAvg).toFixed(1)} ({s.ratingCount})
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-violet" aria-hidden /> {t('newRating')}
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 text-ink-muted">
                  <Clock className="h-4 w-4" aria-hidden /> {t('deliveryTime', { days: tc('days', { count: s.deliveryDays }) })}
                </span>
                {s.startingPrice && (
                  <span className="inline-flex items-center gap-1.5 text-ink-muted">
                    {t('startingAt')} <strong className="text-ink">{formatMoney(s.startingPrice, locale, s.currency)}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ── Main column ── */}
        <div className="min-w-0 space-y-12">
          <Section id="overview" title={t('overview')} icon={<Sparkles className="h-5 w-5" />}>
            <p className="leading-relaxed text-ink/90">{loc(s, 'overview', locale)}</p>
          </Section>

          <Section id="included" title={t('included')} icon={<PackageCheck className="h-5 w-5" />}>
            <CheckList items={ar ? s.includedAr : s.includedEn} />
          </Section>

          <Section id="features" title={t('features')} icon={<ShieldCheck className="h-5 w-5" />}>
            <CheckList items={ar ? s.featuresAr : s.featuresEn} tone="blue" />
          </Section>

          {/* Packages appear inline on mobile; on desktop they live in the sticky sidebar. */}
          <div className="lg:hidden">
            <h2 className="mb-4 text-xl font-bold text-ink">{t('packages')}</h2>
            <PackageSelector packages={s.packages} currency={s.currency} serviceSlug={s.slug} serviceTitle={loc(s, 'title', locale)} whatsapp={whatsapp} />
          </div>

          <Section id="technologies" title={t('technologies')} icon={<Cpu className="h-5 w-5" />}>
            <div className="flex flex-wrap gap-2">
              {s.technologies.map((tech) => (
                <span key={tech} dir="ltr" className={cn('rounded-lg px-3 py-1.5 text-sm font-medium', tone.bg, tone.fg)}>
                  {tech}
                </span>
              ))}
            </div>
          </Section>

          <div className="grid gap-8 md:grid-cols-2">
            <Section id="requirements" title={t('requirements')} icon={<ClipboardList className="h-5 w-5" />}>
              <ol className="space-y-2.5">
                {(ar ? s.requirementsAr : s.requirementsEn).map((r, i) => (
                  <li key={r} className="flex gap-3 text-sm text-ink">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xs font-bold text-brand-fg">
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ol>
            </Section>
            <Section id="deliverables" title={t('deliverables')} icon={<PackageCheck className="h-5 w-5" />}>
              <ul className="space-y-2.5">
                {(ar ? s.deliverablesAr : s.deliverablesEn).map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-ink">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <Section id="faq" title={t('faq')} icon={<MessageSquareQuote className="h-5 w-5" />}>
            <div className="space-y-3">
              {s.faq.map((f) => (
                <details key={f.qEn} className="group rounded-2xl border border-line bg-surface p-5 open:shadow-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                    {ar ? f.qAr : f.qEn}
                    <span className="text-xl text-brand-fg transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{ar ? f.aAr : f.aEn}</p>
                </details>
              ))}
            </div>
          </Section>

          {/* ── Provider ── */}
          <Section id="provider" title={t('provider')} icon={<Briefcase className="h-5 w-5" />}>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-2xl font-bold text-brand-on">
                  {pt.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-ink">{pt.name}</h3>
                  <p className="text-sm text-ink-muted">{pt.title}</p>
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-light px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> {t('verified')}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/90">{pt.bio}</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-ink-muted">{t('servicesCount')}</dt>
                  <dd className="mt-0.5 font-bold text-ink">{pv._count.services}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t('completedOrders')}</dt>
                  <dd className="mt-0.5 font-bold text-ink">{pv.completedOrders}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t('languages')}</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-bold text-ink">
                    <Globe2 className="h-4 w-4 text-brand-fg" aria-hidden /> {pv.languages.map((l) => (ar ? (LANGUAGE_AR[l] ?? l) : l)).join(' · ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t('memberSince')}</dt>
                  <dd className="mt-0.5 font-bold text-ink">{memberSince}</dd>
                </div>
              </dl>
            </Card>
          </Section>

          <Section id="portfolio" title={t('portfolio')} icon={<Briefcase className="h-5 w-5" />}>
            {pv.portfolio.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {pv.portfolio.map((item) => (
                  <Card key={item.id} className="p-5">
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 line-clamp-3 text-sm text-ink-muted">{item.description}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title={t('portfolioEmpty')} />
            )}
          </Section>

          <Section id="reviews" title={t('reviews')} icon={<Star className="h-5 w-5" />}>
            {s.reviews.length ? (
              <div className="space-y-4">
                {s.reviews.map((r) => (
                  <Card key={r.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{r.author.fullName}</p>
                      <div className="flex gap-0.5" aria-label={`${r.rating}/5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={cn('h-4 w-4', i < r.rating ? 'fill-amber text-amber' : 'text-line')} aria-hidden />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="mt-2 text-sm text-ink/90">{r.comment}</p>}
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState icon={<Star className="h-6 w-6" />} title={t('reviewsEmpty')} />
            )}
          </Section>
        </div>

        {/* ── Sticky sidebar (desktop) ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <PackageSelector packages={s.packages} currency={s.currency} serviceSlug={s.slug} serviceTitle={loc(s, 'title', locale)} whatsapp={whatsapp} />
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-teal" aria-hidden /> {t('integrity')}
            </p>
          </div>
        </aside>
      </div>

      {/* ── Related ── */}
      {s.related.length > 0 && (
        <section className="border-t border-line bg-surface-soft py-12">
          <div className="container">
            <h2 className="mb-6 text-2xl font-bold text-ink">{t('related')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {s.related.map((r, i) => (
                <ServiceCard key={r.id} service={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
