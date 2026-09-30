# BACS Import prototype — build notes

A clickable prototype of Accounts › BACS › **Import**, built from
`bacs-import-spec.md` (version 1.0, 30 September 2026) and the Figma frames in
`screenshots/`.

It is the second feature in the same prototype, not a separate app: it shares
the top bar, left navigation, clock, BACS section tabs, toasts and tooltips
with Originators, and the two tab sets link to each other.

```
prototype/                   shared across features
  app-shell.css              static chrome: top bar, left navigation, toast stack
  app-shell.js               chrome markup, live clock, BACS tabs, toasts, tooltips
  blade.css                  reusable blade component (new — Buckholt has none)
  blade.js

BACS-import/
  index.html                 page shell, import modal, toast container
  bacs-import.css            prototype layout, the components Buckholt lacks
  bacs-import.js             IM-00 to IM-10
  reason-codes.js            section 13.4, extracted from the spec verbatim
  reason-codes-blade.js      section 13.2 and 13.3 — the blade's contents and search
  seed-data.js               section 14
```

Open `BACS-import/index.html`. Routes are hash routes: `#/import`,
`#/import/{id}`, `#/policy/{ref}`, `#/process`, `#/calendar`.
`?permission=none` gives the IM-10 state.

---

## Runtime contract

Loaded in this order, per `CLAUDE.md`. There is no separate Bootstrap
stylesheet.

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="../css/buckholt.css">
<link rel="stylesheet" href="../css/buckholt-ai-fixes.css">
<link rel="stylesheet" href="../prototype/app-shell.css">
<link rel="stylesheet" href="../prototype/blade.css">
<link rel="stylesheet" href="bacs-import.css">
...
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../prototype/app-shell.js"></script>
<script src="../prototype/blade.js"></script>
<script src="../components/dropdown/dropdown.js"></script>
```

`components/dropdown/dropdown.js` binds to `.dropdown` once, on
`DOMContentLoaded`. The two filter dropdowns are therefore in the page source
rather than rendered; only the table region and the pagination are re-rendered.

`css/buckholt.css` and `css/buckholt-ai-fixes.css` were **not** touched.
Neither were `components/`, `foundations/`, `patterns/`, `code-specs-html/`,
`verification/` or `discrepancies/`.

---

## Shared shell: what moved, and why nothing in Originators changed

The brief asked for one prototype rather than two apps, and for shared
components to be extended rather than duplicated. So the static chrome moved
out of Originators into `prototype/`, unchanged apart from its class prefix:

| Was | Is now |
|---|---|
| `Originators/originators.css` §1 (`.ori-appbar*`, `.ori-sidenav*`) | `prototype/app-shell.css` (`.app-bar*`, `.app-sidenav*`) |
| `Originators/originators.js` `renderClock` / `startClock` | `Shell.startClock()` |
| `Originators/originators.js` `showToast` | `Shell.showToast(message, variant)` |
| `Originators/originators.js` `initTooltips` / `disposeTooltips` / `escapeHtml` | `Shell.*` |
| The BACS tab `<ul class="nav nav-underline">`, written twice | `Shell.bacsTabs(active, paths)` |
| `.ori-toast-container` | `.app-toasts` |

`Shell.showToast` gained a `variant` argument, because Import needs the
warning and error Toasts as well as success. Originators calls it without one
and still gets `toast-success`. Everything else about the shared code is what
Originators already had, measurements and comments included.

The one behavioural change in the shared shell is a bug fix, described under
**Deviations, 12**.

---

## What is Buckholt and what is not

**Buckholt**, using real classes, tokens and documented markup:

Accordion · Alert · Avatar · Button · Button set · Collapse · Dropdown ·
Form (Text input, Select) · Link (standalone) · Menu · Menu button · Modal ·
Page layout (body / frame / pane / panel) · Page navigation · Table (including
the documented sortable header) · Tabs · Tag · Text block · Toast · Tooltip ·
Typography type sets · Spacing and colour tokens.

**Not Buckholt**, and drawn from Buckholt tokens rather than invented colours:

| Thing | Where | Why |
|---|---|---|
| Top bar, left navigation | `prototype/app-shell.css` | Static Mobius chrome. Both specs record it as static. |
| Blade | `prototype/blade.*` | Spec 13.1: "Buckholt has no blade component." |
| File drop zone and file card | `bacs-import.css` | Buckholt documents no file-upload component. |
| Pagination bar | `bacs-import.css` | `buckholt.css` defines no `.pagination`, `.page-item` or `.page-link`. Page navigation is for sibling pages, not table pages. |
| Date range field | `bacs-import.css` | Buckholt documents no date picker and no range input. |

---

## Buckholt components used, and where

| Component | Used for |
|---|---|
| Accordion | The blade's four reason-code sections (13.2). No `data-bs-parent`, so any number can be open at once. |
| Alert | Detail-page summaries, info and error, both without a close control (3.6). |
| Avatar | `avatar-xs` with initials in the Imported by column. |
| Button | Import new file (primary), Download report (primary), View reason codes (secondary), Cancel (ghost), row chevrons and the file bin (ghost, icon only). |
| Button set | Every group of Buttons, including the single-Button groups, per Button set's own guidance. |
| Collapse | The "What to do" disclosures, using the Code & specs "Close button" example so the cross inside the box is the component's own. |
| Dropdown | Import result and BACS file type filters. `.dropdown-item.active` supplies the tick and the highlighted row that IM-01-01 draws. |
| Menu, Menu button | The row menu, Code & specs example 3 (ghost, `fa-ellipsis-vertical`), with one `.menu-item` carrying its icon directly inside, per Menu's rules. |
| Modal | Import BACS file, `modal-sm`. |
| Page layout | `layout-03`, then `.page-body > .page-frame > .container-fluid > .page-pane > .page-panel`. |
| Page navigation | The BACS section tabs — four separate pages, so Page navigation, not Tabs. |
| Select | BACS file type in the modal, and Results per page. |
| Table | Both tables, with `.table-sort-header` + `button.table-sort` + `fa-solid fa-sort`, `.table-gap`, `.col-fit`, `.cell-data-right`, `.data-number`. |
| Tabs | All / Applied / Not applied, `.nav-underline` with Bootstrap pill behaviour and one `.tab-pane` each. |
| Tag | Status pills (`tag-status-*` with the documented icon), the "No matching policy" chip, the tab counts, and the blade's code chips. |
| Text input | Record search, blade search (with `.input-icon` and `.input-btn.input-clear`), date range. |
| Toast | All four toasts, Code & specs example 7, with each variant's documented icon. |
| Tooltip | Partial and Failed pills, and the disabled Import new file button. |

---

## Deviations and judgement calls

Listed because the brief asked for them. Each one is a place where the spec,
the frames and Buckholt did not all agree, or where Buckholt has no answer.

### 1. The toast has no close button — **diverges from the spec**

Spec 3.5 says the toast is "bottom right, with a close button", and IM-03-07
draws one. The toast is shared with Originators, where on 29 September 2026
you asked for the close control to be removed and said the designs would be
updated to match. Keeping two different toasts in one prototype would be
worse than either, so the shared toast has no close control and both features
use it. It auto-hides after Bootstrap's default 5000 ms, as 3.5 requires.

**Spec change needed** if you still want the close control: say so and it
comes back in `prototype/app-shell.js` for both features at once.

### 2. The modal footer is Buckholt's, not the frame's

IM-03-03 draws Import full width with Cancel centred underneath. Buckholt's
Modal Code & specs footer is `.modal-footer > .button-set` with the ghost
Button first and the primary last, right aligned, and the Forms pattern says
Modal contexts "may right-align actions with Primary after Secondary/Ghost".
Originators' three modals already do that. The brief says to pick the simplest
option consistent with Originators where the spec is silent, so the footer is
Buckholt's.

### 3. The clock shows the real time, not 13:24

Spec 14.1 pins the header clock at 13:24, 03 September 2026, and 7's rules say
the new import's timestamp "should read 13:24, to match the header clock". On
30 September 2026 you asked for the clock to show the real time and date, and
it is shared with Originators. So the clock is live, and a new import is
stamped with the actual time of submission — which still satisfies the rule
that the timestamp matches the header clock. Seed rows keep their September
2026 dates.

### 4. The date range has no calendar

Spec 5 asks for `dd/mm/yyyy-dd/mm/yyyy` "with a calendar picker". Buckholt
documents no date picker and no range input, and `CLAUDE.md` says to report
the gap rather than invent one. The field is a Buckholt Text input that parses
a typed range and filters on it, both dates inclusive; the calendar button
beside it opens a small panel holding two **native** `<input type="date">`
controls, which is as close to a picker as the design system allows without a
new component.

**Buckholt gap:** date input, date range input, date picker.

### 5. Sort icons only appear on hover and on the sorted column

Every frame draws a blue double caret on every sortable header. Buckholt's
runtime sets `.table-sort-icon { opacity: 0 }` and reveals it on
`.table-sort:hover` or when the button carries `.table-sort-asc` /
`.table-sort-desc`. That is Buckholt's own decision about the affordance, so
the prototype follows the runtime and not the frame.

**Either the frames or Buckholt needs to change.** Flagging rather than
choosing.

### 6. Sort state is exposed with `aria-sort`

`components/table/rules.md` says the sortable pattern does not specify how to
expose the current sort accessibly, and that "the application should also
expose the current sort state accessibly". So the `<th>` carries
`aria-sort="ascending"` / `"descending"` — an application-level addition, not
a change to the canonical example.

### 7. The disabled Import button keeps pointer events

Spec 3.4 requires `aria-disabled="true"` rather than the native attribute, so
the button stays focusable and its tooltip stays reachable. Buckholt's
disabled treatment, `.btn.disabled`, supplies the look but also sets
`pointer-events: none`, which would put the tooltip out of reach of the
pointer. One rule gives pointer events back for that case only, and the click
handler ignores the click.

**Buckholt gap:** an `aria-disabled` treatment for Button.

### 8. "Results per page" has a left-aligned label

IM-00-01 draws the label to the left of the Select. Buckholt's Forms pattern
says "left-aligned labels are not currently supported". The label is still a
real `<label for>` bound to the Select; only its placement departs, and only
for table furniture rather than a form.

### 9. The blade is built on Bootstrap's Offcanvas JavaScript, with its own CSS

Spec 13.1 says to start from Bootstrap 5 Offcanvas "if Buckholt is
Bootstrap-based". `css/buckholt.css` is a complete Bootstrap 5.3 build, but it
ships **no** `.offcanvas` rule — the component was dropped. The Bootstrap
5.1.3 JavaScript bundle the app already loads still carries the plugin, with
its backdrop, page scroll lock, focus trap and Esc handling.

So `prototype/blade.js` drives the real plugin and `prototype/blade.css`
supplies the CSS its class contract expects, written from Buckholt tokens.
This is not a second Bootstrap stylesheet: every selector names a class
`buckholt.css` does not define, and no Buckholt component is overridden. The
scrim uses Buckholt's own `--black-tint-60` and 0.5rem blur, so the blade dims
the page exactly as a Buckholt Modal does.

Two things the plugin does not do, added in `blade.js`:

- **Focus return.** Bootstrap restores focus to the opener only for its own
  `data-bs-toggle` triggers. The blade is opened from script, so it remembers
  the trigger and focuses it on `hidden.bs.offcanvas`.
- **Tab wrapping.** The plugin's focus trap listens for `focusin`, which
  catches a click or a programmatic focus but not Tab off the last control —
  the browser then moves focus to its own chrome and fires no event. A
  `keydown` handler wraps Tab and Shift+Tab, which is what spec 13.1's "focus
  is trapped inside the blade" needs.

The same two gaps applied to the import Modal, and the Modal's focus return is
handled the same way in `bacs-import.js`.

### 10. The blade header blue is chrome, not a Buckholt token

Spec 13.1 puts the blade header at `#2249b1`, the sidebar blue. That is static
Mobius chrome, not a Buckholt colour, so it is declared once as
`--blade-header-background` and named as chrome in the file. The close control
is not Buckholt's `.btn-close`, which draws a dark cross for a light surface.

