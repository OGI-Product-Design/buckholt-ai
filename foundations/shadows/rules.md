# Shadows

## Source of truth

The Buckholt documentation website is the source of truth for intended shadow usage and the documented shadow scale. `css/buckholt.css` is the runtime implementation and may contain additional implementation detail or website-specific flexibility.

## Purpose

Shadows add depth and help communicate elevation, layering and separation between UI elements. Buckholt guidance says shadows should be systematic, subtle and used sparingly.

Each component should normally use the shadow already defined by Buckholt rather than introducing a new arbitrary shadow.

## When to use

Use shadows only when a component is intentionally elevated above the surrounding UI.

- Reserve heavier shadows for higher layers such as dialogs.
- Use lighter shadows for lower elevated layers such as tooltips or toasts.
- Use shadows to draw attention to elevated components such as modals, dropdowns and tooltips without overwhelming the interface.

## When not to use

Do not add shadows decoratively to ordinary flat content. Too many shadows, or overly strong shadows, can make an interface feel cluttered, heavy or inconsistent.

## Documented shadow scale

| Token | Value |
| --- | --- |
| `--shadow-xs` | `0 1px 3px 0 rgb(26 26 26 / 0.1), 0 1px 2px -1px rgb(26 26 26 / 0.1)` |
| `--shadow-sm` | `0 4px 6px -1px rgb(26 26 26 / 0.1), 0 2px 4px -2px rgb(26 26 26 / 0.1)` |
| `--shadow-md` | `0 10px 15px -3px rgb(26 26 26 / 0.1), 0 4px 6px -4px rgb(26 26 26 / 0.1)` |
| `--shadow-lg` | `0 20px 25px -5px rgb(26 26 26 / 0.1), 0 8px 10px -6px rgb(26 26 26 / 0.1)` |
| `--shadow-xl` | `0 25px 50px -12px rgb(26 26 26 / 0.25)` |

The compiled runtime implements the same scale using `--shadow-colour` and RGBA composition.

## Feedback shadows

Buckholt changes the shadow colour to match feedback states. The documented feedback shadow classes are:

- `.shadow-info`
- `.shadow-success`
- `.shadow-warning`
- `.shadow-error`

Use these only where the corresponding Buckholt feedback pattern calls for them.

## Agent rules

1. Follow the documented Buckholt component first; do not manually add elevation when the component is intended to be flat.
2. When a shadow is required, use the documented Buckholt token or class rather than writing a new `box-shadow` value.
3. Choose elevation according to hierarchy: lighter for lower elevated layers, heavier for higher layers.
4. Do not infer that a larger shadow is visually preferable simply because it exists in the runtime CSS.
5. Treat extra runtime shadow helpers as implementation flexibility, not new design-system guidance unless they are documented.
