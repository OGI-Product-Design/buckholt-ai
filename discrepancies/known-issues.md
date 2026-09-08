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

The layer holds **7 documented corrections** — the entries below marked `ACTIVE FIX` — expressed as
**8 CSS rules** and checked by **8 runtime assertions**.

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

The corrections that remain are **defects in Buckholt's own compiled output**. Where a cause still
names a Bootstrap selector, that selector is inside `buckholt.css` itself — every one is worth
raising upstream.

**Statuses used:** `ACTIVE FIX` (corrected in the compatibility layer) · `OPEN` (verified, not
corrected) · `PRODUCT RESPONSIBILITY` (Buckholt supplies structure and styling, the application
supplies behaviour).

---

## Contents

**Buckholt runtime defects (`ACTIVE FIX`)** — [Progress bar icon](#progress-bar--error-status-icon-renders-black) ·
[Versa-tile actions](#versa-tile--icon-only-action-set-wraps) · [Dropdown caret](#dropdown--two-arrows) ·
[Close button sizing](#button-close--geometry-and-bootstraps-competing-svg-cross) ·
[Alert/Toast close placement](#alert--toast--close-control-flows-inline) ·
[Table action alignment](#table--action-button-set-sits-below-the-row-centre) ·
[Card image](#card--image-stretched-and-bootstrap-rounds-its-bottom-corners)

**Dependency requirements** — [Font Awesome Pro required](#font-awesome--the-regular-face-must-carry-the-documented-glyphs)

**Source / runtime discrepancies** — [Link visited](#link--visited-state-not-implemented) ·
[Radius `full`](#radius--full-name-and-value-disagree) · [Empty `--card-text`](#card--card-text-is-defined-as-an-empty-value) ·
[Group labels](#form-groups--label-for-with-no-matching-control) · [Text area counter](#text-area--counter-updates-on-keyup-only)

**Required behaviour not supplied** — [Selectable Tag](#tag--selection-and-dismiss) ·
[Selectable Card](#card--selectable-state) · [Slider](#slider--rangenumber-synchronisation) ·
[Table controller](#table--data-cdt-controller) · [Dropdown single select](#dropdown--single-select-label)

**Source coverage** — [Table](#table--source-partial)

---

# Bootstrap declarations Buckholt does not counter

The single largest cause of visual drift. Buckholt overrides Bootstrap by *redeclaring* properties,
so anything Bootstrap sets that Buckholt does not redeclare survives. This is not a load-order or
bundling problem: the three stylesheets load in the documented order.

A systematic diff of the compiled build against Bootstrap 5.1.3 would likely find more of these than
component-by-component visual review will.

## Dropdown — two arrows

- **Status:** `ACTIVE FIX` — re-verified with `buckholt.css` as the only framework stylesheet.
- **Evidence:** with Bootstrap's stylesheet removed, `.dropdown-toggle::after` still computes
  `display: inline`.
- **Runtime cause:** Buckholt draws its arrow as a right-edge background image, but its own compiled
  Bootstrap layer still carries `.dropdown-toggle::after`, the border triangle. Both render. The
  triangle is inside `buckholt.css`, so this is a Buckholt defect, not a layering artefact.
- **Compatibility fix:** correction 3.
- **Upstream action:** suppress `.dropdown-toggle::after` in the Buckholt build.

## Button close — content-box sizing

- **Status:** `ACTIVE FIX` — **reduced**. Re-verified with `buckholt.css` as the only framework
  stylesheet.
- **Evidence:** with Bootstrap's stylesheet removed, `.btn-close` still computes
  `box-sizing: content-box`, so padding is added outside the declared `2rem` box instead of inside
  it.
- **Runtime cause:** Buckholt sets `--btn-close-width/height: 2rem` and applies them as
  `width`/`height`, but its own compiled Bootstrap layer still carries
  `.btn-close { box-sizing: content-box }`.
- **What went away:** the competing SVG cross, the `.alert-dismissible` padding and the negative
  margins all came from the *separate* Bootstrap stylesheet. With it removed, `.btn-close` reports
  `background-image: none` and the doubled cross is gone. Only the sizing half of the original fix
  remains.
- **Compatibility fix:** correction 4.
- **Upstream action:** set `box-sizing: border-box` on `.btn-close` in the Buckholt build.

## Card — documented image markup is stretched

- **Status:** `ACTIVE FIX`
- **Evidence:** the documented image card reports `object-fit: fill` with a natural ratio of 1.78
  rendered at 2.10, and `border-bottom-left-radius: 3px` against a 15px top radius.
- **Runtime cause:** two separate problems. The runtime writes `.card-img` as a *container* — it
  sizes the box and puts the fitting on a child, `.card-img img { object-fit: cover }` — but the
  canonical example puts the class on the image itself, so the child rule never matches and the
  image is stretched rather than cropped. Separately, Bootstrap's `.card-img, .card-img-bottom`
  rounds the *bottom* corners; Buckholt redeclares only the top pair, so an image above a
  `.card-body` keeps Bootstrap's 3px rounding and separates from the body it should meet flush.
- **What went away:** the bottom-corner rounding came from the *separate* Bootstrap stylesheet. With
  it removed the image reports `border-bottom-left-radius: 0` on its own, and only the `object-fit`
  half of the original fix remains.
- **Compatibility fix:** correction 7. The fitting the runtime already specifies is applied to the
  element the documented markup uses. The canonical markup is not changed.
- **Upstream action:** make the runtime rule match a bare `<img class="card-img">` as well as a
  wrapper.

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

# Buckholt runtime defects

Not Bootstrap's doing. The runtime does not implement documented intent.

## Progress bar — error status icon renders black

- **Status:** `ACTIVE FIX`
- **Evidence:** the header background image carries `fill='var%28--error-01%29'`; rasterised, the
  glyph samples `rgb(0,0,0)` instead of `#d7050c`. The success icon uses a literal `%23168914` and
  renders correctly.
- **Runtime cause:** a `data:` URI is an isolated document, so a custom property cannot resolve inside
  it and the fill falls back to black.
- **Compatibility fix:** correction 1 — the same SVG with the documented error colour encoded literally.
- **Upstream action:** encode the colour literally, as the success icon already does.

## Versa-tile — icon-only action set wraps

- **Status:** `ACTIVE FIX`
- **Evidence:** the actions column measures 51.9×72 with its two buttons on separate rows; it should
  be 68×32 on one row.
- **Runtime cause:** `.versatile-body` claims `width: 100%` while `.versatile-actions` sets no
  `flex-shrink`, so the actions column is compressed.
- **Compatibility fix:** correction 2.
- **Upstream action:** add `flex-shrink: 0` to `.versatile-actions`.

## Alert / Toast — close control flows inline

- **Status:** `ACTIVE FIX`
- **Evidence:** placed inside `.alert-content` / `.toast-content` — the placement used by the
  documented Alert "Animations" and Toast example 8 — the close button sits 351.6px (Alert) and
  178.3px (Toast) from the trailing edge instead of 8px.
- **Runtime cause:** Buckholt documents two placements. As a *sibling* of the content wrapper the
  button lands correctly, because that wrapper claims `width: 100%`. *Inside* it there is no rule to
  push it: both wrappers are flex rows, neither `.alert-body` nor `.toast-body` is given `flex`, and
  the runtime positions the close control only through `.alert-dismissible` — a class the canonical
  examples never use.
- **Compatibility fix:** correction 5, `margin-left: auto` on a `.btn-close` that is a direct child of the
  content wrapper. The sibling placement and Collapse, which uses the same sibling pattern, are
  untouched.
- **Upstream action:** either give the body `flex: 1`, or position the close control without requiring
  `.alert-dismissible`.

## Table — action button set sits below the row centre

- **Status:** `ACTIVE FIX`
- **Evidence:** the action cell's button set carries `margin: 8px 0 0`, putting its centre 3.8px below
  the row centre while every other cell in the same row sits within 1.3px of it.
- **Runtime cause:** Buckholt gives every button set a flow offset,
  `[class$=-set][class|=button] { margin-top: 0.5rem }`. Table cells are not normal flow —
  `.table > :not(caption) > * > *` sets `vertical-align: middle` — so the offset displaces the
  action. Buckholt already recognises the offset must be cancelled inside a component that positions
  its own actions, shipping `.versatile-actions .button-set { margin: 0 }`, but has no table
  equivalent.
- **Compatibility fix:** correction 6, mirroring the Versa-tile reset scoped to table cells.
- **Upstream action:** add the table-cell reset alongside the Versa-tile one.

---

# Source / runtime discrepancies

Documentation and runtime materially disagree. Neither is silently rewritten.

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
