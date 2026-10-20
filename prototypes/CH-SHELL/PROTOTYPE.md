# CH-SHELL — Configuration Hub shell prototype

> **Not Buckholt.** Application work built *with* Buckholt. Nothing here is
> design-system guidance; see [`../README.md`](../README.md).

Built from [`ch-shell-spec.md`](ch-shell-spec.md) **revision 4** (20 Oct 2026)
and the four frames in [`screenshots/`](screenshots/). First built 20 Oct 2026
against revision 3; updated to revision 4 the same day.

## Open it

| Page | Screen | URL |
|---|---|---|
| Home | SH-00-01, SH-00-02, SH-00-03 | `index.html` |
| App placeholder | SH-03-01 | `app.html?app=<registry id>` — reached from any Open button |

Seed variants have no visible UI. Add `?seed=` to any CH page:
`northgate` (default), `long-names`, `all-apps`, `test-only`,
`staged-rollout`, `live-only`. The choice is kept for the rest of the browser
tab; `?seed=northgate` goes back.

## What was built

- **SH-00 · Home.** Header, breadcrumb band ("Applications", current page), a
  visually hidden level 1 heading, and one Card per visible app in registry
  order. Three cards in the default seed, six with `all-apps`: six per row at
  1920px, four at 1440px, three at 1088px.
- **SH-00-02 · Test.** The Test alert under the header, `[Test] ` in the
  document title, the Test card set.
- **SH-00-03 · One environment.** A read-only Tag in place of the
  environment control: "Test" with the alert (`test-only`), or "Live" with no
  alert (`live-only`).
- **SH-01 · Switch environment.** On the home page: in place, focus stays on
  the option, polite announcement. Inside an app: a full load of the app's
  base page (so feature state resets and focus starts at the top), with the
  announcement on arrival. App not available in the new environment: the home
  page, with the "{App} isn't available in {Env}." announcement. The
  unsaved-changes Modal when the page reports unsaved changes.
- **SH-02 · Avatar menu.** Identity header (avatar, name, email), one divider,
  Logout. No Release notes, no second divider, no unread indicator.
- **SH-03 · Open and breadcrumbs.** Open goes to the app's feature prototype
  if the registry has one, otherwise to SH-03-01.
- **Focus on navigation.** Every navigation — Open, a breadcrumb link, the
  lockup, "Back to applications", an environment switch inside an app — is a
  full page load. The shell moves no focus: focus starts at the top of the
  document, the next Tab reaches the skip link, and the screen reader
  announces the new document title. No page in the shell changes without a
  full load, so there is no page-load behaviour to reproduce. (The home page's
  environment switch updates the page in place but is not a page change;
  focus stays on the option, as SH-01 step 6 says.)
- **Direct link to a hidden app** opens the home page with no message
  (`location.replace`, so Back does not return to the dead URL). An unknown
  app id does the same.
- **Skip link** on every page; **sticky header**.

### Logout

Label **"Logout"**, icon **`fa-regular fa-arrow-right-from-bracket`**, both
taken from Buckholt's Logout common action
(`patterns/common-actions/rules.md`, and `foundations/iconography/catalogue.md`
row "Logout").

### Inert areas

| Element | In the prototype |
|---|---|
| Mobius link | Real link appearance, `target="_blank"`, name "Mobius (opens in a new tab)". Activating it does nothing. |
| Logout | Real menu item. Activating it closes the menu and returns focus to the avatar. Nothing else. |

## How the shell is shared

**Decision: the shell lives in `prototypes/CH-SHELL/shell/`, and every CH
feature prototype loads it from there by relative path.** Nothing is copied.

```text
prototypes/CH-SHELL/
├── index.html, app.html      the shell's own pages (home, placeholder)
├── shell/
│   ├── ch-registry.js        app registry + seed data (data only)
│   ├── ch-shell.js           CHShell: renders and runs the chrome
│   └── ch-shell.css          the gap work and the card grid, nothing else
└── assets/                   lockup + six card illustrations, as supplied
```

Why here and not in `prototypes/shared/` next to `app-shell`:

- `prototypes/shared/` is the **Mobius PAS** chrome. CH is a different product
  with a different top bar; putting both side by side invites one to borrow
  from the other.
- The shell, its spec, its assets, its screenshots and its tests change
  together. Keeping them in one folder means one place to look, and the
  shell's own pages are the reference implementation every feature can be
  checked against.
- Every URL inside the shell (assets, home, placeholder) is resolved from
  `ch-shell.js`'s own location, so the folder can be moved without editing the
  code.

Why the chrome is **rendered by script**, when `prototypes/shared/` keeps the
Mobius chrome markup in each page: the CH chrome is data-driven (organisation,
environments, user, Live/Test state, alert) and changes in place. Writing it
into each page would mean every feature copying ~80 lines of markup and then
keeping them in step, which is exactly what the brief rules out. A page keeps
its own landmarks, so the structure is still readable in the source.

