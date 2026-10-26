# Configuration Hub accounts (CH-USERS): Feature Specification

## About this document
- **Product / location:** Configuration Hub > Account Management > Configuration Hub accounts.
- **Readers:** developers, product, and Claude Code building a clickable prototype.
- **Prototype folder:** `prototypes/CH-USERS/`
- **Screen IDs:** `CU-FF-SS`. CU is Configuration Hub users, FF the flow (00 = base pages), SS the step. Screenshots in `screenshots/` are named by screen ID.
- **Shell:** `CH-SHELL` spec, revision 7. Header, environment control, Test alert, Mobius link, avatar menu, breadcrumb band, skip link, document title pattern and focus-on-navigation behaviour come from it unchanged, except the two overrides under "Shell overrides". Static (inert) parts are as in the shell: Mobius link and Logout.
- **Source tags:** **[Figma]** User Management file, page "Users page - Design System Components Update - August 2026", frame "Mobius Users" (node `7587:166787`), used as the layout reference for the accounts table. **[Context]** CH product context and initial login access context (baseline 17 Oct 2026). **[Decision]** agreed, with who and when. **[Assumption]** to be validated. There are no Figma frames for these pages yet.
- **Revision:** 3, 26 Oct 2026. App card description updated; remaining terminology and scope questions closed. Ready for handoff.

## What changed in this revision
| Area | Change |
|---|---|
| Revision 3: app card | Description changed to "Add and manage your Mobius and Configuration Hub accounts." **[Decision]** Andrej, 26 Oct 2026 |
| Revision 3: open questions | 4, 14, 15 and 16 closed. |
| Revision 2: app name and terminology | "User Management" becomes "Account Management" (app card title, breadcrumbs, page titles). The two sections are "Mobius accounts" and "Configuration Hub accounts". Copy on these pages now says "account" for the thing being created and managed, and "user" or "person" only for the human. **[Decision]** Andrej, 26 Oct 2026 |
| Revision 2: Shell overrides | New section. App registry name change and single-crumb base page. |
| Revision 2: Account fields | Confirmed by Andrej: the invited person sets Username, Email, First name, Last name, password and MFA during account creation. Display name removed. Username is chosen by the person, differs from the email and is what they sign in with. |
| Revision 2: Environments | Accounts belong to the organisation (tenant), not to Live or Test. Was an assumption. |
| Revision 2: Blade | Confirmed for adding and editing (Open questions 5 closed). |
| Revision 2: Copy | Approved by Andrej, 26 Oct 2026, including the separate accounts note. Copy changed in this revision for the rename needs a second look (Readiness checklist). |
| Revision 2: Open questions | 1, 2, 5, 6 and 11 closed. 3 replaced. New: 14 to 16. |

## Feature overview
- Today a client can't create Configuration Hub accounts for its own people. Open GI developers create them manually from tickets, so clients wait on Open GI to give a colleague access. This feature lets a client user invite a colleague to Configuration Hub by email and manage that account afterwards. **[Context]**
- **Separate accounts:** Mobius and Configuration Hub use separate accounts. This is recorded in a Business Decision Record. A person who needs both has a Mobius account and a Configuration Hub account. **[Decision]** BDR; **[Context]** initial login access.
- **Placement:** Configuration Hub accounts sit inside the existing app, renamed Account Management, next to Mobius accounts. The app opens on a page that lets the user choose which accounts to manage. **[Decision]** Option A, agreed by the PM, APM, Andrej and a long-tenured stakeholder (former broker), Oct 2026; a second stakeholder had also endorsed it beforehand. Rename **[Decision]** Andrej, 26 Oct 2026.
- **Roles:** every Configuration Hub account has exactly one role, chosen at invitation. Roles and permissions are still in discovery, so the prototype uses three placeholder roles and has no screens for managing roles. **[Decision]** Andrej, 26 Oct 2026.
- **Users and permissions:** one viewpoint, a client user with the Administrator role who can see and do everything on these pages. Role-based restrictions are not modelled. **[Assumption]**
- **Dependencies:** `CH-SHELL`. Microsoft account creation (Azure AD B2C), which the invited person completes outside Configuration Hub. **[Context]**
- **Out of scope for this prototype:**
  - The Mobius accounts page. Its card leads to a placeholder (CU-00-03).
  - Managing roles and permissions, and anything that depends on what a role allows.
  - The invitation email and the Microsoft account-creation pages (username, password and MFA set-up).
  - Resetting passwords or MFA, changing an account's status (deactivate or reactivate), and bulk invitations.
  - Open GI staff view, and Open GI staff appearing in the Configuration Hub accounts list.
  - Audit Centre entries for these actions.

