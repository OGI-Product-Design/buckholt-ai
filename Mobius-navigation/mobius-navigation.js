/* ============================================================================
   Mobius navigation prototype — routing, the two-level menu and behaviour
   ============================================================================

   Routes are the prototype's hash routes, unchanged:

     #dashboard  #search/{query}  #newclient   Broking (app level)
     #activity #renewals #bordereau #accounts   other modules (placeholders)
     #c/{page}                                  client level
     #p/{policy id}/{page}                      policy level

   A policy page its status does not have redirects to that policy's
   overview, and an unknown client page to the Client summary.

   The menu is rebuilt on every route change, so each level's menu only ever
   shows that level's content:

     app      nothing below Search (the modules are in the top bar)
     client   back link, client card, Go to, the client's policies
     policy   "Back to client" link, policy card with Switch policy,
              Go to (the status's pages), Actions (the status's actions)

   Menu actions only happen in place. A side panel opens in the shared
   prototype Blade (`prototype/blade.js`) and its menu item stays pressed
   while it is open; a confirmation opens the Buckholt Modal in this page.
   Both trap focus, close on Escape and give focus back to what opened them.

   Below 992px the menu becomes a drawer behind the Menu button.
   ============================================================================ */
(function () {
  'use strict';

  var F = window.MobiusFixtures;
  var M = window.MobiusModel;
  var P = window.MobiusPages;
  var ui = P.ui;
  var t = ui.t;
  var esc = ui.esc;
  var plain = ui.plain;

  var POLICY_BY_ID = {};
  F.policies.forEach(function (p) { POLICY_BY_ID[p.id] = p; });

  /* open: expanded menu groups, keyed by level and group. polShown: how many
     policies every policy list shows. step: the current step of a flow. */
  /* query: the last search run, or null before the first one. */
  var S = { open: {}, polShown: 5, switchOpen: false, step: 0, panelKey: null, query: null };
  P.init(S);

  var R = null;
  var $ = function (id) { return document.getElementById(id); };

  /* ================================================================ Routing */

  function parse() {
    var h = location.hash.replace(/^#/, '') || 'dashboard';
    var parts = h.split('/');
    if (parts[0] === 'c') return { scope: 'client', page: parts[1] || 'summary' };
    if (parts[0] === 'p' && POLICY_BY_ID[parts[1]]) return { scope: 'policy', p: POLICY_BY_ID[parts[1]], page: parts[2] || 'summary' };
    /* Search results only exist for a search: a bare #search is the dashboard. */
    if (parts[0] === 'search' && parts[1]) {
      S.query = decodeURIComponent(parts.slice(1).join('/'));
      return { scope: 'app', page: 'search' };
    }
    if (['newclient', 'activity', 'renewals', 'bordereau', 'accounts'].indexOf(h) >= 0) return { scope: 'app', page: h };
    return { scope: 'app', page: 'dashboard' };
  }

  function href(r, page) {
    if (r.scope === 'client') return '#c/' + page;
    if (r.scope === 'policy') return '#p/' + r.p.id + '/' + page;
    return '#' + page;
  }

  /* ================================================================== Menu */

  function icon(cls, extra) {
    return '<i class="' + cls + (extra ? ' ' + extra : '') + '" aria-hidden="true"></i>';
  }

  /* A section of the menu, labelled by its own heading. */
  function sectionLabel(id, text) {
    return '<h2 class="label-01 mob-side-label" id="' + id + '">' + t(text) + '</h2>';
  }

  /* Buckholt Page navigation: `.nav > .nav-item > .nav-link`, the icon
     straight inside the link before the label, `.active` on the current
     page. Stacked with Bootstrap's `.flex-column`, as Buckholt's own
     documentation site stacks its side navigation. */
  function navLink(id, label, iconCls, cur, url) {
    var on = id === cur;
    return '<li class="nav-item">' +
      '<a class="nav-link' + (on ? ' active' : '') + '" href="' + url + '"' + (on ? ' aria-current="page"' : '') + '>' +
        (iconCls ? icon(iconCls) : '') + t(label) +
      '</a>' +
    '</li>';
  }

  /* A group is a disclosure, so its header is a button, not a link. It opens
     by itself when it holds the current page. */
  function navList(items, cur, r) {
    return '<ul class="nav flex-column mob-nav">' + items.map(function (n) {
      if (!n.children) return navLink(n.id, n.label, n.icon, cur, href(r, n.id));
      var has = n.children.some(function (c) { return c.id === cur; });
      var key = r.scope + ':' + n.group;
      if (has) S.open[key] = true;
      var open = !!S.open[key];
      var subId = 'mob-group-' + n.group.toLowerCase().replace(/\W+/g, '-');
      return '<li class="nav-item">' +
        '<button type="button" class="nav-link mob-nav-group' + (has ? ' mob-has-current' : '') + '"' +
          ' aria-expanded="' + open + '" aria-controls="' + subId + '" data-group="' + esc(key) + '">' +
          icon(n.icon) + t(n.group) + icon('fa-regular fa-chevron-down', 'mob-chevron') +
        '</button>' +
        '<ul class="nav flex-column mob-subnav" id="' + subId + '"' + (open ? '' : ' hidden') + '>' +
          n.children.map(function (c) { return navLink(c.id, c.label, null, cur, href(r, c.id)); }).join('') +
        '</ul>' +
      '</li>';
    }).join('') + '</ul>';
  }

  /* A policy in a list: reference and status, then line of business and
     cover start. In the switcher the open policy is the current item of the
     set (aria-current="true"); it is the current page only on its overview. */
  function policyLinks(curId, inSwitcher) {
    /* Each policy is a Buckholt clickable Card (`a.card.card-clickable >
       .card-body > .text-block`), the documented whole-card link. Inside is
       Heading attachment's Code & specs example 3 exactly: `.heading` with
       the reference in `.heading-content` and the status Tag attached, then
       a paragraph. Spacing is the Text block's own. */
    return '<ul class="list-unstyled mob-policies">' + ui.shownPolicies().map(function (p) {
      var on = p.id === curId;
      return '<li>' +
        '<a class="card card-clickable mob-pol-link' + (on ? ' mob-pol-current' : '') + '" href="' + ui.policyHref(p) + '"' +
          (on ? ' aria-current="' + (inSwitcher ? 'true' : 'page') + '"' : '') + '>' +
          '<div class="card-body">' +
            '<div class="text-block">' +
              '<div class="heading">' +
                '<div class="heading-content">' +
                  '<h3 class="title-01">' + esc(p.ref) + '</h3>' +
                '</div>' +
                ui.statusTag(p, true) +
              '</div>' +
              '<p>' + esc(F.client.businessLine) + '</p>' +
            '</div>' +
            /* The cover start is a fact with a label: a Buckholt Key-value. */
            '<div class="key-value">' +
              '<span class="key">' + t('[[Cover start]]') + '</span>' +
              '<span class="value">' + esc(p.start.split(' ')[0]) + '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</li>';
    }).join('') + '</ul>' +
    '<div class="mob-more">' + ui.loadMoreButton(inSwitcher ? 'switch' : 'side') + '</div>';
  }

  /* Actions: Buckholt Menu items shown in place rather than behind a
     trigger. Section headers name the groups; Stop and Cancel sit below a
     divider, and only Cancel is the documented danger item. A panel action
     carries a trailing panel icon and stays pressed while its panel is open. */
  function actionMenu(groups, defs, scope, labelId) {
    var items = '';
    groups.forEach(function (g, gi) {
      if (g.sub) items += '<li><h6 class="menu-section-header">' + t(g.sub) + '</h6></li>';
      else if (gi > 0) items += '<li><hr class="menu-divider"></li>';
      g.ids.forEach(function (key) {
        var a = defs[key];
        var trail = a.kind === 'panel' ? icon(M.ICON.panel, 'mob-trail') : (a.kind === 'flow' ? icon(M.ICON.flow, 'mob-trail') : '');
        items += '<li>' +
          '<button class="menu-item' + (a.danger ? ' menu-item-danger' : '') + '" type="button"' +
            ' data-action="' + key + '" data-scope="' + scope + '"' +
            (a.kind === 'panel' ? ' aria-pressed="' + (S.panelKey === key) + '" aria-haspopup="dialog"' : '') +
            (a.kind === 'confirm' ? ' aria-haspopup="dialog"' : '') + '>' +
            icon(a.icon) + '<span class="mob-menu-label">' + t(a.label) + '</span>' + trail +
          '</button>' +
        '</li>';
      });
    });
    return '<div class="menu mob-actions">' +
      '<div class="menu-panel show position-relative mob-menu-inline"' + (labelId ? ' role="group" aria-labelledby="' + labelId + '"' : '') + '>' +
        '<ul class="menu-body">' + items + '</ul>' +
      '</div>' +
    '</div>';
  }

  function backLink(url, label) {
    return '<a class="link-standalone mob-back" href="' + url + '">' +
      '<span class="icon">' + icon('fa-regular fa-arrow-left') + '</span>' + t(label) +
    '</a>';
  }

  function renderSide(r) {
    var html = '';
    var c = F.client;

    if (r.scope === 'app') {
      /* Broking's pages and the other modules have nothing below the search:
         the modules are in the top bar, and "Create new client" opens a
         page, so it is in the Broking page headings. */
    } else if (r.scope === 'client') {
      html += S.query ? backLink(searchHref(), 'Back to search results') : backLink('#dashboard', 'Back to dashboard');
      /* Who this is, then the facts a broker checks first. Avatar (initials)
         beside a Text block, then a Buckholt Key-value list. */
      html += '<div class="card mob-context-card"><div class="card-body">' +
        '<div class="mob-identity">' +
          '<div class="avatar avatar-sm" aria-hidden="true"><div class="avatar-initials">' + esc(c.initials) + '</div></div>' +
          '<div class="text-block">' +
            '<span class="eyebrow">Client</span>' +
            '<h2 class="title-01">' + esc(c.name) + '</h2>' +
          '</div>' +
        '</div>' +
        kvList([['Client reference', esc(c.ref)], ['[[Date of birth]]', esc(c.dob)], ['Postcode', esc(c.postcode)], ['Policies', String(F.policies.length)]]) +
      '</div></div>';
      html += '<nav aria-labelledby="mob-nav-client">' + sectionLabel('mob-nav-client', 'Go to') + navList(M.CLIENT_NAV, r.page, r) + '</nav>';
      html += '<nav aria-labelledby="mob-nav-policies">' + sectionLabel('mob-nav-policies', 'Policies (' + F.policies.length + ')') + policyLinks(null, false) + '</nav>';
    } else {
      var p = r.p;
      html += backLink('#c/summary', 'Back to client');
      html += '<div class="card mob-context-card"><div class="card-body">' +
        '<div class="text-block">' +
          '<div class="mob-ctx-row"><span class="eyebrow">Policy</span>' + ui.statusTag(p, true) + '</div>' +
          '<h2 class="title-01">' + esc(p.ref) + '</h2>' +
          '<p class="support-01">' + esc(c.businessLine) + ' · ' + esc(c.brand) + '</p>' +
        '</div>' +
        /* What the record strip used to carry, now that breadcrumbs replace it. */
        kvList([['Client', esc(c.name)], ['[[Cover start]]', esc(p.start.split(' ')[0])], ['Policy duration', esc(p.hdrDur || p.dur)]]) +
        /* A disclosure, so a Button: ghost, small, flush with the card's text,
           with the chevron after the label (Button's trailing `.btn-icon`). */
        ui.set([ui.btn('Switch policy (' + F.policies.length + ' for this client)', {
          variant: 'ghost', size: 'sm',
          after: '<div class="btn-icon"><i class="fa-regular fa-chevron-down mob-chevron" aria-hidden="true"></i></div>',
          attrs: ' data-switch aria-expanded="' + S.switchOpen + '" aria-controls="mob-switch"' })], 'mob-switch-toggle') +
        '<nav id="mob-switch" aria-label="Switch policy"' + (S.switchOpen ? '' : ' hidden') + '>' + policyLinks(p.id, true) + '</nav>' +
      '</div></div>';
      html += '<nav aria-labelledby="mob-nav-policy">' + sectionLabel('mob-nav-policy', 'Go to') + navList(M.policyNav(p), r.page, r) + '</nav>';
      html += '<section aria-labelledby="mob-actions-label">' + sectionLabel('mob-actions-label', 'Actions') +
        actionMenu(M.policyActions(p), M.POLICY_ACTIONS, 'policy', 'mob-actions-label') + '</section>';
    }

    $('mob-side').innerHTML = html;

    /* Client support is about a client, so it only appears once one is open:
       at client and policy level, not on Broking or the other modules. */
    var foot = $('mob-side-foot');
    foot.hidden = r.scope === 'app';
    foot.innerHTML = foot.hidden ? '' : actionMenu([{ sub: null, ids: ['support'] }], M.GLOBAL_ACTIONS, 'global', null);
  }

  /* Buckholt Key-value list, stacked (key over value, so a long value has
     the column's full width), with the small key size. */
  function kvList(rows) {
    return '<div class="key-value-list key-value-list-stacked mob-kv-list">' + rows.map(function (x) {
      return '<div class="key-value key-value-sm"><span class="key">' + t(x[0]) + '</span><span class="value">' + x[1] + '</span></div>';
    }).join('') + '</div>';
  }

  function searchHref() { return '#search/' + encodeURIComponent(S.query); }

  /* ========================================================= Breadcrumbs
     Location-based: Dashboard › Search results (once a search has been run)
     › client › policy › page. They replace the record strip that used to sit
     under the top bar. The current page is the last, unlinked item.
     Breadcrumbs should not wrap, so a long trail puts its middle in
     Breadcrumb's documented overflow menu: past four items on wide screens
     (Dashboard › … › client › policy › page), and past two below 768px
     (Dashboard › … › page). */
  var phone = window.matchMedia('(max-width: 767.98px)');
  function crumbs(r, title) {
    var c = F.client;
    var trail = [];
    if (r.scope === 'app' && (r.page === 'dashboard' || ['activity', 'renewals', 'bordereau', 'accounts'].indexOf(r.page) >= 0)) return '';
    trail.push(['Dashboard', '#dashboard']);
    if (r.scope !== 'app' && S.query) trail.push(['Search results', searchHref()]);
    if (r.scope === 'client') {
      if (r.page === 'summary') trail.push([c.name, null]);
      else trail.push([c.name, '#c/summary'], [title, null]);
    } else if (r.scope === 'policy') {
      trail.push([c.name, '#c/summary']);
      if (r.page === 'summary') trail.push([r.p.ref, null]);
      else trail.push([r.p.ref, ui.policyHref(r.p)], [title, null]);
    } else {
      trail.push([r.page === 'search' ? 'Search results' : title, null]);
    }

    var item = function (x) {
      return x[1]
        ? '<li class="breadcrumb-item"><a class="breadcrumb-link" href="' + x[1] + '">' + t(x[0]) + '</a></li>'
        : '<li class="breadcrumb-item active" aria-current="page">' + t(x[0]) + '</li>';
    };
    var html;
    var keep = phone.matches ? 1 : 3;
    if (trail.length > keep + 1) {
      var hidden = trail.slice(1, trail.length - keep);
      html = item(trail[0]) +
        '<li class="breadcrumb-item menu" data-bs-toggle="tooltip" data-bs-title="More pages">' +
          '<a class="breadcrumb-link menu-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false" aria-controls="mob-crumb-menu" aria-label="More pages">…</a>' +
          '<div class="menu-panel dropdown-menu" id="mob-crumb-menu">' +
            '<ul class="menu-body" role="menu">' + hidden.map(function (x) {
              return '<li><button class="menu-item" type="button" data-go="' + x[1] + '">' + t(x[0]) + '</button></li>';
            }).join('') + '</ul>' +
          '</div>' +
        '</li>' +
        trail.slice(trail.length - keep).map(item).join('');
    } else {
      html = trail.map(item).join('');
    }
    return '<nav aria-label="breadcrumb" class="mob-crumbs"><ol class="breadcrumb">' + html + '</ol></nav>';
  }

  /* ================================================================= Page */

  function titleFor(r) {
    var tt = (M.TITLES[r.scope] || {})[r.page] || ['', ''];
    var title = tt[0].replace('@query', S.query || '');
    var eyebrow = r.scope === 'policy' ? (tt[1] || 'Policy') + ' · ' + r.p.ref : tt[1];
    return { title: title, eyebrow: eyebrow };
  }

  function renderPage(r) {
    var main = $('mob-page');
    Shell.disposeTooltips(main);
    var tt = titleFor(r);
    var panels = r.scope === 'app' ? P.app[r.page]() : r.scope === 'client' ? P.client[r.page]() : P.policy[r.page](r.p);
    var actions = P.heading(r);

    main.innerHTML =
      '<div class="page-panel">' +
        crumbs(r, tt.title) +
        '<div class="mob-heading">' +
          '<div class="text-block">' +
            (tt.eyebrow ? '<span class="eyebrow">' + t(tt.eyebrow) + '</span>' : '') +
            '<h1 class="display-01" id="mob-title" tabindex="-1">' + t(tt.title) + '</h1>' +
          '</div>' +
          (actions ? '<div class="mob-heading-actions">' + actions + '</div>' : '') +
        '</div>' +
      '</div>' +
      panels.map(function (x) { return '<div class="page-panel">' + x + '</div>'; }).join('');

    document.title = 'Mobius · ' + plain(tt.title).replace(/[“”]/g, '');
    Shell.initTooltips(main);
  }

  function render() {
    R = parse();
    if (R.scope === 'policy' && M.allowedPolicyPages(R.p).indexOf(R.page) < 0) { location.replace(ui.policyHref(R.p)); return false; }
    if (R.scope === 'client' && !P.client[R.page]) { location.replace('#c/summary'); return false; }
    Shell.disposeTooltips($('sidebar'));
    renderModules(R);
    renderSide(R);
    syncSearch(R);
    renderPage(R);
    Shell.initTooltips($('sidebar'));
    return true;
  }

  /* ============================================================ Modules
     The system modules, as Buckholt Page navigation with icons (the icon
     straight inside the link). Client and policy pages belong to Broking.
     The same list is written into the drawer for narrow screens. */
  function renderModules(r) {
    var cur = r.scope === 'app' && ['dashboard', 'search', 'newclient'].indexOf(r.page) < 0 ? r.page : 'dashboard';
    var list = function (extra) {
      return '<ul class="nav' + (extra ? ' ' + extra : '') + '">' + M.MODULES.map(function (m) {
        var on = m.id === cur;
        return '<li class="nav-item"><a class="nav-link' + (on ? ' active' : '') + '" href="#' + m.id + '"' + (on ? ' aria-current="page"' : '') + '>' +
          icon(m.icon) + t(m.label) + '</a></li>';
      }).join('') + '</ul>';
    };
    $('mob-modules').innerHTML = list('');
    $('mob-drawer-modules').innerHTML = list('flex-column mob-nav');
  }

  /* ============================================================= Search
     At the top of the menu on every page. Running a search opens Broking's
     landing page with the results. Clicking into the field shows recent
     searches in a Buckholt Menu panel: Down arrow moves into it, Up / Down
     move through it, Escape closes it and returns to the field. */
  var searchForm = $('mob-search');
  var searchInput = $('mob-search-input');
  var recentPanel = $('mob-recent');

  /* "What can I search?" content: Collapse's title in a Text block, then the
     groups as Buckholt Lists with a list heading, inside the documented
     `.collapse-contextbar` (which spaces them and the Link). */
  (function () {
    var h = F.searchHelp;
    var list = function (head, items) {
      return '<ul class="list"><li class="list-heading">' + esc(head) + '</li>' +
        items.map(function (x) { return '<li class="list-item">' + esc(x) + '</li>'; }).join('') + '</ul>';
    };
    $('mob-search-help-content').innerHTML =
      '<div class="text-block"><h6 class="collapse-title">' + esc(h.title) + '</h6></div>' +
      '<div class="collapse-contextbar">' +
        h.groups.map(function (g) { return list(g[0], g[1]); }).join('') +
        list('Tip:', [h.tip]) +
        '<a class="link-standalone" href="#" data-toast="Search help is not part of this prototype">' +
          '<span class="icon"><i class="fa-regular fa-arrow-up-right-from-square" aria-hidden="true"></i></span>Learn more</a>' +
      '</div>';
  }());

  function syncSearch(r) {
    searchInput.value = r.scope === 'app' && r.page === 'search' ? S.query : '';
  }

  function recentItems() { return Array.prototype.slice.call(recentPanel.querySelectorAll('.menu-item')); }

  function openRecent() {
    var list = F.recentSearches;
    if (!list.length) return;
    $('mob-recent-items').innerHTML =
      '<li><h6 class="menu-section-header" id="mob-recent-label">Recent searches</h6></li>' +
      list.map(function (q) {
        return '<li><button class="menu-item" type="button" data-recent="' + esc(q) + '">' +
          icon(M.ICON.history) + esc(q) + '</button></li>';
      }).join('');
    recentPanel.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }

  function closeRecent() {
    recentPanel.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  }

  function runSearch(q) {
    q = String(q || '').trim();
    if (!q) { searchInput.focus(); return; }
    closeRecent();
    S.query = q;
    F.recentSearches = [q].concat(F.recentSearches.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 5);
    var target = '#search/' + encodeURIComponent(q);
    if (location.hash === target) go(); else location.hash = target;
  }

  searchForm.addEventListener('submit', function (e) { e.preventDefault(); runSearch(searchInput.value); });
  searchInput.addEventListener('focus', openRecent);
  searchInput.addEventListener('click', openRecent);
  searchInput.addEventListener('input', function () { if (searchInput.value) closeRecent(); else openRecent(); });
  searchForm.addEventListener('keydown', function (e) {
    var items = recentItems();
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (recentPanel.hidden) openRecent();
      items = recentItems();
      if (items.length) items[i < 0 ? 0 : Math.min(i + 1, items.length - 1)].focus();
    } else if (e.key === 'ArrowUp' && i >= 0) {
      e.preventDefault();
      if (i === 0) searchInput.focus(); else items[i - 1].focus();
    } else if (e.key === 'Escape' && !recentPanel.hidden) {
      e.stopPropagation();
      closeRecent();
      searchInput.focus();
    }
  });
  searchForm.addEventListener('focusout', function (e) {
    if (!searchForm.contains(e.relatedTarget)) closeRecent();
  });
  recentPanel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-recent]');
    if (b) runSearch(b.getAttribute('data-recent'));
  });

  /* ========================================================== User menu
     Under the avatar, as current Mobius has it: the user's name, the
     account tools, then Logout below a divider. The tools are outside this
     prototype, so each says so. */
  $('mob-user-items').innerHTML =
    '<li role="none"><h6 class="menu-section-header">' + esc(F.user.name) + '</h6></li>' +
    '<li role="none"><hr class="menu-divider"></li>' +
    F.userMenu.map(function (label) {
      return '<li role="none"><button class="menu-item" type="button" role="menuitem" data-toast="' + esc(label) + ' is not part of this prototype">' + esc(label) + '</button></li>';
    }).join('') +
    '<li role="none"><hr class="menu-divider"></li>' +
    '<li role="none"><button class="menu-item" type="button" role="menuitem" data-toast="Logout is not part of this prototype">' +
      icon('fa-regular fa-arrow-right-from-bracket') + 'Logout</button></li>';

  /* After a re-render, put focus back on the control that caused it. */
  function refocus(focusId) {
    if (!focusId) return;
    var el = document.querySelector('[data-focus-id="' + focusId + '"]');
    if (el) el.focus();
  }

  var firstRender = true;
  function go() {
    S.step = 0;
    closeDrawer(false);
    if (!render()) return;
    $('mob-side').scrollTop = 0;
    window.scrollTo(0, 0);
    /* A route change moves focus to the new page's heading, so it is
       announced. Not on first load. */
    if (!firstRender) $('mob-title').focus({ preventScroll: true });
    firstRender = false;
  }

  /* ============================================================== Toasts */

  function toast(message) { Shell.showToast(message, 'success'); }

  /* ======================================================== Side panels
     One Blade per panel, created the first time it opens. The Blade handles
     the scrim, focus trap, Escape and focus return. */

  var blades = {};
  var pendingRender = false;

  function setPressed() {
    Array.prototype.forEach.call(document.querySelectorAll('.menu-item[aria-pressed]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-action') === S.panelKey ? 'true' : 'false');
    });
  }

  function panelFooter(b) {
    return b[2]
      ? ui.set([
          ui.btn('Cancel', { variant: 'ghost', attrs: ' data-panel-close' }),
          ui.btn(b[3] || 'Save', { variant: 'primary', attrs: ' data-panel-save' })
        ], 'button-set-end')
      : ui.set([ui.btn('Close', { variant: 'ghost', attrs: ' data-panel-close' })], 'button-set-end');
  }

  function openPanel(key, arg, trigger) {
    var f = P.panels[key];
    if (!f) return;
    var b = f(R && R.p, arg);
    var blade = blades[key];
    if (!blade) {
      blade = blades[key] = new Blade({
        id: 'mob-panel-' + key,
        title: plain(b[0]),
        footer: panelFooter(b),
        onClose: function () {
          S.panelKey = null;
          setPressed();
          if (pendingRender) {
            pendingRender = false;
            render();
            var again = document.querySelector('[data-panel="' + key + '"], [data-action="' + key + '"]');
            if (again) again.focus();
          }
        }
      });
    }
    blade.el.querySelector('.blade-title').innerHTML = t(b[0]);
    blade.toastMessage = b[2];
    blade.setBody(b[1]);
    Shell.initTooltips(blade.bodyEl);
    S.panelKey = key;
    setPressed();
    blade.open(trigger);
  }

  function openBlade() {
    var key = S.panelKey;
    return key && blades[key] && blades[key].isOpen() ? blades[key] : null;
  }

  function savePanel() {
    var blade = openBlade();
    if (!blade) return;
    if (S.panelKey === 'cnotes') {
      var field = $('cn');
      var text = field ? field.value.trim() : '';
      if (!text) { field.focus(); return; }
      F.clientNotes.unshift({ by: F.user.name, at: '01/10/2026 15:26', text: text });
      pendingRender = true;
    }
    var msg = blade.toastMessage;
    blade.close();
    if (msg) toast(msg);
  }

  /* ======================================================= Confirmations
     The Buckholt Modal in the page source. Bootstrap's Modal plugin gives
     the backdrop, Escape and its focus trap; this adds Tab wrapping, the
     initial focus on Cancel and focus return to the trigger. */

  var confirmEl = $('mob-confirm');
  var confirmModal = new bootstrap.Modal(confirmEl);
  var confirmKey = null;
  var confirmTrigger = null;
  var confirmToast = null;

  function openConfirm(key, trigger) {
    var c = M.CONFIRMS[key];
    if (!c) return;
    confirmKey = key;
    confirmTrigger = trigger || document.activeElement;
    $('mob-confirm-title').textContent = c[0];
    $('mob-confirm-text').textContent = c[1];
    var ok = $('mob-confirm-ok');
    ok.className = 'btn btn-primary' + (c[4] ? ' btn-danger' : '');
    ok.innerHTML = '<span class="button-label">' + esc(c[2]) + '</span>';
    confirmModal.show();
  }

  confirmEl.addEventListener('shown.bs.modal', function () {
    confirmEl.setAttribute('role', 'alertdialog');
    $('mob-confirm-cancel').focus();
  });

  confirmEl.addEventListener('hidden.bs.modal', function () {
    var trigger = confirmTrigger;
    var key = confirmKey;
    confirmTrigger = null;
    confirmKey = null;
    if (trigger && document.contains(trigger)) trigger.focus();
    else {
      var again = document.querySelector('[data-action="' + key + '"], [data-confirm="' + key + '"]');
      if (again) again.focus();
    }
    if (confirmToast) { toast(confirmToast); confirmToast = null; }
  });

  $('mob-confirm-ok').addEventListener('click', function () {
    confirmToast = M.CONFIRMS[confirmKey][3];
    confirmModal.hide();
  });

  /* Bootstrap's focus trap catches focus landing outside, but not Tab off the
     last control into the browser's own chrome. Wrap Tab inside the dialog. */
  function wrapTab(container, e) {
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (n) { return n.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  confirmEl.addEventListener('keydown', function (e) { wrapTab(confirmEl, e); });

  /* ================================================================ Drawer
     Below 992px the menu is a drawer behind the Menu button: a dialog while
     it is open, with the rest of the page inert behind it. */

  var sidebar = $('sidebar');
  var menuButton = $('mob-menu-open');
  var scrim = $('mob-scrim');
  var narrow = window.matchMedia('(max-width: 991.98px)');

  function drawerOpen() { return sidebar.classList.contains('is-open'); }

  function openDrawer() {
    sidebar.classList.add('is-open');
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    scrim.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    document.querySelector('.app-bar').inert = true;
    $('main').inert = true;
    $('mob-menu-close').focus();
  }

  function closeDrawer(restoreFocus) {
    if (!drawerOpen()) return;
    sidebar.classList.remove('is-open');
    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    scrim.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    document.querySelector('.app-bar').inert = false;
    $('main').inert = false;
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', openDrawer);
  scrim.addEventListener('click', function () { closeDrawer(true); });
  sidebar.addEventListener('keydown', function (e) { if (drawerOpen()) wrapTab(sidebar, e); });
  narrow.addEventListener('change', function (e) { if (!e.matches) closeDrawer(false); });

  /* =============================================================== Events */

  function dialogOpen() {
    /* Anything that Escape should close first: a panel, a confirmation,
       the user menu, or the recent searches under the search field. */
    return !!document.querySelector('.modal.show, .offcanvas.show, .mob-user-menu .dropdown-menu.show') ||
      !$('mob-recent').hidden;
  }

  document.addEventListener('click', function (e) {
    var el = e.target;

    /* The skip link moves focus without touching the route. */
    if (el.closest('[data-skip]')) { e.preventDefault(); $('mob-title').focus(); return; }
    if (el.closest('[data-close-menu]')) { closeDrawer(true); return; }
    if (el.closest('[data-noop]')) { e.preventDefault(); return; }
    /* Breadcrumb overflow items are Menu buttons (Code & specs); each goes to its page. */
    var goEl = el.closest('[data-go]');
    if (goEl) { location.hash = goEl.getAttribute('data-go').replace(/^#/, ''); return; }

    /* Links that act in place (role="button") never change the route. */
    if (el.closest('a[role="button"]')) e.preventDefault();

    var g = el.closest('[data-group]');
    if (g) {
      var key = g.getAttribute('data-group');
      S.open[key] = g.getAttribute('aria-expanded') !== 'true';
      g.setAttribute('aria-expanded', String(S.open[key]));
      $(g.getAttribute('aria-controls')).hidden = !S.open[key];
      return;
    }

    var sw = el.closest('[data-switch]');
    if (sw) {
      S.switchOpen = !S.switchOpen;
      sw.setAttribute('aria-expanded', String(S.switchOpen));
      $('mob-switch').hidden = !S.switchOpen;
      return;
    }

    var more = el.closest('[data-more]');
    if (more) {
      var focusId = more.getAttribute('data-focus-id');
      S.polShown = more.getAttribute('data-more') === '1' ? Math.min(F.policies.length, S.polShown + 5) : 5;
      var y = $('mob-side').scrollTop;
      render();
      $('mob-side').scrollTop = y;
      refocus(focusId);
      return;
    }

    var act = el.closest('[data-action]');
    if (act) {
      var id = act.getAttribute('data-action');
      var scope = act.getAttribute('data-scope');
      var def = (scope === 'policy' ? M.POLICY_ACTIONS : M.GLOBAL_ACTIONS)[id];
      if (!def) return;
      if (def.kind === 'panel') {
        if (S.panelKey === id && openBlade()) openBlade().close();
        else openPanel(id, null, act);
      } else if (def.kind === 'confirm') {
        openConfirm(id, act);
      } else if (def.kind === 'flow') {
        location.hash = '#p/' + R.p.id + '/' + def.to;
      }
      return;
    }

    if (el.closest('[data-panel-save]')) { savePanel(); return; }
    if (el.closest('[data-panel-close]')) { var b = openBlade(); if (b) b.close(); return; }

    var step = el.closest('[data-step]');
    if (step) {
      S.step = +step.getAttribute('data-step');
      renderPage(R);
      window.scrollTo(0, 0);
      $('mob-title').focus({ preventScroll: true });
      return;
    }

    var fin = el.closest('[data-finish]');
    if (fin) {
      toast(fin.getAttribute('data-msg'));
      location.hash = fin.getAttribute('data-finish').replace(/^#/, '');
      return;
    }

    var panel = el.closest('[data-panel]');
    if (panel && panel.tagName === 'A') e.preventDefault();
    if (panel && !panel.disabled) { openPanel(panel.getAttribute('data-panel'), panel.getAttribute('data-arg'), panel); return; }

    var cf = el.closest('[data-confirm]');
    if (cf && !cf.disabled) { openConfirm(cf.getAttribute('data-confirm'), cf); return; }

    var ts = el.closest('[data-toast]');
    if (ts) { if (ts.tagName === 'A') e.preventDefault(); toast(ts.getAttribute('data-toast')); return; }

    /* Clickable table rows. The row's own link is the keyboard path; a click
       anywhere else on the row follows it. */
    if (el.closest('a, button, input, select, textarea, label')) return;
    var row = el.closest('tr[data-href]');
    if (row) location.hash = row.getAttribute('data-href').replace(/^#/, '');
  });

  /* Links that act in place are role="button": Space activates them too. */
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && e.target.matches && e.target.matches('a[role="button"]')) { e.preventDefault(); e.target.click(); }
  });

  document.addEventListener('change', function (e) {
    var s = e.target.closest && e.target.closest('[data-switch-toast]');
    if (s) toast(s.getAttribute('data-switch-toast') + (s.checked ? ' turned on' : ' turned off'));
  });

  /* "Show wording changes": a review aid that highlights every terminology
     change from current Mobius. Off, the wording reads as plain text. */
  $('mob-terms-toggle').addEventListener('change', function () {
    document.body.classList.toggle('mob-hide-terms', !this.checked);
  });

  /* Escape closes the drawer. A panel or confirmation open on top of it
     closes first, by itself. */
  /* Capture phase: this must see the panel or confirmation still open,
     before its own Escape handler closes it. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawerOpen() && !dialogOpen()) closeDrawer(true);
  }, true);

  window.addEventListener('hashchange', go);
  phone.addEventListener('change', function () { if (R) renderPage(R); });

  Shell.startClock();
  Shell.initTooltips(document.querySelector('.app-bar'));
  Shell.initTooltips(sidebar);
  go();
}());
