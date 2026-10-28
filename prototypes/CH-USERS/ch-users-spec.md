# Configuration Hub users (CH-USERS): Feature Specification

## About this document
- **Product / location:** Configuration Hub > User Management > Configuration Hub users.
- **Readers:** developers, product, and Claude Code building a clickable prototype.
- **Prototype folder:** `prototypes/CH-USERS/`
- **Screen IDs:** `CU-FF-SS`. CU is Configuration Hub users, FF the flow (00 = base pages), SS the step. Screenshots in `screenshots/` are named by screen ID.
- **Shell:** `CH-SHELL` spec, revision 7. Header, environment control, Test alert, Mobius link, avatar menu, breadcrumb band, skip link, document title pattern and focus-on-navigation behaviour come from it unchanged, except the overrides under "Shell overrides". Static (inert) parts are as in the shell: Mobius link and Logout.
- **Source tags:** **[Figma]** User Management file: "Mobius Users" frame (node `7587:166787`) is the layout reference for the users table; Andrej's CU-00-01 frame (link supplied with the handoff) is the reference for the choose-user-type page. **[Context]** CH product context and initial login access context (baseline 17 Oct 2026). **[Decision]** agreed, with who and when. **[Assumption]** to be validated.
- **Revision:** 6, 28 Oct 2026. Blades reworked after the PM, APM and TL review: header title, sections, full-width footer, Status and Reset MFA.

## What changed in this revision
| Area | Change |
|---|---|
| Revision 6: blade layout | New "Blade layout" section: header bar with the blade title, "Account details" and "Account management" sections, footer spanning the blade with the secondary action at the start and the primary at the end. Matches Mobius User Management. **[Decision]** PM, APM, TL and Andrej, Oct 2026 |
| Revision 6: Add blade (CU-01) | Title "Add user"; intro text moved under the "Account details" heading; Email has no placeholder; required asterisks. |
| Revision 6: Edit blade (CU-02) | Title "Edit user"; field order First name, Last name, Email, Username, Role (as Mobius); new "Account management" section with a Status Switch (Active/Inactive, applied on Save) and "Reset MFA" (immediate, with a confirmation Modal). No Reset password. |
| Revision 6: Pending and View blades (CU-03, CU-04) | Same layout. Pending: "Resend invitation" moves to "Account management"; no Status or Reset MFA. View: title "View user", same sections, read-only. |
| Revision 6: conventions | Sentence case everywhere (Buckholt). Required asterisks (Mobius pattern; Buckholt discrepancy for Mark). |
| Revision 6: scope | Deactivating and reactivating, and resetting MFA, are now in scope. Open questions 8 closed. New section "Follow-ups outside this prototype". |
| Revision 5: CU-00-01 card descriptions | "Add and manage users for signing in to …" becomes "Add and manage the people who sign in to Mobius." and "… to Configuration Hub." Plainer and more human (Tone of Voice: human, clear, concise), avoids repeating "users" straight after the card title, and gives both a full stop. **[Decision]** wording delegated by Andrej, 27 Oct 2026 |
| Revision 5: confirmed | App card description, hidden zero counts, and the CU-00-01 differences from Andrej's frame (breadcrumb, seed counts, shell user) are now decisions, not assumptions. Andrej, 27 Oct 2026 |
| Revision 4: name | "Account Management" reverted to "User Management", and "Mobius accounts" and "Configuration Hub accounts" to "Mobius users" and "Configuration Hub users". On these pages "user" is again the thing being added and managed; "account" is only used for what a person signs in with. **[Decision]** design team drop-in and Andrej, 27 Oct 2026: "Accounts" clashes with Accounts (BACS) in Mobius. |
| Revision 4: App card | Name back to "User Management" (no longer a shell override). Description becomes "Add and manage your Mobius and Configuration Hub users." |
| Revision 4: CU-00-01 | Cards replaced with Andrej's design: the whole card is a link, with title, description and arrow icon, and a footer of Tags summarising how many users are in each status. Page description now includes the separate accounts note. **[Decision]** Andrej, 27 Oct 2026. New Buckholt gap 10. |
| Revision 4: Copy | All copy changed by the rename is listed in this spec. Revision 3 copy otherwise unchanged. |
| Revision 4: Open questions | 14 and 15 superseded by the rename. New: 17 and 18. |
| Earlier revisions | Rev 3: app card description, questions closed. Rev 2: account-creation fields, organisation-level users, blade confirmed. Rev 1: first draft. |

## Feature overview
- Today a client can't create Configuration Hub users for its own people. Open GI developers create them manually from tickets, so clients wait on Open GI to give a colleague access. This feature lets a client user invite a colleague to Configuration Hub by email and manage that user afterwards. **[Context]**
- **Separate accounts:** Mobius and Configuration Hub use separate accounts. This is recorded in a Business Decision Record. A person who needs both has a Mobius user and a Configuration Hub user, each with its own account. **[Decision]** BDR; **[Context]** initial login access.
- **Placement:** Configuration Hub users sit inside the existing User Management app, next to Mobius users. User Management opens on a page that lets the user choose which users to manage. **[Decision]** Option A, agreed by the PM, APM, Andrej and a long-tenured stakeholder (former broker), Oct 2026; a second stakeholder had also endorsed it beforehand.
- **Roles:** every Configuration Hub user has exactly one role, chosen at invitation. Roles and permissions are still in discovery, so the prototype uses three placeholder roles and has no screens for managing roles. **[Decision]** Andrej, 26 Oct 2026.
- **Users and permissions:** one viewpoint, a client user with the Administrator role who can see and do everything on these pages. Role-based restrictions are not modelled. **[Assumption]**
- **Dependencies:** `CH-SHELL`. Microsoft account creation (Azure AD B2C), which the invited person completes outside Configuration Hub. **[Context]**
- **Out of scope for this prototype:**
  - The Mobius users page. Its card leads to a placeholder (CU-00-03).
  - The design team's alternative entry point: a split "Open" button on the home app card with a menu of "Mobius" and "Configuration Hub". Shown in Figma only, not built (Open questions 17).
  - Managing roles and permissions, and anything that depends on what a role allows.
  - The invitation email and the Microsoft account-creation pages (username, password and MFA set-up).
  - Resetting passwords: Configuration Hub users do this themselves from the sign-in page. **[Decision]** Andrej, 28 Oct 2026.
  - Bulk invitations, and bulk status changes.
  - Open GI staff view, and Open GI staff appearing in the Configuration Hub users list.
  - Audit Centre entries for these actions.

