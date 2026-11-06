# Configuration Hub: Product Context

Living reference for the Configuration Hub (CH). Built from Andrej's walkthrough on the UAT/integration environment plus his briefing and Figma designs. Statements marked **[Observed]** come from the UAT build on 15 Oct 2026 and may differ from production. Statements marked **[Andrej]** are from his briefing. **[Figma]** marks target designs not yet released.

**Backlogs in this document** are working notes, not committed tech debt. Converting them into tickets needs agreement with the Associate Product Manager (APM) and Technical Lead (TL). Keep adding to them as findings come up.

**Important: UAT differs from production.** Test tenants are configured differently on purpose (e.g. Onboarding Form stays editable; all users are internal OGI users, so licence counts read 0). Treat UAT observations as indicative, not as production behaviour.

Status: Shell, Onboarding Form, User Management (current + redesign), Third-Party Services, Policy Extensions, Audit Centre, AutoMATE, Webhooks POC (failed to load) covered. Walkthrough complete as of 16 Oct 2026.

---

## 1. Purpose and position

- **[Andrej]** CH lets clients configure, set up, adjust and manage parts of **Mobius**, Open GI's Policy Administration System (PAS).
- **[Andrej]** Much legacy configuration lives in the **Remote Desktop app (RD Apps)**. CH is part of the move to cloud/SaaS. Some CH apps must still work alongside RD Apps during the transition, but the principle is **no dependency on legacy unless unavoidable** (rare).
- **[Andrej]** Andrej is the sole Product Designer for CH.
- **[Andrej]** Open GI works in an **Agile** way: ship MVP solutions, then iterate. Read gaps in in-development apps as later slices, not omissions.
- **Other legacy and adjacent products:** Events/Triggers (E/T, replaced by AutoMATE), Relationship Manager (RD Apps; future home of Policy Extensions), Dynamic Pricing Tool (DPT; source of the Conditional Logic editor).

## 2. End-to-end client journey

1. **[Andrej]** New client agreed; implementation, project management and other teams coordinate.
2. **[Andrej]** Client is given CH access and sees **only the Onboarding Form**.
3. **[Andrej]** Client completes and submits the form with tenant information.
4. **[Andrej]** A tenant is spun up: partly automated, partly developers running pipelines and manual activities.
5. **[Andrej]** Client gains access to the remaining active CH apps (some in-development or hidden apps stay invisible).
6. **[Andrej]** Strategic direction: automate onboarding so Open GI involvement becomes minimal or zero; the Onboarding Form will eventually be rebuilt as part of that.

## 3. App portfolio and ownership

| App | Status | Build team | Client visibility | Tech / design system |
|---|---|---|---|---|
| Onboarding Form | Active; frozen (no updates or fixes planned) | Kinetic Flow | Yes (only app pre-tenant; view-only after tenant exists in production) | React micro-frontend; legacy design |
| User Management | Active; Buckholt redesign in development | Kinetic Flow | Yes | Angular; old ng-table being replaced by Buckholt custom table |
| AutoMATE | Developed, not active | Kinetic Flow | No (feature-flagged) | Angular |
| Third-Party Services | Active | Kinetic Flow | Clients see the app; some services and fields are OGI-only | Angular |
| Audit Centre | In development; ship expected roughly late Nov to early Dec 2026 | Kinetic Flow | No (yet) | Angular; shared CH table component |
| Webhooks POC | Proof of concept | Kinetic Flow | No | Angular; legacy design |
| Policy Extensions | Active; likely to be hidden (clients off-boarding); future home in Relationship Manager | Former Alpha team (merged after restructuring); designed by Andrej | Yes | Angular; does not use Kinetic Flow shared components |

## 4. Connected products and teams (outside CH)

- **Mobius**: the PAS; linked from the CH header.
- **RD Apps / RemoteApps & Desktops**: legacy desktop apps, accessed via RD Web Access portal. Current Mobius roles are inherited from RD Apps.
- **Ratings** **[Andrej]**: separate product outside CH and Mobius, used to adjust Mobius configuration. CH can create a Ratings user (feature flag `createRatingsUser`) and grant Ratings access with a Ratings Access Level. Connection settings in Third-Party Services (OGI users only).
- **Developer Portal (APIM)**: Azure API Management portal exposing Mobius APIs.
- **Replica Database**: read replica of the tenant database.
- **Finance and contracting team** **[Andrej]**: handles third-party service access requests (see section 8).

