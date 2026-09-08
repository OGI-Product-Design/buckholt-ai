# Mobius PAS — Buckholt UI implementation (`index2.html`)

A **like-for-like UI reskin** of the existing Mobius PAS screens using the Buckholt design
system. Same journey, same information architecture, same field order, same actions, same
content. Only the implementation changed.

**Open `mobius/index2.html`.** It covers both reference screens:
`SEARCH RESULTS FOR: JOHN SMITH` → expand a client row → expand a policy row → **View Client** →
`CLIENT HOMEPAGE` → **Back**.

`index.html` (the separate Product Design exploration) is untouched, as are `styles.css`,
`app.js` and `data.js`. This implementation shares no file and no global with it.

```
index2.html        the Buckholt implementation
index2.css         application layout only — mx2- prefixed
index2.js          behaviour; emits documented Buckholt markup
index2-data.js     content transcribed verbatim from the screenshots
assets/opengi-logo.png
```

## What this page loads

Styles, in the verified order: Typekit → the Font Awesome kit → `css/buckholt.css` →
`css/buckholt-ai-fixes.css` → `index2.css`. **No separate Bootstrap stylesheet** —
`buckholt.css` is itself a complete Bootstrap 5.3 build, and the live Buckholt
documentation site loads only its own compiled CSS.

