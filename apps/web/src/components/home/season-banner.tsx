import { CalendarClock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Season = 'start' | 'mid' | 'final' | 'summer';

/** Jordanian academic calendar by month (0 = January). */
const BY_MONTH: Season[] = ['final', 'start', 'mid', 'mid', 'final', 'final', 'summer', 'start', 'start', 'mid', 'mid', 'final'];
const LINK: Record<Season, string> = {
  start: '/services/tutoring',
  mid: '/services',
  final: '/services/graduation-projects',
  summer: '/services/tutoring',
};

/** A thin strip whose message follows the university season (finals, graduation projects, summer…). */
export async function SeasonBanner() {
  const t = await getTranslations('season');
  const season = BY_MONTH[new Date().getMonth()];
  return (
    <div className="border-b border-brand/20 bg-brand-light">
      <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-sm">
        <CalendarClock className="h-4 w-4 shrink-0 text-brand-fg" aria-hidden />
        <span className="font-medium text-ink">{t(season)}</span>
        <Link href={LINK[season]} className="font-bold text-brand-fg underline-offset-4 hover:underline">
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
