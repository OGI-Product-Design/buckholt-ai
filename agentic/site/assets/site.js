/* Agentic UX site: progressive enhancement only.
 * The site is fully readable with this file missing or JavaScript off.
 *   - mobile navigation toggle (x-site-sidebar)
 *   - copy buttons on code blocks (x-code-block)
 *   - "On this page" highlighting (x-on-this-page)
 *   - client-side search (x-search)
 */
(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.querySelector('.x-nav-toggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.hidden = false;
    var setOpen = function (open) {
      sidebar.classList.toggle('x-is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Tooltips: Buckholt's documented initialisation (Tooltip, Code & specs
  // example 3). Needs the Bootstrap bundle; without it the accessible name
  // still comes from aria-label.
  if (window.bootstrap && window.bootstrap.Tooltip) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'), function (el) {
      new window.bootstrap.Tooltip(el, {
        offset: [0, 4],
        delay: { show: 800, hide: 100 }
      });
    });
  }

  // Diagrams full screen, in a Buckholt Modal. Needs the Bootstrap bundle;
  // without it the button stays hidden and the diagram still scrolls.
  var modalEl = document.getElementById('x-diagram-modal');
  if (modalEl && window.bootstrap && window.bootstrap.Modal) {
    var modal = new window.bootstrap.Modal(modalEl);
    var modalTitle = document.getElementById('x-diagram-modal-title');
    var modalBody = modalEl.querySelector('.x-diagram-modal-body');
    var opener = null;
    Array.prototype.forEach.call(document.querySelectorAll('[data-x-fullscreen]'), function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        var figure = button.closest('.x-diagram');
        var svg = figure.querySelector('.x-diagram-wide');
        var copy = svg.cloneNode(true);
        // The copy must not repeat the page's ids. Its arrowheads get ids of
        // their own: the originals sit inside a hidden diagram and would not
        // draw.
        Array.prototype.forEach.call(copy.querySelectorAll('[id]'), function (el) {
          if (el.tagName.toLowerCase() === 'marker') el.id = el.id + '-full';
          else el.removeAttribute('id');
        });
        Array.prototype.forEach.call(copy.querySelectorAll('[marker-end], [marker-start]'), function (el) {
          ['marker-end', 'marker-start'].forEach(function (attr) {
            var v = el.getAttribute(attr);
            if (v) el.setAttribute(attr, v.replace(/\)$/, '-full)'));
          });
        });
        copy.removeAttribute('aria-labelledby');
        copy.setAttribute('aria-label', svg.querySelector('title').textContent);
        modalTitle.textContent = svg.querySelector('title').textContent;
        modalBody.innerHTML = '';
        modalBody.appendChild(copy);
        opener = button;
        modal.show();
      });
    });
    modalEl.addEventListener('hidden.bs.modal', function () {
      modalBody.innerHTML = '';
      if (opener) opener.focus();
    });
  }

  // Copy buttons
  var live = document.createElement('div');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  var canCopy = !!(navigator.clipboard && window.isSecureContext);
  Array.prototype.forEach.call(document.querySelectorAll('[data-x-copy]'), function (button) {
    var code = document.getElementById(button.getAttribute('data-x-copy'));
    if (!code || !canCopy) return;
    button.hidden = false;
    var text = button.querySelector('.button-label');
    var original = text ? text.innerHTML : '';
    var timer;
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(code.textContent).then(function () {
        if (text) text.textContent = 'Copied';
        live.textContent = 'Copied to clipboard';
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (text) text.innerHTML = original;
          live.textContent = '';
        }, 2000);
      }, function () {
        live.textContent = 'Copy failed. Select the code and copy it instead.';
      });
    });
  });

  // "On this page": mark the section being read.
  var toc = document.querySelector('.x-on-this-page');
  if (toc && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var mark = function (id) {
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length) mark(visible[0].target.id);
    }, { rootMargin: '0px 0px -70% 0px' });
    targets.forEach(function (t) { observer.observe(t); });
  }

  // Search: one routine for the search Modal and the search page.
  var escapeHtml = function (t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var snippet = function (text, words) {
    var lower = text.toLowerCase();
    var at = lower.indexOf(words[0]);
    if (at < 0) return text.slice(0, 160);
    var start = Math.max(0, at - 60);
    if (start) start = text.indexOf(' ', start) + 1;
    var end = text.lastIndexOf(' ', start + 180);
    if (end <= at) end = start + 180;
    return (start ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
  };
  var runSearch = function (box, root, q) {
    var index = window.X_SEARCH_INDEX || [];
    var status = box.querySelector('.x-search-status');
    var list = box.querySelector('.x-search-list');
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    list.innerHTML = '';
    if (!words.length) { status.textContent = 'Type a word to search, for example “gate” or “Figma”.'; return; }
    var hits = index.map(function (page) {
      var title = page.title.toLowerCase();
      var body = (page.description + ' ' + page.text).toLowerCase();
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var inTitle = title.indexOf(words[i]) >= 0;
        var inBody = body.indexOf(words[i]) >= 0;
        if (!inTitle && !inBody) return null;
        score += (inTitle ? 10 : 0) + (inBody ? 1 : 0);
      }
      return { page: page, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
    status.textContent = hits.length
      ? hits.length + (hits.length === 1 ? ' page matches ' : ' pages match ') + '“' + q + '”.'
      : 'No pages match “' + q + '”. Try a shorter or different word.';
    list.innerHTML = hits.map(function (h) {
      return '<li class="list-item"><a href="' + root + h.page.url + '">' + escapeHtml(h.page.title) + '</a>' +
        '<p class="body-01">' + escapeHtml(snippet(h.page.text, words)) + '</p></li>';
    }).join('');
  };

  // The search page (works without the Modal).
  var pageBox = document.querySelector('main .x-search-results');
  if (pageBox && window.X_SEARCH_INDEX) {
    var pageInput = document.getElementById('search-input');
    var pageRoot = pageBox.getAttribute('data-root');
    var query = new URLSearchParams(location.search).get('q') || '';
    pageInput.value = query;
    runSearch(pageBox, pageRoot, query);
    document.querySelector('main .x-search-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var q = pageInput.value.trim();
      try { history.replaceState(null, '', '?q=' + encodeURIComponent(q)); } catch (e) { /* not allowed on some file:// pages */ }
      runSearch(pageBox, pageRoot, q);
    });
  }

  // The search Modal, opened from the header field, the phone Button or "/"
  // from anywhere (as in the Mobius navigation prototype). Needs Bootstrap;
  // without it the header field submits to the search page instead.
  var searchModalEl = document.getElementById('x-search-modal');
  if (searchModalEl && window.bootstrap && window.bootstrap.Modal) {
    var searchModal = new window.bootstrap.Modal(searchModalEl);
    var modalBox = searchModalEl.querySelector('.x-search-results');
    var modalInput = document.getElementById('x-search-modal-field');
    var modalRoot = searchModalEl.getAttribute('data-root');
    var headerForm = document.querySelector('.x-header-search');
    var headerInput = document.getElementById('x-search-field');
    var searchBtn = document.getElementById('x-search-btn');
    var trigger = null;
    var seedText = '';
    var opening = false;

    var loadIndex = function (done) {
      if (window.X_SEARCH_INDEX) { done(); return; }
      var script = document.createElement('script');
      script.src = searchModalEl.getAttribute('data-index');
      script.onload = done;
      script.onerror = function () {
        modalBox.querySelector('.x-search-status').textContent = 'Search could not load. Every page is linked from the navigation.';
      };
      document.head.appendChild(script);
    };
    var openSearch = function (seed, from) {
      trigger = from || null;
      seedText = seed || '';
      modalInput.value = seedText;
      opening = true;
      loadIndex(function () { runSearch(modalBox, modalRoot, modalInput.value.trim()); });
      searchModal.show();
    };
    // Keys typed while the Modal is still fading in go into its field, as in
    // the Mobius navigation prototype; otherwise they are lost.
    document.addEventListener('keydown', function (event) {
      if (!opening || event.target === modalInput || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.length === 1) {
        event.preventDefault();
        modalInput.value += event.key;
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        modalInput.value = modalInput.value.slice(0, -1);
      }
    }, true);
    searchModalEl.addEventListener('shown.bs.modal', function () {
      opening = false;
      modalInput.focus();
      var n = modalInput.value.length;
      modalInput.setSelectionRange(n, n);
    });
    searchModalEl.addEventListener('hidden.bs.modal', function () {
      if (headerInput) headerInput.value = '';
      if (trigger && document.contains(trigger)) trigger.focus();
      trigger = null;
    });
    modalBox.querySelector('.x-search-form').addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch(modalBox, modalRoot, modalInput.value.trim());
    });

    if (headerForm && headerInput) {
      headerForm.addEventListener('mousedown', function (event) {
        event.preventDefault();
        openSearch('', null);
      });
      headerInput.addEventListener('keydown', function (event) {
        if (event.key === 'Tab' || event.key === 'Shift' || event.key === 'Escape' || event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();
        if (opening) return;
        openSearch(event.key.length === 1 && event.key !== '/' ? event.key : '', headerInput);
      });
      headerForm.addEventListener('submit', function (event) { event.preventDefault(); openSearch(headerInput.value, headerInput); });
    }
    if (searchBtn) {
      searchBtn.hidden = false;
      searchBtn.addEventListener('click', function () { openSearch('', searchBtn); });
    }
    // "/" opens search from anywhere, except while typing in a field.
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      var t = event.target;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
      if (searchModalEl.classList.contains('show')) return;
      event.preventDefault();
      openSearch('', document.activeElement && document.activeElement !== document.body ? document.activeElement : null);
    });
  }
})();
