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

## Visual parity audit — findings and status

Raised in the Buckholt visual parity audit comparing the documentation site (BD) with `test/style-guide/` (SG).

### Fixed: the style guide was not loading the documented component scripts

`CLAUDE.md` lists `components/dropdown/dropdown.js`, `components/form/form.js` and `components/tabs/tabs.js`, and the Form, Checkbox, Radio and Number input rules record that `form.js` depends on jQuery. The style guide loaded none of them, so every behaviour they provide appeared broken.

jQuery 3.7.1 and all three scripts are now loaded, in that order, after the Bootstrap bundle. That restores the Number input steppers, the Text area character counter, the Checkbox `indeterminate` and `selected` states, the `state_readonly` prevention, the Dropdown enhancement and the Tabs overflow controls.

Note that jQuery is named only in individual component rules, not in the `CLAUDE.md` runtime dependency block. It should be added there, since `form.js` fails silently without it.

### Fixed: blanket `a:visited` turned every anchor purple

The compatibility layer applied the documented Link visited colour with a bare `a:visited`. That repaints anchors belonging to other components — Clickable card, Breadcrumb, Page navigation, Versa-tile, Menu — none of which document a visited state. Because same-page `href="#id"` anchors count as visited immediately, those components rendered purple on first view.

The Link documentation defines visited for inline links, which are bare anchors carrying no Link-specific class, and for `.link-standalone`. The rule is now scoped to exactly those:

```css
a:not([class]):visited,
a.link-standalone:visited { color: var(--expressive-secondary-deep); }
```

This also resolves the Clickable card complaint: its text is `#1a1a1a` as documented once the blanket rule is gone.

### Fixed: Dropdown rendered two arrows

Buckholt styles `.dropdown-toggle` like a select and draws its arrow as a right-edge background image, but never suppresses Bootstrap's own `.dropdown-toggle::after` border triangle. Both rendered — Bootstrap's inline after the label, Buckholt's at the right edge.

This is another instance of the Bootstrap bleed-through pattern: not load order, but Bootstrap styling something Buckholt does not counter. `.dropdown-toggle::after { display: none }` is applied in the compatibility layer.

### Fixed: Alert close button inflated to 48x52

`.btn-close` is `box-sizing: content-box` with `width`/`height` of `2rem` and `padding: 0`, giving 32x32. The Bootstrap-inherited `.alert-dismissible .btn-close` rule re-adds `padding: 0.625rem 0.5rem`, which under content-box inflates the control to 48x52 and pins it flush into the corner.

The compatibility layer restores `box-sizing: border-box` on `.btn-close` and insets the dismissible position by the Alert's own padding variables. Measured 32x32 afterwards, with the small variant still 24x24.

### Not fixable in CSS: selection states that need product JavaScript

- **Selectable card.** `.card-selectable.active` supplies the selected fill and border, but nothing in the repository adds `.active` when the radio or checkbox is checked. The runtime has no `:has(:checked)` equivalent. The radio itself positions correctly at `top: 1.5rem; right: 1.5rem`.
- **Selectable tag.** `.tag-selectable` wraps a native input, but no shipped script reflects the checked state, and `data-bs-dismiss="tag"` is not a Bootstrap behaviour so the dismissible tag's close button is inert.
- **Table select-all.** The `data-cdt-select-column` and `data-cdt-table` attributes imply a table controller that is not in the repository.
- **Slider.** Nothing synchronises the range input with its paired number field; `form.js` covers the stepper buttons but not the slider.

Either these need their scripts adding to the repository, or the documentation should state that they are product responsibilities.

### Second pass: more Bootstrap bleed-through found by the parity audit

Each of these follows the same pattern established by the Button focus issue. Buckholt does not declare a property, or declares it at lower specificity than Bootstrap's equivalent, so Bootstrap's value survives. None is a load-order or bundling problem. All are corrected in `css/buckholt-ai-fixes.css`.

