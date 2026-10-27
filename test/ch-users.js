/* Configuration Hub users (CH-USERS): every acceptance criterion in
   prototypes/CH-USERS/ch-users-spec.md, plus its accessibility requirements,
   the shell overrides and the Buckholt gaps the prototype builds.

   Each block is headed `AC n` with the criterion it checks, in the order the
   spec lists them (1 to 29). Run against the mirror like the other suites:

     node test/ch-users.js
*/
const { launch, BASE, STILL, counter } = require('./config');
const t = counter();
const { is, ok } = t;

const ROOT = BASE + '/prototypes/CH-USERS/';
const HOME = ROOT + 'home.html';
const BASE_PAGE = ROOT + 'index.html';
const USERS = ROOT + 'users.html';
/* Selecting anywhere on a card: the click lands on its footer tags. */
const CH_CARD = '.cu-type-card[data-type=configuration-hub] .tag-set';
const MOBIUS_CARD = '.cu-type-card[data-type=mobius] .card-body p';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const now = new Date();
const TODAY = now.getDate() + ' ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear();

const OWN_SELECT = "You can't select your own account.";
const OWN_DELETE = "You can't delete your own account.";
const OWN_ROLE = "You can't change your own role.";
const LAST_ADMIN = 'There must be at least one active administrator.';
const DEFAULT_PAGE_1 = ['Aisha Rahman', 'Bartholomew Featherstonehaugh-Whitmore', 'Chloe Davies', 'Hannah Clarke', 'James Okonkwo',
  'Megan Lewis', 'Oliver Bennett', 'Ravi Patel', 'Sophie Marchetti', 'Tomasz Nowak'];

async function open(browser, url, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: STILL });
  return page;
}

/* Click something that navigates and wait for the new page. */
async function go(page, sel) {
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click(sel)]);
  await page.addStyleTag({ content: STILL });
  await page.waitForTimeout(150);
}

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({ content: STILL });
  await page.waitForTimeout(250);
}

const wait = (page, ms) => page.waitForTimeout(ms || 250);
const text = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; }, sel);
const active = page => page.evaluate(() => {
  const e = document.activeElement;
  return e ? (e.id || e.getAttribute('aria-label') || e.textContent.trim()) : null;
});
const names = page => page.$$eval('#cu-rows tr[data-id]', trs => trs.map(tr => tr.children[1].querySelector('.cu-trunc, .cu-not-set').textContent.trim()));
const cardTags = (page, type) => page.$$eval('.cu-type-card[data-type=' + type + '] .tag-set .tag-label', ls => ls.map(l => l.textContent.trim()).join('|'));
const crumbs = page => page.$$eval('#ch-context .breadcrumb-item', is => is.map(i => i.textContent.trim()).join(' > '));
const usernames = page => page.$$eval('#cu-rows tr[data-id]', trs => trs.map(tr => tr.children[2].textContent.trim()));
const emails = page => page.$$eval('#cu-rows tr[data-id]', trs => trs.map(tr => tr.children[3].textContent.trim()));
const chips = page => page.evaluate(() => ['active', 'pending', 'inactive'].map(k => document.getElementById('cu-count-' + k).textContent).join(','));
const rowId = (page, email) => page.$$eval('#cu-rows tr[data-id]', (trs, em) => {
  const tr = trs.find(r => r.children[3].textContent.trim() === em);
  return tr ? tr.getAttribute('data-id') : null;
}, email);
const describedBy = (page, sel) => page.evaluate(s => {
  const e = document.querySelector(s);
  if (!e || !e.getAttribute('aria-describedby')) return null;
  return e.getAttribute('aria-describedby').split(/\s+/).map(id => { const d = document.getElementById(id); return d ? d.textContent.trim() : ''; }).filter(Boolean).join(' | ');
}, sel);
const bladeOpen = page => page.evaluate(() => !!document.querySelector('.cu-blade.show'));
const modalOpen = (page, id) => page.evaluate(i => { const m = document.getElementById(i); return !!m && m.classList.contains('show'); }, id);
/* Bootstrap shows Modals and the shell announces after a short delay, so
   wait for the state rather than for a fixed time. */
const until = (page, fn, arg) => page.waitForFunction(fn, arg, { timeout: 4000 }).catch(() => {});
const announced = page => until(page, () => document.getElementById('ch-announcer').textContent.trim() !== '');
const modalShown = (page, id) => until(page, i => document.getElementById(i).classList.contains('show') && document.activeElement && document.getElementById(i).contains(document.activeElement), id);
const modalHidden = (page, id) => until(page, i => !document.getElementById(i).classList.contains('show') && !document.querySelector('.modal-backdrop'), id);
const toastText = page => page.evaluate(() => [...document.querySelectorAll('#cu-toasts .toast-message')].map(x => x.textContent.trim()).pop() || null);

async function action(page, email, what) {
  const id = await rowId(page, email);
  await page.click('#cu-rows button[data-action="' + what + '"][data-id="' + id + '"]');
  await wait(page);
  if (what === 'delete') await modalShown(page, 'cu-delete-modal');
}

async function select(page, email) {
  const id = await rowId(page, email);
  await page.click('#cu-select-' + id);
}

