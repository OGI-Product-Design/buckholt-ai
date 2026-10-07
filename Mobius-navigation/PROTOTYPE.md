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
sidebar: **two slim columns** at client and policy level. The rail is on every page, with the
search at its top; at app level it holds only the search.

| Column | Contents | Built with |
| --- | --- | --- |
| Rail (blue) | **Search** at the top (Text input with its search icon); "Client" and the client's name; **Policies**: one link per policy (Car icon, "Motor", the status Tag on the same line, the reference under it, truncated with an ellipsis); Load more / Show fewer; **Add new quote**; **Client support** at the foot | Page navigation, stacked (`ul.nav.flex-column > li.nav-item > a.nav-link`, icon straight inside the link, Page navigation's own `.active`). The client link is `aria-current="true"` at client level, the open policy at policy level: they mark the record, not the page. Add new quote is a secondary Button (it opens a page, so an anchor). Client support opens its side panel and is a ghost Button |
| Record (white) | Which record this is: the client's name or the policy reference as an eyebrow, then "Client record" or "Motor policy" (`title-02`). Its pages in **always-open groups**: a group label with its icon (not a link: a group is not a page), then its pages indented under a rule. | Text block; Page navigation with `.active` + `aria-current="page"` on the current page |
| Toolbar (48px, policy level) | Every action of the policy's status, as icons, in the prototype's groups (Policy · MTA · Renewal · Customer portal), a rule between groups; **Stop and Cancel behind a "⋮" Overflow menu** at the end. Hover or focus shows the action's name | Icon-only ghost Buttons (Button's documented icon-only structure, medium size) with `aria-label` and the Tooltip Buckholt requires for icon-only Buttons, in stacked Button sets (`.button-set.button-set-stacked`). The Overflow menu is Menu button's Code & specs example 3. See deviation 2 |

**How the rail collapses (Mark Feltwell, 7 October 2026).** Mark's rules for collapsible
sidebars, followed as given:

- *"All sidebars that are considered collapsible display a collapse button that also functions
  as an open button, so the user has control of what they see."* One icon-only ghost Button at
  the top of the rail ("Collapse menu panel" / "Open menu panel", `aria-expanded`,
  `aria-controls`, Tooltip). The user's choice holds on every page and is remembered in this
  browser (`localStorage`, wrapped so the page works without it). Until they choose, the rail is
  open at app level, where nothing sits beside it, and collapsed on client and policy pages,
  where the record column is open. Open, the rail is in the flow: the record column moves over
  rather than being covered.
- *"When sidebar is collapsed: items under a category collapse into a single icon button.
  Clicking on icon button in sidebar will reveal floating submenus if more items are needed to be
  shown."* Collapsed (64px): the search becomes a Search icon that opens the rail at the field;
  Client stays one icon link; **Policies collapses into one Shield icon button** (Mark's
  suggestion; the catalogue's Shield), a Buckholt Menu button whose floating Menu opens to its
  right and lists **every** policy (Menu's link items, `a.menu-item`, with the reference and its
  status Tag), the open one marked `aria-current="true"` in Menu's own active colours. Add new
  quote and Client support become icon-only Buttons. Every collapsed control has its accessible
  name and a Tooltip ("Motor, PUCO0068, Live"; "Policies (7)"). The floating Menu keeps
  Buckholt's light theme, as it floats over the page.
- Below 1280px both columns live in the drawer, where the rail is always open and has no toggle.

> Collapsed, a policy's status shows in the Policies Menu, and in the open rail. A status mark on the collapsed icon would need a Buckholt indicator (Badge is
> undocumented here), so it is left out.

The rail is Buckholt's **dark theme** (`data-bs-theme="dark"` on the rail, so Page navigation,
Tag, Button and Link take their dark-theme tokens) on `--expressive-rich`. The designs use a
brighter blue (close to `--expressive-deep`), but on it the dark theme's link and status colours
fall below contrast, so the rail takes the darker expressive step, as the documentation site's
own sidebar does. The documentation site's sidebar itself is site chrome (`sidebar.css`,
`sidebar_container`, `submenu_link`), not a Buckholt component, so it is not copied: only Buckholt
components sit in the rail.

Removed: the search from the menu (back in the top bar), "What can I search?", recent searches,
back links, the client card with Avatar and Key-values, the policy card with Switch policy (the
rail is the switcher now), and the policy cards. Breadcrumbs stay; they replaced the blue record
strip in the previous round.

Both columns are rebuilt on every route. At app level (Dashboard, search results, the other
modules, Create new client) the menu area is not drawn on wide screens.
`navigation-model.js` is a line-for-line port of the prototype's `GROUPS`, `policyNav`, `A`,
`policyActions`, `policyFlows` and `allowedPolicyPages`. The status rules are therefore exactly
the prototype's:

