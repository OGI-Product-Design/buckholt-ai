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
    clientGroup: 'fa-regular fa-address-card',         // GAP
    systems: 'fa-regular fa-grid'                      // GAP: the system menu
  };

  /* ------------------------------------------------------------ Policy level */

  var GROUPS = {
    policy: function (p) {
      var ch = [];
      if (p.kind !== 'incomplete') ch.push({ id: 'details', label: '[[Policy details]]' });
      if (p.kind !== 'decline') ch.push({ id: 'claims', label: 'Claims' });
      /* Amend policy and Add new quote are menu items in current Mobius
         (Laurence, 7 October 2026). They open pages, so they sit in the
         Policy group with its other pages. Which ones a status has is
         policyFlows', the same as the page heading. */
      var fl = policyFlows(p);
      [fl.primary].concat(fl.secondary).forEach(function (k) {
        /* Add new quote is the client's, in the client menu only (Laurence,
           8 October 2026): one place in the navigation. A policy's
           heading keeps its Add new quote Button. */
        if (k === 'newquote') return;
        ch.push({ id: POLICY_ACTIONS[k].to, label: POLICY_ACTIONS[k].label });
      });
      return ch.length ? { group: 'Policy', icon: ICON.policy, children: ch } : null;
    },
    transactions: function (p) {
      return p.kind === 'decline' ? null : { group: 'Transactions', icon: ICON.money, children: [
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
        { id: 'activity', label: 'Activity' }
      ] };
    }
  };

  /* The client's menu, built like the policy's (Laurence, 8 October 2026):
     the overview on its own, then a "Client" group holding the client's
     other pages, without icons of their own. */
  function clientNav() {
    return [
      { id: 'summary', label: '[[Client overview]]', icon: ICON.client },
      { group: 'Client', icon: ICON.clientGroup, children: CLIENT_NAV.map(function (n) { return { id: n.id, label: n.label }; }) }
    ];
  }

  function policyNav(p) {
    return [
      { id: 'summary', label: '[[Policy overview]]', icon: ICON.policies },   // the Shield, not the House (Laurence, 8 October 2026)
      GROUPS.policy(p), GROUPS.transactions(p), GROUPS.corr(p), GROUPS.more(p)
    ].filter(Boolean);
  }

  /* kind: 'flow' opens a page, 'panel' opens a side panel in place,
     'confirm' asks for confirmation in place. */
  var POLICY_ACTIONS = {
    amend: { label: '[[Amend policy]]', icon: ICON.edit, kind: 'flow', to: 'amend' },
    amendQuote: { label: '[[Amend policy]]', icon: ICON.edit, kind: 'flow', to: 'amendquote' },
    amendRisk: { label: '[[Amend policy]]', icon: ICON.edit, kind: 'flow', to: 'amendquote' },
    retrieve: { label: 'Retrieve quote', icon: ICON.reinstate, kind: 'flow', to: 'quote' },
    mta: { label: 'Add MTA', icon: ICON.swap, kind: 'panel' },
    extend: { label: 'Policy extension', icon: ICON.time, kind: 'panel' },
    renew: { label: 'Renewal invite', icon: ICON.renew, kind: 'confirm' },
    stop: { label: 'Stop policy', icon: ICON.pause, kind: 'confirm' },
    reinstate: { label: 'Reinstate policy', icon: ICON.reinstate, kind: 'confirm' },
    fee: { label: 'Admin fee', icon: ICON.money, kind: 'panel' },
    manual: { label: 'Manual credit / debit', icon: ICON.money, kind: 'panel' },
    newquote: { label: 'Add new quote', icon: ICON.add, kind: 'flow', to: 'newquote' },
    copy: { label: '[[Copy policy]]', icon: ICON.copy, kind: 'confirm' },
    portal: { label: '[[Customer portal settings]]', icon: ICON.settings, kind: 'panel' },
    cancel: { label: 'Cancel policy', icon: ICON.cancel, kind: 'confirm', danger: true }
  };

  /* A group with `sub: null` is drawn below a divider: Stop and Cancel sit
     together at the bottom of a live policy's actions. */
  function policyActions(p) {
    var g = [];
    if (p.kind === 'live') {
      g.push({ sub: 'Policy', ids: ['copy'] });
      g.push({ sub: 'MTA', ids: ['mta', 'extend'] });
      g.push({ sub: 'Renewal', ids: ['renew'] });
      g.push({ sub: 'Customer portal', ids: ['portal'] });
      g.push({ sub: null, ids: ['stop', 'cancel'] });
    } else if (p.kind === 'lapsed') {
      g.push({ sub: 'Policy', ids: ['reinstate', 'copy'] });
      g.push({ sub: 'Customer portal', ids: ['portal'] });
    } else {
      g.push({ sub: 'Policy', ids: ['copy'] });
      g.push({ sub: 'Customer portal', ids: ['portal'] });
    }
    return g;
  }

  /* Flows open a page, so they sit in the page heading instead of the menu. */
  function policyFlows(p) {
    if (p.kind === 'live') return { primary: 'amend', secondary: ['newquote'] };
    if (p.kind === 'prospect' || p.kind === 'decline') return { primary: 'amendQuote', secondary: ['newquote'] };
    if (p.kind === 'incomplete') return { primary: 'amendRisk', secondary: [] };
    return { primary: 'newquote', secondary: [] };
  }

  /* Every page a policy of this status can show: its menu pages plus the
     pages its heading flows open. Anything else redirects to the overview. */
  function allowedPolicyPages(p) {
    var ids = [];
    policyNav(p).forEach(function (n) {
      if (n.children) n.children.forEach(function (c) { ids.push(c.id); });
      else ids.push(n.id);
    });
    var fl = policyFlows(p);
    [fl.primary].concat(fl.secondary).forEach(function (a) { ids.push(POLICY_ACTIONS[a].to); });
    /* Quote summary is not a menu page (Laurence, 8 October 2026): it is
       where amending a quote ends, as in current Mobius, for a policy that
       is still a quote. */
    if (hasQuote(p)) ids.push('quote');
    return ids;
  }

  function hasQuote(p) {
    return p.kind === 'prospect' || p.kind === 'decline' || p.kind === 'incomplete';
  }

  /* Policy overview quick links: [page, label, icon, count key]. */
  var QUICK_LINKS = [
    ['docs', 'Documents', ICON.documents, 'docs'],
    ['attachments', 'Attachments', ICON.attachment, 'attachments'],
    ['notes', 'Notes', ICON.note, 'notes'],
    ['history', 'History', ICON.history, 'history']
  ];

  /* ------------------------------------------------------------ Client level */

  /* The client's pages, after Client overview: Add new quote first
     (Laurence, 7 October 2026), then Business details. */
  var CLIENT_NAV = [
    { id: 'newquote', label: 'Add new quote', icon: ICON.add },
    { id: 'business', label: 'Business details', icon: ICON.business },
    { id: 'ctx', label: 'Transactions', icon: ICON.money },
    { id: 'cactivity', label: 'Activity', icon: ICON.activity },
    { id: 'ccomplaints', label: 'Complaints', icon: ICON.flag },
    { id: 'checks', label: 'Client checks', icon: ICON.checks }
  ];

  /* Client actions all live on the page next to what they affect, so the
     client menu has none (the prototype's CLIENT_ACTIONS is empty). */
  var CLIENT_ACTIONS = {
    cnewquote: { label: 'Add new quote', icon: ICON.add, kind: 'flow', to: 'newquote' },
    cnotes: { label: 'Client notes', icon: ICON.note, kind: 'panel' }
  };

  /* --------------------------------------------------------------- App level */

  /* System level: the Mobius modules, which current Mobius hides in the
     "Dashboard" dropdown in the top bar. "Dashboard" is really Broking.
     Broking opens on its dashboard (outstanding diary and sanctions check
     matches); a search from the menu opens its results. Client and policy
     pages belong to Broking. */
  var MODULES = [
    { id: 'dashboard', label: 'Broking', icon: 'fa-regular fa-shield' },      // Shield
    { id: 'activity', label: 'Activity', icon: ICON.activity },               // GAP
    { id: 'renewals', label: 'Renewals', icon: ICON.renew },                  // Renew
    { id: 'bordereau', label: 'Bordereau', icon: 'fa-regular fa-list' },      // List
    { id: 'accounts', label: 'Accounts', icon: ICON.money }                   // Pound
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
    stop: ['Stop this policy?', 'The policy will be stopped. This can be reversed later.', 'Stop policy', 'Policy stopped', false],
    copy: ['Copy this policy?', 'A new policy will be created with the same client, driver and vehicle details.', 'Copy policy', 'Policy copied', false],
    cancel: ['Cancel this policy?', 'Cancelling ends cover for this policy and may raise a refund or charge. This cannot be undone.', 'Cancel policy', 'Policy cancelled', true],
    reinstate: ['Reinstate this policy?', 'The lapsed policy will be reinstated with its previous cover dates.', 'Reinstate', 'Policy reinstated', false],
    sanctions: ['Run a new sanctions check?', 'A sanctions check will be run against this client now.', 'Run check', 'Sanctions check performed successfully. No match found', false],
    convert: ['Convert to policy?', 'The selected quote will be converted to a live policy. You will confirm cover, complete the checklist and take payment next.', 'Convert', 'Converting to policy', false]
  };

  /* ------------------------------------------------------------------ Titles
     [page heading, eyebrow]. On policy pages the eyebrow is followed by the
     policy reference. */
  var TITLES = {
    app: {
      dashboard: ['Dashboard', 'Broking'], search: ['Search results for “@query”', 'Broking'], newclient: ['Create new client', 'New business'],
      activity: ['Activity', ''], renewals: ['Renewals', ''], bordereau: ['Bordereau', ''], accounts: ['Accounts', '']
    },
    client: {
      summary: ['[[Client overview]]', 'Client'], business: ['Business details', 'Client'], ctx: ['Transactions', 'Client'],
      cactivity: ['Activity', 'Client'], ccomplaints: ['Complaints', 'Client'], checks: ['Client checks', 'Client'],
      newquote: ['Product selection', 'New quote']
    },
    policy: {
      summary: ['[[Policy overview]]', ''], details: ['[[Policy details]]', 'Policy'], claims: ['Claims', 'Policy'],
      quote: ['Quote summary', 'Quote'], tx: ['[[Account summary]]', 'Transactions'], plan: ['Payment plan', 'Transactions'],
      collections: ['Collections', 'Transactions'], dd: ['Direct Debit details', 'Transactions'], cards: ['Credit cards', 'Transactions'],
      diary: ['Diary', 'Correspondence'], docs: ['Documents', 'Correspondence'],
      notes: ['Notes', 'Correspondence'], checklist: ['Checklist', 'Correspondence'], attachments: ['Attachments', 'Correspondence'],
      complaints: ['Complaints', 'Correspondence'], agent: ['Agent / product details', 'More details'],
      history: ['Policy history', 'More details'], activity: ['Activity', 'More details'],
      amend: ['[[Amend policy]]', 'Policy action'], amendquote: ['[[Amend policy]]', 'Policy action'], newquote: ['Product selection', 'New quote']
    }
  };

  global.MobiusModel = {
    ICON: ICON,
    policyNav: policyNav,
    policyActions: policyActions,
    policyFlows: policyFlows,
    allowedPolicyPages: allowedPolicyPages,
    POLICY_ACTIONS: POLICY_ACTIONS,
    QUICK_LINKS: QUICK_LINKS,
    CLIENT_NAV: CLIENT_NAV,
    clientNav: clientNav,
    CLIENT_ACTIONS: CLIENT_ACTIONS,
    MODULES: MODULES,
    APP_ACTIONS: APP_ACTIONS,
    GLOBAL_ACTIONS: GLOBAL_ACTIONS,
    CONFIRMS: CONFIRMS,
    TITLES: TITLES
  };
}(window));
