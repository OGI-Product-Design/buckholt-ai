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
search field, "Show wording changes", the environment ("Test"), the clock, the system menu and
the avatar. The
clock is live, as in Originators and BACS Import (Laurence's request, 30 September 2026). The
module navigation of the other features (AutoRek, BACS) is not shown, because in this
prototype the left column *is* the redesigned menu.

---

## The two-level navigation (simplified 7 October 2026)

The menu had grown heavy: search, a help panel, back links, a client or policy card full of
Key-value pairs, policy cards, "Go to", "Actions" and Client support, all in one column. It now
follows Laurence's colleague's designs, which work like the Buckholt documentation site's own
sidebar: **two slim columns** at client and policy level, both about the client you have open.

**The top bar (Laurence, 8 October 2026).** The Broking bar that sat under the top bar is gone,
and with it the module links across the top bar:

- **Search, next to the wordmark.** A Buckholt Text input with the search icon. It does not
  search itself: a click, Enter, Down arrow or the first character typed opens the **search
  Modal** (below), carrying that character over. In place of a placeholder it says **"Type / to
  search"** with "/" drawn as a key, as GitHub does (suggested to Laurence, 8 October 2026), so
  people learn they need not reach for the mouse; "/" opens the search from anywhere unless you
  are typing in a field. The hint is hidden from assistive technology: the field's label names
  it and `aria-keyshortcuts="/"` gives the key. Below 768px it reads just "Search". The key
  style is local CSS (Buckholt has no Keyboard key style): a gap.
- **The system menu, beside the avatar.** An icon-only ghost Menu button (as the Overflow menu,
  Menu button Code & specs example 3, with its Tooltip "Switch system"). Its panel holds the
  systems, **Broking, Activity, Renewals, Bordereau and Accounts, as large Response buttons
  with icons** (Response button Code & specs example 8), two to a row: one native Radio group,
  the current system checked (client and policy pages are Broking's). Opening it leaves focus on its toggle and Tab moves to the current
  system (focusing the checked Radio straight away showed Response button's focus look instead
  of its checked one). Each column is at least a large Response button's own 120px, so the panel
  never squeezes them. A click, Enter or Space goes to a system and closes the menu; the arrow
  keys only move through them, as in any Radio group, so the keyboard can look without leaving
  the page. Using Response buttons to navigate is Laurence's call: Buckholt documents them for
  answers, and documents no system or app switcher, so this is a gap to raise.
- **Create new client, next to the search** (Laurence, 8 October 2026): a secondary Button
  (an anchor, as it opens a page) with the User-plus icon and its label; below 1280px the bar
  has no room for the label, so an icon-only version with its name and Tooltip shows instead.
  Not shown while creating a client. It is Broking-wide, so it is no longer on the Dashboard.
- **No back arrow.** The breadcrumbs say where you are and go back up.

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
| Rail (272px open), as in Laurence's Figma design | **No colour of its own beside the policy column**: like a mail client's folder pane (Laurence, 7 October 2026), it sits on the page background (`--ui-background-02`). **At client level, where it is the only column, it is the white panel** (inset 8px, 8px radius, Card's border; 272px inside the inset, so a long reference such as AADD000000000666 fits under the Policies rule), as the policy column is; once a policy opens, the panel passes to the policy column. Collapsed at client level it stays the white panel, 64px wide (Laurence, 8 October 2026). **A head with the client in User meta** (small Avatar, the name over the reference, in the policy head's type), **level with the policy column's head** beside it, and **ruled off under it, the rule level with the policy head's** (Laurence, 8 October 2026); collapsed, only the Avatar shows. Then **the client's menu: one "Client" group with the User icon** (Laurence, 8 October 2026: the overview is the group's first page, not an item of its own): Client overview, Add new quote, Business details, Transactions, Activity, Complaints and Client checks, indented under a rule. Then **Policies, a group built the same way** (Laurence, 8 October 2026): the **Shield** and "Policies" as its label, then the policies **indented under a rule**, and "Show 2 more" in line with them. One link per policy: **no icon of its own** (the group has the Shield and each row says "Open Market Motor"; indented, the reference needs the room), the **status as an eyebrow** above it (Buckholt's `.eyebrow`, no Tag: Laurence, 7 October 2026) **with a dot in its status colour** (the Tag's own border colour, `--feedback-border-*`) and the text in the primary colour, also on the open policy (local CSS, not Buckholt; the text carries the meaning, the dot only reinforces it), then **the reference (16px, medium) over the line of business** (14px, light, secondary): the reference is what tells a client's policies apart (Laurence, 7 October 2026); a reference too long for its line ends in "…" and shows in full in a Tooltip. The same as the policy column's head; and a **right chevron**, centred on the row, showing the policy opens the next column. On the open policy the reference and chevron take the active colour, as the icon does. "Show 2 more" / "Show fewer"; the rail's **collapse button at the foot's right** (as in Outlook or VS Code; Client support moved to the page heading, 8 October 2026). Beside a policy, the collapse button sits level with the policy's actions in the next column (Laurence, 8 October 2026). On a policy page the rail scrolls itself (not the page) to bring the open policy into view beside its menu | Page navigation, stacked (`ul.nav.flex-column > li.nav-item > a.nav-link`, Page navigation's own `.active`); Tag; Avatar, Title 01 (see deviation 4a). The open policy is `aria-current="true"`: it marks the record, not the page. Client support opens its side panel and is a ghost Button |
| Policy column (policy pages only, no collapse button; 304px) | A **white panel inset 8px** from the top and bottom (and from Main), with Buckholt's 8px radius (`--border-radius-md`) and Card's border colour, no shadow (it is not elevated). A head in User meta's type: the reference with the **small status Tag at its right** (Laurence, 8 October 2026; there is only one policy here, so the Tag stands out without weighing a list down; the rail's list keeps the dots), over the line of business ("Open Market Motor"), a long reference truncated with its Tooltip, like the policy's row in the rail, ruled off under it, then the policy's pages in **always-open groups** (no accordion), the first the **"Policy" group with the Shield**, Policy overview its first page (Laurence, 8 October 2026), starting level with the client's menu in the rail, then the **policy's actions in a row at the column's foot**, always in view while the menu scrolls, labelled "Actions" as the menus' sections are and ruled off above (Laurence, 8 October 2026: so the client and policy columns line up). In the drawer the foot sticks to the drawer's bottom edge. Documents, Attachments, Notes and History carry their **count badge**. | Head: User meta type (no component: the record has no Avatar); Page navigation with `.active` + `aria-current="page"`; each group's label is text with its icon (a group is not a page), its pages indented under a rule |
| Policy actions (in the page heading) | In the heading of **every policy page**, after Client support and Policy notes and a 24px rule (Laurence, 8 October 2026: icon-only at the foot of the policy column they were easy to miss and hard to read). The everyday ones as **labelled ghost Buttons** with their icons (Add MTA, Policy extension, Renewal invite; Reinstate policy when Lapsed); the rest behind the **"⋮" More actions** Overflow menu: Copy policy and Customer portal settings (rarely used, set once), then below a divider Stop and Cancel (destructive; Cancel is the danger item). When Main is narrower than 62rem (1280px, or 1440px with the client menu open) the labelled actions **fold into the top of More actions**, so the row never wraps | Ghost Buttons with `.btn-icon` and `.button-label`, in a Button set; Menu button Code & specs example 3 for More actions. See deviation 2 |

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
  enough room for both columns and the page; once it has been opened (or collapsed) by hand, that
  choice stays from page to page (Laurence, 7 October 2026). Opened directly (a link or a reload), a policy page draws the rail
  already collapsed: it slides only when it changes in front of you. Open, a column is in the flow: the one beside it
  moves over rather than being covered.
