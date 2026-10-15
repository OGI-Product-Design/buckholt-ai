global.window = global;
require('../prototypes/data/calendar.js');
var C = window.CalendarData;
var pass = 0, fail = 0;
function is(label, got, want) {
  if (String(got) === String(want)) { pass++; }
  else { fail++; console.log('FAIL ' + label + ': got ' + got + ', want ' + want); }
}

is('TODAY is Tuesday 13 Oct 2026', C.TODAY.toDateString(), 'Tue Oct 13 2026');
is('sent batch count', Object.keys(C.sentBatches).length, 74);
is('first batch id', C.sentBatches['2026-07-01'], 'A0000001');
is('last batch id', C.sentBatches['2026-10-13'], 'A0000074');
is('31 Aug 2026 not sent (bank hol)', C.isSent(new Date(2026,7,31)), false);
is('range end', C.RANGE_END.year + '-' + C.RANGE_END.month, '2028-9');

// 11.5 row 1: No default, no overrides
is('1 next collection', C.getNextCollection(), 'null');
is('1 oct count', C.countCollectionDaysInMonth(2026, 9), 9);

// 11.5 row 2: No default + 15 and 22 Oct added
C.toggleDate(new Date(2026,9,15));
C.toggleDate(new Date(2026,9,22));
is('2 next collection', C.formatLongDate(C.getNextCollection()), 'Thursday 15 October');
is('2 oct count', C.countCollectionDaysInMonth(2026, 9), 11);

// CA-02-01: 15, 22, 29 selected -> Thursday 15 October and 12
C.toggleDate(new Date(2026,9,29));
is('CA-02-01 next', C.formatLongDate(C.getNextCollection()), 'Thursday 15 October');
is('CA-02-01 count', C.countCollectionDaysInMonth(2026, 9), 12);

// 11.5 row 3: Every working day
C.setSchedule('all', []);
is('3 next collection', C.formatLongDate(C.getNextCollection()), 'Wednesday 14 October');
is('3 oct count', C.countCollectionDaysInMonth(2026, 9), 22);
is('3 dec count', C.countCollectionDaysInMonth(2026, 11), 21);

// 11.5 row 4: Days 21 and 28
C.setSchedule('days', [21, 28]);
is('4 next collection', C.formatLongDate(C.getNextCollection()), 'Wednesday 21 October');
is('4 oct count', C.countCollectionDaysInMonth(2026, 9), 11);
is('4 day list', C.formatDayList([21,28]), 'Days 21 and 28');
is('4 one day list', C.formatDayList([15]), 'Day 15');
is('4 three day list', C.formatDayList([3,1,20]), 'Days 1, 3 and 20');

// back to seed
C.setSchedule('none', []);
is('5 next collection', C.getNextCollection(), 'null');
is('5 oct count', C.countCollectionDaysInMonth(2026, 9), 9);

// states
is('today is readonly', C.stateFor(new Date(2026,9,13)), 'readonly');
is('today label', C.labelFor(new Date(2026,9,13)), 'Collection day');
is('5 Oct label', C.labelFor(new Date(2026,9,5)), 'Collected');
is('14 Oct default', C.stateFor(new Date(2026,9,14)), 'default');
is('17 Oct sat disabled', C.stateFor(new Date(2026,9,17)), 'disabled');
is('17 Oct sat no label', C.labelFor(new Date(2026,9,17)), 'null');
is('25 Dec disabled', C.stateFor(new Date(2026,11,25)), 'disabled');
is('25 Dec label', C.labelFor(new Date(2026,11,25)), 'Bank holiday');
is('26 Dec sat no label', C.labelFor(new Date(2026,11,26)), 'null');
is('28 Dec label', C.labelFor(new Date(2026,11,28)), 'Bank holiday');
is('24 Dec working', C.isWorkingDay(new Date(2026,11,24)), true);
is('31 Dec working', C.isWorkingDay(new Date(2026,11,31)), true);

// day-of-month resolution
is('day 31 in Feb 2027 -> 26 Feb (Fri)', C.resolveDayOfMonth(2027,1,31), '2027-02-26');
is('day 25 Dec 2026 -> next working 29', C.resolveDayOfMonth(2026,11,25), '2026-12-29');
is('day 1 Nov 2026 (Sun) -> 2 Nov', C.resolveDayOfMonth(2026,10,1), '2026-11-02');

// override removal
C.setSchedule('all', []);
var d = new Date(2026,9,14);
C.toggleDate(d);                       // off, differs from rule -> override
is('override off', C.isCollectionDay(d), false);
C.toggleDate(d);                       // back to rule -> override removed
is('override back on', C.isCollectionDay(d), true);

// snapshot/restore
C.setSchedule('days', [21,28]);
var snap = C.snapshot();
C.setSchedule('none', []);
is('after none', C.countCollectionDaysInMonth(2026,9), 9);
C.restore(snap);
is('after restore', C.countCollectionDaysInMonth(2026,9), 11);
is('restored type', C.getSchedule().type, 'days');

console.log('\n' + pass + ' pass, ' + fail + ' fail');
process.exit(fail ? 1 : 0);
