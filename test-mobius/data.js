/*
  Prototype data. Derived from the supplied Mobius screenshots.

  Duplicate names are deliberate: the reference format SMI/J/01021980/0007
  decodes as Smith / John / DOB 01-02-1980 / sequence, so eleven of the
  supplied results share name, date of birth AND address. That collision is
  the UX problem this exploration is about, so the data preserves it.
*/
window.MOBIUS_DATA = (function () {
  'use strict';

  // Policy statuses seen in the screenshots, mapped to documented Buckholt
  // Tag variants. Colour never carries the meaning alone - the label always
  // states the status - so the two states that need no broker action share
  // the neutral read-only Tag.
  var STATUS = {
    active:    { label: 'Active',           tag: 'tag-status tag-status-success', rank: 1 },
    renewal:   { label: 'Renewal invited',  tag: 'tag-status tag-status-info',    rank: 2 },
    incomplete:{ label: 'Incomplete',       tag: 'tag-status tag-status-warning', rank: 3 },
    prospect:  { label: 'Prospect',         tag: '',                              rank: 4 },
    lapsed:    { label: 'Lapsed',           tag: '',                              rank: 5 }
  };

  /*
    No product-line icon set. foundations/iconography/catalogue.md documents no
    icon for commercial vehicle, shop or liability, and its rules say to report
    the gap rather than substitute a similar Font Awesome icon. So the icon does
    not encode the product — the product NAME does, right beside it. The icon
    carries something the catalogue does support and the broker actually needs:
    whether there is live cover.
      fa-shield-check  live cover
      fa-shield        policies, none live
      fa-user          no policies held
  */

  var clients = [
    { ref: 'SMI/J/01021980/0007', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 1,
      policies: [
        { no: 'ZZ0003318', status: 'lapsed', product: 'Open Market Commercial Vehicle', insurer: '1st Quote Insurance',
          start: '23/03/2022', end: '23/03/2023', premium: 585.00, scheme: 'QA CV', reg: 'DE346GTRE' },
        { no: 'ZZ0002993', status: 'lapsed', product: 'Open Market Commercial Vehicle', insurer: '1st Quote Insurance',
          start: '02/03/2022', end: '02/03/2023', premium: 512.40, scheme: 'QA CV', reg: null },
        { no: '999/001/C217/TES', status: 'incomplete', product: 'Open Market Motor', insurer: null,
          start: '05/08/2026', end: '05/08/2027', premium: null, scheme: null, reg: null }
      ] },

    { ref: 'SMI/J/01021980/0015', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: 'j.smith@example.co.uk', phone: '01962 843 221', portal: true, claims: 1, connected: 0,
      policies: [
        { no: 'ZZ0004120', status: 'active', product: 'Open Market Commercial Vehicle', insurer: '1st Quote Insurance',
          start: '12/03/2026', end: '12/03/2027', premium: 642.80, scheme: 'QA CV', reg: 'DE346GTRE' },
        { no: 'ZZ0004121', status: 'active', product: 'Tradesman Liability', insurer: 'Aviva',
          start: '12/03/2026', end: '12/03/2027', premium: 318.00, scheme: 'QA TL', reg: null }
      ] },

    { ref: 'SMI/J/01021980/0019', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0,
      policies: [
        { no: '999/204/X280/TES', status: 'incomplete', product: 'Shop', insurer: null,
          start: '07/10/2021', end: null, premium: null, scheme: null, reg: null }
      ] },

    { ref: 'SMI/J/01021980/0009', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0, policies: [] },

    { ref: 'SMI/J/01021980/0012', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0,
      policies: [
        { no: 'ZZ0003902', status: 'renewal', product: 'Open Market Motor', insurer: 'Ageas',
          start: '18/09/2025', end: '18/09/2026', premium: 471.20, scheme: 'QA MOT', reg: 'YB19 KLM' }
      ] },

    { ref: 'SMI/J/01021980/0020', name: 'John Smith', dob: '01/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0,
      policies: [
        { no: 'ZZ0004455', status: 'prospect', product: 'Home Insurance', insurer: 'Covéa',
          start: '01/11/2026', end: '01/11/2027', premium: 289.90, scheme: 'QA HH', reg: null }
      ] },

    { ref: 'SMI/J/21051980/0001', name: 'John Smith', dob: '21/05/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: 'jsmith80@example.com', phone: '07700 900 118', portal: true, claims: 0, connected: 2,
      policies: [
        { no: 'ZZ0003877', status: 'active', product: 'Open Market Motor', insurer: 'Ageas',
          start: '04/02/2026', end: '04/02/2027', premium: 528.65, scheme: 'QA MOT', reg: 'LT71 WPX' }
      ] },

    { ref: 'SMI/J/10021980/0001', name: 'John Smith', dob: '10/02/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0, policies: [] },

    { ref: 'SMI/J/31051980/0001', name: 'John Smith', dob: '31/05/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: '01962 771 004', portal: false, claims: 0, connected: 0,
      policies: [
        { no: 'ZZ0002877', status: 'lapsed', product: 'Shop', insurer: 'Allianz',
          start: '15/06/2021', end: '15/06/2022', premium: 1204.00, scheme: 'QA SHP', reg: null }
      ] },

    { ref: 'SMI/J/31051980/0002', name: 'John Smith', dob: '31/05/1980',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0, policies: [] },

    { ref: 'SMI/J/01021989/0001', name: 'John Smith', dob: '01/02/1989',
      address: 'Transactor House, Nobs Crook, Colden Common, Winchester', postcode: 'SO21 1TH',
      email: null, phone: null, portal: false, claims: 0, connected: 0,
      policies: [
        { no: 'ZZ0004301', status: 'renewal', product: 'Open Market Commercial Vehicle', insurer: 'Aviva',
          start: '30/10/2025', end: '30/10/2026', premium: 733.10, scheme: 'QA CV', reg: 'MV22 RTO' }
      ] },

    { ref: 'SMI/J/14051996/0001', name: 'John Smith', dob: '14/05/1996',
      address: 'The National Gallery, Trafalgar Square, London', postcode: 'WC2N 5DN',
      email: 'john.smith@nationalgallery.org.uk', phone: '020 7747 2885', portal: true, claims: 2, connected: 4,
      policies: [
        { no: 'ZZ0004512', status: 'active', product: 'Shop', insurer: 'Allianz',
          start: '01/04/2026', end: '01/04/2027', premium: 2480.00, scheme: 'QA SHP', reg: null },
        { no: 'ZZ0004513', status: 'active', product: 'Tradesman Liability', insurer: 'Allianz',
          start: '01/04/2026', end: '01/04/2027', premium: 940.00, scheme: 'QA TL', reg: null },
        { no: 'ZZ0003044', status: 'lapsed', product: 'Open Market Motor', insurer: 'Ageas',
          start: '11/01/2022', end: '11/01/2023', premium: 398.00, scheme: 'QA MOT', reg: 'GK18 ZZA' }
      ] },

    { ref: 'SMI/J/14031996/0004', name: 'John Smith', dob: '14/03/1996',
      address: 'The National Gallery, Trafalgar Square, London', postcode: 'WC2N 5DN',
      email: null, phone: null, portal: false, claims: 0, connected: 0,
      policies: [
        { no: '999/311/A104/TES', status: 'incomplete', product: 'Home Insurance', insurer: null,
          start: '22/07/2026', end: null, premium: null, scheme: null, reg: null }
      ] },

    { ref: 'CLT-REF-000123', name: 'John Smith', dob: '02/11/1974',
      address: '10, Downing Street, Westminster, London', postcode: 'SW1A 1AA',
      email: 'j.smith@cabinetoffice.gov.uk', phone: '020 7930 4433', portal: true, claims: 0, connected: 1,
      policies: [
        { no: 'ZZ0004600', status: 'active', product: 'Home Insurance', insurer: 'Covéa',
          start: '06/06/2026', end: '06/06/2027', premium: 1875.50, scheme: 'QA HH', reg: null }
      ] }
  ];

  return { clients: clients, STATUS: STATUS };
})();
