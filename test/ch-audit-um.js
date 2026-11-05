/* Audit Centre (CH-AUDIT-UM): every acceptance criterion in
   prototypes/CH-AUDIT-UM/ch-audit-um-spec.md, plus its flows (AU-01 to
   AU-04), its accessibility requirements, the CH-SHELL contract items and
   the Buckholt gaps the prototype builds.

   Blocks headed `AC n` check the criteria in the order the spec lists them
   (revision 3: 1 to 17). Run against the mirror like the other suites:

     node test/ch-audit-um.js
*/
const { launch, BASE, STILL, counter } = require('./config');
const t = counter();
const { is, ok } = t;

const ROOT = BASE + '/prototypes/CH-AUDIT-UM/';
const PAGE = ROOT + 'index.html';
const HOME = ROOT + 'home.html';
const CH = PAGE + '#config-hub-users';
const TAB_LABELS = 'Mobius users|Config Hub users|AutoMATE|Third-Party Services';
const crumbs = page => page.$$eval('#ch-context .breadcrumb-item', is => is.map(i => i.textContent.trim()).join(' > '));
const selectedTab = page => page.$$eval('[role=tab]', ts => ts.filter(t => t.getAttribute('aria-selected') === 'true').map(t => t.textContent.trim()).join('|'));
async function showTab(page, id) {
  await page.click('#au-tab-' + id + '-tab');
  await until(page, i => document.getElementById('au-tab-' + i).classList.contains('show'), id);
  await wait(page);
}

async function open(browser, url, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: STILL });
  return page;
}

async function go(page, sel) {
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click(sel)]);
  await page.addStyleTag({ content: STILL });
  await page.waitForTimeout(150);
}

const wait = (page, ms) => page.waitForTimeout(ms || 250);
const until = (page, fn, arg) => page.waitForFunction(fn, arg, { timeout: 4000 }).catch(() => {});
const text = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; }, sel);
const headers = page => page.$$eval('#au-head th', ths => ths.map(th => th.textContent.trim()).filter(Boolean).join('|'));
const rows = page => page.$$eval('#au-rows tr[data-key]', trs => trs.map(tr => [...tr.children].map(td => td.textContent.replace(/\s+/g, ' ').trim())));
const visibleNs = page => page.evaluate(() => AUPage.visible().map(r => r.n));
const tipOf = (page, sel) => page.evaluate(s => { const d = document.querySelector(s).getAttribute('aria-describedby'); const t = d && document.getElementById(d); return t ? t.textContent.trim() : null; }, sel);
const showing = page => text(page, '#au-showing');
const announced = page => until(page, () => document.getElementById('ch-announcer').textContent.trim() !== '');
const announcement = page => page.evaluate(() => document.getElementById('ch-announcer').textContent.trim());
const clearAnnouncer = page => page.evaluate(() => { document.getElementById('ch-announcer').textContent = ''; });
const drawerOpen = page => page.evaluate(() => !!document.querySelector('.au-drawer.show'));
const drawerShown = page => until(page, () => { const d = document.querySelector('.au-drawer.show'); return d && d.contains(document.activeElement); });
const drawerGone = page => until(page, () => !document.querySelector('.au-drawer') && !document.querySelector('.offcanvas-backdrop'));
const keyOf = (page, n, part) => page.evaluate(([n, part]) => {
  const r = AUPage.visible().filter(x => x.n === n)[part || 0];
  return r ? r.key : null;
}, [n, part]);
/* The row for a record, wherever it is: go to its page first. */
async function rowFor(page, n) {
  const where = await page.evaluate(n => {
    const list = AUPage.visible();
    const i = list.findIndex(r => r.n === n);
    return i === -1 ? null : { page: Math.floor(i / AUPage.state().perPage) + 1, key: list[i].key };
  }, n);
  if (!where) return null;
  if (await page.evaluate(() => AUPage.state().page) !== where.page) {
    await page.click('#au-pages button[data-page="' + where.page + '"]');
    await wait(page, 150);
  }
  return where.key;
}
async function openDrawer(page, n) {
  const key = await rowFor(page, n);
  await page.click('.au-chevron[data-key="' + key + '"]');
  await drawerShown(page);
  return key;
}
const drawerSections = page => page.$$eval('.au-drawer .au-drawer-section h4', hs => hs.map(h => h.textContent.trim()).join('|'));
const drawerPairs = (page, section) => page.$$eval('.au-drawer .au-drawer-section', (ss, name) => {
  const s = ss.find(x => x.querySelector('h4').textContent.trim() === name);
  return s ? [...s.querySelectorAll(':scope > .key-value-list > .key-value')].map(k => k.querySelector('.key').textContent.trim() + '=' + k.querySelector('.value').textContent.replace(/\s+/g, ' ').trim()).join(';') : null;
}, section);
const changeRows = page => page.$$eval('.au-drawer .au-change-table tbody tr:not(.table-gap)', trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim()).join(':')).join(';'));
async function tick(page, toggle, label) {
  await page.click('#' + toggle);
  await wait(page, 150);
  await page.click('#' + toggle.replace('-toggle', '-menu') + ' label:text-is("' + label + '")');
  await wait(page, 100);
  await page.keyboard.press('Escape');
  await wait(page, 450);
}
async function viewCh(page) { await showTab(page, 'ch'); }

