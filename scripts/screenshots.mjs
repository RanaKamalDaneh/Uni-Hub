import { chromium } from '@playwright/test';
const out = process.argv[2];
const browser = await chromium.launch();
for (const [locale, vw, name] of [['en', 1366, 'en-desktop'], ['ar', 1366, 'ar-desktop'], ['ar', 390, 'ar-mobile']]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
  await ctx.addCookies([{ name: 'NEXT_LOCALE', value: locale, url: 'http://localhost:3000' }]);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
  if (name === 'en-desktop') {
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.screenshot({ path: `${out}/en-categories.png` });
  }
  console.log(name, 'console errors:', errors.length ? errors : 'none');
  await ctx.close();
}
// Register flow through the real UI
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
await page.click('button[type=submit]');
await page.screenshot({ path: `${out}/register-validation.png` });
await page.fill('#fullName', 'Playwright Student');
await page.fill('#email', `pw${Date.now()}@example.com`);
await page.fill('#password', 'Passw0rd123');
await page.check('input[type=checkbox]');
await page.click('button[type=submit]');
await page.waitForURL('**/student/dashboard', { timeout: 15000 }).then(() => console.log('register -> redirected to', page.url())).catch(() => console.log('register redirect failed, at', page.url()));
await browser.close();