## Shell overrides
| Override | `CH-SHELL` says | This spec | Why |
|---|---|---|---|
| App registry, order 2 | Name "User Management"; description "Add and manage your Mobius users and what they can access."; destination placeholder | Name unchanged. Description "Add and manage your Mobius and Configuration Hub users." (55 characters, meets the `CH-SHELL` card copy rules). Destination CU-00-01. | The app now covers both kinds of user. **[Decision]** wording delegated by Andrej, 27 Oct 2026 |
| Base page breadcrumb | "{App name} > {Base page name}" | "User Management" as a single crumb on CU-00-01 | The base page has no name separate from the app. Follows the single-crumb form of `CH-SHELL` SH-03-01. |

The `CH-SHELL` spec should take the new description in its next revision, so other CH prototypes match. If the CH-SHELL prototype was changed to "Account Management" while building revision 3, revert that change in this prototype's overrides only.

## Glossary
| Term | Meaning |
|---|---|
| Configuration Hub user | A person who can sign in to Configuration Hub, with a Configuration Hub account. Separate from a Mobius user. |
| Mobius user | A person who can sign in to Mobius, with a Mobius account. Managed on the Mobius users page, which this prototype doesn't build. |
| Account | What a person signs in with. Mobius and Configuration Hub accounts are separate. |
| Username | Chosen by the person during account creation. Used to sign in to Configuration Hub. Not the email. |
| Invitation | Email sent to the person with a link to create their account. The email address is used for this, not for signing in. |
| Pending | Invited, but hasn't created their account yet. |
| Active | Has created their account and can sign in. |
| Inactive | Has an account but can't sign in. Set with the Status Switch in the Edit blade. |
| Role | Placeholder for the level of access a Configuration Hub user has. One per user. |
| Blade | Mobius term for the side panel that holds the add, view and edit forms. Not a Buckholt component. |

## Data model
| Field | Format / validation | Set by | Shown where | Notes |
|---|---|---|---|---|
| Email | Valid email address, 254 characters or fewer, stored in lower case. Unique across all Configuration Hub users, whatever their status | Inviting user | Table, all blades | Where the invitation goes. Can't be changed after the invitation is sent. **[Context]** (immutable in Mobius) |
| Username | Text | Invited person, at account creation | Table, View and Edit blades | Used to sign in. Can't be changed. Seed values use "first.last" in lower case. **[Decision]** Andrej, 26 Oct 2026 |
| First name | Text, 1 to 50 characters | Invited person, at account creation | Table (as Full name), View and Edit blades | Editable afterwards. Fields **[Decision]** Andrej, 26 Oct 2026; editability and length **[Assumption]** |
| Last name | Text, 1 to 50 characters | As First name | As First name | As First name |
| Password, MFA | n/a | Invited person, at account creation | Never shown | Handled by Microsoft. |
| Full name | "{First name} {Last name}" | Derived | Table, View blade title | |
| Initials | As the `CH-SHELL` initials rule | Derived | Table avatar | Pending users have no name, so they show a generic user avatar. |
| Role | One of the placeholder roles below | Inviting user | Table, all blades | Required. |
| Status | Pending, Active or Inactive | System (Pending to Active on account creation); inviting user (Active or Inactive, Edit blade) | Table, View and Edit blades, CU-00-01 card tags | Pending can't be set or changed by hand. |
| Invited on | Date, "d MMM yyyy" (for example "20 Oct 2026") | System | View and Edit blades for pending users | Updated when an invitation is resent. |

**Placeholder roles [Decision]** Andrej, 26 Oct 2026 (made up for the prototype; replace when roles and permissions discovery concludes)
| Role | Description (shown as helper text) |
|---|---|
| Administrator | "Can use every Configuration Hub app and manage Configuration Hub users." |
| Editor | "Can use every Configuration Hub app, but can't manage Configuration Hub users." |
| Viewer | "Can see every Configuration Hub app, but can't make changes." |

**Rules**
- Configuration Hub users belong to the organisation (tenant), not to an environment. The same users show in Live and Test. **[Decision]** Andrej, 26 Oct 2026.
- Each email belongs to at most one Configuration Hub user, including pending users.
- Pending users have an email, role and invited date only. Username and name appear once they create their account.
- There must always be at least one active Administrator. The last active Administrator's role can't be changed, and they can't be deactivated or deleted. **[Assumption]**
- The signed-in user can't change their own role, deactivate themselves, reset their own MFA here, or delete themselves. **[Decision]** Andrej, 28 Oct 2026 (status and MFA); role and delete **[Assumption]**
- Deleting a pending user cancels their invitation. The link in the email stops working. **[Assumption]**
- Deleting a Configuration Hub user never affects that person's Mobius user. **[Decision]** BDR (separate accounts).
- Totals count every user, including pending ones (CU-00-01 card tags). The table page chips count each status separately. **[Figma]** Andrej's CU-00-01 frame.

## Seed data
Uses the `CH-SHELL` **Northgate** default seed (organisation "Northgate Insurance Services", Live NG01 and Test NG02). The signed-in user is Sophie Marchetti. Default sort: Full name, A to Z.

| # | Full name | Username | Email | Role | Status | Invited on |
|---|---|---|---|---|---|---|
| 1 | Sophie Marchetti (signed-in user) | sophie.marchetti | sophie.marchetti@northgate-insurance.co.uk | Administrator | Active | |
| 2 | James Okonkwo | james.okonkwo | james.okonkwo@northgate-insurance.co.uk | Administrator | Active | |
| 3 | Hannah Clarke | hannah.clarke | hannah.clarke@northgate-insurance.co.uk | Editor | Active | |
| 4 | Tomasz Nowak | tomasz.nowak | tomasz.nowak@northgate-insurance.co.uk | Editor | Active | |
| 5 | Aisha Rahman | aisha.rahman | aisha.rahman@northgate-insurance.co.uk | Viewer | Active | |
| 6 | Oliver Bennett | oliver.bennett | oliver.bennett@northgate-insurance.co.uk | Viewer | Active | |
| 7 | Chloe Davies | chloe.davies | chloe.davies@northgate-insurance.co.uk | Editor | Inactive | |
| 8 | Bartholomew Featherstonehaugh-Whitmore | bartholomew.featherstonehaugh-whitmore | bartholomew.featherstonehaugh-whitmore@northgate-insurance.co.uk | Viewer | Active | |
| 9 | Ravi Patel | ravi.patel | ravi.patel@northgate-insurance.co.uk | Editor | Active | |
| 10 | Megan Lewis | megan.lewis | megan.lewis@northgate-insurance.co.uk | Viewer | Active | |
| 11 | (not set) | (not set) | daniel.reyes@northgate-insurance.co.uk | Editor | Pending | 20 Oct 2026 |
| 12 | (not set) | (not set) | l.fischer@northgate-insurance.co.uk | Viewer | Pending | 24 Oct 2026 |

