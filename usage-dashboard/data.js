/* ============================================================================
   Mobius PAS usage — report data
   ============================================================================

   Every figure below is transcribed from the three supplied reports:

     Mobius_PAS_Report_Period1_JulAug2026.md
     Mobius_PAS_Report_Period2_AugSep2026.md
     Mobius_PAS_Usage_Report.md   (combined edition)

   Nothing here is modelled, smoothed, interpolated or estimated. Where a
   report says a figure was not built or returned no result, that is carried
   through as `null` and rendered as an explicit absence, never as zero and
   never as a gap in a line.

   Derived values (shares, ratios, per-session rates) are computed in this file
   from the transcribed numbers so the arithmetic is visible and checkable. Each
   one carries the source figures it was computed from.
   ============================================================================ */

const PERIODS = {
  p1: { id: 'p1', short: 'P1', label: 'Period 1', range: '11 Jul – 9 Aug 2026' },
  p2: { id: 'p2', short: 'P2', label: 'Period 2', range: '10 Aug – 8 Sep 2026' }
};

/* Segment colours. Fixed per segment, everywhere on the page, for every chart.
   A colour identifies a brand; it never encodes rank, size or order, so a sort
   or a filter never repaints a segment. Values are Buckholt expressive-family
   steps, read through CSS custom properties at render time — see dashboard.css.
   The `light` step is the same hue's lighter step, used only for the earlier
   period inside a single-segment panel (an ordinal ramp, not a second identity). */
const SEGMENTS = {
  islands:    { id: 'islands',    name: 'Islands',    ids: 'IS01 · IS91', colourVar: '--ud-seg-islands',    lightVar: '--ud-seg-islands-light' },
  greenlight: { id: 'greenlight', name: 'Greenlight', ids: 'BR01 · BR91', colourVar: '--ud-seg-greenlight', lightVar: '--ud-seg-greenlight-light' },
  pizza:      { id: 'pizza',      name: 'Pizza',      ids: 'PZ01 · PZ91', colourVar: '--ud-seg-pizza',      lightVar: '--ud-seg-pizza-light' }
};

/* ---------------------------------------------------------------------------
   Platform health
   --------------------------------------------------------------------------- */

const SESSIONS = {
  islands:    { p1: 8453, p2: 8499 },
  greenlight: { p1: 715,  p2: 645 },
  pizza:      { p1: 280,  p2: 174 },
  combined:   { p1: 9448, p2: 9318 }
};

const ACTIVE_USERS = {
  islands:    { p1: null, p2: 233 },
  greenlight: { p1: null, p2: 28 },
  pizza:      { p1: null, p2: 13 },
  combined:   { p1: null, p2: 274 }
};

const DURATION_MIN = {
  islands:    { p1: 64.8, p2: 67.3, caveat: null },
  greenlight: { p1: null, p2: 150.0, caveat: 'Almost certainly idle sessions held open, not work. A session-length artifact, not engagement.' },
  pizza:      { p1: null, p2: 20.1,  caveat: 'Built on a different filter (duration > 0s) from Islands and Greenlight (all sessions).' }
};

const LCP_MS = {
  islands:    { p1: 1301, p2: 1340 },
  greenlight: { p1: null, p2: 1859 },
  pizza:      { p1: null, p2: 2731 }
};

/* Metrics that were asked for and deliberately not shown. These are rendered on
   the page as first-class content: an unmeasured metric is a finding, not a gap
   to be quietly dropped from a table. */
const NOT_SHOWN = [
  {
    metric: 'Crash rate',
    status: 'No result either period',
    detail: 'No result came back in Period 1 or Period 2.'
  },
  {
    metric: 'Network error rate',
    status: 'Excluded — not comparable',
    detail: 'Period 2 returned 0.05%, but that figure reflects one specific known issue across 5 sessions, not a general error rate. Period 1 has no figure at all. Showing the two together would imply a trend that does not exist.'
  },
  {
    metric: 'Average API response',
    status: 'No buildable mean',
    detail: 'No mean can be built in either period. Only median and 95th percentile per URL are possible, and that has not been built.'
  },
  {
    metric: 'Convert quote → policy',
    status: 'No event exists',
    detail: 'No bind or success event exists anywhere in the data, so conversion cannot be measured. See the flags below.'
  }
];

/* ---------------------------------------------------------------------------
   Broker intents — Islands, sessions containing at least one occurrence
   --------------------------------------------------------------------------- */

/* `kind` records what the number actually counts. The reports are emphatic that
   this distinction matters and that none of these confirm completion, so it is
   carried in the data rather than added as a footnote. */
