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
    var label = toggle.querySelector('.button-label');
    var setOpen = function (open) {
      sidebar.classList.toggle('x-is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Close menu' : 'Menu';
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

  // Search
  var results = document.querySelector('.x-search-results');
  if (results && window.X_SEARCH_INDEX) {
    var status = results.querySelector('.x-search-status');
    var list = results.querySelector('.x-search-list');
    var input = document.getElementById('search-input');
    var root = results.getAttribute('data-root');
    var query = new URLSearchParams(location.search).get('q') || '';
    input.value = query;
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
    var run = function (index, q) {
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
    var index = window.X_SEARCH_INDEX;
    run(index, query);
    document.querySelector('.x-search-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var q = input.value.trim();
      try { history.replaceState(null, '', '?q=' + encodeURIComponent(q)); } catch (e) { /* not allowed on some file:// pages */ }
      run(index, q);
    });
  }
})();
