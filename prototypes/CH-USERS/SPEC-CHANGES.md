# CH-USERS — findings for the spec, the designs and Buckholt

From building `ch-users-spec.md` revision 3 on 26 Oct 2026, and updating it
to revision 5 on 27 Oct 2026. The spec copy in this folder is unedited;
everything that should change in it is here.

**Revision 5 status of the revision 3 findings:**

- **Resolved by revision 4/5:** A1 (the name is "User Management" again,
- **Still open:** A2–A8 and A10–A17. Where they cite acceptance criteria,
- **Still open:** A2–A8 and A10–A17. A20 (new) is closed: the status colours are confirmed. Where they cite acceptance criteria,
  the numbers have been updated to revision 5's list.
- **New from the revision 5 build:** A18–A22, B5–B7, C16 and C17, each under
  its own heading.

## A. The spec

1. **Resolved in revision 4.** *Revision 3 finding, kept for the record:*
   **App name length check: "Account Management" fails the width rule.**
   The spec asked for this check (Shell overrides).
   - **Character count: passes.** 18 characters, within this spec's
     18-character limit and CH-SHELL revision 6's 20.
   - **Width: fails.** The title measured on one line against the room
     inside the fixed 284px card:

     | Font | "Account Management" | "Third-Party Services" | Room in the card title |
     |---|---|---|---|
     | Proxima Soft (Card's `title-03`, 24px) | **233.8px** | 212.0px | 218px |
     | Arial (fallback, test mirror) | 233.5px | 217.4px | 218px |

     It is 21.8px wider than "Third-Party Services" and 15.8px over the
     room, so it wraps to two lines ("Account / Management").
   - **Consequence on the home page.** Under the shell's App name length
     rule, every card on the page becomes one title line taller, because
     cards share the tallest card's height. This is built that way and
     checked (`test/ch-users.js`, AC 1).
   - **Why the character limit missed it.** "Account Management" has two
     wide capitals and an "M"; "Third-Party Services" has a hyphen and
     narrow letters. The character count does not predict width. The
     rendered-width test is the one that matters.
   - **Decision needed** (the shell rule asks for a deliberate one):
     - accept the taller cards;
     - or choose a shorter display name. For scale, measured the same way:
       "Accounts" is 98.9px and the old "User Management" 195.9px.

   Also align the two limits: this spec says 18 characters, CH-SHELL
   revision 6 says 20.
2. **CH-SHELL revision 7 doesn't exist.** "Shell" cites revision 7.
   - `main` has revision 5. Revision 6 (21 Oct 2026) exists only as
     uncommitted edits on `feature/ch-shell-rev6`.
   - The shell code is the same in both, so this build is unaffected.
   - Cite revision 6, or publish revision 7 first.
3. **The shell's Test alert is now wrong on these pages.** The alert reads
   "You're in your Test environment. Changes here won't affect Live."
   Configuration Hub users belong to the organisation (Data model, Rules). A
   user added, changed or deleted in Test is the same user in Live.
   - This is the case CH-SHELL's Open question 4 anticipated.
   - Built with the shell's alert unchanged, as the shell decides it.
   - The copy needs to change, at least inside User Management. For example,
     an app-specific line under the alert: "Users are shared with Live."
4. **AC 27 and Gap 1 pull in different directions.** Gap 1 says the page is
   "dimmed and inert" while a blade is open. AC 27 needs the environment
   control usable while the Add or Edit blade has changes.
   - Built: the blade opens under the CH top bar, as in the Mobius frames.
   - The top bar stays usable by pointer; the rest of the page is dimmed.
     Keyboard focus stays in the blade, as the Accessibility requirements
     ask.
   - So keyboard users can only switch environment after closing the blade.
   - Say which is intended: either the top bar is outside the blade's
     inert area (and focus may leave the blade to reach it), or AC 24 only
     applies to pointer users.
5. **Two rules can never trigger with the stated rules.**
   - **"Bulk Delete is disabled if the selection would remove the last
     active Administrator."** The signed-in user can't be selected, can't
     change their own role, and is always an active Administrator in every
     seed. So at least one active Administrator always stays outside any
     selection. Built anyway, and checked to be unreachable.
   - **The row-level last-Administrator rule only ever applies to the
     signed-in user.** That user's Delete and role are already blocked by
     the own-account rule. Built so that the last-Administrator reason wins
     when both apply, which AC 23 needs. Confirm that precedence, or say
     which reason shows.
6. **The shell override needs a home.**
   - CH-SHELL's contract has a feature edit `shell/ch-registry.js` (base page,
     seed lists). The brief for this build said not to edit CH-SHELL.
   - So this prototype changes the registry in memory and ships its own home
     entry page (`home.html`). The lockup on CH-USERS pages points there.
   - The shell's own home still shows the old description and opens the
     placeholder page.
   - Revision 5 note: CH-SHELL was never edited, in revision 3 or 5, so
     there was nothing to revert there. The revision 3 override was only
     ever in this prototype's `ch-users-registry.js`, which now changes the
     description and base page and keeps the shell's own name.
   - When CH-SHELL takes the new description, as this spec asks, both
     workarounds can go (PROTOTYPE.md, "How the shell is reused").
7. **Gap 9: a disabled control can't show a Tooltip on focus.** Disabled
   buttons and checkboxes leave the tab order.
   - Built: the Tooltip shows on hover, via a wrapper that never takes
     focus. The reason is the control's accessible description, read in
     browse mode.
   - If keyboard users must reach the reason by Tab, the controls would
     need `aria-disabled` (focusable, but they do nothing). Say which.
8. **View blade "Edit (Primary, Edit common action)".** Buckholt's rule for a
   set of labelled buttons is "all with icons, or none". "Close" has no
   common-action icon. Built as "Edit" without the icon. Say "Edit label"
   rather than "Edit common action", or give "Close" an icon too.
9. **Resolved in revision 4.** *Revision 3 finding:* **CU-00-01: the
   revision 3 card title wrapped at the shell's card width.** "Card width matches the CH-SHELL app cards" leaves 218px for
   the title; the title needs 296.4px in Proxima Soft. Built wrapping, with
   both cards the same height. If one line matters, the card titles would
   need to be shorter ("Configuration Hub" alone is 194.5px), or the cards
   wider than the app cards.
10. **"Results per page": state the label position.** Figma draws it inline
    to the left. Buckholt Forms don't support left-aligned labels. Built
    with a top label.
11. **No-results state: say what happens to the pagination row.** Built
    hidden, including "Showing". The no-results message replaces it.
12. **Blur validation: say whether moving to "Cancel" should show the error
    first.** Built: the email is checked on any blur, so pressing Cancel
    after typing a bad address can flash the error as the blade closes.
    That matches the rule as written but may not be wanted.
13. **Sort order for Role and Status.** Built alphabetical: Administrator,
    Editor, Viewer; Active, Inactive, Pending. If Status should sort by
    lifecycle (Pending, Active, Inactive), or Role by level, say so.
14. **Selection after Add and Edit isn't specified.** Built: kept. Only
    filter, search, sort, page and rows-per-page changes clear it (Gap 5).
15. **The Buckholt gaps table is out of date in one place.**
    - **Gap 7 (read-only Text input) is documented now:** Text input's
      `examples.html` and `rules.md` have a `readonly` variant. Remove it.
    - **Gaps 5 and 6 are partly covered:** Table documents the checkbox
      column and `.data-secondary`.
    - The spec was checked against `buckholt-reference.md` (commit
      `211e365`). Update that reference too.
16. **"Every field is required, so no required markers."** Correct per
    Buckholt Forms. Worth one line in the Edit blade section too, because
    the Mobius Edit User frame shows asterisks.
17. **The spec puts helper text on read-only fields, and Buckholt hides it
    there.**
    - The fields: Username and Email ("… can't be changed."), and the
      locked Role, which shows "You can't change your own role." or the
      last-Administrator reason.
    - `buckholt.css` hides `.form-helper` on any disabled or read-only input.
    - Built showing them (PROTOTYPE.md, judgement call 22).
    - Decide whether that text is needed, or whether the read-only
      treatment says enough. For the locked Role at least, the reason is the
      only place the rule is explained in the blade. See C15.

### New from the revision 5 build

18. **AC 7 contradicts the State note.**
    - AC 7: after a new invitation, "when the user returns to CU-00-01" the
      card shows "13 users" and "3 pending". Returning is a page load.
    - Prototype notes, State: "held in memory. A reload resets to the seed
      data."
    - Built: users are kept for the browser tab across page changes, and
      reset on a reload, on a different seed or variant, and in a new tab.
    - Say so in the State note, so it isn't read as "every page starts from
      the seed".
19. **Gap 10 is mostly documented already.** "Card (selectable state and hit
    target not supplied)" points at the wrong Card variant. Card documents a
    **Clickable Card** (`a.card.card-clickable`). Its runtime draws:
    - the whole-card link;
    - the arrow;
    - the 3px bottom border;
    - the hover border and the pointer.

    Only the footer is undocumented (C16). Reword Gap 10 to "Clickable Card
    with a footer", and drop the arrow from the Buckholt mapping as a
    separate icon: the Clickable Card draws it.