## 5. Shell (global frame)

### Current **[Observed]**
- **URL:** configurationhub.integration.ogi-mobius.com (UAT/integration).
- **Authentication:** Azure AD B2C. Shell uses user flow `b2c_1_signin_new`; the Onboarding Form remote uses the older `b2c_1_signin` flow.
- **Header:** OGI logo + "Configuration Hub" | tenant selector | "Open GI" (organisation label) | "Mobius" external link | avatar menu.
- **Tenant selector:** format `<Organisation> - <Tenant code>` (e.g. Open GI - ZZ09, GreenLight - BR01). Open GI staff accounts can switch across tenants.
- **Avatar menu:** user name and email, **Release Notes**, **Logout**. Shell tracks unread release notes.
- **Breadcrumbs:** "Applications" on home; `App > Section > Item` inside apps.
- **Home:** card grid, one card per app: illustration, title, one-line description, "Open" button.
- **App visibility:** per-tenant feature flags in Azure App Configuration, named `<flag>-<tenantcode>`: `WebhooksPOC`, `workflowAutomation` (AutoMATE), `createRatingsUser`, `policyExtension`, `auditCentre`.

### Target **[Figma / Andrej]**
- Each client has **Live and Test environments**. Clients see an organisation name with a **Live / Test** toggle.
- OGI users get a **dropdown of all tenants** in place of the toggle.

### Shell observations
- All app cards use an identical "Open" button with no distinguishing accessible name; tenant selector and avatar buttons have no accessible labels.
- Avatar menu user name renders in a fallback serif font.
- Card descriptions inconsistent in tone ("Your friendly neighborhood Webhooks"); check against Brand Language and Tone of Voice guide.

## 6. Onboarding Form **[Observed]**