| Status | Groups | Menu actions | Heading |
| --- | --- | --- | --- |
| Live | Policy (details, claims), Transactions, Correspondence, More details | Copy · Add MTA, Policy extension · Renewal invite · Customer portal settings · *divider* · Stop, **Cancel** | Add new quote (secondary), Amend policy (primary) |
| Prospect | Quote, Policy, Transactions, Correspondence, More details | Copy · Customer portal settings | Add new quote, Amend policy |
| Automatic Decline | Quote, Policy (details only), Correspondence, More details. **No Transactions** | Copy · Customer portal settings | Add new quote, Amend policy |
| Incomplete | Policy (claims only), Transactions, Correspondence, More details | Copy · Customer portal settings | Amend policy |
| Lapsed | Policy, Transactions, Correspondence, More details | **Reinstate policy**, Copy · Customer portal settings | Add new quote (primary) |

## System navigation (7 October 2026)

Laurence asked for the best experience for system-level navigation. The decisions:

| Need | Built with | Why |
| --- | --- | --- |
| System modules: Broking, Activity, Renewals, Bordereau, Accounts | Page navigation with icons, horizontal, in the top bar (`nav.mob-modules`, `ul.nav > li.nav-item > a.nav-link`, icon directly inside the link, `.active` + `aria-current="page"`). Below 1280px they move into the drawer, stacked | Modules are separate sibling pages, which is what Page navigation is for. The prototype's "Dashboard" is the Broking module, so it is named Broking, with the catalogue's Shield icon (Laurence, 7 October 2026) |
| Broking landing page | **Dashboard** (`#dashboard`, also the default route and the wordmark's link), as current Mobius has it: two Tabs, Outstanding diary and Sanctions check matches, each a Card with a filter bar, a Table of sample rows and "Load more". Sanctions status is a status Tag; "Assigned to" is an extra-small Avatar and the name. Create new client is the page's one primary, in the heading | No search results until a search has been run (Laurence, 7 October 2026). Tabs, because the two views switch in place on one page. Current Mobius paginates; Buckholt has no Pagination component, so the tables use the same "Load more" standalone Link as every other list here. The Days overdue From/To pair is left out of the diary filters: it needs a range input Buckholt does not document |
| Search results | `#search/{query}`, only after a search. It filters the sample rows on name, reference or email, and has a no-results state ("No clients found for “{query}”"). The client's name is the link to the client; the separate "Open client" link repeated it and is gone. Create new client stays in the heading | |
| Search | Text input with its search icon, at the top of the blue rail on every page (Mark, 7 October 2026). Submitting opens the search results. With the rail collapsed it is a Search icon that opens the rail at the field | "What can I search?" and recent searches were removed with the rest of the menu's extras |
| Breadcrumbs (replace the blue record strip) | Breadcrumb, location-based, at the top of Main above the heading: Dashboard › Search results (once a search has been run) › client › policy › page. The last item is the current page (`.active`, `aria-current="page"`). None on Dashboard or the other modules, which are top level | Breadcrumbs must not wrap, so a trail of more than four items puts its middle into Breadcrumb's documented overflow menu (Code & specs example 2: `li.menu` with its Tooltip, `a.menu-toggle`, a Menu of `button.menu-item`s), and below 768px only the first and last stay out of it |
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
- **Page and card actions stay on the page**: Add client header, Add client link and connection,
  the portal access Switch, New sanctions check, Add complaint, and Admin fee and Manual credit /
  debit on the Account summary card (Live only, as in the prototype).
- **Heading actions** open pages, so they are anchors with Button styling. The Policy overview
  has quick links to Documents (badge 3), Attachments, Notes (badge 1) and History. These are
  icon-only ghost links, each with an `aria-label` ("Documents, 3 new") and a Tooltip. They sit
  in their own Button set, separated by a rule from the labelled actions. Client summary has the
  Client notes icon Button with its count badge, "View claims" (secondary) and "Add new quote"
  (primary). Adding a client note updates the badge.

## Policy lists

There is one shared count, which starts at 5. It is used by the rail, the Client summary's
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
- Actions are buttons in a toolbar (deviation 2). Group labels are plain text naming their list (`aria-labelledby`); the
  groups are always open, so nothing needs disclosing.
- Panels and confirmations trap focus, close on Escape and return focus to their trigger. When
  re-rendering replaced the trigger, focus goes to its successor.
- Icon-only controls (quick links, Client notes, Menu, Close menu) have `aria-label` and a
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

The actions used to be a Menu shown in place at the foot of the record column. Laurence asked
for an Adobe-like 48px toolbar instead, so the record column holds navigation only and every
action is one click away whatever the scroll position. Buckholt has **no Toolbar component**, so
the strip is assembled from documented parts: icon-only ghost Buttons (40px, Button's medium
icon-only size, in a 48px column), each with an accessible name and a Tooltip to its right
(Buckholt's requirement for icon-only Buttons), grouped in stacked Button sets.

- It is an ARIA `toolbar` (`aria-label="Policy actions"`, `aria-orientation`), one Tab stop with
  a roving tabindex: Up / Down, Home and End move along it. Each group is a `role="group"` named
  after the prototype's section header; the rules between groups are separators.
- A panel action is `aria-pressed="true"` while its panel is open, drawn with the ghost Button's
  own hover colours. Panels and confirmations still return focus to the toolbar Button.
- **Stop and Cancel are behind an Overflow menu** (Mark, 7 October 2026: they are destructive,
  so not one click away). It is Menu button's Code & specs example 3: an icon-only ghost
  `.menu-toggle` with `fa-ellipsis-vertical`, named "More actions" with its Tooltip on the Menu
  wrapper (as Breadcrumb's overflow menu does), **fixed to the foot of the toolbar** below a
  rule, away from the everyday actions, and opening a Menu to its right (`.dropend`; it flips
  upward at the foot of the screen). In the drawer it sits at the end of the flat row. Cancel is
  Menu's danger item, which Buckholt draws red on hover. Each still asks for confirmation; when
  the confirmation closes, focus returns to the "More actions" trigger.
- Below 1280px, in the drawer, the toolbar lies flat above the record's pages and wraps; its
  arrow keys follow (Left / Right), and Tooltips open above.
- Lost from the old Menu: the visible labels and the trailing panel / page icons. Icon-only
  actions rely on recognisable icons; MTA (`fa-swap-arrows`) and Stop (`fa-circle-pause`) are
  catalogue gaps (see deviation 9).

> **Gap to raise with Buckholt:** a documented Toolbar (vertical icon strip), including grouping,
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

> **Gap:** `.badge` and this design are not in Buckholt's documentation.

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

### 10. "Create new client" is in the Search results heading, not the menu

The reference prototype listed it as an app-level menu action. It opens a page, so it follows
the brief's rule and sits in the Search results heading as the primary action (an anchor styled
as a Button, like the other heading flows). Changed 6 October 2026, at Laurence's request. Since
7 October the app-level menu holds only Search; the modules are in the top bar.

**Client support** is in the menu foot only once a client is open, at client and policy level.
It is not shown on Broking, the other modules or Create new client, because there is no
client yet.

### 10a. One primary Button per screen

Button: "A page should normally have one primary call to action." Common actions: primary is
"normally limited to one per screen context". The prototype often had several, so the extra ones
are secondary here:

| Screen | Primary | Changed to secondary |
| --- | --- | --- |
| Dashboard, Search results | Create new client (heading) | Apply (filters) |
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

- The two menu columns are sticky under the top bar and each scrolls on its own, with Client
  support pinned to the rail's foot.
- **Below 1280px the menu is a drawer**, with the search and the modules, and the rail stacked
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

- **90 behavioural assertions, all passing.** They cover:
  - per-status groups, actions and heading for all five statuses
  - redirects
  - the single `aria-current`
  - the toolbar: its actions per status, the rule before Stop, the danger Cancel, accessible
    names, Tooltips, one Tab stop and arrow-key movement
  - quick-link labels and tooltips
  - the rail collapsed to 64px on a policy page: named, Tooltipped links; Policies as one Shield
    button whose Menu lists all 7 with the open one marked, closing on Escape; Search as an icon
    that opens the rail at the field
  - the rail opening to 240px and moving the record column over, focus on the toggle, and the
    user's choice (open or collapsed) holding on the next page
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
  - the app level: no menu actions, no Client support, and Create new client in the Search
    results heading opening the flow
- **Broking and breadcrumbs (20 assertions)**: opens on the Dashboard with no search results;
  the two Tabs switch; the filter actions sit at the right edge and the fields are content
  width; a search opens the results with the right breadcrumb; no Open client link; the record
  column at client and policy level; the rail in the dark theme; the policy breadcrumb's
  overflow menu and its navigation; a bare `#search` goes to the Dashboard; no record strip.
- **Search (5 assertions)**: at 375px the search is in the drawer and runs from there, closing
  the drawer; widened, it is in the rail and shows the query.
- **Top bar**: nothing overflows or overlaps at every width from 360 to 1920px (8px steps).
- **Drawer at 375px**: hidden at rest, focus to Close menu, Main inert, Tab trapped, Escape
  closes with focus back on Menu, a panel opened over it closes back to the open drawer, and
  navigating closes it.
- **Sweep**: all routes (every page of every status, a no-results search and every module), at 1440 / 1024 / 768 / 375. No
  console or page errors, and no page-level horizontal overflow. Wide tables scroll inside
  Buckholt's `.table-content`.