20. **Closed.** *The table's status colours changed with "same status
    variants as the card tags".*
    - Revision 3 built Pending as warning (orange) and Inactive as the plain
      tag (grey).
    - Following Andrej's frame and this line, revision 5 has Inactive orange
      and Pending grey.
    - **Confirmed by Andrej, 27 Oct 2026:** Inactive orange and Pending grey
      are right, as in his frame. No change to the build.
21. **Two "Known screenshot differences" rows don't match the frame.**
    - **Breadcrumb:** the frame already shows "User Management" (the export
      is `screenshots/CU-00-01.png`), not "Applications". Delete that row.
    - **Descriptions:** the frame's Mobius description has no full stop,
      and its Configuration Hub description does. That's fine, because the
      spec's copy replaces both.
22. **Card title style.** The frame sets the card titles in Headline 02
    (28px). Buckholt's Card documents `title-03` (24px) for card titles.
    Built `title-03`, per Sources of truth. If the larger title matters,
    raise it with Buckholt (C17), not here.

## B. Figma (User Management file, `UH10tKpy1gSqjAZI4DQWRV`)

1. **The Edit, View and Delete User pages are the older Mobius UI.**
   - Edit and View: tabs (Account Settings, B2B Settings, Restrictions),
     Display name, asterisks, labels at a different scale.
   - Delete: "Warning" titles, a warning icon and a neutral "Confirm".
   - These pages predate the "Users page - Design System Components Update -
     August 2026" page. Used for arrangement only (blade position, footer
     actions, focus targets).
   - Exported as `screenshots/CU-02.png` (frame `2924:345012`),
     `CU-04.png` (`3034:336456`) and `CU-05.png` (`2924:365503`).
   - Update them to the August 2026 system when the Mobius blades are redesigned.
