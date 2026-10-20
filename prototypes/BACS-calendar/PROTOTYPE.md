# BACS Calendar prototype — build notes

A clickable prototype of the Calendar tab, built from `calendar-spec.md` and
`screenshots/`.

| File | What it is |
| --- | --- |
| `index.html` | The page. Buckholt runtime contract, Buckholt page structure, Buckholt components. |
| `bacs-calendar.css` | Prototype-only. Page layout for the modal and the phone scroller, and one Buckholt variable binding. |
| `bacs-calendar.js` | Rendering and wiring for CA-00 to CA-06. In memory; reloading resets to the seed data. |
| `PROTOTYPE.md` | These build notes. |
| `SPEC-CHANGES.md` | The list to feed back into `calendar-spec.md`, the Figma frames and Buckholt. |

Two pieces this feature needs live outside this folder, because they are
shared:

| Path | What it is |
| --- | --- |
| `shared/calendar/` | The Calendar component: month grid, day cells, month picker. Spec 3.2 asks for it as its own folder. See `calendar/calendar.md`. |
| `data/calendar.js` | `CalendarData` — the collection-day data and every rule in spec 11. Spec 11.4 asks for it in a shared location "so Process can read collection days later", and Process lives in the BACS Import prototype. |

Open `index.html` directly in a browser. Everything is relative; nothing is
built.

## Folder name

The spec package arrived as `BACS Calendar/`; this folder is
**`BACS-calendar`**. The sibling feature is `BACS-import`, and the tabs link
across folders, so a space would mean `%20` in every cross-tab href. The
hyphen keeps the convention and the links clean. Nothing inside the package
changed.

## Where the Calendar tab now points

Calendar was a placeholder route inside the BACS Import prototype. It is a
real page now, so:

- `Originators/index.html` → `../BACS-calendar/index.html`
- `BACS-import/index.html` (both tab strips) → `../BACS-calendar/index.html`
- `BACS-import/bacs-import.js` keeps the `#/calendar` route so an old link
  still resolves, but it hands over to the new page instead of drawing a
  placeholder.
- **Process is still a placeholder**, unchanged.

## What came from Buckholt

Almost everything. The frames turned out to be built from documented
components far more completely than the spec's own list suggests, and three
of the identifications were settled by measuring the Figma against
`css/buckholt.css` rather than by eye:

| Part of the page | Buckholt component | How it was settled |
| --- | --- | --- |
| Summary cards | Card holding a **Heading attachment**: `.text-block > .heading > .heading-content + attachment`, with the card's label as `.eyebrow` and its value as `h2.title-03` | `.eyebrow` is 14px / 300 with a **1rem bottom margin**, which is exactly the label size and the label-to-value gap measured on CA-00-01 |
| Change schedule | Button, **ghost**, default size, with `.btn-icon` | The label's right ink ends 16px short of the card's content edge — the Button's own `--button-padding-x` — and its baseline sits 11px below the eyebrow's, which is the default 40px height, not `btn-sm` |
| Its icon | `fa-regular fa-swap-arrows` | `foundations/iconography/catalogue.md` lists it as **Change**: "Swap, replace, or exchange" |
| Schedule options in the modal | Card, **`.card-selectable`** with a native radio | `.card-selectable.active` is `rgba(15,64,197,0.1)` on `#0f40c5` with a 3px bottom border — pixel-for-pixel the selected card in CA-04-03 |
| The twelve month buttons | **Response button**, single select | All four of its state colours match the frame exactly: resting `--action-05` over white is `#EFEFEF`, its border over that fill is `#E0E0E0`, its label is `#454545`, and checked is `--action-04` on `--action-02` (`#3F66D1`) — every one measured |
| Collect on | **Dropdown**, documented multiselect, wired by `components/dropdown/dropdown.js` | Buckholt's `.dropdown-menu` already has `max-height: 15.8125rem; overflow-y: auto`, which is the "about five rows visible" spec 9.2 asks for |
| Tags | Tag, `.tag-dismissible.expressive-light` | Built by `dropdown.js` itself |
| Weekday column headers | `.label-02` | `.table th` is 16 / 24 / 500 / 0.25px in `--text-secondary`; the frame's headers measure 16px, `#454545`, and clearly heavier than the 300-weight labels beside them |
| Undo in the toast | **`button.link-standalone`** | `#1748D0` (`--link-colour`), no underline, and **flush** with the note — a ghost Button would sit 16px in. Buckholt ships `button.link-standalone { background: none; border: none; padding: 0 }` for exactly this |
| Modal, Toast, Page navigation, Link | As documented | |

