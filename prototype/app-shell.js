/* ============================================================================
   Mobius PAS prototype — shared application shell
   ============================================================================

   One shell for every feature in the prototype. Extracted from the Originators
   build when BACS Import was added, so the two features share the chrome,
   clock, section tabs, toasts and tooltip wiring instead of each carrying a
   copy.

   Exposes a single global, `Shell`:

     Shell.escapeHtml(value)
     Shell.wireChrome()                         makes the static chrome inert
     Shell.startClock()                         live top-bar clock
     Shell.showToast(message, variant)          Buckholt Toast, bottom right
     Shell.initTooltips(root)
     Shell.disposeTooltips(root)

   The chrome itself is static Mobius application furniture and lives in each
   page's HTML; only its styling and behaviour are shared. Everything from
   `#main` down is Buckholt, and the BACS tabs are Buckholt Page navigation.
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

     The top bar and left navigation are written into each page's own HTML,
     not injected from here, so the chrome is in the page whatever happens to
     the JavaScript. `prototype/app-shell.css` styles them and this file
     supplies their behaviour. `prototype/README.md` has the markup to copy
     into a new page.

     Nothing in the chrome navigates, and the tab for the page you are
     already on is inert.
     ==================================================================== */

  function wireChrome() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.app-bar a, .app-sidenav a, .nav-underline a[href="#"]');
      if (link) e.preventDefault();
    });
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
    wireChrome: wireChrome,
    startClock: startClock,
    showToast: showToast,
    initTooltips: initTooltips,
    disposeTooltips: disposeTooltips
  };
}(window));
