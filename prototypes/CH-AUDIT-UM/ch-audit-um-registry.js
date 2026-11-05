/* Audit Centre (CH-AUDIT-UM) — the CH-SHELL contract items.   NOT BUCKHOLT.

   Loaded on CH-AUDIT-UM pages only, after `../CH-SHELL/shell/ch-registry.js`
   and before `../CH-SHELL/shell/ch-shell.js`. CH-SHELL's contract says a
   feature switches its own app on by editing `ch-registry.js`; that folder
   is not edited here (the brief), so the same two changes are made to the
   in-memory registry instead, for this prototype's pages only — the
   CH-USERS precedent.

   1. `audit-centre` gets its base page, AU-00-01, relative to
      `prototypes/CH-SHELL/` as the shell expects. Open on the home card and
      an environment switch inside the app both land there.
   2. The spec: "Registry app: Audit Centre, switched on in the default seed
      variants." Every seed, in every environment it has, lists
      `audit-centre`. `all-apps` already does. */
(function () {
  'use strict';

  var R = window.CHRegistry;
  if (!R) throw new Error('ch-audit-um-registry.js needs ch-registry.js loaded first.');

  R.apps.forEach(function (app) {
    if (app.id === 'audit-centre') app.basePage = '../CH-AUDIT-UM/index.html';
  });

  Object.keys(R.seeds).forEach(function (id) {
    var apps = R.seeds[id].apps;
    Object.keys(apps).forEach(function (env) {
      if (apps[env].indexOf('audit-centre') === -1) apps[env] = apps[env].concat(['audit-centre']);
    });
  });
})();
