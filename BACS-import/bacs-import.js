/* ============================================================================
   BACS Import prototype — behaviour
   ============================================================================

   Implements IM-00 to IM-10 from `bacs-import-spec.md`. State is held in
   memory only; reloading resets to the seed data, as section 15 requires.

   Every piece of markup this file creates is Buckholt markup taken from
   `components/<component>/examples.html`, except where a comment says
   Buckholt has no component for it. Those four gaps — the file drop zone, the
   pagination bar, the date range control and the blade — are listed in
   PROTOTYPE.md.

   The static top bar, left navigation, clock, toasts and tooltips come from
   `prototype/app-shell.js`, shared with Originators. The blade comes from
   `prototype/blade.js`, and its contents from `reason-codes-blade.js`.
   ============================================================================ */
(function () {
  'use strict';

  var esc = Shell.escapeHtml;

  function $(id) { return document.getElementById(id); }


  /* ======================================================================
     Copy — section 5, 7, 8, 9, 10 and 12 of the spec, verbatim.
     ====================================================================== */

  var COPY = {
    partialTooltipTitle: 'Some records weren’t applied',
    failedTooltipTitle: 'The file import failed',
    failedBody: 'The file could not be processed. Check the file matches the selected ' +
      'BACS file type and try importing it again.',
    noImports: {
      heading: 'No imports match these filters',
      body: 'Try a different date range, result or file type.'
    },
    hints: {
      ARUDD: 'Returned or unpaid direct debit collections against existing policies.',
      AUDDIS_ADDACS: 'Rejected, cancelled or amended Direct Debit Instructions from the payer’s bank.'
    },
    formatError: {
      ARUDD: 'This isn’t a valid ARUDD file. Check you’ve chosen the right file type, ' +
        'or get a new copy of the file.',
      AUDDIS_ADDACS: 'This isn’t a valid AUDDIS Return/ADDACS file. Check you’ve chosen ' +
        'the right file type, or get a new copy of the file.'
    },
    toast: {
      submitted: 'File submitted for import',
      completed: 'File import completed',
      partial: 'Some records weren’t applied',
      failed: 'File import failed'
    },
    alert: {
      ARUDD: { title: 'Unpaid collections posted in Mobius', verb: 'posted' },
      AUDDIS_ADDACS: { title: 'Instructions updated in Mobius', verb: 'updated' }
    },
    noPermission: 'You don’t have permission to import BACS files.'
  };

  /* The spec's copy tables are written with straight apostrophes; the brief
     asks for curly ones, and every other string the product shows — the
     reason-code data in section 13.4 included — uses them. They are written
     as ’ above so the difference is deliberate rather than accidental. */

  var FILE_TYPE_LABEL = {
    ARUDD: 'ARUDD file',
    AUDDIS_ADDACS: 'AUDDIS Return/ADDACS file'
  };

  /* Section 4.2 records a second spelling for the import modal, "with
     spaces", and flags it as open question 7. */
  var FILE_TYPE_LABEL_MODAL = {
    ARUDD: 'ARUDD file',
    AUDDIS_ADDACS: 'AUDDIS Return / ADDACS file'
  };

  var STATUS = {
    IN_PROGRESS: { label: 'In-progress', variant: 'info',    icon: 'fa-circle-info' },
    COMPLETED:   { label: 'Completed',   variant: 'success', icon: 'fa-circle-check' },
    PARTIAL:     { label: 'Partial',     variant: 'warning', icon: 'fa-triangle-exclamation' },
    FAILED:      { label: 'Failed',      variant: 'error',   icon: 'fa-circle-exclamation' }
  };

  var OUTCOME = {
    APPLIED:     { label: 'Applied',     variant: 'success', icon: 'fa-circle-check' },
    NOT_APPLIED: { label: 'Not applied', variant: 'warning', icon: 'fa-triangle-exclamation' }
  };


  /* ============================================================== Formatting
     Section 4.2.
     ============================================================== */

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  function pad(n) { return String(n).padStart(2, '0'); }

  /* `dd/mm/yyyy HH:mm` for imports. */
  function formatDateTime(iso) {
    return formatDate(iso) + ' ' + iso.slice(11, 16);
  }

  /* `dd/mm/yyyy` for records. */
  function formatDate(iso) {
    return iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
  }

  /* `{file type label} • imported by {name} on {d MMMM yyyy}, {HH:mm}` */
  function formatSubtitle(imp) {
    var day = parseInt(imp.importedAt.slice(8, 10), 10);
    var month = MONTHS[parseInt(imp.importedAt.slice(5, 7), 10) - 1];
    return FILE_TYPE_LABEL[imp.fileType] + ' • imported by ' + imp.importedBy.name +
      ' on ' + day + ' ' + month + ' ' + imp.importedAt.slice(0, 4) + ', ' + imp.importedAt.slice(11, 16);
  }

  /* `£` with two decimals. */
  function formatAmount(n) {
    return '£' + n.toFixed(2);
  }

  /* Which reason-code set a file's codes belong to. */
  function codeSetFor(imp) {
    if (imp.fileType === 'ARUDD') return 'arudd';
    return /^ADDACS/i.test(imp.filename) ? 'addacs' : 'auddis';
  }

  function reasonTitle(imp, code) {
    var codes = REASON_CODES[codeSetFor(imp)].codes || [];
    for (var i = 0; i < codes.length; i++) {
      if (codes[i].code === code) return codes[i].title;
    }
    return '';
  }

  /* `{code} – {title}`, with an en dash. */
  function reasonText(imp, code) {
    var title = reasonTitle(imp, code);
    return title ? code + ' – ' + title : code;
  }

  /* "Showing 1–{n} of {n}", with an en dash. */
  function showingLine(first, last, total) {
    return 'Showing ' + first + '–' + last + ' of ' + total;
  }

  function appliedCount(imp) {
    return imp.records.filter(function (r) { return r.outcome === 'APPLIED'; }).length;
  }

  function notAppliedCount(imp) {
    return imp.records.filter(function (r) { return r.outcome === 'NOT_APPLIED'; }).length;
  }


  /* ==================================================================== State */

  var state = {
    imports: SEED.imports.slice(),
    user: SEED.user,
    canImport: new URLSearchParams(location.search).get('permission') !== 'none',
    list: {
      result: 'all',
      type: 'all',
      from: null,
      to: null,
      sort: { column: 'importedAt', direction: 'desc' },
      page: 1,
      perPage: 10
    },
    detail: {
      id: null,
      tab: 'all',
      search: '',
      sort: { column: null, direction: 'asc' },
      page: 1
    },
    /* The file chosen in the import modal. */
    upload: { fileType: '', filename: '', invalid: false, busy: false }
  };

  var importSeq = state.imports.length;

  function importById(id) {
    for (var i = 0; i < state.imports.length; i++) {
      if (state.imports[i].id === id) return state.imports[i];
    }
    return null;
  }


  /* ============================================================ Shared markup */

  function statusPill(status, extra) {
    var s = STATUS[status];
    return '<span class="tag tag-status tag-status-' + s.variant + '"' + (extra || '') + '>' +
      '<span class="icon"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i></span>' +
      '<span class="tag-label">' + s.label + '</span>' +
    '</span>';
  }

  function outcomePill(outcome) {
    var o = OUTCOME[outcome];
    return '<span class="tag tag-status tag-status-' + o.variant + '">' +
      '<span class="icon"><i class="fa-solid ' + o.icon + '" aria-hidden="true"></i></span>' +
      '<span class="tag-label">' + o.label + '</span>' +
    '</span>';
  }

  /* Buckholt Avatar, extra-small, with the importer's initials beside the
     name (IM-00-01). */
  function importedByCell(person) {
    return '<div class="im-person">' +
      '<div class="avatar avatar-xs" aria-hidden="true"><div class="avatar-initials">' +
        esc(person.initials) +
      '</div></div>' +
      '<span>' + esc(person.name) + '</span>' +
    '</div>';
  }

  /* Buckholt Table's documented sortable header: `.table-sort-header` with a
     real `<button class="table-sort">` inside. `aria-sort` on the `<th>` is
     the application-level addition `components/table/rules.md` explicitly
     invites: "the application should also expose the current sort state
     accessibly; that behaviour is not fully specified".

     Buckholt hides `.table-sort-icon` until the column is hovered or sorted.
     The frames draw every icon at rest. Buckholt's runtime wins, and the
     difference is recorded in PROTOTYPE.md. */
  function sortHeader(label, column, sort, extraClass) {
    var active = sort.column === column;
    var dir = active ? sort.direction : null;
    return '<th scope="col" class="table-sort-header' + (extraClass ? ' ' + extraClass : '') + '"' +
        (active ? ' aria-sort="' + (dir === 'asc' ? 'ascending' : 'descending') + '"' : '') + '>' +
      '<button class="table-sort' + (active ? ' table-sort-' + dir : '') + '" type="button"' +
        ' data-sort="' + column + '" aria-label="Sort by ' + esc(label) + '">' +
        '<div class="table-header-label">' + esc(label) + '</div>' +
        '<div class="table-sort-icon"><i class="fa-solid fa-sort" aria-hidden="true"></i></div>' +
      '</button>' +
    '</th>';
  }

  function emptyState(heading, body) {
    return '<div class="text-block im-empty">' +
      '<h3 class="headline-01">' + heading + '</h3>' +
      '<p>' + body + '</p>' +
    '</div>';
  }

  function toggleSort(sort, column) {
    if (sort.column === column) {
      sort.direction = sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sort.column = column;
      sort.direction = 'asc';
    }
  }

  function compare(a, b) {
    if (a === b) return 0;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), 'en-GB', { numeric: true, sensitivity: 'base' });
  }


  /* ======================================================================
     IM-00 Previous imports
     ====================================================================== */

  /* Section 5: "Filters apply together (AND)". The date range's dates are
     both inclusive. */
  function filteredImports() {
    var f = state.list;
    return state.imports.filter(function (imp) {
      if (f.result !== 'all' && imp.status !== f.result) return false;
      if (f.type !== 'all' && imp.fileType !== f.type) return false;
      var day = imp.importedAt.slice(0, 10);
      if (f.from && day < f.from) return false;
      if (f.to && day > f.to) return false;
      return true;
    });
  }

  var LIST_SORT_VALUE = {
    filename: function (imp) { return imp.filename; },
    status: function (imp) { return STATUS[imp.status].label; },
    fileType: function (imp) { return FILE_TYPE_LABEL[imp.fileType]; },
    importedBy: function (imp) { return imp.importedBy.name; },
    importedAt: function (imp) { return imp.importedAt; }
  };

  function sortedImports() {
    var sort = state.list.sort;
    var value = LIST_SORT_VALUE[sort.column] || LIST_SORT_VALUE.importedAt;
    var sign = sort.direction === 'asc' ? 1 : -1;
    return filteredImports().slice().sort(function (a, b) {
      return sign * compare(value(a), value(b));
    });
  }

  /* Section 5: Partial and Failed pills show tooltips (IM-06-01, IM-07-01).
     Section 3.4: they show on hover and on keyboard focus, so the pill takes
     focus and is described by its tooltip. */
  function pillTooltip(imp) {
    if (imp.status === 'PARTIAL') {
      var x = notAppliedCount(imp);
      var y = imp.records.length;
      var body = x === 1
        ? '1 of ' + y + ' records couldn’t be matched to a policy, so it hasn’t been ' +
          'applied. The rest have been applied. Open the import to see which records need attention.'
        : x + ' of ' + y + ' records couldn’t be matched to a policy, so they haven’t been ' +
          'applied. The rest have been applied. Open the import to see which records need attention.';
      return { title: COPY.partialTooltipTitle, body: body };
    }
    if (imp.status === 'FAILED') {
      return { title: COPY.failedTooltipTitle, body: COPY.failedBody };
    }
    return null;
  }

  function pillCell(imp) {
    var tip = pillTooltip(imp);
    if (!tip) return statusPill(imp.status);
    return statusPill(imp.status,
      ' tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top"' +
      ' data-bs-title="' + esc(tip.title + '. ' + tip.body) + '"');
  }

  function renderList() {
    var rows = sortedImports();
    var total = rows.length;
    var perPage = state.list.perPage;
    var pages = Math.max(1, Math.ceil(total / perPage));

    if (state.list.page > pages) state.list.page = pages;

    var first = (state.list.page - 1) * perPage;
    var page = rows.slice(first, first + perPage);
    var region = $('im-table-region');

    Shell.disposeTooltips(region);

    /* Section 5: "No results: when the filters return nothing…" */
    if (total === 0) {
      region.innerHTML = emptyState(esc(COPY.noImports.heading), esc(COPY.noImports.body));
      return;
    }

    var sort = state.list.sort;

    var body = page.map(function (imp) {
      var openable = imp.status !== 'IN_PROGRESS';
      return '<tr' + (openable ? ' class="im-row-openable"' : '') + ' data-import="' + imp.id + '">' +
        '<td>' + esc(imp.filename) + '</td>' +
        '<td>' + pillCell(imp) + '</td>' +
        '<td>' + esc(FILE_TYPE_LABEL[imp.fileType]) + '</td>' +
        '<td>' + importedByCell(imp.importedBy) + '</td>' +
        '<td>' + formatDateTime(imp.importedAt) + '</td>' +
        '<td class="col-fit cell-data-right">' +
          '<div class="im-row-open">' +
            '<div class="button-set">' +
              '<button type="button" class="btn btn-ghost" data-open="' + imp.id + '"' +
                (openable ? '' : ' disabled') +
                ' aria-label="View import ' + esc(imp.filename) + '">' +
                '<div class="btn-icon"><i class="fa-regular fa-chevron-right" aria-hidden="true"></i></div>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    region.innerHTML =
      '<div class="table-container im-table">' +
        '<div class="table-content">' +
          '<table class="table">' +
            '<thead>' +
              '<tr>' +
                sortHeader('Filename', 'filename', sort) +
                sortHeader('Import result', 'status', sort) +
                sortHeader('BACS file type', 'fileType', sort) +
                sortHeader('Imported by', 'importedBy', sort) +
                sortHeader('Import date', 'importedAt', sort) +
                '<th scope="col" class="col-fit cell-data-right"><div class="table-header-label"></div></th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              '<tr class="table-gap"><td colspan="100%"></td></tr>' +
              body +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      paginationMarkup(state.list.page, pages, first + 1, first + page.length, total);

    Shell.initTooltips(region);
  }

  /* Buckholt has no pagination component: `css/buckholt.css` defines no
     `.pagination`, `.page-item` or `.page-link` rule, and Page navigation is
     for sibling pages. Drawn from Buckholt tokens; recorded in PROTOTYPE.md.

     IM-00-01 draws a window of four page numbers against 21 pages, so the
     window is four wide. */
  function paginationMarkup(current, pages, first, last, total) {
    var windowSize = 4;
    var start = Math.max(1, Math.min(current - Math.floor((windowSize - 1) / 2), pages - windowSize + 1));
    var numbers = '';

    for (var p = start; p < start + windowSize && p <= pages; p++) {
      numbers += '<button type="button" class="im-page" data-page="' + p + '"' +
        (p === current ? ' aria-current="page"' : '') +
        ' aria-label="Page ' + p + '">' + p + '</button>';
    }

    function step(page, label, glyph, disabled) {
      return '<button type="button" class="im-page" data-page="' + page + '"' +
        (disabled ? ' disabled' : '') + ' aria-label="' + label + '">' +
        '<span aria-hidden="true">' + glyph + '</span>' +
      '</button>';
    }

    return '<div class="im-pagination-bar">' +
      '<div class="im-pages">' +
        step(1, 'First page', '«', current === 1) +
        step(current - 1, 'Previous page', '‹', current === 1) +
        numbers +
        step(current + 1, 'Next page', '›', current === pages) +
        step(pages, 'Last page', '»', current === pages) +
      '</div>' +

      '<div class="im-per-page input">' +
        '<label class="form-label" for="im-per-page">Results per page</label>' +
        '<div class="response select-input">' +
          '<select class="form-select" id="im-per-page">' +
            [10, 25, 50].map(function (n) {
              return '<option value="' + n + '"' + (n === state.list.perPage ? ' selected' : '') + '>' + n + '</option>';
            }).join('') +
          '</select>' +
        '</div>' +
      '</div>' +

      '<p class="support-01 im-row-count">' + showingLine(first, last, total) + '</p>' +
    '</div>';
  }


  /* ======================================================================
     IM-06, IM-08, IM-09 Detail pages
     ====================================================================== */

  /* Section 9, "Alert copy". {A} is the number of applied records. */
  function alertBody(imp) {
    var words = COPY.alert[imp.fileType];
    var applied = appliedCount(imp);
    var unmatched = notAppliedCount(imp);

    var body = imp.fileType === 'ARUDD'
      ? applied + ' unpaid direct debits have been posted to client accounts.'
      : applied + ' direct debit instructions have been updated on client policies.';

    if (unmatched === 1) {
      body += ' 1 record couldn’t be matched to a policy, so it hasn’t been ' + words.verb + '.';
    } else if (unmatched > 1) {
      body += ' ' + unmatched + ' records couldn’t be matched to a policy, so they haven’t been ' +
        words.verb + '.';
    }

    return body;
  }

  /* Buckholt Alert with an icon. Section 3.6: detail-page alerts have no
     close button, because they summarise the page. */
  function alertMarkup(variant, icon, title, body) {
    return '<div class="alert alert-' + variant + '" role="alert">' +
      '<div class="alert-content">' +
        '<span class="alert-icon"><i class="fa-solid ' + icon + '" aria-hidden="true"></i></span>' +
        '<div class="alert-body">' +
          '<div class="alert-message"><h6>' + esc(title) + '</h6></div>' +
          '<div class="alert-note">' + esc(body) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  var TABS = [
    { key: 'all', label: 'All' },
    { key: 'applied', label: 'Applied' },
    { key: 'notApplied', label: 'Not applied' }
  ];

  function recordsForTab(imp, tab) {
    if (tab === 'applied') return imp.records.filter(function (r) { return r.outcome === 'APPLIED'; });
    if (tab === 'notApplied') return imp.records.filter(function (r) { return r.outcome === 'NOT_APPLIED'; });
    return imp.records.slice();
  }

  var RECORD_SORT_VALUE = {
    policyRef: function (r) { return r.policyRef; },
    clientName: function (r) { return r.clientName; },
    amount: function (r) { return r.amount; },
    type: function (r) { return r.recordType; },
    date: function (r) { return r.date; },
    outcome: function (r) { return OUTCOME[r.outcome].label; },
    reason: function (r) { return r.reasonCode; }
  };

  /* Section 9: "Search is case-insensitive, trims spaces, and matches policy
     ref or client name. It applies together with the active tab." Sorting
     defaults to the order in the file. */
  function visibleRecords(imp, tab) {
    var q = state.detail.search.trim().toLowerCase();
    var rows = recordsForTab(imp, tab).filter(function (r) {
      if (!q) return true;
      return (r.policyRef + ' ' + r.clientName).toLowerCase().indexOf(q) !== -1;
    });

    var sort = state.detail.sort;
    if (sort.column) {
      var value = RECORD_SORT_VALUE[sort.column];
      var sign = sort.direction === 'asc' ? 1 : -1;
      rows = rows.slice().sort(function (a, b) { return sign * compare(value(a), value(b)); });
    }

    return rows;
  }

  function recordRow(imp, record) {
    var isArudd = imp.fileType === 'ARUDD';
    var unmatched = record.outcome === 'NOT_APPLIED';

    var second = isArudd
      ? '<td class="col-fit cell-data-right"><span class="data-number">' +
          formatAmount(record.amount) + '</span></td>'
      : '<td>' + esc(record.recordType) + '</td>';

    /* Section 9: Not applied rows have no row menu, because there is no
       policy to open. Applied rows have one item, Open policy — Buckholt
       Menu button, Code & specs example 3. */
    var menu = unmatched
      ? ''
      : '<div class="menu">' +
          '<button type="button" class="btn btn-ghost menu-toggle" data-bs-toggle="dropdown"' +
            ' aria-expanded="false" aria-label="Actions for ' + esc(record.policyRef) + '">' +
            '<div class="btn-icon"><i class="fa-regular fa-ellipsis-vertical" aria-hidden="true"></i></div>' +
          '</button>' +
          '<div class="menu-panel dropdown-menu dropdown-menu-end">' +
            '<ul class="menu-body" role="menu">' +
              '<li>' +
                '<a class="menu-item" href="#/policy/' + encodeURIComponent(record.policyRef) + '">' +
                  '<i class="fa-regular fa-file-export"></i>Open policy' +
                '</a>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>';

    return '<tr>' +
      '<td>' + esc(record.policyRef) + '</td>' +
      '<td>' + esc(record.clientName) + '</td>' +
      second +
      '<td>' + formatDate(record.date) + '</td>' +
      '<td>' +
        '<div class="im-outcome-cell">' +
          outcomePill(record.outcome) +
          (unmatched ? '<span class="tag tag-sm"><span class="tag-label">No matching policy</span></span>' : '') +
        '</div>' +
      '</td>' +
      '<td>' + esc(reasonText(imp, record.reasonCode)) + '</td>' +
      '<td class="col-fit cell-data-right">' + menu + '</td>' +
    '</tr>';
  }

  function recordTable(imp, tab) {
    var rows = visibleRecords(imp, tab);
    var isArudd = imp.fileType === 'ARUDD';
    var sort = state.detail.sort;

    /* Section 9: "No search results" and the empty Not applied tab. */
    if (rows.length === 0) {
      if (state.detail.search.trim()) {
        return emptyState(
          'No records match “' + esc(state.detail.search.trim()) + '”',
          'Check the policy ref or client name and try again.');
      }
      if (tab === 'notApplied') {
        return emptyState('All records applied', 'All records in this file have been applied.');
      }
      return emptyState('No records', 'This file contains no records.');
    }

    /* Section 9 item 8: pagination when there are more than 25 records. */
    var paged = rows;
    var pagination = '';
    if (rows.length > 25) {
      var pages = Math.ceil(rows.length / 25);
      if (state.detail.page > pages) state.detail.page = pages;
      var first = (state.detail.page - 1) * 25;
      paged = rows.slice(first, first + 25);
      pagination = paginationMarkup(state.detail.page, pages, first + 1, first + paged.length, rows.length);
    }

    return '<div class="im-table-region">' +
      '<div class="table-container im-table">' +
        '<div class="table-content">' +
          '<table class="table">' +
            '<thead>' +
              '<tr>' +
                sortHeader('Policy ref', 'policyRef', sort) +
                sortHeader('Client name', 'clientName', sort) +
                (isArudd
                  ? sortHeader('Amount', 'amount', sort, 'col-fit cell-data-right')
                  : sortHeader('Type', 'type', sort)) +
                sortHeader(isArudd ? 'Collection date' : 'Date', 'date', sort) +
                sortHeader('Outcome', 'outcome', sort) +
                sortHeader('Reason', 'reason', sort) +
                '<th scope="col" class="col-fit cell-data-right"><div class="table-header-label"></div></th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              '<tr class="table-gap"><td colspan="100%"></td></tr>' +
              paged.map(function (r) { return recordRow(imp, r); }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      (pagination ||
        '<p class="support-01 im-row-count">' + showingLine(1, rows.length, rows.length) + '</p>') +
    '</div>';
  }

  function renderDetail(imp) {
    var pane = $('im-detail');
    Shell.disposeTooltips(pane);

    var head =
      '<div class="page-panel">' +
        '<a class="link-standalone im-back" href="#/import">' +
          '<span class="icon"><i class="fa-regular fa-arrow-left" aria-hidden="true"></i></span>' +
          'Previous imports' +
        '</a>' +

        '<div class="im-detail-head">' +
          '<div class="text-block">' +
            '<h2 class="headline-02">' + esc(imp.filename) + '</h2>' +
            '<p>' + esc(formatSubtitle(imp)) + '</p>' +
          '</div>' +
          (imp.status === 'FAILED' ? '' :
            '<div class="button-set">' +
              '<button type="button" class="btn btn-primary" id="im-download">' +
                '<div class="btn-icon">' +
                  '<i class="fa-regular fa-arrow-down-to-bracket" aria-hidden="true"></i>' +
                '</div>' +
                '<span class="button-label">Download report</span>' +
              '</button>' +
            '</div>') +
        '</div>' +
      '</div>';

    /* IM-06-02: a Failed import is the back link, the title, the subtitle and
       an error alert. No tabs, no table, no Download report. */
    if (imp.status === 'FAILED') {
      pane.innerHTML = head +
        '<div class="page-panel">' +
          alertMarkup('error', 'fa-circle-exclamation', COPY.failedTooltipTitle, imp.failureMessage) +
        '</div>';
      return;
    }

    var counts = {
      all: imp.records.length,
      applied: appliedCount(imp),
      notApplied: notAppliedCount(imp)
    };

    /* Buckholt Tabs: `.tabs > .tab-items > .tab-items-scroll > ul.nav.nav-underline`
       with pill behaviour, and one `.tab-pane` per tab. Section 9 keeps the
       Not applied tab even when its count is 0. */
    var tabButtons = TABS.map(function (tab) {
      var on = tab.key === state.detail.tab;
      return '<li class="nav-item" role="presentation">' +
        '<button class="nav-link' + (on ? ' active' : '') + '" id="im-tab-' + tab.key + '-tab"' +
          ' data-bs-toggle="pill" data-bs-target="#im-tab-' + tab.key + '" type="button" role="tab"' +
          ' data-tab="' + tab.key + '"' +
          ' aria-controls="im-tab-' + tab.key + '" aria-selected="' + (on ? 'true' : 'false') + '">' +
          tab.label +
          '<span class="tag tag-sm"><span class="tag-label">' + counts[tab.key] + '</span></span>' +
        '</button>' +
      '</li>';
    }).join('');

    var tabPanes = TABS.map(function (tab) {
      var on = tab.key === state.detail.tab;
      return '<div class="tab-pane fade' + (on ? ' active show' : '') + '" id="im-tab-' + tab.key + '"' +
        ' role="tabpanel" aria-labelledby="im-tab-' + tab.key + '-tab" tabindex="0">' +
        recordTable(imp, tab.key) +
      '</div>';
    }).join('');

    pane.innerHTML = head +
      '<div class="page-panel">' +
        alertMarkup('info', 'fa-circle-info', COPY.alert[imp.fileType].title, alertBody(imp)) +
      '</div>' +

      '<div class="page-panel">' +
        '<div class="tabs">' +
          '<div class="tab-items">' +
            '<div class="tab-items-scroll">' +
              '<ul class="nav nav-underline" role="tablist">' + tabButtons + '</ul>' +
            '</div>' +
          '</div>' +

          '<div class="im-detail-toolbar">' +
            '<div class="input im-detail-search">' +
              '<div class="response text-input">' +
                '<i class="input-icon fa-regular fa-magnifying-glass" aria-hidden="true"></i>' +
                '<label class="visually-hidden" for="im-record-search">Search policy ref or client name</label>' +
                '<input type="text" class="form-control" id="im-record-search" autocomplete="off"' +
                  ' placeholder="Search policy ref or client name" value="' + esc(state.detail.search) + '">' +
              '</div>' +
            '</div>' +

            '<div class="button-set">' +
              '<button type="button" class="btn btn-secondary" id="im-view-reason-codes">' +
                '<span class="button-label">View reason codes</span>' +
              '</button>' +
            '</div>' +
          '</div>' +

          '<div class="tab-content">' + tabPanes + '</div>' +
        '</div>' +
      '</div>';

    Shell.initTooltips(pane);
  }


  /* ======================================================= Download report
     Section 9 item 3: "a CSV of every record: policy ref, client name,
     amount or type, date, outcome, reason code, reason title." Section 15:
     generate it on the client.
     ====================================================================== */

  function csvCell(value) {
    var text = value === undefined || value === null ? '' : String(value);
    return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }

  function downloadReport(imp) {
    var isArudd = imp.fileType === 'ARUDD';
    var rows = [[
      'Policy ref', 'Client name', isArudd ? 'Amount' : 'Type',
      isArudd ? 'Collection date' : 'Date', 'Outcome', 'Reason code', 'Reason title'
    ]];

    imp.records.forEach(function (r) {
      rows.push([
        r.policyRef,
        r.clientName,
        isArudd ? formatAmount(r.amount) : r.recordType,
        formatDate(r.date),
        OUTCOME[r.outcome].label,
        r.reasonCode,
        reasonTitle(imp, r.reasonCode)
      ]);
    });

    var csv = rows.map(function (row) { return row.map(csvCell).join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = imp.filename.replace(/\.[^.]+$/, '') + '-report.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }


  /* ======================================================================
     IM-03, IM-04, IM-05 Import a file
     ====================================================================== */

  var importModal;

  /* Section 15: the outcome is simulated from the chosen filename. */
  function outcomeFor(filename) {
    var name = filename.toLowerCase();
    if (name.indexOf('invalid') !== -1) return 'INVALID';
    if (name.indexOf('fail') !== -1) return 'FAILED';
    if (name.indexOf('partial') !== -1) return 'PARTIAL';
    return 'COMPLETED';
  }

  /* Section 8: "the file is validated against the chosen type as soon as it's
     attached, before Import is selected." */
  function validateFile() {
    var u = state.upload;
    u.invalid = !!u.filename && !!u.fileType && outcomeFor(u.filename) === 'INVALID';
  }

  function refreshModal() {
    var u = state.upload;
    var hint = $('im-file-type-hint');

    hint.hidden = !u.fileType;
    if (u.fileType) hint.textContent = COPY.hints[u.fileType];

    /* Step 4: choosing a file type shows the hint and the drop zone. */
    $('im-file-region').hidden = !u.fileType;
    $('im-dropzone').hidden = !!u.filename;
    $('im-file-card').hidden = !u.filename;

    if (u.filename) {
      $('im-file-name').textContent = u.filename;
      $('im-file-remove').setAttribute('aria-label', 'Remove ' + u.filename);
    }

    var error = $('im-file-error');
    error.hidden = !u.invalid;
    if (u.invalid) {
      error.textContent = COPY.formatError[u.fileType];
      $('im-file-card').classList.add('is-invalid');
      $('im-file-card').setAttribute('aria-describedby', 'im-file-error');
    } else {
      $('im-file-card').classList.remove('is-invalid');
      $('im-file-card').removeAttribute('aria-describedby');
    }

    /* Section 7: "Import is enabled only when a file type is chosen and a
       valid file is attached." */
    var submit = $('im-import-submit');
    submit.disabled = u.busy || !u.fileType || !u.filename || u.invalid;

    /* Step 7: while importing, Cancel, the close button and the bin are
       disabled, and the button shows a spinner and "Importing…". */
    submit.innerHTML = u.busy
      ? '<div class="btn-icon"><i class="fa-regular fa-spinner fa-spin" aria-hidden="true"></i></div>' +
        '<span class="button-label">Importing…</span>'
      : '<span class="button-label">Import</span>';

    $('im-import-cancel').disabled = u.busy;
    $('im-modal-close').disabled = u.busy;
    $('im-file-remove').disabled = u.busy;
    $('im-file-type').disabled = u.busy;
    $('im-dropzone').disabled = u.busy;
  }

  /* Bootstrap returns focus to the opener only for modals triggered by its
     own `data-bs-toggle`. This one is opened from script, so the trigger is
     remembered and focus put back by hand. */
  var modalTrigger = null;

  function openImportModal(trigger) {
    modalTrigger = trigger || document.activeElement;
    state.upload = { fileType: '', filename: '', invalid: false, busy: false };
    $('im-file-type').value = '';
    $('im-file-input').value = '';
    refreshModal();
    importModal.show();
  }

  /* Section 7: "One file per import. Dropping several files keeps only the
     first." */
  function attachFile(name) {
    state.upload.filename = name;
    validateFile();
    refreshModal();
  }

  function submitImport() {
    var u = state.upload;
    if (u.busy) return;

    u.busy = true;
    refreshModal();

    /* Section 15: the Import button takes 1500 ms, then the modal closes and
       the first toast shows. */
    window.setTimeout(function () {
      var outcome = outcomeFor(u.filename);
      var now = new Date();
      var stamp = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
        'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());

      importSeq += 1;
      var imp = {
        id: 'im' + importSeq,
        filename: u.filename,
        fileType: u.fileType,
        status: 'IN_PROGRESS',
        importedBy: state.user,
        importedAt: stamp,
        records: []
      };

      state.imports.unshift(imp);
      u.busy = false;
      importModal.hide();

      /* Step 8: the new row appears at the top, In-progress, and the count
         goes up by one. The list is sorted newest first by default, so the
         row lands at the top on its own. */
      state.list.page = 1;
      renderList();
      Shell.showToast(COPY.toast.submitted, 'success');

      /* Section 15: the In-progress row resolves after 4000 ms. */
      window.setTimeout(function () { resolveImport(imp, outcome); }, 4000);
    }, 1500);
  }

  /* Step 9: "the row updates in place to its result", without a refresh. */
  function resolveImport(imp, outcome) {
    imp.status = outcome;

    if (outcome === 'FAILED') {
      imp.records = [];
      imp.failureMessage = COPY.failedBody;
    } else {
      imp.records = SEED.recordsForNewImport(imp, outcome);
    }

    if (state.route.name === 'list') renderList();
    if (state.route.name === 'detail' && state.route.id === imp.id) renderDetail(imp);

    if (outcome === 'COMPLETED') Shell.showToast(COPY.toast.completed, 'success');
    if (outcome === 'PARTIAL') Shell.showToast(COPY.toast.partial, 'warning');
    if (outcome === 'FAILED') Shell.showToast(COPY.toast.failed, 'error');
  }


  /* ======================================================================
     IM-10 No permission
     ====================================================================== */

  function applyPermission() {
    var button = $('im-new-import');
    if (state.canImport) return;

    /* Section 3.4 and 12: the disabled style, but `aria-disabled` rather than
       the native attribute, so the button keeps focus and its tooltip stays
       reachable. */
    button.classList.add('disabled');
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('data-bs-title', COPY.noPermission);
    Shell.initTooltips(button.parentNode);
  }


  /* ==================================================================== Routing
     Section 15: `#/import` and `#/import/{id}`, with the BACS tabs at
     `#/process`, `#/import`, `#/originators` and `#/calendar`. Originators is
     its own page, built from its own spec, so its tab is a real link to it.
     ====================================================================== */

  var BACS_TAB_PATHS = {
    process: '#/process',
    import: '#/import',
    originators: '../Originators/index.html',
    calendar: '#/calendar'
  };

  function parseRoute() {
    var hash = location.hash.replace(/^#/, '') || '/import';
    var parts = hash.split('/').filter(Boolean);

    if (parts[0] === 'import' && parts[1]) return { name: 'detail', id: parts[1] };
    if (parts[0] === 'policy') return { name: 'policy', ref: decodeURIComponent(parts.slice(1).join('/')) };
    if (parts[0] === 'process') return { name: 'placeholder', title: 'Process' };
    if (parts[0] === 'calendar') return { name: 'placeholder', title: 'Calendar' };
    return { name: 'list' };
  }

  function show(id) {
    ['im-list', 'im-detail', 'im-placeholder'].forEach(function (pane) {
      $(pane).hidden = pane !== id;
    });
  }

  function placeholder(title, body) {
    $('im-placeholder').innerHTML =
      '<div class="page-panel" id="im-placeholder-tabs"></div>' +
      '<div class="page-panel">' +
        '<div class="text-block">' +
          '<h2 class="headline-02">' + esc(title) + '</h2>' +
          '<p>' + esc(body) + '</p>' +
        '</div>' +
      '</div>';
    $('im-placeholder-tabs').innerHTML = Shell.bacsTabs('', BACS_TAB_PATHS);
    show('im-placeholder');
  }

  function render() {
    var route = parseRoute();
    state.route = route;

    if (route.name === 'detail') {
      var imp = importById(route.id);
      if (!imp || imp.status === 'IN_PROGRESS') {
        /* An In-progress import cannot be opened (section 5). */
        location.hash = '#/import';
        return;
      }
      /* A different import resets the tab, the search and the sort; returning
         to the one you left keeps them, which is what the back link needs. */
      if (state.detail.id !== route.id) {
        state.detail = { id: route.id, tab: 'all', search: '', sort: { column: null, direction: 'asc' }, page: 1 };
      }
      renderDetail(imp);
      show('im-detail');
      window.scrollTo(0, 0);
      return;
    }

    if (route.name === 'policy') {
      placeholder('Policy ' + route.ref,
        'The policy record is outside this prototype. Use the back link, or the Import tab, to return.');
      return;
    }

    if (route.name === 'placeholder') {
      placeholder(route.title, 'This BACS tab is outside the Import prototype.');
      return;
    }

    show('im-list');
    renderList();
  }


  /* ==================================================================== Wiring */

  function setDropdown(menuId, value, label) {
    var menu = $(menuId).closest('.dropdown');
    menu.querySelector('.dropdown-label').textContent = label;
    Array.prototype.forEach.call(menu.querySelectorAll('.dropdown-item'), function (item) {
      var on = item.dataset.value === value;
      item.classList.toggle('active', on);
      item.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function wireFilter(toggleId, key) {
    var dropdown = $(toggleId).closest('.dropdown');
    dropdown.addEventListener('click', function (e) {
      var item = e.target.closest('.dropdown-item');
      if (!item) return;
      state.list[key] = item.dataset.value;
      /* Section 5: "changing one resets to page 1". */
      state.list.page = 1;
      setDropdown(toggleId, item.dataset.value, item.textContent.trim());
      renderList();
    });
  }

  /* `dd/mm/yyyy-dd/mm/yyyy`, both dates inclusive. */
  function parseRange(text) {
    var m = String(text).trim().match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    return {
      from: m[3] + '-' + m[2] + '-' + m[1],
      to: m[6] + '-' + m[5] + '-' + m[4]
    };
  }

  function applyRange(range) {
    state.list.from = range ? range.from : null;
    state.list.to = range ? range.to : null;
    state.list.page = 1;
    renderList();
  }

  function wire() {
    importModal = new bootstrap.Modal($('im-import-modal'));

    /* ---------------------------------------------------------- Filters */
    wireFilter('im-filter-result', 'result');
    wireFilter('im-filter-type', 'type');

    $('im-date-range').addEventListener('input', function () {
      var text = this.value.trim();
      if (text === '') return applyRange(null);
      var range = parseRange(text);
      if (range) applyRange(range);
    });

    $('im-date-toggle').addEventListener('click', function () {
      var open = $('im-date-picker').hidden;
      $('im-date-picker').hidden = !open;
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) $('im-date-from').focus();
    });

    $('im-date-apply').addEventListener('click', function () {
      var from = $('im-date-from').value;
      var to = $('im-date-to').value;
      if (from && to) {
        $('im-date-range').value =
          formatDate(from + 'T00:00') + '-' + formatDate(to + 'T00:00');
        applyRange({ from: from, to: to });
      }
      $('im-date-picker').hidden = true;
      $('im-date-toggle').setAttribute('aria-expanded', 'false');
      $('im-date-toggle').focus();
    });

    $('im-date-clear').addEventListener('click', function () {
      $('im-date-from').value = '';
      $('im-date-to').value = '';
      $('im-date-range').value = '';
      applyRange(null);
      $('im-date-picker').hidden = true;
      $('im-date-toggle').setAttribute('aria-expanded', 'false');
      $('im-date-toggle').focus();
    });

    document.addEventListener('click', function (e) {
      if ($('im-date-picker').hidden) return;
      if (e.target.closest('.im-filter-date')) return;
      $('im-date-picker').hidden = true;
      $('im-date-toggle').setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || $('im-date-picker').hidden) return;
      $('im-date-picker').hidden = true;
      $('im-date-toggle').setAttribute('aria-expanded', 'false');
      $('im-date-toggle').focus();
    });

    /* ------------------------------------------------------- List table */
    $('im-table-region').addEventListener('click', function (e) {
      var sortButton = e.target.closest('.table-sort');
      if (sortButton) {
        toggleSort(state.list.sort, sortButton.dataset.sort);
        state.list.page = 1;
        renderList();
        return;
      }

      var page = e.target.closest('.im-page');
      if (page) {
        state.list.page = parseInt(page.dataset.page, 10);
        renderList();
        return;
      }

      /* Section 5: the whole row opens the detail page; the chevron is the
         focusable control that does the same thing. */
      var open = e.target.closest('[data-open]');
      var row = e.target.closest('tr.im-row-openable');
      var id = open ? open.dataset.open : (row ? row.dataset.import : null);
      if (id) location.hash = '#/import/' + id;
    });

    $('im-table-region').addEventListener('change', function (e) {
      if (e.target.id !== 'im-per-page') return;
      state.list.perPage = parseInt(e.target.value, 10);
      state.list.page = 1;
      renderList();
    });

    /* ------------------------------------------------------ Detail pages */
    $('im-detail').addEventListener('click', function (e) {
      var imp = importById(state.detail.id);
      if (!imp) return;

      if (e.target.closest('#im-download')) { downloadReport(imp); return; }

      if (e.target.closest('#im-view-reason-codes')) {
        ReasonCodesBlade.open(e.target.closest('#im-view-reason-codes'), imp.fileType);
        return;
      }

      var sortButton = e.target.closest('.table-sort');
      if (sortButton) {
        toggleSort(state.detail.sort, sortButton.dataset.sort);
        state.detail.page = 1;
        renderDetail(imp);
        return;
      }

      var page = e.target.closest('.im-page');
      if (page) {
        state.detail.page = parseInt(page.dataset.page, 10);
        renderDetail(imp);
      }
    });

    /* Bootstrap's pill behaviour switches the pane; this only records which
       tab is active so a re-render keeps it. */
    $('im-detail').addEventListener('shown.bs.tab', function (e) {
      if (e.target.dataset.tab) state.detail.tab = e.target.dataset.tab;
    });

    $('im-detail').addEventListener('input', function (e) {
      if (e.target.id !== 'im-record-search') return;
      state.detail.search = e.target.value;
      state.detail.page = 1;
      var imp = importById(state.detail.id);
      renderDetail(imp);
      /* Re-rendering replaces the field, so put the caret back. */
      var field = $('im-record-search');
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    });

    /* ------------------------------------------------------ Import modal */
    $('im-new-import').addEventListener('click', function (e) {
      if (this.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      openImportModal(this);
    });

    $('im-file-type').addEventListener('change', function () {
      state.upload.fileType = this.value;
      /* Section 7: "Changing the file type after attaching a file keeps the
         file, but re-validates it against the new type." */
      validateFile();
      refreshModal();
    });

    $('im-dropzone').addEventListener('click', function () { $('im-file-input').click(); });

    $('im-file-input').addEventListener('change', function () {
      if (this.files && this.files[0]) attachFile(this.files[0].name);
    });

    ['dragenter', 'dragover'].forEach(function (type) {
      $('im-dropzone').addEventListener(type, function (e) {
        e.preventDefault();
        this.classList.add('im-dropzone-over');
      });
    });

    ['dragleave', 'drop'].forEach(function (type) {
      $('im-dropzone').addEventListener(type, function (e) {
        e.preventDefault();
        this.classList.remove('im-dropzone-over');
      });
    });

    $('im-dropzone').addEventListener('drop', function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) attachFile(files[0].name);
    });

    /* Section 7: "Selecting the bin removes the file and brings back the drop
       zone." Section 8: that also clears the error. */
    $('im-file-remove').addEventListener('click', function () {
      state.upload.filename = '';
      state.upload.invalid = false;
      $('im-file-input').value = '';
      refreshModal();
      $('im-dropzone').focus();
    });

    $('im-import-submit').addEventListener('click', submitImport);

    /* Section 7: closing before Import discards the choices. */
    $('im-import-modal').addEventListener('hidden.bs.modal', function () {
      if (modalTrigger && document.contains(modalTrigger)) modalTrigger.focus();
      modalTrigger = null;
      if (state.upload.busy) return;
      state.upload = { fileType: '', filename: '', invalid: false, busy: false };
      $('im-file-type').value = '';
      $('im-file-input').value = '';
      refreshModal();
    });

    window.addEventListener('hashchange', render);
  }


  /* The BACS tabs and the permission state must exist before the first
     render; `dropdown.js` binds to the filter dropdowns on DOMContentLoaded,
     and those are in the page source, so nothing has to wait for them. */
  Shell.mountChrome({ sidebar: 'bacs' });
  $('im-bacs-tabs').innerHTML = Shell.bacsTabs('import', BACS_TAB_PATHS);

  document.addEventListener('DOMContentLoaded', function () {
    Shell.startClock();
    applyPermission();
    wire();
    render();
  });
}());