## Shell overrides
| Override | `CH-SHELL` says | This spec | Why |
|---|---|---|---|
| App registry, order 2 | Name "User Management" | Name "Account Management". Description "Add and manage your Mobius and Configuration Hub accounts." (58 characters, meets the `CH-SHELL` card copy rules). Destination CU-00-01. | **[Decision]** Andrej, 26 Oct 2026. Claude Code: check the name against the `CH-SHELL` App name length rule (18 characters; must not render wider than "Third-Party Services"). Record the result in `SPEC-CHANGES.md` section A. |
| Base page breadcrumb | "{App name} > {Base page name}" | "Account Management" as a single crumb on CU-00-01 | The base page has no name separate from the app. Follows the single-crumb form of `CH-SHELL` SH-03-01. |

The `CH-SHELL` spec should take the new app name and description in its next revision, so other CH prototypes match.

## Glossary
| Term | Meaning |
|---|---|
| Configuration Hub account | What a person signs in to Configuration Hub with. Separate from a Mobius account. |
| Mobius account | What a person signs in to Mobius with. Managed on the Mobius accounts page, which this prototype doesn't build. |
| User | The person who holds an account. The signed-in user is the person using the prototype. |
| Username | Chosen by the person during account creation. Used to sign in to Configuration Hub. Not the email. |
| Invitation | Email sent to the person with a link to create their account. The email address is used for this, not for signing in. |
| Pending | Invited, but the account hasn't been created yet. |
| Active | Account created; the person can sign in. |
| Inactive | Account exists but the person can't sign in. Seed data only in this prototype. |
| Role | Placeholder for the level of access an account has. One per account. |
| Blade | Mobius term for the side panel that holds the add, view and edit forms. Not a Buckholt component. |

## Data model
| Field | Format / validation | Set by | Shown where | Notes |
|---|---|---|---|---|
| Email | Valid email address, 254 characters or fewer, stored in lower case. Unique across all Configuration Hub accounts, whatever their status | Inviting user | Table, all blades | Where the invitation goes. Can't be changed after the invitation is sent. **[Context]** (immutable in Mobius) |
| Username | Text | Invited person, at account creation | Table, View and Edit blades | Used to sign in. Can't be changed. Seed values use "first.last" in lower case. **[Decision]** Andrej, 26 Oct 2026 |
| First name | Text, 1 to 50 characters | Invited person, at account creation | Table (as Full name), View and Edit blades | Editable afterwards. **[Decision]** fields confirmed by Andrej, 26 Oct 2026; editability and length **[Assumption]** |
| Last name | Text, 1 to 50 characters | As First name | As First name | As First name |
| Password, MFA | n/a | Invited person, at account creation | Never shown | Handled by Microsoft. |
| Full name | "{First name} {Last name}" | Derived | Table, View blade title | |
| Initials | As the `CH-SHELL` initials rule | Derived | Table avatar | Pending accounts have no name, so they show a generic user avatar. |
| Role | One of the placeholder roles below | Inviting user | Table, all blades | Required. |
| Status | Pending, Active or Inactive | System | Table, View blade | Not editable in this prototype. |
| Invited on | Date, "d MMM yyyy" (for example "20 Oct 2026") | System | View and Edit blades for pending accounts | Updated when an invitation is resent. |

**Placeholder roles [Decision]** Andrej, 26 Oct 2026 (made up for the prototype; replace when roles and permissions discovery concludes)
| Role | Description (shown as helper text) |
|---|---|
| Administrator | "Can use every Configuration Hub app and manage Configuration Hub accounts." |
| Editor | "Can use every Configuration Hub app, but can't manage Configuration Hub accounts." |
| Viewer | "Can see every Configuration Hub app, but can't make changes." |

**Rules**
- Accounts belong to the organisation (tenant), not to an environment. The same accounts show in Live and Test. **[Decision]** Andrej, 26 Oct 2026.
- Each email belongs to at most one Configuration Hub account, including pending ones.
- Pending accounts have an email, role and invited date only. Username and name appear once the person creates their account.
- There must always be at least one active Administrator. The last active Administrator's role can't be changed, and their account can't be deleted. **[Assumption]**
- The signed-in user can't change their own role or delete their own account. **[Assumption]**
- Deleting a pending account cancels its invitation. The link in the email stops working. **[Assumption]**
- Deleting a Configuration Hub account never affects a Mobius account. **[Decision]** BDR (separate accounts).
- Pending accounts count only towards the Pending invitations chip. **[Assumption]**, Open questions 12.

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

Counts: 9 active, 2 pending, 1 inactive; 12 rows, so the default 10 rows per page gives two pages.

**Variants** (selected without visible UI, as in `CH-SHELL`)
| Variant | Difference | Exercises |
|---|---|---|
| Default | As above | Pagination, truncation, pending rows, one inactive row |
| Only me | Sophie Marchetti only | Single row, no second page, last-Administrator rule on the signed-in user |
| Shell "Long names" | `CH-SHELL` Long names organisation and user; same 12 rows, with the signed-in row replaced by that user | Header truncation inside the app |

