import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'screenshots');
const baseUrl = process.env.APP_URL ?? 'http://localhost:8082';

/** Matches Chrome DevTools → iPhone XR (414×896 @2× → 828×1792). */
const MOBILE = {
  viewport: { width: 414, height: 896 },
  screen: { width: 414, height: 896 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: devices['iPhone XR'].userAgent,
  locale: 'vi-VN',
};

const shots = [
  { file: 'alphabet.png', path: '/' },
  { file: 'reading.png', path: '/reading' },
  { file: 'grammar.png', path: '/grammar' },
  { file: 'vocabulary.png', path: '/vocabulary' },
  { file: 'review.png', path: '/review' },
  { file: 'settings.png', path: '/settings' },
];

const browser = await chromium.launch();
const context = await browser.newContext(MOBILE);
const page = await context.newPage();

await mkdir(outDir, { recursive: true });

for (const { file, path: route } of shots) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, file),
    fullPage: false,
  });
  const dim = `${MOBILE.viewport.width * MOBILE.deviceScaleFactor}x${MOBILE.viewport.height * MOBILE.deviceScaleFactor}`;
  console.log(`saved ${file} (${dim})`);
}

await browser.close();
