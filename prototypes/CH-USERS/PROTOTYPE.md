# CH-USERS — Configuration Hub users prototype

> **Not Buckholt.** Application work built *with* Buckholt. Nothing here is
> design-system guidance; see [`../README.md`](../README.md).

Built from [`ch-users-spec.md`](ch-users-spec.md) **revision 5** (27 Oct
2026) and the five Figma reference frames in [`screenshots/`](screenshots/).
First built on 26 Oct 2026 against revision 3. Updated to revision 5 on 27
Oct 2026 (see "Revision 5" below).

Built against the CH-SHELL prototype on `main`. The spec cites CH-SHELL
revision 7, which does not exist yet: `main` has revision 5, and revision 6
changed only wording (SPEC-CHANGES A2).

## Revision 5

Revisions 4 and 5 are handled together; revision 4 was never built.

| Spec change | Built as |
|---|---|
| **Name back to User Management.** "Mobius users", "Configuration Hub users", and "user" for the thing being managed | Every page, title, crumb, label, message and Toast; the copy is exactly the spec's. The page files were renamed too: `accounts.html` / `accounts.js` became `users.html` / `users.js`. "Account" stays only where the spec keeps it: "You can't select your own account.", "You can't delete your own account.", "create their account", and the separate accounts sentences. AC 29 scans every rendered page, blade and Modal, and the source, for the three revision 3 names |
| **App card.** Name "User Management" (no longer an override); description "Add and manage your Mobius and Configuration Hub users." | `ch-users-registry.js` now changes only the description and the base page; the name is the shell's own. The revision 3 width problem is gone: "User Management" fits on one line |
| **CU-00-01 rebuilt from Andrej's frame** (`screenshots/CU-00-01.png`, node `8072:6199`). The whole card is a link with title, description and arrow, plus a footer of status Tags. The description includes the separate accounts sentences | Buckholt's documented Clickable Card, with Buckholt's runtime `.card-footer` holding a documented Tag set. See Gap 10 |
| **Card summary.** Total, then Active, Inactive and Pending, with zero counts hidden. Mobius is static (34, 32, 2, 0); Configuration Hub follows the data | Rendered from the data on each visit. The Configuration Hub card counts what was done on CU-00-02 in the same tab (AC 7) |
| **Status variants.** The table's status Tags use "the same status variants as the card tags" | The table follows the frame's variants: Active success, **Inactive warning** and **Pending the plain tag**. In revision 3 these two were the other way round |
| **Copy elsewhere** (chips "Active users", "Pending users", "Inactive users"; "Add user"; "Add Configuration Hub user"; "Edit user"; "Delete {Full name}?"; "{Full name} deleted."; "{n} users deleted."; the role descriptions; two email errors) | As written in the spec |

**One behaviour changed because of a new criterion.** Revision 3 held users
in memory, so any page change went back to the seed. AC 7 needs the CU-00-01
card to show a new invitation "when the user comes back", which is a page
load. Users are now kept for the browser tab across page changes. A reload
still goes back to the seed, as the spec's State note says (judgement call
24). Every other behaviour is as built for revision 3.

## Open it

