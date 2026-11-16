'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Briefcase } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Alert, FieldError, Input, Label } from '@/components/ui/form';
import { ApiError } from '@/lib/api';
import { homeFor, useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

function useErrorMessage() {
  const t = useTranslations('errors');
  return (e: unknown) => {
    if (e instanceof ApiError) {
      if (e.code === 'NETWORK') return t('network');
      if (t.has(e.code as never)) return t(e.code as never);
    }
    return t('generic');
  };
}

/** Only allow same-site relative redirects after login (prevents open redirects). */
function safeNext(next: string | null): string | null {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : null;
}

export function LoginForm() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const errorMessage = useErrorMessage();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    email: z.string().min(1, tv('required')).email(tv('email')),
    password: z.string().min(1, tv('required')),
  });
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const user = await login(values.email, values.password);
      router.push(safeNext(params.get('next')) ?? homeFor(user));
    } catch (e) {
      setFormError(errorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && <Alert>{formError}</Alert>}
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!formState.errors.email} aria-describedby="email-err" {...register('email')} />
        <FieldError id="email-err" message={formState.errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" autoComplete="current-password" dir="ltr" aria-invalid={!!formState.errors.password} aria-describedby="password-err" {...register('password')} />
        <FieldError id="password-err" message={formState.errors.password?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
        {t('submitLogin')}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        {t('noAccount')}{' '}
        <Link href="/register" className="font-semibold text-brand-fg hover:underline">
          {t('submitRegister')}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');
  const locale = useLocale();
  const { register: registerAccount } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const errorMessage = useErrorMessage();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = z.object({
    fullName: z.string().trim().min(2, tv('nameLength')).max(100, tv('nameLength')),
    email: z.string().min(1, tv('required')).email(tv('email')),
    password: z
      .string()
      .min(8, tv('passwordRules'))
      .max(128, tv('passwordRules'))
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, tv('passwordRules')),
    accountType: z.enum(['STUDENT', 'PROVIDER']),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: tv('terms') }) }),
  });
  type Values = z.infer<typeof schema>;

  const { register, handleSubmit, formState, watch } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { accountType: params.get('type') === 'provider' ? 'PROVIDER' : 'STUDENT' },
  });
  const accountType = watch('accountType');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const user = await registerAccount({ ...values, locale });
      router.push(homeFor(user));
    } catch (e) {
      setFormError(errorMessage(e));
    }
  });

  const types = [
    { value: 'STUDENT', icon: GraduationCap, title: t('asStudent'), hint: t('asStudentHint') },
    { value: 'PROVIDER', icon: Briefcase, title: t('asProvider'), hint: t('asProviderHint') },
  ] as const;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && <Alert>{formError}</Alert>}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">{t('accountType')}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((o) => (
            <label
              key={o.value}
              className={cn(
                'flex cursor-pointer gap-3 rounded-xl border p-3.5 transition',
                accountType === o.value ? 'border-brand bg-brand-light/60 ring-2 ring-brand/15' : 'border-line hover:border-brand/40',
              )}
            >
              <input type="radio" value={o.value} className="sr-only" {...register('accountType')} />
              <o.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-fg" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-ink">{o.title}</span>
                <span className="mt-0.5 block text-xs text-ink-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <Label htmlFor="fullName">{t('fullName')}</Label>
        <Input id="fullName" autoComplete="name" aria-invalid={!!formState.errors.fullName} aria-describedby="name-err" {...register('fullName')} />
        <FieldError id="name-err" message={formState.errors.fullName?.message} />
      </div>
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!formState.errors.email} aria-describedby="email-err" {...register('email')} />
        <FieldError id="email-err" message={formState.errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" autoComplete="new-password" dir="ltr" aria-invalid={!!formState.errors.password} aria-describedby="password-err password-hint" {...register('password')} />
        {formState.errors.password ? (
          <FieldError id="password-err" message={formState.errors.password.message} />
        ) : (
          <p id="password-hint" className="mt-1.5 text-xs text-ink-muted">
            {t('passwordHint')}
          </p>
        )}
      </div>
      <div>
        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-line accent-brand" {...register('acceptTerms')} />
          {t('acceptTerms')}
        </label>
        <FieldError message={formState.errors.acceptTerms?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
        {t('submitRegister')}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        {t('haveAccount')}{' '}
        <Link href="/login" className="font-semibold text-brand-fg hover:underline">
          {t('submitLogin')}
        </Link>
      </p>
    </form>
  );
}
