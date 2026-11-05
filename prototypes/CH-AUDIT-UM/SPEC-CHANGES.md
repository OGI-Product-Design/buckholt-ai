# CH-AUDIT-UM — findings for the spec, the designs and Buckholt

From building `ch-audit-um-spec.md` revision 1 on 5 Nov 2026. Apart from the
Screen index links the brief asked for, the spec copy in this folder is
unedited; everything that should change in it is here.

Nothing outside `prototypes/CH-AUDIT-UM/` was changed except the new suite,
`test/ch-audit-um.js`. Items below that need a change elsewhere (CH-SHELL,
CH-USERS, Buckholt, `test/README.md`) are recorded, not made.

## A. The spec

1. **Organisation: "Greenlight (from CH-SHELL)" does not exist in CH-SHELL.**
   CH-SHELL's default seed is Northgate Insurance Services, signed in as
   Sophie Marchetti; Greenlight appears only in the reference screenshot
   SH-REF-UM. **Decided for this build (the user, 5 Nov 2026):** keep the
   Northgate header; keep the seed people on `@greenlight.co.uk`. The spec
   should either drop "Greenlight" or ask CH-SHELL for a Greenlight seed.
   Until then the header and the audit data name different organisations.
2. **CH-SHELL revision 7 is not on `main`.** `main` carries CH-SHELL spec
   revision 5; revisions 6 and 7 exist only as uncommitted edits in the
   author's working copy. Both are wording changes ("No behaviour
   changes"), so the shell code on `main` is what revision 7 describes and
   reuse works. The revision 7 spec should be committed so the reference
   resolves.
3. **Screen index file.** The index names the User Management file
   (`UH10tKpy1gSqjAZI4DQWRV`), "Audit and History" page. The frames supplied
   are in the "📚Audit" file (`LCEXD3ORkD0iuyQAKv3NsX`), "User management"
   page. Links added to the index.
4. **"Switched on in the default seed variants."** CH-SHELL's contract has a
   feature edit `ch-registry.js`; this prototype may not, so the switch is
   made in memory (`ch-audit-um-registry.js`) and on its own `home.html`.
   CH-SHELL's own home still has no Audit Centre card. Built on in *every*
   seed; say if Test-only or Live-only clients should not have it.
5. **Truncation: "hover and focus" vs CH-SHELL.** AU-00-01 says truncated
   cells show the full text "on hover and focus". CH-SHELL revision 4 says
   truncated plain text is not focusable (full text by hover Tooltip and
   accessible name). Built the CH-SHELL way. One of the two should change;
   making every truncated cell a tab stop would add up to four stops a row.
6. **Date preset boundaries.** Is "Last 7 days" today plus the six days
   before, or the seven days before today as well? Built as today plus
   n − 1 days ("Last 7 days" = records 1 to 9; record 10 at today −7 is
   out). "Last 12 months" built as 365 days.
7. **Mobius users filter options are not listed.** The spec lists the
   Configuration Hub users Action types only. Built: the Mobius seed's
   actions, A to Z; Changed by from the seed, with no "System" (no Mobius
   record has it).
8. **Singular count.** "{n} results" gives "1 results". Built "1 result".
9. **"Showing {from}-{to} of {total}"** uses a hyphen; CH-USERS shows an en
   dash ("Showing 1–10 of 13"). Built with the hyphen. Pick one for both.
10. **Breadcrumb links to itself.** The base page of Audit Centre is User
    Management, so the "Audit Centre" crumb on "Audit Centre > User
    Management" goes to the page you are on. Fine while there is one tab;
    worth deciding before AutoMATE and Third-Party Services tabs arrive
    (does each tab get its own URL and crumb?).
11. **Changed by and renamed people.** Identity rules store names as at the
    event, and say email identifies a person across their history. The
    Changed by filter therefore lists "Emily Tailor" (her own record 14)
    and "Laura Chen" (record 23), not today's names, and ticking "Emily
    Taylor" would not exist as an option. Should the filter group a person
    by email and show their current name?
12. **Search inside a grouped bulk deletion.** Not specified. Built: search
    matches every deleted account, so "marcus" finds record 9 although its
    row shows "4 users".
13. **Seed details missing.** Records 15, 18, 24 and 26 (Invitation sent)
    give no expiry; records 17 and 23 (User created) give only the role.
    Built: expiry = sent + 14 days; full User created field set.
14. **Record 3 contradicts CH-USERS.** Sarah Brown resets her own MFA
    ("Self-action"), but CH-USERS blocks it: "You can't reset your own MFA
    here." Either the record is a self-service reset, which this spec says
    is never audited, or CH-USERS should allow it.
15. **Gap 1 and Record type vs CH-SHELL.** Gap 1 lists no precedent, but
    CH-SHELL's Gap 2 (the Live / Test switch) is the same segmented Response
    button and names "Audit Centre Grouped / Individual (same gap)" as its
    precedent — while this spec maps Record type to a Menu button. Built as
    this spec says. CH-SHELL's precedent note, or this mapping, should
    change.