### 11. The blade's clear button is reachable from the keyboard

Buckholt reveals `.input-clear` on `.response:hover` only, so a keyboard user
can never reach it. Spec 13.2 requires the clear control once there is text,
and the search field is where focus lands when the blade opens. One rule,
scoped to the blade, also reveals it on `:focus-within`.

**Buckholt gap:** `.input-clear` has no focus-visible treatment.

### 12. App bar overflow between 992px and about 1050px — **fixed**

Not introduced here: measured on `origin/main` before this branch, the
Originators app bar pushed the avatar 19px past the right edge at 992px, and
stayed over until about 1050. Between the 992px step and 1200px the sidebar is
still 235px wide and the bar has the least room it ever gets. The fix is in
the shared shell, so both features get it: the logo's trailing space narrows
below 1200px, and "What can I search?" can now shrink rather than holding the
row wider than the viewport. Swept every width from 960 to 1400 in 8px steps —
no overflow.

### 13. Tabular figures in the Amount column

Spec 4.2 asks for tabular figures. `.data-number` is Buckholt's documented
markup for a numeric cell, but this build ships no rule for it, and there is
no `font-variant-numeric` anywhere in `buckholt.css`. One rule, scoped to the
prototype's tables.

**Buckholt gap:** no tabular-figures treatment for numeric data.

