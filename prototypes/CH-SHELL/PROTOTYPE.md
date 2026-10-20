# CH-SHELL — Configuration Hub shell prototype

> **Not Buckholt.** Application work built *with* Buckholt. Nothing here is
> design-system guidance; see [`../README.md`](../README.md).

Built from [`ch-shell-spec.md`](ch-shell-spec.md) (revision 3, 19 Oct 2026)
and the four frames in [`screenshots/`](screenshots/). Built 20 Oct 2026.

## Open it

| Page | Screen | URL |
|---|---|---|
| Home | SH-00-01, SH-00-02, SH-00-03 | `index.html` |
| App placeholder | SH-03-01 | `app.html?app=<registry id>` — reached from any Open button |

Seed variants have no visible UI. Add `?seed=` to any CH page:
`northgate` (default), `long-names`, `all-apps`, `test-only`, `staged-rollout`.
The choice is kept for the rest of the browser tab; `?seed=northgate` goes back.

## What was built

- **SH-00 · Home.** Header, breadcrumb band ("Applications", current page), a
  visually hidden level 1 heading, and one Card per visible app in registry
  order. Three cards in the default seed, six with `all-apps`.
- **SH-00-02 · Test.** The Test alert under the header, `[Test] ` in the
  document title, the Test card set.
- **SH-00-03 · One environment.** A read-only Tag in place of the
  environment control. A Live-only organisation gets a "Live" Tag and no
  alert; that case is not seeded but the shell handles it.
- **SH-01 · Switch environment.** On the home page: in place, focus stays on
  the option, polite announcement. Inside an app: a fresh load of the app's
  base page (so feature state resets), focus on the level 1 heading,
  announcement on arrival. App not available in the new environment: the home
  page, with the "{App} isn't available in {Env}." announcement. The
  unsaved-changes Modal when the page reports unsaved changes.
- **SH-02 · Avatar menu.** Identity header (avatar, name, email), one divider,
  Logout. No Release notes, no second divider, no unread indicator.
- **SH-03 · Open and breadcrumbs.** Open goes to the app's feature prototype
  if the registry has one, otherwise to SH-03-01. Focus moves to the new
  page's level 1 heading after Open, a breadcrumb link, the lockup or "Back to
  applications".
- **Skip link** on every page; **sticky header**.

### Logout

Label **"Logout"**, icon **`fa-regular fa-arrow-right-from-bracket`**, both
taken from Buckholt's Logout common action
(`patterns/common-actions/rules.md`, and `foundations/iconography/catalogue.md`
row "Logout"). Figma also shows "Logout", with a different icon.

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
│   └── ch-shell.css          the gap work, and nothing else
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
asks for. That is the only edit a feature makes to the shell.

Add `data-ch-nav` to any in-app link that should move focus to the next
page's heading. Feature state must not survive an environment switch: the
shell reloads the base page, so anything held in memory resets by itself.

## Page structure

Header and Main only — Buckholt `layout-03` with no sidebar or footer, flush
surface. Main holds the context band first (Test alert, breadcrumb band), then
Page body → Frame → Pane → Panel. The cards are a Bootstrap `.row` with
`row-cols-*` inside the Panel.

## Buckholt components used

| Component | Where | Notes |
|---|---|---|
| Page layout | Every page | `layout-03`, Page body / Frame / Pane / Panel |
| Response button | Environment control | Native radios, `.btn-check` + `.btn.btn-response`; drawn as a compact pill (Gap 2) |
| Tag | Single-environment indicator | Base `.tag > .tag-label` |
| Alert | Test alert | `.alert-info` with its documented icon; full width (Gap 3) |
| Link | Mobius link, "Back to applications" | `.link-standalone`, with `.icon` for Mobius |
| Avatar | Avatar button, identity header | `.avatar.avatar-sm > .avatar-initials` |
| Menu button / Menu | Avatar menu | `.menu`, `.menu-toggle`, `.menu-panel.dropdown-menu`, `.menu-body`, `.menu-divider`, `.menu-item` with icon |
| Breadcrumb | Breadcrumb band | Documented markup, divider set with the documented `--breadcrumb-divider-icon` override |
| Tooltip | Avatar, truncated organisation name and crumbs | Code & specs example 3 options |
| Card | App cards | `.card`, direct-child `img.card-img`, `.card-body > .text-block` |
| Button | Open | `.btn.btn-primary > .button-label` |
| Modal | Unsaved-changes confirmation | Code & specs example 1 |
| Typography | Throughout | `title-03`, `title-01`, `body-01`, `headline-02` |
| Common actions | Logout, External link | Labels and icons as documented |

