# Mobius navigation prototype: build notes

This rebuilds `reference/mobius-live-policy.html` with Buckholt components, following the
conventions of `Originators/` and `BACS-import/`. The structure, behaviour and wording come from
the prototype. The look comes from Buckholt.

## Runtime contract

This is the order `CLAUDE.md` specifies, with the shared prototype layer and this feature last:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="../css/buckholt.css">
<link rel="stylesheet" href="../css/buckholt-ai-fixes.css">
<link rel="stylesheet" href="../prototype/app-shell.css">
<link rel="stylesheet" href="../prototype/blade.css">
<link rel="stylesheet" href="mobius-navigation.css">
...
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../prototype/app-shell.js"></script>
<script src="../prototype/blade.js"></script>
<script src="fixtures.js"></script>
<script src="navigation-model.js"></script>
<script src="pages.js"></script>
<script src="mobius-navigation.js"></script>
```

There is no separate Bootstrap stylesheet. jQuery and `form.js` are not loaded because no
Form-script behaviour is used. The prototype's IBM Plex fonts, its colour variables and all of
its CSS are dropped.

`css/`, `components/`, `foundations/`, `patterns/`, `code-specs-html/`, `prototype/`,
`verification/`, `discrepancies/`, `Originators/` and `BACS-import/` are untouched.
`python3 test/source-parity/check-source-parity.py` still passes in both directions.

---

## Page structure

```text
.layout[data-layout="layout-03"][data-layout-surface="flush"]   ← Buckholt CSS Grid
├─ header.app-bar            ← shared static Mobius chrome (prototype/app-shell.css)
├─ aside#sidebar             ← the two-level menu, Buckholt components
└─ main#main
   └─ .page-body > .page-frame > .container-fluid > .page-pane
      ├─ .page-panel         Breadcrumb, then the page heading: Text block (eyebrow + h1) + heading actions
      └─ .page-panel …       page content: Cards on the Bootstrap grid