Counts: 12 users; 9 active, 2 pending, 1 inactive. The default 10 rows per page gives two pages.

**Mobius users summary (static, for the CU-00-01 card only):** 34 users, 32 active, 2 inactive, 0 pending. **[Figma]** Andrej's CU-00-01 frame. There is no Mobius users data beyond these counts.

**Variants** (selected without visible UI, as in `CH-SHELL`)
| Variant | Difference | Exercises |
|---|---|---|
| Default | As above | Pagination, truncation, pending rows, one inactive row, all four card tags |
| Only me | Sophie Marchetti only | Single row, no second page, last-Administrator rule on the signed-in user, card tags with zero counts hidden ("1 user", "1 active") |
| Shell "Long names" | `CH-SHELL` Long names organisation and user; same 12 rows, with the signed-in row replaced by that user | Header truncation inside the app |

**Per-environment data:** identical in Live and Test, because users belong to the organisation. This deliberately departs from the `CH-SHELL` recommendation to vary Test data.

## Prototype notes
- **Sources of truth:** `CH-SHELL` "Sources of truth" applies. Andrej's CU-00-01 frame and the Figma Mobius Users frame decide arrangement; Buckholt decides sizes, spacing, colours, icons and component styling; this spec decides behaviour and copy, and beats both.
- **State:** held in memory. A reload resets to the seed data. The environment persists as described in `CH-SHELL`.
- **Static areas:** as `CH-SHELL`. The Mobius users card leads to a placeholder page.
- **Unsaved changes (shell contract):** an open Add or Edit blade with changed values counts as unsaved changes and triggers the `CH-SHELL` SH-01 confirmation. Switching environment takes the user to CU-00-01, as the shell requires. **[Decision]** Andrej, 26 Oct 2026.
- **App-level header navigation (shell Gap 8):** none.
- **Viewport:** desktop first at 1440px; usable down to 1088px. The table scrolls horizontally inside its own container rather than wrapping columns. The CU-00-01 cards stack when two no longer fit side by side. **[Assumption]**

## Buckholt mapping
| UI element | Buckholt component / pattern | Variant or state needed | Notes |
|---|---|---|---|
| Page structure | Page layout with Header and Main (from `CH-SHELL`); Main: Page body > Frame > Pane > Panel | | |
| Page heading and description | Heading level 1; Text block | | |
| User type cards (CU-00-01) | Card | Body and footer; whole card is the link | Clickable card is Gap 10. |
| Card title | Heading level 2 | | |
| Card arrow | Icon from the Buckholt icon set (right arrow) | | Decorative. |
| Card status summary | Tag, several in a row | Status variants matching Andrej's frame: total, active, inactive, pending | Text carries the meaning; colour supports it. |
| Summary chips (CU-00-02) | Key-value pair with Icon block | | Chip container is Gap 4. |
| Search | Text input | With the Search common action icon | Filter bar is Gap 3. |
| Role and Status filters | Select | Top-aligned label | |
| Clear all filters | Button | Ghost | Shown only when a filter or search is active. |
| Add user | Button | Primary, Add common action | |
| More actions (ellipsis) | Menu button and Menu | Icon-only with Tooltip; items Edit (Edit common action) and Delete (Delete common action, danger) | Bulk actions on selected rows. |
| Users table | Table | Sortable headers | Row selection, pagination and empty cells are gaps (2, 5, 6). |
| Row checkbox | Checkbox | Default, checked, indeterminate (header), disabled | |
| Name avatar | Avatar | Initials; generic user icon for pending users | |
| Status | Tag | Active, Pending, Inactive | Text label always shown. Same status variants as the card tags. |
| Row actions | Button, icon-only | View, Edit (Edit common action), Delete (Delete common action, danger); disabled state | Each needs an accessible name and Tooltip. |
| Blade section headings | Heading level 2 | | "Account details", "Account management". |
| Status (Edit blade) | Switch | On (Active), off (Inactive), disabled | State text "Active" or "Inactive" beside it. |
| Reset MFA | Button | Secondary; disabled | Opens the Reset MFA Modal. |
| Reset MFA confirmation | Modal | Two actions | |
| Blades (add, view, edit) | None | | Gap 1. **[Decision]** Andrej, 26 Oct 2026: recurring Mobius pattern; more than five fields once the account exists. |
| Form fields | Form; Text input; Select | Required fields marked with an asterisk; read-only Text input | Asterisks follow Mobius, not the Buckholt rule (Blade layout). Read-only Text input may be Gap 7. |
| Role helper text | Form helper text | Changes with the selected role | |
| View blade fields | Key-value pair | | |
| Resend invitation | Button | Secondary | |
| Delete confirmation | Modal | Two actions; Delete in danger treatment | |
| Discard changes confirmation | Modal | Two actions | |
| Feedback after actions | Toast | Success | |

## Buckholt gaps
Checked against `buckholt-reference.md` (commit `211e365`, 19 Oct 2026). Claude Code: confirm against the live repo and remove any item the repo now documents. Build the rest under `prototypes/`, never `components/`, and log them in `SPEC-CHANGES.md` section C.

