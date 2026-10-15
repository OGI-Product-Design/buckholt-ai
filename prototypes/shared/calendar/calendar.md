# Calendar

**This is not a Buckholt component.** Nothing in this file is Buckholt
guidance, and nothing here may be cited as design-system evidence.

`BACS-calendar/calendar-spec.md` section 3.1 records the reason: "The
calendar is new to Buckholt. Nothing in Buckholt covers the month grid, the
day cell states or the month picker popover." Section 3.2 asks for it as its
own component folder, which is what this is.

| File | What it is |
|---|---|
| `calendar.md` | This file: anatomy, states, tokens, behaviour, accessibility. |
| `calendar.css` | The month grid, the day cells, the today marker and the month picker shell. |
| `example.html` | A standalone page showing every cell state and the picker. |

## Where the folder sits

Top level, beside `components/`, not inside it. `components/` is the Buckholt
catalogue: every folder in it is source-verified against a Code & specs page
in `code-specs-html/`, and `test/source-parity.py` checks
both directions. A component Buckholt has never documented cannot be
verified that way, and putting it there would present an invention as
canonical. Keeping it out is the same choice `prototypes/shared/blade.css` makes for
the Blade.

The file names follow the spec (`calendar.md`, `calendar.css`,
`example.html`) rather than the catalogue's `rules.md` / `examples.html`,
which is a second, smaller signal that this is not a catalogue entry.

## What the component does not draw

Only the grid, the cells and the popover shell are this component's. The
controls are Buckholt's, used unmodified:

| Part | Buckholt component |
|---|---|
| Month navigation chevrons | Button, ghost, icon-only |
| Month button | Button, ghost; `.active` while the picker is open |
| Year chevrons in the picker | Button, ghost, icon-only |
| The twelve month buttons | Response button, single select (native radios) |
| "Current month" | Link, `button.link-standalone.link-02` |
| Weekday column headers | `.label-02`, the type set `.table th` uses |

## Anatomy

```text
.calendar
├─ .calendar-monthbar
│  ├─ Button (previous month)
│  ├─ .calendar-monthbar-picker        positioning context
│  │  ├─ Button (month and year)
│  │  └─ .calendar-popover             hidden by the `hidden` attribute
│  │     ├─ .calendar-popover-head     year chevrons + .calendar-popover-year
│  │     ├─ .response.response-btn-input   twelve Response buttons
│  │     └─ .calendar-popover-foot     "Current month"
│  └─ Button (next month)
└─ .calendar-grid
   ├─ .calendar-weekday  × 7
   └─ .calendar-cell     × 28–42
      ├─ .calendar-cell-date      the badge; add .calendar-cell-date--today
      └─ .calendar-cell-label     optional
```

The weekday headers and the day cells are items of **one** grid. That is
deliberate: two grids could drift out of line, one cannot.

## Columns

Seven columns, Monday first. Weekend columns are narrower than weekday
columns — measured at 274px against 80px on CA-00-01, a ratio of 3.4 : 1.

The ratio is held as a whole track list in `--calendar-columns` rather than
as a bare number, because `fr` cannot be multiplied inside `calc()`.
Override that variable to change the shape:

```css
.calendar { --calendar-columns: repeat(7, minmax(0, 1fr)); }
```

which is what the component itself does below the md step.

## Cell states

A cell is the same box in every state. Only its element changes: an
interactive cell is a `<button>`, every other cell is a `<div>`.

| Class | When | Element | Fill | Border |
|---|---|---|---|---|
| `.calendar-cell--default` | Future working day, not collecting | `<button>` | `--ui-background-01` | `--ui-border-02`, 3px bottom in `--ui-border-01` |
| `.calendar-cell--selected` | Future working day that collects | `<button>` | `--expressive-pale` | `--action-01`, 3px bottom |
| `.calendar-cell--readonly` | Before today, or already sent | `<div>` | `--ui-background-01` | `--ui-border-03` |
| `.calendar-cell--disabled` | Weekend or bank holiday | `<div>` | `--ui-background-04` | `--ui-border-03` |
| `.calendar-cell--blank` | Outside the displayed month | `<div>` | `--ui-background-02` | none |

Read-only and disabled cells share one border token. `--ui-border-03` is
`rgba(26, 26, 26, 0.07)`, so it composites to `#EFEFEF` over the read-only
cell's white and to `#E0E0E0` over the disabled cell's grey — which is
exactly the pair the Figma draws, from a single token.

