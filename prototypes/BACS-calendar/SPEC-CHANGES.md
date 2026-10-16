# BACS Calendar — changes to feed back into the spec, the Figma and Buckholt

Written 14 October 2026 from building the prototype in this folder. Three
sections: changes to `calendar-spec.md`, changes to the Figma frames, and
tickets for the Buckholt design system rather than for this feature.

Every item says what the prototype does now, so the spec can be brought in
line with something already working rather than with a proposal.

Section 12 of the spec already lists the Figma data errors, and all seven are
built the spec's way. They are not repeated here.

---

## A. Changes to `calendar-spec.md`

### A1. The disabled date is not muted in the Figma — **decision needed**

Spec 5.2, Disabled row: "Grey fill (≈ #EFEFEF), **muted date**", under a
column headed "Look (confirm in Figma)".

Confirmed in the Figma: the fill is `#EFEFEF`, and the date is **`#1A1A1A`**
— full strength, identical to a Default cell's date. Nothing in section 12
corrects it, so it reads as intentional.

**The prototype follows the Figma**, because the precedence rule covers "data
or behaviour" and that column defers to the Figma on look. Nothing is lost:
the grey fill and the missing raised edge already mark the cell, and the date
reads at 14.07 : 1 against its badge.

Either settle the spec to "date unchanged", or say muted and the build
changes one token. Suggested spec wording if muted is wanted:

> Grey fill (≈ #EFEFEF), date in `--text-secondary` rather than
> `--text-primary`.

### A2. The card label's grey — **minor, no change made**

The frames draw the summary-card labels in `#454545`. Buckholt's
`.text-block` sets `--eyebrow: var(--text-tertiary)`, which is `#595959`.

**The prototype keeps Buckholt's.** One step on the grey ramp is not worth
overriding a component default for, and both clear AA (9.59 : 1 and
7.00 : 1). Flagged only so the difference is on the record.

### A3. The top bar does not come from TODAY — **settled, spec needs amending**

Spec 3.3: "The top bar date and time come from the same **TODAY** constant as
the calendar (section 11.1)."

**Decided 15 October 2026: the clock stays live on every page**, Calendar
included. Originators and BACS Import have shown the real time since
30 September, and one clock across the prototype beat a clock that changed
when you changed tab.

So the top bar and the calendar disagree about the date: the bar shows today,
the grid still marks 13 October 2026 as today. `TODAY` is unchanged and still
drives the seed data, the read-only cut-off and every figure in 11.5 — only
the top bar is uncoupled from it.

Suggested replacement for the section 3.3 bullet:

> - The top bar clock shows the **real** time on every tab, as the rest of
>   the prototype does. It is deliberately **not** tied to `TODAY`: the
>   calendar's today is fixed at 13 October 2026 by the seed data, so the bar
>   and the grid will disagree about the date. A real build reading a live
>   `TODAY` would not have the problem.

### A4. Phone layout is not specified — **decision needed**

Every frame is 1920 wide. The prototype's own treatment, on the local
build's breakpoints:

- **below 768px** — the seven columns go even, cells shorten from 88px to
  72px, and the weekday names shorten to Mon / Tue / Wed …;
- **below 576px** — the grid keeps a 32rem minimum width and scrolls
  sideways inside its own focusable region, so the page itself never
  scrolls;
- the Schedule card's value and its Change schedule Button both wrap rather
  than stacking, which is Buckholt's `.heading` row reflowing on its own.

Worth a paragraph in section 4 either way. The one judgement call that could
go differently is the horizontal scroller: the alternative is a stacked
day-list below 576px, which is a different design rather than a reflow.

### A5. "Collected" on a past working day that did not collect

Spec 5.2's Read-only row gives three label cases, the third being "none (past
non-collection working day)". With the seed data **that case never appears**:
`sentBatches` covers every working day from 1 July to 13 October, so every
past working day is a collection day.

The prototype implements the case anyway. Worth either seeding one gap so the
state is visible in the prototype, or noting in 11.4 that the case is
unreachable with this seed.

---

### A6. The day-cell tokens, from the dev-annotated Figma — **settled, built**

