# Typography

## Source authority

The Buckholt Typography documentation is the primary source of truth for typography intent and usage. `css/buckholt.css` is the runtime implementation and may contain additional Bootstrap or website-specific typography helpers that are not canonical Buckholt guidance.

## Purpose

Typography shapes communication, hierarchy and readability across Buckholt products. Use the documented Buckholt type scales and type sets rather than inventing font sizes, weights, line heights or letter spacing.

## Typeface

Buckholt's default typeface is **Proxima Soft**.

Approved runtime font dependency:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
```

Documented font stack:

```css
font-family: 'Proxima-soft', Arial, sans-serif;
```

The documentation also describes Quicksand as a visually similar fallback concept, but the canonical documented CSS font stack is `Proxima-soft`, Arial, sans-serif. Do not add Quicksand to the runtime stack unless Buckholt documentation/runtime is explicitly changed.

## Type scale

Buckholt uses ten core type-scale tokens:

| Token | rem | px |
| --- | ---: | ---: |
| `--typescale-01` | 0.75rem | 12px |
| `--typescale-02` | 0.875rem | 14px |
| `--typescale-03` | 1rem | 16px |
| `--typescale-04` | 1.25rem | 20px |
| `--typescale-05` | 1.5rem | 24px |
| `--typescale-06` | 1.75rem | 28px |
| `--typescale-07` | 2rem | 32px |
| `--typescale-08` | 2.25rem | 36px |
| `--typescale-09` | 2.5rem | 40px |
| `--typescale-10` | 3.5rem | 56px |

These values are also present in the current compiled runtime CSS.

## Recommended weights

For Digital Product experiences, the documentation recommends these Proxima Soft weights:

- Light - 300
- Regular - 400
- Medium - 500
- Semibold - 600

Semibold is appropriate for section headings but should be avoided for long-form content to preserve readability.

Runtime variables also expose additional weights, but their existence does not make them recommended Buckholt typography roles.

## Type colour

Typography colour should prioritise legibility and accessibility.

- Keep general/body text neutral for readability.
- Use primary blue for interactive text and primary actions.
- Use semantic/status colours when colour communicates a specific meaning such as error, warning or status.
- Do not apply arbitrary accent colours to text purely for decoration.
- Read `foundations/colour/` before choosing text colours.

## Type sets

Buckholt does not expect agents to assemble arbitrary combinations of type scale + weight + line height. It provides named type sets for specific roles.

Read `foundations/typography/type-sets.md` and use the documented class where one exists.

Examples:

```html
<h1 class="display-03">Page title</h1>
<h2 class="headline-03">Section heading</h2>
<h3 class="title-02">Card title</h3>
<p class="body-02">Body copy</p>
<p class="support-01">Helper text</p>
```

Use semantic HTML appropriate to the content structure; the type-set class controls the visual style. Do not choose heading tags solely to obtain a size.

## Agent rules

1. Prefer a documented type-set class over custom font styling.
2. Do not hard-code a font size when a Buckholt type set already represents the intended role.
3. Preserve the documented weight, line height and letter spacing of the selected type set.
4. Use `Proxima-soft`, Arial, sans-serif through the Buckholt runtime rather than inventing another font stack.
5. Do not use Bootstrap `.display-*`, `.fs-*`, heading helpers or other runtime typography utilities as canonical Buckholt design choices unless a Buckholt component/pattern explicitly requires them.
6. Do not choose typography based only on visual similarity; choose the documented semantic role.
7. If no documented type set covers a requirement, report the gap before creating a new Buckholt typography style.
