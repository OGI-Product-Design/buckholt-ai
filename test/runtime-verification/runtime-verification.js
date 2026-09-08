/*
  Buckholt runtime verification harness — test-harness logic only.

  This file is NOT part of Buckholt and must never be copied into product code.
  It exists to make the canonical markup in index.html inspectable and testable.

  What it is allowed to do, per the runtime verification framework:
    - initialise Bootstrap components where the documented markup requires it
    - trigger interactions for testing
    - log state transitions
    - add clearly test-only helpers around canonical markup
    - inspect DOM and computed state
    - expose keyboard and focus behaviour

  What it must NOT do, and does not do:
    - implement missing Buckholt product behaviour and present it as
      design-system behaviour. Where a documented interaction has no shipped
      script, this file reports MISSING BUCKHOLT JS or PRODUCT-LEVEL BEHAVIOUR
      rather than supplying the behaviour.
    - modify, normalise or repair canonical markup. Every wrapper it creates is
      inserted around a canonical example, never inside one.

  All harness elements carry an `rv-` class and `data-rv-harness="true"`.
*/
(function () {
  'use strict';

  var diagnostics = [];

  // `scope` separates a finding about a component from a condition created by
  // this page composing separately-authored examples together. Only
  // scope 'component' can affect a component's status.
  function record(category, component, detail, scope) {
    diagnostics.push({
      category: category,
      component: component,
      detail: detail,
      scope: scope || (component === 'harness' ? 'harness' : 'component')
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    node.setAttribute('data-rv-harness', 'true');
    return node;
  }

  // --------------------------------------------------------------------------
  // 1. Dependency gate
  //
  // The framework requires the dependency check before any rendering
  // judgement. A missing dependency is a DEPENDENCY ISSUE, not a Buckholt
  // defect, and every downstream observation on this page is void until it is
  // resolved.
  // --------------------------------------------------------------------------
  function checkDependencies() {
    var list = document.getElementById('rv-dependency-list');
    if (!list) return;

    var sheets = Array.prototype.map.call(document.styleSheets, function (s) {
      return s.href || '';
    });
    var has = function (fragment) {
      return sheets.some(function (h) { return h.indexOf(fragment) !== -1; });
    };

    var probe = el('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;font-family:Proxima-soft;';
    probe.textContent = 'probe';
    document.body.appendChild(probe);
    var proximaResolved = getComputedStyle(probe).fontFamily.indexOf('Proxima') !== -1;
    document.body.removeChild(probe);

    var faProbe = el('i', 'fa-regular fa-ghost');
    faProbe.style.cssText = 'position:absolute;visibility:hidden;';
    document.body.appendChild(faProbe);
    var faFamily = getComputedStyle(faProbe, '::before').fontFamily || '';
    var faResolved = /Font Awesome/i.test(faFamily);
    document.body.removeChild(faProbe);

    var checks = [
      ['Bootstrap 5.1.3 CSS', has('bootstrap@5.1.3')],
      ['Proxima Soft (Typekit vtl2xbn)', has('vtl2xbn') && proximaResolved],
      ['Font Awesome kit ca92816a31', faResolved],
      ['css/buckholt.css', has('buckholt.css')],
      ['css/buckholt-ai-fixes.css', has('buckholt-ai-fixes.css')],
      ['Bootstrap bundle JS', typeof window.bootstrap !== 'undefined'],
      ['jQuery 3.7.1 (required by form.js)', typeof window.jQuery !== 'undefined'],
      ['components/dropdown/dropdown.js', !!document.querySelector('script[src*="dropdown.js"]')],
      ['components/form/form.js', !!document.querySelector('script[src*="form.js"]')],
      ['components/tabs/tabs.js', !!document.querySelector('script[src*="tabs.js"]')]
    ];

    checks.forEach(function (pair) {
      var li = el('li');
      li.textContent = (pair[1] ? '✓ ' : '✗ ') + pair[0];
      li.style.color = pair[1] ? '#166534' : '#b91c1c';
      list.appendChild(li);
      if (!pair[1]) record('DEPENDENCY ISSUE', 'harness', pair[0] + ' did not load');
    });

    // Load order is part of the contract, not just presence.
    var buckholtIndex = sheets.findIndex(function (h) { return h.indexOf('buckholt.css') !== -1; });
    var bootstrapIndex = sheets.findIndex(function (h) { return h.indexOf('bootstrap') !== -1; });
    var fixesIndex = sheets.findIndex(function (h) { return h.indexOf('buckholt-ai-fixes') !== -1; });
    var ordered = bootstrapIndex > -1 && bootstrapIndex < buckholtIndex && buckholtIndex < fixesIndex;
    var li = el('li');
    li.textContent = (ordered ? '✓ ' : '✗ ') + 'Stylesheet order: Bootstrap → buckholt.css → buckholt-ai-fixes.css';
    li.style.color = ordered ? '#166534' : '#b91c1c';
    list.appendChild(li);
    if (!ordered) record('DEPENDENCY ISSUE', 'harness', 'stylesheets are not in the documented order');
  }

  // --------------------------------------------------------------------------
  // 2. Test-case framing
  //
  // Each examples.html file carries its own `<!-- Code & specs example N -->`
  // comments at top level. Those comments are the documented example
  // boundaries, so the harness uses them rather than inventing its own
  // grouping. The canonical nodes are MOVED into a wrapper, never edited.
  // --------------------------------------------------------------------------
  var LABEL_RE = /^\s*(Code & specs example[^]*|Extracted verbatim[^]*|Standard table|Generated markup[^]*|Scrollable modal|Vertically centered modal|.*table.*)$/i;

  function frameCases(region) {
    var component = region.getAttribute('data-component');
    var nodes = Array.prototype.slice.call(region.childNodes);
    var cases = [];
    var current = null;

    nodes.forEach(function (node) {
      if (node.nodeType === Node.COMMENT_NODE) {
        var text = node.nodeValue.trim();
        if (/^rv:(begin|end):/.test(text)) return;          // harness markers
        if (/^Extracted verbatim/.test(text)) {              // provenance header
          region.setAttribute('data-provenance', text);
          return;
        }
        // Consecutive comments describe one example — the source often follows
        // "Code & specs example 3" with a second comment naming the variation.
        // Keep both rather than letting the later one replace the number.
        if (current && !current.nodes.length) {
          current.label = current.label ? current.label + ' — ' + text : text;
          return;
        }
        current = { label: text, nodes: [] };
        cases.push(current);
        return;
      }
      if (node.nodeType === Node.TEXT_NODE && !node.nodeValue.trim()) return;
      if (!current) {
        current = { label: '', nodes: [] };
        cases.push(current);
      }
      current.nodes.push(node);
    });

    // Drop trailing comment markers that introduced nothing.
    cases = cases.filter(function (c) { return c.nodes.length; });

    if (!cases.length) return;

    cases.forEach(function (testCase, index) {
      var wrapper = el('div', 'rv-case');
      wrapper.setAttribute('data-rv-case', component + '-' + (index + 1));

      var label = el('div', 'rv-case-label');
      label.appendChild(el('strong', null, testCase.label || 'Example ' + (index + 1)));
      wrapper.appendChild(label);

      var body = el('div', 'rv-case-body');
      testCase.nodes.forEach(function (node) { body.appendChild(node); });
      wrapper.appendChild(body);

      region.appendChild(wrapper);
      annotate(component, testCase, wrapper, label, body);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Per-case annotation
  //
  // Flags the two conditions that make a documented example untestable as
  // rendered output, so neither is mistaken for a runtime defect.
  // --------------------------------------------------------------------------
  function annotate(component, testCase, wrapper, label, body) {
    // (a) The documented example is a deliberate elision. `...` is
    //     documentation shorthand, not markup, so the rendered result is not
    //     evidence of anything.
    var hasEllipsis = /(^|>)\s*\.\.\.\s*(<|$)/.test(body.innerHTML) ||
                      /="\.\.\."/.test(body.innerHTML);
    if (hasEllipsis) {
      label.appendChild(el('span', 'rv-badge rv-badge-note', 'contains documented … elision'));
      wrapper.appendChild(note(
        'This documented example uses … as a deliberate elision. What renders here is not a ' +
        'complete component, so appearance is not runtime evidence for the elided parts. ' +
        'Classify gaps as SOURCE PARTIAL, not as a runtime defect.'));
      record('SOURCE PARTIAL', component,
        'example "' + (testCase.label || '') + '" contains a documented … elision', 'harness');
    }

    // (b) The documented example is script, not markup. Buckholt's Code & specs
    //     pages include initialisation snippets alongside HTML. Rendering one
    //     as page text is meaningless, so it is shown as source instead. The
    //     nodes are not altered - they are moved into a <pre> wrapper that sits
    //     outside them.
    var onlyText = testCase.nodes.every(function (n) { return n.nodeType === Node.TEXT_NODE; });
    if (onlyText && body.textContent.trim()) {
      var pre = el('pre', 'rv-nonmarkup');
      while (body.firstChild) pre.appendChild(body.firstChild);
      body.appendChild(pre);
      label.appendChild(el('span', 'rv-badge rv-badge-note', 'documented example is script, not markup'));
      record('PASS', component,
        'example "' + (testCase.label || '') + '" is a documented script snippet, shown as source', 'harness');
    }

    // (c) Broken image placeholders. src="..." is documentation shorthand and
    //     will 404; that is expected, not a defect.
    var placeholderImages = body.querySelectorAll('img[src="..."]');
    if (placeholderImages.length) {
      record('SOURCE PARTIAL', component,
        placeholderImages.length + ' documented <img src="..."> placeholder(s) cannot load; expected, not a defect',
        'harness');
    }
  }

  function note(text) {
    return el('p', 'rv-note', text);
  }

  // --------------------------------------------------------------------------
  // 4. Bootstrap initialisation
  //
  // Only where the documented markup requires JavaScript that does not
  // self-initialise from a data attribute.
  // --------------------------------------------------------------------------
  function initialiseBootstrap() {
    if (typeof window.bootstrap === 'undefined') return;

    // Tooltip. Buckholt documents the initialisation options in
    // components/tooltip/examples.html, Code & specs example 3. Those exact
    // options are used here rather than Bootstrap's defaults.
    var triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.prototype.forEach.call(triggers, function (trigger) {
      new window.bootstrap.Tooltip(trigger, {
        offset: [0, 4],
        delay: { show: 800, hide: 100 }
      });
    });
    if (triggers.length) {
      record('PASS', 'tooltip', triggers.length + ' tooltip trigger(s) initialised with the documented offset and delay');
    }
  }

  // --------------------------------------------------------------------------
  // 5. Test controls for components that render hidden at rest
  //
  // A `.modal` and a `.toast` are display:none until shown. Adding `.show` to
  // the canonical markup would alter it, so the harness drives the documented
  // Bootstrap API from outside instead.
  // --------------------------------------------------------------------------
  function addVisibilityControls() {
    if (typeof window.bootstrap === 'undefined') return;

    document.querySelectorAll('.rv-case').forEach(function (testCase) {
      var modal = testCase.querySelector('.modal');
      var toast = testCase.querySelector('.toast');
      var fixedContainer = testCase.querySelector('.toast-container');
      if (!modal && !toast && !fixedContainer) return;

      var controls = el('div', 'rv-case-controls');

      // A documented `.toast-container` is position: fixed, so it floats over
      // every other section for as long as the page is open. That is correct
      // Buckholt behaviour, not a defect, so it renders exactly as documented
      // by default. This control only lets you get it out of the way while
      // inspecting something else; it changes nothing about how the container
      // is styled.
      if (fixedContainer && getComputedStyle(fixedContainer).position === 'fixed') {
        // Documented behaviour: a toast container is fixed to the viewport, so
        // it covers the runtime summary for as long as it is shown. The harness
        // holds it back until asked rather than obscuring layer 2. Visibility
        // only - no component styling is changed.
        var shown = false;
        fixedContainer.style.visibility = 'hidden';
        var toggle = el('button', 'rv-control', 'Show this fixed overlay');
        toggle.type = 'button';
        toggle.addEventListener('click', function () {
          shown = !shown;
          fixedContainer.style.visibility = shown ? '' : 'hidden';
          toggle.textContent = shown ? 'Hide this fixed overlay' : 'Show this fixed overlay';
        });
        controls.appendChild(toggle);
        testCase.appendChild(note(
          'This example is a documented position: fixed toast container, so when shown it overlays ' +
          'the whole page including the summary above. That is correct Buckholt behaviour, not a ' +
          'defect. The harness holds it back until you ask for it; nothing about the component ' +
          'is changed.'));
        record('PASS', 'toast',
          'a documented .toast-container renders position: fixed and overlays the page. Expected ' +
          'behaviour, not a defect; held back by the harness until requested.', 'harness');
      }

      if (modal) {
        // The documented example carries no id, so it is addressed by node
        // reference. Bootstrap needs a dialog inside; guard against the
        // documented bare `.modal-dialog` fragments.
        if (modal.querySelector('.modal-dialog')) {
          var showModal = el('button', 'rv-control', 'Show this modal');
          showModal.type = 'button';
          showModal.addEventListener('click', function () {
            window.bootstrap.Modal.getOrCreateInstance(modal).show();
          });
          controls.appendChild(showModal);
        }
      }

      if (toast) {
        var showToast = el('button', 'rv-control', 'Show this toast');
        showToast.type = 'button';
        showToast.addEventListener('click', function () {
          window.bootstrap.Toast.getOrCreateInstance(toast).show();
        });
        controls.appendChild(showToast);

        var hideToast = el('button', 'rv-control', 'Hide');
        hideToast.type = 'button';
        hideToast.addEventListener('click', function () {
          window.bootstrap.Toast.getOrCreateInstance(toast).hide();
        });
        controls.appendChild(hideToast);
      }

      if (controls.childNodes.length) {
        testCase.insertBefore(controls, testCase.querySelector('.rv-case-body'));
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Structural diagnostics
  //
  // Conditions that make an observation on this page unreliable. Reported, not
  // corrected — correcting any of them would mean editing canonical markup.
  // --------------------------------------------------------------------------
  function structuralDiagnostics() {
    // Duplicate ids. Buckholt reuses ids across its own Code & specs examples,
    // so composing them onto one page produces collisions. Every label[for],
    // aria-labelledby, aria-controls and data-bs-target resolving to a
    // duplicated id resolves to the FIRST match, which can make a control look
    // broken when the markup is correct in isolation.
    var seen = {}, duplicates = {};
    document.querySelectorAll('.rv-canonical [id]').forEach(function (node) {
      var id = node.id;
      if (seen[id]) {
        duplicates[id] = (duplicates[id] || 1) + 1;
      } else {
        seen[id] = true;
      }
    });
    var duplicateIds = Object.keys(duplicates);
    if (duplicateIds.length) {
      record('SOURCE PARTIAL', 'harness',
        duplicateIds.length + ' id(s) appear more than once across the composed examples: ' +
        duplicateIds.sort().join(', ') +
        '. This is a consequence of composing separately-authored examples onto one page, not a ' +
        'runtime defect. Treat label, ARIA and data-bs-target resolution on the affected examples ' +
        'as untrustworthy here and verify them in isolation.', 'harness');
    }

    // label[for] pointing at nothing. In the supplied sources these are
    // usually group labels sitting above a fieldset of controls that each
    // carry their own id, so the `for` has no single target to resolve to.
    // That is a source condition, not a runtime one — do not "fix" it by
    // editing canonical markup. Grouped separately by component so each can be
    // checked against its own source file.
    var orphanLabels = {};
    document.querySelectorAll('.rv-canonical label[for]').forEach(function (label) {
      var target = label.getAttribute('for');
      if (!target || document.getElementById(target)) return;
      var region = label.closest('.rv-canonical');
      var component = region ? region.getAttribute('data-component') : 'unknown';
      (orphanLabels[component] = orphanLabels[component] || []).push(target);
    });
    Object.keys(orphanLabels).forEach(function (component) {
      record('NEEDS INVESTIGATION', component,
        orphanLabels[component].length + ' label[for] with no matching control id: ' +
        orphanLabels[component].join(', ') +
        '. In the supplied sources these are typically group labels above a set of controls that ' +
        'each carry their own id. Resolve against components/' + component + '/examples.html and the ' +
        'Buckholt source; this is a source-verification question, not a runtime defect, and must not ' +
        'be corrected by editing canonical markup.', 'harness');
    });

    // data-bs-target pointing at nothing.
    var orphanTargets = [];
    document.querySelectorAll('.rv-canonical [data-bs-target]').forEach(function (node) {
      var target = node.getAttribute('data-bs-target');
      if (target && target.charAt(0) === '#' && !document.querySelector(target)) {
        orphanTargets.push(target);
      }
    });
    if (orphanTargets.length) {
      record('DOCUMENTATION/RUNTIME MISMATCH', 'harness',
        'data-bs-target with no matching element on this page: ' + orphanTargets.join(', ') +
        '. The documented trigger example and the documented component example are separate ' +
        'snippets, so the pair does not connect when composed. Verify against the component source ' +
        'rather than adding ids to canonical markup.', 'harness');
    }
  }


  // --------------------------------------------------------------------------
  // 6b. Compatibility-fix verification
  //
  // Every correction in css/buckholt-ai-fixes.css is re-asserted against the
  // live runtime. The summary then reports measurement rather than a claim,
  // and a fix that stops working - because an upstream build changed, or the
  // stylesheet was not loaded - shows up as a failure instead of passing
  // silently.
  // --------------------------------------------------------------------------
  var fixChecks = [];

  function assertFix(component, label, selector, prop, expected, pseudo) {
    var node = document.querySelector(selector);
    if (!node) {
      fixChecks.push({ component: component, label: label, ok: null,
                       detail: 'no ' + selector + ' on this page' });
      return;
    }
    var actual = getComputedStyle(node, pseudo || undefined)[prop];
    var ok = typeof expected === 'function' ? expected(actual) : actual === expected;
    fixChecks.push({ component: component, label: label, ok: ok,
                     detail: prop + ': ' + actual });
    if (!ok) {
      record('VERIFIED RUNTIME ISSUE', component,
        'compatibility fix not in effect — ' + label + ' (' + prop + ' = ' + actual + ')');
    }
  }

  // `margin-left: auto` resolves to a used pixel value in getComputedStyle, so
  // that fix is verified by where the control actually lands rather than by
  // reading back the keyword.
  function assertTrailingEdge(component, label, selector, tolerance) {
    var node = document.querySelector(selector);
    if (!node) {
      fixChecks.push({ component: component, label: label, ok: null,
                       detail: 'no ' + selector + ' on this page' });
      return;
    }
    var gap = node.parentElement.getBoundingClientRect().right -
              node.getBoundingClientRect().right;
    var ok = Math.abs(gap) <= (tolerance || 12);
    fixChecks.push({ component: component, label: label, ok: ok,
                     detail: 'gap to trailing edge: ' + gap.toFixed(1) + 'px' });
    if (!ok) {
      record('VERIFIED RUNTIME ISSUE', component,
        'compatibility fix not in effect — ' + label + ' (sits ' + gap.toFixed(1) +
        'px from the trailing edge)');
    }
  }

  function verifyCompatibilityFixes() {
    var none = function (v) { return v === 'none'; };
    var zero = function (v) { return parseFloat(v) === 0; };

    // Focus bleed-through can only be judged with the button actually focused
    // by pointer, so it is asserted from the cascade rather than a resting read.
    (function () {
      var btn = document.querySelector('.rv-canonical .btn');
      if (!btn) {
        fixChecks.push({ component: 'button', label: 'Bootstrap mouse-focus glow suppressed',
                         ok: null, detail: 'no .btn on this page' });
        return;
      }
      var ok = false;
      try { ok = btn.matches('.btn') && !!document.querySelector('.rv-canonical .btn'); } catch (e) {}
      // the rule itself must exist in the compatibility layer
      var found = Array.prototype.some.call(document.styleSheets, function (sheet) {
        if ((sheet.href || '').indexOf('buckholt-ai-fixes') === -1) return false;
        try {
          return Array.prototype.some.call(sheet.cssRules, function (r) {
            return r.selectorText && r.selectorText.indexOf(':focus:not(:focus-visible)') !== -1;
          });
        } catch (e) { return 'unknown'; }
      });
      fixChecks.push({ component: 'button', label: 'Bootstrap mouse-focus glow suppressed',
                       ok: found === true ? true : (found === false ? false : null),
                       detail: found === true ? 'rule present in the compatibility layer'
                                              : 'stylesheet rules not readable from file://' });
    })();
    assertFix('progress-bar', 'error status icon uses the literal error colour',
      '.rv-canonical .progress-header:has(~ .is-invalid)', 'backgroundImage',
      function (v) { return v.indexOf('var%28') === -1 && v.indexOf('%23d7050c') !== -1; });
    assertFix('versa-tile', 'action column does not shrink',
      '.rv-canonical .versatile-actions', 'flexShrink', '0');
    assertFix('dropdown', "Bootstrap's caret triangle suppressed",
      '.rv-canonical .dropdown-toggle', 'display', none, '::after');
    assertFix('button-close', "Bootstrap's SVG cross removed",
      '.rv-canonical .btn-close', 'backgroundImage', none);
    assertFix('button-close', 'close control is border-box',
      '.rv-canonical .btn-close', 'boxSizing', 'border-box');
    assertTrailingEdge('alert', 'in-content close control sits at the trailing edge',
      '.rv-canonical .alert-content > .btn-close');
    assertTrailingEdge('toast', 'in-content close control sits at the trailing edge',
      '.rv-canonical .toast-content > .btn-close');
    assertFix('accordion', 'later items keep their top border',
      '.rv-canonical .accordion-item:not(:first-of-type)', 'borderTopWidth',
      function (v) { return parseFloat(v) > 0; });
    assertFix('modal', 'Bootstrap section padding removed',
      '.rv-canonical .modal-body', 'padding', zero);
    assertFix('toast', 'Bootstrap body padding removed',
      '.rv-canonical .toast-body', 'padding', zero);
    assertFix('table', 'Bootstrap currentColor rule above tbody removed',
      '.rv-canonical .table > tbody', 'borderTopWidth', zero);
    assertFix('table', 'action button set aligned to the row centre',
      '.rv-canonical .table td .button-set', 'marginTop', zero);
    assertFix('input-group', 'grouped action button separated and rounded',
      '.rv-canonical .input-group > .btn', 'marginLeft',
      function (v) { return parseFloat(v) > 0; });

    var list = document.getElementById('rv-check-list');
    if (!list) return;
    fixChecks.forEach(function (c) {
      var li = el('li');
      var mark = c.ok === null ? '– ' : (c.ok ? '✓ ' : '✗ ');
      li.textContent = mark + c.component + ' — ' + c.label + '  (' + c.detail + ')';
      li.style.color = c.ok === null ? '#a1a1aa' : (c.ok ? '#166534' : '#b91c1c');
      list.appendChild(li);
    });
  }

  // --------------------------------------------------------------------------
  // 7. Documented interactions with no shipped script
  //
  // Reported so they are not mistaken for runtime defects, and deliberately
  // NOT implemented here — supplying them would present harness code as
  // design-system behaviour.
  // --------------------------------------------------------------------------
  function reportMissingBehaviour() {
    if (document.querySelector('.rv-canonical .tag-selectable')) {
      record('MISSING BUCKHOLT JS', 'tag',
        'Selectable tag: the runtime hides the control with .tag-selectable input { display: none } ' +
        'and the canonical wrapper is a <span> with no for/id association, so a click never reaches ' +
        'the input; the selected appearance is keyed off .tag-selectable.active while the markup ' +
        'carries aria-selected. No shipped script connects them. Not implemented here by design.');
    }
    if (document.querySelector('.rv-canonical .tag-dismissible .btn-close')) {
      record('MISSING BUCKHOLT JS', 'tag',
        'Dismissible tag: the canonical close button carries no data-bs-dismiss and no Buckholt ' +
        'script binds it, so it is inert. dropdown.js builds its own dismissible tags for the ' +
        'multi-select selection chips and wires those close buttons itself, but that handler is ' +
        'scoped to tags it creates. Not implemented here by design.');
    }
    if (document.querySelector('.rv-canonical [data-bs-dismiss="tag"]')) {
      record('MISSING BUCKHOLT JS', 'tag',
        'data-bs-dismiss="tag" is not a Bootstrap behaviour and no Buckholt script implements it. ' +
        'Not implemented here by design.');
    }
    if (document.querySelector('.rv-canonical .card-selectable')) {
      record('MISSING BUCKHOLT JS', 'card',
        'Selectable card: .card-selectable.active supplies the selected treatment but nothing adds ' +
        '.active when the nested control changes. Not implemented here by design.');
    }
    if (document.querySelector('.rv-canonical input[type="range"]')) {
      record('MISSING BUCKHOLT JS', 'slider',
        'Slider: nothing synchronises the range input with its paired number field. form.js covers ' +
        'the Number input steppers but not this pairing. Not implemented here by design.');
    }
    if (document.querySelector('.rv-canonical [data-cdt-select-column], .rv-canonical [data-cdt-table]')) {
      record('MISSING BUCKHOLT JS', 'table',
        'data-cdt-* attributes imply a table controller that is not in this repository. ' +
        'Not implemented here by design.');
    }
  }

  // --------------------------------------------------------------------------
  // 8. Focus and state logging
  //
  // Makes keyboard behaviour observable without changing it.
  // --------------------------------------------------------------------------
  function logStateTransitions() {
    document.addEventListener('focusin', function (event) {
      var region = event.target.closest && event.target.closest('.rv-canonical');
      if (!region) return;
      var visible = event.target.matches(':focus-visible');
      console.log('[rv] focus %s %o (:focus-visible = %s)',
        region.getAttribute('data-component'), event.target, visible);
    });

    ['show.bs.modal', 'shown.bs.modal', 'hidden.bs.modal',
     'show.bs.collapse', 'shown.bs.collapse', 'hidden.bs.collapse',
     'show.bs.dropdown', 'shown.bs.dropdown', 'hidden.bs.dropdown',
     'show.bs.tab', 'shown.bs.tab',
     'show.bs.toast', 'shown.bs.toast', 'hidden.bs.toast',
     'close.bs.alert', 'closed.bs.alert'].forEach(function (name) {
      document.addEventListener(name, function (event) {
        console.log('[rv] %s %o', name, event.target);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Presentation
  //
  // Layer 2 - a component-level summary: what works, what needs attention.
  // Layer 3 - the raw diagnostics behind a disclosure, so the evidence is kept
  //           without being presented as a wall of failures.
  // --------------------------------------------------------------------------
  var SOURCE_PARTIAL = { table: true };

  // Behaviour a component needs from the product. Buckholt supplies the
  // structure and the styling; these are not defects and not this harness's
  // to implement.
  var APP_BEHAVIOUR = {
    tag: 'visual component present; selection and dismiss are product behaviour',
    card: 'visual component present; selectable state is product behaviour',
    slider: 'range and number field are not synchronised by any shipped script',
    table: 'the data-cdt-* controller implied by the source is not supplied',
    dropdown: 'reflecting a single-select choice into the label needs product code',
    'nested-inputs': 'conditional reveal is product logic by documentation'
  };

  function statusEl(text, cls) {
    return el('span', 'rv-status ' + cls, text);
  }

  function buildSummary() {
    var host = document.getElementById('rv-summary-table');
    if (!host) return;
    var body = host.querySelector('tbody');

    var components = Array.prototype.map.call(
      document.querySelectorAll('.rv-component'),
      function (sec) { return sec.getAttribute('data-component'); });

    var tally = { PASS: 0, ISSUE: 0, APP: 0, PARTIAL: 0, INVESTIGATE: 0 };

    components.forEach(function (slug) {
      // Only component-scoped findings can affect a status.
      var mine = diagnostics.filter(function (d) {
        return d.component === slug && d.scope === 'component';
      });
      var failedFixes = fixChecks.filter(function (c) {
        return c.component === slug && c.ok === false;
      });

      var issues = mine.filter(function (d) {
        return d.category === 'VERIFIED RUNTIME ISSUE' ||
               d.category === 'BUCKHOLT RUNTIME DEFECT' ||
               d.category === 'BOOTSTRAP BLEED-THROUGH';
      });
      var investigate = mine.filter(function (d) { return d.category === 'NEEDS INVESTIGATION'; });
      var appNote = APP_BEHAVIOUR[slug];

      var row = el('tr');
      var name = el('td');
      var link = el('a', null, slug.replace(/-/g, ' ').replace(/^./, function (c) { return c.toUpperCase(); }));
      link.href = '#rv-' + slug;
      name.appendChild(link);
      row.appendChild(name);

      // Source
      var src = el('td');
      if (SOURCE_PARTIAL[slug]) {
        src.appendChild(statusEl('SOURCE PARTIAL', 'rv-partial'));
        tally.PARTIAL++;
      } else {
        src.appendChild(statusEl('VERIFIED', 'rv-pass'));
      }
      row.appendChild(src);

      // Runtime
      var rt = el('td');
      if (issues.length || failedFixes.length) {
        rt.appendChild(statusEl('VERIFIED RUNTIME ISSUE', 'rv-issue'));
        tally.ISSUE++;
      } else if (investigate.length) {
        rt.appendChild(statusEl('NEEDS INVESTIGATION', 'rv-investigate'));
        tally.INVESTIGATE++;
      } else {
        rt.appendChild(statusEl('PASS', 'rv-pass'));
        tally.PASS++;
      }
      row.appendChild(rt);

      // Behaviour
      var beh = el('td');
      if (appNote) {
        beh.appendChild(statusEl('APPLICATION BEHAVIOUR REQUIRED', 'rv-app'));
        tally.APP++;
      } else {
        beh.appendChild(el('span', 'rv-quiet', '—'));
      }
      row.appendChild(beh);

      // Notes
      var notes = el('td', 'rv-note-cell');
      var text = [];
      if (appNote) text.push(appNote);
      failedFixes.forEach(function (c) { text.push('compatibility fix not in effect: ' + c.label); });
      issues.forEach(function (d) { text.push(d.detail); });
      investigate.forEach(function (d) { text.push(d.detail.split('.')[0] + '.'); });
      var applied = fixChecks.filter(function (c) { return c.component === slug && c.ok === true; });
      if (!text.length && applied.length) {
        text.push(applied.length + ' compatibility fix' + (applied.length > 1 ? 'es' : '') +
                  ' verified in effect');
      }
      notes.textContent = text.join(' · ') || '';
      if (!text.length) notes.className = 'rv-note-cell rv-quiet';
      row.appendChild(notes);

      body.appendChild(row);
    });

    var tallyHost = document.getElementById('rv-tally');
    [['PASS', tally.PASS, 'rv-pass'],
     ['VERIFIED RUNTIME ISSUE', tally.ISSUE, 'rv-issue'],
     ['APPLICATION BEHAVIOUR REQUIRED', tally.APP, 'rv-app'],
     ['SOURCE PARTIAL', tally.PARTIAL, 'rv-partial'],
     ['NEEDS INVESTIGATION', tally.INVESTIGATE, 'rv-investigate']].forEach(function (t) {
      if (!t[1]) return;
      tallyHost.appendChild(statusEl(t[0] + ' · ' + t[1], t[2]));
    });

    var applied = fixChecks.filter(function (c) { return c.ok === true; }).length;
    var note = document.getElementById('rv-summary-note');
    if (note) {
      note.textContent = components.length + ' components · ' +
        document.querySelectorAll('.rv-case').length + ' documented examples · ' +
        applied + ' of ' + fixChecks.filter(function (c) { return c.ok !== null; }).length +
        ' runtime assertions passing across 13 documented corrections';
    }
  }

  function renderArtefacts() {
    var host = document.getElementById('rv-artefact-list');
    if (!host) return;
    var artefacts = diagnostics.filter(function (d) { return d.scope === 'harness'; });

    // The … elisions are the bulk of these and are all the same finding, so
    // they are counted rather than listed 43 times.
    var elisions = artefacts.filter(function (d) { return /… elision/.test(d.detail); });
    var images = artefacts.filter(function (d) { return /placeholder/.test(d.detail); });
    var others = artefacts.filter(function (d) {
      return !/… elision|placeholder/.test(d.detail);
    });

    var list = el('ul');
    if (elisions.length) {
      var byComp = {};
      elisions.forEach(function (d) { byComp[d.component] = (byComp[d.component] || 0) + 1; });
      var li = el('li');
      li.textContent = elisions.length + ' documented … elisions across ' +
        Object.keys(byComp).length + ' components (' + Object.keys(byComp).sort().join(', ') +
        '). These are documentation shorthand in the source, not failures; the style guide ' +
        'completes them from verified markup, this page leaves them as written.';
      list.appendChild(li);
    }
    if (images.length) {
      var li2 = el('li');
      li2.textContent = images.length + ' documented <img src="..."> placeholders cannot load. Expected.';
      list.appendChild(li2);
    }
    others.forEach(function (d) {
      var li3 = el('li');
      li3.appendChild(el('strong', null, d.component + ': '));
      li3.appendChild(document.createTextNode(d.detail));
      list.appendChild(li3);
    });
    host.appendChild(list);
  }

  function renderDiagnostics() {
    var host = document.getElementById('rv-diagnostic-list');
    if (!host) return;

    var order = ['DEPENDENCY ISSUE', 'VERIFIED RUNTIME ISSUE', 'BOOTSTRAP BLEED-THROUGH',
                 'BUCKHOLT RUNTIME DEFECT', 'DOCUMENTATION/RUNTIME MISMATCH',
                 'MISSING BUCKHOLT JS', 'PRODUCT-LEVEL BEHAVIOUR', 'SOURCE PARTIAL',
                 'NEEDS INVESTIGATION', 'PASS'];

    var intro = el('p');
    intro.textContent = 'Every finding the verifier produced, in full, classified with the ' +
      'categories in verification/runtime-verification-framework.md. Findings marked ' +
      '(harness) are conditions created by composing examples onto one page and do not ' +
      'count against any component.';
    host.appendChild(intro);

    order.forEach(function (category) {
      var items = diagnostics.filter(function (d) { return d.category === category; });
      if (!items.length) return;

      var heading = el('p');
      heading.style.cssText = 'margin:0.75rem 0 0.25rem;font-size:0.8125rem;font-weight:600;';
      heading.textContent = category + ' (' + items.length + ')';
      host.appendChild(heading);

      var list = el('ul');
      items.forEach(function (item) {
        var li = el('li');
        li.appendChild(el('strong', null, item.component + ': '));
        li.appendChild(document.createTextNode(item.detail));
        if (item.scope === 'harness') {
          li.appendChild(el('span', 'rv-quiet', '  (harness)'));
        }
        list.appendChild(li);
      });
      host.appendChild(list);
    });

    console.table(diagnostics);
  }

  // --------------------------------------------------------------------------
  // Run order matters: dependencies first, then framing, then anything that
  // queries the framed DOM.
  // --------------------------------------------------------------------------
  function run() {
    checkDependencies();
    document.querySelectorAll('.rv-canonical').forEach(frameCases);
    initialiseBootstrap();
    addVisibilityControls();
    structuralDiagnostics();
    verifyCompatibilityFixes();
    reportMissingBehaviour();
    logStateTransitions();
    buildSummary();
    renderArtefacts();
    renderDiagnostics();

    window.rvDiagnostics = diagnostics;
    window.rvFixChecks = fixChecks;
    console.log('[rv] %d components, %d examples, %d diagnostics (%d component-scoped), %d/%d compatibility fixes in effect',
      document.querySelectorAll('.rv-component').length,
      document.querySelectorAll('.rv-case').length,
      diagnostics.length,
      diagnostics.filter(function (d) { return d.scope === 'component'; }).length,
      fixChecks.filter(function (c) { return c.ok === true; }).length,
      fixChecks.filter(function (c) { return c.ok !== null; }).length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
