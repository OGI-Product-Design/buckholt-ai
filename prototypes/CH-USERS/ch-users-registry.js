/* Configuration Hub accounts — the spec's "Shell overrides".   NOT BUCKHOLT.

   Loaded on CH-USERS pages only, after `../CH-SHELL/shell/ch-registry.js`
   and before `../CH-SHELL/shell/ch-shell.js`. It changes the in-memory
   registry for this prototype and nothing else: the CH-SHELL folder is not
   edited, so the shell's own pages still show "User Management" until the
   CH-SHELL spec takes the new name (ch-users-spec.md, "Shell overrides").

   - App registry, order 2: name "Account Management", the revision 3
     description, and CU-00-01 as the base page. `basePage` is relative to
     `prototypes/CH-SHELL/`, as the shell's registry expects, so Open and an
     environment switch inside the app both land on CU-00-01.
   - The single-crumb base page is not a registry value; each page passes its
     own trail to `CHShell.init()`.

   Every default seed already lists `user-management`, so no seed list
   changes. The illustration keeps its supplied file name. */
(function () {
  'use strict';

  var R = window.CHRegistry;
  if (!R) throw new Error('ch-users-registry.js needs ch-registry.js loaded first.');

  R.apps.forEach(function (app) {
    if (app.id !== 'user-management') return;
    app.name = 'Account Management';
    app.description = 'Add and manage your Mobius and Configuration Hub accounts.';
    app.basePage = '../CH-USERS/index.html';
  });
})();
