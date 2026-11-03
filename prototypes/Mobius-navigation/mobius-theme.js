/* Mobius colour themes (review control).

   Sets `html[data-theme]` from `?theme=<name>`; without it the prototype is
   plain Buckholt. In Spectrum, `html[data-zone]` follows the area the broker
   is in. Applies in the Buckholt look only: the Mobius look is a copy of
   today's Mobius, so the select is disabled there. The browser does not
   remember the choice; the address does. Loaded in <head> after
   mobius-skin.js, so the page is drawn in the right colours first time. */
(function () {
  'use strict';
  var root = document.documentElement;
  var THEMES = [
    ['', 'Buckholt (default)'],
    ['ember', 'Ink and ember'],
    ['forest', 'Forest and saffron'],
    ['violet', 'Midnight violet'],
    ['terracotta', 'Terracotta editorial'],
    ['spectrum', 'Wayfinding spectrum']
  ];
  var KNOWN = THEMES.map(function (t) { return t[0]; }).filter(Boolean);
  var theme = (/[?&]theme=([a-z]+)\b/.exec(location.search) || [])[1];
  if (KNOWN.indexOf(theme) < 0) theme = '';

  /* Placeholder: Mobius has no Home / Claims / Documents / Reports areas, so
     its own areas borrow the nearest hue. Edit here to taste. */
  function zone() {
    var h = location.hash || '';
    if (/^#p\//.test(h)) return 'policies';
    if (/^#c\//.test(h)) return 'clients';
    if (/^#activity/.test(h)) return 'home';
    if (/^#renewals/.test(h)) return 'documents';
    if (/^#bordereau/.test(h)) return 'reports';
    if (/^#accounts/.test(h)) return 'claims';
    return 'clients';                       /* Clients & policies dashboard, search, new client */
  }
  function apply() {
    if (theme) root.setAttribute('data-theme', theme); else root.removeAttribute('data-theme');
    if (theme === 'spectrum') root.setAttribute('data-zone', zone()); else root.removeAttribute('data-zone');
  }
  function toAddress(v) {
    try {
      var u = new URL(location.href);
      if (v) u.searchParams.set('theme', v); else u.searchParams.delete('theme');
      history.replaceState(history.state, '', u.toString());
    } catch (e) { /* file:// or old browser: the colours still change */ }
  }
  apply();
  window.addEventListener('hashchange', apply);

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.querySelector('.mob-review-bar');
    if (!bar) return;
    var wrap = document.createElement('div');
    wrap.className = 'mob-skin-toggle mob-theme-toggle';
    wrap.innerHTML =
      '<label class="form-label mob-theme-label" for="mob-theme-select">Colour theme</label>' +
      '<div class="response select-input"><select class="form-select" id="mob-theme-select">' +
      THEMES.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('') +
      '</select></div>';
    bar.appendChild(wrap);
    var sel = wrap.querySelector('select');
    sel.value = theme;
    sel.addEventListener('change', function () { theme = sel.value; toAddress(theme); apply(); });

    /* Themes are for the Buckholt look; follow the skin switch. */
    function sync() {
      var off = root.getAttribute('data-skin') === 'mobius';
      sel.disabled = off;
      wrap.setAttribute('aria-disabled', off ? 'true' : 'false');
      wrap.title = off ? 'Themes apply to the Buckholt look. Switch off "Current Mobius look" to use them.' : '';
    }
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-skin'] });
    sync();
  });
})();
