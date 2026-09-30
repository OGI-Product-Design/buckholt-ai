# Originators prototype — build notes

A clickable prototype of the Originators feature, built from `originators-spec.md`
and `screenshots/`.

| File | What it is |
| --- | --- |
| `index.html` | The page. Buckholt runtime contract, Buckholt page structure, Buckholt components. |
| `originators.css` | Prototype-only. A little layout, two Buckholt variable bindings, and the sticky layers. |
| `originators.js` | State and behaviour for OR-00 to OR-11. In memory; reloading resets to the seed data. |
| `PROTOTYPE.md` | These build notes. |
| `SPEC-CHANGES.md` | The list to feed back into `originators-spec.md`, the Figma frames and Buckholt. |

Open `index.html` directly in a browser. Everything is relative; nothing is built.

### Revision 2 — 30 September 2026

> Built against `originators-spec.md` revision 2, which lands the design review.
> What changed here:
>
> | Area | Change |
> | --- | --- |
> | Assignment | Every product carries an explicit originator. `resolvedOriginator()` and the inherited-count helper are gone; the seed is 32 on Assurant Inter LTD and 2 on Real Insure LTD. Changing the default moves nothing. |
> | Copy | New page intro, Product assignments subtitle, idle selection text, "All originators", and the no-products-assigned body. |
> | Action bar | The filter lost its visible label and carries `aria-label="Filter by originator"`. "Clear selection" is always shown and natively disabled while nothing is selected. |
> | Table | Rows are clickable; the header checkbox clears the whole selection, hidden rows included, and shows at least its partial state whenever anything is selected. |
> | Sticky | The action bar and table header stick under the top app bar. See deviation 20. |
> | Cards | The default card is first. It has no bin; every other card has a red danger bin that is always active, and deleting moves that originator's products to the default. |
> | Modals | Every warning alert is gone. Edit gains the intro line with the product count; the default helper line appears wherever a new default is chosen. Only the OR-02 error summary is left. |
> | Toasts | Already had no close control, from 29 September. Unchanged. |
>
> Deviations 4 and 15 described behaviour revision 2 removed; both are now marked
> superseded rather than deleted, so the history reads straight.

### The shared shell

> Added 30 September 2026, when BACS Import was built as the next tab in the
> same prototype. The chrome's **styling** moved to `prototype/app-shell.css`,
> and the live clock, the toast helper and the tooltip helpers moved to
> `prototype/app-shell.js`, so both features share one shell instead of each
> carrying a copy. The classes were renamed from `ori-` to `app-`; the
> measurements and comments moved with them unchanged.
>
> The chrome **markup** stayed in this page. The `<header class="app-bar">`
> and `<aside id="sidebar" class="app-sidenav">` blocks, and the BACS section
> tabs, are still written here rather than injected by script: they are
> static application furniture, so they should be readable in the source and
> present with the JavaScript off.
>
> `Shell.showToast` gained a variant argument that Originators does not pass,
> so it still gets `toast-success`. See `prototype/README.md`, and
> `BACS-import/PROTOTYPE.md` for the table of what moved where.
>
> This page renders **pixel-identically** to the build before the move —
> compared at 1920 x 900, the only differing pixels are the clock's minute
> digits.
>
> One behavioural fix went in with the move: the app bar pushed the avatar
> 19px past the right edge between 992px and about 1050px. That was already
> true of this build before the move, and it is fixed in
> `prototype/app-shell.css` for both features.

`css/`, `components/`, `foundations/`, `patterns/`, `code-specs-html/`,
`test/`, `verification/`, `discrepancies/` and `responsive/` are untouched,
and `python3 test/source-parity/check-source-parity.py` still passes in both
directions.

---

## Runtime contract

Exactly the order `CLAUDE.md` specifies, with the prototype stylesheet last:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="../css/buckholt.css">
<link rel="stylesheet" href="../css/buckholt-ai-fixes.css">
<link rel="stylesheet" href="../prototype/app-shell.css">
<link rel="stylesheet" href="originators.css">
```

No separate Bootstrap stylesheet. The Bootstrap **5.1.3** bundle is loaded, as the
live documentation site does, because Modal, Toast, Tooltip and Dropdown all carry
`data-bs-*` hooks. `components/dropdown/dropdown.js` is loaded for the documented
Dropdown enhancement. jQuery and `form.js` are not loaded — no Form-script
behaviour (Text area counting, Number input steps, Checkbox/Radio read-only) is used.

---

## What is Buckholt and what is not

The brief carved out two regions: *"the sidebar and the header are not part of
Buckholt, as such they can be static built from visually inspecting the
screenshots. The rest is using buckholt css and html."* The spec agrees: *"the top
bar, left navigation and the Process, Import and Calendar tabs are static."*

```text
.layout[data-layout="layout-03"][data-layout-surface="flush"]   ← Buckholt CSS Grid
├─ header.ori-appbar          ← NOT Buckholt. Static, drawn from OR-00-01.
├─ aside#sidebar.ori-sidenav  ← NOT Buckholt. Static, drawn from OR-00-01.
└─ main#main                  ← Buckholt from here down
   └─ .page-body
      └─ .page-frame
         └─ .container-fluid
            └─ .page-pane
               ├─ .page-panel   BACS section navigation
               ├─ .page-panel   Originators heading, action, cards
               └─ .page-panel   Product assignments heading, toolbar, table
