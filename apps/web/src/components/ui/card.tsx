import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-line bg-surface shadow-card', className)} {...props} />;
}

export function Badge({
  className,
  tone = 'blue',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: 'blue' | 'violet' | 'teal' | 'orange' | 'gray' }) {
  const tones = {
    blue: 'bg-brand-light text-brand-fg',
    violet: 'bg-violet-light text-violet-700 dark:text-violet-300',
    teal: 'bg-teal-light text-teal-800 dark:text-teal-300',
    orange: 'bg-brand-light text-brand-fg',
    gray: 'bg-surface-soft text-ink-muted',
  } as const;
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)}
      {...props}
    />
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, action }: { icon?: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface-soft px-6 py-12 text-center">
      {icon && <div className="text-brand-fg">{icon}</div>}
      <p className="max-w-md text-sm text-ink-muted">{title}</p>
      {action}
    </div>
  );
}
