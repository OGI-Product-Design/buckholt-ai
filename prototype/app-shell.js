/* ============================================================================
   Mobius PAS prototype — shared application shell
   ============================================================================

   One shell for every feature in the prototype. Extracted from the Originators
   build when BACS Import was added, so the two features share the chrome,
   clock, section tabs, toasts and tooltip wiring instead of each carrying a
   copy.

   Exposes a single global, `Shell`:

     Shell.escapeHtml(value)
     Shell.mountChrome({ sidebar, avatar })     top bar + left navigation
     Shell.bacsTabs(active, paths)              BACS section tabs markup
     Shell.startClock()                         live top-bar clock
     Shell.showToast(message, variant)          Buckholt Toast, bottom right
     Shell.initTooltips(root)
     Shell.disposeTooltips(root)

   The chrome is static Mobius application furniture, not Buckholt. Everything
   from `#main` down is Buckholt, and the tabs are Buckholt Page navigation.
   ============================================================================ */
(function (global) {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }


  /* ====================================================================
     Static chrome — NOT BUCKHOLT
     Reproduced by visual inspection of OR-00-01 and IM-00-01. Written into
     Buckholt's own layout-03 `header` and `sidebar` grid areas.
     ==================================================================== */

  var CHROME_HEADER = '' +
    '<a class="app-bar-logo" href="#">open gi</a>' +

    '<div class="app-bar-search">' +
      '<i class="fa-regular fa-magnifying-glass" aria-hidden="true"></i>' +
      '<label class="visually-hidden" for="app-global-search">Search by name, reference or email</label>' +
      '<input type="search" id="app-global-search" placeholder="Search by name, reference or email">' +
    '</div>' +

    '<a class="app-bar-help" href="#">' +
      '<i class="fa-regular fa-circle-info" aria-hidden="true"></i>' +
      'What can I search?' +
    '</a>' +

    /* One tight row: the dividers butt against each cell's own padding, so
       no gap sits between a divider and the text beside it. */
    '<div class="app-bar-right">' +
      '<span class="app-bar-status"><i class="fa-regular fa-circle-dot" aria-hidden="true"></i>Live</span>' +

      /* Live clock, set and ticked by startClock(). The markup carries the
         values the frames draw so the cell has its drawn width before script
         runs; both are replaced on load. */
      '<div class="app-bar-clock">' +
        '<time class="app-bar-time" id="app-clock-time" datetime="13:24">13:24</time>' +
        '<time class="app-bar-date" id="app-clock-date" datetime="2026-09-03">03 September 2026</time>' +
      '</div>' +

      '<button type="button" class="app-bar-account">' +
        'Accounts' +
        '<i class="fa-regular fa-chevron-down" aria-hidden="true"></i>' +
      '</button>' +

      '<span class="app-bar-avatar" aria-hidden="true">{{AVATAR}}</span>' +
    '</div>';

  function sidenavMarkup(current) {
    var items = [
      { key: 'autorek', label: 'AutoRek', icon: 'fa-money-bill-transfer' },
      { key: 'bacs', label: 'BACS', icon: 'fa-building-columns' }
    ];
    return '' +
      '<nav class="app-sidenav-items" aria-label="Modules">' +
        items.map(function (item) {
          var on = item.key === current;
          return '<a class="app-sidenav-item' + (on ? ' is-current' : '') + '" href="#"' +
            (on ? ' aria-current="page"' : '') + '>' +
            '<i class="fa-regular ' + item.icon + '" aria-hidden="true"></i>' + item.label +
          '</a>';
        }).join('') +
      '</nav>' +
      '<button type="button" class="app-sidenav-collapse">' +
        '<i class="fa-solid fa-caret-left" aria-hidden="true"></i>Collapse menu' +
      '</button>';
  }

  /* Fills the page's `header` and `#sidebar` regions. Both frames draw the
     avatar as "AC" while imports are attributed to Jane Smith; that mismatch
     is the BACS Import spec's own open question 8, so the initials stay a
     caller option rather than being quietly reconciled. */
  function mountChrome(options) {
    options = options || {};
    var header = document.querySelector('header.app-bar');
    var sidebar = document.getElementById('sidebar');
    if (header) header.innerHTML = CHROME_HEADER.replace('{{AVATAR}}', escapeHtml(options.avatar || 'AC'));
    if (sidebar) sidebar.innerHTML = sidenavMarkup(options.sidebar || 'bacs');

    /* Nothing in the static chrome navigates. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('.app-bar a, .app-sidenav a');
      if (a) e.preventDefault();
    });
  }


  /* ====================================================================
     BACS section tabs — Buckholt Page navigation
     `.nav > .nav-item > .nav-link`, with `.active` on the current item. The
     four BACS pages are separate pages, not panes, so this is Page
     navigation rather than Tabs.
     ==================================================================== */

  var BACS_TABS = [
    { key: 'process', label: 'Process' },
    { key: 'import', label: 'Import' },
    { key: 'originators', label: 'Originators' },
    { key: 'calendar', label: 'Calendar' }
  ];

  function bacsTabs(active, paths) {
    return '' +
      '<ul class="nav nav-underline">' +
        BACS_TABS.map(function (tab) {
          var on = tab.key === active;
          return '<li class="nav-item">' +
            '<a class="nav-link' + (on ? ' active' : '') + '" href="' + escapeHtml(paths[tab.key]) + '"' +
              (on ? ' aria-current="page"' : '') + '>' +
              tab.label +
            '</a>' +
          '</li>';
        }).join('') +
      '</ul>';
  }


  /* ==================================================================== Clock
     The frames draw a fixed 13:24 / 03 September 2026. The clock shows the
     real time instead, at Laurence's request on 30 September 2026. It ticks
     on the minute boundary rather than every second, because only minutes
     are shown.
     ==================================================================== */

  function renderClock() {
    var now = new Date();
    var time = document.getElementById('app-clock-time');
    var date = document.getElementById('app-clock-date');
    if (!time || !date) return;

    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    time.textContent = hh + ':' + mm;
    time.setAttribute('datetime', hh + ':' + mm);

    date.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    date.setAttribute('datetime',
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0'));
  }

  function startClock() {
    renderClock();
    var msToNextMinute = 60000 - (Date.now() % 60000);
    global.setTimeout(function () {
      renderClock();
      global.setInterval(renderClock, 60000);
    }, msToNextMinute);
  }


  /* ==================================================================== Toast
     Buckholt Toast, Code & specs example 7: `.toast.toast-{variant} >
     .toast-content > .toast-icon + .toast-body`, with that variant's own
     documented icon.

     No close control, at Laurence's request on 29 September 2026 — the
     Originators designs are being updated to match, and the toast is shared.
     The BACS Import spec section 3.5 still says "with a close button"; that
     is recorded in BACS-import/PROTOTYPE.md as a judgement call.

     Shown with Bootstrap's native timing (5000 ms), which is what section 3.5
     asks for.
     ==================================================================== */

  var TOAST_ICONS = {
    info: 'fa-circle-info',
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-exclamation'
  };

  function showToast(message, variant) {
    var container = document.querySelector('.app-toasts');
    if (!container) return null;

    variant = TOAST_ICONS[variant] ? variant : 'success';

    var el = document.createElement('div');
    el.className = 'toast toast-' + variant;
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = '' +
      '<div class="toast-content">' +
        '<span class="toast-icon">' +
          '<i class="fa-solid ' + TOAST_ICONS[variant] + '" aria-hidden="true"></i>' +
        '</span>' +
        '<div class="toast-body">' +
          '<div class="toast-message"><h6>' + escapeHtml(message) + '</h6></div>' +
        '</div>' +
      '</div>';

    container.appendChild(el);
    var toast = new bootstrap.Toast(el);
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    toast.show();
    return el;
  }


  /* ================================================================== Tooltip
     Initialised with the options from Tooltip's own Code & specs example 3.
     Buckholt's Tooltip shows on hover and on keyboard focus, which is the
     behaviour both specs ask for.
     ================================================================== */

  function initTooltips(root) {
    Array.prototype.forEach.call(
      (root || document).querySelectorAll('[data-bs-toggle="tooltip"]'),
      function (el) {
        if (bootstrap.Tooltip.getInstance(el)) return;
        new bootstrap.Tooltip(el, {
          offset: [0, 4],
          delay: { show: 800, hide: 100 }
        });
      }
    );
  }

  function disposeTooltips(root) {
    Array.prototype.forEach.call(
      (root || document).querySelectorAll('[data-bs-toggle="tooltip"]'),
      function (el) {
        var t = bootstrap.Tooltip.getInstance(el);
        if (t) t.dispose();
      }
    );
  }


  global.Shell = {
    escapeHtml: escapeHtml,
    mountChrome: mountChrome,
    bacsTabs: bacsTabs,
    startClock: startClock,
    showToast: showToast,
    initTooltips: initTooltips,
    disposeTooltips: disposeTooltips
  };
}(window));
