/* Audit Centre: User Management — the base page.              NOT BUCKHOLT.

   AU-00 to AU-04 from `ch-audit-um-spec.md`: two views (Mobius users,
   Configuration Hub users) behind a content switcher, each with its own
   search, filters, sort, page and record type for as long as the page is
   open; the audit table with pagination; and the Audit details drawer for
   Configuration Hub users rows. State is held in memory: a reload, or an
   environment change (the shell loads the base page again), starts over. */
(function () {
  'use strict';

  var D = window.AUData;
  var esc = CHShell.esc;

  var VIEWS = {
    mobius: { hash: 'mobius-users', name: 'Mobius users' },
    ch: { hash: 'configuration-hub-users', name: 'Configuration Hub users' }
  };

  var TOOLTIP_OPTIONS = { offset: [0, 4], delay: { show: 800, hide: 100 } };
  var EMPTY_TEXT = 'No changes in this period.';
  var NO_RESULTS_TEXT = 'No results found. Try changing your search or filters.';
  var SEARCH_DELAY = 300;

  /* ------------------------------------------------------------ shell */
  var ROOT = new URL('./', document.currentScript.src);
  var HOME_URL = new URL('home.html', ROOT).href;
  var BASE_URL = new URL('index.html', ROOT).href;

  if (!CHShell.init({
    app: 'audit-centre',
    page: 'User Management',
    breadcrumb: [{ label: 'Audit Centre', href: BASE_URL }, { label: 'User Management' }]
  })) return;

  /* The shell's lockup goes to CH-SHELL's own home, whose registry has no
     Audit Centre card. This prototype's home applies the registry override. */
  var lockup = document.querySelector('#ch-header .ch-lockup');
  if (lockup) lockup.href = HOME_URL;

  /* ------------------------------------------------------------ data */
  var all = D.records(CHShell.environment);

  function freshState() {
    return {
      query: '',
      date: '30',
      actions: [],
      by: [],
      account: 'All',
      record: 'grouped',
      sortKey: 'when',
      sortDir: 'desc',
      page: 1,
      perPage: 10
    };
  }
  var states = { mobius: freshState(), ch: freshState() };
  var view = 'mobius';
  function S() { return states[view]; }

  /* ------------------------------------------------------------ formatting */
  function pad(n) { return String(n).padStart(2, '0'); }
  function formatDate(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function formatDateTime(d) { return formatDate(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  function initials(name) {
    var parts = name.split(' ');
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /* Affected user as shown: name; an invitee by email; a grouped bulk
     deletion as "{n} users". */
  function affectedLabel(r) {
    var a = r.affected;
    if (a.count) return a.count + ' users';
    return a.name || a.email;
  }

  /* ------------------------------------------------------------ rows
     Individual view splits a multi-change save (record 6) into one row per
     change, and a bulk deletion (record 9) into one row per account. Every
     other record is unchanged. */
  function individual(r) {
    if (r.details && r.details.split) {
      return r.details.split.map(function (part, i) {
        return Object.assign({}, r, {
          key: r.id + '-' + i,
          id: D.eventId(r.group + '-' + i),
          action: part.action,
          summary: part.summary,
          details: { changes: part.changes }
        });
      });
    }
    if (r.details && r.details.deleted && r.details.deleted.length > 1) {
      return r.details.deleted.map(function (acc, i) {
        return Object.assign({}, r, {
          key: r.id + '-' + i,
          id: D.eventId(r.group + '-' + i),
          summary: 'User deleted',
          affected: { name: acc.name, email: acc.email, username: acc.username, invitee: acc.invitee },
          details: { deleted: [acc] }
        });
      });
    }
    return [r];
  }

  function rowsFor(v, recordType) {
    var list = all.filter(function (r) { return r.view === v; });
    var out = [];
    list.forEach(function (r) {
      if (recordType === 'individual') out = out.concat(individual(r));
      else out.push(Object.assign({ key: r.id }, r));
    });
    return out;
  }

  /* "Last n days": today and the n − 1 days before it. */
  function cutoff(days) {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1));
    return d;
  }

  function searchText(r) {
    var a = r.affected;
    var parts = [r.by.name, r.summary];
    (a.accounts || [a]).forEach(function (p) { parts.push(p.name, p.email, p.username); });
    return parts.filter(Boolean).join('\n').toLowerCase();
  }

  function hasFilters(s) {
    return !!(s.query.trim() || s.actions.length || s.by.length || s.account !== 'All');
  }

  function sortValue(r, key) {
    switch (key) {
      case 'action': return r.action.toLowerCase();
      case 'affected': return affectedLabel(r).toLowerCase();
      case 'summary': return r.summary.toLowerCase();
      case 'account': return (r.accountType || '').toLowerCase();
      case 'by': return r.by.name.toLowerCase();
      default: return r.when.getTime();
    }
  }

  function visible(v) {
    var s = states[v];
    var preset = D.datePresets.filter(function (p) { return p.value === s.date; })[0];
    var from = cutoff(preset.days).getTime();
    var q = s.query.trim().toLowerCase();
    var list = rowsFor(v, s.record).filter(function (r) {
      if (r.when.getTime() < from) return false;
      if (q && searchText(r).indexOf(q) === -1) return false;
      if (s.actions.length && s.actions.indexOf(r.action) === -1) return false;
      if (s.by.length && s.by.indexOf(r.by.name) === -1) return false;
      if (v === 'mobius' && s.account !== 'All' && r.accountType !== s.account) return false;
      return true;
    });
    var dir = s.sortDir === 'asc' ? 1 : -1;
    return list.sort(function (x, y) {
      var a = sortValue(x, s.sortKey);
      var b = sortValue(y, s.sortKey);
      if (a < b) return -dir;
      if (a > b) return dir;
      /* Ties: newest first. */
      return y.when - x.when;
    });
  }

  /* ------------------------------------------------------------ columns */
  function columns(v) {
    var cols = [
      { key: 'action', label: 'Action' },
      { key: 'affected', label: 'Affected user' },
      { key: 'summary', label: 'Change summary' }
    ];
    if (v === 'mobius') cols.push({ key: 'account', label: 'Account type' });
    cols.push({ key: 'by', label: 'Changed by' }, { key: 'when', label: 'Date and time' });
    return cols;
  }

  function renderHead() {
    var s = S();
    var html = '<tr>' + columns(view).map(function (c) {
      var current = c.key === s.sortKey;
      var icon = current ? (s.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort';
      return '<th scope="col" class="table-sort-header au-col-' + c.key + '" data-sort-key="' + c.key + '"' +
          (current ? ' aria-sort="' + (s.sortDir === 'asc' ? 'ascending' : 'descending') + '"' : '') + '>' +
          '<button class="table-sort" type="button" data-sort-type="' + (c.key === 'when' ? 'date' : 'text') + '" aria-label="Sort by ' + c.label + '">' +
            '<div class="table-header-label">' + c.label + '</div>' +
            '<div class="table-sort-icon"><i class="fa-solid ' + icon + '" aria-hidden="true"></i></div>' +
          '</button>' +
        '</th>';
    }).join('') +
      '<th scope="col" class="col-fit cell-data-right"><div class="table-header-label"><span class="visually-hidden">Details</span></div></th>' +
      '</tr>';
    document.getElementById('au-head').innerHTML = html;
  }

  /* ------------------------------------------------------------ avatars
     Buckholt Avatar, extra small, for named people (initials) and for the
     icon forms Buckholt documents: a generic person (invitees, a grouped
     bulk deletion) and System. The Open GI avatar is Gap 5: the Open GI
     mark in a ring, with the Tooltip and accessible text "Open GI user". */
  function initialsAvatar(name) {
    return '<div class="avatar avatar-xs" aria-hidden="true"><div class="avatar-initials">' + esc(initials(name)) + '</div></div>';
  }
  function iconAvatar(icon) {
    return '<div class="avatar avatar-xs" aria-hidden="true"><div class="avatar-icon"><i class="fa-regular ' + icon + '"></i></div></div>';
  }
  function ogiAvatar() {
    return '<span class="au-ogi-trigger" tabindex="0" data-au-tooltip="Open GI user">' +
        '<div class="avatar avatar-xs au-avatar-ogi">' +
          '<img class="avatar-img" src="assets/open-gi-mark.svg" alt="Open GI user">' +
        '</div>' +
      '</span>';
  }

  function truncating(text) {
    return '<span class="au-trunc">' + esc(text) + '</span>';
  }

  function affectedCell(r) {
    var a = r.affected;
    var avatar = (a.count || a.invitee || !a.name) ? iconAvatar('fa-user') : initialsAvatar(a.name);
    return '<td class="au-col-affected"><div class="au-person">' + avatar + truncating(affectedLabel(r)) + '</div></td>';
  }

  function byCell(r) {
    var avatar = r.by.type === 'ogi' ? ogiAvatar()
      : r.by.type === 'system' ? iconAvatar('fa-user-robot')
      : initialsAvatar(r.by.name);
    return '<td class="au-col-by"><div class="au-person">' + avatar + truncating(r.by.name) + '</div></td>';
  }

  function chevronLabel(r) {
    return 'View details for ' + r.action + ', ' + affectedLabel(r);
  }

  function rowMarkup(r) {
    return '<tr data-key="' + esc(r.key) + '"' + (r.key === openKey ? ' class="au-selected"' : '') + '>' +
      '<td class="au-col-action">' + truncating(r.action) + '</td>' +
      affectedCell(r) +
      '<td class="au-col-summary">' + truncating(r.summary) + '</td>' +
      (view === 'mobius' ? '<td class="au-col-account">' + esc(r.accountType) + '</td>' : '') +
      byCell(r) +
      '<td class="au-col-when">' + formatDateTime(r.when) + '</td>' +
      '<td class="col-fit cell-data-right">' +
        '<div class="button-set">' +
          '<button type="button" class="btn btn-ghost au-chevron" data-key="' + esc(r.key) + '" ' +
              'aria-label="' + esc(chevronLabel(r)) + '" data-au-tooltip="View details">' +
            '<div class="btn-icon"><i class="fa-regular fa-chevron-right" aria-hidden="true"></i></div>' +
          '</button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }

  /* Gap 6: empty and no-results states replace the rows; the pagination
     row is hidden and the filters stay usable. */
  function stateRow(text, kind) {
    return '<tr class="au-state-row"><td colspan="' + (columns(view).length + 1) + '">' +
        '<div class="text-block au-state" id="au-state" data-state="' + kind + '"><p>' + text + '</p></div>' +
      '</td></tr>';
  }

  /* ------------------------------------------------------------ pagination (Gap 4) */
  function pageCount(total) { return Math.max(1, Math.ceil(total / S().perPage)); }

  function pageButton(target, labelText, content, disabled, current) {
    return '<li><button type="button" class="btn btn-sm ' + (current ? 'btn-secondary' : 'btn-ghost') + '" ' +
      'data-page="' + target + '" aria-label="' + labelText + '"' +
      (current ? ' aria-current="page"' : '') + (disabled ? ' disabled' : '') + '>' + content + '</button></li>';
  }
  function iconContent(icon) {
    return '<div class="btn-icon"><i class="fa-regular ' + icon + '" aria-hidden="true"></i></div>';
  }

  function renderPagination(total) {
    var s = S();
    var pages = pageCount(total);
    var p = s.page;
    var html = pageButton('first', 'First page', iconContent('fa-chevrons-left'), p === 1) +
      pageButton('prev', 'Previous page', iconContent('fa-chevron-left'), p === 1);
    for (var i = 1; i <= pages; i++) {
      html += pageButton(i, 'Page ' + i, '<span class="button-label">' + i + '</span>', pages === 1, i === p);
    }
    html += pageButton('next', 'Next page', iconContent('fa-chevron-right'), p === pages) +
      pageButton('last', 'Last page', iconContent('fa-chevrons-right'), p === pages);
    document.getElementById('au-pages').innerHTML = html;
    var first = (p - 1) * s.perPage + 1;
    var last = Math.min(p * s.perPage, total);
    document.getElementById('au-showing').textContent = 'Showing ' + first + '-' + last + ' of ' + total;
    document.getElementById('au-per-page').value = String(s.perPage);
  }

  /* ------------------------------------------------------------ render */
  var rowsEl = document.getElementById('au-rows');
  var current = [];

  function render() {
    var s = S();
    disposeTooltips(rowsEl);
    var list = visible(view);
    var pages = pageCount(list.length);
    if (s.page > pages) s.page = pages;
    var start = (s.page - 1) * s.perPage;
    current = list.slice(start, start + s.perPage);

    renderHead();
    document.getElementById('au-table').setAttribute('aria-label', VIEWS[view].name + ' audit records');

    var gap = '<tr class="table-gap"><td colspan="100%"></td></tr>';
    var body;
    if (list.length) body = current.map(rowMarkup).join('');
    else body = stateRow(hasFilters(s) ? NO_RESULTS_TEXT : EMPTY_TEXT, hasFilters(s) ? 'no-results' : 'empty');
    rowsEl.innerHTML = gap + body;
    rowsEl.classList.toggle('au-rows-inert', view === 'mobius');

    var pag = document.getElementById('au-pagination');
    pag.hidden = !list.length;
    if (list.length) renderPagination(list.length);

    initTooltips(rowsEl);
    syncTruncation();
    return list;
  }

  /* ------------------------------------------------------------ tooltips */
  function initTooltips(root) {
    if (!window.bootstrap) return;
    root.querySelectorAll('[data-au-tooltip]').forEach(function (el) {
      var existing = bootstrap.Tooltip.getInstance(el);
      if (existing) existing.dispose();
      new bootstrap.Tooltip(el, Object.assign({
        title: el.getAttribute('data-au-tooltip'),
        placement: 'top',
        trigger: el.hasAttribute('data-au-hover-only') ? 'hover' : 'hover focus'
      }, TOOLTIP_OPTIONS));
    });
  }
  function disposeTooltips(root) {
    if (!window.bootstrap) return;
    root.querySelectorAll('[data-au-tooltip]').forEach(function (el) {
      var t = bootstrap.Tooltip.getInstance(el);
      if (t) t.dispose();
    });
    document.querySelectorAll('body > .tooltip').forEach(function (t) { t.remove(); });
  }
  function hideTooltips() {
    if (!window.bootstrap) return;
    document.querySelectorAll('[data-au-tooltip]').forEach(function (el) {
      var t = bootstrap.Tooltip.getInstance(el);
      if (t) t.hide();
    });
  }

  /* Truncated cell text gets its full text in a hover Tooltip. It is not
     made focusable (CH-SHELL revision 4's rule for truncated plain text);
     the full text is always in the DOM, so it is what assistive technology
     reads. */
  function syncTruncation() {
    rowsEl.querySelectorAll('.au-trunc').forEach(function (el) {
      var cut = el.scrollWidth > el.clientWidth + 1;
      var had = el.hasAttribute('data-au-tooltip');
      if (cut && !had) {
        el.setAttribute('data-au-tooltip', el.textContent);
        el.setAttribute('data-au-hover-only', '');
        initTooltips(el.parentNode);
      } else if (!cut && had) {
        var t = window.bootstrap && bootstrap.Tooltip.getInstance(el);
        if (t) t.dispose();
        el.removeAttribute('data-au-tooltip');
        el.removeAttribute('data-au-hover-only');
      }
    });
  }

  /* ------------------------------------------------------------ announcements */
  var announceTimer = null;
  function announceResults() {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      var n = visible(view).length;
      CHShell.announce(n + (n === 1 ? ' result' : ' results'));
    }, 400);
  }

  /* ------------------------------------------------------------ filter controls */
  var search = document.getElementById('au-search');
  var dateSel = document.getElementById('au-date');
  var accountSel = document.getElementById('au-account');

  dateSel.innerHTML = D.datePresets.map(function (p) {
    return '<option value="' + p.value + '">' + p.label + '</option>';
  }).join('');
  accountSel.innerHTML = D.accountTypes.map(function (a) {
    return '<option value="' + esc(a) + '">' + esc(a) + '</option>';
  }).join('');

  /* Gap 3: multi-select checklist. Buckholt Dropdown's Multiselect items
     (native Checkbox inside each `.dropdown-item`), without Buckholt's
     dropdown.js: that script turns selections into Tags and reorders the
     list on open, where the spec wants a summary in the trigger and a fixed
     order with an "Open GI" group. */
  function checkItem(prefix, i, value) {
    var id = prefix + '-opt-' + i;
    return '<li class="dropdown-item">' +
        '<input class="form-check-input" type="checkbox" id="' + id + '" value="' + esc(value) + '">' +
        '<label class="form-check-label" for="' + id + '">' + esc(value) + '</label>' +
      '</li>';
  }

  function buildActionMenu() {
    document.getElementById('au-action-menu').innerHTML = D.actionOptions(view).map(function (a, i) {
      return checkItem('au-action', i, a);
    }).join('');
  }

  function buildByMenu() {
    var o = D.changedByOptions(view);
    var i = 0;
    var html = o.clients.map(function (name) { return checkItem('au-by', i++, name); }).join('');
    if (o.ogi.length) {
      html += '<li class="au-option-group">' +
          '<h6 class="menu-section-header" id="au-by-ogi-heading">Open GI</h6>' +
          '<ul class="au-option-list" role="group" aria-labelledby="au-by-ogi-heading">' +
            o.ogi.map(function (name) { return checkItem('au-by', i++, name); }).join('') +
          '</ul>' +
        '</li>';
    }
    if (o.system) html += checkItem('au-by', i++, 'System');
    document.getElementById('au-by-menu').innerHTML = html;
  }

  function multiSummary(values, empty) {
    if (!values.length) return empty;
    if (values.length === 1) return values[0];
    return values.length + ' selected';
  }

  function syncMulti(menuId, valueId, values, empty) {
    document.querySelectorAll('#' + menuId + ' input[type=checkbox]').forEach(function (box) {
      box.checked = values.indexOf(box.value) !== -1;
      box.closest('.dropdown-item').classList.toggle('active', box.checked);
    });
    document.getElementById(valueId).textContent = multiSummary(values, empty);
  }

  function syncControls() {
    var s = S();
    search.value = s.query;
    dateSel.value = s.date;
    accountSel.value = s.account;
    document.getElementById('au-account-filter').hidden = view !== 'mobius';
    buildActionMenu();
    buildByMenu();
    syncMulti('au-action-menu', 'au-action-value', s.actions, 'Select');
    syncMulti('au-by-menu', 'au-by-value', s.by, 'Anyone');
    syncRecordType();
  }

  function syncRecordType() {
    var s = S();
    document.getElementById('au-record-label').textContent = 'Record type: ' + (s.record === 'grouped' ? 'Grouped' : 'Individual');
    document.querySelectorAll('#au-record-panel .menu-item').forEach(function (item) {
      var on = item.getAttribute('data-record') === s.record;
      if (on) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    });
  }

  function changed() {
    S().page = 1;
    hideTooltips();
    render();
    announceResults();
  }

  var searchTimer = null;
  search.addEventListener('input', function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () {
      S().query = search.value;
      changed();
    }, SEARCH_DELAY);
  });
  dateSel.addEventListener('change', function () { S().date = dateSel.value; changed(); });
  accountSel.addEventListener('change', function () { S().account = accountSel.value; changed(); });

  function wireMulti(menuId, valueId, key, empty) {
    document.getElementById(menuId).addEventListener('change', function (event) {
      var box = event.target;
      if (!box.matches('input[type=checkbox]')) return;
      var list = S()[key];
      var at = list.indexOf(box.value);
      if (box.checked && at === -1) list.push(box.value);
      if (!box.checked && at !== -1) list.splice(at, 1);
      /* Keep the options' own order, so "{n} selected" and the single-option
         label never depend on the order of ticking. */
      var order = Array.prototype.map.call(document.querySelectorAll('#' + menuId + ' input[type=checkbox]'), function (b) { return b.value; });
      list.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      syncMulti(menuId, valueId, list, empty);
      changed();
    });
  }
  wireMulti('au-action-menu', 'au-action-value', 'actions', 'Select');
  wireMulti('au-by-menu', 'au-by-value', 'by', 'Anyone');

  /* Bootstrap 5.1.3 closes a dropdown on Escape but leaves focus where it
     was, inside the now-hidden list, so it falls to the page. Return it to
     the trigger, as the Dropdown and Menu button behaviour expects. */
  ['au-action-toggle', 'au-by-toggle', 'au-record-toggle'].forEach(function (id) {
    var toggle = document.getElementById(id);
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    toggle.addEventListener('hide.bs.dropdown', function () {
      if (panel.contains(document.activeElement)) toggle.focus();
    });
  });

  /* Record type (AU-03). Sort, filters and search stay; the page returns to 1. */
  document.getElementById('au-record-panel').addEventListener('click', function (event) {
    var item = event.target.closest('[data-record]');
    if (!item) return;
    var next = item.getAttribute('data-record');
    var toggle = document.getElementById('au-record-toggle');
    bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
    toggle.focus();
    if (S().record === next) return;
    S().record = next;
    syncRecordType();
    changed();
  });

  /* ------------------------------------------------------------ sort, pages */
  document.getElementById('au-head').addEventListener('click', function (event) {
    var button = event.target.closest('.table-sort');
    if (!button) return;
    var s = S();
    var key = button.closest('th').getAttribute('data-sort-key');
    if (s.sortKey === key) s.sortDir = s.sortDir === 'asc' ? 'desc' : 'asc';
    else { s.sortKey = key; s.sortDir = 'asc'; }
    hideTooltips();
    render();
    var again = document.querySelector('#au-head th[data-sort-key="' + key + '"] .table-sort');
    if (again) again.focus();
    var label = columns(view).filter(function (c) { return c.key === key; })[0].label;
    CHShell.announce('Sorted by ' + label + ', ' + (s.sortDir === 'asc' ? 'ascending' : 'descending') + '.');
  });

  document.getElementById('au-pages').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    var s = S();
    var pages = pageCount(visible(view).length);
    var target = button.getAttribute('data-page');
    var page = { first: 1, prev: s.page - 1, next: s.page + 1, last: pages }[target] || Number(target);
    page = Math.min(Math.max(page, 1), pages);
    if (page === s.page) return;
    s.page = page;
    hideTooltips();
    render();
    var cur = document.querySelector('#au-pages button[aria-current="page"]');
    if (cur) cur.focus();
  });

  document.getElementById('au-per-page').addEventListener('change', function (event) {
    S().perPage = Number(event.target.value);
    changed();
  });

  /* ------------------------------------------------------------ views (AU-01) */
  function setView(next, opts) {
    opts = opts || {};
    if (!VIEWS[next]) next = 'mobius';
    var same = next === view;
    view = next;
    document.getElementById(next === 'ch' ? 'au-view-ch' : 'au-view-mobius').checked = true;
    var hash = '#' + VIEWS[next].hash;
    if (window.location.hash !== hash && !opts.keepUrl) {
      history.replaceState(null, '', window.location.pathname + window.location.search + hash);
    }
    if (same && !opts.force) return;
    hideTooltips();
    syncControls();
    render();
    if (opts.announce) announceResults();
  }

  document.querySelector('.au-switcher').addEventListener('change', function (event) {
    if (event.target.name === 'au-user-type') setView(event.target.value, { announce: true });
  });

  function viewFromHash() {
    var h = window.location.hash.replace('#', '');
    return h === VIEWS.ch.hash ? 'ch' : 'mobius';
  }
  window.addEventListener('hashchange', function () { setView(viewFromHash(), { announce: true }); });

  /* ------------------------------------------------------------ Audit details (AU-04, Gap 2) */
  var openKey = null;
  var drawer = null;

  function kv(key, valueHtml) {
    return '<div class="key-value"><span class="key">' + key + '</span><span class="value">' + valueHtml + '</span></div>';
  }
  function kvList(pairs) {
    return '<div class="key-value-list key-value-list-stacked">' + pairs + '</div>';
  }
  function section(title, content) {
    return '<section class="au-drawer-section" aria-labelledby="' + sectionId(title) + '">' +
        '<div class="text-block"><h4 class="title-02" id="' + sectionId(title) + '">' + title + '</h4></div>' +
        content +
      '</section>';
  }
  function sectionId(title) { return 'au-section-' + title.toLowerCase().replace(/[^a-z]+/g, '-'); }

  function changeTable(changes) {
    return '<div class="table-container"><div class="table-content">' +
        '<table class="table no-italics au-change-table">' +
          '<thead><tr>' +
            '<th scope="col"><div class="table-header-label">Setting</div></th>' +
            '<th scope="col"><div class="table-header-label">Previous value</div></th>' +
            '<th scope="col"><div class="table-header-label">New value</div></th>' +
          '</tr></thead>' +
          '<tbody><tr class="table-gap"><td colspan="100%"></td></tr>' +
            changes.map(function (c) {
              return '<tr><td>' + esc(c.setting) + '</td><td>' + esc(c.from) + '</td><td>' + esc(c.to) + '</td></tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div></div>';
  }

  /* Non-interactive Buckholt Card per account. Empty fields are omitted. */
  function accountCard(acc) {
    var title = acc.name || acc.email;
    var avatar = acc.name ? initialsAvatar(acc.name) : iconAvatar('fa-user');
    var pairs = [['Username', acc.username], ['Email', acc.email], ['Role', acc.role], ['Status', acc.status]]
      .filter(function (p) { return p[1]; })
      .map(function (p) { return kv(p[0], esc(p[1])); }).join('');
    return '<div class="card au-account-card">' +
        '<div class="card-body">' +
          '<div class="au-card-head">' + avatar +
            '<div class="text-block"><h5 class="title-03">' + esc(title) + '</h5></div>' +
          '</div>' +
          kvList(pairs) +
        '</div>' +
      '</div>';
  }

  function drawerBody(r) {
    var d = r.details || {};
    var byValue = esc(r.by.name) + (r.by.type === 'ogi'
      ? ' <span class="tag tag-sm au-ogi-tag"><span class="tag-label">Open GI</span></span>'
      : '');
    var html = '<div class="text-block"><h3 class="headline-03 au-detail-title" id="au-detail-title" tabindex="-1">' + esc(r.action) + '</h3></div>';
    html += section('Event information', kvList(
      kv('User', esc(affectedLabel(r))) +
      kv('Changed by', byValue) +
      kv('Date and time', formatDateTime(r.when)) +
      kv('Event ID', esc(r.id))
    ));
    if (d.invitation) {
      html += section('Invitation details', kvList(
        kv('Email', esc(d.invitation.email)) +
        kv('Role', esc(d.invitation.role)) +
        kv('Link expires', formatDate(d.invitation.expires))
      ));
    }
    if (d.invitationDeleted) html += section('Deleted invitation', accountCard(d.invitationDeleted));
    if (d.user) {
      html += section('User details', kvList(d.user.map(function (p) { return kv(p[0], esc(p[1])); }).join('')));
    }
    if (d.changes) html += section('Change details', changeTable(d.changes));
    if (d.deleted) {
      html += section('Deleted account details', '<div class="au-cards">' + d.deleted.map(accountCard).join('') + '</div>');
    }
    return html;
  }

  function openDrawer(key) {
    if (view !== 'ch') return;  /* Mobius users rows: out of scope, inert. */
    var r = current.filter(function (x) { return x.key === key; })[0];
    if (!r) return;
    var trigger = rowsEl.querySelector('.au-chevron[data-key="' + key + '"]');
    hideTooltips();

    openKey = key;
    rowsEl.querySelectorAll('tr[data-key]').forEach(function (tr) {
      tr.classList.toggle('au-selected', tr.getAttribute('data-key') === key);
    });

    var b = new Blade({
      id: 'au-drawer',
      title: 'Audit details',
      body: drawerBody(r),
      footer: '<div class="button-set au-drawer-actions">' +
          '<button type="button" class="btn btn-primary" id="au-drawer-close"><span class="button-label">Close</span></button>' +
        '</div>',
      initialFocus: '#au-detail-title',
      onClose: function () {
        openKey = null;
        rowsEl.querySelectorAll('tr.au-selected').forEach(function (tr) { tr.classList.remove('au-selected'); });
        b.offcanvas.dispose();
        b.el.remove();
        drawer = null;
      }
    });
    drawer = b;
    b.el.classList.add('au-drawer');
    /* A modal dialog named by its title (the Action); the close icon is
       named "Close". */
    b.el.setAttribute('aria-labelledby', 'au-detail-title');
    b.closeEl.setAttribute('aria-label', 'Close');
    b.el.querySelector('#au-drawer-close').addEventListener('click', function () { b.close(); });
    b.open(trigger);
  }

  rowsEl.addEventListener('click', function (event) {
    var chevron = event.target.closest('.au-chevron');
    if (chevron) { openDrawer(chevron.getAttribute('data-key')); return; }
    var tr = event.target.closest('tr[data-key]');
    if (!tr) return;
    /* A click on a control inside the row (the Open GI avatar) is its own. */
    var control = event.target.closest('a, button, [tabindex]');
    if (control && tr.contains(control)) return;
    openDrawer(tr.getAttribute('data-key'));
  });

  /* ------------------------------------------------------------ start */
  var resizeFrame = null;
  window.addEventListener('resize', function () {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(syncTruncation);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTruncation);

  setView(viewFromHash(), { force: true, keepUrl: window.location.hash === '' });

  /* For the test suite and for inspection. */
  window.AUPage = {
    get view() { return view; },
    state: function (v) { return states[v || view]; },
    visible: function (v) { return visible(v || view); },
    drawer: function () { return drawer; }
  };
})();
