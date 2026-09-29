# Originators prototype — build notes

A clickable prototype of the Originators feature, built from `originators-spec.md`
and `screenshots/`.

| File | What it is |
| --- | --- |
| `index.html` | The page. Buckholt runtime contract, Buckholt page structure, Buckholt components. |
| `originators.css` | Prototype-only. Static app chrome, a little layout, three Buckholt variable bindings. |
| `originators.js` | State and behaviour for OR-00 to OR-11. In memory; reloading resets to the seed data. |

Open `index.html` directly in a browser. Everything is relative; nothing is built.

Nothing outside this folder was changed. `css/`, `components/`, `foundations/`,
`patterns/`, `code-specs-html/`, `test/`, `verification/`, `discrepancies/` and
`responsive/` are untouched, and `python3 test/source-parity/check-source-parity.py`
still passes in both directions.

---

## Runtime contract

Exactly the order `CLAUDE.md` specifies, with the prototype stylesheet last:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="../css/buckholt.css">
<link rel="stylesheet" href="../css/buckholt-ai-fixes.css">
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

### 4. Blocked delete (OR-10-02, OR-10-03) — **diverges from the screens**

The bin must stay hoverable, focusable and tooltip-bearing while doing nothing, so it
carries `aria-disabled="true"` rather than `disabled`, and the click is prevented in
script. It is `--text-muted`, shows no hover surface, and signals the block natively
through `cursor: not-allowed` plus the Tooltip. Only Buckholt's own button variables
are rebound.

OR-10-02 and OR-10-03 draw the bin **swapping to a red prohibited icon** on hover and
keyboard focus. That was built first and then dropped at Laurence's request on
29 September 2026: the shape changing under the pointer read badly, and the native
cursor already says "you cannot do this" without moving anything. `fa-ban` is no
longer used anywhere.

> **Figma / spec change needed:** OR-10-02 and OR-10-03 should show a muted bin with
> `cursor: not-allowed` and the tooltip, not an icon swap. The "Blocked delete"
> section of OR-10 needs the same change.

> **Gap to raise with Buckholt:** Buckholt documents disabled, but not "available but
> blocked, with an explanation" — a distinct state this feature needs, and one where
> the native `not-allowed` cursor is doing work no Buckholt token covers.

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

### 11. Card row sizing

OR-01 "Layout" says two cards sit at a fixed width left-aligned, three stretch to
share the row equally, and up to four sit in a row. Measured on OR-00-01, the drawn
card is 506px — which is, within 8px, the width a card takes at three-up in the
1557px content area. One rule covers both stated cases: grow to fill, capped at a
third of the row.

Four per row is **not reachable** at 1920px with the drawn card width
(4 × 506 + 3 × 32 = 2120px against 1557px available). See "Spec issues" below. The
prototype implements 1 to 3 cards exactly as drawn; a fourth wraps to a second row
at the same width.

The rule also carries a 24rem floor. Below that the card footer cannot hold the
Default badge, the product-count chip and the two icon actions on one line, and the
badges wrap under each other — which the screens never show. `min-width` beats
`max-width` in CSS, so narrower viewports fit fewer cards per row instead of
breaking the footer. Measured: one row of three at 498px each at 1920px, two at
384px from 1440px down to 992px, full width below that, and no footer wrapping at
any width.

### 12. Toast message sat 4px above centre

`.toast-content` is a flex row with no `align-items`, so `.toast-body` stretches to
the 32px height of `.btn-close` while its own 24px line sits at the top. The message
therefore rendered 4px above the icon and the close control.

This is a **known Buckholt runtime gap**, measured in both builds and recorded in
`css/buckholt-ai-fixes.css` correction 4 as deliberately **not** corrected: that
audit fixed the close control's horizontal placement and left the vertical offset
open, because `align-items: center` on the content row drops the icon 36px when there
is a multi-line note, and `align-self: center` on the body shifts the icon 4px.

The prototype centres the **body's own content** instead:

```css
.ori-toast-container .toast-body { display: flex; flex-direction: column; justify-content: center; }
```

The body's height does not change, so neither the icon nor the close control moves,
and a body tall enough to fill the row is unaffected — avoiding both failure modes
the earlier audit recorded. Measured after the change: toast, content, icon, body,
message and close control all centre on the same line.

> **Gap to raise with Buckholt:** the Toast (and Alert) vertical offset is still open
> upstream. This is a page-scoped workaround, not a fix to the component. If it holds
> up, it is a candidate for `css/buckholt-ai-fixes.css` once someone checks it
> against a multi-line `.toast-note` and `.toast-contextbar`.

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

### 15. Change warning extends beyond bank details (OR-03)

Added 29 September 2026, extending OR-03. The amber warning now shows when the
**account holder**, the sort code or the account number differs from the saved value
and the originator has at least one product. Never for an originator with 0 products,
and never for User No. or Bureau No. alone. Editing any of them still leaves product
assignments untouched.

The title is unchanged. The body says which kind of change was made:

| Changed | Body |
| --- | --- |
| Account holder only | These products will show the new account holder name. Check the name before confirming. |
| Sort code and/or account number only | Future collections for these products will go to the new account. Check the sort code and account number before confirming. |
| Both | Future collections for these products will go to the new account, and they will show the new account holder name. Check the details before confirming. |

