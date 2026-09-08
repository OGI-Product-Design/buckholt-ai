/*
  Mobius PAS — Buckholt UI reskin (index2)
  ---------------------------------------
  Content transcribed verbatim from the supplied Mobius PAS screenshots.
  Field order, labels, values, casing and "N/A" placeholders are preserved
  exactly as the existing screen displays them, including the lower-case
  "john Smith" on record SMI/J/02011980/0002.

  This file is isolated from the exploration prototype in data.js and shares
  nothing with it.
*/
window.MOBIUS_LEGACY = (function () {
  'use strict';

  var WINCHESTER = 'Transactor House, Nobs Crook, Colden Common, Winchester';
  var GALLERY    = 'The National Gallery, Trafalgar Square, London';

  // Search Results table — "Showing 1-25 of 43"
  var results = [
    { name: 'John Smith', ref: 'SMI/J/01021980/0007', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0015', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0019', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/21051980/0001', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/10021980/0001', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0009', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0012', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/14051996/0001', address: 'The National Gallery, ss, London', postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/01021989/0001', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/31051980/0001', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'CLT-REF-000123',      address: '10, Downing Street, Westminster, London', postcode: 'SW1A 1AA' },
    { name: 'John Smith', ref: 'SMI/J/31051980/0002', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/14031996/0004', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/14031996/0002', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/14031996/0005', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/14051996/0007', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0013', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/14051996/0002', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'John Smith', ref: 'SMI/J/14051996/0006', address: GALLERY,                           postcode: 'WC2N 5DN' },
    { name: 'john Smith', ref: 'SMI/J/02011980/0002', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0001', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0020', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0003', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0008', address: WINCHESTER,                        postcode: 'SO21 1TH' },
    { name: 'John Smith', ref: 'SMI/J/01021980/0017', address: WINCHESTER,                        postcode: 'SO21 1TH' }
  ];

  // Expanded client row — shown in the screenshots for SMI/J/01021980/0007.
  // Every client row expands; the reference screen only evidences this one, so
  // the same detail is used throughout rather than inventing per-record data.
  var clientDetail = {
    email: 'N/A',
    dob: '01/02/1980',
    policies: [
      { no: '999/204/X280/TES', start: '07/10/2021', status: 'Incomplete',       product: 'Shop',
        insurer: 'N/A',                risk: 'N/A' },
      { no: 'ZZ0003318',        start: '11/04/2022', status: 'Prospect',         product: 'Open Market Commercial Vehicle',
        insurer: '1st Quote Insurance', risk: 'Registration: DE346GTRE',
        detail: { expiry: '11/04/2023', agent: 'Krypton / test SA1', premium: '£585.00', scheme: 'QA CV' } },
      { no: 'ZZ0003318',        start: '23/03/2022', status: 'Lapsed',           product: 'Open Market Commercial Vehicle',
        insurer: '1st Quote Insurance', risk: 'Registration: N/A' },
      { no: 'ZZ0002993',        start: '02/03/2023', status: 'Renewal Invited',  product: 'Open Market Commercial Vehicle',
        insurer: '1st Quote Insurance', risk: 'Registration: N/A' },
      { no: '999/001/C217/TES', start: '05/08/2026', status: 'Incomplete',       product: 'Open Market Motor',
        insurer: 'N/A',                risk: 'Registration: N/A' }
    ]
  };

  // CLIENT HOMEPAGE
  var client = {
    banner: 'Mr John Smith | Client Reference: SMI/J/01021980/0007',
    details: [
      ['Name',             'John Smith'],
      ['Date of Birth',    '01/02/1980'],
      ['Client Reference', 'SMI/J/01021980/0007'],
      ['Telephone',        'N/A'],
      ['Email',            'N/A'],
      ['Address',          'Transactor House, Nobs Crook, Colden Common, Winchester, SO21 1TH']
    ],
    policies: [
      { no: '999/001/C217/TES', start: '05/08/2026', renewal: '05/08/2027', status: 'Incomplete',
        product: 'Open Market Motor',              risk: 'Registration: N/A' },
      { no: 'ZZ0003318',        start: '23/03/2022', renewal: '23/03/2023', status: 'Lapsed',
        product: 'Open Market Commercial Vehicle', risk: 'Registration: N/A' },
      { no: 'ZZ0002993',        start: '02/03/2022', renewal: '02/03/2023', status: 'Lapsed',
        product: 'Open Market Commercial Vehicle', risk: 'Registration: N/A' }
    ],
    policiesShowing: 'Showing <strong>1-3</strong> of <strong>3</strong>',
    suggestedLinks: [
      { name: 'John Smith', email: '', dob: '01/02/1980', postcode: 'SO21 1TH' },
      { name: 'John Smith', email: '', dob: '01/02/1980', postcode: 'SO21 1TH' },
      { name: 'John Smith', email: '', dob: '01/02/1980', postcode: 'SO21 1TH' },
      { name: 'John Smith', email: '', dob: '01/02/1980', postcode: 'SO21 1TH' },
      { name: 'John Smith', email: '', dob: '01/02/1980', postcode: 'SO21 1TH' }
    ],
    connectedClients: [
      { name: 'Darran Hancox', linkType: 'Company', email: 'darran.hancox@opengi.co.uk',
        dob: '06/01/1985', postcode: 'B50 4DP' }
    ],
    statistics: [
      ['ACTIVE POLICIES',           '0'],
      ['TOTAL ACTIVE GWP',          '£0.00'],
      ['TOTAL OUTSTANDING BALANCE', '£0.00']
    ],
    openClaims:    ['OPEN CLAIMS', '0'],
    additionalInfo: [
      ['CONNECTED CLIENTS', '1'],
      ['LOYALTY YEARS',     '0']
    ]
  };

  return {
    results: results,
    total: 43,
    showing: 'Showing <strong>1-25</strong> of <strong>43</strong>',
    clientDetail: clientDetail,
    client: client,
    build: 'Build Number: 275249'
  };
})();