| Page | Screen | File |
|---|---|---|
| Home, with the overridden card description | SH-00-01 plus the "Shell overrides" | `home.html` |
| User Management | CU-00-01 | `index.html` (the app's base page) |
| Configuration Hub users | CU-00-02, and CU-01 to CU-05 inside it | `users.html` |
| Mobius users (placeholder) | CU-00-03 | `mobius.html` |

Variants have no visible UI, as in CH-SHELL. Add them to any CH-USERS page:

- `?variant=only-me` gives one user, the signed-in user. `?variant=default` goes back.
- `?seed=long-names` uses the shell's Long names organisation and user. The
  signed-in row becomes Alexandra Montgomery-Fairweather; the other 11 rows stay.

Both choices are kept for the rest of the browser tab, like the shell's seed
and environment. Changes to Configuration Hub users are kept for the tab
across page changes, and dropped on a reload or a change of seed or variant.

## What was built

- **CU-00-01 · User Management.**
  - Breadcrumb: one crumb, "User Management" (shell override).
  - Heading, and a one-paragraph description that includes the separate
    accounts sentences.
  - Two Clickable Cards, "Mobius users" then "Configuration Hub users": side
    by side at 528px each (the frame), equal height, aligned to the start.
    They narrow to 352px before they stack, so they stay side by side at
    1088px and stack below about 800px.
  - Each card: a body with the title (level 2), the description and
    Buckholt's arrow, then a footer with the status Tags.
  - Each card is one link and one tab stop. Its accessible name is the
    title. Its description is the card description plus the summary, for
    example "Add and manage the people who sign in to Configuration Hub. 12
    users, 9 active, 1 inactive, 2 pending."
  - Tags in order: total (info), active (success), inactive (warning),
    pending (plain tag). "1 user" when there is one, and zero counts hidden.
- **CU-00-02 · Configuration Hub users.**
  - Heading, description, and three chips: 9, 2 and 1 in the default seed.
  - Filter bar: Search, Role, Status, "Clear all filters", then "Add user"
    and More actions.
  - Table: selection checkbox, Full name (Avatar + name), Username, Email,
    Role, Status (Tag), and row actions View, Edit and Delete.
  - Pagination: first, previous, page numbers, next and last; "Results per
    page" (10, 25 or 50); "Showing {first}–{last} of {total}".
  - Behaviour:
    - Search matches first, last and full name, username and email.
    - Filters combine with Search.
    - Every column except selection and actions sorts. "Not set yet" always
      sorts last.
    - Changing filters, search or rows per page returns to page 1 and clears
      the selection. Changing sort or page also clears it.
    - Long text truncates with a hover Tooltip. In Proxima Soft only seed
      row 8 truncates.
    - No results replaces the rows; the chips and filter bar stay.
    - The count and the no-results message are announced politely.
- **CU-01 · Add.**
  - A blade titled "Add Configuration Hub user", with Email and Role. The
    Role helper text follows the role chosen.
  - Email is checked on blur and on "Send invitation"; Role on "Send invitation".
  - Email is trimmed and lower-cased before checking.
  - All five email messages and the role message are built.
  - "Cancel", Close and Escape close the blade without asking.
  - After sending: the blade closes, focus returns to "Add user", a Toast
    shows, a Pending row is added with today's date, and the Pending users
    chip goes up.
- **CU-02 · Edit an active or inactive user.**
  - Blade titled "Edit user".
  - Fields: Username and Email read-only (focusable, announced read-only),
    First name, Last name, Role.
  - No password or MFA field.
  - "Save changes" stays disabled until a value differs from the saved one.
  - Role is a read-only Select for the signed-in user, and for the last active
    Administrator. Each case has its own helper text.
  - With unsaved changes, Cancel, Close or Escape opens the Discard changes Modal.
- **CU-03 · Edit a pending user.**
  - The invitation text, read-only Email, Role, and "Resend invitation"
    (Secondary).
  - Resend works straight away and updates the date and the text.
  - Save uses the email in its Toast.
- **CU-04 · View.**
  - Title is the full name (the email for a pending user). Focus moves to it.
  - Key-value pairs in the spec's order.
  - Actions "Close" and "Edit". "Edit" replaces the View blade with the Edit blade.
- **CU-05 · Delete.**
  - One Modal with the three cases of title, body and action:
    - "Delete {Full name}?" for one active or inactive user;
    - "Cancel the invitation for {email}?", with "Cancel invitation", for one
      pending user;
    - "Delete {n} users?" for more than one.
  - Delete is the Primary danger action.
  - After confirming: rows removed, chips updated, selection cleared, focus
    on Search, and the previous page shows if this one is now empty.
  - Bulk Delete is disabled when the selection holds every active Administrator.
- **Rules.**
  - Own user: the row checkbox and Delete action are disabled with their
    reasons, and the role can't be changed.
  - Last active Administrator: Delete is disabled and the role is locked with
    the last-Administrator reason. When both rules apply, the
    last-Administrator reason is shown (judgement call 6).
- **Shell contract.**
  - An open Add or Edit blade with changed values reports unsaved changes.
    Switching environment then shows the shell's Modal.
  - Switching environment always lands on CU-00-01, which is the app's base page.
  - Users are the same in Live and Test.

## How the shell is reused

The brief said to reuse CH-SHELL without copying it, apply the "Shell
overrides" only in this prototype, and **not edit the CH-SHELL folder**
(option B). CH-SHELL's contract expects a feature to edit
`shell/ch-registry.js`, so that edit is replaced by three small pieces here:

| File | What it does |
|---|---|
| `ch-users-registry.js` | Loaded after the shell's `ch-registry.js` and before `ch-shell.js`. It changes the in-memory registry entry for `user-management`: the revision 4 description, and `basePage` set to `../CH-USERS/index.html`. The name is the shell's own, "User Management". Open, and an environment switch inside the app, then follow the override. |
| `ch-users.js` (`CU.init`) | Calls `CHShell.init()`, then points the lockup at `home.html`. Without this the lockup would go to `CH-SHELL/index.html`, which still shows the old description and opens the placeholder page. It also keeps the users for the tab (`CU.loadUsers` / `CU.saveUsers`), and holds the variant, Toast, Tooltip and date helpers. |
| `home.html` | The home entry page with the override applied. The chrome is the shell's own, from `../CH-SHELL/shell/`. Only the card list (about 25 lines) repeats `CH-SHELL/index.html`, because that page renders the shell's own registry and loads no feature script. |

The shell's `ch-shell.js`, `ch-shell.css` and `ch-registry.js` load unchanged
from `../CH-SHELL/shell/`. The shared blade loads unchanged from
`../shared/blade.js` and `blade.css`. Nothing under `prototypes/CH-SHELL/`
or `prototypes/shared/` was edited, in revision 3 or revision 5, so there is
no CH-SHELL change to revert.

**When CH-SHELL's spec takes the new description** (the spec asks for this
in its next revision), make the registry edit there. Then delete
`home.html` and `ch-users-registry.js`, and drop the lockup line from
`CU.init`.

