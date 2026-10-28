/* Mobius skin switch (Laurence, 12 October 2026).

   Sets `html[data-skin="mobius"]`, which mobius-skin.css dresses as current
   Mobius; without it the prototype is Buckholt. Loaded in <head> so the
   page is drawn in the right look first time, without a flash.

   Every visit opens in the Mobius look (Laurence, 20 October 2026), unless
   the address says `?skin=buckholt`. The browser does not remember the
   choice. A floating Switch, bottom centre, flips the look and writes it
   into the address, so a refresh keeps it but a fresh visit is Mobius.

   A second Switch beside it (Laurence, 28 October 2026) is the A/B test of
   how the client's menu opens from a policy page: off, it lays over the
   policy's menu while the pointer is on the client icon (A, as before);
   on, a click opens it beside the policy's menu, left to right, both over
   the page (B, `?menu=beside`, `html[data-menu="beside"]`). Remembered in
   the address in the same way. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* Choices remembered by earlier versions are cleared, so they no longer win. */
  try { localStorage.removeItem('mob-skin'); } catch (e) { /* storage blocked */ }

  var skin = (/[?&]skin=(mobius|buckholt)\b/.exec(location.search) || [])[1] || 'mobius';
  var beside = /[?&]menu=beside\b/.test(location.search);

  /* Keep the address in step: ?skin=buckholt for Buckholt, nothing for
     Mobius; ?menu=beside for B, nothing for A. */
  function toAddress(key, v) {
    try {
      var u = new URL(location.href);
      if (v) u.searchParams.set(key, v); else u.searchParams.delete(key);
      history.replaceState(history.state, '', u.toString());
    } catch (e) { /* file:// or old browser: the look still changes */ }
  }
  function applyMenu(on) {
    beside = on;
    if (on) root.setAttribute('data-menu', 'beside'); else root.removeAttribute('data-menu');
    var sw = document.getElementById('mob-menu-switch');
    if (sw) sw.checked = on;
  }
  applyMenu(beside);

  /* Both looks carry the OGI logo (Laurence, 28 October 2026); the
     "open gi" wordmark is gone. */
  function apply(v) {
    skin = v;
    if (v === 'mobius') root.setAttribute('data-skin', 'mobius'); else root.removeAttribute('data-skin');
    var sw = document.getElementById('mob-skin-switch');
    if (sw) sw.checked = v === 'mobius';
  }
  apply(skin);

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.createElement('div');
    wrap.className = 'form-check form-switch form-switch-sm mob-skin-toggle';
    wrap.innerHTML =
      '<input class="form-check-input" type="checkbox" role="switch" id="mob-skin-switch">' +
      '<div class="input-label"><label class="form-check-label" for="mob-skin-switch">Current Mobius look</label></div>';
    /* B only differs beside the page (from 1024px), so the Switch shows there only. */
    var wrap2 = document.createElement('div');
    wrap2.className = 'form-check form-switch form-switch-sm mob-skin-toggle mob-menu-toggle';
    wrap2.innerHTML =
      '<input class="form-check-input" type="checkbox" role="switch" id="mob-menu-switch">' +
      '<div class="input-label"><label class="form-check-label" for="mob-menu-switch">Client menu beside policy menu</label></div>';
    var bar = document.createElement('div');
    bar.className = 'mob-review-bar';
    bar.appendChild(wrap); bar.appendChild(wrap2);
    document.body.appendChild(bar);
    apply(skin);
    applyMenu(beside);
    document.getElementById('mob-skin-switch').addEventListener('change', function (e) {
      var v = e.target.checked ? 'mobius' : 'buckholt';
      toAddress('skin', v === 'buckholt' ? 'buckholt' : null);
      apply(v);
    });
    document.getElementById('mob-menu-switch').addEventListener('change', function (e) {
      toAddress('menu', e.target.checked ? 'beside' : null);
      applyMenu(e.target.checked);
      document.dispatchEvent(new CustomEvent('mob-menu-mode'));
    });
  });
})();
