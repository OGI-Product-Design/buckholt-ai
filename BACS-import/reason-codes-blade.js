/* ============================================================================
   Reason codes blade — content and search
   ============================================================================

   Section 13.2 and 13.3 of `bacs-import-spec.md`. The blade shell itself is
   the reusable component in `prototype/blade.js`; this file is the reason
   codes that go inside it, and the search behaviour the spec sets out rule by
   rule.

   Inside the blade, everything that has a Buckholt component uses it:
     - the accordion sections are Buckholt Accordion
     - the "What to do" disclosures are Buckholt Collapse, close button and all
     - the code chips are Buckholt Tag
     - the search field is a Buckholt Text input with an input icon

   Exposes `window.ReasonCodesBlade`.
   ============================================================================ */
(function (global) {
  'use strict';

  var esc = Shell.escapeHtml;
  var DATA = global.REASON_CODES;

  /* Section 13.2: "Section order and default expansion depend on the page the
     blade opens from." */
  var PRESETS = {
    ARUDD: {
      order: ['arudd', 'auddis', 'addacs', 'txn'],
      expanded: ['arudd']
    },
    AUDDIS_ADDACS: {
      order: ['auddis', 'addacs', 'arudd', 'txn'],
      expanded: ['auddis', 'addacs']
    }
  };

  var blade = null;
  var preset = PRESETS.ARUDD;
  var query = '';
  var debounce = null;


  /* ------------------------------------------------------------- Searching */

  /* Rule 1: "trim it, lowercase it, and collapse repeated spaces". */
  function normalise(raw) {
    return String(raw).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /* Rules 3 and 4. A one-character query matches the code only, and exactly —
     otherwise "B" would match almost every description. Two or more
     characters also match the title, description or "What to do" text. */
  function matches(item, q) {
    if (!q) return true;
    if (item.code.toLowerCase() === q) return true;
    if (q.length < 2) return false;
    return (item.title + ' ' + item.description + ' ' + (item.todo || ''))
      .toLowerCase().indexOf(q) !== -1;
  }

  function isExactCode(item, q) {
    return !!q && item.code.toLowerCase() === q;
  }

  /* Rule 7c: "When a match is in the guidance, that item's What to do box
     opens automatically." */
  function matchInGuidance(item, q) {
    return !!q && q.length >= 2 && !!item.todo &&
      item.todo.toLowerCase().indexOf(q) !== -1;
  }

  /* Rule 5: "within each section, exact code matches come first, then the rest
     in their original order." A stable partition keeps the original order in
     both halves. */
  function orderMatches(items, q) {
    var hit = [], rest = [];
    items.forEach(function (item) {
      (isExactCode(item, q) ? hit : rest).push(item);
    });
    return hit.concat(rest);
  }

  /* Rule 7: matched text in the title, description and guidance is wrapped in
     <mark>. The text is split on the raw string and each piece escaped, so a
     query can never match inside an HTML entity this function produced. */
  function highlight(text, q) {
    text = String(text);
    if (!q || q.length < 2) return esc(text);

    var lower = text.toLowerCase();
    var out = '';
    var from = 0;
    var at;

    while ((at = lower.indexOf(q, from)) !== -1) {
      out += esc(text.slice(from, at)) + '<mark>' + esc(text.slice(at, at + q.length)) + '</mark>';
      from = at + q.length;
    }

    return out + esc(text.slice(from));
  }


  /* -------------------------------------------------------------- Rendering */

  function chip(item, q, key) {
    return '<span class="tag tag-sm' + (isExactCode(item, q) ? ' rc-chip-match' : '') + '"' +
      ' id="' + key + '-chip">' +
      '<span class="tag-label">' + esc(item.code) + '</span>' +
    '</span>';
  }

  /* One code. The "What to do" disclosure is Buckholt Collapse, Code & specs
     "Close button" example: `.collapse-item > a.collapse-trigger +
     .collapse-card.collapse > .collapse-content > .text-block +
     button.btn-close`. Items whose `todo` is empty have no disclosure, per
     section 13.2. */
  function itemMarkup(item, sectionKey, index, q) {
    var key = 'rc-' + sectionKey + '-' + index;
    var openGuidance = matchInGuidance(item, q);

    var guidance = '';
    if (item.todo) {
      guidance =
        '<div class="collapse-item">' +
          '<a class="collapse-trigger" data-bs-toggle="collapse" href="#' + key + '-todo"' +
            ' role="button" aria-expanded="' + (openGuidance ? 'true' : 'false') + '"' +
            ' aria-controls="' + key + '-todo" id="' + key + '-trigger">What to do</a>' +
          '<div class="collapse-card collapse' + (openGuidance ? ' show' : '') + '" id="' + key + '-todo">' +
            '<div class="collapse-content">' +
              '<div class="text-block">' +
                '<h6 class="collapse-title">What to do</h6>' +
                '<p>' + highlight(item.todo, q) + '</p>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="btn-close" data-bs-toggle="collapse"' +
              ' href="#' + key + '-todo" data-rc-return="' + key + '-trigger"' +
              ' aria-label="Close what to do for ' + esc(item.code) + '"></button>' +
          '</div>' +
        '</div>';
    }

    return '' +
      '<div class="rc-item">' +
        '<div class="rc-item-head">' +
          '<h3 class="rc-item-title">' + highlight(item.title, q) + '</h3>' +
          chip(item, q, key) +
        '</div>' +
        '<p class="rc-item-description">' + highlight(item.description, q) + '</p>' +
        guidance +
      '</div>';
  }

  /* A section's visible items, grouped as the data groups them. `txn` carries
     `groups` with their own subheadings; the other three carry a flat
     `codes` list. */
  function sectionGroups(key) {
    var section = DATA[key];
    return section.groups
      ? section.groups.map(function (g) { return { heading: g.heading, codes: g.codes }; })
      : [{ heading: null, codes: section.codes }];
  }

  function sectionMarkup(key, q, expandedByDefault) {
    var section = DATA[key];
    var groups = sectionGroups(key).map(function (g) {
      return { heading: g.heading, codes: orderMatches(g.codes.filter(function (c) { return matches(c, q); }), q) };
    });

    var count = groups.reduce(function (n, g) { return n + g.codes.length; }, 0);

    /* Rule 6: "Sections with no matches are hidden." */
    if (q && count === 0) return { html: '', count: 0 };

    /* Rule 6: sections with matches expand automatically; with no search, the
       preset decides. */
    var open = q ? true : expandedByDefault;

    var index = 0;
    var body = groups.map(function (g) {
      return (g.heading ? '<h4 class="rc-subheading">' + esc(g.heading) + '</h4>' : '') +
        g.codes.map(function (item) {
          index += 1;
          return itemMarkup(item, key, index, q);
        }).join('');
    }).join('');

    /* Rule 6: "Intros are hidden while searching." */
    var intro = q ? '' : '<p class="rc-intro">' + esc(section.intro) + '</p>';

    return {
      count: count,
      html: '' +
        '<div class="accordion-item" data-rc-section="' + key + '">' +
          '<h3 class="accordion-header">' +
            '<button class="accordion-button' + (open ? '' : ' collapsed') + '" type="button"' +
              ' data-bs-toggle="collapse" data-bs-target="#rc-body-' + key + '"' +
              ' aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="rc-body-' + key + '">' +
              esc(section.title) +
              (q ? '<span class="rc-section-count">' +
                     count + (count === 1 ? ' match' : ' matches') +
                   '</span>' : '') +
            '</button>' +
          '</h3>' +
          '<div id="rc-body-' + key + '" class="accordion-collapse collapse' + (open ? ' show' : '') + '">' +
            '<div class="accordion-body">' + intro + body + '</div>' +
          '</div>' +
        '</div>'
    };
  }

  function resultsLine(total, q) {
    if (!q) return '';
    return (total === 1 ? '1 result for ' : total + ' results for ') + '“' + q + '”';
  }

  function renderSections() {
    var q = query;
    var total = 0;
    var html = preset.order.map(function (key) {
      var section = sectionMarkup(key, q, preset.expanded.indexOf(key) !== -1);
      total += section.count;
      return section.html;
    }).join('');

    var sections = document.getElementById('rc-sections');
    var results = document.getElementById('rc-results');

    /* Rule 8: no results. */
    if (q && total === 0) {
      sections.innerHTML =
        '<div class="text-block rc-empty">' +
          '<h3 class="title-02">No reason codes match “' + esc(q) + '”</h3>' +
          '<p>Check the spelling, or search by code, for example 0 or B.</p>' +
        '</div>';
    } else {
      sections.innerHTML = html;
    }

    /* Section 13.2 item 5: the results line lives in a polite live region, so
       only its text changes — the region itself stays in the DOM. */
    results.textContent = resultsLine(total, q);
  }


  /* ------------------------------------------------------------------ Shell */

  function bodyMarkup() {
    return '' +
      '<p class="rc-disclaimer">Codes are set by BACS and may change. For the latest list, visit ' +
        '<a href="https://www.bacs.co.uk" target="_blank" rel="noopener">www.bacs.co.uk</a>.</p>' +

      '<div class="input rc-search">' +
        '<div class="response text-input">' +
          '<i class="input-icon fa-regular fa-magnifying-glass" aria-hidden="true"></i>' +
          '<label class="visually-hidden" for="rc-search">Search by code or description</label>' +
          '<input type="text" class="form-control" id="rc-search" autocomplete="off"' +
            ' placeholder="Search by code or description" aria-describedby="rc-hint">' +
          /* Buckholt Text input, Code & specs example 6: the clear control is
             `.input-btn.input-clear` and draws its own cross from a CSS
             ::before, so it carries no icon element. */
          '<button type="button" class="input-btn input-clear" id="rc-clear" aria-label="Clear search" hidden></button>' +
        '</div>' +
        '<small class="form-helper" id="rc-hint">For example 0, B or deceased</small>' +
        '<p class="support-01 rc-results" id="rc-results" role="status" aria-live="polite"></p>' +
      '</div>' +

      '<div class="accordion rc-sections" id="rc-sections"></div>';
  }

  function ensureBlade() {
    if (blade) return blade;

    blade = new Blade({
      id: 'reason-codes-blade',
      title: 'Reason codes',
      body: bodyMarkup(),
      initialFocus: '#rc-search',
      onClose: function () {
        /* Rule 10: "Closing and reopening the blade resets the search and the
           expansion." */
        query = '';
        var input = document.getElementById('rc-search');
        if (input) input.value = '';
        document.getElementById('rc-clear').hidden = true;
      }
    });

    var input = document.getElementById('rc-search');
    var clear = document.getElementById('rc-clear');

    /* Rule 1: debounce by 150 ms. */
    input.addEventListener('input', function () {
      var raw = this.value;
      clear.hidden = raw.trim() === '';
      global.clearTimeout(debounce);
      debounce = global.setTimeout(function () {
        query = normalise(raw);
        renderSections();
      }, 150);
    });

    /* Rule 9: "Clearing the search restores the default state." */
    clear.addEventListener('click', function () {
      input.value = '';
      clear.hidden = true;
      query = '';
      renderSections();
      input.focus();
    });

    /* Section 13.2: the × inside a "What to do" box collapses it "exactly like
       selecting the What to do toggle again" — Bootstrap's Collapse data API
       already does that, because the button targets the same collapse. All
       this adds is returning focus to the toggle afterwards, so the keyboard
       is not stranded inside a box that has just closed. */
    blade.el.addEventListener('hidden.bs.collapse', function (e) {
      var closer = blade.el.querySelector('.btn-close[href="#' + e.target.id + '"]');
      if (!closer || document.activeElement !== closer) return;
      var trigger = document.getElementById(closer.dataset.rcReturn);
      if (trigger) trigger.focus();
    });

    return blade;
  }

  /* `fileType` is the import the blade was opened from, which decides section
     order and default expansion (section 13.2). */
  function open(trigger, fileType) {
    ensureBlade();
    preset = PRESETS[fileType] || PRESETS.ARUDD;
    query = '';
    document.getElementById('rc-search').value = '';
    document.getElementById('rc-clear').hidden = true;
    renderSections();
    blade.open(trigger);
  }

  global.ReasonCodesBlade = { open: open };
}(window));