**Known limit of option B.** The shell sends two edge cases to its own home,
`CH-SHELL/index.html`: a direct link to an app hidden in the current
environment, and an environment switch to an environment where the app is
hidden. User Management is visible in every seed, so neither can happen
here.

## Page structure

- Every page uses the shell's Header and Main (`layout-03`, flush). Inside
  Main come the shell's context band, then Page body → Frame →
  `.container-fluid` → Pane → Panel.
- Each page has one Panel with items 32px apart:
  - CU-00-01: the heading block, then the cards.
  - CU-00-02: the heading block, the chips, the filter bar, and the results
    (table plus pagination).
- The blades and Modals sit outside the layout, as Bootstrap places them.

## Buckholt components used

| Component | Where | Notes |
|---|---|---|
| Page layout | Every page | As above |
| Text block, Heading | Headings, descriptions, blade intro, no-results message | `headline-02` level 1 headings, as the shell's placeholder page |
| Card | CU-00-01 | Clickable Card, `a.card.card-clickable > .card-body > .text-block` (`title-03`), exactly as Card's Code & specs. Then `.card-footer` (runtime only; see Gap 10) |
| Tag | CU-00-01 card summaries; table Status | `.tag-set` of tags: `tag-status-info` (total), `tag-status-success` (Active), `tag-status-warning` (Inactive), base `tag` (Pending) |
| Button | Add user, Clear all filters, row actions, pagination, blade and Modal actions | Primary, Secondary, Ghost, danger modifier, icon-only `.btn-icon`, `btn-sm` |
| Key-value pair | Chips; View blade (`.key-value-list.key-value-list-stacked`) | |
| Icon block | Chips | `icon-block-sm` |
| Text input | Search (with `.input-icon`), Email, names, read-only Username and Email | Read-only is Text input's documented `readonly` |
| Select | Role and Status filters, Results per page, Role in the blades | Read-only Role is Select's documented `.readonly` + `disabled` |
| Form | Blade forms | `form.form > .text-block + .form-body`, helper text and `.invalid-feedback` |
| Menu button / Menu | More actions | Overflow variant (`fa-ellipsis-vertical`); `menu-item` with Edit icon; `menu-item-danger` with Delete icon |
| Table | Users | `.table-container > .table-content > table.table`, `.table-gap`, `.table-sort-header` / `.table-sort`, `.table-checkbox-header.col-fit`, `.col-fit.cell-data-right`, `.data-secondary` |
| Checkbox | Row and header selection | Native; indeterminate set from script |
| Avatar | Name cell | `avatar-xs`, `.avatar-initials` or `.avatar-icon` (`fa-user`) for pending |
| Tooltip | Icon-only controls, truncated text, disabled-action reasons | Code & specs example 3 options |
| Modal | Delete, Discard changes; the shell's unsaved-changes Modal | Code & specs example 1 |
| Toast | Every success message | `toast-success` with icon |
| Link | "Back to User Management" | `.link-standalone` |
| Common actions | Add, Edit, Delete, Search | Labels and icons as documented |

## Buckholt gaps

