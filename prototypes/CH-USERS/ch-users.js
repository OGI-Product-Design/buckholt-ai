/* Configuration Hub accounts — `CU`, the page helper.          NOT BUCKHOLT.

   Every CH-USERS page loads, in order:

     ../CH-SHELL/shell/ch-registry.js     the shell's registry (unchanged)
     ch-users-registry.js                 this prototype's "Shell overrides"
     ../CH-SHELL/shell/ch-shell.js        the shell (unchanged)
     ch-users-data.js, ch-users.js        this file

   and calls `CU.init()` where a CH page would call `CHShell.init()`. It does
   three things the shell cannot, because the shell's folder is not edited
   (PROTOTYPE.md, "How the shell is reused"):

   1. Points the lockup at this prototype's own home entry page (`home.html`),
      which shows the renamed app card. The shell's lockup goes to
      `CH-SHELL/index.html`, which still has "User Management".
   2. Resolves the CH-USERS variant (`?variant=only-me`), kept for the tab like
      the shell's seed.
   3. Supplies the small shared pieces the account pages need: Toast,
      Tooltips, the date format and the polite announcement. */
(function () {
  'use strict';

  if (!window.CHShell) throw new Error('ch-users.js needs ch-shell.js loaded first.');

  var ROOT = new URL('./', document.currentScript.src);
  var HOME_URL = new URL('home.html', ROOT).href;
  var KEY_VARIANT = 'chusers.variant';

  /* Tooltip options exactly as Tooltip's Code & specs example 3, as the
     shell uses them. */
  var TOOLTIP_OPTIONS = { offset: [0, 4], delay: { show: 800, hide: 100 } };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function storeGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* in-memory only */ }
  }

  function resolveVariant() {
    var variants = window.CUData ? window.CUData.variants : { 'default': 'Default' };
    var param = new URLSearchParams(window.location.search).get('variant');
    if (param && variants[param]) {
      storeSet(KEY_VARIANT, param);
      return param;
    }
    var saved = storeGet(KEY_VARIANT);
    return saved && variants[saved] ? saved : 'default';
  }

  function init(options) {
    if (!CHShell.init(options)) return false;
    var lockup = document.querySelector('#ch-header .ch-lockup');
    if (lockup) lockup.href = HOME_URL;
    return true;
  }

  /* ------------------------------------------------------------ dates
     "d MMM yyyy", for example "20 Oct 2026". Built by hand: en-GB's short
     month for September is "Sept" in current browsers, not "Sep". */
  function isoToday() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function formatDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return Number(p[2]) + ' ' + MONTHS[Number(p[1]) - 1] + ' ' + p[0];
  }

  /* ------------------------------------------------------------ tooltips
     Created from script, as the shell does, so a trigger keeps its own
     appearance (Buckholt restyles `a[data-bs-toggle=tooltip]`). Every
     element with `data-cu-tooltip` gets one: on hover and focus for a
     control, hover only for plain text and for the wrapper around a
     disabled control (Gap 9), which is never focusable. */
  function initTooltips(root) {
    if (!window.bootstrap) return;
    (root || document).querySelectorAll('[data-cu-tooltip]').forEach(function (el) {
      var existing = bootstrap.Tooltip.getInstance(el);
      if (existing) existing.dispose();
      var trigger = el.hasAttribute('data-cu-hover-only') ? 'hover' : 'hover focus';
      new bootstrap.Tooltip(el, Object.assign({
        title: el.getAttribute('data-cu-tooltip'),
        placement: el.getAttribute('data-cu-placement') || 'top',
        trigger: trigger
      }, TOOLTIP_OPTIONS));
    });
  }

  function disposeTooltips(root) {
    if (!window.bootstrap) return;
    (root || document).querySelectorAll('[data-cu-tooltip]').forEach(function (el) {
      var existing = bootstrap.Tooltip.getInstance(el);
      if (existing) existing.dispose();
    });
  }

  function hideTooltips() {
    if (!window.bootstrap) return;
    document.querySelectorAll('[data-cu-tooltip]').forEach(function (el) {
      var t = bootstrap.Tooltip.getInstance(el);
      if (t) t.hide();
    });
  }

  /* ------------------------------------------------------------ toast
     Buckholt Toast, success, Code & specs example 7's structure. The
     container is a polite live region (spec: "Toasts are announced
     politely"), so the toast itself carries no role="alert". The icon is the
     catalogue's Success-solid; example 7 shows `fa-circle-info` on its
     success toast, which reads as a copy slip in the source (PROTOTYPE.md). */
  function toast(message) {
    var container = document.getElementById('cu-toasts');
    if (!container || !window.bootstrap) return null;
    var el = document.createElement('div');
    el.className = 'toast toast-success';
    el.innerHTML =
      '<div class="toast-content">' +
        '<span class="toast-icon">' +
          '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
        '</span>' +
        '<div class="toast-body">' +
          '<div class="toast-message">' +
            '<h6>' + CHShell.esc(message) + '</h6>' +
          '</div>' +
        '</div>' +
      '</div>';
    container.appendChild(el);
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    bootstrap.Toast.getOrCreateInstance(el).show();
    return el;
  }

  window.CU = {
    init: init,
    variant: resolveVariant(),
    homeUrl: HOME_URL,
    isoToday: isoToday,
    formatDate: formatDate,
    initTooltips: initTooltips,
    disposeTooltips: disposeTooltips,
    hideTooltips: hideTooltips,
    tooltipOptions: TOOLTIP_OPTIONS,
    toast: toast,
    announce: function (message) { CHShell.announce(message); },
    esc: CHShell.esc
  };
})();