```

`layout-03` is `"header header" / "sidebar main" / "footer footer"` — header across
the full width, sidebar below it on the left. That is what OR-00-01 draws. The two
static regions sit in Buckholt's own grid areas, so the page structure is still
Buckholt's; only their contents are drawn by hand.

Measured against OR-00-01 (exported at 2× from a 1920px frame), the Buckholt
structure lands on the design without adjustment:

| | Screens | Prototype |
| --- | --- | --- |
| Content left edge | 299px | 299px |
| Content width | 1557px | 1557px |
| Table header row height | 56px | 56px |
| Data row height | 55px | 52px + 4px row gap |
| Card gap | ~34px | 32px (`--page-panel-gap`) |

---

## Buckholt components used

| Screen element | Component | Notes |
| --- | --- | --- |
| BACS tab bar | Page navigation | With `.nav-underline` — see deviation 1 |
| Section headings and helper text | Text block | `headline-02` + `<p>` |
| Originator cards | Card | Plus `.card-footer` — see deviation 2 |
| Bank tile on each card | Icon block | `.icon-block.expressive-dark` |
| Default badge | Tag | `.tag.tag-status.tag-status-info` with the Info-solid icon |
| Product-count chip, originator chips | Tag | Plain `.tag` |
| Add originator, Reassign, Cancel, Save, Delete | Button | `btn-secondary`, `btn-primary`, `btn-ghost`, `btn-primary btn-danger` |
| Edit / delete icons on cards | Button | Icon-only `btn-ghost`; hover surface is `--action-04`, pressed is `--action-01`, both Buckholt's own |
| Product assignments table | Table | Documented selection pattern: `.table-checkbox-header.col-fit`, native checkboxes, `.table-gap` |
| Row and header selection | Checkbox | Native, including `:indeterminate` for the partial state |
| Search products | Text input | Code & specs example 3, `.input-icon` |
| Originator filter | Dropdown | Single select; `.dropdown-item.active` gives the blue label, light blue fill and check icon |
| Choose originator / Choose new default | Radio | Code & specs example 2, radio group inside `.input` |
| Make default | Switch | `.form-check.form-switch` already gives label-left, toggle-right, an Off/On state label and a green on-state |
| Modals | Modal | Default 500px dialog, which is what the screens draw |
| Bank details, bulk change, default change, all-products warnings | Alert | `.alert-warning` |
| Error summary | Alert | `.alert-error` |
| Inline field errors | Text input validation | `.is-invalid` + `.invalid-feedback`; the red circled exclamation inside the field is Buckholt's own |
| Selected products list | List | `.list > .list-item` |
| Success messages | Toast | `.toast.toast-success`, Bootstrap's native timing, as OR-06 requires |
| Every icon-only Button | Tooltip | Required by Button's Usage guidance. Initialised with the options from Tooltip's own Code & specs example 3 (`offset: [0, 4]`, `delay: { show: 800, hide: 100 }`) |
| Modal field pairs | Input row | `.row.input-row > .col` |
| Row count below the table | Typography | `.support-01`, the documented type set for small, subtle messaging |

---

## Deviations and judgement calls

Each of these is a place where the screens, the spec and Buckholt did not agree, or
where Buckholt documents nothing. None of them invents a Buckholt rule.

### 1. The BACS tab bar uses `.nav-underline`

These are four sibling pages, so semantically this is **Page navigation**, and it is
built that way: `ul.nav > li.nav-item > a.nav-link`, `.active` on the current item,
no `data-bs-toggle="pill"`.

But Buckholt's documented Page navigation active state is a **light blue pill**
(`--nav-link-background-active`), and the screens draw an **underline**.
`.nav-underline` produces exactly what the screens draw — muted labels, a blue
active label, a blue underline bar and a full-width rule beneath — and it is a real
Buckholt class. It is documented on **Tabs**, not on Page navigation.

Combining Page navigation markup with the Tabs underline modifier is **not
documented**. It was chosen because the spec names the screenshots as the source of
truth for layout and both classes are Buckholt's own, rather than writing local CSS
to imitate an underline.

> **Gap to raise with Buckholt:** does Page navigation have an underline variant, or
> should these tabs be a pill nav?

### 2. `.card-footer`

The cards have a tinted footer band carrying the badges and the icon actions.
`.card-footer` is real in `css/buckholt.css` — it has its own tokens
(`--card-cap-padding-y/x`, `--card-cap-background`) and a companion rule
(`.card:has(.card-footer) .card-body`) — but it does **not** appear in Card's
Code & specs page. It is used as shipped, not recreated.

It is also **incomplete in the runtime**. `.card` is `overflow: visible` and
`.card-footer` has no bottom corner radii, so the footer's square corners bleed
past the card's 16px radius. Bootstrap's own base ships that radius rule; this
build dropped it. The prototype restores it with Buckholt's own expression —
`calc(var(--card-radius) - var(--card-border-width))`, which
`.card-header-tabs .nav-link.active` already uses — scoped to the card row.

> **Gaps to raise with Buckholt:** Card's documentation does not cover
> `.card-footer`, and the runtime `.card-footer` has no bottom corner radii, so
> it bleeds out of the card's rounded corner wherever it is used.

### 3. Selected table row

Buckholt's Table documents no selected-row treatment, and its own rules say Table is
provisional and not to invent data-grid features. `.table` does, however, declare
`--table-background-state` and consume it:

```css
box-shadow: inset 0 0 0 9999px var(--table-background-state, …);
```

No shipped class ever sets it. The prototype binds that existing hook to
`--action-04`, the light blue Buckholt already uses for a selected interactive
surface. Measured on OR-06-02: `#E8EDFA`, which is exactly `--action-04` over white.
No new colour, no overridden rule.

