# CH-SHELL — findings for the spec, the designs and Buckholt

From building `ch-shell-spec.md` revision 4 on 20 Oct 2026. The spec copy in
this folder is unedited; everything that should change in it is here.

Revision 4 resolved every revision 3 finding in sections A and B except A16,
B9 and B11, which are kept below with their original numbers. Section C is
unchanged from revision 3; C15 and C16 are new.

Revision 5 (same day) added A24–A29, B12 and C17, each under "New from the
revision 5 build"; nothing earlier was edited.

## A. The spec

16. **Minor:** the breadcrumb landmark name is "Breadcrumb" in the spec and
    "breadcrumb" in Buckholt's markup. Built with the spec's.
17. **The card rule cannot hold with Buckholt's documented Card title.** In
    Card's Code & specs title style (`title-03`, 24px) "Third-Party Services"
    is 210px; with Card's 32px padding and border the card must be 276px. Six
    per row at 1920px leaves 272px (269px with a classic scrollbar), so AC 7
    fails. Built with `title-02` (20px, 177px, card minimum 243px), which is
    Buckholt's own next title step and matches Figma's ~20px. Either name
    `title-02` for card titles in the spec, or relax AC 7.
18. **App names need a length limit.** The card rule leaves a narrow window:
    the minimum card width must be over 237px (so five never fit at 1440) and
    at most 272px (so six fit at 1920). Built at 256px, which fits a
    `title-02` title of about 190px — roughly 22 characters. A longer future
    app name ("Policy Extension Configuration", for example) would wrap. Add a
    maximum app-name length to the App registry rules.
19. **The avatar's hit area is arrangement, and AC 8 depends on it.** With
    Buckholt deciding spacing, the 16px either side of the avatar in Figma's
    Profile frame could be read as a Figma value to drop. Without it the Long
    names organisation fits at 1088px in Proxima Soft with 7px to spare and
    AC 8 fails. Built with it. State the avatar's hit area in Gap 1.
20. **Two revision 3 leftovers contradict revision 4:**
    - "Changes from legacy", Keyboard row: "focus moves to the heading after
      navigation". Should read "focus starts at the top after navigation".
    - Gap 4, expected behaviour: "arrow keys move only between items". Under
      the Tab model it should read "Tab never stops on the identity header".
21. **SH-01 step 6 needs a scope.** "Focus stays on the selected option"
    holds on the home page, which updates in place. Inside an app the switch
    is a page load, so focus starts at the top ("Focus on navigation"). Built
    that way; say "on the home page" in step 6.
22. **Name the menu semantics, not just the keyboard.** SH-02 step 4 says the
    semantics must match the Tab model and points at the Buckholt ticket on
    Menu semantics — but that ticket (C9) asks for `menuitem` roles, which
    belong to the arrow-key model. Built as a disclosure: the button exposes
    `aria-expanded` and controls a plain list of buttons, with no menu roles.
    State "disclosure" in the spec so production does not copy Buckholt's
    `role="menu"`. See C15.
23. **Shift+Tab from the first item is unspecified.** Built: focus moves back
    to the avatar and the menu stays open (Tab past the last item closes it).
    Confirm, or say the menu closes when focus leaves the items in either
    direction.

### New from the revision 5 build

24. **Open question 15: no card title wraps at the fixed width.** Inside a
    284px card, Buckholt Card's 32px padding and 1px border leave 218px for
    the title. In Card's `title-03` the titles measure (Proxima Soft / Arial
    fallback): Third-Party Services 212 / 217px, User Management 196 / 197,
    Onboarding Form 188 / 188, Policy Extensions 184 / 188, Audit Centre
    134 / 133, AutoMATE 111 / 114. All six fit on one line in both fonts, so
    OQ 15 can close as "no wrapping today". The margin is thin — 6px in
    Proxima Soft, 1px in Arial — so any longer app name will wrap. Card height
    is set by the descriptions (three lines in the tallest card), not the
    titles: every card is 419px.
25. **A17 and A18 no longer apply.** Revision 5's fixed 284px card and Card's
    own `title-03` replace the revision 4 minimum-width rule and the
    `title-02` workaround. A18's app-name limit still matters but changes: a
    `title-03` title must stay within 218px, about 20 characters ("Third-Party
    Services" is 20).
26. **The capacities leave a 28–38px window for the page padding.** Five per
    row at 1920 needs more than 28px each side; three at 992 needs at most
    38px, and at most 29.5px if the 992 measurement included a classic 17px
    Windows scrollbar. Built at 29px. Record production's actual horizontal
    padding in the spec, and whether the UAT viewport widths were measured
    with or without the scrollbar, so the table cannot drift from the
    padding.
27. **The grid's vertical spacing is unspecified.** The spec gives
    production's horizontal gap (32px) but not the gap between rows or the
    space above the first row. Built: 32px between rows, Buckholt's Frame
    (64px) above. Add production's values.
28. **"All cards share the height of the tallest card" is page-wide.** One
    long description makes every card on the page taller, including rows
    with short ones. CSS cannot do this and centre a part-filled final row at
    the same time, so it is set by script. Confirm production does this, and
    not "tallest in the row".
29. **The capacity table goes below the designed width.** It lists 768px,
    576px and below, but "Viewport" says layouts narrower than 1088px are not
    designed. The grid meets the table down to 320px (with the side padding
    reduced to 16px below 576px so a 284px card fits); the header does not —
    it is 499px wide at 375px. Say whether the table is a requirement below
    1088px or production behaviour noted for reference.

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