### 14. Buttons in a loading state

Spec 7 step 7 asks for a spinner and "Importing…". Buckholt documents no
loading state for Button and ships no spinner at all. The spinner is a Font
Awesome icon in Button's own documented `.btn-icon` slot.

**Buckholt gap:** Button has no loading state.

### 15. The blade accordion's horizontal padding is bound down

Buckholt's Accordion pads 2rem each side. Inside a 400px blade with 24px body
padding that would leave the code list 288px wide. `--accordion-btn-padding-x`
and `--accordion-body-padding-x` are Buckholt's own custom properties,
declared on `.accordion`, and they are bound to `--spacer-04`. Nothing is
overridden.

### 16. Curly apostrophes

The brief asks for curly apostrophes. The spec's copy tables are typed with
straight ones; its reason-code JSON in 13.4 uses curly. The reason-code data
is used exactly as written, and every other UI string uses curly apostrophes,
written as `’` in `bacs-import.js` so the choice is visible.

### 17. The detail page's search and tab survive going back

Spec 9 says the back link returns to the list "with the filters, sort and page
the user left", which the prototype does. It says nothing about the detail
page's own state; reopening the same import keeps its tab, search and sort,
and opening a different one starts clean.

### 18. Generated Partial imports

Spec 14.4 specifies 5–15 Applied records for other Completed files, and
section 15 gives a new Partial import one Not applied record. It does not say
how many records a *seeded* Partial should have, so they get the same 5–15
with one unmatched.

