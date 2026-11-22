'use client';

import { ExternalLink, Loader2, LogOut, Save, Search, ShieldAlert } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { CategoryDto } from '@/lib/types';
import { cn, loc } from '@/lib/utils';

interface AdminPackage {
  id: string;
  tier: string;
  nameEn: string;
  nameAr: string;
  price: string;
  deliveryDays: number;
  isActive: boolean;
}
interface AdminService {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  category: { slug: string; nameEn: string; nameAr: string };
  packages: AdminPackage[];
}
type Draft = { price: string; deliveryDays: string; isActive: boolean };

const card = 'rounded-2xl border border-line bg-surface p-6';
const input =
  'h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10';

function ContactForm() {
  const t = useTranslations('admin');
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    api<{ whatsapp: string }>('/admin/settings/contact')
      .then((r) => setValue(r.whatsapp))
      .catch(() => undefined);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState('saving');
    try {
      await api('/admin/settings/contact', { method: 'PATCH', json: { whatsapp: value.replace(/\D/g, '') } });
      setState('saved');
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={save} className={card}>
      <h2 className="text-lg font-bold text-ink">{t('contactTitle')}</h2>
      <p className="mt-1 text-sm text-ink-muted">{t('contactHint')}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setState('idle');
          }}
          inputMode="numeric"
          dir="ltr"
          placeholder="962791234567"
          aria-label={t('contactTitle')}
          className={cn(input, 'w-64 font-mono')}
        />
        <button type="submit" disabled={state === 'saving'} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold text-brand-on hover:bg-brand-deep disabled:opacity-50">
          {state === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} {t('save')}
        </button>
        {state === 'saved' && <span className="text-sm font-semibold text-green-600 dark:text-green-400">{t('saved')}</span>}
        {state === 'error' && <span className="text-sm font-semibold text-red-600 dark:text-red-400">{t('saveFailed')}</span>}
      </div>
    </form>
  );
}

