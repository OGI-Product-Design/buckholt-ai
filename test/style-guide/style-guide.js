/*
  Style-guide demonstration behaviour.

  This file is PAGE-LEVEL ONLY. It is not part of Buckholt and must not be
  treated as a Buckholt API or copied into product code.

  Buckholt's own scripts — components/form/form.js, components/dropdown/dropdown.js
  and components/tabs/tabs.js — are loaded separately and own everything they
  cover. Nothing here duplicates them.

  Each block below either initialises a documented Bootstrap component, or
  drives a documented interaction for which this repository ships no script.
  Those gaps are recorded and classified in test/runtime-verification/ and in
  discrepancies/known-issues.md; when an upstream script provides one of them,
  delete the corresponding block here.
*/
(function () {
  'use strict';

  // Tooltip -----------------------------------------------------------------
  // Buckholt documents the initialisation options in components/tooltip:
  // an offset of [0, 4] and an 800ms show delay. Those are used rather than
  // Bootstrap's defaults.
  if (typeof window.bootstrap !== 'undefined') {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (trigger) {
      new window.bootstrap.Tooltip(trigger, {
        offset: [0, 4],
        delay: { show: 800, hide: 100 }
      });
    });
  }

  // Selectable card ---------------------------------------------------------
  // The runtime styles `.card-selectable.active` but nothing adds `.active`
  // when the nested radio or checkbox changes.
  document.querySelectorAll('.card-selectable .form-check-input').forEach(function (input) {
    var sync = function () {
      if (input.type === 'radio' && input.name) {
        document.querySelectorAll('input[type="radio"][name="' + input.name + '"]').forEach(function (peer) {
          var card = peer.closest('.card-selectable');
          if (card) card.classList.toggle('active', peer.checked);
        });
      } else {
        var card = input.closest('.card-selectable');
        if (card) card.classList.toggle('active', input.checked);
      }
    };
    input.addEventListener('change', sync);
    sync();
  });

  // Selectable tag ----------------------------------------------------------
  // The documented markup is a `span.tag.tag-selectable[aria-selected]` wrapping
  // a native control and a `.tag-label`. Two things stop it working on its own:
  // the runtime hides the control with `.tag-selectable input { display: none }`
  // and the wrapper is a `span` rather than a `label`, so a click never reaches
  // it; and the selected appearance is keyed off `.tag-selectable.active` while
  // the markup carries `aria-selected`.
  document.querySelectorAll('.tag-selectable').forEach(function (tag) {
    var input = tag.querySelector('input');
    if (!input) return;

    if (!tag.hasAttribute('tabindex')) tag.setAttribute('tabindex', '0');
    if (!tag.hasAttribute('role')) {
      tag.setAttribute('role', input.type === 'radio' ? 'radio' : 'checkbox');
    }

    var syncAll = function () {
      var scope = input.type === 'radio' && input.name
        ? document.querySelectorAll('.tag-selectable input[type="radio"][name="' + input.name + '"]')
        : [input];
      Array.prototype.forEach.call(scope, function (peer) {
        var peerTag = peer.closest('.tag-selectable');
        if (!peerTag) return;
        peerTag.classList.toggle('active', peer.checked);
        peerTag.setAttribute('aria-selected', String(peer.checked));
      });
    };

    var toggle = function () {
      if (input.type === 'radio') {
        input.checked = true;
      } else {
        input.checked = !input.checked;
      }
      syncAll();
    };

    tag.addEventListener('click', function (event) {
      if (event.target.closest('.btn-close')) return;
      event.preventDefault();
      toggle();
    });

    tag.addEventListener('keydown', function (event) {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      toggle();
    });

    input.addEventListener('change', syncAll);
    syncAll();
  });

  // Dismissible tag ---------------------------------------------------------
  // Bootstrap implements dismiss only for its own components, so a Tag's close
  // button is otherwise inert.
  document.querySelectorAll('.tag-dismissible .btn-close').forEach(function (button) {
    button.addEventListener('click', function () {
      var tag = button.closest('.tag');
      if (tag) tag.remove();
    });
  });

  // Slider ------------------------------------------------------------------
  // The documented Slider pairs a range input with a number field. form.js
  // covers the Number input steppers but not this pairing.
  document.querySelectorAll('.slider-input, .response:has(input[type="range"])').forEach(function (wrapper) {
    var range = wrapper.querySelector('input[type="range"]');
    var number = wrapper.querySelector('input[type="number"], .form-slider-output input');
    if (!range || !number) return;

    range.addEventListener('input', function () { number.value = range.value; });

    number.addEventListener('input', function () {
      var min = Number(range.min || 0);
      var max = Number(range.max || 100);
      var value = Number(number.value);
      if (Number.isNaN(value)) return;
      range.value = String(Math.min(Math.max(value, min), max));
    });

    number.addEventListener('change', function () { number.value = range.value; });
  });

  // Table select-all --------------------------------------------------------
  // The documented markup carries data-cdt-select-column, implying a table
  // controller that this repository does not ship.
  document.querySelectorAll('[data-cdt-select-column]').forEach(function (master) {
    var table = master.closest('table');
    if (!table) return;

    var rowBoxes = function () {
      return Array.prototype.slice.call(
        table.querySelectorAll('tbody input[type="checkbox"]')
      );
    };

    master.addEventListener('change', function () {
      rowBoxes().forEach(function (box) { box.checked = master.checked; });
      master.indeterminate = false;
    });

    table.addEventListener('change', function (event) {
      if (!event.target.matches('tbody input[type="checkbox"]')) return;
      var boxes = rowBoxes();
      var checked = boxes.filter(function (b) { return b.checked; }).length;
      master.checked = checked > 0 && checked === boxes.length;
      master.indeterminate = checked > 0 && checked < boxes.length;
    });
  });

  // Toast container ---------------------------------------------------------
  // A `.toast-container` is fixed to the viewport, so the stacked example is
  // held back until it is asked for rather than floating over the whole page.
  var toastContainer = document.getElementById('sgToastContainer');
  document.querySelectorAll('[data-sg-toasts]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      if (!toastContainer) return;
      toastContainer.hidden = false;
      toastContainer.querySelectorAll('.toast').forEach(function (toast) {
        toast.classList.add('show');
      });
    });
  });

  if (toastContainer) {
    toastContainer.addEventListener('click', function (event) {
      if (!event.target.closest('.btn-close')) return;
      var toast = event.target.closest('.toast');
      if (toast) toast.classList.remove('show');
      var remaining = toastContainer.querySelectorAll('.toast.show').length;
      if (!remaining) toastContainer.hidden = true;
    });
  }
})();
