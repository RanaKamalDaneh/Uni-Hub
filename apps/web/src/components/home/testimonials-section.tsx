import { Quote, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { TESTIMONIALS } from '@/content/testimonials';

/** Real student feedback from `src/content/testimonials.ts`; renders nothing until entries are added. */
export async function TestimonialsSection() {
  if (!TESTIMONIALS.length) return null;
  const t = await getTranslations('testimonials');
  return (
    <section className="container pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t('title')}</h2>
        <p className="mt-3 text-ink-muted">{t('subtitle')}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((x, i) => (
          <figure key={i} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
            <Quote className="h-7 w-7 text-brand/40" aria-hidden />
            <blockquote className="mt-3 flex-1 leading-relaxed text-ink">{x.quote}</blockquote>
            {x.rating && (
              <div className="mt-4 flex gap-0.5" aria-label={`${x.rating}/5`}>
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} className={j < x.rating! ? 'h-4 w-4 fill-amber text-amber' : 'h-4 w-4 text-line'} aria-hidden />
                ))}
              </div>
            )}
            <figcaption className="mt-4 border-t border-line pt-4 text-sm">
              <span className="font-bold text-ink">{x.name}</span>
              {(x.university || x.service) && <span className="block text-ink-muted">{[x.service, x.university].filter(Boolean).join(' · ')}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
