/**
 * UI review automation — opens each public route in headless Chromium,
 * captures viewport screenshots at desktop + mobile, and logs basic
 * console / network errors so we can confirm what the user sees.
 *
 * Usage:
 *   node scripts/ui-review.mjs [baseUrl]   # default http://localhost:5173
 *
 * Output: ./ui-review/<route>-desktop.png + <route>-mobile.png,
 *         ./ui-review/report.json
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const baseUrl = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/cybersecurity',
  '/services/compliance-regtech',
  '/products',
  '/products/dpdp-compliance',
  '/insights',
  '/case-studies',
  '/team',
  '/careers',
  '/contact',
  '/consultation',
  '/faq',
  '/trust',
  '/industries',
  '/partnerships',
  '/dpdp-assessment',
  '/privacy',
  '/terms',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const outDir = resolve(process.cwd(), 'ui-review');
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const report = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  routes: [],
};

console.log(`[ui-review] base=${baseUrl} routes=${ROUTES.length} viewports=${VIEWPORTS.length}`);

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  // Suppress cookie banner so screenshots are not obscured.
  await context.addInitScript(() => {
    try { localStorage.setItem('adviserve_cookie_consent', 'declined'); } catch (_) {}
  });

  for (const route of ROUTES) {
    const entry = { route, viewport: viewport.name, console: [], errors: [], failedRequests: [] };
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (['error', 'warning'].includes(msg.type())) {
        entry.console.push({ type: msg.type(), text: msg.text() });
      }
    });
    page.on('pageerror', (err) => { entry.errors.push(err.message); });
    page.on('requestfailed', (req) => {
      const url = req.url();
      if (url.includes('localhost') || url.includes(baseUrl)) {
        entry.failedRequests.push({ url, failure: req.failure()?.errorText });
      }
    });

    try {
      const resp = await page.goto(baseUrl + route, { waitUntil: 'networkidle', timeout: 30000 });
      entry.status = resp?.status() ?? null;
      // Settle GSAP/anime intros (some take 1.4-2s)
      await page.waitForTimeout(2800);
      const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
      const file = `${slug}-${viewport.name}.png`;
      await page.screenshot({ path: resolve(outDir, file), fullPage: false });
      entry.screenshot = file;
      console.log(`[ui-review] ${viewport.name} ${route} -> ${file}`);
    } catch (err) {
      entry.errors.push(`navigation failed: ${err.message}`);
      console.error(`[ui-review] ${viewport.name} ${route} FAILED: ${err.message}`);
    }

    report.routes.push(entry);
    await page.close();
  }

  await context.close();
}

await browser.close();
await writeFile(resolve(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf-8');
console.log(`[ui-review] done — ${report.routes.length} entries written to ${outDir}/report.json`);