| Component | What was wrong | Cause |
| --- | --- | --- |
| Accordion | Second and later items lost their top border | `.accordion-item:not(:first-of-type){border-top:0}` is more specific than Buckholt's `.accordion-item` |
| Accordion | Outer corners rendered 4px instead of the 8px `--accordion-radius` | Bootstrap's `:first-of-type` / `:last-of-type` corner rules |
| Accordion | Open item showed a thin blue chevron | Bootstrap's `.accordion-button:not(.collapsed)::after` supplies its own `#0c63e4` icon; Buckholt sets only the rotation and never resets the image |
| Accordion | Dark line under an open header | Bootstrap's `inset 0 -1px 0 rgba(0,0,0,.125)` on the same rule |
| Modal | Padding far too large, plus grey divider lines | `.modal-content` already supplies 2rem padding and 1.5rem gaps; Buckholt declares no padding on header/body/footer, so Bootstrap's 1rem/1rem/.75rem and `#dee2e6` borders apply on top |
| Toast | Icon out of line with the message | Buckholt's `.toast-body` sets typography only, so Bootstrap's `.toast-body{padding:.75rem}` indents the text. Alert has no Bootstrap equivalent, which is why the identical structure lines up there |
| Table | Black rule above the table body | `.table > :not(:first-child){border-top:2px solid currentColor}` outranks Buckholt's `.table > tbody`, and `currentColor` resolves to the near-black text colour |
| Dropdown | Two arrows | Buckholt draws a right-edge background arrow but never suppresses Bootstrap's `.dropdown-toggle::after` triangle |
| Alert | Close button 48x52 and flush to the corner | `.btn-close` is content-box at 2rem with zero padding; the Bootstrap-inherited `.alert-dismissible` rule re-adds padding, inflating it |

The consistent lesson is that Buckholt overrides Bootstrap by *redeclaring* properties, so any property Bootstrap sets that Buckholt does not redeclare survives. A systematic pass over the compiled build against Bootstrap 5.1.3 would likely find more of these than a component-by-component visual audit will.

### Not defects

- **Submenu appearing behind a neighbouring panel** was caused by the style guide placing three independently open menu panels side by side for display. The submenu now has its own row. Buckholt's own z-index is fine.
- **Page navigation with icons** was recorded here as undocumented. Superseded: the 7 September 2026 source ingest added the Code & specs example, and the icon goes directly inside the anchor. See "Page navigation icons — resolved, and my provisional example was wrong" below.

### Third pass: remaining parity items

**Links rendering purple — the compatibility layer's own fault.** The documented visited colour was being applied via `:visited`. In any single-page reference or prototype every `href="#section"` anchor becomes visited as soon as it is used, so links went purple where the documentation site shows blue. The rule is removed. The underlying runtime gap — no `:visited` implementation at all — remains recorded above; products doing real navigation can opt in deliberately, but a compatibility layer should not force it.

**Clickable card changed colour on hover.** `.card` sets `color: var(--card-text)`, but `--card-text` is defined as an *empty value* in the runtime, so that declaration is invalid and dropped. A Clickable card is an anchor, so Bootstrap's `a:hover { color: #0a58ca }` then wins and the whole card turned Bootstrap blue. Corrected for `a.card-clickable` and `a.versatile`. The empty `--card-text` is worth fixing upstream, since anything relying on it silently inherits instead.

**Alert close icon squashed.** Once `.btn-close` was corrected to border-box, the Bootstrap-inherited `padding: 0.625rem 0.5rem` left a 16x12 content box for a 16px background icon. The padding is now zeroed; Buckholt's `--btn-close-width`/`-height` already define the target size.

### Interactions now driven by a page-level script

`test/style-guide/style-guide.js` supplies demonstration behaviour for documented interactions that no Buckholt script covers: Selectable card `.active`, Selectable tag `aria-selected`, `data-bs-dismiss="tag"`, the Slider range/number pairing, and Table select-all including the indeterminate state.

It is page-level only and is not a Buckholt API. Each block should be deleted when an upstream script provides the behaviour. The underlying gap is unchanged: these interactions are documented but unimplemented in the repository.

### Page navigation icons — resolved, and my provisional example was wrong

Previously recorded here as undocumented, on the basis that `rules.md` said only "icons may be used where documented and helpful" and `examples.html` had no icon variant. The style guide showed a provisional example built from the shared `<span class="icon">` wrapper that Iconography defines and that Link, Text block and Tag all use, flagged on the page as unverified.

The 7 September 2026 source ingest settles it, and settles it against that guess. Buckholt does document the variant, and places the icon **directly inside the anchor**:

```html
<li class="nav-item">
  <a class="nav-link" href="#"><i class="fa-regular fa-ghost"></i>Nav item
  </a>
</li>
```

`components/page-navigation/rules.md` now states explicitly that Page navigation icons must not be wrapped in `<span class="icon">`, `.btn-icon` or any other shared icon wrapper, and `CANONICAL-MARKUP.md` lists "inserting `<span class="icon">` around an icon that Buckholt places directly in a link" as a change that is not allowed. Usage guidance puts the icon to the left of the label only.

