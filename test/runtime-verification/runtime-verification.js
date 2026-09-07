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

  function record(category, component, detail) {
    diagnostics.push({ category: category, component: component, detail: detail });
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
      record('SOURCE PARTIAL', component, 'example "' + (testCase.label || '') + '" contains a documented … elision');
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
      record('PASS', component, 'example "' + (testCase.label || '') + '" is a documented script snippet, shown as source');
    }

    // (c) Broken image placeholders. src="..." is documentation shorthand and
    //     will 404; that is expected, not a defect.
    var placeholderImages = body.querySelectorAll('img[src="..."]');
    if (placeholderImages.length) {
      record('SOURCE PARTIAL', component,
        placeholderImages.length + ' documented <img src="..."> placeholder(s) cannot load; expected, not a defect');
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
        var hidden = false;
        var toggle = el('button', 'rv-control', 'Hide this fixed overlay while inspecting');
        toggle.type = 'button';
        toggle.addEventListener('click', function () {
          hidden = !hidden;
          fixedContainer.style.visibility = hidden ? 'hidden' : '';
          toggle.textContent = hidden
            ? 'Restore this fixed overlay'
            : 'Hide this fixed overlay while inspecting';
        });
        controls.appendChild(toggle);
        testCase.appendChild(note(
          'This example is a documented position: fixed toast container, so it overlays the whole ' +
          'page for as long as it is shown. That is the documented behaviour and is left exactly as ' +
          'it renders. Use the control above to move it out of the way while inspecting other ' +
          'sections; it is a harness convenience and changes no component styling.'));
        record('PASS', 'toast',
          'a documented .toast-container renders position: fixed and overlays the page. Expected ' +
          'behaviour, not a defect; a harness control is provided to hide it while inspecting.');
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
        'as untrustworthy here and verify them in isolation.');
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
        'be corrected by editing canonical markup.');
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
        'rather than adding ids to canonical markup.');
    }
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
  // 9. Render the diagnostics panel
  // --------------------------------------------------------------------------
  function renderDiagnostics() {
    var host = document.getElementById('rv-diagnostic-list');
    if (!host) return;

    if (!diagnostics.length) {
      host.appendChild(el('p', 'rv-diagnostics-empty',
        'No harness-level diagnostics. This says nothing about component runtime parity — that is ' +
        'established by inspection against the framework, not by this script.'));
      return;
    }

    var order = ['DEPENDENCY ISSUE', 'BOOTSTRAP BLEED-THROUGH', 'BUCKHOLT RUNTIME DEFECT',
                 'DOCUMENTATION/RUNTIME MISMATCH', 'MISSING BUCKHOLT JS', 'PRODUCT-LEVEL BEHAVIOUR',
                 'SOURCE PARTIAL', 'NEEDS INVESTIGATION', 'PASS'];

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
        li.innerHTML = '';
        li.appendChild(el('strong', null, item.component + ': '));
        li.appendChild(document.createTextNode(item.detail));
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
    reportMissingBehaviour();
    logStateTransitions();
    renderDiagnostics();

    window.rvDiagnostics = diagnostics;
    console.log('[rv] harness ready: %d components, %d test cases, %d diagnostics',
      document.querySelectorAll('.rv-component').length,
      document.querySelectorAll('.rv-case').length,
      diagnostics.length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