**Per-environment data:** identical in Live and Test, because accounts belong to the organisation. This deliberately departs from the `CH-SHELL` recommendation to vary Test data.

**Shell registry:** Account Management (registry order 2, renamed) is already in every default seed. Its base page is CU-00-01.

## Prototype notes
- **Sources of truth:** `CH-SHELL` "Sources of truth" applies. The Figma Mobius Users frame decides the arrangement of the accounts table page; Buckholt decides sizes, spacing, colours, icons and component styling; this spec decides behaviour and copy, and beats both.
- **State:** held in memory. A reload resets to the seed data. The environment persists as described in `CH-SHELL`.
- **Static areas:** as `CH-SHELL`. The Mobius accounts card leads to a placeholder page.
- **Unsaved changes (shell contract):** an open Add or Edit blade with changed values counts as unsaved changes and triggers the `CH-SHELL` SH-01 confirmation. Switching environment takes the user to CU-00-01, as the shell requires, even though the accounts don't change. **[Decision]** Andrej, 26 Oct 2026.
- **App-level header navigation (shell Gap 8):** none.
- **Viewport:** desktop first at 1440px; usable down to 1088px. The table scrolls horizontally inside its own container rather than wrapping columns. **[Assumption]**

## Buckholt mapping
| UI element | Buckholt component / pattern | Variant or state needed | Notes |
|---|---|---|---|
| Page structure | Page layout with Header and Main (from `CH-SHELL`); Main: Page body > Frame > Pane > Panel | | |
| Page heading and description | Heading level 1; Text block | | |
| Separate accounts note (CU-00-01) | Text block | Body text | Not an Alert: it explains, it doesn't warn. |
| Account type cards (CU-00-01) | Card | Title, description, action; no media | Only the action is interactive, so no clickable-card state is needed. |
| Card action "Open" | Link styled as a Primary Button | | Same treatment as `CH-SHELL` app cards. |
| Summary chips | Key-value pair with Icon block | | Chip container is Gap 4. |
| Search | Text input | With the Search common action icon | Filter bar is Gap 3. |
| Role and Status filters | Select | Top-aligned label | |
| Clear all filters | Button | Ghost | Shown only when a filter or search is active. |
| Add account | Button | Primary, Add common action | |
| More actions (ellipsis) | Menu button and Menu | Icon-only with Tooltip; items Edit (Edit common action) and Delete (Delete common action, danger) | Bulk actions on selected rows. |
| Accounts table | Table | Sortable headers | Row selection, pagination and empty cells are gaps (2, 5, 6). |
| Row checkbox | Checkbox | Default, checked, indeterminate (header), disabled | |
| Name avatar | Avatar | Initials; generic user icon for pending accounts | |
| Status | Tag | Active, Pending, Inactive | Text label always shown, so colour never carries meaning alone. |
| Row actions | Button, icon-only | View, Edit (Edit common action), Delete (Delete common action, danger); disabled state | Each needs an accessible name and Tooltip. |
| Blades (add, view, edit) | None | | Gap 1. Blade confirmed over Modal: **[Decision]** Andrej, 26 Oct 2026 (recurring Mobius pattern; the account has more than five fields once created). |
| Form fields | Form; Text input; Select | Required by default; read-only Text input | Read-only Text input may be Gap 7. |
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
| 1 | Blade (side panel) | Add, view and edit happen in a side panel, as in Mobius account management | Side-panel form context in Forms; no drawer component | `prototypes/shared/blade` | Opens from the right over the page, which is dimmed and inert. Header: title and an icon-only Close button. Body scrolls. Footer: actions right-aligned, Primary last. Focus moves to the first editable field (or the title in the View blade). Escape and Close behave as Cancel. Focus returns to the control that opened it. |
| 2 | Table pagination, rows per page and count | 12 rows exceed one page | None | Mobius Users frame **[Figma]** | Below the table: first, previous, page numbers, next, last; "Results per page" Select with 10, 25 and 50 (default 10); text "Showing {first}–{last} of {total}". Changing filters, search or rows per page returns to page 1. |
| 3 | Filter bar | Search and filters above the table | Text input; Select | Mobius Users frame **[Figma]**; CH shared component **[Context]** | One row: Search, Role, Status, then Add account and More actions at the right end. "Clear all filters" appears after the filters when any is active. |
| 4 | Summary chips container | Three counts above the filter bar | Key-value pair | Mobius Users frame **[Figma]** | One row of chips, each with an icon, label and count. Counts follow the data, not the filters. |
| 5 | Row selection with bulk actions | Select rows, then Edit or Delete from More actions | Checkbox; Table (selected-row state not documented) | Mobius Users frame **[Figma]** | Header checkbox selects or clears the rows on the current page and shows the indeterminate state when some are selected. Selection clears when filters, search, sort or page change. |
| 6 | Empty cell value | Pending accounts have no name or username | Table | None | Cell shows "Not set yet" as secondary text. Accessible text is the same. |
| 7 | Read-only Text input | Username and Email are shown in the Edit blade but can't be changed | Text input (Buckholt documents read-only for Select only) | None | Looks and reads as read-only, not disabled: still focusable, value can be selected and copied, announced as read-only. |
| 8 | No-results state | Search or filters match nothing | None | Originators spec; Mobius account management **[Context]** | Replaces the table rows with the No results message (CU-00-02 States). Filter bar and chips stay. |
| 9 | Disabled action with explanation | Own-account and last-Administrator rules disable some actions | Button disabled state; Tooltip | None | Disabled control keeps its Tooltip, which gives the reason (see copy in CU-00-02 and CU-02). The reason is also its accessible description. |