> **Gap to raise with Buckholt:** Table has no documented selected-row state, though
> the runtime clearly anticipates one.

### 4. Delete — no blocked state (OR-10)

> **Superseded, 30 September 2026.** This entry used to describe a blocked bin that
> was natively disabled, with the Tooltip on a wrapper, and the accessibility
> decision that followed. Spec revision 2 removed the whole idea.

The default originator has **no delete control at all**. Every other card carries
`.btn .btn-ghost .btn-danger` — Buckholt's documented danger Button, which brings the
red label and the red hover surface with it — and it is always active, whatever the
product count. Confirming moves that originator's products to the default as explicit
assignments.

Two consequences worth naming:

- **Nothing in this feature now needs a disabled-but-explained control**, so the
  wrapper, the `not-allowed` cursor and the keyboard-focus question all go with it.
  `SPEC-CHANGES.md` C4 stays open as a Buckholt question in its own right.
- **OR-10's "It shows the light blue square background on hover, like the edit icon"
  is not built.** Buckholt's danger Button hovers to `rgba(215, 5, 12, 0.1)`, and
  overriding that would be restyling a documented component to match a screenshot.
  The bin hovers red. Flagged rather than fixed.

### 5. Heading attachment is deliberately **not** used

For "Originators" with "Add originator" on the right, Heading attachment looks like
the obvious fit. It is not: its documented attachments are a close Button, a
Standalone Link, a Tag or an Icon block, and its rules say *"Do not turn the heading
row into a general toolbar."* A `.btn` attachment is not documented. The row is a
two-item prototype flex row instead, with the Text block and the Button unchanged.

### 6. "Clear selection" is a ghost Button, not a Link

The screens draw it as plain blue text. Link's rules are explicit: *"Do not use a
Link for an action that modifies data, changes state or triggers an event; use Button
instead."* `btn-ghost` gives the text-only treatment at rest and the documented
disabled state, which is what the screens show when nothing is selected.

### 7. `.container-fluid` rather than `.container`

The screens are full-bleed at 1920px; Bootstrap's `.container` caps at 1320px there.
`.container-fluid` is the same Bootstrap family and carries the same
`calc(var(--bs-gutter-x) * .5)` = 16px padding that the Frame's padding maths expects,
so content still sits 64px from the Frame edge — measured at exactly 299px from the
page left, matching the screenshot.

### 8. Card title uses `title-02`

Card's Code & specs example uses `title-03`. Measured on the screens, the account
holder name is 18–20px; `title-03` is 24px at this viewport and `title-02` is 20px.
`title-02` is the closest documented Buckholt type-set class, so it is used rather
than overriding a type size.

### 9. Icons not in the Buckholt catalogue

`foundations/iconography/catalogue.md` covers Bin, Edit, Close, Plus, Search, List,
Info-solid, Success-solid, Warning-solid and Error-solid — all used as documented.
Two icons the screens need are **not** in it:

| Need | Used | Status |
| --- | --- | --- |
| Bank / originator account | `fa-regular fa-building-columns` | **Catalogue gap** |

A prohibited icon was a second gap until the blocked bin stopped swapping icons — see
deviation 4. Four more icons appear only in the static, non-Buckholt chrome and are
outside the catalogue's scope: `fa-money-bill-transfer`, `fa-caret-left`,
`fa-circle-dot`, `fa-chevron-down`.

### 10. Success toast icon