Checked against this repository on 26 Oct 2026 for gaps 1–9, and on 27 Oct
2026 for gap 10: `components/`, `patterns/`, `foundations/`,
`code-specs-html/` and `css/buckholt.css`.

| # | Gap | Repo status | Built as |
|---|---|---|---|
| 1 | Blade | Still a gap. No drawer component, and `buckholt.css` has no `.offcanvas` rule | The shared prototype blade (`../shared/blade.js`, unchanged), placed under the CH top bar (`.cu-blade`). This file adds: the Close Tooltip; Discard changes on Escape, Close, Cancel or a scrim click; focus return to the opener; and pausing the blade's focus trap while a Modal is open over it |
| 2 | Pagination | Still a gap. No pagination class in either the docs or the runtime | `.cu-pagination`: Buttons for the pages in a `nav` named "Pagination", a Select with a top label, and the count |
| 3 | Filter bar | Still a gap | `.cu-filter-bar`: one bottom-aligned flex row |
| 4 | Chip container | Still a gap | `ul.cu-chips` of `.cu-chip` boxes. Each holds an Icon block and a Key-value pair, on a white surface with a Buckholt border |
| 5 | Row selection, bulk actions | **Partly covered.** Table documents the checkbox column (`.table-checkbox-header`, native checkboxes). The selected-row state and bulk actions are not documented | A row tint (`--expressive-pale-overlay`, the value Response button uses for its selected option); header indeterminate state; bulk actions in More actions |
| 6 | Empty cell value | **Partly covered.** Table documents `.data-secondary` | "Not set yet" in `.data-secondary`. The copy rule is the only part still missing |
| 7 | Read-only Text input | **Covered, so dropped.** Text input documents `readonly` in `examples.html` and `rules.md` | Buckholt's own read-only Text input |
| 8 | No-results state | Still a gap | A full-width row with a Text block, `title-02` heading and body |
| 9 | Disabled action with explanation | Still a gap | The disabled control sits in a never-focusable `.cu-disabled` wrapper that carries the hover Tooltip. The reason is also the control's `aria-describedby` |
| 10 | Clickable card with footer | **Mostly covered.** Card documents the Clickable Card (`a.card.card-clickable`, Code & specs and `rules.md`). Its runtime draws everything else the spec asks of the card: the right-arrow icon (`.card-body::after`, `fa-arrow-right`), the 3px bottom border, a hover border, the pointer, and the focus ring on the link. **Not documented:** a card footer. `buckholt.css` has `.card-footer`, with the frame's grey band and 12px / 32px padding, but no Code & specs example shows it | The documented Clickable Card, with `.card-footer > .tag-set` after `.card-body` (runtime class, undocumented composition). Accessibility is local: `aria-labelledby` (title) and `aria-describedby` (description and a visually hidden summary sentence), with the tags `aria-hidden`. Layout is local: `.cu-type-grid` |

None of this is in `components/`. It all lives in this folder:
`ch-users.css`, `users.js`, `ch-users.js` and `index.html`.

## Figma values replaced by Buckholt

The Figma frames (`screenshots/`) decide arrangement. Buckholt decides
styling (spec, Prototype notes). Each difference is listed once:

| Element | Figma | Built |
|---|---|---|
| CU-00-01 card title | Headline 02 (28px semibold) | Card's documented `title-03` (24px) |
| CU-00-01 card arrow | A separate arrow icon, Figma's "Clickable icon" component | The Clickable Card's own arrow (`fa-arrow-right`, `--link-icon`), drawn by the runtime |
| Chips | Grey filled boxes, coloured icons | White surface with a Buckholt border; Icon block's default palette |
| More actions icon | Horizontal ellipsis | Overflow Menu button's documented `fa-ellipsis-vertical` |
| Sort icons | Double caret on every column, one caret on the active column | `fa-sort` from Table's WIP markup; `fa-sort-up` or `fa-sort-down` on the active column |
| Results per page | Inline label left of the Select | Top-aligned label (Buckholt Forms: left-aligned labels are not supported) |
| Pagination buttons | Small boxed group | Buckholt `btn-sm` Ghost buttons; Secondary for the current page |
| Blade | Mobius blue header, 470px wide, Cancel bottom left, Save bottom right | The shared blade's header (the same Mobius blue). 480px wide (`30rem`). Actions right-aligned with Primary last (Forms, side-panel context) |
| Required markers | Red asterisks | None: every field is required, so per Buckholt Forms nothing is marked |
| Delete dialog | "Warning" title, warning icon, "Confirm" | Spec copy; Modal Code & specs; Primary danger action |

