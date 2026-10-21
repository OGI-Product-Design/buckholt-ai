/* Configuration Hub — app registry and seed data.            NOT BUCKHOLT.

   Data only: every value here comes from `ch-shell-spec.md` ("App registry"
   and "Seed data"). The shell (`ch-shell.js`) reads it; nothing renders it
   directly.

   A CH feature prototype switches its own app on HERE, in one place, rather
   than copying the shell. It does two things, and only for its own app:

     1. sets `basePage` on its registry entry, relative to `prototypes/CH-SHELL/`
        (for example '../Audit-Centre/index.html'), so Open goes to the real
        feature instead of the placeholder page (SH-03-01);
     2. adds its app id to the seed lists it needs, as its spec states.

   Order in `apps` is the registry order, which is the card order. A seed's
   app lists are sets: the shell always renders them in registry order, so a
   hidden app leaves no gap. */
(function () {
  'use strict';

  var apps = [
    {
      id: 'onboarding-form',
      name: 'Onboarding Form',
      description: 'View the business details you shared with us when you joined.',
      illustration: 'Onboarding Form Image - Card.svg',
      basePage: null
    },
    {
      id: 'user-management',
      name: 'User Management',
      description: 'Add and manage your Mobius users and what they can access.',
      illustration: 'User Management Image - Card.svg',
      basePage: null
    },
    {
      id: 'automate',
      name: 'AutoMATE',
      description: 'Build workflows that take care of routine Mobius tasks for you.',
      illustration: 'AutoMATE Image- Card.svg',
      basePage: null
    },
    {
      id: 'third-party-services',
      name: 'Third-Party Services',
      description: 'Connect Mobius to services like email, SMS and payments.',
      illustration: '3rd Party Services Image - Card.svg',
      basePage: null
    },
    {
      id: 'policy-extensions',
      name: 'Policy Extensions',
      description: 'Set how policies can be extended for each scheme.',
      illustration: 'Policy Extension Configuration - Card.svg',
      basePage: null
    },
    {
      id: 'audit-centre',
      name: 'Audit Centre',
      description: 'See what changed in Configuration Hub, when and by whom.',
      illustration: 'Audit Centre - Card.svg',
      basePage: null
    }
  ];

  var DEFAULT_APPS = ['onboarding-form', 'user-management', 'third-party-services'];
  var ALL_APPS = apps.map(function (a) { return a.id; });

  var NORTHGATE_USER = {
    firstName: 'Sophie',
    lastName: 'Marchetti',
    email: 'sophie.marchetti@northgate-insurance.co.uk'
  };

  /* Selected with `?seed=<id>` on any CH page; there is deliberately no UI
     for it. The choice is kept for the rest of the browser tab. */
  var seeds = {
    'northgate': {
      label: 'Northgate (default)',
      organisation: 'Northgate Insurance Services',
      environments: { live: 'NG01', test: 'NG02' },
      user: NORTHGATE_USER,
      apps: { live: DEFAULT_APPS, test: DEFAULT_APPS }
    },
    'long-names': {
      label: 'Long names',
      organisation: 'Abbotsford Kingsley Commercial and Speciality Insurance Brokers',
      environments: { live: 'AK01', test: 'AK02' },
      user: {
        firstName: 'Alexandra',
        lastName: 'Montgomery-Fairweather',
        email: 'alexandra.montgomery-fairweather@abbotsfordkingsley-insurancebrokers.co.uk'
      },
      apps: { live: DEFAULT_APPS, test: DEFAULT_APPS }
    },
    'all-apps': {
      label: 'All apps',
      organisation: 'Northgate Insurance Services',
      environments: { live: 'NG01', test: 'NG02' },
      user: NORTHGATE_USER,
      apps: { live: ALL_APPS, test: ALL_APPS }
    },
    'test-only': {
      label: 'Test only (newly onboarded)',
      organisation: 'Harbourside Underwriting',
      environments: { test: 'HU01' },
      user: {
        firstName: 'Daniel',
        lastName: 'Okafor',
        email: 'daniel.okafor@harbourside-underwriting.co.uk'
      },
      apps: { test: DEFAULT_APPS }
    },
    'staged-rollout': {
      label: 'Staged rollout',
      organisation: 'Northgate Insurance Services',
      environments: { live: 'NG01', test: 'NG02' },
      user: NORTHGATE_USER,
      apps: { live: DEFAULT_APPS, test: DEFAULT_APPS.concat(['automate']) }
    },
    'live-only': {
      label: 'Live only',
      organisation: 'Kestrel Mutual',
      environments: { live: 'KM01' },
      user: {
        firstName: 'Priya',
        lastName: 'Shah',
        email: 'priya.shah@kestrel-mutual.co.uk'
      },
      apps: { live: DEFAULT_APPS }
    }
  };

  window.CHRegistry = {
    apps: apps,
    seeds: seeds,
    defaultSeed: 'northgate'
  };
})();
