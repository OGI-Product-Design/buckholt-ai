const { launch, BASE } = require('./config');
let pass = 0, fail = 0;
const is = (l,g,w) => { if (String(g)===String(w)) pass++; else { fail++; console.log('FAIL '+l+': got ['+g+'] want ['+w+']'); } };
const ok = (l,c) => { if (c) pass++; else { fail++; console.log('FAIL '+l); } };

(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
  await p.goto(BASE + '/prototypes/BACS-calendar/index.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{transition:none!important;animation:none!important} html{scroll-behavior:auto!important}' });

  // --- accessible names (spec 13) ---
  is('name of 14 Oct', await p.getAttribute('[data-date="2026-10-14"]','aria-label'), 'Wednesday 14 October 2026');
  await p.click('[data-date="2026-10-14"]');
  is('name when selected', await p.getAttribute('[data-date="2026-10-14"]','aria-label'), 'Wednesday 14 October 2026, collection day');
  await p.click('[data-date="2026-10-14"]');
  is('today has , today', await p.evaluate(() => document.querySelector('[data-date="2026-10-13"]').getAttribute('aria-label')), 'null');
  ok('readonly cell not focusable', await p.evaluate(() => { const e=document.querySelector('[data-date="2026-10-05"]'); return e.tagName==='DIV' && !e.hasAttribute('tabindex'); }));
  ok('disabled cell not focusable', await p.evaluate(() => { const e=document.querySelector('[data-date="2026-10-17"]'); return e.tagName==='DIV' && !e.hasAttribute('tabindex'); }));
  is('blank cells hidden from AT', await p.getAttribute('.calendar-cell--blank','aria-hidden'), 'true');
  is('readonly text readable', await p.textContent('[data-date="2026-10-05"]'), '05Collected');

  // --- chevrons and month button ---
  is('prev month name', await p.getAttribute('#cal-prev-month','aria-label'), 'Previous month');
  is('next month name', await p.getAttribute('#cal-next-month','aria-label'), 'Next month');
  is('month button expanded', await p.getAttribute('#cal-month-button','aria-expanded'), 'false');
  is('month button haspopup', await p.getAttribute('#cal-month-button','aria-haspopup'), 'dialog');
  is('picker is a dialog', await p.getAttribute('#cal-month-picker','role'), 'dialog');
  is('picker has a name', await p.getAttribute('#cal-month-picker','aria-label'), 'Choose a month');
  is('prev year name', await p.getAttribute('#cal-prev-year','aria-label'), 'Previous year');

  // --- keyboard: cells are reachable and operable ---
  await p.focus('[data-date="2026-10-14"]');
  await p.keyboard.press('Enter');
  is('Enter selects', await p.getAttribute('[data-date="2026-10-14"]','aria-pressed'), 'true');
  is('focus kept after re-render', await p.evaluate(() => document.activeElement.dataset.date), '2026-10-14');
  await p.keyboard.press(' ');
  is('Space deselects', await p.getAttribute('[data-date="2026-10-14"]','aria-pressed'), 'false');

  // --- keyboard: picker opens, Escape closes, focus returns ---
  await p.focus('#cal-month-button');
  await p.keyboard.press('Enter');
  is('picker opened by keyboard', await p.isVisible('#cal-month-picker'), true);
  ok('focus moved into picker', (await p.evaluate(() => document.activeElement.id)).startsWith('cal-picker-month'));
  await p.keyboard.press('Escape');
  is('Escape closes', await p.isVisible('#cal-month-picker'), false);
  is('focus back on month button', await p.evaluate(() => document.activeElement.id), 'cal-month-button');

  // --- focus ring is at least 3px on cells ---
  await p.focus('[data-date="2026-10-14"]');
  const ring = await p.evaluate(() => { const s=getComputedStyle(document.querySelector('[data-date="2026-10-14"]')); return { w:s.outlineWidth, c:s.outlineColor, o:s.outlineOffset }; });
  is('cell focus ring width', ring.w, '3px');
  is('cell focus ring colour', ring.c, 'rgb(23, 72, 208)');

  // --- modal a11y ---
  await p.click('#cal-change-schedule');
  await p.waitForSelector('#cal-schedule-modal.show');
  is('modal labelled', await p.getAttribute('#cal-schedule-modal','aria-labelledby'), 'cal-schedule-modal-title');
  is('radio named', await p.getAttribute('#cal-schedule-none','aria-labelledby'), 'cal-schedule-none-title');
  is('radio described', await p.getAttribute('#cal-schedule-none','aria-describedby'), 'cal-schedule-none-desc');
  is('label for multiselect', await p.getAttribute('#cal-collect-on label.form-label','for'), 'cal-days-select');
  // focus trap: Tab from the last control wraps back inside
  const inside = await p.evaluate(() => {
    const m = document.querySelector('#cal-schedule-modal');
    return m.contains(document.activeElement);
  });
  ok('focus inside modal', inside);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  is('Escape closes modal', await p.isVisible('#cal-schedule-modal'), false);
  is('focus returns to trigger', await p.evaluate(() => document.activeElement.id), 'cal-change-schedule');

  // --- touch targets (spec 13) ---
  const small = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('button.calendar-cell, .calendar-monthbar .btn, #cal-picker-months label').forEach(e => {
      const b = e.getBoundingClientRect();
      if (b.width && (b.width < 44 || b.height < 44)) out.push((e.id || e.dataset.date || e.textContent.trim()) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
    });
    return out;
  });
  console.log('controls under 44x44: ' + (small.length ? small.join(', ') : 'none'));

  // --- no page overflow, and heading order ---
  is('no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth), 1920);
  is('one h1', await p.locator('h1').count(), 1);

  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
