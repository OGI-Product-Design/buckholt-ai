/* Audit Centre (CH-AUDIT-UM) — seed data.                  NOT BUCKHOLT.

   Every value comes from `ch-audit-um-spec.md` ("Seed data", "Data model",
   "AU-04 · Patterns"). Dates are offsets from the prototype's current date
   ("today", "today −n"), turned into real dates when the page loads, so the
   default "Last 30 days" filter is populated whenever it is opened.

   Each record stores the affected user as they were at the event (identity
   rules): nothing here is looked up from a current user list.

   `AUData.records(env)` returns the records for one environment, each with:
     n          the spec's record number (Configuration Hub users), or the
                row number (Mobius users, 1-10 in screenshot order, 11-12 added)
     view       'mobius' | 'ch'
     id         Event ID, "evt_" + 8 lowercase letters and digits
     action, summary, accountType (Mobius only)
     affected   { name, email, username, invitee, count, accounts }
     by         { name, type: 'client' | 'ogi' | 'system' }
     when       Date
     details    the AU-04 drawer content (Configuration Hub users only)
     group      links the rows Individual view splits from one saved action */
(function () {
  'use strict';

  var DOMAIN = '@greenlight.co.uk';

  /* ------------------------------------------------------------ people */
  function person(first, last, username) {
    return {
      name: first + ' ' + last,
      first: first,
      last: last,
      email: first.toLowerCase() + '.' + last.toLowerCase() + DOMAIN,
      username: username
    };
  }
  var P = {
    sarah: person('Sarah', 'Brown', 'sbrown'),
    john: person('John', 'Doe', 'jdoe'),
    emilyTailor: person('Emily', 'Tailor', 'etaylor'),
    emilyTaylor: person('Emily', 'Taylor', 'etaylor'),
    priya: person('Priya', 'Shah', 'pshah'),
    tom: person('Tom', 'Walker', 'twalker'),
    laura: person('Laura', 'Chen', 'lchen'),
    lauraWard: person('Laura', 'Chen-Ward', 'lchen'),
    alexandra: person('Alexandra', 'Montgomery-Fitzgerald', 'amontgomeryfitzgerald'),
    marcus: person('Marcus', 'Reid', 'mreid'),
    hannah: person('Hannah', 'Okafor', 'hokafor')
  };
  /* Email can't be edited, so a renamed person keeps their email. */
  P.emilyTailor.email = P.emilyTaylor.email = 'emily.taylor' + DOMAIN;
  P.lauraWard.email = P.laura.email;

  function invitee(local, domain) {
    return { name: null, email: local + (domain || DOMAIN), username: null, invitee: true };
  }

  var BY = {
    sarah: { name: 'Sarah Brown', type: 'client' },
    john: { name: 'John Doe', type: 'client' },
    daniel: { name: 'Daniel Hughes', type: 'ogi' },
    system: { name: 'System', type: 'system' },
    self: function (p) { return { name: p.name, type: 'client' }; }
  };

  /* ------------------------------------------------------------ helpers */
  function at(days, time) {
    var hm = time.split(':');
    var d = new Date();
    d.setHours(Number(hm[0]), Number(hm[1]), 0, 0);
    d.setDate(d.getDate() + days);
    return d;
  }

  /* An invitation link lasts 14 days from when it was sent. */
  function expiry(days) { return at(days + 14, '00:00'); }

  /* Deterministic Event IDs: "evt_" + 8 lowercase letters and digits. */
  function eventId(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    var out = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var j = 0; j < 8; j++) {
      out += chars[h % 36];
      h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
      if (h === 0) h = 1;
    }
    return 'evt_' + out;
  }

  function change(setting, from, to) { return { setting: setting, from: from, to: to }; }

  function accountOf(p, role, status) {
    return {
      name: p.name || null,
      username: p.username || null,
      email: p.email,
      role: role,
      status: status,
      invitee: !!p.invitee
    };
  }

  /* ------------------------------------------------------------ Configuration Hub users (Live) */
  function chRecords() {
    var oliver = invitee('oliver.grant');
    var novak = invitee('k.novak');
    var patel = invitee('a.patel');
    var ross = invitee('m.ross');
    var fraser = invitee('j.fraser');
    var lewis = invitee('r.lewis');
    var christopher = invitee('christopher.hetherington-smythe', '@greenlight-insurance.co.uk');

    function invitation(p, role, days) {
      return { invitation: { email: p.email, role: role, expires: expiry(days) } };
    }
    function created(p, role) {
      return {
        user: [
          ['Username', p.username], ['First name', p.first], ['Last name', p.last],
          ['Email', p.email], ['Role', role], ['Status', 'Active'], ['MFA', 'Set up']
        ]
      };
    }

    var rows = [
      [1, 0, '09:12', 'Invitation sent', oliver, 'Role: Editor', BY.sarah, invitation(oliver, 'Editor', 0)],
      [2, -1, '16:40', 'MFA reset', P.tom, 'MFA reset', BY.john, { changes: [change('MFA', 'Set up', 'Reset')] }],
      [3, -1, '11:05', 'MFA reset', P.sarah, 'MFA reset', BY.self(P.sarah), { changes: [change('MFA', 'Set up', 'Reset')] }],
      [4, -1, '08:45', 'User activated', P.tom, 'Account activated', BY.sarah, { changes: [change('Status', 'Inactive', 'Active')] }],
      [5, -2, '14:22', 'Role changed', P.priya, 'Editor → Administrator', BY.daniel, { changes: [change('Role', 'Editor', 'Administrator')] }],
      [6, -3, '10:30', 'User updated', P.lauraWard, '2 settings changed', BY.sarah, {
        changes: [change('Last name', 'Chen', 'Chen-Ward'), change('Role', 'Viewer', 'Editor')],
        split: [
          { action: 'Name changed', summary: 'Laura Chen → Laura Chen-Ward', changes: [change('Last name', 'Chen', 'Chen-Ward')] },
          { action: 'Role changed', summary: 'Viewer → Editor', changes: [change('Role', 'Viewer', 'Editor')] }
        ]
      }],
      [7, -4, '09:00', 'Invitation resent', novak, 'Invitation resent', BY.john,
        { invitation: { email: novak.email, role: 'Viewer', expires: expiry(-4) }, changes: [change('Status', 'Link expired', 'Pending')] }],
      [8, -5, '02:00', 'Invitation expired', novak, 'Pending → Link expired', BY.system, { changes: [change('Status', 'Pending', 'Link expired')] }],
      [9, -6, '15:45', 'User deleted', null, '4 users deleted', BY.sarah, {
        deleted: [
          accountOf(P.marcus, 'Viewer', 'Active'),
          accountOf(P.hannah, 'Editor', 'Inactive'),
          accountOf(fraser, 'Viewer', 'Link expired'),
          accountOf(lewis, 'Viewer', 'Pending')
        ]
      }],
      [10, -7, '12:10', 'Invitation cancelled', patel, 'Invitation cancelled', BY.john, { invitationDeleted: accountOf(patel, 'Editor', 'Pending') }],
      [11, -8, '08:55', 'Invitation deleted', ross, 'Invitation deleted', BY.sarah, { invitationDeleted: accountOf(ross, 'Viewer', 'Link expired') }],
      [12, -9, '17:20', 'User deactivated', P.tom, 'Account deactivated', BY.john, { changes: [change('Status', 'Active', 'Inactive')] }],
      [13, -10, '13:00', 'Name changed', P.emilyTaylor, 'Emily Tailor → Emily Taylor', BY.john, { changes: [change('Last name', 'Tailor', 'Taylor')] }],
      [14, -11, '10:02', 'User created', P.emilyTailor, 'Invitation accepted', BY.self(P.emilyTailor), created(P.emilyTailor, 'Editor')],
      [15, -12, '09:30', 'Invitation sent', invitee('emily.taylor'), 'Role: Editor', BY.sarah, invitation(invitee('emily.taylor'), 'Editor', -12)],
      [16, -13, '11:15', 'Invitation sent', christopher, 'Role: Viewer', BY.john, invitation(christopher, 'Viewer', -13)],
      [17, -15, '15:30', 'User created', P.priya, 'Invitation accepted', BY.self(P.priya), created(P.priya, 'Editor')],
      [18, -16, '10:00', 'Invitation sent', invitee('priya.shah'), 'Role: Editor', BY.daniel, invitation(invitee('priya.shah'), 'Editor', -16)],
      [19, -19, '09:00', 'Invitation sent', novak, 'Role: Viewer', BY.john, invitation(novak, 'Viewer', -19)],
      [20, -20, '14:05', 'Role changed', P.alexandra, 'Viewer → Editor', BY.sarah, { changes: [change('Role', 'Viewer', 'Editor')] }],
      [21, -25, '16:10', 'User deactivated', P.hannah, 'Account deactivated', BY.daniel, { changes: [change('Status', 'Active', 'Inactive')] }],
      [22, -27, '11:45', 'MFA reset', P.laura, 'MFA reset', BY.daniel, { changes: [change('MFA', 'Set up', 'Reset')] }],
      [23, -40, '10:20', 'User created', P.laura, 'Invitation accepted', BY.self(P.laura), created(P.laura, 'Viewer')],
      [24, -41, '09:10', 'Invitation sent', invitee('laura.chen'), 'Role: Viewer', BY.sarah, invitation(invitee('laura.chen'), 'Viewer', -41)],
      [25, -60, '13:35', 'Role changed', P.tom, 'Editor → Viewer', BY.john, { changes: [change('Role', 'Editor', 'Viewer')] }],
      [26, -95, '09:00', 'Invitation sent', invitee('tom.walker'), 'Role: Editor', BY.john, invitation(invitee('tom.walker'), 'Editor', -95)]
    ];

    return rows.map(function (r) {
      var details = r[7];
      var affected = r[4]
        ? { name: r[4].name || null, email: r[4].email, username: r[4].username || null, invitee: !!r[4].invitee }
        : { count: details.deleted.length, accounts: details.deleted };
      return {
        n: r[0],
        view: 'ch',
        id: eventId('ch-' + r[0]),
        action: r[3],
        affected: affected,
        summary: r[5],
        by: r[6],
        when: at(r[1], r[2]),
        details: details,
        group: 'ch-' + r[0]
      };
    });
  }

  /* ------------------------------------------------------------ Mobius users (Live)
     The ten AU-00-01 rows in screenshot order with their dates rewritten as
     the spec's offsets, then the spec's two added rows. The spec gives no
     times for the added rows; 10:00 and 14:30 are the prototype's. */
  function mobiusRecords() {
    var rows = [
      [0, '09:34', 'Access level changed', 'Jane Smith', 'Advisor → Administrator', 'Tenant', BY.john],
      [0, '08:11', 'Application access changed', 'Peter Wilson', 'Developer Portal: Granted', 'Tenant', BY.sarah],
      [-1, '16:24', 'User deactivated', 'Robert Jones', 'Account deactivated', 'Tenant', BY.john],
      [-3, '11:22', 'Restriction settings changed', 'Jane Smith', '2 settings changed', 'SSO', BY.sarah],
      [-3, '10:44', 'User created', 'Emily Taylor', 'User created', 'SSO', BY.sarah],
      [-24, '13:15', 'User deleted', 'Michael Green', 'User deleted', 'Tenant', BY.john],
      [-24, '18:51', 'User updated', 'Jon Tribigani', '3 settings changed across 2 sections', 'Tenant', BY.john],
      [-24, '17:32', 'User activated', 'Jane Smith', 'Account activated', 'SSO', BY.john],
      [-24, '17:24', 'Application access changed', 'Robert Pattison', 'RemoteApps & Desktops: Removed', 'Tenant', BY.john],
      [-76, '06:59', 'B2B Settings changed', 'James Franco', 'Brand → Krypton', 'Tenant', BY.sarah],
      [-80, '10:00', 'User updated', 'Robert Pattison', '2 settings changed', 'SSO', BY.sarah],
      [-85, '14:30', 'Access level changed', 'Peter Wilson', 'Read Only → Advisor', 'Tenant', BY.daniel]
    ];
    return rows.map(function (r, i) {
      return {
        n: i + 1,
        view: 'mobius',
        id: eventId('mobius-' + (i + 1)),
        action: r[2],
        affected: { name: r[3], email: null, username: null, invitee: false },
        summary: r[4],
        accountType: r[5],
        by: r[6],
        when: at(r[0], r[1]),
        details: null,
        group: 'mobius-' + (i + 1)
      };
    });
  }

  /* ------------------------------------------------------------ per environment
     Live: everything. Test: no Configuration Hub users records (the empty
     state), and the first five Mobius rows only. */
  function records(env) {
    var mobius = mobiusRecords();
    if (env === 'test') return mobius.slice(0, 5);
    return mobius.concat(chRecords());
  }

  /* ------------------------------------------------------------ filter options */
  var ACTIONS = {
    ch: ['Invitation sent', 'Invitation resent', 'Invitation expired', 'Invitation cancelled', 'Invitation deleted',
      'User created', 'Name changed', 'Role changed', 'User activated', 'User deactivated', 'User updated',
      'MFA reset', 'User deleted'],
    /* The spec lists no Mobius action types: the actions in the Mobius seed,
       A to Z (PROTOTYPE.md). */
    mobius: null
  };

  /* Changed by: client users A to Z, an "Open GI" group of Open GI users,
     then "System" — each from the Live seed of that view, so the list
     does not change with the environment. */
  function changedByOptions(view) {
    var list = records('live').filter(function (r) { return r.view === view; });
    var clients = {};
    var ogi = {};
    var system = false;
    list.forEach(function (r) {
      if (r.by.type === 'client') clients[r.by.name] = true;
      else if (r.by.type === 'ogi') ogi[r.by.name] = true;
      else system = true;
    });
    function az(o) { return Object.keys(o).sort(function (a, b) { return a.localeCompare(b); }); }
    return { clients: az(clients), ogi: az(ogi), system: system };
  }

  function actionOptions(view) {
    if (ACTIONS[view]) return ACTIONS[view].slice();
    var seen = {};
    records('live').forEach(function (r) { if (r.view === view) seen[r.action] = true; });
    return Object.keys(seen).sort(function (a, b) { return a.localeCompare(b); });
  }

  window.AUData = {
    records: records,
    actionOptions: actionOptions,
    changedByOptions: changedByOptions,
    accountTypes: ['All', 'Tenant', 'SSO', 'Tenant and SSO'],
    datePresets: [
      { value: '7', label: 'Last 7 days', days: 7 },
      { value: '30', label: 'Last 30 days', days: 30 },
      { value: '90', label: 'Last 90 days', days: 90 },
      { value: '365', label: 'Last 12 months', days: 365 }
    ],
    eventId: eventId
  };
})();