The CU-00-01 differences the spec lists as decisions are built as the spec
says, not as the frame shows:

- breadcrumb "User Management", not "Applications";
- the revision 5 card descriptions;
- seed counts on the Configuration Hub card;
- the Northgate shell user.

## Deviations and judgement calls

1. **Option B shell reuse**, as above. `home.html` repeats about 25 lines of
   `CH-SHELL/index.html`'s card rendering. That is the only repeated code.
2. **The blade sits under the CH top bar, and the top bar stays usable.**
   - AC 27 asks for the shell's unsaved-changes Modal when the environment is
     switched while a blade has changes. That is only possible if the
     environment control is reachable while a blade is open.
   - The Mobius frames also draw the blade below the top bar, with the bar
     undimmed.
   - Everything below the bar is dimmed and inert, and keyboard focus stays
     in the blade. So the switch is reachable by pointer only while a blade is
     open (SPEC-CHANGES A4).
3. **Two focus traps.** Bootstrap 5.1.3's Offcanvas and Modal each run a
   focus trap, and with both open they pull focus back and forth. While a
   Modal is open over a blade, the blade's trap is paused, using the plugin's
   private `_focustrap`. The trap resumes when the Modal closes.
4. **Focus after the shell's "Stay on this page" goes back into the blade**,
   to the control that last had focus there. The shell returns it to the
   environment option. With a blade open, that option is outside the dialog.
5. **Disabled controls keep their Tooltip on hover only.** A disabled control
   cannot take focus, so the Tooltip sits on a wrapper that never takes focus.
   The reason is also the control's accessible description, which screen
   readers read in browse mode. The alternative, `aria-disabled` on a
   focusable control, would add tab stops that do nothing (SPEC-CHANGES A7).
6. **The last-Administrator reason wins when both rules apply** to the
   signed-in user. AC 23 expects it once James is an Editor. In the default
   seed the own-account reasons show (AC 22).
7. **View blade "Edit" has no icon.** Buckholt's rule for a set of labelled
   buttons is "all with icons, or none", and "Close" has none
   (SPEC-CHANGES A8).
8. **The Toast icon is the catalogue's Success-solid (`fa-circle-check`).**
   Toast's Code & specs example 7 shows `fa-circle-info` on its success
   toast, which looks like a copy slip (SPEC-CHANGES C11).
9. **Toasts are announced politely.** The container is `role="status"
   aria-live="polite"` and the toasts carry no `role="alert"`, as the spec
   asks. This differs from Toast's canonical markup.
10. **The menu semantics match the shell.** More actions is a disclosure (no
    `role="menu"`). Its Tooltip sits on the `.menu` wrapper, because the
    toggle already carries `data-bs-toggle="dropdown"`. It is hidden when
    focus moves into the list.
11. **No results hides the pagination row**, including "Showing". The spec
    doesn't say. "Showing 0–0 of 0" next to disabled controls says nothing
    the no-results message doesn't (SPEC-CHANGES A11).
12. **Selection survives Add and Edit.** Saving keeps the selected rows; the
    spec lists only filter, search, sort and page changes as clearing it.
13. **Validation:**
    - Email is checked for length before format, so a 255-character address
      gets the length message.
    - Over 254 and over 50 characters are reachable because the fields have
      no `maxlength`.
    - Blur errors are also sent to the shell's polite announcer, so they are
      announced (the spec asks for errors to be announced).
14. **Sort order for Role and Status is alphabetical** (Active, Inactive,
    Pending; Administrator, Editor, Viewer). The spec gives no other order
    (SPEC-CHANGES A13).
15. **Pagination icons:** `fa-chevron-left` and `fa-chevron-right` come from
    the catalogue. First and last use `fa-chevrons-left` and
    `fa-chevrons-right`, which are not in the catalogue (SPEC-CHANGES C10).
16. **The Inactive users chip icon `fa-user-slash` is not in the
    catalogue.** The catalogue has no "inactive person" icon, and this is
    Figma's concept (SPEC-CHANGES C10). Active uses User (`fa-user`);
    Pending uses Email (`fa-envelope`).
17. **Table column widths are capped for truncation:** 12rem name, 10rem
    username, 20rem email.
    - The table needs 64rem. Below that it scrolls inside Table's own
      `.table-content`.
    - At 1440px the whole table fits.
    - `.table-content` is given `position: relative` here (scoped to
      `.cu-results`). Without it, visually hidden text in the table escapes
      the scroll box and widens the page (SPEC-CHANGES C12).