### 19. The reason codes blade section order when opened from a policy

The blade is only opened from a detail page, so the file type is always known.
No third preset was invented.

### 20. Prototype breakpoints are on the local build's scale

Every media query in `bacs-import.css`, `prototype/app-shell.css` and
`prototype/blade.css` is set on 576 / 768 / 992 / 1200 / 1400, because
`css/buckholt.css` — the build this repository loads, and the build whose
`.col-*` classes are used — ships that scale. The live reference build breaks
at 896 / 1088 / 1312 / 1520 / 1720, so each figure would land at a different
viewport there. Flagged rather than changed, per `CLAUDE.md`.

---

## Section 16 open questions, and how they affected the build

| # | Question | Effect |
|---|---|---|
| 1 | Legacy reject reasons | None. Not applied has one reason, "No matching policy", as the spec's data model says. |
| 2 | ADDACS R guidance | The placeholder text `[Confirm: resume collections under the reinstated DDI, or get a new DDI?]` is shown as written, because 13.4 says to use the data as-is. It is visible in the blade under ADDACS › R. |
| 3 | Automatic steps | None. Guidance is shown as written. |
| 4 | Failure reasons | The one generic message is used for every Failed import, seeded and simulated. |
| 5 | ADDACS type | Not split. The Type column shows "AUDDIS return" or "ADDACS", as section 4 defines. |
| 6 | Last reviewed date | Not added. |
| 7 | Modal label spacing | Both spellings are used exactly where 4.2 puts them: "AUDDIS Return / ADDACS file" in the modal, "AUDDIS Return/ADDACS file" in the tables, the filter, the subtitle and the error message. |
| 8 | Avatar and importer | The header avatar shows "AC" and imports are attributed to Jane Smith, exactly as the frames and 14.1 have it. `Shell.mountChrome({ avatar })` takes the initials, so one line changes it once you decide. |

---

## Verification

All figures measured in Chromium at `deviceScaleFactor: 1` against a local
mirror of the repository, with the Typekit and Font Awesome Pro kit URLs
rewritten to local copies.

| Suite | Assertions | What it covers |
|---|---|---|
| Import flow | 32 | IM-03 and IM-04 end to end, IM-05 format error, the six-record Completed result |
| List, detail, filters | 52 | IM-06, IM-07, IM-09, search, sorting, pagination, IM-10 |
| Tooltips, outcomes, CSV | 22 | IM-06-01 and IM-07-01 tooltips, Partial and Failed results, Cancel, the CSV, detail pagination over 25 records |
| Blade | 43 | Every rule in 13.2 and 13.3 |
| Keyboard | 33 | Import a file, open a detail page, use the blade — keyboard only |
| Responsive | 54 | Nine viewports across four pages, plus the blade |
| Originators regression | 24 | Cards, table, search, selection, modal, toast, tooltips, and both tab links |

**260 assertions, all passing.**

Frame-by-frame comparison at 1920px:

| Frame | Result |
|---|---|
| IM-00-01 | Matches. Page 1 rows, statuses, types, importers and dates are the spec's table exactly, with `Showing 1–10 of 210`. |
| IM-01-01, IM-02-01 | Match, including the tick and highlighted row on the selected option. |
| IM-03-01 to IM-03-08 | Match, except the modal footer (2) and the toast close control (1). |
| IM-04-01, IM-04-02 | Match. |
| IM-05-01 | Matches. |
| IM-06-01, IM-06-02 | Match. |
| IM-07-01 | Matches. |
| IM-08-01 to IM-08-05 | Match, except the resting sort icons (5). |
| IM-09-01, IM-09-02 | Match. |
| IM-10-01, IM-10-02 | Match. |

The interactive mockup at `https://claude.ai/artifact/EEPUg3xKVPVi4TAURnNoci`
could not be read from this session — the artifact is not shared with the
account Claude Code is signed in to. The blade was built and checked against
section 13 alone, which the brief names as the source of truth.
