'use client';

import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, Wand2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { CategoryIcon } from '@/components/category-icon';
import { ServiceLogo } from '@/components/services/service-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { whatsappLink } from '@/lib/contact';
import type { Paged, ServiceCardDto } from '@/lib/types';
import { cn, loc } from '@/lib/utils';

export interface WizardCategory {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

/** Max delivery days for each deadline option (last option = no limit). */
const DEADLINE_DAYS = [3, 7, 14, undefined];
const TOTAL = 4;

/**
 * "What do you need?" assistant: four quick steps, then the closest matching services from the API
 * (which never returns an empty list) and a WhatsApp message pre-filled with the student's answers.
 */
export function RequestWizard({ categories, whatsapp }: { categories: WizardCategory[]; whatsapp: string | null }) {
  const t = useTranslations('wizard');
  const locale = useLocale();
  const Next = locale === 'ar' ? ArrowLeft : ArrowRight;
  const Prev = locale === 'ar' ? ArrowRight : ArrowLeft;
  const levels = t('levels').split('|');
  const deadlines = t('deadlines').split('|');

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<WizardCategory | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<ServiceCardDto[] | null>(null);
  const [loading, setLoading] = useState(false);

  const canNext = (step === 1 && category) || (step === 2 && level !== null) || (step === 3 && deadline !== null) || step === 4;

  async function finish() {
    if (!category) return;
    setLoading(true);
    const params = new URLSearchParams({ category: category.slug, limit: '3' });
    if (topic.trim()) params.set('q', topic.trim());
    const days = deadline !== null ? DEADLINE_DAYS[deadline] : undefined;
    if (days) params.set('maxDays', String(days));
    try {
      const res = await fetch(`/api/v1/services?${params}`);
      const data = (await res.json()) as Paged<ServiceCardDto>;
      setResults(data.items ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setStep(5);
    }
  }

  function reset() {
    setStep(1);
    setCategory(null);
    setLevel(null);
    setDeadline(null);
    setTopic('');
    setResults(null);
  }

  const message =
    category && level !== null && deadline !== null
      ? t('message', {
          category: category.name,
          level: levels[level],
          deadline: deadlines[deadline],
          topic: topic.trim() ? t('topicLine', { topic: topic.trim() }) : '',
        })
      : '';

  const option = (selected: boolean) =>
    cn(
      'flex items-center gap-3 rounded-xl border p-4 text-start text-sm font-semibold transition',
      selected ? 'border-brand bg-brand-light text-ink ring-2 ring-brand/30' : 'border-line bg-surface text-ink hover:border-brand/50',
    );

  return (
    <section id="wizard" className="container scroll-mt-24 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-24 end-[-6rem] h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* intro */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-fg">
              <Wand2 className="h-3.5 w-3.5" aria-hidden /> {t('eyebrow')}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{t('title')}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{t('subtitle')}</p>
            {step <= TOTAL && (
              <div className="mt-8">
                <p className="text-xs font-semibold text-ink-muted">{t('step', { n: step, total: TOTAL })}</p>
                <div className="mt-2 flex gap-1.5">
                  {Array.from({ length: TOTAL }, (_, i) => (
                    <span key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-500', i < step ? 'bg-brand' : 'bg-surface-soft')} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* steps */}
          <div key={step} className="animate-uh-rise" aria-live="polite">
            {step === 1 && (
              <fieldset>
                <legend className="mb-4 text-lg font-bold text-ink">{t('q1')}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((c) => (
                    <button key={c.slug} type="button" aria-pressed={category?.slug === c.slug} onClick={() => setCategory(c)} className={option(category?.slug === c.slug)}>
                      <CategoryIcon icon={c.icon} color={c.color} className="h-9 w-9 shrink-0 rounded-xl [&_svg]:h-5 [&_svg]:w-5" />
                      {c.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {step === 2 && (
              <fieldset>
                <legend className="mb-4 text-lg font-bold text-ink">{t('q2')}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {levels.map((l, i) => (
                    <button key={l} type="button" aria-pressed={level === i} onClick={() => setLevel(i)} className={option(level === i)}>
                      {level === i && <Check className="h-4 w-4 text-brand-fg" aria-hidden />} {l}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {step === 3 && (
              <fieldset>
                <legend className="mb-4 text-lg font-bold text-ink">{t('q3')}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {deadlines.map((d, i) => (
                    <button key={d} type="button" aria-pressed={deadline === i} onClick={() => setDeadline(i)} className={option(deadline === i)}>
                      {deadline === i && <Check className="h-4 w-4 text-brand-fg" aria-hidden />} {d}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {step === 4 && (
              <div>
                <label htmlFor="wiz-topic" className="mb-4 block text-lg font-bold text-ink">
                  {t('q4')}
                </label>
                <input
                  id="wiz-topic"
                  value={topic}
                  maxLength={100}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && finish()}
                  placeholder={t('q4Placeholder')}
                  className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted/80 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
                />
              </div>
            )}
            {step === 5 && results && (
              <div>
                <h3 className="mb-4 text-lg font-bold text-ink">{t('resultsTitle')}</h3>
                <ul className="grid gap-3">
                  {results.map((s) => (
                    <li key={s.id}>
                      <Link href={`/service/${s.slug}`} className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-3 transition hover:border-brand/50 hover:shadow-card">
                        <ServiceLogo slug={s.slug} category={s.category} size="md" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink group-hover:text-brand-fg">{loc(s, 'title', locale)}</span>
                          <span className="block truncate text-xs text-ink-muted">{loc(s, 'summary', locale)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  {whatsapp ? (
                    <a
                      href={whatsappLink(whatsapp, message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1EBE5A]"
                    >
                      <WhatsAppIcon className="h-5 w-5" /> {t('sendWhatsapp')}
                    </a>
                  ) : (
                    category && (
                      <Link href={`/services/${category.slug}`} className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-on transition hover:bg-brand-deep">
                        {t('browseCategory')} <Next className="h-4 w-4" aria-hidden />
                      </Link>
                    )
                  )}
                  <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-5 text-sm font-bold text-ink transition hover:border-brand">
                    <RotateCcw className="h-4 w-4" aria-hidden /> {t('restart')}
                  </button>
                </div>
              </div>
            )}

            {step <= TOTAL && (
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-ink-muted transition hover:text-ink">
                    <Prev className="h-4 w-4" aria-hidden /> {t('back')}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  disabled={!canNext || loading}
                  onClick={() => (step === TOTAL ? finish() : setStep((s) => s + 1))}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-on transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {t('loading')}
                    </>
                  ) : (
                    <>
                      {step === TOTAL ? t('showResults') : t('next')} <Next className="h-4 w-4" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
