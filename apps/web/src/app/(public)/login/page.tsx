import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/auth-forms';
import { Card } from '@/components/ui/card';

export async function generateMetadata() {
  const t = await getTranslations('nav');
  return { title: t('login') };
}

export default async function LoginPage() {
  const t = await getTranslations('auth');
  return (
    <div className="bg-gradient-to-b from-brand-light/60 to-white py-14">
      <div className="container max-w-md">
        <Card className="p-7 sm:p-8">
          <h1 className="text-2xl font-bold text-ink">{t('loginTitle')}</h1>
          <p className="mb-7 mt-1.5 text-sm text-ink-muted">{t('loginSubtitle')}</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
