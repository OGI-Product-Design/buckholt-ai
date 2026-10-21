/* Mobius skin switch (Laurence, 12 October 2026).

   Sets `html[data-skin="mobius"]`, which mobius-skin.css dresses as current
   Mobius; without it the prototype is Buckholt. Loaded in <head> so the
   page is drawn in the right look first time, without a flash.

   Every visit opens in the Mobius look (Laurence, 20 October 2026), unless
   the address says `?skin=buckholt`. The browser does not remember the
   choice. A floating Switch, bottom centre, flips the look and writes it
   into the address, so a refresh keeps it but a fresh visit is Mobius. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* Choices remembered by earlier versions are cleared, so they no longer win. */
  try { localStorage.removeItem('mob-skin'); } catch (e) { /* storage blocked */ }

  var skin = (/[?&]skin=(mobius|buckholt)\b/.exec(location.search) || [])[1] || 'mobius';

  /* Keep the address in step: ?skin=buckholt for Buckholt, nothing for Mobius. */
  function toAddress(v) {
    try {
      var u = new URL(location.href);
      if (v === 'buckholt') u.searchParams.set('skin', 'buckholt'); else u.searchParams.delete('skin');
      history.replaceState(history.state, '', u.toString());
    } catch (e) { /* file:// or old browser: the look still changes */ }
  }

  /* Mobius's wordmark is "open gi"; the Buckholt look keeps "Mobius". */
  function apply(v) {
    skin = v;
    if (v === 'mobius') root.setAttribute('data-skin', 'mobius'); else root.removeAttribute('data-skin');
    var logo = document.querySelector('.app-bar-logo');
    if (logo) {
      if (!logo.hasAttribute('data-name')) logo.setAttribute('data-name', logo.textContent);
      logo.textContent = v === 'mobius' ? 'open gi' : logo.getAttribute('data-name');
    }
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
    document.body.appendChild(wrap);
    apply(skin);
    document.getElementById('mob-skin-switch').addEventListener('change', function (e) {
      var v = e.target.checked ? 'mobius' : 'buckholt';
      toAddress(v);
      apply(v);
    });
  });
})();