function PriceTable() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [services, setServices] = useState<AdminService[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [rowState, setRowState] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

  useEffect(() => {
    api<CategoryDto[]>('/categories').then(setCategories).catch(() => undefined);
  }, []);

  const load = useCallback(() => {
    setServices(null);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    api<AdminService[]>(`/admin/services?${params}`)
      .then((list) => {
        setServices(list);
        const d: Record<string, Draft> = {};
        for (const s of list) for (const p of s.packages) d[p.id] = { price: String(Number(p.price)), deliveryDays: String(p.deliveryDays), isActive: p.isActive };
        setDrafts(d);
        setRowState({});
      })
      .catch(() => setServices([]));
  }, [category]);
  useEffect(load, [load]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (services ?? []).filter((s) => !needle || s.titleEn.toLowerCase().includes(needle) || s.titleAr.includes(needle));
  }, [services, q]);

  const dirty = (s: AdminService) =>
    s.packages.some((p) => {
      const d = drafts[p.id];
      return d && (Number(d.price) !== Number(p.price) || Number(d.deliveryDays) !== p.deliveryDays || d.isActive !== p.isActive);
    });

  async function saveService(s: AdminService) {
    setRowState((r) => ({ ...r, [s.id]: 'saving' }));
    try {
      for (const p of s.packages) {
        const d = drafts[p.id];
        if (!d) continue;
        const body = { price: Number(d.price), deliveryDays: Number(d.deliveryDays), isActive: d.isActive };
        if (body.price === Number(p.price) && body.deliveryDays === p.deliveryDays && body.isActive === p.isActive) continue;
        await api(`/admin/packages/${p.id}`, { method: 'PATCH', json: body });
        Object.assign(p, { price: String(body.price), deliveryDays: body.deliveryDays, isActive: body.isActive });
      }
      setRowState((r) => ({ ...r, [s.id]: 'saved' }));
    } catch {
      setRowState((r) => ({ ...r, [s.id]: 'error' }));
    }
  }

  const setDraft = (id: string, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  return (
    <section className={card}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{t('pricesTitle')}</h2>
          {services && <p className="mt-1 text-sm text-ink-muted">{t('count', { count: visible.length })}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={input} aria-label={t('allCategories')}>
            <option value="">{t('allCategories')}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {loc(c, 'name', locale)}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} className={cn(input, 'w-60 ps-9')} />
          </div>
        </div>
      </div>

      {!services ? (
        <Loader2 className="mx-auto mt-10 h-7 w-7 animate-spin text-brand-fg" aria-hidden />
      ) : visible.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-muted">{t('noResults')}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {visible.map((s) => (
            <li key={s.id} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <Link href={`/service/${s.slug}`} target="_blank" className="inline-flex items-center gap-1.5 font-bold text-ink hover:text-brand-fg">
                  {loc(s, 'title', locale)} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <p className="text-xs text-ink-muted">{loc(s.category, 'name', locale)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {s.packages.map((p) => {
                  const d = drafts[p.id];
                  if (!d) return null;
                  return (
                    <fieldset key={p.id} className={cn('flex items-center gap-1.5 rounded-xl border border-line p-1.5', !d.isActive && 'opacity-50')}>
                      <legend className="sr-only">{loc(p, 'name', locale)}</legend>
                      <label className="flex items-center gap-1 ps-1 text-xs font-semibold text-ink-muted">
                        <input type="checkbox" checked={d.isActive} onChange={(e) => setDraft(p.id, { isActive: e.target.checked })} title={t('active')} />
                        {loc(p, 'name', locale)}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={d.price}
                        onChange={(e) => setDraft(p.id, { price: e.target.value })}
                        aria-label={`${loc(p, 'name', locale)} – ${t('price')}`}
                        className={cn(input, 'h-8 w-20 px-2')}
                        dir="ltr"
                      />
                      <input
                        type="number"
                        min={1}
                        value={d.deliveryDays}
                        onChange={(e) => setDraft(p.id, { deliveryDays: e.target.value })}
                        aria-label={`${loc(p, 'name', locale)} – ${t('days')}`}
                        title={t('days')}
                        className={cn(input, 'h-8 w-14 px-2')}
                        dir="ltr"
                      />
                    </fieldset>
                  );
                })}
                <button
                  type="button"
                  onClick={() => saveService(s)}
                  disabled={!dirty(s) || rowState[s.id] === 'saving'}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-bold text-brand-on hover:bg-brand-deep disabled:opacity-30"
                >
                  {rowState[s.id] === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Save className="h-3.5 w-3.5" aria-hidden />}
                  {t('save')}
                </button>
                {rowState[s.id] === 'saved' && !dirty(s) && <span className="text-xs font-semibold text-green-600 dark:text-green-400">{t('saved')}</span>}
                {rowState[s.id] === 'error' && <span className="text-xs font-semibold text-red-600 dark:text-red-400">{t('saveFailed')}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-ink-muted">
        {t('price')} · {t('days')}
      </p>
    </section>
  );
}

/** Admin panel: WhatsApp number and service package prices. Server-side permissions are enforced by the API. */
export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const { user, status, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'anonymous') router.replace('/login?next=/admin/dashboard');
  }, [status, router]);

  const allowed = !!user && (user.roles.includes('SUPER_ADMIN') || (user.permissions.includes('settings.manage') && user.permissions.includes('services.moderate')));

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-surface">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/" className="hidden h-9 items-center rounded-lg px-3 text-sm font-semibold text-ink-muted hover:text-ink sm:inline-flex">
              {t('viewSite')}
            </Link>
            {user && (
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:border-brand"
              >
                <LogOut className="rtl-flip h-4 w-4" aria-hidden /> {t('logout')}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="container py-10">
        {status !== 'authenticated' ? (
          <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-brand-fg" aria-hidden />
        ) : !allowed ? (
          <div className={cn(card, 'mx-auto max-w-md text-center')}>
            <ShieldAlert className="mx-auto h-10 w-10 text-red-500" aria-hidden />
            <p className="mt-3 font-semibold text-ink">{t('forbidden')}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-ink">{t('title')}</h1>
              <p className="mt-2 text-ink-muted">{t('subtitle')}</p>
            </div>
            <ContactForm />
            <PriceTable />
          </div>
        )}
      </main>
    </div>
  );
}
