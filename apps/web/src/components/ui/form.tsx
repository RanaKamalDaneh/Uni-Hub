import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-ink-muted/70 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-500/15 disabled:bg-surface-soft',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[110px] w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-400',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />;
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

export function Alert({ tone = 'error', children }: { tone?: 'error' | 'info' | 'success'; children: React.ReactNode }) {
  const tones = {
    error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
    info: 'border-brand/30 bg-brand-light text-brand-fg',
    success: 'border-teal-200 bg-teal-light text-teal-800 dark:border-teal-500/30 dark:text-teal-300',
  } as const;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-xl border px-4 py-3 text-sm', tones[tone])}>
      {children}
    </div>
  );
}
