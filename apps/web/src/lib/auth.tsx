'use client';

import type { RoleKey } from '@unihub/shared';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, configureClientAuth } from './api';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: RoleKey[];
  permissions: string[];
  locale: 'en' | 'ar';
  avatarKey: string | null;
  providerStatus: string | null;
}

interface AuthResponse {
  accessToken: string;
  user: SessionUser;
}

interface AuthState {
  user: SessionUser | null;
  status: 'loading' | 'authenticated' | 'anonymous';
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (input: Record<string, unknown>) => Promise<SessionUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Where each role lands after login. */
export function homeFor(user: SessionUser): string {
  const staff: RoleKey[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'FINANCE'];
  if (user.roles.some((r) => staff.includes(r))) return '/admin/dashboard';
  if (user.roles.includes('PROVIDER')) return '/provider/dashboard';
  return '/student/dashboard';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const refreshing = useRef<Promise<string | null> | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthState['status']>('loading');

  const apply = useCallback((r: AuthResponse | null) => {
    tokenRef.current = r?.accessToken ?? null;
    setUser(r?.user ?? null);
    setStatus(r ? 'authenticated' : 'anonymous');
  }, []);

  // Single-flight refresh: concurrent 401s share one rotation request.
  const refresh = useCallback(async () => {
    if (!refreshing.current) {
      refreshing.current = fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'same-origin' })
        .then(async (res) => {
          if (!res.ok) {
            apply(null);
            return null;
          }
          const data = (await res.json()) as AuthResponse;
          apply(data);
          return data.accessToken;
        })
        .catch(() => {
          apply(null);
          return null;
        })
        .finally(() => {
          refreshing.current = null;
        });
    }
    return refreshing.current;
  }, [apply]);

  useEffect(() => {
    configureClientAuth(() => tokenRef.current, refresh);
    // Only attempt to restore a session when the server has indicated one may exist.
    if (document.cookie.split('; ').some((c) => c.startsWith('uh_session='))) void refresh();
    else apply(null);
  }, [refresh, apply]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      status,
      async login(email, password) {
        const r = await api<AuthResponse>('/auth/login', { method: 'POST', json: { email, password } });
        apply(r);
        return r.user;
      },
      async register(input) {
        const r = await api<AuthResponse>('/auth/register', { method: 'POST', json: input });
        apply(r);
        return r.user;
      },
      async logout() {
        await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
        apply(null);
      },
    }),
    [user, status, apply],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
