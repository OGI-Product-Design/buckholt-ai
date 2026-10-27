/* Configuration Hub users — the spec's "Shell overrides".     NOT BUCKHOLT.

   Loaded on CH-USERS pages only, after `../CH-SHELL/shell/ch-registry.js`
   and before `../CH-SHELL/shell/ch-shell.js`. It changes the in-memory
   registry for this prototype and nothing else: the CH-SHELL folder is not
   edited, so the shell's own pages keep the old description and the
   placeholder page until the CH-SHELL spec takes the new description
   (ch-users-spec.md, "Shell overrides").

   - App registry, order 2: the name stays "User Management" (revision 4
     reverted revision 3's rename). The description is the
     revision 4 one, and the base page is CU-00-01. `basePage` is relative to
     `prototypes/CH-SHELL/`, as the shell's registry expects, so Open and an
     environment switch inside the app both land on CU-00-01.
   - The single-crumb base page is not a registry value; each page passes its
     own trail to `CHShell.init()`.

   Every default seed already lists `user-management`, so no seed list
   changes. */
(function () {
  'use strict';

  var R = window.CHRegistry;
  if (!R) throw new Error('ch-users-registry.js needs ch-registry.js loaded first.');

  R.apps.forEach(function (app) {
    if (app.id !== 'user-management') return;
    app.description = 'Add and manage your Mobius and Configuration Hub users.';
    app.basePage = '../CH-USERS/index.html';
  });
})();
