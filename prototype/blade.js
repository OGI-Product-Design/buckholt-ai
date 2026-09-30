/* ============================================================================
   Blade — reusable prototype component
   ============================================================================

   Buckholt has no blade. `bacs-import-spec.md` section 13.1 defines one and
   asks for it as a reusable component, so this is a prototype-level
   component, not Buckholt guidance. See `prototype/blade.css` for why it is
   built on the Bootstrap 5.1.3 Offcanvas plugin.

   The plugin supplies the scrim, the page scroll lock, the focus trap, Esc to
   close and `role`/`aria-modal`. This wrapper adds what section 13.1 asks for
   on top: the header, the body slot, the optional footer slot, initial focus,
   and returning focus to the trigger on close.

   Usage:

       var blade = new Blade({
         id: 'reason-codes',
         title: 'Reason codes',
         body: '<p>…</p>',                 // or set later with setBody()
         footer: null,                     // optional slot
         initialFocus: '#some-input',      // selector inside the body
         onOpen: fn, onClose: fn
       });
       blade.open(triggerElement);
       blade.close();

   Props map to section 13.1's suggested list: `open`, `title`, `onClose`,
   `width`, `initialFocusRef`, `children`, `footer`. `width` is a CSS length
   written to the component's own `--blade-width`.
   ============================================================================ */
(function (global) {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function Blade(options) {
    options = options || {};

    this.options = options;
    this.trigger = null;

    var id = options.id || ('blade-' + Math.random().toString(36).slice(2, 8));
    var titleId = id + '-title';

    var el = document.createElement('div');
    el.className = 'offcanvas offcanvas-end blade';
    el.id = id;
    el.tabIndex = -1;
    /* The plugin sets role="dialog" and aria-modal="true" on show and clears
       them on hide; aria-labelledby is ours, and points at the title. */
    el.setAttribute('aria-labelledby', titleId);
    el.setAttribute('aria-hidden', 'true');
    if (options.width) el.style.setProperty('--blade-width', options.width);

    el.innerHTML = '' +
      '<div class="blade-header">' +
        '<h2 class="blade-title" id="' + titleId + '">' + escapeHtml(options.title || '') + '</h2>' +
        '<button type="button" class="blade-close" aria-label="Close ' +
            escapeHtml(options.title || 'blade') + '">' +
          '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
        '</button>' +
      '</div>' +
      '<div class="blade-body">' + (options.body || '') + '</div>' +
      (options.footer ? '<div class="blade-footer">' + options.footer + '</div>' : '');

    document.body.appendChild(el);

    this.el = el;
    this.bodyEl = el.querySelector('.blade-body');
    this.closeEl = el.querySelector('.blade-close');

    /* `scroll: false` is what makes the plugin lock the page behind and
       activate its focus trap; `backdrop: true` gives the scrim, and clicking
       it closes. `keyboard: true` is Esc. All three are section 13.1. */
    this.offcanvas = new bootstrap.Offcanvas(el, {
      backdrop: true,
      keyboard: true,
      scroll: false
    });

    var self = this;

    this.closeEl.addEventListener('click', function () { self.close(); });

    el.addEventListener('shown.bs.offcanvas', function () {
      /* "On open, focus moves to the first input, or to the close button if
         there isn't one." */
      var target = self.options.initialFocus
        ? el.querySelector(self.options.initialFocus)
        : el.querySelector('.blade-body input, .blade-body textarea, .blade-body select');
      (target || self.closeEl).focus();
      if (self.options.onOpen) self.options.onOpen(self);
    });

    /* Section 13.1: "Focus is trapped inside the blade."

       The Offcanvas plugin's own focus trap listens for `focusin` and pulls
       focus back when it lands outside. That catches a click or a programmatic
       focus, but not Tab off the last control: the browser then moves focus to
       its own chrome, which fires no `focusin` at all, and `document.activeElement`
       falls back to `<body>`. Wrapping Tab here closes that gap. */
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      var items = Array.prototype.filter.call(
        el.querySelectorAll(FOCUSABLE),
        function (node) { return node.offsetParent !== null || node === document.activeElement; }
      );
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;

      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });

    el.addEventListener('hidden.bs.offcanvas', function () {
      /* "On close, focus returns to the button that opened it." The plugin
         only restores focus for its own data-api triggers, and the blade is
         opened from script, so this does it. */
      if (self.trigger && document.contains(self.trigger)) self.trigger.focus();
      self.trigger = null;
      if (self.options.onClose) self.options.onClose(self);
    });
  }

  Blade.prototype.setBody = function (html) {
    this.bodyEl.innerHTML = html;
    return this;
  };

  Blade.prototype.open = function (trigger) {
    this.trigger = trigger || document.activeElement;
    this.offcanvas.show();
    return this;
  };

  Blade.prototype.close = function () {
    this.offcanvas.hide();
    return this;
  };

  Blade.prototype.isOpen = function () {
    return this.el.classList.contains('show');
  };

  global.Blade = Blade;
}(window));
