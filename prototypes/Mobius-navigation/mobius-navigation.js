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
   prototype Blade (`prototypes/shared/blade.js`) and its menu item stays pressed
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
     policies each policy list shows, the menu's (side) and the client
     overview's table (table), apart. step: the current step of a flow. */
  /* query: the last search run, or null before the first one. */
  /* query: the last search run; modalQuery: the search shown in the search
     Modal (null shows recent searches). searchOpen: the clients opened in
     the results' Accordion; searchFilter: the results' filters.
     A new search resets both. */
  /* navCollapsed: the whole menu collapsed with its head's button (Mark,
     19 October 2026); it stays so from page to page. sideView: on a
     policy page, which one menu shows beside the strip, 'client' or
     'policy' (null: the policy's); never both (Mark). */
  var S = { groupClosed: {}, openCurrent: false, polShown: { side: 3, table: 5 }, step: 0, navCollapsed: false, sideView: null, panelKey: null, query: null, modalQuery: null, searchTrigger: null, searchOpen: {}, searchFilter: {}, searchMore: {} };
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
        (iconCls ? icon(iconCls) : '') + t(label) + countBadge(countFor(id), id) +
      '</a>' +
    '</li>';
  }

  /* New items on a page (Documents, Attachments, Notes, History): a count
     badge at the end of its link, to Mark's badge design, in place of the
     quick links that used to sit in the Policy overview heading. The count
     is read out as ", 3 new". */
  /* The count is what the page lists (Laurence, 27 October 2026): the
     policy's documents (the Documents page's total) and its notes. */
  function countFor(id) {
    if (id === 'docs') return (F.documents || {}).total || 0;
    if (id === 'notes') return F.policyNote ? 1 : 0;
    return (F.quickLinkCounts || {})[id] || 0;
  }
  var COUNT_NOUN = { docs: ['document', 'documents'], notes: ['note', 'notes'], attachments: ['attachment', 'attachments'], history: ['entry', 'entries'] };
  function countBadge(n, id) {
    if (!n) return '';
    var noun = COUNT_NOUN[id] || ['item', 'items'];
    /* The number alone, as Mark's badge design draws it (Laurence, 27
       October 2026); what it counts is read out. */
    return '<span class="badge mob-count mob-count-inline support-01" aria-hidden="true">' + (n > 999 ? '999+' : n) + '</span>' +
      '<span class="visually-hidden">, ' + n + ' ' + noun[n === 1 ? 0 : 1] + '</span>';
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
  function navCollapsed() { return !narrow.matches && S.navCollapsed; }

  /* A collapsed control is icon-only: its accessible name, and a Tooltip to
     the right (Buckholt requires one for icon-only Buttons). */
  function tipAttrs(name) {
    return ' aria-label="' + esc(name) + '" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + esc(name) + '"';
  }

  /* A strip item: Page navigation without a visible label (Laurence, 29
     October 2026), `li.nav-item > .nav-link`, so it has every state the
     menu's links have (rest, hover, active, focus). It is a button, as it
     opens a column (`data-view`) and moves focus there (`data-focus`);
     its name is in aria-label and a Tooltip. */
  function stripItem(attrs, name, iconCls, on) {
    return '<li class="nav-item mob-strip-item"><button type="button" class="nav-link' + (on ? ' active' : '') + '"' + attrs +
      tipAttrs(name) + (on ? ' aria-current="true"' : '') + '>' + icon(iconCls) + '</button></li>';
  }
  function expander(view, focusSel, name, iconCls, on) {
    return stripItem(' data-view="' + view + '" data-focus="' + esc(focusSel) + '"', name, iconCls, on);
  }


  /* The client's policies, open rail: Page navigation, one link per
     policy: the status, the Car, the reference over the line of business,
     and a chevron. The 5 most recent, then "Show 2 more". */
  function railPolicies(curId) {
    /* A group like the client's above it (Laurence, 8 October 2026): the
       Shield and "Policies" as its label, then the policies indented under
       a rule, then Show more. */
    if (S.openCurrent && curId) delete S.groupClosed['c:Policies'];
    return '<ul class="nav flex-column mob-nav"><li class="' + groupClass('c:Policies') + '">' +
      groupLabel('c:Policies', 'mob-rail-policies', 'mob-rail-policies-list', M.ICON.policies, 'Policies') +
      '<ul class="nav flex-column mob-subnav mob-rail-policies" id="mob-rail-policies-list" aria-labelledby="mob-rail-policies">' + ui.shownPolicies('side').map(function (p) {
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
    /* The Sidebar icon (Laurence, 28 October 2026, from the user study: the
       ←| arrow beside the client's name read as "back"). */
    return ui.set([ui.btn('', { icon: 'fa-regular fa-sidebar',
      attrs: ' ' + attr + ' aria-expanded="' + !collapsed + '"' + tipAttrs(name) })], 'mob-column-toggle');
  }

  /* A group's label is a Button that opens and closes it (Laurence, 22
     October 2026): every group starts open; one closed stays closed for
     the visit, unless you go to a page in it, which opens it again. */
  function groupLabel(key, id, listId, iconCls, text) {
    var open = !S.groupClosed[key];
    return '<button type="button" class="mob-group-label mob-group-toggle" id="' + id + '" data-group="' + esc(key) + '"' +
      ' aria-expanded="' + open + '" aria-controls="' + listId + '">' +
      icon(iconCls) + '<span class="mob-group-name">' + t(text) + '</span>' +
      icon('fa-regular fa-chevron-down', 'mob-group-chevron') +
    '</button>';
  }
  function groupClass(key) { return 'nav-item mob-group' + (S.groupClosed[key] ? ' mob-group-closed' : ''); }

  /* A navigation group, open as standard (Laurence, 7 October 2026): its label
     with the group's icon (not a link: a group is not a page), then its
     pages, indented past the icon with a rule down the left. */
  function navGroups(items, cur, r) {
    /* `r` gives the links' level: the client's menu links to client pages
       even on a policy page. */
    return '<ul class="nav flex-column mob-nav">' + items.map(function (n) {
      if (!n.children) return navLink(n.id, n.label, n.icon, cur, href(r, n.id));
      var gid = 'mob-group-' + n.group.toLowerCase().replace(/\W+/g, '-');
      /* Keyed by level and name: the client's Transactions and a policy's
         are separate groups. */
      var key = (r.scope === 'policy' && n.group !== 'Client' ? 'p:' : 'c:') + n.group;
      if (S.openCurrent && n.children.some(function (c) { return c.id === cur; })) delete S.groupClosed[key];
      return '<li class="' + groupClass(key) + '">' +
        groupLabel(key, gid, gid + '-list', n.icon, n.group) +
        '<ul class="nav flex-column mob-subnav" id="' + gid + '-list" aria-labelledby="' + gid + '">' +
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
  /* The client's menu: their pages, then their policies; only the
     policies scroll (Mark, 19 October 2026). */
  function clientMenu(r, curPolicy, cls) {
    /* Only the Policies section scrolls, never the client's pages above it
       (Laurence, 22 October 2026). */
    return '<nav aria-label="' + esc(F.client.name) + '" class="mob-client-menu mob-all' + (cls ? ' ' + cls : '') + '">' +
        '<div class="mob-rail-pages">' + navGroups(M.clientNav(), r.scope === 'client' ? r.page : null, { scope: 'client' }) + '</div>' +
        railPolicies(curPolicy) +
      '</nav>';
  }
  /* The open policy stays in view in the list: the list scrolls (by
     itself, not the page) to bring it up when it is out of sight. */
  function scrollToOpenPolicy() {
    var list = sidebar.querySelector('.mob-rail-policies');
    var open = list && list.querySelector('a[aria-current]');
    if (!open) { scrollCues(list); return; }
    var top = open.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    if (top < list.scrollTop || top + open.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top - list.clientHeight / 2 + open.offsetHeight / 2;
    scrollCues(list);
  }
  /* A list that scrolls fades at the edge that has more beyond it, so a
     row cut by the edge reads as "more", not as broken. */
  function scrollCues(list) {
    if (!list) return;
    var more = list.scrollHeight - list.clientHeight > 1;
    list.classList.toggle('mob-more-above', more && list.scrollTop > 1);
    list.classList.toggle('mob-more-below', more && list.scrollTop + list.clientHeight < list.scrollHeight - 1);
  }
  document.addEventListener('scroll', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('mob-rail-policies')) scrollCues(e.target);
  }, true);
  window.addEventListener('resize', function () { scrollCues(sidebar.querySelector('.mob-rail-policies')); });

  function renderSide(r) {
    var c = F.client;
    var app = r.scope === 'app';
    var onClient = r.scope === 'client';
    var onPolicy = r.scope === 'policy';
    /* Mark's menu (19 October 2026): the head's button collapses the whole
       menu to the strip; on a policy page the strip's two buttons choose
       the one menu beside it, the client's or the policy's. In the drawer
       (below 1024px) everything is open, as before. */
    var collapsed = navCollapsed();
    var view = onPolicy ? (S.sideView || 'policy') : 'client';
    /* The rail is the strip when collapsed, and beside a policy's menu;
       with the client's menu chosen on a policy page it is the client's
       full card, as at client level (Mark: no menu shown twice). */
    /* B of the A/B test (Laurence, 28 October 2026): on a policy page a
       click on the client icon opens the client's full card to the left of
       the policy's menu, a tree read left to right into the page; both lie
       over the page, which does not move, until a choice is made or not. */
    var beside = onPolicy && !collapsed && !narrow.matches;
    if (!beside) S.besideOpen = false;
    var besideOpen = beside && !!S.besideOpen;
    if (beside) view = 'policy';
    var tight = !app && !narrow.matches && !besideOpen && (collapsed || (onPolicy && view === 'policy'));
    /* The menu is the selected client's: at app level there is none. */
    sidebar.classList.toggle('mob-side-empty', app);
    sidebar.classList.toggle('mob-rail-collapsed', tight);
    sidebar.classList.toggle('mob-nav-collapsed', collapsed);

    /* The head: the client in User meta (the runtime's `.user-meta`), the
       Avatar beside the name over the reference, level with the policy's
       head in the next column (Laurence, 8 October 2026). Collapsed, only
       the Avatar shows; the name stays for assistive technology. */
    $('mob-rail-head').innerHTML = app ? '' :
      /* The client (Avatar and name) is not a link (Laurence, 28 October
         2026): Client overview is the first page in the client's menu. */
      '<div class="user-meta mob-rail-client">' +
        /* Extra support in place (Mark, 21 October 2026): the Avatar takes
           the teal (expressive quaternary) and carries the support icon. */
        '<span class="mob-avatar-wrap" aria-hidden="true">' +
          '<div class="avatar avatar-sm' + (c.supportOn ? ' expressive-quaternary' : '') + '"><div class="avatar-initials">' + esc(c.initials) + '</div></div>' +
          (c.supportOn ? '<span class="mob-avatar-badge"><i class="' + M.ICON.supportOn + '"></i></span>' : '') +
        '</span>' +
        '<div class="user-meta-body"><span class="user-meta-first mob-rail-name">' + esc(c.name) +
          (c.supportOn ? '<span class="visually-hidden">, extra support in place</span>' : '') + '</span><span class="mob-rail-ref">' + esc(c.ref) + '</span></div>' +
      '</div>' +
      /* Mark's menu (19 October 2026): the head spans the menu, the client
         at the top of both columns, the collapse button at its right. */
      /* "Open sidebar" / "Collapse sidebar", as its Sidebar icon says
         (Laurence, 29 October 2026; it said "menu", which the phone's
         Menu button also says). */
      columnToggle('data-rail-toggle aria-controls="sidebar"', collapsed, 'sidebar');
    $('mob-rail-head').hidden = app;

    var curPolicy = onPolicy ? r.p.id : null;
    var body = '';
    if (tight) {
      /* The strip: the client's menu and, on a policy page, the policy's,
         one icon each, labelled by their Tooltips. The menu you are in
         stays marked, in Page navigation's active state (Laurence, 29
         October 2026: they are navigation without a visible label). */
      body = '<ul class="nav flex-column mob-nav mob-strip">' +
        /* Beside the policy's menu the client icon opens the client's menu
           to its left; collapsed, it opens the menu at the client's. */
        (beside
          ? stripItem(' id="mob-beside-toggle" data-beside-open aria-expanded="false" aria-controls="mob-rail"', 'Client menu', M.ICON.client, false)
          : expander('client', '.mob-rail-pages a[aria-current], .mob-rail-pages a', 'Client menu', M.ICON.client, view === 'client')) +
        /* On a policy page the policy's menu, with the policy's own icon,
           the Car, as its Policy group has (Laurence, 29 October 2026). On
           a client page, collapsed, the client icon only (Laurence, 29
           October 2026): the Shield opened the same menu as the client
           icon, at its policies, so it served no purpose and confused. */
        (onPolicy ? expander('policy', '.mob-record-nav a[aria-current], .mob-record-nav a', 'Policy menu', M.productIcon(r.p), view === 'policy') : '') +
      '</ul>';
    } else if (!app) {
      /* The client's menu, built as the policy's is (the overview, then
         an always-open group), then their policies. */
      body = clientMenu(r, curPolicy);
    }
    var railBody = $('mob-rail-body');
    railBody.innerHTML = body;
    tipTruncated();
    /* The open policy stays in view beside its menu: the rail scrolls (by
       itself, not the page) to bring it up when it is below the fold. */
    scrollToOpenPolicy();
    /* The foot: the collapse button at its right (as in Outlook or VS
       Code). Client support is an icon Button in the overview headings,
       beside Client notes (Laurence, 8 October 2026). */
    /* The collapse button moved to the head (Mark, 19 October 2026). */
    $('mob-rail-foot').innerHTML = '';
    $('mob-rail-foot').hidden = true;

    /* The policy column: only once a policy is open. */
    var rec = $('mob-record');
    var showRec = onPolicy && !collapsed && (view === 'policy' || narrow.matches);
    sidebar.classList.toggle('mob-beside-open', besideOpen);
    rec.hidden = !showRec;
    sidebar.classList.toggle('mob-has-record', showRec);
    if (!showRec) { rec.innerHTML = ''; return; }

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
          /* The status mark, at the right of the reference (Mark, 19
             October 2026: in place of the small Tag). */
          '<div class="mob-record-status">' + ui.statusMark(r.p) + '</div>' +
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


  /* ================================================== Client menu beside
     On a policy page the client icon's click opens the client's card to
     the left of the policy's menu, both over the page (Laurence, 28
     October 2026; the hover overlay it was tested against was dropped on
     29 October). Shut by a choice in either menu (a new page), a click or
     focus outside the menu, or Escape (focus back on the icon). */
  var besideHash = null;
  function setBeside(open, focusSel) {
    if (!!S.besideOpen === open) return;
    S.besideOpen = open;
    rerenderSide(focusSel);
  }
  document.addEventListener('pointerdown', function (e) {
    if (S.besideOpen && !sidebar.contains(e.target)) setBeside(false);
  }, true);
  sidebar.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.besideOpen) { e.stopPropagation(); setBeside(false, '#mob-beside-toggle'); }
  });
  sidebar.addEventListener('focusout', function (e) {
    var to = e.relatedTarget;
    if (S.besideOpen && to && !sidebar.contains(to)) setBeside(false);
  });

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
    /* Home, as the House (Laurence, 27 October 2026): the Dashboard is the
       homepage. Named "Home" for assistive technology. */
    trail.push(['Home', '#dashboard', M.ICON.home]);
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
      if (x[2]) return '<li class="breadcrumb-item mob-crumb-home"><a class="breadcrumb-link" href="' + x[1] + '" aria-label="' + esc(x[0]) + '"><i class="' + x[2] + '" aria-hidden="true"></i></a></li>';
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
    /* An amend page is titled as its status's menu item: Amend details,
       Amend quote or Amend risk. */
    if (r.scope === 'policy' && r.p && (r.page === 'amend' || r.page === 'amendquote') && M.amendLabel(r.p, r.page)) title = M.amendLabel(r.p, r.page);
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
    var home = r.scope === 'app' && r.page === 'dashboard';
    main.innerHTML = home
      /* The homepage: its title names its main task, "Find a client or
         policy" (Laurence, 27 October 2026), and labels the search field
         under it; no eyebrow. Title and search are directly related, so
         they share one Panel and sit its 2rem gap apart (Buckholt page
         layout); the Tabs are the next Panel. */
      ? '<div class="page-panel"><div class="mob-heading"><div class="text-block">' +
          '<h1 class="display-01" id="mob-title" tabindex="-1">Find a client or policy</h1>' +
        '</div></div>' + panels[0] + '</div>' +
        panels.slice(1).map(function (x) { return '<div class="page-panel">' + x + '</div>'; }).join('')
      :
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
    if (home) bindHomeSearch();

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
    bar.classList.remove('mob-fold-actions');
    nav.outerHTML = crumbs(R, tt.title);
    if (!fits()) bar.querySelector('.mob-crumbs').outerHTML = crumbs(R, tt.title, 1);
    /* Still too wide: the labelled actions fold into More, as they do on a
       narrow page. */
    if (!fits()) {
      bar.classList.add('mob-fold-actions');
      /* With the actions folded there may be room for the whole trail
         again: show it if it fits, so both are not cut at once. */
      bar.querySelector('.mob-crumbs').outerHTML = crumbs(R, tt.title);
      if (!fits()) bar.querySelector('.mob-crumbs').outerHTML = crumbs(R, tt.title, 1);
    }
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
    /* The homepage (the Dashboard): its search and Create new client are on
       the page, so the top bar does not repeat them (Laurence, 27 October
       2026). */
    document.body.classList.toggle('mob-home', R.scope === 'app' && R.page === 'dashboard');
    /* The Menu button opens the drawer on every page below 1024px: at app
       level it holds the work areas alone (Laurence, 28 October 2026). */
    $('mob-menu-open').parentNode.hidden = false;
    /* Not while creating one. */
    $('mob-create-client').hidden = R.scope === 'app' && R.page === 'newclient';
    /* A new page shuts the client's menu beside; a redraw of the same page
       (Show more inside it) keeps it. */
    if (location.hash !== besideHash) { S.besideOpen = false; besideHash = location.hash; }
    renderSide(R);
    arrangeDrawer(R);
    renderPage(R);
    /* A client with extra support in place: the rule under the top bar
       turns teal on their record (Mark, 21 October 2026). */
    document.body.classList.toggle('mob-support-record', R.scope !== 'app' && !!F.client.supportOn);
    Shell.initTooltips($('sidebar'));
    /* Into a client record from outside it (the Dashboard, the search, or
       on first load): the support needs Modal, once a visit. */
    var entering = R.scope !== 'app' && (!lastScope || lastScope === 'app');
    lastScope = R.scope;
    if (entering) maybeSupportModal();
    return true;
  }
  var lastScope = null;

  /* ================================================= Support needs Modal
     Mark's design (Laurence, 21 October 2026): when a client has extra
     support in place, the first time a broker opens their record in a
     visit, a Modal says so, lists the needs, and offers Client support. */
  var supportEl = $('mob-support-modal');
  var supportModal = new bootstrap.Modal(supportEl);
  var supportSeen = false, supportToPanel = false;
  function maybeSupportModal() {
    if (supportSeen || !F.client.supportOn) return;
    supportSeen = true;
    var c = F.client;
    $('mob-support-needs').innerHTML = (c.supportNeeds || []).map(function (x) {
      return '<li><span class="tag"><span class="tag-label">' + esc(x) + '</span></span></li>';
    }).join('') +
      /* "+3 more" is a plain Tag, not a control (Laurence, 21 October
         2026): Open client support is how to see them all. */
      (c.supportMore ? '<li><span class="tag"><span class="icon"><i class="fa-regular fa-plus" aria-hidden="true"></i></span>' +
        '<span class="tag-label">' + c.supportMore + ' more<span class="visually-hidden"> support needs</span></span></span></li>' : '');
    /* Opened from the search, wait for its Modal to close first. */
    var search = $('mob-search-modal');
    if (search.classList.contains('show') || document.querySelector('.modal-backdrop')) {
      search.addEventListener('hidden.bs.modal', function once() { search.removeEventListener('hidden.bs.modal', once); supportModal.show(); });
    } else supportModal.show();
  }
  function supportTrigger() {
    var all = document.querySelectorAll('[data-panel="support"]');
    for (var i = 0; i < all.length; i++) if (all[i].offsetParent) return all[i];
    /* On a phone it is an item in the closed Actions menu: its Button. */
    var phone = $('mob-phone-actions');
    return phone && phone.offsetParent ? phone : null;
  }
  $('mob-support-open').addEventListener('click', function () { supportToPanel = true; supportModal.hide(); });
  supportEl.addEventListener('shown.bs.modal', function () { $('mob-support-open').focus(); });
  supportEl.addEventListener('hidden.bs.modal', function () {
    if (supportToPanel) { supportToPanel = false; var tr = supportTrigger(); openPanel('support', null, tr); return; }
    var title = $('mob-title');
    if (title) title.focus({ preventScroll: true });
  });

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
    /* Page navigation (Code & specs): the icon straight inside the link,
       the current area `.active` and `aria-current="page"`. */
    $('mob-systems-items').innerHTML = $('mob-drawer-areas-items').innerHTML =
      M.MODULES.map(function (m) {
        var on = m.id === cur;
        return '<li class="nav-item"><a class="nav-link' + (on ? ' active' : '') + '" href="#' + m.id + '"' + (on ? ' aria-current="page"' : '') + '>' +
          icon(m.icon) + '<span class="mob-menu-text"><span class="mob-area-name">' + t(m.label) + '</span><span class="mob-menu-help support-01">' + t(m.desc) + '</span></span></a></li>';
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
  /* Built for the Modal's help, and again for the homepage's (Laurence,
     27 October 2026): `toggleId` / `panelId` / `titleId` name each. */
  function bindSearchHelp(toggleId, panelId, titleId) {
    var h = F.searchHelp;
    var toggle = $(toggleId), panel = $(panelId);
    if (!toggle || !panel) return;
    var list = function (head, items) {
      return '<ul class="list"><li class="list-heading">' + esc(head) + '</li>' +
        items.map(function (x) { return '<li class="list-item">' + esc(x) + '</li>'; }).join('') + '</ul>';
    };
    panel.innerHTML =
      '<div class="mob-search-help-body">' +
        '<div class="text-block"><div class="heading"><div class="heading-content"><h3 class="title-01" id="' + titleId + '">' + esc(h.title) + '</h3></div>' +
          '<button type="button" class="btn-close" data-help-close aria-label="Close"></button></div></div>' +
        h.groups.map(function (g) { return list(g[0], g[1]); }).join('') +
        list('Tip:', [h.tip]) +
        '<a class="link-standalone" href="#" data-toast="Search help is not part of this prototype">' +
          '<span class="icon"><i class="fa-regular fa-arrow-up-right-from-square" aria-hidden="true"></i></span>Learn more</a>' +
      '</div>';
    /* Fixed positioning, so the panel floats over what is under it rather
       than being clipped by a scrolling body. */
    var dd = bootstrap.Dropdown.getOrCreateInstance(toggle, { autoClose: 'outside', popperConfig: { strategy: 'fixed' } });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('[data-help-close]')) dd.hide();
    });
    /* Escape closes the help first, not the whole search. */
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); dd.hide(); toggle.focus(); }
    });
  }
  bindSearchHelp('mob-search-help-toggle', 'mob-search-help', 'mob-search-help-title');

  /* Recent searches; with `filter`, only those containing it (Laurence,
     27 October 2026: they show as you type, in the Modal and on the
     homepage). `id` names the list's header. */
  function recentMenu(filter, id) {
    var f = String(filter || '').trim().toLowerCase();
    var list = F.recentSearches.filter(function (q) { return !f || q.toLowerCase().indexOf(f) >= 0; });
    if (!list.length) return '';
    id = id || 'mob-recent-label';
    return '<div class="menu mob-actions mob-recent">' +
      '<div class="menu-panel show position-relative mob-menu-inline" role="group" aria-labelledby="' + id + '">' +
        '<ul class="menu-body">' +
          '<li><h6 class="menu-section-header" id="' + id + '">Recent searches</h6></li>' +
          list.map(function (q) {
            return '<li><button class="menu-item" type="button" data-recent="' + esc(q) + '">' + icon(M.ICON.history) + esc(q) + '</button></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  /* The body: recent searches until a search is run, then its results
     (the Search results page's own content). Create new client is in the
     top bar (back there 22 October 2026). */
  function renderSearchBody() {
    Shell.disposeTooltips(modalBody);
    if (!S.modalQuery) { modalBody.innerHTML = recentMenu(); announce(''); return; }
    var prev = S.query;
    S.query = S.modalQuery;
    modalBody.innerHTML = P.app.search().join('');
    S.query = prev;
    Shell.initTooltips(modalBody);
    var count = $('mob-search-count');
    announce(count ? count.textContent : '');
  }
  /* The count, into the status region; cleared first so the same count
     after a new search is read again. */
  var statusEl = $('mob-search-status'), announceTimer = null;
  function announce(text) {
    clearTimeout(announceTimer);
    statusEl.textContent = '';
    if (text) announceTimer = setTimeout(function () { statusEl.textContent = text; }, 100);
  }

  var searchOpening = false, typedOpen = false, keptPrevious = false;
  function openSearch(seed) {
    searchOpening = true;
    typedOpen = !!seed;
    keptPrevious = !seed;   /* opened with the last search, which typing replaces */
    modalInput.value = seed || S.modalQuery || '';
    if (!modalInput.value) S.modalQuery = null;
    renderSearchBody();
    searchModal.show();
  }

  function runModalSearch(q) {
    q = String(q || '').trim();
    if (!q) { S.modalQuery = null; renderSearchBody(); modalInput.focus(); return; }
    /* A new search starts with every row closed and no filters. */
    if (q !== S.modalQuery) { S.searchOpen = {}; S.searchFilter = {}; S.searchMore = {}; }
    S.modalQuery = q;
    S.query = q;
    modalInput.value = q;
    F.recentSearches = [q].concat(F.recentSearches.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 5);
    /* Every search shows its results in the Modal, one match included
       (Laurence, 27 October 2026): it never jumps straight to a record. */
    renderSearchBody();
  }

  /* Opened by typing, the caret goes to the end so typing carries on
     (Laurence, 27 October 2026: selecting it let the next key replace the
     first); opened otherwise, the last search is selected to retype. */
  searchModalEl.addEventListener('shown.bs.modal', function () {
    modalInput.focus();
    if (typedOpen) { var n = modalInput.value.length; modalInput.setSelectionRange(n, n); } else modalInput.select();
    typedOpen = false;
    keptPrevious = false;
    searchOpening = false;   /* open: the field has the keys now */
  });
  /* Back to the field that opened it, without reopening the search. */
  searchModalEl.addEventListener('hidden.bs.modal', function () {
    if (S.searchTrigger && document.contains(S.searchTrigger)) S.searchTrigger.focus();
    S.searchTrigger = null;
    searchInput.value = '';
    searchOpening = false;
  });

  /* The top bar's field opens the Modal on a click, Enter, Down arrow or
     the first character typed, which carries over into the Modal's field.
     A pointer press opens it without focusing the field, so the field's
     focus ring is not left showing behind it, and focus is not put back
     on it afterwards. Opened from the keyboard, focus returns to the field
     when the Modal closes. */
  /* On the field or its icon (on a narrow phone the icon covers it). */
  /* The same behaviour for the top bar's field and the homepage's. */
  function bindSearchOpener(form, input) {
    if (!form || !input) return;
    form.addEventListener('mousedown', function (e) {
      if (e.target.closest('a, button')) return;
      e.preventDefault();
      S.searchTrigger = null;
      openSearch();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.key === 'Shift' || e.key === 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (searchOpening) return;   /* typedWhileOpening has it */
      S.searchTrigger = input;
      openSearch(e.key.length === 1 && e.key !== '/' ? e.key : '');   /* "/" is the shortcut, not text */
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
  bindSearchOpener(searchForm, searchInput);
  /* Keys typed while the Modal is still opening (its fade, about 0.3s) go
     into its field, wherever focus is: after a click on the top bar's field
     nothing has focus yet, and the keys were lost, so Enter ran nothing and
     the Modal opened empty (user study, 28 October 2026). The first key
     replaces the last search the Modal opened with, as it would once that
     is selected; later keys go on the end. */
  document.addEventListener('keydown', function (e) {
    if (!searchOpening || e.target === modalInput || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1) {
      e.preventDefault();
      if (keptPrevious) { modalInput.value = ''; keptPrevious = false; }
      modalInput.value += e.key;
      typedOpen = true;   /* the caret goes to the end once it opens */
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (keptPrevious) { modalInput.value = ''; keptPrevious = false; }
      else modalInput.value = modalInput.value.slice(0, -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      keptPrevious = false;
      runModalSearch(modalInput.value);
    }
  }, true);
  /* The phone's search Button opens the same Modal; focus comes back to it. */
  $('mob-search-btn').addEventListener('click', function () { S.searchTrigger = this; openSearch(); });

  /* ====================================================== Homepage search
     The homepage's field opens the search Modal as the top bar's does
     (Laurence, 29 October 2026). */
  function bindHomeSearch() {
    var form = $('mob-home-search');
    if (!form) return;
    bindSearchOpener(form, $('mob-home-search-input'));
  }


  modalForm.addEventListener('submit', function (e) { e.preventDefault(); runModalSearch(modalInput.value); });
  /* As you type, the recent searches that match show (Laurence, 27 October
     2026); with none matching, what was there stays. Emptied, the field
     shows them all again. */
  modalInput.addEventListener('input', function () {
    var v = modalInput.value;
    if (!v.trim()) { S.modalQuery = null; renderSearchBody(); return; }
    if (v.trim() === S.modalQuery) { renderSearchBody(); return; }
    var m = recentMenu(v);
    if (m) modalBody.innerHTML = m;
    else if (!S.modalQuery) modalBody.innerHTML = '';
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
    /* A link to the page already open (View client from that client's own
       page) changes no address, so it closes the Modal itself. */
    var here = e.target.closest('a[href^="#"]');
    if (here && here.getAttribute('href') === location.hash) { S.searchTrigger = null; searchModal.hide(); return; }
    var b = e.target.closest('[data-recent]');
    if (b) { runModalSearch(b.getAttribute('data-recent')); modalInput.focus(); return; }
    if (e.target.closest('[data-search-apply]')) {
      /* Each filter is a Buckholt Dropdown: its value is the chosen option's. */
      var v = function (id) { var x = $(id), on = x && x.closest('.dropdown').querySelector('.dropdown-item.active'); return on ? on.getAttribute('data-value') : ''; };
      S.searchFilter = { brand: v('sb'), lob: v('sl'), status: v('ss') };
      redrawResults('sf-apply');
      return;
    }
    if (e.target.closest('[data-search-clear]')) { S.searchFilter = {}; redrawResults('sf-clear'); return; }
    /* A client's policies: Show N more / Show fewer, in place. */
    var sm = e.target.closest('[data-search-more]');
    if (sm) {
      e.preventDefault();
      var cid = sm.getAttribute('data-search-more');
      S.searchMore[cid] = !S.searchMore[cid];
      redrawResults(sm.getAttribute('data-focus-id'));
    }
  });
  /* The Accordion opens and closes a client itself (Bootstrap Collapse);
     its state is kept so a filter or a fresh draw leaves it as it was. */
  modalBody.addEventListener('shown.bs.collapse', function (e) { var k = e.target.getAttribute('data-search-key'); if (k) { S.searchOpen = {}; S.searchOpen[k] = true; } });  /* one client open at a time */
  modalBody.addEventListener('hidden.bs.collapse', function (e) { var k = e.target.getAttribute('data-search-key'); if (k) S.searchOpen[k] = false; });



  /* "/" opens the search anywhere, unless you are typing. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (!R || dialogOpen() || drawerOpen()) return;
    e.preventDefault();
    /* On the homepage the field is on the page: focus comes back to it. */
    var homeField = $('mob-home-search-input');
    var field = homeField && homeField.offsetParent ? homeField : searchInput;
    S.searchTrigger = document.activeElement && document.activeElement !== document.body ? document.activeElement : field;
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
    S.sideView = null;                                /* a new page shows its own menu */
    S.openCurrent = true;                             /* a closed group holding the new page opens */
    closeDrawer(false);
    var drawn = render();
    S.openCurrent = false;
    if (!drawn) return;
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
    /* From a Menu's item (Make changes): the item goes with its closed
       Menu, so focus returns to the Menu's button. */
    var inMenu = trigger && trigger.closest && trigger.closest('.dropdown-menu');
    if (inMenu) trigger = inMenu.parentNode.querySelector('.menu-toggle');
    var b = f(R && R.p, arg);
    var blade = blades[key];
    if (!blade) {
      blade = blades[key] = new Blade({
        id: 'mob-panel-' + key,
        title: plain(b[0]),
        footer: panelFooter(b),
        /* Focus on the first field, a Dropdown included: the shared Blade
           looks only for input, select and textarea, so it skipped
           "Required MTA type" (audit, 28 October 2026). */
        initialFocus: '.blade-body input:not([type="hidden"]), .blade-body textarea, .blade-body select, .blade-body .dropdown-toggle',
        onClose: function () {
          S.panelKey = null;
          setPressed();
          if (pendingRender) {
            pendingRender = false;
            render();
            var again = Array.prototype.filter.call(document.querySelectorAll('[data-panel="' + key + '"], [data-action="' + key + '"]'), function (x) { return x.offsetParent; })[0] ||
              ($('mob-phone-actions') && $('mob-phone-actions').offsetParent ? $('mob-phone-actions') : null);
            if (again) again.focus();
          }
        }
      });
    }
    if (!blade.mobGuard) guardDiscard(blade);
    blade.dirty = false;
    blade.el.querySelector('.blade-title').innerHTML = t(b[0]);
    blade.toastMessage = b[2];
    blade.setBody(b[1]);
    Shell.initTooltips(blade.bodyEl);
    S.panelKey = key;
    setPressed();
    blade.open(trigger);
  }

  /* Closing a side panel with something entered and not saved (Escape,
     the X, the scrim, Cancel) asks "Discard this change?" first (audit,
     28 October 2026). Typing, a Dropdown choice or a ticked box marks the
     panel changed; Save clears it. While the question is open the panel's
     own focus trap is paused, so the two dialogs do not pull focus from
     each other (Bootstrap 5.1.3's Offcanvas keeps it as `_focustrap`). */
  var discardBlade = null, discardChosen = false;
  function guardDiscard(blade) {
    blade.mobGuard = true;
    var mark = function (e) { if (blade.bodyEl.contains(e.target)) blade.dirty = true; };
    blade.el.addEventListener('input', mark);
    blade.el.addEventListener('change', mark);
    blade.el.addEventListener('click', function (e) { if (e.target.closest('.dropdown-item') && blade.bodyEl.contains(e.target)) blade.dirty = true; });
    blade.el.addEventListener('hide.bs.offcanvas', function (e) {
      if (!blade.dirty) return;
      e.preventDefault();
      var oc = bootstrap.Offcanvas.getInstance(blade.el);
      if (oc && oc._focustrap) oc._focustrap.deactivate();
      discardBlade = blade;
      discardChosen = false;
      var here = document.activeElement && blade.el.contains(document.activeElement) ? document.activeElement : blade.closeEl;
      confirmEl.classList.add('mob-over-panel');   /* above the panel, not under it */
      openConfirm('discard', here);
    });
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
    blade.dirty = false;   /* saved: nothing to discard */
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
    /* The way out names what it keeps ("Keep policy") where the action's
       own name would make "Cancel" ambiguous. */
    $('mob-confirm-cancel-label').textContent = c[5] || 'Cancel';
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
    /* "Discard this change?": Discard closes the panel (it gives focus back
       to what opened it); Keep editing goes back to the field. */
    if (key === 'discard') {
      confirmEl.classList.remove('mob-over-panel');
      var bl = discardBlade;
      discardBlade = null;
      if (!bl) return;
      if (discardChosen) { bl.dirty = false; bl.close(); return; }
      var oc = bootstrap.Offcanvas.getInstance(bl.el);
      if (oc && oc._focustrap) oc._focustrap.activate();
      if (trigger && document.contains(trigger)) trigger.focus();
      return;
    }
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
    if (confirmKey === 'discard') discardChosen = true;
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
    if (el.closest('[data-rail-toggle]')) { S.navCollapsed = !navCollapsed(); rerenderSide('[data-rail-toggle]'); return; }
    /* With the client's menu shown on a policy page, the open policy (marked
       in the list) brings its own menu back, without leaving the page. */
    var back = !narrow.matches && R.scope === 'policy' && S.sideView === 'client' && el.closest('.mob-rail-policies a[aria-current]');
    if (back) {
      e.preventDefault();
      S.sideView = 'policy';
      rerenderSide('.mob-record-nav a[aria-current], .mob-record-nav a');
      return;
    }
    if (el.closest('[data-beside-open]')) {
      setBeside(true, '#mob-rail .mob-rail-policies a[aria-current], #mob-rail a');
      return;
    }
    /* B open: the page you are on, chosen again in either menu (the open
       policy in the client's, the current page in the policy's), just
       shuts the client's menu (Laurence, 28 October 2026). */
    var here = S.besideOpen && el.closest('#mob-rail a[href], #mob-record a[href]');
    if (here && here.getAttribute('href') === location.hash) {
      e.preventDefault();
      setBeside(false, '.mob-record-nav a[aria-current], .mob-record-nav a');
      return;
    }
    var ex = el.closest('[data-view]');
    /* B, collapsed on a policy page: the client icon opens the menu with
       the client's menu beside the policy's, as its click does open. */
    if (ex && R.scope === 'policy' && !narrow.matches && ex.getAttribute('data-view') === 'client') {
      S.navCollapsed = false;
      S.besideOpen = true;
      rerenderSide('#mob-rail .mob-rail-policies a[aria-current], #mob-rail a');
      return;
    }
    if (ex) {
      S.navCollapsed = false;
      if (R.scope === 'policy') S.sideView = ex.getAttribute('data-view');
      rerenderSide(ex.getAttribute('data-focus'));
      return;
    }
    if (el.closest('[data-noop]')) { e.preventDefault(); return; }
    /* Breadcrumb overflow items are Menu buttons (Code & specs); each goes to its page. */
    var goEl = el.closest('[data-go]');
    if (goEl) { location.hash = goEl.getAttribute('data-go').replace(/^#/, ''); return; }

    /* Links that act in place (role="button") never change the route. */
    if (el.closest('a[role="button"]')) e.preventDefault();

    /* A group's label: open or close it in place. */
    var grp = el.closest('[data-group]');
    if (grp) {
      var gkey = grp.getAttribute('data-group');
      var shut = grp.getAttribute('aria-expanded') === 'true';
      if (shut) S.groupClosed[gkey] = true; else delete S.groupClosed[gkey];
      grp.setAttribute('aria-expanded', String(!shut));
      grp.closest('.mob-group').classList.toggle('mob-group-closed', shut);
      var gl = grp.closest('.mob-group').querySelector('.mob-rail-policies');
      if (gl) scrollCues(gl);
      return;
    }

    var more = el.closest('[data-more]');
    if (more) {
      var focusId = more.getAttribute('data-focus-id');
      var which = more.getAttribute('data-more-list') || 'side';
      S.polShown[which] = more.getAttribute('data-more') === '1' ? Math.min(F.policies.length, S.polShown[which] + 5) : ui.POL_FIRST[which];
      var scroller = document.querySelector('.mob-rail-scroll');
      var y = scroller ? scroller.scrollTop : 0;
      var inModal = !!more.closest('#mob-search-modal');
      render();
      scroller = document.querySelector('.mob-rail-scroll');
      if (scroller) scroller.scrollTop = y;
      /* Shown more in the menu: the list now scrolls, brought to the first
         policy it added. */
      var list = focusId === 'more-side' && S.polShown.side > ui.POL_FIRST.side && sidebar.querySelector('.mob-rail-policies');
      var first = list && list.children[ui.POL_FIRST.side];
      if (first) { list.scrollTop = first.offsetTop - list.offsetTop - 8; }
      if (list) scrollCues(list);
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

  /* ======================================================= Menu keyboard
     The Menu buttons (the area switcher, Make changes, Policy actions,
     Actions, the user menu) carry Buckholt Menu's role="menu", which tells
     screen-reader users to use the arrow keys; Bootstrap's own arrow keys
     only reach `.dropdown-item`, so they did nothing (audit, 28 October
     2026). Down / Up on the trigger opens the Menu on its first / last
     item; in the Menu, Down / Up move (and wrap), Home / End jump; Escape
     closes it and gives focus back to its trigger (it fell to the page).
     Tab still moves between the items, as Buckholt's Menu documents. The
     Menus shown in place (recent searches) keep their own keys. */
  function menuOf(el) {
    var panel = el.closest && el.closest('.menu > .menu-panel.dropdown-menu');
    if (!panel || !panel.querySelector('[role="menu"]')) return null;
    var toggle = panel.parentNode.querySelector(':scope > .menu-toggle');
    return toggle ? { panel: panel, toggle: toggle } : null;
  }
  function menuItems(panel) {
    return Array.prototype.filter.call(panel.querySelectorAll('[role^="menuitem"]'), function (i) {
      return i.offsetParent !== null && !i.disabled && !i.classList.contains('disabled');
    });
  }
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].indexOf(k) < 0 || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    /* Escape in an open Dropdown (a field) closes the Dropdown, not the
       side panel or Modal around it, which hears Escape first. */
    if (k === 'Escape' && t.closest) {
      var dd = t.closest('.dropdown');
      var ddMenu = dd && dd.querySelector(':scope > .dropdown-menu.show');
      if (ddMenu) {
        e.preventDefault(); e.stopPropagation();
        var ddToggle = dd.querySelector(':scope > .dropdown-toggle');
        bootstrap.Dropdown.getOrCreateInstance(ddToggle).hide();
        ddToggle.focus();
        return;
      }
    }
    /* On a Menu button. */
    if (t.matches && t.matches('.menu > .menu-toggle') && (k === 'ArrowDown' || k === 'ArrowUp')) {
      var panel0 = t.parentNode.querySelector(':scope > .menu-panel.dropdown-menu');
      if (!panel0 || !panel0.querySelector('[role="menu"]')) return;
      e.preventDefault(); e.stopPropagation();
      bootstrap.Dropdown.getOrCreateInstance(t).show();
      var list0 = menuItems(panel0);
      if (list0.length) list0[k === 'ArrowUp' ? list0.length - 1 : 0].focus();
      return;
    }
    /* A panel of links rather than a Menu (Work areas): Escape closes it
       and gives focus back to its button. Tab moves through the links. */
    if (k === 'Escape' && t.closest) {
      var navPanel = t.closest('.menu > .menu-panel.dropdown-menu');   /* Bootstrap may already have closed it: its handler runs first */
      var navToggle = navPanel && !navPanel.querySelector('[role="menu"]') && navPanel.parentNode.querySelector(':scope > .menu-toggle');
      if (navToggle) {
        e.preventDefault(); e.stopPropagation();
        bootstrap.Dropdown.getOrCreateInstance(navToggle).hide();
        navToggle.focus();
        return;
      }
    }
    var m = menuOf(t);
    if (!m) return;
    if (k === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      bootstrap.Dropdown.getOrCreateInstance(m.toggle).hide();
      m.toggle.focus();
      return;
    }
    var list = menuItems(m.panel);
    if (!list.length) return;
    e.preventDefault(); e.stopPropagation();
    var i = list.indexOf(t.closest('[role^="menuitem"]'));
    var next = k === 'Home' ? 0 : k === 'End' ? list.length - 1
      : k === 'ArrowDown' ? (i + 1) % list.length : (i <= 0 ? list.length - 1 : i - 1);
    list[next].focus();
  }, true);

  /* Links that act in place are role="button": Space activates them too. */
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && e.target.matches && e.target.matches('a[role="button"]')) { e.preventDefault(); e.target.click(); }
  });

  /* ============================================== Buckholt component scripts
     Dropdown (every single-select) and Tabs (scroll Buttons on overflow)
     are bound by the unchanged code of components/dropdown/dropdown.js and
     components/tabs/tabs.js, kept by index.html, as soon as each one is
     drawn. That code looks up every component in the document, so each
     run is shown only the ones not yet bound. */
  function bindLate(name, sel, also) {
    var fns = window.MobLateBind && window.MobLateBind[name];
    if (!fns) return [];
    var mark = 'data-mob-' + name;
    var fresh = Array.prototype.filter.call(document.querySelectorAll(sel), function (d) { return !d.hasAttribute(mark); });
    if (!fresh.length) return [];
    fresh.forEach(function (d) { d.setAttribute(mark, ''); });
    var inner = {};
    Object.keys(also || {}).forEach(function (q) {
      inner[q] = fresh.reduce(function (a, d) { return a.concat(Array.prototype.slice.call(d.querySelectorAll(also[q]))); }, []);
    });
    var all = document.querySelectorAll;
    document.querySelectorAll = function (q) {
      if (q === sel) return fresh;
      if (inner[q]) return inner[q];
      return all.call(document, q);
    };
    try { fns.forEach(function (fn) { fn(); }); }
    finally { delete document.querySelectorAll; }
    return fresh;
  }
  function bindComponents() {
    /* Every Dropdown opens below its field. dropdown.js moves the open
       panel down by the field's height (its own placement, which grows with
       Multiselect's Tags), but Bootstrap's Popper flips the panel above the
       field when there is little room below, at the foot of a side panel
       or a Modal, and the two together laid the panel over the field. With
       `data-bs-display="static"` Popper is not used, so only dropdown.js
       places it (CSS clears the static offset it would otherwise add to).
       The side panel or page scrolls to show the rest. */
    Array.prototype.forEach.call(document.querySelectorAll('.dropdown:not([data-mob-dropdown]) > .dropdown-toggle'), function (t) { t.setAttribute('data-bs-display', 'static'); });
    /* dropdown.js sets every option's aria-selected to false as it binds,
       so the chosen one is marked selected again afterwards. */
    bindLate('dropdown', '.dropdown', { '.dropdown-menu .dropdown-item': '.dropdown-menu .dropdown-item' }).forEach(function (d) {
      d.querySelectorAll('.dropdown-item.active').forEach(function (i) { i.setAttribute('aria-selected', 'true'); });
    });
    bindLate('tabs', '.tab-items');
  }
  var componentsQueued = false;
  new MutationObserver(function () {
    if (componentsQueued) return;
    componentsQueued = true;
    Promise.resolve().then(function () { componentsQueued = false; bindComponents(); });
  }).observe(document.body, { childList: true, subtree: true });
  bindComponents();

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
    if (f) quietFocus(f);
  }

  /* Focus goes back to the control that was pressed, so keyboard users
     keep their place; after a mouse or touch press its focus ring is not
     drawn (Mark's collapsed menu shows none), until the next key press. */
  var pointerLast = false;
  document.addEventListener('pointerdown', function () { pointerLast = true; }, true);
  document.addEventListener('keydown', function () { pointerLast = false; }, true);
  function quietFocus(el) {
    el.focus();
    if (!pointerLast) return;
    el.classList.add('mob-quiet-focus');
    el.addEventListener('blur', function off() { el.classList.remove('mob-quiet-focus'); el.removeEventListener('blur', off); });
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
