# Mobius PAS usage dashboard

A data dashboard for the Mobius PAS usage reports, built with the Buckholt design system in
this repository.

**Open `usage-dashboard/index.html` in a browser.** Nothing outside this folder was changed.

> The page loads the Font Awesome **Pro** kit documented in `CLAUDE.md`. Buckholt's markup uses
> `fa-regular` throughout and the regular face is a Pro style, so on a Free kit the icons render
> as empty `.notdef` boxes. That is the known dependency recorded in
> `discrepancies/known-issues.md`, not a fault in this page.

---

## What it shows

Period 2 (10 Aug – 8 Sep 2026) read against Period 1 (11 Jul – 9 Aug 2026), across four sections:

1. **Platform health** — session volume, segment mix, active users, page load, session duration,
   and the four metrics that were asked for and deliberately not shown.
2. **Broker intents** — nine workflows comparable across both periods, by volume and by growth.
3. **Flags** — six findings, each carrying the confidence the evidence actually supports.
4. **Data notes** — everything that could change how a figure should be read.

### The argument the page is built around

Every intent grew faster than Islands sessions did. That is not one metric moving; it is nine
independently-measured ones moving the same way, which is why the **By growth** view exists: a dot
plot against a dashed reference rule at +0.5%, where every intent lands to the right of the line.

### What the page refuses to do

The reports are emphatic that none of the workflow figures confirm completion, and the page carries
that through rather than footnoting it:

- the framing alert is the first thing under the title, not a caption at the bottom;
- **Diary** has no Period 1 figure, so it is absent from the growth chart and annotated
  *first measured* on the volume chart — never plotted at zero;
- **session duration is deliberately not charted**, because two of its three figures are artifacts
  of how a session ends and a chart would invite a comparison none of them supports;
- **Add New Quote outside Islands** is shown as two numbers, not a bar chart, because a three-session
  swing drives Pizza's whole percentage move;
- the four unmeasurable metrics get their own panel. An absent metric is a finding.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The page. Buckholt components throughout; the chart layer is empty containers filled at runtime. |
| `data.js` | Every figure, transcribed from the three reports. Derived values (shares, ratios) are computed here so the arithmetic is visible. |
| `dashboard.js` | The chart layer. Plain SVG, no charting library, no network request. |
| `dashboard.css` | Page layout and chart primitives. Every selector is prefixed `ud-`. |

---

## How it uses Buckholt

### Page structure

Built from the documented hierarchy, not from components dropped onto a canvas:

```
main
└─ .page-body
   └─ .page-frame  ×4
      └─ .container
         └─ .page-pane
            └─ .page-panel
               └─ components
```

Bootstrap `.container` / `.row` / `.col-*` carry the horizontal and responsive structure; Buckholt's
Frame, Pane and Panel carry hierarchy and vertical rhythm. The four Frames alternate surface so the
major sections read as separate regions.

### Components used

Alert, Button, Card, Heading attachment, Icon block, Key-value pair, List, Switch, Table, Tabs, Tag,
Text block — all as documented, none restyled.

### Custom CSS

`dashboard.css` does two things: it positions Buckholt components, and it defines the chart layer,
which Buckholt does not document. Every selector is prefixed `ud-`. Where a rule reaches a Buckholt
class it does so through a `ud-` ancestor, only to do something Buckholt leaves to the product, and
each such rule is commented at the point of use. There are four:

- `.ud-appbar-controls .form-check-label` — stops a two-word Switch label wrapping on a horizontal bar;
- `.ud-row-gutter` — sets Bootstrap's `--bs-gutter-y` to Buckholt's own `--page-panel-gap`, so a
  wrapped row keeps the documented 32px item rhythm instead of borrowing a Bootstrap spacing utility;
- `.ud-frame-alt` — gives a Frame a background, which Buckholt leaves to the product;
- `.ud-tableview .table td.ud-num` — right-aligns and tabularises figures in columns that must align.

Every spacing, colour, radius and border width is a Buckholt token or a `calc()` composed from
Buckholt tokens. The chart geometry constants — mark thickness, data-end radius, marker diameter, the
2px surface gap between fills — are the exception, and are declared once as named custom properties
at the top of the file, because Buckholt documents no data-visualisation layer.

---

## The chart layer

### Rules it holds itself to

- One axis per chart. Never two y-scales.
- Colour identifies an entity, never its rank — sorting the intents chart never repaints anything.
- A missing figure is drawn as an explicit absence, never as zero.
- Thin marks; 4px rounded data-ends anchored to a square baseline; 2px rules; markers at or above
  8px; a 2px surface gap between adjacent fills.
- Recessive grid and axes; selective direct labels.
- Chart text wears text tokens. A series colour never carries a label.
- Every chart has a hover layer and a real table behind it.