## Buckholt gaps — all eight still gaps, all built here

Each was checked against the repository on 20 Oct 2026: `components/`,
`foundations/`, `patterns/` and the 40 saved Code & specs pages. None is now
documented, so none was dropped. All are in `shell/ch-shell.css` /
`shell/ch-shell.js`; none is in `components/`.

| # | Gap | Built as |
|---|---|---|
| 1 | CH top bar | `.ch-bar`: flex row, 84px, 20px inset, 32px gaps; lockup link; reserved slot; `.ch-bar-end` with organisation, environment, Mobius, avatar. Sticky, z-index 1030. Avatar trigger is a bare button around a Buckholt Avatar, padded 16px either side as Figma's Profile frame is. |
| 2 | Two-option environment switch | Response button radios in a `role="radiogroup"` named "Environment", in a 1px pill; 34px options; unselected options' border transparent so the selected one is marked by its outline. |
| 3 | Global environment alert | Buckholt info Alert, square corners, inset to line up with the band, rendered into `#ch-context` above the breadcrumb on every page while Test is current. No `role="alert"`. |
| 4 | Menu identity header | `.ch-identity` inside `.menu-panel`, *before* `ul.menu-body` — outside the `role="menu"` list, so it is not an item and arrow keys never reach it. |
| 5 | Breadcrumb truncation | `max-width: 32ch` with ellipsis on each crumb; when a crumb is actually cut, its full text goes in a Tooltip, and a cut current-page crumb gets a tab stop so the Tooltip is reachable by keyboard. |
| 6 | App card illustrations | Supplied SVGs as the Card's `img.card-img`, `alt=""`, full card width at the asset's 250:160 proportions. |
| 7 | Skip link | First element in `<body>`; Bootstrap's `.visually-hidden-focusable` from `buckholt.css`; focuses `<main>`. |
| 8 | App-level header navigation slot | `#ch-app-nav`, empty, `display: none` while empty. |

## Deviations and judgement calls

1. **Open is a link styled as a Button**, `<a class="btn btn-primary">`.
   Buckholt says Button for actions, Link for navigation; Open navigates. The
   visual is the documented Primary Button.
2. **The Test alert has no `role="alert"`**, although Alert's canonical markup
   carries one. The spec says the alert must not be announced on page load and
   that the switch has its own polite announcement; a live alert inserted on
   every switch would announce twice, assertively. Gap 3 owns this.
3. **The alert's message stays an `h6`**, as Alert's Code & specs has it. It
   puts a heading before the page's `h1` in the outline; recorded in
   SPEC-CHANGES C.
4. **Menu items carry `role="menuitem"` and their `li` carry `role="none"`.**
   Buckholt's Menu markup puts buttons straight into `role="menu"`, which is
   invalid ARIA. Application addition; the canonical example is untouched.
5. **Menu keyboard support is the shell's own.** Bootstrap 5.1.3 only moves
   between `.dropdown-item`s, and Buckholt's `menu.js` is not in the
   repository. The shell adds: focus to Logout on open, arrow keys between
   items, focus back to the avatar after Escape or Logout, close on Tab out.
   It listens on `window` in the capture phase because Bootstrap's handler is
   delegated from `document` in the capture phase and stops propagation.
6. **Arrow keys, not Tab, move between menu items**, as the spec says.
   Buckholt's Menu guidance says Tab / Shift+Tab; with one item it makes no
   difference, and Tab closes the menu.
7. **The Tooltip sits on the `.menu` wrapper, not on the avatar button**,
   because the button already has `data-bs-toggle="dropdown"`. This is the
   split Buckholt's own Breadcrumb overflow example uses.
8. **Truncation tooltips are created from script, without
   `data-bs-toggle="tooltip"`**, and placed below. Buckholt restyles
   `a[data-bs-toggle=tooltip]` (inherited colour, dotted underline), which
   would change a truncated breadcrumb link's appearance.
9. **The organisation name gets a tab stop only while it is truncated**, so
   its Tooltip is reachable "on hover and focus" as the spec requires. The
   spec's focus order does not list it; SPEC-CHANGES A.
