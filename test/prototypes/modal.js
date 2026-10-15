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
  await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
  const txt = s => p.textContent(s).then(t => t.trim());
  const open = async () => { await p.click('#cal-change-schedule'); await p.waitForSelector('#cal-schedule-modal.show'); };

  // ---------- CA-03-01: modal opens with the saved option ----------
  await open();
  is('CA-03-01 title', await txt('#cal-schedule-modal-title'), 'Collection schedule');
  is('CA-03-01 intro', await txt('.modal-header p'), 'Sets which days collect by default. You can still add or remove single dates on the calendar.');
  is('CA-03-01 options', await p.locator('.cal-schedule-options .card-selectable').count(), 3);
  is('CA-03-01 opt1', await txt('#cal-schedule-none-title'), 'No default');
  is('CA-03-01 opt2', await txt('#cal-schedule-all-title'), 'Every working day');
  is('CA-03-01 opt3', await txt('#cal-schedule-days-title'), 'Set days of the month');
  is('CA-03-01 none checked', await p.isChecked('#cal-schedule-none'), true);
  ok('CA-03-01 none active', (await p.getAttribute('[data-schedule="none"]', 'class')).includes('active'));
  is('CA-03-01 collect-on hidden', await p.isVisible('#cal-collect-on'), false);
  is('CA-03-01 cancel', await txt('.modal-footer .btn-ghost'), 'Cancel');
  is('CA-03-01 save', await txt('#cal-save-schedule'), 'Save schedule');
  is('CA-03-01 no warning alert', await p.locator('#cal-schedule-modal .alert').count(), 0);

  // ---------- CA-03-02/03: Every working day ----------
  await p.click('[data-schedule="all"]');
  ok('CA-03-02 all active', (await p.getAttribute('[data-schedule="all"]', 'class')).includes('active'));
  is('CA-03-02 all checked', await p.isChecked('#cal-schedule-all'), true);
  is('CA-03-02 none cleared', await p.isChecked('#cal-schedule-none'), false);
  await p.click('#cal-save-schedule');
  await p.waitForSelector('#cal-schedule-modal.show', { state: 'detached' }).catch(()=>{});
  await p.waitForTimeout(250);
  is('CA-03-03 modal closed', await p.isVisible('#cal-schedule-modal'), false);
  is('CA-03-03 schedule card', await txt('#cal-schedule-value'), 'Every working day');
  is('CA-03-03 next', await txt('#cal-next-collection'), 'Wednesday 14 October');
  is('CA-03-03 count', await txt('#cal-count-value'), '22');
  is('CA-03-03 14 Oct selected', await p.getAttribute('[data-date="2026-10-14"]', 'class'), 'calendar-cell calendar-cell--selected');
  is('CA-03-03 toast title', await txt('.app-toasts .toast .toast-message h6'), 'Schedule saved');
  is('CA-03-03 toast note', await txt('.app-toasts .toast .toast-note'), 'Every working day.');
  is('CA-03-03 undo', await txt('.app-toasts .toast .toast-contextbar button'), 'Undo');
  is('CA-03-03 undo name', await p.getAttribute('.app-toasts .toast .toast-contextbar button', 'aria-label'), 'Undo schedule change');
  is('CA-03-03 no close button', await p.locator('.app-toasts .toast .btn-close').count(), 0);
  is('CA-03-03 toast variant', (await p.getAttribute('.app-toasts .toast', 'class')).includes('toast-success'), 'true');
  is('CA-03-03 container role', await p.getAttribute('.app-toasts', 'role'), 'status');
  is('CA-03-03 toast has no role', await p.getAttribute('.app-toasts .toast', 'role'), 'null');

  // Undo
  await p.click('.app-toasts .toast .toast-contextbar button');
  await p.waitForTimeout(250);
  is('Undo restores schedule', await txt('#cal-schedule-value'), 'No default');
  is('Undo restores count', await txt('#cal-count-value'), '9');
  is('Undo toast', await txt('.app-toasts .toast .toast-message h6'), 'Change undone');
  is('Undo toast has no note', await p.locator('.app-toasts .toast .toast-note').count(), 0);
  is('Undo toast has no undo', await p.locator('.app-toasts .toast .toast-contextbar').count(), 0);

  // ---------- CA-04: Set days of the month ----------
  await open();
  await p.click('[data-schedule="days"]');
  is('CA-04-03 collect-on shown', await p.isVisible('#cal-collect-on'), true);
  is('CA-04-03 label', await txt('#cal-collect-on .form-label'), 'Collect on');
  is('CA-04-03 placeholder', await txt('#cal-days-select .dropdown-label'), 'Choose days');
  is('CA-04-03 save disabled when empty', await p.isDisabled('#cal-save-schedule'), true);
  is('CA-04-03 helper when empty', await txt('#cal-days-helper'), 'Choose at least one day.');
  is('CA-04-03 31 options', await p.locator('#cal-days-menu .dropdown-item').count(), 31);
  is('CA-04-03 no All option', await p.locator('#cal-days-menu .dropdown-item[aria-label="All"]').count(), 0);
  await p.click('#cal-days-select');
  await p.click('#cal-day-option-21');
  await p.click('#cal-day-option-28');
  await p.waitForTimeout(100);
  is('CA-04-03 two tags', await p.locator('#cal-days-dropdown .tag-set .tag').count(), 2);
  is('CA-04-03 tag 1', await p.locator('#cal-days-dropdown .tag-label').nth(0).textContent(), 'Day 21');
  is('CA-04-03 tag 2', await p.locator('#cal-days-dropdown .tag-label').nth(1).textContent(), 'Day 28');
  is('CA-04-03 tag close name', await p.getAttribute('#cal-days-dropdown .tag:first-child .btn-close', 'aria-label'), 'Remove day 21');
  is('CA-04-03 helper restored', await txt('#cal-days-helper'), 'Non-working days move to the next working day, or the previous one at month end.');
  is('CA-04-03 save enabled', await p.isDisabled('#cal-save-schedule'), false);
  await p.click('#cal-save-schedule');
  await p.waitForTimeout(250);
  is('CA-04-04 schedule', await txt('#cal-schedule-value'), 'Set days of the month');
  is('CA-04-04 next', await txt('#cal-next-collection'), 'Wednesday 21 October');
  is('CA-04-04 count', await txt('#cal-count-value'), '11');
  is('CA-04-04 toast note', await txt('.app-toasts .toast .toast-note'), 'Days 21 and 28 of each month.');
  is('CA-04-04 21 selected', await p.getAttribute('[data-date="2026-10-21"]', 'class'), 'calendar-cell calendar-cell--selected');
  is('CA-04-04 28 selected', await p.getAttribute('[data-date="2026-10-28"]', 'class'), 'calendar-cell calendar-cell--selected');
  is('CA-04-04 14 not selected', await p.getAttribute('[data-date="2026-10-14"]', 'class'), 'calendar-cell calendar-cell--default');
  is('CA-04-04 one toast only', await p.locator('.app-toasts .toast').count(), 1);

  // ---------- CA-05-02: reopening pre-fills the panel ----------
  await open();
  is('CA-05-02 days checked', await p.isChecked('#cal-schedule-days'), true);
  is('CA-05-02 panel shown', await p.isVisible('#cal-collect-on'), true);
  is('CA-05-02 prefilled tags', await p.locator('#cal-days-dropdown .tag-set .tag').count(), 2);
  is('CA-05-02 prefill 1', await p.locator('#cal-days-dropdown .tag-label').nth(0).textContent(), 'Day 21');
  is('CA-05-02 prefill 2', await p.locator('#cal-days-dropdown .tag-label').nth(1).textContent(), 'Day 28');

  // ---------- CA-05-03/04: back to No default ----------
  await p.click('[data-schedule="none"]');
  is('CA-05-03 panel hidden again', await p.isVisible('#cal-collect-on'), false);
  await p.click('#cal-save-schedule');
  await p.waitForTimeout(250);
  is('CA-05-04 schedule', await txt('#cal-schedule-value'), 'No default');
  is('CA-05-04 next', await txt('#cal-next-collection'), 'None set');
  is('CA-05-04 count', await txt('#cal-count-value'), '9');
  is('CA-05-04 toast note', await txt('.app-toasts .toast .toast-note'), 'No default. Only dates you add will collect.');

  // ---------- Cancel discards ----------
  await open();
  await p.click('[data-schedule="all"]');
  await p.click('.modal-footer .btn-ghost');
  await p.waitForTimeout(250);
  is('Cancel discards', await txt('#cal-schedule-value'), 'No default');

  // ---------- Saving with no change: no toast ----------
  const before = await p.locator('.app-toasts .toast').count();
  await open();
  await p.click('#cal-save-schedule');
  await p.waitForTimeout(250);
  is('no-change save: no new toast', await p.locator('.app-toasts .toast').count(), before);

  console.log(errs.length ? 'PAGE ERRORS:\n' + errs.join('\n') : '');
  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