## CU-00-01 · Account Management, choose account type
Account Management's base page. Lets the user choose between Mobius accounts and Configuration Hub accounts, and explains that they're separate.

No Figma frame. Lo-fi reference: stakeholder canvas frame A2.

### Page header
- Breadcrumb: "Account Management" (single crumb, current page). See Shell overrides.
- Heading (level 1): "Account Management"
- Description: "Choose which accounts you want to view and manage."
- Document title: "Account Management | Configuration Hub" (prefixed "[Test] " in Test, as the shell).

### Separate accounts note
Text below the description: "Mobius and Configuration Hub use separate accounts. Someone who needs both will need an account for each." **[Decision]** Andrej, 26 Oct 2026.

### Cards
Two cards side by side, equal width, aligned to the start of the content area, in this order:

| Card title | Description | Action | Goes to |
|---|---|---|---|
| "Mobius accounts" | "Add and manage accounts for signing in to Mobius." | "Open" (accessible name "Open Mobius accounts") | CU-00-03 |
| "Configuration Hub accounts" | "Add and manage accounts for signing in to Configuration Hub." | "Open" (accessible name "Open Configuration Hub accounts") | CU-00-02 |

Card width matches the `CH-SHELL` app cards. **[Assumption]** Descriptions follow the `CH-SHELL` card copy rules (both under 65 characters).

### States
Only one state. Both cards always show.

## CU-00-02 · Configuration Hub accounts, populated
Lets the user see, find, add, edit and delete Configuration Hub accounts.

Layout reference: Figma Mobius Users frame (`7587:166787`). Differences are listed in Known screenshot differences.

### Page header
- Breadcrumb: "Account Management > Configuration Hub accounts". "Account Management" links to CU-00-01.
- Heading (level 1): "Configuration Hub accounts"
- Description: "View, add and manage who can sign in to Configuration Hub."
- Document title: "Configuration Hub accounts | Account Management | Configuration Hub".

### Summary chips
In order: "Active accounts" (count of Active), "Pending invitations" (count of Pending), "Inactive accounts" (count of Inactive). Seed: 9, 2, 1. No licence chip. **[Assumption]**, Open questions 12.

### Filter bar
In order:
1. Search. Placeholder "Search". Accessible name "Search accounts". Matches First name, Last name, Full name, Username and Email; contains, case-insensitive; results update as the user types.
2. Role (Select). Label "Role". Options "All" (default), "Administrator", "Editor", "Viewer".
3. Status (Select). Label "Status". Options "All" (default), "Active", "Pending", "Inactive".
4. "Clear all filters" (Ghost Button), only while Search has text or a filter isn't "All". Resets all three and moves focus to Search.
5. At the right end: "Add account" (Primary), then More actions (icon-only, Tooltip and accessible name "More actions").

Search and filters combine (all must match).

### Table
Columns in order: selection checkbox, "Full name", "Username", "Email", "Role", "Status", row actions (no visible header; accessible header "Actions").
- **Full name:** Avatar with initials, then the full name. Pending accounts: generic user avatar and "Not set yet" (Gap 6).
- **Username:** the username, or "Not set yet" for pending accounts.
- **Email, Role:** plain text.
- **Status:** Tag with the status label.
- **Row actions:** View, Edit, Delete. Accessible names "View {Full name}", "Edit {Full name}", "Delete {Full name}"; for pending accounts use the email in place of the full name. Tooltips "View", "Edit", "Delete".

