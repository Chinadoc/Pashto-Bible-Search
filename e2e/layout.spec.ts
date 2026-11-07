import { expect, type Page, test } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };
const TABS = ['Search', 'Lexicon', 'Videos', 'Poems', 'Bible', 'Typer'];

function tab(page: Page, name: string) {
  return page.locator('button, a').filter({ hasText: new RegExp(`^\\W*${name}`) }).first();
}

// Stands in for the YouTube player, so a test can jump to any time in the video.
async function fakeYouTube(page: Page) {
  await page.route('**/www.youtube.com/iframe_api', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      window.__time = 0;
      window.YT = {
        PlayerState: { PLAYING: 1 },
        Player: function (id, options) {
          this.getCurrentTime = () => window.__time;
          this.destroy = () => {};
          setTimeout(() => options.events.onStateChange({ data: 1 }), 0);
        },
      };
      window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady();
    `,
  }));
}

async function openVideos(page: Page) {
  await page.goto('/');
  await tab(page, 'Videos').click();
  await page.locator('[id^="youtube-player-"]').first().waitFor();
}

async function expectInViewport(page: Page, selector: string) {
  const box = await page.locator(selector).first().boundingBox();
  const viewport = page.viewportSize()!;
  expect(box, selector).not.toBeNull();
  expect(box!.y, `${selector} top`).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height, `${selector} bottom`).toBeLessThanOrEqual(viewport.height);
}

const PLAYER = '[id^="youtube-player-"]';
const ACTIVE_LINE = 'text=▶ Playing';

test.describe('phone', () => {
  test.use({ viewport: PHONE });

  test('all top tabs fit in one row without sideways scroll', async ({ page }) => {
    await page.goto('/');
    await tab(page, 'Search').waitFor();
    const boxes = [];
    for (const name of TABS) {
      const box = await tab(page, name).boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.x, `${name} left`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `${name} right`).toBeLessThanOrEqual(PHONE.width);
      expect(box!.height, `${name} tap height`).toBeGreaterThanOrEqual(44);
      boxes.push(box!);
    }
    expect(new Set(boxes.map((box) => Math.round(box.y))).size).toBe(1);
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(sideways).toBeLessThanOrEqual(0);
  });

  test('the header is one short readable row with Sign in on it', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1').first();
    const signIn = page.getByRole('button', { name: 'Sign in' });
    await signIn.waitFor();
    const titleBox = (await title.boundingBox())!;
    const signInBox = (await signIn.boundingBox())!;
    expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(56);
    expect(signInBox.y).toBeLessThan(titleBox.y + titleBox.height);
    expect(signInBox.height).toBeGreaterThanOrEqual(44);
    const [red, green, blue] = (await title.evaluate((el) => getComputedStyle(el).color)).match(/\d+/g)!.map(Number);
    expect(red + green + blue, 'title is light on the dark background').toBeGreaterThan(500);
  });

  test('the tabs stay pinned while scrolling', async ({ page }) => {
    await page.goto('/');
    await tab(page, 'Search').waitFor();
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);
    const box = (await tab(page, 'Search').boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeLessThan(20);
  });

  test('player and current line share the first screen', async ({ page }) => {
    await openVideos(page);
    await page.waitForTimeout(500);
    await expectInViewport(page, PLAYER);
    await expectInViewport(page, ACTIVE_LINE);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('the transcript follows the video without moving the page', async ({ page }) => {
    await fakeYouTube(page);
    await openVideos(page);
    await page.locator(ACTIVE_LINE).first().waitFor();
    await page.evaluate(() => { (window as any).__time = 600; });
    await page.waitForTimeout(2500);
    await expectInViewport(page, ACTIVE_LINE);
    await expectInViewport(page, PLAYER);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('book names are not cut off', async ({ page }) => {
    await page.goto('/');
    await tab(page, 'Bible').click();
    await expect(page.getByRole('button', { name: 'Deuteronomy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Thessalonians' }).first()).toBeVisible();
  });

  test('search results start on the first screen, and options are one tap away', async ({ page }) => {
    await page.goto('/');
    const box = page.locator('input[type="text"]').first();
    await box.fill('خدای');
    await box.press('Enter');
    await page.locator('.verse-item, [class*="verse"]').first().waitFor({ timeout: 30_000 });
    const first = (await page.locator('.verse-item, [class*="verse"]').first().boundingBox())!;
    expect(first.y).toBeLessThan(PHONE.height);
    await page.getByRole('button', { name: /Search options/ }).click();
    await expect(page.getByText('SEARCH MODE', { exact: false }).first()).toBeVisible();
  });

  for (const [route, marker] of [['/poems', /Poetry/], ['/chapters', /Bible Browser/]] as const) {
    test(`${route} opens its own page`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h2').filter({ hasText: marker }).first()).toBeVisible();
    });
  }
});

test.describe('desktop', () => {
  test.use({ viewport: DESKTOP });

  test('video and transcript sit side by side on one screen', async ({ page }) => {
    await openVideos(page);
    await page.waitForTimeout(500);
    await expectInViewport(page, PLAYER);
    await expectInViewport(page, ACTIVE_LINE);
    const player = (await page.locator(PLAYER).first().boundingBox())!;
    const line = (await page.locator(ACTIVE_LINE).first().boundingBox())!;
    expect(line.x).toBeGreaterThan(player.x + player.width - 1);
  });
});