The default change warning (OR-11) is now a **separate alert element**, so an edit can
raise either, both or neither. Previously one element carried both messages and was
moved in the DOM. The order is: Make default toggle → Choose new default → default
change warning → change warning → error summary. That keeps OR-11-04's adjacency
(default warning directly below Choose new default) and OR-03-04's (change warning
directly below the toggle when no default change applies), and shows both stacked
when both apply.

> **Figma / spec change needed:** OR-03 documents only the bank-details body. The
> account-holder and combined bodies, and the two alerts appearing together, are not
> drawn in any frame.

### 16. Page background

Buckholt's `--body-background` is `#fbfbfb`; the screens draw `#ffffff` behind Main.
Buckholt's value is left alone rather than overridden for a 4/255 difference.

### 17. Prototype breakpoints are on the local build's scale

`originators.css` breaks at 991.98px and 575.98px — the **local** Bootstrap scale
that `css/buckholt.css` ships, and the scale the modal's `.col` classes use. The live
reference build breaks at 896 / 1088 / 1312 / 1520 / 1720 instead, so these figures
would land at different viewports there. Flagged rather than silently changed, per
`CLAUDE.md`. The screens only cover desktop; narrow-viewport behaviour is the
prototype's own judgement.

---

## Spec issues found

1. **OR-04-03's example search does match products.** The state is triggered by
   typing `"Th"`, described as *"text that matches no product names"*. Matching is
   *"case-insensitive… contains the search text anywhere"*, and 14 seeded products
   contain "th" — every "Monthly" and "Months". The prototype implements the stated
   rule, so `"Th"` returns matches; the no-results state was verified with a string
   that genuinely matches nothing.

2. **"Up to four cards sit in a row" is unreachable at the drawn card width.** See
   deviation 11. Either the card is narrower than drawn, or the limit is three at
   1920px and four only at a wider viewport.

3. **Toast success icon.** See deviation 10 — a Buckholt documentation issue rather
   than a spec one, but it surfaced here.

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
vertical differences that follow from a fallback font (a card ~10px taller, one
helper paragraph wrapping to two lines) are artefacts of the offline render, not of
the markup. Everything else was measured against the screenshots directly.

118 behavioural assertions across the eleven flows, with no console or page errors at
any viewport. 117 pass. The one that does not is spec issue 1 below: the spec's own
example search string for the no-results state matches 14 of its own seeded
products, so the assertion written from the spec fails while the behaviour is
correct. Re-checked with a string that genuinely matches nothing, it passes.

| Flow | Verified |
| --- | --- |
| OR-00 | Seed state: 2 cards reading "Default / 32 products" and "2 products", 34 table rows |
| OR-01 | Add: Save disabled when empty, enabled when filled, new card with "0 products", toast, new filter option |
| OR-02 | Inline "Max 18 characters" while typing; Save enabled with a blank field; Save then flags it, shows the summary alert, keeps the modal open and disables Save; correcting clears both; Cancel saves nothing |
| OR-03 | Pre-filled fields, Confirm disabled until dirty, bank details warning naming 32 products, card updated, toast |
| OR-04 | 9 matches for "Krypton - Open Market Motor"; no-results state replaces the table and its header row |
| OR-05 | Filter to Real Insure LTD's 2 rows; no-products-assigned state with the header row hidden |
| OR-06 | Singular counter, row highlight, current originator preselected, Confirm disabled until a different one is chosen, counts 31/3, selection cleared, toast |
| OR-07 | Header checkbox partial state, bulk change warning, five bullets plus "+ 2 more products", counts 25/9 |
| OR-08 | "All products selected", all-products subtitle and warning, count-only panel, nothing preselected, mixed-originator helper, counts 34/0 |
| OR-09 | Three originators listed, nothing preselected, no warning at 2 products, counts 31/1/2 |
| OR-10 | Both blocked tooltips present and rendering; delete available once an originator is non-default with 0 products; card removed, filter option removed, toast |
| OR-11 | Choose new default shown with the current default disabled and the only other preselected; warning naming 32 products, the current default and the new one; badge and inherited products move; 0/34; toast. Also the OR-11-07 route (switch on for another originator) and the Add-with-default route |
| Cross-cutting | Selection survives search and filter; the counter counts hidden selections; the header checkbox reflects only visible rows; reassigning to the current default removes the override |
| Row count | `Showing 1-34 of 34` on the full table, `1-9 of 9` after the search, `1-2 of 2` with the Real Insure LTD filter, `1-1 of 1` with both applied, and it follows a reassignment; hidden in both empty states; left edge on the table's, 12px / 400 in `rgb(26, 26, 26)`, 24px below the table |
| Change warning | The name-only, bank-only and combined bodies, each titled "This change will affect 32 products"; reverting all three fields hides it; User No. and Bureau No. alone never raise it while still enabling Confirm; both alerts show together in the documented order; a 0-product originator raises nothing even with name and bank changed; a rename moves no products |

Layout was checked for horizontal overflow at every viewport: none, at any width.
Below 375px the table scrolls inside `.table-content`, which is Buckholt's own
`overflow-x: auto`, not page overflow.