The screens draw a green circle-check, and Iconography maps Success-solid to
`fa-solid fa-circle-check`. Buckholt's own Toast Code & specs page shows
`fa-solid fa-circle-info` inside its `.toast-success` example — apparently a slip in
the documented example rather than intent. The prototype follows the screens and the
Iconography catalogue. The canonical example in `components/toast/examples.html` was
**not** changed.

### 11. Card row sizing — Bootstrap grid

The originator cards sit in `.row > .col-12.col-md-6.col-xxl-4 > .card`, per
`patterns/page-layout`: *"Bootstrap `.container`, `.row`, `.col-*` → width,
horizontal structure, responsive columns/breakpoints."* `.page-panel` sets
`--bs-gutter-x` to the 32px panel gap and `.row` brings `--bs-gutter-y: 2rem`, so
the gap between cards in both directions is Buckholt's own spacing.

At the 1920px frame the screens are drawn at, `col-xxl-4` gives a 498px card against
the drawn 506 — and OR-01 "Layout" is satisfied as written: two sit at that width
left-aligned, three stretch to share the row.

An earlier version used a bespoke flex row with a `min-width` floor. That is gone.

> **Consequence, worth knowing.** The floor was holding the card above the width its
> footer needs. Without it, at viewports where a third of the row is under about
> 390px — roughly 1400 to 1650 on this build's scale, and again at 992 to 1200 where
> the column is a half — the Default badge, the product-count chip and the two icon
> actions no longer fit on one line and the badges wrap, making the card taller.
> Nothing breaks; the card just grows. Fixing it inside the grid means either
> different column classes at those widths or shorter badge text, both of which are
> design decisions. Flagged rather than patched.

### 12. Toast size, and no close control

The toast carries **no close control**, at Laurence's request on 29 September 2026;
the designs are being updated to match. That makes it Code & specs example 7
exactly — `.toast.toast-success > .toast-content > .toast-icon + .toast-body` — and
removes the `.btn-close-sm` this prototype briefly used, which was not a documented
combination on a Toast.

It is 320 × 48, as every frame draws it. The height needs no help now: a 24px icon
row plus 4px content padding and 8px toast padding on each side comes to 48 on its
own. The width is `--toast-max-width: 20rem`, scoped to the prototype's container;
Buckholt's value is 22rem (352) and every frame draws 320.

The 4px message offset that this section used to describe is gone from the component
itself — corrections 7 and 8 in `css/buckholt-ai-fixes.css`, added 29 September 2026,
align the close control to the first line for both Alert and Toast, with an offset
derived from `--btn-close-height` so it is correct for the 32px and 24px controls
alike. Recorded in `discrepancies/known-issues.md` and asserted by
`test/runtime-verification/`. This prototype no longer exercises them, since its
toast has no close control, but the Alert warnings in the modals do.

> **Still open for Buckholt:** `--toast-max-width` is 22rem while every frame draws
> 20rem. In `SPEC-CHANGES.md`.

### 13. Every group of Buttons is a Button set

Button's rules say to group related actions inside `.button-set`, and Buckholt's own
Table example wraps even a lone row action in one. Every `.btn` in the page and in
all three modals now sits in a set: the card's two icon actions
(`.button-set.button-set-end`), the toolbar's Reassign and Clear selection, the
Add originator action, and the three modal footers.

The set brings its own spacing, so two prototype rules went away: `.button-set` gives
icon-only sets `--set-gap: 0.25rem`, which is the 4px the card actions had hand-rolled,
and 0.5rem otherwise.

One rule was added. Buckholt gives every Button set a flow offset,
`margin-top: 0.5rem`, for a set that follows content in normal flow. These three sets
are positioned by a flex parent instead, so the offset displaces them. Buckholt
cancels it the same way inside a component that positions its own actions —
`.versatile-actions .button-set { margin: 0 }`, present in both builds — and the
prototype mirrors that precedent. It is **not** `.button-set-no-offset`, which Mark
confirmed on 9 September 2026 is undocumented and experimental.

### 13. Every icon-only Button carries a Tooltip

Button's rules are explicit: *"Buckholt's Usage guidance requires a tooltip explaining
the action and the implementation must still provide an accessible name."* The card's
edit and delete controls therefore carry both a Tooltip and an `aria-label`, not just
a label. The Tooltips are initialised with the options from Tooltip's own Code & specs
example 3.

The screens only draw a tooltip on the *blocked* delete, so the edit and available
delete tooltips are an addition the design system requires rather than something the
frames show.

> **Figma / spec change needed:** show the Edit originator and Delete originator
> tooltips on the card, not just the blocked-delete ones.

### 14. Row count below the product table

Added 29 September 2026. `Showing 1-34 of 34`, left-aligned with the table's content
edge. All rows show on one page, so the range is always 1 to the number of rows
currently shown, and it follows the search and the Originator filter together. It is
hidden in both empty states.

