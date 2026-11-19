import Link from 'next/link';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * Naajah mark: a rising checkmark (success) whose tip carries a graduation cap,
 * on a blue gradient tile. Pure SVG so it stays crisp at any size (also used as the favicon).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="naajah-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="naajah-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#naajah-tile)" />
      <path d="M0 11a11 11 0 0 1 11-11h18a11 11 0 0 1 11 11v5C27 22 13 22 0 17z" fill="url(#naajah-shine)" />
      {/* rising checkmark */}
      <path d="M8.5 22.5 15.5 29.5 26 16" fill="none" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* graduation cap resting on the tip */}
      <path d="M27.5 5.5 36 9.6 27.5 13.7 19 9.6z" fill="#fff" />
      <path d="M22.6 11.4v3.2c0 1.3 2.2 2.3 4.9 2.3s4.9-1 4.9-2.3v-3.2l-4.9 2.3z" fill="#fff" fillOpacity="0.9" />
      <path d="M36 9.6v5.6" stroke="#FDE68A" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="36" cy="16" r="1.4" fill="#FDE68A" />
    </svg>
  );
}

/** Mark + bilingual wordmark: the current language's name large, the other one small beneath. */
export function Logo({ className }: { className?: string }) {
  const ar = useLocale() === 'ar';
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label={ar ? 'نجاح' : 'Naajah'}>
      <LogoMark className="h-10 w-10 shrink-0 drop-shadow-[0_6px_14px_rgba(37,99,235,0.35)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-extrabold tracking-tight text-ink', ar ? 'text-2xl' : 'text-xl')}>
          {ar ? (
            'نجاح'
          ) : (
            <>
              Naa<span className="text-brand-fg">jah</span>
            </>
          )}
        </span>
        <span className={cn('mt-1 font-semibold text-ink-muted', ar ? 'text-[11px] tracking-[0.2em]' : 'text-xs')}>
          {ar ? 'NAAJAH' : 'نجاح'}
        </span>
      </span>
    </Link>
  );
}