Only the month grid, the day cells and the month picker shell are new, and
they are in `shared/calendar/`.

## Revision, 16 October 2026 — the dev-annotated Figma

A dev-annotated export of the day-cell states ("Frame 15100") settled the
five fills and strokes spec 5.2 could only give as "≈", and two things it did
not mention at all. What changed:

| | Was | Now |
|---|---|---|
| Selected fill | `--expressive-pale` | `--feedback-overlay-info` |
| Disabled fill | `--ui-background-04` | `--disabled-overlay-01` |
| Blank fill | `--ui-background-02` | `--ui-overlay-01` |
| Read-only / disabled stroke | `--ui-border-03` | `--disabled-overlay-01` (same value, the annotated name) |
| Read-only / disabled bottom padding | 8px | 10px, so labels line up with raised cells |
| Date badge type | inherited 300 | `--typescale-02` / 500 / 0.25px |
| Today's digits | `--text-primary` | `--expressive-rich` |
| Resting raised edge | `--ui-border-01` (#919191) | `--ui-border-02` (#DADADA), as drawn |
| Content surface | `--body-background` (#fbfbfb) | `#ffffff`, via `.app-main-surface` |

The surface is the one that mattered most. The new fills are **translucent
overlays**, so what they come out as depends on what is behind them, and the
page was on Buckholt's `#fbfbfb` while every BACS frame draws white. On
`#fbfbfb` a disabled cell rendered `#EBEBEB` against the frame's `#EFEFEF`;
on white it is `#EFEFEF` exactly. `prototypes/shared/app-shell.css` now
carries `.app-main-surface` and the three BACS pages put it on `<main>`.

The annotation's Active stroke (`clickable-border-hover`) was **not**
followed: CA-03-03 exports at 2x and measures a flat `#0F40C5` on both the
2px side band and the 6px bottom band, which is `--action-01` and the hex
spec 5.2 gives. Recorded as A6 in `SPEC-CHANGES.md`, along with A7 for the
surface.

The raised edge went the same way in a second pass the same day. It had
stayed `--ui-border-01` for spec 5.3's 3:1 while the Figma draws `#DADADA`,
and it was the one place the prototype was visibly darker than the frame.
Design chose the frame. Deviation 2 below is withdrawn, and A8 in
`SPEC-CHANGES.md` carries the accessibility position.

## Deviations

### 1. The folder for the new component is top level, not inside `components/`

Spec 3.2 says "Create a new folder called `shared/calendar/` in the Git structure,
alongside the existing Buckholt component folders". It is at the top level,
beside `components/`, rather than inside it.

`components/` is the Buckholt catalogue. Every folder in it is verified
against a Code & specs page in `code-specs-html/` by
`test/source-parity.py`, in both directions. A component
Buckholt has never documented cannot be verified that way, and filing it
there would present an invention as canonical — which is the one thing
`AGENTS.md` is most insistent about. The spec's own file names
(`calendar.md`, `calendar.css`, `example.html`, against the catalogue's
`rules.md` / `examples.html`) point the same way. `prototypes/shared/blade.css` made
the same choice for the Blade.

### 2. The Default cell's raised edge follows the Figma, not spec 5.3

**Withdrawn 16 October 2026.** This was a deviation and is no longer one:
the edge is `--ui-border-02` (#DADADA), the same colour as the side borders,
thickened — exactly as CA-00-01 draws it at 2x.

Spec 5.3 requires 3:1 against white and says to darken the grey if the Figma
falls short. It does, badly: **#DADADA is 1.40 : 1**. The build ran with
`--ui-border-01` (#919191, 3.15 : 1) until design saw the two side by side
and called it: against the frame it reads as a heavy charcoal underline
rather than a raised edge, and it changes the character of the whole grid.

So **spec 5.3 is not met at rest**, by decision. What that does and does not
put at risk is set out in `../shared/calendar/calendar.md` under Contrast —
in short, no state depends on the edge (every state carries a fill change
and a text label), and both interaction affordances are well clear: hover is
`--action-01` at 8.20 : 1 and focus a 3px `--focus-01` ring at 7.31 : 1.

A8 in `SPEC-CHANGES.md` proposes the matching spec wording. Reinstating 5.3
is one line: `--calendar-cell-edge: var(--ui-border-01)`.

### 3. The disabled cell's date is not muted

Spec 5.2 describes the Disabled cell as "Grey fill (≈ #EFEFEF), muted date",
under a column headed **"Look (confirm in Figma)"**. Confirmed: the fill is
`#EFEFEF`, but the date is **`#1A1A1A`** — full strength, the same as every
other cell. Since the spec's precedence rule covers "data or behaviour" and
that column defers to the Figma on look, the build follows the Figma.

Nothing is lost: the grey fill and the absence of a raised edge already mark
the cell, and the date reads at 14.07 : 1 on its badge. Raised as **A1** in
`SPEC-CHANGES.md` — it is a one-line change either way.

### 4. The eyebrow stays Buckholt's grey

The frame draws the card labels in `#454545`; Buckholt's `.text-block` sets
`--eyebrow: var(--text-tertiary)`, which is `#595959`. The build keeps
Buckholt's. One step on the grey ramp is not worth overriding a component
default for, and both clear AA comfortably. Raised as **A2**.

### 5. The month picker is a three-column grid, not a wrapping flex row

Spec 7 draws "a 3 × 4 grid of month buttons". Buckholt's Response button
container, `.response-btn-input`, is `display: flex; flex-wrap: wrap`, so the
rows come out ragged — a Button is only as wide as its label plus padding,
and `Sep` is not `May`. Scoped to the popover, `calendar.css` makes the
container a three-column grid.

Only the container changes. The Buttons keep their canonical markup, their
states and the 8px gap `.response-btn-input` itself sets, and three 1fr
tracks in the popover's 208px of content come to **64px each** — both the
width CA-01-01 draws and Buckholt's own `--button-min-width`.

### 6. Room is reserved for the open options list

Spec 9.2 wants the options list to "float over the content below". In this
modal the content below is the footer. Measured at 1920 × 1206 the open list
runs y697–950 over a footer at y743–791: **a click aimed at Save schedule
landed on Day 2.**

`dropdown.js` sets the list's offset itself, so Popper never gets the chance
to flip it upward, and `data-bs-auto-close="false"` — which the canonical
multiselect markup requires — keeps it open while you choose. The page
therefore reserves the list's own height while it is open, so the list floats
over empty space and the space goes again when it closes. The figure used is
Buckholt's own `.dropdown-menu` max-height, not a new one.

This is a Buckholt limitation, not a Calendar one: any Buckholt multiselect
near the bottom of a container does it. Raised as **C1**.

### 7. The top bar does not come from TODAY

Spec 3.3 and 11.1: "The top bar date and time come from the same TODAY
constant as the calendar." **It does not.** The clock shows the real time, as
it does on Originators and Import.

The build was pinned to TODAY first, which is what the spec asks for and
which keeps this page internally consistent — the grid marks 13 October 2026
as today. But that made the clock jump whenever you changed tab, and one
clock across the whole prototype was preferred. Settled on 15 October 2026.

The cost is visible and worth stating: **the top bar and the grid disagree
about what day it is.** The bar says today's real date; the calendar still
marks 13 October 2026 as today, because `TODAY` drives the seed data, the
read-only cut-off and every figure in spec 11.5. Nothing below the top bar
changed.

`Shell.startClock()` is back to taking no argument, so the clock code in
`prototypes/shared/app-shell.js` is byte-identical to what it was before this
feature; only its comment changed. Recorded as **A3**.

### 8. The month-bar controls are 40px, not 44px

Spec 13 asks for touch targets of at least 44 × 44. The two chevrons and the
month button are **40px**, which is Buckholt's `--button-height` (2.5rem) and
is what the frames draw. The Button is left alone rather than resized
locally. The picker's month buttons are 44px and the day cells 88px tall, so
only these three are affected. Raised as **C2**.

### 9. Tag order is corrected after the component builds it

Spec 9.2 wants the day tags "sorted ascending". `dropdown.js` inserts them
with `localeCompare`, which puts Day 15 before Day 2. The page reorders the
tag nodes numerically after every rebuild; the markup, the classes and the
component's behaviour are untouched. Raised as **C3**.

The same pass renames each tag's close button to *Remove day N*, which spec
13 asks for and `dropdown.js` leaves as "Close".

### 10. The toast is 352px on this page

`prototypes/shared/app-shell.css` narrows the shared toast to the 320px the
Originators and Import frames draw. The Calendar frames draw **352px**, which
is Buckholt's own `--toast-max-width` default, and these toasts carry a
title, a note and an action rather than one line. `bacs-calendar.css` rebinds
Buckholt's variable back to its default for this page; the other two features
are untouched.

### 11. The grid is not `role="grid"`

Spec 13 asks for buttons with `aria-pressed` and full accessible names, which
is what the build does. It does not add `role="grid"`: that would promise
roving focus and arrow-key navigation the component does not have. Each
cell's name carries the whole date, so the column headers are not needed to
understand it.

### 12. Phone layout is undefined by the spec

Every frame is desktop. Below 768px the columns go even and the weekday names
shorten to three letters; below 576px the grid keeps a 32rem minimum width
and scrolls sideways inside its own region, so the page never scrolls. The
Schedule card's value and its Change schedule Button both wrap at 375px
rather than stacking, which is Buckholt's `.heading` row reflowing on its
own — no override was added. Raised as **A4** for a decision.

## Verification

Run the mirror build and the suites from a static server; `calendar-spec.md`
section 11.5's table is checked directly against `data/calendar.js` in Node.

| Suite | What it covers | Assertions |
| --- | --- | --- |
| `test/calendar-data.js` | Section 11 in Node: TODAY, the 74 sent batches, every row of the 11.5 table, the CA-02-01 correction, cell states and labels, day-of-month resolution, override add/remove, snapshot and restore | 42 |
| `test/calendar-flows.js` | CA-00 overview, CA-01 month navigation and the picker, CA-02 add and remove, CA-06 bank holidays, cell states, copy, the live clock | 59 |
| `test/calendar-modal.js` | CA-03, CA-04 and CA-05 end to end: the three options, Collect on, the empty-selection rule, saving, the toasts, Undo, Cancel, and saving with no change | 66 |
| `test/calendar-tokens.js` | The day-cell fills, strokes, padding and badge type against the dev-annotated Figma, and the white content surface the translucent fills need | 34 |
| `test/accessibility.js` | Accessible names, `aria-pressed`, non-focusable read-only and disabled cells, keyboard operation, the 3px focus ring, picker and modal focus behaviour, overflow | 32 |
| `test/responsive.js` | Fifteen widths from 1920 to 320: no page overflow, seven columns, the weekday-name switch, the modal at 375px | 47 |
| `test/regression.js` | Originators and BACS Import unchanged, the new tab links, the old `#/calendar` route, Process still a placeholder, and `Shell.showToast` still behaving for its existing callers | 20 |
| `test/source-parity.py` | Buckholt canonical markup, both directions | PASS |

**300 assertions, all passing**, plus source parity.

### What the mirror cannot check

Typekit and the Font Awesome Pro kit are not reachable from the build
container, so the mirror falls back to Arial and Font Awesome Free. Buckholt
sets every line height in rem, so vertical rhythm and every box measurement
are unaffected and were compared against the frames directly; **text widths
and Pro-only glyphs were not**. The `fa-swap-arrows` icon in particular does
not render offline.
