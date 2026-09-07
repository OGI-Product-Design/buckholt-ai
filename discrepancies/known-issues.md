# Buckholt documentation/runtime notes

The Buckholt documentation website is the primary source of truth for intended Digital Product design-system behaviour.

`css/buckholt.css` is the current runtime implementation. It may also contain additional helpers or values added while Buckholt was used to build the company website. Those additions can provide useful flexibility, but they should not automatically be promoted to canonical Buckholt guidance.

Only record an issue here when a runtime difference is likely to mislead an agent implementing documented Buckholt behaviour.

## Radius runtime extensions

The Radius documentation defines the intended documented scale through `full` at `2rem` / `32px`.

The runtime CSS additionally exposes:

```css
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

Treat these as runtime extensions unless and until the documentation explicitly adopts them. Do not block implementation merely because they exist.

For normal Buckholt design decisions, follow the documented Radius scale. A component may still use an additional runtime radius if its own documented/runtime implementation requires it.

## Link visited state is not implemented

The Link Style documentation defines the visited state for both link text and icon as **Expressive secondary deep (`#5731d6`)**.

The current compiled runtime contains no `:visited` rule at all, so a visited link is indistinguishable from an unvisited one. The tokens that would drive the state exist but are never consumed, and carry Text active blue rather than the documented colour:

```css
--link-visited: #1748d0;
--link-icon-visited: #1748d0;
```

The documented colour is present in the runtime as `--expressive-secondary-deep: #5731D6`, but nothing wires it to the link visited tokens.

This supersedes an earlier note describing a specific `a.link-standalone:visited .icon { color: #1748D0 }` rule. That rule is no longer present in the current stylesheet; the gap is now broader, because visited is unstyled entirely rather than styled with the wrong colour.

For design intent, treat `#5731d6` as canonical because it is the documented Link state. Do not create local one-off overrides in generated product UI merely to compensate; the underlying runtime should be corrected deliberately if the team chooses to align implementation with the documentation.

## Button focus state falls through to Bootstrap on mouse click

Buckholt styles the Button focus state only through `:focus-visible`:

```css
.btn:focus-visible {
  color: var(--button-label-focus);
  background-color: var(--button-background-focus);
  border-color: var(--button-border-focus);
  outline: 0;
  box-shadow: var(--button-shadow-focus);
}
```

Bootstrap 5.1.3, which Buckholt loads on top of, styles plain `:focus` for the button classes Buckholt reuses:

```css
.btn-check:focus+.btn,.btn:focus{outline:0;box-shadow:0 0 0 .25rem rgba(13,110,253,.25)}
.btn-primary:focus{color:#fff;background-color:#0b5ed7;border-color:#0a58ca;box-shadow:0 0 0 .25rem rgba(49,132,253,.5)}
.btn-secondary:focus{color:#fff;background-color:#5c636a;border-color:#565e64;box-shadow:0 0 0 .25rem rgba(130,138,145,.5)}
.btn-danger:focus{color:#fff;background-color:#bb2d3b;border-color:#b02a37;box-shadow:0 0 0 .25rem rgba(225,83,97,.5)}
```

A mouse click sets `:focus` but deliberately not `:focus-visible`, which browsers reserve for keyboard and programmatic focus. Buckholt's focus rule therefore never matches after a click, and Bootstrap's `:focus` styling applies unopposed. Loading Buckholt after Bootstrap does not help, because Buckholt defines no plain `:focus` rule for Bootstrap's to override.

Measured after a mouse click, with the pointer moved off the button:

| Variant | Rendered after click | Documented Buckholt resting/focus role |
| --- | --- | --- |
| `.btn-primary` | `#0b5ed7` | `--action-02` (`#3f66d1`) |
| `.btn-secondary` | `#5c636a` with white label | `--action-04` on `--action-07`, `--action-text-01` label |
| `.btn-ghost` | transparent with `rgba(13,110,253,.25)` glow | `--action-07`, Buckholt focus ring |
| `.btn-danger` combinations | `#bb2d3b` | `--action-danger-02` (`#ae0a09`) |

While the pointer remains over the button, Buckholt's `:hover` rule still wins the background, so only the Bootstrap focus ring is visible. Once the pointer leaves, the full Bootstrap fill appears. Secondary is the most obvious case because Bootstrap's grey diverges furthest from the Buckholt palette, but every variant is affected. Keyboard focus is unaffected and renders the documented Buckholt treatment, including the `#1748d0` focus ring.

Treat the Buckholt focus tokens as canonical; the Bootstrap colours are not a Buckholt state. Do not add local one-off `:focus` overrides in generated product UI to compensate, and do not override the state colours in test pages to make a screenshot look right. The runtime should be corrected deliberately, by having Buckholt style `:focus` alongside `:focus-visible` for `.btn`, or by explicitly neutralising Bootstrap's `:focus` treatment for the reused button classes.

## Summary Meta uses an inert `expressive-primary` class

`components/summary-meta/rules.md` and `components/summary-meta/examples.html` both write the Icon block as:

```html
<div class="icon-block icon-block-xxl expressive-dark expressive-primary">
```

No `.expressive-primary` rule exists in the compiled runtime. The primary expressive family is the root default:

```css
--expressive-deep: #1748d0;
--expressive-rich: #092676;
--expressive-pale-overlay: rgba(15, 64, 197, 0.1);
```

and only `.expressive-secondary`, `.expressive-tertiary` and `.expressive-quaternary` override it. `components/icon-block/examples.html` is consistent with the runtime here, labelling the primary treatment as plain `.icon-block.expressive-light` / `.icon-block.expressive-dark` with no family class.