const INTENTS = [
  { id: 'record',      label: 'Find/open a record',        p1: 6027, p2: 6201, kind: 'page-view', counts: 'Record Summary Viewed custom event' },
  { id: 'homepage',    label: 'Client homepage viewed',    p1: 2155, p2: 2282, kind: 'page-view', counts: 'Client Homepage Viewed custom event — see the instrumentation flag' },
  { id: 'attachments', label: 'Attachments',               p1: 3279, p2: 3398, kind: 'click',     counts: 'Click only — not confirmed a document was opened or downloaded' },
  { id: 'diary',       label: 'Diary',                     p1: null, p2: 736,  kind: 'click',     counts: 'Click only. Not built in Period 1, so no comparison exists.' },
  { id: 'retrieve',    label: 'Retrieve Quote',            p1: 657,  p2: 673,  kind: 'click',     counts: 'Click only — not confirmed a quote was actually retrieved' },
  { id: 'newquote',    label: 'Add New Quote',             p1: 613,  p2: 646,  kind: 'click',     counts: 'Click only — not confirmed a quote was actually started' },
  { id: 'mta',         label: 'MTA / Retrieve MTA',        p1: 441,  p2: 495,  kind: 'click',     counts: 'Click only — not confirmed an MTA was saved' },
  { id: 'cancel',      label: 'Cancel Policy',             p1: 380,  p2: 424,  kind: 'click',     counts: 'Click only — not confirmed a policy was actually cancelled' },
  { id: 'payments',    label: 'Payments (Transactions)',   p1: 285,  p2: 325,  kind: 'click',     counts: 'Click only, navigation to the area — not a payment taken' },
  { id: 'renewal',     label: 'Renewal',                   p1: 74,   p2: 85,   kind: 'click',     counts: 'Click only — not confirmed a renewal was processed' }
];

/* "Add New Quote" outside Islands. Tiny bases — the reports call these
   directional only, and the page repeats that wherever they appear. */
const NEWQUOTE_OTHER = [
  { segment: 'greenlight', p1: 48, p2: 40 },
  { segment: 'pizza',      p1: 7,  p2: 4 }
];

/* ---------------------------------------------------------------------------
   Flags, carrying the confidence the reports assign them
   --------------------------------------------------------------------------- */

const CONFIDENCE = {
  high:        { id: 'high',        label: 'Confirmed · high confidence', tone: 'error',   icon: 'fa-circle-exclamation' },
  confirmed:   { id: 'confirmed',   label: 'Confirmed pattern · 2 periods', tone: 'warning', icon: 'fa-triangle-exclamation' },
  repeats:     { id: 'repeats',     label: 'Repeats · consistent with P1', tone: 'info',    icon: 'fa-circle-info' },
  low:         { id: 'low',         label: 'Worth investigating · low confidence', tone: 'warning', icon: 'fa-triangle-exclamation' },
  unresolved:  { id: 'unresolved',  label: 'Unresolved · both periods', tone: 'error',   icon: 'fa-circle-exclamation' },
  open:        { id: 'open',        label: 'Open technical question', tone: 'info',    icon: 'fa-circle-info' }
};

const FLAGS = [
  {
    id: 'payment-plan',
    confidence: 'high',
    title: 'Payment-plan account page returns HTTP 500',
    body: 'The policy-details endpoint fails on the payment-plan account page, surfacing to brokers as error modals that force them to navigate away. Seen again 13 Aug – 7 Sep, still untriaged.',
    evidence: 'Confirmed by replay in two prior periods plus this period’s error data — three independent checks.',
    action: 'The strongest-evidenced issue in the report. Ready to raise with engineering.'
  },
  {
    id: 'cancel-renewal',
    confidence: 'confirmed',
    title: 'Cancel Policy is clicked ~5× as often as Renewal',
    body: 'Second period running at essentially the same ratio, with both growing at a similar rate (+11.6% against +14.9%).',
    evidence: 'Two periods showing the same shape raises confidence that this is systematic rather than incidental.',
    action: 'Confirm directly what the Cancel Policy control does on the screens where it is clicked. Real cancellation volume at 5× renewal volume would be a striking business fact; a mislabelled navigation click would not.'
  },
  {
    id: 'documents',
    confidence: 'repeats',
    title: 'Documents dominate the working session',
    body: 'Attachments is touched in 40% of Islands sessions, roughly 5× Retrieve Quote volume — consistent with Period 1.',
    evidence: '3,398 of 8,499 Islands sessions in Period 2; 3,279 of 8,453 in Period 1.',
    action: 'Worth checking whether the attachment list is searchable, or whether brokers are scrolling to find files.'
  },
  {
    id: 'pizza',
    confidence: 'low',
    title: 'Pizza fell sharply on a very small base',
    body: 'Sessions down 37.9%, quote-starts down from 7 to 4, and page load at 2,731ms is roughly double Islands’ 1,340ms.',
    evidence: 'Could be genuine declining adoption, could be the PZ01/PZ91 identification missing users, could be performance-driven.',
    action: 'Not enough volume to tell which. Confirm identification before drawing any adoption conclusion.'
  },
  {
    id: 'money-path',
    confidence: 'unresolved',
    title: 'The money path cannot be measured at all',
    body: 'No bind event and no payment-confirmation event exist anywhere in the data, so quote-to-policy conversion and payment success are both unmeasurable.',
    evidence: 'Unresolved in both periods.',
    action: 'The single biggest gap in the report. It will not close without new instrumentation — two custom events would make it answerable.'
  },
  {
    id: 'homepage-loop',
    confidence: 'open',
    title: 'Client Homepage Viewed may be firing in a loop',
    body: 'The raw event fired approximately 155 times per session in Period 1, against 23 times per session on Record Summary Viewed. That strongly suggests a re-render or route-change loop rather than 155 genuine visits.',
    evidence: 'The raw fire count was not re-checked in Period 2, so this remains unconfirmed either way. Session counts are used throughout this dashboard and are safe regardless.',
    action: 'Re-check the fire rate. The raw count (334,785 in Period 1) should not be used in any reporting.'
  }
];

