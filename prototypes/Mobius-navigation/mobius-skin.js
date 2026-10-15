/* Mobius skin switch (Laurence, 12 October 2026).

   Sets `html[data-skin="mobius"]`, which mobius-skin.css dresses as current
   Mobius; without it the prototype is Buckholt. Loaded in <head> so the
   page is drawn in the right look first time, without a flash.

   The look comes from, in order: `?skin=mobius` or `?skin=buckholt` in the
   address (so a link can open either), then the reviewer's last choice in
   this browser, then the Mobius look (the default, Laurence, 12 October
   2026). A floating Switch, bottom right, flips it. */
(function () {
  'use strict';
  var KEY = 'mob-skin';
  var root = document.documentElement;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private window: not remembered */ } }

  var fromUrl = (/[?&]skin=(mobius|buckholt)\b/.exec(location.search) || [])[1];
  if (fromUrl) store(fromUrl);
  var skin = fromUrl || stored() || 'mobius';

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
      store(v);
      apply(v);
    });
  });
})();