(async () => {
  const browser = await launch();

  /* ===== AC 1 · home: second card is User Management =================== */
  {
    const p = await open(browser, HOME);
    is('AC1 no page errors', p.errors.join('|'), '');
    const titles = await p.$$eval('.ch-app-card h2', hs => hs.map(h => h.textContent.trim()));
    is('AC1 second card title', titles[1], 'User Management');
    is('AC1 card order', titles.join(' / '), 'Onboarding Form / User Management / Third-Party Services');
    is('AC1 second card description', await text(p, '.ch-app-card:nth-child(2) .text-block p'),
       'Add and manage your Mobius and Configuration Hub users.');
    is('AC1 Open name', await p.getAttribute('.ch-app-card:nth-child(2) .ch-open', 'aria-label'), 'Open User Management');
    is('AC1 home title', await p.title(), 'Applications | Configuration Hub');
    /* "User Management" is the shell's own name, which meets the CH-SHELL
       app name length rule: one line, no wider than "Third-Party Services". */
    const fit = await p.evaluate(() => {
      const hs = [...document.querySelectorAll('.ch-app-card h2')];
      return hs[1].getBoundingClientRect().height === hs[0].getBoundingClientRect().height;
    });
    is('AC1 title fits one line', fit, true);
    await go(p, '.ch-app-card:nth-child(2) .ch-open');
    is('AC1 Open goes to CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    await p.context().close();
  }

  /* ===== AC 2 · CU-00-01 copy ============================================ */
  {
    const p = await open(browser, BASE_PAGE);
    is('AC2 no page errors', p.errors.join('|'), '');
    is('AC2 breadcrumb', await text(p, '#ch-context nav .breadcrumb'), 'User Management');
    is('AC2 one crumb', await p.locator('#ch-context .breadcrumb-item').count(), 1);
    is('AC2 crumb is current page', await p.getAttribute('#ch-context .breadcrumb-item', 'aria-current'), 'page');
    is('AC2 crumb is not a link', await p.locator('#ch-context .breadcrumb-item a').count(), 0);
    is('AC2 heading', await text(p, 'main h1'), 'User Management');
    is('AC2 description, one paragraph with the separate accounts sentences', await text(p, 'main .page-panel > .text-block p'),
       'Choose which users you want to view and manage. Mobius and Configuration Hub use separate accounts. Someone who needs both will need an account for each.');
    is('AC2 cards in order', (await p.$$eval('#cu-type-cards h2', hs => hs.map(h => h.textContent.trim()))).join(' / '),
       'Mobius users / Configuration Hub users');
    is('AC2 card titles are h2', await p.locator('#cu-type-cards .card-body h2').count(), 2);
    is('AC2 card descriptions', (await p.$$eval('#cu-type-cards .card-body .text-block p', ps => ps.map(x => x.textContent.trim()))).join(' / '),
       'Add and manage the people who sign in to Mobius. / Add and manage the people who sign in to Configuration Hub.');
    is('AC2 document title', await p.title(), 'User Management | Configuration Hub');
    /* Gap 10: Buckholt's Clickable Card; the whole card is the link. */
    is('AC2 cards are Clickable Cards (links)', await p.evaluate(() => [...document.querySelectorAll('#cu-type-cards > *')].map(c => c.tagName + '.' + [...c.classList].slice(0, 2).join('.')).join(',')),
       'A.card.card-clickable,A.card.card-clickable');
    is('AC2 card destinations', (await p.$$eval('#cu-type-cards > a', as => as.map(a => a.getAttribute('href')))).join(','), 'mobius.html,users.html');
    is('AC2 body then footer', await p.evaluate(() => [...document.querySelectorAll('#cu-type-cards > a')].every(a => a.children[0].classList.contains('card-body') && a.children[1].classList.contains('card-footer'))), true);
    is('AC2 no nested controls in a card', await p.locator('#cu-type-cards a a, #cu-type-cards a button, #cu-type-cards a input, #cu-type-cards a [tabindex]').count(), 0);
    is('AC2 arrow drawn by the Clickable Card', await p.evaluate(() => getComputedStyle(document.querySelector('#cu-type-cards .card-body'), '::after').content), '""');
    const geo = await p.evaluate(() => {
      const cs = [...document.querySelectorAll('#cu-type-cards .card')].map(c => c.getBoundingClientRect());
      const panel = document.querySelector('#cu-type-cards').getBoundingClientRect();
      const body = document.querySelector('#cu-type-cards .card-body').getBoundingClientRect();
      const foot = document.querySelector('#cu-type-cards .card-footer');
      const fr = foot.getBoundingClientRect();
      return { w: cs.map(r => Math.round(r.width)), h: cs.map(r => Math.round(r.height)), top: cs.map(r => Math.round(r.top)),
               left: Math.round(cs[0].left), start: Math.round(panel.left), gap: Math.round(cs[1].left - cs[0].right),
               footBelow: fr.top >= body.bottom - 1, footFull: Math.abs(fr.width - cs[0].width) <= 2,
               footBg: getComputedStyle(foot).backgroundColor, cardBg: getComputedStyle(document.querySelector('#cu-type-cards .card')).backgroundColor };
    });
    is('AC2 cards as in the frame (528px)', geo.w.join(','), '528,528');
    is('AC2 cards equal height', geo.h[0], geo.h[1]);
    is('AC2 cards side by side', geo.top[0], geo.top[1]);
    is('AC2 cards 32px apart', geo.gap, 32);
    is('AC2 cards aligned to the start', geo.left, geo.start);
    ok('AC2 footer below the body, full card width', geo.footBelow && geo.footFull);
    ok('AC2 footer on a different surface', geo.footBg !== geo.cardBg);
    is('AC2 lockup goes to the CH-USERS home', new URL(await p.getAttribute('.ch-lockup', 'href')).pathname.endsWith('/CH-USERS/home.html'), true);
    await p.context().close();
    /* Still side by side at the 1088px reference width; stacked when two no
       longer fit. */
    for (const [width, stacked] of [[1088, false], [768, true]]) {
      const q = await open(browser, BASE_PAGE, { width, height: 800 });
      const tops = await q.$$eval('#cu-type-cards > a', as => as.map(a => Math.round(a.getBoundingClientRect().top)));
      is('AC2 at ' + width + 'px the cards are ' + (stacked ? 'stacked' : 'side by side'), tops[0] !== tops[1], stacked);
      is('AC2 no horizontal overflow at ' + width, await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await q.context().close();
    }
  }

  /* ===== AC 3 · card summaries ========================================== */
  {
    const p = await open(browser, BASE_PAGE);
    is('AC3 Mobius tags', await cardTags(p, 'mobius'), '34 users|32 active|2 inactive');
    is('AC3 Mobius has no pending tag', (await cardTags(p, 'mobius')).includes('pending'), false);
    is('AC3 Configuration Hub tags', await cardTags(p, 'configuration-hub'), '12 users|9 active|1 inactive|2 pending');
    is('AC3 tag variants as in the frame', await p.$$eval('.cu-type-card[data-type=configuration-hub] .tag-set > .tag', ts => ts.map(t => t.className).join(' / ')),
       'tag tag-status tag-status-info / tag tag-status tag-status-success / tag tag-status tag-status-warning / tag');
    is('AC3 tags are a Tag set', await p.locator('.cu-type-card .card-footer > .tag-set > .tag').count(), 7);
    is('AC3 tags not focusable', await p.locator('.cu-type-card .tag-set [tabindex], .cu-type-card .tag-set a, .cu-type-card .tag-set button').count(), 0);
    await p.context().close();
  }

  /* ===== AC 4 · one tab stop per card, named by its title =============== */
  {
    const p = await open(browser, BASE_PAGE);
    const stops = [];
    for (let i = 0; i < 20; i++) {
      await p.keyboard.press('Tab');
      const s = await p.evaluate(() => {
        const e = document.activeElement;
        return e && e.closest('#cu-type-cards') ? (e.getAttribute('data-type') || 'inside:' + e.tagName) : null;
      });
      if (s && stops.includes(s)) break;
      if (s) stops.push(s);
    }
    is('AC4 one tab stop per card', stops.join(','), 'mobius,configuration-hub');
    const names = await p.evaluate(() => [...document.querySelectorAll('#cu-type-cards > a')].map(a => {
      const label = a.getAttribute('aria-labelledby').split(' ').map(id => document.getElementById(id).textContent.trim()).join(' ');
      const desc = a.getAttribute('aria-describedby').split(' ').map(id => document.getElementById(id).textContent.trim()).join(' ');
      return label + ' || ' + desc;
    }));
    is('AC4 Mobius name and description', names[0], 'Mobius users || Add and manage the people who sign in to Mobius. 34 users, 32 active, 2 inactive.');
    is('AC4 Configuration Hub name and description', names[1],
       'Configuration Hub users || Add and manage the people who sign in to Configuration Hub. 12 users, 9 active, 1 inactive, 2 pending.');
    is('AC4 tags and arrow hidden from assistive technology', await p.evaluate(() => [...document.querySelectorAll('#cu-type-cards .tag-set')].every(t => t.getAttribute('aria-hidden') === 'true')), true);
    /* Focus: one visible indicator around the whole card. */
    await p.focus('.cu-type-card[data-type=mobius]');
    const ring = await p.evaluate(() => { const cs = getComputedStyle(document.activeElement); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none'; });
    ok('AC4 visible focus indicator on the card', ring);
    /* Hover: Buckholt's hover treatment and a pointer. */
    const before = await p.evaluate(() => getComputedStyle(document.querySelector('.cu-type-card[data-type=configuration-hub]')).borderTopColor);
    await p.hover('.cu-type-card[data-type=configuration-hub] .tag-set');
    await wait(p);
    const after = await p.evaluate(() => { const cs = getComputedStyle(document.querySelector('.cu-type-card[data-type=configuration-hub]')); return [cs.borderTopColor, cs.cursor]; });
    ok('AC4 hover changes the card border', after[0] !== before);
    is('AC4 pointer cursor', after[1], 'pointer');
    /* Enter activates. */
    await p.focus('.cu-type-card[data-type=configuration-hub]');
    await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle' }), p.keyboard.press('Enter')]);
    is('AC4 Enter opens CU-00-02', new URL(p.url()).pathname.endsWith('/CH-USERS/users.html'), true);
    await p.context().close();
  }

  /* ===== AC 5 · select the Configuration Hub users card ================= */
  {
    const p = await open(browser, BASE_PAGE);
    await go(p, CH_CARD);
    is('AC5 no page errors', p.errors.join('|'), '');
    is('AC5 on CU-00-02', new URL(p.url()).pathname.endsWith('/CH-USERS/users.html'), true);
    is('AC5 ten rows', await p.locator('#cu-rows tr[data-id]').count(), 10);
    is('AC5 sorted by Full name A to Z', (await names(p)).join(' / '), DEFAULT_PAGE_1.join(' / '));
    is('AC5 Full name sort is ascending', await p.getAttribute('th[data-sort-key="name"]', 'aria-sort'), 'ascending');
    is('AC5 chips 9, 2, 1', await chips(p), '9,2,1');
    is('AC5 chip labels', (await p.$$eval('.cu-chip .key', ks => ks.map(k => k.textContent.trim()))).join(' / '),
       'Active users / Pending users / Inactive users');
    is('AC5 Showing', await text(p, '#cu-showing'), 'Showing 1–10 of 12');
    is('AC5 breadcrumb', await crumbs(p), 'User Management > Configuration Hub users');
    ok('AC5 first crumb links to CU-00-01', (await p.getAttribute('#ch-context .breadcrumb-link', 'href')) === 'index.html');
    is('AC5 heading', await text(p, 'main h1'), 'Configuration Hub users');
    is('AC5 description', await text(p, 'main .text-block p'), 'View, add and manage who can sign in to Configuration Hub.');
    is('AC5 document title', await p.title(), 'Configuration Hub users | User Management | Configuration Hub');
    is('AC5 column headers', (await p.$$eval('.cu-table thead th', ths => ths.map(th => th.textContent.trim()))).join(' / '),
       ' / Full name / Username / Email / Role / Status / Actions');
    is('AC5 Actions header visually hidden', await p.evaluate(() => !!document.querySelector('.cu-table thead th:last-child .visually-hidden')), true);
    is('AC5 headers are real headers', await p.locator('.cu-table thead th[scope=col]').count(), 7);
    is('AC5 sortable headers are buttons', await p.locator('.cu-table thead th.table-sort-header > button.table-sort').count(), 5);
    is('AC5 avatars show initials', (await p.$$eval('#cu-rows .avatar-initials', as => as.map(a => a.textContent.trim()))).slice(0, 3).join(','), 'AR,BF,CD');
    is('AC5 status Tags', (await p.$$eval('#cu-rows .tag .tag-label', ts => ts.map(x => x.textContent.trim()))).filter(s => s === 'Inactive').length, 1);
    is('AC5 Inactive tag is warning, as on the cards', await p.evaluate(() => [...document.querySelectorAll('#cu-rows .tag')].find(t => t.textContent.trim() === 'Inactive').className), 'tag tag-status tag-status-warning');
    is('AC5 Active tag is success', await p.evaluate(() => [...document.querySelectorAll('#cu-rows .tag')].find(t => t.textContent.trim() === 'Active').className), 'tag tag-status tag-status-success');
    is('AC5 row action names', (await p.$$eval('#cu-rows tr[data-id]:nth-child(2) button[data-action]', bs => bs.map(b => b.getAttribute('aria-label')))).join(' / '),
       'View Aisha Rahman / Edit Aisha Rahman / Delete Aisha Rahman');
    is('AC5 row action tooltips', (await p.$$eval('#cu-rows tr[data-id]:nth-child(2) button[data-action]', bs => bs.map(b => b.getAttribute('data-cu-tooltip')))).join(','), 'View,Edit,Delete');
    is('AC5 Delete is danger', await p.locator('#cu-rows button[data-action=delete].btn-danger').count(), 10);
    is('AC5 checkbox names', await p.getAttribute('#cu-rows tr[data-id]:nth-child(2) input[type=checkbox]', 'aria-label'), 'Select Aisha Rahman');
    is('AC5 header checkbox name', await p.getAttribute('#cu-select-all', 'aria-label'), 'Select all users on this page');
    is('AC5 More actions name', await p.getAttribute('#cu-more-toggle', 'aria-label'), 'More actions');
    is('AC5 More actions tooltip', await p.getAttribute('#cu-more', 'data-cu-tooltip'), 'More actions');
    is('AC5 More actions items disabled with nothing selected', await p.evaluate(() => document.getElementById('cu-bulk-edit').disabled && document.getElementById('cu-bulk-delete').disabled), true);
    is('AC5 Add account is Primary', await p.evaluate(() => document.getElementById('cu-add').className), 'btn btn-primary');
    is('AC5 Add account label', await text(p, '#cu-add'), 'Add user');
    is('AC5 search accessible name', await p.evaluate(() => document.querySelector('label[for=cu-search]').textContent.trim()), 'Search users');
    is('AC5 search placeholder', await p.getAttribute('#cu-search', 'placeholder'), 'Search');
    is('AC5 role options', (await p.$$eval('#cu-role-filter option', os => os.map(o => o.textContent))).join(','), 'All,Administrator,Editor,Viewer');
    is('AC5 status options', (await p.$$eval('#cu-status-filter option', os => os.map(o => o.textContent))).join(','), 'All,Active,Pending,Inactive');
    is('AC5 Clear all filters hidden', await p.evaluate(() => document.getElementById('cu-clear').hidden), true);
    /* Filter bar order: Search, Role, Status, then Add account and More
       actions at the right end, on one row. */
    const bar = await p.evaluate(() => ['cu-search', 'cu-role-filter', 'cu-status-filter', 'cu-add', 'cu-more-toggle'].map(id => {
      const r = document.getElementById(id).getBoundingClientRect(); return [Math.round(r.left), Math.round(r.bottom)];
    }));
    ok('AC5 filter bar order', bar.every((b, i) => i === 0 || b[0] > bar[i - 1][0]));
    ok('AC5 filter bar is one row', Math.max(...bar.map(b => b[1])) - Math.min(...bar.map(b => b[1])) < 8);
    ok('AC5 More actions at the right end', await p.evaluate(() => {
      const t = document.getElementById('cu-more-toggle').getBoundingClientRect();
      const tbl = document.querySelector('.table-container').getBoundingClientRect();
      return Math.abs(t.right - tbl.right) < 4;
    }));
    /* Pagination (Gap 2). */
    is('AC5 rows per page options', (await p.$$eval('#cu-per-page option', os => os.map(o => o.textContent))).join(','), '10,25,50');
    is('AC5 rows per page label', await p.evaluate(() => document.querySelector('label[for=cu-per-page]').textContent.trim()), 'Results per page');
    is('AC5 pagination controls', (await p.$$eval('#cu-pages button', bs => bs.map(b => b.getAttribute('aria-label')))).join(','),
       'First page,Previous page,Page 1,Page 2,Next page,Last page');
    is('AC5 current page marked', await p.getAttribute('#cu-pages button[aria-current=page]', 'aria-label'), 'Page 1');
    is('AC5 first and previous disabled on page 1', await p.evaluate(() => [...document.querySelectorAll('#cu-pages button')].slice(0, 2).every(b => b.disabled)), true);
    is('AC5 pagination is a named navigation', await p.getAttribute('#cu-pagination nav', 'aria-label'), 'Pagination');
    is('AC5 no horizontal page overflow', await p.evaluate(() => document.documentElement.scrollWidth), 1440);
    is('AC5 table fits at 1440 without scrolling', await p.evaluate(() => { const c = document.querySelector('.table-content'); return c.scrollWidth <= c.clientWidth; }), true);
    /* Truncation: seed row 8 truncates with a Tooltip and keeps its full text. */
    const trunc = await p.evaluate(() => {
      const row = [...document.querySelectorAll('#cu-rows tr[data-id]')].find(r => r.textContent.includes('Bartholomew'));
      return [...row.querySelectorAll('.cu-trunc')].map(e => [e.scrollWidth > e.clientWidth, e.getAttribute('data-cu-tooltip') === e.textContent, getComputedStyle(e).textOverflow, e.tabIndex]);
    });
    ok('AC5 row 8 email truncates with Tooltip', trunc[2][0] && trunc[2][1] && trunc[2][2] === 'ellipsis');
    ok('AC5 truncated text is not focusable', trunc.every(x => x[3] === -1));
    is('AC5 row 8 accessible names keep full text', await p.evaluate(() => [...document.querySelectorAll('#cu-rows button[data-action=view]')].map(b => b.getAttribute('aria-label')).includes('View Bartholomew Featherstonehaugh-Whitmore')), true);
    /* Text widths depend on the font: in Proxima Soft only row 8 truncates;
       the mirror's Arial is wider, so there it is only checked that row 8
       is among the truncated rows (see test/README.md). */
    const cutRows = await p.evaluate(() => [...new Set([...document.querySelectorAll('#cu-rows .cu-trunc')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.closest('tr').querySelector('.cu-col-email').textContent.trim()))]);
    const proxima = await p.evaluate(() => document.fonts.check('16px proxima-soft') && [...document.fonts].some(f => /proxima/i.test(f.family) && f.status === 'loaded'));
    if (proxima) is('AC5 only row 8 truncates (Proxima Soft)', cutRows.join(','), 'bartholomew.featherstonehaugh-whitmore@northgate-insurance.co.uk');
    else ok('AC5 row 8 truncates (fallback font)', cutRows.includes('bartholomew.featherstonehaugh-whitmore@northgate-insurance.co.uk'));
    /* Page 2: the two pending accounts. */
    await p.click('#cu-pages button[aria-label="Page 2"]');
    await wait(p);
    is('AC5 page 2 rows', (await emails(p)).join(','), 'daniel.reyes@northgate-insurance.co.uk,l.fischer@northgate-insurance.co.uk');
    is('AC5 page 2 Showing', await text(p, '#cu-showing'), 'Showing 11–12 of 12');
    is('AC5 pending avatar is the generic user', await p.locator('#cu-rows .avatar .avatar-icon i.fa-user').count(), 2);
    is('AC5 pending tag is the plain tag, as on the cards', await p.evaluate(() => [...document.querySelectorAll('#cu-rows .tag')].filter(t => t.textContent.trim() === 'Pending').map(t => t.className).join(',')), 'tag,tag');
    is('AC5 pending accessible names use email', await p.getAttribute('#cu-rows tr[data-id] button[data-action=edit]', 'aria-label'), 'Edit daniel.reyes@northgate-insurance.co.uk');
    is('AC5 pending checkbox name uses email', await p.evaluate(() => document.querySelector('#cu-rows tr[data-id] input[type=checkbox]').getAttribute('aria-label')), 'Select daniel.reyes@northgate-insurance.co.uk');
    /* Rows per page returns to page 1. */
    await p.selectOption('#cu-per-page', '25');
    await wait(p);
    is('AC5 25 per page shows 12 rows', await p.locator('#cu-rows tr[data-id]').count(), 12);
    is('AC5 25 per page Showing', await text(p, '#cu-showing'), 'Showing 1–12 of 12');
    is('AC5 one page: page controls disabled', await p.evaluate(() => [...document.querySelectorAll('#cu-pages button')].every(b => b.disabled)), true);
    await p.context().close();
  }

  /* ===== AC 6 · Mobius users card, placeholder ========================== */
  {
    const p = await open(browser, BASE_PAGE);
    await go(p, MOBIUS_CARD);
    is('AC6 no page errors', p.errors.join('|'), '');
    is('AC6 on CU-00-03', new URL(p.url()).pathname.endsWith('/CH-USERS/mobius.html'), true);
    is('AC6 heading', await text(p, 'main h1'), 'Mobius users');
    is('AC6 text', await text(p, 'main .text-block p'), "This page isn't part of this prototype yet.");
    is('AC6 breadcrumb', await crumbs(p), 'User Management > Mobius users');
    is('AC6 document title', await p.title(), 'Mobius users | User Management | Configuration Hub');
    is('AC6 back link', await text(p, '#cu-back'), 'Back to User Management');
    await go(p, '#cu-back');
    is('AC6 back to CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    await p.context().close();
  }

  /* ===== AC 7 · CU-00-01 follows CU-00-02 =============================== */
  {
    const p = await open(browser, BASE_PAGE);
    await go(p, CH_CARD);
    await p.click('#cu-add');
    await wait(p);
    await p.fill('#cu-add-email', 'new.person@northgate-insurance.co.uk');
    await p.selectOption('#cu-add-role', 'Editor');
    await p.click('#cu-add-send');
    await wait(p, 400);
    await go(p, '#ch-context .breadcrumb-link');
    is('AC7 back on CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    is('AC7 Configuration Hub card follows the data', await cardTags(p, 'configuration-hub'), '13 users|9 active|1 inactive|3 pending');
    is('AC7 Mobius card unchanged', await cardTags(p, 'mobius'), '34 users|32 active|2 inactive');
    await go(p, CH_CARD);
    is('AC7 the new user is still on CU-00-02', (await p.evaluate(() => CUUsers.users().map(u => u.email))).includes('new.person@northgate-insurance.co.uk'), true);
    /* Deleting is followed too. */
    await p.selectOption('#cu-status-filter', 'Inactive');
    await wait(p);
    await action(p, 'chloe.davies@northgate-insurance.co.uk', 'delete');
    await p.click('#cu-delete-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-delete-modal');
    await p.goto(BASE_PAGE, { waitUntil: 'networkidle' });
    is('AC7 deletion followed, zero count hidden', await cardTags(p, 'configuration-hub'), '12 users|9 active|3 pending');
    /* State is held for the tab; a reload goes back to the seed. */
    await p.reload({ waitUntil: 'networkidle' });
    is('AC7 reload resets to the seed', await cardTags(p, 'configuration-hub'), '12 users|9 active|1 inactive|2 pending');
    await p.context().close();
  }

  /* ===== AC 8 · same accounts in Test =================================== */
  {
    const p = await open(browser, USERS);
    const live = await p.evaluate(() => CUUsers.users().map(a => a.email).sort().join(','));
    await p.click('label[for=ch-env-test]');
    await settle(p);
    is('AC8 switch lands on CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    is('AC8 Test is current', await p.evaluate(() => CHShell.environment), 'test');
    is('AC8 Test title', await p.title(), '[Test] User Management | Configuration Hub');
    await go(p, CH_CARD);
    is('AC8 Test accounts title', await p.title(), '[Test] Configuration Hub users | User Management | Configuration Hub');
    is('AC8 same 12 accounts', await p.evaluate(() => CUUsers.users().map(a => a.email).sort().join(',')), live);
    is('AC8 Showing in Test', await text(p, '#cu-showing'), 'Showing 1–10 of 12');
    is('AC8 Test alert shown (shell)', await p.locator('#ch-env-alert').count(), 1);
    await p.context().close();
  }

  /* ===== AC 9 · search "patel" ========================================== */
  {
    const p = await open(browser, USERS);
    await p.fill('#cu-search', 'patel');
    await wait(p, 700);
    is('AC9 only Ravi Patel', (await names(p)).join(','), 'Ravi Patel');
    is('AC9 Clear all filters shown', await p.evaluate(() => !document.getElementById('cu-clear').hidden), true);
    ok('AC9 Clear all filters after the filters, on the same row', await p.evaluate(() => {
      const c = document.getElementById('cu-clear').getBoundingClientRect();
      const s = document.getElementById('cu-status-filter').getBoundingClientRect();
      return c.left > s.right && Math.abs(c.bottom - s.bottom) < 4;
    }));
    is('AC9 Showing', await text(p, '#cu-showing'), 'Showing 1–1 of 1');
    await announced(p);
    is('AC9 announced politely', await text(p, '#ch-announcer'), 'Showing 1–1 of 1');
    for (const [q, want] of [['RAHMAN', 'Aisha Rahman'], ['tomasz.nowak', 'Tomasz Nowak'], ['l.fischer@', 'Not set yet'], ['Ravi Pat', 'Ravi Patel']]) {
      await p.fill('#cu-search', q);
      await wait(p);
      is('AC9 search matches "' + q + '"', (await names(p)).join(','), want);
    }
    await p.context().close();
  }

  /* ===== AC 10 · search "zzz" ============================================ */
  {
    const p = await open(browser, USERS);
    await p.fill('#cu-search', 'zzz');
    await wait(p, 700);
    is('AC10 no rows', await p.locator('#cu-rows tr[data-id]').count(), 0);
    is('AC10 heading', await text(p, '#cu-no-results h2'), 'No results found');
    ok('AC10 message centred under the heading', await p.evaluate(() => {
      const c = e => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; };
      return Math.abs(c(document.querySelector('#cu-no-results h2')) - c(document.querySelector('#cu-no-results p'))) < 2;
    }));
    is('AC10 message', await text(p, '#cu-no-results p'), 'Try adjusting your search or filter criteria for a match.');
    is('AC10 chips unchanged', await chips(p), '9,2,1');
    is('AC10 filter bar stays', await p.locator('#cu-search').isVisible(), true);
    is('AC10 pagination hidden', await p.evaluate(() => document.getElementById('cu-pagination').hidden), true);
    await announced(p);
    is('AC10 announced', await text(p, '#ch-announcer'), 'No results found. Try adjusting your search or filter criteria for a match.');
    is('AC10 header checkbox disabled', await p.evaluate(() => document.getElementById('cu-select-all').disabled), true);
    await p.context().close();
  }

  /* ===== AC 11 · Status Pending ========================================== */
  {
    const p = await open(browser, USERS);
    await p.selectOption('#cu-status-filter', 'Pending');
    await wait(p);
    is('AC11 two rows', await p.locator('#cu-rows tr[data-id]').count(), 2);
    is('AC11 Not set yet in Full name', (await names(p)).join(','), 'Not set yet,Not set yet');
    is('AC11 Not set yet in Username', (await usernames(p)).join(','), 'Not set yet,Not set yet');
    is('AC11 Not set yet is secondary data', await p.locator('#cu-rows .data-secondary').count(), 4);
    is('AC11 chips unchanged', await chips(p), '9,2,1');
    is('AC11 Clear all filters shown', await p.evaluate(() => !document.getElementById('cu-clear').hidden), true);
    await p.selectOption('#cu-role-filter', 'Viewer');
    await wait(p);
    is('AC11 filters combine', (await emails(p)).join(','), 'l.fischer@northgate-insurance.co.uk');
    await p.context().close();
  }

  /* ===== AC 12 · sort Z to A, Not set yet last ============================ */
  {
    const p = await open(browser, USERS);
    await p.selectOption('#cu-per-page', '25');
    await p.click('th[data-sort-key="name"] button');
    await wait(p);
    const n = await names(p);
    is('AC12 descending', await p.getAttribute('th[data-sort-key="name"]', 'aria-sort'), 'descending');
    is('AC12 first is Tomasz Nowak', n[0], 'Tomasz Nowak');
    is('AC12 Not set yet still last', n.slice(-2).join(','), 'Not set yet,Not set yet');
    is('AC12 named rows Z to A', n.slice(0, 10).join(' / '), DEFAULT_PAGE_1.slice().reverse().join(' / '));
    await p.click('th[data-sort-key="username"] button');
    await wait(p);
    is('AC12 username A to Z', await p.getAttribute('th[data-sort-key="username"]', 'aria-sort'), 'ascending');
    is('AC12 one sort column at a time', await p.locator('th[aria-sort]').count(), 1);
    is('AC12 username Not set yet last', (await usernames(p)).slice(-2).join(','), 'Not set yet,Not set yet');
    await p.click('th[data-sort-key="username"] button');
    await wait(p);
    is('AC12 username Z to A Not set yet last', (await usernames(p)).slice(-2).join(','), 'Not set yet,Not set yet');
    await p.click('th[data-sort-key="status"] button');
    await wait(p);
    is('AC12 status sorts', (await p.$$eval('#cu-rows .tag-label', ts => ts.map(x => x.textContent.trim())))[0], 'Active');
    await p.context().close();
  }

  /* ===== AC 13 · Clear all filters ===================================== */
  {
    const p = await open(browser, USERS);
    await p.fill('#cu-search', 'a');
    await p.selectOption('#cu-role-filter', 'Editor');
    await p.selectOption('#cu-status-filter', 'Active');
    await wait(p);
    await p.click('#cu-clear');
    await wait(p);
    is('AC13 search reset', await p.inputValue('#cu-search'), '');
    is('AC13 role reset', await p.inputValue('#cu-role-filter'), 'all');
    is('AC13 status reset', await p.inputValue('#cu-status-filter'), 'all');
    is('AC13 focus on Search', await active(p), 'cu-search');
    is('AC13 Clear all filters hidden again', await p.evaluate(() => document.getElementById('cu-clear').hidden), true);
    is('AC13 all rows back', await text(p, '#cu-showing'), 'Showing 1–10 of 12');
    await p.context().close();
  }

  /* ===== AC 14 · Add, both fields empty ================================= */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-add');
    await wait(p);
    is('AC14 blade open', await bladeOpen(p), true);
    is('AC14 blade title', await text(p, '.cu-blade .blade-title'), 'Add Configuration Hub user');
    is('AC14 blade is a dialog named by its title', await p.evaluate(() => {
      const b = document.querySelector('.cu-blade');
      return b.getAttribute('role') + '|' + b.getAttribute('aria-modal') + '|' + document.getElementById(b.getAttribute('aria-labelledby')).textContent;
    }), 'dialog|true|Add Configuration Hub user');
    is('AC14 focus on Email at open', await active(p), 'cu-add-email');
    is('AC14 intro', await text(p, '.cu-blade .text-block p'),
       "We'll email them a link to create their account. They'll choose a username and password, and set up multi-factor authentication.");
    is('AC14 labels', (await p.$$eval('.cu-blade .form-label', ls => ls.map(l => l.textContent.trim()))).join(','), 'Email,Role');
    is('AC14 no required markers', await p.locator('.cu-blade .form-label small').count(), 0);
    is('AC14 email helper', await text(p, '#cu-add-email-helper'), "We'll only use this to send the invitation. They'll sign in with their username.");
    is('AC14 role helper before a choice', await text(p, '#cu-add-role-helper'), 'You can change their role later.');
    is('AC14 role placeholder', await p.evaluate(() => { const o = document.querySelector('#cu-add-role option'); return o.textContent + '|' + o.disabled + '|' + o.value; }), 'Select a role|true|');
    is('AC14 actions', (await p.$$eval('.cu-blade .blade-footer .btn', bs => bs.map(b => b.textContent.trim() + ':' + b.className))).join(' / '),
       'Cancel:btn btn-secondary / Send invitation:btn btn-primary');
    ok('AC14 actions right-aligned', await p.evaluate(() => {
      const f = document.querySelector('.cu-blade .blade-footer').getBoundingClientRect();
      const s = document.getElementById('cu-add-send').getBoundingClientRect();
      return Math.abs(f.right - s.right) < 32;
    }));
    is('AC14 Send invitation enabled', await p.evaluate(() => document.getElementById('cu-add-send').disabled), false);
    is('AC14 Close named', await p.getAttribute('.cu-blade .blade-close', 'aria-label'), 'Close Add Configuration Hub user');
    is('AC14 Close tooltip', await p.getAttribute('.cu-blade .blade-close', 'data-cu-tooltip'), 'Close');
    ok('AC14 blade sits under the top bar', await p.evaluate(() =>
      Math.abs(document.querySelector('.cu-blade').getBoundingClientRect().top - document.getElementById('ch-header').getBoundingClientRect().bottom) < 2));
    ok('AC14 page behind is dimmed', await p.evaluate(() => !!document.querySelector('.offcanvas-backdrop.show')));
    await p.click('#cu-add-send');
    await wait(p);
    is('AC14 email error', await text(p, '#cu-add-email-error'), 'Enter an email address.');
    is('AC14 role error', await text(p, '#cu-add-role-error'), 'Select a role.');
    is('AC14 errors visible', await p.evaluate(() => ['cu-add-email-error', 'cu-add-role-error'].every(id => getComputedStyle(document.getElementById(id)).display !== 'none')), true);
    is('AC14 focus on Email', await active(p), 'cu-add-email');
    is('AC14 errors linked to fields', await describedBy(p, '#cu-add-email'), "We'll only use this to send the invitation. They'll sign in with their username. | Enter an email address.");
    is('AC14 aria-invalid', await p.getAttribute('#cu-add-email', 'aria-invalid'), 'true');
    is('AC14 role invalid', await p.getAttribute('#cu-add-role', 'aria-invalid'), 'true');
    /* Escape closes Add without asking; focus returns to Add account. */
    await p.fill('#cu-add-email', 'someone@example.com');
    await p.keyboard.press('Escape');
    await wait(p);
    is('AC14 Escape closes without confirmation', await bladeOpen(p) + '/' + await modalOpen(p, 'cu-discard-modal'), 'false/false');
    is('AC14 focus back on Add account', await active(p), 'cu-add');
    await p.click('#cu-add');
    await wait(p);
    is('AC14 values discarded on reopen', await p.inputValue('#cu-add-email'), '');
    await p.click('#cu-add-cancel');
    await wait(p);
    is('AC14 Cancel closes', await bladeOpen(p), false);
    await p.context().close();
  }

  /* ===== AC 15 · existing account ======================================= */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-add');
    await wait(p);
    await p.fill('#cu-add-email', 'hannah.clarke@northgate-insurance.co.uk');
    await p.focus('#cu-add-role');
    await wait(p);
    is('AC15 checked on blur', await text(p, '#cu-add-email-error'), "There's already a Configuration Hub user with this email address.");
    is('AC15 announced', await text(p, '#ch-announcer'), "There's already a Configuration Hub user with this email address.");
    await p.fill('#cu-add-email', 'chloe.davies@northgate-insurance.co.uk');
    await p.focus('#cu-add-role');
    await wait(p);
    is('AC15 inactive counts too', await text(p, '#cu-add-email-error'), "There's already a Configuration Hub user with this email address.");
    for (const [value, want] of [
      ['not-an-email', 'Enter an email address in the correct format, like name@example.com.'],
      ['a'.repeat(250) + '@x.co', 'Email address must be 254 characters or fewer.'],
      ['   ', 'Enter an email address.']
    ]) {
      await p.fill('#cu-add-email', value);
      await p.focus('#cu-add-role');
      await wait(p, 100);
      is('AC15 email rule: ' + want, await text(p, '#cu-add-email-error'), want);
    }
    await p.context().close();
  }

  /* ===== AC 16 · already invited, mixed case and a trailing space ======== */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-add');
    await wait(p);
    await p.fill('#cu-add-email', 'Daniel.Reyes@northgate-insurance.co.uk ');
    await p.focus('#cu-add-role');
    await wait(p);
    is('AC16 already invited', await text(p, '#cu-add-email-error'),
       'This person has already been invited. You can resend their invitation from their user details.');
    await p.context().close();
  }

  /* ===== AC 17 · send a valid invitation ================================ */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-add');
    await wait(p);
    await p.fill('#cu-add-email', '  New.Person@Northgate-Insurance.co.uk ');
    await p.selectOption('#cu-add-role', 'Viewer');
    is('AC17 helper follows role', await text(p, '#cu-add-role-helper'), "Can see every Configuration Hub app, but can't make changes.");
    await p.click('#cu-add-send');
    await wait(p, 400);
    is('AC17 blade closed', await bladeOpen(p), false);
    is('AC17 focus on Add account', await active(p), 'cu-add');
    is('AC17 toast', await toastText(p), 'Invitation sent to new.person@northgate-insurance.co.uk.');
    is('AC17 toast is success', await p.evaluate(() => !!document.querySelector('#cu-toasts .toast.toast-success')), true);
    is('AC17 toasts polite', await p.getAttribute('#cu-toasts', 'aria-live'), 'polite');
    is('AC17 Pending chip 3', await chips(p), '9,3,1');
    is('AC17 Showing 13', await text(p, '#cu-showing'), 'Showing 1–10 of 13');
    await p.selectOption('#cu-status-filter', 'Pending');
    await wait(p);
    is('AC17 pending row exists', (await emails(p)).includes('new.person@northgate-insurance.co.uk'), true);
    await action(p, 'new.person@northgate-insurance.co.uk', 'view');
    is('AC17 invited today', await p.evaluate(() => [...document.querySelectorAll('.cu-blade .key-value')].map(kv => kv.querySelector('.key').textContent + '=' + kv.querySelector('.value').textContent).join(';')),
       'Email=new.person@northgate-insurance.co.uk;Role=Viewer;Status=Pending;Invited on=' + TODAY);
    await p.context().close();
  }

  /* ===== AC 18 · Edit Hannah Clarke ===================================== */
  {
    const p = await open(browser, USERS);
    await action(p, 'hannah.clarke@northgate-insurance.co.uk', 'edit');
    is('AC18 title', await text(p, '.cu-blade .blade-title'), 'Edit user');
    is('AC18 fields in order', (await p.$$eval('.cu-blade .form-label', ls => ls.map(l => l.textContent.trim()))).join(','), 'Username,Email,First name,Last name,Role');
    is('AC18 values', (await p.$$eval('.cu-blade .form-control, .cu-blade .form-select', fs => fs.map(f => f.value))).join(','),
       'hannah.clarke,hannah.clarke@northgate-insurance.co.uk,Hannah,Clarke,Editor');
    is('AC18 Username and Email read-only', await p.evaluate(() => ['cu-edit-username', 'cu-edit-email'].map(id => document.getElementById(id).readOnly && !document.getElementById(id).disabled).join(',')), 'true,true');
    is('AC18 read-only helpers', (await p.$$eval('#cu-edit-username-helper, #cu-edit-email-helper', hs => hs.map(h => h.textContent))).join(' | '), "Username can't be changed. | Email can't be changed.");
    is('AC18 read-only helpers visible', await p.evaluate(() => ['cu-edit-username-helper', 'cu-edit-email-helper'].every(id => document.getElementById(id).getBoundingClientRect().height > 0)), true);
    is('AC18 read-only helpers linked', await describedBy(p, '#cu-edit-username'), "Username can't be changed.");
    is('AC18 focus on First name', await active(p), 'cu-edit-first');
    await p.focus('#cu-edit-username');
    is('AC18 Username focusable', await active(p), 'cu-edit-username');
    await p.focus('#cu-edit-email');
    is('AC18 Email focusable', await active(p), 'cu-edit-email');
    is('AC18 no password or MFA field', await p.evaluate(() => document.querySelectorAll('.cu-blade input[type=password]').length + [...document.querySelectorAll('.cu-blade .form-label')].filter(l => /password|mfa|multi-factor/i.test(l.textContent)).length), 0);
    is('AC18 Save changes disabled', await p.evaluate(() => document.getElementById('cu-edit-save').disabled), true);
    is('AC18 role helper is description', await text(p, '#cu-edit-role-helper'), "Can use every Configuration Hub app, but can't manage Configuration Hub users.");
    is('AC18 actions', (await p.$$eval('.cu-blade .blade-footer .btn', bs => bs.map(b => b.textContent.trim()))).join(','), 'Cancel,Save changes');
    await p.fill('#cu-edit-first', 'Hannah');
    is('AC18 same value keeps Save disabled', await p.evaluate(() => document.getElementById('cu-edit-save').disabled), true);
    await p.selectOption('#cu-edit-role', 'Viewer');
    is('AC18 change enables Save', await p.evaluate(() => document.getElementById('cu-edit-save').disabled), false);
    is('AC18 role helper follows', await text(p, '#cu-edit-role-helper'), "Can see every Configuration Hub app, but can't make changes.");
    await p.context().close();
  }

  /* ===== AC 19 · change Last name and save ============================== */
  {
    const p = await open(browser, USERS);
    await action(p, 'hannah.clarke@northgate-insurance.co.uk', 'edit');
    await p.fill('#cu-edit-last', '');
    await p.click('#cu-edit-save');
    await wait(p);
    is('AC19 empty last name error', await text(p, '#cu-edit-last-error'), 'Enter a last name.');
    is('AC19 focus on the error', await active(p), 'cu-edit-last');
    await p.fill('#cu-edit-last', 'x'.repeat(51));
    await p.click('#cu-edit-save');
    await wait(p);
    is('AC19 long last name error', await text(p, '#cu-edit-last-error'), 'Last name must be 50 characters or fewer.');
    await p.fill('#cu-edit-first', '');
    await p.click('#cu-edit-save');
    await wait(p);
    is('AC19 empty first name error', await text(p, '#cu-edit-first-error'), 'Enter a first name.');
    is('AC19 focus on the first error', await active(p), 'cu-edit-first');
    await p.fill('#cu-edit-first', 'Hannah');
    await p.fill('#cu-edit-last', 'Whitfield');
    await p.click('#cu-edit-save');
    await wait(p, 400);
    is('AC19 blade closed', await bladeOpen(p), false);
    is('AC19 toast', await toastText(p), 'Changes saved for Hannah Whitfield.');
    const id = await rowId(p, 'hannah.clarke@northgate-insurance.co.uk');
    is('AC19 row updates', await text(p, '#cu-rows tr[data-id="' + id + '"] td:nth-child(2) .cu-trunc'), 'Hannah Whitfield');
    is('AC19 initials update', await text(p, '#cu-rows tr[data-id="' + id + '"] .avatar-initials'), 'HW');
    is('AC19 focus back on the row Edit', await active(p), 'Edit Hannah Whitfield');
    is('AC19 username unchanged', await text(p, '#cu-rows tr[data-id="' + id + '"] td:nth-child(3)'), 'hannah.clarke');
    await p.context().close();
  }

  /* ===== AC 20 · Escape with unsaved changes ============================ */
  {
    const p = await open(browser, USERS);
    await action(p, 'tomasz.nowak@northgate-insurance.co.uk', 'edit');
    await p.fill('#cu-edit-first', 'Tom');
    await p.keyboard.press('Escape');
    await wait(p);
    await modalShown(p, 'cu-discard-modal');
    is('AC20 Discard Modal opens', await modalOpen(p, 'cu-discard-modal'), true);
    is('AC20 blade still open', await bladeOpen(p), true);
    is('AC20 Modal title', await text(p, '#cu-discard-title'), 'Discard your changes?');
    is('AC20 Modal body', await text(p, '#cu-discard-modal .modal-body p'), "You've made changes that haven't been saved. If you leave now, they'll be lost.");
    is('AC20 Modal actions', (await p.$$eval('#cu-discard-modal .modal-footer .btn', bs => bs.map(b => b.textContent.trim() + ':' + b.className))).join(' / '),
       'Keep editing:btn btn-secondary / Discard changes:btn btn-primary');
    ok('AC20 Modal above the blade', await p.evaluate(() => Number(getComputedStyle(document.getElementById('cu-discard-modal')).zIndex) > Number(getComputedStyle(document.querySelector('.cu-blade')).zIndex)));
    await p.click('#cu-discard-keep');
    await wait(p);
    await modalHidden(p, 'cu-discard-modal');
    is('AC20 Keep editing keeps the changes', await p.inputValue('#cu-edit-first'), 'Tom');
    is('AC20 Keep editing returns to the blade', await bladeOpen(p) + '/' + await modalOpen(p, 'cu-discard-modal'), 'true/false');
    is('AC20 focus back on the opener (the field)', await active(p), 'cu-edit-first');
    /* Close button: Modal again, Escape on the Modal keeps editing. */
    await p.click('.cu-blade .blade-close');
    await wait(p);
    await modalShown(p, 'cu-discard-modal');
    is('AC20 Close asks too', await modalOpen(p, 'cu-discard-modal'), true);
    await p.keyboard.press('Escape');
    await wait(p);
    await modalHidden(p, 'cu-discard-modal');
    is('AC20 Escape on the Modal keeps editing', await bladeOpen(p) + '/' + await p.inputValue('#cu-edit-first'), 'true/Tom');
    is('AC20 focus back on Close', await active(p), 'Close Edit user');
    await p.click('#cu-edit-cancel');
    await wait(p);
    await modalShown(p, 'cu-discard-modal');
    is('AC20 Cancel asks too', await modalOpen(p, 'cu-discard-modal'), true);
    await p.click('#cu-discard-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-discard-modal');
    is('AC20 Discard closes the blade', await bladeOpen(p), false);
    is('AC20 nothing saved', (await names(p)).includes('Tomasz Nowak'), true);
    is('AC20 focus back on the row Edit', await active(p), 'Edit Tomasz Nowak');
    /* Without changes the blade just closes. */
    await action(p, 'tomasz.nowak@northgate-insurance.co.uk', 'edit');
    await p.keyboard.press('Escape');
    await wait(p);
    is('AC20 no changes: Escape just closes', await bladeOpen(p) + '/' + await modalOpen(p, 'cu-discard-modal'), 'false/false');
    await p.context().close();
  }

  /* ===== AC 21 · Edit Sophie Marchetti ================================== */
  {
    const p = await open(browser, USERS);
    await action(p, 'sophie.marchetti@northgate-insurance.co.uk', 'edit');
    is('AC21 role read-only (Buckholt Select)', await p.evaluate(() => { const s = document.getElementById('cu-edit-role'); return s.disabled && s.classList.contains('readonly'); }), true);
    is('AC21 own role helper', await text(p, '#cu-edit-role-helper'), OWN_ROLE);
    is('AC21 helper linked', await describedBy(p, '#cu-edit-role'), OWN_ROLE);
    is('AC21 helper visible', await p.evaluate(() => document.getElementById('cu-edit-role-helper').getBoundingClientRect().height > 0), true);
    await p.context().close();
  }

  /* ===== AC 22 · Sophie's Delete and checkbox disabled =================== */
  {
    const p = await open(browser, USERS);
    const id = await rowId(p, 'sophie.marchetti@northgate-insurance.co.uk');
    is('AC22 Delete disabled', await p.evaluate(i => document.querySelector('button[data-action=delete][data-id="' + i + '"]').disabled, id), true);
    is('AC22 Delete reason', await describedBy(p, 'button[data-action=delete][data-id="' + id + '"]'), OWN_DELETE);
    is('AC22 Delete Tooltip gives the reason', await p.evaluate(i => document.querySelector('button[data-action=delete][data-id="' + i + '"]').closest('.cu-disabled').getAttribute('data-cu-tooltip'), id), OWN_DELETE);
    is('AC22 checkbox disabled', await p.evaluate(i => document.getElementById('cu-select-' + i).disabled, id), true);
    is('AC22 checkbox name', await p.getAttribute('#cu-select-' + id, 'aria-label'), 'Select Sophie Marchetti');
    is('AC22 checkbox reason', await describedBy(p, '#cu-select-' + id), OWN_SELECT);
    /* The Tooltip shows on hover over the disabled control. */
    await p.hover('button[data-action=delete][data-id="' + id + '"]', { force: true });
    await wait(p, 1100);
    is('AC22 Tooltip shows on hover', await text(p, '.tooltip .tooltip-inner'), OWN_DELETE);
    /* View and Edit stay available on her row. */
    is('AC22 View and Edit enabled', await p.evaluate(i => ['view', 'edit'].every(a => !document.querySelector('button[data-action=' + a + '][data-id="' + i + '"]').disabled), id), true);
    /* Header checkbox skips her row. */
    await p.click('#cu-select-all');
    await wait(p);
    is('AC22 select all skips own row', await p.evaluate(() => CUUsers.state.selected.length), 9);
    is('AC22 header checked', await p.evaluate(() => document.getElementById('cu-select-all').checked), true);
    await p.context().close();
  }

  /* ===== AC 23 · James becomes an Editor =============================== */
  {
    const p = await open(browser, USERS);
    const sophie = await rowId(p, 'sophie.marchetti@northgate-insurance.co.uk');
    await action(p, 'james.okonkwo@northgate-insurance.co.uk', 'edit');
    is('AC23 James role editable', await p.evaluate(() => document.getElementById('cu-edit-role').disabled), false);
    await p.selectOption('#cu-edit-role', 'Editor');
    await p.click('#cu-edit-save');
    await wait(p, 400);
    is('AC23 toast', await toastText(p), 'Changes saved for James Okonkwo.');
    is('AC23 Sophie Delete: last-Administrator reason', await describedBy(p, 'button[data-action=delete][data-id="' + sophie + '"]'), LAST_ADMIN);
    await action(p, 'sophie.marchetti@northgate-insurance.co.uk', 'edit');
    is('AC23 Sophie role locked with the last-Administrator reason', await text(p, '#cu-edit-role-helper'), LAST_ADMIN);
    await p.keyboard.press('Escape');
    await wait(p);
    await p.context().close();
  }

  /* ===== AC 24 · resend a pending invitation ============================ */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-pages button[aria-label="Page 2"]');
    await wait(p);
    await action(p, 'daniel.reyes@northgate-insurance.co.uk', 'edit');
    is('AC24 title', await text(p, '.cu-blade .blade-title'), 'Edit user');
    is('AC24 invited text', await text(p, '#cu-edit-invited'),
       "Invitation sent on 20 Oct 2026. Their username and name will show here once they've created their account.");
    is('AC24 fields', (await p.$$eval('.cu-blade .form-label', ls => ls.map(l => l.textContent.trim()))).join(','), 'Email,Role');
    is('AC24 email read-only', await p.evaluate(() => document.getElementById('cu-edit-email').readOnly), true);
    is('AC24 email helper visible', await p.evaluate(() => { const h = document.getElementById('cu-edit-email-helper'); return h.textContent + '|' + (h.getBoundingClientRect().height > 0); }), "Email can't be changed.|true");
    is('AC24 focus on Role', await active(p), 'cu-edit-role');
    is('AC24 Resend is Secondary', await p.evaluate(() => document.getElementById('cu-edit-resend').className), 'btn btn-secondary');
    ok('AC24 Resend below the fields', await p.evaluate(() => document.getElementById('cu-edit-resend').getBoundingClientRect().top > document.getElementById('cu-edit-role').getBoundingClientRect().bottom));
    await p.click('#cu-edit-resend');
    await wait(p);
    is('AC24 invited today', await text(p, '#cu-edit-invited'),
       'Invitation sent on ' + TODAY + ". Their username and name will show here once they've created their account.");
    is('AC24 toast', await toastText(p), 'Invitation sent again to daniel.reyes@northgate-insurance.co.uk.');
    is('AC24 blade stays open', await bladeOpen(p), true);
    is('AC24 Save still disabled', await p.evaluate(() => document.getElementById('cu-edit-save').disabled), true);
    await p.selectOption('#cu-edit-role', 'Administrator');
    await p.click('#cu-edit-save');
    await wait(p, 400);
    is('AC24 save toast uses email', await toastText(p), 'Changes saved for daniel.reyes@northgate-insurance.co.uk.');
    is('AC24 role saved', await p.evaluate(() => CUUsers.users().find(a => a.email.startsWith('daniel')).role), 'Administrator');
    await p.context().close();
  }

  /* ===== AC 25 · delete one pending account ============================ */
  {
    const p = await open(browser, USERS);
    await p.click('#cu-pages button[aria-label="Page 2"]');
    await wait(p);
    await action(p, 'l.fischer@northgate-insurance.co.uk', 'delete');
    is('AC25 Modal open', await modalOpen(p, 'cu-delete-modal'), true);
    is('AC25 title', await text(p, '#cu-delete-title'), 'Cancel the invitation for l.fischer@northgate-insurance.co.uk?');
    is('AC25 body', await text(p, '#cu-delete-body'), "The link in their invitation will stop working. You can't undo this.");
    is('AC25 actions', (await p.$$eval('#cu-delete-modal .modal-footer .btn', bs => bs.map(b => b.textContent.trim() + ':' + b.className))).join(' / '),
       'Cancel:btn btn-secondary / Cancel invitation:btn btn-primary btn-danger');
    /* Cancel first: no change, focus back on the row's Delete. */
    await p.click('#cu-delete-cancel');
    await wait(p);
    await modalHidden(p, 'cu-delete-modal');
    is('AC25 Cancel keeps the row', (await emails(p)).includes('l.fischer@northgate-insurance.co.uk'), true);
    is('AC25 Cancel returns focus', await active(p), 'Delete l.fischer@northgate-insurance.co.uk');
    await action(p, 'l.fischer@northgate-insurance.co.uk', 'delete');
    await p.click('#cu-delete-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-delete-modal');
    is('AC25 row gone', await p.evaluate(() => CUUsers.users().some(a => a.email.startsWith('l.fischer'))), false);
    is('AC25 Pending chip down by one', await chips(p), '9,1,1');
    is('AC25 toast', await toastText(p), 'Invitation for l.fischer@northgate-insurance.co.uk cancelled.');
    is('AC25 focus on Search', await active(p), 'cu-search');
    /* One active account. */
    await action(p, 'daniel.reyes@northgate-insurance.co.uk', 'delete');
    await p.click('#cu-delete-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-delete-modal');
    is('AC25 empty page shows the previous one', await text(p, '#cu-showing'), 'Showing 1–10 of 10');
    await action(p, 'ravi.patel@northgate-insurance.co.uk', 'delete');
    is('AC25 single active title', await text(p, '#cu-delete-title'), "Delete Ravi Patel?");
    is('AC25 single active body', await text(p, '#cu-delete-body'),
       "They won't be able to sign in to Configuration Hub. Their Mobius user, if they have one, isn't affected. You can't undo this.");
    is('AC25 single active action', await text(p, '#cu-delete-confirm'), 'Delete');
    await p.click('#cu-delete-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-delete-modal');
    is('AC25 single delete toast', await toastText(p), "Ravi Patel deleted.");
    is('AC25 Active chip down', await chips(p), '8,0,1');
    await p.context().close();
  }

  /* ===== AC 26 · bulk delete three rows ================================ */
  {
    const p = await open(browser, USERS);
    await select(p, 'aisha.rahman@northgate-insurance.co.uk');
    is('AC26 header indeterminate', await p.evaluate(() => document.getElementById('cu-select-all').indeterminate), true);
    is('AC26 Edit enabled with one', await p.evaluate(() => document.getElementById('cu-bulk-edit').disabled), false);
    await select(p, 'chloe.davies@northgate-insurance.co.uk');
    await select(p, 'megan.lewis@northgate-insurance.co.uk');
    is('AC26 Edit disabled with three', await p.evaluate(() => document.getElementById('cu-bulk-edit').disabled), true);
    is('AC26 Delete enabled', await p.evaluate(() => document.getElementById('cu-bulk-delete').disabled), false);
    await p.click('#cu-more-toggle');
    await wait(p);
    is('AC26 menu open', await p.evaluate(() => document.getElementById('cu-more-panel').classList.contains('show')), true);
    is('AC26 menu items', (await p.$$eval('#cu-more-panel .menu-item', ms => ms.map(m => m.textContent.trim()))).join(','), 'Edit,Delete');
    is('AC26 Delete is danger', await p.evaluate(() => document.getElementById('cu-bulk-delete').classList.contains('menu-item-danger')), true);
    is('AC26 focus on the first enabled item', await active(p), 'cu-bulk-delete');
    await p.click('#cu-bulk-delete');
    await wait(p);
    await modalShown(p, 'cu-delete-modal');
    is('AC26 title', await text(p, '#cu-delete-title'), 'Delete 3 users?');
    is('AC26 body', await text(p, '#cu-delete-body'),
       "They won't be able to sign in to Configuration Hub, and any pending invitations will be cancelled. Mobius users aren't affected. You can't undo this.");
    await p.click('#cu-delete-confirm');
    await wait(p, 400);
    await modalHidden(p, 'cu-delete-modal');
    is('AC26 toast', await toastText(p), '3 users deleted.');
    is('AC26 selection cleared', await p.evaluate(() => CUUsers.state.selected.length + document.querySelectorAll('#cu-rows input[type=checkbox]:checked').length), 0);
    is('AC26 focus on Search', await active(p), 'cu-search');
    is('AC26 chips update', await chips(p), '7,2,0');
    /* Selection clears when the page, sort or filters change. */
    await select(p, 'james.okonkwo@northgate-insurance.co.uk');
    await p.click('th[data-sort-key="email"] button');
    await wait(p);
    is('AC26 sort clears selection', await p.evaluate(() => CUUsers.state.selected.length), 0);
    await select(p, 'james.okonkwo@northgate-insurance.co.uk');
    await p.fill('#cu-search', 'o');
    await wait(p);
    is('AC26 search clears selection', await p.evaluate(() => CUUsers.state.selected.length), 0);
    await p.fill('#cu-search', '');
    /* More actions > Edit with one row; focus returns to More actions. */
    await select(p, 'james.okonkwo@northgate-insurance.co.uk');
    await p.click('#cu-more-toggle');
    await wait(p);
    await p.click('#cu-bulk-edit');
    await wait(p);
    is('AC26 More actions Edit opens the blade', await text(p, '.cu-blade .blade-title'), 'Edit user');
    is('AC26 for the selected account', await p.inputValue('#cu-edit-email'), 'james.okonkwo@northgate-insurance.co.uk');
    await p.click('#cu-edit-cancel');
    await wait(p);
    is('AC26 focus back on More actions', await active(p), 'cu-more-toggle');
    await p.context().close();
  }

  /* ===== AC 27 · environment switch with unsaved changes ================= */
  for (const which of ['add', 'edit']) {
    const p = await open(browser, USERS);
    if (which === 'add') {
      await p.click('#cu-add');
      await wait(p);
      await p.fill('#cu-add-email', 'someone@example.com');
    } else {
      await action(p, 'oliver.bennett@northgate-insurance.co.uk', 'edit');
      await p.fill('#cu-edit-first', 'Olly');
    }
    is('AC27 ' + which + ': top bar usable above the blade', await p.evaluate(() => {
      const r = document.querySelector('label[for=ch-env-test]').getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!hit.closest('#ch-header');
    }), true);
    await p.click('label[for=ch-env-test]');
    await modalShown(p, 'ch-env-modal');
    is('AC27 ' + which + ': shell Modal shows', await modalOpen(p, 'ch-env-modal'), true);
    is('AC27 ' + which + ': shell Modal title', await text(p, '#ch-env-modal-title'), 'Switch to Test without saving?');
    is('AC27 ' + which + ': still Live', await p.evaluate(() => CHShell.environment), 'live');
    ok('AC27 ' + which + ': shell Modal above the blade', await p.evaluate(() => Number(getComputedStyle(document.getElementById('ch-env-modal')).zIndex) > Number(getComputedStyle(document.querySelector('.cu-blade')).zIndex)));
    if (which === 'edit') {
      /* Stay first: the changes stay, back in the blade. */
      await p.click('#ch-env-modal-stay');
      await wait(p);
      await modalHidden(p, 'ch-env-modal');
      is('AC27 edit: Stay keeps the blade and changes', await bladeOpen(p) + '/' + await p.inputValue('#cu-edit-first'), 'true/Olly');
      is('AC27 edit: Stay keeps Live', await p.evaluate(() => CHShell.environment), 'live');
      ok('AC27 edit: focus back in the blade', await p.evaluate(() => document.querySelector('.cu-blade').contains(document.activeElement)));
      await p.click('label[for=ch-env-test]');
      await modalShown(p, 'ch-env-modal');
    }
    await p.click('#ch-env-modal-switch');
    await settle(p);
    is('AC27 ' + which + ': lands on CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    is('AC27 ' + which + ': in Test', await p.evaluate(() => CHShell.environment), 'test');
    is('AC27 ' + which + ': announced', await text(p, '#ch-announcer'), 'Test environment selected.');
    await p.context().close();
  }
  {
    /* Without changes, a switch goes straight to CU-00-01. */
    const p = await open(browser, USERS);
    await p.click('label[for=ch-env-test]');
    await settle(p);
    is('AC27 no changes: straight to CU-00-01', new URL(p.url()).pathname.endsWith('/CH-USERS/index.html'), true);
    await p.context().close();
  }

  /* ===== AC 28 · focus returns to the opener ============================ */
  {
    const p = await open(browser, USERS);
    await action(p, 'aisha.rahman@northgate-insurance.co.uk', 'view');
    is('AC28 View title is the full name', await text(p, '.cu-blade .blade-title'), 'Aisha Rahman');
    is('AC28 View focus on the title', await active(p), await p.evaluate(() => document.querySelector('.cu-blade .blade-title').id));
    is('AC28 View pairs', await p.evaluate(() => [...document.querySelectorAll('.cu-blade .key-value .key')].map(k => k.textContent).join(',')), 'Username,Email,First name,Last name,Role,Status');
    is('AC28 View values', await p.evaluate(() => [...document.querySelectorAll('.cu-blade .key-value .value')].map(k => k.textContent).join(',')), 'aisha.rahman,aisha.rahman@northgate-insurance.co.uk,Aisha,Rahman,Viewer,Active');
    is('AC28 View actions', (await p.$$eval('.cu-blade .blade-footer .btn', bs => bs.map(b => b.textContent.trim() + ':' + b.className))).join(' / '),
       'Close:btn btn-secondary / Edit:btn btn-primary');
    await p.click('#cu-view-close');
    await wait(p);
    is('AC28 View Close returns focus', await active(p), 'View Aisha Rahman');
    await action(p, 'aisha.rahman@northgate-insurance.co.uk', 'view');
    await p.keyboard.press('Escape');
    await wait(p);
    is('AC28 View Escape returns focus', await active(p), 'View Aisha Rahman');
    /* View > Edit replaces the blade; closing returns to the row's Edit. */
    await action(p, 'aisha.rahman@northgate-insurance.co.uk', 'view');
    await p.click('#cu-view-edit');
    await wait(p, 400);
    is('AC28 Edit replaces View', await text(p, '.cu-blade .blade-title') + '/' + await p.locator('.cu-blade').count(), 'Edit user/1');
    await p.click('.cu-blade .blade-close');
    await wait(p);
    is('AC28 Edit from View returns to row Edit', await active(p), 'Edit Aisha Rahman');
    /* Pending View. */
    await p.click('#cu-pages button[aria-label="Page 2"]');
    await wait(p);
    await action(p, 'daniel.reyes@northgate-insurance.co.uk', 'view');
    is('AC28 pending View title is the email', await text(p, '.cu-blade .blade-title'), 'daniel.reyes@northgate-insurance.co.uk');
    is('AC28 pending View pairs', await p.evaluate(() => [...document.querySelectorAll('.cu-blade .key-value')].map(k => k.querySelector('.key').textContent + '=' + k.querySelector('.value').textContent).join(';')),
       'Email=daniel.reyes@northgate-insurance.co.uk;Role=Editor;Status=Pending;Invited on=20 Oct 2026');
    await p.click('.cu-blade .blade-close');
    await wait(p);
    is('AC28 pending View returns focus', await active(p), 'View daniel.reyes@northgate-insurance.co.uk');
    /* Focus stays inside an open blade. */
    await p.click('#cu-pages button[aria-label="Page 1"]');
    await wait(p);
    await action(p, 'aisha.rahman@northgate-insurance.co.uk', 'edit');
    let inside = true;
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Tab');
      inside = inside && await p.evaluate(() => document.querySelector('.cu-blade').contains(document.activeElement));
    }
    ok('AC28 focus stays in the blade (Tab)', inside);
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Shift+Tab');
      inside = inside && await p.evaluate(() => document.querySelector('.cu-blade').contains(document.activeElement));
    }
    ok('AC28 focus stays in the blade (Shift+Tab)', inside);
    await p.keyboard.press('Escape');
    await wait(p);
    is('AC28 Edit Escape returns focus', await active(p), 'Edit Aisha Rahman');
    is('AC28 no page errors', p.errors.join('|'), '');
    await p.context().close();
  }

  /* ===== AC 29 · the revision 3 names appear nowhere ==================== */
  {
    const OLD = /Account Management|Mobius accounts|Configuration Hub accounts/i;
    /* In the pages as rendered (text, titles, every attribute), through
       every screen and the blades and Modals. */
    const p = await open(browser, HOME);
    const scan = async label => {
      const found = await p.evaluate(src => {
        const re = new RegExp(src, 'i');
        const hits = [];
        if (re.test(document.title)) hits.push('title');
        if (re.test(document.body.innerText)) hits.push('text');
        document.querySelectorAll('*').forEach(e => [...e.attributes].forEach(a => { if (re.test(a.value)) hits.push(e.tagName + '@' + a.name); }));
        document.querySelectorAll('.visually-hidden, [hidden]').forEach(e => { if (re.test(e.textContent)) hits.push('hidden text'); });
        return hits.join(',');
      }, OLD.source);
      is('AC29 none on ' + label, found, '');
    };
    await scan('the home page');
    await p.goto(BASE_PAGE, { waitUntil: 'networkidle' });
    await scan('CU-00-01');
    await p.goto(BASE + '/prototypes/CH-USERS/mobius.html', { waitUntil: 'networkidle' });
    await scan('CU-00-03');
    await p.goto(USERS, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: STILL });
    await scan('CU-00-02');
    await p.click('#cu-add');
    await wait(p);
    await scan('the Add blade');
    await p.keyboard.press('Escape');
    await wait(p);
    await action(p, 'hannah.clarke@northgate-insurance.co.uk', 'view');
    await p.click('#cu-view-edit');
    await wait(p, 400);
    await scan('the Edit blade');
    await p.click('#cu-edit-cancel');
    await wait(p);
    await action(p, 'hannah.clarke@northgate-insurance.co.uk', 'delete');
    await scan('the Delete Modal');
    await p.context().close();
    /* And in the prototype's own source: every HTML, script and stylesheet
       in prototypes/CH-USERS (the spec and the findings files quote the old
       names on purpose, so Markdown is not scanned). */
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(__dirname, '..', 'prototypes', 'CH-USERS');
    const files = fs.readdirSync(dir).filter(f => /\.(html|js|css)$/.test(f));
    const inSource = files.filter(f => OLD.test(fs.readFileSync(path.join(dir, f), 'utf8')));
    is('AC29 none in the source (' + files.length + ' files)', inSource.join(','), '');
  }

  /* ===== Variants ====================================================== */
  {
    const p = await open(browser, USERS + '?variant=only-me');
    is('Only me: one row', (await names(p)).join(','), 'Sophie Marchetti');
    is('Only me: Showing', await text(p, '#cu-showing'), 'Showing 1–1 of 1');
    is('Only me: page controls disabled', await p.evaluate(() => [...document.querySelectorAll('#cu-pages button')].every(b => b.disabled)), true);
    is('Only me: chips', await chips(p), '1,0,0');
    const id = await rowId(p, 'sophie.marchetti@northgate-insurance.co.uk');
    is('Only me: last-Administrator rule on the signed-in user', await describedBy(p, 'button[data-action=delete][data-id="' + id + '"]'), LAST_ADMIN);
    is('Only me: header checkbox disabled', await p.evaluate(() => document.getElementById('cu-select-all').disabled), true);
    await p.goto(BASE_PAGE, { waitUntil: 'networkidle' });
    is('Only me: CU-00-01 card hides zero counts', await cardTags(p, 'configuration-hub'), '1 user|1 active');
    is('Only me: card description', await p.evaluate(() => document.getElementById('cu-card-ch-summary').textContent), '1 user, 1 active.');
    await p.goto(USERS, { waitUntil: 'networkidle' });
    is('Only me: kept for the tab', await text(p, '#cu-showing'), 'Showing 1–1 of 1');
    await p.goto(USERS + '?variant=default', { waitUntil: 'networkidle' });
    is('Only me: ?variant=default goes back', await text(p, '#cu-showing'), 'Showing 1–10 of 12');
    await p.context().close();
  }
  {
    const p = await open(browser, USERS + '?seed=long-names', { width: 1088, height: 800 });
    is('Long names: no page errors', p.errors.join('|'), '');
    is('Long names: 12 rows', await text(p, '#cu-showing'), 'Showing 1–10 of 12');
    is('Long names: signed-in row replaced', await p.evaluate(() => CUUsers.users().filter(a => a.self).map(a => a.firstName + ' ' + a.lastName + '|' + a.username + '|' + a.email).join()),
       'Alexandra Montgomery-Fairweather|alexandra.montgomery-fairweather|alexandra.montgomery-fairweather@abbotsfordkingsley-insurancebrokers.co.uk');
    is('Long names: Sophie gone', await p.evaluate(() => CUUsers.users().some(a => a.firstName === 'Sophie')), false);
    is('Long names: organisation truncated in the header', await p.evaluate(() => { const o = document.getElementById('ch-org'); return o.scrollWidth > o.clientWidth; }), true);
    is('Long names: no header item wraps', await p.evaluate(() => Math.round(document.getElementById('ch-header').getBoundingClientRect().height)), 84);
    is('Long names: no horizontal page overflow at 1088', await p.evaluate(() => document.documentElement.scrollWidth), 1088);
    ok('Long names: the table scrolls inside its container', await p.evaluate(() => { const c = document.querySelector('.table-content'); return c.scrollWidth > c.clientWidth && getComputedStyle(c).overflowX === 'auto'; }));
    ok('Long names: filter bar stays one row at 1088', await p.evaluate(() => {
      const b = ['cu-search', 'cu-role-filter', 'cu-status-filter', 'cu-add', 'cu-more-toggle'].map(id => document.getElementById(id).getBoundingClientRect().bottom);
      return Math.max(...b) - Math.min(...b) < 8;
    }));
    await p.context().close();
  }

  /* ===== Accessibility and shell contract ============================== */
  {
    const p = await open(browser, USERS);
    await p.keyboard.press('Tab');
    is('A11y skip link first', await active(p), 'Skip to main content');
    is('A11y lockup goes to the CH-USERS home', new URL(await p.getAttribute('.ch-lockup', 'href')).pathname.endsWith('/CH-USERS/home.html'), true);
    is('A11y sort buttons named', (await p.$$eval('.table-sort', bs => bs.map(b => b.getAttribute('aria-label')))).join(','),
       'Sort by Full name,Sort by Username,Sort by Email,Sort by Role,Sort by Status');
    is('A11y sort icons hidden', await p.locator('.table-sort-icon i:not([aria-hidden=true])').count(), 0);
    is('A11y avatars hidden', await p.locator('#cu-rows .avatar:not([aria-hidden=true])').count(), 0);
    is('A11y chips list named', await p.getAttribute('.cu-chips', 'aria-label'), 'User summary');
    is('A11y table named by the heading', await p.getAttribute('.cu-table', 'aria-labelledby'), 'cu-heading');
    is('A11y row selection does not rely on colour', await p.evaluate(() => {
      document.querySelector('#cu-rows input[type=checkbox]:not(:disabled)').click();
      const tr = document.querySelector('#cu-rows tr.cu-selected');
      return !!tr && tr.querySelector('input').checked;
    }), true);
    /* Tooltips: icon-only controls show theirs on hover. */
    await p.hover('#cu-more-toggle');
    await wait(p, 1100);
    is('A11y More actions Tooltip', await text(p, '.tooltip .tooltip-inner'), 'More actions');
    await p.mouse.move(0, 0);
    await wait(p, 300);
    const eye = '#cu-rows tr[data-id]:nth-child(2) button[data-action=view]';
    await p.hover(eye);
    await wait(p, 1100);
    is('A11y row action Tooltip', await text(p, '.tooltip .tooltip-inner'), 'View');
    /* Truncated text Tooltip. */
    await p.mouse.move(0, 0);
    await wait(p, 300);
    await p.hover('#cu-rows .cu-trunc[data-cu-tooltip]');
    await wait(p, 1100);
    is('A11y truncated text Tooltip', await text(p, '.tooltip .tooltip-inner'), 'Bartholomew Featherstonehaugh-Whitmore');
    /* More actions keyboard: Escape returns focus to the toggle. */
    await p.focus('#cu-more-toggle');
    await p.keyboard.press('Enter');
    await wait(p);
    is('A11y More actions opens', await p.evaluate(() => document.getElementById('cu-bulk-edit').closest('.menu-panel').classList.contains('show')), true);
    await p.keyboard.press('Escape');
    await wait(p);
    is('A11y More actions Escape closes', await p.evaluate(() => document.getElementById('cu-more-panel').classList.contains('show')), false);
    is('A11y More actions Escape returns focus', await active(p), 'cu-more-toggle');
    is('A11y no role=menu on the list (disclosure, as the shell)', await p.locator('#cu-more-panel [role=menu]').count(), 0);
    is('A11y no page errors', p.errors.join('|'), '');
    await p.context().close();
  }

  /* ===== Shell untouched ================================================ */
  {
    const p = await open(browser, BASE + '/prototypes/CH-SHELL/index.html');
    is('Shell override is local: CH-SHELL home still says User Management',
       (await p.$$eval('.ch-app-card h2', hs => hs.map(h => h.textContent.trim())))[1], 'User Management');
    await p.context().close();
  }

  await browser.close();
  t.done();
})();