16. **"B2B Settings changed"** (from the AU-00-01 screenshot) is not
    sentence case. Kept as supplied; "B2B settings changed" would match the
    other actions.
17. **The AU-00-01 rows are not in date order.** The four rows on today −24
    read 13:15, 18:51, 17:32, 17:24. Built sorted (newest first is the
    default sort), so they show in a different order from the screenshot.
18. **Times for the two added Mobius rows** are not given. Built 10:00 and
    14:30.
19. **Two titles in the drawer.** The header bar says "Audit details" and
    the dialog is "named by its title", the Action. Built: the Action names
    the dialog and takes focus; "Audit details" stays the header bar's
    heading. Confirm that is the intent.
20. **Deleted invitation card heading.** The pattern lists the card's
    fields (Email, Role, Status) but no title. Built with the email as the
    card title, matching the Deleted account cards.
21. **Record type menu: how is the current option shown?** Only the trigger
    label says it (C4).

## B. Figma (📚Audit file, `LCEXD3ORkD0iuyQAKv3NsX`)

1. **AU-00-02 deselects Mobius users while hovering.** In the hover frame,
   "Mobius users" has lost its selected fill and "Configuration Hub users"
   has a grey fill. The spec says hover changes only the hovered option;
   built that way.
2. **Tabs** show AutoMATE and Third-Party Services; the spec keeps only
   User Management.
3. **Record type** is drawn as a link with a table icon and no caret, not a
   Menu button. Built as Buckholt's Ghost Menu button.
4. **Switcher selected state** is a pale fill without an outline (colour
   alone). Buckholt's Response button outlines it.
5. **Header** shows "Greenlight" and user "RD" (see A1).
6. **AU-00-03** shows Mobius data, the Account type filter and column
   (known; the spec's "Known screenshot differences").
7. **Not drawn:** pagination, the Open GI avatar, the empty and no-results
   states, and the Configuration Hub users drawer (AU-04 has no frame).
8. **Avatar colours** vary per person; Buckholt's default is used for all.

## C. Buckholt

1. **Gap check against the live repo (5 Nov 2026).**

   | # | Gap | Still a gap? | Evidence |
   |---|---|---|---|
   | 1 | Content switcher | **Yes.** | No segmented / content-switcher component in `components/`, `code-specs-html/` or `css/buckholt.css`. Response button is the closest (single-select radios). |
   | 2 | Drawer | **Yes.** | No `.offcanvas` or drawer rule in `css/buckholt.css`; nothing in `components/`. The shared prototype blade covers it. |
   | 3 | Multi-select checklist dropdown | **Partly.** | Buckholt Dropdown documents a **Multiselect** with native Checkbox items (Code & specs). Still missing: a summary label in the trigger instead of Tags, a group heading inside the list, and a fixed option order (`dropdown.js` moves ticked options to the top). The filter-bar arrangement is also undocumented. |
   | 4 | Table extras | **Yes.** | Table (provisional) has no pagination, results-per-page, selected-row state or truncation. |
   | 5 | Avatar variants | **Partly.** | Avatar documents an **icon form** (`.avatar-icon`), which covers System and the generic person. Only the Open GI mark in a ring is a gap. |
   | 6 | Empty / no-results states | **Yes.** | No empty-state component or pattern. |

2. **Dropdown Multiselect accessibility.** The Code & specs markup puts
   `role="option"` items (each `tabindex="0"`, holding a checkbox) in a
   `role="menu"` list — options belong in a listbox, and a focusable item
   wrapping a focusable checkbox gives two tab stops per option.
   `data-bs-auto-close="false"` relies on `dropdown.js` for outside-click
   closing.
3. **Escape focus.** With the Bootstrap 5.1.3 bundle, Escape inside an open
   Dropdown or Menu closes it but leaves focus inside the hidden panel, so
   it falls to `<body>`. Seen here with checkboxes in a Dropdown; likely
   for any focusable item. Worth a check on the live documentation site.
4. **No top-level selectable Menu item.** Single- and multi-select Menu
   items are documented only inside a submenu, and their checked style is
   scoped to `.submenu`. A Menu button that chooses one of two modes
   (Record type) has no way to show the current choice in the open menu.
5. **Avatar has no outlined / brand variant** for an organisation mark (the
   Open GI avatar). Built with the image form plus a 1px Primary 60 ring.
6. **Content switcher, drawer, table pagination and empty states** recur
   across CH prototypes (CH-SHELL Gap 2, CH-USERS Gaps 1, 2 and 8, here
   Gaps 1, 2, 4 and 6). Candidates for Buckholt components.

## Not done here (outside this folder)

- `test/README.md`: add `ch-audit-um.js` (263 assertions) and update the
  total. The file holds uncommitted edits by the author, so it was left.
- `prototypes/README.md` / `PROTOTYPES.md`: list CH-AUDIT-UM.
- CH-SHELL: a Greenlight seed (A1) and its revision 7 commit (A2).
