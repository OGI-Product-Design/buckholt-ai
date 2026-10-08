/* ============================================================================
   Mobius navigation prototype — mock data
   ============================================================================

   Every record, row and value the prototype shows, in one place, so it can be
   swapped for real API responses later without touching the rendering code.
   It follows the sample data in `reference/mobius-live-policy.html` (the 7
   policies, the pages' sample rows), with the obvious test names replaced by
   realistic ones (Laurence, 8 October 2026): the client is James Barnard,
   and the dashboard, sanctions and search rows name real-sounding people.

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
    /* renewalOpen: the policy's renewal window is open, so Renewal invite
       carries a badge (on PUCO0068 to show it). */
    { id: 'puco0068', ref: 'PUCO0068', status: 'Live', kind: 'live', renewalOpen: true, inception: '11/09/2026', premium: '£520.00', start: '11/09/2026 09:27', end: '10/09/2027 23:59', dur: '12 months', ipn: null, stopRenewal: 'No', endorse: null, exc: STD_EXC, coverStart: '2026-09-11' },
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

    /* The user's recent searches (most recent first), shown when they open
       the search. A search they run is added to the top for the session. */
    recentSearches: ['Barnard', 'PUCO0068', 'BAR/J/08121986/0046', 'AL5 2JR'],

    /* Sample clients a search can bring back: for "Barnard", James Barnard
       (the prototype's own client, the only one that opens) and other
       Barnards with a mix of motor and household policies. A policy row:
       [reference, cover start, status, product, insurer, risk info, expiry,
       brand / agent, premium, scheme]. */
    searchClients: [
      { id: 'jb', real: true },
      { id: 'sb', name: 'Sarah Barnard', ref: 'BAR/S/14031979/0012', address: '3 Church Street, Tring, Hertfordshire', postcode: 'HP23 5AE', email: 'sarah.barnard@gmail.com', dob: '14/03/1979', policies: [
        ['HH0004812', '02/05/2026', 'Live', 'Open Market Household', 'Aviva', 'Property: 3 Church Street', '01/05/2027', 'Krypton / N/A', '£384.20', 'Mobius Home'],
        ['PUCO0071', '19/01/2026', 'Live', 'Open Market Motor', 'Ageas', 'Registration: LV21 KTN', '18/01/2027', 'Krypton / N/A', '£596.00', 'Mobius Private Car']] },
      { id: 'tb', name: 'Tom Barnard', ref: 'BAR/T/22071992/0003', address: '41 Kingsley Road, Luton, Bedfordshire', postcode: 'LU3 1AB', email: 'tom.barnard92@outlook.com', dob: '22/07/1992', policies: [
        ['HH0003390', '11/08/2024', 'Lapsed', 'Open Market Household', 'AXA Insurance', 'Property: 41 Kingsley Road', '10/08/2025', 'Krypton / N/A', '£212.75', 'Mobius Home']] },
      { id: 'mb', name: 'Margaret Barnard', ref: 'BAR/M/03111958/0007', address: '8 Orchard Close, St Albans, Hertfordshire', postcode: 'AL1 4HP', email: 'm.barnard@btinternet.com', dob: '03/11/1958', policies: [
        ['HH0002277', '30/09/2026', 'Live', 'Open Market Household', 'Aviva', 'Property: 8 Orchard Close', '29/09/2027', 'Tungsten / N/A', '£512.40', 'Mobius Home'],
        ['HH0002278', '30/09/2026', 'Live', 'Open Market Household', 'Aviva', 'Contents: 8 Orchard Close', '29/09/2027', 'Tungsten / N/A', '£146.90', 'Mobius Home Contents'],
        ['ZZ0003612', '12/09/2026', 'Prospect', 'Open Market Motor', 'Allianz Insurance PLC', 'Registration: YA18 PWZ', '11/09/2027', 'Tungsten / N/A', '£455.30', 'Mobius Private Car']] },
      { id: 'db', name: 'Daniel Barnard-Hughes', ref: 'BAR/D/19051988/0021', address: '27 Avebury Boulevard, Milton Keynes', postcode: 'MK9 2FX', email: 'dan.bh@icloud.com', dob: '19/05/1988', policies: [
        ['999/112/Z402/TGS', '04/10/2026', 'Incomplete', 'Open Market Motor', 'N/A', 'Registration: MK70 RDB', '03/10/2027', 'Krypton / N/A', '£0.00', 'Mobius Private Car']] },
      { id: 'pb', name: 'Priya Barnard', ref: 'BAR/P/27091995/0002', address: 'Flat 6, 112 St Albans Road, Watford', postcode: 'WD17 1JJ', email: 'priya.barnard@gmail.com', dob: '27/09/1995', policies: [
        ['HH0005020', '15/10/2026', 'Prospect', 'Open Market Household', 'Ageas', 'Contents: Flat 6, 112 St Albans Road', '14/10/2027', 'Krypton / N/A', '£118.60', 'Mobius Home Contents']] },
      { id: 'eb', name: 'Edward Barnard', ref: 'BAR/E/09021965/0004', address: 'The Old Rectory, High Street, Ampthill', postcode: 'MK45 2NG', email: 'edward.barnard@hotmail.co.uk', dob: '09/02/1965', policies: [
        ['HH0001045', '01/03/2026', 'Live', 'Open Market Household', 'AXA Insurance', 'Property: The Old Rectory', '28/02/2027', 'Tungsten / N/A', '£1,204.80', 'Mobius Home'],
        ['PUCO0049', '17/06/2026', 'Live', 'Open Market Motor', 'Ageas', 'Registration: EB65 RRD', '16/06/2027', 'Tungsten / N/A', '£842.00', 'Mobius Private Car'],
        ['ZZ0002984', '17/06/2025', 'Automatic Decline', 'Open Market Motor', 'Greenlight', 'Registration: EB65 RRD', '16/06/2026', 'Tungsten / N/A', '£0.00', 'Mobius Private Car']] }
    ],

    /* "What can I search?" in the search Modal. Current Mobius wording, in
       sentence case. */
    searchHelp: {
      title: 'Search clients by',
      groups: [
        ['Partial or full matches:', ['Name or surname', 'Postcode', 'Phone number']],
        ['Full match only:', ['Email address', 'Policy, client or claim reference', 'Insurer policy number', 'Vehicle registration', 'Invoice number']],
        ['Combine criteria for better results:', ['Name or surname + postcode: Davies SW1A 2AA']]
      ],
      tip: 'Use * for partial matches (e.g. *smith for Blacksmith).'
    },

    /* Broking dashboard: current Mobius's two tabs, sample rows. */
    outstandingDiary: {
      total: '14,334',
      rows: [
        ['ZZ0002931', 'Tungsten', '', 'Mr David Okafor', 'Cheaper quote', '01/03/2021', '2046', ['SS', 'System']],
        ['ZZ0002929', 'Tungsten', '', 'Mrs Helen Price', 'Cheaper quote', '05/03/2021', '2042', ['SS', 'System']],
        ['ZZ/000000479', 'Tungsten', '', 'Miss Chloe Bennett', 'NB accepted', '10/06/2021', '1945', null],
        ['ZZ/000000479', 'Tungsten', '', 'Miss Chloe Bennett', 'Quote saved', '10/06/2021', '1945', ['RK', 'Rachel King']],
        ['999/001/X172/TES', 'Krypton', 'Dubnium', 'Mr Ravi Sharma', 'Cancel RTA letter due', '11/07/2021', '1914', ['SS', 'System']],
        ['ZZ0000018', 'Krypton', 'Dubnium', 'Mrs Fiona MacLeod', 'Cancel RTA letter due', '11/07/2021', '1914', ['TW', 'Tom Walsh']]
      ]
    },
    /* [status, matches above threshold, highest match quality, date and time,
       client reference, policy reference, client name, business source code] */
    sanctionMatches: {
      total: '40',
      rows: [
        ['error', '', '', '08/02/2022 21:28', 'COL/P/28111979/0001', '', 'Peter Collins', 'Mobius UI'],
        ['overridden', '10', '76%', '17/02/2022 13:00', 'ALI/A/01011990/0001', '999/001/X342/WEB', 'Amin Ali', 'Digital'],
        ['error', '', '', '17/02/2022 13:47', 'HOO/A/01111990/0001', 'ZZ0002906', 'Amin Hoover', 'Digital'],
        ['above', '10', '74%', '24/02/2022 08:48', 'HOO/A/01011990/0004', '', 'Amin Hoover', 'Mobius UI'],
        ['above', '1', '74%', '05/04/2022 11:00', 'TUR/G/10051986/0005', '', 'Grace Turner', 'Mobius UI'],
        ['overridden', '5', '74%', '12/04/2022 09:06', '', '', 'Amin Ali', 'Mobius UI']
      ]
    },

    /* The user menu under the avatar, as current Mobius has it. */
    userMenu: ['Unlock records', 'Clear cache', 'Change password', 'Release notes', 'Cookie policy'],

    client: {
      name: 'James Barnard',
      initials: 'JB',
      ref: 'BAR/J/08121986/0046',
      dob: '08/12/1986',
      address: '14 Willow Lane, Harpenden, Hertfordshire, AL5 2JR',
      addressShort: '14 Willow Lane, Harpenden, Hertfordshire',
      postcode: 'AL5 2JR',
      email: 'james.barnard@outlook.com',
      tel: '07700 900481',
      since: '30/12/2017',
      businessLine: 'Open Market Motor',
      product: 'Motor',
      brand: 'Krypton',
      riskInfo: 'Registration: KX19 FHD',
      insurer: 'N/A',
      /* Extra support in place (Client support's Switch). On, so Client
         support shows its check; switch it off in the panel. */
      supportOn: true
    },

    policies: POLICIES,

    /* Client notes: none, as in current Mobius for this client (Laurence,
       8 October 2026); the one note is the policy's (policyNote). Notes added
       in the panel are put at the top of this list for the session. */
    clientNotes: [],

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
      ['**********5262', 'Mr J Barnard', '05/31', 'Yes', 'Yes']
    ],

    diary: [
      ['11/09/2026', 'System', 'System', '1st Chaser, Proposal Form Return', '11/09/2026 09:28', ''],
      ['11/09/2026', 'System', 'System', 'Added Auto Extra', '11/09/2026 09:29', '']
    ],

    documents: {
      names: ['Certificate of motor insurance.pdf', 'Policy schedule.pdf', 'Statement of fact.pdf', 'New business pack (post).zip', 'Direct Debit mandate.pdf'],
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
    vehicle: { reg: 'KX19 FHD', make: 'Mercedes', model: 'E220 AMG Sport CDI Auto', mileage: '15,000' },

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
        ['Personal details', [['Client reference', '@clientRef'], ['Private individual or other', 'Private individual'], ['Title', 'Mr'], ['Forename', 'James'], ['Other initials', 'R'], ['Surname', 'Barnard'], ['Date of birth', '08/12/1986'], ['Gender', 'Male'], ['Credit check consent', 'Not asked']]],
        ['Contact details', [['Email address', '@email']], 'telephones'],
        ['Cover date and time', [['[[Cover start]]', '@start'], ['[[Cover end]]', '@end']]]
      ] },
      { key: 'business', title: '[[Invoicing details]]', cards: [
        ['Invoicing address', [['House name / number', '14'], ['Postcode', 'AL5 2JR'], ['Street', 'Willow Lane'], ['Locality', ''], ['City', 'Harpenden'], ['County', 'Hertfordshire']]],
        ['Additional contacts', [], 'contacts'],
        ['VAT', [['Business VAT registered', 'No'], ['Reference', '']]],
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
        ['Vehicle details', [['Registration', 'KX19 FHD'], ['Make', 'Mercedes'], ['Model', 'E220 AMG Sport CDI Auto'], ['Chassis number', 'WDD2120022A036530'], ['Type', 'AMG Sport CDI'], ['CC', '2143'], ['Year of manufacture', '01/01/2014'], ['Fuel', 'Diesel'], ['Gearbox', 'Automatic'], ['Colour', 'Silver'], ['Body type', 'Saloon'], ['Doors', '4'], ['Seats', '5'], ['ABI code', '32120769']]]
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
      telephones: { head: ['Telephone', 'Type', 'Extension', 'Ex directory'], rows: [['07700 900481', 'Mobile', '', 'No'], ['01582 760213', 'Home', '', 'No']], empty: null },
      contacts: { head: ['Name', 'Title'], rows: [['Claire Barnard', 'Spouse']], empty: 'No additional contacts.' },
      drivers: { head: ['Title', 'Forename', 'Surname', 'Date of birth', '[[Relationship to policyholder]]'], rows: [['Mr', 'James', 'Barnard', '08/12/1986', '[[Policyholder]]']], empty: 'No drivers added.' },
      noDataConsent: { message: 'No data processing consent entered.' },
      noMarketingConsent: { message: 'No marketing consent entered.' },
      noContactConsent: { message: 'No consent to contact entered.' }
    }
  };
}(window));
