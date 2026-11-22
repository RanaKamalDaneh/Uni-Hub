// Netlify Scheduled Function: pings the API every 10 minutes so the Render free plan
// (which sleeps after 15 idle minutes) stays awake and visitors never wait for a cold start.
export default async () => {
  const base = process.env.API_INTERNAL_URL ?? 'https://naajah-api.onrender.com';
  const started = Date.now();
  try {
    const res = await fetch(`${base}/api/v1/health`, { signal: AbortSignal.timeout(25_000) });
    console.log(`[keep-api-awake] ${res.status} in ${Date.now() - started}ms`);
  } catch (e) {
    // Even a timed-out request wakes the service up; the next run will find it awake.
    console.log(`[keep-api-awake] no response after ${Date.now() - started}ms: ${(e as Error).name}`);
  }
  return new Response('ok');
};

export const config = { schedule: '*/10 * * * *' };