| # | Need | Why | Closest Buckholt option | Precedent (if any) | Expected behaviour |
|---|---|---|---|---|---|
| 1 | Blade (side panel) | Add, view and edit happen in a side panel, as in Mobius User Management | Side-panel form context in Forms; no drawer component | `prototypes/shared/blade`; Andrej's blade screenshots | Opens from the right over the page, which is dimmed and inert. Layout as "Blade layout": header bar with title and icon-only Close; body with section headings, which scrolls; footer spanning the blade, secondary action at the start edge and primary at the end edge. Focus moves to the first editable field (or the blade title in the View blade). Escape and Close behave as Cancel. Focus returns to the control that opened it. |
| 2 | Table pagination, rows per page and count | 12 rows exceed one page | None | Mobius Users frame **[Figma]** | Below the table: first, previous, page numbers, next, last; "Results per page" Select with 10, 25 and 50 (default 10); text "Showing {first}–{last} of {total}". Changing filters, search or rows per page returns to page 1. |
| 3 | Filter bar | Search and filters above the table | Text input; Select | Mobius Users frame **[Figma]**; CH shared component **[Context]** | One row: Search, Role, Status, then Add user and More actions at the right end. "Clear all filters" appears after the filters when any is active. |
| 4 | Summary chips container | Three counts above the filter bar | Key-value pair | Mobius Users frame **[Figma]** | One row of chips, each with an icon, label and count. Counts follow the data, not the filters. |
| 5 | Row selection with bulk actions | Select rows, then Edit or Delete from More actions | Checkbox; Table (selected-row state not documented) | Mobius Users frame **[Figma]** | Header checkbox selects or clears the rows on the current page and shows the indeterminate state when some are selected. Selection clears when filters, search, sort or page change. |
| 6 | Empty cell value | Pending users have no name or username | Table | None | Cell shows "Not set yet" as secondary text. Accessible text is the same. |
| 7 | Read-only Text input | Username and Email are shown in the Edit blade but can't be changed | Text input (Buckholt documents read-only for Select only) | None | Looks and reads as read-only, not disabled: still focusable, value can be selected and copied, announced as read-only. |
| 8 | No-results state | Search or filters match nothing | None | Originators spec; Mobius User Management **[Context]** | Replaces the table rows with the No results message (CU-00-02 States). Filter bar and chips stay. |
| 9 | Disabled action with explanation | Own-user and last-Administrator rules disable some actions | Button disabled state; Tooltip | None | Disabled control keeps its Tooltip, which gives the reason (see copy in CU-00-02 and CU-02). The reason is also its accessible description. |
| 10 | Clickable card with footer | CU-00-01 cards are links with a status summary in the footer | Card (selectable state and hit target not supplied) | Andrej's CU-00-01 frame **[Figma]** | The whole card is one link and the hit target. Hover: the card shows a hover treatment and the pointer changes. Focus: one visible focus indicator around the whole card. The link's accessible name is the card title; its accessible description is the description and the summary (for example "Add and manage the people who sign in to Configuration Hub. 12 users, 9 active, 1 inactive, 2 pending."). The arrow icon and tags are not separately focusable. Footer sits below the body, full card width, in a subtly different surface as in the frame. |

## CU-00-01 · User Management, choose user type
User Management's base page. Lets the user choose between Mobius users and Configuration Hub users, shows how many of each there are, and explains that they use separate accounts.

Figma: Andrej's CU-00-01 frame (link supplied with the handoff). Lo-fi history: stakeholder canvas frame A2.

### Page header
- Breadcrumb: "User Management" (single crumb, current page). See Shell overrides.
- Heading (level 1): "User Management"
- Description (one paragraph): "Choose which users you want to view and manage. Mobius and Configuration Hub use separate accounts. Someone who needs both will need an account for each." **[Decision]** Andrej, 27 Oct 2026.
- Document title: "User Management | Configuration Hub" (prefixed "[Test] " in Test, as the shell).

### Cards
Two cards side by side, equal width, aligned to the start of the content area, in this order. Each card (Gap 10):
- **Body:** title (Heading level 2), description, then a right arrow icon aligned to the end of the card.
- **Footer:** the status summary, a row of Tags.

| Card title | Description | Goes to | Summary source |
|---|---|---|---|
| "Mobius users" | "Add and manage the people who sign in to Mobius." | CU-00-03 | Static Mobius counts (Seed data) |
| "Configuration Hub users" | "Add and manage the people who sign in to Configuration Hub." | CU-00-02 | Live Configuration Hub users data |

### Status summary
Tags in this order, each with its status variant as in Andrej's frame:

| Tag | Copy | Shown when |
|---|---|---|
| Total | "{n} users" ("1 user" when n is 1) | Always |
| Active | "{n} active" | n is more than 0 |
| Inactive | "{n} inactive" | n is more than 0 |
| Pending | "{n} pending" | n is more than 0 |

- Zero counts are hidden, so the Mobius card shows no Pending tag, matching the frame. **[Decision]** Andrej, 27 Oct 2026.
- The Configuration Hub card follows the data. Inviting or deleting users on CU-00-02 changes it when the user comes back.
- Default seed: Mobius "34 users", "32 active", "2 inactive"; Configuration Hub "12 users", "9 active", "1 inactive", "2 pending".

### States
| State | Trigger | What the user sees |
|---|---|---|
| Default | Default seed | Both cards with their summaries as above |
| Only me | "Only me" variant | Configuration Hub card: "1 user", "1 active" |

## CU-00-02 · Configuration Hub users, populated
Lets the user see, find, add, edit and delete Configuration Hub users.

Layout reference: Figma Mobius Users frame (`7587:166787`). Differences are listed in Known screenshot differences.

### Page header
- Breadcrumb: "User Management > Configuration Hub users". "User Management" links to CU-00-01.
- Heading (level 1): "Configuration Hub users"
- Description: "View, add and manage who can sign in to Configuration Hub."
- Document title: "Configuration Hub users | User Management | Configuration Hub".

### Summary chips
In order: "Active users" (count of Active), "Pending users" (count of Pending), "Inactive users" (count of Inactive). Seed: 9, 2, 1. No licence chip. **[Assumption]**, Open questions 12.

### Filter bar
In order:
1. Search. Placeholder "Search". Accessible name "Search users". Matches First name, Last name, Full name, Username and Email; contains, case-insensitive; results update as the user types.
2. Role (Select). Label "Role". Options "All" (default), "Administrator", "Editor", "Viewer".
3. Status (Select). Label "Status". Options "All" (default), "Active", "Pending", "Inactive".
4. "Clear all filters" (Ghost Button), only while Search has text or a filter isn't "All". Resets all three and moves focus to Search.
5. At the right end: "Add user" (Primary), then More actions (icon-only, Tooltip and accessible name "More actions").

Search and filters combine (all must match).

### Table
Columns in order: selection checkbox, "Full name", "Username", "Email", "Role", "Status", row actions (no visible header; accessible header "Actions").
- **Full name:** Avatar with initials, then the full name. Pending users: generic user avatar and "Not set yet" (Gap 6).
- **Username:** the username, or "Not set yet" for pending users.
- **Email, Role:** plain text.
- **Status:** Tag with the status label.
- **Row actions:** View, Edit, Delete. Accessible names "View {Full name}", "Edit {Full name}", "Delete {Full name}"; for pending users use the email in place of the full name. Tooltips "View", "Edit", "Delete".

