// Screenshots every page at phone and desktop size and prints layout problems.
// Usage: node e2e/walk.mjs <output dir>
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://pashto-bible-web.jeremy-samuels17.workers.dev';
const OUT = process.argv[2];
const SIZES = [{ name: '390', width: 390, height: 844 }, { name: '1280', width: 1280, height: 800 }];

const clickTab = (name) => async (page) => {
  await page.getByRole('button', { name, exact: false }).first().click();
};

const VIEWS = [
  ['home', '/'],
  ['search-results', '/', async (page) => {
    const box = page.locator('input[type="text"], input[type="search"]').first();
    await box.fill('خدای');
    await box.press('Enter');
    await page.waitForTimeout(5000);
  }],
  ['lexicon', '/', clickTab(/Lexicon/)],
  ['videos', '/', clickTab(/Videos/)],
  ['videos-frequency', '/', async (page) => {
    await clickTab(/Videos/)(page);
    await page.locator('button:has-text("📊")').first().click();
  }],
  ['videos-transcripts', '/', async (page) => {
    await clickTab(/Videos/)(page);
    await page.locator('button:has-text("🔍")').last().click();
  }],
  ['poems', '/', clickTab(/Poems/)],
  ['bible', '/', clickTab(/Bible/)],
  ['typer', '/typer'],
  ['route-videos', '/videos'],
  ['route-poems', '/poems'],
  ['route-lexicon', '/lexicon'],
  ['route-chapters', '/chapters'],
  ['route-search', '/search'],
  ['route-topics', '/topics'],
  ['route-compare', '/compare-transcriptions'],
];

const measure = () => {
  const width = document.documentElement.clientWidth;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  const label = (el) => `${el.tagName.toLowerCase()}:${(el.innerText || el.value || el.placeholder || '').trim().slice(0, 24)}`;
  const offRight = [...document.querySelectorAll('button, a, input, select, h1, h2, h3, p')]
    .filter((el) => visible(el) && el.getBoundingClientRect().right > width + 1)
    .map(label);
  const smallTargets = [...document.querySelectorAll('button, a, select, input')]
    .filter((el) => visible(el) && el.getBoundingClientRect().height < 44)
    .map(label);
  const h1 = document.querySelector('h1');
  return {
    scrollWidth: document.documentElement.scrollWidth,
    width,
    pageHeight: document.documentElement.scrollHeight,
    offRight: offRight.slice(0, 8),
    offRightCount: offRight.length,
    smallTargetCount: smallTargets.length,
    smallTargets: smallTargets.slice(0, 6),
    h1: h1 ? { text: h1.innerText.slice(0, 30), color: getComputedStyle(h1).color, bottom: Math.round(h1.getBoundingClientRect().bottom) } : null,
  };
};

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = {};
for (const size of SIZES) {
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, hasTouch: size.name === '390', colorScheme: process.env.COLOR_SCHEME || 'light' });
  for (const [name, route, act] of VIEWS) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));
    const key = `${name}-${size.name}`;
    try {
      const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2500);
      if (act) await act(page);
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT, `${key}.png`) });
      report[key] = { status: res?.status(), ...(await page.evaluate(measure)), errors };
    } catch (error) {
      report[key] = { failed: error.message.split('\n')[0].slice(0, 160), errors };
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
for (const [key, r] of Object.entries(report)) {
  console.log(key, r.failed ? `FAILED ${r.failed}` : `http ${r.status} sideways ${r.scrollWidth - r.width} height ${r.pageHeight} offRight ${r.offRightCount} small ${r.smallTargetCount} h1 ${r.h1?.color}/${r.h1?.bottom} err ${r.errors.length}`);
}
