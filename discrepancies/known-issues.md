# Buckholt documentation/runtime notes

The Buckholt documentation website is the primary source of truth for intended Digital Product design-system behaviour.

`css/buckholt.css` is the current compiled runtime implementation. `css/buckholt-ai-fixes.css` is a narrow compatibility layer for verified runtime defects only. Load the compatibility file after the runtime when generating prototypes.

Only record an issue here when it is individually verified and likely to mislead an agent implementing Buckholt. An automated class-name scan is not sufficient evidence by itself because classes can participate through descendant, compound, pseudo, `:has()` or `:not()` selectors without having a standalone `.class {}` rule.

## Radius runtime extensions

**Status: documented difference; no compatibility override.**

The Radius documentation defines the intended documented scale through `full` at `2rem` / `32px`.

The runtime additionally exposes:

```css
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

Treat these as runtime extensions unless and until the documentation explicitly adopts them. For normal Buckholt design decisions, follow the documented Radius scale. Do not remap one runtime variable name to another automatically.

## Link visited state is not implemented

**Status: verified runtime defect; compatibility fix applied in `css/buckholt-ai-fixes.css`; needs upstreaming.**

The Link Style documentation defines the visited state for both link text and icon as **Expressive secondary deep (`#5731d6`)**.

The current compiled runtime contains no `:visited` rule, so visited links are indistinguishable from unvisited ones. The runtime also exposes `--link-visited` and `--link-icon-visited` as `#1748d0`, which does not match the documented colour.

The compatibility layer applies the documented Expressive secondary deep colour to visited link text and standalone-link icons. Do not add further local visited-state overrides inside prototypes.

## Button focus state falls through to Bootstrap on mouse click

**Status: verified runtime defect; compatibility fix applied in `css/buckholt-ai-fixes.css`; needs upstreaming.**

Buckholt styles the Button focus state through `:focus-visible`, while Bootstrap 5.1.3 also styles plain `:focus` for the button classes Buckholt reuses. A mouse click sets `:focus` but normally not `:focus-visible`, so Bootstrap's colours can remain after the pointer leaves. Secondary is the most obvious case because it becomes Bootstrap grey.

The compatibility layer neutralises Bootstrap's plain mouse-focus visual state and restores the Buckholt resting variables while preserving Buckholt's documented `:focus-visible` treatment for keyboard focus.

Do not compensate inside individual prototype pages.

### The restore rule needs a hover/active guard

The first version of the fix restored the resting colours with an unguarded selector:

```css
.btn:focus:not(:focus-visible) { color: …; background-color: …; border-color: …; }
```

That is more specific than `.btn:hover` (0,2,0 against 0,3,0), and it loads after Buckholt's active selectors, which are also 0,3,0. So once a button had been clicked it stopped responding to hover and gave no active feedback on subsequent presses.

The restore is now guarded, while the glow removal stays unguarded because that shadow is always Bootstrap's:

```css
.btn:focus:not(:focus-visible) { box-shadow: none; outline: 0; }

.btn:focus:not(:focus-visible):not(:hover):not(:active) {
  color: var(--button-label);
  background-color: var(--button-background);
  border-color: var(--button-border);
}

.btn-primary:focus:not(:focus-visible):not(:active),
.btn-secondary:focus:not(:focus-visible):not(:active) {
  border-bottom-width: calc(1px + 0.125rem);
}
```

The bottom-border rule takes `:not(:active)` because Buckholt drops that edge to 1px while a button is active.

Verified with real pointer and keyboard interaction on primary, secondary and ghost:

| State | Secondary | Primary | Ghost |
| --- | --- | --- | --- |
| Resting | white, 3px edge | `#0f40c5`, 3px | transparent, 1px |
| Hover | `rgba(15,64,197,.1)` | `#3f66d1` | `rgba(15,64,197,.1)` |
| Active | `#0f40c5` / white, 1px edge | `#092676`, 1px | `#0f40c5` / white |
| Released, still hovered | back to hover | back to hover | back to hover |
| Pointer away, still focused | back to resting | back to resting | back to resting |
| Tab (keyboard) | Buckholt ring `#1748d0` at 2px | same | same |

### Bootstrap is not overriding Buckholt generally

A cascade audit using the DevTools protocol, mapping every winning declaration back to its source stylesheet, was run across Button (all variants), Card, Accordion button, Alert, Breadcrumb, Form control, Input addon, Modal, Menu panel, Table, Tag, Toast, Avatar, Progress, Versa-tile, Link, Slider and Close button.