- *"When sidebar is collapsed: items under a category collapse into a single icon button."*
  Collapsed rail: **Client pages (one User icon button)** (the current category is marked in Page navigation's light active tint, not the ghost Button's solid pressed colour) and
  **Policies (one Shield icon button)**,
  spaced evenly. **Pressing a
  category opens the rail at that category** (Laurence, 7 October 2026: the Shield opens the
  rail rather than a floating menu): focus moves to the current client page or the open policy. Every collapsed control has its accessible name and a
  Tooltip.
- Below 1024px both columns live in the drawer, open, with no toggles. On a policy page the drawer starts with the policy's menu, then the client's pages and policies (moved in the DOM, so Tab follows the same order).

> Collapsed, a policy's status shows once the rail is open. A status mark on the collapsed icon would need a Buckholt indicator (Badge is
> undocumented here), so it is left out.

The rail uses Buckholt's **light theme**, following Laurence's Figma design (it was the dark
theme on `--expressive-rich` in the previous rounds). The documentation site's own sidebar is
site chrome (`sidebar.css`, `sidebar_container`, `submenu_link`), not a Buckholt component, so it
is not copied: only Buckholt components sit in the rail.

Removed: the search from the menu (now in the top bar), back links, the client card with Avatar and Key-values, the policy card with Switch policy (the
rail is the switcher now), and the policy cards. Breadcrumbs stay; they replaced the blue record
strip in the previous round.