10. **The environment control has no visible label.** Response button's
    canonical wrapper has a visible `.input-label`; the header has no room for
    one and Figma has none, so the group is named with `aria-label`.
11. **Response button sizing needed `min-height` set directly**:
    `.btn-response` sets a literal `min-height: 2.75rem` rather than using
    `--button-height`.
12. **`.link-standalone` is re-centred** in the bar: it sets
    `align-self: flex-start`.
13. **The context band is inside `<main>`**, ahead of Page body. The spec
    wants the breadcrumb outside the page content and the skip link to land in
    Main; inside Main but outside Page body satisfies both, keeps the banner
    landmark to the top bar, and keeps the focus order skip → header →
    breadcrumb → content. Figma groups the band with the header.
14. **Only the top bar is sticky**, not the alert or the breadcrumb band. The
    spec makes the header sticky; the environment control in the bar stays
    visible, and a sticky alert plus band would take 100px+ of every screen.
15. **Spacing is Buckholt's, not Figma's.** Frame padding puts the cards 64px
    below the band and 64px from the edge; Figma has 32px and 34px. Card
    padding is Buckholt's 32px (Figma 16px) and card titles are `title-03`
    (24px, from Card's Code & specs; Figma ~20px). At 1440px with six cards,
    titles wrap to two lines.
16. **`.container-fluid`, not `.container`**, inside the Frame, so the cards
    start at the left edge at every width as in Figma rather than centring in
    a 1320px column.
17. **Card widths are equal per row, set by `row-cols-*`**: 1 / 2 (sm) / 3
    (md) / 4 (lg) / 6 (xl) per row. "Fixed width" in the spec is read as
    "equal width within the layout", because a literally fixed width cannot
    also give six in a row at 1440 and Figma's 282px at 1920.
18. **The card image is not cropped.** Buckholt's `.card-img` is a fixed
    10rem box with `object-fit: cover` (correction 6), which cuts the sides
    off the illustrations at 190px wide; Gap 6 sizes it by aspect ratio.
19. **Avatar is `avatar-sm` (40px) in Buckholt's default colours.** Figma
    has 44px, mint. Buckholt Avatar documents 48 / 40 / 32 and an expressive
    palette; nothing documented matches Figma exactly, so the closest size and
    the default colour are used.
20. **Mobius link uses Buckholt's External link icon and link colour.** Figma
    uses a "Launch" icon and body-text colour.
21. **Breadcrumb landmark label is "Breadcrumb"** (spec) where Buckholt's
    markup has "breadcrumb". Case only.
22. **Modal heading is an `h2`** (Code & specs has `h3`), because it is the
    dialog's top-level heading; `aria-labelledby` added.
23. **Seed choice persists for the tab**, like the environment, so a variant
    survives navigation into feature prototypes.
24. **Environment and seed live in `sessionStorage`.** A new tab starts from
    the seed rule (Live if it exists), as the spec asks. A page restored from
    the back/forward cache with a stale environment reloads.
25. **A direct URL to an app that is not visible in the current environment
    goes to the home page**, silently. The spec defines this only for an
    environment switch.

## Tests

`test/ch-shell.js` — **190 assertions**, every acceptance criterion in the
spec (blocks `AC 1` to `AC 14`, in the spec's order), the accessibility
requirements, the feature contract and Gap 5. It passes against the offline
mirror and against the real build with Proxima Soft and the Pro kit. See
[`../../test/README.md`](../../test/README.md).

## Known limits

- **Deployment.** GitHub Pages serves this folder verbatim. The Cloudflare
  deployment (`wrangler.jsonc`) is for Mobius navigation only, and
  `.assetsignore` blocks every `*.svg`, so this prototype's lockup and
  illustrations would not load there. If CH is ever deployed to Cloudflare,
  `prototypes/CH-SHELL/assets/` needs allowing.
- **Text widths.** AC 8 (long names truncate at 1088px) depends on the
  font. It holds in Proxima Soft only because the avatar keeps Figma's 16px
  padding; with no padding the name fits with 7px to spare.
- **Not built:** Release Notes, the "app failed to load" modal, loading
  feedback, sign-in, the Open GI staff view and tenant dropdown, and any
  app-level header navigation content — all out of scope in the spec.
