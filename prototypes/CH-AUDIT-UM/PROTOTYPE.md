# CH-AUDIT-UM — Audit Centre: User Management prototype

Clickable prototype of Configuration Hub > Audit Centre > User Management,
built on 5 Nov 2026 from `ch-audit-um-spec.md` revision 1, reusing the
CH-SHELL prototype (spec revision 7) without copying or editing it.

**Not Buckholt.** This is application work built *with* Buckholt. Nothing
here is design-system guidance (`AGENTS.md`). Findings for the spec, Figma
and Buckholt are in `SPEC-CHANGES.md`.

The spec copy in this folder is the supplied file with one change the brief
asked for: the three Figma links replace "Node ID to be found by frame name"
in the Screen index.

## Open it

| Page | What it is |
|---|---|
| `home.html` | CH home with the Audit Centre card switched on. Open goes to AU-00-01. |
| `index.html` | AU-00-01, the base page: Mobius users view. |
| `index.html#configuration-hub-users` | AU-00-03, the Configuration Hub users view. |

The shell's own variants work as on every CH page: `?seed=long-names`,
`?seed=test-only` and so on, and the Live / Test control. Test has no
Configuration Hub users records (the empty state) and five Mobius rows.

Live, after merge:
https://ogi-product-design.github.io/buckholt-ai/prototypes/CH-AUDIT-UM/home.html

## What was built

