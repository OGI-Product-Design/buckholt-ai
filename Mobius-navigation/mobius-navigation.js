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

   The menu is rebuilt on every route change. Following the new designs it
   is two columns at client and policy level, and nothing at app level:

     rail     (blue) Client, the client's policies, Add new quote,
              Client support
     record   (white) "Client record" or "{product} policy", its pages in
              always-open groups
     toolbar  (48px) at policy level, the status's actions as icon Buttons

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

  /* polShown: how many
     policies every policy list shows. step: the current step of a flow. */
  /* query: the last search run, or null before the first one. */
  /* railOverride / recordOverride: a column opened (true) or collapsed
     (false) with its toggle on this page, or null. Both reset on every
     route. */
  var S = { polShown: 5, step: 0, railOverride: null, recordOverride: null, panelKey: null, query: null };
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
     Each column has Mark's collapse button, which is also its open button.
     A choice made with it lasts until the next page, which sets the
     columns for itself again. Collapsed, each category is one icon button;
     pressing it opens its column at that category (Laurence, 7 October
     2026, in place of floating menus). In the drawer (below 1280px)
     everything is open and there are no toggles. */
  function railCollapsed() {
    if (narrow.matches) return false;
    return S.railOverride !== null ? !S.railOverride : R.scope === 'policy';
  }
  function recordCollapsed() { return !narrow.matches && S.recordOverride === false; }

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

  /* The client: Buckholt's User meta (the runtime's `.user-meta`), the
     initials Avatar, then the client's name and reference. */
  function clientMeta(c) {
    return '<div class="user-meta user-meta-compact">' +
      '<div class="avatar avatar-sm" aria-hidden="true"><div class="avatar-initials">' + esc(c.initials) + '</div></div>' +
      '<div class="user-meta-body"><span class="user-meta-first">' + esc(c.name) + '</span><span>' + esc(c.ref) + '</span></div>' +
    '</div>';
  }

  /* The client's policies, open rail: Page navigation, one link per
     policy, as in the Figma design: an Icon block (expressive dark, the
     Car), the line of business and the reference, and the status Tag. The
     5 most recent, then "Show 2 more". */
  function railPolicies(curId) {
    return '<h2 class="label-01 mob-side-label" id="mob-rail-policies">Policies</h2>' +
      '<ul class="nav flex-column mob-nav mob-rail-policies" aria-labelledby="mob-rail-policies">' + ui.shownPolicies().map(function (p) {
        var on = p.id === curId;
        return '<li class="nav-item">' +
          '<a class="nav-link' + (on ? ' active' : '') + '" href="' + ui.policyHref(p) + '"' + (on ? ' aria-current="true"' : '') + '>' +
            '<div class="icon-block expressive-dark" aria-hidden="true">' + icon(M.ICON.motor) + '</div>' +
            /* The Tag shares the title's line and wraps under it when the
               status is long ("Automatic Decline"). */
            '<span class="mob-rail-text"><span class="mob-rail-row"><span class="mob-rail-title">' + esc(F.client.businessLine) + '</span>' +
              ui.statusTag(p, true) + '</span>' +
              '<span class="mob-rail-sub">' + esc(p.ref) + '</span></span>' +
          '</a>' +
        '</li>';
      }).join('') + '</ul>' +
      '<div class="mob-more">' + ui.loadMoreButton('side') + '</div>';
  }

  /* A rail Button: labelled when the rail is open, icon-only with its
     accessible name and Tooltip when collapsed. */
  function railButton(label, o) {
    if (!railCollapsed()) return ui.btn(label, o);
    o = Object.assign({}, o, { attrs: (o.attrs || '') + tipAttrs(plain(label)) });
    return ui.btn('', o);
  }

  /* A column's collapse / open control: one icon-only ghost Button, as on
     the documentation site. */
  function columnToggle(attr, collapsed, what) {
    var name = (collapsed ? 'Open ' : 'Collapse ') + what;
    return ui.set([ui.btn('', { icon: collapsed ? 'fa-regular fa-arrow-right-from-line' : 'fa-regular fa-arrow-left-from-line',
      attrs: ' ' + attr + ' aria-expanded="' + !collapsed + '"' + tipAttrs(name) })], 'mob-column-toggle');
  }

  /* Actions: a 48px tool strip beside the record column, like an editing
     application's toolbar. Every action is an icon-only ghost Button with
     its accessible name and the Tooltip Buckholt requires for icon-only
     Buttons. Each group (Policy, MTA, Renewal, Customer portal) is a
     stacked Button set; groups are divided by a rule, Stop and Cancel come
     last, and Cancel is the danger variant. A panel action stays pressed
     while its panel is open. One Tab stop: arrow keys move along it. */
  var DESTRUCTIVE = ['stop', 'cancel'];
  function toolbar(groups, defs, scope) {
    var button = function (key) {
      var a = defs[key];
      var name = plain(a.label);
      return '<button type="button" class="btn btn-ghost" tabindex="-1" data-toolbar-item' +
        ' data-action="' + key + '" data-scope="' + scope + '" aria-label="' + esc(name) + '"' +
        (a.kind === 'panel' ? ' aria-pressed="' + (S.panelKey === key) + '" aria-haspopup="dialog"' : '') +
        (a.kind === 'confirm' ? ' aria-haspopup="dialog"' : '') +
        ' data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + esc(name) + '">' +
        '<div class="btn-icon">' + icon(a.icon) + '</div>' +
      '</button>';
    };
    var risky = [];
    var sets = [];
    groups.forEach(function (g) {
      var ids = g.ids.filter(function (k) { return DESTRUCTIVE.indexOf(k) < 0; });
      risky = risky.concat(g.ids.filter(function (k) { return DESTRUCTIVE.indexOf(k) >= 0; }));
      if (ids.length) sets.push('<div class="button-set button-set-stacked" role="group"' + (g.sub ? ' aria-label="' + esc(plain(g.sub)) + '"' : '') + '>' + ids.map(button).join('') + '</div>');
    });
    /* Stop and Cancel are destructive, so they are not one click away: they
       sit behind Buckholt's Overflow menu (Menu button Code & specs
       example 3: ghost icon-only trigger, `fa-ellipsis-vertical`), which
       opens to the right. Cancel is Menu's danger item. It is fixed to the
       foot of the toolbar, away from the everyday actions. */
    var foot = '';
    if (risky.length) {
      foot = '<div class="mob-toolbar-foot"><div class="mob-toolbar-rule" role="separator"></div>' +
        '<div class="menu dropend mob-overflow" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="More actions">' +
        '<button type="button" class="btn btn-ghost menu-toggle" tabindex="-1" data-toolbar-item id="mob-more-actions" data-bs-toggle="dropdown" aria-expanded="false" aria-label="More actions">' +
          '<div class="btn-icon"><i class="fa-regular fa-ellipsis-vertical" aria-hidden="true"></i></div>' +
        '</button>' +
        '<div class="menu-panel dropdown-menu" aria-labelledby="mob-more-actions">' +
          '<ul class="menu-body" role="menu">' + risky.map(function (key) {
            var a = defs[key];
            return '<li role="none"><button class="menu-item' + (a.danger ? ' menu-item-danger' : '') + '" type="button" role="menuitem"' +
              ' data-action="' + key + '" data-scope="' + scope + '" aria-haspopup="dialog">' + icon(a.icon) + t(a.label) + '</button></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div></div>';
    }
    return '<div class="mob-toolbar-body" role="toolbar" aria-label="Policy actions" aria-orientation="vertical">' +
      sets.join('<div class="mob-toolbar-rule" role="separator"></div>') + foot +
    '</div>';
  }

  /* A navigation group, always open (Laurence, 7 October 2026): its label
     with the group's icon (not a link: a group is not a page), then its
     pages, indented past the icon with a rule down the left. */
  function navGroups(items, cur, r) {
    return '<ul class="nav flex-column mob-nav">' + items.map(function (n) {
      if (!n.children) return navLink(n.id, n.label, n.icon, cur, href(r, n.id));
      var gid = 'mob-group-' + n.group.toLowerCase().replace(/\W+/g, '-');
      return '<li class="nav-item mob-group">' +
        '<span class="mob-group-label" id="' + gid + '">' + icon(n.icon) + t(n.group) + '</span>' +
        '<ul class="nav flex-column mob-subnav" aria-labelledby="' + gid + '">' +
          n.children.map(function (c) { return c.action ? navAction(c) : navLink(c.id, c.label, null, cur, href(r, c.id)); }).join('') +
        '</ul>' +
      '</li>';
    }).join('') + '</ul>';
  }

  /* An action in the menu (Admin fee, Manual credit / debit): it opens a
     side panel in place, so it is a Button (`button.nav-link`), pressed
     while its panel is open. */
  function navAction(c) {
    return '<li class="nav-item">' +
      '<button type="button" class="nav-link" data-action="' + c.action + '" data-scope="policy" aria-haspopup="dialog" aria-pressed="' + (S.panelKey === c.action) + '">' +
        t(c.label) +
      '</button>' +
    '</li>';
  }

  /* The record column collapsed: a top-level page stays an icon link; each
     group is one icon button that opens the column at that group. */
  function navStrip(items, cur, r) {
    return '<ul class="nav flex-column mob-nav mob-strip">' + items.map(function (n) {
      if (!n.children) {
        var on = n.id === cur;
        return '<li class="nav-item"><a class="nav-link' + (on ? ' active' : '') + '" href="' + href(r, n.id) + '"' + (on ? ' aria-current="page"' : '') + tipAttrs(plain(n.label)) + '>' + icon(n.icon) + '</a></li>';
      }
      var gid = 'mob-group-' + n.group.toLowerCase().replace(/\W+/g, '-');
      var has = n.children.some(function (c) { return c.id === cur; });
      return expander('record', '[aria-labelledby="' + gid + '"] a', plain(n.group), '<div class="btn-icon">' + icon(n.icon) + '</div>', has);
    }).join('') + '</ul>';
  }

  /* The menu:
       rail    search; at client and policy level the client (User meta),
               their policies, Add new quote and Client support
       record  at client level the client record's pages; at policy level
               the policy's menu
       toolbar at policy level: the policy's actions */
  function renderSide(r) {
    var c = F.client;
    var app = r.scope === 'app';
    var onClient = r.scope === 'client';
    var onPolicy = r.scope === 'policy';
    var tight = railCollapsed();
    var recTight = !app && recordCollapsed();
    sidebar.classList.toggle('mob-app-level', app);
    sidebar.classList.toggle('mob-rail-collapsed', tight);
    sidebar.classList.toggle('mob-record-collapsed', recTight);

    $('mob-rail-head').innerHTML = columnToggle('data-rail-toggle aria-controls="mob-rail"', tight, 'client menu');

    var curPolicy = onPolicy ? r.p.id : null;
    var body = '';
    if (tight) {
      /* Collapsed: one icon button per category, each opening the rail
         there; the actions become icon-only Buttons. */
      body = '<ul class="nav flex-column mob-nav mob-strip">' +
        expander('rail', '#mob-search-input', 'Search', '<div class="btn-icon">' + icon('fa-regular fa-magnifying-glass') + '</div>', false) +
        (app ? '' :
          expander('rail', '.mob-rail-client', 'Client: ' + c.name,
            '<div class="avatar avatar-sm" aria-hidden="true"><div class="avatar-initials">' + esc(c.initials) + '</div></div>', onClient) +
          expander('rail', '.mob-rail-policies a[aria-current], .mob-rail-policies a', 'Policies (' + F.policies.length + ')',
            '<div class="btn-icon">' + icon(M.ICON.policies) + '</div>', onPolicy)) +
      '</ul>';
    } else if (!app) {
      body = '<nav aria-label="Client and policies">' +
          '<a class="mob-rail-client' + (onClient ? ' mob-on' : '') + '" href="#c/summary"' + (onClient ? ' aria-current="true"' : '') + '>' + clientMeta(c) + '</a>' +
          railPolicies(curPolicy) +
        '</nav>';
    }
    if (!app) body += ui.set([railButton(M.CLIENT_ACTIONS.cnewquote.label, { variant: 'secondary', icon: M.CLIENT_ACTIONS.cnewquote.icon, href: '#c/newquote' })], 'mob-rail-action');
    $('mob-rail-body').innerHTML = body;
    /* Client support opens a side panel: a ghost Button. It needs a
       client, so not at app level. */
    $('mob-rail-foot').innerHTML = app ? '' : ui.set([railButton(M.GLOBAL_ACTIONS.support.label, { icon: M.GLOBAL_ACTIONS.support.icon,
      attrs: ' data-action="support" data-scope="global" aria-haspopup="dialog"' })]);
    $('mob-rail-foot').hidden = app;

    var rec = $('mob-record');
    var tb = $('mob-toolbar');
    rec.hidden = app;
    tb.hidden = !onPolicy;
    if (app) { rec.innerHTML = ''; tb.innerHTML = ''; return; }

    /* The record column, as before: the client record's pages, or the
       policy's menu. The head names the record: the client's name or the
       policy reference with its status Tag, then the title. */
    var nav = onClient ? [{ group: 'Client', icon: M.ICON.client, children: M.CLIENT_NAV }] : M.policyNav(r.p);
    var label = onClient ? 'Client record' : c.businessLine;
    rec.innerHTML =
      '<div class="mob-record-top">' + columnToggle('data-record-toggle aria-controls="mob-record"', recTight, onClient ? 'client record menu' : 'policy menu') + '</div>' +
      (recTight ? '' :
        '<div class="text-block mob-record-head">' +
          '<div class="mob-record-eyebrow"><span class="eyebrow">' + esc(onClient ? c.name : r.p.ref) + '</span>' + (onPolicy ? ui.statusTag(r.p, true) : '') + '</div>' +
          '<h2 class="title-02" id="mob-record-title">' + t(label) + '</h2>' +
        '</div>') +
      '<nav aria-label="' + esc(onClient ? 'Client record' : label + ' ' + r.p.ref) + '" class="mob-record-nav">' +
        (recTight ? navStrip(nav, r.page, r) : navGroups(nav, r.page, r)) +
      '</nav>';

    tb.innerHTML = onPolicy ? toolbar(M.policyActions(r.p), M.POLICY_ACTIONS, 'policy') : '';
    var first = tb.querySelector('[data-toolbar-item]');
    if (first) first.tabIndex = 0;
    orientToolbar();
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
     At the top of the rail, on every page. Running a search opens the
     results. */
  var searchForm = $('mob-search');
  var searchInput = $('mob-search-input');

  /* In the drawer the toolbar lies flat, above the record's pages. */
  function orientToolbar() {
    var flat = narrow.matches;
    var body = document.querySelector('.mob-toolbar-body');
    if (body) body.setAttribute('aria-orientation', flat ? 'horizontal' : 'vertical');
    Array.prototype.forEach.call(document.querySelectorAll('.mob-toolbar [data-bs-toggle=tooltip]'), function (b) {
      b.setAttribute('data-bs-placement', flat ? 'top' : 'right');
    });
  }

  function syncSearch(r) {
    searchInput.value = r.scope === 'app' && r.page === 'search' ? S.query : '';
  }

  function runSearch(q) {
    q = String(q || '').trim();
    if (!q) { searchInput.focus(); return; }
    S.query = q;
    var target = '#search/' + encodeURIComponent(q);
    if (location.hash === target) go(); else location.hash = target;
  }

  searchForm.addEventListener('submit', function (e) { e.preventDefault(); runSearch(searchInput.value); });

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
    S.railOverride = null;
    S.recordOverride = null;
    closeDrawer(false);
    if (!render()) return;
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
      /* Visible, and in the Tab order: the toolbar's roving items at -1 are not. */
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
  var narrow = window.matchMedia('(max-width: 1279.98px)');

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
      if (ex.getAttribute('data-expand') === 'rail') S.railOverride = true; else S.recordOverride = true;
      rerenderSide(ex.getAttribute('data-focus'));
      return;
    }
    if (el.closest('[data-record-toggle]')) { S.recordOverride = recordCollapsed(); rerenderSide('[data-record-toggle]'); return; }
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
      render();
      scroller = document.querySelector('.mob-rail-scroll');
      if (scroller) scroller.scrollTop = y;
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

  /* The toolbar is one Tab stop (roving tabindex): Up / Down (and Left /
     Right when it lies flat in the drawer), Home and End move along it. */
  document.addEventListener('keydown', function (e) {
    var bar = e.target.closest && e.target.closest('[role=toolbar]');
    if (!bar) return;
    var items = Array.prototype.slice.call(bar.querySelectorAll('[data-toolbar-item]'));
    var i = items.indexOf(e.target);
    if (i < 0) return;
    var n = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (n == null) return;
    e.preventDefault();
    n = (n + items.length) % items.length;
    items[i].tabIndex = -1;
    items[n].tabIndex = 0;
    items[n].focus();
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

  /* A toggle re-renders the menu; focus goes to `focusSel`. */
  function rerenderSide(focusSel) {
    Shell.disposeTooltips(sidebar);
    renderSide(R);
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
