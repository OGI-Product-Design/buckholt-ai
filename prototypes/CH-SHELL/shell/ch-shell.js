/* Configuration Hub shell — `CHShell`.                         NOT BUCKHOLT.

   The global CH frame from `ch-shell-spec.md`: skip link, top bar (lockup,
   organisation and environment, Mobius link, avatar menu), the Test alert,
   the breadcrumb band, focus-on-navigation, announcements and the
   unsaved-changes confirmation. Every CH page loads this file; no CH page
   copies the chrome. See `prototypes/CH-SHELL/PROTOTYPE.md`, "How the shell
   is shared".

   A page provides only its landmarks and calls `CHShell.init()`:

     <div class="layout" data-layout="layout-03" data-layout-surface="flush">
       <header id="ch-header"></header>
       <main id="main">
         <div id="ch-context"></div>          Test alert + breadcrumb band
         <section class="page-body">…</section>
       </main>
     </div>

     CHShell.init({
       app: 'user-management',                     registry id; omit on the home page
       page: 'Users',                              document-title part; omit on a base page
       breadcrumb: [{ label: 'User Management', href: 'index.html' }, { label: 'Users' }],
       hasUnsavedChanges: function () { … }        optional; or CHShell.setUnsavedChanges(true)
     });

   Everything is drawn with Buckholt components (Response button, Tag,
   Alert, Link, Avatar, Menu button / Menu, Breadcrumb, Tooltip, Modal).
   The arrangement around them is application chrome Buckholt does not
   document — the eight "Buckholt gaps" in the spec — and lives in
   `ch-shell.css`. */
