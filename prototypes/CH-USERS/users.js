/* CU-00-02 · Configuration Hub users, and the flows that start from it:
   CU-01 Add, CU-02 / CU-03 Edit, CU-04 View, CU-05 Delete.  NOT BUCKHOLT.

   State is held in memory; a reload resets to the seed (spec, Prototype
   notes). Rendering uses Buckholt components only; the arrangement around
   them is the spec's "Buckholt gaps", styled in ch-users.css. */
(function () {
  'use strict';

  var D = window.CUData;
  var esc = CU.esc;

  var OWN_SELECT = "You can't select your own account.";
  var OWN_DELETE = "You can't delete your own account.";
  var OWN_ROLE = "You can't change your own role.";
  var LAST_ADMIN = 'There must be at least one active administrator.';
  var OWN_STATUS = "You can't deactivate your own account.";
  var OWN_MFA = "You can't reset your own MFA here.";
  var MFA_INACTIVE = 'Activate this user before resetting their MFA.';
  var NOT_SET = 'Not set yet';
  var NO_RESULTS_HEADING = 'No results found';
  var NO_RESULTS_TEXT = 'Try adjusting your search or filter criteria for a match.';

  /* ------------------------------------------------------------ shell */
  var blade = null;            /* the open blade context, if any */

  var ok = CU.init({
    app: 'user-management',
    page: 'Configuration Hub users',
    breadcrumb: [
      { label: 'User Management', href: 'index.html' },
      { label: 'Configuration Hub users' }
    ],
    /* Shell contract: an open Add or Edit blade with changed values counts
       as unsaved changes, so an environment switch asks first (SH-01). */
    hasUnsavedChanges: function () { return !!(blade && blade.isDirty && blade.isDirty()); }
  });
  if (!ok) return;

  /* ------------------------------------------------------------ data */
  /* Kept for the tab across page changes, so CU-00-01 counts what was
     done here; a reload goes back to the seed (ch-users.js). */
  var users = CU.loadUsers();
  var nextId = users.reduce(function (n, u) { return Math.max(n, Number(u.id.split('-')[1]) || 0); }, 0) + 1;

  var state = {
    query: '',
    role: 'all',
    status: 'all',
    sortKey: 'name',
    sortDir: 'asc',
    page: 1,
    perPage: 10,
    selected: []
  };

  function byId(id) {
    for (var i = 0; i < users.length; i++) if (users[i].id === id) return users[i];
    return null;
  }
  function isPending(a) { return a.status === 'Pending'; }
  function fullName(a) { return a.firstName ? a.firstName + ' ' + a.lastName : ''; }
  /* Pending users have no name, so their accessible names use the email. */
  function label(a) { return fullName(a) || a.email; }
  function initials(a) { return (a.firstName[0] + a.lastName[0]).toUpperCase(); }
  function roleInfo(name) {
    for (var i = 0; i < D.roles.length; i++) if (D.roles[i].name === name) return D.roles[i];
    return null;
  }

  function activeAdmins() {
    return users.filter(function (a) { return a.role === 'Administrator' && a.status === 'Active'; });
  }
  function isLastActiveAdmin(a) {
    var admins = activeAdmins();
    return admins.length === 1 && admins[0].id === a.id;
  }
  /* Disabled-action reasons (Gap 9). When both rules apply to the signed-in
     user, the last-Administrator reason wins: it is the one the user can
     change something about (spec AC "James Okonkwo's role is changed to
     Editor"), and it stays true for whoever holds the role. */
  function deleteBlock(a) {
    if (isLastActiveAdmin(a)) return LAST_ADMIN;
    if (a.self) return OWN_DELETE;
    return null;
  }
  function roleLock(a) {
    if (isLastActiveAdmin(a)) return LAST_ADMIN;
    if (a.self) return OWN_ROLE;
    return null;
  }
  /* Status: the last active Administrator can't be deactivated, and nor
     can the signed-in user. Deactivating an Administrator counts towards
     the last-Administrator rule because activeAdmins() reads saved status. */
  function statusLock(a) {
    if (isLastActiveAdmin(a)) return LAST_ADMIN;
    if (a.self) return OWN_STATUS;
    return null;
  }
  /* Reset MFA: not for the signed-in user, and not while the saved status
     is Inactive. */
  function mfaBlock(a) {
    if (a.self) return OWN_MFA;
    if (a.status === 'Inactive') return MFA_INACTIVE;
    return null;
  }
  function selectBlock(a) { return a.self ? OWN_SELECT : null; }

  /* ------------------------------------------------------------ list */
  function matches(a) {
    if (state.role !== 'all' && a.role !== state.role) return false;
    if (state.status !== 'all' && a.status !== state.status) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    return [a.firstName, a.lastName, fullName(a), a.username, a.email].some(function (v) {
      return v && v.toLowerCase().indexOf(q) !== -1;
    });
  }

  function sortValue(a, key) {
    switch (key) {
      case 'name': return fullName(a) || null;
      case 'username': return a.username || null;
      case 'email': return a.email;
      case 'role': return a.role;
      case 'status': return a.status;
    }
    return null;
  }

  /* One sort column at a time. Rows showing "Not set yet" always sort after
     rows with a value, in either direction. Ties fall back to email, so the
     order is stable. */
  function sorted(list) {
    var key = state.sortKey;
    var dir = state.sortDir === 'asc' ? 1 : -1;
    return list.slice().sort(function (x, y) {
      var a = sortValue(x, key), b = sortValue(y, key);
      if (a === null && b !== null) return 1;
      if (b === null && a !== null) return -1;
      var c = a === null ? 0 : a.localeCompare(b, 'en-GB', { sensitivity: 'base' }) * dir;
      return c || x.email.localeCompare(y.email);
    });
  }

  function visible() { return sorted(users.filter(matches)); }

  function pageCount(total) { return Math.max(1, Math.ceil(total / state.perPage)); }

  function filtersActive() {
    return state.query !== '' || state.role !== 'all' || state.status !== 'all';
  }

  /* ------------------------------------------------------------ rendering */
  var rowsEl = document.getElementById('cu-rows');

  function reasonId(a, what) { return 'cu-reason-' + what + '-' + a.id; }

  /* A disabled control keeps its Tooltip (Gap 9). Disabled controls take no
     pointer events, so the Tooltip sits on a wrapper that is never
     focusable; the reason is also the control's accessible description. */
  function disabledWrap(inner, reason, id) {
    return '<span class="cu-disabled" data-cu-tooltip="' + esc(reason) + '" data-cu-hover-only>' + inner + '</span>' +
           '<span class="visually-hidden" id="' + id + '">' + esc(reason) + '</span>';
  }

  function checkboxCell(a) {
    var reason = selectBlock(a);
    var checked = state.selected.indexOf(a.id) !== -1;
    var input = '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" id="cu-select-' + a.id + '" data-id="' + a.id + '" ' +
          'aria-label="Select ' + esc(label(a)) + '"' +
          (checked ? ' checked' : '') +
          (reason ? ' disabled aria-describedby="' + reasonId(a, 'select') + '"' : '') + '>' +
      '</div>';
    return '<td class="col-fit">' + (reason ? disabledWrap(input, reason, reasonId(a, 'select')) : input) + '</td>';
  }

  function truncating(text, extra) {
    return '<span class="cu-trunc' + (extra ? ' ' + extra : '') + '">' + esc(text) + '</span>';
  }

  function notSet() {
    /* Gap 6: Table's documented secondary-data treatment. */
    return '<span class="data-secondary cu-not-set">' + NOT_SET + '</span>';
  }

  function nameCell(a) {
    var avatar = isPending(a)
      ? '<div class="avatar avatar-xs" aria-hidden="true"><div class="avatar-icon"><i class="fa-regular fa-user"></i></div></div>'
      : '<div class="avatar avatar-xs" aria-hidden="true"><div class="avatar-initials">' + esc(initials(a)) + '</div></div>';
    return '<td class="cu-col-name"><div class="cu-name">' + avatar +
      (isPending(a) ? notSet() : truncating(fullName(a))) + '</div></td>';
  }

  function statusTag(status) {
    /* The same variants as the CU-00-01 card tags (spec, Buckholt mapping). */
    return '<span class="' + D.tagClass[status] + '"><span class="tag-label">' + status + '</span></span>';
  }

  function actionButton(a, action, icon, danger, reason) {
    var name = { view: 'View', edit: 'Edit', 'delete': 'Delete' }[action];
    var button = '<button type="button" class="btn btn-ghost' + (danger ? ' btn-danger' : '') + '" ' +
        'data-action="' + action + '" data-id="' + a.id + '" aria-label="' + name + ' ' + esc(label(a)) + '"' +
        (reason ? ' disabled aria-describedby="' + reasonId(a, action) + '"' : ' data-cu-tooltip="' + name + '"') + '>' +
        '<div class="btn-icon"><i class="fa-regular ' + icon + '" aria-hidden="true"></i></div>' +
      '</button>';
    return reason ? disabledWrap(button, reason, reasonId(a, action)) : button;
  }

  function rowMarkup(a) {
    return '<tr data-id="' + a.id + '"' + (state.selected.indexOf(a.id) !== -1 ? ' class="cu-selected"' : '') + '>' +
      checkboxCell(a) +
      nameCell(a) +
      '<td class="cu-col-username">' + (a.username ? truncating(a.username) : notSet()) + '</td>' +
      '<td class="cu-col-email">' + truncating(a.email) + '</td>' +
      '<td>' + esc(a.role) + '</td>' +
      '<td>' + statusTag(a.status) + '</td>' +
      '<td class="col-fit cell-data-right">' +
        '<div class="button-set">' +
          actionButton(a, 'view', 'fa-eye', false, null) +
          actionButton(a, 'edit', 'fa-pencil', false, null) +
          actionButton(a, 'delete', 'fa-trash-can', true, deleteBlock(a)) +
        '</div>' +
      '</td>' +
    '</tr>';
  }

  /* Gap 8: no results replaces the rows; chips and filter bar stay. */
  function noResultsMarkup() {
    return '<tr class="cu-no-results-row"><td colspan="7">' +
        '<div class="text-block cu-no-results" id="cu-no-results">' +
          '<h2 class="title-02">' + NO_RESULTS_HEADING + '</h2>' +
          '<p>' + NO_RESULTS_TEXT + '</p>' +
        '</div>' +
      '</td></tr>';
  }

  function showingText(first, last, total) {
    return 'Showing ' + first + '–' + last + ' of ' + total;
  }

  function pageButton(target, labelText, content, disabled, current) {
    return '<li><button type="button" class="btn btn-sm ' + (current ? 'btn-secondary' : 'btn-ghost') + '" ' +
      'data-page="' + target + '" aria-label="' + labelText + '"' +
      (current ? ' aria-current="page"' : '') + (disabled ? ' disabled' : '') + '>' + content + '</button></li>';
  }
  function iconContent(icon) {
    return '<div class="btn-icon"><i class="fa-regular ' + icon + '" aria-hidden="true"></i></div>';
  }

  /* Gap 2: first, previous, page numbers, next, last. */
  function renderPagination(pages) {
    var p = state.page;
    var html = pageButton('first', 'First page', iconContent('fa-chevrons-left'), p === 1) +
      pageButton('prev', 'Previous page', iconContent('fa-chevron-left'), p === 1);
    for (var i = 1; i <= pages; i++) {
      html += pageButton(i, 'Page ' + i, '<span class="button-label">' + i + '</span>', pages === 1, i === p);
    }
    html += pageButton('next', 'Next page', iconContent('fa-chevron-right'), p === pages) +
      pageButton('last', 'Last page', iconContent('fa-chevrons-right'), p === pages);
    document.getElementById('cu-pages').innerHTML = html;
  }

  function renderChips() {
    function count(status) { return users.filter(function (a) { return a.status === status; }).length; }
    document.getElementById('cu-count-active').textContent = count('Active');
    document.getElementById('cu-count-pending').textContent = count('Pending');
    document.getElementById('cu-count-inactive').textContent = count('Inactive');
  }

  function renderSortHeaders() {
    document.querySelectorAll('.cu-table th[data-sort-key]').forEach(function (th) {
      var key = th.getAttribute('data-sort-key');
      var icon = th.querySelector('.table-sort-icon i');
      if (key === state.sortKey) {
        th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
        icon.className = 'fa-solid ' + (state.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
      } else {
        th.removeAttribute('aria-sort');
        icon.className = 'fa-solid fa-sort';
      }
    });
  }

  function pageRows() {
    var list = visible();
    var pages = pageCount(list.length);
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.perPage;
    return { list: list, pages: pages, start: start, rows: list.slice(start, start + state.perPage) };
  }

  function render() {
    CU.saveUsers(users);
    CU.disposeTooltips(rowsEl);
    var view = pageRows();
    var gap = '<tr class="table-gap"><td colspan="100%"></td></tr>';
    rowsEl.innerHTML = gap + (view.rows.length ? view.rows.map(rowMarkup).join('') : noResultsMarkup());

    renderChips();
    renderSortHeaders();

    var pagination = document.getElementById('cu-pagination');
    pagination.hidden = view.list.length === 0;
    renderPagination(view.pages);
    document.getElementById('cu-showing').textContent = view.list.length
      ? showingText(view.start + 1, view.start + view.rows.length, view.list.length)
      : '';

    document.getElementById('cu-clear').hidden = !filtersActive();
    renderSelection(view.rows);
    CU.initTooltips(rowsEl);
    syncTruncation();
  }

  /* Gap 5: the header checkbox covers the selectable rows on this page. */
  function renderSelection(rows) {
    rows = rows || pageRows().rows;
    var selectable = rows.filter(function (a) { return !selectBlock(a); });
    var picked = selectable.filter(function (a) { return state.selected.indexOf(a.id) !== -1; });
    var all = document.getElementById('cu-select-all');
    all.checked = selectable.length > 0 && picked.length === selectable.length;
    all.indeterminate = picked.length > 0 && picked.length < selectable.length;
    all.disabled = selectable.length === 0;
    rowsEl.querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.classList.toggle('cu-selected', state.selected.indexOf(tr.getAttribute('data-id')) !== -1);
    });
    renderMoreActions();
  }

  /* More actions: Edit with exactly one row selected; Delete with one or
     more, unless the selection would remove the last active Administrator. */
  function renderMoreActions() {
    var chosen = state.selected.map(byId).filter(Boolean);
    document.getElementById('cu-bulk-edit').disabled = chosen.length !== 1;

    var del = document.getElementById('cu-bulk-delete');
    var wrap = document.getElementById('cu-bulk-delete-wrap');
    var reasonEl = document.getElementById('cu-bulk-delete-reason');
    var remaining = activeAdmins().filter(function (a) { return state.selected.indexOf(a.id) === -1; });
    var blocked = chosen.length > 0 && remaining.length === 0;
    del.disabled = chosen.length === 0 || blocked;

    CU.disposeTooltips(wrap.parentNode);
    if (blocked) {
      wrap.setAttribute('data-cu-tooltip', LAST_ADMIN);
      reasonEl.textContent = LAST_ADMIN;
      del.setAttribute('aria-describedby', 'cu-bulk-delete-reason');
      CU.initTooltips(wrap.parentNode);
    } else {
      wrap.removeAttribute('data-cu-tooltip');
      reasonEl.textContent = '';
      del.removeAttribute('aria-describedby');
    }
  }

  /* Truncated cell text gets its full text in a hover Tooltip; it is never
     made focusable. The full text is always in the DOM, so the accessible
     name is the full text. */
  function syncTruncation() {
    rowsEl.querySelectorAll('.cu-trunc').forEach(function (el) {
      var cut = el.scrollWidth > el.clientWidth + 1;
      var had = el.hasAttribute('data-cu-tooltip');
      if (cut && !had) {
        el.setAttribute('data-cu-tooltip', el.textContent);
        el.setAttribute('data-cu-hover-only', '');
        CU.initTooltips(el.parentNode);
      } else if (!cut && had) {
        var t = window.bootstrap && bootstrap.Tooltip.getInstance(el);
        if (t) t.dispose();
        el.removeAttribute('data-cu-tooltip');
        el.removeAttribute('data-cu-hover-only');
      }
    });
  }

  /* Live updates: the count and the no-results message are announced
     politely when search or filters change. Debounced, so typing doesn't
     queue an announcement per key. */
  var announceTimer = null;
  function announceResults() {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      var list = visible();
      if (!list.length) {
        CU.announce(NO_RESULTS_HEADING + '. ' + NO_RESULTS_TEXT);
        return;
      }
      var start = (state.page - 1) * state.perPage;
      CU.announce(showingText(start + 1, Math.min(start + state.perPage, list.length), list.length));
    }, 500);
  }

  /* Changing filters, search, sort, page or rows per page clears the
     selection; filters, search and rows per page also return to page 1. */
  function resetView(toFirstPage) {
    state.selected = [];
    if (toFirstPage) state.page = 1;
  }

  /* ------------------------------------------------------------ filter bar */
  var search = document.getElementById('cu-search');
  var roleFilter = document.getElementById('cu-role-filter');
  var statusFilter = document.getElementById('cu-status-filter');

  search.addEventListener('input', function () {
    state.query = search.value;
    resetView(true);
    render();
    announceResults();
  });
  roleFilter.addEventListener('change', function () {
    state.role = roleFilter.value;
    resetView(true);
    render();
    announceResults();
  });
  statusFilter.addEventListener('change', function () {
    state.status = statusFilter.value;
    resetView(true);
    render();
    announceResults();
  });
  document.getElementById('cu-clear').addEventListener('click', function () {
    search.value = '';
    roleFilter.value = 'all';
    statusFilter.value = 'all';
    state.query = '';
    state.role = 'all';
    state.status = 'all';
    resetView(true);
    CU.hideTooltips();
    render();
    search.focus();
    announceResults();
  });

  /* ------------------------------------------------------------ sort, pages */
  document.querySelector('.cu-table thead').addEventListener('click', function (event) {
    var button = event.target.closest('.table-sort');
    if (!button) return;
    var key = button.closest('th').getAttribute('data-sort-key');
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = key;
      state.sortDir = 'asc';
    }
    resetView(false);
    render();
  });

  document.getElementById('cu-pages').addEventListener('click', function (event) {
    var button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    var pages = pageCount(visible().length);
    var target = button.getAttribute('data-page');
    var page = { first: 1, prev: state.page - 1, next: state.page + 1, last: pages }[target] || Number(target);
    page = Math.min(Math.max(page, 1), pages);
    if (page === state.page) return;
    state.page = page;
    resetView(false);
    CU.hideTooltips();
    render();
    /* The button that was pressed may now be disabled (first, last), so
       focus stays in the pagination on the current page's button. */
    var current = document.querySelector('#cu-pages button[aria-current="page"]');
    if (current) current.focus();
  });

  document.getElementById('cu-per-page').addEventListener('change', function (event) {
    state.perPage = Number(event.target.value);
    resetView(true);
    render();
  });

  /* ------------------------------------------------------------ selection */
  rowsEl.addEventListener('change', function (event) {
    var box = event.target.closest('input[type=checkbox][data-id]');
    if (!box) return;
    var id = box.getAttribute('data-id');
    var i = state.selected.indexOf(id);
    if (box.checked && i === -1) state.selected.push(id);
    if (!box.checked && i !== -1) state.selected.splice(i, 1);
    renderSelection();
  });

  document.getElementById('cu-select-all').addEventListener('change', function (event) {
    var selectable = pageRows().rows.filter(function (a) { return !selectBlock(a); });
    var ids = selectable.map(function (a) { return a.id; });
    if (event.target.checked) {
      ids.forEach(function (id) { if (state.selected.indexOf(id) === -1) state.selected.push(id); });
    } else {
      state.selected = state.selected.filter(function (id) { return ids.indexOf(id) === -1; });
    }
    rowsEl.querySelectorAll('input[type=checkbox][data-id]').forEach(function (box) {
      box.checked = state.selected.indexOf(box.getAttribute('data-id')) !== -1;
    });
    renderSelection();
  });

  /* ------------------------------------------------------------ row actions */
  rowsEl.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    var a = byId(button.getAttribute('data-id'));
    if (!a) return;
    CU.hideTooltips();
    var action = button.getAttribute('data-action');
    var returnTo = { action: action, id: a.id };
    if (action === 'view') openView(a, returnTo);
    if (action === 'edit') openEdit(a, returnTo);
    if (action === 'delete') openDelete([a], returnTo);
  });

  /* ------------------------------------------------------------ More actions
     Bootstrap Dropdown, with the shell's keyboard fixes: Enter or Space opens
     and moves focus to the first enabled item, Escape returns focus to the
     toggle, Tab out of the list closes it. */
  var moreToggle = document.getElementById('cu-more-toggle');
  var morePanel = document.getElementById('cu-more-panel');
  var moreWrap = document.getElementById('cu-more');
  var moreDropdown = bootstrap.Dropdown.getOrCreateInstance(moreToggle);
  var moreReturnFocus = false;

  moreToggle.addEventListener('show.bs.dropdown', function () { CU.hideTooltips(); });
  /* The Tooltip sits on the wrapper, so focus moving onto an item would
     show it over the open list. */
  morePanel.addEventListener('focusin', function () { CU.hideTooltips(); });
  moreToggle.addEventListener('shown.bs.dropdown', function () {
    var first = morePanel.querySelector('.menu-item:not(:disabled)');
    if (first) first.focus();
  });
  moreToggle.addEventListener('hidden.bs.dropdown', function () {
    if (moreReturnFocus) {
      moreReturnFocus = false;
      moreToggle.focus();
      CU.hideTooltips();
    }
  });
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && morePanel.classList.contains('show') && morePanel.contains(event.target)) moreReturnFocus = true;
  }, true);
  moreWrap.addEventListener('focusout', function (event) {
    if (morePanel.classList.contains('show') && event.relatedTarget && !moreWrap.contains(event.relatedTarget)) moreDropdown.hide();
  });

  document.getElementById('cu-bulk-edit').addEventListener('click', function () {
    var a = byId(state.selected[0]);
    moreDropdown.hide();
    if (a) openEdit(a, { element: moreToggle });
  });
  document.getElementById('cu-bulk-delete').addEventListener('click', function () {
    var chosen = state.selected.map(byId).filter(Boolean);
    moreDropdown.hide();
    if (chosen.length) openDelete(chosen, { element: moreToggle });
  });

  /* ------------------------------------------------------------ focus return
     Focus goes back to the control that opened a blade or Modal. Rows are
     re-rendered after a change, so a row control is found again by id; if
     the row is no longer on the page, Search is the fallback. */
  function focusReturn(returnTo) {
    var target = null;
    if (returnTo && returnTo.element && document.contains(returnTo.element)) target = returnTo.element;
    if (!target && returnTo && returnTo.id) {
      target = rowsEl.querySelector('button[data-action="' + returnTo.action + '"][data-id="' + returnTo.id + '"]');
      if (target && target.disabled) target = null;
    }
    (target || search).focus();
    CU.hideTooltips();
  }

  /* ------------------------------------------------------------ blades
     Gap 1. The shared prototype blade (`prototypes/shared/blade.js`,
     unchanged): Offcanvas from the right, scrim, focus trap, Escape, body
     that scrolls, optional footer. This file adds what the spec asks for on
     top: the blade sits under the CH top bar (as the Mobius frames draw
     it), the Close button's Tooltip, Escape / Close / Cancel going through
     the Discard changes Modal when there are unsaved changes, and focus
     returning to the control that opened it. */
  function headerHeight() {
    var header = document.getElementById('ch-header');
    return header ? Math.round(header.getBoundingClientRect().height) : 0;
  }

  function createBlade(options) {
    document.documentElement.style.setProperty('--cu-header-height', headerHeight() + 'px');
    var ctx = {
      returnTo: options.returnTo,
      isDirty: options.isDirty || function () { return false; },
      confirmClose: !!options.confirmClose,
      force: false,
      skipReturn: false,
      onClosed: null
    };
    var b = new Blade({
      id: options.id,
      title: options.title,
      body: options.body,
      footer: options.footer,
      width: '30rem',
      initialFocus: options.initialFocus,
      onClose: function () {
        document.body.classList.remove('cu-blade-open');
        if (blade === ctx) blade = null;
        CU.disposeTooltips(b.el);
        b.offcanvas.dispose();
        b.el.remove();
        if (!ctx.skipReturn) focusReturn(ctx.returnTo);
        if (ctx.onClosed) ctx.onClosed();
      }
    });
    ctx.blade = b;
    b.el.classList.add('cu-blade');

    /* The blade's name is its title. The shared Close button is named
       "Close {title}"; the spec names it "Close", with the Tooltip "Close". */
    b.closeEl.setAttribute('aria-label', 'Close');
    b.closeEl.setAttribute('data-cu-tooltip', 'Close');
    b.closeEl.setAttribute('data-cu-placement', 'left');
    CU.initTooltips(b.el);

    /* Escape, Close, Cancel and a click on the scrim all reach Offcanvas
       `hide`. With unsaved changes, stop it and ask first. */
    b.el.addEventListener('hide.bs.offcanvas', function (event) {
      if (ctx.force || !ctx.confirmClose || !ctx.isDirty()) {
        CU.hideTooltips();
        return;
      }
      event.preventDefault();
      openDiscard(ctx, document.activeElement);
    });

    ctx.close = function (options) {
      options = options || {};
      ctx.force = true;
      ctx.skipReturn = !!options.skipReturn;
      if (options.returnTo) ctx.returnTo = options.returnTo;
      ctx.onClosed = options.onClosed || null;
      b.close();
    };

    blade = ctx;
    /* The opener is tracked in ctx.returnTo; the shared blade's own focus
       return is switched off by giving it no trigger. */
    b.open(null);
    b.trigger = null;
    document.body.classList.add('cu-blade-open');
    return ctx;
  }

  /* Opening a Modal over the blade: Bootstrap 5.1.3's Offcanvas and Modal
     each run a focus trap, and two active traps pull focus back and forth.
     The blade's trap is paused while a Modal is open over it. */
  function pauseBladeTrap() {
    if (blade && blade.blade.offcanvas._focustrap) blade.blade.offcanvas._focustrap.deactivate();
  }
  function resumeBladeTrap() {
    if (blade && blade.blade.offcanvas._focustrap) blade.blade.offcanvas._focustrap.activate();
  }

  /* Shell contract: the unsaved-changes Modal can open while a blade is
     open, because the top bar stays usable above the blade. */
  var envModal = document.getElementById('ch-env-modal');
  if (envModal) {
    envModal.classList.add('cu-modal');
    envModal.addEventListener('show.bs.modal', pauseBladeTrap);
    envModal.addEventListener('hidden.bs.modal', function () {
      if (!blade) return;
      var back = blade.lastFocus;
      resumeBladeTrap();
      if (back && document.contains(back)) back.focus();
    });
    /* Remember where focus was in the blade before the top bar took it. */
    document.addEventListener('focusin', function (event) {
      if (blade && blade.blade.el.contains(event.target)) blade.lastFocus = event.target;
    });
  }

  /* ------------------------------------------------------------ form fields */
  function helperId(id) { return id + '-helper'; }
  function errorId(id) { return id + '-error'; }

  /* Required fields carry an asterisk after the label (spec, Blade layout:
     the Mobius pattern, not Buckholt's "(required)" text; SPEC-CHANGES C18).
     The asterisk is hidden from assistive technology; the control itself
     is `required`. */
  function labelMarkup(text, required) {
    return text + (required ? ' <span class="cu-required" aria-hidden="true">*</span>' : '');
  }

  function textField(id, labelText, value, opts) {
    opts = opts || {};
    var describedby = [opts.helper ? helperId(id) : null, errorId(id)].filter(Boolean).join(' ');
    return '<div class="input">' +
        '<div class="input-label">' +
          '<label for="' + id + '" class="form-label">' + labelMarkup(labelText, opts.required) + '</label>' +
        '</div>' +
        '<div class="response text-input">' +
          '<input type="' + (opts.type || 'text') + '" class="form-control" id="' + id + '" value="' + esc(value || '') + '"' +
            (opts.readonly ? ' readonly' : '') + (opts.required ? ' required' : '') +
            ' autocomplete="off" spellcheck="false" aria-describedby="' + describedby + '">' +
        '</div>' +
        (opts.helper ? '<small class="form-helper' + (opts.readonly ? ' cu-keep-helper' : '') + '" id="' + helperId(id) + '">' + esc(opts.helper) + '</small>' : '') +
        '<div class="invalid-feedback" id="' + errorId(id) + '"></div>' +
      '</div>';
  }

  function roleField(id, value, helper, opts) {
    opts = opts || {};
    var options = (opts.placeholder ? '<option value="" disabled' + (value ? '' : ' selected') + '>Select a role</option>' : '') +
      D.roles.map(function (r) {
        return '<option value="' + r.name + '"' + (r.name === value ? ' selected' : '') + '>' + r.name + '</option>';
      }).join('');
    /* Read-only is Buckholt Select's documented `.readonly` plus `disabled`.
       Role is always required, but a locked Role is not editable, so it
       carries no asterisk. */
    var required = !opts.locked;
    return '<div class="input">' +
        '<div class="input-label">' +
          '<label for="' + id + '" class="form-label">' + labelMarkup('Role', required) + '</label>' +
        '</div>' +
        '<div class="response select-input">' +
          '<select class="form-select' + (opts.locked ? ' readonly' : '') + '" id="' + id + '"' +
            (opts.locked ? ' disabled' : '') + (required ? ' required' : '') +
            ' aria-describedby="' + helperId(id) + ' ' + errorId(id) + '">' + options + '</select>' +
        '</div>' +
        '<small class="form-helper' + (opts.locked ? ' cu-keep-helper' : '') + '" id="' + helperId(id) + '">' + esc(helper) + '</small>' +
        '<div class="invalid-feedback" id="' + errorId(id) + '"></div>' +
      '</div>';
  }

  function setError(field, message) {
    var feedback = document.getElementById(errorId(field.id));
    field.classList.toggle('is-invalid', !!message);
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    if (feedback) feedback.textContent = message || '';
  }

  /* Blade layout: each section starts with a level 2 heading in a Text
     block, as Form documents a section intro; the Edit and Add sections are
     Form's `.form-body`, the View sections plain containers. */
  function section(title, content, opts) {
    opts = opts || {};
    return '<div class="' + (opts.form ? 'form-body ' : '') + 'cu-blade-section">' +
        '<div class="text-block">' +
          '<h2 class="headline-03">' + title + '</h2>' +
          (opts.intro ? '<p' + (opts.introId ? ' id="' + opts.introId + '"' : '') + '>' + opts.intro + '</p>' : '') +
        '</div>' +
        content +
      '</div>';
  }

  /* Blade footer: spans the blade, the secondary action at the start edge
     and the primary at the end edge (spec, Blade layout; Mobius). */
  function footer(buttons) {
    return '<div class="button-set cu-blade-actions">' + buttons + '</div>';
  }
  function button(id, cls, text, attrs) {
    attrs = attrs || {};
    return '<button type="' + (attrs.type || 'button') + '" class="btn ' + cls + '" id="' + id + '"' +
      (attrs.form ? ' form="' + attrs.form + '"' : '') + (attrs.disabled ? ' disabled' : '') +
      (attrs.describedby ? ' aria-describedby="' + attrs.describedby + '"' : '') +
      (attrs.labelledby ? ' aria-labelledby="' + attrs.labelledby + '"' : '') + '>' +
      '<span class="button-label"' + (attrs.labelId ? ' id="' + attrs.labelId + '"' : '') + '>' + text + '</span></button>';
  }

  /* ------------------------------------------------------------ CU-01 · Add */
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ADD_INTRO = "We'll email them a link to create their account. They'll choose a username and password, and set up multi-factor authentication.";

  function emailError(raw) {
    var value = raw.trim().toLowerCase();
    if (!value) return 'Enter an email address.';
    if (value.length > 254) return 'Email address must be 254 characters or fewer.';
    if (!EMAIL_PATTERN.test(value)) return 'Enter an email address in the correct format, like name@example.com.';
    var existing = users.filter(function (a) { return a.email === value; })[0];
    if (existing && isPending(existing)) return 'This person has already been invited. You can resend their invitation from their user details.';
    if (existing) return "There's already a Configuration Hub user with this email address.";
    return null;
  }

  function openAdd(trigger) {
    var body =
      '<form class="form" id="cu-add-form" novalidate>' +
        section('Account details',
          textField('cu-add-email', 'Email', '', { type: 'email', required: true, helper: "We'll only use this to send the invitation. They'll sign in with their username." }) +
          roleField('cu-add-role', '', 'You can change their role later.', { placeholder: true }),
          { form: true, intro: ADD_INTRO }) +
      '</form>';

    var ctx = createBlade({
      id: 'cu-add-blade',
      title: 'Add user',
      body: body,
      footer: footer(
        button('cu-add-cancel', 'btn-secondary', 'Cancel') +
        button('cu-add-send', 'btn-primary', 'Send invitation', { type: 'submit', form: 'cu-add-form' })
      ),
      initialFocus: '#cu-add-email',
      returnTo: { element: trigger },
      /* Cancel, Close and Escape discard without asking [Assumption]; the
         values still count as unsaved changes for an environment switch. */
      confirmClose: false,
      isDirty: function () {
        return email.value.trim() !== '' || role.value !== '';
      }
    });

    var el = ctx.blade.el;
    var form = el.querySelector('#cu-add-form');
    var email = el.querySelector('#cu-add-email');
    var role = el.querySelector('#cu-add-role');
    var roleHelper = el.querySelector('#' + helperId('cu-add-role'));

    email.addEventListener('blur', function () {
      /* Checked when the field loses focus. Deferred a tick, so nothing is
         shown if the blade has closed by then. */
      window.setTimeout(function () {
        if (!blade || blade !== ctx) return;
        var message = emailError(email.value);
        var wasShown = email.classList.contains('is-invalid');
        setError(email, message);
        if (message && !wasShown) CU.announce(message);
      }, 0);
    });
    email.addEventListener('input', function () {
      if (email.classList.contains('is-invalid') && !emailError(email.value)) setError(email, null);
    });
    role.addEventListener('change', function () {
      roleHelper.textContent = roleInfo(role.value).description;
      setError(role, null);
    });
    el.querySelector('#cu-add-cancel').addEventListener('click', function () { ctx.blade.close(); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var emailMessage = emailError(email.value);
      var roleMessage = role.value ? null : 'Select a role.';
      setError(email, emailMessage);
      setError(role, roleMessage);
      if (emailMessage || roleMessage) {
        (emailMessage ? email : role).focus();
        return;
      }
      var value = email.value.trim().toLowerCase();
      users.push({
        id: 'cu-' + (nextId++),
        self: false,
        email: value,
        username: null,
        firstName: null,
        lastName: null,
        role: role.value,
        status: 'Pending',
        invitedOn: CU.isoToday()
      });
      render();
      ctx.close({ onClosed: function () { CU.toast('Invitation sent to ' + value + '.'); } });
    });
  }

  document.getElementById('cu-add').addEventListener('click', function (event) {
    openAdd(event.currentTarget);
  });

  /* ------------------------------------------------------------ CU-02 / CU-03 · Edit */
  function nameError(value, which) {
    var v = value.trim();
    if (!v) return 'Enter a ' + which.toLowerCase() + '.';
    if (v.length > 50) return which + ' must be 50 characters or fewer.';
    return null;
  }

  /* Status: a Buckholt Switch (on = Active). Its label sits at the start of
     the row and the switch at the end, with the state text beside it. */
  function statusField(a, lock) {
    return '<div class="form-check form-switch cu-status-switch">' +
        '<input class="form-check-input" type="checkbox" role="switch" id="cu-edit-status"' +
          (a.status === 'Active' ? ' checked' : '') + (lock ? ' disabled aria-describedby="cu-edit-status-helper"' : '') + '>' +
        '<div class="input-label">' +
          '<label class="form-check-label" for="cu-edit-status">Status</label>' +
          (lock ? '<small class="form-helper" id="cu-edit-status-helper">' + esc(lock) + '</small>' : '') +
        '</div>' +
      '</div>';
  }

  /* Reset MFA: a label, then a Secondary Button below it. The button's name
     is its own text ("Reset MFA"); the label and any reason describe it. */
  function mfaField(block) {
    return '<div class="input cu-mfa">' +
        '<div class="input-label">' +
          '<label class="form-label" for="cu-edit-reset-mfa" id="cu-edit-mfa-label">Reset multi-factor authentication (MFA)</label>' +
        '</div>' +
        button('cu-edit-reset-mfa', 'btn-secondary', 'Reset MFA', {
          disabled: !!block,
          labelId: 'cu-edit-reset-mfa-text',
          labelledby: 'cu-edit-reset-mfa-text',
          describedby: 'cu-edit-mfa-label' + (block ? ' cu-edit-mfa-helper' : '')
        }) +
        (block ? '<small class="form-helper" id="cu-edit-mfa-helper">' + esc(block) + '</small>' : '') +
      '</div>';
  }

  function openEdit(a, returnTo) {
    var pending = isPending(a);
    var lock = roleLock(a);
    var body = '<form class="form" id="cu-edit-form" novalidate>';
    if (pending) {
      body +=
        section('Account details',
          textField('cu-edit-email', 'Email', a.email, { readonly: true, helper: "Email can't be changed." }) +
          roleField('cu-edit-role', a.role, roleInfo(a.role).description),
          { form: true }) +
        /* No account yet, so no Status and no Reset MFA. */
        section('Account management',
          '<div class="cu-resend">' + button('cu-edit-resend', 'btn-secondary', 'Resend invitation') + '</div>',
          { form: true, intro: invitedText(a), introId: 'cu-edit-invited' });
    } else {
      /* Field order as Mobius: First name, Last name, Email, Username, Role. */
      body +=
        section('Account details',
          textField('cu-edit-first', 'First name', a.firstName, { required: true }) +
          textField('cu-edit-last', 'Last name', a.lastName, { required: true }) +
          textField('cu-edit-email', 'Email', a.email, { readonly: true, helper: "Email can't be changed." }) +
          textField('cu-edit-username', 'Username', a.username, { readonly: true, helper: "Username can't be changed." }) +
          roleField('cu-edit-role', a.role, lock || roleInfo(a.role).description, { locked: !!lock }),
          { form: true }) +
        section('Account management',
          statusField(a, statusLock(a)) + mfaField(mfaBlock(a)),
          { form: true });
    }
    body += '</form>';

    var ctx = createBlade({
      id: 'cu-edit-blade',
      title: 'Edit user',
      body: body,
      footer: footer(
        button('cu-edit-cancel', 'btn-secondary', 'Cancel') +
        button('cu-edit-save', 'btn-primary', 'Save changes', { type: 'submit', form: 'cu-edit-form', disabled: true })
      ),
      /* Focus moves to the first editable field. */
      initialFocus: pending ? '#cu-edit-role' : '#cu-edit-first',
      returnTo: returnTo,
      confirmClose: true,
      isDirty: function () { return changed(); }
    });

    var el = ctx.blade.el;
    var form = el.querySelector('#cu-edit-form');
    var first = el.querySelector('#cu-edit-first');
    var last = el.querySelector('#cu-edit-last');
    var role = el.querySelector('#cu-edit-role');
    var status = el.querySelector('#cu-edit-status');
    var save = el.querySelector('#cu-edit-save');

    function statusChanged() {
      return !!status && status.checked !== (a.status === 'Active');
    }
    function changed() {
      if (!pending && (first.value !== a.firstName || last.value !== a.lastName)) return true;
      return role.value !== a.role || statusChanged();
    }
    /* "Save changes" is disabled until a value differs from the saved one,
       Status included. */
    function sync() { save.disabled = !changed(); }

    form.addEventListener('input', function (event) {
      if (event.target.classList.contains('is-invalid')) {
        var which = event.target === first ? 'First name' : 'Last name';
        if (!nameError(event.target.value, which)) setError(event.target, null);
      }
      sync();
    });
    role.addEventListener('change', function () {
      if (!lock) el.querySelector('#' + helperId('cu-edit-role')).textContent = roleInfo(role.value).description;
      sync();
    });
    /* Status applies on "Save changes", like every other field. */
    if (status) status.addEventListener('change', sync);
    el.querySelector('#cu-edit-cancel').addEventListener('click', function () { ctx.blade.close(); });

    if (pending) {
      el.querySelector('#cu-edit-resend').addEventListener('click', function () {
        /* Works straight away, without saving other changes [Assumption]. */
        a.invitedOn = CU.isoToday();
        CU.saveUsers(users);
        el.querySelector('#cu-edit-invited').textContent = invitedText(a);
        CU.toast('Invitation sent again to ' + a.email + '.');
      });
    } else {
      /* Reset MFA acts straight away, through its Modal; unsaved changes in
         the blade are kept. */
      el.querySelector('#cu-edit-reset-mfa').addEventListener('click', function (event) {
        openMfa(a, event.currentTarget);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!changed()) return;
      var statusMessage = null;
      if (!pending) {
        var firstMessage = nameError(first.value, 'First name');
        var lastMessage = nameError(last.value, 'Last name');
        setError(first, firstMessage);
        setError(last, lastMessage);
        if (firstMessage || lastMessage) {
          (firstMessage ? first : last).focus();
          return;
        }
        a.firstName = first.value.trim();
        a.lastName = last.value.trim();
        if (statusChanged()) {
          a.status = status.checked ? 'Active' : 'Inactive';
          /* When Status and other fields change together, only the status
             message shows. */
          statusMessage = a.status === 'Active'
            ? fullName(a) + ' can sign in to Configuration Hub again.'
            : fullName(a) + ' can no longer sign in to Configuration Hub.';
        }
      }
      if (!lock) a.role = role.value;
      render();
      var message = statusMessage || 'Changes saved for ' + label(a) + '.';
      ctx.close({ onClosed: function () { CU.toast(message); } });
    });
    return ctx;
  }

  function invitedText(a) {
    return 'Invitation sent on ' + CU.formatDate(a.invitedOn) +
      '. Their name and username will show here once they\'ve created their account.';
  }

  /* ------------------------------------------------------------ Reset MFA (Modal) */
  var mfaModalEl = document.getElementById('cu-mfa-modal');
  var mfaModal = bootstrap.Modal.getOrCreateInstance(mfaModalEl);
  var mfaReset = null;

  function openMfa(a, opener) {
    mfaReset = { user: a, opener: opener, confirmed: false };
    document.getElementById('cu-mfa-title').textContent = 'Reset MFA for ' + fullName(a) + '?';
    CU.hideTooltips();
    pauseBladeTrap();
    mfaModal.show();
  }

  document.getElementById('cu-mfa-confirm').addEventListener('click', function () {
    if (mfaReset) mfaReset.confirmed = true;
    mfaModal.hide();
  });

  mfaModalEl.addEventListener('hidden.bs.modal', function () {
    if (!mfaReset) return;
    var done = mfaReset;
    mfaReset = null;
    resumeBladeTrap();
    /* Confirming, "Cancel", Escape and the close control all return focus to
       "Reset MFA"; the blade stays open either way. */
    if (done.opener && document.contains(done.opener)) done.opener.focus();
    if (done.confirmed) CU.toast('MFA reset for ' + fullName(done.user) + '.');
  });

  /* ------------------------------------------------------------ CU-04 · View */
  function kv(key, value) {
    return '<div class="key-value">' +
        '<span class="key">' + key + '</span>' +
        '<span class="value">' + esc(value) + '</span>' +
      '</div>';
  }
  function kvList(pairs) {
    return '<div class="key-value-list key-value-list-stacked cu-view-pairs">' + pairs + '</div>';
  }

  function openView(a, returnTo) {
    /* The same sections as the Edit blade, read-only. */
    var body = isPending(a)
      ? section('Account details', kvList(kv('Email', a.email) + kv('Role', a.role))) +
        section('Account management', kvList(kv('Status', a.status) + kv('Invited on', CU.formatDate(a.invitedOn))))
      : section('Account details', kvList(kv('First name', a.firstName) + kv('Last name', a.lastName) +
          kv('Email', a.email) + kv('Username', a.username) + kv('Role', a.role))) +
        section('Account management', kvList(kv('Status', a.status)));

    /* "Edit" is the Edit common action's label. Its icon is left off:
       Buckholt's button-set rule is all labelled actions with icons, or
       none, and "Close" has no common-action icon here. */
    var ctx = createBlade({
      id: 'cu-view-blade',
      title: 'View user',
      body: body,
      footer: footer(
        button('cu-view-close', 'btn-secondary', 'Close') +
        button('cu-view-edit', 'btn-primary', 'Edit')
      ),
      initialFocus: '.blade-title',
      returnTo: returnTo
    });
    /* Focus moves to the blade title in the View blade. */
    var title = ctx.blade.el.querySelector('.blade-title');
    title.setAttribute('tabindex', '-1');
    title.focus();

    ctx.blade.el.querySelector('#cu-view-close').addEventListener('click', function () { ctx.blade.close(); });
    ctx.blade.el.querySelector('#cu-view-edit').addEventListener('click', function () {
      /* "Edit" replaces the View blade with the Edit blade. Focus then goes
         back to the row's Edit action when the Edit blade closes. */
      ctx.close({
        skipReturn: true,
        onClosed: function () { openEdit(a, { action: 'edit', id: a.id }); }
      });
    });
  }

  /* ------------------------------------------------------------ CU-05 · Delete */
  var deleteModalEl = document.getElementById('cu-delete-modal');
  var deleteModal = bootstrap.Modal.getOrCreateInstance(deleteModalEl);
  var deleting = null;

  function openDelete(list, returnTo) {
    var title, body, action;
    if (list.length > 1) {
      title = 'Delete ' + list.length + ' users?';
      body = 'They won\'t be able to sign in to Configuration Hub, and any pending invitations will be cancelled. Mobius users aren\'t affected. You can\'t undo this.';
      action = 'Delete';
    } else if (isPending(list[0])) {
      title = 'Cancel the invitation for ' + list[0].email + '?';
      body = 'The link in their invitation will stop working. You can\'t undo this.';
      action = 'Cancel invitation';
    } else {
      title = 'Delete ' + fullName(list[0]) + '?';
      body = 'They won\'t be able to sign in to Configuration Hub. Their Mobius user, if they have one, isn\'t affected. You can\'t undo this.';
      action = 'Delete';
    }
    document.getElementById('cu-delete-title').textContent = title;
    document.getElementById('cu-delete-body').textContent = body;
    document.querySelector('#cu-delete-confirm .button-label').textContent = action;
    deleting = { list: list, returnTo: returnTo, confirmed: false };
    deleteModal.show();
  }

  document.getElementById('cu-delete-confirm').addEventListener('click', function () {
    if (!deleting) return;
    var list = deleting.list;
    var ids = list.map(function (a) { return a.id; });
    users = users.filter(function (a) { return ids.indexOf(a.id) === -1; });
    state.selected = [];
    deleting.confirmed = true;
    deleting.message = list.length > 1
      ? list.length + ' users deleted.'
      : (isPending(list[0]) ? 'Invitation for ' + list[0].email + ' cancelled.' : fullName(list[0]) + ' deleted.');
    /* If the current page is now empty, render() shows the previous one. */
    render();
    deleteModal.hide();
  });

  deleteModalEl.addEventListener('hidden.bs.modal', function () {
    if (!deleting) return;
    var done = deleting;
    deleting = null;
    if (done.confirmed) {
      search.focus();
      CU.toast(done.message);
    } else {
      focusReturn(done.returnTo);
    }
  });

  /* ------------------------------------------------------------ Discard changes */
  var discardModalEl = document.getElementById('cu-discard-modal');
  var discardModal = bootstrap.Modal.getOrCreateInstance(discardModalEl);
  var discarding = null;

  function openDiscard(ctx, opener) {
    discarding = { ctx: ctx, opener: opener, confirmed: false };
    CU.hideTooltips();
    pauseBladeTrap();
    discardModal.show();
  }

  document.getElementById('cu-discard-confirm').addEventListener('click', function () {
    if (discarding) discarding.confirmed = true;
    discardModal.hide();
  });

  discardModalEl.addEventListener('hidden.bs.modal', function () {
    if (!discarding) return;
    var done = discarding;
    discarding = null;
    resumeBladeTrap();
    if (done.confirmed) {
      done.ctx.close();
      return;
    }
    /* "Keep editing", Escape and the close control: back to the blade with
       the changes intact, focus on the control that opened the Modal. */
    if (done.opener && document.contains(done.opener)) done.opener.focus();
  });

  /* ------------------------------------------------------------ start */
  CU.initTooltips(document.querySelector('.cu-filter-actions'));
  render();
  var frame = null;
  window.addEventListener('resize', function () {
    if (frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(syncTruncation);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTruncation);

  /* For the test suite and for anyone exploring the prototype from the
     console. Not used by the page. */
  window.CUUsers = {
    state: state,
    users: function () { return users; },
    render: render
  };
})();
