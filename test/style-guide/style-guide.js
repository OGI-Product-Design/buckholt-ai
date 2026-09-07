/*
  Style-guide demonstration behaviour.

  This file is PAGE-LEVEL ONLY. It is not part of Buckholt and must not be
  treated as a Buckholt API or copied into product code.

  Each block below drives a documented interaction for which this repository
  ships no component script. Buckholt's own scripts - components/form/form.js,
  components/dropdown/dropdown.js and components/tabs/tabs.js - are loaded
  separately and own everything they cover; nothing here duplicates them.

  Every gap this file stands in for is recorded in
  discrepancies/known-issues.md. When a Buckholt script provides one of these
  behaviours, delete the corresponding block here.
*/
(function () {
  'use strict';

  // Selectable Card ---------------------------------------------------------
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

  // Selectable Tag ----------------------------------------------------------
  // `.tag-selectable` wraps a native input and carries aria-selected, but
  // nothing reflects the checked state back onto the tag.
  document.querySelectorAll('.tag-selectable input').forEach(function (input) {
    var sync = function () {
      if (input.type === 'radio' && input.name) {
        document.querySelectorAll('input[type="radio"][name="' + input.name + '"]').forEach(function (peer) {
          var tag = peer.closest('.tag-selectable');
          if (tag) tag.setAttribute('aria-selected', String(peer.checked));
        });
      } else {
        var tag = input.closest('.tag-selectable');
        if (tag) tag.setAttribute('aria-selected', String(input.checked));
      }
    };
    input.addEventListener('change', sync);
    sync();
  });

  // Dismissible Tag ---------------------------------------------------------
  // The documented markup uses data-bs-dismiss="tag". Bootstrap implements
  // dismiss only for its own components, so the button is otherwise inert.
  document.querySelectorAll('[data-bs-dismiss="tag"]').forEach(function (button) {
    button.addEventListener('click', function () {
      var tag = button.closest('.tag');
      if (tag) tag.remove();
    });
  });

  // Slider ------------------------------------------------------------------
  // The documented Slider pairs a range input with a number field. form.js
  // covers the Number input steppers but not this pairing.
  document.querySelectorAll('.slider-input').forEach(function (wrapper) {
    var range = wrapper.querySelector('input[type="range"]');
    var number = wrapper.querySelector('input[type="number"]');
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
})();
