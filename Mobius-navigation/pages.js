/* ============================================================================
   Mobius navigation prototype — page, panel and flow content
   ============================================================================

   The content of every page in `reference/mobius-live-policy.html`, rebuilt
   from Buckholt components. Structure, behaviour and wording follow the
   prototype; markup, classes and tokens are Buckholt's.

   Exposes `MobiusPages`:

     ui            markup helpers (Card, Key-value, Table, Button, inputs…)
     app / client / policy     page renderers, by page id
     panels        side panel content, by key: [title, body, toast, save label]
     heading(route)            the page heading's actions

   A page renderer returns an array of Panel contents. The router puts the
   page heading in a Panel of its own and each returned string in the next
   one, per patterns/page-layout: Page body → Frame → Pane → Panels.

   Wherever the prototype says existing Mobius content "sits here", the page
   shows a clearly marked placeholder and nothing is invented in its place.
   ============================================================================ */
(function (global) {
  'use strict';

  var F = global.MobiusFixtures;
  var M = global.MobiusModel;
  var ICON = M.ICON;

  /* =============================================================== Helpers */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Wording: escape, then turn [[text]] into a terminology mark. */
  function t(s) {
    return esc(s).replace(/\[\[(.+?)\]\]/g, '<mark class="mob-term">$1</mark>');
  }

  /* Wording for places that cannot hold markup: aria-labels, titles. */
  function plain(s) {
    return String(s == null ? '' : s).replace(/\[\[(.+?)\]\]/g, '$1');
  }

  var uid = 0;
  function id(prefix) { uid += 1; return prefix + '-' + uid; }

  /* Fill the @tokens fixtures use for values copied from the record. */
  function fill(v, p) {
    if (typeof v !== 'string' || v.charAt(0) !== '@') return v;
    var c = F.client;
    return {
      '@clientRef': c.ref, '@email': c.email,
      '@start': p ? p.start : '', '@end': p ? p.end : '',
      '@premium': p ? p.premium : '', '@ref': p ? p.ref : '',
      '@status': p ? p.status : '', '@inception': p ? p.inception : ''
    }[v];
  }

  /* ------------------------------------------------------------- Status tag
     Buckholt Tag, status variant, with the documented icon. Every status
     carries its text, so status never relies on colour alone. Incomplete has
     no status colour in the prototype, so it is the plain read-only Tag. */
  var STATUS = {
    'Live': { variant: 'success', icon: 'fa-circle-check', label: '[[Live]]' },
    'Prospect': { variant: 'warning', icon: 'fa-triangle-exclamation', label: 'Prospect' },
    'Lapsed': { variant: 'warning', icon: 'fa-triangle-exclamation', label: 'Lapsed' },
    'Automatic Decline': { variant: 'error', icon: 'fa-circle-exclamation', label: 'Automatic Decline' },
    'Incomplete': { variant: null, icon: null, label: 'Incomplete' }
  };

  function statusText(p) { return t(STATUS[p.status].label); }

  /* `small` is the documented `.tag-sm`, used where space is tight (the
     menu). The small status Tag is drawn without its icon, as Tag's own
     Code & specs example 5 draws it. */
  function statusTag(p, small, prefix) {
    var s = STATUS[p.status];
    var cls = 'tag' + (small ? ' tag-sm' : '') + (s.variant ? ' tag-status tag-status-' + s.variant : '');
    return '<span class="' + cls + '">' +
      (!small && s.icon ? '<span class="icon"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i></span>' : '') +
      '<span class="tag-label">' + (prefix || '') + t(s.label) + '</span>' +
    '</span>';
  }

  /* ---------------------------------------------------------------- Buttons
     Buckholt Button: `.btn` + variant, `.btn-icon` before `.button-label`.
     One primary per screen (Button rules; Common actions: "normally limited
     to one per screen context"). A page's primary is its heading action
     where it has one; otherwise its one main card action. Side panels and
     confirmations are their own context and keep their own primary.

     Hierarchy, so the page is not a wall of outlined Buttons:
       primary    the one main action of the screen
       secondary  only beside the primary in the page heading, a filter
                  form's Apply, and Back in a flow
       ghost      everything else — card and table actions. This is the
                  default. As in Buckholt's table-action pattern, a ghost
                  action carries its icon and its label.
     Icons in a set are all or none (Common actions): a set gets icons only
     when every action in it has a recognised icon.
     `href` makes it an anchor — only for actions that open a page. */
  function btn(label, o) {
    o = o || {};
    var cls = 'btn btn-' + (o.variant || 'ghost') + (o.danger ? ' btn-danger' : '') + (o.size ? ' btn-' + o.size : '');
    var inner = (o.icon ? '<div class="btn-icon"><i class="' + o.icon + '" aria-hidden="true"></i></div>' : '') +
      (label ? '<span class="button-label">' + t(label) + '</span>' : '') + (o.after || '');
    var attrs = o.attrs || '';
    if (o.href) return '<a class="' + cls + '" href="' + o.href + '"' + attrs + '>' + inner + '</a>';
    return '<button type="button" class="' + cls + '"' + attrs + (o.disabled ? ' disabled' : '') + '>' + inner + '</button>';
  }

  /* Action icons: the Buckholt catalogue's mapping where it has one; GAP
     where it does not (listed in PROTOTYPE.md). */
  var AI = {
    add: 'fa-regular fa-plus', edit: 'fa-regular fa-pencil', filter: 'fa-regular fa-bars-filter',
    clear: 'fa-regular fa-xmark', pdf: 'fa-regular fa-file-pdf', download: 'fa-regular fa-arrow-down-to-bracket',
    upload: 'fa-regular fa-arrow-up-from-bracket', bin: 'fa-regular fa-trash-can', view: 'fa-regular fa-eye',
    notify: 'fa-regular fa-bell', email: 'fa-regular fa-envelope', save: 'fa-regular fa-floppy-disk',
    more: 'fa-regular fa-chevron-down', fewer: 'fa-regular fa-chevron-up',
    sms: 'fa-regular fa-message-sms', print: 'fa-regular fa-print'      // GAP, GAP
  };

  /* Button set. `button-set` stays the last class: Buckholt's set rules match
     `[class$=-set]`, so a modifier must come before it. */
  function set(buttons, modifier) {
    return '<div class="' + (modifier ? modifier + ' ' : '') + 'button-set">' + buttons.join('') + '</div>';
  }

  /* A value that opens a panel (Policy summary, Excesses, Endorsements): a
     Buckholt standalone Link. It acts in place rather than navigating, so it
     is role="button", and Space works on it as well as Enter. A Link has no
     disabled state, so an unavailable one is plain muted text. */
  function panelButton(label, key, arg, disabled) {
    if (disabled) return '<span class="mob-not-set">' + t(label) + '</span>';
    return '<a class="link-standalone" href="#" role="button" data-panel="' + key + '"' +
      (arg != null ? ' data-arg="' + esc(arg) + '"' : '') + ' aria-haspopup="dialog">' + t(label) + '</a>';
  }

  /* Show more / load more and similar in-place actions on tables and content:
     a left-aligned Buckholt standalone Link (`.icon` before the text, as
     documented). It acts in place, so it is role="button". */
  function moreLink(label, attrs, icon) {
    return '<a class="link-standalone mob-link" href="#" role="button"' + (attrs || '') + '>' +
      (icon ? '<span class="icon"><i class="' + icon + '" aria-hidden="true"></i></span>' : '') + t(label) + '</a>';
  }

  /* Navigation from inside a card: Buckholt standalone Link with its arrow. */
  function standalone(label, url) {
    return '<a class="link-standalone mob-link" href="' + url + '">' +
      '<span class="icon"><i class="fa-regular fa-arrow-right" aria-hidden="true"></i></span>' + t(label) + '</a>';
  }

  /* -------------------------------------------------------------------- Card
     Buckholt Card: `.card > .card-body > .text-block`. A card action sits on
     the heading row beside the Text block, in its own Button set. */
  function card(title, body, o) {
    o = o || {};
    var hid = id('card-title');
    return '<section class="card mob-card"' + (o.id ? ' id="' + o.id + '"' : '') + ' aria-labelledby="' + hid + '">' +
      '<div class="card-body">' +
        '<div class="mob-card-head">' +
          '<div class="text-block">' +
            '<h2 class="title-02" id="' + hid + '">' + t(title) + '</h2>' +
            (o.sub ? '<p>' + t(o.sub) + '</p>' : '') +
          '</div>' +
          (o.actions ? set(o.actions) : '') +
        '</div>' +
        body +
      '</div>' +
    '</section>';
  }

  function empty(text) { return '<p class="mob-empty">' + t(text) + '</p>'; }

  /* Buckholt Alert, info. Used for the prototype's note strips. */
  function note(text, title) {
    return '<div class="alert alert-info" role="note">' +
      '<div class="alert-content">' +
        '<span class="alert-icon"><i class="fa-solid fa-circle-info" aria-hidden="true"></i></span>' +
        '<div class="alert-body">' +
          '<div class="alert-message"><h6>' + t(title || text) + '</h6></div>' +
          (title ? '<div class="alert-note">' + t(text) + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* A clearly marked placeholder for existing Mobius content the prototype
     does not reproduce. The text is the prototype's own. */
  function placeholder(text) {
    return '<div class="mob-placeholder" data-placeholder>' +
      note(text, 'Placeholder: existing Mobius content') +
    '</div>';
  }

  /* ------------------------------------------------------------- Key-value
     Fields are stacked Key-value pairs on the Bootstrap grid, so the column
     count follows the breakpoints rather than a local grid. */
  function fields(arr, cols, p) {
    var col = cols === 2 ? 'col-12 col-md-6' : 'col-12 col-sm-6 col-lg-4';
    return '<div class="row gy-4 mob-fields">' + arr.map(function (f) {
      var v = fill(f[1], p);
      return '<div class="' + col + '">' +
        '<div class="key-value key-value-stacked">' +
          '<span class="key">' + t(f[0]) + '</span>' +
          (v === '' || v == null
            ? '<span class="value mob-not-set">Not set</span>'
            : '<span class="value">' + (f[2] ? v : t(v)) + '</span>') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  /* Key-value table. A value may be markup (a panel button) when the third
     item is true. */
  function kvTable(rows) {
    return '<div class="key-value-table mob-kv-table">' + rows.map(function (r) {
      return '<div class="key-value">' +
          '<span class="key">' + t(r[0]) + '</span>' +
          '<span class="value">' + (r[2] ? r[1] : t(r[1])) + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* Statistics tiles: a Key-value grid of stacked, flipped pairs, so the
     figure leads and the label sits under it. */
  /* `spanFirst` lets the first tile take the full row, so one grid can hold
     a 1 + 2 arrangement with the grid's own gap between every tile. */
  function tiles(arr, columns, spanFirst) {
    return '<div class="grid key-value-grid" style="--columns: ' + (columns || 1) + ';">' + arr.map(function (x, i) {
      return '<div class="key-value-item"' + (spanFirst && i === 0 ? ' style="grid-column: 1 / -1;"' : '') + '>' +
        '<div class="key-value key-value-stacked key-value-flipped key-value-lg">' +
          '<span class="key">' + t(x[1]) + '</span>' +
          '<span class="value">' + t(x[0]) + '</span>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  /* ------------------------------------------------------------------ Table
     Buckholt Table: `.table-container > .table-content > table.table`, with
     `.table-header-label` and the `.table-gap` row. Cells are text unless
     the row says otherwise ({ html: true }). `hrefs` makes rows clickable;
     every such row also carries a real link, so the keyboard path is a link. */
  function table(head, rows, o) {
    o = o || {};
    return '<div class="table-container">' +
      '<div class="table-content">' +
        /* Named with aria-label rather than a visually hidden <caption>: a
           caption keeps 1px of height inside `.table-content`, which then
           scrolls vertically. */
        '<table class="table' + (o.cls ? ' ' + o.cls : '') + '"' + (o.caption ? ' aria-label="' + esc(plain(o.caption)) + '"' : '') + '>' +
          '<thead><tr>' + head.map(function (h) {
            /* A column with no visible heading still gets a name: '' is an
               actions column, { hidden: 'Select' } names it explicitly. */
            var hidden = h === '' ? 'Actions' : (h && h.hidden);
            return '<th scope="col"' + (hidden ? ' class="col-fit"' : '') + '><div class="table-header-label">' +
              (hidden ? '<span class="visually-hidden">' + esc(hidden) + '</span>' : t(h)) + '</div></th>';
          }).join('') + '</tr></thead>' +
          '<tbody>' +
            '<tr class="table-gap"><td colspan="100%"></td></tr>' +
            rows.map(function (r, i) {
              var href = o.hrefs && o.hrefs[i];
              return '<tr' + (href ? ' class="mob-row-link" data-href="' + href + '"' : '') + '>' +
                r.map(function (c) {
                  if (c && typeof c === 'object') return '<td' + (c.fit ? ' class="col-fit"' : '') + '>' + c.html + '</td>';
                  return '<td>' + t(c) + '</td>';
                }).join('') + '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
  }

  function cell(html, fit) { return { html: html, fit: fit }; }

  /* ------------------------------------------------------------------- Tabs
     The prototype's segmented controls switch content in place, which is
     Buckholt Tabs: Bootstrap pill behaviour, one `.tab-pane` per tab. */
  function tabs(labels, panes) {
    var base = id('tabs');
    return '<div class="tabs">' +
      '<div class="tab-items"><div class="tab-items-scroll">' +
        '<ul class="nav nav-underline" role="tablist">' + labels.map(function (l, i) {
          return '<li class="nav-item" role="presentation">' +
            '<button class="nav-link' + (i ? '' : ' active') + '" id="' + base + '-' + i + '-tab" data-bs-toggle="pill"' +
              ' data-bs-target="#' + base + '-' + i + '" type="button" role="tab" aria-controls="' + base + '-' + i + '"' +
              ' aria-selected="' + (i ? 'false' : 'true') + '">' + t(l) + '</button>' +
          '</li>';
        }).join('') + '</ul>' +
      '</div></div>' +
      '<div class="tab-content">' + panes.map(function (p, i) {
        return '<div class="tab-pane fade' + (i ? '' : ' active show') + '" id="' + base + '-' + i + '" role="tabpanel"' +
          ' aria-labelledby="' + base + '-' + i + '-tab" tabindex="0">' + p + '</div>';
      }).join('') + '</div>' +
    '</div>';
  }

  /* ----------------------------------------------------------------- Inputs
     Buckholt Text input, Select, Text area, Radio and Checkbox, each with a
     real label paired to its control. */
  function input(fid, label, value, type, readonly) {
    return '<div class="input">' +
      '<div class="input-label"><label for="' + fid + '" class="form-label">' + t(label) + '</label></div>' +
      '<div class="response text-input">' +
        '<input type="' + (type || 'text') + '" class="form-control" id="' + fid + '" value="' + esc(value || '') + '"' + (readonly ? ' readonly' : '') + '>' +
      '</div>' +
    '</div>';
  }

  /* A disabled Select is drawn read-only, Buckholt's `.readonly` + `disabled`. */
  function select(fid, label, options, readonly) {
    return '<div class="input">' +
      '<div class="input-label"><label for="' + fid + '" class="form-label">' + t(label) + '</label></div>' +
      '<div class="response select-input">' +
        '<select class="form-select' + (readonly ? ' readonly' : '') + '" id="' + fid + '"' + (readonly ? ' disabled' : '') + '>' +
          options.map(function (x) { return '<option>' + t(x) + '</option>'; }).join('') +
        '</select>' +
      '</div>' +
    '</div>';
  }

  function textarea(fid, label, rows) {
    return '<div class="input">' +
      '<div class="input-label"><label for="' + fid + '" class="form-label">' + t(label) + '</label></div>' +
      '<div class="response textarea-input">' +
        '<textarea class="form-control" id="' + fid + '" rows="' + (rows || 3) + '"></textarea>' +
      '</div>' +
    '</div>';
  }

  /* Yes / No: Buckholt's grouped Radio. The group is a fieldset so its label
     names the group (the documented `label[for]` has nothing to point at). */
  function yesNo(name, label, value) {
    var gid = id(name);
    return '<fieldset class="input">' +
      '<div class="input-label"><legend class="form-label">' + t(label) + '</legend></div>' +
      '<div class="response check-input mob-inline-checks">' +
        ['Yes', 'No'].map(function (v) {
          return '<div class="form-check">' +
            '<input class="form-check-input" type="radio" name="' + gid + '" id="' + gid + '-' + v + '"' + (value === v ? ' checked' : '') + '>' +
            '<label class="form-check-label" for="' + gid + '-' + v + '">' + v + '</label>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</fieldset>';
  }

  function checkbox(fid, label) {
    return '<div class="form-check">' +
      '<input class="form-check-input" type="checkbox" value="" id="' + fid + '">' +
      '<label class="form-check-label" for="' + fid + '">' + t(label) + '</label>' +
    '</div>';
  }

  /* Buckholt Switch. `toast` makes a change announce itself, as the
     prototype's portal access switch does. */
  function switchInput(fid, label, toast) {
    return '<div class="form-check form-switch">' +
      '<input class="form-check-input" type="checkbox" role="switch" id="' + fid + '"' + (toast ? ' data-switch-toast="' + esc(toast) + '"' : '') + '>' +
      '<div class="input-label"><label class="form-check-label" for="' + fid + '">' + t(label) + '</label></div>' +
    '</div>';
  }

  /* Buckholt Form: `.form > .form-body`. Actions live in the panel footer or
     the flow's own action row, so there is no `.form-actions` here. */
  function form(items) {
    return '<form class="form" onsubmit="return false"><div class="form-body">' + items.join('') + '</div></form>';
  }

  /* Several related fields across the grid, stacking on narrow screens. */
  function fieldGrid(items, cols) {
    var col = cols === 3 ? 'col-12 col-md-6 col-xl-4' : 'col-12 col-md-6';
    return '<div class="row input-row mob-field-grid">' + items.map(function (x) {
      return '<div class="' + col + '">' + x + '</div>';
    }).join('') + '</div>';
  }

  /* A filter bar: Buckholt inputs across the Bootstrap grid at the card's
     full width, with its action at the end of the fields, left aligned
     (Forms: actions at the completion point). Not `.form-body`, which is
     capped at 36rem for a stacked form and squeezes three columns. */
  function filterBar(items, actions, label) {
    return '<form class="mob-filters"' + (label ? ' role="search" aria-label="' + esc(label) + '"' : '') + ' onsubmit="return false">' +
      fieldGrid(items, 3) + (actions && actions.length ? set(actions) : '') +
    '</form>';
  }

  function list(items) {
    return '<ul class="list">' + items.map(function (x) { return '<li class="list-item">' + x + '</li>'; }).join('') + '</ul>';
  }

  /* Two columns on wide screens: main content and a narrower side column,
     each a Panel of Cards. */
  function columns(main, side) {
    return '<div class="row">' +
      '<div class="col-12 col-xl-8"><div class="page-panel">' + main.join('') + '</div></div>' +
      '<div class="col-12 col-xl-4"><div class="page-panel">' + side.join('') + '</div></div>' +
    '</div>';
  }

  function stack(items) { return '<div class="page-panel mob-stack">' + items.join('') + '</div>'; }

  /* ======================================================== Shared content */

  var S = null; // the router's state, set by init()

  /* "Show the 5 most recent policies, sorted by cover start, newest first,
     with a Load more button." One count is shared by every policy list. */
  function shownPolicies() { return F.policies.slice(0, S.polShown); }

  function loadMoreButton(where, size) {
    var total = F.policies.length;
    var rest = total - S.polShown;
    if (rest > 0) {
      return moreLink(where === 'table' ? 'Load ' + Math.min(5, rest) + ' more' : 'Load ' + Math.min(5, rest) + ' more (' + rest + ' remaining)',
        ' data-more="1" data-focus-id="more-' + where + '"', AI.more);
    }
    if (total > 5) {
      return moreLink('Show fewer', ' data-more="0" data-focus-id="more-' + where + '"', AI.fewer);
    }
    return '';
  }

  function policyHref(p, page) { return '#p/' + p.id + '/' + (page || 'summary'); }

  function policiesTable() {
    var shown = shownPolicies();
    var c = F.client;
    var more = loadMoreButton('table');
    return table(['[[Reference]]', '[[Cover start]]', '[[Cover end]]', 'Status', '[[Business line]]', 'Insurer', 'Risk info'],
      shown.map(function (p) {
        return [cell('<a href="' + policyHref(p) + '">' + esc(p.ref) + '</a>'), p.start.split(' ')[0], p.end.split(' ')[0],
          cell(statusTag(p)), c.businessLine, c.insurer, c.riskInfo];
      }),
      { hrefs: shown.map(function (p) { return policyHref(p); }), caption: 'Client policies' }) +
      '<div class="mob-table-foot">' +
        '<p class="support-01" aria-live="polite">Showing 1 to ' + shown.length + ' of ' + F.policies.length + ', most recent first</p>' +
        more +
      '</div>';
  }

  function clientDetailsFields() {
    var c = F.client;
    return fields([['Name', c.name], ['Date of birth', c.dob], ['Address', c.address], ['Email address', c.email],
      ['Telephone number', c.tel], ['[[Client since]]', c.since]]);
  }

  function activityFilters(prefix, policy) {
    return filterBar([
      input(prefix + 'd', 'Start date to end date', '01/10/2026 to 01/10/2026'),
      input(prefix + 'o', 'Operator', ''),
      select(prefix + 't', 'Activity type', ['Select']),
      input(prefix + 'c', 'Client ref', F.client.ref, 'text', true),
      input(prefix + 'p', 'Policy / quote ref', policy ? policy.ref : '', 'text', !!policy),
      select(prefix + 's', 'Policy status', [policy ? policy.status : 'Select'])
    ], [btn('Apply filters', { variant: 'secondary', icon: AI.filter })], 'Filter activity');
  }

  /* Acts on the whole audit trail, so it sits in the card heading. */
  function savePdf() { return btn('Save as PDF', { size: 'sm', icon: AI.pdf, attrs: ' data-toast="Audit trail saved as PDF"' }); }

  /* ================================================================== App */

  /* Does the mock data hold anything for this search? Name, reference,
     email, postcode or address of the client, or any policy reference. */
  function matches(q) {
    var n = String(q || '').trim().toLowerCase();
    if (!n) return false;
    var c = F.client;
    return [c.name, c.ref, c.email, c.postcode, c.address].concat(F.policies.map(function (p) { return p.ref; }))
      .some(function (v) { return String(v).toLowerCase().indexOf(n) >= 0; });
  }

  var app = {
    /* Broking's landing page: the results of the search run from the menu.
       Matching is against the mock client and their policies, so swapping in
       a real search API only replaces matches(). */
    search: function () {
      var c = F.client;
      var q = S.query;
      var found = matches(q);
      var filters = card('Search results', filterBar([
        select('sb', 'Brand', ['Select', 'Krypton']),
        select('sl', 'Line of business', ['Select', 'Open Market Motor']),
        select('ss', 'Policy status', ['Select', 'Live', 'Prospect', 'Incomplete', 'Lapsed', 'Automatic Decline'])
      ], [btn('Apply', { variant: 'secondary', icon: AI.filter }), btn('Clear', { icon: AI.clear })], 'Filter search results'));
      if (!found) {
        return [stack([filters,
          card('No clients found for “' + q + '”', empty('Check the name, reference or email and search again, or create a new client.'))])];
      }
      return [
        stack([
          filters,
          card('1 client found for “' + q + '”',
            table(['Name', 'Reference', 'Address', 'Postcode'],
              [[cell('<a href="#c/summary"><strong>' + esc(c.name) + '</strong></a>'), c.ref, c.addressShort, c.postcode]],
              { hrefs: ['#c/summary'], caption: 'Clients found' }) +
            fields([['Email address', c.email], ['[[Date of birth]]', c.dob], ['Policies', F.policies.length + ' linked']]) +
            standalone('Open client', '#c/summary') +
            '<div class="text-block"><h3 class="title-01">Client policies</h3></div>' +
            policiesTable())
        ])
      ];
    },

    /* The other Mobius modules are outside this prototype. */
    activity: function () { return [card('Activity', placeholder('The existing Mobius Activity module sits here.'))]; },
    renewals: function () { return [card('Renewals', placeholder('The existing Mobius Renewals module sits here.'))]; },
    bordereau: function () { return [card('Bordereau', placeholder('The existing Mobius Bordereau module sits here.'))]; },
    accounts: function () { return [card('Accounts', placeholder('The existing Mobius Accounts module sits here.'))]; },

    newclient: function () { return flowNewClient(); }
  };

  /* =============================================================== Client */

  var client = {
    summary: function () {
      var c = F.client;
      var st = F.clientStats;
      return [columns([
        card('Client header', empty('No client header set.'), { actions: [btn('Add', { size: 'sm', icon: AI.add, attrs: ' data-panel="cheader" aria-haspopup="dialog"' })] }),
        card('Client details', fields([['Name', c.name], ['Date of birth', c.dob], ['Client reference', c.ref],
          ['Telephone', c.tel], ['Email', c.email], ['Address', c.address]])),
        card('Client policies', policiesTable(), { sub: 'Select a policy to open it' }),
        card('Linked clients', empty('There are no linked clients.'), { id: 'linked', actions: [btn('Add client link', { size: 'sm', icon: AI.add, attrs: ' data-panel="clink" aria-haspopup="dialog"' })] }),
        card('Suggested links', empty('There are no suggested clients.')),
        card('Connected clients', empty('This client doesn’t have any connected clients.'), { actions: [btn('Add client connection', { size: 'sm', icon: AI.add, attrs: ' data-panel="cconn" aria-haspopup="dialog"' })] })
      ], [
        card('Statistics', tiles([[st.livePolicies, '[[Live policies]]'], [st.gwp, 'Total active GWP'], [st.outstanding, 'Total outstanding balance']]) +
          moreLink('Show statistics for more clients', ' data-toast="Statistics for more clients"')),
        card('Additional info', tiles([[st.openClaims, 'Open claims'], [st.connected, 'Connected clients'], [st.loyaltyYears, 'Loyalty years']], 2, true)),
        card('Open customer portal access', switchInput('mob-portal-access', 'Client access to Open Customer Portal', 'Customer portal access'))
      ])];
    },
    business: function () {
      return [stack([
        card('Client policies',
          table(['[[Reference]]', 'Status', '[[Business line]]', '[[Cover start]]'], F.policies.map(function (p) {
            return [p.ref, cell(statusTag(p)), F.client.businessLine, p.start.split(' ')[0]];
          }), { caption: 'Client policies' }), { sub: 'Select a policy to display its business details and business contacts below.' }),
        card('Business details', empty('There are no business details.')),
        card('Business contacts', empty('There are no business contacts.'))
      ])];
    },
    ctx: function () {
      var c = F.client;
      return [stack([
        card('Summary', fields([['Account name', c.name], ['Client reference', c.ref], ['Current balance due', '£0.00'], ['Total outstanding balance', '£0.00']]) +
          table(['Statistics', 'Year to date', 'Last year'], F.accountStatistics.zero, { caption: 'Statistics' })),
        card('Open items', empty('There are no open items.')),
        card('Settled items', empty('There are no settled items.'))
      ])];
    },
    cactivity: function () {
      return [card('Activity', activityFilters('ca', null) +
        table(['Date and time', 'Operator', 'Activity type', 'Description', 'Policy / quote ref', 'Policy status'], F.clientActivity, { caption: 'Activity' }),
        { sub: 'Activity shows the full audit trail record. Search by date range and filter by multiple criteria. You can preview each activity and save the audit trail as a PDF.', actions: [savePdf()] })];
    },
    ccomplaints: function () {
      return [card('Complaints', empty('There are no complaints.'), { actions: [btn('Add complaint', { variant: 'primary', size: 'sm', icon: AI.add, attrs: ' data-panel="ccomplaint" aria-haspopup="dialog"' })] })];
    },
    checks: function () {
      return [card('Sanctions checks', table(['Status', 'Matches above threshold', 'Operator', 'Date and time'], F.sanctionsChecks, { caption: 'Sanctions checks' }),
        { actions: [btn('New sanctions check', { variant: 'primary', size: 'sm', attrs: ' data-confirm="sanctions" aria-haspopup="dialog"' })] })];
    },
    newquote: function () { return flowNewQuote('#c/summary'); }
  };

  /* ====================================================== Policy details */

  function detailCards(sec, p, o) {
    o = o || {};
    return sec.cards.map(function (c) {
      var body = '';
      if (c[1].length) {
        body += o.editable
          ? form(c[1].map(function (f, i) {
              return input(sec.key + '-' + id('f') + '-' + i, f[0], o.blank ? '' : fill(f[1], p));
            }))
          : fields(o.blank ? c[1].map(function (f) { return [f[0], '']; }) : c[1], 3, p);
      }
      var tb = c[2] && F.policyDetailTables[c[2]];
      if (tb) {
        if (tb.message) body += empty(tb.message) + (o.consentAdd ? set([btn('Add', { size: 'sm', icon: AI.add, attrs: ' data-panel="consent" aria-haspopup="dialog"' })]) : '');
        else if (o.blank) { if (tb.empty) body += empty(tb.empty); }
        else body += table(tb.head, tb.rows, { caption: c[0] });
      }
      return card(c[0], body);
    }).join('');
  }

  /* =============================================================== Policy */

  function summaryFor(p) {
    var rq = 'Please re-quote the policy';
    var decl = 'This product has referred or declined.';
    var rows = [['Source', 'N/A'],
      ['Insurer policy number', p.ipn ? panelButton(p.ipn, 'insurer') : panelButton('Add manually', 'insurer'), true]];
    rows.push(['Quote details and conditions',
      p.kind === 'incomplete' ? rq : (p.kind === 'prospect' ? panelButton('See details', 'conditions', null, true) : panelButton('See details', 'conditions')),
      p.kind !== 'incomplete']);
    rows.push(['Breakdown', p.kind === 'incomplete' ? rq : panelButton('See details', 'breakdown'), p.kind !== 'incomplete']);
    if (p.kind === 'decline') rows.push(['Declined', panelButton('See details', 'declined'), true]);
    rows.push(['Consecutive years', p.kind === 'incomplete' ? '0' : panelButton('0', 'years'), p.kind !== 'incomplete']);
    rows.push(['Manual amendments', p.kind === 'incomplete' ? rq : panelButton('See details', 'amendments'), p.kind !== 'incomplete']);
    if (p.stopRenewal) rows.push(['Stop renewal', p.stopRenewal]);

    function block(title, items, emptyText) {
      if (p.kind === 'decline') return card(title, empty(decl + ' ' + title + ' are not available to view.'));
      if (p.kind === 'incomplete') return card(title, empty(rq));
      if (!items || !items.length) return card(title, empty(emptyText));
      if (typeof items[0] === 'string') {
        return card(title, list(items.map(function (x) { return panelButton(x, 'endorse', x); })));
      }
      return card(title, kvTable(items.map(function (x) { return [x[0], panelButton(x[1], 'excess', x[0] + '|' + x[1]), true]; })));
    }

    var addOns = p.kind === 'decline' ? empty(decl + ' Add-ons are not available to view.')
      : p.kind === 'incomplete' ? empty(rq) : empty('No add-ons for this policy.');

    return [columns([
      card('Policy header', empty('No policy header set.'), { actions: [btn('Edit', { size: 'sm', icon: AI.edit, attrs: ' data-panel="header" aria-haspopup="dialog"' })] }),
      card('Client details', clientDetailsFields()),
      card('Policy details', fields([['[[Reference]]', p.ref], ['Business line', F.client.businessLine], ['Brand', F.client.brand],
        ['Policy status', statusText(p), true], ['Inception date', p.inception], ['Premium', p.premium],
        ['Cover start', p.start], ['Cover end', p.end], ['Duration', p.dur]])),
      card('Driver details', table(['Name', 'Date of birth', 'Relationship'], [[F.client.name, F.driver.dob, '[[Policyholder]]']], { caption: 'Driver details' })),
      card('Vehicle details', table(['Vehicle registration', 'Make', 'Model', 'Annual mileage'],
        [[F.vehicle.reg, F.vehicle.make, F.vehicle.model, F.vehicle.mileage]], { caption: 'Vehicle details' }))
    ], [
      card('Policy summary', kvTable(rows)),
      block('Endorsements', p.endorse, 'There are no endorsements applied to this policy.'),
      block('Excesses', p.exc, 'No excesses.'),
      card('Add-ons', addOns)
    ])];
  }

  var policy = {
    summary: summaryFor,

    details: function (p) {
      var secs = F.policyDetail;
      var primary = M.POLICY_ACTIONS[M.policyFlows(p).primary];
      return [empty('Read only. Use ' + primary.label + ' at the top of the page to make changes.')].concat(secs.map(function (s) {
        return '<div class="text-block"><h2 class="headline-01">' + t(s.title) + '</h2></div>' + detailCards(s, p);
      }));
    },

    claims: function () {
      return [columns([
        card('Select existing claim', note('There are no existing claims for this policy.'))
      ], [
        card('Loss ratio', lossRatio())
      ])];
    },

    quote: function (p) {
      var dec = p.kind === 'decline';
      var q = F.quotes;
      var best = q.best;
      var premium = dec ? note('This product has referred or declined. There is no premium to convert.')
        : '<div class="mob-premium">' +
            '<div>' +
              '<div class="key-value key-value-stacked key-value-flipped key-value-xl">' +
                '<span class="key">' + t(best.scheme) + '</span><span class="value">' + t(best.premium) + '</span>' +
              '</div>' +
              '<p class="mob-empty">' + t(best.plan) + '</p>' +
            '</div>' +
            '<div class="key-value-list key-value-list-row">' + best.money.map(function (m) {
              return '<div class="key-value key-value-stacked"><span class="key">' + t(m[0]) + '</span><span class="value">' + t(m[1]) + '</span></div>';
            }).join('') + '</div>' +
          '</div>';
      return [columns([
        /* The page's main action closes the card, as Form's documented
           actions do: the primary Button, then a standalone Link. */
        card('Premium and product', premium +
          '<div class="form-actions mob-form-actions">' +
            btn('Convert to policy', { variant: 'primary', disabled: dec, attrs: ' data-confirm="convert" aria-haspopup="dialog"' }) +
            standalone('Amend risk', policyHref(p, 'amendquote')) +
          '</div>', { actions: [
          btn('Edit premium', { size: 'sm', disabled: dec, attrs: ' data-panel="editpremium" aria-haspopup="dialog"' }),
          btn('Select payment plan', { size: 'sm', disabled: dec, attrs: ' data-panel="payplan" aria-haspopup="dialog"' })
        ] }),
        card('Quotes', table(['[[Scheme]]', 'Premium', 'Deposit', 'Total payable'], dec ? q.declined : q.quoted, { caption: 'Quotes' }) +
          moreLink('Load more quotes', ' data-toast="More quotes loaded"', AI.more))
      ], [
        card('Insurer authorisation code', empty('There is no authorisation code applied to this quote.'), { actions: [btn('Add', { size: 'sm', icon: AI.add, attrs: ' data-panel="authcode" aria-haspopup="dialog"' })] }),
        card('Excesses', dec ? empty('Not available.') : kvTable(q.excesses), dec ? {} : { actions: [btn('View / edit', { size: 'sm', icon: AI.edit, attrs: ' data-panel="excesses" aria-haspopup="dialog"' })] }),
        card('Endorsements', empty('There are no endorsements applied to this policy.')),
        card('Add-ons', empty('There are no quoted add-ons for this quote.')),
        card('Policy notes', empty('There are no notes for this policy.'), { actions: [btn('View / edit', { size: 'sm', icon: AI.edit, attrs: ' data-panel="note" aria-haspopup="dialog"' })] })
      ])];
    },

    /* Account summary. Admin fee and Manual credit / debit are on the card
       they affect, not in the menu. */
    tx: function (p) {
      var settled = F.settledItems[p.id];
      var stats = F.accountStatistics[p.id] || F.accountStatistics.zero;
      var txActions = p.kind === 'live' ? [
        btn('Admin fee', { size: 'sm', attrs: ' data-panel="fee" aria-haspopup="dialog"' }),
        btn('Manual credit / debit', { size: 'sm', attrs: ' data-panel="manual" aria-haspopup="dialog"' })
      ] : null;
      return [stack([
        card('Summary', fields([['Account name', F.client.name], ['Reference', p.ref], ['Payment made by', 'Policyholder'],
          ['Current balance due', '£0.00'], ['Total outstanding balance', '£0.00'], ['Full name', 'Motor API Automation']]) +
          table(['Statistics', 'Year to date', 'Last year'], stats, { caption: 'Statistics' }), { actions: txActions }),
        card('Open items', empty('There is no data to display.'), { actions: [
          btn('Cash', { size: 'sm', attrs: ' data-toast="Cash allocation opened"' }), btn('Match', { size: 'sm', attrs: ' data-toast="Match opened"' }), btn('View', { size: 'sm', disabled: true })] }),
        card('Settled items', (settled
          ? table(['Created', 'Reference', 'Due', 'Type', 'Method', 'Amount', 'Settled', 'Payment ref', 'Card ending', 'Expiry'], settled, { caption: 'Settled items' })
          : empty('There is no data to display.')), { actions: [btn('View', { size: 'sm', icon: AI.view, disabled: true })] })
      ])];
    },

    plan: function () {
      return [stack([
        card('Payment plan', fields(F.paymentPlan), { actions: [btn('Cancel plan', { size: 'sm', disabled: true }), btn('Amend', { size: 'sm', disabled: true })] }),
        card('Outstanding transactions on the policy', empty('There is no data to display.'))
      ])];
    },

    collections: function () {
      return [card('Collections', note('This is not a BACS plan, so there are no collections to display. In Mobius today this shows as a pop-up; here it sits in the page.'))];
    },

    dd: function () {
      return [stack([
        card('Direct Debit details', empty('There is no data to display.'), { actions: [btn('Add', { size: 'sm', icon: AI.add, attrs: ' data-panel="ddadd" aria-haspopup="dialog"' })] }),
        card('Current bank account details', fields([['Sort code', 'N/A'], ['Account number', 'N/A'], ['Holder', 'N/A'], ['Reference', 'N/A'], ['DD stop', '']]))
      ])];
    },

    cards: function () {
      return [card('Credit cards', table(['Card number', 'Card holder', 'Card expiry', 'Preferred', 'CA approved', ''],
        F.creditCards.map(function (r) {
          return r.concat([cell(set([btn('Make preferred card', { size: 'sm', attrs: ' data-toast="Made preferred card"' })]), true)]);
        }), { caption: 'Credit cards' }))];
    },

    txdocs: function () {
      return [card('[[Transaction documents]]', note('In Mobius today the Transactions › Documents link doesn’t work, so there’s no current screen to replicate. This is its place in the menu.'))];
    },

    diary: function () {
      return [card('Diary', tabs(['Outstanding', 'History'], [
        table(['Created', 'Operator', 'Assigned to', 'Action type', 'Due date and time', 'Last note'], F.diary, { caption: 'Outstanding diary entries' }),
        empty('No completed diary entries.')
      ]), { actions: [btn('Add diary entry', { variant: 'primary', size: 'sm', icon: AI.add, attrs: ' data-panel="diary" aria-haspopup="dialog"' })] })];
    },

    docs: function () {
      var d = F.documents;
      /* Buckholt Checkbox with no visible label, so the row's checkbox is
         named for its document with aria-label. */
      var docRows = d.names.map(function (n, i) {
        return [cell('<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="doc-' + i + '" aria-label="Select ' + esc(n) + '"></div>', true),
          cell('<a href="#" data-noop>' + esc(n) + '</a>')];
      });
      return [card('Documents',
        filterBar([
          select('df', 'Documents for', ['Policy', 'Client']),
          '<div class="mob-field-action">' + set([btn('Complaint selection: All', { size: 'sm', disabled: true })]) + '</div>'
        ]) +
        tabs(['Documents', 'Archive'], [
          table([{ hidden: 'Select' }, 'Document'], docRows, { caption: 'Documents' }) +
            '<div class="mob-table-foot"><p class="support-01">Showing 1 to 5 of ' + d.total + '</p>' +
            moreLink('Load more', ' data-toast="Would load the next 5 of ' + d.total + '"', AI.more) + '</div>',
          empty('No archived documents.')
        ]), { actions: [['Edit', AI.edit], ['Download', AI.download], ['Notify', AI.notify], ['SMS client', AI.sms],
          ['Email client', AI.email], ['Print client', AI.print]].map(function (a) {
          return btn(a[0], { size: 'sm', icon: a[1], disabled: true });
        }) })];
    },

    notes: function () {
      var n = F.policyNote;
      return [card('Notes',
        tabs(['Policy', 'Client'], [
          filterBar([select('nt', 'Note type filter', ['Select']), input('nc', 'Created by filter', '')]) +
          '<div class="card card-secondary mob-note">' +
            '<div class="card-body">' +
              '<div class="mob-card-head">' +
                '<div class="text-block"><h3 class="title-01">' + t(n.title) + '</h3><p class="support-01">' + t(n.at) + '</p></div>' +
                set([btn('Pin to top', { size: 'sm', attrs: ' data-toast="Pinned to top"' })]) +
              '</div>' +
              '<p>' + n.lines.map(t).join('<br>') + '</p>' +
            '</div>' +
          '</div>',
          empty('No client notes.')
        ]), { actions: [btn('Add note', { variant: 'primary', size: 'sm', icon: AI.add, attrs: ' data-panel="note" aria-haspopup="dialog"' })] })];
    },

    checklist: function () {
      return [stack([
        card('Checklist details', form([input('ce', 'Excess', ''), input('cd', 'D.O.C.', ''), input('cs', 'Security', ''), input('cm', 'Mileage', ''), input('cr', 'Renewal', '')]) +
          set([btn('Save', { variant: 'secondary', attrs: ' data-toast="Checklist saved"' })])),
        card('Outstanding items',
          tabs(['Current items', 'Other items'], [empty('There is no data to display.'), empty('There is no data to display.')]),
          { sub: 'The outstanding items are documents that the customer is required to provide.', actions: [
            btn('Request via portal', { size: 'sm', disabled: true }),
            btn('Add item', { size: 'sm', attrs: ' data-panel="additem" aria-haspopup="dialog"' })] }),
        card('Sale status', form([
          yesNo('s1', 'Opt out of day one inflation increase?', 'No'),
          yesNo('s2', 'Was the sale advised?', 'No'),
          yesNo('s3', 'Opt out of automatic renewal?', 'Yes')
        ]) +
          /* In-page form: primary first, left aligned (Forms pattern). */
          set([btn('Continue', { variant: 'primary', attrs: ' data-toast="Checklist complete"' }), btn('Cancel')]))
      ])];
    },

    attachments: function () {
      return [card('Attachments', empty('There are no attachments.'), { actions: [
        btn('Download', { size: 'sm', icon: AI.download, disabled: true }),
        btn('Delete', { size: 'sm', icon: AI.bin, danger: true, disabled: true }),
        btn('Upload', { variant: 'primary', size: 'sm', icon: AI.upload, attrs: ' data-toast="Choose a file to upload"' })] })];
    },

    complaints: function () {
      return [card('Complaints', empty('There are no complaints.'), { actions: [btn('Add complaint', { variant: 'primary', size: 'sm', icon: AI.add, attrs: ' data-panel="ccomplaint" aria-haspopup="dialog"' })] })];
    },

    agent: function (p) {
      return [stack([
        card('Current details', fields([['Brand', F.client.brand], ['Agent', 'No Agent'], ['Reference', p.ref], ['[[Business line]]', F.client.businessLine], ['Agent branch', 'N/A']])),
        card('Introducers', empty('There are no introducers or advisors connected to this policy.'))
      ])];
    },

    history: function (p) {
      var op = F.historyOperator;
      return [card('Policy history', tabs(['Table view', 'Timeline view'], [
        fields([['[[Policyholder]]', F.client.name], ['[[Reference]]', p.ref]], 2) +
        table(['ID', 'Status', 'Start date', 'End date', 'Policy duration', 'Record flags', 'Description', 'Operator', 'Created', ''],
          [['1', cell(statusText(p)), p.start, p.end, '[[12 months]]', 'Live', '', op, p.inception,
            cell(set([btn('Load', { size: 'sm', attrs: ' data-toast="History record loaded"' })]), true)]], { caption: 'Policy history' }),
        '<div class="mob-split"><p class="label-01">Effective date</p><p class="support-01">Current live history: 1 · Sort by effective date</p></div>' +
        '<div class="mob-timeline">' +
          '<p class="support-01 mob-timeline-date">' + t(p.inception) + '</p>' +
          '<div class="versatile">' +
            '<div class="versatile-content">' +
              '<div class="versatile-body">' +
                '<div class="versatile-meta">' +
                  '<div class="versatile-label">1 ' + statusText(p) + '</div>' +
                  '<p class="versatile-text">Created on ' + t(p.inception) + ' by ' + t(op) + '</p>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      ]) + '<p class="support-01">History legend: Live history · Pending event · History file</p>')];
    },

    activity: function (p) {
      return [card('Activity', activityFilters('pa', p) +
        table(['Date and time', 'Operator', 'Activity type', 'Description'], F.policyActivity, { caption: 'Activity' }),
        { sub: 'Activity shows the full audit trail record. Search by date range and filter by multiple criteria.', actions: [savePdf()] })];
    },

    amend: function (p) { return flowAmend(p); },
    amendquote: function (p) { return flowAmendQuote(p); },
    newquote: function (p) { return flowNewQuote(policyHref(p)); }
  };

  /* Loss ratio: the prototype draws an empty donut reading "N/A". Buckholt
     has no chart, and there is nothing to chart, so the figure is shown as a
     Key-value pair rather than drawing a donut. */
  function lossRatio() {
    return '<div class="key-value key-value-stacked key-value-flipped key-value-xl">' +
      '<span class="key">No claims</span><span class="value">N/A</span>' +
    '</div>';
  }

  /* ================================================================= Flows
     Processes keep a progress indicator; navigation does not. Buckholt
     documents no stepper, so progress is the documented Progress bar with
     the step's name as its label and "Step n of N" as its note. */

  function progress(names, cur) {
    var pid = id('flow-progress');
    var pct = Math.round(((cur + 1) / names.length) * 100);
    return '<div class="progress-container">' +
      '<div class="progress-header">' +
        '<label for="' + pid + '" class="progress-label">' + t(names[cur]) + '</label>' +
        '<span class="progress-note">Step ' + (cur + 1) + ' of ' + names.length + '</span>' +
      '</div>' +
      '<div id="' + pid + '" class="progress" role="progressbar" aria-label="Step ' + (cur + 1) + ' of ' + names.length + ': ' + esc(plain(names[cur])) + '"' +
        ' aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
        '<div class="progress-bar" style="width: ' + pct + '%"></div>' +
      '</div>' +
    '</div>';
  }

  function flowNav(cur, total, cancelHref, finishMsg) {
    return '<div class="mob-split">' +
      set([btn('Cancel', { variant: 'ghost', href: cancelHref })].concat(
        cur > 0 ? [btn('Back', { variant: 'secondary', attrs: ' data-step="' + (cur - 1) + '"' })] : [])) +
      set([cur < total - 1
        ? btn('Next', { variant: 'primary', attrs: ' data-step="' + (cur + 1) + '"' })
        : btn('Save', { variant: 'primary', attrs: ' data-finish="' + cancelHref + '" data-msg="' + esc(finishMsg) + '"' })]) +
    '</div>';
  }

  function flowAmend(p) {
    var names = ['Client details', 'Consent screen', 'Contact and marketing'];
    var c = Math.min(S.step, 2);
    var ret = policyHref(p);
    var body;
    if (c === 0) {
      body = card('Contact details',
          table(['Telephone number', 'Type'], F.contactNumbers.map(function (r) { return [r[0], '[[' + r[1] + ']]']; }), { caption: 'Telephone numbers' }) +
          set([btn('Add telephone', { size: 'sm', icon: AI.add, attrs: ' data-panel="addtel" aria-haspopup="dialog"' })]) +
          form([input('ae', 'Email address', F.client.email, 'email')])) +
        card('Stop renewal', form([yesNo('sr', 'Stop renewal', p.stopRenewal || 'No')]));
    } else if (c === 1) {
      body = detailCards(F.policyDetail[2], p, { consentAdd: true });
    } else {
      body = detailCards(F.policyDetail[6], p, { editable: true });
    }
    return [progress(names, c), stack([body]), flowNav(c, 3, ret, 'Details updated')];
  }

  function flowAmendQuote(p) {
    var secs = F.policyDetail;
    var c = Math.min(S.step, secs.length - 1);
    return [progress(secs.map(function (s) { return s.title; }), c),
      stack([detailCards(secs[c], p, { editable: c !== 2 && c !== 3 })]),
      flowNav(c, secs.length, policyHref(p), 'Quote re-run')];
  }

  function productSelection() {
    return card('Select a product', form([
      select('pb', 'Brand', ['Krypton']),
      select('pl', 'Business line', ['Open Market Motor', 'Open Market Commercial Vehicle']),
      select('pa', 'Agent', ['No Agent']),
      set([btn('Add introducer', { size: 'sm', icon: AI.add, attrs: ' data-panel="introducer" aria-haspopup="dialog"' })])
    ]));
  }

  function flowNewQuote(ret) {
    return [productSelection(),
      '<div class="mob-split">' + set([btn('Cancel', { variant: 'ghost', href: ret })]) +
        set([btn('Next', { variant: 'primary', attrs: ' data-finish="#p/zz2966/quote" data-msg="New quote created"' })]) + '</div>'];
  }

  function flowNewClient() {
    var secs = F.policyDetail;
    var names = ['Product selection'].concat(secs.map(function (s) { return s.title; }));
    var c = Math.min(S.step, names.length - 1);
    var body = c === 0 ? productSelection() : detailCards(secs[c - 1], null, { editable: c - 1 !== 2 && c - 1 !== 3, blank: true });
    return [progress(names, c), stack([body]), flowNav(c, names.length, '#search', 'Client created and quote run')];
  }

  /* ========================================================== Side panels
     [title, body, toast on save (null: no save), save label]. Every one
     opens in the shared prototype Blade. */

  var panels = {
    mta: function () {
      return ['Select MTA', form([
        select('m1', 'Required MTA type', ['Please select', 'Permanent MTA', 'Temporary MTA']),
        '<div class="text-block"><h3 class="title-01">MTA effective date</h3></div>',
        input('m2', 'Start date', '', 'date'),
        input('m3', 'Start time', '', 'time'),
        '<fieldset class="input"><div class="input-label"><legend class="form-label">MTA adjustment type</legend></div>' +
          '<div class="response check-input">' +
            ['Change of Security Device', 'Correction (NB)', 'Correction (MTA)', 'Change of Occupation', 'Correction (Renewal)'].map(function (x, i) {
              return checkbox('m-adj-' + i, x);
            }).join('') +
          '</div></fieldset>',
        textarea('m4', 'MTA description')
      ]), 'MTA started'];
    },
    extend: function (p) {
      return ['Policy extension', form([select('e1', 'Extension duration', ['Select', '1 month', '3 months', '6 months'])]) +
        '<p><strong>Previous extension:</strong> No</p>' +
        table([{ hidden: 'Detail' }, 'Current policy', 'Extended policy'], [['Cover start', p.start, '-'], ['Cover end', p.end, '-'], ['Duration', '[[12 months]]', '-'], ['Premium', p.premium, '-']], { caption: 'Policy extension' }),
        'Extension calculated', 'Next'];
    },
    fee: function (p) {
      return ['Admin fee', form([select('f1', 'Policy number', [p.ref]), input('f2', 'Amount (£)', '', 'number'), select('f3', 'Fee account', ['Select'])]), 'Admin fee added'];
    },
    manual: function () {
      return ['Manual credit / debit', form([
        select('n1', 'Type', ['Select', 'Credit', 'Debit']), input('n2', 'Effective date', '', 'date'),
        input('n3', 'Reason', ''), select('n4', 'Payment method', ['Select'])
      ]) +
        '<div class="text-block"><h3 class="title-01">Postings</h3></div>' +
        table([{ hidden: 'Select' }, 'Section', 'Premium', 'Taxes', 'Total'], [
          [cell('<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="post-1" aria-label="Insurer fee"></div>', true), 'Insurer Fee', '0', '0', '0'],
          [cell('<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="post-2" aria-label="Admin fee"></div>', true), 'Admin Fee', '0', '0', '0']
        ], { caption: 'Postings' }) +
        set([btn('Add', { size: 'sm', icon: AI.add })]) +
        '<p><strong>Total:</strong> £0.00</p>', 'Transaction posted'];
    },
    portal: function () {
      return ['[[Customer portal settings]]', form([
        switchInput('pt1', 'Allow customer to perform MTA via portal'),
        switchInput('pt2', 'Allow customer to perform renewal via portal')
      ]), 'Portal settings saved'];
    },
    support: function () {
      return ['Client support', form([input('su', 'Search help articles', '')]) +
        placeholder('The existing Client support content sits here. It used to be a button in the blue bar.'), null];
    },
    header: function () { return ['Policy header', form([textarea('h1', 'Header text', 4)]), 'Policy header saved']; },
    cheader: function () { return ['Client header', form([textarea('ch', 'Header text', 4)]), 'Client header saved']; },
    insurer: function (p) {
      return ['Insurer policy number (IPN)', form([input('ip', 'Enter insurer policy number', p.ipn || '')]), 'Insurer policy number saved'];
    },
    conditions: function () { return ['Quote details', form([select('qd', 'Details', ['Select'])]), null]; },
    breakdown: function (p) {
      return ['Quote breakdown', tabs(['Quote breakdown', 'MTI details'], [
        table(['Description', 'Percentage', 'Amount', 'Total'], F.quoteBreakdown.map(function (r) {
          return r.map(function (v) { return fill(v, p); });
        }), { caption: 'Quote breakdown' }),
        empty('No MTI details.')
      ]), 'Saved as attachment', 'Save as attachment'];
    },
    years: function () { return ['Consecutive years', form([input('cy', 'Consecutive years', '0', 'number')]), 'Saved']; },
    amendments: function () {
      var m = F.manualAmendments;
      return ['Manual amendments',
        '<p>Last quoted scheme: <strong>' + t(m.scheme) + '</strong></p>' +
        empty('The following were applied manually to the previous quote.') +
        table(['Manual amendment', 'Amount'], m.rows, { caption: 'Manual amendments' }) +
        '<div class="text-block"><h3 class="title-01">Endorsements</h3></div>' + empty('There are no manually added endorsements.') +
        '<div class="text-block"><h3 class="title-01">Excesses</h3></div>' + empty('There are no manually added excesses.'), null];
    },
    excess: function (p, arg) {
      var a = String(arg || '|').split('|');
      return ['Excess details', kvTable([['Amount', a[1]], ['Description', a[0]], ['Applies to', 'N/A']]), null];
    },
    endorse: function (p, arg) { return ['Endorsement', kvTable([['Endorsement', arg], ['Applies to', 'N/A']]), null]; },
    declined: function () { return ['Declined', note('Decline reasons from the insurer appear here.'), null]; },
    diary: function (p) {
      return ['[[Add diary entry]]', form([
        input('d1', 'Date', '01/10/2026', 'text', true), input('d2', 'Policy no.', p ? p.ref : '', 'text', true),
        input('d3', 'Due date', '', 'date'), input('d4', 'Due time', '', 'time'),
        select('d5', 'Action type', ['Select']), select('d6', 'Assigned to', ['Select']),
        checkbox('d-done', 'Completed'), input('d7', 'Completor', '', 'text', true),
        textarea('d8', 'Notes'), textarea('d9', 'Add a note')
      ]), 'Diary entry added'];
    },
    note: function () { return ['Add note', form([select('nt2', 'Note type', ['Select']), textarea('nb', 'Note', 5)]), 'Note added']; },
    cnotes: function () {
      var notes = F.clientNotes;
      return ['Client notes',
        (notes.length ? notes.map(function (x) {
          return '<div class="card card-secondary mob-note"><div class="card-body">' +
            '<p class="support-01">' + t(x.by) + ' · ' + t(x.at) + '</p><p>' + t(x.text) + '</p>' +
          '</div></div>';
        }).join('') : empty('There are no client notes.')) +
        form([textarea('cn', 'Add a note', 4)]), 'Client note added', 'Add note'];
    },
    cclaims: function () {
      return ['Client claims', note('There are no existing claims for this client.') +
        '<div class="text-block"><h3 class="title-01">Loss ratio</h3></div>' + lossRatio(), null];
    },
    clink: function () { return ['Add client link', form([input('cl', 'Search for a client', '')]), 'Client linked']; },
    cconn: function () { return ['Add client connection', form([input('cc', 'Search for a client', ''), select('ct', 'Connection type', ['Select'])]), 'Connection added']; },
    ccomplaint: function () {
      return ['Add complaint', form([input('cp1', 'Date received', '', 'date'), select('cp2', 'Category', ['Select']), textarea('cp3', 'Details', 5)]), 'Complaint added'];
    },
    authcode: function () { return ['Insurer authorisation code', form([input('ac1', 'Authorisation code', '')]), 'Authorisation code added']; },
    excesses: function () { return ['Excesses', table(['Excess', 'Amount'], F.quotes.excesses, { caption: 'Excesses' }), 'Excesses saved']; },
    editpremium: function () { return ['Edit premium', form([select('ep1', 'Adjustment', ['Edit commission', 'Discount']), input('ep2', 'Amount (£)', '', 'number')]), 'Premium updated']; },
    payplan: function () { return ['Select payment plan', form([select('pp1', 'Payment plan', ['Default single payment in full (no admin fees)'])]), 'Payment plan selected']; },
    ddadd: function () { return ['Add Direct Debit', form([input('dd1', 'Account holder', ''), input('dd2', 'Sort code', ''), input('dd3', 'Account number', '')]), 'Direct Debit added']; },
    additem: function () { return ['Add outstanding item', form([select('oi1', 'Item', ['Select']), input('oi2', 'Due date', '', 'date')]), 'Item added']; },
    addtel: function () {
      return ['Add telephone number', form([input('t1', 'Telephone number', '', 'tel'), select('t2', 'Type', ['Select', 'Mobile', 'Home', 'Fax']), input('t3', 'Extension', ''), yesNo('t4', 'Ex directory', 'No')]), 'Telephone number added'];
    },
    consent: function () { return ['Add consent', form([select('co1', 'Consent type', ['Select']), input('co2', 'Date given', '', 'date')]), 'Consent added']; },
    introducer: function () { return ['Add introducer', form([input('in1', 'Search introducers', '')]), 'Introducer added']; }
  };

  /* ===================================================== Heading actions
     Actions that open a page go in the page heading, never the menu. */

  function heading(R) {
    if (R.scope === 'policy' && (R.page === 'summary' || R.page === 'details')) {
      var p = R.p;
      var fl = M.policyFlows(p);
      var out = '';
      if (R.page === 'summary') {
        /* Quick links: icon-only ghost links to sibling pages, each with an
           accessible name and a Tooltip. A set of their own, because
           Buckholt does not mix icon-only and labelled Buttons in one set. */
        out += '<nav class="mob-quick" aria-label="Quick links">' + set(M.QUICK_LINKS.map(function (q) {
          var n = F.quickLinkCounts[q[3]];
          return '<a class="btn btn-ghost mob-badged" href="' + policyHref(p, q[0]) + '"' +
              ' aria-label="' + q[1] + (n ? ', ' + n + ' new' : '') + '"' +
              ' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="' + q[1] + '">' +
            '<div class="btn-icon"><i class="' + q[2] + '" aria-hidden="true"></i></div>' +
            (n ? '<span class="badge badge-floating mob-count" aria-hidden="true">' + (n > 999 ? '999+' : n) + '</span>' : '') +
          '</a>';
        }), 'button-set-nowrap') + '</nav>';
      }
      var labelled = [];
      if (R.page === 'summary') fl.secondary.forEach(function (k) {
        var a = M.POLICY_ACTIONS[k];
        labelled.push(btn(a.label, { variant: 'secondary', icon: a.icon, href: policyHref(p, a.to) }));
      });
      var pa = M.POLICY_ACTIONS[fl.primary];
      labelled.push(btn(pa.label, { variant: 'primary', icon: pa.icon, href: policyHref(p, pa.to) }));
      return out + set(labelled);
    }

    if (R.scope === 'app' && R.page === 'search') {
      var nc = M.APP_ACTIONS.newclient;
      return set([btn(nc.label, { variant: 'primary', icon: nc.icon, href: '#' + nc.to })]);
    }

    if (R.scope === 'client' && R.page === 'summary') {
      var n = F.clientNotes.length;
      var notesLabel = 'Client notes' + (n ? ', ' + n + ' note' + (n > 1 ? 's' : '') : ', none');
      return set(['<button type="button" class="btn btn-ghost mob-badged" data-panel="cnotes" aria-haspopup="dialog"' +
          ' aria-label="' + notesLabel + '" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Client notes">' +
          '<div class="btn-icon"><i class="' + ICON.note + '" aria-hidden="true"></i></div>' +
          (n ? '<span class="badge badge-floating mob-count" aria-hidden="true">' + (n > 999 ? '999+' : n) + '</span>' : '') +
        '</button>']) +
        set([
          btn('View claims', { variant: 'secondary', attrs: ' data-panel="cclaims" aria-haspopup="dialog"' }),
          btn(M.CLIENT_ACTIONS.cnewquote.label, { variant: 'primary', icon: M.CLIENT_ACTIONS.cnewquote.icon, href: '#c/newquote' })
        ]);
    }
    return '';
  }

  global.MobiusPages = {
    init: function (state) { S = state; },
    ui: { esc: esc, t: t, plain: plain, btn: btn, set: set, statusTag: statusTag, statusText: statusText,
      loadMoreButton: loadMoreButton, shownPolicies: shownPolicies, policyHref: policyHref },
    app: app,
    client: client,
    policy: policy,
    panels: panels,
    heading: heading
  };
}(window));