2. **The file has a "Configuration Hub users" page (`7934:15043`).**
   - It holds the lo-fi IA options, the stakeholder feedback and the
     roles-and-permissions sketches. The spec says "There are no Figma
     frames for these pages yet" and points to "stakeholder canvas frame
     A2" without a link.
   - Add the page and the A2 frame to the Screen index, so the lo-fi
     reference can be found.
3. **Mobius Users frame (`7587:166787`, exported as `CU-00-02.png`):**
   - "Results per page" has an inline label, which Buckholt Forms don't
     support (A10).
   - More actions uses a horizontal ellipsis. Buckholt's Overflow Menu
     button uses a vertical one.
   - Chip labels are inconsistent: "Active users: 6" has a colon,
     "Inactive users 0" doesn't, and "SSO user: 5" is singular.
   - The sort carets appear on every column, with a single caret on the
     active one. Buckholt's Table only documents the neutral sort icon
     (C5).
4. **The Unsaved Changes pop-up frames** (Edit User page, section
   `3561:133658`) are the nearest reference for the Discard changes Modal.
   They are not in the Screen index, and were not exported.

### New from the revision 5 build

5. **Andrej's CU-00-01 frame** (node `8072:6199`, exported as
   `screenshots/CU-00-01.png`) uses Figma's "Clickable card" with a card
   footer, and a separate "Clickable icon" component for the arrow ("This
   arrow is purposefully off centre"). Buckholt's runtime Clickable Card
   draws its own arrow at the end of the card body. The two match closely,
   but keep the Figma arrow and the coded one in step.
6. **The frame's tag variants are the reference for status colour** (total
   info, active success, inactive warning, pending plain). The Mobius Users
   table frame (`7587:166787`) draws Pending orange and Inactive grey: the
   opposite. Align the table frame with the card frame, whose colours are
   confirmed (A20, closed).
7. **The frame shows the shell's Figma placeholders** ("Open GI", avatar
   "RD", a mint avatar). Built with the Northgate seed, as the spec says.

## C. Buckholt

1. **Blade / side panel (Gap 1).**
   - Forms documents a "side-panel context", but there is no side panel
     component, and `buckholt.css` has no `.offcanvas` rule.
   - Built from the shared prototype blade (`prototypes/shared/blade.js`,
     Bootstrap Offcanvas).
   - Buckholt has no guidance on where a side panel's actions go when they
     sit outside the `<form>`. Built with the `form` attribute on the submit
     button.
2. **Pagination (Gap 2).** No component, no runtime class.
3. **Filter bar (Gap 3).** No pattern for search plus filters plus page
   actions in one row.
