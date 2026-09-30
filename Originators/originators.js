/* ============================================================================
   Originators prototype — behaviour
   ============================================================================

   Implements OR-00 to OR-11 from `originators-spec.md`. State is held in
   memory only; reloading resets to the seed data, as the spec's Prototype
   notes require.

   Every piece of markup this file creates is Buckholt markup taken from
   `components/<component>/examples.html`. Where a comment names a component,
   that component's canonical example is the structure being reproduced.
   ============================================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ Seed */

  var ORIGINATOR_SEED = [
    { id: 'o1', holder: 'Assurant Inter LTD', sort: '88-77-66', account: '61366789', user: '504965', bureau: 'ABCDEF' },
    { id: 'o2', holder: 'Real Insure LTD',    sort: '11-23-45', account: '32899602', user: '758392', bureau: 'DEFGHI' }
  ];

  /* Products in table order. `originator` is an explicit override; null means
     the product inherits the default. Spec "Seed data": 32 inherit, 2 are
     explicitly assigned to Real Insure LTD (rows 6 and 12). */
  var PRODUCT_SEED = [
    ['Krypton - Goods in Transit-Pay Monthly', null],
    ['Krypton - Goods in Transit-Vitruvius Instalments', null],
    ['Krypton - Open Market Motor-11 Months', null],
    ['Krypton - Open Market Motor-3 Months Plan', null],
    ['Krypton - Open Market Motor-6 Months instalments PP STP', null],
    ['Krypton - Open Market Motor-7 Months Instalments', 'o2'],
    ['Krypton - Open Market Motor-DailyPP', null],
    ['Krypton - Open Market Motor-Pay Monthly', null],
    ['Krypton - Open Market Motor-Payment Plan No Links', null],
    ['Krypton - Open Market Motor-Sazdo Test 2 Instalment', null],
    ['Krypton - Open Market Motor-Sazdo Test PP with 2 instalment', null],
    ['Krypton - Commercial Combined-Monthly instalment', 'o2'],
    ['Krypton - Open Market Commercial Vehicle-11 Months', null],
    ['Krypton - Open Market Commercial Vehicle-3 Months Plan', null],
    ['Krypton - Open Market Commercial Vehicle-7 Months Instalments', null],
    ['Krypton - Open Market Commercial Vehicle-Daily Payment Plan', null],
    ['Krypton - Open Market Commercial Vehicle-DailyPP', null],
    ['Krypton - Open Market Commercial Vehicle-Pay Monthly', null],
    ['Krypton - Open Market Commercial Vehicle-Payment Plan No Links', null],
    ['Krypton - Shop-Monthly instalment', null],
    ['Krypton - Shop-Pay Monthly', null],
    ['Krypton - Shop-Vitruvius Instalments', null],
    ['Krypton - Equine-3 Months Plan', null],
    ['Krypton - Equine-Monthly instalment', null],
    ['Krypton - Equine-Pay Monthly', null],
    ['Krypton - Equine-Payment Plan No Links', null],
    ['Krypton - Equine-Vitruvius Instalments', null],
    ['Krypton - Professional Combined-Monthly instalment', null],
    ['Krypton - Professional Combined-Pay Monthly', null],
    ['Krypton - Professional Combined-Vitruvius Instalments', null],
    ['Krypton - Travel-Monthly instalment', null],
    ['Krypton - Office-Monthly instalment', null],
    ['Krypton - Office-Pay Monthly', null],
    ['Krypton - Office-Vitruvius Instalments', null]
  ];

  var state = {
    originators: ORIGINATOR_SEED.map(function (o) { return Object.assign({}, o); }),
    defaultId: 'o1',
    products: PRODUCT_SEED.map(function (row, i) {
      return { id: 'p' + (i + 1), name: row[0], originator: row[1] };
    }),
    selected: {},
    search: '',
    filter: 'all',
    editingId: null
  };

  var nextOriginatorSeq = 3;

  /* ------------------------------------------------------------- Utilities */

  function $(id) { return document.getElementById(id); }

  /* The shared shell owns the chrome, the clock, toasts, tooltips and HTML
     escaping. See `prototype/app-shell.js`. */
  var escapeHtml = Shell.escapeHtml;
  var initTooltips = Shell.initTooltips;
  var disposeTooltips = Shell.disposeTooltips;
  var showToast = Shell.showToast;

  function originatorById(id) {
    for (var i = 0; i < state.originators.length; i++) {
      if (state.originators[i].id === id) return state.originators[i];
    }
    return null;
  }

  function originatorName(id) {
    var o = originatorById(id);
    return o ? o.holder : '';
  }

  /* Every product resolves to exactly one originator: its override if it has
     one, otherwise the default. */
  function resolvedOriginator(product) {
    return product.originator || state.defaultId;
  }

  function productCount(originatorId) {
    return state.products.filter(function (p) {
      return resolvedOriginator(p) === originatorId;
    }).length;
  }

  /* Number of products inheriting the default (no explicit override). */
  function inheritedCount() {
    return state.products.filter(function (p) { return !p.originator; }).length;
  }

  function plural(n, singular, pluralWord) {
    return n + ' ' + (n === 1 ? singular : (pluralWord || singular + 's'));
  }

  function selectedIds() {
    return Object.keys(state.selected).filter(function (k) { return state.selected[k]; });
  }

  function selectedProducts() {
    var ids = state.selected;
    return state.products.filter(function (p) { return ids[p.id]; });
  }

  function allSelected() {
    return state.products.length > 0 && selectedIds().length === state.products.length;
  }

  /* Rows currently shown by the search box and the Originator filter, applied
     together (OR-04 rules). */
  function visibleProducts() {
    var q = state.search.trim().toLowerCase();
    return state.products.filter(function (p) {
      if (state.filter !== 'all' && resolvedOriginator(p) !== state.filter) return false;
      if (q && p.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* ------------------------------------------------------------ Originator
     cards — Buckholt Card, Icon block, Tag, Button.
     `.card-footer` is a runtime Card part (`--card-cap-background`); it is not
     in Card's Code & specs page. Recorded in PROTOTYPE.md.
     ------------------------------------------------------------------------ */

  /* Every icon-only control carries a Tooltip and an accessible name. Button's
     Usage guidance requires both: "Buckholt's Usage guidance requires a tooltip
     explaining the action and the implementation must still provide an
     accessible name." */
  function cardMarkup(o) {
    var count = productCount(o.id);
    var isDefault = o.id === state.defaultId;
    var blockedReason = isDefault
      ? 'Set another originator as default before deleting this one'
      : (count > 0 ? 'Reassign this originator’s products before deleting it' : null);

    var badges = '';
    if (isDefault) {
      badges +=
        '<span class="tag tag-status tag-status-info">' +
          '<span class="icon"><i class="fa-solid fa-circle-info"></i></span>' +
          '<span class="tag-label">Default</span>' +
        '</span>';
    }
    badges +=
      '<span class="tag"><span class="tag-label">' +
        escapeHtml(plural(count, 'product')) +
      '</span></span>';

    var deleteButton;
    if (blockedReason) {
      /* Buckholt's documented disabled state is the native attribute on the
         control, so that is what this uses. A disabled button receives no
         pointer events, so the Tooltip cannot live on it — Bootstrap's own
         guidance for this case is to put the trigger on a wrapper, which is
         what `.ori-blocked-action` is. Keyboard focus does not reach a disabled
         control at all, so OR-10's "appears on hover and on keyboard focus"
         cannot be met while the control is natively disabled. Recorded in
         PROTOTYPE.md and SPEC-CHANGES.md. */
      deleteButton =
        '<span class="ori-blocked-action" tabindex="0" role="button" aria-disabled="true"' +
          ' aria-label="Delete ' + escapeHtml(o.holder) + ' — ' + escapeHtml(blockedReason) + '"' +
          ' data-bs-toggle="tooltip" data-bs-placement="top"' +
          ' data-bs-title="' + escapeHtml(blockedReason) + '">' +
          '<button type="button" class="btn btn-ghost" disabled tabindex="-1">' +
            '<div class="btn-icon"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></div>' +
          '</button>' +
        '</span>';
    } else {
      deleteButton =
        '<button type="button" class="btn btn-ghost" data-action="delete"' +
          ' data-id="' + o.id + '"' +
          ' data-bs-toggle="tooltip" data-bs-placement="top"' +
          ' data-bs-title="Delete originator"' +
          ' aria-label="Delete ' + escapeHtml(o.holder) + '">' +
          '<div class="btn-icon"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></div>' +
        '</button>';
    }

    return '' +
      '<div class="card">' +
        '<div class="card-body">' +
          '<div class="ori-card-identity">' +
            '<div class="icon-block expressive-dark">' +
              '<i class="fa-regular fa-building-columns"></i>' +
            '</div>' +
            '<div class="text-block">' +
              '<h3 class="title-02">' + escapeHtml(o.holder) + '</h3>' +
              '<p>' + escapeHtml(o.sort) + ' • ' + escapeHtml(o.account) + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-footer">' +
          '<div class="ori-card-footer-row">' +
            '<div class="ori-card-badges">' + badges + '</div>' +
            '<div class="button-set button-set-end">' +
              '<button type="button" class="btn btn-ghost" data-action="edit"' +
                ' data-id="' + o.id + '"' +
                ' data-bs-toggle="tooltip" data-bs-placement="top"' +
                ' data-bs-title="Edit originator"' +
                ' aria-label="Edit ' + escapeHtml(o.holder) + '">' +
                '<div class="btn-icon"><i class="fa-regular fa-pencil" aria-hidden="true"></i></div>' +
              '</button>' +
              deleteButton +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* Bootstrap's grid does the horizontal structure, per patterns/page-layout:
     "Bootstrap .container, .row, .col-* -> width, horizontal structure,
     responsive columns/breakpoints." `.page-panel` sets `--bs-gutter-x` to the
     32px panel gap, and `.row` brings `--bs-gutter-y: 2rem`, so the 32px gap
     between cards in both directions is Buckholt's own spacing.

     `col-xxl-4` gives three per row at the 1920px frame the screens are drawn
     at, which is what OR-01 "Layout" describes: two sit at a fixed width left
     aligned, three stretch to share the row. */
  function renderCards() {
    disposeTooltips($('ori-cards'));
    $('ori-cards').innerHTML =
      '<div class="row">' +
        state.originators.map(function (o) {
          return '<div class="col-12 col-md-6 col-xxl-4">' + cardMarkup(o) + '</div>';
        }).join('') +
      '</div>';
    initTooltips($('ori-cards'));
  }

  /* --------------------------------------------------------- Product table
     Buckholt Table, using the documented selection pattern:
     `.table-container > .table-content > table.table`, `.table-checkbox-header
     .col-fit`, native `.form-check-input`, and the `.table-gap` spacer row.
     ------------------------------------------------------------------------ */

  function emptyStateMarkup(heading, body) {
    return '' +
      '<div class="text-block">' +
        '<h3 class="headline-01">' + escapeHtml(heading) + '</h3>' +
        '<p>' + body + '</p>' +
      '</div>';
  }

  function renderTable() {
    var region = $('ori-table-region');
    var rows = visibleProducts();

    /* OR-05-05: the chosen originator has no products at all. */
    if (state.filter !== 'all' && productCount(state.filter) === 0) {
      region.innerHTML = emptyStateMarkup(
        'No products assigned',
        'No products are assigned to ' + escapeHtml(originatorName(state.filter)) +
        ' yet. Set Originator to All, then select products and use Reassign originator to assign them.'
      );
      return;
    }

    /* OR-04-03: the search matches nothing. */
    if (rows.length === 0) {
      region.innerHTML = emptyStateMarkup(
        'No search results found',
        'No products match “' + escapeHtml(state.search.trim()) + '”. Try another search.'
      );
      return;
    }

    var body = rows.map(function (p) {
      var isSelected = !!state.selected[p.id];
      return '' +
        '<tr' + (isSelected ? ' class="ori-row-selected"' : '') + '>' +
          '<td class="col-fit">' +
            '<div class="form-check">' +
              '<input class="form-check-input" type="checkbox" id="ori-row-' + p.id + '"' +
                ' data-product="' + p.id + '"' + (isSelected ? ' checked' : '') + '>' +
              '<label class="visually-hidden" for="ori-row-' + p.id + '">Select ' +
                escapeHtml(p.name) + '</label>' +
            '</div>' +
          '</td>' +
          '<td>' + escapeHtml(p.name) + '</td>' +
          '<td>' +
            '<span class="tag"><span class="tag-label">' +
              escapeHtml(originatorName(resolvedOriginator(p))) +
            '</span></span>' +
          '</td>' +
        '</tr>';
    }).join('');

    region.innerHTML = '' +
      '<div class="table-container ori-table">' +
        '<div class="table-content">' +
          '<table class="table">' +
            '<thead>' +
              '<tr>' +
                '<th scope="col" class="table-checkbox-header col-fit">' +
                  '<div class="form-check">' +
                    '<input class="form-check-input" type="checkbox" id="ori-select-all">' +
                    '<label class="visually-hidden" for="ori-select-all">Select all products</label>' +
                  '</div>' +
                '</th>' +
                '<th scope="col"><div class="table-header-label">Product</div></th>' +
                '<th scope="col"><div class="table-header-label">Originator</div></th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              '<tr class="table-gap"><td colspan="100%"></td></tr>' +
              body +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      /* Row count. All rows show on one page, so the range is always 1 to the
         number of rows currently shown, which follows the search and the
         Originator filter together. Hidden in both empty states, which return
         above.

         `.support-01` is Buckholt's documented type set for small, subtle
         messaging, and matches the screenshot: measured on OR-00-01 at 2x, the
         count's ink is 21px tall against this build's 22px, so the drawn size
         is 12px. No colour utility — the count is drawn in the same
         `--text-primary` as every other text on the page. Sampled from
         OR-00-01, the dominant glyph colour is rgb(29,30,28), which is
         `--text-primary` under subpixel antialiasing; `--text-muted` over
         white would land near rgb(112,112,112). */
      '<p class="support-01 ori-row-count">' +
        'Showing 1-' + rows.length + ' of ' + rows.length +
      '</p>';

    syncSelectAll();
  }

  /* Header checkbox reflects only the visible rows (OR-04, OR-08 rules). */
  function syncSelectAll() {
    var box = $('ori-select-all');
    if (!box) return;
    var rows = visibleProducts();
    var chosen = rows.filter(function (p) { return state.selected[p.id]; }).length;
    box.checked = rows.length > 0 && chosen === rows.length;
    box.indeterminate = chosen > 0 && chosen < rows.length;
  }

  /* ------------------------------------------------------------- Selection */

  function renderSelectionBar() {
    var n = selectedIds().length;
    $('ori-selection-count').textContent =
      allSelected() ? 'All products selected' : plural(n, 'product') + ' selected';
    $('ori-reassign').disabled = n === 0;
    $('ori-clear-selection').disabled = n === 0;
  }

  /* ------------------------------------------------------- Originator filter
     Buckholt Dropdown. `components/dropdown/dropdown.js` binds its single
     select behaviour once, on DOMContentLoaded; the options that exist then
     are wired by it. Options added later (OR-01) are given the same state
     changes here, so both paths end in the documented `.active` /
     `aria-selected` / `.dropdown-label` result.
     ------------------------------------------------------------------------ */

  function filterOptionMarkup(value, label, selected) {
    return '' +
      '<li id="ori-filter-option-' + value + '" class="dropdown-item' + (selected ? ' active' : '') + '"' +
        ' role="option" aria-label="' + escapeHtml(label) + '"' +
        ' aria-selected="' + (selected ? 'true' : 'false') + '" tabindex="0"' +
        ' data-value="' + value + '">' +
        escapeHtml(label) +
      '</li>';
  }

  function renderFilterOptions() {
    var html = filterOptionMarkup('all', 'All', state.filter === 'all');
    state.originators.forEach(function (o) {
      html += filterOptionMarkup(o.id, o.holder, state.filter === o.id);
    });
    $('ori-filter-menu').innerHTML = html;
    $('ori-filter').querySelector('.dropdown-label').textContent =
      state.filter === 'all' ? 'All' : originatorName(state.filter);
  }

  /* =========================================================================
     Add / Edit originator — OR-01, OR-02, OR-03, OR-11
     ========================================================================= */

  var FIELDS = ['holder', 'sort', 'account', 'user', 'bureau'];

  var FIELD_RULES = {
    holder: {
      input: $('ori-f-holder'),
      blank: 'Enter the account holder name',
      invalid: 'Max 18 characters',
      /* Flagged while typing: too long. */
      immediate: function (v) { return v.length > 18 ? 'Max 18 characters' : null; },
      valid: function (v) { return v.length > 0 && v.length <= 18; }
    },
    sort: {
      input: $('ori-f-sort'),
      blank: 'Enter a valid sort code in the format 00-00-00',
      invalid: 'Enter a valid sort code in the format 00-00-00',
      immediate: function (v) {
        if (/[^0-9-]/.test(v) || v.length > 8) return 'Enter a valid sort code in the format 00-00-00';
        return null;
      },
      valid: function (v) { return /^\d{2}-\d{2}-\d{2}$/.test(v); }
    },
    account: {
      input: $('ori-f-account'),
      blank: 'Enter a valid 8-digit account number',
      invalid: 'Enter a valid 8-digit account number',
      immediate: function (v) {
        if (/\D/.test(v) || v.length > 8) return 'Enter a valid 8-digit account number';
        return null;
      },
      valid: function (v) { return /^\d{8}$/.test(v); }
    },
    user: {
      input: $('ori-f-user'),
      blank: 'Enter a valid 6-digit user number',
      invalid: 'Enter a valid 6-digit user number',
      immediate: function (v) {
        if (/\D/.test(v) || v.length > 6) return 'Enter a valid 6-digit user number';
        return null;
      },
      valid: function (v) { return /^\d{6}$/.test(v); }
    },
    bureau: {
      input: $('ori-f-bureau'),
      blank: 'Enter a valid bureau number, e.g. ABC123',
      invalid: 'Enter a valid bureau number, e.g. ABC123',
      immediate: function (v) {
        if (/[^A-Za-z0-9]/.test(v) || v.length > 6) return 'Enter a valid bureau number, e.g. ABC123';
        return null;
      },
      valid: function (v) { return /^[A-Za-z0-9]{6}$/.test(v); }
    }
  };

  var originatorModal, reassignModal, deleteModal;
  var pendingDeleteId = null;

  function formValues() {
    var v = {};
    FIELDS.forEach(function (f) { v[f] = FIELD_RULES[f].input.value.trim(); });
    return v;
  }

  /* Buckholt shows the message through `.is-invalid` on the control and the
     sibling `.invalid-feedback`; both are documented Text input states. */
  function setFieldError(field, message) {
    var rule = FIELD_RULES[field];
    var feedback = document.querySelector('[data-error-for="' + field + '"]');
    if (message) {
      rule.input.classList.add('is-invalid');
      feedback.textContent = message;
    } else {
      rule.input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  }

  function fieldHasError(field) {
    return FIELD_RULES[field].input.classList.contains('is-invalid');
  }

  function anyFieldError() {
    return FIELDS.some(fieldHasError);
  }

  function clearAllFieldErrors() {
    FIELDS.forEach(function (f) { setFieldError(f, null); });
    $('ori-form-error-summary').hidden = true;
  }

  /* The originator that would become the default if the form were confirmed,
     or null if the default would not change. */
  function pendingDefaultTarget() {
    var editing = state.editingId ? originatorById(state.editingId) : null;
    var toggledOn = $('ori-f-default').checked;

    if (!editing) {
      /* Add originator: switching Make default on uses the OR-11-07 pattern. */
      return toggledOn ? { id: null, name: formValues().holder || 'the new originator' } : null;
    }

    var isCurrentDefault = editing.id === state.defaultId;

    if (isCurrentDefault && !toggledOn) {
      /* OR-11-04: the user must choose which originator takes over. */
      var chosen = $('ori-new-default-options').querySelector('input:checked');
      return chosen ? { id: chosen.value, name: originatorName(chosen.value) } : { id: null, name: null };
    }

    if (!isCurrentDefault && toggledOn) {
      /* OR-11-07 */
      return { id: editing.id, name: editing.holder };
    }

    return null;
  }

  function renderNewDefaultOptions() {
    var editing = state.editingId ? originatorById(state.editingId) : null;
    var section = $('ori-new-default-section');
    var show = !!editing && editing.id === state.defaultId && !$('ori-f-default').checked;

    if (!show) {
      section.hidden = true;
      $('ori-new-default-options').innerHTML = '';
      return;
    }

    var others = state.originators.filter(function (o) { return o.id !== state.defaultId; });
    /* "With two originators, the only other originator is preselected. With
       three or more, none is preselected." */
    var preselect = others.length === 1 ? others[0].id : null;
    var existing = $('ori-new-default-options').querySelector('input:checked');
    if (existing) preselect = existing.value;

    /* Buckholt Radio, Code & specs example 2 (radio group inside `.input`). */
    $('ori-new-default-options').innerHTML = state.originators.map(function (o) {
      var isCurrent = o.id === state.defaultId;
      return '' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="radio" name="ori-new-default"' +
            ' id="ori-new-default-' + o.id + '" value="' + o.id + '"' +
            (isCurrent ? ' disabled' : '') +
            (o.id === preselect ? ' checked' : '') + '>' +
          '<label class="form-check-label" for="ori-new-default-' + o.id + '">' +
            escapeHtml(o.holder) +
          '</label>' +
        '</div>';
    }).join('');

    section.hidden = false;
  }

  /* Default change warning (OR-11) and change warning (OR-03). They are
     independent: an edit can trigger either, both, or neither. Both alerts are
     in the DOM in the order OR-11-04 and OR-03-04 draw them — the default
     change sits directly below Choose new default, the change warning below
     that and directly below the Make default toggle when no default change
     applies. */
  function renderDefaultWarning() {
    var warning = $('ori-default-warning');
    var target = pendingDefaultTarget();

    if (!target || !target.name) { warning.hidden = true; return; }

    $('ori-default-warning-title').textContent = 'You’re changing the default originator';
    $('ori-default-warning-note').textContent =
      inheritedCount() + ' products currently use ' + originatorName(state.defaultId) +
      ' as the default originator and will use the new default originator ' + target.name +
      ' instead. Products that have been explicitly assigned will stay as they are.' +
      ' Please review your changes before confirming.';
    warning.hidden = false;
  }

  /* OR-03. Shown when the account holder, the sort code or the account number
     differs from the saved value AND the originator has at least one product.
     Never for an originator with 0 products, and never for User No. or Bureau
     No. alone. The body says which of the two kinds of change was made. None of
     this alters product assignments. */
  function renderChangeWarning() {
    var warning = $('ori-form-warning');
    var editing = state.editingId ? originatorById(state.editingId) : null;
    if (!editing) { warning.hidden = true; return; }

    var count = productCount(editing.id);
    if (count === 0) { warning.hidden = true; return; }

    var v = formValues();
    var nameChanged = v.holder !== editing.holder;
    var bankChanged = (v.sort !== editing.sort) || (v.account !== editing.account);
    if (!nameChanged && !bankChanged) { warning.hidden = true; return; }

    var note;
    if (nameChanged && bankChanged) {
      note = 'Future collections for these products will go to the new account,' +
             ' and they will show the new account holder name.' +
             ' Check the details before confirming.';
    } else if (bankChanged) {
      note = 'Future collections for these products will go to the new account.' +
             ' Check the sort code and account number before confirming.';
    } else {
      note = 'These products will show the new account holder name.' +
             ' Check the name before confirming.';
    }

    $('ori-form-warning-title').textContent =
      'This change will affect ' + plural(count, 'product');
    $('ori-form-warning-note').textContent = note;
    warning.hidden = false;
  }

  function isDirty() {
    var editing = state.editingId ? originatorById(state.editingId) : null;
    if (!editing) return FIELDS.some(function (f) { return formValues()[f] !== ''; });
    var v = formValues();
    if (FIELDS.some(function (f) { return v[f] !== editing[f]; })) return true;
    return $('ori-f-default').checked !== (editing.id === state.defaultId);
  }

  function updateSaveState() {
    var save = $('ori-originator-save');
    var target = pendingDefaultTarget();

    /* OR-11-04: with three or more originators the user must pick the new
       default before Confirm changes is available. */
    var awaitingNewDefault = !!target && target.name === null;

    if (state.editingId) {
      save.disabled = !isDirty() || anyFieldError() || awaitingNewDefault;
    } else {
      var v = formValues();
      var anyValue = FIELDS.some(function (f) { return v[f] !== ''; });
      save.disabled = !anyValue || anyFieldError() || awaitingNewDefault;
    }
  }

  function refreshOriginatorModal() {
    renderNewDefaultOptions();
    renderDefaultWarning();
    renderChangeWarning();
    updateSaveState();
  }

  function openOriginatorModal(id) {
    state.editingId = id || null;
    var editing = id ? originatorById(id) : null;

    clearAllFieldErrors();
    FIELDS.forEach(function (f) {
      FIELD_RULES[f].input.value = editing ? editing[f] : '';
    });
    $('ori-f-default').checked = !!editing && editing.id === state.defaultId;

    $('ori-originator-modal-title').textContent = editing ? 'Edit originator' : 'Add originator';
    $('ori-originator-save').querySelector('.button-label').textContent =
      editing ? 'Confirm changes' : 'Save';

    refreshOriginatorModal();
    originatorModal.show();
  }

  function saveOriginator() {
    var v = formValues();
    var problems = 0;

    /* OR-02-05: blank fields are only checked when Save is clicked. */
    FIELDS.forEach(function (f) {
      var rule = FIELD_RULES[f];
      if (v[f] === '') { setFieldError(f, rule.blank); problems++; return; }
      if (!rule.valid(v[f])) { setFieldError(f, rule.invalid); problems++; return; }
      setFieldError(f, null);
    });

    if (problems > 0) {
      $('ori-form-error-summary').hidden = false;
      updateSaveState();
      return;
    }
    $('ori-form-error-summary').hidden = true;

    var target = pendingDefaultTarget();
    var editing = state.editingId ? originatorById(state.editingId) : null;
    var defaultChanged = false;

    if (editing) {
      FIELDS.forEach(function (f) { editing[f] = v[f]; });
      if (target && target.id) { state.defaultId = target.id; defaultChanged = true; }
    } else {
      var created = { id: 'o' + (nextOriginatorSeq++) };
      FIELDS.forEach(function (f) { created[f] = v[f]; });
      state.originators.push(created);
      if (target) { state.defaultId = created.id; defaultChanged = true; }
    }

    originatorModal.hide();
    renderAll();

    if (defaultChanged) showToast('Default originator changed');
    else if (editing) showToast('Originator changes made');
    else showToast('New originator added');
  }

  /* =========================================================================
     Reassign originator — OR-06, OR-07, OR-08, OR-09
     ========================================================================= */

  function renderSelectedPanel(chosen) {
    var panel = $('ori-selected-panel');

    if (allSelected()) {
      /* OR-08: count only, with the List icon. */
      panel.innerHTML = '' +
        '<div class="text-block">' +
          '<h4 class="title-02">' +
            '<span class="icon"><i class="fa-regular fa-list" aria-hidden="true"></i></span>' +
            'All ' + chosen.length + ' products are selected' +
          '</h4>' +
          '<p>If you only want to update specific products, please clear your selection and choose again.</p>' +
        '</div>';
      return;
    }

    /* Buckholt List. Up to five names, then a static summary line. */
    var shown = chosen.slice(0, 5);
    var extra = chosen.length - shown.length;

    panel.innerHTML = '' +
      '<div class="text-block">' +
        '<h4 class="title-02">Selected products</h4>' +
      '</div>' +
      '<ul class="list">' +
        shown.map(function (p) {
          return '<li class="list-item">' + escapeHtml(p.name) + '</li>';
        }).join('') +
      '</ul>' +
      (extra > 0
        ? '<p class="body-02 ori-selected-panel-more">+ ' + plural(extra, 'more product') + '</p>'
        : '');
  }

  function openReassignModal() {
    var chosen = selectedProducts();
    if (chosen.length === 0) return;

    var everything = allSelected();

    $('ori-reassign-subtitle').textContent = everything
      ? 'You’re reassigning all products.'
      : 'You’re assigning a new originator to ' + plural(chosen.length, 'product') + '.';

    /* Warning by selection size (OR-07). */
    var warning = $('ori-reassign-warning');
    if (everything) {
      $('ori-reassign-warning-title').textContent = 'You’re reassigning all products';
      $('ori-reassign-warning-note').textContent =
        'This will replace the current originator assignments for every product' +
        ' in this configuration. Please review before confirming.';
      warning.hidden = false;
    } else if (chosen.length >= 6) {
      $('ori-reassign-warning-title').textContent = 'You’re making a bulk change';
      $('ori-reassign-warning-note').textContent =
        'This will change the originator for ' + chosen.length +
        ' selected products. Please review before confirming.';
      warning.hidden = false;
    } else {
      warning.hidden = true;
    }

    renderSelectedPanel(chosen);

    /* Preselect only when every selected product already shares an originator. */
    var resolved = chosen.map(resolvedOriginator);
    var mixed = resolved.some(function (r) { return r !== resolved[0]; });
    var current = mixed ? null : resolved[0];

    $('ori-choose-helper').textContent = mixed
      ? (everything
          ? 'These products currently use different originators. Choosing an originator will reassign all ' +
            chosen.length + ' selected products to the same one.'
          : 'These products currently use different originators. Choosing an originator will reassign all selected products to the same one.')
      : 'Selected products will use this originator once you confirm your changes.';

    $('ori-choose-options').innerHTML = state.originators.map(function (o) {
      return '' +
        '<div class="form-check">' +
          '<input class="form-check-input" type="radio" name="ori-choose"' +
            ' id="ori-choose-' + o.id + '" value="' + o.id + '"' +
            (o.id === current ? ' checked' : '') + '>' +
          '<label class="form-check-label" for="ori-choose-' + o.id + '">' +
            escapeHtml(o.holder) +
          '</label>' +
        '</div>';
    }).join('');

    $('ori-choose-options').dataset.current = current || '';
    $('ori-reassign-confirm').disabled = true;
    reassignModal.show();
  }

  function confirmReassign() {
    var pick = $('ori-choose-options').querySelector('input:checked');
    if (!pick) return;
    var targetId = pick.value;

    selectedProducts().forEach(function (p) {
      /* "Assigning a product to the current default removes its override." */
      p.originator = (targetId === state.defaultId) ? null : targetId;
    });

    state.selected = {};
    reassignModal.hide();
    renderAll();
    showToast('Originator changed');
  }

  /* ============================================================ Delete flow */

  function confirmDelete() {
    state.originators = state.originators.filter(function (o) { return o.id !== pendingDeleteId; });
    if (state.filter === pendingDeleteId) state.filter = 'all';
    pendingDeleteId = null;
    deleteModal.hide();
    renderAll();
    showToast('Originator deleted');
  }

  /* ================================================================= Render */

  function renderAll() {
    renderCards();
    renderFilterOptions();
    renderTable();
    renderSelectionBar();
  }

  /* ================================================================= Wiring */

  function wire() {
    originatorModal = new bootstrap.Modal($('ori-originator-modal'));
    reassignModal = new bootstrap.Modal($('ori-reassign-modal'));
    deleteModal = new bootstrap.Modal($('ori-delete-modal'));

    $('ori-add-originator').addEventListener('click', function () { openOriginatorModal(null); });

    /* Card actions. */
    $('ori-cards').addEventListener('click', function (e) {
      if (e.target.closest('.ori-blocked-action')) { e.preventDefault(); return; }
      var btn = e.target.closest('button');
      if (!btn) return;
      var action = btn.dataset.action;
      if (action === 'edit') openOriginatorModal(btn.dataset.id);
      if (action === 'delete') { pendingDeleteId = btn.dataset.id; deleteModal.show(); }
    });

    /* Search — filters on every keystroke (OR-04). */
    $('ori-search').addEventListener('input', function () {
      state.search = this.value;
      renderTable();
      renderSelectionBar();
    });

    /* Originator filter. */
    $('ori-filter-menu').addEventListener('click', function (e) {
      var item = e.target.closest('.dropdown-item');
      if (!item) return;
      state.filter = item.dataset.value;
      Array.prototype.forEach.call(this.children, function (li) {
        var on = li === item;
        li.classList.toggle('active', on);
        li.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      $('ori-filter').querySelector('.dropdown-label').textContent = item.textContent.trim();
      renderTable();
      renderSelectionBar();
    });

    /* Row and header selection. */
    $('ori-table-region').addEventListener('change', function (e) {
      var box = e.target;
      if (box.id === 'ori-select-all') {
        var rows = visibleProducts();
        var turnOn = box.checked;
        rows.forEach(function (p) {
          if (turnOn) state.selected[p.id] = true;
          else delete state.selected[p.id];
        });
        renderTable();
        renderSelectionBar();
        return;
      }
      if (box.dataset.product) {
        if (box.checked) state.selected[box.dataset.product] = true;
        else delete state.selected[box.dataset.product];
        box.closest('tr').classList.toggle('ori-row-selected', box.checked);
        syncSelectAll();
        renderSelectionBar();
      }
    });

    $('ori-clear-selection').addEventListener('click', function () {
      state.selected = {};
      renderTable();
      renderSelectionBar();
    });

    $('ori-reassign').addEventListener('click', openReassignModal);

    $('ori-choose-options').addEventListener('change', function () {
      var pick = this.querySelector('input:checked');
      var current = this.dataset.current;
      /* Disabled until a different originator is chosen (OR-06 rule). */
      $('ori-reassign-confirm').disabled = !pick || pick.value === current;
    });

    $('ori-reassign-confirm').addEventListener('click', confirmReassign);
    $('ori-delete-confirm').addEventListener('click', confirmDelete);

    /* Originator form. */
    FIELDS.forEach(function (f) {
      var rule = FIELD_RULES[f];

      rule.input.addEventListener('input', function () {
        var v = this.value.trim();
        if (v === '') setFieldError(f, null);
        else setFieldError(f, rule.immediate(v));
        if (!anyFieldError()) $('ori-form-error-summary').hidden = true;
        refreshOriginatorModal();
      });

      /* "Values that are too short show theirs when the user leaves the field." */
      rule.input.addEventListener('blur', function () {
        var v = this.value.trim();
        if (v !== '' && !rule.valid(v)) setFieldError(f, rule.invalid);
        refreshOriginatorModal();
      });
    });

    $('ori-f-default').addEventListener('change', refreshOriginatorModal);
    $('ori-new-default-options').addEventListener('change', refreshOriginatorModal);
    $('ori-originator-save').addEventListener('click', saveOriginator);

  }

  /* The BACS section tabs. Import, Process and Calendar live in the BACS
     Import prototype; Originators is this page, so its link is inert. */
  var BACS_TAB_PATHS = {
    process: '../BACS-import/index.html#/process',
    import: '../BACS-import/index.html#/import',
    originators: '#',
    calendar: '../BACS-import/index.html#/calendar'
  };

  /* Options must exist before `dropdown.js` binds on DOMContentLoaded, so the
     first render runs at parse time; the rest waits for the Bootstrap bundle
     to be ready. The chrome mounts now too, so the page never paints without
     its top bar. */
  Shell.mountChrome({ sidebar: 'bacs' });
  $('ori-bacs-tabs').innerHTML = Shell.bacsTabs('originators', BACS_TAB_PATHS);
  $('ori-bacs-tabs').addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
  renderFilterOptions();

  document.addEventListener('DOMContentLoaded', function () {
    Shell.startClock();
    wire();
    renderAll();
  });
}());
