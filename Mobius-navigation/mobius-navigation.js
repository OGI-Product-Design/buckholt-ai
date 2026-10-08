/* ============================================================================
   Mobius navigation prototype — routing, the two-level menu and behaviour
   ============================================================================

   Routes are the prototype's hash routes, unchanged:

     #dashboard  #search/{query}  #newclient   Broking (app level)
     #activity #renewals #bordereau #accounts   other modules (placeholders)
     #c/{page}                                  client level
     #p/{policy id}/{page}                      policy level

   A policy page its status does not have redirects to that policy's
   overview, and an unknown client page to the Client overview.

   The menu is rebuilt on every route change. It is two columns at client
   and policy level, and nothing at app level:

     rail     the client (User meta), the client's menu (Client overview,
              then the "Client" group), their policies, Client support
     record   (a white panel, inset 8px) once a policy is open: the policy
              and its pages in always-open groups. Its actions are in the
              page heading

   The systems (Broking, Activity, Renewals, Bordereau, Accounts) are in the
   system menu at the top right, and the search field is next to the
   wordmark; it opens the search Modal.

   Menu actions only happen in place. A side panel opens in the shared
   prototype Blade (`prototype/blade.js`) and its menu item stays pressed
   while it is open; a confirmation opens the Buckholt Modal in this page.
   Both trap focus, close on Escape and give focus back to what opened them.

   Below 1024px the menu becomes a drawer behind the Menu button.
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

  /* polShown: how many
     policies every policy list shows. step: the current step of a flow. */
  /* query: the last search run, or null before the first one. */
  /* railOverride: the rail opened (true) or collapsed (false) by hand, or
     null. Untouched, a policy page collapses the rail to leave the page
     room; once it has been opened or collapsed by hand, that choice stays
     from page to page (Laurence, 7 October 2026). */
  /* query: the last search run; modalQuery: the search shown in the search
     Modal (null shows recent searches). searchOpen: the clients opened in
     the results' Accordion; searchFilter: the results' filters.
     A new search resets both. */
  var S = { polShown: 5, step: 0, railOverride: null, panelKey: null, query: null, modalQuery: null, searchTrigger: null, searchOpen: {}, searchFilter: {} };
  P.init(S);

  var R = null;
  var sidebar = document.getElementById('sidebar');
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

  /* Buckholt Page navigation: `.nav > .nav-item > .nav-link`, the icon
     straight inside the link before the label, `.active` on the current
     page. Stacked with Bootstrap's `.flex-column`, as Buckholt's own
     documentation site stacks its side navigation. */
  function navLink(id, label, iconCls, cur, url) {
    var on = id === cur;
    return '<li class="nav-item">' +
      '<a class="nav-link' + (on ? ' active' : '') + '" href="' + url + '"' + (on ? ' aria-current="page"' : '') + '>' +
        (iconCls ? icon(iconCls) : '') + t(label) + countBadge(countFor(id)) +
      '</a>' +
    '</li>';
  }

  /* New items on a page (Documents, Attachments, Notes, History): a count
     badge at the end of its link, to Mark's badge design, in place of the
     quick links that used to sit in the Policy overview heading. The count
     is read out as ", 3 new". */
  function countFor(id) { return (F.quickLinkCounts || {})[id] || 0; }
  function countBadge(n) {
    if (!n) return '';
    return '<span class="badge mob-count mob-count-inline" aria-hidden="true">' + (n > 999 ? '999+' : n) + '</span>' +
      '<span class="visually-hidden">, ' + n + ' new</span>';
  }

  /* Which columns are open follows where you are:
       app level     the rail is open (the search); no record column
       client pages  the rail and the client record column are open
       policy pages  the rail collapses to a 64px strip; the policy menu is
                     open (Laurence: on a policy page the client's menu
                     closes)
     The rail has Mark's collapse button, which is also its open button.
     A choice made with it lasts until the next page, which sets the rail
     for itself again. Collapsed, each category is one icon button;
     pressing it opens the rail at that category (Laurence, 7 October 2026,
     in place of floating menus). The record column is always open: it has
     no collapse button (Laurence). In the drawer (below 1024px)
     everything is open and there are no toggles. */
  function railCollapsed() {
    if (narrow.matches) return false;
    return S.railOverride !== null ? !S.railOverride : R.scope === 'policy';
  }

  /* A collapsed control is icon-only: its accessible name, and a Tooltip to
     the right (Buckholt requires one for icon-only Buttons). */
  function tipAttrs(name) {
    return ' aria-label="' + esc(name) + '" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + esc(name) + '"';
  }

  /* A collapsed category: an icon-only ghost Button that opens its column
     (`data-expand`) and moves focus to the category there (`data-focus`). */
  function expander(column, focusSel, name, inner, on) {
    return '<li class="mob-strip-item"><button type="button" class="btn btn-ghost' + (on ? ' active' : '') + '" data-expand="' + column + '" data-focus="' + esc(focusSel) + '"' +
      tipAttrs(name) + (on ? ' aria-current="true"' : '') + '>' + inner + '</button></li>';
  }


  /* The client's policies, open rail: Page navigation, one link per
     policy: the status, the Car, the reference over the line of business,
     and a chevron. The 5 most recent, then "Show 2 more". */
  function railPolicies(curId) {
    /* A group like the client's above it (Laurence, 8 October 2026): the
       Shield and "Policies" as its label, then the policies indented under
       a rule, then Show more. */
    return '<ul class="nav flex-column mob-nav"><li class="nav-item mob-group">' +
      '<span class="mob-group-label" id="mob-rail-policies">' + icon(M.ICON.policies) + 'Policies</span>' +
      '<ul class="nav flex-column mob-subnav mob-rail-policies" aria-labelledby="mob-rail-policies">' + ui.shownPolicies().map(function (p) {
        var on = p.id === curId;
        return '<li class="nav-item">' +
          '<a class="nav-link' + (on ? ' active' : '') + '" href="' + ui.policyHref(p) + '"' + (on ? ' aria-current="true"' : '') + '>' +
            /* The status as an eyebrow, plain text above the row (Laurence,
               7 October 2026: in place of the Tag). No Car of its own: the
               group's Shield labels the list, the line of business says
               Motor, and indented under the group's rule the reference
               needs the room (Laurence, 8 October 2026). */
            ui.statusDot(p, 'mob-rail-status') +
            /* The reference leads (it is what tells the rows apart), the
               line of business under it. */
            '<span class="mob-rail-text"><span class="mob-rail-title">' + esc(p.ref) + '</span>' +
              '<span class="mob-rail-sub">' + esc(F.client.businessLine) + '</span></span>' +
            /* A right chevron: the policy opens the next column. */
            icon('fa-regular fa-chevron-right', 'mob-rail-chevron') +
          '</a>' +
        '</li>';
      }).join('') + '</ul>' +
      '<div class="mob-more">' + ui.loadMoreButton('side') + '</div>' +
    '</li></ul>';
  }

  /* A column's collapse / open control: one icon-only ghost Button, as on
     the documentation site. */
  function columnToggle(attr, collapsed, what) {
    var name = (collapsed ? 'Open ' : 'Collapse ') + what;
    return ui.set([ui.btn('', { icon: collapsed ? 'fa-regular fa-arrow-right-from-line' : 'fa-regular fa-arrow-left-from-line',
      attrs: ' ' + attr + ' aria-expanded="' + !collapsed + '"' + tipAttrs(name) })], 'mob-column-toggle');
  }

  /* A navigation group, always open (Laurence, 7 October 2026): its label
     with the group's icon (not a link: a group is not a page), then its
     pages, indented past the icon with a rule down the left. */
  function navGroups(items, cur, r) {
    /* `r` gives the links' level: the client's menu links to client pages
       even on a policy page. */
    return '<ul class="nav flex-column mob-nav">' + items.map(function (n) {
      if (!n.children) return navLink(n.id, n.label, n.icon, cur, href(r, n.id));
      var gid = 'mob-group-' + n.group.toLowerCase().replace(/\W+/g, '-');
      return '<li class="nav-item mob-group">' +
        '<span class="mob-group-label" id="' + gid + '">' + icon(n.icon) + t(n.group) + '</span>' +
        '<ul class="nav flex-column mob-subnav" aria-labelledby="' + gid + '">' +
          n.children.map(function (c) { return navLink(c.id, c.label, null, cur, href(r, c.id)); }).join('') +
        '</ul>' +
      '</li>';
    }).join('') + '</ul>';
  }

  /* The menu adds a column as you go deeper (Laurence, 7 October 2026):
       rail    the client: their details, the client's pages, their
               policies and Client support. On every client and policy page.
       record  only once a policy is open: the policy, its actions and its
               menu, beside the rail with that policy marked in it. */
  function renderSide(r) {
    var c = F.client;
    var app = r.scope === 'app';
    var onClient = r.scope === 'client';
    var onPolicy = r.scope === 'policy';
    var tight = railCollapsed();
    /* The menu is the selected client's: at app level there is none. */
    sidebar.classList.toggle('mob-side-empty', app);
    sidebar.classList.toggle('mob-rail-collapsed', tight);

    /* The head: the client in User meta (the runtime's `.user-meta`), the
       Avatar beside the name over the reference, level with the policy's
       head in the next column (Laurence, 8 October 2026). Collapsed, only
       the Avatar shows; the name stays for assistive technology. */
    $('mob-rail-head').innerHTML = app ? '' :
      '<div class="user-meta mob-rail-client">' +
        '<div class="avatar avatar-sm" aria-hidden="true"><div class="avatar-initials">' + esc(c.initials) + '</div></div>' +
        '<div class="user-meta-body"><span class="user-meta-first mob-rail-name">' + esc(c.name) + '</span><span class="mob-rail-ref">' + esc(c.ref) + '</span></div>' +
      '</div>';
    $('mob-rail-head').hidden = app;

    var curPolicy = onPolicy ? r.p.id : null;
    var body = '';
    if (tight) {
      /* Collapsed: one icon button per category, each opening the rail
         there; the actions become icon-only Buttons. */
      body = '<ul class="nav flex-column mob-nav mob-strip">' +
        expander('rail', '.mob-rail-pages a[aria-current], .mob-rail-pages a', 'Client pages',
          '<div class="btn-icon">' + icon(M.ICON.client) + '</div>', onClient) +
        expander('rail', '.mob-rail-policies a[aria-current], .mob-rail-policies a', 'Policies (' + F.policies.length + ')',
          '<div class="btn-icon">' + icon(M.ICON.policies) + '</div>', onPolicy) +
      '</ul>';
    } else if (!app) {
      /* The client's menu, built as the policy's is (the overview, then
         an always-open group), then their policies. */
      body = '<nav aria-label="' + esc(c.name) + '">' +
          '<div class="mob-rail-pages">' + navGroups(M.clientNav(), onClient ? r.page : null, { scope: 'client' }) + '</div>' +
          railPolicies(curPolicy) +
        '</nav>';
    }
    var railBody = $('mob-rail-body');
    railBody.innerHTML = body;
    tipTruncated();
    /* The open policy stays in view beside its menu: the rail scrolls (by
       itself, not the page) to bring it up when it is below the fold. */
    var open = onPolicy && railBody.querySelector('.mob-rail-policies a[aria-current]');
    if (open) {
      var top = open.getBoundingClientRect().top - railBody.getBoundingClientRect().top + railBody.scrollTop;
      if (top + open.offsetHeight > railBody.scrollTop + railBody.clientHeight) railBody.scrollTop = top - railBody.clientHeight / 2 + open.offsetHeight / 2;
    }
    /* The foot: the collapse button at its right (as in Outlook or VS
       Code). Client support is an icon Button in the overview headings,
       beside Client notes (Laurence, 8 October 2026). */
    $('mob-rail-foot').innerHTML = app ? '' : columnToggle('data-rail-toggle aria-controls="mob-rail"', tight, 'client menu');
    $('mob-rail-foot').hidden = app;

    /* The policy column: only once a policy is open. */
    var rec = $('mob-record');
    rec.hidden = !onPolicy;
    sidebar.classList.toggle('mob-has-record', onPolicy);
    if (!onPolicy) { rec.innerHTML = ''; return; }

    var nav = M.policyNav(r.p);
    /* The head: the reference with its status Tag, over the line of
       business; then the menu; then the policy's actions at the foot. */
    var label = c.businessLine;
    /* Always open, with no collapse button (Laurence, 7 October 2026). */
    rec.innerHTML = (
      '<div class="mob-record-head">' +
        /* One policy here, so its status is the small status Tag, at the
           right of the reference (Laurence, 8 October 2026); the rail's
           list keeps the lighter dots. */
        '<div class="mob-record-titlebar">' +
          '<h2 class="mob-record-title" id="mob-record-title">' + esc(r.p.ref) + '</h2>' +
          '<div class="mob-record-status">' + ui.statusTag(r.p, true) + '</div>' +
        '</div>' +
        '<span class="mob-rail-sub mob-record-ref">' + t(label) + '</span>' +
      '</div>') +
      '<nav aria-label="' + esc(label + ' ' + r.p.ref) + '" class="mob-record-nav">' +
        navGroups(nav, r.page, r) +
      '</nav>';
    /* The policy's actions are in the page heading, labelled, beside Client
       support and Policy notes (Laurence, 8 October 2026). */
    tipTruncated();
  }

  /* In the drawer (below 1024px) on a policy page, the policy's menu comes
     first, then the client's pages and policies: what you are most likely
     to want is at the top (Laurence, 7 October 2026).
     Moved in the DOM, not just drawn in that order, so Tab follows it.
     Beside the page, the rail goes back to the left of the policy column. */
  function arrangeDrawer(r) {
    var cols = sidebar.querySelector('.mob-columns');
    var rail = $('mob-rail'), rec = $('mob-record');
    if (narrow.matches && r.scope === 'policy') { if (cols.firstElementChild !== rec) cols.insertBefore(rec, rail); }
    else if (cols.firstElementChild !== rail) cols.insertBefore(rail, rec);
  }

  /* A reference too long for its line ends in "…" and shows in full in a
     Tooltip (Laurence, 7 October 2026). Only where it is actually cut. */
  function tipTruncated() {
    Array.prototype.forEach.call(sidebar.querySelectorAll('.mob-rail-title, .mob-record-title'), function (el) {
      if (el.scrollWidth > el.clientWidth + 1) {
        el.setAttribute('data-bs-toggle', 'tooltip');
        el.setAttribute('data-bs-title', el.textContent);
      }
    });
  }

  /* ========================================================= Breadcrumbs
     Location-based: Dashboard › client › policy › page. The search is a
     Modal over the page, not a place, so it is not in the trail. They replace the record strip that used to sit
     under the top bar. The current page is the last, unlinked item.
     Breadcrumbs should not wrap, so a long trail puts its middle in
     Breadcrumb's documented overflow menu: past four items on wide screens
     (Dashboard › … › client › policy › page), and past two below 768px
     (Dashboard › … › page). */
  var phone = window.matchMedia('(max-width: 767.98px)');
  function crumbs(r, title, keepOverride) {
    var c = F.client;
    var trail = [];
    if (r.scope === 'app' && (r.page === 'dashboard' || ['activity', 'renewals', 'bordereau', 'accounts'].indexOf(r.page) >= 0)) return '';
    trail.push(['Dashboard', '#dashboard']);
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
    var keep = keepOverride || (phone.matches ? 1 : 3);
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
    /* No eyebrow on client and policy pages: the rail names the client
       and the policy column names the policy (Laurence, 7 October 2026). */
    var eyebrow = r.scope === 'app' ? tt[1] : '';
    return { title: title, eyebrow: eyebrow };
  }

  function renderPage(r) {
    var main = $('mob-page');
    Shell.disposeTooltips(main);
    var tt = titleFor(r);
    var panels = r.scope === 'app' ? P.app[r.page]() : r.scope === 'client' ? P.client[r.page]() : P.policy[r.page](r.p);
    var actions = P.heading(r);

    /* The breadcrumbs and the record's actions share one row above the
       title (Laurence, 8 October 2026): the heading stays the title alone,
       as Heading attachment asks, and the actions sit with the record's
       location. Not sticky. */
    var trail = crumbs(r, tt.title);
    main.innerHTML =
      '<div class="page-panel">' +
        (trail || actions ? '<div class="mob-page-bar">' + trail +
          (actions ? '<div class="mob-heading-actions">' + actions + '</div>' : '') + '</div>' : '') +
        '<div class="mob-heading">' +
          '<div class="text-block">' +
            (tt.eyebrow ? '<span class="eyebrow">' + t(tt.eyebrow) + '</span>' : '') +
            '<h1 class="display-01" id="mob-title" tabindex="-1">' + t(tt.title) + '</h1>' +
          '</div>' +
        '</div>' +
      '</div>' +
      panels.map(function (x) { return '<div class="page-panel">' + x + '</div>'; }).join('');

    document.title = 'Mobius · ' + plain(tt.title).replace(/[“”]/g, '');
    fitBar();
    Shell.initTooltips(main);
  }

  /* The breadcrumbs and the actions share a row. When they do not fit, the
     trail's middle folds into Breadcrumb's documented overflow menu (Dashboard
     › … › page) so the actions stay beside it; only if that still does not
     fit do the actions drop under the trail. Run on every page and whenever
     Main changes width. */
  function fitBar() {
    var main = $('mob-page');
    var bar = main.querySelector('.mob-page-bar');
    var act = bar && bar.querySelector('.mob-heading-actions');
    var nav = bar && bar.querySelector('.mob-crumbs');
    if (!act || !nav || !R) return;
    var tt = titleFor(R);
    /* Wrapped when the actions start below the breadcrumbs' bottom edge. */
    var fits = function () { var n = bar.querySelector('.mob-crumbs'); return act.offsetTop < n.offsetTop + n.offsetHeight; };
    Shell.disposeTooltips(nav);
    nav.outerHTML = crumbs(R, tt.title);
    if (!fits()) bar.querySelector('.mob-crumbs').outerHTML = crumbs(R, tt.title, 1);
    Shell.initTooltips(bar.querySelector('.mob-crumbs'));
  }
  /* Main changes width with the window and when the client menu opens or
     collapses: refit then. */
  var fitTimer = null, fitWidth = 0;
  new ResizeObserver(function (entries) {
    var w = Math.round(entries[0].contentRect.width);
    if (w === fitWidth) return;
    fitWidth = w;
    clearTimeout(fitTimer); fitTimer = setTimeout(fitBar, 50);
  }).observe($('main'));

  function render() {
    R = parse();
    if (R.scope === 'policy' && M.allowedPolicyPages(R.p).indexOf(R.page) < 0) { location.replace(ui.policyHref(R.p)); return false; }
    if (R.scope === 'client' && !P.client[R.page]) { location.replace('#c/summary'); return false; }
    /* A search link (#search/{query}) opens the search Modal over the
       Dashboard. */
    if (R.scope === 'app' && R.page === 'search') { S.pendingSearch = S.query; location.replace('#dashboard'); return false; }
    Shell.disposeTooltips($('sidebar'));
    renderSystems(R);
    /* No client menu at app level, so no Menu button for it either. */
    $('mob-menu-open').parentNode.hidden = R.scope === 'app';
    /* Not while creating one. */
    $('mob-create-client').hidden = R.scope === 'app' && R.page === 'newclient';
    renderSide(R);
    arrangeDrawer(R);
    renderPage(R);
    Shell.initTooltips($('sidebar'));
    return true;
  }

  /* ============================================================ Systems
     The system menu at the top right: an icon-only Menu button whose panel
     is Menu's documented Link variant, one link per system with its icon
     (Laurence, 8 October 2026: back to documented Buckholt, in place of
     Response buttons). Its trigger is labelled with the current system, so
     the top bar says where you are. Client and policy pages are Broking's;
     the current system is `aria-current="page"`. */
  function currentSystem(r) {
    return r.scope === 'app' && ['dashboard', 'search', 'newclient'].indexOf(r.page) < 0 ? r.page : 'dashboard';
  }
  function renderSystems(r) {
    var cur = currentSystem(r);
    /* The trigger's label is the current system. */
    $('mob-system-current').innerHTML = t(M.MODULES.filter(function (m) { return m.id === cur; })[0].label);
    $('mob-systems-items').innerHTML =
      M.MODULES.map(function (m) {
        var on = m.id === cur;
        return '<li role="none"><a class="menu-item" role="menuitem" href="#' + m.id + '"' + (on ? ' aria-current="page"' : '') + '>' +
          icon(m.icon) + t(m.label) +
          /* The current system: a tick at the item's end, and Menu's own
             active colours (below), so it is not marked by colour alone. */
          (on ? icon('fa-regular fa-check', 'mob-menu-current') + '<span class="visually-hidden">, current</span>' : '') + '</a></li>';
      }).join('');
  }

  /* ============================================================= Search
     The field in the top bar opens the search in a large Buckholt
     Modal (Jon's suggestion), so the page you are on stays behind it.
     Opening it shows recent searches (a Menu shown in place: Down arrow
     moves into it, Up / Down move through it, picking one runs it).
     Running a search shows the results in the Modal; opening a client or
     policy from them closes it. */
  var searchModalEl = $('mob-search-modal');
  var searchModal = new bootstrap.Modal(searchModalEl);
  var searchForm = $('mob-search');
  var searchInput = $('mob-search-input');
  var modalForm = $('mob-search-modal-form');
  var modalInput = $('mob-search-modal-input');
  var modalBody = $('mob-search-modal-body');

  /* "What can I search?": the help panel's content. A heading with a close
     Button (Modal's own `.btn-close`), then a Buckholt List per group with
     its list heading, the tip, and "Learn more" as a standalone Link with
     the External-link icon. */
  (function () {
    var h = F.searchHelp;
    var list = function (head, items) {
      return '<ul class="list"><li class="list-heading">' + esc(head) + '</li>' +
        items.map(function (x) { return '<li class="list-item">' + esc(x) + '</li>'; }).join('') + '</ul>';
    };
    $('mob-search-help').innerHTML =
      '<div class="mob-search-help-body">' +
        '<div class="text-block"><div class="heading"><div class="heading-content"><h3 class="title-01" id="mob-search-help-title">' + esc(h.title) + '</h3></div>' +
          '<button type="button" class="btn-close" data-help-close aria-label="Close"></button></div></div>' +
        h.groups.map(function (g) { return list(g[0], g[1]); }).join('') +
        list('Tip:', [h.tip]) +
        '<a class="link-standalone" href="#" data-toast="Search help is not part of this prototype">' +
          '<span class="icon"><i class="fa-regular fa-arrow-up-right-from-square" aria-hidden="true"></i></span>Learn more</a>' +
      '</div>';
    /* Fixed positioning, so the panel floats over the Modal rather than
       being clipped by its scrolling body. */
    bootstrap.Dropdown.getOrCreateInstance($('mob-search-help-toggle'), { autoClose: 'outside', popperConfig: { strategy: 'fixed' } });
    $('mob-search-help').addEventListener('click', function (e) {
      if (e.target.closest('[data-help-close]')) bootstrap.Dropdown.getOrCreateInstance($('mob-search-help-toggle')).hide();
    });
    /* Escape closes the help first, not the whole search. */
    $('mob-search-help').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); bootstrap.Dropdown.getOrCreateInstance($('mob-search-help-toggle')).hide(); $('mob-search-help-toggle').focus(); }
    });
  }());

  function recentMenu() {
    if (!F.recentSearches.length) return '';
    return '<div class="menu mob-actions mob-recent">' +
      '<div class="menu-panel show position-relative mob-menu-inline" role="group" aria-labelledby="mob-recent-label">' +
        '<ul class="menu-body">' +
          '<li><h6 class="menu-section-header" id="mob-recent-label">Recent searches</h6></li>' +
          F.recentSearches.map(function (q) {
            return '<li><button class="menu-item" type="button" data-recent="' + esc(q) + '">' + icon(M.ICON.history) + esc(q) + '</button></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  /* The body: recent searches until a search is run, then its results
     (the Search results page's own content). No Create new client here
     (Laurence, 7 October 2026): it is in the Dashboard's heading. */
  function renderSearchBody() {
    Shell.disposeTooltips(modalBody);
    if (!S.modalQuery) { modalBody.innerHTML = recentMenu(); return; }
    var prev = S.query;
    S.query = S.modalQuery;
    modalBody.innerHTML = P.app.search().join('');
    S.query = prev;
    Shell.initTooltips(modalBody);
  }

  function openSearch(seed) {
    modalInput.value = seed || S.modalQuery || '';
    if (!modalInput.value) S.modalQuery = null;
    renderSearchBody();
    searchModal.show();
  }

  function runModalSearch(q) {
    q = String(q || '').trim();
    if (!q) { S.modalQuery = null; renderSearchBody(); modalInput.focus(); return; }
    /* A new search starts with every row closed and no filters. */
    if (q !== S.modalQuery) { S.searchOpen = {}; S.searchFilter = {}; }
    S.modalQuery = q;
    S.query = q;
    modalInput.value = q;
    F.recentSearches = [q].concat(F.recentSearches.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 5);
    renderSearchBody();
  }

  searchModalEl.addEventListener('shown.bs.modal', function () { modalInput.focus(); modalInput.select(); });
  /* Back to the field that opened it, without reopening the search. */
  searchModalEl.addEventListener('hidden.bs.modal', function () {
    if (S.searchTrigger && document.contains(S.searchTrigger)) S.searchTrigger.focus();
    S.searchTrigger = null;
    searchInput.value = '';
  });

  /* The top bar's field opens the Modal on a click, Enter, Down arrow or
     the first character typed, which carries over into the Modal's field.
     A pointer press opens it without focusing the field, so the field's
     focus ring is not left showing behind it, and focus is not put back
     on it afterwards. Opened from the keyboard, focus returns to the field
     when the Modal closes. */
  /* On the field or its icon (on a narrow phone the icon covers it). */
  searchForm.addEventListener('mousedown', function (e) {
    e.preventDefault();
    S.searchTrigger = null;
    openSearch();
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Shift' || e.key === 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    S.searchTrigger = searchInput;
    openSearch(e.key.length === 1 ? e.key : '');
  });
  searchForm.addEventListener('submit', function (e) { e.preventDefault(); });


  modalForm.addEventListener('submit', function (e) { e.preventDefault(); runModalSearch(modalInput.value); });
  modalInput.addEventListener('input', function () {
    if (!modalInput.value && S.modalQuery) { S.modalQuery = null; renderSearchBody(); }
  });
  /* Buckholt's clear button (form.js empties the field): back to recent
     searches, focus in the field. */
  modalForm.querySelector('.input-clear').addEventListener('click', function () {
    setTimeout(function () { S.modalQuery = null; renderSearchBody(); modalInput.focus(); }, 0);
  });
  /* Recent searches: Down arrow from the field moves into them. */
  searchModalEl.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(modalBody.querySelectorAll('[data-recent]'));
    if (!items.length) return;
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && (document.activeElement === modalInput || i >= 0)) {
      e.preventDefault();
      items[i < 0 ? 0 : Math.min(i + 1, items.length - 1)].focus();
    } else if (e.key === 'ArrowUp' && i >= 0) {
      e.preventDefault();
      if (i === 0) modalInput.focus(); else items[i - 1].focus();
    }
  });
  /* Re-draws the results and puts focus back on the control used. */
  function redrawResults(focusId) {
    renderSearchBody();
    var el = focusId && modalBody.querySelector('[data-focus-id="' + focusId + '"]');
    if (el) el.focus();
  }
  modalBody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-recent]');
    if (b) { runModalSearch(b.getAttribute('data-recent')); modalInput.focus(); return; }
    if (e.target.closest('[data-search-apply]')) {
      var v = function (id) { var x = $(id); return x && x.selectedIndex > 0 ? x.value : ''; };
      S.searchFilter = { brand: v('sb'), lob: v('sl'), status: v('ss') };
      redrawResults('sf-apply');
      return;
    }
    if (e.target.closest('[data-search-clear]')) { S.searchFilter = {}; redrawResults('sf-clear'); }
  });
  /* The Accordion opens and closes a client itself (Bootstrap Collapse);
     its state is kept so a filter or a fresh draw leaves it as it was. */
  modalBody.addEventListener('shown.bs.collapse', function (e) { var k = e.target.getAttribute('data-search-key'); if (k) S.searchOpen[k] = true; });
  modalBody.addEventListener('hidden.bs.collapse', function (e) { var k = e.target.getAttribute('data-search-key'); if (k) S.searchOpen[k] = false; });



  /* "/" opens the search anywhere, unless you are typing. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (!R || dialogOpen() || drawerOpen()) return;
    e.preventDefault();
    S.searchTrigger = document.activeElement && document.activeElement !== document.body ? document.activeElement : searchInput;
    openSearch();
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
    /* Opening a client or policy from the search closes it. */
    if (searchModalEl.classList.contains('show')) { S.searchTrigger = null; searchModal.hide(); }
    S.step = 0;
    closeDrawer(false);
    if (!render()) return;
    window.scrollTo(0, 0);
    /* A route change moves focus to the new page's heading, so it is
       announced. Not on first load. */
    if (!firstRender) $('mob-title').focus({ preventScroll: true });
    /* The rail animates only after the first page has been drawn, so a
       policy page opened directly starts collapsed rather than sliding
       shut. */
    if (firstRender) requestAnimationFrame(function () { requestAnimationFrame(function () { sidebar.classList.remove('mob-no-anim'); }); });
    firstRender = false;
    if (S.pendingSearch) { var q = S.pendingSearch; S.pendingSearch = null; S.searchTrigger = searchInput; runModalSearch(q); openSearch(q); }
  }

  /* ============================================================== Toasts */

  function toast(message) { Shell.showToast(message, 'success'); }

  /* ======================================================== Side panels
     One Blade per panel, created the first time it opens. The Blade handles
     the scrim, focus trap, Escape and focus return. */

  var blades = {};
  var pendingRender = false;

  function setPressed() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-action][aria-pressed]'), function (b) {
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
    /* Client support: whether extra support is in place, which the heading's
       heart shows. */
    if (S.panelKey === 'support') {
      var sw = $('su-on');
      if (sw && sw.checked !== !!F.client.supportOn) {
        F.client.supportOn = sw.checked;
        blade.toastMessage = sw.checked ? 'Extra support in place' : 'Extra support removed';
        pendingRender = true;
      } else blade.toastMessage = null;
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
    /* An item of a closed Menu cannot take focus: its Menu's trigger does. */
    var menu = trigger && trigger.closest('.dropdown-menu');
    if (menu) trigger = menu.parentNode.querySelector('.menu-toggle');
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
      /* Visible, and in the Tab order. */
      function (n) { return n.offsetParent !== null && n.tabIndex !== -1; });
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

  var menuButton = $('mob-menu-open');
  var scrim = $('mob-scrim');
  var narrow = window.matchMedia('(max-width: 1023.98px)');

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
  narrow.addEventListener('change', function (e) { if (!e.matches) closeDrawer(false); if (R) render(); });

  /* =============================================================== Events */

  function dialogOpen() {
    /* Anything that Escape should close first: a panel, a confirmation,
       or the user menu. */
    return !!document.querySelector('.modal.show, .offcanvas.show, .dropdown-menu.show');
  }

  document.addEventListener('click', function (e) {
    var el = e.target;

    /* The skip link moves focus without touching the route. */
    if (el.closest('[data-skip]')) { e.preventDefault(); $('mob-title').focus(); return; }
    if (el.closest('[data-close-menu]')) { closeDrawer(true); return; }
    if (el.closest('[data-rail-toggle]')) { S.railOverride = railCollapsed(); rerenderSide('[data-rail-toggle]'); return; }
    var ex = el.closest('[data-expand]');
    if (ex) {
      S.railOverride = true;
      rerenderSide(ex.getAttribute('data-focus'));
      return;
    }
    if (el.closest('[data-noop]')) { e.preventDefault(); return; }
    /* Breadcrumb overflow items are Menu buttons (Code & specs); each goes to its page. */
    var goEl = el.closest('[data-go]');
    if (goEl) { location.hash = goEl.getAttribute('data-go').replace(/^#/, ''); return; }

    /* Links that act in place (role="button") never change the route. */
    if (el.closest('a[role="button"]')) e.preventDefault();

    var more = el.closest('[data-more]');
    if (more) {
      var focusId = more.getAttribute('data-focus-id');
      S.polShown = more.getAttribute('data-more') === '1' ? Math.min(F.policies.length, S.polShown + 5) : 5;
      var scroller = document.querySelector('.mob-rail-scroll');
      var y = scroller ? scroller.scrollTop : 0;
      var inModal = !!more.closest('#mob-search-modal');
      render();
      scroller = document.querySelector('.mob-rail-scroll');
      if (scroller) scroller.scrollTop = y;
      /* From the search Modal: refresh its results and keep focus there. */
      if (inModal) {
        renderSearchBody();
        var again = modalBody.querySelector('[data-focus-id="' + focusId + '"]');
        if (again) again.focus();
        return;
      }
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
     change from current Mobius. Off by default (Laurence, 7 October 2026):
     the wording reads as plain text until it is switched on. */
  $('mob-terms-toggle').addEventListener('change', function () {
    document.body.classList.toggle('mob-hide-terms', !this.checked);
  });

  /* A Menu whose wrapper carries a Tooltip (More actions, the breadcrumb's
     "…"): the Tooltip hides while the Menu is open, so the two never
     overlap, and comes back once it closes. */
  document.addEventListener('show.bs.dropdown', function (e) {
    var host = e.target.closest && e.target.closest('[data-bs-toggle="tooltip"]');
    var tip = host && bootstrap.Tooltip.getInstance(host);
    if (tip) { tip.hide(); tip.disable(); }
  });
  document.addEventListener('hidden.bs.dropdown', function (e) {
    var host = e.target.closest && e.target.closest('[data-bs-toggle="tooltip"]');
    var tip = host && bootstrap.Tooltip.getInstance(host);
    if (tip) tip.enable();
  });

  /* A toggle re-renders the menu; focus goes to `focusSel`. */
  function rerenderSide(focusSel) {
    Shell.disposeTooltips(sidebar);
    renderSide(R);
    arrangeDrawer(R);
    Shell.initTooltips(sidebar);
    /* A list of selectors is tried in order: the first that matches wins. */
    var f = null;
    (focusSel || '').split(',').some(function (sel) { f = sel.trim() && document.querySelector(sel.trim()); return !!f; });
    if (f) f.focus();
  }

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