(async () => {
  const browser = await launch();

  /* ===== AC 1 · base page: four tabs, Mobius users, Account type shown === */
  {
    const p = await open(browser, PAGE);
    is('AC1 no page errors', p.errors.join('|'), '');
    is('AC1 tabs in order', await p.$$eval('[role=tab]', ts => ts.map(t => t.textContent.trim()).join('|')), TAB_LABELS);
    is('AC1 Mobius users selected', await selectedTab(p), 'Mobius users');
    is('AC1 one tab selected', await p.locator('[role=tab][aria-selected=true]').count(), 1);
    is('AC1 Mobius panel shown', await p.isVisible('#au-tab-mobius #au-table'), true);
    is('AC1 Account type filter visible', await p.isVisible('#au-account'), true);
    is('AC1 Account type column', await headers(p), 'Action|Affected user|Change summary|Account type|Changed by|Date and time|Details');
    is('AC1 Account type options', await p.$$eval('#au-account option', os => os.map(o => o.textContent).join('|')), 'All|Tenant|SSO|Tenant and SSO');
    is('AC1 Account type default', await p.inputValue('#au-account'), 'All');
    /* Page header (AU-00-01) and the CH-SHELL contract items. */
    is('AC1 title', await p.title(), 'Mobius users | Audit Centre | Configuration Hub');
    is('AC1 breadcrumb', await crumbs(p), 'Audit Centre > Mobius users');
    is('AC1 current crumb matches tab', await text(p, '#ch-context .breadcrumb-item.active'), await selectedTab(p));
    is('AC1 heading', await text(p, 'h1'), 'Audit Centre');
    is('AC1 one h1', await p.locator('h1').count(), 1);
    is('AC1 description', await text(p, '.page-panel > .text-block p'), 'View changes made across Configuration Hub applications.');
    is('AC1 filter labels', await p.$$eval('.au-filters .form-label', ls => ls.map(l => l.textContent.trim()).join('|')), 'Search|Date|Action type|Account type|Changed by');
    is('AC1 search placeholder', await p.getAttribute('#au-search', 'placeholder'), 'Search');
    is('AC1 date options', await p.$$eval('#au-date option', os => os.map(o => o.textContent).join('|')), 'Last 7 days|Last 30 days|Last 90 days|Last 12 months');
    is('AC1 date default', await p.$eval('#au-date', s => s.options[s.selectedIndex].text), 'Last 30 days');
    is('AC1 Action type empty', await text(p, '#au-action-value'), 'Select');
    is('AC1 Changed by empty', await text(p, '#au-by-value'), 'Anyone');
    is('AC1 record type', await text(p, '#au-record-label'), 'Record type: Grouped');
    /* Record type at the right end of the filter row. */
    const right = await p.evaluate(() => {
      const bar = document.querySelector('.au-filter-bar').getBoundingClientRect();
      const rt = document.querySelector('.au-record-type').getBoundingClientRect();
      const by = document.getElementById('au-by-filter').getBoundingClientRect();
      return Math.abs(rt.right - bar.right) <= 1 && rt.left > by.right && Math.abs(rt.bottom - by.bottom) < 8;
    });
    is('AC1 record type right-aligned on the filter row', right, true);
    const order = await p.evaluate(() => {
      const y = s => document.querySelector(s).getBoundingClientRect().top;
      return y('[role=tablist]') < y('.au-filter-bar') && y('.au-filter-bar') < y('.au-table');
    });
    is('AC1 tabs, filters, table in order', order, true);
    /* Mobius Live seed: 9 rows in the last 30 days, newest first. */
    is('AC1 Mobius rows in 30 days', await showing(p), 'Showing 1-9 of 9');
    is('AC1 default sort newest first', await p.getAttribute('#au-head th[data-sort-key=when]', 'aria-sort'), 'descending');
    const mob = await rows(p);
    is('AC1 first Mobius row', mob[0].slice(0, 5).join('|'), 'Access level changed|JSJane Smith|Advisor → Administrator|Tenant|JDJohn Doe');
    const times = await p.evaluate(() => AUPage.visible().map(r => r.when.getTime()));
    ok('AC1 rows newest first', times.every((v, i) => i === 0 || times[i - 1] >= v));
    is('AC1 one-line filter row at 1440', await p.evaluate(() => {
      const ts = [...document.querySelectorAll('.au-filters > .input:not([hidden])')].map(e => Math.round(e.getBoundingClientRect().bottom));
      return new Set(ts).size;
    }), 1);
    is('AC1 no horizontal scroll', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await p.context().close();
  }

  /* ===== AC 2 · select the Config Hub users tab ========================= */
  {
    const p = await open(browser, PAGE);
    await clearAnnouncer(p);
    await viewCh(p);
    is('AC2 Config Hub users selected', await selectedTab(p), 'Config Hub users');
    is('AC2 breadcrumb', await crumbs(p), 'Audit Centre > Config Hub users');
    is('AC2 title', await p.title(), 'Config Hub users | Audit Centre | Configuration Hub');
    is('AC2 view in its panel', await p.isVisible('#au-tab-ch #au-table'), true);
    is('AC2 Mobius panel hidden', await p.isVisible('#au-tab-mobius'), false);
    is('AC2 full name elsewhere', await p.getAttribute('#au-table', 'aria-label'), 'Configuration Hub users audit records');
    is('AC2 no Account type filter', await p.isVisible('#au-account'), false);
    is('AC2 no Account type column', await headers(p), 'Action|Affected user|Change summary|Changed by|Date and time|Details');
    is('AC2 showing', await showing(p), 'Showing 1-10 of 22');
    is('AC2 URL fragment', new URL(p.url()).hash, '#config-hub-users');
    is('AC2 no reload', await p.evaluate(() => performance.getEntriesByType('navigation')[0].type), 'navigate');
    is('AC2 page 1 records', (await visibleNs(p)).slice(0, 10).join(','), '1,2,3,4,5,6,7,8,9,10');
    is('AC2 three pages', await p.$$eval('#au-pages button[data-page]', bs => bs.filter(b => /^\d+$/.test(b.dataset.page)).length), 3);
    is('AC2 Action type options', await p.$$eval('#au-action-menu label', ls => ls.map(l => l.textContent.trim()).join('|')),
      'Invitation sent|Invitation resent|Invitation expired|Invitation cancelled|Invitation deleted|User created|Name changed|Role changed|User activated|User deactivated|User updated|MFA reset|User deleted');
    is('AC2 Changed by options', await p.$$eval('#au-by-menu label', ls => ls.map(l => l.textContent.trim()).join('|')),
      'Emily Tailor|John Doe|Laura Chen|Priya Shah|Sarah Brown|Daniel Hughes|System');
    is('AC2 Open GI group heading', await text(p, '#au-by-menu .au-option-group .menu-section-header'), 'Open GI');
    is('AC2 Open GI group holds Open GI users', await p.$$eval('#au-by-menu .au-option-group label', ls => ls.map(l => l.textContent.trim()).join('|')), 'Daniel Hughes');
    is('AC2 Open GI group named', await p.evaluate(() => {
      const g = document.querySelector('#au-by-menu [role=group]');
      return document.getElementById(g.getAttribute('aria-labelledby')).textContent.trim();
    }), 'Open GI');
    /* Back to Mobius users. */
    await showTab(p, 'mobius');
    is('AC2 back: Account type filter', await p.isVisible('#au-account'), true);
    is('AC2 back: fragment', new URL(p.url()).hash, '#mobius-users');
    is('AC2 back: breadcrumb', await crumbs(p), 'Audit Centre > Mobius users');
    await p.context().close();
  }

  /* ===== AC 3 · each tab keeps its own state (AU-01) ===================== */
  {
    const p = await open(browser, PAGE);
    await viewCh(p);
    await p.selectOption('#au-date', '90');
    await wait(p);
    await p.click('#au-head th[data-sort-key=action] .table-sort');
    await wait(p);
    await p.click('#au-pages button[data-page="2"]');
    await wait(p);
    const before = { first: (await rows(p))[0][0], show: await showing(p) };
    is('AC3 Last 90 days count', before.show, 'Showing 11-20 of 25');
    await showTab(p, 'mobius');
    is('AC3 Mobius view untouched: date', await p.inputValue('#au-date'), '30');
    is('AC3 Mobius view untouched: sort', await p.getAttribute('#au-head th[data-sort-key=when]', 'aria-sort'), 'descending');
    is('AC3 Mobius view untouched: page', await text(p, '#au-pages [aria-current=page]'), '1');
    await viewCh(p);
    is('AC3 date restored', await p.inputValue('#au-date'), '90');
    is('AC3 sort restored', await p.getAttribute('#au-head th[data-sort-key=action]', 'aria-sort'), 'ascending');
    is('AC3 page restored', await text(p, '#au-pages [aria-current=page]'), '2');
    is('AC3 same rows', (await rows(p))[0][0], before.first);
    is('AC3 same count', await showing(p), before.show);
    /* Search and Changed by are per view too. */
    await p.fill('#au-search', 'novak');
    await wait(p, 500);
    await showTab(p, 'mobius');
    is('AC3 Mobius search empty', await p.inputValue('#au-search'), '');
    await viewCh(p);
    is('AC3 CH search kept', await p.inputValue('#au-search'), 'novak');
    /* An environment change returns to the base page, Mobius users, defaults. */
    await go(p, 'label[for=ch-env-test]');
    is('AC3 env: base page', new URL(p.url()).pathname.endsWith('/CH-AUDIT-UM/index.html'), true);
    is('AC3 env: no fragment', new URL(p.url()).hash, '');
    is('AC3 env: Mobius users', await selectedTab(p), 'Mobius users');
    is('AC3 env: default date', await p.inputValue('#au-date'), '30');
    is('AC3 env: Test title', await p.title(), '[Test] Mobius users | Audit Centre | Configuration Hub');
    await p.context().close();
  }

  /* ===== AC 4 · AutoMATE tab: placeholder (AU-00-04) ==================== */
  {
    const p = await open(browser, PAGE);
    await viewCh(p);
    await p.selectOption('#au-date', '90');
    await wait(p);
    await showTab(p, 'automate');
    is('AC4 AutoMATE selected', await selectedTab(p), 'AutoMATE');
    is('AC4 breadcrumb', await crumbs(p), 'Audit Centre > AutoMATE');
    is('AC4 title', await p.title(), 'AutoMATE | Audit Centre | Configuration Hub');
    is('AC4 placeholder', await text(p, '#au-tab-automate'), 'This tab is not part of this prototype.');
    is('AC4 no filters or table', await p.isVisible('#au-search') || await p.isVisible('#au-table') || await p.isVisible('#au-pagination'), false);
    is('AC4 fragment', new URL(p.url()).hash, '#automate');
    await showTab(p, 'tps');
    is('AC4 Third-Party Services breadcrumb', await crumbs(p), 'Audit Centre > Third-Party Services');
    is('AC4 Third-Party Services title', await p.title(), 'Third-Party Services | Audit Centre | Configuration Hub');
    is('AC4 Third-Party Services placeholder', await text(p, '#au-tab-tps'), 'This tab is not part of this prototype.');
    is('AC4 Third-Party Services fragment', new URL(p.url()).hash, '#third-party-services');
    /* Back to Config Hub users: its state survived the placeholder tabs. */
    await viewCh(p);
    is('AC4 Config Hub users state kept', await p.inputValue('#au-date'), '90');
    is('AC4 no errors', p.errors.join('|'), '');
    await p.context().close();
  }

  /* ===== AC 5 · a link to the Config Hub users tab ======================= */
  {
    const q = await open(browser, CH);
    await until(q, () => document.getElementById('au-tab-ch').classList.contains('show'));
    is('AC5 fragment selects the tab', await selectedTab(q), 'Config Hub users');
    is('AC5 breadcrumb', await crumbs(q), 'Audit Centre > Config Hub users');
    is('AC5 title', await q.title(), 'Config Hub users | Audit Centre | Configuration Hub');
    is('AC5 count', await showing(q), 'Showing 1-10 of 22');
    is('AC5 no errors', q.errors.join('|'), '');
    await q.context().close();
    for (const [hash, label] of [['#automate', 'AutoMATE'], ['#third-party-services', 'Third-Party Services'], ['#mobius-users', 'Mobius users'], ['#nonsense', 'Mobius users'], ['#configuration-hub-users', 'Mobius users']]) {
      const r = await open(browser, PAGE + hash);
      await wait(r, 400);
      is('AC5 ' + hash + ' opens', await selectedTab(r), label);
      is('AC5 ' + hash + ' breadcrumb', await crumbs(r), 'Audit Centre > ' + label);
      await r.context().close();
    }
    /* Editing the fragment in place switches the tab. */
    const s2 = await open(browser, PAGE);
    await s2.evaluate(() => { window.location.hash = '#config-hub-users'; });
    await until(s2, () => document.getElementById('au-tab-ch').classList.contains('show'));
    is('AC5 hashchange switches', await selectedTab(s2), 'Config Hub users');
    await s2.context().close();
  }

  /* ===== AC 6 · no content switcher, no "User Management" tab =========== */
  {
    const p = await open(browser, PAGE);
    is('AC6 no switcher', await p.locator('#main [role=radiogroup], .au-switcher, input[name=au-user-type]').count(), 0);
    is('AC6 no User Management tab', await p.$$eval('[role=tab]', ts => ts.some(t => /User Management/.test(t.textContent))), false);
    is('AC6 four tabs', await p.locator('[role=tab]').count(), 4);
    await p.context().close();
  }

  /* ===== AC 7 · search "k.novak" ========================================= */
  {
    const p = await open(browser, CH);
    await clearAnnouncer(p);
    await p.click('#au-pages button[data-page="2"]');
    await wait(p);
    await p.fill('#au-search', 'k.novak');
    await wait(p, 600);
    is('AC7 records 7, 8 and 19', (await visibleNs(p)).sort((a, b) => a - b).join(','), '7,8,19');
    is('AC7 three rows shown', (await rows(p)).length, 3);
    is('AC7 page reset to 1', await text(p, '#au-pages [aria-current=page]'), '1');
    await announced(p);
    is('AC7 announced', await announcement(p), '3 results');
    /* Not case sensitive; matches name, username, Changed by and summary. */
    await p.fill('#au-search', 'K.NOVAK');
    await wait(p, 600);
    is('AC7 case-insensitive', (await visibleNs(p)).length, 3);
    await p.fill('#au-search', 'twalker');
    await wait(p, 600);
    is('AC7 username', (await visibleNs(p)).sort((a, b) => a - b).join(','), '2,4,12');
    await p.fill('#au-search', 'daniel');
    await wait(p, 600);
    is('AC7 Changed by name', (await visibleNs(p)).sort((a, b) => a - b).join(','), '5,18,21,22');
    await p.fill('#au-search', 'Link expired');
    await wait(p, 600);
    is('AC7 change summary', (await visibleNs(p)).join(','), '8');
    await p.fill('#au-search', 'marcus');
    await wait(p, 600);
    is('AC7 bulk deletion matches its accounts', (await visibleNs(p)).join(','), '9');
    /* Results update after typing pauses, not on each key. */
    await p.fill('#au-search', '');
    await wait(p, 600);
    await p.type('#au-search', 'zzz', { delay: 20 });
    is('AC7 waits for the pause', (await rows(p)).length, 10);
    await wait(p, 600);
    is('AC7 no results copy', await text(p, '#au-state'), 'No results found. Try changing your search or filters.');
    is('AC7 no results hides pagination', await p.isVisible('#au-pagination'), false);
    is('AC7 filters stay usable', await p.isEnabled('#au-date'), true);
    await p.context().close();
  }

  /* ===== AC 8 · Changed by "System" ====================================== */
  {
    const p = await open(browser, CH);
    await tick(p, 'au-by-toggle', 'System');
    is('AC8 only record 8', (await visibleNs(p)).join(','), '8');
    is('AC8 Changed by label', await text(p, '#au-by-value'), 'System');
    const by = await p.$eval('#au-rows tr[data-key] .au-col-by', td => ({
      text: td.textContent.trim(),
      icon: !!td.querySelector('.avatar .avatar-icon i.fa-user-robot'),
      initials: !!td.querySelector('.avatar-initials')
    }));
    is('AC8 System word', by.text, 'System');
    is('AC8 System avatar', by.icon && !by.initials, true);
    /* AU-02: multi-select display, AND across filters, OR within one. */
    await tick(p, 'au-by-toggle', 'John Doe');
    is('AC8 two ticked', await text(p, '#au-by-value'), '2 selected');
    is('AC8 OR within Changed by', (await visibleNs(p)).sort((a, b) => a - b).join(','), '2,7,8,10,12,13,16,19');
    await tick(p, 'au-action-toggle', 'Invitation sent');
    is('AC8 Action type one', await text(p, '#au-action-value'), 'Invitation sent');
    await tick(p, 'au-action-toggle', 'Invitation resent');
    is('AC8 Action type two', await text(p, '#au-action-value'), '2 selected');
    is('AC8 AND across filters', (await visibleNs(p)).sort((a, b) => a - b).join(','), '7,16,19');
    /* Clearing everything: "Select" / "Anyone" mean all. */
    for (const l of ['Invitation sent', 'Invitation resent']) await tick(p, 'au-action-toggle', l);
    for (const l of ['System', 'John Doe']) await tick(p, 'au-by-toggle', l);
    is('AC8 cleared: Select', await text(p, '#au-action-value'), 'Select');
    is('AC8 cleared: Anyone', await text(p, '#au-by-value'), 'Anyone');
    is('AC8 cleared: all rows', await showing(p), 'Showing 1-10 of 22');
    /* The checklist stays open while ticking; Escape closes it to its trigger. */
    await p.click('#au-action-toggle');
    await wait(p, 150);
    await p.click('#au-action-menu label:text-is("MFA reset")');
    await wait(p, 100);
    is('AC8 stays open while ticking', await p.getAttribute('#au-action-toggle', 'aria-expanded'), 'true');
    await p.keyboard.press('Escape');
    await wait(p, 200);
    is('AC8 Escape closes', await p.getAttribute('#au-action-toggle', 'aria-expanded'), 'false');
    is('AC8 focus back on trigger', await p.evaluate(() => document.activeElement.id), 'au-action-toggle');
    is('AC8 trigger name', await p.evaluate(() => {
      const b = document.getElementById('au-action-toggle');
      return b.getAttribute('aria-labelledby').split(' ').map(id => document.getElementById(id).textContent.trim()).join(' ');
    }), 'Action type MFA reset');
    await p.context().close();
  }

  /* ===== AC 9 · Individual record type (AU-03) =========================== */
  {
    const p = await open(browser, CH);
    await clearAnnouncer(p);
    await p.click('#au-pages button[data-page="2"]');
    await wait(p);
    await p.click('#au-record-toggle');
    await wait(p, 150);
    is('AC9 options', await p.$$eval('#au-record-panel .menu-item', bs => bs.map(b => b.textContent.trim()).join('|')), 'Grouped|Individual');
    is('AC9 current option marked', await p.getAttribute('#au-record-panel [data-record=grouped]', 'aria-current'), 'true');
    await p.click('#au-record-panel [data-record=individual]');
    await wait(p);
    is('AC9 label', await text(p, '#au-record-label'), 'Record type: Individual');
    is('AC9 page back to 1', await text(p, '#au-pages [aria-current=page]'), '1');
    const ns = await visibleNs(p);
    is('AC9 record 6 two rows', ns.filter(n => n === 6).length, 2);
    is('AC9 record 9 four rows', ns.filter(n => n === 9).length, 4);
    is('AC9 total', await showing(p), 'Showing 1-10 of 26');
    const six = await p.evaluate(() => AUPage.visible().filter(r => r.n === 6).map(r => r.action + ':' + r.summary + ':' + r.when.getTime()));
    is('AC9 record 6 split', six.map(s => s.split(':').slice(0, 2).join(':')).sort().join('|'), 'Name changed:Laura Chen → Laura Chen-Ward|Role changed:Viewer → Editor');
    is('AC9 record 6 same time', new Set(six.map(s => s.split(':')[2])).size, 1);
    const nine = await p.evaluate(() => AUPage.visible().filter(r => r.n === 9).map(r => r.action + ':' + r.summary + ':' + (r.affected.name || r.affected.email)));
    is('AC9 record 9 split', nine.sort().join('|'),
      'User deleted:User deleted:Hannah Okafor|User deleted:User deleted:Marcus Reid|User deleted:User deleted:j.fraser@greenlight.co.uk|User deleted:User deleted:r.lewis@greenlight.co.uk');
    const ids = await p.evaluate(() => AUPage.visible().map(r => r.id));
    is('AC9 Event IDs unique', new Set(ids).size, ids.length);
    ok('AC9 Event ID format', ids.every(id => /^evt_[a-z0-9]{8}$/.test(id)));
    await announced(p);
    is('AC9 announced', await announcement(p), '26 results');
    /* Sort, filters and search stay. */
    await p.click('#au-head th[data-sort-key=action] .table-sort');
    await wait(p);
    await p.click('#au-record-toggle');
    await p.click('#au-record-panel [data-record=grouped]');
    await wait(p);
    is('AC9 sort kept', await p.getAttribute('#au-head th[data-sort-key=action]', 'aria-sort'), 'ascending');
    is('AC9 back to grouped', await showing(p), 'Showing 1-10 of 22');
    await p.context().close();
  }

  /* ===== AC 10 · identity as at the event: records 13 and 14 ============== */
  {
    const p = await open(browser, CH);
    const k14 = await rowFor(p, 14);
    const r14 = await p.$eval('tr[data-key="' + k14 + '"]', tr => [...tr.children].map(td => td.textContent.trim()));
    is('AC10 record 14 Affected user name', r14[1].replace(/^[A-Z]{2}/, ''), 'Emily Tailor');
    is('AC10 record 14 Changed by name', r14[3].replace(/^[A-Z]{2}/, ''), 'Emily Tailor');
    is('AC10 record 14 summary', r14[2], 'Invitation accepted');
    const k13 = await rowFor(p, 13);
    const r13 = await p.$eval('tr[data-key="' + k13 + '"]', tr => [...tr.children].map(td => td.textContent.trim()));
    is('AC10 record 13 summary', r13[2], 'Emily Tailor → Emily Taylor');
    is('AC10 record 13 Affected user after change', r13[1].replace(/^[A-Z]{2}/, ''), 'Emily Taylor');
    /* Record 6 shows the name after the change; record 22 the name then. */
    await p.selectOption('#au-date', '90');
    await wait(p);
    const k22 = await rowFor(p, 22);
    is('AC10 record 22 name then', (await p.$eval('tr[data-key="' + k22 + '"] .au-col-affected', td => td.textContent.trim())), 'LCLaura Chen');
    await p.context().close();
  }

  /* ===== AC 11 · record 1: invitee by email, generic avatar =============== */
  {
    const p = await open(browser, CH);
    const k = await rowFor(p, 1);
    const cell = await p.$eval('tr[data-key="' + k + '"] .au-col-affected', td => ({
      text: td.textContent.trim(),
      generic: !!td.querySelector('.avatar .avatar-icon i.fa-user'),
      initials: !!td.querySelector('.avatar-initials')
    }));
    is('AC11 email shown', cell.text, 'oliver.grant@greenlight.co.uk');
    is('AC11 generic avatar, no initials', cell.generic && !cell.initials, true);
    /* Grouped bulk deletion: generic avatar + "4 users". */
    const k9 = await rowFor(p, 9);
    const bulk = await p.$eval('tr[data-key="' + k9 + '"] .au-col-affected', td => td.textContent.trim() + ':' + !!td.querySelector('.avatar-icon'));
    is('AC11 bulk deletion row', bulk, '4 users:true');
    await p.context().close();
  }

  /* ===== AC 12 · record 5 drawer: Open GI Tag ============================= */
  {
    const p = await open(browser, CH);
    await openDrawer(p, 5);
    is('AC12 drawer open', await drawerOpen(p), true);
    is('AC12 header', await text(p, '.au-drawer .blade-title'), 'Audit details');
    is('AC12 title', await text(p, '#au-detail-title'), 'Role changed');
    is('AC12 Changed by', await p.$eval('.au-drawer .au-drawer-section .key-value:nth-child(2) .value', v => v.firstChild.textContent.trim() + '|' + v.querySelector('.tag .tag-label').textContent.trim()), 'Daniel Hughes|Open GI');
    is('AC12 Event information', await drawerPairs(p, 'Event information'),
      'User=Priya Shah;Changed by=Daniel Hughes Open GI;Date and time=' + await p.evaluate(() => {
        const r = AUPage.visible().find(x => x.n === 5); const d = r.when; const z = n => String(n).padStart(2, '0');
        return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + z(d.getHours()) + ':' + z(d.getMinutes());
      }) + ';Event ID=' + await p.evaluate(() => AUPage.visible().find(x => x.n === 5).id));
    is('AC12 sections', await drawerSections(p), 'Event information|Change details');
    is('AC12 change table', await changeRows(p), 'Role:Editor:Administrator');
    is('AC12 change table headers', await p.$$eval('.au-drawer .au-change-table th', ts => ts.map(t => t.textContent.trim()).join('|')), 'Setting|Previous value|New value');
    is('AC12 no Account type', (await drawerPairs(p, 'Event information')).includes('Account type'), false);
    /* Table: the row's Changed by has the Open GI avatar and its Tooltip. */
    await p.keyboard.press('Escape');
    await drawerGone(p);
    const k = await keyOf(p, 5);
    const ogi = await p.$eval('tr[data-key="' + k + '"] .au-col-by', td => ({
      img: td.querySelector('.au-avatar-ogi .avatar-img').getAttribute('alt'),
      tip: td.querySelector('.au-ogi-trigger').getAttribute('data-au-tooltip'),
      focusable: td.querySelector('.au-ogi-trigger').tabIndex === 0
    }));
    is('AC12 Open GI avatar text', ogi.img, 'Open GI user');
    is('AC12 Open GI avatar Tooltip', ogi.tip, 'Open GI user');
    is('AC12 Open GI avatar focusable for its Tooltip', ogi.focusable, true);
    await p.focus('tr[data-key="' + k + '"] .au-ogi-trigger');
    await until(p, s => { const d = document.querySelector(s).getAttribute('aria-describedby'); return d && document.getElementById(d) && document.getElementById(d).classList.contains('show'); }, 'tr[data-key="' + k + '"] .au-ogi-trigger');
    is('AC12 Tooltip on focus', await tipOf(p, 'tr[data-key="' + k + '"] .au-ogi-trigger'), 'Open GI user');
    await p.context().close();
  }

  /* ===== AC 13 · record 9 drawer: four cards ============================= */
  {
    const p = await open(browser, CH);
    await openDrawer(p, 9);
    is('AC13 title', await text(p, '#au-detail-title'), 'User deleted');
    is('AC13 sections', await drawerSections(p), 'Event information|Deleted account details');
    is('AC13 User', (await drawerPairs(p, 'Event information')).split(';')[0], 'User=4 users');
    const cards = await p.$$eval('.au-drawer .au-account-card', cs => cs.map(c => ({
      title: c.querySelector('h5').textContent.trim(),
      keys: [...c.querySelectorAll('.key-value')].map(k => k.querySelector('.key').textContent.trim() + '=' + k.querySelector('.value').textContent.trim()).join(';'),
      initials: !!c.querySelector('.avatar-initials'),
      generic: !!c.querySelector('.avatar-icon')
    })));
    is('AC13 four cards', cards.length, 4);
    is('AC13 order as selected', cards.map(c => c.title).join('|'), 'Marcus Reid|Hannah Okafor|j.fraser@greenlight.co.uk|r.lewis@greenlight.co.uk');
    is('AC13 Marcus', cards[0].keys, 'Username=mreid;Email=marcus.reid@greenlight.co.uk;Role=Viewer;Status=Active');
    is('AC13 Hannah', cards[1].keys, 'Username=hokafor;Email=hannah.okafor@greenlight.co.uk;Role=Editor;Status=Inactive');
    is('AC13 j.fraser no Username', cards[2].keys, 'Email=j.fraser@greenlight.co.uk;Role=Viewer;Status=Link expired');
    is('AC13 r.lewis no Username', cards[3].keys, 'Email=r.lewis@greenlight.co.uk;Role=Viewer;Status=Pending');
    is('AC13 avatars', cards.map(c => c.initials ? 'initials' : 'generic').join(','), 'initials,initials,generic,generic');
    is('AC13 cards not interactive', await p.$$eval('.au-drawer .au-account-card', cs => cs.every(c => !c.querySelector('a, button, input') && !c.matches('.card-clickable, .card-selectable'))), true);
    /* The body scrolls; the header and footer stay fixed. */
    const scroll = await p.evaluate(() => {
      const d = document.querySelector('.au-drawer');
      const body = d.querySelector('.blade-body');
      const h = d.querySelector('.blade-header').getBoundingClientRect().top;
      const f = d.querySelector('.blade-footer').getBoundingClientRect().bottom;
      body.scrollTop = 9999;
      return body.scrollHeight > body.clientHeight && getComputedStyle(body).overflowY === 'auto' &&
        d.querySelector('.blade-header').getBoundingClientRect().top === h && Math.round(f) === window.innerHeight;
    });
    is('AC13 body scrolls, header and footer fixed', scroll, true);
    await p.context().close();
  }

  /* ===== AC 14 · record 7 drawer: resent from Link expired =============== */
  {
    const p = await open(browser, CH);
    await openDrawer(p, 7);
    is('AC14 title', await text(p, '#au-detail-title'), 'Invitation resent');
    is('AC14 sections', await drawerSections(p), 'Event information|Invitation details|Change details');
    const exp = await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 10); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); });
    is('AC14 Invitation details', await drawerPairs(p, 'Invitation details'), 'Email=k.novak@greenlight.co.uk;Role=Viewer;Link expires=' + exp);
    is('AC14 Status row', await changeRows(p), 'Status:Link expired:Pending');
    is('AC14 User is the email', (await drawerPairs(p, 'Event information')).split(';')[0], 'User=k.novak@greenlight.co.uk');
    await p.keyboard.press('Escape');
    await drawerGone(p);
    /* The other AU-04 patterns. */
    const patterns = [
      [1, 'Event information|Invitation details', null],
      [8, 'Event information|Change details', 'Status:Pending:Link expired'],
      [10, 'Event information|Deleted invitation', null],
      [11, 'Event information|Deleted invitation', null],
      [14, 'Event information|User details', null],
      [2, 'Event information|Change details', 'MFA:Set up:Reset'],
      [4, 'Event information|Change details', 'Status:Inactive:Active'],
      [6, 'Event information|Change details', 'Last name:Chen:Chen-Ward;Role:Viewer:Editor'],
      [13, 'Event information|Change details', 'Last name:Tailor:Taylor'],
      [12, 'Event information|Change details', 'Status:Active:Inactive']
    ];
    for (const [n, sections, change] of patterns) {
      await openDrawer(p, n);
      is('AC14 pattern ' + n + ' sections', await drawerSections(p), sections);
      if (change) is('AC14 pattern ' + n + ' change rows', await changeRows(p), change);
      if (n === 1) {
        const exp1 = await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 14); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); });
        is('AC14 record 1 invitation', await drawerPairs(p, 'Invitation details'), 'Email=oliver.grant@greenlight.co.uk;Role=Editor;Link expires=' + exp1);
      }
      if (n === 10) {
        is('AC14 record 10 card', await p.$eval('.au-drawer .au-account-card', c => [...c.querySelectorAll('.key-value')].map(k => k.querySelector('.key').textContent + '=' + k.querySelector('.value').textContent).join(';') + ':' + !!c.querySelector('.avatar-icon')), 'Email=a.patel@greenlight.co.uk;Role=Editor;Status=Pending:true');
      }
      if (n === 11) {
        is('AC14 record 11 status', await p.$eval('.au-drawer .au-account-card', c => [...c.querySelectorAll('.key-value')].pop().textContent.replace(/\s+/g, '')), 'StatusLinkexpired');
      }
      if (n === 14) {
        is('AC14 record 14 user details', await drawerPairs(p, 'User details'),
          'Username=etaylor;First name=Emily;Last name=Tailor;Email=emily.taylor@greenlight.co.uk;Role=Editor;Status=Active;MFA=Set up');
      }
      await p.click('#au-drawer-close');
      await drawerGone(p);
    }
    /* Field labels in sentence case. */
    await openDrawer(p, 14);
    const keys = await p.$$eval('.au-drawer .key', ks => ks.map(k => k.textContent.trim()));
    ok('AC14 sentence-case labels', keys.every(k => k === 'Event ID' || k === 'MFA' || /^[A-Z][a-z ]*$/.test(k)));
    await p.context().close();
  }

  /* ===== AC 15 · Escape closes, focus returns to the chevron ============= */
  {
    const p = await open(browser, CH);
    const key = await openDrawer(p, 3);
    is('AC15 focus on title', await p.evaluate(() => document.activeElement.id), 'au-detail-title');
    is('AC15 dialog', await p.$eval('.au-drawer', d => d.getAttribute('role') + ':' + d.getAttribute('aria-modal')), 'dialog:true');
    is('AC15 named by its title', await p.evaluate(() => document.getElementById(document.querySelector('.au-drawer').getAttribute('aria-labelledby')).textContent.trim()), 'MFA reset');
    is('AC15 close icon name', await p.getAttribute('.au-drawer .blade-close', 'aria-label'), 'Close');
    is('AC15 footer', await text(p, '.au-drawer .blade-footer'), 'Close');
    is('AC15 Close is Primary', await p.$eval('#au-drawer-close', b => b.classList.contains('btn-primary')), true);
    is('AC15 row selected', await p.$eval('tr[data-key="' + key + '"]', tr => tr.classList.contains('au-selected')), true);
    is('AC15 one row selected', await p.locator('tr.au-selected').count(), 1);
    /* Tab is contained. */
    const inside = [];
    for (let i = 0; i < 6; i++) {
      await p.keyboard.press('Tab');
      inside.push(await p.evaluate(() => !!document.activeElement.closest('.au-drawer')));
    }
    ok('AC15 Tab contained', inside.every(Boolean));
    await p.keyboard.press('Shift+Tab');
    ok('AC15 Shift+Tab contained', await p.evaluate(() => !!document.activeElement.closest('.au-drawer')));
    await p.keyboard.press('Escape');
    await drawerGone(p);
    is('AC15 closed', await drawerOpen(p), false);
    is('AC15 focus on chevron', await p.evaluate(() => document.activeElement.matches('.au-chevron') && document.activeElement.dataset.key), key);
    is('AC15 row deselected', await p.locator('tr.au-selected').count(), 0);
    /* Close, the close icon and the scrim do the same. */
    for (const how of ['#au-drawer-close', '.au-drawer .blade-close', 'scrim']) {
      await p.click('.au-chevron[data-key="' + key + '"]');
      await drawerShown(p);
      if (how === 'scrim') await p.mouse.click(100, 450);
      else await p.click(how);
      await drawerGone(p);
      is('AC15 ' + how + ' closes', await drawerOpen(p), false);
      is('AC15 ' + how + ' focus back', await p.evaluate(() => document.activeElement.dataset.key), key);
    }
    /* A row click opens it too; focus still returns to that row's chevron. */
    await p.click('tr[data-key="' + key + '"] .au-col-action');
    await drawerShown(p);
    is('AC15 row click opens', await drawerOpen(p), true);
    await p.keyboard.press('Escape');
    await drawerGone(p);
    is('AC15 row click: focus to chevron', await p.evaluate(() => document.activeElement.matches('.au-chevron') && document.activeElement.dataset.key), key);
    await p.context().close();
  }

  /* ===== AC 16 · Test environment: empty state ========================== */
  {
    const p = await open(browser, PAGE);
    await go(p, 'label[for=ch-env-test]');
    is('AC16 Mobius Test: first five rows', await showing(p), 'Showing 1-5 of 5');
    is('AC16 Mobius Test rows', await p.evaluate(() => AUPage.visible().map(r => r.n).sort((a, b) => a - b).join(',')), '1,2,3,4,5');
    await viewCh(p);
    is('AC16 empty copy', await text(p, '#au-state'), 'No changes in this period.');
    is('AC16 empty state kind', await p.getAttribute('#au-state', 'data-state'), 'empty');
    is('AC16 pagination hidden', await p.isVisible('#au-pagination'), false);
    is('AC16 filters usable', await p.isEnabled('#au-search'), true);
    await p.selectOption('#au-date', '365');
    await wait(p);
    is('AC16 still empty with a wider range', await text(p, '#au-state'), 'No changes in this period.');
    await p.fill('#au-search', 'x');
    await wait(p, 600);
    is('AC16 with a search it is no results', await text(p, '#au-state'), 'No results found. Try changing your search or filters.');
    /* Live with a short range and no filters: empty too. */
    const q = await open(browser, CH);
    await q.selectOption('#au-date', '7');
    await wait(q);
    /* "Last 7 days" is today and the six days before it: records 1 to 9. */
    is('AC16 Live 7 days', await showing(q), 'Showing 1-9 of 9');
    await q.context().close();
    await p.context().close();
  }

  /* ===== AC 17 · Mobius chevron is inert ================================ */
  {
    const p = await open(browser, PAGE);
    const key = await p.$eval('#au-rows tr[data-key]', tr => tr.dataset.key);
    await p.click('.au-chevron[data-key="' + key + '"]');
    await wait(p, 500);
    is('AC17 no drawer', await p.locator('.au-drawer').count(), 0);
    is('AC17 no row selected', await p.locator('tr.au-selected').count(), 0);
    await p.click('tr[data-key="' + key + '"] .au-col-action');
    await wait(p, 400);
    is('AC17 row click inert', await p.locator('.au-drawer').count(), 0);
    is('AC17 chevron still named', await p.getAttribute('.au-chevron[data-key="' + key + '"]', 'aria-label'), 'View details for Access level changed, Jane Smith');
    is('AC17 no errors', p.errors.join('|'), '');
    await p.context().close();
  }

  /* ===== Mobius users seed, filters and pagination ====================== */
  {
    const p = await open(browser, PAGE);
    await p.selectOption('#au-date', '90');
    await wait(p);
    is('Mobius 90 days', await showing(p), 'Showing 1-10 of 12');
    is('Mobius two pages', await p.$$eval('#au-pages button[data-page]', bs => bs.filter(b => /^\d+$/.test(b.dataset.page)).length), 2);
    await p.click('#au-pages button[data-page=last]');
    await wait(p);
    is('Mobius last page', await showing(p), 'Showing 11-12 of 12');
    is('Mobius focus on current page', await p.evaluate(() => document.activeElement.getAttribute('aria-current')), 'page');
    const last = await rows(p);
    is('Mobius oldest row', last[1].slice(0, 5).join('|'), 'Access level changed|PWPeter Wilson|Read Only → Advisor|Tenant|Daniel Hughes');
    await p.selectOption('#au-account', 'SSO');
    await wait(p);
    is('Mobius Account type SSO', await showing(p), 'Showing 1-4 of 4');
    is('Mobius filter resets page', await text(p, '#au-pages [aria-current=page]'), '1');
    await p.selectOption('#au-account', 'Tenant and SSO');
    await wait(p);
    is('Mobius no Tenant and SSO rows', await text(p, '#au-state'), 'No results found. Try changing your search or filters.');
    await p.selectOption('#au-account', 'All');
    await p.selectOption('#au-per-page', '25');
    await wait(p);
    is('Mobius 25 per page', await showing(p), 'Showing 1-12 of 12');
    is('Mobius Action type options A to Z', await p.$$eval('#au-action-menu label', ls => ls.map(l => l.textContent.trim()).join('|')),
      'Access level changed|Application access changed|B2B Settings changed|Restriction settings changed|User activated|User created|User deactivated|User deleted|User updated');
    is('Mobius Changed by options', await p.$$eval('#au-by-menu label', ls => ls.map(l => l.textContent.trim()).join('|')), 'John Doe|Sarah Brown|Daniel Hughes');
    await p.selectOption('#au-date', '365');
    await wait(p);
    is('Mobius 12 months', await showing(p), 'Showing 1-12 of 12');
    await p.selectOption('#au-date', '7');
    await wait(p);
    is('Mobius 7 days', await showing(p), 'Showing 1-5 of 5');
    await p.context().close();
  }

  /* ===== Sorting ========================================================= */
  {
    const p = await open(browser, CH);
    is('Sort names', await p.$$eval('#au-head .table-sort', bs => bs.map(b => b.getAttribute('aria-label')).join('|')),
      'Sort by Action|Sort by Affected user|Sort by Change summary|Sort by Changed by|Sort by Date and time');
    is('Sort: chevron column not sortable', await p.$eval('#au-head th:last-child', th => !th.querySelector('button')), true);
    await clearAnnouncer(p);
    await p.click('#au-head th[data-sort-key=action] .table-sort');
    await wait(p);
    is('Sort ascending first', await p.getAttribute('#au-head th[data-sort-key=action]', 'aria-sort'), 'ascending');
    is('Sort only one column marked', await p.locator('#au-head th[aria-sort]').count(), 1);
    is('Sort arrow shown on the current column only', await p.$$eval('#au-head .table-sort', bs => bs.map(b => getComputedStyle(b.querySelector('.table-sort-icon')).opacity).join(',')), '1,0,0,0,0');
    is('Sort state class', await p.getAttribute('#au-head th[data-sort-key=action] .table-sort', 'class'), 'table-sort table-sort-asc');
    is('Sort focus kept on header', await p.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Sort by Action');
    await announced(p);
    is('Sort announced', await announcement(p), 'Sorted by Action, ascending.');
    const asc = await p.evaluate(() => AUPage.visible().map(r => r.action.toLowerCase()));
    ok('Sort A to Z', asc.every((v, i) => i === 0 || asc[i - 1] <= v));
    await p.click('#au-head th[data-sort-key=action] .table-sort');
    await wait(p);
    is('Sort then descending', await p.getAttribute('#au-head th[data-sort-key=action]', 'aria-sort'), 'descending');
    await p.click('#au-head th[data-sort-key=when] .table-sort');
    await wait(p);
    is('Sort Date ascending', (await visibleNs(p))[0], 22);
    for (const k of ['affected', 'summary', 'by']) {
      await p.click('#au-head th[data-sort-key=' + k + '] .table-sort');
      await wait(p, 150);
      is('Sort ' + k, await p.getAttribute('#au-head th[data-sort-key=' + k + ']', 'aria-sort'), 'ascending');
    }
    await p.context().close();
  }

  /* ===== Tabs: Buckholt Tabs keyboard and semantics ===================== */
  {
    const p = await open(browser, PAGE);
    is('Tabs tablist', await p.locator('.tabs [role=tablist]').count(), 1);
    is('Tabs controls', await p.$$eval('[role=tab]', ts => ts.map(t => t.getAttribute('aria-controls')).join(',')), 'au-tab-mobius,au-tab-ch,au-tab-automate,au-tab-tps');
    is('Tabs panels labelled', await p.$$eval('[role=tabpanel]', ps => ps.map(x => document.getElementById(x.getAttribute('aria-labelledby')).textContent.trim()).join('|')), TAB_LABELS);
    /* Keyboard as Buckholt Tabs ships it (Bootstrap 5.1.3 pills): every tab is
       a Tab stop, and Enter or Space on a focused tab selects it. */
    await p.focus('#au-tab-mobius-tab');
    await p.keyboard.press('Tab');
    is('Tabs Tab moves to the next tab', await p.evaluate(() => document.activeElement.id), 'au-tab-ch-tab');
    await p.focus('#au-tab-ch-tab');
    await p.keyboard.press('Enter');
    await until(p, () => document.getElementById('au-tab-ch').classList.contains('show'));
    await wait(p);
    is('Tabs Enter selects', await selectedTab(p), 'Config Hub users');
    is('Tabs focus stays on the tab', await p.evaluate(() => document.activeElement.id), 'au-tab-ch-tab');
    is('Tabs breadcrumb follows', await crumbs(p), 'Audit Centre > Config Hub users');
    /* One line at the reference widths; no overflow controls needed. */
    for (const w of [1440, 1088]) {
      await p.setViewportSize({ width: w, height: 900 });
      await wait(p, 150);
      is('Tabs one line at ' + w, await p.evaluate(() => new Set([...document.querySelectorAll('[role=tab]')].map(t => Math.round(t.getBoundingClientRect().top))).size), 1);
      is('Tabs no overflow at ' + w, await p.evaluate(() => { const sc = document.querySelector('.tab-items-scroll'); return sc.scrollWidth <= sc.clientWidth; }), true);
    }
    await p.context().close();
  }

  /* ===== Accessibility, Tooltips and truncation ========================== */
  {
    const p = await open(browser, CH);
    const k1 = await keyOf(p, 1);
    is('A11y chevron name', await p.getAttribute('.au-chevron[data-key="' + k1 + '"]', 'aria-label'), 'View details for Invitation sent, oliver.grant@greenlight.co.uk');
    is('A11y bulk chevron name', await p.getAttribute('.au-chevron[data-key="' + await keyOf(p, 9) + '"]', 'aria-label'), 'View details for User deleted, 4 users');
    await p.focus('.au-chevron[data-key="' + k1 + '"]');
    await until(p, () => !!document.querySelector('.tooltip.show'));
    is('A11y chevron Tooltip', await text(p, '.tooltip.show .tooltip-inner'), 'View details');
    await p.keyboard.press('Escape');
    is('A11y table named', await p.getAttribute('#au-table', 'aria-label'), 'Configuration Hub users audit records');
    is('A11y avatars hidden from AT (initials)', await p.$$eval('#au-rows .avatar-initials', as => as.every(a => a.closest('[aria-hidden=true]'))), true);
    is('A11y live region polite', await p.getAttribute('#ch-announcer', 'aria-live'), 'polite');
    /* Truncation: the long invitee email (record 16). */
    await p.click('#au-pages button[data-page="2"]');
    await wait(p);
    const k16 = await keyOf(p, 16);
    const trunc = await p.$eval('tr[data-key="' + k16 + '"] .au-col-affected .au-trunc', el => ({
      cut: el.scrollWidth > el.clientWidth, tip: el.getAttribute('data-au-tooltip'), text: el.textContent
    }));
    is('Truncation: long email truncates', trunc.cut, true);
    is('Truncation: Tooltip has full text', trunc.tip, 'christopher.hetherington-smythe@greenlight-insurance.co.uk');
    is('Truncation: full text in the DOM', trunc.text, 'christopher.hetherington-smythe@greenlight-insurance.co.uk');
    await p.hover('tr[data-key="' + k16 + '"] .au-col-affected .au-trunc');
    await until(p, () => !!document.querySelector('.tooltip.show'));
    is('Truncation: hover Tooltip', await text(p, '.tooltip.show .tooltip-inner'), 'christopher.hetherington-smythe@greenlight-insurance.co.uk');
    is('Truncation: no page overflow at 1440', await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await p.context().close();
    /* Usable at 1088: no page overflow, table scrolls in its own container. */
    const q = await open(browser, CH, { width: 1088, height: 800 });
    is('1088: no page overflow', await q.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    is('1088: record type visible', await q.isVisible('#au-record-toggle'), true);
    await q.context().close();
  }

  /* ===== Home card and shell reuse ====================================== */
  {
    const p = await open(browser, HOME);
    is('Home no errors', p.errors.join('|'), '');
    const titles = await p.$$eval('.ch-app-card h2', hs => hs.map(h => h.textContent.trim()).join(' / '));
    is('Home Audit Centre card', titles, 'Onboarding Form / User Management / Third-Party Services / Audit Centre');
    is('Home Audit Centre description', await text(p, '.ch-app-card[data-app=audit-centre] p'), 'See what changed in Configuration Hub, when and by whom.');
    await go(p, '.ch-app-card[data-app=audit-centre] .ch-open');
    is('Home Open goes to AU-00-01', new URL(p.url()).pathname.endsWith('/CH-AUDIT-UM/index.html'), true);
    is('Lockup goes to this home', await p.getAttribute('#ch-header .ch-lockup', 'href'), HOME);
    /* Breadcrumb's first crumb is the app's base page. */
    is('Breadcrumb Audit Centre link', new URL(await p.$eval('#ch-context .breadcrumb-link', a => a.href)).pathname.endsWith('/CH-AUDIT-UM/index.html'), true);
    await p.context().close();
    /* The override stays local: CH-SHELL's own home is unchanged. */
    const q = await open(browser, BASE + '/prototypes/CH-SHELL/index.html');
    is('Shell home has no Audit Centre card', await q.locator('.ch-app-card[data-app=audit-centre]').count(), 0);
    await q.context().close();
    /* Every seed lists Audit Centre. */
    for (const seed of ['northgate', 'long-names', 'test-only', 'staged-rollout', 'live-only']) {
      const s = await open(browser, PAGE + '?seed=' + seed);
      is('Seed ' + seed + ' opens Audit Centre', new URL(s.url()).pathname.endsWith('/CH-AUDIT-UM/index.html') && s.errors.length === 0, true);
      await s.context().close();
    }
  }

  await browser.close();
  t.done();
})();