Rendering is therefore correct, because the intended default already applies. The problem is that the markup implies a family modifier is required when none exists, which invites agents to invent matching classes for other families or to assume `.expressive-primary` is a real API.

Either add `.expressive-primary` to the runtime as an explicit no-op alias for the default, or drop it from the Summary Meta documentation so the two components describe the default the same way. Do not add a local override to compensate.

## Progress bar error status icon renders black instead of the error colour

The Progress bar status icons are supplied as `background-image` data URIs on `.progress-header`. The success icon encodes its fill as a literal value; the error icon tries to reference a custom property:

```css
.progress-header:has(~ .is-valid) {
  background-image: url("data:image/svg+xml,%3csvg ... fill='%23168914' ...");
}
.progress-header:has(~ .is-invalid) {
  background-image: url("data:image/svg+xml,%3csvg ... fill='var%28--error-01%29' ...");
}
```

A `data:` URI is a separate document. CSS custom properties defined on the host page do not cascade into it, so `var(--error-01)` is not a resolvable paint value inside that SVG and the fill falls back to the SVG default, black.

Measured by rasterising each icon and sampling the first opaque pixel:

| Icon | Encoded fill | Rendered |
| --- | --- | --- |
| Success | `fill='%23168914'` | `rgb(21, 137, 20)` — correct |
| Error | `fill='var%28--error-01%29'` | `rgb(0, 0, 0)` — black |
| Error with a literal fill | `fill='%23d7050c'` | `rgb(215, 5, 12)` — correct |

The Buckholt documentation site shows this icon in the error colour, so the intended behaviour is clear and the runtime does not match it.

The fix is to encode the literal colour in the error icon exactly as the success icon does, replacing `fill='var%28--error-01%29'` with `fill='%23d7050c'`. Note that this loses the indirection through `--error-01`; the same constraint already applies to the success icon, which hard-codes `#168914` rather than referencing `--success-01`. Any other data-URI icon in the stylesheet that references a custom property will have the same problem. Do not add a local override in product UI to compensate.

## Versa-tile body text class is undocumented

The documented Versa-tile anatomy names a "Body text" part sitting under `.versatile-label`. The runtime implements it:

```css
.versatile-text {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

Neither `components/versa-tile/rules.md` nor `components/versa-tile/examples.html` mentions `.versatile-text`, so an agent following the component documentation alone has no verified markup for a part the anatomy explicitly labels. Add it to the component documentation so the documented anatomy and the verified markup agree.

## Versa-tile icon-only action set wrapped — FIXED in this repository, needs upstreaming

**Status: fixed in `css/buckholt.css` in this repository. This is currently the only local change to the compiled stylesheet, and it must be carried into the upstream Buckholt build or the next compiled drop will reintroduce the bug.**

Buckholt's documented spacing for a group of icon-only buttons is 4px, produced by the Button set rule:

```css
[class$=-set][class|=button]:has(.btn-icon, …):not(:has(.button-label)) {
  --set-gap: 0.25rem;
}
```

The runtime already anticipated that set being used inside a Versa-tile, because a rule exists solely to neutralise the set's top margin in that context:

```css
.versatile-actions .button-set {
  margin: 0;
}
```

But the set could not lay out on a single row. `.versatile-body` declares `width: 100%` and `.versatile-actions` set no `flex-shrink`, so the actions column was squeezed. Because `.button-set` carries `flex-wrap: wrap`, its min-content width is a single 40px button rather than the full row, so it collapsed to 76px where 84px was needed, wrapped, and made the tile 40px taller.

The documented markup was correct and the documentation site renders these actions 4px apart on one row. The defect was in the compiled stylesheet.

### The fix applied

```css
.versatile-actions {
  display: flex;
  align-items: center;
  gap: var(--versatile-actions-gap);
  flex-shrink: 0;   /* added */
}
```

Verified at 1400px, 900px, 600px and 380px viewports:

| Case | Result |
| --- | --- |
| Two icon-only buttons in a `.button-set` | 4px gap, one row, tile 82px |
| Single labelled button (as in `examples.html`) | unchanged, tile 82px |
| Very long label and body text | 4px gap, one row, label truncates with ellipsis, no overflow |
| Tile with no actions | unchanged, tile 58px |

`flex-shrink: 0` was chosen over `flex-wrap: nowrap` on the nested set because it fixes the container rather than one particular child, so any actions content benefits. `.versatile-body` already carries `min-width: 0`, so it absorbs the squeeze and its label ellipsis behaves correctly.

### Related documentation gap

`components/versa-tile/examples.html` only shows a single labelled button inside `.versatile-actions`, so there is no verified markup for the multi-action case. Adding a documented icon-only action example would make the intended structure explicit and prevent agents from placing bare buttons there, which silently produces 16px spacing instead of 4px.

## Form actions wrapper naming is inconsistent

The Form Code & specs explanatory guidance says the action section is `.form-buttons` and describes it as the wrapper for submit/cancel actions. The current compiled runtime also styles `.form-buttons` as part of the Form layout and applies its top spacing there.

However, the rendered Form examples in the Usage/Style/Code documentation repeatedly use:

```html
<div class="form-actions">
  ...
</div>
```

No corresponding `.form-actions` Form-layout rule exists in the compiled runtime, so following the example markup literally loses the documented action-area spacing/layout.

This is an internal documentation/runtime mismatch rather than a new variant. Until upstream is reconciled, use `.form-buttons` for Buckholt implementation because it is explicitly named by the explanatory documentation and is the class the runtime actually implements. Do not add local CSS to make `.form-actions` behave like `.form-buttons`.
