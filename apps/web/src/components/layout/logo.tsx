import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Blue square mark with the "U" monogram, followed by the UniHub wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2.5 font-bold', className)} aria-label="UniHub">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-extrabold text-brand-on shadow-[0_6px_18px_rgba(59,130,246,0.35)]">
        U
      </span>
      <span dir="ltr" className="text-xl tracking-tight text-ink">
        Uni<span className="text-brand-fg">Hub</span>
      </span>
    </Link>
  );
}