Added 16 October 2026, after a dev-annotated export of the day-cell states
(Figma "Frame 15100") was supplied. It names a Buckholt token for every fill
and stroke, which settles five values spec 5.2 could only give as "≈" under a
column headed "confirm in Figma". The prototype now uses the named tokens.

| Spec 5.2 says | Annotation names | Composites to | Built |
|---|---|---|---|
| Selected: pale blue fill ≈ #E8EDFB | `feedback-overlay-info` | #E8EDFA on white | yes |
| Disabled: grey fill ≈ #EFEFEF | `disabled-overlay-01` | #EFEFEF on white | yes |
| Blank: very light grey ≈ #FBFBFB | `ui-overlay-01` | #FCFCFC on white | yes |
| Read-only: faint border | `disabled-overlay-01` | #EFEFEF on white | yes |
| Resting/Read-only/Disabled fill | `card-background` | #FFFFFF | unchanged |

Two further things the annotation settles:

- **A cell with no raised edge pads 10px at the bottom**, annotated
  `8px, 8px, 10px, 8px`, so that 10 + its 1px border equals the 8 + 3 of a
  raised cell and the labels line up. The prototype padded 8px all round and
  sat 2px low on read-only and disabled cells.
- **The date badge is `--typescale-02` / weight 500 / 0.25px tracking**, and
  today's digits are **`--expressive-rich`** on the `--expressive-soft`
  badge. The prototype inherited the page's 300 weight and left the digits
  `--text-primary`.

Suggested spec wording for 5.2, replacing the four "≈" hexes:

> Fills and strokes are Buckholt tokens, as the Figma annotates them:
> Resting and Read-only `card-background`; Active `feedback-overlay-info`;
> Disabled and every Read-only/Disabled stroke `disabled-overlay-01`; Blank
> `ui-overlay-01`. These are translucent overlays — they are correct only on
> the white content surface the frames draw.

**One annotation is not followed.** It names the Active stroke
`clickable-border-hover`, which `css/buckholt.css` hardcodes as `#1748d0` on
`.card-clickable:hover`. CA-03-03 exports at 2x and its Selected cell's
stroke measures a flat **`#0F40C5`** across both the 2px side band and the
6px bottom band — `--action-01`, and the hex spec 5.2 already gives. The
annotation names a token, the frame gives the value, and where they disagree
the measurement wins. Worth checking whether the live Buckholt build's
`clickable-border-hover` is `--action-01`; if it is, the local build's
`#1748d0` is a build difference, not a design one.

### A7. The content surface is white, not Buckholt's page colour — **settled, built**

Not a calendar question, but it is what made the calendar's fills wrong, so
it belongs here. Buckholt's `--body-background` is `#fbfbfb` and nothing
between `<body>` and the page content paints over it. **Every BACS frame
puts the content area on `#ffffff`** — sampled in the right-hand page margin
of OR-00-01, IM-00-01 and CA-00-01, all three return pure white.

Because Buckholt's state fills are translucent overlays, the surface changed
what they came out as: a disabled cell rendered `#EBEBEB` against the frame's
`#EFEFEF`, a blank cell `#F7F7F7` against `#FBFBFB`. On white they land on
the frame values exactly.

`prototypes/shared/app-shell.css` now carries `.app-main-surface`, which the
three BACS pages put on `<main>`. It is opt-in because the Mobius navigation
prototype's own reference still shows `#fbfbfb`. Originators' two sticky
layers repainted the old surface behind themselves and were moved to white
with it.

Worth asking Buckholt whether an application content area is meant to be
white or `--body-background`; `patterns/page-layout` does not say.

## B. Changes to the Figma frames

Section 12 already covers the data errors. These are the two things it does
not.

### B1. The month picker's disabled months are not drawn

Section 12 notes that CA-01-01 shows all months enabled and that the spec's
"Proposed" rule should win. The frame has no disabled treatment drawn at all,
so there is nothing to match against. The prototype uses Buckholt's own
Response button disabled state. Worth a frame showing it, since it is the
first thing a user meets when they try to go back past July 2026.

### B2. No frame shows a focused cell

Spec 5.2 asks for a focus ring "at least 3px, offset from the border", which
is wider than Buckholt's 2px Button ring. The prototype draws 3px in
`--focus-01` at a 2px offset. A frame would settle it.