Only the re-uploaded OR-00-01 draws it; the other frames predate it. It is added to
every table state regardless, at Laurence's request.

Two details were measured from OR-00-01 at 2x rather than taken from the brief:

| | Brief said | OR-00-01 measures | Used |
| --- | --- | --- | --- |
| Colour | "small grey text" | dominant glyph colour `rgb(29, 30, 28)` — `--text-primary` under subpixel antialiasing. `--text-muted` over white would land near `rgb(112, 112, 112)`, and nothing on the page is drawn that way | `--text-primary`, i.e. no colour utility |
| Size | — | ink 21px tall at 2x, against 22px for `.support-01` in this build | `.support-01` (12px / 16px / 400) |

The gap is `--spacer-05` (24px). Measured, the count's line box starts about 21px
below the table's last row border; Buckholt's spacing scale steps 16 → 24 with no
20px between them, so 24 is the nearest documented token. Rendered ink gap: 25.5px in
the design, 27.5px here.

> **Say so if the brief meant it:** the count is drawn in primary text colour, not
> grey. One class swaps it if grey was intended.

### 15. No warning alerts, and the Edit intro line (OR-03, OR-07, OR-08, OR-11)

> **Superseded, 30 September 2026.** This entry used to describe the change warning,
> its three bodies and the two alerts stacking. Spec revision 2 removed every warning
> alert in the feature.

What is left, and what replaced each one:

| Removed | Replaced by |
| --- | --- |
| Change warning (OR-03) | The Edit intro line: "Changes to this originator apply to the **{count}** products that use it." Hidden for an originator with 0 products; singular at 1. |
| Default change warning (OR-11) | The default helper line: "New products will use this originator. Existing products stay as they are." |
| Bulk change warning, 6+ (OR-07) | The subtitle, which already states the count. |
| All-products warning (OR-08) | The subtitle "You're reassigning all products." and the panel's own "please clear your selection" line. |

The only alert left in the feature is the OR-02 error summary.

The intro line's bold count is a plain `<strong>`, which Buckholt's own reboot sets to
**500** against the paragraph's 300 — measured, not assumed. No type-set class and no
local weight.

The Reassign originator subtitle now bolds its count the same way, at Laurence's
request on 30 September 2026. The frames disagree with each other: OR-07-03 draws
"**7** products" bold, OR-06-03 and OR-09-03 draw theirs in the regular weight. The
bold one is the intent. The all-products variant has no count, so nothing changes
there.

The default helper line shows under the Make default toggle whenever the toggle is on
for an originator that is **not already the default** — in Add and in Edit — and under
the Choose new default heading in OR-11-04. It is not shown when the Edit modal opens
on the current default with the toggle already on, where nothing is being changed.

### 16. Typography — where a type-set class is and is not used

Audited on 29 September 2026 across Main and all three modals. Every text element
renders in Proxima-soft through the Buckholt runtime; no custom font stack exists
inside Main, and nothing hard-codes a font size there.

Elements fall into three groups:

**Carrying a documented type-set class** — `headline-02` for the two section
headings and all three modal titles, `title-02` for the card name and the Selected
products heading, `body-02` for the selection counter and the "+ N more products"
line, `support-01` for the row count.

**Styled by their own Buckholt component, and deliberately left bare** —
`.nav-link`, `.button-label`, `.tag-label`, `.form-label`, `.form-helper`,
`.form-check-label`, `.dropdown-label`, `.dropdown-item`, `.table-header-label`,
`<td>`, `.alert-note` and the `<h6>` inside an Alert. Buckholt's component CSS sets
their type, and none of their Code & specs examples carries a type-set class. Adding
one would be exactly what `CANONICAL-MARKUP.md` forbids.

**Bare `<p>` inside `.text-block`, which is the canonical markup** — the two helper
paragraphs, the card's sort code and account number line, the Reassign subtitle, the
Delete modal body and the two empty-state bodies. Text block's Code & specs examples
use a bare `<p>`, which inherits the body type (16px / 24px / 300 / 0.16px — the same
as `body-02`). Adding a class here would deviate from the documented example.

Two standalone paragraphs sat outside all three groups — the selection counter and
the "+ N more products" line — and now carry `body-02` explicitly. They already
rendered at those metrics by inheritance; the class makes it auditable rather than
implicit.

The static app bar and left navigation are the one place font sizes are hard-coded.
That is the non-Buckholt carve-out: they are drawn from the screenshots and are not
Buckholt components, so no type-set class applies to them.

### 17. App bar spacing measured from OR-00-01

The right-hand cells originally sat in the app bar's own 24px flex gap, so each
divider had 24px of slack before the next cell's 24px padding — 48px of white space
on the left of "Accounts" against 24px on its right. They are now one tight row
(`.ori-appbar-right`, `margin-left: auto`, no internal gap), so each divider butts
against the neighbouring cell's own padding.

The rest of the bar was re-measured from OR-00-01 at 2x at the same time:

