/**
 * API access.
 * - Server components call the API directly (API_INTERNAL_URL).
 * - The browser calls the same-origin proxy `/api/v1/*` (see next.config.ts) with the in-memory access token.
 */

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = res.status === 429 ? 'TOO_MANY_REQUESTS' : (body.code ?? 'ERROR');
    throw new ApiError(res.status, code, body.message ?? res.statusText, body.details);
  }
  return body as T;
}

/**
 * Server-side fetch for public data. Catalog data is NOT cached by default so admin changes
 * (removed services, new prices) appear immediately; pass `revalidate` (seconds) to cache.
 */
export async function serverApi<T>(path: string, opts: { revalidate?: number } = {}): Promise<T> {
  const base = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
  const headers: Record<string, string> = {};
  if (process.env.INTERNAL_API_KEY) headers['x-internal-key'] = process.env.INTERNAL_API_KEY;
  const init: RequestInit = opts.revalidate
    ? { headers, next: { revalidate: opts.revalidate } }
    : { headers, cache: 'no-store' };
  // Read-only GETs are safe to retry: one retry absorbs transient socket errors (e.g. a reused
  // keep-alive connection closed by the API, or the API restarting during development).
  // Never hang the page: hosts such as Netlify kill a function that sends nothing for ~10s
  // ("Inactivity Timeout"), so give up early and let the page show its friendly error instead.
  const timeoutMs = Number(process.env.API_TIMEOUT_MS ?? 7000);
  let res: Response;
  try {
    res = await fetch(`${base}/api/v1${path}`, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  } catch (first) {
    if ((first as Error).name === 'TimeoutError') {
      console.error(`[serverApi] GET ${path} timed out after ${timeoutMs}ms`);
      throw new ApiError(0, 'NETWORK', 'API timed out');
    }
    await new Promise((r) => setTimeout(r, 150));
    try {
      res = await fetch(`${base}/api/v1${path}`, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    } catch (second) {
      const cause = (second as { cause?: { code?: string; message?: string } }).cause;
      console.error(`[serverApi] GET ${path} failed:`, cause?.code ?? cause?.message ?? second, '(first attempt:', (first as { cause?: { code?: string } }).cause?.code, ')');
      throw new ApiError(0, 'NETWORK', `API unreachable: ${cause?.code ?? 'fetch failed'}`);
    }
  }
  return parse<T>(res);
}

/** Safe variant for optional page sections: returns null instead of throwing. */
export async function serverApiSafe<T>(path: string, opts: { revalidate?: number } = {}): Promise<T | null> {
  try {
    return await serverApi<T>(path, opts);
  } catch {
    return null;
  }
}

type TokenGetter = () => string | null;
type Refresher = () => Promise<string | null>;
let getToken: TokenGetter = () => null;
let refresh: Refresher = async () => null;

export function configureClientAuth(tokenGetter: TokenGetter, refresher: Refresher) {
  getToken = tokenGetter;
  refresh = refresher;
}

/** Browser fetch with bearer token; on 401 it refreshes once and retries. */
export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const doFetch = (token: string | null) => {
    const headers = new Headers(init.headers);
    if (token) headers.set('authorization', `Bearer ${token}`);
    let body = init.body;
    if (init.json !== undefined) {
      headers.set('content-type', 'application/json');
      body = JSON.stringify(init.json);
    }
    return fetch(`/api/v1${path}`, { ...init, headers, body, credentials: 'same-origin' });
  };

  let res: Response;
  try {
    res = await doFetch(getToken());
    if (res.status === 401 && !path.startsWith('/auth/')) {
      const fresh = await refresh();
      if (fresh) res = await doFetch(fresh);
    }
  } catch {
    throw new ApiError(0, 'NETWORK', 'Network error');
  }
  return parse<T>(res);
}