4. **Summary chips (Gap 4).** No container for a row of counts. Key-value
   pair and Icon block supply the content only.
5. **Table: selection and sort state.**
   - No selected-row state (Gap 5) and no bulk-action pattern.
   - No documented sort-direction state: Table's rules ask for an accessible
     sort state but give none. Built with `aria-sort` on the header and
     `fa-sort-up` / `fa-sort-down`.
6. **Table: empty values (Gap 6).** `.data-secondary` gives the style, but
   there is no guidance for a cell with no value (copy, sorting,
   accessibility).
7. **Text input read-only: documented.** Gap 7 is closed; see A15.
8. **No-results / empty state (Gap 8).** No component.
9. **Disabled with explanation (Gap 9).** Tooltip guidance doesn't cover
   disabled triggers. Bootstrap needs a wrapper, because disabled controls
   take no pointer events, and the Tooltip can't show on focus. See A7.
10. **Iconography catalogue gaps:**
    - no "inactive user" icon (built `fa-user-slash`, Figma's concept);
    - no first and last page icons (built `fa-chevrons-left` /
      `fa-chevrons-right`);
    - no sort-direction icons (built `fa-sort-up` / `fa-sort-down`).
11. **Toast Code & specs example 7 puts `fa-circle-info` on the success
    toast.** The catalogue's Success icon is `fa-circle-check`, which the
    Mobius prototypes also use. Probably a copy slip in the source; built
    with `fa-circle-check`.
12. **Visually hidden text inside `.table-content` escapes the scroll
    container.**
    - `.table-content` scrolls horizontally but isn't positioned. Absolutely
      positioned descendants, such as Bootstrap's `.visually-hidden`, use a
      containing block outside it.
    - Any hidden header or description in a scrolling table therefore
      widens the page: the page was 1,299px wide at a 1,088px viewport.
    - Fixed locally with `position: relative` on `.table-content`, scoped
      to this prototype.
    - Measured in the local `css/buckholt.css` only. Not checked against
      the live `compiled.css`, so it is not yet classified (AGENTS.md: local
      regression, upstream mismatch, or unresolved). Not added to
      `buckholt-ai-fixes.css`, which this build may not change.
13. **Menu button Overflow with a Tooltip.** The toggle already carries
    `data-bs-toggle="dropdown"`, so the Tooltip has to go on the `.menu`
    wrapper (the same as CH-SHELL's avatar). It then shows whenever focus
    is inside the open menu, unless hidden from script. Buckholt should
    document how an icon-only Menu button gets its Tooltip.
14. **Modal over an Offcanvas.** Bootstrap 5.1.3's two focus traps fight
    each other when a Modal opens over an Offcanvas. Built by pausing the
    Offcanvas trap. If Buckholt adds a side panel, it should say how a
    confirmation Modal stacks over it.
15. **Helper text disappears on disabled and read-only inputs.**
    - `buckholt.css` hides every `.form-helper` (below the field and in
      `.input-label`) when the `.input` holds a disabled or read-only
      control: `.input:has(.form-control[readonly], .form-select:disabled, …)
      .form-helper { display: none }`.
    - Neither Text input's nor Select's documentation mentions it. Their
      read-only examples simply have no helper.
    - That leaves nowhere to say *why* a field is read-only, which is the
      usual reason to show a read-only field at all.
    - Measured in the local build only, so not yet classified.
    - Document the intent; if it is deliberate, give the reason a documented
      place.

### New from the revision 5 build

16. **Card footer: runtime only.**
    - `buckholt.css` styles `.card-footer` (the grey band and padding
      Andrej's frame draws), and `.card:has(.card-footer) .card-body`
      adjusts the body padding for it.
    - No Code & specs example shows a footer, on a plain Card or a Clickable
      Card. So the composition used here (`a.card.card-clickable >
      .card-body + .card-footer > .tag-set`) is evidenced by the runtime,
      not by the documentation.
    - Document the footer, and say whether a Clickable Card may carry one.
17. **Clickable Card accessibility.**
    - Card documents the markup but not the accessible name.
    - A whole-card link with a heading, a paragraph and tags would read all
      of it as its name. This build names it by the title
      (`aria-labelledby`) and describes it by the rest (`aria-describedby`).
    - The arrow is a CSS `::after` glyph (`content: "\f061"`). Some
      screen readers read generated content as part of a name computed from
      content, which is another reason to name the link explicitly.
    - Document the naming, and whether the card title style may vary
      (Figma uses Headline 02 here, A22).