18. **Sort state is exposed with `aria-sort` on the header cell.** Table's
    rules ask for it but don't document how.
19. **Add blade fields are not marked required** (every field is required).
    The form uses `novalidate`, so only the spec's messages show, never
    browser bubbles.
20. **The Discard changes and the shell's Modal are raised above the blade**
    (`z-index` 1060; Modal backdrop 1057) while a blade is open. Buckholt's
    Modal is 1055 and the shared blade 1056.
21. **The CU-00-01 card footer uses Buckholt's runtime `.card-footer`,**
    which no Code & specs example documents (Gap 10, SPEC-CHANGES C16). It
    is the runtime's own band, which matches the frame (grey surface,
    12px / 32px padding), so no footer styling is written here.
22. **Helper text is shown again on read-only and locked fields.**
    `buckholt.css` hides every `.form-helper` inside an `.input` whose
    control is disabled or read-only. The spec's copy for those fields would
    then never show: "Username can't be changed.", "Email can't be
    changed.", "You can't change your own role.", and the last-Administrator
    reason. The helpers this prototype marks (`.cu-keep-helper`, blades
    only) get `display: block` back, in Buckholt's own helper style.
    Nothing else about the component changes (SPEC-CHANGES A17 and C15).
23. **"Clear all filters" is bottom-aligned in the filter row.** Buckholt's
    Button sets `align-self: flex-start`, which lifts it level with the
    Select labels.
24. **Users are kept for the tab, not just in memory.**
    - AC 7 (a new invitation shows on CU-00-01 "when the user returns") needs
      state to survive a page load. The spec's State note ("held in memory;
      a reload resets to the seed data") rules out keeping it for good.
    - So users are kept in `sessionStorage` across page changes. They are
      dropped on a reload (detected through the Navigation Timing API), on a
      change of shell seed or variant, and in a new tab (SPEC-CHANGES A18).
25. **The CU-00-01 tags are hidden from assistive technology** (`aria-hidden`).
    A visually hidden sentence with commas carries the same counts as the
    card's accessible description, so screen readers hear "12 users, 9
    active, 1 inactive, 2 pending." once, not run together.
26. **The CU-00-01 cards narrow before they stack.** The frame draws 528px
    cards, and the spec says "side by side, equal width" until two no longer
    fit. They narrow to 352px first, so they stay side by side at the 1088px
    reference width (two 464px cards) and stack below about 800px.

## Tests

`test/ch-users.js` has **408 assertions**: every acceptance criterion in
revision 5, in blocks `AC 1` to `AC 29` in the spec's order. On top of those
it covers:

- both variants, including the Only me card ("1 user", "1 active");
- the Long names seed at 1088px;
- CU-00-01 at 1088px (side by side) and 768px (stacked);
- the accessibility requirements: names, descriptions, Tooltips,
  `aria-sort`, focus return, the focus trap and the More actions keyboard;
- that a reload resets the users;
- that CH-SHELL's own home is unchanged.

It passes against the offline mirror (Arial, Font Awesome Free) and with
Proxima Soft loaded. See [`../../test/README.md`](../../test/README.md).

## Known limits

- **Font Awesome Pro icons do not render locally.** The kit returns 403 on
  `localhost` and `127.0.0.1`. The mirror's Font Awesome Free lacks the
  Pro-only regular glyphs (`fa-pencil`, `fa-magnifying-glass`,
  `fa-ellipsis-vertical`, `fa-chevrons-*`, `fa-user-slash`, and the regular
  `fa-arrow-right` the Clickable Card draws). Check icons on the deployed page.
- **Text widths:** the "only row 8 truncates" check was measured in Proxima
  Soft (Typekit loads on `localhost`). The mirror's Arial truncates one more
  email.
- **The 1088px reference is on the local Bootstrap scale** (AGENTS.md). The
  table's scroll threshold, the filter bar and the CU-00-01 cards were checked
  at 1088px and 1440px viewport widths (and the cards also at 768px).
- **Not built:**
  - roles and permissions management;
  - the design team's split "Open" button on the home app card (Figma only,
    Open questions 17);
  - the invitation email and Microsoft account creation;
  - password or MFA reset;
  - deactivate and reactivate;
  - bulk invitations;
  - the Open GI staff view;
  - Audit Centre entries;
  - the real Mobius users page.

  All are out of scope in the spec.