| | Measured | Used |
| --- | --- | --- |
| Header height | 76px | `4.75rem` |
| Clock | 13:24 / 07 August 2023 | live, same format, ticking on the minute |
| Bar padding | 16px both sides | `1rem` |
| Logo ink starts | 16px | no logo padding |
| Search box | 154.5 – 474.5, height 34px | `20rem` wide, `2.125rem` tall |
| Dividers | 1572 / 1710 / 1842, full header height | `align-self: stretch` on the group |
| "Accounts" cell | 1710 – 1842, text 1732.5 – 1816.5 | `0 1.5rem` padding, weight 400 |
| Avatar | 1859 – 1903.5 | `2.75rem`, `margin-left: 1rem` |

The clock shows the real time and date rather than the frame's values, added
30 September 2026. It uses the frame's format — `en-GB`, a 2-digit day and a 24-hour
clock give "30 September 2026" and "14:24" — and ticks on the minute boundary, not
every second. A live date can be longer than the drawn one, so the search field may
now shrink below its 320px to keep the bar from overflowing; it holds 320 down to
1280.

Rendered dividers land within 2px of the design at the third, and within about 10px
at the first two — the remainder is the offline fallback font sizing "Live" and
"07 August 2023" differently from Proxima-soft.

### 18. Page background

Buckholt's `--body-background` is `#fbfbfb`; the screens draw `#ffffff` behind Main.
Buckholt's value is left alone rather than overridden for a 4/255 difference.

### 19. Prototype breakpoints are on the local build's scale

`originators.css` breaks at 991.98px and 575.98px — the **local** Bootstrap scale
that `css/buckholt.css` ships, and the scale the modal's `.col` classes use. The live
reference build breaks at 896 / 1088 / 1312 / 1520 / 1720 instead, so these figures
would land at different viewports there. Flagged rather than silently changed, per
`CLAUDE.md`. The screens only cover desktop; narrow-viewport behaviour is the
prototype's own judgement.

### 20. Sticky action bar and table header (OR-00)

Built exactly as OR-00 describes, and each of its six conditions cost something worth
recording.

**Two layers, offsets from measured variables.** `.ori-toolbar` is
`top: var(--app-header-height)` and `.ori-table thead th` is
`top: calc(var(--app-header-height) + var(--ori-action-bar-height))`. Both variables
are set on `documentElement` by a `ResizeObserver` watching the top bar and the action
bar, and `renderTable` re-measures too, because the header row comes and goes with the
empty states. Nothing is hard-coded: at 1440px the bar wraps onto two lines and the
header follows it down.

**The top app bar is now sticky, in the shared shell.** OR-00 puts the action bar
"just below the top app bar", which only means anything if the top bar stays. It is
`position: sticky; top: 0; z-index: 1030` in `prototype/app-shell.css`, so BACS Import
gets it too — checked, and it changes nothing else there. 1030 keeps it above both
page layers and below Bootstrap's backdrop (1050), modal (1055) and the toast stack.

> Worth knowing: `header` is a grid item of `.layout[data-layout=layout-03]`, and the
> sticky constraint rectangle for a grid item is arguably its grid area, which would
> give it no travel at all. Chromium constrains it to the grid *container* instead, so
> it works. Verified by measurement rather than assumed, and it is the one piece of
> this that might behave differently in another engine.

**No clipping ancestor — an override, and a Buckholt ticket.** Buckholt's
`.table-content` is `overflow-x: auto`, which makes `overflow-y` compute to `auto` as
well, so it becomes a scroll container and the sticky header binds to it rather than
to the page. OR-00 says not to wrap the table in an overflow container, so
`.ori-table .table-content { overflow: visible }`, scoped to this table. Below 576px
it is handed back: measured at 375px the table's minimum is 347px in a 311px column,
so the page itself overflows without it. The table header stops sticking there; the
action bar still does. `SPEC-CHANGES.md` C9.

**Solid backgrounds — without changing a colour.** `--table-header-background` is
`--ui-overlay-03`, `rgba(26, 26, 26, 0.07)`, so rows show straight through a sticky
header. The page surface is painted behind the cell and Buckholt's own header colour
layered over it as a background image, which composites to exactly what the header
already looks like at rest. A background on `thead tr` does not work: the row's
background belongs to the table's background layer and does not travel with a sticky
cell. `SPEC-CHANGES.md` C10.

**Shadow when stuck.** A 1px sentinel sits in the flow just above the action bar, with
`margin-bottom: calc((var(--page-panel-gap) + 1px) * -1)` giving back the Panel gap and
its own height so the drawn spacing is unchanged. An `IntersectionObserver` whose root
is inset by the top bar's height — so it fires at exactly the scroll position where
the bar starts sticking — toggles `is-stuck` on the Panel. The shadow is `--shadow-xs`,
the documented lowest elevation. With an empty state in place of the table there is no
header row, so it falls on the action bar instead.