- **Product decision [Andrej]:** frozen; no updates or fixes planned. To be rebuilt eventually as onboarding is automated. View-only once the tenant exists in production (test tenants deliberately left editable).
- **Architecture:** React app loaded into the Angular shell via Module Federation (`remoteEntry.js` from Azure Blob Storage). APIs under /api/configurationportal/*. Internally named **"Configuration Portal"**.
- **Load:** about 10 to 15 seconds of spinner on UAT; console shows MSAL `no_account_error` and repeated silent-auth reloads.
- **Welcome modal** ("Welcome To Mobius"): autosave, free navigation via steps, Submit at end, support contact, Privacy & Security link.
- **Layout:** vertical 7-step stepper (left), form (right), Back/Next, Submit on the last step.
- **Routes:** /onboarding, /onboarding/businessLinesAndProducts, /brands, /agents, /introducers, /paymentPlans, /accounts.

### Steps and fields
1. **Company Details**: Company Name*, Address*, Postcode*, Email*, Telephone*, FCA Ref, FCA Declarations, Currency* (GBP/EUR); Main contact (Name*, Email, Telephone); Policy Lengths* (multi-select).
2. **Business Lines & Products**: Business Lines (e.g. Open Market Commercial Vehicle, Motor, Motorcycle, Household, Motor Trade); Bespoke Business Lines; Products; Delegated Authority Products.
3. **Brands**: branch or division; at least one required to trade; drives accounts, reporting, user restrictions/access.
4. **Agents**: sub-agents trading on behalf of a Brand.
5. **Introducers**: for accounting or reporting.
6. **Payment Plans**: read-only preconfigured plan (Default Single Payment in full); editable only after onboarding.
7. **Accounts**: Admin fees (New Business, MTA, Renewal; blank = zero); Main Client Money Bank Account; Other Client Money Bank Accounts. Submit.

### Onboarding Form observations (for the future rebuild, not for fixing now)
- Stepper: only label text is clickable; navigation lags.
- Empty optional steps show green "complete" ticks.
- Auth mismatch with the shell causes slow first load.

## 7. User Management

### Current page **[Observed]**
- **Route:** /usermanagement. Angular; old "ng-table".
- **Scope [Andrej]:** creates **Mobius users only**. CH users are created manually today.
- **Summary bar** (info tooltips explain each count and its calculation): Total Mobius licences (x/50), Active users, Inactive users, SSO users, Internal tenant users, Internal SSO users.
- **Toolbar:** Search, Add (primary), Edit, Delete (bulk actions on checked rows).
- **Table columns:** Full Name, Username, Email, Access Level, Access To, Account Type, Status, row actions (view, edit, delete). Per-column filters in the header.

### Redesign **[Figma, in development]**
- **Page header:** breadcrumb "User Management > Users"; title "Users"; description "View, add and manage user accounts and access."
- **Summary:** key-value chips with icons: Total Mobius licences, Active users, Inactive users, Open GI users, SSO users.
- **Filter bar** above the table: Search (matches across all fields; replaces per-column Full name, Username and Email filters), Access level, Access to (multi-select chips), Account type, Status. Defaults, selection and reset behaviour unchanged. "Clear all filters" ghost button appears when filters are active (existing CH component).
- **Actions:** "Add user" primary button; ellipsis (...) menu with Edit (one selected user only) and Delete (multi-delete supported). Row actions view, edit, delete for single items. **Multi-edit** was planned but pushed far down the roadmap.
- **Table:** Buckholt custom table (shared CH component, also used in Audit Centre); avatar initials before names; Open GI users shown with the Open GI avatar (provided by the shared component); all columns sortable; status pills Active / Pending / Inactive; truncated text shows a hover tooltip; Access to shows a single app name or "N applications" (conscious choice).
- **States:** Empty ("Add your first user", illustration, Add user CTA); No results ("No results found", "Try adjusting your search or filter criteria for a match").

### Internal Open GI users in client tenants **[Andrej]**
- Visible to clients; clients cannot edit or deactivate them but can submit a removal request.
- Open GI removes its users after a period of inactivity or when the OGI user reports the task (e.g. tenant-specific bug fix) is complete.
- Identified by an Open GI avatar, not a badge.
- Excluded from licence counts and from client user counts.

### Domain model
- **Account Type:** `Tenant` (credential login; username `first.last@<tenant>.tenant.<env>.ogi-mobius.com`) or `SSO` (external provider). One person can have both.
- **OGI User** flag: marks internal Open GI staff; also controls visibility of OGI-only fields across CH.
- **Access Level:** Administrator, Read Only, Advisor, B2B PAS (correct name; the live UI currently says "B2B PAS Users"); inherited from RD Apps roles.
- **Access To:** RemoteApps & Desktops ("RD Applications" in table), Replica Database, Ratings (+ Ratings Access Level), Developer Portal (APIM).
- **Status:** Active / Inactive (current); Pending (redesign). Only active users count toward Mobius licences.

### User drawer (View / Add / Edit) **[Observed]**
1. **Account Settings**: Account Type, OGI User, First/Last Name*, Email* (immutable), Username* (auto-generated, permanent), Display Name*, Access Level*; Status, Reset Password, Reset MFA; Account Access toggles.
2. **B2B Settings**: Brand, Agent.
3. **Restrictions**: Discount Limit %, Deposit Lower %, Deposit Higher %, Variance Limit £, Commission Edit Limit %, Claim Limit £, Write off in Rec. Limit £. 0 believed to mean "no limit"; semantics need Product.
- **Add flow:** Account Type first; other tabs disabled until chosen. Creation can take up to 20 minutes.

### User Management backlog
- Hide Reset Password / Reset MFA in Add mode.
- Unify naming: "RemoteApps & Desktops" vs "RD Applications"; "Single Sign On (SSO)" vs "SSO".
- Rename access level "B2B PAS Users" to "B2B PAS".
- Define how **Pending** users are counted (summary chips and licences).
- Restrictions: define blank / 0 / max semantics per field (percentage vs £ fields); consider the explicit "A value of 0 is no limit" helper text used in Policy Extensions. Needs Product.
- Verify after redesign release: accessibility of row actions, checkboxes and status icons.

### Upcoming features (discovery) **[Andrej]**
- **CH user creation** in User Management (currently manual).
- **New roles and permissions model**: first for CH, later likely reworking Mobius roles. Details to be imported from Andrej's ChatGPT history.

## 8. Third-Party Services

- **Routes [Observed]:** /thirdparty/services (list); /thirdparty/services/<service>/<provider> (config page). Breadcrumb `Third-Party Services > Services > <Service - Provider>`.
- **List page:** filter chips **All / Active / Inactive / Request Pending**. Card per service: name, last edited, edited by, status badge.
- **Config page pattern:** header with service-provider name, Terms & Conditions link, Active toggle, Save; Settings section; Terms and Conditions block (activation = acceptance).

### Business model **[Andrej]**
- For some services Open GI is the **middle-man**: Open GI holds the agreement with the provider and supplies the service to clients. Credentials and settings for these are OGI property and shown only to users with the OGI flag.
- Other services can use client-owned credentials (e.g. SendGrid Custom, custom SMS account).
- **Request Access flow:** certain services require a contract. When a client clicks "Request Access", a Jira ticket is raised automatically for the **finance and contracting team**, who create a contract; the client must sign it before access is granted. Status shows as **Request Pending** meanwhile.
- Which services and fields are client-visible vs OGI-only is being defined by Product (open).

### Services on ZZ09 **[Observed]**
| Service | Provider (route) | Configuration observed |
|---|---|---|
| AI - Open GI (Notes Summary) | `opengiai/matilda` | No settings; Inactive |
| Bank Account Validation | Unified | Login, PIN (masked) |
| Email | SendGrid | Custom vs Open GI credentials, API key, Default Email Sender, Allowed email domains, DNS records banner |
| Payment Service Provider | Realex (Global Payments) | Merchants; link Parameter groups to a merchant (impacts all associated brands) |
| Postcode Lookup | Ogi | Broker ref, licence key, licence type, Postcode search, Postcode search web |
| Premium Finance | Provider selection: Close Brothers, Premium Credit | Multi-provider service |
| Ratings | Ratings | OGI users only: Caller Id, Broker Password, Endpoint (UAT/Live) |
| Sanctions Check | (single) | Licence key (masked, OGI-only marker), List Region (UK/US), Thresholds UK/US |
| SMS | EagleEye | Default Open GI credentials; switch to custom SMS account cannot revert to Open GI credentials (service can still be deactivated) |
| Vehicle Lookup | CarWeb | Estimated Value auto-populate (Yes/No); Version control (OGI only): current version, Override CarWeb version |

### Third-Party Services backlog
- **Security:** Ratings "Broker Password" is a plain text input; mask it like other secrets.
- Align the OGI-only field marker ("$" symbol for developers) consistently across all OGI-only fields; it currently renders visibly next to labels.
- Date format consistency on the list (`dd/mm/yyyy` vs `d.m.yyyy`).
- Structural and UX alignment across service pages: naming ("Service - Provider", casing "Carweb"/"CarWeb", "OpenGI"/"Open GI"), presence of T&Cs link and Active toggle, internal codename "matilda" in URL.
- Future: make multi-provider services (Premium Finance) distinguishable on the list.
- Future: confirmation step when switching SMS to a custom account (cannot revert to Open GI credentials).
- Intentional, no action: SendGrid DNS records banner persists after verification.

## 9. Policy Extensions **[Observed]**

- **Ownership [Andrej]:** designed by Andrej; built by the former Alpha team.
- **Purpose:** let clients extend in-force policies (add cover time) per scheme, with controlled durations and premium calculation.
- **Routes:** /policyextension (root) > /policyextension/schemes (list) > /policyextension/schemes/<schemeId> (scheme settings).

### Schemes list ("Your schemes")
- Description: "Manage schemes for all lines of business. Edit extension settings, review details, and keep configurations up to date."
- Search, **Line of Business** filter, **+ Add scheme** primary button.
- Table columns (sortable): Scheme Name, Policy Extension Status (Active/Inactive), Extensions Applied, Policy Lengths, Payment Calculation Type, Last Modified; row actions Edit scheme, Delete scheme (properly labelled for assistive tech).
- Pagination as elsewhere (ZZ09: 20 schemes).

### Add scheme (modal)
- "Choose a Line of Business, then add the scheme you want to configure for policy extensions."
- Fields: Line of Business*, Scheme* (dependent dropdown); Add button; close (x).
- Schemes come from Mobius; CH adds them to Policy Extensions configuration, it does not create schemes.

### Scheme settings page
- Sticky header with scheme name and **Save** (disabled until there are changes); "Return to all schemes" link; title "Scheme settings".
- **Scheme information** (read-only, from Mobius): Line of Business, Scheme, Payment Plans, Policy Lengths.
- **Scheme extension configuration:**
  - **Enable Extensions*** toggle.
  - **Extensions*** list of extension configurations (cards: name, "<duration> - <Daily|Monthly> payment", edit, delete; "Editing" badge while open); "+ Add another". Multiple configurations per scheme.
  - Inline extension editor: **Extension name***, **Extension duration*** (stepper + Days/Months), **Premium calculation type*** (Daily/Monthly) with help text and "More information" expander; inline Cancel / Save.
  - **Maximum number of extensions allowed** (0 = no limit).
  - **Maximum policy duration length** (Days/Months): maximum total cover period for one policy including all past and future extensions (0 = no limit).
- Rule shown in help text: Days are calculated daily; Months can be calculated daily or monthly.

### Context and future **[Andrej]**
- Built by Alpha, which did not use Kinetic Flow's shared-component approach, so patterns differ from the rest of CH.
- **Likely to be hidden:** the clients using it have left or are off-boarding. The functionality is expected to move into a larger app migrated from RD Apps, **Relationship Manager** (discovery not yet started).
- **Two-level save is intentional:** inline Save stores changes to one extension; page Save commits all changes. Gives flexibility and reduces the risk of saving the wrong thing in one go.

### Policy Extensions backlog (low priority given likely retirement; reuse as input for Relationship Manager discovery)
- **Probable bug:** list shows "None applied" for Extensions Applied, Policy Lengths and Payment Calculation Type on every scheme, even where the scheme has extensions configured. What the columns should show to be defined in a Tech Debt ticket.
- **Validation:** block Days duration combined with Monthly premium calculation (existing "Testing" record likely predates the rule).
- **Validation:** enforce a proper Extension name (records named "Unnamed Extension" exist despite the required marker).
- Two-level save: make unsaved state explicit (e.g. unsaved-changes indicator on edited cards, guard when leaving the page).
- Copy: "1 days" pluralisation; "Not set" vs "Not Set".
- Status as plain text instead of the pills used elsewhere.
- Add scheme modal: add a Cancel button (only x today); confirm Add is disabled until both fields are set.
- Positive patterns to reuse elsewhere: explicit "A value of 0 is no limit" helper text; labelled icon buttons; Save disabled until dirty.

## 10. Audit Centre **[Observed, in development]**

- **Status [Andrej]:** being built now; expected to ship in about 4 to 6 weeks from 15 Oct 2026. Gaps below may simply be unfinished work.
- **Purpose:** "View changes made across Configuration Hub applications": what changed, when and by whom. Chosen over per-app audit pages (an earlier explored option).
- **Route:** /auditcentre. Breadcrumb "Audit Centre"; title and description; tabs per source app (currently only **User Management**).
- **Record type** control (top right): **Grouped** / **Individual**. Grouped collapses bulk actions into one row (e.g. "Users deleted - 3 users").
- **Table** (shared CH table component): Action, Affected user (avatar + name; group avatar with count, e.g. "3U"), Change summary, Changed by (avatar + name), Date and time (default sort, newest first); row action "View audit details". All columns sortable. Pagination as elsewhere (ZZ09: 106 records).
- **Open GI users** render with the `ogi-user-avatar` component (ring style).
- **Action types seen:** User created, User deleted, Users deleted, User profile updated, Application access changed.
- **Change summary examples:** "Tenant account", "SSO account", "Display name: old → new", "Replica Database: Granted", "3 users deleted".
- **Audit Details drawer:** title = action; **Event information** (User, Changed by + "Open GI" tag, Date and time, Event ID); **Change details** table (Setting / Previous value / New value, or Setting / Action for deletions); Close.

### Target design **[Figma]**
- Breadcrumb reflects the selected tab ("Audit Centre > User Management").
- **Tabs at MVP:** User Management, AutoMATE, Third-Party Services; further apps added as they launch or are switched on (possibly Policy Extensions). **Onboarding Form deliberately excluded.**
- **Filter bar** (filters change per tab; User Management shown): Search, Date (default "Last 30 days"), Action type (multi-select), Changed by; Record type: Grouped / Individual at the right.
- **Action types (User Management):** Access level changed, Application access changed, User deactivated, User activated, Restriction settings changed, User created, User deleted, User updated, B2B Settings changed.
- **Change summary patterns:** "Old → New" (e.g. "Advisor → Administrator", "Brand → Krypton"), "<App>: Granted / Removed", "N settings changed", "N settings changed across N sections", "Account activated / deactivated".
- **Single delete [Figma]:** row "User deleted"; drawer Event information (User, Changed by, Date and time, Event ID) plus **Deleted account details** card: avatar, name, Username, Email, Account type, Access level (snapshot of the deleted account).
- **Bulk delete [Figma]:** row "Users deleted", stacked avatars with "+N" and "Multiple users", summary "N users deleted"; drawer Event information shows **Affected users: N** instead of User; Deleted account details lists one card per deleted user (scrollable).
- Story for these delete patterns not yet picked up (current UAT uses a placeholder).
- **MVP scope [Andrej]:** search and filters in; custom date range and **export planned for later slices**.
- **Retention [Andrej]:** Legal and Compliance: no fixed regulation; suggested minimum 12 months; actual period depends on client needs. Decision sits with Product / leadership.

### Design decisions **[Andrej]**
- Open GI users: table uses the Open GI avatar (empty-ring style is final, approved with the design system designer); the Event information panel uses an "Open GI" text tag because that panel shows no avatars (approved).
- Truncated text in tables shows a tooltip on hover.

### Audit Centre backlog (future slices)
- Deleted account details: also snapshot **Access to** (app access at time of deletion), not only Access level.
- Bulk delete drawer at scale (e.g. 100+ users): search within the list or progressive loading ("Show more").
- Custom date range filter; export.
- Figma single-delete card shows Username and Email values swapped relative to User Management (developers aware).

### Audit Centre status notes (15 Oct 2026, UAT)
- Grouped bulk delete details currently show only "3 users deleted": placeholder table; proper single/bulk delete pattern pending story pickup.
- Record type toggle temporarily broken (worked before; active development).
- "Changed by" name variants come from developer test accounts, not a product issue.
- Date and time has no truncation tooltip: to be fixed by developers.
- Sort buttons lack accessible names: Andrej raising at stand-up (also seen in other CH areas).
- In progress by developers: Escape to close drawer; "Removed" wording for never-granted access.
- Positive: labelled "View audit details" buttons, labelled pagination buttons, before/after change table, Event ID for support traceability.

## 11. AutoMATE **[Observed]**

- **Status [Andrej]:** developed, not yet active for clients (feature flag `workflowAutomation`). Replaces legacy **Events & Triggers** in the PAS. Andrej led end-to-end design (research, SME and client interviews, concepts, usability testing, development support).
- **Routes:** /workflowautomation/workflows (manage page) > /workflowautomation/workflows/workflowbuilder/<id> (builder).
- **App-level header navigation:** "Workflows" link next to the CH logo (only app using in-header nav today).

### Workflows (manage page)
- Title "Workflows", **+ Create new** primary button; result count ("11 of 11 results"); Sort (default "Last modified (newest first)").
- **Left filter panel:** Search workflows; Status chips (Active / Inactive / Incomplete); Trigger, Brand, Line of Business, Scheme, Action Type, Last Modified By (default "Anyone").
- **Workflow cards:** trigger-type icon, name, last modified by/on, status badge + Active toggle, "..." menu; key-value strip: Trigger, Brand, Line of business, Scheme.
- **Triggers seen:** Output Document Requested, Renewal Invitation, MTA - Additional Premium Quote, Quote Saved, NB Quote Accepted, NB - Discount Applied.

### Workflow Builder
- Header: editable workflow name (pencil), Active toggle, **Save changes** (primary), "..." menu (Create copy, Delete).
- **Canvas:** vertical, linear chain of numbered nodes on a dotted grid: 1. **Trigger** (triangle icon), 2. **Target level** (circle; e.g. "All brands - All products - All schemes"), then **Actions** (diamond icons) with "+" insertion points between nodes and a per-node "..." menu.
- **Action Details & Settings drawer** (Settings / Conditional Logic tabs):
  - Settings: Action details (Name*, Description); Action settings: Action type* (e.g. Diary); for Diary: Entry / Completion / Log Entry; Diary creation type (New / After existing is expired); Existing diary action type; diary status (Indefinite / Complete when processed); deadline (due days, hours, minutes; sets the Action Date, expiry the day after); assignee (System / Broker).
  - Conditional Logic: Logic name*, Description; expression builder ("Check if" + menu: "(", Exists, Does not exist, All, Other Functions); hint "hit Space Bar if it's hidden".
- **Rules [Andrej, from earlier design work]:** trigger and target mandatory; actions include Diary, Document, Email, Log event, plus conditional logic, scheduling and portal actions; Save persists an inactive flow; activation publishes only when valid; only one active flow per event/target combination; copies gain a suffix; delete needs confirmation; diary edits warn about downstream dependencies and linked diaries cannot be deleted.
- **Workato [Andrej]:** access needs no separate login after CH and is managed through CH User Management.

### Product decisions and context **[Andrej]**
- **Legacy problem being solved:** in Events/Triggers (E/T) a flow could not be saved incomplete or edited; the only way to change it was to delete and rebuild (clients sketched flows on paper first; flows became unmaintainable when their author left).
- **Incomplete status:** a flow with errors, missing fields, an invalid setup, or the same brand + trigger setup as another live flow. It can be saved but **cannot be switched on** until all issues are resolved. Lets users pause, ask colleagues and return without losing work. This is why Save is always available in AutoMATE (flexibility differs per app by design).
- **Conditional Logic editor:** final for now. Taken from Open GI's **Dynamic Pricing Tool (DPT)**; it is a licensed third-party tool that Open GI forked and maintains. Product chose it over a custom builder; DPT clients will recognise it. Acknowledged as developer-oriented.
- **Default names allowed** ("Untitled flow") at clients' request; in usability testing with 11 to 12 clients, all named their flows before launching. UAT names are developer test data.
- **Header navigation:** AutoMATE will gain more features beyond the workflow builder; the "Workflows" header link groups the manage page and builder, with more links to come. Single-journey apps have no header nav.
- **Rollout:** all new clients get AutoMATE; existing clients will be migrated from E/T to AutoMATE with Open GI support. Go-live date not set.

### AutoMATE backlog
- Conditional Logic tab spinner overlaps the panel edge while loading.
- Possible future mitigations for the DPT logic editor: preset condition templates, inline examples and help, usability check with clients who have not used DPT.
- Cards show both a status pill and a toggle: **intentional [Andrej]**; the pill is informational and accessible, the toggle lets users switch flows on/off from the manage page without opening the builder. No action.

## 12. Webhooks POC **[Observed]**

- **Status [Andrej]:** proof of concept, hidden from clients (feature flag `WebhooksPOC`); legacy design. Loaded as a separate micro-frontend (`stconfighubintuks.blob.core.windows.net/webhooks/remoteEntry.js`).
- **UAT 16 Oct 2026: does not open.** Clicking "Open" does nothing. Console: Module Federation shared-dependency mismatch (shell provides `@azure/msal-angular` 3.0.21; the Webhooks remote requires ^3.0.23), followed by a module initialisation error.
- **Shell-level finding (affects every app):** when a micro-frontend fails to load, the shell shows no error, message or retry; the user is left on the home page with no feedback. A generic "This application could not be loaded" state with retry and support contact would cover all apps.

- **Context [Andrej]:** the POC was built in a short multi-day workshop reusing Andrej's early AutoMATE builder concepts (before AutoMATE development began), so it follows a similar builder pattern.
- **Roadmap [Andrej]:** Webhooks has been prioritised by the team's Product Manager to be developed and shipped soon (timeframe unknown); the POC will be reworked and improved.
- **Action [Andrej]:** raising the shell-level "app failed to load" notification idea at stand-up.

## 13. Release Notes **[Observed]**

- **Origin [Andrej]:** built during an Innovation Sprint (Open GI no longer runs them).
- **Entry points:** avatar menu > Release Notes; **new-release pop-up** on the home page when unread notes exist.
- **Pop-up [Andrej screenshot]:** eyebrow "Release Notes", title "Check out the latest updates!", intro copy, "Features rolled out with this update:" followed by feature chips, close (x), primary "View all release notes".
- **Routes:** /release-notes/<year> (index) > /release-notes/<year>/<month> (details).
- **Index page:** year chips (2026 / 2025 / 2024); left panel "<Year> Releases" listing months; main column "Release notes" title and description ("Keep up to date with the latest product updates and improvements in the Configuration Hub, and what they mean for you."); per month: month heading, "Features rolled out with this update:", feature chips (not interactive), "Read <Month> release notes" link.
- **Details page:** breadcrumb "Release Notes Details"; left panel with "All release notes" back link and in-page Content links; main column "<Year> <Month>" heading, one section per feature (heading, body, bullet lists with bold lead-ins).
- **Scope [Andrej]:** CH release notes cover **CH features only** (the pop-up screenshot used placeholder content from other products).
- **Year / Month grouping is intentional [Andrej]:** a feature finished in one month may be partly released and documented in a later month, so notes are grouped by publication Year/Month, not tied to the build month. The selected year chip provides the year context.
- **Authoring [Andrej]:** written in Azure DevOps at epic/feature level and synced into CH. Multiple APMs write them with no shared copywriting standard, which explains inconsistent casing (e.g. Title Case feature names).
- Feature chips use Buckholt status tags for information; staying as is for the foreseeable future.

### CH release history (from UAT release notes)
| Release | Features |
|---|---|
| Apr 2025 | Third-Party Services app: Vehicle Lookup, Postcode Lookup, AI Notes Summary, Premium Finance, Realex, SMS |
| Jun 2025 | Restrictions and B2B into User Management; SSO into User Management |
| Aug 2025 | In-app Release Notes in CH |
| Sep 2025 | Access recovery: password reset and MFA |
| Oct 2025 | Improving user identity management in CH |
| Nov 2025 | Management of Ratings users within User Management |
| Dec 2025 | Bank Validation configuration |
| Feb 2026 | Sanctions Check configuration (plus a test entry) |

### Release Notes backlog (future TDs; not part of TD 31507)
- **Inconsistent casing of feature names** ("Management Of Ratings Users Within User Management" vs "test for release notes"). Root cause is authoring in Azure DevOps, so the durable fix is upstream: a short copy standard for APMs (sentence case, max title length, one-line summary pattern), optionally plus normalisation on sync.
- **Breadcrumb** on details is a single "Release Notes Details" label rather than a path (Release Notes > <Year> <Month>).
- **Page layout differs from other CH apps:** title sits in the content column to the right of the year/month panel instead of top-left under the breadcrumb.
- **Casing:** "Release notes" (page title) vs "Release Notes" (menu, breadcrumb).

## 14. Glossary

- **Mobius**: Open GI's cloud Policy Administration System.
- **PAS**: Policy Administration System.
- **RD Apps / RemoteApps & Desktops**: legacy Remote Desktop applications.
- **Tenant**: a client's isolated Mobius environment, identified by a code (e.g. ZZ09). Each client has Live and Test environments.
- **Buckholt**: Open GI's current design system.
- **OGI flag / OGI user**: internal Open GI staff marker; unlocks OGI-only settings.
- **Ratings**: separate product for adjusting Mobius configuration.
- **APIM / Developer Portal**: Azure API Management portal for Mobius APIs.
- **Brand**: branch or division of the client; required to trade.
- **Agent**: sub-agent trading on behalf of a Brand.
- **Introducer**: third party recorded for accounting or reporting.
- **Business Line / Line of Business**: line of business traded; bespoke lines can be added.
- **Scheme**: insurer product configuration within a Line of Business in Mobius.
- **Policy extension**: additional cover period added to an existing policy, configured per scheme.
- **Delegated Authority Product**: client-defined product outside the standard list.
- **Parameter group**: set of agent parameters linked to brands; used e.g. to link payment merchants.
- **Request Pending**: third-party service awaiting contract via finance and contracting.
- **Tenant user vs SSO user**: credential-based tenant account vs externally authenticated account.
- **Kinetic Flow**: Andrej's main development team.

## 15. Open questions


- AutoMATE: go-live date.
- Audit Centre: retention period per client (Product / leadership decision; minimum 12 months suggested by Legal and Compliance).
- Third-Party Services: final client-visible vs OGI-only split (Product working on it).
