# Button

## Verification

Source-verified against the Buckholt Button Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` contains the documented Code & specs markup and is the canonical source for Button DOM structure.

## Purpose

Buttons trigger actions or events and tell users what to expect next. Use a Button for an action; use a Link for navigation.

A page should normally have one primary call to action. Other actions should use lower-emphasis Button variants where appropriate.

## Canonical structure

Do not reconstruct Button markup from this prose. Use `examples.html` for the exact documented structures.

Buckholt's base Button uses `.btn` and wraps visible label text in `.button-label`. Documented variants are:

- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`

Danger is a modifier: add `.btn-danger` to any of the three variants.

## Sizes

Buckholt documents:

- `.btn-sm` — small
- no size modifier — medium/default
- `.btn-lg` — large

The Style documentation defines the dimensions and spacing; use `buckholt.css` rather than recreating them locally.

## Labels

Use sentence case. Prefer clear action language, generally `{verb} + {noun}` where useful. Familiar actions such as Done, Close, Cancel, Add or Delete may be a single word. Prefer a single line, but wrap rather than truncate if necessary.

## Icons in labelled Buttons

The documented Code & specs structure places:

```text
.btn
├─ .btn-icon
│  └─ icon
└─ .button-label
```

The icon is positioned before the label. The Code & specs example uses `<div class="btn-icon">` and a `fa-regular fa-ghost` demonstration icon. Preserve that exact structure in canonical markup.

The shared Iconography catalogue can guide icon choice in a real product, but it must **not** rewrite an icon or wrapper explicitly shown by the Button Code & specs source.

Usage guidance says Button icons should be relevant to the action, match the label colour/scale, and appear to the left of the label.

## Icon-only Buttons

The documented icon-only structure is a `.btn` containing `.btn-icon` and no `.button-label`. Medium/default and small are the documented icon-only sizes.

Use icon-only Buttons sparingly. Buckholt's Usage guidance requires a tooltip explaining the action and the implementation must still provide an accessible name. Do not add tooltip attributes to the canonical Code & specs example unless they are present in that exact source example; application implementations may add the required accessible/tooltip behaviour.

## Button sets

Group related actions inside `.button-set`. Add `.button-set-stacked` for the documented stacked full-width treatment.

Usage guidance:

- group only related actions;
- normally use one primary action in a set;
- do not mix icon-only and labelled Buttons in the same set;
- keep icon usage consistent across comparable Buttons in a set;
- primary placement follows the surrounding layout: left/outer edge in typical full-page layouts and right/outer edge in right-aligned contained layouts such as Modals.

## Disabled state

Use the native `disabled` attribute on `<button>`. The Style documentation states disabled Buttons retain their resting colours at reduced opacity.

## Interaction

Native Buttons are activated with mouse click and with Enter or Space when focused. Preserve Buckholt's runtime hover/focus/active treatment and native form semantics.

## Runtime

Use the repository runtime order documented in `CLAUDE.md`: Bootstrap CSS first, Proxima Soft, Font Awesome, then `css/buckholt.css` and the verified compatibility stylesheet. Load Bootstrap JavaScript only where Bootstrap-powered behaviour such as Tooltips is needed.

Do not recreate Button colour, border, spacing, radius, typography or state styling in page-specific CSS.

## Agent rules

- `examples.html` is canonical for Button DOM structure.
- Use `.button-label` exactly where the Code & specs example shows it.
- Use `.btn-icon` exactly where the Code & specs example shows it.
- Do not substitute a shared `.icon` wrapper for `.btn-icon`.
- Do not replace the documented demonstration icon in canonical examples using the shared icon catalogue.
- Use only documented Button variants and size modifiers.
- Use Button for actions, not navigation.
- Do not invent tooltip markup, custom variants or local Button styling and then describe them as Buckholt canonical markup.
