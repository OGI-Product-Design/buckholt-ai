# Buckholt AI instructions

## Purpose

Use the Buckholt design system accurately when building UI.

## Source hierarchy

1. **Buckholt documentation website** — primary source of truth for intended Digital Product design-system behaviour, including usage, hierarchy, accessibility, canonical markup, scales and design-system meaning.
2. `css/buckholt.css` — current runtime implementation. Use its real selectors, variables, states and browser behaviour. It may also contain additional helpers or values added when Buckholt was used to build the company website; those extras provide flexibility but do not automatically become canonical Buckholt guidance.
3. `foundations/<foundation>/` — shared design-system guidance extracted from the documentation and checked against runtime CSS where useful.
4. `components/<component>/rules.md` — component guidance rebuilt from documentation plus runtime implementation evidence.
5. `components/<component>/examples.html` — verified canonical markup examples.
6. `discrepancies/known-issues.md` — only significant documentation/runtime differences that could mislead implementation.

Old SCSS, old token maps, screenshots, Figma and previous interpreted AI specifications are **not** implementation sources unless explicitly requested for investigation.

## Core rule

**Build with Buckholt. Do not imitate Buckholt.**

Before implementing Buckholt UI:

- read the relevant foundation files when the component depends on colour, typography, spacing, iconography, radius, shadows or other shared rules;
- read `components/<component>/rules.md` and `examples.html` for the component;
- follow the documented Buckholt intent first;
- use the real runtime classes and variables from `css/buckholt.css` to implement that intent accurately;
- do not promote undocumented runtime extras into Buckholt design guidance simply because they exist in CSS;
- do not recreate component styling with custom CSS where Buckholt already provides it.

## Evidence discipline

The documentation defines intended Buckholt behaviour. The CSS shows what the current implementation can render. If the CSS contains extra website-specific helpers, they may be used when appropriate but should be treated as implementation flexibility rather than new design-system rules.

Only flag a documentation/runtime difference when it materially affects the requested Buckholt implementation.

## Foundations

### Colour
Read `foundations/colour/` before choosing or changing colours.

### Iconography
Read `foundations/iconography/rules.md` and `foundations/iconography/catalogue.md` before choosing an icon. Use the exact Buckholt mapping when one exists.

### Radius
Read `foundations/radius/rules.md` before adding or changing border radius. Prefer the documented scale and the radius already applied by the component. Additional runtime values can be used where an existing Buckholt implementation requires them.

### Shadows
Read `foundations/shadows/rules.md` before adding elevation.

Rules:
- use shadows only for genuinely elevated UI;
- use documented Buckholt shadow tokens/classes rather than arbitrary `box-shadow` values;
- lighter elevation should use lighter shadows and higher layers may use heavier shadows;
- feedback shadows must follow the corresponding Buckholt feedback state.

### Spacing
Read `foundations/spacing/rules.md` before introducing margins, padding or gaps.

Rules:
- prefer Buckholt spacing tokens instead of hard-coded `px`/`rem` values;
- read the relevant component/pattern documentation before changing its internal spacing;
- use the shared `--spacer-*` scale and dedicated `--padding-*` / `--margin-*` tokens as documented;
- do not choose spacing solely because it looks close.

### Typography
Read both:
- `foundations/typography/rules.md`
- `foundations/typography/type-sets.md`

Rules:
- use Buckholt's documented `Proxima-soft, Arial, sans-serif` stack through the runtime;
- choose typography by documented content role, then use the corresponding Buckholt type-set class;
- preserve the documented size, weight, line height and letter spacing of that type set;
- use semantic HTML according to document structure; do not choose `h1`–`h6` tags merely to get a particular visual size;
- prefer documented Buckholt classes such as `.display-03`, `.headline-02`, `.title-01`, `.body-02`, `.support-01`, `.action-01`, `.label-02`, `.key-01` and `.value-01` where their documented role fits;
- do not treat Bootstrap `.display-*`, `.fs-*` or generic heading helpers present in the compiled CSS as canonical Buckholt typography choices unless Buckholt documentation/component guidance explicitly uses them;
- do not invent a new Buckholt type set if the documented set does not cover the requirement; flag the gap instead.

## Custom CSS

Custom CSS may be used for page/demo layout only when necessary. It must not be used to recreate or override Buckholt component styling simply to make an implementation look right.

## Runtime dependencies

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
```

For Buckholt patterns that use Bootstrap behaviour such as tooltips, also load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
```

## Current component coverage

### Button
Read:
- `components/button/rules.md`
- `components/button/examples.html`
- relevant foundation files, especially colour, iconography, radius, spacing and typography

The Button Usage, Style and Code & specs documentation have all been supplied.

### Link
Read:
- `components/link/rules.md`
- `components/link/examples.html`
- relevant foundation files, especially colour, iconography, spacing and typography
- `discrepancies/known-issues.md` when exact visited-state rendering matters

Link rules:
- use links for navigation, not actions that modify data, state or display;
- use plain anchors for inline links and `.link-standalone` for standalone links;
- do not add icons to inline links;
- use the documented `.icon` structure and Buckholt icon mapping for standalone links when an icon is appropriate;
- use the external-link icon for links that open content in a new tab;
- use `.link-set` / `.linkset-item`, with `.link-set-stacked` for vertical groups;
- do not use generic Bootstrap `link-*` utilities as canonical Buckholt component guidance simply because they exist in the runtime CSS;
- documentation defines the intended visited Link colour. The current runtime has a known standalone visited-icon mismatch recorded in `discrepancies/known-issues.md`.

The Link Overview, Style and Code & specs documentation have all been supplied.

### Text block
Read:
- `components/text-block/rules.md`
- `components/text-block/examples.html`
- `foundations/typography/rules.md`
- `foundations/typography/type-sets.md`
- relevant Spacing, Iconography and Colour foundations

Text block rules:
- wrap written-content groups in `.text-block`;
- include at least a heading, a paragraph, or both;
- choose semantic `h1`–`h6` level from page structure independently of visual `.display-*`, `.headline-*` or `.title-*` class;
- do not skip heading levels just to change visual size;
- place each paragraph in its own `<p>` element;
- use `.eyebrow` for contextual text above a heading;
- use `<span class="icon">` for inline heading icons;
- icon blocks must be followed by a heading;
- do not combine icon blocks with eyebrow text;
- do not combine an icon block and inline heading icon in the same Text block;
- use inline icons, not icon blocks, with display-sized headings;
- use the default/medium icon block with title-styled headings and `.icon-block-xl` with headline-styled headings;
- do not recreate Text block internal spacing or width with custom CSS.

The Text block Overview, Style and Code & specs documentation have all been supplied.