**Keyboard focus.** `scroll-padding-top` on `html` is the three layers' combined
height, re-measured with the rest. A row 30 deep that takes focus lands clear of the
header rather than under it — asserted.

**The bar keeps its own padding when stuck.** Without it the controls sit flush
against the top bar above and the table header below, which is how this first
shipped and what Laurence caught. `padding-block: var(--spacer-04)` with a matching
negative `margin-block` gives the space back to the flow, so the resting layout is
drawn exactly as before — measured at 1920px, the search field and the table start at
the same y with and without those two lines. A sticky offset positions the border
box, not the margin box, so the negative margin does not drag the bar out from under
the top bar once it is stuck; that was measured too, not assumed.

**Below 576px both layers come off**, for two separate reasons.

The table header *must*: `.table-content` is a scroll container again at that width
(above), so a sticky `thead th` binds to that scrollport instead of the page and its
offset pushes the header row down **inside** the table — measured at 375px, 340px
down, below the first row. That was the second thing Laurence caught. `position:
static` is the only correct answer while the scroller is back.

The action bar then follows it, which is a judgement call rather than a necessity.
Pinning the bar alone is worse than not pinning it: at phone width it stacks to five
rows, so it and the top bar together would hold about 300px of a 760px viewport.
OR-00 wants the bar in view *so the user can tick rows while they scroll*; with two
thirds of the screen gone there are barely any rows left to tick. `scroll-padding-top`
drops to the top bar's height to match.

> **Worth a decision.** OR-00 does not say what should happen at phone width. If the
> bar should stay pinned there regardless, it is a one-line change — but the table
> header cannot join it until the horizontal scroller question (C9) is settled.

### 21. Clickable rows (OR-00)

The row hover state is **Buckholt's**: `.table tr:hover td` already uses
`--table-hover-background`. The only addition is `cursor: pointer`, because Table
documents no clickable-row state. `SPEC-CHANGES.md` C11.

Clicks on the row toggle its checkbox; clicks inside `.form-check` are left to the
control, so the checkbox is never toggled twice. The checkbox stays the keyboard focus
target and Space still toggles it.

### 22. Header checkbox semantics (OR-00)

The handler reads `state`, not the checkbox's new `checked` value: anything selected
anywhere → clear everything; nothing selected → select every visible row. That is what
makes the partial state clear rather than select, which a native checkbox would not do
on its own. It also means a selection hidden by a search or filter is cleared by the
same click.

`indeterminate` is set whenever something is selected and not every visible row is,
which covers OR-00's "shows at least its partial state whenever anything is selected".
The accessible name follows: "Select all visible products" when empty, "Clear
selection" otherwise.

---

## Spec issues found

1. **"Up to four cards sit in a row" is unreachable at the drawn card width.**
   **Closed by revision 2** — OR-01's Layout section now says three is the maximum at
   1920px and gives the same reasoning as deviation 11.

2. **Toast success icon.** See deviation 10 — a Buckholt documentation issue rather
   than a spec one, but it surfaced here.

3. **OR-10's hover colour for the bin.** The spec says the red bin "shows the light
   blue square background on hover, like the edit icon". Buckholt's danger Button
   hovers red. The prototype keeps Buckholt's. See deviation 4.

> **Not an issue:** OR-04-03's `"Th"` is an illustrative Figma string showing what the
> no-results state looks like, not a literal case — confirmed by Laurence on
> 29 September 2026. Matching is *"contains the search text anywhere, ignoring
> case"*, so `"th"` does match 14 seeded products (every "Monthly" and "Months").
> The prototype implements the stated rule, and the state is asserted with a string
> that genuinely matches nothing.

---

## What "Make default" gets for free

Worth recording because it is the clearest case of building *with* Buckholt rather
than imitating it. The screens show the label on the left, the toggle on the right, a
small "Off"/"On" state word between them, and a green track when on. All four come
from `.form-check.form-switch` as documented — `flex-direction: row-reverse`,
`justify-content: space-between`, a `::before` carrying `content: "Off"` / `"On"`,
and `--switch-track-background-on: var(--success-01)`. The canonical markup needed no
addition.

---

## Verification

Rendered headless in Chromium via Playwright, at 1920 / 1440 / 1280 / 992 / 768 / 375.

Because the sandbox blocks Typekit, the Font Awesome kit and jsDelivr, verification
used a mirror copy of this folder with those three URLs rewritten to a local
Bootstrap 5.1.3 copy and the two font sources removed. That means **icons and the
Poppins/Typekit metrics were absent from the verification renders** — the small
vertical differences that follow from a fallback font are artefacts of the offline
render, not of the markup. Everything else was measured against the screenshots
directly.

