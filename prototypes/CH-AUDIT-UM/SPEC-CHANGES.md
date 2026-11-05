# CH-AUDIT-UM — findings for the spec, the designs and Buckholt

From building `ch-audit-um-spec.md` revision 1 on 5 Nov 2026, and updating
it the same day to revision 3 (with revision 2, which had not been built).
Apart from the edits the briefs asked for (Screen index links; the AU-00-01
part of two "Known screenshot differences" rows removed), the spec copy in
this folder is unedited; everything that should change in it is here.

**Revision 3 status of the revision 1 findings:**

- **Resolved by revision 2:** A15 (the content switcher and its Gap 1 are
  gone) and B1 (the AU-00-02 hover frame is removed). Revision 1's B2
  (Figma's extra tabs) is now the design.
- **Still open:** A1–A14 and A16–A21, B3–B8, C1–C6 (C1 and C6 renumbered
  below).
- **New:** A22–A26, B9–B16 (the comparison with the four-tab frame) and C7.

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
15. **Resolved in revision 2** (the switcher is gone). *Kept for the
    record; the Record type half still stands:* **Gap 1 and Record type vs
    CH-SHELL.** Gap 1 lists no precedent, but
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

### New from the revision 3 build

22. **The four tabs fit on one line with the full label.** Measured in the
    built page with Proxima Soft and the Font Awesome Pro kit loaded, Buckholt
    Tabs, local build, 5 Nov 2026:

    | Viewport | Tab row available | Four tabs, "Config Hub users" | Four tabs, "Configuration Hub users" | One line? |
    |---|---|---|---|---|
    | 1440px | 1312px | 557px | 607px | Yes, both. 705px to spare with the full label. |
    | 1088px | 960px | 557px | 607px | Yes, both. 353px to spare with the full label. |

    The full label adds 50px. Overflow would start only below about 735px
    wide (607px of tabs plus the Frame's padding), well under the 1088
    minimum. So the shortening is not needed for fit at the supported
    widths; it is still built, as decided (Andrej with Mark, 5 Nov 2026). If
    the reason is consistency with future, longer tab sets rather than fit,
    the "What changed" row could say so.
23. **Data model "Tab" uses the short label.** The Audit record's "Tab"
    field reads "Mobius users or Config Hub users", while revision 3 says
    data keeps "Configuration Hub users". A data field should probably hold
    the full name (or an id), with the label only in the UI.
24. **Revision 1 links break.** `#configuration-hub-users` (revision 1's
    fragment) is now an unknown fragment and opens Mobius users, as the
    spec's rule says. Built `#config-hub-users` from the label. If links
    from revision 1 were shared, consider accepting the old fragment too.
25. **Tab changes are not announced.** Revision 1 announced "{n} results"
    after a view switch; revision 2's live regions cover search, filter and
    record type only. Built without the announcement: selecting a tab
    already announces the tab. Confirm that is intended.
26. **Open question 7 is half resolved.** AU-00-01 now shows the four tabs;
    AU-00-03 still shows the "User Management" tab and the switcher.
## B. Figma (📚Audit file, `LCEXD3ORkD0iuyQAKv3NsX`)

1. **Resolved in revision 2** (AU-00-02 removed). *Kept for the record:*
   **AU-00-02 deselects Mobius users while hovering.** In the hover frame,
   "Mobius users" has lost its selected fill and "Configuration Hub users"
   has a grey fill. The spec says hover changes only the hovered option;
   built that way.
2. **Resolved in revision 2.** *Kept for the record:* **Tabs** show
   AutoMATE and Third-Party Services; the spec kept only User Management.
3. **Record type** is drawn as a link with a table icon and no caret, not a
   Menu button. Built as Buckholt's Ghost Menu button.
4. **Resolved in revision 2** (no switcher). *Kept for the record:*
   **Switcher selected state** is a pale fill without an outline.
5. **Header** shows "Greenlight" and user "RD" (see A1).
6. **AU-00-03** shows Mobius data, the Account type filter and column
   (known; the spec's "Known screenshot differences").
7. **Not drawn:** pagination, the Open GI avatar, the empty and no-results
   states, and the Configuration Hub users drawer (AU-04 has no frame).
8. **Avatar colours** vary per person; Buckholt's default is used for all.

### New from the revision 3 build: comparison with the frames

The built page at 1920 × 1080 (the frames are 1920 wide plus a border), real
fonts, compared by eye with `screenshots/AU-00-01.png` (four-tab frame
`1273:454412`) and `AU-00-03.png`. Arrangement matches: header, breadcrumb
band, title, description, tabs with the filter row directly below, Record
type at the right end, table, chevrons. Differences:

9. **Fourth tab "Third-party services"** in the frame; the spec, CH-SHELL's
   registry and the home card say "Third-Party Services". Built the spec's.
10. **Breadcrumb divider** is a chevron in Figma; Buckholt's "/" is built
    (CH-SHELL revision 4 decision).
11. **Spacing.** Figma insets the content about 35px and stacks title,
    tabs, filters and table tighter. Built with Buckholt's Frame (64px),
    Panel gap (32px) and Tabs' own spacing, so at 1920 the table header sits
    about 86px lower than in the frame (540 vs 454) and the content starts
    29px further in. Buckholt decides spacing (spec, Sources of truth).
12. **Filter widths.** Figma: Search 300, Date 250, Action type 300, Account
    type 200, Changed by 200. Built 288 / 176 / 224 / 176 / 176, so the row
    also fits at 1440.
13. **Pagination row** (new in this frame): "Results per page" sits inline
    to the left of a compact select, and the page buttons are one boxed
    group. Built with a top label (Forms: top-aligned labels; left labels
    unsupported) and Buckholt's small Ghost / Secondary Buttons.
14. **Sort icons** show on every column in Figma. Buckholt shows the arrow
    on hover and on the sorted column only. The comparison found the built
    page hid it on the sorted column too: **fixed** (the runtime's
    `.table-sort-asc` / `.table-sort-desc` state class is now set).
15. **Row order and count** as before: the frame keeps the unsorted
    today −24 rows and "1-10 of 44,232" (A17; Known screenshot differences).
16. **AU-00-03 not updated.** It still shows the "User Management" tab, the
    switcher, the old breadcrumb and Mobius data, covered by the AU-00-03
    rows kept in "Known screenshot differences".
## C. Buckholt

1. **Gap check against the live repo (5 Nov 2026).**

   | # | Gap | Still a gap? | Evidence |
   |---|---|---|---|
   | — | Content switcher (revision 1's Gap 1) | Removed in revision 2. | Was still a gap: no segmented / content-switcher component in `components/`, `code-specs-html/` or `css/buckholt.css`. |
   | 1 | Drawer | **Yes.** | No `.offcanvas` or drawer rule in `css/buckholt.css`; nothing in `components/`. The shared prototype blade covers it. |
   | 2 | Multi-select checklist dropdown | **Partly.** | Buckholt Dropdown documents a **Multiselect** with native Checkbox items (Code & specs). Still missing: a summary label in the trigger instead of Tags, a group heading inside the list, and a fixed option order (`dropdown.js` moves ticked options to the top). The filter-bar arrangement is also undocumented. |
   | 3 | Table extras | **Yes.** | Table (provisional) has no pagination, results-per-page, selected-row state or truncation. |
   | 4 | Avatar variants | **Partly.** | Avatar documents an **icon form** (`.avatar-icon`), which covers System and the generic person. Only the Open GI mark in a ring is a gap. |
   | 5 | Empty / no-results states | **Yes.** | No empty-state component or pattern. |

   Numbers are revision 2's. Rechecked for revision 3: unchanged.

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
6. **Drawer, table pagination and empty states** recur across CH
   prototypes (CH-USERS Gaps 1, 2 and 8; here Gaps 1, 3 and 5), and the
   segmented switch in CH-SHELL's Gap 2. Candidates for Buckholt components.
7. **Tabs keyboard.** Buckholt Tabs with the Bootstrap 5.1.3 bundle make
   every tab a Tab stop and select on Enter or Space; there are no arrow
   keys and no roving `tabindex`, which the WAI-ARIA tabs pattern expects
   with `role="tablist"`. The spec says to follow Buckholt, so it is built
   as shipped; worth raising with Mark.

## Not done here (outside this folder)

- `test/README.md`: add `ch-audit-um.js` (300 assertions) and update the
  total. The file holds uncommitted edits by the author, so it was left.
- `prototypes/README.md` / `PROTOTYPES.md`: list CH-AUDIT-UM.
- CH-SHELL: a Greenlight seed (A1) and its revision 7 commit (A2).
