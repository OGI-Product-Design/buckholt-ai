/* ============================================================================
   BACS Import — seed data
   ============================================================================

   Section 14 of `bacs-import-spec.md`. Page 1 of the imports table and the
   two named record sets are transcribed from the spec's tables exactly. The
   remaining 200 imports, and the records for every other file, are generated
   as section 14.4 describes: deterministically, seeded from the filename, so
   the prototype shows the same data on every load.

   The spec corrects one thing the Figma frames get wrong, and this file
   follows the spec: the fourth row is `ARUDDAugust202601.txt`, not
   "ARUUDAugust202601.txt".

   Exposes `window.SEED`.
   ============================================================================ */
(function (global) {
  'use strict';

  var JANE = { name: 'Jane Smith', initials: 'JS' };
  var JOHN = { name: 'John Doe', initials: 'JD' };


  /* ------------------------------------------------- 14.1 Previous imports
     Page 1, exactly as the spec's table gives it. `importedAt` is written
     from the table's `dd/mm/yyyy HH:mm` values.
     ---------------------------------------------------------------------- */

  var PAGE_ONE = [
    ['AUDDISFileA0000215',    'COMPLETED', 'AUDDIS_ADDACS', JANE, '2026-09-02T09:58'],
    ['ARUDD0902-KP.RFT',      'PARTIAL',   'ARUDD',         JANE, '2026-09-02T09:51'],
    ['AUDDISFileA0000214',    'COMPLETED', 'AUDDIS_ADDACS', JANE, '2026-09-01T09:13'],
    ['ARUDDAugust202601.txt', 'COMPLETED', 'ARUDD',         JANE, '2026-08-29T09:11'],
    ['ARUDD_0829.RFT',        'FAILED',    'ARUDD',         JOHN, '2026-08-28T09:23'],
    ['AUDDISStaticExportFile','COMPLETED', 'AUDDIS_ADDACS', JANE, '2026-08-27T09:54'],
    ['ARUDD0827-RP.RFT',      'COMPLETED', 'ARUDD',         JANE, '2026-08-26T09:52'],
    ['AUDDISFileA0000213',    'FAILED',    'AUDDIS_ADDACS', JANE, '2026-08-26T09:45'],
    ['ARUDD_25082026.txt',    'COMPLETED', 'ARUDD',         JANE, '2026-08-26T09:41'],
    ['ADDACSCJones',          'COMPLETED', 'AUDDIS_ADDACS', JANE, '2026-08-26T09:37']
  ];


  /* ------------------------------ 14.2 ARUDD0902-KP.RFT records (Partial) */

  var ARUDD_0902 = [
    ['CV/7482910-01', 'Daniel Hughes',   48.07,  '2026-09-01', 'APPLIED',     '0'],
    ['MC/884120-01',  'Priya Shah',      62.50,  '2026-09-01', 'APPLIED',     '0'],
    ['PL/770318-01',  'Margaret Ellis',  34.19,  '2026-09-01', 'APPLIED',     '2'],
    ['CV/551037-01',  'Tom Whitfield',   91.33,  '2026-09-01', 'APPLIED',     '1'],
    ['MT/330102-01',  'Aisha Rahman',    57.80,  '2026-09-01', 'APPLIED',     'B'],
    ['CV/694920-01',  'Gareth Price',   120.45,  '2026-09-01', 'APPLIED',     '0'],
    ['FL/884134-01',  'Chloe Barnes',    41.60,  '2026-08-28', 'APPLIED',     '3'],
    ['MC/889102-01',  'Rhys Morgan',     73.25,  '2026-08-28', 'APPLIED',     '6'],
    ['PL/885930-01',  'Hannah Cole',     29.99,  '2026-08-28', 'APPLIED',     '4'],
    ['CV/884590-01',  'Kofi Mensah',     88.10,  '2026-08-28', 'APPLIED',     '5'],
    ['MT/330593-01',  'Emma Lowe',       52.40,  '2026-08-28', 'APPLIED',     '0'],
    ['CV/883017-01',  'TURNER S',        66.00,  '2026-08-28', 'NOT_APPLIED', '7']
  ];


  /* -------------------- 14.3 AUDDISFileA0000215 records (Completed) */

  var AUDDIS_0215 = [
    ['CV/7482915-01', 'Leah Patel',      '2026-09-02', '5'],
    ['MC/885301-01',  'Owen Davies',     '2026-09-02', 'L'],
    ['PL/770402-01',  'Grace Okafor',    '2026-09-02', 'B'],
    ['CV/551101-01',  'Mohammed Iqbal',  '2026-09-02', '6'],
    ['MT/330214-01',  'Isla Fraser',     '2026-09-02', 'F'],
    ['CV/884200-01',  'Ben Carter',      '2026-09-01', 'G'],
    ['FL/694977-01',  'Ruth Adams',      '2026-09-01', '2'],
    ['CV/889150-01',  'Jack Wilson',     '2026-09-01', 'P']
  ];


  /* ------------------------------------------------- Deterministic helpers
     Section 14.4: "generate 5–15 Applied records each, deterministically
     seeded from the filename". One small string-seeded generator does all of
     it, so every reload produces identical data.
     ---------------------------------------------------------------------- */

  function seedFrom(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) || 1;
  }

  function rng(seed) {
    var s = seed;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  }

  function pick(rand, list) { return list[Math.floor(rand() * list.length)]; }
  function between(rand, lo, hi) { return lo + Math.floor(rand() * (hi - lo + 1)); }

  var FIRST_NAMES = [
    'Alice', 'Marcus', 'Freya', 'Dev', 'Nina', 'Callum', 'Yusuf', 'Erin',
    'Joel', 'Sasha', 'Lewis', 'Amara', 'Niamh', 'Theo', 'Rosa', 'Iain',
    'Bella', 'Hugo', 'Zara', 'Connor', 'Maya', 'Sean', 'Elsie', 'Rafiq'
  ];

  var LAST_NAMES = [
    'Baxter', 'Nwosu', 'Kaur', 'Hargreaves', 'Duffy', 'Lindqvist', 'Obi',
    'Sinclair', 'Mahmood', 'Pritchard', 'Ferreira', 'Kowalski', 'Doyle',
    'Attwood', 'Novak', 'Rees', 'Balogun', 'Stringer', 'Vance', 'Quinn'
  ];

  var PREFIXES = ['CV', 'MC', 'PL', 'MT', 'FL'];

  /* A record is NOT_APPLIED when no policy matches, and then "its client name
     comes from the file, as BACS sent it: upper case, maximum 18 characters"
     (section 4.1). BACS sends surname then initial, which is the shape the
     spec's own example takes: "TURNER S". */
  function bacsName(first, last) {
    return (last + ' ' + first.charAt(0)).toUpperCase().slice(0, 18);
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function isoDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function shiftDays(iso, days) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() - days);
    return isoDate(d);
  }

  /* Codes a generated file may carry, by code set. Taken from the reason-code
     data so a generated record can never cite a code the blade doesn't list. */
  function codesFor(set) {
    return (global.REASON_CODES[set].codes || []).map(function (c) { return c.code; });
  }


  /* ------------------------------------------------------ Generated records
     Section 14.4. ARUDD files use ARUDD codes and amounts between £25 and
     £150. AUDDIS/ADDACS files use AUDDIS codes; files whose names start with
     "ADDACS" use ADDACS codes and the ADDACS type.
     ---------------------------------------------------------------------- */

  function generateRecords(imp, notAppliedCount, forcedCount) {
    var rand = rng(seedFrom(imp.filename));
    var count = forcedCount || between(rand, 5, 15);
    var isAddacs = /^ADDACS/i.test(imp.filename);
    var set = imp.fileType === 'ARUDD' ? 'arudd' : (isAddacs ? 'addacs' : 'auddis');
    var codes = codesFor(set);
    var baseDate = imp.importedAt.slice(0, 10);
    var records = [];

    for (var i = 0; i < count; i++) {
      var first = pick(rand, FIRST_NAMES);
      var last = pick(rand, LAST_NAMES);
      var notApplied = i >= count - notAppliedCount;

      var record = {
        policyRef: pick(rand, PREFIXES) + '/' + between(rand, 330000, 899999) + '-0' + between(rand, 1, 3),
        clientName: notApplied ? bacsName(first, last) : (first + ' ' + last),
        date: shiftDays(baseDate, between(rand, 1, 3)),
        reasonCode: pick(rand, codes),
        outcome: notApplied ? 'NOT_APPLIED' : 'APPLIED'
      };

      if (notApplied) record.notAppliedReason = 'NO_MATCHING_POLICY';

      if (imp.fileType === 'ARUDD') {
        record.amount = Math.round((25 + rand() * 125) * 100) / 100;
      } else {
        record.recordType = isAddacs ? 'ADDACS' : 'AUDDIS return';
      }

      records.push(record);
    }

    return records;
  }


  /* ------------------------------------------------ The 200 older imports
     Section 14.1: "The total is 210 imports; generate rows 11–210 as older
     records with a realistic mix of statuses, file types and filenames."
     ---------------------------------------------------------------------- */

  function olderImports() {
    var rand = rng(seedFrom('bacs-import older rows'));
    var rows = [];
    var day = new Date('2026-08-25T00:00:00');
    var serial = 212;
    var addacsNames = ['CJones', 'MPatel', 'RBrown', 'SKhan', 'LWard', 'DFisher', 'AOgden'];

    for (var i = 0; i < 200; i++) {
      /* Step back between one and two days; several imports can share a day,
         as page 1 does. */
      if (rand() < 0.55) day.setDate(day.getDate() - 1);
      if (rand() < 0.2) day.setDate(day.getDate() - 1);

      var isArudd = rand() < 0.5;
      var roll = rand();
      var status = roll < 0.74 ? 'COMPLETED' : (roll < 0.9 ? 'PARTIAL' : 'FAILED');
      var d = isoDate(day);
      var dmy = pad(day.getDate()) + pad(day.getMonth() + 1) + day.getFullYear();
      var filename;

      if (isArudd) {
        filename = pick(rand, [
          'ARUDD_' + dmy + '.txt',
          'ARUDD' + pad(day.getMonth() + 1) + pad(day.getDate()) + '-' +
            pick(rand, ['KP', 'RP', 'TL', 'JM', 'BW']) + '.RFT',
          'ARUDD' + ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'][day.getMonth()] +
            day.getFullYear() + pad(between(rand, 1, 28)) + '.txt'
        ]);
      } else {
        serial -= 1;
        filename = pick(rand, [
          'AUDDISFileA' + String(serial).padStart(7, '0'),
          'AUDDISStaticExportFile' + serial,
          'ADDACS' + pick(rand, addacsNames)
        ]);
      }

      rows.push([
        filename,
        status,
        isArudd ? 'ARUDD' : 'AUDDIS_ADDACS',
        rand() < 0.8 ? JANE : JOHN,
        d + 'T' + pad(between(rand, 8, 16)) + ':' + pad(between(rand, 0, 59))
      ]);
    }

    return rows;
  }


  /* ---------------------------------------------------------------- Build */

  function toImport(row, index) {
    return {
      id: 'im' + (index + 1),
      filename: row[0],
      status: row[1],
      fileType: row[2],
      importedBy: row[3],
      importedAt: row[4],
      records: []
    };
  }

  var imports = PAGE_ONE.concat(olderImports()).map(toImport);

  imports.forEach(function (imp) {
    if (imp.status === 'FAILED' || imp.status === 'IN_PROGRESS') {
      /* Section 4: records are empty for IN_PROGRESS and FAILED, and section
         10 gives the Failed page its own alert copy. */
      imp.records = [];
      imp.failureMessage = 'The file could not be processed. Check the file matches the ' +
        'selected BACS file type and try importing it again.';
      return;
    }

    if (imp.filename === 'ARUDD0902-KP.RFT') {
      imp.records = ARUDD_0902.map(function (r) {
        var rec = {
          policyRef: r[0], clientName: r[1], amount: r[2],
          date: r[3], outcome: r[4], reasonCode: r[5]
        };
        if (r[4] === 'NOT_APPLIED') rec.notAppliedReason = 'NO_MATCHING_POLICY';
        return rec;
      });
      return;
    }

    if (imp.filename === 'AUDDISFileA0000215') {
      imp.records = AUDDIS_0215.map(function (r) {
        return {
          policyRef: r[0], clientName: r[1], recordType: 'AUDDIS return',
          date: r[2], outcome: 'APPLIED', reasonCode: r[3]
        };
      });
      return;
    }

    imp.records = generateRecords(imp, imp.status === 'PARTIAL' ? 1 : 0);

    /* A generated Partial needs at least one unmatched record; a generated
       Completed must have none. `generateRecords` is told how many, so this
       only has to widen a Partial when the roll gave it a long file. */
    if (imp.status === 'PARTIAL' && imp.records.length > 10) {
      imp.records[0].outcome = 'NOT_APPLIED';
      imp.records[0].notAppliedReason = 'NO_MATCHING_POLICY';
      imp.records[0].clientName = imp.records[0].clientName.toUpperCase().slice(0, 18);
    }
  });


  /* Records for an import made through the flow. Section 14.4: "A Completed
     result has 6 Applied records"; section 15 gives a Partial "1 Not applied
     record". Built with the same generator, then trimmed to those counts —
     the not-applied record is generated last, so it survives the trim. */
  function recordsForNewImport(imp, outcome) {
    var notApplied = outcome === 'PARTIAL' ? 1 : 0;
    return generateRecords(imp, notApplied, 6 + notApplied);
  }


  global.SEED = {
    imports: imports,
    user: JANE,
    recordsForNewImport: recordsForNewImport
  };
}(window));
