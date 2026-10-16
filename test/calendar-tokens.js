/* The Calendar's day-cell tokens, against the dev-annotated Figma.

   These are the values the annotated export of Frame 15100 names, plus the
   two the frames settle by measurement: the Active stroke (#0F40C5, measured
   on CA-03-03 at 2x) and the Resting raised edge (darkened from the Figma's
   #DADADA to clear spec 5.3's 3:1). `prototypes/BACS-calendar/PROTOTYPE.md`
   has the full account.

   Most of the fills are **translucent overlays**, so the surface behind them
   is part of the result: the first assertion is that the content area is
   white, because without it every one of them composites to the wrong
   colour while every computed value below still passes.
*/
const { launch, BASE, STILL, counter } = require('./config');
const { is, ok, done } = counter();

const WHITE   = 'rgb(255, 255, 255)';
const OVERLAY_07 = 'rgba(26, 26, 26, 0.07)';   // --disabled-overlay-01

(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  await p.goto(BASE + '/prototypes/BACS-calendar/index.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: STILL });

  const css = (sel, prop) => p.evaluate(
    ([s, k]) => { const el = document.querySelector(s);
                  return el ? getComputedStyle(el)[k] : 'NO ELEMENT ' + s; },
    [sel, prop]);

  // ---------- the surface the overlays composite onto ----------
  is('content surface is white', await css('main#main', 'backgroundColor'), WHITE);
  is('body is still Buckholt\'s own page colour', await css('body', 'backgroundColor'), 'rgb(251, 251, 251)');

  // ---------- Resting / Default: card-background + clickable-border ----------
  const D = '.calendar-cell--default';
  is('Resting fill', await css(D, 'backgroundColor'), WHITE);
  is('Resting side stroke', await css(D, 'borderTopColor'), 'rgb(218, 218, 218)');      // --ui-border-02
  is('Resting raised edge is 3px', await css(D, 'borderBottomWidth'), '3px');
  // Spec 5.3, not the Figma: #DADADA is 1.40:1 and the edge is the only
  // thing marking the cell interactive.
  is('Resting raised edge darkened for 5.3', await css(D, 'borderBottomColor'), 'rgb(145, 145, 145)');
  is('Resting padding', await css(D, 'padding'), '8px');

  // ---------- Read-only: card-background + disabled-overlay-01 ----------
  const R = '.calendar-cell--readonly';
  is('Read-only fill', await css(R, 'backgroundColor'), WHITE);
  is('Read-only stroke', await css(R, 'borderTopColor'), OVERLAY_07);
  is('Read-only has no raised edge', await css(R, 'borderBottomWidth'), '1px');
  is('Read-only pads 10px at the bottom', await css(R, 'padding'), '8px 8px 10px');

  // ---------- Disabled: disabled-overlay-01 on both ----------
  const X = '.calendar-cell--disabled';
  is('Disabled fill', await css(X, 'backgroundColor'), OVERLAY_07);
  is('Disabled stroke', await css(X, 'borderTopColor'), OVERLAY_07);
  is('Disabled pads 10px at the bottom', await css(X, 'padding'), '8px 8px 10px');

  // ---------- Blank: ui-overlay-01, no stroke ----------
  const BL = '.calendar-cell--blank';
  ok('Blank fill is --ui-overlay-01',
     /^rgba\(26, 26, 26, 0\.01[56]\)$/.test(await css(BL, 'backgroundColor')));
  is('Blank has no visible stroke', await css(BL, 'borderTopColor'), 'rgba(0, 0, 0, 0)');

  // ---------- the date badge ----------
  const B = '.calendar-cell-date';
  is('badge type size', await css(B, 'fontSize'), '14px');          // --typescale-02
  is('badge weight', await css(B, 'fontWeight'), '500');            // --font-weight-md
  is('badge tracking', await css(B, 'letterSpacing'), '0.25px');
  is('badge line box', await css(B, 'lineHeight'), '20px');         // the annotated 24 x 20
  is('badge circle', await css(B, 'width') + ' ' + await css(B, 'height'), '24px 24px');
  is('badge fill', await css(B, 'backgroundColor'), 'rgba(26, 26, 26, 0.04)');  // --ui-overlay-02
  is('badge digits', await css(B, 'color'), 'rgb(26, 26, 26)');

  const T = '.calendar-cell-date--today';
  is('today badge fill', await css(T, 'backgroundColor'), 'rgb(183, 198, 238)');   // --expressive-soft
  is('today badge digits', await css(T, 'color'), 'rgb(9, 38, 118)');              // --expressive-rich

  // ---------- Active, once a future day is selected ----------
  await p.click('[data-date="2026-10-22"]');
  const S = '.calendar-cell--selected';
  is('Active fill', await css(S, 'backgroundColor'), 'rgba(23, 72, 208, 0.1)');    // --feedback-overlay-info
  // CA-03-03 at 2x: a flat #0F40C5 across the 2px side band and the 6px
  // bottom band. The annotation's `clickable-border-hover` is not followed.
  is('Active stroke', await css(S, 'borderTopColor'), 'rgb(15, 64, 197)');         // --action-01
  is('Active raised edge', await css(S, 'borderBottomColor'), 'rgb(15, 64, 197)');
  is('Active raised edge is 3px', await css(S, 'borderBottomWidth'), '3px');
  is('Active padding', await css(S, 'padding'), '8px');
  is('Active label', await css(S + ' .calendar-cell-label', 'color'), 'rgb(23, 72, 208)');

  // ---------- the point of the 10px: labels sit on one line ----------
  const gaps = await p.evaluate(() => {
    const gap = sel => {
      const cell = document.querySelector(sel);
      const label = cell && cell.querySelector('.calendar-cell-label');
      if (!label) return null;
      return Math.round(cell.getBoundingClientRect().bottom - label.getBoundingClientRect().bottom);
    };
    return { flat: gap('.calendar-cell--readonly'), raised: gap('.calendar-cell--selected') };
  });
  ok('a read-only cell has a label to measure', gaps.flat !== null);
  ok('a selected cell has a label to measure', gaps.raised !== null);
  is('flat and raised labels sit the same distance off the bottom', gaps.flat, gaps.raised);

  await b.close();
  done();
})();
