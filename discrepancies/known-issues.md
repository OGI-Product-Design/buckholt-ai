# Buckholt known issues

Current-state register of verified differences between documented Buckholt intent and the runtime in
this repository. It is a working list, not a history: an issue is here because it is still true.

**Scope.** Runtime defects, active compatibility fixes, source/runtime discrepancies, and required
component JavaScript that is not supplied. Historical investigation, superseded fixes and abandoned
audit methods are not kept — the corrections themselves are the record.

**Every active fix lives in `css/buckholt-ai-fixes.css`.** `css/buckholt.css` is the upstream runtime
snapshot and is never edited. Each fix below was re-verified on 7 September 2026 by measuring the
affected property with the compatibility stylesheet removed, and each is re-asserted against the live
runtime by `test/runtime-verification/`, so a fix that stops working reports itself.

The layer holds **6 documented corrections**, expressed as **6 CSS rules**: four entries marked
`ACTIVE FIX`, plus Alert and Toast, whose horizontal half is corrected and whose 4px vertical half
remains `OPEN`. Alert and Toast are separate components and are corrected by separate rules.

> ## ⚠ Read `build-provenance.md` first
>
> **`css/buckholt.css` is not the same build as the live documentation site's
> `compiled.css?v=2.3`.** Established 9 September 2026 by direct diff of the two files:
> 3,538 selectors shared, 83 live-only, 192 local-only, 160 shared but differing. The
> **grid breakpoints differ** — live `896/1088/1312/1520/1720`, ours `576/768/992/1200/1400`
> — so every responsive rule fires at a different width from the live design system.
>
> Two of the corrections below are regressions in **our build only** and render correctly
> on the live site. Two others are unresolved because Buckholt's documentation does not
> establish the fix. See [`build-provenance.md`](build-provenance.md) for the full diff and
> the open questions for Buckholt.

**Dependency-model correction, 8 September 2026.** The repository used to load
`bootstrap@5.1.3/dist/css/bootstrap.min.css` underneath `css/buckholt.css`. That was wrong.
`buckholt.css` is a complete, self-contained Bootstrap **5.3** build with Buckholt as the theme —
its own reboot, containers, grid, utilities and every documented component — and the live Buckholt
documentation site comments the Bootstrap stylesheet out and loads only its own compiled CSS. The
extra stylesheet was a second, older copy of the same framework, and it overrode Buckholt: it
replaced the table text colour, imposed Bootstrap's 3.8px radius on modal corners, drew a competing
SVG cross on every close control, and added a redundant 24px indent to every `.form-check`.

**Seven of the original fourteen corrections existed only to undo that damage and have been
deleted**, along with the sections that documented them: Button mouse-focus, Accordion item rules,
Modal section padding, Toast body padding, the Table `currentColor` rule, Card/Versa-tile link
hover, and the Input-group button radius. Two more were reduced to the half that survives (Close
button, Card image).

**Fix-layer correction, 9 September 2026.** With the live `compiled.css?v=2.3` available, all seven
remaining corrections were re-measured against **both** builds. Two proved inert in both and were
deleted with their sections: the Dropdown caret (`.dropdown-toggle::after` computes `content: none`
in both, so no box is generated) and the `.btn-close` box-sizing rule (`content-box` in both, but
Buckholt sets `padding: 0`, so the control renders 32×32 either way). The remaining five were
reclassified — they are no longer all "defects in Buckholt's own compiled output":

| Correction | Classification |
|---|---|
| 1 Progress bar error icon | Local build regression — live renders correctly |
| 2 Versa-tile action wrap | Local build regression — live renders correctly |
| 3 Alert/Toast close placement | Unresolved — documentation shows two placements |
| 4 Table button-set offset | Unresolved — `.button-set-no-offset` is undocumented |
| 5 Card image `object-fit` | Upstream mismatch — present in both builds |

**Statuses used:** `ACTIVE FIX` (corrected in the compatibility layer) · `OPEN` (verified, not
corrected) · `PRODUCT RESPONSIBILITY` (Buckholt supplies structure and styling, the application
supplies behaviour).

---

## Contents