### Using the shell in a CH feature prototype

```html
<link rel="stylesheet" href="../../css/buckholt.css">
<link rel="stylesheet" href="../../css/buckholt-ai-fixes.css">
<link rel="stylesheet" href="../CH-SHELL/shell/ch-shell.css">
…
<div class="layout" data-layout="layout-03" data-layout-surface="flush">
  <header id="ch-header"></header>
  <main id="main">
    <div id="ch-context"></div>                   <!-- Test alert + breadcrumb band -->
    <section class="page-body">…</section>
  </main>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="../CH-SHELL/shell/ch-registry.js"></script>
<script src="../CH-SHELL/shell/ch-shell.js"></script>
<script>
  CHShell.init({
    app: 'user-management',                       // registry id
    page: 'Users',                                // → "Users | User Management | Configuration Hub"
    breadcrumb: [
      { label: 'User Management', href: 'index.html' },
      { label: 'Users' }                          // last crumb = current page
    ],
    hasUnsavedChanges: () => form.isDirty         // optional; or CHShell.setUnsavedChanges(true)
  });
  CHShell.environment;                            // 'live' | 'test'
</script>
```

Then, in `shell/ch-registry.js`, set the app's `basePage` (relative to
`prototypes/CH-SHELL/`) and add its id to the seed lists the feature spec
names. That is the only edit a feature makes to the shell, and it is what the
spec's contract now asks every feature spec to state.

Links need nothing from the shell: use ordinary links, and let every page
change be a full load. A feature that changes views without a load (a
single-page flow) must reproduce page-load behaviour itself — focus to the top
of the document and the new title announced. Feature state must not survive
an environment switch: the shell reloads the base page, so anything held in
memory resets by itself.

## Page structure

Header and Main only — Buckholt `layout-03` with no sidebar or footer, flush
surface. Main holds the context band first (Test alert, breadcrumb band), then
Page body → Frame → Pane → Panel. The cards sit in the Panel in a CSS grid
(see judgement call 13).

## Buckholt components used

| Component | Where | Notes |
|---|---|---|
| Page layout | Every page | `layout-03`, Page body / Frame / Pane / Panel |
| Response button | Environment control | Native radios, `.btn-check` + `.btn.btn-response`; drawn as a compact pill (Gap 2) |
| Tag | Single-environment indicator | Base `.tag > .tag-label` |
| Alert | Test alert | `.alert-info` with its documented icon; full width, no role, paragraph message (Gap 3) |
| Link | Mobius link, "Back to applications" | `.link-standalone`, with `.icon` for Mobius |
| Avatar | Avatar button, identity header | `.avatar.avatar-sm > .avatar-initials` |
| Menu button / Menu | Avatar menu | `.menu`, `.menu-toggle`, `.menu-panel.dropdown-menu`, `.menu-body`, `.menu-divider`, `.menu-item` with icon; Buckholt's own panel padding, radius and width |
| Breadcrumb | Breadcrumb band | Documented markup and Buckholt's default divider |
| Tooltip | Avatar, truncated organisation name and crumbs | Code & specs example 3 options |
| Card | App cards | `.card`, direct-child `img.card-img`, `.card-body > .text-block` |
| Button | Open | `.btn.btn-primary > .button-label`, on a link |
| Modal | Unsaved-changes confirmation | Code & specs example 1 |
| Typography | Throughout | `title-02` (card titles), `title-01`, `body-01`, `headline-02` |
| Common actions | Logout, External link | Labels and icons as documented |

## Buckholt gaps — all eight still gaps, all built here

Each was checked against the repository on 20 Oct 2026: `components/`,
`foundations/`, `patterns/` and the 40 saved Code & specs pages. None is
documented, so none was dropped. All are in `shell/ch-shell.css` /
`shell/ch-shell.js`; none is in `components/`.

