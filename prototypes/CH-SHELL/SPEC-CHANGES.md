# CH-SHELL — findings for the spec, the designs and Buckholt

Against `ch-shell-spec.md` revision 7 (22 Oct 2026), checked on 26 Oct 2026.
The spec copy in this folder is unedited; everything that should change in it
is here.

Revision 6 resolved A17 to A29 and revision 7 resolves A30 to A33; all are
removed. A16 is not resolved and is kept. Sections B and C are unchanged
(C18 was added in the revision 6 check). A34 and A35 are new.

## A. The spec

16. **Minor:** the breadcrumb landmark name is "Breadcrumb" in the spec and
    "breadcrumb" in Buckholt's markup. Built with the spec's.

### New from the revision 7 check

34. **Two description copy rules sit under the App name length rule.** In
    revision 7 the bullets "No jokes, hype or idioms…" and "'We/us' means
    Open GI." follow the App name length rule, though they are rules for
    card descriptions. They belong back under "Card description copy rules",
    where revision 5 had them. Wording only; the build is unaffected.
35. **Two small inconsistencies.** Open questions list 15 before 14. And
    the source tag **[Build]** is still defined as a "finding from the Claude
    Code build of revision 3", but it now marks findings from the revision 3
    to 6 builds; "from a Claude Code build (`SPEC-CHANGES.md`)" would cover
    them all.

## B. The Figma frames

9. **No frames** for the Test alert, the single-environment Tag, the app
   placeholder, the unsaved-changes Modal, the Long names truncation, focus
   states or the skip link. All built from the spec.
11. **Export size.** The supplied PNGs are 3852 × 2165 — 2x of 1926 × 1082,
    not of the 1920 × 1080 frames, so they include a few pixels of canvas.
    Harmless; noted in case anyone measures from them.
12. **The home frames no longer show the grid.** SH-00-01, SH-00-02 and
    SH-02 draw six left-aligned 282px cards in one row at 1920px; revision 5
    builds production's grid — five centred 284px cards then one at 1920px.
    The spec's "Known screenshot differences" covers it, but anyone reading
    the frames alone will build the wrong grid. Annotate or update the frames.

## C. Buckholt tickets

### The eight gaps — all confirmed against the repository on 20 Oct 2026, none now documented, all built prototype-local

1. **Application top bar (Gap 1).** Buckholt has a Page layout Header region
   but no top-bar component: no lockup slot, no right-hand action group, no
   sticky behaviour, no avatar-as-menu-trigger. Built: `.ch-bar` in
   `shell/ch-shell.css`. Ask: a Header / App bar component with lockup,
   navigation slot and an actions group, and a documented Avatar + Menu
   button composition (the Avatar's `div` markup is not valid inside a
   `<button>`).
2. **Compact two-option segmented control (Gap 2).** Response button has no
   compact size and no segmented / pill grouping; Switch, Tabs and Page
   navigation are wrong for a context choice. Built: Response button radios
   in a pill. Ask: a segmented / "select button group" variant of Response
   button — which also matches the Figma component in B1.
3. **Page-level / persistent Alert (Gap 3).** Alert's canonical markup always
   carries `role="alert"` and is designed for in-region feedback. There is no
   full-width banner placement and no non-live (status) variant for a
   persistent indicator. Built: info Alert, square, full width, no role. Ask:
   a banner placement and a documented `role` choice (`alert` / `status` /
   none). Also: the message is an `h6`, which puts a heading ahead of the
   page's `h1`.
4. **Menu with a non-interactive header (Gap 4).** Menu documents a
   text-only `h6.menu-section-header` inside the list; nothing for an
   avatar + name + email block, and nothing outside `role="menu"`. Built:
   `.ch-identity` before `ul.menu-body`. Ask: a Menu header slot.
5. **Truncating a single long crumb (Gap 5).** Breadcrumb documents overflow
   for long *trails* and forbids "inventing custom truncation"; it says
   nothing about one long *label*. Built: 32ch ellipsis + Tooltip + full
   accessible name. Ask: document long-label behaviour, or confirm the
   overflow menu should absorb it.
6. **Card illustrations (Gap 6).** No illustration set, and `.card-img` is a
   fixed 10rem box with `object-fit: cover` (correction 6), so a 250:160
   illustration loses its sides below ~250px wide. `--card-aspect-ratio` is
   empty in the local build. Built: `aspect-ratio: 250 / 160`. Ask: an
   aspect-ratio option for Card media, and an illustration guideline.
