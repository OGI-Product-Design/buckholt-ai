/* ============================================================================
   Mobius navigation prototype — what each level's menu and heading contain
   ============================================================================

   A direct port of the menu definitions in `reference/mobius-live-policy.html`:
   GROUPS, policyNav, A, policyActions, policyFlows, CLIENT_NAV, CA, APP_ACTIONS,
   CONFIRMS and TITLES. The rules they encode are unchanged:

   - Navigation is pages. Each level's menu only shows that level's pages.
   - Menu actions only happen in place: a side panel (`panel`) or a
     confirmation (`confirm`).
   - Actions that open a page (`flow`) sit in the page heading, never in a
     menu. That includes "Create new client", which the reference prototype
     listed in the app-level menu; it is in the Search results heading.
   - Page and card actions stay on the page next to what they affect.

   Labels use the fixtures convention: [[text]] marks a terminology change
   (the prototype's hl()).

   Icons are Font Awesome classes. Where the Buckholt icon catalogue
   (foundations/iconography/catalogue.md) has a matching entry it is used as
   documented; the few it has no entry for are marked GAP and listed in
   PROTOTYPE.md.
   ============================================================================ */
(function (global) {
  'use strict';

  var ICON = {
    home: 'fa-regular fa-house',                       // Home
    dashboard: 'fa-regular fa-grid-2',                 // Dashboard
    search: 'fa-regular fa-magnifying-glass',          // Search
    user: 'fa-regular fa-user',                        // User
    client: 'fa-regular fa-user',                      // User
    motor: 'fa-regular fa-car',                        // Car
    policies: 'fa-regular fa-shield',                  // Shield
    business: 'fa-regular fa-briefcase',               // GAP
    policy: 'fa-regular fa-file-lines',                // Document
    quote: 'fa-regular fa-calculator',                 // Calculator
    money: 'fa-regular fa-sterling-sign',              // Pound
    correspondence: 'fa-regular fa-envelope',          // Email
    info: 'fa-regular fa-circle-info',                 // Info
    activity: 'fa-regular fa-wave-pulse',              // GAP
    flag: 'fa-regular fa-flag',                        // Flag
    checks: 'fa-regular fa-shield-check',              // Shield-check
    edit: 'fa-regular fa-pencil',                      // Edit (common action)
    swap: 'fa-regular fa-swap-arrows',                 // Change
    time: 'fa-regular fa-clock',                       // Time
    renew: 'fa-regular fa-arrows-rotate',              // Renew
    pause: 'fa-regular fa-circle-pause',               // GAP
    stop: 'fa-regular fa-circle-stop',                 // GAP: Stop policy (Laurence, 27 October 2026)
    reinstate: 'fa-regular fa-arrow-rotate-right',     // Redo
    add: 'fa-regular fa-plus',                         // Plus (common action: Add)
    copy: 'fa-regular fa-copy',                        // Copy (common action)
    settings: 'fa-regular fa-gear',                    // Settings (common action)
    cancel: 'fa-regular fa-circle-xmark',              // Misuse
    help: 'fa-regular fa-circle-question',             // Help
    panel: 'fa-regular fa-arrow-right-from-line',      // Expand: "Expand or open a panel"
    flow: 'fa-regular fa-chevron-right',               // Chevron-right
    note: 'fa-regular fa-note-sticky',                 // GAP
    attachment: 'fa-regular fa-paperclip',             // GAP
    history: 'fa-regular fa-clock-rotate-left',        // Recent
    documents: 'fa-regular fa-files',                  // Documents
    newClient: 'fa-regular fa-user-plus',              // GAP
    systems: 'fa-regular fa-grid',                     // GAP: the system menu
    /* Mark's actions toolbar (Laurence, 21 October 2026). */
    support: 'fa-regular fa-hand-heart',       // GAP: Client support
    supportOn: 'fa-solid fa-hand-heart',       // GAP: extra support in place, in the teal (expressive quaternary)
    pen: 'fa-regular fa-pen',                          // the amend journeys
    mta: 'mob-icon mob-icon-shield-pen',               // GAP: Make an MTA (a wizard). Not in Font Awesome: Mark's SVG, inlined in the CSS
    extend: 'fa-regular fa-calendar-plus',             // GAP: Policy extension
    invite: 'fa-regular fa-envelope',                  // Email: Renewal invite
    more: 'fa-regular fa-ellipsis-vertical',           // Overflow: the vertical ellipsis (Laurence, 27 October 2026)
    newQuote: 'fa-regular fa-shield-plus'              // Shield-plus: Add new quote (Laurence, 21 October 2026)
  };

  /* ------------------------------------------------------------ Policy level */

  var GROUPS = {
    policy: function (p) {
      /* Policy overview is the group's first page, not an item of its own
         (Laurence, 8 October 2026); the group takes the Shield. */
      var r = rulesFor(p);
      var ch = [{ id: 'summary', label: '[[Policy overview]]' }];
      if (r.pages.details) ch.push({ id: 'details', label: '[[Policy details]]' });
      if (r.pages.claims) ch.push({ id: 'claims', label: 'Claims' });
      /* The status's entry points into a journey (Retrieve quote, Amend…)
         open pages, so they are navigation, in the Policy group with its
         other pages. Add new quote is the client's, in the client menu
         only (Laurence, 8 October 2026), whatever the status. */
      entryPoints(p).forEach(function (k) {
        ch.push({ id: POLICY_ACTIONS[k].to, label: POLICY_ACTIONS[k].label });
      });
      return { group: 'Policy', icon: ICON.policies, children: ch };
    },
    transactions: function (p) {
      return !rulesFor(p).pages.transactions ? null : { group: 'Transactions', icon: ICON.money, children: [
        { id: 'tx', label: '[[Account summary]]' },
        { id: 'plan', label: 'Payment plan' },
        { id: 'collections', label: 'Collections' },
        { id: 'dd', label: 'Direct Debit details' },
        { id: 'cards', label: 'Credit cards' }
        /* Transaction documents is removed (Laurence, 7 October 2026). Admin
           fee and Manual credit / debit open side panels, so they are
           Buttons on the Account summary page, not menu items. */
      ] };
    },
    corr: function () {
      return { group: 'Correspondence', icon: ICON.correspondence, children: [
        { id: 'diary', label: 'Diary' },
        { id: 'docs', label: 'Documents' },
        { id: 'notes', label: 'Notes' },
        { id: 'checklist', label: 'Checklist' },
        { id: 'attachments', label: 'Attachments' },
        { id: 'complaints', label: 'Complaints' }
      ] };
    },
    more: function () {
      return { group: 'More details', icon: ICON.info, children: [
        { id: 'agent', label: 'Agent / product details' },
        { id: 'history', label: 'History' },
        { id: 'activity', label: 'Policy activity' }
      ] };
    }
  };

  /* The client's menu, built like the policy's (Laurence, 8 October 2026):
     the overview on its own, then a "Client" group holding the client's
     other pages, without icons of their own. */
  function clientNav() {
    return [
      /* Client overview is the group's first page (Laurence, 8 October
         2026); the group takes the User icon. */
      { group: 'Client', icon: ICON.client, children: [{ id: 'summary', label: '[[Client overview]]' }].concat(CLIENT_NAV.map(function (n) { return { id: n.id, label: n.label }; })) }
    ];
  }

  function policyNav(p) {
    return [
      GROUPS.policy(p), GROUPS.transactions(p), GROUPS.corr(p), GROUPS.more(p)
    ].filter(Boolean);
  }

  /* kind: 'flow' opens a page, 'panel' opens a side panel in place,
     'confirm' asks for confirmation in place. */
  var POLICY_ACTIONS = {
    /* Live Mobius's labels, one per status (Laurence, 19 October 2026). */
    amend: { label: 'Amend details', icon: ICON.pen, kind: 'flow', to: 'amend', help: 'Contact details, consent and marketing' },
    amendQuote: { label: 'Amend quote', icon: ICON.pen, kind: 'flow', to: 'amendquote' },
    amendRisk: { label: 'Amend risk', icon: ICON.pen, kind: 'flow', to: 'amendquote' },
    retrieve: { label: 'Retrieve quote', icon: ICON.reinstate, kind: 'flow', to: 'quote' },
    mta: { label: '[[Make an MTA]]', icon: ICON.mta, kind: 'panel', help: 'Change the vehicle, drivers, cover and more' },    // the Shield-pen, a wizard (Laurence, 21 October 2026)
    extend: { label: 'Policy extension', icon: ICON.extend, kind: 'panel', help: 'Extend the current period' },
    /* Policy actions carry a one-line helper too, worded from each one's
       own confirmation or panel (user study, 28 October 2026: "Copy policy"
       drew people looking for a second vehicle, which is Add new quote). */
    renew: { label: 'Renewal invite', icon: ICON.invite, kind: 'confirm', help: 'Invite the client to renew this policy' },
    /* Back to "Stop policy" with the Stop icon (Laurence, 27 October 2026;
       it was "Pause policy" from 21 October). */
    stop: { label: 'Stop policy', icon: ICON.stop, kind: 'confirm', help: 'Stop the policy; this can be reversed later' },
    reinstate: { label: 'Reinstate policy', icon: ICON.reinstate, kind: 'confirm' },
    fee: { label: 'Admin fee', icon: ICON.money, kind: 'panel' },
    manual: { label: 'Manual credit / debit', icon: ICON.money, kind: 'panel' },
    newquote: { label: 'Add new quote', icon: ICON.newQuote, kind: 'flow', to: 'newquote' },
    copy: { label: '[[Copy policy]]', icon: ICON.copy, kind: 'confirm', help: 'Start a new policy with the same details' },
    portal: { label: '[[Customer portal settings]]', icon: ICON.settings, kind: 'panel', help: 'Let the client make changes or renew online' },
    cancel: { label: 'Cancel policy', icon: ICON.cancel, kind: 'confirm', danger: true, help: 'End cover; this cannot be undone' },
    /* In the live audit for Renewal invited, with no page or panel in the
       prototype yet (and no Renewal invited record to show them): listed
       for the rule, not drawn. */
    retrieveRenewal: { label: 'Retrieve renewal quote', icon: ICON.reinstate, kind: 'flow', to: 'renewalquote', unbuilt: true },
    amendRenewal: { label: 'Amend renewal', icon: ICON.pen, kind: 'flow', to: 'amendrenewal', unbuilt: true },
    withdrawAlt: { label: 'Withdraw alternative quote', icon: ICON.cancel, kind: 'confirm', unbuilt: true }
  };

  /* =====================================================================
     STATUS RULES — the one place that decides, per policy status, which
     navigation and which actions a policy gets (Laurence, 19 October 2026,
     from the audit of live Mobius). Edit here; nothing else checks status.

       pages    navigation: the optional pages in the policy menu. Policy
                overview, Correspondence and More details are on every
                status and are not listed.
       entry    navigation too: entry points that open a journey's pages,
                in the Policy group (keys of POLICY_ACTIONS with `to`).
       actions  the row beside the breadcrumbs (keys of POLICY_ACTIONS):
                side panels and confirmations, and the amend journey
                (Amend details / quote / risk), which sits there next to
                Make an MTA though it opens a page (Laurence, 19 October
                2026).

     Hidden means not rendered. Items marked `unbuilt` in POLICY_ACTIONS
     are listed so the rule is complete, but have no page or panel yet and
     are not drawn. Add new quote is client-level (the client menu) on
     every status, so it is not listed here. Customer portal settings
     ("Portal options") is configuration-driven in live Mobius; it stays
     on every status for now. Keys are the status labels, matched without
     regard to case. */
  var ALL_PAGES = { details: true, claims: true, transactions: true };
  var QUOTE_PAGES = { details: true, claims: false, transactions: false };
  var STATUS_RULES = {
    'Policy': {
      pages: ALL_PAGES,
      entry: [],
      actions: ['amend', 'mta', 'extend', 'renew', 'copy', 'portal', 'stop', 'cancel']
    },
    'Cancelled': {
      pages: ALL_PAGES,
      entry: [],
      actions: ['amend', 'copy', 'portal']
    },
    'Lapsed': {
      pages: ALL_PAGES,
      entry: [],
      actions: ['reinstate', 'copy', 'portal']
    },
    'Prospect': {
      pages: QUOTE_PAGES,
      entry: ['retrieve'],
      actions: ['amendQuote', 'copy', 'portal']
    },
    'Automatic decline': {
      pages: QUOTE_PAGES,
      entry: ['retrieve'],
      actions: ['amendQuote', 'copy', 'portal']
    },
    'Automatic refer': {
      pages: QUOTE_PAGES,
      entry: ['retrieve'],
      actions: ['amendQuote', 'copy', 'portal']
    },
    'Client decline': {
      pages: ALL_PAGES,                                 // not in the audit's hide lists
      entry: ['retrieve'],
      actions: ['amendQuote', 'copy', 'portal']
    },
    'Incomplete': {
      pages: { details: false, claims: true, transactions: true },
      entry: [],
      actions: ['amendRisk', 'copy', 'portal']
    },
    'Renewal invited': {
      pages: ALL_PAGES,
      entry: ['retrieveRenewal'],
      actions: ['amendRenewal', 'withdrawAlt', 'portal']
    },
    'Renewal pending': {
      pages: { details: true, claims: false, transactions: true },
      entry: [],
      actions: ['portal']
    },
    /* Not audited: the prototype's existing default for a status it has no
       rule for (every page, Copy and Customer portal settings). FLAG. */
    'MTA quote': {
      pages: ALL_PAGES,
      entry: [],
      actions: ['copy', 'portal']
    }
  };
  var DEFAULT_RULES = STATUS_RULES['MTA quote'];

  function rulesFor(p) {
    var want = String(p.status || '').toLowerCase();
    for (var k in STATUS_RULES) if (k.toLowerCase() === want) return STATUS_RULES[k];
    return DEFAULT_RULES;
  }
  var built = function (k) { return POLICY_ACTIONS[k] && !POLICY_ACTIONS[k].unbuilt; };
  function entryPoints(p) { return rulesFor(p).entry.filter(built); }
  /* Everything of the status's that opens a page: menu entry points and
     the row's journeys. */
  function journeys(p) {
    return entryPoints(p).concat(rulesFor(p).actions.filter(function (k) { return built(k) && POLICY_ACTIONS[k].kind === 'flow'; }));
  }

  /* The status's actions, in its rule's order (the row and More decide
     where each sits). */
  /* The label of the entry point that opens this page for this status
     ("Amend quote" or "Amend risk" share the quote amend page). */
  function amendLabel(p, page) {
    var k = journeys(p).filter(function (x) { return POLICY_ACTIONS[x].to === page; })[0];
    return k ? POLICY_ACTIONS[k].label : null;
  }

  function policyActions(p) {
    return [{ sub: null, ids: rulesFor(p).actions.filter(built) }];
  }

  /* The status's main entry point (for the read-only Policy details note);
     with none, changes start from Add new quote in the client menu. */
  function policyFlows(p) {
    var e = journeys(p).filter(function (k) { return k !== 'retrieve'; });
    return { primary: e[0] || 'newquote', secondary: [] };
  }

  /* Every page a policy of this status can show: its menu pages and the
     pages its entry points open. Anything else redirects to the overview. */
  function allowedPolicyPages(p) {
    var ids = [];
    policyNav(p).forEach(function (n) {
      if (n.children) n.children.forEach(function (c) { ids.push(c.id); });
      else ids.push(n.id);
    });
    journeys(p).forEach(function (k) { if (ids.indexOf(POLICY_ACTIONS[k].to) < 0) ids.push(POLICY_ACTIONS[k].to); });
    /* Quote summary is where amending a quote ends (Laurence, 8 October
       2026), and where Retrieve quote goes. */
    if (journeys(p).some(function (k) { return POLICY_ACTIONS[k].to === 'amendquote' || POLICY_ACTIONS[k].to === 'quote'; })) ids.push('quote');
    return ids;
  }

  /* Policy overview quick links: [page, label, icon, count key]. */
  var QUICK_LINKS = [
    ['docs', 'Documents', ICON.documents, 'docs'],
    ['attachments', 'Attachments', ICON.attachment, 'attachments'],
    ['notes', 'Notes', ICON.note, 'notes'],
    ['history', 'History', ICON.history, 'history']
  ];

  /* ------------------------------------------------------------ Client level */

  /* The client's pages, after Client overview. Add new quote is in the
     client's actions row, not here (Laurence, 19 October 2026). */
  var CLIENT_NAV = [
    { id: 'business', label: 'Business details', icon: ICON.business },
    { id: 'ctx', label: 'Transactions', icon: ICON.money },
    /* Live Mobius's "View claims" on the client homepage (Laurence, 19
       October 2026): the client's claims across their policies. Named
       "Claims", as the policy menu names its page. */
    { id: 'cclaims', label: 'Claims', icon: 'fa-regular fa-car-burst' },        // GAP: not in the icon catalogue
    { id: 'cactivity', label: 'Client activity', icon: ICON.activity },
    { id: 'ccomplaints', label: 'Complaints', icon: ICON.flag },
    { id: 'checks', label: 'Client checks', icon: ICON.checks }
  ];

  /* Client actions all live on the page next to what they affect, so the
     client menu has none (the prototype's CLIENT_ACTIONS is empty). */
  var CLIENT_ACTIONS = {
    cnewquote: { label: 'Add new quote', icon: ICON.newQuote, kind: 'flow', to: 'newquote' },
    cnotes: { label: 'Client notes', icon: ICON.note, kind: 'panel' }
  };

  /* --------------------------------------------------------------- App level */

  /* System level: the Mobius modules, which current Mobius hides in the
     "Dashboard" dropdown in the top bar. "Dashboard" is really Broking.
     Broking opens on its dashboard (outstanding diary and sanctions check
     matches); a search from the menu opens its results. Client and policy
     pages belong to Broking. */
  /* The areas, as the area switcher names and describes them (Laurence, 27
     October 2026; option B): "Broking" is "Clients & policies". */
  /* MTA adjustment types for a live policy, as Mobius lists them
     (Laurence, 28 October 2026), wording and order unchanged. */
  var MTA_ADJUSTMENTS = [
    'Change of Security Device',
    'Correction (NB)',
    'Correction (MTA)',
    'Change of Occupation',
    'Correction (Renewal)',
    'Correct Spelling of Name',
    'Correct Date of Birth',
    'Correct Date Passed Driving/Riding Test',
    'Re-Instated No Claims Bonus',
    'Change of Conviction Date',
    'Change of Conviction Details, Points or Fine',
    'Change of Licence Type',
    'Change of Claim Date, Cost or Circumstances',
    'Late Disclosure Claim',
    'Proposer - Add',
    'Proposer - Remove',
    'Change Sums Insured',
    'CUE Check',
    'Updating Contact Details',
    'Claim - Add',
    'Conviction - Add',
    'Correction MTA (Non-Advisable)',
    'Correction NB (Non-Advisable)',
    'Correction NB (Endorsements)',
    'Change of Risk Address',
    'Change of Cover',
    'Change of Car/Bike (Please check the modification section carefully)',
    'Change of Engine',
    'Change of Reg No.',
    'Change of Use',
    'Change of No Claims Bonus',
    'Change of L/Mileage',
    'Change of modification(s)',
    'Change of Name',
    'Add-on(s) - Add',
    'Add-on(s) - Remove',
    'Late Disclosure - Convictions',
    'Agreed Value - Add',
    'Agreed Value - Remove',
    'Late Disclosure - Accident',
    'Add-on(s) - DVLA',
    'Change of Home Address'
  ];

  var MODULES = [
    { id: 'dashboard', label: 'Clients & policies', desc: 'New business, MTAs and policy lifecycle', icon: 'fa-regular fa-shield' },   // Shield
    { id: 'activity', label: 'Activity', desc: 'Tasks, diary and recent changes', icon: ICON.activity },                                 // GAP
    { id: 'renewals', label: 'Renewals', desc: 'Upcoming and overdue renewals', icon: ICON.renew },                                       // Renew
    { id: 'bordereau', label: 'Bordereau', desc: 'Insurer reporting and submissions', icon: 'fa-regular fa-list' },                       // List
    { id: 'accounts', label: 'Accounts', desc: 'Transactions, cash and reconciliation', icon: ICON.money }                                // Pound
  ];

  /* Opens a page, so it sits in the Broking page headings (Dashboard and
     Search results). */
  var APP_ACTIONS = { newclient: { label: 'Create new client', icon: ICON.newClient, kind: 'flow', to: 'newclient' } };

  /* In the menu footer at client and policy level only: it needs a client. */
  var GLOBAL_ACTIONS = { support: { label: 'Client support', icon: ICON.help, kind: 'panel' } };

  /* ----------------------------------------------------------- Confirmations
     [title, body, confirm label, toast, destructive] */
  var CONFIRMS = {
    renew: ['Invite for renewal?', 'Are you sure you would like to invite this policy for renewal?', 'OK', 'Renewal invite sent', false],
    /* Stop and Cancel: the way out is "Keep policy", not "Cancel" beside
       "Cancel policy" (Laurence, 27 October 2026). [6] = the way-out label. */
    stop: ['Stop this policy?', 'The policy will be stopped. This can be reversed later.', 'Stop policy', 'Policy stopped', false, 'Keep policy'],
    copy: ['Copy this policy?', 'A new policy will be created with the same client, driver and vehicle details.', 'Copy policy', 'Policy copied', false],
    cancel: ['Cancel this policy?', 'Cancelling ends cover for this policy and may raise a refund or charge. This cannot be undone.', 'Cancel policy', 'Policy cancelled', true, 'Keep policy'],
    reinstate: ['Reinstate this policy?', 'The lapsed policy will be reinstated with its previous cover dates.', 'Reinstate', 'Policy reinstated', false],
    sanctions: ['Run a new sanctions check?', 'A sanctions check will be run against this client now.', 'Run check', 'Sanctions check performed successfully. No match found', false],
    /* A side panel with something entered, closed without saving (audit,
       28 October 2026). */
    discard: ['Discard this change?', 'What you have entered will not be saved.', 'Discard', null, true, 'Keep editing'],
    convert: ['Convert to policy?', 'The selected quote will be converted to a live policy. You will confirm cover, complete the checklist and take payment next.', 'Convert', 'Converting to policy', false]
  };

  /* ------------------------------------------------------------------ Titles
     [page heading, eyebrow]. On policy pages the eyebrow is followed by the
     policy reference. */
  var TITLES = {
    app: {
      dashboard: ['Find a client or policy', ''],   /* the homepage (Laurence, 27 October 2026) */ search: ['Search results for “@query”', 'Broking'], newclient: ['Create new client', 'New business'],
      activity: ['Activity', ''], renewals: ['Renewals', ''], bordereau: ['Bordereau', ''], accounts: ['Accounts', '']
    },
    client: {
      summary: ['[[Client overview]]', 'Client'], business: ['Business details', 'Client'], ctx: ['Transactions', 'Client'], cclaims: ['Claims', 'Client'],
      cactivity: ['Client activity', 'Client'], ccomplaints: ['Complaints', 'Client'], checks: ['Client checks', 'Client'],
      newquote: ['Product selection', 'New quote']
    },
    policy: {
      summary: ['[[Policy overview]]', ''], details: ['[[Policy details]]', 'Policy'], claims: ['Claims', 'Policy'],
      quote: ['Quote summary', 'Quote'], tx: ['[[Account summary]]', 'Transactions'], plan: ['Payment plan', 'Transactions'],
      collections: ['Collections', 'Transactions'], dd: ['Direct Debit details', 'Transactions'], cards: ['Credit cards', 'Transactions'],
      diary: ['Diary', 'Correspondence'], docs: ['Documents', 'Correspondence'],
      notes: ['Notes', 'Correspondence'], checklist: ['Checklist', 'Correspondence'], attachments: ['Attachments', 'Correspondence'],
      complaints: ['Complaints', 'Correspondence'], agent: ['Agent / product details', 'More details'],
      history: ['Policy history', 'More details'], activity: ['Policy activity', 'More details'],
      /* The amend pages take their status's label (amendLabel). */
      amend: ['Amend details', 'Policy action'], amendquote: ['Amend quote', 'Policy action'], newquote: ['Product selection', 'New quote']
    }
  };

  global.MobiusModel = {
    ICON: ICON,
    policyNav: policyNav,
    policyActions: policyActions,
    policyFlows: policyFlows,
    STATUS_RULES: STATUS_RULES,
    rulesFor: rulesFor,
    amendLabel: amendLabel,
    allowedPolicyPages: allowedPolicyPages,
    POLICY_ACTIONS: POLICY_ACTIONS,
    QUICK_LINKS: QUICK_LINKS,
    CLIENT_NAV: CLIENT_NAV,
    clientNav: clientNav,
    CLIENT_ACTIONS: CLIENT_ACTIONS,
    MODULES: MODULES,
    MTA_ADJUSTMENTS: MTA_ADJUSTMENTS,
    APP_ACTIONS: APP_ACTIONS,
    GLOBAL_ACTIONS: GLOBAL_ACTIONS,
    CONFIRMS: CONFIRMS,
    TITLES: TITLES
  };
}(window));