Behaviour: **the Bootstrap bundle only.** jQuery, `components/form/form.js`,
`components/dropdown/dropdown.js` and `components/tabs/tabs.js` are deliberately not loaded,
because this page contains nothing they act on — no `.input-clear`, `.indeterminate`, Text area
counter or Number input for `form.js`; no `.dropdown`/`.dropdown-toggle` for `dropdown.js` (Menu
button is a Bootstrap dropdown, not Buckholt's select-style Dropdown); and no
`.tab-scroll-left`/`-right` controls, so `tabs.js` returns immediately. They are still required
on `test/style-guide/` and `test/runtime-verification/`, which do contain that markup.

Nothing on this page loads or compiles SCSS. The Bootstrap **JavaScript** bundle ends with a
`sourceMappingURL` comment, so browser DevTools fetch `bootstrap.bundle.min.js.map` and resolve
it back to Bootstrap's own sources. Those entries appear in the DevTools **Sources** tree only
while DevTools is open; the page requests the compiled `.js` and nothing else. The Bootstrap
stylesheet — and with it the `scss/` tree — is no longer loaded at all.

> The prototype loads the Font Awesome **Pro** kit that `CLAUDE.md` documents. Buckholt's markup
> uses `fa-regular` throughout and the regular face is a Pro style, so on a Free kit the icons
> render as empty `.notdef` boxes. That is the known dependency in
> `discrepancies/known-issues.md`, not a fault in this page.

---

## Existing Mobius element → Buckholt implementation

### Application bar

| Mobius | Buckholt |
| --- | --- |
| Bar itself | **Not a Buckholt component.** Page layout documents an optional `<header>` region but no application bar. Application-layer layout built from Buckholt colour and spacing tokens. |
| Open GI logo | Plain `<img>` in the header region |
| Search field ("John Smith") | **Text input** — `.input > .input-label + .response.text-input`, label visually hidden |
| "Test" environment chip | **Tag** — `.tag > .tag-label` |
| 10:00 / 08 September 2026 with pencil | **Button**, ghost + small, with the documented **Edit** icon `fa-regular fa-pencil`; date in `.support-01` |
| "Dashboard ▾" | **Menu button** — `.menu > .btn.btn-secondary.menu-toggle + .menu-panel.dropdown-menu` |
| "LA" avatar | **Avatar** — `.avatar > .avatar-initials` |

### Search results screen

| Mobius | Buckholt |
| --- | --- |
| `SEARCH RESULTS FOR: JOHN SMITH` + `Create New Client` | **Heading attachment** — `.text-block > .heading > .heading-content + Button`; `h1.title-02`, italic emphasis preserved with `<em>` |
| "Search Results" panel | **Card** — `.card > .card-body`, with a `.text-block > .heading` section title |
| "?" help icon | **Tooltip** — documented `data-bs-toggle="tooltip"` + `data-bs-title`, with the documented **Help** icon `fa-regular fa-circle-question` |
| Brand / Line of business / Policy Status | **Input rows** pattern (`.row.input-row` + `.col-*`) containing three **Select** components; Policy Status keeps its `disabled` state |
| "Clear" | **Link** — `.link-standalone` |
| "Apply" | **Button** — `.btn.btn-primary` |
| Results grid | **Table** — `.table-container > .table-content > table.table.no-italics`, `.table-header-label`, `.table-gap`, `.col-fit` |
| Sortable column headers | **Table** sort pattern — `th.table-sort-header > button.table-sort` with `.table-sort-icon` and `fa-solid fa-sort` |
| Row expand chevron | **Button**, ghost + small, with the documented **Chevron-right / Chevron-up** icons. *The disclosure row itself is not a documented Buckholt pattern — see below.* |
| Email Address / DOB in the expanded row | **Key-value pair**, grid variant — `.grid.key-value-grid > .key-value-item > .key-value.key-value-stacked` |
| "View Client ▾" | **Menu button**, combo variant — `.menu > .btn-combo > .btn + .btn.menu-toggle + .menu-panel` |
| "Add New Quote" | **Button** — `.btn.btn-secondary` |
| Nested "Client Policies" table | **Table**, same structure, inside the disclosure row |
| Policy expand: Expiry / Brand-Agent / Premium / Scheme | **Key-value pair**, grid variant, four columns |
| "Timewarp" | **Button** — `.btn.btn-secondary` |
| "View ▾" | **Menu button**, combo variant, primary |
| "Load More" | **Link** — `.link-standalone` |
| "Showing 1-25 of 43" | `.body-01` type-set class |

### Client homepage

| Mobius | Buckholt |
| --- | --- |
| Blue client context banner | **Not a Buckholt component.** Application-layer band built from Buckholt colour and spacing tokens. |
| "Client Support" | **Button** — `.btn.btn-secondary.btn-sm` |
| `CLIENT HOMEPAGE` + `Back` | **Heading attachment** + **Button** |
| Summary / Business Details / Transactions / Activity / Complaints / Client Checks | **Tabs** — `.tabs > .tab-items > .tab-items-scroll > ul.nav.nav-underline` + `.tab-content > .tab-pane` |
| Left column / right column | Bootstrap `.row > .col-12.col-xl-9` + `.col-12.col-xl-3`, as `patterns/page-layout` documents |
| Collapsible panels (Client Header, Client Details, Client Policies, Linked Clients, Suggested Links, Connected Clients) | **Accordion** — `.accordion > .accordion-item > h2.accordion-header > button.accordion-button` + `.accordion-collapse.collapse > .accordion-body`. No `data-bs-parent`, so panels collapse independently as they do in Mobius. |
| "Add" button in the Client Header panel header | **Button**, `btn-secondary btn-sm`. *Not a documented Accordion composition — see below.* |
| "?" help icons on panel headers | **Tooltip** + documented **Help** icon |
| Client Details fields | **Key-value pair**, grid variant, three columns |
| Client Policies / Suggested Links / Connected Clients tables | **Table** |
| "..." row actions | **Menu button**, icon-only ghost toggle, with the documented **Overflow-menu-horizontal** icon `fa-regular fa-ellipsis` |
| "Add Client Link" / "Add Client Connection" | **Button** — `.btn.btn-secondary` |
| "Load more suggested links..." / "Show statistics for more clients" | **Link** — `.link-standalone` |
| Statistics and Additional Info panels | **Card** — `.card > .card-body` |
| Statistic tiles (0 ACTIVE POLICIES, £0.00 TOTAL ACTIVE GWP, …) | **Key-value pair** — `.grid.key-value-grid` with `.key-value.key-value-stacked.key-value-flipped.key-value-lg`, so the number leads and the label follows |
| "Add New Quote" / "View Claims" | **Button set** — `.button-set.button-set-no-offset` with a primary and a secondary Button |
| "Client Access To Open Customer Portal" + OFF toggle | **Switch** — `.form-check.form-switch`; the runtime draws its own Off/On status text |
| "Build Number: 275249" | `<footer>` region with `.support-01` |

---

## Not represented by a documented Buckholt component

Each of these is implemented with the least invasive markup that preserves the existing
functionality, and is called out in the source rather than passed off as Buckholt.

1. **The application bar.** Page layout documents an optional `<header>` region, not an
   application-bar component. The bar is application-layer layout; everything inside it is a
   documented component.

2. **The blue client context banner.** No Buckholt equivalent. Application-layer band using
   Buckholt colour and spacing tokens. Its Button re-points only the Button's colour role
   variables so a secondary Button is legible on a dark ground — geometry, radius and states
   stay the component's.

3. **Expandable table rows (both levels).** Buckholt Table explicitly documents no
   expandable-row pattern and its rules forbid inventing data-grid features. The disclosure is
   plain table semantics — a following `<tr>` toggled with `hidden` — with a documented ghost
   Button as the trigger and documented components inside. No Table styling is changed.

4. **A control alongside an Accordion trigger** (the "Add" button on Client Header). Buckholt
   documents nothing beside `.accordion-button`. It is placed as a *sibling* of the trigger
   inside `.accordion-header` so buttons are never nested, and positioned by application CSS.
   Verified: zero nested interactive elements in the rendered page.

5. **The environment indicator's target glyph.** `foundations/iconography/catalogue.md`
   documents no environment/target icon. None was substituted; the indicator is a Tag with the
   label "Test".

6. **The "Client Support" headset glyph.** The catalogue documents no headset or support icon.
   The documented **Help** icon is used instead; the label is unchanged.

7. **Content for the five non-Summary tabs.** The reference screens evidence the Summary tab
   only, so those panes are left empty rather than invented.

8. **The expanded state of the client-homepage Client Policies table.** The reference shows the
   disclosure control on that table but never shows it open. The field set is taken from the
   disclosure that *is* evidenced (on Search Results) and values the reference does not supply
   use the screen's own `N/A` placeholder.

---

## Where Buckholt's behaviour differs from Mobius's, and Buckholt won

A reskin adopts the design system's behaviour. Three visible differences are deliberate:

- **Table header.** Mobius uses a solid blue header band; Buckholt's Table header is its own
  documented treatment. Not overridden.
- **Sort indicators.** Mobius shows the ⇅ glyph on every sortable column permanently. Buckholt's
  `.table-sort-icon` is `opacity: 0` until hover or an applied sort. Not overridden.
- **Panel stack.** Mobius draws six separate cards with gaps between them. Buckholt's Accordion
  is one connected stack. Not overridden.

## Buckholt runtime finding

**`.tab-items-scroll` cannot scroll inside its own flex parent.** The runtime sets
`overflow-x: auto` on `.tab-items-scroll` so a long tab strip scrolls, but the element is also
`flex: 1 1 auto` inside `.tab-items` and sets no `min-width: 0`. A flex item's automatic minimum
size is its content, so the scroller grows to fit the whole nav instead of scrolling, and the tab
strip pushes the page sideways. Corrected on this page with a scoped
`.mx2-body .tab-items-scroll { min-width: 0 }` — reported here rather than added to
`css/buckholt-ai-fixes.css`, which is a separate decision from building a page.

## Application-layer CSS

Everything in `index2.css` is layout. It positions Buckholt components and never restyles them.
Beyond the three undocumented regions above, it does four things:

1. **`--card-height: auto`** on the sidebar Cards. Buckholt Cards are `height: 100%` so a row of
   them comes out equal-height; stacked in a column as tall as the main content, each one
   stretches. `--card-height` is the component's own knob, so it is set rather than the height
   overridden.
2. **`--columns`** on the key-value grids — the documented knob, set from the stylesheet so the
   grids can respond, exactly as `responsive/component-guidance.md` recommends for this variant.
3. **`overflow-wrap: anywhere`** on `.key` and `.value` within this screen's containers. Buckholt
   sets `break-word`, which wraps the text but does not reduce min-content width, so a grid track
   still sizes to the longest token. Also from `responsive/component-guidance.md`.
4. **`overflow-x: hidden`** on the page root. A seven-column Table and a six-item Tab strip cannot
   fit a phone, and Table's rules forbid restructuring it. Both components carry their own
   documented scroll frames, so the page is clipped and each one scrolls on its own.

## Verified

Measured in Chromium against the real `buckholt.css`:

- **No user-facing horizontal page scroll** at 1900 / 1440 / 768 / 375 / 320, in all three states
  (results, results with both disclosure levels open, client homepage). Below 1440 the Table and
  the Tab strip scroll inside their own documented frames.
- **No page errors** in any state.
- **Every class** in the rendered DOM resolves to `buckholt.css`, Bootstrap, Font Awesome, or an
  `mx2-` application class. The five that carry no runtime rule — `text-input`, `avatar-initials`,
  `no-italics`, `table-sort-header` and `menu` — are all present in Buckholt's own canonical
  `examples.html`.
- **Every icon** appears in `foundations/iconography/catalogue.md`.
- **Accessibility**: every control has an accessible name; every `aria-controls`,
  `aria-labelledby` and `aria-describedby` resolves to a real element; no duplicate IDs; **no
  nested interactive elements**.

## Content

`index2-data.js` is transcribed from the screenshots, including the lower-case `john Smith` on
`SMI/J/02011980/0002`, the truncated `The National Gallery, ss, London` address, every `N/A`
placeholder, and the `Showing 1-25 of 43` / `Showing 1-3 of 3` counts. Nothing was corrected,
reordered or relabelled.