### Charts

| Chart | Form | Why |
|---|---|---|
| Share of combined sessions | Stacked bar, 2 periods | A part-to-whole shift; 3 series, so a legend plus direct labels |
| Sessions by segment | Small multiples, own scale each | Islands runs ~50× Pizza; a shared scale would flatten two segments into the axis and a second y-scale would be worse |
| Broker intent volume | Horizontal bars + Period 1 reference tick | One measure, ten categories. Period 1 is a reference mark in an ink token, not a second coloured series |
| Growth against the baseline | Dot plot with a dashed reference rule | The claim is about a line, so the chart is built around one |
| Average page load | Horizontal bars, segment colours | One measure across three entities |
| Cancel Policy vs Renewal | Grouped bars, 2 periods | The two periods are an ordinal ramp of one hue, not two identities |
| Reach | Two proportion bars on one scale | Lets the five-to-one ratio be read rather than taken on trust |

Charts size themselves in real pixels and re-render on resize, so label type keeps its true size at
every width rather than growing and shrinking with the plot. Category gutters are measured from the
longest label they actually have to hold; below the width where that stops working, labels move above
their own bars.

### Palette

Drawn entirely from Buckholt's expressive families and feedback tokens — no hand-picked hex — then
validated against the white card surface.

**Series identity**, fixed per segment everywhere on the page:

| Segment | Token | Value |
|---|---|---|
| Islands | `--expressive-deep` | `#1748d0` |
| Greenlight | `--expressive-tertiary-deep` | `#DB1256` |
| Pizza | `--expressive-quaternary-deep` | `#0E80A4` |

Validated all-pairs on `#ffffff`: lightness band **PASS**, chroma floor **PASS**, CVD separation
**PASS** (worst pair ΔE 14.7 deutan, 9.0 tritan), normal-vision floor **PASS** (worst pair ΔE 17.2),
contrast **PASS** (all ≥ 3:1). Measured contrast against the card: Islands 7.31:1, Greenlight 4.96:1,
Pizza 4.52:1 — all clear Buckholt's 4.5:1 text target, not just the 3:1 target for chart elements.

**Ordinal ramps**, used only for the earlier period inside a single-segment panel — one hue, two
steps, not a second identity. All three validate monotone, single-hue, with the light end clear of
the surface: Islands `--primary-30` → `--expressive-deep` (2.57:1 at the light end), Greenlight
`--accent-02-30` → tertiary deep (2.40:1), Pizza `--accent-03-30` → quaternary deep (2.00:1).

Chart ink is Buckholt's text tokens throughout: primary 17.40:1, secondary 9.59:1, tertiary 7.00:1
against the card. The white share label on a series fill measures 7.31:1.

### Accessibility

- **Identity is never colour alone.** Every chart with two or more series carries a legend; the
  single-series charts name each category on the axis.
- **Direction is never colour alone.** Every change indicator pairs its colour with an arrow icon and
  a signed figure.
- **A table behind every chart.** Real markup that is hidden, never absent, revealed by a Buckholt
  Button and shown unconditionally in print.
- **Texture as a second channel.** One hand-drawn lines fill at 45° and its 135° mirror, inked
  tone-on-tone over the series colour so the colour itself is unchanged. Off by default, switched on
  by the viewer, and forced on for print and `forced-colors`.
- Reduced-motion honoured; hit targets larger than the marks they serve.

---

## Deliberate deviations, and why

**No dark mode.** Buckholt documents no dark palette, and inventing one — even a plausible one —
would put values into circulation that Buckholt has not sanctioned. The page commits to a single
light treatment and paints its background and colours explicitly rather than borrowing the host's.
If Buckholt ships dark tokens, the chart layer swaps in one place: the token block at the top of
`dashboard.css`.

**Responsive breakpoints.** The page uses Bootstrap's grid, as Buckholt documents. Be aware that
`css/buckholt.css` ships stock Bootstrap breakpoints (576/768/992/1200/1400) while the live reference
build uses 896/1088/1312/1520/1720 — see `discrepancies/build-provenance.md`. The column classes here
degrade sensibly on either scale, but the exact viewport at which each row re-flows differs between
the two builds.

---

## Verified

Checked headless in Chromium at 1440, 1280, 992, 768, 480, 375 and 320px:

- zero horizontal overflow at every width;
- no console errors or page errors at any width;
- every chart renders, and no mark or label escapes its own plot;
- no Bootstrap stylesheet is loaded — `buckholt.css`, `buckholt-ai-fixes.css` and `dashboard.css` only;
- Tabs, tooltips, table-view toggles and the texture switch all work, including the chart in the
  initially-hidden tab pane.