7. **Skip link (Gap 7).** Not documented. `buckholt.css` ships Bootstrap's
   `.visually-hidden-focusable` but no skip-link pattern or focused style.
   Built: positioned on focus in `ch-shell.css`. Ask: a Skip link pattern.
8. **App-level header navigation slot (Gap 8).** Not documented; reserved
   and empty here (`#ch-app-nav`). Ask: include it in C1's Header component.

### Other findings from the build

9. **Menu markup is invalid ARIA.** `ul.menu-body[role="menu"]` contains
   `li > button.menu-item` with no `role="menuitem"` and no `role="none"` on
   the `li`. Added in the prototype as an application addition.
10. **Menu keyboard is missing.** `menu.js` is referenced by the Menu Code &
    specs but not supplied. Bootstrap 5.1.3 only handles `.dropdown-item`, so
    with Buckholt's `.menu-item` arrow keys do nothing, and Escape from inside
    the menu closes it without returning focus to the trigger (measured).
    Built in `ch-shell.js`. Ask: supply `menu.js`.
11. **`.btn-response` ignores `--button-height`.** It sets a literal
    `min-height: 2.75rem`, so the documented Button size variable cannot
    resize it. Measured in the local build only; not checked against live.
12. **`.link-standalone` sets `align-self: flex-start`**, so it top-aligns in
    any flex row. Re-centred locally.
13. **`a[data-bs-toggle=tooltip]` is restyled** (inherited colour, dotted
    underline). Any link that gets a Tooltip changes appearance, including a
    Breadcrumb link. Worked around by creating Tooltips from script.
14. **Response button group naming.** The canonical `.input-label label[for]`
    points at no control (already in `discrepancies/known-issues.md`). In a
    header with no visible label the group needs `role="radiogroup"` and an
    `aria-label`; Buckholt could document the unlabelled case.

### New from the revision 4 build

15. **Menu's markup and Menu's keyboard guidance describe different
    patterns.** The Code & specs markup is `ul.menu-body[role="menu"]` — the
    ARIA menu pattern, which means one tab stop and arrow keys between items.
    Menu's own keyboard guidance is Tab / Shift+Tab between items — the
    disclosure pattern. A screen reader is told one model and the keyboard
    behaves as the other. The prototype follows the guidance and drops the
    roles (so the `menuitem` addition described in C9 is no longer in the
    prototype). Ask: pick one. Either keep `role="menu"` and supply `menu.js`
    with arrow-key support (C10), or document Menu as a disclosure and remove
    `role="menu"` from the canonical markup.
16. **Card's documented title is too large for dense card grids.** With
    `title-03` and Card's 32px padding, a 20-character title needs a 276px
    card, so six cards cannot fit across a 1920px page inside the documented
    Frame. Ask: document which title style Card uses in a grid, or a compact
    Card padding (`.card-sm` exists in the runtime but is undocumented).

### New from the revision 5 build

17. **No wrapping grid of fixed-width items (Gap 9).** Buckholt's Page layout
    pattern uses Bootstrap's column grid, where items stretch with the
    viewport and a part-filled last row is left-aligned. Production CH's home
    needs fixed-width cards that wrap, with every row centred, and every card
    the height of the tallest. Built: a wrapping flex row with centred
    justification and a script for page-wide equal height. Ask: a documented
    card-grid or tile-grid layout (fixed item width, gap, centring, equal
    height), or confirm that column grids are the only Buckholt layout and
    that the CH home is an exception.

### New from the revision 6 check

18. **`title-03` is fluid in the runtime but documented as fixed.**
    `foundations/typography/type-sets.md` gives `.title-03` as 24px / 1.5rem
    on a 32px / 2rem line. `css/buckholt.css` sets
    `font-size: calc(1.275rem + 0.3vw)` and
    `line-height: calc(calc(1.275rem + 0.3vw) + 0.5rem)` below 1200px, and
    24px / 32px only from 1200px up (Bootstrap's responsive font sizing).
    Measured: 23.7px at 1088px, 21.5px at 375px. Anything sized to the
    documented value — Card heights, text-fit rules like CH's app name
    limit — changes below 1200px. Checked in the local build only; not
    checked against the live build, so first classify it per
    `verification/runtime-verification-framework.md` (local build regression
    or upstream). Ask: document the fluid behaviour and its breakpoint in
    the type sets, or make the documented size the runtime size.
