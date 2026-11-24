/* BrokerHub login prototype — behaviour.
   Not Buckholt; see PROTOTYPE.md. Synthetic demo: no request is made,
   nothing is stored and no email is sent (spec §1, SRC-01, REV04).
   Every state lives in memory; refreshing returns to SCR-01 default. */
(function () {
  'use strict';

  // ---- Demo data (spec §7). Fictional and configurable here only. Never shown on screen.
  var DEMO_ACCOUNT = {
    email: 'alex.morgan@brokerage.example',
    password: 'BrokerHub-demo-1'
  };

  var MESSAGES = {
    emailEmpty: 'Enter your work email address',
    emailFormat: 'Enter an email address in the correct format, like name@brokerage.co.uk',
    passwordEmpty: 'Enter your password'
  };

  // Q5 open: trim surrounding spaces and ignore case (assumption).
  function normaliseEmail(value) { return value.trim().toLowerCase(); }
  function isEmailFormat(value) { return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim()); }

  var screens = {};
  document.querySelectorAll('[data-screen]').forEach(function (el) {
    screens[el.getAttribute('data-screen')] = el;
  });
  var current = 'SCR-01';
  var baseTitle = '';

  var signinForm = document.getElementById('signin-form');
  var signinEmail = document.getElementById('signin-email');
  var signinPassword = document.getElementById('signin-password');
  var toggle = document.getElementById('signin-password-toggle');
  var resetForm = document.getElementById('reset-form');
  var resetEmail = document.getElementById('reset-email');

  // ---- Field state -------------------------------------------------------

  function hintIdFor(input) {
    return input.id === 'signin-email' ? 'signin-email-hint' : null;
  }

  function setFieldError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    var hint = hintIdFor(input);
    if (message) {
      errorEl.textContent = message;
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', (hint ? hint + ' ' : '') + errorEl.id);
    } else {
      errorEl.textContent = '';
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      if (hint) { input.setAttribute('aria-describedby', hint); } else { input.removeAttribute('aria-describedby'); }
    }
  }

  function clearAlert(slotId) {
    document.getElementById(slotId).innerHTML = '';
  }

  function showAlert(slotId, templateId) {
    var slot = document.getElementById(slotId);
    slot.innerHTML = '';
    var node = document.getElementById(templateId).content.firstElementChild.cloneNode(true);
    slot.appendChild(node);
    return node;
  }

  function showErrorSummary(slotId, errors) {
    var alert = showAlert(slotId, 'tpl-error-summary');
    var list = alert.querySelector('[data-error-list]');
    errors.forEach(function (e) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + e.input.id;
      a.textContent = e.message;
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        e.input.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    setTitle(true);
    alert.focus();
  }

  // ---- Screens -----------------------------------------------------------

  function setTitle(isError) {
    document.title = (isError ? 'Error: ' : '') + baseTitle;
  }

  function show(id, opts) {
    opts = opts || {};
    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== id; });
    current = id;
    baseTitle = screens[id].getAttribute('data-title');
    setTitle(false);
    if (opts.focus !== false) {
      // Reproduce page-load behaviour for an in-page screen change: focus the h1.
      var h1 = screens[id].querySelector('h1');
      if (h1) { h1.focus(); }
    }
  }

  function resetSignin() {
    signinForm.reset();
    setFieldError(signinEmail, null);
    setFieldError(signinPassword, null);
    clearAlert('signin-alert-slot');
    setPasswordVisible(false);
  }

  function resetRecovery() {
    resetForm.reset();
    setFieldError(resetEmail, null);
    clearAlert('reset-alert-slot');
  }

  function go(target) {
    if (target === 'SCR-01') { resetSignin(); }   // "SCR-01 default": fields empty
    if (target === 'SCR-02') { resetRecovery(); } // Q9 open: field starts empty
    show(target);
  }

  document.addEventListener('click', function (ev) {
    var trigger = ev.target.closest('[data-go]');
    if (!trigger) { return; }
    ev.preventDefault();
    go(trigger.getAttribute('data-go'));
  });

  // ---- Show / hide password ---------------------------------------------

  function setPasswordVisible(visible) {
    signinPassword.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    toggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    var icon = toggle.querySelector('i');
    icon.className = visible ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  }

  toggle.addEventListener('click', function () {
    setPasswordVisible(signinPassword.type === 'password');
  });

  // ---- SCR-01 submit -----------------------------------------------------

  function emailError(value) {
    if (!value.trim()) { return MESSAGES.emailEmpty; }
    if (!isEmailFormat(value)) { return MESSAGES.emailFormat; }
    return null;
  }

  signinForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var errors = [];
    var eErr = emailError(signinEmail.value);
    var pErr = signinPassword.value ? null : MESSAGES.passwordEmpty;
    setFieldError(signinEmail, eErr);
    setFieldError(signinPassword, pErr);
    if (eErr) { errors.push({ input: signinEmail, message: eErr }); }
    if (pErr) { errors.push({ input: signinPassword, message: pErr }); }

    if (errors.length) {
      showErrorSummary('signin-alert-slot', errors);
      return;
    }

    var matches = normaliseEmail(signinEmail.value) === normaliseEmail(DEMO_ACCOUNT.email) &&
                  signinPassword.value === DEMO_ACCOUNT.password;
    if (matches) {
      show('SCR-04');
      return;
    }

    // Unsuccessful (D2, D7): one message for every cause, neither field invalid,
    // email kept, password cleared, focus to the Alert.
    signinPassword.value = '';
    setPasswordVisible(false);
    // The "Error: " title prefix is specified for validation errors only (§5), so not added here.
    var alert = showAlert('signin-alert-slot', 'tpl-signin-failure');
    setTitle(false);
    alert.focus();
  });

  // ---- SCR-02 submit -----------------------------------------------------

  resetForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var err = emailError(resetEmail.value);
    setFieldError(resetEmail, err);
    if (err) {
      showErrorSummary('reset-alert-slot', [{ input: resetEmail, message: err }]);
      return;
    }
    // Any valid address goes to SCR-03. No request is made.
    document.getElementById('confirm-address').textContent = resetEmail.value.trim();
    show('SCR-03');
  });

  // ---- SCR-04 restart ----------------------------------------------------

  document.getElementById('restart-demo').addEventListener('click', function () {
    resetSignin();
    resetRecovery();
    document.getElementById('confirm-address').textContent = '';
    show('SCR-01');
  });

  // ---- Load: SCR-01 default, focus at page start (behaviour matrix row 1).
  show('SCR-01', { focus: false });
})();