```

The top bar carries the prototype's own contents: the Menu button, the "Mobius" wordmark, the
search field, "Show wording changes", the environment ("Test"), the clock and the avatar. The
clock is live, as in Originators and BACS Import (Laurence's request, 30 September 2026). The
module navigation of the other features (AutoRek, BACS) is not shown, because in this
prototype the left column *is* the redesigned menu.

---

## The two-level navigation (simplified 7 October 2026)

The menu had grown heavy: search, a help panel, back links, a client or policy card full of
Key-value pairs, policy cards, "Go to", "Actions" and Client support, all in one column. It now
follows Laurence's colleague's designs, which work like the Buckholt documentation site's own
sidebar: **two slim columns** at client and policy level, both about the client you have open.
The search is not in them: it is in the **Broking bar** (below), because it only searches Broking.

**The Broking bar (Laurence, 7 October 2026, option 3 of the search audit).** The search only
finds Broking clients and policies, not Accounts, Bordereau or the other modules, so it cannot
sit in the global top bar; and in the rail it suggested its results ("motor") belonged to the
client menu. It now sits in a bar under the top bar on every Broking page (Dashboard, search,
Create new client, client and policy pages). On the left: a **back arrow** to the Dashboard (an
icon-only ghost Button, "Back to dashboard" in its accessible name and Tooltip; not on the
Dashboard itself), then, on client and policy pages, **the client in User meta laid out in one
line** (small Avatar, name, reference). On the right: **Create new client** as a ghost Button
(not on Create new client itself), then, at the far right, **search, an icon-only secondary
Button** (Magnifying glass, "Search clients and policies", Tooltip) that opens the search Modal;
secondary so the lone icon holds its place (Laurence, 7 October 2026). There is no search
field any more (Laurence, 7 October 2026): the field only ever opened the Modal, so it was not a
real search. The Dashboard has the same two Buttons. Below 768px the reference is left out;
below 576px the Avatar too, and Create new client shows its icon with its label visually hidden.
The bar never widens the page: the client's name gives way. It has no "Broking" title: the top
bar already marks Broking as current, and the bar keeps "Broking" as its accessible name. The bar is sticky under the top bar; the menu columns sit under it. It is not shown on the other
modules. "/" opens the search from anywhere in Broking, unless you are typing in a field.
Building it needed no new component: Buttons and User meta in a flex row with Buckholt's
spacing, border and background tokens. Buckholt documents no module or sub-header bar, so this
is a gap to raise.

**A column for each level (Laurence, 7 October 2026).** Before this, the second column held the
client's pages on a client page and the policy's menu on a policy page, so picking a policy
swapped the column's contents and collapsed the rail you had picked it from: it read as going
back, not in. Now each column has one meaning. The **rail is the client**: their details, their
pages and their policies, on every client and policy page. The **second column appears only
when a policy is open** and is that policy's menu, with the policy still marked in the rail to
its left. Going deeper adds a column; going back to a client page removes it. The client's pages
stay one click away from any policy.

| Column | Contents | Built with |
| --- | --- | --- |
| Rail (304px open), as in Laurence's Figma design | **No colour of its own beside the policy column**: like a mail client's folder pane (Laurence, 7 October 2026), it sits on the page background (`--ui-background-02`). **At client level, where it is the only column, it is the white panel** (inset 8px, 8px radius, Card's border), as the policy column is; once a policy opens, the panel passes to the policy column. **No head**: the client is named in the Broking bar above, so the rail starts with a **Client** label (as Policies has) and the **client's pages**, flat, with their icons: **Client overview** (Home), **Add new quote**, Business details, Transactions, Activity, Complaints, Client checks. Then **Policies**: one link per policy: a **small Car icon with no Icon block** (Laurence, 7 October 2026: the blocks were too heavy), the **status as an eyebrow** above it (Buckholt's `.eyebrow`, plain text, no Tag: Laurence, 7 October 2026), then the line of business (16px, medium) over the reference (14px, light, secondary), the same as the policy column's head; "Show 2 more" / "Show fewer"; **Client support** at the foot, with the rail's **collapse button at the foot's right** (as in Outlook or VS Code). On a policy page the rail scrolls itself (not the page) to bring the open policy into view beside its menu | Page navigation, stacked (`ul.nav.flex-column > li.nav-item > a.nav-link`, Page navigation's own `.active`); Tag; Avatar, Title 01 (see deviation 4a). The open policy is `aria-current="true"`: it marks the record, not the page. Client support opens its side panel and is a ghost Button |
| Policy column (policy pages only, no collapse button; 304px) | A **white panel inset 8px** from the top and bottom (and from Main), with Buckholt's 8px radius (`--border-radius-md`) and Card's border colour, no shadow (it is not elevated). A head in User meta's type: the **status as an eyebrow** (no Tag), then the line of business ("Open Market Motor") over the reference, like the policy's row in the rail, then the **policy's actions in a row** under it (below), and the policy's pages in **always-open groups** (no accordion). Documents, Attachments, Notes and History carry their **count badge**. | Head: User meta type (no component: the record has no Avatar); Page navigation with `.active` + `aria-current="page"`; each group's label is text with its icon (a group is not a page), its pages indented under a rule |
| Policy actions (in the policy's head) | Every action of the policy's status, as icons in one row under the title, like a mail client's inline actions, in the prototype's groups (Policy · MTA · Renewal · Customer portal), a rule between groups; **Stop and Cancel behind a "⋮" Overflow menu** at the end. Hover or focus shows the action's name. A status with more actions than fit wraps to a second row | Icon-only ghost Buttons (Button's documented icon-only structure, medium size) with `aria-label` and the Tooltip Buckholt requires for icon-only Buttons, in Button sets. The Overflow menu is Menu button's Code & specs example 3. See deviation 2 |

**How the columns open and collapse (Mark Feltwell and Laurence, 7 October 2026).** Which
columns are open follows where you are:

| Where | Rail | Record column |
| --- | --- | --- |
| Dashboard, Create new client, other modules | none (no left menu) | none |
| Client pages | Open: the client and their pages and policies | none |
| Policy pages | **Collapsed** to a 64px strip, to leave the page room (Laurence, 7 October 2026); opened, the policy is marked | Open: the policy's menu |

- *"All sidebars that are considered collapsible display a collapse button that also functions
  as an open button, so the user has control of what they see."* Both columns have one at their
  top right: an icon-only ghost Button ("Collapse client menu" / "Open client menu";
  `aria-expanded`, Tooltip). The policy column has no collapse button
  (Laurence, 7 October 2026). On a policy page the rail collapses by itself, since there is not
  enough room for both columns and the page; opened by hand, it stays open until the next page,
  which sets it again. Opened directly (a link or a reload), a policy page draws the rail
  already collapsed: it slides only when it changes in front of you. Open, a column is in the flow: the one beside it
  moves over rather than being covered.
- *"When sidebar is collapsed: items under a category collapse into a single icon button."*
  Collapsed rail: **Client pages (one User icon button)** (the current category is marked in Page navigation's light active tint, not the ghost Button's solid pressed colour) and
  **Policies (one Shield icon button)**,
  spaced evenly; Client support becomes an icon-only Button. **Pressing a
  category opens the rail at that category** (Laurence, 7 October 2026: the Shield opens the
  rail rather than a floating menu): focus moves to the current client page or the open policy. Every collapsed control has its accessible name and a
  Tooltip.
- Below 1280px both columns live in the drawer, open, with no toggles.

> Collapsed, a policy's status shows once the rail is open. A status mark on the collapsed icon would need a Buckholt indicator (Badge is
> undocumented here), so it is left out.

The rail uses Buckholt's **light theme**, following Laurence's Figma design (it was the dark
theme on `--expressive-rich` in the previous rounds). The documentation site's own sidebar is
site chrome (`sidebar.css`, `sidebar_container`, `submenu_link`), not a Buckholt component, so it
is not copied: only Buckholt components sit in the rail.

Removed: the search from the menu (now in the Broking bar), back links, the client card with Avatar and Key-values, the policy card with Switch policy (the
rail is the switcher now), and the policy cards. Breadcrumbs stay; they replaced the blue record
strip in the previous round.

Both columns are rebuilt on every route. At app level (Dashboard, the other modules, Create new
client) there is no left menu on wide screens; below 1280px the drawer holds the modules.
`navigation-model.js` is a line-for-line port of the prototype's `GROUPS`, `policyNav`, `A`,
`policyActions`, `policyFlows` and `allowedPolicyPages`. The status rules are therefore exactly
the prototype's:

| Status | Groups | Menu actions | Heading |
| --- | --- | --- | --- |
| Live | Policy (details, claims, Amend policy, Add new quote), Transactions (no Transaction documents), Correspondence, More details | Copy · Add MTA, Policy extension · Renewal invite · Customer portal settings · *divider* · Stop, **Cancel** | Add new quote (secondary), Amend policy (primary) |
| Prospect | Quote, Policy, Transactions, Correspondence, More details | Copy · Customer portal settings | Add new quote, Amend policy |
| Automatic Decline | Quote, Policy (details, Amend policy, Add new quote; no claims), Correspondence, More details. **No Transactions** | Copy · Customer portal settings | Add new quote, Amend policy |
| Incomplete | Policy (claims, Amend policy), Transactions, Correspondence, More details | Copy · Customer portal settings | Amend policy |
| Lapsed | Policy, Transactions, Correspondence, More details | **Reinstate policy**, Copy · Customer portal settings | Add new quote (primary) |

## System navigation (7 October 2026)

Laurence asked for the best experience for system-level navigation. The decisions:

| Need | Built with | Why |
| --- | --- | --- |
| System modules: Broking, Activity, Renewals, Bordereau, Accounts | Page navigation with icons, horizontal, in the top bar (`nav.mob-modules`, `ul.nav > li.nav-item > a.nav-link`, icon directly inside the link, `.active` + `aria-current="page"`). Below 1280px they move into the drawer, stacked | Modules are separate sibling pages, which is what Page navigation is for. The prototype's "Dashboard" is the Broking module, so it is named Broking, with the catalogue's Shield icon (Laurence, 7 October 2026) |
| Broking landing page | **Dashboard** (`#dashboard`, also the default route and the wordmark's link), as current Mobius has it: two Tabs, Outstanding diary and Sanctions check matches, each a Card with a filter bar, a Table of sample rows and "Load more". Sanctions status is a status Tag; "Assigned to" is an extra-small Avatar and the name. Create new client is the page's one primary, in the heading | No search results until a search has been run (Laurence, 7 October 2026). Tabs, because the two views switch in place on one page. Current Mobius paginates; Buckholt has no Pagination component, so the tables use the same "Load more" standalone Link as every other list here. The Days overdue From/To pair is left out of the diary filters: it needs a range input Buckholt does not document |
| What can I search? (in the search Modal) | A ghost Button with the Info icon to the right of the Modal's search field, as current Mobius has it. It opens a floating help panel: the title with a close Button, a Buckholt List per group (list heading and items), the tip, and "Learn more" as a standalone Link with the External-link icon; current Mobius wording in sentence case. Escape closes the panel first, back to its Button. **Buckholt has no Popover** (no `.popover` styles in `buckholt.css`, and no Bootstrap stylesheet is loaded), so the panel is a Menu panel (`.menu-panel.dropdown-menu`) on Bootstrap Dropdown, with fixed positioning so it floats over the Modal's scrolling body | Gap to raise with Buckholt: a documented Popover |
| Search results | In the search Modal (below), not a page. They filter the sample rows on name, reference or email, with a no-results state ("No clients found for “{query}”"). The client's name is the link to the client. An old `#search/{query}` link opens the Modal with that search over the Dashboard | |
| Search (Jon's suggestion, 7 October 2026) | The **search icon Button** in the Broking bar (it replaced a field that only opened the Modal) opens a **search Modal** (Buckholt Modal, Code & specs example 1, `.modal-xl` and `.modal-dialog-scrollable`) (or "/" anywhere in Broking, unless you are typing in a field); when it closes, focus returns to the icon Button. The page you are on stays behind it. The Modal has its own field, with Buckholt's clear button (Text input Code & specs example 6, `.input-btn.input-clear`, driven by `components/form/form.js` with jQuery loaded first, as CLAUDE.md sets out); clearing shows recent searches again; until a search is run it shows **recent searches** (a Buckholt Menu shown in place, a section header and items with the Recent icon; Down arrow moves into it, Up / Down through it, picking one runs it; the last five, newest first). Running a search shows the results in the Modal; opening a client or policy from them closes it, and Escape closes it with focus back on the field (which does not reopen it). "/" opens it too | The search keeps you where you are, and the results are one Escape away from the page behind |
| Breadcrumbs (replace the blue record strip) | Breadcrumb, location-based, at the top of Main above the heading: Dashboard › client › policy › page. The search is a Modal, not a place, so it is not in the trail. The last item is the current page (`.active`, `aria-current="page"`). None on Dashboard or the other modules, which are top level | Breadcrumbs must not wrap, so a trail of more than four items puts its middle into Breadcrumb's documented overflow menu (Code & specs example 2), and below 768px only the first and last stay out of it |
| User settings | Menu button whose trigger is the Avatar (`LA`), `dropdown-menu-end`: the user's name as a section header, then Unlock records, Clear cache, Change password, Release notes, Cookie policy, a divider and Logout, as in Mobius today (sentence case). Each shows a "not part of this prototype" toast | Menu button is Buckholt's documented trigger + Menu. The trigger has an accessible name ("User menu, Laurence Abbott") |
| A full top bar | Between 1280 and 1680px the "Show wording changes" label is visually hidden (still named), the module links use one step less padding, now that the search has left the bar. Checked at every width from 360 to 1920px | |

Module pages other than Broking are placeholders ("The existing Mobius {module} module sits
here.").

## Menu actions, panels and confirmations

- **Side panels** (Add MTA, Policy extension, Customer portal settings, Client support, and every
  page action that opens one) use the shared prototype Blade, which is built on the Bootstrap
  Offcanvas plugin with a scrim, focus trap, Escape and focus return. Its footer is a Button set
  (`button-set-end`): Cancel (ghost) then Save (primary), following the Forms pattern for side
  panels. A panel action shows the trailing Expand icon ("Expand or open a panel") and keeps
  `aria-pressed="true"`, with Menu's own active colours, while its panel is open.
- **Confirmations** (Renewal invite, Copy, Reinstate, Stop, Cancel, New sanctions check, Convert
  to policy) use one Buckholt Modal in the page source (Code & specs example 1). The confirm
  Button is `btn-primary`, and `btn-primary btn-danger` for Cancel policy only. Focus starts on
  Cancel, Tab wraps inside, Escape closes it, and focus returns to the trigger.
- **Amend policy and Add new quote in the menu (Laurence, 7 October 2026).** In current Mobius
  they are menu items, so they are pages in the **Policy** group, after Policy details and Claims
  (which of them a status has follows the prototype's `policyFlows`, the same as the heading).
  **Admin fee and Manual credit / debit open side panels**, so they are not menu items: they are
  Buttons on the Account summary page only. **Transaction documents is removed** (Laurence, 7
  October 2026); its placeholder page went with it.
- **Page and card actions stay on the page**: Add client header, Add client link and connection,
  the portal access Switch, New sanctions check, Add complaint, and Admin fee and Manual credit /
  debit on the Account summary card (Live only, as in the prototype).
- **Heading actions** open pages, so they are anchors with Button styling. The Policy overview's
  quick links (Documents, Attachments, Notes, History) are gone (Laurence, 7 October 2026):
  their counts are badges on those pages' links in the policy menu instead, read out as
  ", 3 new". Client overview has the
  Client notes icon Button with its count badge, "View claims" (secondary) and "Add new quote"
  (primary). Adding a client note updates the badge.

## Policy lists

There is one shared count, which starts at 5. It is used by the rail, the Client overview's
Client policies table and the search results. Each list is sorted by cover
start, newest first. "Load 2 more (2 remaining)" becomes "Show fewer", and the table version
reads "Showing 1 to 5 of 7, most recent first". After the list re-renders, focus stays on the
button that was pressed.

## Wording

Every string is the prototype's. Each `hl()` is written `[[…]]` in the source and rendered as
a `<mark>` while **Show wording changes** is on (Buckholt Switch, small, in the top bar). The
mark uses the tertiary expressive pink. With the switch off, the same text renders plain. Trade
terms (MTA, NCD, IPN, D.O.C.) are not expanded, per the brief and log T19. Data values such as
excess names and "Automatic Decline" are kept as data.

## Accessibility

- Navigation items are links, with `aria-current="page"` on the single current page, in the
  record column. In the rail, the open client or policy is marked `aria-current="true"` (the
  current item of a set): it is the current record, not the current page.
- Actions are buttons in a toolbar (deviation 2). Group headers in the policy menu are disclosure
  Buttons (`aria-expanded`, `aria-controls`); focus stays on a header when it opens or closes.
- Panels and confirmations trap focus, close on Escape and return focus to their trigger. When
  re-rendering replaced the trigger, focus goes to its successor.
- Icon-only controls (collapsed menu items, toolbar actions, Client notes, Menu, Close menu) have `aria-label` and a
  Tooltip using the options from Tooltip's Code & specs example 3.
- A route change moves focus to the page `<h1>`. A skip link goes to it too.
- **Drawer**: below 992px the menu becomes a drawer behind the Menu button. While it is open,
  it is `role="dialog"` + `aria-modal`, the top bar and Main are `inert`, Tab wraps, Escape and
  the scrim close it, and focus returns to the Menu button. A panel or confirmation opened from
  the drawer covers it, and closing that leaves the drawer open with focus back on the action.
  Following a link closes the drawer.
- Every table is named with `aria-label`, and every unlabelled column has a hidden heading. A
  visually hidden `<caption>` is not used: it keeps 1px of height inside `.table-content`, which
  scrolls in both directions, so every table showed a vertical scrollbar.
  Yes/No questions are fieldsets with a legend.

---

## Deviations and judgement calls

Each of these is a place where the prototype and Buckholt did not agree, or where Buckholt
documents nothing. None of them invents a Buckholt rule.

### 1. Page navigation, stacked, as a side menu

Page navigation is documented as a horizontal row. `.flex-column` (a Bootstrap utility in the
runtime) stacks it, as Buckholt's own documentation site does for its sidebar. Stacked, it must
not wrap (`flex-wrap: nowrap`), or the column sizes its links to their content. Long labels wrap
(`white-space: normal`). Group pages use `--nav-link-height: 2.75rem`, the same value `.nav-sm`
sets. A rail link carries two lines and a Tag inside the link, which Page navigation's Code &
specs does not show. The prototype draws the current page in black; Buckholt's
`.active` (light blue) is used instead.

> **Gap to raise with Buckholt:** a documented vertical / side navigation, including grouped
> sections and a dark rail like the documentation site's.

### 2. Actions in a toolbar (7 October 2026)

The actions used to be a Menu shown in place at the foot of the record column, then an
Adobe-like 48px vertical strip beside it. Laurence then asked for them as a **row of inline
actions under the policy's title**, like a mail client's reading pane, with the policy menu a
little wider (336px) to hold them. Buckholt has **no Toolbar component**, so the row is assembled
from documented parts: icon-only ghost Buttons (40px, Button's medium icon-only size), each with
an accessible name and a Tooltip below it (Buckholt's requirement for icon-only Buttons), grouped
in Button sets.

- It is an ARIA `toolbar` (`aria-label="Policy actions"`, `aria-orientation="horizontal"`), one
  Tab stop with a roving tabindex: Left / Right, Home and End move along it. Each group is a `role="group"` named
  after the prototype's section header; the rules between groups are separators.
- A panel action is `aria-pressed="true"` while its panel is open, drawn with the ghost Button's
  own hover colours. Panels and confirmations still return focus to the toolbar Button.
- **Stop and Cancel are behind an Overflow menu** (Mark, 7 October 2026: they are destructive,
  so not one click away). It is Menu button's Code & specs example 3: an icon-only ghost
  `.menu-toggle` with `fa-ellipsis-vertical`, named "More actions" with its Tooltip on the Menu
  wrapper (as Breadcrumb's overflow menu does), **at the end of the row** after a rule, away
  from the everyday actions, and opening its Menu below. Cancel is
  Menu's danger item, which Buckholt draws red on hover. Each still asks for confirmation; when
  the confirmation closes, focus returns to the "More actions" trigger.
- Below 1280px, in the drawer, it stays in the policy's head.
- Lost from the old Menu: the visible labels and the trailing panel / page icons. Icon-only
  actions rely on recognisable icons; MTA (`fa-swap-arrows`) and Stop (`fa-circle-pause`) are
  catalogue gaps (see deviation 9).

> **Gap to raise with Buckholt:** a documented Toolbar (a row of icon Buttons), including grouping,
> pressed state and keyboard model.

### 3. Heading actions that open pages are anchors styled as Buttons

Button says "use Button for actions, Link for navigation". "Add new quote" and "Amend policy"
open a page, and the brief puts them in the heading as buttons. They are `<a class="btn">`, as in
the prototype, so they keep link semantics.

### 4. Count badges follow Mark's badge design

The design draws a red circle with a white count, centred on the top-right corner of the Button,
which widens to a pill for "999+". It isn't in Buckholt's documentation yet. It is built on the
runtime `.badge.badge-floating` by binding that component's own custom properties to Buckholt
tokens: `--action-danger-01`, `--text-light`, `--border-radius-full` and `--shadow-xs`. Counts
over 999 read "999+". The badge is `aria-hidden`, and the count is in the Button's accessible
name.

In the policy menu the same badge sits inline at the end of a link (the floating offsets and
translate cleared), with the count in visually hidden text.

> **Gap:** `.badge` and this design are not in Buckholt's documentation.

### 4a. The client is shown with User meta

The client is shown with the runtime's User meta in the Broking bar: the small initials Avatar
(`.avatar-sm`), then the name and reference **in one line** (the body laid out as a row, an
adaptation of User meta's stacked lines). A centred profile in the rail was tried and dropped
(Laurence, 7 October 2026), then the client moved out of the rail into the bar. Buckholt has **no User meta
documentation or Code & specs** in this repository. The markup follows the runtime's own
selectors in `css/buckholt.css`: `.user-meta.user-meta-compact`, `.avatar`,
`.user-meta-body > .user-meta-first + span`. The live reference build names the same component
`.account-meta` (`discrepancies/build-provenance.md`), so on live this markup would be unstyled.

> **Gap to raise with Buckholt:** document User meta / Account meta and settle its class name.

### 4b. Incomplete takes the info status

The plain read-only Tag drew Incomplete as a solid grey pill, which read badly beside the status
colours, especially on the dark rail. It now uses Tag's info status variant with its icon.

### 5. Flow progress uses Progress bar, not a stepper

The prototype's step chips have no documented Buckholt equivalent. `.stepper` exists in the
runtime but is undocumented, so the documented Progress bar is used. Its label is the step name
and its note is "Step 2 of 3". The full list of step names is not shown. Below 576px the
Progress bar's 22rem minimum is relaxed for this page only, as
`responsive/component-guidance.md` recommends.

> **Gap:** a documented stepper.

### 6. Segmented controls are Tabs

Outstanding / History, Documents / Archive, Policy / Client, Table view / Timeline view, Quote
breakdown / MTI details and Current items / Other items all switch content in place, which is
Buckholt Tabs (`.nav-underline`, Bootstrap pill behaviour).

### 7. Things Buckholt has no component for

| Prototype | Built as | Why |
| --- | --- | --- |
| Statistic tiles | Key-value grid of stacked, flipped `.key-value-lg` pairs | No stat tile |
| Loss-ratio donut ("N/A") | Stacked Key-value, "N/A" over "No claims" | No chart, and nothing to chart |
| History timeline | Date + Versa-tile | No timeline |
| Info strips | Alert, info, without a close control | |
| "Existing … content sits here" | Alert, info, titled **"Placeholder: existing Mobius content"**, with the prototype's own sentence | Activity, Renewals, Bordereau and Accounts modules, Client support |
| Values that open a panel in Policy summary, Excesses and Endorsements | Standalone Links with `role="button"` (Space activates them too). An unavailable one is muted text, because Link has no disabled state | Laurence's decision, 7 October 2026: Link's rules reserve it for navigation, but these read as values |
| Field grids | Stacked Key-value pairs on the Bootstrap grid | |

### 8. Filter bars (7 October 2026)

Filter bars (Dashboard, Search results, Activity, Documents, Notes) follow BACS import and current
Mobius: the fields sit side by side at a content width (14rem) and wrap when they run out of
room, and the actions sit on the right, in line with the last row of fields. Buckholt does not
ask inputs to fill the space available, and Input rows prefers "content-driven proportions over
arbitrary equal widths". Below 576px each field takes the full width. The actions are a
right-aligned set, so the stronger action is at the outer edge: Clear (ghost) then Apply
(secondary), as Button's rules place it in a right-aligned layout and as the prototype drew it.
Editable forms stay in `.form-body`, Buckholt's stacked form width.

### 9. Icons

Icons from the catalogue are used as documented: Home, Dashboard, Shield, Search, User, Document,
Calculator, Pound, Email, Info, Flag, Shield-check, Edit, Change, Time, Renew, Redo, Plus, Copy,
Settings, Misuse, Help, Expand, Chevron-right/down, Recent, Documents, Arrow-left, Menu and
Close. The **catalogue has no entry** for the following, so they are marked `GAP` in
`navigation-model.js`:

| Need | Used |
| --- | --- |
| Business details | `fa-briefcase` |
| Activity | `fa-wave-pulse` |
| Stop policy | `fa-circle-pause` |
| Notes / Client notes | `fa-note-sticky` |
| Attachments | `fa-paperclip` |
| Create new client | `fa-user-plus` |
| Bordereau module | `fa-list` |

### 10. "Create new client" is in the Broking bar, not the menu

The reference prototype listed it as an app-level menu action. It opens a page, so it is an
anchor styled as a Button. It was the Search results heading's primary (6 October 2026); since
the Broking bar (7 October) it sits at the bar's right on every Broking page as a secondary
Button, so it never competes with a page's own primary.

**Client support** is in the menu foot only once a client is open, at client and policy level.
It is not shown on Broking, the other modules or Create new client, because there is no
client yet.

### 10a. One primary Button per screen

Button: "A page should normally have one primary call to action." Common actions: primary is
"normally limited to one per screen context". The prototype often had several, so the extra ones
are secondary here:

| Screen | Primary | Changed to secondary |
| --- | --- | --- |
| Dashboard | none (Create new client is secondary, in the Broking bar) | Apply (filters) |
| Checklist (every status) | Continue (Sale status) | Save (Checklist details), Add item (Outstanding items) |

Where a page has a heading action it is the primary; otherwise the primary is the page's one
main card action (for example Add complaint, New sanctions check, Convert to policy). Side panels
and confirmations are their own screen context, and each keeps one primary: Save or the confirm
action. An audit across all 120 routes, every flow step, every side panel and the confirmation
finds no screen with more than one primary.

### 10b. Button hierarchy and placement (7 October 2026)

The pages had too many outlined Buttons. Buckholt's hierarchy is applied as:

| Emphasis | Used for |
| --- | --- |
| Primary | The one main action of the screen |
| Secondary | Only beside the primary in the page heading, a filter form's Apply, a form's own Save, and Back in a flow |
| Ghost (the default) | Every other card and table action. As in Buckholt's table-action pattern, it shows an icon and a label; icons are all or none within a set |
| Standalone Link | Anything that navigates (Amend risk, back links), "more" actions on tables and content (Load more, Show fewer, Load more quotes, Show statistics for more clients), and values that open a panel |

Placement follows one rule:

- Actions on a whole card or table go in the card heading, top right, with any primary at the
  outer edge.
- A form's action goes at its end, left aligned, primary first (Forms pattern).
- Quote summary closes its card with Form's documented actions: "Convert to policy" (primary),
  then "Amend risk" as a standalone Link.
- "More" links go at the bottom left. Row actions stay in their row.

Filter bars are described in deviation 8. Editable forms in flows are stacked, as the Forms pattern sets by default. Intro sentences sit in
the card's Text block under its heading, as Text block example 1 does.

### 10c. Page titles use a Display type set

Typography: "Use display styles sparingly for standout moments such as page titles." The page
`<h1>` is `display-01` (36px), the smallest Display set. `headline-02` (28px) is a section-heading
style. The eyebrow above it is Text block's documented `<span class="eyebrow">` (Code & specs
example 3).

### 11. Small layout fixes, all scoped to this feature

- **Tightened menus (Laurence, 7 October 2026).** Both columns are 304px (from 320 and 336),
  which gives Main 48px more at policy level (824px at 1440). Menu items in both columns are
  **40px high**, below Buckholt's smallest Page navigation size (`.nav-sm`, 44px): a local
  choice, still far above the 24px minimum target size. **Gap to raise with Buckholt:** a
  compact Page navigation size for dense application menus. The rail's sides are 8px (its links
  carry their own inner padding), a policy row is 58px (was 66), and the client head is User
  meta. At 1440 x 900 the policy list now starts 452px down the rail (was 572).

- **The page's two columns also stack when Main is narrow.** Bootstrap's `.col-xl-8` /
  `.col-xl-4` follow the viewport, but beside the two menu columns Main is far narrower than the
  viewport: at 1440px the side column could not fit a statistic such as "£1,867.00". A container
  query on Main stacks them below 60rem, 32px apart (a Panel's gap).

- The two menu columns are sticky under the top bar and each scrolls on its own, with Client
  support pinned to the rail's foot.
- **Below 1280px the menu is a drawer**, with the modules (the Broking bar stays on the page), and the rail stacked
  over the record column. Two columns (520px) beside Main need at least 1280px; 1280 is not on
  Bootstrap's scale, so it is a layout breakpoint of this prototype only.
- A visually hidden column heading is absolutely positioned. Without a containing block inside
  `.table-content`, it escapes the table's scroller and widens the page whenever a table scrolls.
  `#main .table-content { position: relative }` keeps it inside. This is worth a Buckholt ticket.
- **Card padding (Jon's question, 7 October 2026).** Buckholt documents two Card sizes: default
  (32px padding) and `.card-lg` (64px). The runtime also has `.card-sm` (24px), but it is not in
  the documentation and Card's rules say not to promote undocumented size classes, so it is not
  used. Main's Cards stay at the documented default. A tighter documented Card size for dense administration screens would need
  to come from Buckholt.
- Button sets placed side by side (page heading, card heads, table foot) drop the runtime's
  stacked-set offsets: `margin-top`, and the `margin-bottom` it gives a set that has a following
  sibling. Left on, that margin pushed the Client notes button 4px above View claims and Add new
  quote.
- Breakpoints use the **local** build's scale (576 / 768 / 992 / 1200 / 1400), like every other
  prototype here. On the live reference scale they would land at other widths.

### 12. Refs are not monospaced

The prototype shows references in IBM Plex Mono. Buckholt has no monospace type set, so they use
the normal type.

---

## Verification

Rendered headless in Chromium via Playwright. The sandbox blocks the CDNs, so the Bootstrap
5.1.3 bundle was served from npm and Font Awesome **Free** stood in for the Pro kit. Pro-only
glyphs therefore rendered as boxes in those runs (`discrepancies/known-issues.md` → Font
Awesome), and Typekit was absent.

- **101 behavioural assertions, all passing.** They cover:
  - per-status groups, actions and heading for all five statuses
  - redirects
  - the single `aria-current`
  - the toolbar: its actions per status, the rule before Stop, the danger Cancel, accessible
    names, Tooltips, one Tab stop and arrow-key movement
  - quick-link labels and tooltips
  - columns by level: on a client page the rail only, with the client's pages in it; on a
    policy page the rail auto-collapsed (64px) beside the policy column; opened (304px), the open
    policy is marked and in view; the next policy page collapses it again
  - the collapsed rail: no floating menus; the client as its Avatar; Policies as one Shield
    button with a Tooltip that opens the rail (320px) with focus on the open policy; no search in
    the rail (it is in the Broking bar), and "/" opening the search Modal
  - the open rail: the client centred (Avatar, name, reference), no client pages in the rail, policies with Icon
    blocks, "Show 2 more"; the next page collapsing it again
  - the policy menu collapsing to a strip, and a group icon opening it at that group
  - groups always open with no accordion, and a count on Documents
  - no quick links in the Policy overview heading
  - Stop and Cancel behind the "More actions" Overflow menu, the confirmation from it, and
    focus returning to that trigger
  - the record column's head, the rail marking the open client or policy, newest-first order,
    Load more / Show fewer and focus retention
  - the shared count in the table
  - adding a client note, with the badge updating and focus returning
  - panel pressed state, focus trap, Escape and focus return
  - the confirmation's danger variant, initial focus, trap, Escape, focus return and toast
  - switching policy from the rail, with focus on the heading
  - the current page visible in its always-open group
  - Account summary card actions
  - the wording toggle
  - flow steps
  - one primary per screen, side panel and confirmation (separate audit)
  - the app level: no left menu, no Client support, the search and Create new client in the
    Broking bar, the button opening the flow and leaving the bar while there
- **Broking, search and breadcrumbs (26 assertions)**: opens on the Dashboard; the two Tabs
  switch; the filter actions sit at the right edge and the fields are content width; clicking
  the Broking bar's field opens the search Modal with recent searches, Down arrow moves into them and
  one runs, showing results in the Modal while the page stays; the no-results state; clearing
  the field brings recent searches back, newest first; opening a client closes the Modal; the
  client and policy columns; the policy breadcrumb without a search crumb; a bare `#search` and a
  `#search/{query}` link (which opens the Modal over the Dashboard).
- **Search and client menu (6 assertions)**: at 375px the search is in the Broking bar, runs in
  the Modal, and opening a result closes it; widened, it is still in the bar, not the rail; the
  client menu is Client overview, then the Client group with Transactions first.
- **Top bar**: nothing overflows or overlaps at every width from 360 to 1920px (8px steps).
- **Drawer at 375px**: hidden at rest, focus to Close menu, Main inert, Tab trapped, Escape
  closes with focus back on Menu, a panel opened over it closes back to the open drawer, and
  navigating closes it.
- **Sweep**: all routes (every page of every status, a no-results search and every module), at 1440 / 1024 / 768 / 375. No
  console or page errors, and no page-level horizontal overflow. Wide tables scroll inside
  Buckholt's `.table-content`.