| # | Gap | Built as |
|---|---|---|
| 1 | CH top bar | `.ch-bar`: flex row, 84px, 20px inset, 32px gaps; lockup link; reserved slot; `.ch-bar-end` with organisation, environment, Mobius, avatar. Sticky, z-index 1030. Avatar trigger is a bare button around a Buckholt Avatar, with a 16px hit area either side (Figma's Profile frame). |
| 2 | Two-option environment switch | Response button radios in a `role="radiogroup"` named "Environment", in a 1px pill; 34px options; unselected options' border transparent so the selected one is marked by its outline. |
| 3 | Global environment alert | Buckholt info Alert, square corners, inset to line up with the band, rendered into `#ch-context` above the breadcrumb on every page while Test is current. No `role`; the message is a `<p>`, not the canonical `h6`, with the reboot's 4px `p` margin removed so the alert stays the documented 48px. |
| 4 | Menu identity header | `.ch-identity` inside `.menu-panel`, *before* `ul.menu-body`, so it is not an item and has nothing focusable; Tab never stops on it. |
| 5 | Truncating one long crumb label | `max-width: 32ch` with ellipsis on each crumb; when a crumb is actually cut, its full text goes in a Tooltip — on hover and focus for a linked crumb, hover only for the current-page crumb, which is never focusable. |
| 6 | App card illustrations | Supplied SVGs as the Card's `img.card-img`, `alt=""`, full card width at the asset's 250:160 proportions. |
| 7 | Skip link | First element in `<body>`; Bootstrap's `.visually-hidden-focusable` from `buckholt.css`; focuses `<main>`. |
| 8 | App-level header navigation slot | `#ch-app-nav`, empty, `display: none` while empty. |

## Avatar menu semantics

Revision 4 makes the menu keyboard follow Buckholt's Menu guidance — Tab and
Shift+Tab between items — and asks for semantics that match.

**Choice: a disclosure, not an ARIA menu.** The avatar button keeps
`aria-expanded` and gains `aria-controls="ch-account-panel"`; the panel is a
plain list of native buttons. `role="menu"`, `role="menuitem"` and
`role="none"` are not used, and nothing sets `aria-haspopup`.

Why: `role="menu"` tells assistive technology to expect the ARIA menu pattern
— one tab stop, arrow keys between items, typeahead, Tab leaving the menu.
Pairing it with Tab-between-items would announce one model and behave as
another. A disclosure (a button that shows and hides a region of ordinary
buttons) is exactly the Tab model, needs no extra key handling, and every
screen reader handles it. The revision 3 build used `role="menu"` with arrow
keys; both are gone.

What this means for the markup: Buckholt's documented `.menu-body` carries
`role="menu"`. The prototype leaves it off, as an application decision; the
canonical example is untouched. Keyboard as built:

| Key | Effect |
|---|---|
| Enter / Space on the avatar | Opens; focus moves to Logout |
| Tab / Shift+Tab | Move between the avatar and the items; Shift+Tab back to the avatar keeps the menu open |
| Tab past the last item | Closes; focus continues into the page |
| Escape | Closes; focus returns to the avatar (Bootstrap 5.1.3 leaves it on the hidden item, so the shell moves it) |
| Logout | Closes; focus returns to the avatar |
| Click outside | Closes |

## Figma values replaced by Buckholt

Revision 4: "Figma decides arrangement; Buckholt decides sizes, spacing,
colours, icons, typography and component styling." Each difference, once:

| Element | Figma | Built (Buckholt) |
|---|---|---|
| Avatar | 44px, mint `#75f4de`, text `#2249b1` | `avatar-sm` 40px, default expressive colours |
| Menu panel | 16px padding and radius, 247px wide | Buckholt Menu: 16px padding and radius, 160–288px wide (same padding and radius; width from content) |
| Menu icons | Logout "Actions/ogi-logout" glyph | `fa-regular fa-arrow-right-from-bracket` |
| Mobius link | "Launch" icon, body-text colour | `fa-regular fa-arrow-up-right-from-square`, link colour |
| Environment control | "Select button group" (`#f1f5ff` fill, `#2249b1` outline when selected) | Response button checked state (`rgba(15,64,197,.1)`, `#3f66d1`) |
| Breadcrumb divider | Chevron icon | Buckholt's default divider |
| Card padding | 16px | 32px |
| Card title | ~20px | `title-02`, 20px (see judgement call 12) |
| Card illustration | Inset by the card padding | Full card width (Gap 6, "full card width") |
| Content spacing | Cards 32px below the band, 34px from the edge, 32px apart | Frame: 64px below the band and from the edge; Panel gap 32px |
| Header bar | `#dadada` border + a 0.5px / 1.5px drop shadow | `--ui-border-02` + `--shadow-xs` |
| Breadcrumb band | Drawn inside the Header frame | Its own band inside Main, same position and size |

## Deviations and judgement calls

1. **Open is a link styled as a Primary Button**, as revision 4 specifies.
2. **The Test alert has no role and its message is a paragraph**, as
   revision 4 specifies; both depart from Alert's canonical markup.
3. **Avatar menu semantics are a disclosure** — see above.
4. **Escape focus return and Tab-out close are the shell's own.**
   Bootstrap 5.1.3 leaves focus on the hidden item after Escape and closes on
   Tab only on keyup. The Escape listener is on `window` in the capture phase
   because Bootstrap's handler is delegated from `document` in the capture
   phase and stops propagation.
5. **The Tooltip sits on the `.menu` wrapper, not on the avatar button**,
   because the button already has `data-bs-toggle="dropdown"`. This is the
   split Buckholt's own Breadcrumb overflow example uses.
6. **Truncation tooltips are created from script, without
   `data-bs-toggle="tooltip"`**, and placed below. Buckholt restyles
   `a[data-bs-toggle=tooltip]` (inherited colour, dotted underline), which
   would change a truncated breadcrumb link's appearance.
7. **The environment control has no visible label.** Response button's
   canonical wrapper has a visible `.input-label`; the header has no room for
   one and Figma has none, so the group is named with `aria-label`.
8. **Response button sizing needed `min-height` set directly**:
   `.btn-response` sets a literal `min-height: 2.75rem` rather than using
   `--button-height`.
9. **`.link-standalone` is re-centred** in the bar: it sets
   `align-self: flex-start`.
10. **The context band is inside `<main>`**, ahead of Page body. The spec
    wants the breadcrumb outside the page content and the skip link to land in
    Main; inside Main but outside Page body satisfies both, keeps the banner
    landmark to the top bar, and keeps the focus order skip → header →
    breadcrumb → content.
11. **Only the top bar is sticky**, not the alert or the breadcrumb band. The
    environment control in the bar stays visible, and a sticky alert plus band
    would take 100px+ of every screen.
12. **Card titles are `title-02`, not Card's documented `title-03`.** At
    `title-03` the longest title, "Third-Party Services", is 210px; with Card's
    32px padding and 1px border the card must be 276px, but six per row at
    1920px leaves 272px (269px with a classic scrollbar). The spec's own rule
    (six at 1920, titles on one line) and Buckholt's documented Card title
    cannot both hold, so the title drops one step in Buckholt's own title
    scale; type sets document title styles for card headings. Recorded in
    SPEC-CHANGES A.
13. **The card grid is a CSS grid, not Bootstrap's `.row` / `.col`.** The
    rule is a minimum card width (16rem, derived in `ch-shell.css`), which
    Bootstrap's fixed per-breakpoint fractions cannot express — and in the
    local build 1440 and 1920 share a breakpoint tier (≥ 1400) yet need four
    and six columns. `auto-fill` keeps spare tracks empty, so cards stay
    left-aligned and the same width when a row is not full. The gap is the
    Panel's 32px.
14. **`.container-fluid`, not `.container`**, inside the Frame, so the cards
    start at the left edge at every width, as in Figma.
15. **The card image is not cropped.** Buckholt's `.card-img` is a fixed
    10rem box with `object-fit: cover` (correction 6); Gap 6 sizes it by
    aspect ratio instead.
16. **The avatar keeps a 16px hit area either side** (Figma's Profile
    frame). It is arrangement, not styling, and it is also what makes the Long
    names organisation truncate at 1088px in Proxima Soft; without it the name
    fits with 7px to spare and AC 8 fails.
17. **Breadcrumb landmark label is "Breadcrumb"** (spec) where Buckholt's
    markup has "breadcrumb". Case only.
18. **Modal heading is an `h2`** (Code & specs has `h3`), because it is the
    dialog's top-level heading; `aria-labelledby` added.
19. **Seed choice persists for the tab**, like the environment, so a variant
    survives navigation into feature prototypes.
20. **Environment and seed live in `sessionStorage`.** A new tab starts from
    the seed rule (Live if it exists). A page restored from the back/forward
    cache with a stale environment reloads.
21. **Announcements after a page change** are carried across the load in
    `sessionStorage` and written to a polite live region 100ms after the new
    page starts, so they follow the browser's own title announcement rather
    than racing it.

## Tests

`test/ch-shell.js` — **250 assertions**, every acceptance criterion in
revision 4 (blocks `AC 1` to `AC 16`, in the spec's order), the accessibility
requirements, the feature contract and Gap 5. Passes against the offline
mirror and against the real build with Proxima Soft and the Pro kit. See
[`../../test/README.md`](../../test/README.md).

## Known limits

- **Deployment.** GitHub Pages serves this folder verbatim. The Cloudflare
  deployment (`wrangler.jsonc`) is for Mobius navigation only, and
  `.assetsignore` blocks every `*.svg`, so this prototype's lockup and
  illustrations would not load there. If CH is ever deployed to Cloudflare,
  `prototypes/CH-SHELL/assets/` needs allowing.
- **Text widths.** AC 7 and AC 8 depend on the font. Both pass in the
  mirror's Arial and in Proxima Soft; the margins are 13px (card width) and
  25px (header) in Proxima Soft.
- **Not built:** Release Notes, the "app failed to load" modal, loading
  feedback, sign-in, the Open GI staff view and tenant dropdown, and any
  app-level header navigation content — all out of scope in the spec.
