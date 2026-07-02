import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const shotsRoot = path.join(rootDir, 'screenshots');
const baseUrl = process.env.APP_URL ?? 'http://localhost:8083';

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

const SRS_KEY = 'kkh:srs:cards';

function todayDue() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

const demoReviewCard = {
  id: 'screenshot-demo',
  type: 'vocab',
  front: '안녕하세요',
  back: 'xin chào',
  extra: { pos: 'phrase' },
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
  due: todayDue(),
  createdAt: new Date().toISOString(),
};

async function snap(page, filePath) {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: filePath, fullPage: false });
}

async function fillKoreanInput(page, text) {
  const field = page.locator('textarea, input[type="text"]').first();
  await field.click();
  await field.fill(text);
}

async function captureFeature(browser, dir, run) {
  const outDir = path.join(shotsRoot, dir);
  await mkdir(outDir, { recursive: true });
  const context = await browser.newContext(MOBILE);
  const page = await context.newPage();
  await run(page, outDir);
  await context.close();
}

const browser = await chromium.launch();

await captureFeature(browser, 'alphabet', async (page, outDir) => {
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await page.getByText('Nguyên âm cơ bản').scrollIntoViewIfNeeded();
  await snap(page, path.join(outDir, '2.png'));

  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByText('Nhóm theo âm', { exact: true }).click();
  await page.getByText('Phụ âm cuối').scrollIntoViewIfNeeded();
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved alphabet/1-3.png');
});

await captureFeature(browser, 'reading', async (page, outDir) => {
  await page.goto(`${baseUrl}/reading`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await fillKoreanInput(page, '안녕하세요');
  await page.getByText('안', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {});
  await snap(page, path.join(outDir, '2.png'));

  await page.getByText('Luyện đọc', { exact: true }).click();
  await page.getByText('Hiện đáp án', { exact: true }).first().click();
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved reading/1-3.png');
});

await captureFeature(browser, 'grammar', async (page, outDir) => {
  await page.goto(`${baseUrl}/grammar`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await page.getByText('TOPIK II (Trung cấp)', { exact: true }).click();
  await snap(page, path.join(outDir, '2.png'));

  await page.goto(`${baseUrl}/grammar/n-eun-neun`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved grammar/1-3.png');
});

await captureFeature(browser, 'vocabulary', async (page, outDir) => {
  await page.goto(`${baseUrl}/vocabulary`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await page.getByText('Cách đọc').scrollIntoViewIfNeeded();
  await snap(page, path.join(outDir, '2.png'));

  await page.getByText('TOPIK II (Trung cấp)', { exact: true }).click();
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved vocabulary/1-3.png');
});

await captureFeature(browser, 'review', async (page, outDir) => {
  await page.goto(`${baseUrl}/review`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await page.evaluate(
    ([key, card]) => {
      localStorage.setItem(key, JSON.stringify({ v: 1, data: [card] }));
    },
    [SRS_KEY, demoReviewCard]
  );
  await page.goto(`${baseUrl}/review`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '2.png'));

  await page.getByText('Hiện đáp án', { exact: true }).first().click();
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved review/1-3.png');
});

await captureFeature(browser, 'settings', async (page, outDir) => {
  await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle', timeout: 60000 });
  await snap(page, path.join(outDir, '1.png'));

  await page.getByText('Ngôn ngữ').scrollIntoViewIfNeeded();
  await snap(page, path.join(outDir, '2.png'));

  await page.getByText('Giới thiệu').scrollIntoViewIfNeeded();
  await snap(page, path.join(outDir, '3.png'));
  console.log('saved settings/1-3.png');
});

await browser.close();
console.log('done — 18 screenshots in screenshots/<feature>/1-3.png');