### Behaviour
- **Sorting:** every column except selection and actions sorts. Default Full name, A to Z. Selecting a header sorts by that column A to Z; selecting it again sorts Z to A. One sort column at a time. Rows showing "Not set yet" always sort after rows with a value.
- **Truncation:** text that doesn't fit its column truncates with an ellipsis; full text in a Tooltip on hover and in the accessible name (seed row 8).
- **Selection:** as Gap 5. The signed-in user's checkbox is disabled, with accessible name "Select Sophie Marchetti" and the Gap 9 reason "You can't select your own account."
- **More actions menu:** "Edit" is enabled when exactly one row is selected and opens CU-02 (or CU-03 for a pending user). "Delete" is enabled when one or more rows are selected and opens CU-05. With nothing selected, both are disabled.
- **Own user:** the Delete row action for the signed-in user is disabled with the reason "You can't delete your own account."
- **Last Administrator:** while only one active Administrator exists, their Delete row action is disabled with the reason "There must be at least one active administrator." (In the default seed this rule doesn't trigger until James Okonkwo is no longer an active Administrator.)
- **Pagination:** as Gap 2.

### States
| State | Trigger | What the user sees (exact copy) |
|---|---|---|
| Populated | Default seed | As above. "Showing 1–10 of 12". |
| Single user | "Only me" variant | One row. "Showing 1–1 of 1". Page controls disabled. |
| No results | Search or filters match nothing | Heading "No results found", text "Try adjusting your search or filter criteria for a match." **[Context]** |
| Empty | Not reachable | The signed-in user is always a Configuration Hub user, so the list is never empty. |

## CU-00-03 · Mobius users (placeholder)
Stands in for the existing Mobius users page, which this prototype doesn't rebuild.
- Breadcrumb: "User Management > Mobius users". "User Management" links to CU-00-01.
- Heading (level 1): "Mobius users"
- Text: "This page isn't part of this prototype yet."
- Link: "Back to User Management", goes to CU-00-01.
- Document title: "Mobius users | User Management | Configuration Hub".

In production this is today's Users page (Figma `7587:166787`). Its title becomes "Mobius users" and its breadcrumb "User Management > Mobius users" (Open questions 18).

## Blade layout (CU-01 to CU-04)
All blades share this structure (Gap 1), matching Mobius User Management. **[Decision]** PM, APM, TL and Andrej, Oct 2026; Andrej's blade screenshots supplied with the handoff.
- **Header bar:** the blade title (for example "Add user") and an icon-only Close button (Tooltip and accessible name "Close").
- **Body:** one or two sections, each starting with a section heading (Heading level 2): "Account details" and, where present, "Account management". The body scrolls; header and footer stay fixed.
- **Footer:** spans the full width of the blade. The secondary action sits at the start edge and the primary action at the end edge, with the space between them.
- **Required fields:** marked with an asterisk after the label, as in Mobius User Management. **[Decision]** Andrej, 28 Oct 2026. This differs from the Buckholt Forms rule (mark only optional fields when most are required): log it in `SPEC-CHANGES.md` section C for Mark. The asterisk is decorative; the field itself is marked as required for assistive technology.
- **Case:** all titles, headings and labels are in sentence case, per Buckholt. **[Decision]** Andrej, 28 Oct 2026.

## CU-01 · Add a Configuration Hub user
**Starts from:** CU-00-02.

### Steps
1. User selects "Add user". The Add blade opens. Focus moves to Email.
2. User enters an email and chooses a role.
3. User selects "Send invitation".
4. If valid: the blade closes, focus returns to "Add user", a success Toast shows, the new user appears as Pending with today's date as Invited on, and the Pending users chip goes up by one. The row follows the current sort, search and filters (it may be on another page or hidden by filters).
5. If invalid: errors show (see below) and focus moves to the first field with an error.

### Add blade
- Blade title: "Add user"
- Section "Account details":
  - Intro text, directly under the section heading and before the fields: "We'll email them a link to create their account. They'll choose a username and password, and set up multi-factor authentication." **[Decision]** Andrej, 28 Oct 2026 (text under the heading, not an Alert and not at the bottom).
  - Fields in order:

| Label | Type | Placeholder | Helper text | Validation (exact copy) |
|---|---|---|---|---|
| "Email" * | Text input, email | None | "We'll only use this to send the invitation. They'll sign in with their username." | Empty: "Enter an email address." Wrong format: "Enter an email address in the correct format, like name@example.com." Already an Active or Inactive user: "There's already a Configuration Hub user with this email address." Already Pending: "This person has already been invited. You can resend their invitation from their user details." Over 254 characters: "Email address must be 254 characters or fewer." |
| "Role" * | Select | "Select a role" (not selectable as a value) | Before a choice: "You can change their role later." After a choice: the role's description | Empty: "Select a role." |

- Footer: "Cancel" (Secondary, start), "Send invitation" (Primary, end).

### Rules
- Email is checked when the field loses focus and again on "Send invitation". Role is checked on "Send invitation". Each field validates on its own.
- Email is compared in lower case, after trimming spaces.
- "Cancel", Close and Escape close the blade without a confirmation and discard what was entered. **[Assumption]** (two fields, low cost to re-enter).
- "Send invitation" is always enabled. Validation explains what's missing.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Invitation sent | "Invitation sent to {email}." | Success |

## CU-02 · Edit an active or inactive user
**Starts from:** CU-00-02.

### Steps
1. User selects Edit on a row, or selects one row and chooses More actions > Edit, or selects "Edit" in the View blade (CU-04).
2. The Edit blade opens with the user's current values. Focus moves to First name.
3. User changes one or more fields, including Status, and selects "Save changes".
4. If valid: the blade closes, focus returns to the control that opened it (or to the row's Edit action if it was opened from the View blade), a success Toast shows, and the row, chips and CU-00-01 card summary update.

### Edit blade
- Blade title: "Edit user"
- Section "Account details". Field order matches Mobius User Management **[Decision]** Andrej, 28 Oct 2026 (read-only and editable fields are not grouped, for now):

| Label | Type | Helper text | Validation (exact copy) |
|---|---|---|---|
| "First name" * | Text input | None | Empty: "Enter a first name." Over 50: "First name must be 50 characters or fewer." |
| "Last name" * | Text input | None | Empty: "Enter a last name." Over 50: "Last name must be 50 characters or fewer." |
| "Email" | Read-only Text input (Gap 7) | "Email can't be changed." | None |
| "Username" | Read-only Text input (Gap 7) | "Username can't be changed." | None |
| "Role" * | Select | The selected role's description | None (always has a value) |

- Section "Account management":
  - **Status:** label "Status"; a Switch at the end of the row, with the state text "Active" or "Inactive" next to it, changing as the Switch changes. On means Active.
  - **Reset MFA:** label "Reset multi-factor authentication (MFA)", then a "Reset MFA" button (Secondary) below it.
- Footer: "Cancel" (Secondary, start), "Save changes" (Primary, end).
- There is no "Reset password". Configuration Hub users reset their own password from the sign-in page. **[Decision]** Andrej, 28 Oct 2026.

### Rules
- "Save changes" is disabled until a value differs from the saved value, including Status. **[Assumption]**
- Status changes take effect on "Save changes", like every other field, so "Cancel" undoes them. No confirmation Modal. **[Decision]** Andrej, 28 Oct 2026.
- An Inactive user can't sign in to Configuration Hub. Their row shows Inactive, and the chips and CU-00-01 summary update.
- Own user: Role is read-only, with helper text "You can't change your own role." The Status Switch is disabled, with helper text "You can't deactivate your own account."
- Last active Administrator: Role is read-only and the Status Switch is disabled, each with helper text "There must be at least one active administrator." Deactivating an Administrator counts towards this rule.
- Changing First or Last name updates Full name and initials in the table.
- Cancel, Close or Escape with unsaved changes opens the Discard changes Modal. Without changes, the blade just closes.

### Reset MFA
- "Reset MFA" acts straight away, separately from "Save changes". It opens the Reset MFA Modal; unsaved changes in the blade are kept.
- Disabled, with the reason as helper text under the button:
  - for the signed-in user: "You can't reset your own MFA here."
  - for a user whose saved status is Inactive: "Activate this user before resetting their MFA."
- Reset MFA Modal:
  - Title: "Reset MFA for {Full name}?"
  - Body: "They'll need to set up multi-factor authentication again the next time they sign in."
  - Actions as the Buckholt Modal pattern (not the blade footer): "Cancel" (Secondary), "Reset MFA" (Primary).
  - Confirming closes the Modal, returns focus to "Reset MFA" and shows a success Toast. "Cancel", Escape and the close control return focus to "Reset MFA" with no change.

### Discard changes (Modal)
- Title: "Discard your changes?"
- Body: "You've made changes that haven't been saved. If you leave now, they'll be lost."
- Actions: "Keep editing" (Secondary), "Discard changes" (Primary).
- "Keep editing", Escape and the close control return to the blade with the changes intact and focus on the control that opened the Modal.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Saved, status changed to Inactive | "{Full name} can no longer sign in to Configuration Hub." | Success |
| Saved, status changed to Active | "{Full name} can sign in to Configuration Hub again." | Success |
| Saved, status unchanged | "Changes saved for {Full name}." | Success |
| MFA reset | "MFA reset for {Full name}." | Success |

When Status and other fields change together, only the status message shows.

## CU-03 · Edit a pending user
**Starts from:** CU-00-02, on a Pending row.

### Edit blade (pending)
- Blade title: "Edit user"
- Section "Account details": "Email" (read-only, helper "Email can't be changed."), "Role" * (Select, helper is the selected role's description).
- Section "Account management":
  - Text: "Invitation sent on {Invited on}. Their name and username will show here once they've created their account."
  - "Resend invitation" (Secondary Button).
  - No Status Switch and no Reset MFA: there is no account yet. **[Decision]** Andrej, 28 Oct 2026.
- Footer: "Cancel" (Secondary, start), "Save changes" (Primary, end). Same rules as CU-02.

### Rules
- "Resend invitation" works straight away, without saving other changes. Invited on becomes today's date and the text updates. A success Toast shows. **[Assumption]**, Open questions 7.
- Changing the role of a pending user changes the role they'll have once their account is created.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Invitation resent | "Invitation sent again to {email}." | Success |
| Changes saved | "Changes saved for {email}." | Success |

## CU-04 · View a user
**Starts from:** CU-00-02.

### View blade
- Blade title: "View user"
- Same sections as the Edit blade, read-only, as Key-value pairs. **[Decision]** Andrej, 28 Oct 2026.
  - Active or Inactive user. "Account details": "First name", "Last name", "Email", "Username", "Role". "Account management": "Status".
  - Pending user. "Account details": "Email", "Role". "Account management": "Status", "Invited on".
- Footer: "Close" (Secondary, start), "Edit" (Primary, end, Edit common action). "Edit" replaces the View blade with the Edit blade (CU-02 or CU-03).

## CU-05 · Delete users
**Starts from:** CU-00-02, from a row's Delete action or More actions > Delete.

### Delete confirmation (Modal)
| Case | Title | Body |
|---|---|---|
| One Active or Inactive user | "Delete {Full name}?" | "They won't be able to sign in to Configuration Hub. Their Mobius user, if they have one, isn't affected. You can't undo this." |
| One Pending user | "Cancel the invitation for {email}?" | "The link in their invitation will stop working. You can't undo this." |
| More than one user | "Delete {n} users?" | "They won't be able to sign in to Configuration Hub, and any pending invitations will be cancelled. Mobius users aren't affected. You can't undo this." |

- Actions (right-aligned, Primary last): "Cancel" (Secondary), then "Delete" or, for a single pending user, "Cancel invitation" (Primary, danger treatment).
- Bulk Delete is disabled if the selection would remove the last active Administrator, with the reason "There must be at least one active administrator."

### Rules
- After confirming: the Modal closes, the users are removed, chips update, selection clears, and focus moves to the Search field. If the current page is now empty, the previous page shows.
- "Cancel", Escape and the close control close the Modal with no change and return focus to the control that opened it.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| One user deleted | "{Full name} deleted." | Success |
| One invitation cancelled | "Invitation for {email} cancelled." | Success |
| Several deleted | "{n} users deleted." | Success |

## Accessibility requirements
- All `CH-SHELL` requirements apply.
- **CU-00-01 cards:** as Gap 10. One tab stop per card; Enter activates.
- **Icon-only controls:** More actions, row actions and the blade Close button each have an accessible name and the documented Tooltip.
- **Table:** column headers are real headers; sortable headers expose the current sort direction; the row checkbox accessible name is "Select {Full name}" (or the email for pending users); the header checkbox is "Select all users on this page".
- **Status Switch:** accessible name "Status"; its on or off state is announced, and the visible state text matches it.
- **Required fields:** marked as required for assistive technology; the asterisk itself isn't announced.
- **Blade:** behaves as a dialog with the blade title as its name; focus stays inside while open; Escape closes (with the Discard changes Modal when there are unsaved changes); focus returns to the opener.
- **Forms:** errors are linked to their fields and announced; focus moves to the first field with an error; helper text is linked to its field. Read-only fields are announced as read-only.
- **Live updates:** the "Showing …" count and the no-results message are announced politely when search or filters change. Toasts are announced politely.
- **Disabled actions:** the reason is available as an accessible description, not only in a Tooltip.
- **Colour:** status is always written; tags, selection, errors and disabled states never rely on colour alone.

## Acceptance criteria
- Given the home page, then the second app card is titled "User Management", reads "Add and manage your Mobius and Configuration Hub users." and opens CU-00-01.
- Given CU-00-01, then the breadcrumb is "User Management", the description includes the separate accounts sentences, and both cards show in order with the descriptions "Add and manage the people who sign in to Mobius." and "Add and manage the people who sign in to Configuration Hub."
- Given CU-00-01 with the default seed, then the Mobius card shows "34 users", "32 active", "2 inactive" and no pending tag, and the Configuration Hub card shows "12 users", "9 active", "1 inactive", "2 pending".
- Given CU-00-01, when the user tabs through the page, then each card is one tab stop and its accessible name is its title.
- Given CU-00-01, when the user selects anywhere on the "Configuration Hub users" card, then CU-00-02 shows 10 rows sorted by Full name A to Z, chips 9, 2 and 1, and "Showing 1–10 of 12".
- Given CU-00-01, when the user selects the "Mobius users" card, then CU-00-03 shows the placeholder, and "Back to User Management" returns to CU-00-01.
- Given a new invitation was sent on CU-00-02, when the user returns to CU-00-01, then the Configuration Hub card shows "13 users" and "3 pending".
- Given CU-00-02 in Live, when the user switches to Test and reopens Configuration Hub users, then the same 12 users show.
- Given CU-00-02, when the user searches "patel", then only Ravi Patel shows and "Clear all filters" appears.
- Given CU-00-02, when the user searches "zzz", then "No results found" shows with its message and the chips are unchanged.
- Given CU-00-02, when the user sets Status to "Pending", then only the two pending users show, each with "Not set yet" in Full name and Username.
- Given CU-00-02, when the user sorts by Full name Z to A, then rows with "Not set yet" are still last.
- Given CU-00-02, when the user selects Clear all filters, then search and filters reset and focus is on Search.
- Given the Add blade, when the user selects "Send invitation" with both fields empty, then both errors show and focus is on Email.
- Given the Add blade, when the user enters "hannah.clarke@northgate-insurance.co.uk", then the "already a Configuration Hub user" error shows.
- Given the Add blade, when the user enters "Daniel.Reyes@northgate-insurance.co.uk ", then the "already been invited" error shows.
- Given a valid email and role, when the user sends the invitation, then the blade closes, the Toast shows, a Pending row exists with today's date, and the Pending users chip shows 3.
- Given the Add blade, then its title is "Add user", the intro text sits under "Account details" before Email, Email and Role carry asterisks, Email has no placeholder, and the footer has "Cancel" at the start and "Send invitation" at the end.
- Given the Edit blade for Hannah Clarke, then its title is "Edit user", the fields read First name, Last name, Email, Username, Role in that order, Email and Username are read-only and focusable, no password field shows, and "Save changes" is disabled.
- Given the Edit blade for Hannah Clarke, when the user switches Status off and saves, then her row shows Inactive, the chips show 8 active and 2 inactive, and the Toast reads "Hannah Clarke can no longer sign in to Configuration Hub."
- Given the Edit blade, when the user switches Status off and then selects "Cancel" and "Discard changes", then the user stays Active.
- Given the Edit blade for Chloe Davies (Inactive), then "Reset MFA" is disabled with "Activate this user before resetting their MFA."
- Given the Edit blade for Hannah Clarke, when the user selects "Reset MFA" and confirms, then the Modal closes, focus is on "Reset MFA", the Toast reads "MFA reset for Hannah Clarke." and the blade stays open.
- Given the Edit blade, when the user changes Last name and saves, then the table row and initials update and the Toast shows.
- Given unsaved changes in the Edit blade, when the user presses Escape, then the Discard changes Modal opens; "Keep editing" keeps the changes.
- Given the Edit blade for Sophie Marchetti, then Role is read-only with "You can't change your own role.", the Status Switch is disabled with "You can't deactivate your own account.", and "Reset MFA" is disabled with "You can't reset your own MFA here."
- Given the Edit blade for a pending user, then "Resend invitation" is under "Account management" and there is no Status Switch or "Reset MFA".
- Given the View blade, then its title is "View user", it shows "Account details" and "Account management" as read-only Key-value pairs, and the footer has "Close" at the start and "Edit" at the end.
- Given CU-00-02, then Sophie Marchetti's Delete action and checkbox are disabled with their reasons.
- Given James Okonkwo's role is changed to Editor, then Sophie Marchetti is the last active Administrator and the last-Administrator rule applies.
- Given a pending row, when the user opens Edit and selects "Resend invitation", then Invited on becomes today and the "Invitation sent again" Toast shows.
- Given one pending row, when the user deletes it, then the title is "Cancel the invitation for {email}?" and, after confirming, the row is gone and the Pending users chip goes down by one.
- Given three selected rows, when the user chooses More actions > Delete and confirms, then "3 users deleted." shows, the selection clears and focus is on Search.
- Given the Add or Edit blade has changed values, when the user switches environment, then the `CH-SHELL` unsaved changes Modal shows; confirming lands on CU-00-01.
- Given any blade closes, then focus returns to the control that opened it.
- Given the prototype, then the words "Account Management" (as an app or page name), "Mobius accounts" and "Configuration Hub accounts" appear nowhere, and no title, heading or label uses Title Case.

## Open questions
| # | Question | Owner | Blocks build? |
|---|---|---|---|
| 7 | Do invitation links expire, after how long, and is resending in scope for the first release? | Technical lead / PM | No. Assumption: resend included, expiry not shown. |
| 9 | Until roles and permissions exist, who can manage Configuration Hub users? | PM / roles discovery | No |
| 10 | Should Open GI staff with access to a client's Configuration Hub appear in this list, as they do for Mobius? | PM | No. Out of scope here. |
| 12 | Is there a limit or licence on Configuration Hub users? | PM | No. Assumption: no limit. |
| 13 | Are the last-Administrator and own-user rules correct? | PM / roles discovery | No |
| 17 | Choose-user-type page (CU-00-01) or the design team's split "Open" button on the home app card? To be discussed with the PM, APM and technical lead using the prototype and the Figma alternative. | Andrej / PM | No |
| 18 | Clickable card with a tag footer is new to Buckholt (Gap 10). Review with Mark, who wasn't at the design drop-in. | Andrej / Mark | No |

Closed: 1, 2, 4, 5, 6, 11, 16 (revisions 2 and 3); 8 (revision 6: deactivating is in scope). 14 and 15 superseded in revision 4: the name is User Management again, so there is no "Accounts" clash and no production rename beyond the Mobius page title.

## Known screenshot differences
| Screens | Screenshot shows | Build this instead |
|---|---|---|
| CU-00-01 vs Andrej's frame | Breadcrumb "Applications" | "User Management" (single crumb), consistent with every other app's breadcrumb **[Decision]** Andrej, 27 Oct 2026 |
| CU-00-01 vs Andrej's frame | Descriptions "Add and manage users for signing in to Mobius" and "… to Configuration Hub." | "Add and manage the people who sign in to Mobius." and "Add and manage the people who sign in to Configuration Hub." |
| CU-00-01 vs Andrej's frame | Mobius card "34 users, 32 active, 2 inactive"; Configuration Hub card "34 users, 32 active, 1 inactive, 1 pending" | Mobius as shown; Configuration Hub from the seed: "12 users", "9 active", "1 inactive", "2 pending" |
| CU-00-01 vs Andrej's frame | Avatar "RD", environment control labelled "Open GI" | `CH-SHELL` Northgate seed (Sophie Marchetti) |
| CU-00-02 vs Figma `7587:166787` | Title "Users", breadcrumb "User Management > Users" | Title "Configuration Hub users", breadcrumb "User Management > Configuration Hub users" |
| CU-00-02 vs Figma | Chips: Total Mobius licences, Active users, Inactive users, Open GI users, SSO users | Chips: Active users, Pending users, Inactive users |
| CU-00-02 vs Figma | Filters: Access level, Access to, Account type, Status | Filters: Role, Status |
| CU-00-02 vs Figma | Columns: Access level, Access to, Account type | Column: Role |
| CU-00-02 vs Figma | Open GI staff with the Open GI avatar | No Open GI staff |
| Home (shell) | App card description "Add and manage your Mobius users and what they can access." | "Add and manage your Mobius and Configuration Hub users." (Shell overrides) |
| CU-01, CU-02 vs Andrej's blade screenshots | Title Case: "Add User", "Edit User", "Account Details", "Account Management", "Reset Multi-Factor Authentication (MFA)" | Sentence case: "Add user", "Edit user", "Account details", "Account management", "Reset multi-factor authentication (MFA)" |
| CU-01 vs screenshot | Email placeholder "Email"; Role placeholder "Select"; intro paragraph at the bottom of the body | No Email placeholder; "Select a role"; intro text under "Account details", before Email |
| CU-02 vs screenshot | First and Last name placeholders read "Email"; helper text without full stops | No placeholders; "Email can't be changed." and "Username can't be changed." |
| CU-03, CU-04 | No screenshot | Build from this spec, using the CU-02 layout |

## Changes from legacy
| Area | Legacy | New |
|---|---|---|
| Creating Configuration Hub users | Client raises a request; Open GI developers create the user through a pipeline and send credentials | Client invites the person by email from User Management; the person creates their own account, username, password and MFA |
| Seeing who has access | Clients can't see a list of Configuration Hub users | Clients see every Configuration Hub user, with role and status, and a summary on the User Management page |
| Access level | Every Configuration Hub user can reach every app | Each user has a role (placeholder until roles and permissions are designed) |

## Follow-ups outside this prototype
Not for Claude Code. Kept here so they aren't lost before story mapping.
| Follow-up | Where | Owner |
|---|---|---|
| Change Title Case copy in the blades ("Add User", "Account Details" and similar) to sentence case, per Buckholt | Mobius User Management | Andrej |
| Change the Status toggle from On/Off to Active/Inactive | Mobius User Management | Andrej, at story mapping |
| Required asterisks vs the Buckholt "mark optional fields" rule | Buckholt / Mark | Andrej |
| Clickable card with a tag footer (Gap 10) | Buckholt / Mark | Andrej |

## Screen index
| Screen ID | Figma frame / file |
|---|---|
| CU-00-01 | Andrej's frame in the User Management file (link supplied with the handoff) |
| CU-00-02 | Layout reference: User Management file, "Mobius Users" `7587:166787` |
| CU-00-03 | No frame (shell placeholder pattern) |
| CU-01 | Andrej's Add blade screenshot (supplied with the handoff) |
| CU-02 | Andrej's Edit blade screenshot (supplied with the handoff). Field reference: Mobius Edit user (User Management file, page "Edit User") |
| CU-03 | No frame (CU-02 layout) |
| CU-04 | No frame (CU-02 layout). Reference: Mobius View user (page "View User") |
| CU-05 | No frame. Reference: Mobius Delete user (page "Delete User") |

---

## Readiness checklist (all must pass before handoff)
- [x] Every screen in the index has a section, and every section has a screenshot or an explicit "no frame". *(CU-00-01 frame link supplied with the handoff.)*
- [x] All copy is final, quoted, and checked against the Tone of Voice guide. *(Wording decisions delegated by Andrej, 27 Oct 2026, and checked against the Tone of Voice guide.)*
- [x] Every interactive element appears in the Buckholt mapping or in Buckholt gaps.
- [x] No HTML, class names, hex values or icon class strings anywhere in the spec.
- [x] Seed data covers empty, single, many and edge cases (long names, max values). *(Empty is unreachable by design.)*
- [x] Every state has defined copy.
- [x] Open questions marked "Blocks build" are resolved or have an agreed assumption. *(None block.)*
- [x] Acceptance criteria cover every flow.
- [x] Checked against the current `buckholt-reference.md` (commit `211e365`, 19 Oct 2026). Claude Code confirms the Buckholt gaps against the live repo.

## Handoff prompt for Claude Code
> Update the CH-USERS prototype to revision 6 of `prototypes/CH-USERS/ch-users-spec.md`. Read "What changed in this revision" first. Rename everything back to User Management, and rebuild CU-00-01 from Andrej's Figma frame and the spec (Gap 10). Export the CU-00-01 frame into `screenshots/`. Keep every other behaviour as built. Follow `AGENTS.md`; build gaps as prototype-local, never in `components/`. Update `PROTOTYPE.md` and `SPEC-CHANGES.md`, update the test assertions, run the suites, and push to the existing branch and PR. Don't commit to main.
