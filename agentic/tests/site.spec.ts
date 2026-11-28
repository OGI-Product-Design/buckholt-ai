import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

// Every page in the build, found by walking site/.
const DIST = path.resolve(process.cwd(), 'site');
function pages(dir = DIST, rel = '/'): string[] {
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name !== 'assets') out.push(...pages(full, `${rel}${name}/`));
    } else if (name === 'index.html') {
      out.push(rel);
    }
  }
  return out;
}
const ALL = pages();

// External font and icon kits are blocked so results do not depend on the
// network; the site must work without them.
async function blockExternal(page: Page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
}

test('the build has every section in the navigation', async ({ page }) => {
  await blockExternal(page);
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  for (const name of ['Home', 'Workflow', 'Agents', 'Toolset', 'Repo and Buckholt', 'Artifacts and templates', 'Azure DevOps', 'Working with product', 'Set-up guides', 'How-to guides', 'Governance and rollout']) {
    await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
  }
  expect(ALL.filter(p => p.startsWith('/agents/') && p !== '/agents/')).toHaveLength(12);
});

for (const width of [1440, 390]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const url of ALL) {
      test(`${url} passes axe with no serious or critical issues`, async ({ page }) => {
        await blockExternal(page);
        await page.goto(url);
        await expect(page.locator('h1')).toHaveCount(1);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
        expect(serious.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, 'no sideways scrolling').toBeLessThanOrEqual(0);
      });
    }
  });
}

test.describe('keyboard', () => {
  test.beforeEach(async ({ page }) => blockExternal(page));

  test('skip link is the first stop and moves focus to main', async ({ page }) => {
    await page.goto('/workflow/');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Skip to main content');
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('every navigation link can be reached with Tab', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const reached = new Set<string>();
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const text = await page.evaluate(() => (document.activeElement?.closest('.x-site-nav') ? document.activeElement.textContent?.trim() : null));
      if (text) reached.add(text);
    }
    expect(reached.size).toBe(11);
  });

  test('the mobile menu opens and closes from the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(page.locator('#sidebar')).toBeHidden();
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#sidebar')).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('search works from the keyboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Search', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.getByLabel('Search the site').focus();
    await page.keyboard.type('figma');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('match');
    await expect(page.locator('.x-search-list a').first()).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', /.+/);
  });

  test('copy buttons work from the keyboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/agents/range/');
    const copy = page.locator('[data-x-copy]').first();
    await copy.focus();
    await expect(copy).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(copy).toContainText('Copied');
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain('# Range');
  });
});

test('the site reads without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  await blockExternal(page);
  await page.goto('/agents/extend/');
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Never' })).toBeVisible();
  await expect(page.locator('[data-x-copy]').first()).toBeHidden();
  await context.close();
});

test('the set-up progress bar stays inside the page margins on a phone', async ({ page }) => {
  await blockExternal(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/setup-guides/repo-and-locks/');
  const [bar, box] = await Promise.all([
    page.locator('.progress').boundingBox(),
    page.locator('.progress-container').boundingBox()
  ]);
  expect(bar!.x + bar!.width).toBeLessThanOrEqual(box!.x + box!.width + 0.5);
});