The style guide now carries the documented markup for both the base and the icon variant, including the canonical `<ul class="nav">` starting point with no `<nav>` landmark and no `aria-current` — those are noted on the page as application-level additions rather than written back into the example.

The general lesson matches the new policy: a shared foundation convention is not evidence for a specific component's markup. Reporting the gap was right; filling it from a neighbouring component was not.

### Fourth pass: close icon, grouped action button, selectable tag

**Every close button drew two crosses.** Buckholt draws the close icon itself, as a Font Awesome glyph on `.btn-close::before` (`content: "\f00d"`) coloured by `--btn-close-icon`. Bootstrap paints its own cross with the `background` *shorthand*:

```css
.btn-close {
  background: transparent url("data:image/svg+xml,…fill='%23000'…") center/1em auto no-repeat;
}
```

Buckholt redeclares only `background-color`, so Bootstrap's `background-image` survives and a hard-coded black SVG cross is composited underneath the Buckholt glyph. The two are different sizes — Bootstrap's `1em` against Buckholt's `1rem` `--btn-close-icon-size` — so every close control rendered as a doubled, thickened cross in the wrong colour. Measured `background-image` on `.alert .btn-close` and on the Dropdown multi-select tags before the fix: `url("data:image/svg+xml,…")`; after: `none`.

This was most visible on the Dropdown multi-select selection chips, where `dropdown.js` builds `.tag.tag-dismissible.expressive-light` with a `.btn-close.btn-close-sm`, and `--btn-close-icon` should resolve to `--expressive-deep` (`#0f40c5`) rather than black. `background-image: none` is applied in the compatibility layer.

Same root cause as the rest of the second-pass table: Buckholt overrides Bootstrap by redeclaring properties, and `background-color` does not counter a `background` shorthand.

**Input group grouped action button was joined to the field.** Buckholt separates the grouped action from the response — `.input-group .btn` sets `margin-left: 0.5rem`, and Buckholt's own corner-joining selectors explicitly exclude `.btn` so the button keeps its full `--button-radius`. Bootstrap's

```css
.input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback)
```

matches the button at specificity (0,7,0) against Buckholt's (0,2,0), so Bootstrap's `margin-left: -1px` and zeroed left corners won. Measured before the fix: `margin-left: -1px`, `border-radius: 0px 8px 8px 0px`. After: `margin-left: 8px`, `border-radius: 8px`.

The correction mirrors Bootstrap's selector shape so it matches exactly the same elements at (0,8,0) and restores Buckholt's own values without `!important`.

**Selectable tag cannot be selected at all.** Two separate gaps, both in the documented markup rather than in the compiled CSS:

1. The runtime hides the control with `.tag-selectable input { display: none }`, and the canonical wrapper is a `<span>`, not a `<label>`, with no `for` association. A click on the tag therefore never reaches the input, so it can never be checked by pointer or by keyboard.
2. The selected appearance is keyed off `.tag-selectable.active`, but the canonical markup carries `aria-selected` and nothing sets `.active`.

The runtime also styles `.tag-selectable:focus-visible`, which implies the tag is meant to be focusable, but the documented markup carries no `tabindex` or `role`.

`style-guide.js` now forwards the click to the hidden control and keeps `.active`, `aria-selected` and `input.checked` in step, and applies the keyboard affordances the `:focus-visible` rule implies. That is a page-level stand-in, not a fix: upstream should either make the wrapper a `<label>` (or add `for`/`id` association) and key the selected state off `:has(:checked)`, or ship the script that does it.

### Corrections to the third pass

**Response button single select was not broken.** The third-pass report that the radio variant did not respond was an artefact of the test harness: setting `input.checked` in script and reading `getComputedStyle` on the adjacent label in the same task returned the pre-invalidation value. Driving it with a real click shows `.btn-check:checked + .btn` applying correctly — background `rgba(15, 64, 197, 0.1)` and label `#0f40c5`, from `--button-background-active` and `--button-label-active`. The Dropdown single select and Selectable card were re-tested the same way and also behave correctly.

The item the parity note referred to is the Tag "Single select" example, covered above.

**The Slider range/number pairing works.** Re-tested by dispatching `input` on the range: the paired number field follows. It is still page-level behaviour supplied by `style-guide.js`, not by Buckholt.