The raised bottom edge is `calc(1px + 0.125rem)`, which is the expression
Buckholt's own Button uses for its raised edge. The component borrows the
idiom rather than inventing a thickness.

**Today marker.** `.calendar-cell-date--today` fills the badge with
`--expressive-soft`. It sits on top of whatever state the cell has and
changes nothing else.

**Hover.** Default and Selected only: the border turns `--action-01`.
Read-only, disabled and blank cells do not respond.

**Focus.** A 3px `outline` in `--focus-01`, offset 2px. Spec 5.2 asks for at
least 3px; Buckholt's Button focus ring is a 2px `box-shadow`, so this is
wider than Buckholt's and is an `outline` rather than a shadow, so it clears
the cell's raised bottom edge instead of sitting under it.

## New values

Values the Figma uses that Buckholt has no token for. Everything else in
`calendar.css` resolves to a Buckholt token.

| Variable | Value | Why |
|---|---|---|
| `--calendar-cell-height` | `5.5rem` (88px) | Measured on CA-00-01. Buckholt has no cell or row height that fits. |
| `--calendar-columns` | `repeat(5, minmax(0, 3.4fr)) repeat(2, minmax(0, 1fr))` | The 3.4 : 1 weekday-to-weekend ratio, measured. |
| `--calendar-badge-size` | `1.5rem` (24px) | The date badge, measured. |
| `--calendar-popover` width | `15rem` (240px) | Measured on CA-01-01. Set directly on `.calendar-popover`. |

## Contrast

Spec 5.3: "The Default cell's bottom edge must reach 3:1 against white (WCAG
1.4.11). If the Figma grey falls short, darken it slightly (around #858B91)
and note it in `calendar.md`."

It falls short. The Figma draws the bottom edge in **#DADADA**, which is
**1.40 : 1** against white — the edge is the only thing that marks a Default
cell as interactive, so 1.4.11 applies to it.

Rather than take the spec's suggested #858B91, which is not a Buckholt
colour, the edge uses **`--ui-border-01` (#919191)**, Buckholt's own strong
border token, at **3.15 : 1**. It clears the threshold and introduces no new
value. The 1px side borders stay at `--ui-border-02` as drawn.

## Accessibility

- Interactive cells are `<button>` with `aria-pressed`, true when selected.
- The accessible name carries the whole date, so the column headers are not
  needed to understand a cell: *Wednesday 14 October 2026, collection day*,
  with *, today* appended on today.
- Read-only and disabled cells are not focusable and carry no ARIA. Their
  date and label are plain text and read in document order.
- Blank cells are `aria-hidden="true"`; they carry no information.
- State is never colour alone: a Selected cell is labelled *Collection day*
  and a bank holiday *Bank holiday*.
- The grid is not a `role="grid"` widget. It has no roving focus or arrow-key
  navigation, so claiming the role would promise behaviour it does not have;
  cells are ordinary buttons in document order.
- The month picker is `role="dialog"` with an accessible name. Opening it
  moves focus to the selected month; Escape, a click outside and moving focus
  out all close it, and Escape returns focus to the month button.

### Known gap

The month-bar chevrons and the month button are **40 × 40** and **40** tall,
which is Buckholt's `--button-height` (2.5rem). Spec 13 asks for touch
targets of at least 44 × 44. Buckholt's Button is left alone rather than
resized locally, so this is unresolved and is recorded in
`BACS-calendar/SPEC-CHANGES.md`. The picker's month buttons are 44px
(`.btn-response`) and the day cells are 88px tall, so only the three
month-bar controls are affected.

## Responsive

The breakpoints in `calendar.css` are the prototype's own and are set on the
**local** build's Bootstrap scale (576 / 768 / 992 / 1200 / 1400), because
`css/buckholt.css` ships that scale. The live reference build breaks at
896 / 1088 / 1312 / 1520 / 1720, so every figure would land at a different
viewport there. Flagged per `AGENTS.md` rather than silently changed.

- Below **768px** the columns go even, the cells shorten to 4.5rem and the
  labels drop to 12px. The page is expected to shorten the weekday names to
  three letters; the component does not do that itself, because the names are
  page content.
- Below **576px** the grid takes a 32rem minimum width. The page supplies the
  scroller around it — `calendar.css` deliberately does not, so the component
  never creates a scroll container that would clip a focus ring.

## Using it

The component is markup and CSS only; it ships no script. A page renders the
cells, decides their states and wires the clicks.
`BACS-calendar/bacs-calendar.js` is the worked example, and
`data/calendar.js` holds the rules that decide the states.