| Screen / flow | Built |
|---|---|
| AU-00-01 · Mobius users view | Title, description, one Tabs tab, content switcher, filter row (Search, Date, Action type, Account type, Changed by, Record type), table with Account type column, pagination. Seed: the ten AU-00-01 rows with dates rewritten as offsets, plus the two added rows. |
| AU-00-02 · Hover | Response button's own hover on the unselected option. Nothing else changes. |
| AU-00-03 · Configuration Hub users view | No Account type filter or column. Action type options in the spec's order. Changed by: client users A to Z, an "Open GI" group, then "System". The 26-record Live seed (22 in the last 30 days). |
| AU-01 · Switch views | In place, no reload. The URL fragment follows the view (`#mobius-users`, `#configuration-hub-users`) and opens it directly. Each view keeps its own search, filters, sort, page, rows per page and record type for as long as the page is open. "{n} results" announced politely. An environment change goes to the base page (the shell's behaviour), so both views reset. |
| AU-02 · Search and filter | Search waits for a 300ms pause, is case-insensitive and matches Affected user name, email and username, Changed by and Change summary. Multi-select display "Select" / "Anyone", one option's name, or "{n} selected". AND across filters, OR within one. Any change returns to page 1 and announces the count. |
| AU-03 · Record type | Grouped / Individual. Individual splits record 6 into Name changed + Role changed and record 9 into four User deleted rows. Sort, filters and search stay; page 1. |
| AU-04 · Audit details | Configuration Hub users rows: chevron or a click on the row opens the drawer, the row is highlighted. Header bar "Audit details" with close icon; the Action as title; Event information; the pattern sections from the spec; footer Close. Close, the icon, Escape or the scrim close it; focus returns to the row's chevron. |
| States | Empty ("No changes in this period."), No results ("No results found. Try changing your search or filters."). Pagination hidden in both; filters usable. |

### Inert elements

- **Mobius users row chevrons and row clicks.** Out of scope (spec). The
  chevron keeps its name, "View details for {Action}, {Affected user}", and
  its Tooltip; activating it does nothing.
- **The Error state** ("Something went wrong. Try again."): not reachable,
  as the spec says. Not built.
- **The User Management tab.** It is the only tab and is already selected.
- **Shell items**, exactly as CH-SHELL makes them inert: the Mobius link and
  the avatar menu's items.

## How the shell is reused

CH-SHELL's contract says a feature switches its app on by editing
`shell/ch-registry.js`. That folder may not be edited (the brief), so — as
CH-USERS does — the edit is replaced by small local pieces:

| File | What it does |
|---|---|
| `ch-audit-um-registry.js` | Loaded after the shell's `ch-registry.js` and before `ch-shell.js`. In memory only: sets `audit-centre`'s `basePage` to `../CH-AUDIT-UM/index.html`, and adds `audit-centre` to every seed's app list in every environment ("switched on in the default seed variants"). |
| `home.html` | The home entry page with the override applied (the user chose the CH-USERS approach, 5 Nov 2026). The chrome is the shell's own; only the card list (about 25 lines) repeats `CH-SHELL/index.html`. |
| `ch-audit-um.js` | Calls `CHShell.init()` with app `audit-centre`, page "User Management" and the trail "Audit Centre > User Management", then points the lockup at `home.html`. |

The CH-SHELL contract items the spec states:

| Contract item | Built |
|---|---|
| Registry app | Audit Centre, on in every seed. |
| Base page | `index.html` (Audit Centre > User Management). |
| Breadcrumb | "Audit Centre > User Management" on every screen. "Audit Centre" links to the base page, which is this page. |
| Document title | "User Management \| Audit Centre \| Configuration Hub", with "[Test] " in Test (the shell). |
| Unsaved changes | None. |
| App-level header navigation | None. |

## Page structure

```text
layout-03 (CH shell: header, breadcrumb band)
└─ main
   └─ .page-body > .page-frame > .container-fluid > .page-pane > .page-panel
      ├─ Text block: h1 "Audit Centre", description
      └─ Tabs (one tab) > tab pane
         └─ .au-view (Panel's 32px rhythm)
            ├─ content switcher (Gap 1)
            ├─ filter bar (Gap 3)
            └─ table + pagination (Gaps 4, 6)
```

## Buckholt components used

| Component | Where | Notes |
|---|---|---|
| Tabs | User Management tab | Code & specs example 1, one tab. |
| Response button | Content switcher | Native radios, as CH-SHELL's environment control. |
| Text input | Search | With the input icon, as CH-USERS. Visually hidden label "Search". |
| Select | Date, Account type, Results per page | Native. |
| Dropdown | Action type, Changed by | Multiselect item structure; see Gap 3. |
| Menu button | Record type | Example 1 structure, Ghost. |
| Table | Audit table, Change details | Sortable headers, `.table-gap`, `.col-fit`, `.cell-data-right`. `.no-italics` on both: the first column is the Action, not an identifier. |
| Avatar | Every person | Extra small. Initials; icon form `fa-user` (invitee, grouped bulk deletion); icon form `fa-user-robot` (System; the icon Avatar's Code & specs shows); image form for Open GI (Gap 5). |
| Tooltip | Chevron "View details", Open GI avatar "Open GI user", truncated text | Options from Tooltip Code & specs example 3. |
| Button | Chevron (Ghost icon-only), pagination, Close (Primary) | |
| Key-value pair | Drawer sections | Stacked list. |
| Tag | "Open GI" after an Open GI Changed by in the drawer | Small. |
| Card | Deleted invitation, deleted accounts | Non-interactive. |

## Buckholt gaps (built here, prototype-local)

Each was checked against the live repo before it was built; the result is in
`SPEC-CHANGES.md` C1.

| # | Gap | Built as |
|---|---|---|
| 1 | Content switcher | Response button radios in a 1px outlined box (`ch-audit-um.css`). Selected = Response button's checked state; unselected option drops its border. |
| 2 | Drawer | The shared `prototypes/shared/blade.*`, unchanged, full height over a scrim. Width 600px (the blade's default). |
| 3 | Filter bar, multi-select checklist | Flex row. Dropdown's trigger and panel with native Checkbox items, opened by Bootstrap's Dropdown only; summary label instead of Tags; Open GI group heading uses Menu's `.menu-section-header`. |
| 4 | Table extras | Pagination (first, previous, pages, next, last; Results per page; Showing), selected-row tint, ellipsis truncation with hover Tooltip. Same construction as CH-USERS. |
| 5 | Avatar variants | Open GI only: Avatar image form with the Open GI mark (`assets/open-gi-mark.svg`, the "ogi" paths of the CH lockup, unchanged) in a 1px Primary 60 ring. System and generic use Buckholt's documented icon form. |
| 6 | Empty and no-results states | A Text block row in place of the rows, centred. |

## Deviations and judgement calls

1. **Organisation stays "Northgate Insurance Services".** The spec says
   "Greenlight (from CH-SHELL)", but CH-SHELL has no Greenlight seed. The
   user chose to keep the Northgate header and leave the seed people on
   `@greenlight.co.uk` (5 Nov 2026). SPEC-CHANGES A1.
2. **Own home page and in-memory registry override** (user's choice, the
   CH-USERS approach). The lockup on the audit page goes to this `home.html`.
3. **One tab.** Figma shows AutoMATE and Third-Party Services too; the spec
   keeps only User Management.
4. **Switcher styling is Buckholt's.** Figma draws the selected option as a
   pale fill without an outline, and its hover as a grey fill; Response
   button outlines the selected option (not colour alone) and has its own
   hover.
5. **Record type is a Ghost Menu button with a caret.** Figma draws a link
   with a table icon and no caret. The current choice is in the trigger
   label; in the open menu it carries `aria-current="true"` but no visible
   mark, because Buckholt documents selectable Menu items only inside a
   submenu, and its selected style is scoped to `.submenu` (SPEC-CHANGES C4).
6. **Multi-select is not Buckholt's enhanced Dropdown.** `dropdown.js` turns
   selections into Tags and moves ticked options to the top on open; the
   spec wants "Select" / "{n} selected" in the trigger and a fixed order with
   a group heading. So the script is not loaded. Accessibility: the source's
   `role="menu"` list of `role="option"` items with `tabindex="0"` is an
   invalid combination and was dropped; the list holds native checkboxes,
   the Open GI options are a `role="group"` named by the heading, and the
   trigger's name is "{label} {current value}" through `aria-labelledby`.
   `data-bs-auto-close="outside"` replaces the source's `"false"`, whose
   outside-click closing lives in `dropdown.js`.
7. **Escape returns focus to the trigger** of the two checklists and the
   Record type menu. Bootstrap 5.1.3 closes a dropdown on Escape but leaves
   focus in the hidden list, where it falls to the page (SPEC-CHANGES C3).
8. **Truncated text shows its Tooltip on hover only, and is not
   focusable.** The spec says "hover and focus"; CH-SHELL revision 4's rule
   is that truncated plain text is not focusable. The full text is in the
   DOM, so it is read in full. SPEC-CHANGES A5.
9. **"Showing 1-10 of 22" uses a hyphen**, as the spec writes it. CH-USERS
   uses an en dash. SPEC-CHANGES A9.
10. **"1 result"** for one result; the spec gives only "{n} results".
11. **Sorting is announced**: "Sorted by {column}, ascending." The spec says
    the current sort is announced; `aria-sort` on the header carries it too.
    A new column sorts ascending first; Date and time starts descending.
    Ties are newest first.
12. **Date presets.** "Last n days" is today and the n − 1 days before it;
    "Last 12 months" is 365 days. The spec defines neither (SPEC-CHANGES A6).
13. **Mobius Action type options** are the actions in the Mobius seed, A to
    Z. **Changed by options**, in both views, are the people in that view's
    Live seed (so the lists do not change with the environment); "System"
    appears only where the view has System records, so not for Mobius users.
14. **Changed by lists names as at the event**, so "Emily Tailor" and
    "Laura Chen" are options (their self-actions), not today's names.
    SPEC-CHANGES A11.
15. **Mobius rows are in date order.** The screenshot's four "today −24"
    rows are not in time order (13:15, 18:51, 17:32, 17:24); with the
    default newest-first sort they show 18:51, 17:32, 17:24, 13:15.
16. **Times for the two added Mobius rows**: 10:00 (today −80) and 14:30
    (today −85). The spec gives none.
17. **"B2B Settings changed"** is kept exactly as the screenshot writes it.
    SPEC-CHANGES A16.
18. **Search in a grouped bulk deletion** matches every account it deleted
    ("marcus" finds record 9). Its visible Affected user is "4 users".
19. **Seed details filled in.** Records 17 and 23 list only "Role" in the
    spec; their User details use the full User created set (Username, First
    name, Last name, Email, Role, Status Active, MFA Set up). Every
    "Invitation sent" link expires 14 days after it was sent, which gives
    the spec's today +14, +10 and +1.
20. **Drawer, over the whole page.** CH-USERS places its blades under the CH
    top bar so its environment control stays usable for an unsaved-changes
    check. The audit drawer is a modal dialog with Tab contained (spec), so
    it covers the top bar too.
21. **Drawer headings.** The blade's header bar is its own `h2`, "Audit
    details"; the Action is an `h3` that names the dialog
    (`aria-labelledby`) and takes focus on open; section headings are `h4`.
    The close icon is renamed "Close" (the shared blade names it "Close
    {title}"). Close is right-aligned, as Forms allows in side panels.
22. **Event information "User"** for a grouped bulk deletion is "4 users".
    A Deleted invitation card is headed by the email.
23. **Open GI avatar trigger is focusable** (a wrapper with `tabindex="0"`)
    so its Tooltip shows on focus; the image's alt text is "Open GI user".
24. **Every initials avatar is Buckholt's default colour.** Figma varies the
    colours per person.
25. **The fragment is replaced, not pushed**, so switching views adds no
    history entries; a link with the fragment opens that view.
26. **Filter row wraps** to two rows below about 1300px. Usable at 1088
    (spec), the table scrolls inside Table's own container.
27. **Event IDs** are fixed hashes of the record number, so they are the
    same on every load.

## Tests

`test/ch-audit-um.js` — 263 assertions. `AC 1` to `AC 14` follow the spec's
acceptance criteria in order; further blocks cover the Mobius seed and
pagination, sorting, the switcher's keyboard and hover, accessibility,
truncation, 1088px, the home card and that the registry override stays
local.

`test/README.md` is not updated: it is outside this folder and holds
uncommitted edits. Its table needs a row for `ch-audit-um.js` (263) and a
new total. Likewise `prototypes/README.md` does not yet list this
prototype.

## Known limits

- The mirror the suites run against has no Proxima Soft and only Font
  Awesome Free: `fa-user-robot`, `fa-chevrons-left/right` and the Pro
  regular icons do not draw there. Check icons and text widths on the real
  page.
- State is in memory: a reload starts over (spec).
