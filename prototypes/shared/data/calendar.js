/* ============================================================================
   BACS Calendar — shared collection-day data and logic
   ============================================================================

   Section 11 of `BACS-calendar/calendar-spec.md`. This file is deliberately
   NOT inside `BACS-calendar/`: section 11.4 asks for the calendar data to sit
   in a shared seed-data location "so Process can read collection days later",
   and Process lives in the BACS Import prototype. A feature that needs
   collection days loads this file and calls the helpers; it must not
   re-implement the rules.

   NOT BUCKHOLT. This is prototype application data, not design-system
   guidance.

   Dates are handled two ways and the two never mix:

     ISO string   'YYYY-MM-DD'   the canonical key for overrides, sent
                                 batches and every value this module returns
     Date object  new Date(y, m, d) at local midnight, used only for
                                 weekday arithmetic

   Everything is local-midnight, so there is no timezone drift: `toISO` reads
   the local Y/M/D fields rather than going through `toISOString`, which would
   shift the date west of UTC.

   Exposes `window.CalendarData`.
   ============================================================================ */
(function (global) {
  'use strict';


  /* ======================================================================
     11.1 Today

     "TODAY = Tuesday 13 October 2026, 13:24. Used by the calendar and the
     top bar." 13 October 2026 is a Tuesday; the Figma frames draw
     13 September, which section 12 corrects to October.
     ====================================================================== */

  var TODAY = new Date(2026, 9, 13, 13, 24, 0, 0);          // month 9 = October


  /* ======================================================================
     11.2 Bank holidays (England and Wales)

     "Store these as data, not logic, so they can be replaced by a real feed
     later." Transcribed from the spec's table; nothing here is computed.
     ====================================================================== */

  var BANK_HOLIDAYS = {
    '2026-08-31': 'Summer bank holiday',
    '2026-12-25': 'Christmas Day',
    '2026-12-28': 'Boxing Day (substitute)',
    '2027-01-01': "New Year's Day",
    '2027-03-26': 'Good Friday',
    '2027-03-29': 'Easter Monday',
    '2027-05-03': 'Early May bank holiday',
    '2027-05-31': 'Spring bank holiday',
    '2027-08-30': 'Summer bank holiday',
    '2027-12-27': 'Christmas Day (substitute)',
    '2027-12-28': 'Boxing Day (substitute)',
    '2028-01-03': "New Year's Day (substitute)",
    '2028-04-14': 'Good Friday',
    '2028-04-17': 'Easter Monday',
    '2028-05-01': 'Early May bank holiday',
    '2028-05-29': 'Spring bank holiday',
    '2028-08-28': 'Summer bank holiday'
  };


  /* ================================================================ Dates */

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function toISO(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function fromISO(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  /* Local midnight, so comparisons ignore the 13:24 on TODAY. */
  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, n) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  var TODAY_ISO = toISO(TODAY);
  var TODAY_START = startOfDay(TODAY);


  /* ======================================================================
     11.2 Working days

     "A working day is Monday to Friday and not an England and Wales bank
     holiday."
     ====================================================================== */

  function isWeekend(date) {
    var d = date.getDay();
    return d === 0 || d === 6;
  }

  function isBankHoliday(date) {
    return Object.prototype.hasOwnProperty.call(BANK_HOLIDAYS, toISO(date));
  }

  function bankHolidayName(date) {
    return BANK_HOLIDAYS[toISO(date)] || null;
  }

  function isWorkingDay(date) {
    return !isWeekend(date) && !isBankHoliday(date);
  }


  /* ======================================================================
     Navigable range — section 7

     "from July 2026 (start of seed history, Assumption) to 24 months after
     the current month (October 2028 with the seed date)."
     ====================================================================== */

  var RANGE_START = { year: 2026, month: 6 };                       // July 2026
  var RANGE_END = { year: TODAY.getFullYear() + 2, month: TODAY.getMonth() };   // October 2028

  function monthIndex(year, month) { return year * 12 + month; }

  function inRange(year, month) {
    var i = monthIndex(year, month);
    return i >= monthIndex(RANGE_START.year, RANGE_START.month) &&
           i <= monthIndex(RANGE_END.year, RANGE_END.month);
  }


  /* ======================================================================
     11.4 Sent batches

     "every working day from 1 July 2026 to 13 October 2026 inclusive, each
     with a batch ID A0000001 upwards in date order (not shown on the
     calendar; kept for Process)".
     ====================================================================== */

  var sentBatches = (function () {
    var out = {};
    var cursor = new Date(2026, 6, 1);                              // 1 July 2026
    var last = new Date(2026, 9, 13);                               // 13 October 2026
    var n = 0;
    while (cursor <= last) {
      if (isWorkingDay(cursor)) {
        n += 1;
        out[toISO(cursor)] = 'A' + String(n).padStart(7, '0');
      }
      cursor = addDays(cursor, 1);
    }
    return out;
  }());

  function sentBatchFor(date) {
    return sentBatches[toISO(date)] || null;
  }

  function isSent(date) {
    return Object.prototype.hasOwnProperty.call(sentBatches, toISO(date));
  }


  /* ======================================================================
     11.4 Mutable state

     `schedule` is seeded `{ type: 'none', days: [] }` and `overrides` empty,
     which is the state CA-00-01 draws.
     ====================================================================== */

  var schedule = { type: 'none', days: [] };
  var overrides = {};


  /* ======================================================================
     11.3 Collection day logic

       1. Weekend or bank holiday    -> Disabled
       2. Before today, or sent      -> Read-only
       3. Otherwise                  -> editable

     An editable date collects if a single-date override says so, otherwise
     if the schedule rule says so. A read-only date collects if, and only if,
     it has a sent batch — the schedule never reaches backwards.
     ====================================================================== */

  function isEditable(date) {
    if (!isWorkingDay(date)) return false;
    if (isSent(date)) return false;
    return startOfDay(date) >= TODAY_START;
  }

  /* Schedule rule only — before overrides, and before the read-only test. */
  function ruleSaysCollect(date) {
    if (!isWorkingDay(date)) return false;
    if (schedule.type === 'none') return false;
    if (schedule.type === 'all') return true;
    if (schedule.type !== 'days') return false;

    var iso = toISO(date);
    for (var i = 0; i < schedule.days.length; i += 1) {
      if (resolveDayOfMonth(date.getFullYear(), date.getMonth(), schedule.days[i]) === iso) {
        return true;
      }
    }
    return false;
  }

  /* "take day N of the month (or the last day if the month is shorter). If
     that isn't a working day, use the next working day in the same month; if
     there is none, use the previous working day." */
  function resolveDayOfMonth(year, month, dayNumber) {
    var length = daysInMonth(year, month);
    var day = Math.min(dayNumber, length);
    var candidate = new Date(year, month, day);

    if (isWorkingDay(candidate)) return toISO(candidate);

    var forward = new Date(year, month, day);
    while (forward.getMonth() === month) {
      if (isWorkingDay(forward)) return toISO(forward);
      forward = addDays(forward, 1);
    }

    var back = new Date(year, month, day);
    while (back.getMonth() === month) {
      if (isWorkingDay(back)) return toISO(back);
      back = addDays(back, -1);
    }
    return null;                                    // a month with no working day
  }

  function isCollectionDay(date) {
    if (!isWorkingDay(date)) return false;
    if (isSent(date)) return true;
    if (startOfDay(date) < TODAY_START) return false;

    var iso = toISO(date);
    if (Object.prototype.hasOwnProperty.call(overrides, iso)) return overrides[iso];
    return ruleSaysCollect(date);
  }

  /* The cell's state, which the calendar component renders directly. */
  function stateFor(date) {
    if (!isWorkingDay(date)) return 'disabled';
    if (isEditable(date)) return isCollectionDay(date) ? 'selected' : 'default';
    return 'readonly';
  }

  /* The cell's label. Section 5.2:
       Selected                       -> Collection day
       Read-only, past collection     -> Collected
       Read-only, today or later      -> Collection day
       Read-only, past non-collection -> none
       Bank holiday                   -> Bank holiday
       Weekend                        -> none                                */
  function labelFor(date) {
    if (isWeekend(date)) return null;
    if (isBankHoliday(date)) return 'Bank holiday';
    if (isEditable(date)) return isCollectionDay(date) ? 'Collection day' : null;
    if (!isCollectionDay(date)) return null;
    return startOfDay(date) < TODAY_START ? 'Collected' : 'Collection day';
  }


  /* ================================================================ Queries */

  /* Inclusive of both ends. `from` and `to` are Date objects or ISO strings. */
  function getCollectionDays(from, to) {
    var cursor = startOfDay(typeof from === 'string' ? fromISO(from) : from);
    var last = startOfDay(typeof to === 'string' ? fromISO(to) : to);
    var out = [];
    while (cursor <= last) {
      if (isCollectionDay(cursor)) out.push(toISO(cursor));
      cursor = addDays(cursor, 1);
    }
    return out;
  }

  /* "First collection day after today, in any future month." Searches to the
     end of the navigable range and returns an ISO date or null. */
  function getNextCollection() {
    var cursor = addDays(TODAY_START, 1);
    var last = new Date(RANGE_END.year, RANGE_END.month, daysInMonth(RANGE_END.year, RANGE_END.month));
    while (cursor <= last) {
      if (isCollectionDay(cursor)) return toISO(cursor);
      cursor = addDays(cursor, 1);
    }
    return null;
  }

  function countCollectionDaysInMonth(year, month) {
    var first = new Date(year, month, 1);
    var last = new Date(year, month, daysInMonth(year, month));
    return getCollectionDays(first, last).length;
  }


  /* ================================================================ Changes */

  /* Section 11.3: "Clicking an editable date stores an override only if it
     differs from the rule; clicking back to the rule's value removes the
     override." Returns the date's new collecting state. */
  function toggleDate(date) {
    if (!isEditable(date)) return isCollectionDay(date);

    var iso = toISO(date);
    var next = !isCollectionDay(date);
    if (next === ruleSaysCollect(date)) delete overrides[iso];
    else overrides[iso] = next;
    return next;
  }

  /* Section 9.3: "Saving replaces every future editable date with the new
     rule. Any single-date changes made before are cleared. Read-only dates
     are never touched." Clearing every override does exactly that: overrides
     only ever exist on editable dates, and every editable date is in the
     future or today. */
  function setSchedule(type, days) {
    schedule = { type: type, days: (days || []).slice().sort(function (a, b) { return a - b; }) };
    overrides = {};
  }

  /* Undo restores "the previous schedule and all previous future dates
     exactly", so a snapshot carries both halves of the state. */
  function snapshot() {
    return {
      schedule: { type: schedule.type, days: schedule.days.slice() },
      overrides: Object.assign({}, overrides)
    };
  }

  function restore(snap) {
    schedule = { type: snap.schedule.type, days: snap.schedule.days.slice() };
    overrides = Object.assign({}, snap.overrides);
  }


  /* ============================================================ Formatting */

  var SCHEDULE_LABELS = {
    none: 'No default',
    all: 'Every working day',
    days: 'Set days of the month'
  };

  /* "Format `Weekday D Month`, no leading zero, no ordinal." */
  function formatLongDate(iso) {
    var d = fromISO(iso);
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* "one day `Day N`, two `Days A and B`, more `Days A, B and C`." */
  function formatDayList(days) {
    var sorted = days.slice().sort(function (a, b) { return a - b; });
    if (sorted.length === 1) return 'Day ' + sorted[0];
    var head = sorted.slice(0, -1).join(', ');
    return 'Days ' + head + ' and ' + sorted[sorted.length - 1];
  }


  global.CalendarData = {
    TODAY: TODAY,
    TODAY_ISO: TODAY_ISO,
    BANK_HOLIDAYS: BANK_HOLIDAYS,
    sentBatches: sentBatches,
    RANGE_START: RANGE_START,
    RANGE_END: RANGE_END,

    toISO: toISO,
    fromISO: fromISO,
    addDays: addDays,
    daysInMonth: daysInMonth,
    monthIndex: monthIndex,
    inRange: inRange,

    isWeekend: isWeekend,
    isBankHoliday: isBankHoliday,
    bankHolidayName: bankHolidayName,
    isWorkingDay: isWorkingDay,
    isSent: isSent,
    sentBatchFor: sentBatchFor,
    isEditable: isEditable,
    isCollectionDay: isCollectionDay,
    ruleSaysCollect: ruleSaysCollect,
    resolveDayOfMonth: resolveDayOfMonth,
    stateFor: stateFor,
    labelFor: labelFor,

    getCollectionDays: getCollectionDays,
    getNextCollection: getNextCollection,
    countCollectionDaysInMonth: countCollectionDaysInMonth,

    getSchedule: function () { return { type: schedule.type, days: schedule.days.slice() }; },
    setSchedule: setSchedule,
    toggleDate: toggleDate,
    snapshot: snapshot,
    restore: restore,

    SCHEDULE_LABELS: SCHEDULE_LABELS,
    formatLongDate: formatLongDate,
    formatDayList: formatDayList
  };
}(window));
