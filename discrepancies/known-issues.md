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

The layer holds **5 documented corrections** — the entries below marked `ACTIVE FIX` — expressed as
**6 CSS rules**.

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

**Local build regressions (`ACTIVE FIX`)** — [Progress bar icon](#progress-bar--error-status-icon-renders-black) ·
[Versa-tile actions](#versa-tile--icon-only-action-set-wraps)

**Unresolved, fix retained (`ACTIVE FIX`)** — [Alert/Toast close placement](#alert--toast--the-documented-in-content-close-placement-does-not-align-the-same-way) ·
[Table action alignment](#table--action-button-set-sits-below-the-row-centre)

**Upstream markup/CSS mismatch (`ACTIVE FIX`)** — [Card image](#card--documented-image-markup-is-stretched)

**Build provenance (`OPEN`)** — [`build-provenance.md`](build-provenance.md)

**Dependency requirements** — [Font Awesome Pro required](#font-awesome--the-regular-face-must-carry-the-documented-glyphs)

**Source / runtime discrepancies** — [Frame padding](#page-layout--frame-padding-is-not-64px-on-all-sides) ·
[Harness overflow at 375/320](#runtime-verification-harness--horizontal-overflow-at-375px-and-320px) ·
[Link visited](#link--visited-state-not-implemented) ·
[Radius `full`](#radius--full-name-and-value-disagree) · [Empty `--card-text`](#card--card-text-is-defined-as-an-empty-value) ·
[Group labels](#form-groups--label-for-with-no-matching-control) · [Text area counter](#text-area--counter-updates-on-keyup-only)

**Required behaviour not supplied** — [Selectable Tag](#tag--selection-and-dismiss) ·
[Selectable Card](#card--selectable-state) · [Slider](#slider--rangenumber-synchronisation) ·
[Table controller](#table--data-cdt-controller) · [Dropdown single select](#dropdown--single-select-label)

**Source coverage** — [Table](#table--source-partial)

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

---

# Unresolved — behaviour confirmed, documentation does not establish a fix

Confirmed identically in **both** builds. The obvious remedy in each case would mean editing
canonical Buckholt markup or promoting an undocumented runtime helper, which
`CANONICAL-MARKUP.md` and `CLAUDE.md` forbid. The CSS rule stays until Buckholt clarifies.

## Alert / Toast — the documented in-content close placement does not align the same way

- **Status:** `ACTIVE FIX` (horizontal) + `OPEN` (vertical) — **unresolved**. Re-verified
  9 September 2026 against the live stylesheet.
- **This is not a build regression.** `.alert-content` and `.toast-content` are
  **byte-identical** between `css/buckholt.css` and the live `compiled.css?v=2.3`, and the full
  `.btn-close` selector set is identical. Both builds measure the same. The live Buckholt
  documentation site behaves exactly as this repository does.

### Buckholt documents two placements, and they are not interchangeable

| | Documented in | Label offset | Trailing gap | Component height |
|---|---|---|---|---|
| **Sibling** of `.alert-content` / `.toast-content` | Alert "Close button", Toast example 6 | **0.0px** | 8px | 48px |
| **Inside** `.alert-content` / `.toast-content` | Alert "Animations", Toast example 8 | **+4.0px** | 313px (16px with correction 3) | 56px |

Measured across single-line, multi-line, with icon and without; identical in both builds.

**Why the in-content placement does not vertically align.** `.alert-content` has
`padding: 0.25rem 0.5rem`, so a single-line body measures 24 + 4 + 4 = **32px — exactly the
height of `.btn-close`**. Buckholt sized these to match. Placed as a sibling, the two 32px boxes
sit side by side and agree. Placed inside, the button becomes a **third item in a 24px flex row**:
the row grows to the button's 32px, `.alert-body` stretches to fill it (the wrapper sets no
`align-items`, so the default `stretch` applies), and the 24px text line sits at the top of that
box — 4px high. The 8px the component grows by is the same 8px.

**The vertical offset is not corrected, and should not be.** Neither candidate works:
`align-items: center` on the content row drops the icon 36px in the multi-line case;
`align-self: center` on the body shifts the icon 4px in the single-line case. Both trade one
misalignment for another. No CSS has been added for it.

### What the repository does

- **Canonical examples are unchanged.** `components/alert/examples.html`,
  `components/toast/examples.html` and `test/runtime-verification/index.html` preserve **both**
  documented structures exactly. That is what keeps the difference measurable.
- **`test/style-guide/` uses the sibling placement.** It is a composed demonstration page — its
  own preamble says so and points at `test/runtime-verification/` for the exact unmodified markup
  — and its four Alert/Toast instances were never byte-exact transcriptions anyway (the two
  "Dismissible" examples add `.alert-info` / `.toast-info` that the canonical examples do not
  carry; the stacked-container example adds a close button that canonical Toast example 9 does not
  have). Choosing between two documented placements for our own composition is not a rewrite of
  canonical markup.
- **Correction 3 compensates the canonical case only.** Its selector matches the in-content
  placement and nothing else. Measured 9 September 2026:

  | Page | Correction 3 matches | Sibling instances |
  |---|---|---|
  | `test/style-guide/` | **0** | 4 |
  | `test/runtime-verification/` | **2** (canonical Alert + Toast) | 2 |

  It addresses the horizontal offset only, is still required, and is not removed.

### Why it stays unresolved

Both placements are canonical and neither `rules.md` states where the control belongs, so there is
no documented basis for preferring one **in the canonical examples**. Rewriting them from CSS
behaviour is what `CANONICAL-MARKUP.md` forbids.

- **Upstream action:** reconcile the two documented placements, or add a rule that supports the
  in-content one — horizontally *and* vertically.

## Table — action button set sits below the row centre

- **Status:** `ACTIVE FIX` — **unresolved**. Re-verified 9 September 2026 against the live
  stylesheet.
- **Evidence:** `margin-top: 8px` on a button set in a table cell in **both** builds. Not a
  regression.
- **Runtime cause:** Buckholt gives every button set a flow offset,
  `[class$=-set][class|=button] { margin-top: 0.5rem }`. Table cells are not normal flow —
  `.table > :not(caption) > * > *` sets `vertical-align: middle` — so the offset displaces the
  action.
- **Why unresolved:** our build ships an opt-out the live build does not have,
  `[class$=-set][class|=button].button-set-no-offset { margin: 0 }`, and it works (measured 8px
  → 0px). But it is **undocumented** — absent from every `components/`, `patterns/`,
  `foundations/` and `CANONICAL-MARKUP.md` file — and `components/table/examples.html` line 81
  uses a plain `<div class="button-set">`. Adopting it would mean promoting an undocumented
  runtime helper *and* editing canonical Table markup.
- **Precedent:** Buckholt already cancels the offset inside a component that positions its own
  actions, shipping `.versatile-actions .button-set { margin: 0 }` in **both** builds, but has
  no table equivalent.
- **Compatibility fix:** correction 4, mirroring the Versa-tile reset scoped to table cells.
- **Upstream action:** document `.button-set-no-offset`, or add the table-cell reset alongside
  the Versa-tile one.

---

# Upstream markup / CSS mismatch

Present identically in **both** builds. Buckholt's CSS and Buckholt's own documented markup
disagree with each other.

## Card — documented image markup is stretched

- **Status:** `ACTIVE FIX` — **upstream mismatch**, present in both builds. Re-verified
  9 September 2026 against the live stylesheet.
- **Evidence:** `object-fit: fill` measured in **both** builds; the documented image card
  renders a 1.78 natural ratio at 2.10. With correction 5, `cover`.
- **Runtime cause:** both builds write `.card-img` as a *container* — they size the box
  (`width: 100%; height: var(--card-image-max-height)`) and put the fitting on a child,
  `.card-img img { object-fit: cover }`. The canonical example puts the class on the image
  itself, `<img src="..." class="card-img">`, so the child rule never matches and the image is
  stretched rather than cropped.
- **Difference between builds:** live differs only by the container lacking
  `aspect-ratio: var(--card-aspect-ratio)`, which ours adds. Behaviour is otherwise identical.
- **What went away:** the bottom-corner rounding came from the *separate* Bootstrap stylesheet.
  With it removed the image reports `border-bottom-left-radius: 0` on its own, and only the
  `object-fit` half of the original fix remains.
- **Compatibility fix:** correction 5. The fitting the runtime already specifies is applied to
  the element the documented markup uses. The canonical markup is not changed.
- **Retained:** temporarily, pending Buckholt's answer on which side is wrong.
- **Upstream action:** make the runtime rule match a bare `<img class="card-img">` as well as a
  wrapper, or correct the documented example.

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

## Card — `--card-text` is defined as an empty value

- **Status:** `OPEN` (a symptom is corrected — see [Card hover](#card--versa-tile--bootstrap-link-hover-colour))
- **Evidence:** `.card` declares `color: var(--card-text)` and the property is defined with no value,
  so the declaration is invalid at computed-value time and dropped.
- **Consequence:** anything relying on `--card-text` silently inherits instead. The hover symptom is
  corrected; the underlying token is not.
- **Upstream action:** give `--card-text` a value.

## Form groups — `label[for]` with no matching control

- **Status:** `OPEN`
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