---

## C. Tickets for Buckholt

These are design-system issues, not Calendar ones. Each came up building this
page and each would affect any other team hitting the same composition.

### C1. A multiselect near the bottom of a container swallows the clicks below it

`components/dropdown/dropdown.js` positions the options list itself —
`menu.style.transform = translate(0, toggle.offsetHeight + 2)` on show — so
Popper never gets the chance to flip the list upward when there is no room
below. With `data-bs-auto-close="false"`, which the canonical multiselect
markup requires, the list stays open while the user chooses.

Measured in this feature's modal at 1920 × 1206: the open list runs y697–950
over a footer at y743–791, and `document.elementFromPoint` at the Save
button's centre returns **`cal-day-option-2`**. A click aimed at Save
selects Day 2.

The prototype reserves the list's height while it is open so the list floats
over empty space. That is a workaround at page level. The fix belongs in the
component: let the list flip when there is no room below it.

### C2. Buckholt's Button is 40px; WCAG and this spec want 44px

`--button-height: 2.5rem`. Spec 13 asks for touch targets of at least
44 × 44, and WCAG 2.2's 2.5.8 Target Size (Minimum) asks for 24 × 24 with
AAA 2.5.5 at 44 × 44. The default Button clears 2.5.8 but not 2.5.5.

`.btn-response` is already `min-height: 2.75rem` (44px), so the scale is not
consistent with itself either. The prototype leaves the Button alone and
accepts 40px on the three month-bar controls. Worth a documented position on
which Buttons are 44px and why.

### C3. The multiselect sorts tags as text, not by value

`dropdown.js` inserts each tag with `localeCompare` on its label, so for
options named "Day 1" … "Day 31" the tags come out Day 1, Day 10, Day 11, …,
Day 2, Day 21. Any numeric option set has the problem.

The prototype reorders the tag nodes numerically after each rebuild. A
`data-sort-value` on the option, or a numeric comparator when every label
ends in a number, would fix it upstream.

### C4. The multiselect names every tag's close button "Close"

`dropdown.js` sets `aria-label="Close"` on each tag's `.btn-close`, so a
screen-reader user hears the same name for all of them. Spec 13 asks for
*Remove day N*; the prototype renames them after each rebuild. The component
could take the name from the tag's own label.

### C5. `.card-selectable` has a selected state with nothing to turn it on

`css/buckholt.css` defines `.card-selectable.active` — the pale blue fill and
blue border that CA-04-03 draws — but there is no `:has(:checked)` rule and
no component script that adds the class. Every application has to toggle
`.active` itself, and the Card Code & specs page documents neither the class
nor that requirement.

Either add `.card-selectable:has(.form-check-input:checked)` alongside the
`.active` rule, or document the class and say the application owns it.

### C6. The canonical `.card-selectable` radio has no accessible name

The Code & specs example is `<input class="form-check-input" type="radio"
id="radio-selectablecard">` with the title in an `h4` that is not associated
with it. A screen-reader user hears an unlabelled radio.

The prototype adds `aria-labelledby` and `aria-describedby` at application
level and leaves `components/card/examples.html` source-exact, per
`AGENTS.md`. The documented example is the thing to fix.

### C7. The stacked Key-value pair collapses its gap to zero

`.key-value` declares `--keyvalue-gap: 0.5rem`, but `.key-value-stacked` sets
`gap: unset`, which computes to 0 on a flex container — so the variable is
dead in the stacked form and there is no documented way to space a stacked
key from its value.

It did not block this build: the summary cards turned out to be a Heading
attachment, whose `.eyebrow` carries `margin-bottom: 1rem`. But a team
reaching for Key-value for the same label-and-value pattern would find the
two lines touching.

### C8. The Size scale for Key-value pairs is two independent axes

`.key-value-xs` and `.key-value-sm` set only `.key`; `.key-value-lg`,
`.key-value-xl` and `.key-value-display` set only `.value`. The
documentation presents them as one scale — xs, sm, default, lg, xl, display —
so there is no single step giving a 14px key with a 24px value, which is what
these cards draw.

Either document that the two halves are set independently and may be
combined, or add the missing steps.