/* ---------------------------------------------------------------------------
   Data notes
   --------------------------------------------------------------------------- */

const DATA_NOTES = [
  'Fresh queries only. No dashboard widgets. Sessions, not raw event fires.',
  'Jaunt is excluded throughout by construction — it is API-driven and not comparable to UI usage.',
  'Segment filter logic: Islands = User ID contains IS91 or IS01; Pizza = PZ01 or PZ91; Greenlight = BR01 or BR91.',
  'Six to eight of Period 2’s intent metrics ran on a ~1-day-offset rolling window (≈9 Aug – 9 Sep) rather than the exact 10 Aug – 8 Sep dates. Unlikely to matter at 30-day scale; noted for completeness.',
  'Pizza’s session-duration figure used a different filter (duration > 0s) from Islands and Greenlight (all sessions). Affects that one row only.',
  'Islands segment ID confirmed as 1370959 throughout both periods. A second ID (1333928) appears unused and is worth retiring on the LogRocket side to avoid future ambiguity.',
  'Active users, and duration and LCP for Pizza and Greenlight, were not built in Period 1 — LogRocket cannot split those chart types by segment without a duplicate metric per brand.'
];

/* ---------------------------------------------------------------------------
   Derived values — computed here so the arithmetic is visible
   --------------------------------------------------------------------------- */

/** Percentage change, or null when either end is missing. */
function change(from, to) {
  if (from === null || to === null || from === 0) return null;
  return ((to - from) / from) * 100;
}

/** Share of combined sessions, as a percentage. */
function share(part, whole) {
  if (part === null || whole === null || whole === 0) return null;
  return (part / whole) * 100;
}

const DERIVED = {
  /* Islands session growth. Every intent is read against this line. */
  islandsSessionChange: change(SESSIONS.islands.p1, SESSIONS.islands.p2),      // +0.54%
  combinedSessionChange: change(SESSIONS.combined.p1, SESSIONS.combined.p2),   // −1.38%

  segmentShare: {
    p1: {
      islands:    share(SESSIONS.islands.p1, SESSIONS.combined.p1),
      greenlight: share(SESSIONS.greenlight.p1, SESSIONS.combined.p1),
      pizza:      share(SESSIONS.pizza.p1, SESSIONS.combined.p1)
    },
    p2: {
      islands:    share(SESSIONS.islands.p2, SESSIONS.combined.p2),
      greenlight: share(SESSIONS.greenlight.p2, SESSIONS.combined.p2),
      pizza:      share(SESSIONS.pizza.p2, SESSIONS.combined.p2)
    }
  },

  /* Attachments reach, as a share of Islands sessions. */
  attachmentsReach: {
    p1: share(3279, SESSIONS.islands.p1),
    p2: share(3398, SESSIONS.islands.p2)
  },

  /* Cancel Policy against Renewal. */
  cancelRenewalRatio: {
    p1: 380 / 74,
    p2: 424 / 85
  }
};

/* Intents with a computed change, sorted two ways. Diary has no Period 1
   figure and is therefore absent from the growth view rather than shown at
   zero or at an invented baseline. */
const INTENTS_WITH_CHANGE = INTENTS.map(function (intent) {
  return Object.assign({}, intent, { change: change(intent.p1, intent.p2) });
});