**185 behavioural assertions** across five suites, all passing with no console or
page errors at any viewport, plus the 54-assertion responsive sweep and the BACS
Import suites (231 assertions) run as a regression check on the now-sticky shared top
bar. `python3 test/source-parity/check-source-parity.py` passes in both directions.

| Flow | Verified |
| --- | --- |
| OR-00 | Seed state: 2 cards reading "Default / 32 products" and "2 products", the default first, no bin on it, a `btn-danger` bin on the other, 34 rows, "Showing 1-34 of 34", "Select products to reassign", "Clear selection" visible and natively disabled, the filter showing "All originators" with no visible label and `aria-label="Filter by originator"` |
| OR-01 | Add: helper line appears when Make default is switched on and the wording matches; new card with "0 products"; toast "New originator added" even when saved as the default; new filter option |
| OR-02 | Inline "Max 18 characters" while typing; Save enabled with a blank field; Save then flags it, shows the summary alert and keeps the modal open; it is the only alert left in the page |
| OR-03 | Pre-filled fields, Confirm disabled until dirty, the intro line reading "Changes to this originator apply to the 32 products that use it." with the count in a `<strong>` computing to 500 against the paragraph's 300, **no alert of any kind**, card updated, toast |
| OR-04 | 9 matches for "Krypton - Open Market Motor" and "Showing 1-9 of 9"; the no-results state replaces the table, its header row and the count, and the action bar stays; deleting the text restores 34 rows |
| OR-05 | Filter to Real Insure LTD's 2 rows and "Showing 1-2 of 2"; the no-products-assigned body reads "… Set the filter to All originators, then …" |
| OR-06 | Clicking a row's cell ticks its checkbox and highlights the row; "1 product selected"; both actions enable; header checkbox partial. Subtitle "You're assigning a new originator to 1 product." with the 1 in a `<strong>` computing to 500 against the paragraph's 300 |
| OR-07 | 7 selected, subtitle "You're assigning a new originator to 7 products." with the count bold, **no alert**, five bullets plus "+ 2 more products", current originator preselected, Confirm disabled until a different one is chosen, counts 25/9, selection cleared, toast |
| OR-08 | Header checkbox ticks every row, "All products selected", subtitle "You're reassigning all products.", **no alert**, count-only panel with the clear-your-selection line, nothing preselected, the mixed helper with the count, counts 34/0 |
| OR-09 | Three originators, none preselected, the mixed helper without the count, counts 31/1/2 with "1 product" singular |
| OR-10 | Body reads "… Any products assigned to it will be moved to the default originator. …"; confirming removes the card, moves the 2 products to Assurant Inter LTD for 34, drops the filter option, toast "Originator deleted" |
| OR-11 | Toggle off on the current default shows Choose new default with the helper line, the current default disabled and the only other preselected; confirming moves the badge, puts Real Insure LTD's card first, gives Assurant Inter LTD a bin, leaves every chip and both counts (2 / 32) untouched, toast "Default originator changed". Also the OR-11-07 route: the intro line for 2 products, the helper line under the toggle, no alert |
| Selection | Selection survives search and filter and is still counted; the header checkbox shows its partial state when the selected rows are all hidden and clears all 3 on one click; ticking it again selects only the 2 visible rows; "Clear selection" clears hidden rows too |
| Sticky padding | The bar carries 16px of vertical padding and gives it back with a matching negative margin, so at rest the search field and the table sit at the same y as the build without it and the Panel's 32px rhythm is intact; stuck, the bar is flush at 76 with 16px above the controls and 16px below them before the header row |
| Mobile | At 375 / 414 / 480 / 575 neither layer is sticky, the header row sits above the first row rather than displaced into the table, `scroll-padding-top` is the top bar alone, and there is no page overflow; at 576 / 768 / 992 / 1280 the bar is still stuck at 76 with the header directly under it |
| Sticky | `--app-header-height` 76px and `--ori-action-bar-height` measured, not hard-coded; at scroll the app bar is at 0, the bar at 76 and the header cells at 76 + bar height; `is-stuck` toggles and puts `--shadow-xs` under the header; the header cell is opaque and still carries `rgba(26, 26, 26, 0.07)`; `.table-content` is not a scroll container; the filter menu paints over the header; the modal and backdrop sit above the app bar, and the app bar above the sticky bar; the toast stack above all of them; with an empty state there is no header row and the bar still sticks |
| Keyboard | Space on a row checkbox selects and deselects it and updates the bar; Space on the header checkbox clears everything; Tab runs search → filter → select-all when the actions are disabled, and search → filter → Reassign → Clear → select-all when they are not; `scroll-padding-top` keeps a focused row 30 deep clear of all three sticky layers; both card tooltips appear on focus; Escape closes each modal |
| Toasts | No close control on any of them |

Layout was checked for horizontal overflow at every viewport: none, at any width.
At 575px and below the table scrolls inside Buckholt's own `.table-content`, which is
where its `overflow-x: auto` is handed back (deviation 20).