**Bootstrap wins zero declarations.** The document loads exactly three stylesheets plus the page's own inline block, in the correct order, and `bootstrap.bundle.min.js` contains no CSS at all, so a script tag at the end of the document cannot affect the cascade.

Where Bootstrap did win, it was never a load-order or bundling problem. It was always a *selector* problem: Bootstrap styling a state that Buckholt does not define a matching rule for. The remedy is a narrow rule in the compatibility layer, not reordering or removing Bootstrap.

## Summary Meta used an inert `expressive-primary` class

**Status: corrected in repository component guidance; no CSS override required.**

Earlier Summary Meta rules/examples wrote:

```html
<div class="icon-block icon-block-xxl expressive-dark expressive-primary">
```

No `.expressive-primary` rule exists in the runtime because the primary expressive family is already the root default. Secondary, tertiary and quaternary are the explicit modifiers.

The repository's Summary Meta rules and examples have now been corrected to use the primary/default treatment without `.expressive-primary`.

## Progress bar error status icon renders black instead of the error colour

**Status: verified runtime defect; compatibility fix applied in `css/buckholt-ai-fixes.css`; needs upstreaming.**

The error status icon is supplied as a data-URI SVG. The runtime tries to use:

```css
fill='var%28--error-01%29'
```

CSS custom properties on the host page do not resolve inside the isolated SVG document, so the icon falls back to black. The working success icon already encodes a literal colour.

The compatibility layer replaces the error icon background image with the same SVG path using the documented literal error colour `#d7050c`.

## Versa-tile body text class was undocumented

**Status: corrected in repository component guidance.**

The documented anatomy includes a Body text part and the runtime implements:

```css
.versatile-text {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

The repository's Versa-tile rules/examples now document `.versatile-text` and its one-line ellipsis behaviour.

## Versa-tile icon-only action set wrapped

**Status: verified runtime defect; compatibility fix applied in `css/buckholt-ai-fixes.css`; needs upstreaming.**

An icon-only `.button-set` inside `.versatile-actions` could shrink and wrap because the actions column had no `flex-shrink` protection while `.versatile-body` occupied the available width.

The verified correction is:

```css
.versatile-actions {
  flex-shrink: 0;
}
```

The repository's Versa-tile guidance also now includes the documented multi-action Button-set composition so agents do not invent local spacing.

A copy of this fix had previously been inserted directly into `css/buckholt.css`. Going forward, compatibility corrections belong in `css/buckholt-ai-fixes.css`; the direct runtime edit should be removed when the upstream snapshot is next refreshed so `buckholt.css` can remain pristine.

## Form actions wrapper naming

**Status: repository guidance corrected; no CSS override required.**

The explanatory source prose mentions `.form-buttons`, but the rendered Buckholt examples and current compiled runtime use `.form-actions`.

Runtime evidence:

```css
.form, .nested-inputs, .form-actions, .form-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-actions {
  gap: 2rem;
  margin-top: 2rem;
}

.form-actions > .btn {
  align-self: flex-start;
}
```

The repository's `components/form/rules.md` and `examples.html` now use `.form-actions`. Treat `.form-buttons` as a wording error in the source prose, not as a current Buckholt runtime class.

## Automated "inert class" audit produced false positives

**Status: rejected as a discrepancy list; individual classes require selector-aware verification.**

A prior automated audit reported 14 example classes as inert because it looked for standalone class rules. That method is not valid CSS analysis.

For example:

```css
.simple_table table { ... }
.simple_table table th { ... }
.table td:not(.no-italics td):first-child { ... }
```

prove that `.simple_table` and `.no-italics` participate in runtime behaviour despite having no standalone declaration block. `.form-buttons` was also incorrectly listed because the real supported class is `.form-actions`.

Do not promote the remaining names from that audit into this canonical file without checking their actual selectors and component documentation one by one.

## Expressive palette was undercounted in the colour foundation

**Status: corrected in repository foundation guidance.**

The colour foundation previously said the runtime included only primary, secondary and tertiary expressive families. The runtime actually defines four: primary/default, secondary, tertiary and quaternary.

`foundations/colour/foundation-tokens.md` now documents all four families and their pale, soft, deep, rich, pale-overlay and soft-overlay variables. It also explicitly notes that primary is the default and does not use an `.expressive-primary` modifier.