(function () {
  'use strict';

  var R = window.CHRegistry;
  if (!R) throw new Error('ch-shell.js needs ch-registry.js loaded first.');

  /* Every URL is resolved from this script's own location, so a feature
     prototype anywhere under prototypes/ can load the shell by relative path. */
  var SHELL_ROOT = new URL('../', document.currentScript.src);
  var ASSETS = new URL('assets/', SHELL_ROOT);
  var HOME_URL = new URL('index.html', SHELL_ROOT).href;
  var PLACEHOLDER_URL = new URL('app.html', SHELL_ROOT).href;
  var LOCKUP = 'Navigation - Logo and navigation items.svg';

  var KEY_SEED = 'chshell.seed';
  var KEY_ENV = 'chshell.env';
  var KEY_FLASH = 'chshell.flash';

  var ENV_NAMES = { live: 'Live', test: 'Test' };
  var ENV_ORDER = ['live', 'test'];
  var ALERT_TEXT = "You're in your Test environment. Changes here won't affect Live.";

  /* Tooltip options exactly as Tooltip's Code & specs example 3. */
  var TOOLTIP_OPTIONS = { offset: [0, 4], delay: { show: 800, hide: 100 } };

  var state = {
    seedId: null,
    seed: null,
    env: null,
    app: null,
    options: {},
    unsaved: false,
    listeners: [],
    pendingEnv: null,
    returnFocusToToggle: false
  };

  /* ------------------------------------------------------------ storage
     sessionStorage is per browser tab: the environment survives page
     navigation in this tab and into feature prototypes, and a new tab starts
     from the seed rule (spec, "Prototype notes" → State). */
  function storeGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* in-memory only */ }
  }
  function storeRemove(key) {
    try { window.sessionStorage.removeItem(key); } catch (e) { /* nothing to remove */ }
  }
  function parse(json) {
    try { return JSON.parse(json); } catch (e) { return null; }
  }

  function resolveSeed() {
    var param = new URLSearchParams(window.location.search).get('seed');
    if (param && R.seeds[param]) {
      storeSet(KEY_SEED, param);
      return param;
    }
    var saved = storeGet(KEY_SEED);
    return saved && R.seeds[saved] ? saved : R.defaultSeed;
  }

  function seedRuleEnv(seed) {
    /* "On first load the current environment is Live if it exists,
       otherwise Test." */
    return seed.environments.live ? 'live' : 'test';
  }

  function resolveEnv() {
    var saved = parse(storeGet(KEY_ENV));
    if (saved && saved.seed === state.seedId && state.seed.environments[saved.env]) {
      return saved.env;
    }
    return seedRuleEnv(state.seed);
  }

  function saveEnv() {
    storeSet(KEY_ENV, JSON.stringify({ seed: state.seedId, env: state.env }));
  }

  /* A flash survives exactly one navigation: what to announce and whether to
     move focus to the new page's level 1 heading. */
  function setFlash(flash) {
    storeSet(KEY_FLASH, JSON.stringify(flash));
  }
  function takeFlash() {
    var flash = parse(storeGet(KEY_FLASH));
    storeRemove(KEY_FLASH);
    return flash;
  }

  /* ------------------------------------------------------------ data */
  function appById(id) {
    for (var i = 0; i < R.apps.length; i++) if (R.apps[i].id === id) return R.apps[i];
    return null;
  }

  function availableEnvironments() {
    return ENV_ORDER.filter(function (env) { return !!state.seed.environments[env]; });
  }

  function visibleApps(env) {
    var ids = (state.seed.apps[env || state.env]) || [];
    return R.apps.filter(function (app) { return ids.indexOf(app.id) !== -1; });
  }

  function isVisible(appId, env) {
    return visibleApps(env).some(function (app) { return app.id === appId; });
  }

  function appUrl(app) {
    if (app.basePage) return new URL(app.basePage, SHELL_ROOT).href;
    return PLACEHOLDER_URL + '?app=' + encodeURIComponent(app.id);
  }

  function illustrationUrl(app) {
    return new URL(app.illustration, ASSETS).href;
  }

  function initials(user) {
    var first = (user.firstName || '').trim();
    var last = (user.lastName || '').trim();
    if (first && last) return (first[0] + last[0]).toUpperCase();
    /* Fallback when a name part is missing: first two letters of the email
       local part. [Assumption] in the spec. */
    return (user.email || '').split('@')[0].slice(0, 2).toUpperCase();
  }

  function fullName(user) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ------------------------------------------------------------ rendering */
  function renderSkipLink() {
    /* Gap 7. First focusable element on the page. */
    var link = document.createElement('a');
    link.className = 'visually-hidden-focusable ch-skip-link';
    link.href = '#main';
    link.textContent = 'Skip to main content';
    link.addEventListener('click', function (event) {
      var main = document.getElementById('main');
      if (!main) return;
      event.preventDefault();
      main.focus();
    });
    document.body.insertBefore(link, document.body.firstChild);
  }

  function environmentControl() {
    var envs = availableEnvironments();
    if (envs.length === 1) {
      /* SH-00-03: one environment. Buckholt Tag, read-only, not focusable. */
      return '<span class="tag ch-env-tag" id="ch-env-tag">' +
               '<span class="tag-label">' + ENV_NAMES[envs[0]] + '</span>' +
             '</span>';
    }
    /* Gap 2. Buckholt Response button, single-select (native radios), in a
       compact segmented pill. role="radiogroup" + aria-label names the group:
       the header has no room for Response button's visible `.input-label`. */
    return '<div class="response response-btn-input ch-env" role="radiogroup" aria-label="Environment">' +
      envs.map(function (env) {
        return '<input type="radio" class="btn-check" name="ch-environment" id="ch-env-' + env + '" value="' + env + '"' +
                 (env === state.env ? ' checked' : '') + '>' +
               '<label class="btn btn-response" for="ch-env-' + env + '">' + ENV_NAMES[env] + '</label>';
      }).join('') +
    '</div>';
  }

  function renderHeader() {
    var header = document.getElementById('ch-header');
    if (!header) throw new Error('CHShell: the page needs <header id="ch-header">.');
    var user = state.seed.user;
    var name = fullName(user);
    var ini = esc(initials(user));

    header.classList.add('ch-bar');
    header.innerHTML =
      /* Gap 1: lockup as one link home. The SVG's text is outlined, so the
         accessible name comes from the link and the image is decorative. */
      '<a class="ch-lockup" href="' + HOME_URL + '" aria-label="Configuration Hub home" data-ch-nav>' +
        '<img src="' + new URL(LOCKUP, ASSETS).href + '" alt="" width="238" height="30">' +
      '</a>' +

      /* Gap 8: reserved, empty. A feature spec fills it (AutoMATE's
         "Workflows"); it will be its own navigation landmark when it does. */
      '<div class="ch-app-nav" id="ch-app-nav"></div>' +

      '<div class="ch-bar-end">' +
        '<div class="ch-tenant">' +
          '<span class="ch-org" id="ch-org">' + esc(state.seed.organisation) + '</span>' +
          environmentControl() +
        '</div>' +

        /* Buckholt standalone Link with the External link common action
           icon. Inert in the prototype. */
        '<a class="link-standalone ch-mobius" id="ch-mobius" href="#" target="_blank" rel="noopener" ' +
           'aria-label="Mobius (opens in a new tab)" data-ch-inert>' +
          '<span class="icon">' +
            '<i class="fa-regular fa-arrow-up-right-from-square" aria-hidden="true"></i>' +
          '</span>' +
          'Mobius' +
        '</a>' +

        /* Buckholt Menu button composition. The Tooltip sits on the `.menu`
           wrapper, not on the toggle, because the toggle already carries
           data-bs-toggle="dropdown" — the same split Breadcrumb's documented
           overflow example uses. Gap 4: the identity header. */
        '<div class="menu ch-account" id="ch-account" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Account menu">' +
          '<button type="button" class="menu-toggle ch-account-toggle" id="ch-account-toggle" ' +
                  'data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account menu for ' + esc(name) + '">' +
            '<div class="avatar avatar-sm" aria-hidden="true">' +
              '<div class="avatar-initials">' + ini + '</div>' +
            '</div>' +
          '</button>' +
          '<div class="menu-panel dropdown-menu dropdown-menu-end ch-account-panel" id="ch-account-panel">' +
            '<div class="ch-identity">' +
              '<div class="avatar avatar-sm" aria-hidden="true">' +
                '<div class="avatar-initials">' + ini + '</div>' +
              '</div>' +
              '<div class="ch-identity-text">' +
                '<p class="title-01 ch-identity-name">' + esc(name) + '</p>' +
                '<p class="body-01 ch-identity-email">' + esc(user.email) + '</p>' +
              '</div>' +
            '</div>' +
            '<ul class="menu-body" role="menu" aria-label="Account">' +
              '<li role="none">' +
                '<hr class="menu-divider">' +
              '</li>' +
              '<li role="none">' +
                /* The Logout common action: label and icon as Buckholt fixes them. */
                '<button class="menu-item" type="button" role="menuitem" id="ch-logout">' +
                  '<i class="fa-regular fa-arrow-right-from-bracket" aria-hidden="true"></i>Logout' +
                '</button>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function alertMarkup() {
    /* Gap 3. Buckholt Alert, info status, no close control. `role="alert"`
       from the canonical example is left off on purpose: the alert is a
       persistent indicator, it must not be announced on page load, and the
       environment change already has its own polite announcement (SH-01
       step 5). Recorded in PROTOTYPE.md and SPEC-CHANGES.md section C. */
    return '<div class="alert alert-info ch-env-alert" id="ch-env-alert">' +
             '<div class="alert-content">' +
               '<span class="alert-icon">' +
                 '<i class="fa-solid fa-circle-info" aria-hidden="true"></i>' +
               '</span>' +
               '<div class="alert-body">' +
                 '<div class="alert-message">' +
                   '<h6>' + esc(ALERT_TEXT) + '</h6>' +
                 '</div>' +
               '</div>' +
             '</div>' +
           '</div>';
  }

  function breadcrumbMarkup(trail) {
    var items = trail.map(function (crumb, i) {
      var last = i === trail.length - 1;
      if (last) {
        /* `.ch-crumb-text` wraps the current page's text so Gap 5's
           truncation can be applied without clipping the generated divider. */
        return '<li class="breadcrumb-item active" aria-current="page">' +
                 '<span class="ch-crumb-text">' + esc(crumb.label) + '</span>' +
               '</li>';
      }
      return '<li class="breadcrumb-item">' +
               '<a class="breadcrumb-link" href="' + esc(crumb.href) + '" data-ch-nav>' + esc(crumb.label) + '</a>' +
             '</li>';
    }).join('');
    /* The divider is set with the inline custom property Breadcrumb's Code &
       specs documents; Figma draws a chevron. */
    return '<nav style="--breadcrumb-divider-icon: \'>\';" aria-label="Breadcrumb">' +
             '<ol class="breadcrumb">' + items + '</ol>' +
           '</nav>';
  }

  function renderContext() {
    var context = document.getElementById('ch-context');
    if (!context) throw new Error('CHShell: the page needs <div id="ch-context"> as the first child of <main>.');
    context.classList.add('ch-context');
    context.innerHTML =
      '<div class="ch-alert-slot" id="ch-alert-slot"></div>' +
      '<div class="ch-crumbs">' + breadcrumbMarkup(state.options.breadcrumb || []) + '</div>';
    renderAlert();
  }

  function renderAlert() {
    var slot = document.getElementById('ch-alert-slot');
    if (!slot) return;
    slot.innerHTML = state.env === 'test' ? alertMarkup() : '';
  }

  function renderAnnouncer() {
    var region = document.createElement('div');
    region.id = 'ch-announcer';
    region.className = 'visually-hidden';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }

  function renderModal() {
    /* Buckholt Modal, Code & specs example 1. The heading is an h2 rather
       than the example's h3 because it is the dialog's top-level heading;
       aria-labelledby is an application addition. Actions right-aligned,
       Primary last (Secondary "Stay on this page"). */
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="modal fade" id="ch-env-modal" tabindex="-1" aria-labelledby="ch-env-modal-title">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<div class="text-block">' +
                '<div class="heading">' +
                  '<div class="heading-content">' +
                    '<h2 class="headline-02" id="ch-env-modal-title"></h2>' +
                  '</div>' +
                  '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="modal-body">' +
              '<div class="text-block">' +
                '<p>You have unsaved changes on this page. If you switch now, they’ll be lost.</p>' +
              '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<div class="button-set">' +
                '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="ch-env-modal-stay">' +
                  '<span class="button-label">Stay on this page</span>' +
                '</button>' +
                '<button type="button" class="btn btn-primary" id="ch-env-modal-switch">' +
                  '<span class="button-label"></span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap.firstChild);
  }

  function updateTitle() {
    var parts = [state.options.page, state.app && state.app.name, 'Configuration Hub'].filter(Boolean);
    document.title = (state.env === 'test' ? '[Test] ' : '') + parts.join(' | ');
  }

  /* ------------------------------------------------------------ tooltips */
  /* Created from script rather than with data-bs-toggle="tooltip": Buckholt
     restyles `a[data-bs-toggle=tooltip]` (inherited colour, dotted
     underline), which would make a truncated breadcrumb link look different
     from its neighbours. Placed below, because everything that truncates sits
     at the top of the page. */
  function addTooltip(el, title) {
    if (!window.bootstrap) return;
    el.setAttribute('data-bs-title', title);
    var existing = bootstrap.Tooltip.getInstance(el);
    if (existing) existing.dispose();
    new bootstrap.Tooltip(el, Object.assign({ title: title, placement: 'bottom' }, TOOLTIP_OPTIONS));
  }

  function removeTooltip(el) {
    if (window.bootstrap) {
      var existing = bootstrap.Tooltip.getInstance(el);
      if (existing) existing.dispose();
    }
    el.removeAttribute('data-bs-title');
  }

  /* Organisation name and long crumbs (Gap 5) truncate with CSS. When the
     text is actually cut, it gets the full text in a Tooltip and, if it is
     not already focusable, a tab stop so the Tooltip is reachable by
     keyboard. The full text is always in the DOM, so assistive technology
     always reads all of it. */
  function syncTruncation(el, focusable) {
    var full = el.textContent;
    var cut = el.scrollWidth > el.clientWidth + 1;
    if (cut) {
      if (el.getAttribute('data-bs-title') !== full) addTooltip(el, full);
      if (!focusable) el.setAttribute('tabindex', '0');
      el.classList.add('ch-truncated');
    } else if (el.classList.contains('ch-truncated')) {
      removeTooltip(el);
      if (!focusable) el.removeAttribute('tabindex');
      el.classList.remove('ch-truncated');
    }
  }

  function syncAllTruncation() {
    var org = document.getElementById('ch-org');
    if (org) syncTruncation(org, false);
    document.querySelectorAll('#ch-context .breadcrumb-link').forEach(function (el) { syncTruncation(el, true); });
    document.querySelectorAll('#ch-context .ch-crumb-text').forEach(function (el) { syncTruncation(el, false); });
  }

  /* ------------------------------------------------------------ announcements */
  function announce(message) {
    var region = document.getElementById('ch-announcer');
    if (!region) return;
    region.textContent = '';
    window.setTimeout(function () { region.textContent = message; }, 100);
  }

  function focusHeading() {
    var heading = document.querySelector('main h1');
    if (!heading) return;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  /* ------------------------------------------------------------ environment */
  function setRadio(env) {
    var radio = document.getElementById('ch-env-' + env);
    if (radio) radio.checked = true;
  }

  function hasUnsavedChanges() {
    if (typeof state.options.hasUnsavedChanges === 'function' && state.options.hasUnsavedChanges()) return true;
    return state.unsaved;
  }

  function baseUrl(app) {
    return appUrl(app);
  }

  function switchTo(env) {
    var name = ENV_NAMES[env];
    var message = name + ' environment selected.';
    state.env = env;
    saveEnv();

    if (!state.app) {
      /* Home: stay; alert, title and cards update; focus stays on the option. */
      setRadio(env);
      renderAlert();
      updateTitle();
      state.listeners.forEach(function (fn) { fn(env); });
      announce(message);
      return;
    }

    /* Inside an app: the app's base page in the new environment, from a fresh
       load, so filters, search, drawers and selections reset. If the app is
       not in the new environment, the home page instead (SH-01 step 7). */
    state.unsaved = false;
    if (!isVisible(state.app.id, env)) {
      setFlash({ announce: message + ' ' + state.app.name + ' isn’t available in ' + name + '.', focusHeading: true });
      window.location.assign(HOME_URL);
      return;
    }
    setFlash({ announce: message, focusHeading: true });
    window.location.assign(baseUrl(state.app));
  }

  function openUnsavedModal(env) {
    var name = ENV_NAMES[env];
    state.pendingEnv = env;
    document.getElementById('ch-env-modal-title').textContent = 'Switch to ' + name + ' without saving?';
    document.querySelector('#ch-env-modal-switch .button-label').textContent = 'Switch to ' + name;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('ch-env-modal')).show();
  }

  function wireEnvironment() {
    var group = document.querySelector('#ch-header .ch-env');
    if (!group) return;
    group.addEventListener('change', function (event) {
      var next = event.target.value;
      if (!next || next === state.env) return;
      if (hasUnsavedChanges()) {
        /* Keep the current environment selected until the user confirms. */
        setRadio(state.env);
        openUnsavedModal(next);
        return;
      }
      switchTo(next);
    });

    var modalEl = document.getElementById('ch-env-modal');
    var confirmed = false;
    document.getElementById('ch-env-modal-switch').addEventListener('click', function () {
      confirmed = true;
      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
    modalEl.addEventListener('hidden.bs.modal', function () {
      var env = state.pendingEnv;
      state.pendingEnv = null;
      if (confirmed && env) {
        confirmed = false;
        switchTo(env);
        return;
      }
      /* Stay, Escape or the close control: keep the environment and return
         focus to the previously selected option. */
      var current = document.getElementById('ch-env-' + state.env);
      if (current) current.focus();
    });
  }

  /* ------------------------------------------------------------ avatar menu */
  function wireAccountMenu() {
    var account = document.getElementById('ch-account');
    var toggle = document.getElementById('ch-account-toggle');
    var panel = document.getElementById('ch-account-panel');
    if (!account || !toggle || !panel || !window.bootstrap) return;

    var tooltip = new bootstrap.Tooltip(account, Object.assign({ title: 'Account menu' }, TOOLTIP_OPTIONS));
    var dropdown = bootstrap.Dropdown.getOrCreateInstance(toggle);

    function items() {
      return Array.prototype.slice.call(panel.querySelectorAll('.menu-item:not(:disabled)'));
    }

    toggle.addEventListener('show.bs.dropdown', function () { tooltip.hide(); });
    toggle.addEventListener('shown.bs.dropdown', function () {
      /* Enter, Space or Down Arrow opens the menu and moves focus to Logout. */
      var first = items()[0];
      if (first) first.focus();
    });
    toggle.addEventListener('hidden.bs.dropdown', function () {
      if (state.returnFocusToToggle) {
        state.returnFocusToToggle = false;
        toggle.focus();
        /* The Tooltip would otherwise open on that programmatic focus. */
        tooltip.hide();
      }
    });

    /* Bootstrap 5.1.3 moves between `.dropdown-item`s only; Buckholt's items
       are `.menu-item`, so arrow keys are handled here. They move only
       between items — the identity header is not an item. Bootstrap's own
       key handler is delegated from `document` in the capture phase and stops
       propagation, so this listens on `window`, which captures first. */
    window.addEventListener('keydown', function (event) {
      if (!panel.contains(event.target) || !panel.classList.contains('show')) return;
      var list = items();
      var index = list.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!list.length) return;
        var step = event.key === 'ArrowDown' ? 1 : -1;
        list[(index + step + list.length) % list.length].focus();
      } else if (event.key === 'Escape') {
        state.returnFocusToToggle = true;
      }
    }, true);

    /* Tab out closes the menu (Bootstrap only does this on keyup). */
    account.addEventListener('focusout', function (event) {
      if (!panel.classList.contains('show')) return;
      if (event.relatedTarget && !account.contains(event.relatedTarget)) dropdown.hide();
    });

    /* Logout is inert: activating it closes the menu and does nothing else. */
    document.getElementById('ch-logout').addEventListener('click', function () {
      state.returnFocusToToggle = true;
      dropdown.hide();
    });
  }

  /* ------------------------------------------------------------ links */
  function wireLinks() {
    document.addEventListener('click', function (event) {
      var inert = event.target.closest('[data-ch-inert]');
      if (inert) {
        event.preventDefault();
        return;
      }
      var nav = event.target.closest('[data-ch-nav]');
      if (nav && !event.defaultPrevented && event.button === 0 &&
          !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        /* Focus moves to the next page's level 1 heading (SH-03, "Focus on
           navigation"). */
        setFlash({ focusHeading: true });
      }
    });
  }

  /* ------------------------------------------------------------ init */
  function init(options) {
    state.options = options || {};
    state.seedId = resolveSeed();
    state.seed = R.seeds[state.seedId];
    state.env = resolveEnv();
    saveEnv();

    state.app = state.options.app ? appById(state.options.app) : null;
    if (state.options.app && (!state.app || !isVisible(state.app.id, state.env))) {
      /* An app that does not exist, or is not visible in this environment,
         has no page to show. */
      window.location.replace(HOME_URL);
      return false;
    }

    var main = document.getElementById('main');
    if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');

    renderSkipLink();
    renderHeader();
    renderContext();
    renderAnnouncer();
    renderModal();
    updateTitle();

    wireEnvironment();
    wireAccountMenu();
    wireLinks();

    syncAllTruncation();
    var frame = null;
    window.addEventListener('resize', function () {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncAllTruncation);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncAllTruncation);

    /* Back/forward cache: a page restored from history may show an
       environment this tab has since left. */
    window.addEventListener('pageshow', function (event) {
      if (!event.persisted) return;
      var saved = parse(storeGet(KEY_ENV));
      if (saved && saved.env !== state.env) window.location.reload();
    });

    var flash = takeFlash();
    if (flash) {
      if (flash.focusHeading) focusHeading();
      if (flash.announce) announce(flash.announce);
    }
    return true;
  }

  window.CHShell = {
    init: init,
    get environment() { return state.env; },
    environmentName: function (env) { return ENV_NAMES[env || state.env]; },
    get seedId() { return state.seedId; },
    seed: function () { return state.seed; },
    app: function () { return state.app; },
    appById: appById,
    visibleApps: visibleApps,
    appUrl: appUrl,
    illustrationUrl: illustrationUrl,
    homeUrl: HOME_URL,
    onEnvironmentChange: function (fn) { state.listeners.push(fn); },
    setUnsavedChanges: function (value) { state.unsaved = !!value; },
    announce: announce,
    esc: esc
  };
})();
