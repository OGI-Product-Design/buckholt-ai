/* Configuration Hub shell (CH-SHELL): every acceptance criterion in
   prototypes/CH-SHELL/ch-shell-spec.md, plus the accessibility requirements
   and the Buckholt gaps the shell builds.

   Each block is headed `AC n` with the criterion it checks, in the order
   the spec lists them. Run against the mirror like the other suites:

     node test/ch-shell.js
*/
const { launch, BASE, STILL, counter } = require('./config');
const t = counter();
const { is, ok } = t;

const ROOT = BASE + '/prototypes/CH-SHELL/';
const HOME = ROOT + 'index.html';
const APP = id => ROOT + 'app.html?app=' + id;

const ALERT = "You're in your Test environment. Changes here won't affect Live.";
const DEFAULT_CARDS = [
  ['Onboarding Form', 'View the business details you shared with us when you joined.'],
  ['User Management', 'Add and manage your Mobius users and what they can access.'],
  ['Third-Party Services', 'Connect Mobius to services like email, SMS and payments.']
];
const ALL_APPS = ['Onboarding Form', 'User Management', 'AutoMATE', 'Third-Party Services', 'Policy Extensions', 'Audit Centre'];

/* A fresh browser context is a fresh tab: empty sessionStorage, so the seed
   rule decides the environment. */
async function open(browser, url, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: STILL });
  return page;
}

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({ content: STILL });
  await page.waitForTimeout(250);
}

const text = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; }, sel);
const active = page => page.evaluate(() => {
  const e = document.activeElement;
  return e ? (e.id || e.getAttribute('aria-label') || e.textContent.trim()) : null;
});
const checkedEnv = page => page.evaluate(() => { const r = document.querySelector('input[name=ch-environment]:checked'); return r ? r.value : null; });
const cardTitles = page => page.$$eval('.ch-app-card h2', hs => hs.map(h => h.textContent.trim()));