Both columns are rebuilt on every route. At app level (Dashboard, the other modules, Create new
client) there is no left menu, and below 1024px no Menu button either: the systems are in the
system menu, which stays in the top bar at every width.
`navigation-model.js` is a line-for-line port of the prototype's `GROUPS`, `policyNav`, `A`,
`policyActions`, `policyFlows` and `allowedPolicyPages`. The status rules are therefore exactly
the prototype's:

| Status | Groups | Menu actions | Heading Buttons |
| --- | --- | --- | --- |
| Live | Policy (details, claims, Amend policy), Transactions (no Transaction documents), Correspondence, More details | Copy · Add MTA, Policy extension · Renewal invite · Customer portal settings · *divider* · Stop, **Cancel** | none |
| Prospect | Policy, Transactions, Correspondence, More details | Copy · Customer portal settings | none |
| Automatic Decline | Policy (details, Amend policy; no claims), Correspondence, More details. **No Transactions** | Copy · Customer portal settings | none |
| Incomplete | Policy (claims, Amend policy), Transactions, Correspondence, More details | Copy · Customer portal settings | none |
| Lapsed | Policy, Transactions, Correspondence, More details | **Reinstate policy**, Copy · Customer portal settings | none |

## System navigation (7 October 2026)

Laurence asked for the best experience for system-level navigation. The decisions:

| Need | Built with | Why |
| --- | --- | --- |
| Systems: Broking, Activity, Renewals, Bordereau, Accounts | The **system menu** beside the avatar (Laurence, 8 October 2026): an icon-only ghost Menu button whose panel holds the systems as large Response buttons with icons, two to a row, one Radio group with the current system checked (see "The top bar" above). The same at every width | The prototype's "Dashboard" is the Broking system, so it is named Broking, with the catalogue's Shield icon (Laurence, 7 October 2026). The top bar's horizontal module links were removed to give the search the room next to the wordmark |
| Broking landing page | **Dashboard** (`#dashboard`, also the default route and the wordmark's link), as current Mobius has it: two Tabs, Outstanding diary and Sanctions check matches, each a Card with a filter bar, a Table of sample rows and "Load more". Sanctions status is a status Tag; "Assigned to" is an extra-small Avatar and the name. Create new client is the page's one primary, in the heading | No search results until a search has been run (Laurence, 7 October 2026). Tabs, because the two views switch in place on one page. Current Mobius paginates; Buckholt has no Pagination component, so the tables use the same "Load more" standalone Link as every other list here. The Days overdue From/To pair is left out of the diary filters: it needs a range input Buckholt does not document |
| What can I search? (in the search Modal) | A ghost Button with the Info icon to the right of the Modal's search field, as current Mobius has it. It opens a floating help panel: the title with a close Button, a Buckholt List per group (list heading and items), the tip, and "Learn more" as a standalone Link with the External-link icon; current Mobius wording in sentence case. Escape closes the panel first, back to its Button. **Buckholt has no Popover** (no `.popover` styles in `buckholt.css`, and no Bootstrap stylesheet is loaded), so the panel is a Menu panel (`.menu-panel.dropdown-menu`) on Bootstrap Dropdown, with fixed positioning so it floats over the Modal's scrolling body | Gap to raise with Buckholt: a documented Popover |
| Search results (Laurence, 8 October 2026, after current Mobius) | In the search Modal, not a page. "{n} clients found for “{query}”", then the **filters straight above the table, not in a Card** (Brand, Line of business, Policy status, Clear and Apply; Apply keeps the clients with a policy that matches), then **one row per client** (Name, Reference, Address, Postcode; each column sorts with Table's documented sortable header, `aria-sort` on the sorted column) and "Showing 1 to {n} of {n}". **The client's name is the link to the client and a policy number the link to the policy** (Laurence, 8 October 2026: no View client, Add new quote or View Buttons or Links on the rows). **A client row opens in place** (its toggle, or a click anywhere else on the row): the client's email and date of birth, then **the client's policies** as a table of their own (Quote / policy number, Cover start, Status Tag, Product, Insurer, Risk info), and **each policy opens in place too**: Policy expiry, Brand / agent, Premium and Scheme. Eight sample clients come back for "motor", as current Mobius brings back many; only the prototype's own client and its policies open, and the samples say so in a toast. A no-results state ("No clients found for “{query}”"). An old `#search/{query}` link opens the Modal with that search over the Dashboard | **Gap:** Buckholt's Table documents no expandable rows. A row's toggle is an icon-only ghost Button (small) in its first cell, with `aria-expanded`, `aria-controls` and a Tooltip ("Show details" / "Hide details"), and its details are the next row. Only the row under the pointer takes Table's hover tint: Table tints every cell inside a hovered row, so a details row would tint the whole policies table in it; details rows bind Table's own `--table-hover-background` to transparent, and a result row under the pointer back to Table's value |
| Search (Jon's suggestion, 7 October 2026) | The **search field in the top bar** ("Type / to search") opens a **search Modal** (Buckholt Modal, Code & specs example 1, `.modal-xl` and `.modal-dialog-scrollable`) (or "/" anywhere, unless you are typing in a field); opened from the keyboard, focus returns to the field when it closes. The page you are on stays behind it. The Modal has its own field, with Buckholt's clear button (Text input Code & specs example 6, `.input-btn.input-clear`, driven by `components/form/form.js` with jQuery loaded first, as CLAUDE.md sets out); clearing shows recent searches again; until a search is run it shows **recent searches** (a Buckholt Menu shown in place, a section header and items with the Recent icon; Down arrow moves into it, Up / Down through it, picking one runs it; the last five, newest first). Running a search shows the results in the Modal; opening a client or policy from them closes it, and Escape closes it with focus back on the field (which does not reopen it). "/" opens it too | The search keeps you where you are, and the results are one Escape away from the page behind |
| Breadcrumbs (replace the blue record strip) | Breadcrumb, location-based, at the top of Main above the heading: Dashboard › client › policy › page (removed for a round, reinstated by Laurence, 7 October 2026). Client and policy pages have no eyebrow over the heading: the policy column names the policy. The search is a Modal, not a place, so it is not in the trail. The last item is the current page (`.active`, `aria-current="page"`). None on Dashboard or the other modules, which are top level | Breadcrumbs must not wrap, so a trail of more than four items puts its middle into Breadcrumb's documented overflow menu (Code & specs example 2), and below 768px only the first and last stay out of it |
| User settings | Menu button whose trigger is the Avatar (`LA`), `dropdown-menu-end`: the user's name as a section header, then Unlock records, Clear cache, Change password, Release notes, Cookie policy, a divider and Logout, as in Mobius today (sentence case). Each shows a "not part of this prototype" toast | Menu button is Buckholt's documented trigger + Menu. The trigger has an accessible name ("User menu, Laurence Abbott") |
| A full top bar | Between 1280 and 1680px the "Show wording changes" label (the switch is **off by default**, Laurence, 7 October 2026) is visually hidden (still named). Below 768px the search field gives way to the system menu and the avatar. | |

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
- **Amend policy in the menu (Laurence, 7 October 2026).** In current Mobius it is a menu item,
  so it is a page in the **Policy** group, after Policy details and Claims (whether a status has
  it follows the prototype's `policyFlows`, the same as the heading).
- **Quote summary is not a menu item (Laurence, 8 October 2026).** It is where amending a quote
  ends, as in current Mobius: for a Prospect, Automatic Decline or Incomplete policy, Amend policy
  runs the quote again and Save lands on its Quote summary (Cancel goes back to the Policy
  overview). The menu's "Quote" group is gone.
- **Add new quote is in the client menu only (Laurence, 8 October 2026).** It was in both the
  client menu and each policy's Policy group; a new quote is the client's, so it has one place
  in the navigation.
- **The rule for where an action goes (Laurence and Jon, 8 October 2026).**
  - **A menu item is a link that takes you somewhere new**, away from the page you are on. Add
    new quote and Amend policy start journeys, but each opens a new page, so they are menu
    items. (Katerina suggested they are actions rather than navigation; the rule above decides
    it.)
  - **A Button on a page** opens a side panel on that page, to change what is visible, or makes
    a change happen on the page you are on.
  - **The policy's actions** belong to the policy as a whole, not to any one page, so they are in
    the heading of every policy page (they were the policy column's Actions until 8 October 2026).
  - So **page headings do not repeat menu items** (Laurence, 8 October 2026): Add new quote is
    gone from the Client overview and Policy overview headings, and Amend policy from the Policy
    overview and Policy details headings. Policy details' read-only note points to Amend policy in
    the policy menu (Add new quote in the client menu for a Lapsed policy).
  - **No View claims on Client overview** (Laurence, 8 October 2026): in current Mobius it is a
    link out to another system, not part of the client. Its side panel is gone with it.
  **Admin fee and Manual credit / debit open side panels**, so they are not menu items: they are
  Buttons on the Account summary page only. **Transaction documents is removed** (Laurence, 7
  October 2026); its placeholder page went with it.
- **Page and card actions stay on the page**: Add client header, Add client link and connection,
  the portal access Switch, New sanctions check, Add complaint, and Admin fee and Manual credit /
  debit on the Account summary card (Live only, as in the prototype).
- **Heading actions** open pages, so they are anchors with Button styling. The Policy overview's
  quick links (Documents, Attachments, Notes, History) are gone (Laurence, 7 October 2026):
  their counts are badges on those pages' links in the policy menu instead, read out as
  ", 3 new". Every client and policy page's heading has Client support and Client / Policy notes (below).
  Adding a client note updates the badge.

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
- The policy's actions are labelled Buttons in the page heading (deviation 2).
- Panels and confirmations trap focus, close on Escape and return focus to their trigger. When
  re-rendering replaced the trigger, focus goes to its successor.
- Icon-only controls (collapsed menu items, More actions, the system menu, Menu, Close menu) have `aria-label` and a
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

### 2. The policy's actions in the page heading (8 October 2026)

The actions were a Menu at the foot of the record column, then a vertical strip, then a row of
icon-only Buttons under the policy's title and, briefly, at the foot of the policy column. They
are now **labelled ghost Buttons in the page heading** of every policy page, after Client support
and Policy notes and a rule (Laurence, 8 October 2026: icon-only and at the bottom, they were
hidden and hard to understand).

- The everyday actions show, then a rule, then **More** (Laurence, 8 October 2026: labelled, as
  in the Figma toolbar; Menu button Code & specs example 1, the label then the caret, as a ghost
  Button; read out as "More actions"). It holds
  Copy policy and Customer portal settings, then, below a Menu divider, **Stop and Cancel**
  (Mark, 7 October 2026: destructive, so not one click away). Cancel is Menu's danger item. Each
  still asks for confirmation; focus returns to "More actions" when it closes.
- A panel action is `aria-pressed="true"` while its panel is open, drawn with the ghost Button's
  own hover colours.
- **Narrow pages fold the labelled actions into More actions** (a container query on Main, under
  62rem), above Copy policy, so the heading never wraps the actions onto a second line. On a phone
  the rule before them is not drawn.
- They are no longer a `role="toolbar"` with a roving tabindex: each is its own Tab stop, as
  Buttons in a heading are.

> **Buckholt guidance to weigh:** Heading attachment says to keep one closely related attachment
> and "not turn the heading row into a general toolbar". This heading is a plain flex row (as in
> Originators and BACS Import), not the Heading attachment component, but with Client support,
> Policy notes, three actions and More actions it is close to a toolbar. A documented page-level
> action bar would settle it: a gap to raise with Buckholt.

### 3. Heading actions that open pages are anchors styled as Buttons

Button says "use Button for actions, Link for navigation". A heading action that opens a page
is an `<a class="btn">`, so it keeps link semantics. Since 8 October 2026 none is in a page heading: Create
new client is in the top bar; Add new quote and Amend policy are menu items only.

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

The client is shown with the runtime's User meta at the head of the rail (Laurence, 8 October
2026): the small initials Avatar (`.avatar-sm`), then the name over the reference, level with
the policy column's head. A centred profile in the rail and an inline one in a Broking bar were
tried before it (7 October 2026). Buckholt has **no User meta
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
| The system menu | `fa-grid` |
| Search result rows: sort direction | `fa-sort-up` / `fa-sort-down` (Table documents only `fa-sort`) |

The Policy group uses the catalogue's **Shield** and the Client group the **User** icon (Laurence,
8 October 2026); the overviews are their groups' first pages.

### 10. "Create new client" is in the top bar, not the menu

The reference prototype listed it as an app-level menu action. It opens a page, so it is an
anchor styled as a Button. It was the Search results heading's primary (6 October 2026), then in
the Broking bar (7 October), then the Dashboard's heading; since 8 October it is a secondary
Button next to the search in the top bar, on every page, so it never competes with a page's own
primary.

**Client support and the notes** are in the page heading on **every client and policy page**
(Laurence, 8 October 2026): two labelled **ghost** Buttons (Button guidance pairs like with
like), opening their side panels on the page, Client support first:

- **Client support**: the **Circle-heart** leading. When the client has **extra support in
  place** (the Switch in its panel; on for the sample client), it becomes the **solid status
  check** (`fa-solid fa-circle-check`, the icon a success Tag uses), in the ghost Button's own
  blue (Laurence, 8 October 2026: no green). The shape and ", extra support in place" in its
  name say it.
  Circle-heart is not in the icon catalogue: a gap.
- **Client notes** on a client page, **Policy notes** on a policy page (the sample client has no
  client notes and one policy note, as in current Mobius): the Note icon and the
  label, with the count badge on the Button's corner (Mark's design). Policy notes opens a side
  panel with the policy's notes and a field to add one; the full Notes page stays in the menu.

Neither is shown on Broking, the other modules or Create new client: there is no client yet.
Client support has left the rail's foot, which now holds only the collapse button.

### 10a. One primary Button per screen

Button: "A page should normally have one primary call to action." Common actions: primary is
"normally limited to one per screen context". The prototype often had several, so the extra ones
are secondary here:

| Screen | Primary | Changed to secondary |
| --- | --- | --- |
| Dashboard | none (Create new client is secondary, in the top bar) | Apply (filters) |
| Checklist (every status) | Continue (Sale status) | Save (Checklist details), Add item (Outstanding items) |

Where a page has a primary, it is the page's one
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
  **32px high**, below Buckholt's smallest Page navigation size (`.nav-sm`, 44px): a local
  choice for a dense application menu, still above the 24px minimum target size. The rail is
  272px now the status sits above each policy rather than beside it. The policy column's menu
  scrolls inside the column, so its head and actions stay put, and the actions never wrap.
  The section labels (Client, Policies) line up with the links' text and the status eyebrows. **Gap to raise with Buckholt:** a
  compact Page navigation size for dense application menus. The rail's sides are 8px (its links
  carry their own inner padding), a policy row is 58px (was 66), and the client head is User
  meta. At 1440 x 900 the policy list now starts 452px down the rail (was 572).

- **The page's two columns also stack when Main is narrow.** Bootstrap's `.col-xl-8` /
  `.col-xl-4` follow the viewport, but beside the two menu columns Main is far narrower than the
  viewport: at 1440px the side column could not fit a statistic such as "£1,867.00". A container
  query on Main stacks them below 60rem, 32px apart (a Panel's gap).

- The two menu columns are sticky under the top bar and each scrolls on its own, with Client
  support pinned to the rail's foot.
- **Below 1024px the menu is a drawer** (Laurence, 7 October 2026: it was 1280px, which hid all
  navigation on common laptop widths). From 1024 to 1280px a policy page keeps the collapsed
  64px strip and the 304px policy column beside Main (about 650px at 1024). 1024 is a layout
  breakpoint of this prototype only.
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
- **This prototype's own files carry a version** (`?v=` in `index.html`), bumped with every
  change, so a browser fetches them afresh instead of running an old cached copy (an old menu
  script kept showing Add new quote in the policy menu after it had been removed).
- **Vertical scrollbars are 6px** (Laurence, 8 October 2026): the page, the two menu columns, the
  drawer, the search Modal and its help panel. A grey thumb (`--disabled-03`, `--ui-border-01`
  under the pointer) on no track. Horizontal scrollbars on wide tables keep the browser's own.
  Buckholt documents no scrollbar style, so this is local CSS; Firefox, which has no exact width,
  takes its thin scrollbar.
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

- **119 behavioural assertions, all passing.** They cover:
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
    button with a Tooltip that opens the rail (320px) with focus on the open policy; the search
    field in the top bar, and "/" opening the search Modal
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
  - the top bar: no Broking bar or module links; the search field next to the wordmark; the
    icon-only system menu beside the avatar; the client in User meta at the head of the rail,
    its Avatar in line with the menu icons; the client menu built as the policy's
  - the app level: no left menu, no Client support, Create new client in the top bar,
    opening the flow
- **Broking, systems, search and breadcrumbs (37 assertions)**: opens on the Dashboard; the
  system menu (five large Response buttons, Broking checked in its checked style with focus on the toggle, Tab to it, two to a row, arrow keys
  move without going, Enter and a click go); the two Tabs switch; the filter actions sit at the
  right edge and the fields are content width; clicking the top bar's field opens the search
  Modal with recent searches, Down arrow moves into them and
  one runs, showing results in the Modal while the page stays; the no-results state; clearing
  the field brings recent searches back, newest first; the results (filters above the table, not
  in a Card; a client row opening in place with its policies; a policy opening in place with
  View; sorting by Name; the Policy status filter); opening a client closes the Modal; the
  client and policy columns; the policy breadcrumb without a search crumb; a bare `#search` and a
  `#search/{query}` link (which opens the Modal over the Dashboard).
- **Search and client menu (7 assertions)**: at 375px the search field is in the top bar, runs
  in the Modal, and opening a result closes it; widened, it is still there; the client menu is
  Client overview, then the Client group.
- **Top bar**: nothing overflows or overlaps at every width from 360 to 1920px (8px steps).
- **Drawer at 375px**: hidden at rest, focus to Close menu, Main inert, Tab trapped, Escape
  closes with focus back on Menu, a panel opened over it closes back to the open drawer, and
  navigating closes it.
- **Sweep**: all routes (every page of every status, a no-results search and every module), at 1440 / 1024 / 768 / 375. No
  console or page errors, and no page-level horizontal overflow. Wide tables scroll inside
  Buckholt's `.table-content`.