**Local build regressions** — [Progress bar icon](#progress-bar--error-status-icon-renders-black) ·
[Versa-tile actions](#versa-tile--icon-only-action-set-wraps) ·
[Empty `--card-text`](#card----card-text-is-defined-as-an-empty-value)

**Runtime gap vs documented intent (`ACTIVE FIX` + `OPEN`)** —
[Alert close control](#alert--4px-vertical-offset-of-the-label-when-the-documented-close-control-is-present) ·
[Toast close control](#toast--4px-vertical-offset-of-the-label-when-the-documented-close-control-is-present)

**Unresolved, fix retained (`ACTIVE FIX`)** — [Table action alignment](#table--action-button-set-sits-below-the-row-centre)

**Documentation / newer-CSS version mismatch (`ACTIVE FIX`)** — [Card image](#card--documented-image-markup-is-stretched)

**Dependency requirements** — [Font Awesome Pro required](#font-awesome--the-regular-face-must-carry-the-documented-glyphs)

**Source / runtime discrepancies** — [Frame padding](#page-layout--frame-padding-is-not-64px-on-all-sides) ·
[Harness overflow at 375/320](#runtime-verification-harness--horizontal-overflow-at-375px-and-320px) ·
[Link visited](#link--visited-state-not-implemented) ·
[Radius `full`](#radius--full-name-and-value-disagree) ·
[Unimplemented documented classes](#documented-classes-with-no-implementation-in-either-build) ·
[Group labels](#form-groups--labelfor-with-no-matching-control) · [Text area counter](#text-area--counter-updates-on-keyup-only)

**Required behaviour not supplied** — [Selectable Tag](#tag--selection-and-dismiss) ·
[Selectable Card](#card--selectable-state-and-hit-target) · [Slider](#slider--rangenumber-synchronisation) ·
[Table controller](#table--data-cdt--controller) · [Dropdown single select](#dropdown--single-select-label)

**Source coverage** — [Table](#table--source-partial)

**Build provenance** — [`build-provenance.md`](build-provenance.md). The reference build is now
settled (see below); what remains there is a record of how the local build differs, not an open
question.

---

# Local build regressions

Defects present in **our copy** of `css/buckholt.css` and **not** in the live
`compiled.css?v=2.3`. These are not Buckholt defects. Report them against the build that
produced our file, not against the design system.

## Progress bar — error status icon renders black

- **Status:** `ACTIVE FIX` — **local build regression**, re-verified 9 September 2026 against
  the live stylesheet.
- **Evidence:** our build carries `fill='var%28--error-01%29'`; the live build carries
  `fill='%23D7050C'` and renders correctly. A `data:` URI is an isolated document, so a custom
  property cannot resolve inside it and the fill falls back to black.
- **Cause:** the build that produced our file switched from compile-time literals to runtime
  custom properties without excluding the SVG data URIs. The live file contains **zero**
  `var%28` occurrences; ours contains **nine**.
- **Compatibility fix:** correction 1 — the live build's own literal, byte for byte.
- **Scope:** under-scoped. Patches 1 of 9 occurrences; the other eight are tabulated with their
  live literals in [`build-provenance.md` §6.1](build-provenance.md). They are not patched
  because no page here exercises them.
- **Upstream action:** none against Buckholt. Report the regression against our build.

## Versa-tile — icon-only action set wraps

- **Status:** `ACTIVE FIX` — **local build regression**, re-verified 9 September 2026 against
  the live stylesheet.
- **Evidence:** identical markup, no elision, `.button-set` height — our build **88px
  (wrapped)**; live build **40px (one row)**. Removing `width: 100%` from `.versatile-body`
  in our build also gives 40px, isolating the cause.
- **Cause:** our build declares `.versatile-body { width: 100% }`; live does not. With
  `.versatile-actions` setting no `flex-shrink`, the actions column is compressed and wraps.
- **Correction to an earlier entry:** this was previously recorded as a local markup issue
  caused by the elided `...` in the canonical example. That was wrong — the measurements above
  use plain markup with no elision.
- **Context:** our build also adds `min-width: 0` to `.versatile-content`/`.versatile-body` and
  `overflow: hidden; white-space: nowrap` to `.versatile-label`/`.versatile-text` — a
  truncation redesign live does not have. `width: 100%` looks like part of that work with the
  actions column not re-tested.
- **Compatibility fix:** correction 2.
- **Upstream action:** none against Buckholt. Report the regression against our build.


## Card — `--card-text` is defined as an empty value

- **Status:** `OPEN` — **local build regression**, deliberately not corrected. Reclassified
  9 September 2026 against the live stylesheet.
- **Evidence:** `css/buckholt.css:6820` declares `--card-text: ;` — defined with no value — and
  `:6867` uses it as `color: var(--card-text)`. The declaration is invalid at computed-value time
  and is dropped, so anything relying on the token silently inherits instead.
- **Live:** `compiled.css?v=2.3:5930` declares `--card-text: #1a1a1a` and `:5976` uses it the same
  way. The live build resolves correctly. **This is a defect in the build we hold, not a Buckholt
  defect** — the same family as the two SCSS `null` leaks and the nine `var()`-inside-`data:`-URI
  occurrences recorded in [`build-provenance.md`](build-provenance.md).
- **Correction to an earlier entry:** this was previously recorded as `OPEN` with the note "a
  symptom is corrected — see Card hover". That is no longer true. The Card hover correction was one
  of the nine rules deleted when the separate Bootstrap stylesheet was removed, so no correction for
  this exists in `css/buckholt-ai-fixes.css`.
- **Not corrected here:** adding CSS for it would mean patching a build defect rather than fixing
  the build. The live value is known and recorded, so it can be fixed at source.
- **Upstream action:** none against Buckholt. Report the regression against the build that produced
  `css/buckholt.css`; the live build already carries `#1a1a1a`.

---

# Unresolved — behaviour confirmed, documentation does not establish a fix

Confirmed identically in **both** builds. The obvious remedy in each case would mean editing
canonical Buckholt markup or promoting an undocumented runtime helper, which
`CANONICAL-MARKUP.md` and `CLAUDE.md` forbid. The CSS rule stays until Buckholt clarifies.

## Alert — 4px vertical offset of the label when the documented close control is present

- **Status:** `OPEN` (vertical) — the horizontal half is corrected by **correction 3**.
  Audited independently of Toast on 9 September 2026 against Alert's own Code & specs page.
- **Documented intent.** `code-specs-html/Alert_ code & specs`, section "Close button":

  > "The close button is positioned as the last element **inside the `.alert-content` container**
  > using the `.btn-close` class."

  So the in-content placement is what Buckholt intends. The page's "Animations" code block matches
  that prose; the "Close button" section's own code block places the control as a sibling instead,
  so Buckholt's two documented blocks disagree with each other while the prose does not.
- **Measured against the current reference CSS** (live `compiled.css?v=2.3`), using Alert's own
  documented block:

  | | close vs right edge | close vs text |
  |---|---|---|
  | reference CSS alone | **432px** — against the message text | +4.0px |
  | with correction 3 | **16px** — trailing edge, as documented | +4.0px |

  Identical in the local build. Neither build has any rule for a `.btn-close` inside
  `.alert-content`; the runtime positions the control only through `.alert-dismissible`, which the
  canonical examples never use.
- **Why the 4px happens.** `.alert-content` has `padding: 0.25rem 0.5rem`, so a single-line body is
  exactly 32px — the height of `.btn-close`. Inside the wrapper the button becomes a third item in
  a 24px row: the row grows to 32px, `.alert-body` stretches (no `align-items`, so `stretch`
  applies) and the text sits at its top.
- **Not corrected, and should not be.** `align-items: center` on the content row drops the icon 36px
  in the multi-line case; `align-self: center` on the body shifts the icon 4px in the single-line
  case. Both trade one misalignment for another. No CSS has been added for it.
- **The style guide shows this**, using the documented in-content structure rather than the other
  documented code variant, so the gap is visible rather than hidden.
- **Upstream action:** position the documented in-content close control vertically as well as
  horizontally, and reconcile the "Close button" code block with its own prose.

## Toast — 4px vertical offset of the label when the documented close control is present

- **Status:** `OPEN` (vertical) — the horizontal half is corrected by **correction 4**.
  Audited independently of Alert, against Toast's own Code & specs page. **Alert and Toast are
  different components** (confirmed by Mark, 9 September 2026); that they behave alike here is a
  measured result, not an assumption, and their corrections are kept as separate rules so they can
  diverge.
- **Documented intent.** `code-specs-html/Toast_ code & specs`, section "Close button":

  > "The close button is positioned as the last element **inside the `.toast-content` container**
  > using the `.btn-close` class."

- **Measured against the current reference CSS**, using Toast's own documented block:

  | | close vs right edge | close vs text |
  |---|---|---|
  | reference CSS alone | **186px** | +4.0px |
  | with correction 4 | **16px** | +4.0px |

  Identical in the local build. `.toast-content` carries the same padding and the same absence of
  `align-items` as `.alert-content`, which is why the 4px is the same figure — but it was measured
  on Toast, not inherited from the Alert finding.
- **Not corrected:** as for Alert. Do not merge the two selectors back together.
- **Upstream action:** as for Alert, for Toast.

## Table — action button set sits below the row centre

- **Status:** `ACTIVE FIX` — **unresolved**. Re-verified 9 September 2026.
- **Evidence:** `margin-top: 8px` on a button set in a table cell in **both** builds. Not a
  regression and not specific to the local build.
- **Runtime cause:** Buckholt gives every button set a flow offset,
  `[class$=-set][class|=button] { margin-top: 0.5rem }`. Table cells are not normal flow —
  `.table > :not(caption) > * > *` sets `vertical-align: middle` — so the offset displaces the
  action.
- **Why unresolved:** Buckholt's documented Table markup uses a plain `<div class="button-set">`,
  and no documented Table guidance addresses the offset. There is no documented Table API for
  cancelling it.
- **`.button-set-no-offset` is not the answer.** Mark confirmed on 9 September 2026 that it is an
  **undocumented experimental class and not a Table feature**. It exists in the local
  `css/buckholt.css` only. It must not be used here, added to canonical guidance, or described as
  intended Table API. It is recorded in [`build-provenance.md`](build-provenance.md) as a
  local-build difference and nothing more.
- **Precedent:** Buckholt already cancels the offset inside a component that positions its own
  actions — `.versatile-actions .button-set { margin: 0 }`, present in both builds — but has no
  table equivalent.
- **Compatibility fix:** correction 5, mirroring the Versa-tile reset scoped to table cells.
- **Upstream action:** cancel the button-set flow offset inside table cells, mirroring the existing
  Versa-tile reset.

## Card — documented image markup is stretched

- **Status:** `ACTIVE FIX` — **documentation / newer-CSS version mismatch**. Reclassified
  9 September 2026 on Mark's confirmation.
- **Mark's answer:** the Card image area has been updated recently and **the documentation has not
  caught up with the newer CSS**. This is version skew between two moving parts — **not** an
  upstream Buckholt defect, and not a local build regression.
- **Evidence:** both builds write `.card-img` as a *container* — they size the box
  (`width: 100%; height: var(--card-image-max-height)`) and put the fitting on a child,
  `.card-img img { object-fit: cover }`. The documented example puts the class on the image itself,
  `<img src="..." class="card-img">`, so the child rule never matches. Measured `object-fit: fill`
  in both builds; with correction 6, `cover`.
- **Difference between builds:** the local build adds `aspect-ratio: var(--card-aspect-ratio)` to
  the container; behaviour is otherwise identical.
- **Compatibility fix:** correction 6 applies the fitting the runtime already specifies to the
  element the documented markup actually uses.
- **Do not invent canonical markup to reconcile this.** The documented example stays as documented;
  the correction bridges the gap until the documentation catches up.
- **Upstream action:** refresh the Card documentation against the current CSS.

---

# Dependency requirements

## Font Awesome — the regular face must carry the documented glyphs

- **Status:** `OPEN` — a requirement on the kit, not a repository defect
- **Evidence:** rendering the canonical Alert, Tag and Link against **Font Awesome Free 6**, the
  close control shows a `.notdef` tofu box rather than a cross, as do `fa-regular fa-ghost` and
  `fa-regular fa-arrow-right`.
- **Cause:** Buckholt draws the close icon as `content: "\f00d"` with `font: var(--fa-font-regular)`
  — the Font Awesome **regular (400)** face — and the documented component markup uses `fa-regular`
  throughout. In Font Awesome 6 the regular face is a **Pro** style; the Free regular face carries
  only a small subset and not these glyphs.
- **Consequence:** with a Free kit, most Buckholt icons render as boxes. This became visible rather
  than hidden once the compatibility layer removed Bootstrap's competing SVG cross, which had been
  accidentally covering for the missing close glyph — and only that one.
- **Requirement:** the documented runtime contract names kit `ca92816a31`. That kit must be a Pro kit,
  or one whose regular face includes the documented glyphs.
- **Detection:** `test/runtime-verification/` measures the glyph's advance width against a codepoint
  no font defines and reports a `DEPENDENCY ISSUE` if they match, so this can no longer fail
  silently.
- **Upstream action:** confirm the kit tier is intended, or give `.btn-close::before` a fallback so a
  Free kit degrades to a visible cross rather than a box.

---

# Source / runtime discrepancies

Documentation and runtime materially disagree. Neither is silently rewritten.

## Runtime-verification harness — horizontal overflow at 375px and 320px

- **Status:** `OPEN` — measured, not corrected. Pre-existing: identical at commit `8f327f3`, and
  `test/runtime-verification/index.html` has not changed since.
- **Evidence:** at both 375px and 320px the document reports `scrollWidth: 512` against the
  viewport width. 17 elements exceed the viewport: one is harness chrome (`table.rv-table`, the
  results table) and **16 sit inside `.rv-canonical`** — Buckholt markup. Giving the harness table
  its own scroll container does not help; `scrollWidth` stays 512.
- **Narrowest reproduction:** a `.card-body` computes **384px wide inside a 222px `.card`** at
  320px. Its ancestor chain carries no `min-width` above `0`/`auto` and no `max-width` below the
  shell's 1152px, so the width is coming from the component itself. `.key-value-item` and
  `.progress` overflow the same way.
- **Scope — this is not the style guide.** `test/style-guide/` reports **zero** document-level
  horizontal overflow at 1440, 768, 375 and 320, re-confirmed 9 September 2026. The claims in
  `responsive/component-guidance.md` and `verification/runtime-status.md` are explicitly scoped to
  the style guide and remain accurate; `FINAL-STATE.md` stated it unscoped and has been corrected.
- **Why it is not simply a defect:** the harness renders each documented example verbatim and
  deliberately unwrapped — no `.container`, no grid column, none of the responsive scaffolding a
  real page supplies. Whether these components are expected to survive a 320px viewport
  unwrapped is exactly what has not been established.
- **Not fixed here:** correcting it would mean adding CSS or altering canonical markup, neither of
  which is warranted before the behaviour is classified. Needs its own investigation against the
  live build, bearing in mind that the local breakpoint scale differs from live
  ([`build-provenance.md`](build-provenance.md)) — so the width at which any responsive rule
  engages is itself in question.

## Link — visited state not implemented

- **Status:** `OPEN` — deliberately not corrected
- **Evidence:** the Link Style documentation defines a visited colour of Expressive secondary deep
  (`#5731d6`); `css/buckholt.css` contains no `:visited` rule at all.
- **Why not corrected:** an earlier compatibility rule applied it and was removed. In any single-page
  reference or prototype every `href="#section"` anchor becomes `:visited` as soon as it is used, so
  links render purple where the documentation shows them blue. A compatibility layer should not force
  a state that only makes sense under real navigation.
- **Application guidance:** a product doing real navigation can opt in deliberately, scoped to inline
  links and `.link-standalone`.
- **Upstream action:** implement `:visited` in the runtime, scoped to the Link component.

## Page layout — Frame padding is not 64px on all sides

- **Status:** `OPEN` — documentation and runtime disagree; nothing corrected, no CSS added.
- **Documented:** `patterns/page-layout/rules.md` line 72 states the Frame's padding as
  **4rem / 64px**, without distinguishing axes.
- **Measured:** `padding-top` / `padding-bottom` **64px**, `padding-left` / `padding-right`
  **48px** — identically in `css/buckholt.css` and in the live `compiled.css?v=2.3`, at 1440px,
  1000px and 768px. Both builds derive the horizontal value the same way:

  | | declaration |
  |---|---|
  | live | `padding: var(--page-body-spacing-y) calc(var(--page-body-spacing-x) - 1rem)` |
  | ours | `--page-frame-padding-x: calc(var(--page-body-spacing-x) - calc(2rem * 0.5))` |

  `--page-body-spacing-x` is `4rem` in both, and the subtracted `1rem` is exactly half the
  Bootstrap container gutter (`--bs-gutter-x: 2rem`), which `.container` re-adds as its own
  `padding-left`/`padding-right`. Both builds also define `.page-frame > .container`.
- **Reading:** the 64px figure is probably correct as *intent* — content inside the expected
  `.container` child does sit 64px from the frame edge (measured 48 + 16). The documentation is
  imprecise rather than wrong: it describes the effective content inset, not the Frame's own
  padding. An implementation that reproduces `padding: 4rem` literally, or that omits the
  `.container`, will be 16px out on each side.
- **Not changed:** `patterns/page-layout/rules.md` transcribes documented Buckholt intent and is
  not rewritten from runtime measurement. `CLAUDE.md`, `README.md` and `mobius/README.md`
  summarise runtime behaviour and have been corrected to state both axes.
- **Build difference:** below 768px `css/buckholt.css` sets `--page-body-spacing-x: 2rem`,
  narrowing the Frame's horizontal padding to **16px**. The live build has no such override and
  stays at 48px at every width. Recorded in
  [`build-provenance.md`](build-provenance.md); the breakpoint scale itself also differs.
- **Upstream action:** confirm whether 4rem describes the Frame's padding or the content inset,
  and whether the sub-768px narrowing is intended.

## Radius — `full` name and value disagree

- **Status:** `OPEN`
- **Evidence:** the documentation defines `full` as `2rem` / 32px. The runtime
  `--border-radius-full` is `625rem`, and `2rem` is exposed as `--border-radius-xxl`.
- **Consequence:** the two names must not be treated as equivalent. Do not remap one to the other
  while this stands.
- **Upstream action:** reconcile the token name with its value.

## Documented classes with no implementation in either build

- **Status:** `OPEN` — informational. Recorded 9 September 2026. Nothing corrected.
- **Evidence:** several classes used in canonical markup carry no rule in `css/buckholt.css` **or**
  the live `compiled.css?v=2.3`. They divide into three groups:

  | Group | Classes | Assessment |
  |---|---|---|
  | **JavaScript hooks** | `.step-add`, `.step-btn`, `.step-minus`, `.counting` (`form.js`), `.tab-scroll-left`, `.tab-scroll-right` (`tabs.js`), `.dropdown-label` (`dropdown.js`) | **Not a gap.** The supplied component scripts bind to them. |
  | **Structural / semantic hooks** | `.alert-body`, `.alert-note`, `.toast-note`, `.avatar-img`, `.avatar-initials`, `.data-number`, `.no-italics`, `.table-sort-header`, `.table-checkbox-header`, `.expressive-primary`, `.multi-input`, `.textarea-input`, `.submenu-item-selectable` | Carry meaning in the DOM but no styling. Harmless; an application may target them. |
  | **WordPress wrappers** | `.wp-block-acf-tabs`, `.element_block`, `.align`, `.simple_table` | **Not Buckholt API.** Mark confirmed 9 September 2026 that these are WordPress-added wrappers; ignore them. Preserved in canonical markup because they sit inside the documented code block, but they carry no Buckholt meaning and applications should omit them. |

- **Why this is not a defect list:** per `CLAUDE.md`'s evidence discipline, a class is not missing
  merely because no rule exists. These are identical in both builds, so none is a local build
  regression. The list exists so a future agent does not "fix" a rendering by inventing rules for
  them, and does not delete them from canonical markup for being unstyled.

## Form groups — `label[for]` with no matching control

- **Status:** `OPEN` — **confirmed against the source, 9 September 2026.** The unmatched sets are
  identical in `code-specs-html/` and in this repository (Checkbox 4, Radio 5, Response button 7),
  so the transcription is faithful and the gap is upstream.
- **Evidence:** canonical Checkbox, Radio, Response button and Lookup sources contain group labels
  such as `<label for="checkInputExample">` where no element carries that id — the group's controls
  each have their own.
- **Assessment:** this appears deliberate in the source rather than a transcription error, but a
  `for` pointing at nothing is inert for assistive technology.
- **Do not:** invent ids in canonical markup to make them resolve.
- **Upstream action:** confirm whether these should be `<fieldset>` / `<legend>` or
  `aria-labelledby`, and correct at source.

## Text area — counter updates on `keyup` only

- **Status:** `OPEN`
- **Evidence:** `components/form/form.js` binds the character counter with `$('textarea').keyup(...)`.
- **Consequence:** paste by mouse, autofill and programmatic changes do not update the count.
- **Do not:** duplicate the behaviour in a prototype script; that would present harness code as
  design-system behaviour.
- **Upstream action:** bind `input` rather than `keyup`.

---

# Required behaviour not supplied

Buckholt supplies the structure and the styling. No script in this repository supplies the behaviour.
These are not defects; they are the boundary between the design system and the product.

`test/style-guide/style-guide.js` stands in for several of them so the catalogue can be seen working.
That file is page-level only and is not a Buckholt API — each block is deleted when an upstream script
provides the behaviour. `test/runtime-verification/` deliberately does **not** implement any of them.

## Tag — selection and dismiss

- **Status:** `PRODUCT RESPONSIBILITY`
- **Evidence:** two independent gaps. The runtime hides the control with
  `.tag-selectable input { display: none }` and the canonical wrapper is a `<span>` with no `for`/`id`
  association, so a click never reaches the input. Separately, the selected appearance is keyed off
  `.tag-selectable.active` while the canonical markup carries `aria-selected`, and nothing sets
  `.active`. The runtime also styles `.tag-selectable:focus-visible`, implying the tag should be
  focusable, but the markup carries no `tabindex` or `role`. The dismissible Tag's close button
  carries no `data-bs-dismiss` and no script binds it.
- **Upstream action:** make the wrapper a `<label>` (or add `for`/`id`) and key the selected state off
  `:has(:checked)`, or ship the script.

## Card — selectable state and hit target

- **Status:** `PRODUCT RESPONSIBILITY`
- **Evidence:** two gaps. `.card-selectable.active` supplies the selected fill and border, but nothing
  adds `.active` when the nested control changes — the runtime has no `:has(:checked)` equivalent.
  And the runtime sets `cursor: pointer` on the whole card, declaring the whole card to be the hit
  target, while the canonical wrapper is a `<div>` rather than a `<label>` with no `for` association:
  measured, the clickable area is the 16×16 control, **0.43% of the card**. Clicking the card body
  selects nothing.
- **Upstream action:** make the wrapper a `<label>` (or add `for`/`id`), and key the selected state
  off `:has(:checked)` — or ship the script. `cursor: pointer` on a 0.43% hit target is a promise the
  markup cannot keep.

## Slider — range/number synchronisation

- **Status:** `PRODUCT RESPONSIBILITY`
- **Evidence:** the documented Slider pairs a range input with a number field. `form.js` covers the
  Number input steppers but not this pairing.

## Table — `data-cdt-*` controller

- **Status:** `PRODUCT RESPONSIBILITY`
- **Evidence:** the canonical selection/sorting example carries `data-cdt-table` and
  `data-cdt-select-column`, implying a table controller that is not in this repository.
- **Note:** `components/table/rules.md` forbids inventing data-grid behaviour, so the attributes are
  preserved and left inert.

## Dropdown — single-select label

- **Status:** `PRODUCT RESPONSIBILITY`
- **Evidence:** `components/dropdown/dropdown.js` handles the enhancement, including multi-select
  chips. Reflecting a single-select choice back into `.dropdown-label` and keeping `aria-selected` in
  step is application work.

---

# Source coverage

## Table — source partial

- **Status:** `OPEN`
- **Evidence:** `components/table/examples.html` came from a Usage page only; no complete Code & specs
  source was supplied.
- **Consequence:** Table cannot move to `RUNTIME VERIFIED`, and the missing variants must not be
  invented. The markup that *is* evidenced can be runtime-tested normally.
- **Upstream action:** supply the Table Code & specs page.

---

# Where to look

| Question | File |
| --- | --- |
| What does Buckholt look like? | `test/style-guide/` |
| Does the documented markup render and behave correctly? | `test/runtime-verification/` |
| What corrections are active, and why? | `css/buckholt-ai-fixes.css` |
| Is a component's source verified? | `verification/component-source-status.md` |
| Is a component's runtime verified? | `verification/runtime-status.md` |
| How do I classify a new finding? | `verification/runtime-verification-framework.md` |
| What should an application do on small screens? | `responsive/component-guidance.md` |
