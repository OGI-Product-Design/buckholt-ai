/* Configuration Hub users — roles, seed data and variants.  NOT BUCKHOLT.

   Data only; every value comes from `ch-users-spec.md` ("Data model",
   "Placeholder roles", "Seed data"). Pages read it through `CUData.build()`.

   The signed-in row is built from the shell's seed user, so the shell's
   "Long names" seed (`?seed=long-names`) replaces Sophie Marchetti with
   Alexandra Montgomery-Fairweather and keeps the other eleven rows, as the
   spec's variant table asks. Users belong to the organisation, not to an
   environment, so Live and Test get the same rows. */
(function () {
  'use strict';

  var ROLES = [
    { name: 'Administrator', description: 'Can use every Configuration Hub app and manage Configuration Hub users.' },
    { name: 'Editor', description: "Can use every Configuration Hub app, but can't manage Configuration Hub users." },
    { name: 'Viewer', description: "Can see every Configuration Hub app, but can't make changes." }
  ];

  var STATUSES = ['Active', 'Pending', 'Inactive'];

  /* Tag variant per status, as Andrej's CU-00-01 frame assigns them, used by
     the card summary and the table alike. "Total" is the card's first tag. */
  var TAG_CLASS = {
    Total: 'tag tag-status tag-status-info',
    Active: 'tag tag-status tag-status-success',
    Inactive: 'tag tag-status tag-status-warning',
    Pending: 'tag'
  };

  /* Mobius users summary: static, for the CU-00-01 card only. There is no
     Mobius users data beyond these counts. */
  var MOBIUS_SUMMARY = { total: 34, Active: 32, Inactive: 2, Pending: 0 };

  /* Rows 2 to 12 of the seed table. Row 1, the signed-in user, is added by
     build(). Dates are ISO strings; pages format them as "d MMM yyyy". */
  var OTHERS = [
    ['James', 'Okonkwo', 'Administrator', 'Active'],
    ['Hannah', 'Clarke', 'Editor', 'Active'],
    ['Tomasz', 'Nowak', 'Editor', 'Active'],
    ['Aisha', 'Rahman', 'Viewer', 'Active'],
    ['Oliver', 'Bennett', 'Viewer', 'Active'],
    ['Chloe', 'Davies', 'Editor', 'Inactive'],
    ['Bartholomew', 'Featherstonehaugh-Whitmore', 'Viewer', 'Active'],
    ['Ravi', 'Patel', 'Editor', 'Active'],
    ['Megan', 'Lewis', 'Viewer', 'Active']
  ];

  var PENDING = [
    { email: 'daniel.reyes@northgate-insurance.co.uk', role: 'Editor', invitedOn: '2026-10-20' },
    { email: 'l.fischer@northgate-insurance.co.uk', role: 'Viewer', invitedOn: '2026-10-24' }
  ];

  /* Selected with `?variant=<id>`; there is deliberately no UI for it, as in
     CH-SHELL. The choice is kept for the rest of the browser tab. */
  var VARIANTS = {
    'default': 'Default',
    'only-me': 'Only me'
  };

  function username(first, last) {
    return (first + '.' + last).toLowerCase().replace(/\s+/g, '-');
  }

  function build(variant, user) {
    var users = [{
      id: 'cu-1',
      self: true,
      email: user.email.toLowerCase(),
      username: username(user.firstName, user.lastName),
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'Administrator',
      status: 'Active',
      invitedOn: null
    }];
    if (variant === 'only-me') return users;

    OTHERS.forEach(function (row, i) {
      var name = username(row[0], row[1]);
      users.push({
        id: 'cu-' + (i + 2),
        self: false,
        email: name + '@northgate-insurance.co.uk',
        username: name,
        firstName: row[0],
        lastName: row[1],
        role: row[2],
        status: row[3],
        invitedOn: null
      });
    });
    PENDING.forEach(function (row, i) {
      users.push({
        id: 'cu-' + (OTHERS.length + i + 2),
        self: false,
        email: row.email,
        username: null,
        firstName: null,
        lastName: null,
        role: row.role,
        status: 'Pending',
        invitedOn: row.invitedOn
      });
    });
    return users;
  }

  window.CUData = {
    roles: ROLES,
    statuses: STATUSES,
    tagClass: TAG_CLASS,
    mobiusSummary: MOBIUS_SUMMARY,
    variants: VARIANTS,
    defaultVariant: 'default',
    build: build
  };
})();
