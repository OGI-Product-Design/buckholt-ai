const { launch, BASE } = require('./config');
let pass = 0, fail = 0;
const is = (l, g, w) => { if (String(g) === String(w)) pass++; else { fail++; console.log('FAIL ' + l + ': got [' + g + '] want [' + w + ']'); } };
const ok = (l, c) => { if (c) pass++; else { fail++; console.log('FAIL ' + l); } };

(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1206 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto(BASE + '/prototypes/BACS-calendar/index.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html,*{scroll-behavior:auto !important} .modal.fade .modal-dialog,.toast.fade{transition:none!important}' });

  const txt = s => p.textContent(s).then(t => t.trim());

  // ---------- CA-00 overview ----------
  is('CA-00 title', await txt('h1'), 'Choose BACS collection days');
  is('CA-00 next', await txt('#cal-next-collection'), 'None set');
  is('CA-00 count label', await txt('#cal-count-label'), 'Collection days in October');
  is('CA-00 count', await txt('#cal-count-value'), '9');
  is('CA-00 schedule', await txt('#cal-schedule-value'), 'No default');
  is('CA-00 month', await txt('#cal-month-label'), 'October 2026');
  is('CA-00 active tab', await txt('.nav-link.active'), 'Calendar');
  // The clock is live on every tab (A3), so it shows today, not TODAY.
  {
    const now = new Date();
    const want = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    is('CA-00 clock is live, not pinned', await txt('#app-clock-date'), want);
    ok('CA-00 clock time looks live', /^\d{2}:\d{2}$/.test(await txt('#app-clock-time')));
    is('CA-00 calendar today is still 13 Oct', await p.locator('[data-date="2026-10-13"] .calendar-cell-date--today').count(), 1);
  }

  // cell states
  is('01 Oct readonly', await p.getAttribute('[data-date="2026-10-01"]', 'class'), 'calendar-cell calendar-cell--readonly');
  is('01 Oct label', await txt('[data-date="2026-10-01"] .calendar-cell-label'), 'Collected');
  is('13 Oct label', await txt('[data-date="2026-10-13"] .calendar-cell-label'), 'Collection day');
  ok('13 Oct today badge', await p.locator('[data-date="2026-10-13"] .calendar-cell-date--today').count() === 1);
  is('14 Oct is a button', await p.evaluate(() => document.querySelector('[data-date="2026-10-14"]').tagName), 'BUTTON');
  is('14 Oct default', await p.getAttribute('[data-date="2026-10-14"]', 'class'), 'calendar-cell calendar-cell--default');
  is('14 Oct aria-pressed', await p.getAttribute('[data-date="2026-10-14"]', 'aria-pressed'), 'false');
  is('17 Oct is a div', await p.evaluate(() => document.querySelector('[data-date="2026-10-17"]').tagName), 'DIV');
  is('17 Oct disabled', await p.getAttribute('[data-date="2026-10-17"]', 'class'), 'calendar-cell calendar-cell--disabled');
  is('date zero-padded', await txt('[data-date="2026-10-01"] .calendar-cell-date'), '01');
  is('blank cells lead', await p.locator('.calendar-cell--blank').count(), 4); // Mon-Wed + trailing Sun
  is('weekday headers', await p.locator('.calendar-weekday').count(), 7);
  is('first weekday', await txt('.calendar-weekday'), 'Monday');
  is('sat header', await p.locator('.calendar-weekday').nth(5).textContent(), 'Sat');

  // ---------- CA-02 add and remove single dates ----------
  await p.click('[data-date="2026-10-15"]');
  is('CA-02 15 selected', await p.getAttribute('[data-date="2026-10-15"]', 'class'), 'calendar-cell calendar-cell--selected');
  is('CA-02 15 pressed', await p.getAttribute('[data-date="2026-10-15"]', 'aria-pressed'), 'true');
  is('CA-02 15 label', await txt('[data-date="2026-10-15"] .calendar-cell-label'), 'Collection day');
  await p.click('[data-date="2026-10-22"]');
  is('CA-02-02 next', await txt('#cal-next-collection'), 'Thursday 15 October');
  is('CA-02-02 count', await txt('#cal-count-value'), '11');
  is('CA-02 schedule unchanged', await txt('#cal-schedule-value'), 'No default');
  is('CA-02 no toast', await p.locator('.app-toasts .toast').count(), 0);
  await p.click('[data-date="2026-10-29"]');
  is('CA-02-01 next', await txt('#cal-next-collection'), 'Thursday 15 October');
  is('CA-02-01 count', await txt('#cal-count-value'), '12');
  // remove again
  await p.click('[data-date="2026-10-29"]');
  is('CA-02 removed', await p.getAttribute('[data-date="2026-10-29"]', 'class'), 'calendar-cell calendar-cell--default');
  is('CA-02 count back', await txt('#cal-count-value'), '11');
  // read-only and disabled do nothing
  await p.click('[data-date="2026-10-05"]');
  await p.click('[data-date="2026-10-17"]');
  is('CA-02 inert cells', await txt('#cal-count-value'), '11');

  // ---------- CA-01 month navigation ----------
  await p.click('#cal-next-month');
  is('CA-01 next month', await txt('#cal-month-label'), 'November 2026');
  is('CA-01 count label follows', await txt('#cal-count-label'), 'Collection days in November');
  await p.click('#cal-prev-month');
  is('CA-01 back', await txt('#cal-month-label'), 'October 2026');

  await p.click('#cal-month-button');
  is('CA-01 picker open', await p.isVisible('#cal-month-picker'), true);
  is('CA-01 button expanded', await p.getAttribute('#cal-month-button', 'aria-expanded'), 'true');
  ok('CA-01 button active', (await p.getAttribute('#cal-month-button', 'class')).includes('active'));
  is('CA-01 picker year', await txt('#cal-picker-year'), '2026');
  is('CA-01 month count', await p.locator('#cal-picker-months label').count(), 12);
  is('CA-01 Oct checked', await p.isChecked('#cal-picker-month-9'), true);
  is('CA-01 Jan 2026 disabled', await p.isDisabled('#cal-picker-month-0'), true);
  is('CA-01 Jul 2026 enabled', await p.isDisabled('#cal-picker-month-6'), false);
  await p.click('label[for="cal-picker-month-11"]');
  is('CA-01 picked Dec', await txt('#cal-month-label'), 'December 2026');
  is('CA-01 picker closed', await p.isVisible('#cal-month-picker'), false);
  is('CA-01 focus returned', await p.evaluate(() => document.activeElement.id), 'cal-month-button');

  // ---------- CA-06 bank holidays (December) ----------
  is('CA-06 count label', await txt('#cal-count-label'), 'Collection days in December');
  is('CA-06 25 Dec disabled', await p.getAttribute('[data-date="2026-12-25"]', 'class'), 'calendar-cell calendar-cell--disabled');
  is('CA-06 25 Dec label', await txt('[data-date="2026-12-25"] .calendar-cell-label'), 'Bank holiday');
  is('CA-06 28 Dec label', await txt('[data-date="2026-12-28"] .calendar-cell-label'), 'Bank holiday');
  is('CA-06 26 Dec no label', await p.locator('[data-date="2026-12-26"] .calendar-cell-label').count(), 0);
  is('CA-06 24 Dec default', await p.getAttribute('[data-date="2026-12-24"]', 'class'), 'calendar-cell calendar-cell--default');
  is('CA-06 31 Dec default', await p.getAttribute('[data-date="2026-12-31"]', 'class'), 'calendar-cell calendar-cell--default');

  // escape closes the picker
  await p.click('#cal-month-button');
  await p.keyboard.press('Escape');
  is('CA-01 escape closes', await p.isVisible('#cal-month-picker'), false);
  // current month link
  await p.click('#cal-month-button');
  await p.click('#cal-current-month');
  is('CA-01 current month', await txt('#cal-month-label'), 'October 2026');

  console.log(errs.length ? 'PAGE ERRORS:\n' + errs.join('\n') : '');
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