### Behaviour
- **Sorting:** every column except selection and actions sorts. Default Full name, A to Z. Selecting a header sorts by that column A to Z; selecting it again sorts Z to A. One sort column at a time. Rows showing "Not set yet" always sort after rows with a value.
- **Truncation:** text that doesn't fit its column truncates with an ellipsis; full text in a Tooltip on hover and in the accessible name (seed row 8).
- **Selection:** as Gap 5. The signed-in user's checkbox is disabled, with accessible name "Select Sophie Marchetti" and the Gap 9 reason "You can't select your own account."
- **More actions menu:** "Edit" is enabled when exactly one row is selected and opens CU-02 (or CU-03 for a pending account). "Delete" is enabled when one or more rows are selected and opens CU-05. With nothing selected, both are disabled.
- **Own account:** the Delete row action for the signed-in user is disabled with the reason "You can't delete your own account."
- **Last Administrator:** while only one active Administrator exists, their Delete row action is disabled with the reason "There must be at least one active administrator." (In the default seed this rule doesn't trigger until James Okonkwo is no longer an active Administrator.)
- **Pagination:** as Gap 2.

### States
| State | Trigger | What the user sees (exact copy) |
|---|---|---|
| Populated | Default seed | As above. "Showing 1–10 of 12". |
| Single account | "Only me" variant | One row. "Showing 1–1 of 1". Page controls disabled. |
| No results | Search or filters match nothing | Heading "No results found", text "Try adjusting your search or filter criteria for a match." **[Context]** |
| Empty | Not reachable | The signed-in user always has a Configuration Hub account, so the list is never empty. |

## CU-00-03 · Mobius accounts (placeholder)
Stands in for the existing Mobius page, which this prototype doesn't rebuild.
- Breadcrumb: "Account Management > Mobius accounts". "Account Management" links to CU-00-01.
- Heading (level 1): "Mobius accounts"
- Text: "This page isn't part of this prototype yet."
- Link: "Back to Account Management", goes to CU-00-01.
- Document title: "Mobius accounts | Account Management | Configuration Hub".

In production this is today's Users page (Figma `7587:166787`), which would be renamed (Open questions 15).

## CU-01 · Add a Configuration Hub account
**Starts from:** CU-00-02.

### Steps
1. User selects "Add account". The Add blade opens (Gap 1). Focus moves to Email.
2. User enters an email and chooses a role.
3. User selects "Send invitation".
4. If valid: the blade closes, focus returns to "Add account", a success Toast shows, the new account appears as Pending with today's date as Invited on, and the Pending invitations chip goes up by one. The row follows the current sort, search and filters (it may be on another page or hidden by filters).
5. If invalid: errors show (see below) and focus moves to the first field with an error.

### Add blade
- Title: "Add Configuration Hub account"
- Intro text: "We'll email them a link to create their account. They'll choose a username and password, and set up multi-factor authentication."
- Fields in order (both required; no required markers, because every field is required, per Buckholt Forms):

| Label | Type | Helper text | Default | Validation (exact copy) |
|---|---|---|---|---|
| "Email" | Text input, email | "We'll only use this to send the invitation. They'll sign in with their username." | Empty | Empty: "Enter an email address." Wrong format: "Enter an email address in the correct format, like name@example.com." Already an Active or Inactive account: "There's already a Configuration Hub account with this email address." Already Pending: "This person has already been invited. You can resend their invitation from their account details." Over 254 characters: "Email address must be 254 characters or fewer." |
| "Role" | Select | Before a choice: "You can change their role later." After a choice: the role's description | First option "Select a role" (not selectable as a value) | Empty: "Select a role." |

- Actions (right-aligned, Primary last): "Cancel" (Secondary), "Send invitation" (Primary).

### Rules
- Email is checked when the field loses focus and again on "Send invitation". Role is checked on "Send invitation". Each field validates on its own.
- Email is compared in lower case, after trimming spaces.
- "Cancel", Close and Escape close the blade without a confirmation and discard what was entered. **[Assumption]** (two fields, low cost to re-enter).
- "Send invitation" is always enabled. Validation explains what's missing.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Invitation sent | "Invitation sent to {email}." | Success |

## CU-02 · Edit an active or inactive account
**Starts from:** CU-00-02.

### Steps
1. User selects Edit on a row, or selects one row and chooses More actions > Edit, or selects "Edit" in the View blade (CU-04).
2. The Edit blade opens with the account's current values. Focus moves to First name.
3. User changes one or more editable fields and selects "Save changes".
4. If valid: the blade closes, focus returns to the control that opened it (or to the row's Edit action if it was opened from the View blade), a success Toast shows, and the row updates.

### Edit blade
- Title: "Edit account"
- Fields in order (the account-creation order **[Decision]** Andrej, 26 Oct 2026):

| Label | Type | Helper text | Validation (exact copy) |
|---|---|---|---|
| "Username" | Read-only Text input (Gap 7) | "Username can't be changed." | None |
| "Email" | Read-only Text input (Gap 7) | "Email can't be changed." | None |
| "First name" | Text input | None | Empty: "Enter a first name." Over 50: "First name must be 50 characters or fewer." |
| "Last name" | Text input | None | Empty: "Enter a last name." Over 50: "Last name must be 50 characters or fewer." |
| "Role" | Select | The selected role's description | None (always has a value) |

- Password and MFA are never shown. Resetting them is out of scope.
- Actions (right-aligned, Primary last): "Cancel" (Secondary), "Save changes" (Primary).

### Rules
- "Save changes" is disabled until a value differs from the saved value. **[Assumption]**
- Own account: Role is read-only, with helper text "You can't change your own role."
- Last active Administrator: Role is read-only, with helper text "There must be at least one active administrator."
- Changing First or Last name updates Full name and initials in the table.
- Cancel, Close or Escape with unsaved changes opens the Discard changes Modal. Without changes, the blade just closes.

### Discard changes (Modal)
- Title: "Discard your changes?"
- Body: "You've made changes that haven't been saved. If you leave now, they'll be lost."
- Actions (right-aligned, Primary last): "Keep editing" (Secondary), "Discard changes" (Primary).
- "Keep editing", Escape and the close control return to the blade with the changes intact and focus on the control that opened the Modal.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Changes saved | "Changes saved for {Full name}." | Success |

## CU-03 · Edit a pending account
**Starts from:** CU-00-02, on a Pending row.

### Edit blade (pending)
- Title: "Edit account"
- Text: "Invitation sent on {Invited on}. Their username and name will show here once they've created their account."
- Fields in order: "Email" (read-only, helper "Email can't be changed."), "Role" (Select, helper is the selected role's description).
- "Resend invitation" (Secondary Button), below the fields.
- Actions (right-aligned, Primary last): "Cancel" (Secondary), "Save changes" (Primary). Same rules as CU-02.

### Rules
- "Resend invitation" works straight away, without saving other changes. Invited on becomes today's date and the text updates. A success Toast shows. **[Assumption]**, Open questions 7.
- Changing the role of a pending account changes the role it will have once created.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| Invitation resent | "Invitation sent again to {email}." | Success |
| Changes saved | "Changes saved for {email}." | Success |

## CU-04 · View an account
**Starts from:** CU-00-02.

### View blade
- Title: the Full name (pending accounts: the email).
- Key-value pairs in order: "Username", "Email", "First name", "Last name", "Role", "Status". For pending accounts: "Email", "Role", "Status", "Invited on".
- Actions (right-aligned, Primary last): "Close" (Secondary), "Edit" (Primary, Edit common action). "Edit" replaces the View blade with the Edit blade (CU-02 or CU-03).

## CU-05 · Delete accounts
**Starts from:** CU-00-02, from a row's Delete action or More actions > Delete.

### Delete confirmation (Modal)
| Case | Title | Body |
|---|---|---|
| One Active or Inactive account | "Delete {Full name}'s account?" | "They won't be able to sign in to Configuration Hub. Their Mobius account, if they have one, isn't affected. You can't undo this." |
| One Pending account | "Cancel the invitation for {email}?" | "The link in their invitation will stop working. You can't undo this." |
| More than one account | "Delete {n} accounts?" | "They won't be able to sign in to Configuration Hub, and any pending invitations will be cancelled. Mobius accounts aren't affected. You can't undo this." |

- Actions (right-aligned, Primary last): "Cancel" (Secondary), then "Delete" or, for a single pending account, "Cancel invitation" (Primary, danger treatment).
- Bulk Delete is disabled if the selection would remove the last active Administrator, with the reason "There must be at least one active administrator."

### Rules
- After confirming: the Modal closes, the accounts are removed, chips update, selection clears, and focus moves to the Search field. If the current page is now empty, the previous page shows.
- "Cancel", Escape and the close control close the Modal with no change and return focus to the control that opened it.

### Toasts and feedback
| Event | Message | Type |
|---|---|---|
| One account deleted | "{Full name}'s account deleted." | Success |
| One invitation cancelled | "Invitation for {email} cancelled." | Success |
| Several deleted | "{n} accounts deleted." | Success |

## Accessibility requirements
- All `CH-SHELL` requirements apply.
- **Icon-only controls:** More actions, row actions and the blade Close button each have an accessible name and the documented Tooltip.
- **Table:** column headers are real headers; sortable headers expose the current sort direction; the row checkbox accessible name is "Select {Full name}" (or the email for pending accounts); the header checkbox is "Select all accounts on this page".
- **Blade:** behaves as a dialog with the blade title as its name; focus stays inside while open; Escape closes (with the Discard changes Modal when there are unsaved changes); focus returns to the opener.
- **Forms:** errors are linked to their fields and announced; focus moves to the first field with an error; helper text is linked to its field. Read-only fields are announced as read-only.
- **Live updates:** the "Showing …" count and the no-results message are announced politely when search or filters change. Toasts are announced politely.
- **Disabled actions:** the reason is available as an accessible description, not only in a Tooltip.
- **Colour:** status is always written; selection, errors and disabled states never rely on colour alone.

## Acceptance criteria
- Given the home page, then the second app card is titled "Account Management", reads "Add and manage your Mobius and Configuration Hub accounts." and opens CU-00-01.
- Given CU-00-01, then the breadcrumb is "Account Management", both cards show in order, and the separate accounts note shows.
- Given CU-00-01, when the user opens "Configuration Hub accounts", then CU-00-02 shows 10 rows sorted by Full name A to Z, chips 9, 2 and 1, and "Showing 1–10 of 12".
- Given CU-00-01, when the user opens "Mobius accounts", then CU-00-03 shows the placeholder, and "Back to Account Management" returns to CU-00-01.
- Given CU-00-02 in Live, when the user switches to Test and reopens Configuration Hub accounts, then the same 12 accounts show.
- Given CU-00-02, when the user searches "patel", then only Ravi Patel shows and "Clear all filters" appears.
- Given CU-00-02, when the user searches "zzz", then "No results found" shows with its message and the chips are unchanged.
- Given CU-00-02, when the user sets Status to "Pending", then only the two pending accounts show, each with "Not set yet" in Full name and Username.
- Given CU-00-02, when the user sorts by Full name Z to A, then rows with "Not set yet" are still last.
- Given CU-00-02, when the user selects Clear all filters, then search and filters reset and focus is on Search.
- Given the Add blade, when the user selects "Send invitation" with both fields empty, then both errors show and focus is on Email.
- Given the Add blade, when the user enters "hannah.clarke@northgate-insurance.co.uk", then the "already a Configuration Hub account" error shows.
- Given the Add blade, when the user enters "Daniel.Reyes@northgate-insurance.co.uk ", then the "already been invited" error shows.
- Given a valid email and role, when the user sends the invitation, then the blade closes, the Toast shows, a Pending row exists with today's date, and the Pending invitations chip shows 3.
- Given the Edit blade for Hannah Clarke, then Username and Email are read-only and focusable, no password or MFA field shows, and "Save changes" is disabled.
- Given the Edit blade, when the user changes Last name and saves, then the table row and initials update and the Toast shows.
- Given unsaved changes in the Edit blade, when the user presses Escape, then the Discard changes Modal opens; "Keep editing" keeps the changes.
- Given the Edit blade for Sophie Marchetti, then Role is read-only with "You can't change your own role."
- Given CU-00-02, then Sophie Marchetti's Delete action and checkbox are disabled with their reasons.
- Given James Okonkwo's role is changed to Editor, then Sophie Marchetti is the last active Administrator and the last-Administrator rule applies.
- Given a pending row, when the user opens Edit and selects "Resend invitation", then Invited on becomes today and the "Invitation sent again" Toast shows.
- Given one pending row, when the user deletes it, then the title is "Cancel the invitation for {email}?" and, after confirming, the row is gone and the Pending invitations chip goes down by one.
- Given three selected rows, when the user chooses More actions > Delete and confirms, then "3 accounts deleted." shows, the selection clears and focus is on Search.
- Given the Add or Edit blade has changed values, when the user switches environment, then the `CH-SHELL` unsaved changes Modal shows; confirming lands on CU-00-01.
- Given any blade closes, then focus returns to the control that opened it.

## Open questions
| # | Question | Owner | Blocks build? |
|---|---|---|---|
| 1 | ~~Username format~~ Closed: chosen by the person at account creation; differs from email; used to sign in. Andrej, 26 Oct 2026. | | |
| 2 | ~~Account-creation fields~~ Closed: Username, Email, First name, Last name, password, MFA. Andrej, 26 Oct 2026. | | |
| 3 | ~~Breadcrumb and title of the Mobius page~~ Replaced by 15. | | |
| 4 | ~~App card description~~ Closed: "Add and manage your Mobius and Configuration Hub accounts." Andrej, 26 Oct 2026. | | |
| 5 | ~~Blade or Modal~~ Closed: blade. Andrej, 26 Oct 2026. | | |
| 6 | ~~Organisation or environment~~ Closed: organisation. Andrej, 26 Oct 2026. | | |
| 7 | Do invitation links expire, after how long, and is resending in scope for the first release? | Technical lead / PM | No. Assumption: resend included, expiry not shown. |
| 8 | Can admins deactivate and reactivate Configuration Hub accounts, as in Mobius? | PM | No. Out of scope here. |
| 9 | Until roles and permissions exist, who can manage Configuration Hub accounts? | PM / roles discovery | No |
| 10 | Should Open GI staff with access to a client's Configuration Hub appear in this list, as they do for Mobius? | PM | No. Out of scope here. |
| 11 | ~~Separate accounts note~~ Closed: approved. Andrej, 26 Oct 2026. | | |
| 12 | Is there a limit or licence on Configuration Hub accounts? Should pending invitations count anywhere besides their own chip? | PM | No. Assumption: no limit; three chips. |
| 13 | Are the last-Administrator and own-account rules correct? | PM / roles discovery | No |
| 14 | ~~"Accounts" terminology~~ Closed: keep "Account Management" and "accounts" until feedback shows a change is needed. Known overlap with the "Accounts" access level and the Accounts suite. Andrej, 26 Oct 2026. | | |
| 15 | ~~Production rename of the Mobius page~~ Closed: Andrej will raise it with the team; handled through normal delivery. The prototype uses a placeholder. Andrej, 26 Oct 2026. | | |
| 16 | ~~Environment switch on the accounts pages~~ Closed: follow the shell (return to CU-00-01). Andrej, 26 Oct 2026. | | |

## Known screenshot differences
| Screens | Screenshot shows | Build this instead |
|---|---|---|
| CU-00-02 vs Figma `7587:166787` | Title "Users", breadcrumb "User Management > Users" | Title "Configuration Hub accounts", breadcrumb "Account Management > Configuration Hub accounts" |
| CU-00-02 vs Figma | Chips: Total Mobius licences, Active users, Inactive users, Open GI users, SSO users | Chips: Active accounts, Pending invitations, Inactive accounts |
| CU-00-02 vs Figma | Filters: Access level, Access to, Account type, Status | Filters: Role, Status |
| CU-00-02 vs Figma | Columns: Access level, Access to, Account type | Column: Role |
| CU-00-02 vs Figma | "Add user" button | "Add account" |
| CU-00-02 vs Figma | Open GI staff with the Open GI avatar | No Open GI staff |
| Home (shell) | App card "User Management", "Add and manage your Mobius users and what they can access." | "Account Management", "Add and manage your Mobius and Configuration Hub accounts." (Shell overrides) |
| CU-00-01, blades | No Figma frames | Build from this spec |

## Changes from legacy
| Area | Legacy | New |
|---|---|---|
| Creating Configuration Hub accounts | Client raises a request; Open GI developers create the account through a pipeline and send credentials | Client invites the person by email from Account Management; the person creates their own account, username, password and MFA |
| Seeing who has access | Clients can't see a list of Configuration Hub accounts | Clients see every Configuration Hub account, with role and status |
| Access level | Every Configuration Hub account can reach every app | Each account has a role (placeholder until roles and permissions are designed) |
| App name | User Management | Account Management |

## Screen index
| Screen ID | Figma frame / file |
|---|---|
| CU-00-01 | No frame (canvas lo-fi A2 as reference) |
| CU-00-02 | Layout reference: User Management file, "Mobius Users" `7587:166787` |
| CU-00-03 | No frame (shell placeholder pattern) |
| CU-01 | No frame |
| CU-02 | No frame. Field reference: Mobius Edit user (User Management file, page "Edit User") |
| CU-03 | No frame |
| CU-04 | No frame. Reference: Mobius View user (page "View User") |
| CU-05 | No frame. Reference: Mobius Delete user (page "Delete User") |

---

## Readiness checklist (all must pass before handoff)
- [x] Every screen in the index has a section, and every section has a screenshot or an explicit "no frame".
- [x] All copy is final, quoted, and checked against the Tone of Voice guide. *(Approved by Andrej, 26 Oct 2026.)*
- [x] Every interactive element appears in the Buckholt mapping or in Buckholt gaps.
- [x] No HTML, class names, hex values or icon class strings anywhere in the spec.
- [x] Seed data covers empty, single, many and edge cases (long names, max values). *(Empty is unreachable by design.)*
- [x] Every state has defined copy.
- [x] Open questions marked "Blocks build" are resolved or have an agreed assumption. *(None block.)*
- [x] Acceptance criteria cover every flow.
- [x] Checked against the current `buckholt-reference.md` (commit `211e365`, 19 Oct 2026, one week old). Claude Code confirms the Buckholt gaps against the live repo.

## Handoff prompt for Claude Code
> Build the prototype specified in `prototypes/CH-USERS/ch-users-spec.md`, with screenshots in `prototypes/CH-USERS/screenshots/` (export the Figma reference frames listed in the Screen index). Reuse the `CH-SHELL` prototype for the shell; don't copy it into this folder, and apply the overrides in "Shell overrides" only inside this prototype. Follow `AGENTS.md` and its "complete page" reading order. Build every item under "Buckholt gaps" as prototype-local, never in `components/`, and keep Configuration Hub deviations inside Configuration Hub prototypes. Record what you built and every deviation in `PROTOTYPE.md`, and findings for the spec, Figma and Buckholt in `SPEC-CHANGES.md`. Add assertions for the acceptance criteria and run the test suites. Work on a branch and open a PR. Don't commit to main.
