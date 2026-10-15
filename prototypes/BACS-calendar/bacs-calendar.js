/* ============================================================================
   BACS Calendar — page behaviour
   ============================================================================

   `BACS-calendar/calendar-spec.md`. Every collection-day rule lives in
   `data/calendar.js` so Process can reuse it (spec 11.4); this file renders
   and wires, and asks `CalendarData` whatever it needs to know.

   Depends on, in this order:
       bootstrap.bundle.min.js        Modal
       prototype/app-shell.js         Shell
       components/dropdown/dropdown.js   the Collect on multiselect
       data/calendar.js               CalendarData
   ============================================================================ */
(function (global) {
  'use strict';

  var C = global.CalendarData;
  var $ = function (id) { return document.getElementById(id); };

  var WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sat', 'Sun'];
  var WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                     'August', 'September', 'October', 'November', 'December'];

  /* The month on screen, and the year the picker is showing, which may differ
     from it while the user browses. */
  var view = { year: C.TODAY.getFullYear(), month: C.TODAY.getMonth() };
  var pickerYear = view.year;

  var scheduleModal = null;
  var lastToast = null;


  /* ======================================================================
     Summary cards — section 6
     ====================================================================== */

  function renderCards() {
    var next = C.getNextCollection();
    $('cal-next-collection').textContent = next ? C.formatLongDate(next) : 'None set';

    /* "`{Month}` follows the month in view (December when viewing
       December)" — section 12 corrects CA-06-01, which leaves it at
       October. */
    $('cal-count-label').textContent = 'Collection days in ' + MONTHS_LONG[view.month];
    $('cal-count-value').textContent = String(C.countCollectionDaysInMonth(view.year, view.month));

    $('cal-schedule-value').textContent = C.SCHEDULE_LABELS[C.getSchedule().type];
  }


  /* ======================================================================
     Month bar — section 7
     ====================================================================== */

  function renderMonthBar() {
    $('cal-month-label').textContent = MONTHS_LONG[view.month] + ' ' + view.year;
    $('cal-prev-month').disabled = !C.inRange(view.year, view.month - 1);
    $('cal-next-month').disabled = !C.inRange(view.year, view.month + 1);
  }

  function goToMonth(year, month) {
    /* Normalise so December + 1 rolls into January. */
    var date = new Date(year, month, 1);
    if (!C.inRange(date.getFullYear(), date.getMonth())) return;
    view = { year: date.getFullYear(), month: date.getMonth() };
    renderAll();
  }


  /* ======================================================================
     Grid — section 5
     ======================================================================
     Monday first, so a Sunday (getDay() 0) is column 7.
     ====================================================================== */

  function columnOf(date) {
    return (date.getDay() + 6) % 7;
  }

  /* "Interactive cells are <button> elements with aria-pressed and an
     accessible name such as 'Wednesday 14 October 2026, collection day'. Add
     ', today' to today's name." */
  function accessibleName(date, state, label) {
    var parts = [date.toLocaleDateString('en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })];
    if (label) parts.push(label.toLowerCase());
    if (state === 'disabled' && !C.isBankHoliday(date)) parts.push('not a working day');
    if (C.toISO(date) === C.TODAY_ISO) parts.push('today');
    return parts.join(', ');
  }

  function cellMarkup(date) {
    var iso = C.toISO(date);
    var state = C.stateFor(date);
    var label = C.labelFor(date);
    var isToday = iso === C.TODAY_ISO;
    var editable = C.isEditable(date);

    var badge = '<span class="calendar-cell-date' + (isToday ? ' calendar-cell-date--today' : '') + '">' +
      String(date.getDate()).padStart(2, '0') + '</span>';
    var text = label ? '<span class="calendar-cell-label">' + Shell.escapeHtml(label) + '</span>' : '';

    if (editable) {
      return '<button type="button" class="calendar-cell calendar-cell--' + state + '"' +
        ' data-date="' + iso + '"' +
        ' aria-pressed="' + (state === 'selected') + '"' +
        ' aria-label="' + Shell.escapeHtml(accessibleName(date, state, label)) + '">' +
        badge + text + '</button>';
    }

    /* Read-only and disabled cells are not focusable; their date and label
       stay readable as text. */
    return '<div class="calendar-cell calendar-cell--' + state + '" data-date="' + iso + '">' +
      badge + text + '</div>';
  }

  function renderGrid() {
    var grid = $('cal-grid');
    var narrow = global.matchMedia('(max-width: 767.98px)').matches;
    var names = narrow ? WEEKDAYS_SHORT : WEEKDAYS;
    var html = '';

    for (var c = 0; c < 7; c += 1) {
      html += '<span class="calendar-weekday label-02">' + names[c] + '</span>';
    }

    var first = new Date(view.year, view.month, 1);
    var length = C.daysInMonth(view.year, view.month);
    var lead = columnOf(first);
    var i;

    for (i = 0; i < lead; i += 1) {
      html += '<div class="calendar-cell calendar-cell--blank" aria-hidden="true"></div>';
    }

    for (i = 1; i <= length; i += 1) {
      html += cellMarkup(new Date(view.year, view.month, i));
    }

    var trail = (7 - ((lead + length) % 7)) % 7;
    for (i = 0; i < trail; i += 1) {
      html += '<div class="calendar-cell calendar-cell--blank" aria-hidden="true"></div>';
    }

    grid.innerHTML = html;
  }

  /* Section 8, CA-02: clicking an editable cell flips it and saves straight
     away. "No toast for single-date changes." */
  function wireGrid() {
    $('cal-grid').addEventListener('click', function (e) {
      var cell = e.target.closest('button.calendar-cell');
      if (!cell) return;

      var iso = cell.dataset.date;
      C.toggleDate(C.fromISO(iso));
      renderAll();

      /* Re-render replaces the node, so focus has to be put back on the
         new cell or the keyboard user loses their place. */
      var again = $('cal-grid').querySelector('[data-date="' + iso + '"]');
      if (again && again.tagName === 'BUTTON') again.focus();
    });
  }


  /* ======================================================================
     Month picker — section 7
     ====================================================================== */

  function renderPicker() {
    $('cal-picker-year').textContent = String(pickerYear);
    $('cal-prev-year').disabled = !anyMonthInYear(pickerYear - 1);
    $('cal-next-year').disabled = !anyMonthInYear(pickerYear + 1);

    /* Buckholt Response button, single select: a native radio and its label
       per month. "Proposed (not in Figma): months outside the navigable
       range are disabled" — section 12 records that CA-01-01 draws them all
       enabled. */
    var html = '';
    for (var m = 0; m < 12; m += 1) {
      var usable = C.inRange(pickerYear, m);
      var current = pickerYear === view.year && m === view.month;
      var id = 'cal-picker-month-' + m;
      html += '<input type="radio" class="btn-check" name="cal-picker-month" id="' + id + '"' +
        ' value="' + m + '"' + (current ? ' checked' : '') + (usable ? '' : ' disabled') + '>' +
        '<label class="btn btn-response" for="' + id + '">' + MONTHS_SHORT[m] + '</label>';
    }
    $('cal-picker-months').innerHTML = html;
  }

  function anyMonthInYear(year) {
    for (var m = 0; m < 12; m += 1) if (C.inRange(year, m)) return true;
    return false;
  }

  function pickerIsOpen() {
    return !$('cal-month-picker').hidden;
  }

  function openPicker() {
    pickerYear = view.year;
    renderPicker();
    $('cal-month-picker').hidden = false;
    /* The month button shows its active (filled) state while open. `.active`
       is Buckholt's own selector for a Button's active treatment. */
    $('cal-month-button').classList.add('active');
    $('cal-month-button').setAttribute('aria-expanded', 'true');

    var checked = $('cal-picker-months').querySelector('input:checked:not(:disabled)');
    if (checked) checked.focus();
  }

  /* "Closes on Escape, on click outside, and returns focus to the month
     button." */
  function closePicker(returnFocus) {
    if (!pickerIsOpen()) return;
    $('cal-month-picker').hidden = true;
    $('cal-month-button').classList.remove('active');
    $('cal-month-button').setAttribute('aria-expanded', 'false');
    if (returnFocus) $('cal-month-button').focus();
  }

  function wireMonthBar() {
    /* "Previous / next chevrons move one month." `goToMonth` normalises, so
       December + 1 rolls into the next January. */
    $('cal-prev-month').addEventListener('click', function () {
      goToMonth(view.year, view.month - 1);
    });
    $('cal-next-month').addEventListener('click', function () {
      goToMonth(view.year, view.month + 1);
    });
  }

  function wirePicker() {
    $('cal-month-button').addEventListener('click', function () {
      if (pickerIsOpen()) closePicker(true);
      else openPicker();
    });

    /* "Selecting a month closes the popover and shows that month." */
    $('cal-picker-months').addEventListener('change', function (e) {
      var input = e.target.closest('input[type="radio"]');
      if (!input) return;
      closePicker(true);
      goToMonth(pickerYear, Number(input.value));
    });

    $('cal-prev-year').addEventListener('click', function () {
      pickerYear -= 1;
      renderPicker();
    });

    $('cal-next-year').addEventListener('click', function () {
      pickerYear += 1;
      renderPicker();
    });

    /* "Current month text link at bottom right jumps to the month containing
       today and closes the popover." */
    $('cal-current-month').addEventListener('click', function () {
      closePicker(true);
      goToMonth(C.TODAY.getFullYear(), C.TODAY.getMonth());
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pickerIsOpen()) {
        e.stopPropagation();
        closePicker(true);
      }
    });

    document.addEventListener('mousedown', function (e) {
      if (!pickerIsOpen()) return;
      if (e.target.closest('#cal-month-picker, #cal-month-button')) return;
      closePicker(false);
    });

    /* Tabbing out of the popover closes it, so it never floats behind the
       page while focus is elsewhere. */
    document.addEventListener('focusin', function (e) {
      if (!pickerIsOpen()) return;
      if (e.target.closest('#cal-month-picker, #cal-month-button')) return;
      closePicker(false);
    });
  }


  /* ======================================================================
     Collection schedule modal — section 9
     ======================================================================
     Choices are a draft until Save schedule, so the modal works on
     `draft` and only calls `CalendarData.setSchedule` on save.
     ====================================================================== */

  var draft = { type: 'none', days: [] };

  function selectedDaysFromDropdown() {
    var days = [];
    for (var n = 1; n <= 31; n += 1) {
      if ($('cal-day-' + n).checked) days.push(n);
    }
    return days;
  }

  /* dropdown.js owns the checkbox, the <li> active class, the tag set and the
     toggle's height, and it does all of that from one `<li>` click. Clicking
     the item is therefore the only safe way to set the selection from
     outside the component. */
  function setDropdownDays(days) {
    var wanted = {};
    days.forEach(function (n) { wanted[n] = true; });
    for (var n = 1; n <= 31; n += 1) {
      var box = $('cal-day-' + n);
      if (!box) continue;
      if (!!box.checked !== !!wanted[n]) $('cal-day-option-' + n).click();
    }
  }

  /* dropdown.js inserts tags with `localeCompare`, which orders Day 15 before
     Day 2. Spec 9.2 wants them "sorted ascending", so the tags are reordered
     numerically after the component has built them. The markup, the classes
     and the component's own behaviour are untouched — only the order of the
     nodes changes. Logged as a Buckholt ticket in SPEC-CHANGES.md. */
  function sortTags() {
    var set = document.querySelector('#cal-days-dropdown .tag-set');
    if (!set) return;
    var tags = Array.prototype.slice.call(set.children);
    tags.sort(function (a, b) {
      return dayNumberOf(a) - dayNumberOf(b);
    }).forEach(function (tag) { set.appendChild(tag); });
  }

  function dayNumberOf(tag) {
    var label = tag.querySelector('.tag-label');
    var n = label ? parseInt(String(label.textContent).replace(/\D+/g, ''), 10) : 0;
    return isNaN(n) ? 0 : n;
  }

  /* "each tag's × has the name Remove day N" — dropdown.js names them all
     "Close", so the page renames them after every rebuild. */
  function nameTagCloseButtons() {
    var set = document.querySelector('#cal-days-dropdown .tag-set');
    if (!set) return;
    Array.prototype.forEach.call(set.children, function (tag) {
      var close = tag.querySelector('.btn-close');
      if (close) close.setAttribute('aria-label', 'Remove day ' + dayNumberOf(tag));
    });
  }

  function syncOptionCards() {
    Array.prototype.forEach.call(
      document.querySelectorAll('.cal-schedule-options .card-selectable'),
      function (card) {
        var on = card.dataset.schedule === draft.type;
        /* `.card-selectable.active` is Buckholt's own selected treatment;
           no script ships to toggle it, so the page does. */
        card.classList.toggle('active', on);
        card.querySelector('input[type="radio"]').checked = on;
      });

    /* "Shown only when Set days of the month is selected." */
    $('cal-collect-on').hidden = draft.type !== 'days';
    syncSaveState();
  }

  /* "Proposed: if Set days of the month is selected with no days, Save
     schedule is disabled and the helper reads 'Choose at least one day.'" */
  function syncSaveState() {
    var empty = draft.type === 'days' && draft.days.length === 0;
    $('cal-save-schedule').disabled = empty;
    $('cal-days-helper').textContent = empty
      ? 'Choose at least one day.'
      : 'Non-working days move to the next working day, or the previous one at month end.';
  }

  function openScheduleModal() {
    var saved = C.getSchedule();
    draft = { type: saved.type, days: saved.days.slice() };

    /* "When the modal opens with Set days of the month already saved, this
       panel is shown and pre-filled with the saved days" — section 12
       corrects CA-05-02, which hides it. */
    setDropdownDays(draft.days);
    sortTags();
    nameTagCloseButtons();
    syncOptionCards();
    scheduleModal.show();
  }

  function saveSchedule() {
    var saved = C.getSchedule();
    var before = C.snapshot();
    var changed = saved.type !== draft.type ||
      saved.days.join(',') !== draft.days.join(',');

    scheduleModal.hide();
    if (!changed) return;                     /* "Saving with no change closes
                                                 the modal with no toast." */

    C.setSchedule(draft.type, draft.days);
    renderAll();
    showScheduleToast(before);
  }

  function wireModal() {
    scheduleModal = new bootstrap.Modal($('cal-schedule-modal'));

    /* "Focus is trapped in the modal and returns to Change schedule on
       close." Bootstrap traps focus by itself, but it only restores it for a
       modal opened by `data-bs-toggle`; this one is opened from script, so
       the page puts focus back. */
    $('cal-schedule-modal').addEventListener('hidden.bs.modal', function () {
      $('cal-change-schedule').focus();
    });

    $('cal-change-schedule').addEventListener('click', openScheduleModal);

    /* The whole Card is the target: `.card-selectable` is `cursor: pointer`,
       and the radio sits in its corner. */
    document.querySelector('.cal-schedule-options').addEventListener('click', function (e) {
      var card = e.target.closest('.card-selectable');
      if (!card) return;
      draft.type = card.dataset.schedule;
      syncOptionCards();
    });

    /* The multiselect: dropdown.js has already updated the checkboxes and
       the tags by the time the click reaches here. */
    $('cal-days-dropdown').addEventListener('click', function () {
      global.setTimeout(function () {
        draft.days = selectedDaysFromDropdown();
        sortTags();
        nameTagCloseButtons();
        syncSaveState();
      }, 0);
    });

    $('cal-save-schedule').addEventListener('click', saveSchedule);

    /* "Focus is trapped in the modal and returns to Change schedule on
       close" — Bootstrap's Modal does both. Closing also discards the draft,
       which needs nothing undone because the draft never touched the store. */
  }


  /* ======================================================================
     Toasts — section 10
     ====================================================================== */

  function scheduleToastBody(schedule) {
    if (schedule.type === 'all') return 'Every working day.';
    if (schedule.type === 'none') return 'No default. Only dates you add will collect.';
    return C.formatDayList(schedule.days) + ' of each month.';
  }

  function showScheduleToast(before) {
    /* "A new toast replaces the current one." */
    if (lastToast) lastToast.dismiss();

    lastToast = Shell.showToast('Schedule saved', 'success', {
      note: scheduleToastBody(C.getSchedule()),
      delay: 8000,
      action: {
        label: 'Undo',
        name: 'Undo schedule change',
        onClick: function () {
          C.restore(before);
          renderAll();
          /* "Undo only reverses the latest schedule save", so the undone
             toast carries no further Undo. */
          lastToast = Shell.showToast('Change undone', 'success', { delay: 8000 });
        }
      }
    });
  }


  /* ====================================================================== */

  function renderAll() {
    renderCards();
    renderMonthBar();
    renderGrid();
  }

  function init() {
    if (!C || !global.Shell) return;

    Shell.wireChrome();
    /* Live, like the other two tabs. Spec 3.3 asks for the top bar to come
       from the calendar's own TODAY, which would read 13 October 2026; the
       prototype shows one clock throughout instead, at Laurence's request on
       15 October 2026. See deviation 7 in PROTOTYPE.md. */
    Shell.startClock();

    wireGrid();
    wireMonthBar();
    wirePicker();
    wireModal();
    renderAll();

    /* The weekday headers shorten below the md step, so the grid is redrawn
       when the page crosses it. */
    var narrow = global.matchMedia('(max-width: 767.98px)');
    var onChange = function () { renderGrid(); };
    if (narrow.addEventListener) narrow.addEventListener('change', onChange);
    else narrow.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}(window));
