const { launch, BASE } = require('./config');
let pass = 0, fail = 0;
const is = (l,g,w) => { if (String(g)===String(w)) pass++; else { fail++; console.log('FAIL '+l+': got ['+g+'] want ['+w+']'); } };
const ok = (l,c) => { if (c) pass++; else { fail++; console.log('FAIL '+l); } };

(async () => {
  const b = await launch();

  // ---------------- Originators ----------------
  {
    const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/prototypes/Originators/index.html', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
    is('ORI no page errors', errs.join('|'), '');
    is('ORI heading', (await p.textContent('h2')).trim(), 'Originators');
    is('ORI active tab', (await p.textContent('.nav-link.active')).trim(), 'Originators');
    is('ORI calendar tab href', await p.getAttribute('.nav-item:last-child .nav-link', 'href'), '../BACS-calendar/index.html');
    is('ORI cards', await p.locator('#ori-cards .card').count(), 2);
    is('ORI rows', await p.locator('.ori-table tbody tr[data-product]').count(), 34);
    is('ORI selection text', (await p.textContent('#ori-selection-count')).trim(), 'Select products to reassign');
    // sticky action bar still sticky
    is('ORI toolbar sticky', await p.evaluate(() => getComputedStyle(document.getElementById('ori-toolbar')).position), 'sticky');
    // a toast still works with the extended showToast
    await p.evaluate(() => Shell.showToast('Regression check'));
    await p.waitForTimeout(150);
    is('ORI toast title', (await p.textContent('.app-toasts .toast .toast-message h6')).trim(), 'Regression check');
    is('ORI toast keeps role=alert', await p.getAttribute('.app-toasts .toast', 'role'), 'alert');
    is('ORI toast has no note', await p.locator('.app-toasts .toast .toast-note').count(), 0);
    is('ORI clock is live', await p.evaluate(() => document.getElementById('app-clock-date').textContent !== '03 September 2026'), 'true');
    is('ORI no overflow', await p.evaluate(() => document.documentElement.scrollWidth), 1920);
    await p.close();
  }

  // ---------------- BACS Import ----------------
  {
    const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/prototypes/BACS-import/index.html', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
    is('IM no page errors', errs.join('|'), '');
    is('IM active tab', (await p.textContent('.nav-link.active')).trim(), 'Import');
    is('IM calendar tab href', await p.getAttribute('.nav-item:last-child .nav-link', 'href'), '../BACS-calendar/index.html');
    ok('IM table has rows', await p.locator('table tbody tr').count() > 0);
    is('IM no overflow', await p.evaluate(() => document.documentElement.scrollWidth), 1920);
    // blade still opens at 600px
    const openers = await p.locator('a,button').filter({ hasText: /reason code/i }).count();
    await p.close();
  }

  // ---------------- old #/calendar route hands over ----------------
  {
    const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
    await p.goto(BASE + '/prototypes/BACS-import/index.html#/calendar', { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    ok('old #/calendar redirects', p.url().includes('BACS-calendar'));
    await p.close();
  }

  // ---------------- Process is still a placeholder ----------------
  {
    const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
    await p.goto(BASE + '/prototypes/BACS-import/index.html#/process', { waitUntil: 'networkidle' });
    await p.waitForTimeout(200);
    is('Process placeholder', (await p.textContent('#im-placeholder h2')).trim(), 'Process');
    await p.close();
  }

  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
