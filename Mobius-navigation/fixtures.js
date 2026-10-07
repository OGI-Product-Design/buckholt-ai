/* ============================================================================
   Mobius navigation prototype — mock data
   ============================================================================

   Every record, row and value the prototype shows, in one place, so it can be
   swapped for real API responses later without touching the rendering code.
   All of it is the sample data from `reference/mobius-live-policy.html`,
   copied as-is: the client "Reverend Motor API Automation", their 7 policies,
   and the sample rows each page shows.

   Wording conventions used in the strings below:

     [[text]]   a terminology change from current Mobius — the prototype's
                hl(). Rendered as a highlighted <mark> while "Show wording
                changes" is on, and as plain text when it is off. See
                reference/mobius-terminology-log.xlsx, "Prototype change".

   Values that are copied from the record (policy reference, cover dates) are
   written as @tokens and filled in by the renderer:

     @clientRef @email @start @end @premium @ref @status @inception

   Nothing in this file is markup. Values are escaped when rendered.
   ============================================================================ */
(function (global) {
  'use strict';

  var STD_EXC = [
    ['Requested Voluntary Excess', '£200.00'],
    ['Accidental Damage Fire and Theft', '£500.00'],
    ['Voluntary, Accidental Damage', '£16.00'],
    ['Compulsory, Accidental Damage', '£17.00'],
    ['Windscreen Replacement', '£50.00'],
    ['Compulsory, Fire and Theft', '£17.00']
  ];

  /* `coverStart` is the sort key: lists show the most recent cover start
     first. `kind` decides which pages and actions the policy gets; see
     navigation-model.js. */
  var POLICIES = [
    { id: 'puco0068', ref: 'PUCO0068', status: 'Live', kind: 'live', inception: '11/09/2026', premium: '£520.00', start: '11/09/2026 09:27', end: '10/09/2027 23:59', dur: '12 months', ipn: null, stopRenewal: 'No', endorse: null, exc: STD_EXC, coverStart: '2026-09-11' },
    { id: 'puco0052', ref: 'PUCO0052', status: 'Live', kind: 'live', inception: '24/08/2026', premium: '£625.00', start: '24/08/2026 00:00', end: '23/08/2027 23:59', dur: '12 months', ipn: null, stopRenewal: 'No', endorse: null, exc: STD_EXC.slice(0, 2), coverStart: '2026-08-24' },
    { id: 'aad666', ref: 'AADD000000000666', status: 'Live', kind: 'live', inception: '30/04/2026', premium: '£722.00', start: '30/04/2026 00:09', end: '29/04/2027 23:59', dur: '12 months', ipn: 'LGN0658EDRY', stopRenewal: 'No', endorse: null, exc: STD_EXC, coverStart: '2026-04-30' },
    { id: 'y341', ref: '999/006/Y341/TGS', status: 'Automatic Decline', kind: 'decline', inception: '25/12/2025', premium: '£0.00', start: '25/12/2025 09:26', end: '24/12/2026 23:59', dur: '12 months', ipn: null, stopRenewal: 'No', coverStart: '2025-12-25' },
    { id: 'zz646', ref: 'ZZ0900000000646', status: 'Lapsed', kind: 'lapsed', inception: '29/04/2025', premium: '£690.00', start: '29/04/2025 22:22', end: '28/04/2026 23:59', dur: '12 months', ipn: 'ZZ09PIN000000000659', stopRenewal: 'Yes', endorse: ['Agreed Annual Mileage'], exc: [['Requested Voluntary Excess', '£200.00'], ['Accidental Damage Fire and Theft', '£500.00'], ['6876', '£6,576.00']], coverStart: '2025-04-29' },
    { id: 'z315', ref: '999/018/Z315/TGS', status: 'Incomplete', kind: 'incomplete', inception: '02/03/2022', premium: '£0.00', start: '11/11/2023 17:00', end: '10/11/2024 23:59', dur: '12 months', ipn: null, coverStart: '2023-11-11' },
    { id: 'zz2966', ref: 'ZZ0002966', status: 'Prospect', kind: 'prospect', inception: '08/02/2023', premium: '£529.50', start: '08/02/2023 11:01', end: '08/04/2023 11:00', dur: 'N/A', hdrDur: '2 Months', ipn: null, endorse: null, exc: STD_EXC.slice(0, 2), coverStart: '2023-02-08' }
  ];

  global.MobiusFixtures = {

    /* The signed-in user, as the top bar and the notes show them. */
    user: { name: 'Laurence Abbott', initials: 'LA', environment: 'Test' },

    /* Broking dashboard: current Mobius's two tabs, sample rows. */
    outstandingDiary: {
      total: '14,334',
      rows: [
        ['ZZ0002931', 'Tungsten', '', 'Mr Motor DTEST', 'Cheaper quote', '01/03/2021', '2046', ['SS', 'System']],
        ['ZZ0002929', 'Tungsten', '', 'Mr Motor DTEST', 'Cheaper quote', '05/03/2021', '2042', ['SS', 'System']],
        ['ZZ/000000479', 'Tungsten', '', 'Mrs Miroslav 1234 adasd', 'NB accepted', '10/06/2021', '1945', null],
        ['ZZ/000000479', 'Tungsten', '', 'Mrs Miroslav 1234 adasd', 'Quote saved', '10/06/2021', '1945', ['MU', 'MB User3']],
        ['999/001/X172/TES', 'Krypton', 'Dubnium', 'Miss Forename Katwoj HH Krypton SubAgent Introducer', 'Cancel RTA letter due', '11/07/2021', '1914', ['SS', 'System']],
        ['ZZ0000018', 'Krypton', 'Dubnium', 'Mr Kamil Test', 'Cancel RTA letter due', '11/07/2021', '1914', ['SS', 'System']]
      ]
    },
    /* [status, matches above threshold, highest match quality, date and time,
       client reference, policy reference, client name, business source code] */
    sanctionMatches: {
      total: '40',
      rows: [
        ['error', '', '', '08/02/2022 21:28', 'PC-/T/28111979/0001', '', 'Test PC-One', 'Mobius UI'],
        ['overridden', '10', '76%', '17/02/2022 13:00', 'ALI/A/01011990/0001', '999/001/X342/WEB', 'Amin Ali', 'Digital'],
        ['error', '', '', '17/02/2022 13:47', 'HOO/A/01111990/0001', 'ZZ0002906', 'amin hoover', 'Digital'],
        ['above', '10', '74%', '24/02/2022 08:48', 'HOO/A/01011990/0004', '', 'Amin Hoover', 'Mobius UI'],
        ['above', '1', '74%', '05/04/2022 11:00', 'TES/T/10051986/0005', '', 'Test Test', 'Mobius UI'],
        ['overridden', '5', '74%', '12/04/2022 09:06', '', '', 'Amin Ali', 'Mobius UI']
      ]
    },

    /* The user menu under the avatar, as current Mobius has it. */
    userMenu: ['Unlock records', 'Clear cache', 'Change password', 'Release notes', 'Cookie policy'],

    client: {
      name: 'Reverend Motor API Automation',
      initials: 'RM',
      ref: 'API/M/08121996/0046',
      dob: '08/12/1996',
      address: '2 Fernbank, La Butte, St. Peter Port, Guernsey, GY1 1XA',
      addressShort: '2 Fernbank, La Butte, St. Peter Port, Guernsey',
      postcode: 'GY1 1XA',
      email: 'aman@email.com',
      tel: '00888888888',
      since: '30/12/2017',
      businessLine: 'Open Market Motor',
      product: 'Motor',
      brand: 'Krypton',
      riskInfo: 'Registration: TBA1',
      insurer: 'N/A'
    },

    policies: POLICIES,

    /* Client notes start with one note; notes added in the panel are put at
       the top of this list for the rest of the session. */
    clientNotes: [
      { by: 'Laurence Abbott', at: '01/10/2026 13:29', text: '[Sample client note]' }
    ],

    /* Counts shown as badges on the Policy overview quick links. */
    quickLinkCounts: { docs: 3, attachments: 0, notes: 1, history: 0 },

    clientStats: {
      livePolicies: '3',
      gwp: '£1,867.00',
      outstanding: '£0.00',
      openClaims: '0',
      connected: '0',
      loyaltyYears: '0'
    },

    clientActivity: [
      ['01/10/2026 13:29', 'Laurence Abbott', 'View Client', 'View Client', 'N/A', 'N/A'],
      ['01/10/2026 13:01', 'Laurence Abbott', 'View Client', 'View Client', 'N/A', 'N/A']
    ],

    sanctionsChecks: [
      ['No matches', '0', 'Laurence Abbott', '01/10/2026 13:30'],
      ['No matches', '0', 'Laurence Abbott', '01/10/2026 12:57']
    ],

    accountStatistics: {
      zero: [['Premium', '£0.00', '£0.00'], ['Earnings', '£0.00', '£0.00']],
      puco0068: [['Premium', '£510.00', '£0.00'], ['Earnings', '£10.00', '£0.00']]
    },

    settledItems: {
      puco0068: [
        ['11/09/2026', 'OMRMTRI02281471', '11/09/2026', 'PAY', 'Credit card', '−£520.00', '11/09/2026', '123456', '5262', '01/05/2031'],
        ['11/09/2026', 'OMRMTRI02281472', '11/09/2026', 'NB', 'Credit card', '£520.00', '11/09/2026', '', '', '']
      ]
    },

    paymentPlan: [
      ['Plan', 'Default single payment in full (no admin fees)'], ['Effective date', ''], ['Finance agreement ref', ''],
      ['Balance on plan', '£0.00'], ['Amount to add', ''], ['Revised plan', ''],
      ['No. of instalments', '1'], ['Auto renewal opt out', 'No'], ['Service charge', '£0.00']
    ],

    creditCards: [
      ['**********5262', 'Motor API Automation', '05/31', 'Yes', 'Yes']
    ],

    diary: [
      ['11/09/2026', 'System', 'System', '1st Chaser, Proposal Form Return', '11/09/2026 09:28', ''],
      ['11/09/2026', 'System', 'System', 'Added Auto Extra', '11/09/2026 09:29', '']
    ],

    documents: {
      names: ['2nd Nested Doc, Copy.doc', '3rd Nested Doc, Copy.doc', 'AuthTest.doc', 'CV, New Business Pack (Post).zip', 'Highway Certificate.doc'],
      total: 18
    },

    policyNote: {
      title: 'Document',
      at: '11/09/2026 09:28',
      lines: ['System manually added note:', 'CV, Quotation Pack (Email) [Email direct from Document]']
    },

    policyActivity: [
      ['01/10/2026 15:28', 'Laurence Abbott', 'Update Policy', 'Client Details updated'],
      ['01/10/2026 15:23', 'Laurence Abbott', 'View Policy', 'View Policy'],
      ['01/10/2026 15:11', 'Laurence Abbott', 'View Policy', 'View Policy']
    ],

    historyOperator: 'Despina Krstevska',

    quotes: {
      quoted: [
        ['Vitruvius Motor', '£521.20', '£0.00', '£521.20'],
        ['Alpha Motor', '£630.68', '£0.00', '£630.68'],
        ['Mobius Private Car', '£636.16', '£0.00', '£636.16'],
        ['QA Motor', '£727.27', '£0.00', '£727.27'],
        ['Midas, GB Motor', '£171.36', '£0.00', '£171.36']
      ],
      declined: [
        ['Vitruvius Motor', 'Declined', '£0.00', '£0.00'],
        ['Alpha Motor', 'Declined', '£0.00', '£0.00'],
        ['Mobius Private Car', 'Declined', '£0.00', '£0.00']
      ],
      best: {
        premium: '£521.20', scheme: 'Vitruvius Motor',
        plan: 'Payment plan: Default single payment in full (no admin fees)',
        money: [['Total payable', '£521.20'], ['1 x payment of', '£521.20'], ['Deposit', '£0.00'], ['Excess', '£600.00']]
      },
      excesses: [
        ['Requested voluntary excess', '£250.00'],
        ['Accidental damage fire and theft, compulsory', '£500.00'],
        ['Voluntary, accidental damage fire and theft', '£16.00']
      ]
    },

    driver: { dob: '08/12/1996' },
    vehicle: { reg: 'TBA1', make: 'Mercedes', model: 'E220 AMG Sport CDI Auto', mileage: '15,000' },

    contactNumbers: [
      ['00888888888', 'Fax', '2345', 'No'],
      ['00111222333', 'Fax', '2345', 'No']
    ],

    quoteBreakdown: [
      ['Premium', '0%', '£0.00', '£0.00'], ['Quoted premium', '0%', '£0.00', '£0.00'],
      ['Insurer admin fee', '0%', '£0.00', '£0.00'], ['Insurer admin fee IPT', '0%', '£0.00', '£0.00'],
      ['Commission', '0%', '£0.00', '£0.00'], ['Gross premium (excl. IPT)', '0%', '£0.00', '£0.00'],
      ['Gross premium (incl. IPT)', '0%', '£0.00', '@premium'], ['Admin fee', '0%', '£0.00', '£0.00'],
      ['Live deposit', '0%', '£0.00', '£0.00'], ['Gross premium (incl. deposit)', '0%', '£0.00', '@premium']
    ],

    manualAmendments: {
      scheme: 'Ultimate Motor',
      rows: [['Discount', '£0.00'], ['Discount to RPS/MP', '£0.00'], ['Annual premium', '£0.00'], ['Revised annual premium', '£0.00'], ['RPS adjustment', '£0.00']]
    },

    /* The Policy › View screens, section by section. Each card is
       [title, fields, table]. A field is [label, value]; an empty value
       renders "Not set". `table` is a named table below. Used read-only on
       Policy details, and as the steps of Amend policy and Create new client
       (which shows the same labels with every value blank). */
    policyDetail: [
      { key: 'proposer', title: '[[Policyholder details]]', cards: [
        ['Personal details', [['Client reference', '@clientRef'], ['Private individual or other', 'Private individual'], ['Title', 'Reverend'], ['Forename', 'Motor'], ['Other initials', 'Dd'], ['Surname', 'Api Automation'], ['Date of birth', '08/12/1996'], ['Gender', 'Female'], ['Credit check consent', 'Not asked']]],
        ['Contact details', [['Email address', '@email']], 'telephones'],
        ['Cover date and time', [['[[Cover start]]', '@start'], ['[[Cover end]]', '@end']]]
      ] },
      { key: 'business', title: '[[Invoicing details]]', cards: [
        ['Invoicing address', [['House name / number', '2 Fernbank'], ['Postcode', 'GY1 1XA'], ['Street', 'La Butte'], ['Locality', 'St. Peter Port'], ['City', 'Guernsey'], ['County', '']]],
        ['Additional contacts', [], 'contacts'],
        ['VAT', [['Business VAT registered', 'Yes'], ['Reference', '21021']]],
        ['Employer reference number', [['Employer reference number', '']]]
      ] },
      { key: 'consent', title: 'Consent screen', cards: [
        ['Data processing consent', [], 'noDataConsent'],
        ['Marketing consent', [], 'noMarketingConsent'],
        ['Consent to contact', [], 'noContactConsent']
      ] },
      { key: 'driver', title: 'Driver details', cards: [
        ['Driver details', [], 'drivers']
      ] },
      { key: 'vehicle', title: 'Vehicle details', cards: [
        ['Vehicle details', [['Registration', 'TBA1'], ['Make', 'Mercedes'], ['Model', 'E220 AMG Sport CDI Auto'], ['Chassis number', 'WDD2120022A036530'], ['Type', 'AMG Sport CDI'], ['CC', '2143'], ['Year of manufacture', '01/01/2014'], ['Fuel', 'Diesel'], ['Gearbox', 'Automatic'], ['Colour', 'Silver'], ['Body type', 'Saloon'], ['Doors', '4'], ['Seats', '5'], ['ABI code', '32120769']]]
      ] },
      { key: 'cover', title: 'Vehicle cover', cards: [
        ['Cover details', [['Who is to be insured', 'Insured only'], ['Cover', 'Comprehensive'], ['Voluntary excess', '200']]],
        ['No claims', [['NCD', '0'], ['Reason', ''], ['Country earned', 'United Kingdom'], ['NCD entitlement reason', 'Combination of experience'], ['Type', 'No claims'], ['Protected NCD', 'No']]],
        ['Previous insurance', [['Insurer name', ''], ['Policy number', ''], ['Expiry date', '']]]
      ] },
      { key: 'contact', title: 'Contact and marketing', cards: [
        ['Contact', [['Preferred contact method', ''], ['Original contact source', ''], ['Originator', ''], ['Stop correspondence', 'No'], ['Correspondence to branch', 'No']]],
        ['Marketing source', [['Campaign', ''], ['Source of business', ''], ['Activity', ''], ['Reference', ''], ['Referred by', '']]],
        ['Mailings and email', [['Allow mailings and emails from administrator', 'No'], ['Allow mailings and emails from affinity', 'No'], ['Allow mailings and emails from third party', 'No']]]
      ] }
    ],

    /* The named tables and empty messages policyDetail refers to. `empty` is
       what the blank (Create new client) version shows instead. */
    policyDetailTables: {
      telephones: { head: ['Telephone', 'Type', 'Extension', 'Ex directory'], rows: [['00888888888', 'Fax', '2345', 'No'], ['00111222333', 'Fax', '2345', 'No']], empty: null },
      contacts: { head: ['Name', 'Title'], rows: [['Test Contact', 'Test Title']], empty: 'No additional contacts.' },
      drivers: { head: ['Title', 'Forename', 'Surname', 'Date of birth', '[[Relationship to policyholder]]'], rows: [['Reverend', 'Motor', 'API Automation', '08/12/1996', '[[Policyholder]]']], empty: 'No drivers added.' },
      noDataConsent: { message: 'No data processing consent entered.' },
      noMarketingConsent: { message: 'No marketing consent entered.' },
      noContactConsent: { message: 'No consent to contact entered.' }
    }
  };
}(window));