(async () => {
  const browser = await launch();

  /* ===== AC 1 · default seed, home loads ============================== */
  {
    const p = await open(browser, HOME);
    is('AC1 no page errors', p.errors.join('|'), '');
    is('AC1 Live selected', await checkedEnv(p), 'live');
    is('AC1 no Test alert', await p.locator('#ch-env-alert').count(), 0);
    is('AC1 breadcrumb reads Applications', await text(p, '#ch-context nav .breadcrumb'), 'Applications');
    is('AC1 breadcrumb is one crumb', await p.locator('#ch-context .breadcrumb-item').count(), 1);
    is('AC1 crumb is current page', await p.getAttribute('#ch-context .breadcrumb-item', 'aria-current'), 'page');
    is('AC1 crumb is not a link', await p.locator('#ch-context .breadcrumb-item a').count(), 0);
    is('AC1 exactly three cards', await p.locator('.ch-app-card').count(), 3);
    is('AC1 card order', (await cardTitles(p)).join(' / '), DEFAULT_CARDS.map(c => c[0]).join(' / '));
    is('AC1 card descriptions', (await p.$$eval('.ch-app-card .text-block p', ps => ps.map(x => x.textContent.trim()))).join(' / '),
       DEFAULT_CARDS.map(c => c[1]).join(' / '));
    is('AC1 document title', await p.title(), 'Applications | Configuration Hub');
    is('AC1 h1 Applications', await text(p, 'main h1'), 'Applications');
    ok('AC1 h1 visually hidden', await p.evaluate(() => document.querySelector('main h1').classList.contains('visually-hidden')));
    is('AC1 card titles are h2', await p.locator('.ch-app-card h2').count(), 3);
    is('AC1 illustrations decorative', (await p.$$eval('.ch-app-card img.card-img', is => is.map(i => i.getAttribute('alt')))).join(','), ',,');
    ok('AC1 illustrations load', await p.evaluate(() => [...document.querySelectorAll('.ch-app-card img')].every(i => i.complete && i.naturalWidth > 0)));
    ok('AC1 lockup loads', await p.evaluate(() => { const i = document.querySelector('.ch-lockup img'); return i.complete && i.naturalWidth > 0; }));
    is('AC1 Open is Primary', await p.locator('.ch-app-card .btn.btn-primary').count(), 3);
    ok('AC1 Open buttons bottom-right of card', await p.evaluate(() => [...document.querySelectorAll('.ch-app-card')].every(c => {
      const cb = c.getBoundingClientRect(), bb = c.querySelector('.ch-open').getBoundingClientRect();
      return Math.abs(cb.right - bb.right) < 40 && Math.abs(cb.bottom - bb.bottom) < 40;
    })));
    ok('AC1 cards equal height', await p.evaluate(() => new Set([...document.querySelectorAll('.ch-app-card')].map(c => Math.round(c.getBoundingClientRect().height))).size === 1));
    is('AC1 card titles use Card\'s title-03', await p.evaluate(() => [...document.querySelectorAll('.ch-app-card h2')].every(h => h.classList.contains('title-03'))), true);
    is('AC1 no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth), 1440);
    await p.context().close();
  }

  /* ===== AC 2 · select Test ============================================ */
  {
    const p = await open(browser, HOME);
    await p.click('label[for=ch-env-test]');
    await p.waitForTimeout(300);
    is('AC2 Test selected', await checkedEnv(p), 'test');
    is('AC2 alert copy', await text(p, '#ch-env-alert'), ALERT);
    ok('AC2 alert is below the header', await p.evaluate(() =>
      document.getElementById('ch-env-alert').getBoundingClientRect().top >= document.getElementById('ch-header').getBoundingClientRect().bottom - 1));
    ok('AC2 alert is above the breadcrumb band', await p.evaluate(() =>
      document.getElementById('ch-env-alert').getBoundingClientRect().bottom <= document.querySelector('.ch-crumbs').getBoundingClientRect().top + 1));
    ok('AC2 alert is full width', await p.evaluate(() => Math.round(document.getElementById('ch-env-alert').getBoundingClientRect().width) === innerWidth));
    ok('AC2 title starts [Test] ', (await p.title()).startsWith('[Test] '));
    is('AC2 title', await p.title(), '[Test] Applications | Configuration Hub');
    is('AC2 announced politely', await text(p, '#ch-announcer'), 'Test environment selected.');
    is('AC2 announcer is polite', await p.getAttribute('#ch-announcer', 'aria-live'), 'polite');
    is('AC2 alert not a live region', await p.evaluate(() => { const a = document.getElementById('ch-env-alert'); return String(a.getAttribute('role')) + '/' + String(a.getAttribute('aria-live')); }), 'null/null');
    is('AC2 alert not focusable', await p.evaluate(() => document.querySelectorAll('#ch-env-alert [tabindex], #ch-env-alert a, #ch-env-alert button').length), 0);
    is('AC2 alert message is not a heading', await p.evaluate(() => document.querySelectorAll('#ch-env-alert h1, #ch-env-alert h2, #ch-env-alert h3, #ch-env-alert h4, #ch-env-alert h5, #ch-env-alert h6, #ch-env-alert [role=heading]').length), 0);
    is('AC2 first heading on the page is the h1', await p.evaluate(() => document.querySelector('h1, h2, h3, h4, h5, h6').tagName), 'H1');
    is('AC2 alert keeps Alert message type', await p.evaluate(() => getComputedStyle(document.querySelector('#ch-env-alert .alert-message p')).fontWeight), '500');
    is('AC2 stays on home', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    is('AC2 cards unchanged in Test', (await cardTitles(p)).length, 3);
    /* Selecting via the keyboard: arrow keys move and select, focus stays. */
    await p.focus('#ch-env-test');
    await p.keyboard.press('ArrowLeft');
    await p.waitForTimeout(300);
    is('AC2 arrow key selects Live', await checkedEnv(p), 'live');
    is('AC2 focus stays on the option', await active(p), 'ch-env-live');
    is('AC2 Live announced', await text(p, '#ch-announcer'), 'Live environment selected.');
    is('AC2 Live has no alert', await p.locator('#ch-env-alert').count(), 0);
    is('AC2 Live title', await p.title(), 'Applications | Configuration Hub');
    await p.context().close();
  }

  /* ===== AC 3 · Test survives opening an app and coming home ========== */
  {
    const p = await open(browser, HOME);
    await p.click('label[for=ch-env-test]');
    await p.waitForTimeout(200);
    await Promise.all([p.waitForNavigation(), p.click('.ch-app-card[data-app=user-management] .ch-open')]);
    await settle(p);
    is('AC3 Test current inside the app', await checkedEnv(p), 'test');
    is('AC3 alert inside the app', await text(p, '#ch-env-alert'), ALERT);
    is('AC3 app title in Test', await p.title(), '[Test] User Management | Configuration Hub');
    await Promise.all([p.waitForNavigation(), p.click('.ch-lockup')]);
    await settle(p);
    is('AC3 back home', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    is('AC3 Test still current', await checkedEnv(p), 'test');
    is('AC3 alert still shown', await p.locator('#ch-env-alert').count(), 1);
    is('AC3 lockup: normal page load, focus at the top', await p.evaluate(() => document.activeElement === document.body), true);
    await p.keyboard.press('Tab');
    is('AC3 lockup: next Tab is the skip link', await active(p), 'Skip to main content');
    /* A new tab starts from the seed rule. */
    const fresh = await open(browser, HOME);
    is('AC3 a new tab starts in Live', await checkedEnv(fresh), 'live');
    await fresh.context().close();
    await p.context().close();
  }

  /* ===== AC 4 · Test inside an app, select Live ======================= */
  {
    const p = await open(browser, HOME);
    await p.click('label[for=ch-env-test]');
    await p.waitForTimeout(200);
    await p.goto(APP('third-party-services'), { waitUntil: 'networkidle' });
    await p.evaluate(() => { window.__featureState = 'filters and selections'; });
    await Promise.all([p.waitForNavigation(), p.click('label[for=ch-env-live]')]);
    await settle(p);
    is('AC4 on the base page', p.url(), APP('third-party-services'));
    is('AC4 Live current', await checkedEnv(p), 'live');
    is('AC4 page state reset (fresh load)', await p.evaluate(() => typeof window.__featureState), 'undefined');
    is('AC4 alert gone', await p.locator('#ch-env-alert').count(), 0);
    is('AC4 title', await p.title(), 'Third-Party Services | Configuration Hub');
    is('AC4 announced after the switch', await text(p, '#ch-announcer'), 'Live environment selected.');
    is('AC4 switch: normal page load, focus at the top', await p.evaluate(() => document.activeElement === document.body), true);
    is('AC4 no heading made focusable', await p.evaluate(() => document.querySelector('main h1').hasAttribute('tabindex')), false);
    is('AC4 breadcrumb is base trail', await text(p, '#ch-context .breadcrumb'), 'Third-Party Services');
    await p.context().close();
  }

  /* ===== AC 5 · staged rollout, AutoMATE in Test, select Live ========= */
  {
    const p = await open(browser, HOME + '?seed=staged-rollout');
    is('AC5 Live set has no AutoMATE', (await cardTitles(p)).includes('AutoMATE'), false);
    await p.click('label[for=ch-env-test]');
    await p.waitForTimeout(200);
    is('AC5 Test set adds AutoMATE', (await cardTitles(p)).join(' / '), 'Onboarding Form / User Management / AutoMATE / Third-Party Services');
    await Promise.all([p.waitForNavigation(), p.click('.ch-app-card[data-app=automate] .ch-open')]);
    await settle(p);
    is('AC5 in AutoMATE', await text(p, 'main h1'), 'AutoMATE');
    await Promise.all([p.waitForNavigation(), p.click('label[for=ch-env-live]')]);
    await settle(p);
    is('AC5 lands on home', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    is('AC5 Live current', await checkedEnv(p), 'live');
    is('AC5 announcement', await text(p, '#ch-announcer'), "Live environment selected. AutoMATE isn’t available in Live.");
    /* A direct visit to an app that is not visible goes home too. */
    await p.goto(APP('automate'), { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    is('AC5 hidden app URL goes home', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    await p.context().close();
  }

  /* ===== AC 6 · test-only seed ========================================= */
  {
    const p = await open(browser, HOME + '?seed=test-only');
    is('AC6 no environment radios', await p.locator('input[name=ch-environment]').count(), 0);
    is('AC6 Test tag', await text(p, '#ch-env-tag'), 'Test');
    ok('AC6 tag is a Buckholt Tag', await p.evaluate(() => document.getElementById('ch-env-tag').matches('span.tag > .tag-label, span.tag') && !!document.querySelector('#ch-env-tag > .tag-label')));
    is('AC6 tag not interactive', await p.evaluate(() => { const t = document.getElementById('ch-env-tag'); return t.tabIndex + '/' + t.querySelectorAll('input,button,a').length; }), '-1/0');
    is('AC6 alert shown', await text(p, '#ch-env-alert'), ALERT);
    is('AC6 organisation', await text(p, '#ch-org'), 'Harbourside Underwriting');
    is('AC6 initials', await text(p, '#ch-account-toggle .avatar-initials'), 'DO');
    is('AC6 title', await p.title(), '[Test] Applications | Configuration Hub');
    await p.context().close();
  }

  /* ===== AC 7 · all apps: production grid capacities, centred rows, fixed cards */
  {
    const p = await open(browser, HOME + '?seed=all-apps', { width: 1920, height: 1080 });
    is('AC7 six cards in registry order', (await cardTitles(p)).join(' / '), ALL_APPS.join(' / '));
    /* Cards per row, read from the layout: how many share each row's top. */
    const rows = () => p.evaluate(() => {
      const tops = [...document.querySelectorAll('.ch-app-card')].map(c => Math.round(c.getBoundingClientRect().top));
      const counts = [];
      tops.forEach((t, i) => { if (i === 0 || t !== tops[i - 1]) counts.push(1); else counts[counts.length - 1]++; });
      return counts.join('+');
    });
    const layout = () => p.evaluate(() => {
      const grid = document.getElementById('ch-app-grid').getBoundingClientRect();
      const cards = [...document.querySelectorAll('.ch-app-card')];
      const rowsOf = {};
      cards.forEach(c => { const r = c.getBoundingClientRect(); (rowsOf[Math.round(r.top)] = rowsOf[Math.round(r.top)] || []).push(r); });
      const rowList = Object.values(rowsOf);
      return {
        widths: [...new Set(cards.map(c => Math.round(c.getBoundingClientRect().width * 100) / 100))].join(','),
        sameHeight: new Set(cards.map(c => Math.round(c.getBoundingClientRect().height))).size === 1,
        /* Centred: equal space left and right of every row, final row included. */
        centred: rowList.every(rs => Math.abs((rs[0].left - grid.left) - (grid.right - rs[rs.length - 1].right)) <= 1),
        gap: rowList.filter(rs => rs.length > 1).every(rs => rs.slice(1).every((r, i) => Math.abs(r.left - rs[i].right - 32) <= 0.5)),
        illustrationsWhole: cards.every(c => { const i = c.querySelector('img.card-img'); const r = i.getBoundingClientRect(); return Math.abs(r.width / r.height - 250 / 160) < 0.02 && Math.abs(r.width - c.getBoundingClientRect().width) <= 2; }),
        descriptionsWhole: cards.every(c => { const d = c.querySelector('.text-block p'); return d.scrollWidth <= d.clientWidth && getComputedStyle(d).textOverflow !== 'ellipsis'; }),
        buttonsAtBottom: cards.every(c => Math.abs(c.getBoundingClientRect().bottom - c.querySelector('.ch-open').getBoundingClientRect().bottom - 32) <= 2)
      };
    });
    /* The capacity table in SH-00-01 "Card grid". 375px is in "576px and below". */
    for (const [width, want] of [[1920, '5+1'], [1440, '4+2'], [1280, '3+3'], [1088, '3+3'], [992, '3+3'], [768, '2+2+2'], [576, '1+1+1+1+1+1'], [375, '1+1+1+1+1+1']]) {
      await p.setViewportSize({ width, height: 1080 });
      await p.waitForTimeout(250);
      is('AC7 cards per row at ' + width, await rows(), want);
      const l = await layout();
      is('AC7 fixed 284px card width at ' + width, l.widths, '284');
      ok('AC7 every card the same height at ' + width, l.sameHeight);
      ok('AC7 every row centred at ' + width, l.centred);
      ok('AC7 32px horizontal gap at ' + width, l.gap);
      ok('AC7 illustrations uncropped at ' + width, l.illustrationsWhole);
      ok('AC7 descriptions never truncate at ' + width, l.descriptionsWhole);
      ok('AC7 Open buttons at the bottom of each card at ' + width, l.buttonsAtBottom);
      if (width >= 576) {
        is('AC7 no overflow at ' + width, await p.evaluate(() => document.documentElement.scrollWidth), width);
      } else {
        /* Below 576 only the grid is checked: the header is not designed
           for phone widths (spec, Viewport) and overflows on its own. */
        ok('AC7 cards inside the viewport at ' + width, await p.evaluate(() => [...document.querySelectorAll('.ch-app-card')].every(c => { const r = c.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })));
      }
    }
    /* Card heights follow the tallest card, and shrink back when it does. */
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.waitForTimeout(250);
    is('AC7 height is the tallest card\'s natural height', await p.evaluate(() => {
      const grid = document.getElementById('ch-app-grid');
      const set = parseFloat(grid.style.getPropertyValue('--ch-card-height'));
      grid.style.removeProperty('--ch-card-height');
      const natural = Math.ceil(Math.max(...[...grid.querySelectorAll('.ch-app-card')].map(c => c.getBoundingClientRect().height)));
      grid.style.setProperty('--ch-card-height', set + 'px');
      return set === natural;
    }), true);
    await p.context().close();
  }

  /* ===== AC 8 · default seed at 1440: one centred row of three =========== */
  {
    const p = await open(browser, HOME, { width: 1440, height: 900 });
    ok('AC8 three cards in one row', await p.evaluate(() => new Set([...document.querySelectorAll('.ch-app-card')].map(c => Math.round(c.getBoundingClientRect().top))).size === 1));
    ok('AC8 the row is centred on the page', await p.evaluate(() => {
      const cards = [...document.querySelectorAll('.ch-app-card')].map(c => c.getBoundingClientRect());
      return Math.abs(cards[0].left - (innerWidth - cards[2].right)) <= 1;
    }));
    is('AC8 fixed 284px cards', await p.evaluate(() => [...new Set([...document.querySelectorAll('.ch-app-card')].map(c => c.getBoundingClientRect().width))].join(',')), '284');
    await p.context().close();
  }

  /* ===== AC 9 · long names at 1088 ===================================== */
  {
    const p = await open(browser, HOME + '?seed=long-names', { width: 1088, height: 800 });
    await p.waitForTimeout(300);
    const org = 'Abbotsford Kingsley Commercial and Speciality Insurance Brokers';
    is('AC9 header is one row (84px)', await p.evaluate(() => Math.round(document.getElementById('ch-header').getBoundingClientRect().height)), 84);
    ok('AC9 no header item wraps', await p.evaluate(() => {
      const items = ['.ch-lockup', '#ch-org', '.ch-env', '#ch-mobius', '#ch-account-toggle'].map(s => document.querySelector(s).getBoundingClientRect());
      const mid = items.map(r => r.top + r.height / 2);
      return mid.every(m => Math.abs(m - mid[0]) < 2) && document.querySelector('#ch-mobius').getClientRects().length === 1;
    }));
    ok('AC9 header items in order', await p.evaluate(() => {
      const x = ['.ch-lockup', '#ch-org', '.ch-env', '#ch-mobius', '#ch-account-toggle'].map(s => document.querySelector(s).getBoundingClientRect().left);
      return x.every((v, i) => i === 0 || v > x[i - 1]);
    }));
    ok('AC9 organisation truncated', await p.evaluate(() => { const e = document.getElementById('ch-org'); return e.scrollWidth > e.clientWidth && getComputedStyle(e).textOverflow === 'ellipsis'; }));
    is('AC9 full name to assistive technology', await text(p, '#ch-org'), org);
    is('AC9 full name in Tooltip', await p.getAttribute('#ch-org', 'data-bs-title'), org);
    is('AC9 truncated name is not focusable', await p.evaluate(() => { const e = document.getElementById('ch-org'); return e.hasAttribute('tabindex') + '/' + e.tabIndex; }), 'false/-1');
    await p.hover('#ch-org');
    await p.waitForTimeout(1000);
    is('AC9 Tooltip on hover', await text(p, '.tooltip .tooltip-inner'), org);
    is('AC9 no overflow at 1088', await p.evaluate(() => document.documentElement.scrollWidth), 1088);
    is('AC9 Tooltip below the name, clear of the avatar', await p.evaluate(() => {
      const tip = document.querySelector('.tooltip').getBoundingClientRect(), org = document.getElementById('ch-org').getBoundingClientRect();
      return tip.top >= org.bottom;
    }), true);
    is('AC9 initials AM', await text(p, '#ch-account-toggle .avatar-initials'), 'AM');
    /* Tab order skips the name: lockup, then straight to the environment control. */
    await p.focus('.ch-lockup');
    await p.keyboard.press('Tab');
    is('AC9 Tab passes over the name', await active(p), 'ch-env-live');
    await p.mouse.move(600, 600);
    await p.waitForTimeout(300);
    await p.click('#ch-account-toggle');
    await p.waitForTimeout(300);
    ok('AC9 menu name and email wrap, never truncate', await p.evaluate(() => {
      const t = document.querySelector('.ch-identity-text');
      const email = document.querySelector('.ch-identity-email');
      return email.textContent === 'alexandra.montgomery-fairweather@abbotsfordkingsley-insurancebrokers.co.uk' &&
        email.scrollWidth <= email.clientWidth + 1 && email.getClientRects()[0].height > 24 &&
        getComputedStyle(t).textOverflow !== 'ellipsis';
    }));
    ok('AC9 menu stays inside the viewport', await p.evaluate(() => { const r = document.getElementById('ch-account-panel').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
    /* At 1440 the name has room and is not focusable. */
    await p.setViewportSize({ width: 1920, height: 900 });
    await p.waitForTimeout(300);
    is('AC9 untruncated name has no Tooltip', await p.getAttribute('#ch-org', 'data-bs-title'), null);
    is('AC9 untruncated name has no tab stop', await p.getAttribute('#ch-org', 'tabindex'), null);
    await p.context().close();
  }

  /* ===== AC 10 · Live only ============================================== */
  {
    const p = await open(browser, HOME + '?seed=live-only');
    is('AC10 no environment radios', await p.locator('input[name=ch-environment]').count(), 0);
    is('AC10 Live tag', await text(p, '#ch-env-tag'), 'Live');
    is('AC10 tag not interactive', await p.evaluate(() => { const t = document.getElementById('ch-env-tag'); return t.tabIndex + '/' + t.querySelectorAll('input,button,a').length; }), '-1/0');
    is('AC10 no Test alert', await p.locator('#ch-env-alert').count(), 0);
    is('AC10 organisation', await text(p, '#ch-org'), 'Kestrel Mutual');
    is('AC10 initials', await text(p, '#ch-account-toggle .avatar-initials'), 'PS');
    is('AC10 avatar name', await p.getAttribute('#ch-account-toggle', 'aria-label'), 'Account menu for Priya Shah');
    is('AC10 cards', (await cardTitles(p)).join(' / '), DEFAULT_CARDS.map(c => c[0]).join(' / '));
    is('AC10 title', await p.title(), 'Applications | Configuration Hub');
    await Promise.all([p.waitForNavigation(), p.click('.ch-app-card[data-app=user-management] .ch-open')]);
    await settle(p);
    is('AC10 inside an app, still Live, no alert', await p.evaluate(() => document.getElementById('ch-env-tag').textContent.trim() + '/' + document.querySelectorAll('#ch-env-alert').length), 'Live/0');
    await p.context().close();
  }

  /* ===== AC 11 · direct link to a hidden app =========================== */
  for (const [seed, id] of [['northgate', 'automate'], ['northgate', 'audit-centre'], ['live-only', 'policy-extensions']]) {
    const p = await open(browser, HOME + '?seed=' + seed);
    await p.goto(APP(id), { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    is('AC11 ' + seed + ' ' + id + ' opens the home page', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    is('AC11 ' + seed + ' ' + id + ' with no message', await text(p, '#ch-announcer'), '');    await p.context().close();
  }
  {
    const p = await open(browser, APP('not-an-app'));
    await p.waitForTimeout(300);
    is('AC11 unknown app id opens the home page', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    await p.context().close();
  }

  /* ===== AC 12 · skip link ============================================== */
  for (const url of [HOME, APP('user-management')]) {
    const p = await open(browser, url);
    await p.keyboard.press('Tab');
    is('AC12 first Tab focuses the skip link ' + url.split('/').pop(), await active(p), 'Skip to main content');
    ok('AC12 skip link visible when focused', await p.evaluate(() => document.activeElement.getBoundingClientRect().width > 50));
    await p.keyboard.press('Enter');
    await p.waitForTimeout(100);
    is('AC12 focus moves into Main', await p.evaluate(() => document.activeElement.id === 'main' || document.getElementById('main').contains(document.activeElement)), true);
    ok('AC12 skip link hidden when not focused', await p.evaluate(() => document.querySelector('.ch-skip-link').getBoundingClientRect().width <= 1));
    await p.context().close();
  }

  /* ===== AC 13 · avatar menu by keyboard =============================== */
  {
    const p = await open(browser, HOME);
    await p.focus('#ch-account-toggle');
    is('AC13 avatar name', await p.getAttribute('#ch-account-toggle', 'aria-label'), 'Account menu for Sophie Marchetti');
    is('AC13 closed state exposed', await p.getAttribute('#ch-account-toggle', 'aria-expanded'), 'false');
    await p.keyboard.press('Enter');
    await p.waitForTimeout(300);
    is('AC13 menu open', await p.isVisible('#ch-account-panel'), true);
    is('AC13 open state exposed', await p.getAttribute('#ch-account-toggle', 'aria-expanded'), 'true');
    is('AC13 avatar in menu', await text(p, '.ch-identity .avatar-initials'), 'SM');
    is('AC13 name', await text(p, '.ch-identity-name'), 'Sophie Marchetti');
    is('AC13 email', await text(p, '.ch-identity-email'), 'sophie.marchetti@northgate-insurance.co.uk');
    is('AC13 only item is Logout', (await p.$$eval('#ch-account-panel .menu-item', i => i.map(x => x.textContent.trim()))).join(','), 'Logout');
    is('AC13 Logout icon (Buckholt common action)', await p.evaluate(() => document.querySelector('#ch-logout i').className), 'fa-regular fa-arrow-right-from-bracket');
    is('AC13 no Release notes', (await text(p, '#ch-account-panel')).includes('Release'), false);
    is('AC13 one divider', await p.locator('#ch-account-panel .menu-divider').count(), 1);
    ok('AC13 divider between identity and Logout', await p.evaluate(() => {
      const id = document.querySelector('.ch-identity').getBoundingClientRect(), hr = document.querySelector('#ch-account-panel .menu-divider').getBoundingClientRect(), lo = document.getElementById('ch-logout').getBoundingClientRect();
      return id.bottom <= hr.top + 1 && hr.bottom <= lo.top + 1;
    }));
    is('AC13 focus on Logout', await active(p), 'ch-logout');
    is('AC13 identity header not focusable', await p.evaluate(() => document.querySelectorAll('.ch-identity [tabindex], .ch-identity a, .ch-identity button').length), 0);
    is('AC13 identity avatar hidden from AT', await p.getAttribute('.ch-identity .avatar', 'aria-hidden'), 'true');
    /* Semantics match the Tab / Shift+Tab model: a disclosure, not an ARIA
       menu (which would promise arrow keys and one tab stop). */
    is('AC13 disclosure: toggle controls the panel', await p.getAttribute('#ch-account-toggle', 'aria-controls'), 'ch-account-panel');
    is('AC13 disclosure: no menu roles', await p.evaluate(() => document.querySelectorAll('#ch-account [role=menu], #ch-account [role=menuitem], #ch-account [role=none], #ch-account [aria-haspopup]').length), 0);
    is('AC13 disclosure: items are native buttons in a list', await p.evaluate(() => [...document.querySelectorAll('#ch-account-panel .menu-item')].every(b => b.tagName === 'BUTTON' && b.closest('ul.menu-body > li'))), true);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(300);
    is('AC13 Escape closes', await p.isVisible('#ch-account-panel'), false);
    is('AC13 focus back on avatar', await active(p), 'ch-account-toggle');
    /* Space opens it too. Shift+Tab goes back to the avatar, keeping the
       menu open; Tab past the last item closes it. */
    await p.keyboard.press(' ');
    await p.waitForTimeout(300);
    is('AC13 Space opens on Logout', await active(p), 'ch-logout');
    await p.keyboard.press('Shift+Tab');
    await p.waitForTimeout(300);
    is('AC13 Shift+Tab moves back to the avatar', await active(p), 'ch-account-toggle');
    is('AC13 Shift+Tab keeps the menu open', await p.isVisible('#ch-account-panel'), true);
    await p.keyboard.press('Tab');
    await p.waitForTimeout(200);
    is('AC13 Tab moves to Logout', await active(p), 'ch-logout');
    await p.keyboard.press('Tab');
    await p.waitForTimeout(300);
    is('AC13 Tab past the last item closes', await p.isVisible('#ch-account-panel'), false);
    is('AC13 Tab past the last item continues to the page', await active(p), 'Open Onboarding Form');
    await p.focus('#ch-account-toggle');
    await p.keyboard.press('Enter');
    await p.waitForTimeout(300);
    await p.mouse.click(700, 600);
    await p.waitForTimeout(300);
    is('AC13 click outside closes', await p.isVisible('#ch-account-panel'), false);
    /* Tooltip on the avatar. */
    await p.hover('#ch-account-toggle');
    await p.waitForTimeout(1000);
    is('AC13 avatar Tooltip', await text(p, '.tooltip .tooltip-inner'), 'Account menu');
    is('AC13 serif fallback gone (Buckholt typeface)', await p.evaluate(() => /serif/i.test(getComputedStyle(document.querySelector('.ch-identity-name')).fontFamily.split(',')[0])), false);
    await p.context().close();
  }

  /* ===== AC 14 · Open accessible names ================================= */
  for (const seed of ['northgate', 'all-apps']) {
    const p = await open(browser, HOME + '?seed=' + seed);
    const names = await p.$$eval('.ch-app-card', cs => cs.map(c => [c.querySelector('h2').textContent.trim(), c.querySelector('.ch-open').getAttribute('aria-label'), c.querySelector('.ch-open').textContent.trim()]));
    ok('AC14 every Open is "Open {App name}" (' + seed + ')', names.length && names.every(([n, label, visible]) => label === 'Open ' + n && visible === 'Open'));
    await p.context().close();
  }

  /* ===== AC 15 · Mobius and Logout are inert ========================== */
  {
    const p = await open(browser, HOME);
    const before = p.url();
    const pages = p.context().pages().length;
    is('AC15 Mobius name', await p.getAttribute('#ch-mobius', 'aria-label'), 'Mobius (opens in a new tab)');
    is('AC15 Mobius icon before label', await p.evaluate(() => { const a = document.getElementById('ch-mobius'); return a.firstElementChild.className + '|' + a.textContent.trim(); }), 'icon|Mobius');
    is('AC15 Mobius uses External link icon', await p.evaluate(() => document.querySelector('#ch-mobius i').className), 'fa-regular fa-arrow-up-right-from-square');
    await p.click('#ch-mobius');
    await p.waitForTimeout(400);
    is('AC15 Mobius does not navigate', p.url(), before);
    is('AC15 Mobius opens no tab', p.context().pages().length, pages);
    await p.click('#ch-account-toggle');
    await p.waitForTimeout(300);
    await p.click('#ch-logout');
    await p.waitForTimeout(400);
    is('AC15 Logout does not navigate', p.url(), before);
    is('AC15 Logout closes the menu', await p.isVisible('#ch-account-panel'), false);
    is('AC15 Logout returns focus to avatar', await active(p), 'ch-account-toggle');
    await p.context().close();
  }

  /* ===== AC 16 · Open an app without a feature prototype =============== */
  {
    const p = await open(browser, HOME);
    for (const [id, name] of [['onboarding-form', 'Onboarding Form'], ['third-party-services', 'Third-Party Services']]) {
      await p.goto(HOME, { waitUntil: 'networkidle' });
      await Promise.all([p.waitForNavigation(), p.click('.ch-app-card[data-app=' + id + '] .ch-open')]);
      await settle(p);
      is('AC16 SH-03-01 URL ' + id, p.url(), APP(id));
      is('AC16 breadcrumb ' + id, await text(p, '#ch-context .breadcrumb'), name);
      is('AC16 crumb is current ' + id, await p.getAttribute('#ch-context .breadcrumb-item', 'aria-current'), 'page');
      is('AC16 heading ' + id, await text(p, 'main h1'), name);
      is('AC16 placeholder text ' + id, await text(p, 'main .text-block p'), 'This application isn’t part of this prototype yet.');
      is('AC16 title ' + id, await p.title(), name + ' | Configuration Hub');
      is('AC16 focus at the top after Open ' + id, await p.evaluate(() => document.activeElement === document.body), true);
      is('AC16 heading not made focusable ' + id, await p.evaluate(() => document.querySelector('main h1').hasAttribute('tabindex')), false);
      await p.keyboard.press('Tab');
      is('AC16 next Tab is the skip link ' + id, await active(p), 'Skip to main content');
    }
    await Promise.all([p.waitForNavigation(), p.click('#ch-placeholder-back')]);
    await settle(p);
    is('AC16 Back to applications goes home', new URL(p.url()).pathname.endsWith('/CH-SHELL/index.html'), true);
    is('AC16 hidden home heading never focused', await p.evaluate(() => document.activeElement === document.body && !document.querySelector('main h1').hasAttribute('tabindex')), true);
    await p.keyboard.press('Tab');
    is('AC16 after Back, next Tab is the skip link', await active(p), 'Skip to main content');
    await p.context().close();
  }

  /* ===== AC 17 · unsaved changes confirmation ========================== */
  {
    const p = await open(browser, APP('user-management'));
    await p.evaluate(() => CHShell.setUnsavedChanges(true));
    await p.click('label[for=ch-env-test]');
    await p.waitForSelector('#ch-env-modal.show');
    await p.waitForTimeout(300);
    is('AC17 modal title', await text(p, '#ch-env-modal-title'), 'Switch to Test without saving?');
    is('AC17 modal body', await text(p, '#ch-env-modal .modal-body'), 'You have unsaved changes on this page. If you switch now, they’ll be lost.');
    is('AC17 actions, Primary last', (await p.$$eval('#ch-env-modal .modal-footer .btn', bs => bs.map(b => b.className.split(' ')[1] + ':' + b.textContent.trim()))).join(' | '),
       'btn-secondary:Stay on this page | btn-primary:Switch to Test');
    is('AC17 environment not yet switched', await checkedEnv(p), 'live');
    await p.click('#ch-env-modal-stay');
    await p.waitForTimeout(500);
    is('AC17 Stay closes the modal', await p.isVisible('#ch-env-modal'), false);
    is('AC17 Stay keeps Live', await checkedEnv(p), 'live');
    is('AC17 Stay returns focus to Live', await active(p), 'ch-env-live');
    is('AC17 Stay keeps the page', p.url(), APP('user-management'));
    /* Escape and the close control behave like Stay. */
    await p.click('label[for=ch-env-test]');
    await p.waitForSelector('#ch-env-modal.show');
    await p.waitForTimeout(300);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
    is('AC17 Escape keeps Live', await checkedEnv(p), 'live');
    is('AC17 Escape returns focus to Live', await active(p), 'ch-env-live');
    await p.click('label[for=ch-env-test]');
    await p.waitForSelector('#ch-env-modal.show');
    await p.waitForTimeout(300);
    await p.click('#ch-env-modal .btn-close');
    await p.waitForTimeout(500);
    is('AC17 close control keeps Live', await checkedEnv(p), 'live');
    /* Switch discards and continues. */
    await p.click('label[for=ch-env-test]');
    await p.waitForSelector('#ch-env-modal.show');
    await p.waitForTimeout(300);
    await Promise.all([p.waitForNavigation(), p.click('#ch-env-modal-switch')]);
    await settle(p);
    is('AC17 Switch continues to Test', await checkedEnv(p), 'test');
    is('AC17 Switch lands on base page', p.url(), APP('user-management'));
    is('AC17 Switch shows alert', await text(p, '#ch-env-alert'), ALERT);
    /* No unsaved changes, no modal. */
    await Promise.all([p.waitForNavigation(), p.click('label[for=ch-env-live]')]);
    await settle(p);
    is('AC17 no modal without unsaved changes', await checkedEnv(p), 'live');
    await p.context().close();
  }

  /* ===== Accessibility requirements =================================== */
  {
    const p = await open(browser, HOME);
    is('A11y banner landmark', await p.evaluate(() => document.getElementById('ch-header').tagName), 'HEADER');
    is('A11y breadcrumb landmark named', await p.getAttribute('#ch-context nav', 'aria-label'), 'Breadcrumb');
    is('A11y main landmark', await p.evaluate(() => document.querySelectorAll('main#main').length), 1);
    is('A11y lockup name', await p.getAttribute('.ch-lockup', 'aria-label'), 'Configuration Hub home');
    is('A11y lockup image decorative', await p.getAttribute('.ch-lockup img', 'alt'), '');
    is('A11y environment group', await p.evaluate(() => { const g = document.querySelector('.ch-env'); return g.getAttribute('role') + ':' + g.getAttribute('aria-label'); }), 'radiogroup:Environment');
    is('A11y option names', await p.$$eval('.ch-env label', ls => ls.map(l => l.textContent.trim()).join(',')), 'Live,Test');
    ok('A11y options are native radios', await p.evaluate(() => [...document.querySelectorAll('.ch-env input')].every(i => i.type === 'radio' && i.name === 'ch-environment' && document.querySelector('label[for=' + i.id + ']'))));
    ok('A11y selected option outlined, not colour alone', await p.evaluate(() => {
      const on = getComputedStyle(document.querySelector('label[for=ch-env-live]')).borderTopColor;
      const off = getComputedStyle(document.querySelector('label[for=ch-env-test]')).borderTopColor;
      return on !== off && /rgba\(0, 0, 0, 0\)|transparent/.test(off);
    }));
    /* Focus order: skip link, lockup, environment (selected option), Mobius, avatar, page content. */
    const order = [];
    for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); order.push(await active(p)); }
    is('A11y focus order', order.join(' > '),
       'Skip to main content > Configuration Hub home > ch-env-live > ch-mobius > ch-account-toggle > Open Onboarding Form');
    ok('A11y visible focus on the avatar', await p.evaluate(() => {
      document.getElementById('ch-account-toggle').focus();
      const s = getComputedStyle(document.getElementById('ch-account-toggle'));
      return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
    }));
    is('A11y header is sticky', await p.evaluate(() => getComputedStyle(document.getElementById('ch-header')).position), 'sticky');
    is('A11y no unread indicator on avatar', await p.evaluate(() => document.querySelectorAll('#ch-account-toggle .badge, #ch-account-toggle .indicator').length), 0);
    is('A11y reserved app-nav slot empty on home', await p.evaluate(() => document.getElementById('ch-app-nav').children.length), 0);
    await p.context().close();
  }

  /* ===== Gap 5 · breadcrumb truncation and the feature contract ======== */
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    const LONG_SECTION = 'Workflow schedules for renewals and mid-term adjustments';
    const LONG_ITEM = 'Renewal reminder for commercial combined policies';
    /* A stand-in feature page: the placeholder's own HTML, re-initialised the
       way a feature prototype calls the shell, with a three-crumb trail. */
    await p.route('**/prototypes/CH-SHELL/contract-fixture.html', async route => {
      const res = await route.fetch({ url: ROOT + 'app.html' });
      const html = (await res.text()).replace(/<script>\s*\(function \(\) \{[\s\S]*?<\/script>/,
        `<script>
          document.getElementById('ch-placeholder-heading').textContent = 'Renewal reminder';
          CHShell.init({
            app: 'user-management',
            page: 'Renewal reminder',
            breadcrumb: [
              { label: 'User Management', href: 'app.html?app=user-management' },
              { label: ${JSON.stringify(LONG_SECTION)}, href: '#section' },
              { label: ${JSON.stringify(LONG_ITEM)} }
            ]
          });
        </script>`);
      route.fulfill({ status: 200, contentType: 'text/html', body: html });
    });
    await p.goto(ROOT + 'contract-fixture.html', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: STILL });
    await p.waitForTimeout(300);
    is('Contract title pattern', await p.title(), 'Renewal reminder | User Management | Configuration Hub');
    is('Contract three crumbs', await p.locator('#ch-context .breadcrumb-item').count(), 3);
    is('Contract app crumb links to base page', await p.getAttribute('#ch-context .breadcrumb-item:first-child a', 'href'), 'app.html?app=user-management');
    is('Contract only the last crumb is current', await p.locator('#ch-context [aria-current=page]').count(), 1);
    ok('Gap5 long section crumb truncated', await p.evaluate(() => { const e = document.querySelectorAll('#ch-context .breadcrumb-link')[1]; return e.scrollWidth > e.clientWidth; }));
    is('Gap5 section Tooltip full text', await p.evaluate(() => document.querySelectorAll('#ch-context .breadcrumb-link')[1].getAttribute('data-bs-title')), LONG_SECTION);
    is('Gap5 section accessible name full text', await p.evaluate(() => document.querySelectorAll('#ch-context .breadcrumb-link')[1].textContent), LONG_SECTION);
    is('Gap5 current crumb Tooltip', await p.getAttribute('#ch-context .ch-crumb-text', 'data-bs-title'), LONG_ITEM);
    is('Gap5 truncated current crumb not focusable', await p.evaluate(() => { const e = document.querySelector('#ch-context .ch-crumb-text'); return e.hasAttribute('tabindex') + '/' + e.tabIndex; }), 'false/-1');
    is('Gap5 short crumb not truncated', await p.evaluate(() => document.querySelector('#ch-context .breadcrumb-link').classList.contains('ch-truncated')), false);
    is('Gap5 breadcrumb on one line', await p.evaluate(() => { const items = [...document.querySelectorAll('#ch-context .breadcrumb-item')].map(i => Math.round(i.getBoundingClientRect().top)); return new Set(items).size; }), 1);
    is('Gap5 Buckholt divider (no override)', await p.evaluate(() => document.querySelector('#ch-context nav').hasAttribute('style')), false);
    await p.hover('#ch-context .ch-crumb-text');
    await p.waitForTimeout(1000);
    is('Gap5 current crumb Tooltip on hover', await text(p, '.tooltip .tooltip-inner'), LONG_ITEM);
    await p.mouse.move(700, 600);
    await p.waitForTimeout(400);
    await p.focus('#ch-context .breadcrumb-item:nth-child(2) a');
    await p.waitForTimeout(1000);
    is('Gap5 linked crumb Tooltip on focus', await text(p, '.tooltip .tooltip-inner'), LONG_SECTION);
    is('Gap5 linked crumb keeps link styling', await p.evaluate(() => document.querySelectorAll('#ch-context a[data-bs-toggle]').length), 0);
    /* A breadcrumb link is an ordinary page load: focus at the top. */
    await Promise.all([p.waitForNavigation(), p.click('#ch-context .breadcrumb-item:first-child a')]);
    await settle(p);
    is('Breadcrumb link: base page', p.url(), APP('user-management'));
    is('Breadcrumb link: focus at the top', await p.evaluate(() => document.activeElement === document.body), true);
    await p.keyboard.press('Tab');
    is('Breadcrumb link: next Tab is the skip link', await active(p), 'Skip to main content');
    await context.close();
  }

  await browser.close();
  t.done();
})().catch(e => { console.error(e); process.exit(1); });
