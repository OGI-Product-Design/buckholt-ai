# CH-SHELL — findings for the spec, the designs and Buckholt

From building `ch-shell-spec.md` revision 3 on 20 Oct 2026. The spec copy in
this folder is unedited; everything that should change in it is here.

## A. The spec

1. **Gap 5 contradicts Buckholt's Breadcrumb guidance.** `components/breadcrumb/rules.md`
   says: "Use the documented overflow approach for long trails rather than
   inventing custom truncation." Built as the spec asks, but the spec should
   say why: the documented overflow menu collapses *many crumbs*; it does
   nothing for *one long label*. That distinction is the real gap (C5).
2. **Truncated plain text cannot show a Tooltip "on focus" without a tab
   stop.** The organisation name and the current-page crumb are not
   focusable. Built: each gets `tabindex="0"` only while it is actually
   truncated. The focus order in "Accessibility requirements" should list
   that stop ("organisation name, when truncated") or drop the focus
   requirement for plain text.
3. **AC 8 depends on font metrics.** With Proxima Soft and no padding around
   the avatar, the "Long names" organisation fits at 1088px with 7px to spare
   and nothing truncates. It truncates once the avatar has Figma's 16px
   Profile padding (built). Suggest: "the organisation name truncates when
   space runs out; at 1088px with the Long names seed it is truncated", and
   name the avatar's hit area in the header layout.
4. **"Open" is navigation but specified as a Button.** Buckholt: Button for
   actions, Link for navigation. Built as a link with Primary Button styling.
   The mapping table should say "Button-styled link".
5. **"The new page title is announced" (Focus on navigation).** Moving focus
   to the level 1 heading announces the heading ("User Management"), not the
   document title ("[Test] User Management | Configuration Hub"). Built as
   heading focus. Either accept that, or specify a separate announcement.
6. **The home `h1` is visually hidden but receives focus after navigation.**
   A sighted keyboard user gets no visible focus indicator on the home page
   after Open → back. Consider a visible title, or moving focus to Main
   instead on the home page.
7. **The Test alert and Buckholt's Alert semantics.** Alert's canonical
   markup carries `role="alert"`. The spec's "not announced on page load" and
   "polite announcement" rule it out. Built without the role; the spec should
   state it so a production build does not copy the canonical markup.
8. **"Cards share a fixed width" cannot hold with "six in one row at 1440"
   and Figma's 282px at 1920.** Built as equal widths per row from the
   Bootstrap grid (1 / 2 / 3 / 4 / 6 per row). At 1440 six cards are 192px
   wide and titles wrap to two lines. Suggest "equal width within a row".
9. **Menu keyboard model differs from Buckholt's.** The spec has arrow keys
   between items; Buckholt's Menu guidance has Tab / Shift+Tab. Built per
   spec. With one item it does not matter today; decide before the menu grows.
10. **Spacing source.** "Figma for layout" and AGENTS' Frame / Pane / Panel
    rhythm disagree: Figma puts cards 32px below the band and 34px from the
    edge, Buckholt's Frame 64px and 64px. Built Buckholt's. State which wins.
11. **Contract for feature specs: how a feature turns its app on.** Feature
    specs should state two things the shell needs: the app's base-page path
    and which seeds include it. In the prototype both are one line each in
    `shell/ch-registry.js`.
12. **Direct links to a hidden app.** Defined only for an environment
    switch (SH-01 step 7). Built: a direct URL to an app not visible in the
    current environment goes home, silently. Confirm, or specify an
    announcement.
13. **Breadcrumb on a base page links to itself.** "User Management > Users"
    with "User Management" linking to the base page means, on Users, a link
    to the current page. Built as specified; Open question 6 may want to
    cover it.
14. **Single-environment Live.** "Not seeded; included for completeness."
    The shell supports it (Tag "Live", no alert); add a seed if it should be
    testable.
15. **Readiness checklist.** The screenshot item can now be ticked; the
    "checked against the live repo" item is answered by section C (all eight
    gaps confirmed, none dropped; Logout label "Logout").
16. **Minor:** the breadcrumb landmark name is "Breadcrumb" in the spec and
    "breadcrumb" in Buckholt's markup. Built with the spec's.

## B. The Figma frames

1. **The environment control is not a Buckholt component.** Figma uses a
   "Select button group" with its own tokens (`ogi-comp-btn-togglegroup-*`,
   selected `#f1f5ff` / `#2249b1`). Built from Buckholt Response button, whose
   checked state is close but not identical (`rgba(15,64,197,.1)` /
   `#3f66d1`). Either map the Figma component to Response button or raise it
   as a new Buckholt variant (C2).
2. **Mobius link icon and colour.** Figma uses a "Launch" icon and body-text
   colour. Buckholt's External link common action is
   `fa-arrow-up-right-from-square` in link colour. Built Buckholt's.
3. **Avatar.** Figma: 44px, mint `#75f4de`, text `#2249b1`. Buckholt Avatar
   documents 48 / 40 / 32px and an expressive palette; neither size nor
   colour matches. Built `avatar-sm` (40px), default colour.
4. **Logout icon.** Figma uses a custom "Actions/ogi-logout" glyph; Buckholt's
   Logout is `fa-arrow-right-from-bracket`. The Release notes item uses the
   "Icon/Misc/Temporary" placeholder.
5. **Menu panel.** Figma: 16px padding, 16px radius, 247px wide. Buckholt
   Menu: its own padding and radius, 160–288px. Built Buckholt's; the long
   default email (`sophie.marchetti@northgate-insurance.co.uk`) wraps at
   288px.
6. **Content spacing and cards.** Cards 32px below the band, 34px from the
   edge, 16px card padding, ~20px titles, illustration inset by the card
   padding. Buckholt: 64px Frame padding, 32px Card padding, `title-03` (24px),
   image full-bleed. Built Buckholt's.
7. **The breadcrumb band is part of the Header frame** ("Breadcrumbs & Tenant
   Information", 52px, `#fdfdfd`, 14px Light text, left and right borders).
   Built as its own band inside Main; same position and size.
8. **No 1440px frame.** All frames are 1920 × 1080, but the spec is
   desktop-first at 1440 and the reference breakpoint is 1088. A 1440 frame
   with six cards would show the title wrapping in B6.
9. **No frames** for the Test alert, the single-environment Tag, the app
   placeholder, the unsaved-changes Modal, the Long names truncation, focus
   states or the skip link. All built from the spec.
10. **The User Management frame's divider is a chevron icon.** Built with
    Breadcrumb's documented `--breadcrumb-divider-icon: '>'` override, which is
    a character, not an icon.
11. **Export size.** The supplied PNGs are 3852 × 2165 — 2x of 1926 × 1082,
    not of the 1920 × 1080 frames, so they include a few pixels of canvas.
    Harmless; noted in case anyone measures from them.

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
