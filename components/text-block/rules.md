# Buckholt Text block

## Purpose

Text block is Buckholt's flexible written-content component. It is used to display headings and body text, with optional supporting elements such as eyebrow text and icons.

A Text block must contain at least a heading, a paragraph, or both.

## When to use

Use Text block:

- for main body text such as full sentences and paragraphs;
- for page and section headings;
- for explanatory, descriptive or instructional content.

## Base structure

Wrap Text block content in `.text-block`.

```html
<div class="text-block">
  <h2 class="headline-03">Heading text</h2>
  <p>Paragraph text.</p>
</div>
```

The `.text-block` wrapper manages the component's text width and internal spacing. Do not recreate this spacing with local CSS.

## Heading semantics and visual style

Heading tags and heading styles are separate decisions.

Use the semantic heading level (`h1` through `h6`) that matches the page hierarchy. Reserve `h1` for the main page title in normal page structures, then use lower levels in a clear nested order. Do not skip heading levels merely to obtain a visual size.

Use Buckholt typography classes to control the visual role:

- `.display-*` — largest display heading treatment;
- `.headline-*` — headline treatment;
- `.title-*` — more compact title treatment.

Read `foundations/typography/type-sets.md` before choosing the specific type-set class.

Canonical examples from the documentation include:

```html
<div class="text-block">
  <h1 class="display-03">Display heading</h1>
</div>

<div class="text-block">
  <h2 class="headline-03">Headline heading</h2>
</div>

<div class="text-block">
  <h3 class="title-03">Title heading</h3>
</div>
```

## Paragraph structure and spacing

Each paragraph must use its own `<p>` element.

Buckholt documents:

- the first paragraph following another Text block element receives 4px / 0.25rem top spacing;
- subsequent paragraphs within the same Text block receive 16px / 1rem top spacing.

Use the runtime implementation in `css/buckholt.css`; do not manually reproduce those margins.

## Eyebrow

Use `.eyebrow` for short contextual text above the heading.

```html
<div class="text-block">
  <span class="eyebrow">Eyebrow text</span>
  <h2 class="headline-03">Heading text</h2>
  <p>Paragraph text.</p>
</div>
```

Runtime behaviour includes Buckholt eyebrow typography and colour plus a 16px bottom margin.

## Inline heading icons

An icon may be placed inline within a heading using `<span class="icon">`.

```html
<div class="text-block">
  <h2 class="headline-03">
    <span class="icon">
      <i class="fa-regular fa-ghost" aria-hidden="true"></i>
    </span>
    Heading text
  </h2>
  <p>Paragraph text.</p>
</div>
```

Use an icon from `foundations/iconography/catalogue.md` when a documented mapping exists.

For display-sized headings, the documentation specifically recommends inline icons rather than icon blocks.

## Icon blocks

Icon blocks are placed above the heading and are intended to grab attention, establish tone, provide context/categorisation or make sections easier to scan.

Canonical structure:

```html
<div class="text-block">
  <div class="icon-block icon-block-xl">
    <i class="fa-regular fa-ghost" aria-hidden="true"></i>
  </div>
  <h2 class="headline-02">Heading text</h2>
  <p>Paragraph text.</p>
</div>
```

Rules:

- use an icon block only when the icon meaningfully supports the content;
- icon blocks must be followed by a heading;
- do not combine an icon block and an inline heading icon in the same Text block;
- do not combine an icon block with eyebrow text;
- do not use icon blocks with display-sized headings.

## Icon block sizing

Text blocks use two documented icon-block sizes:

- default / medium icon block with title-styled headings;
- `.icon-block-xl` with headline-styled headings.

Do not invent a different Text block icon-block size unless another Buckholt component or its documentation explicitly requires one.

## Interconnected foundations

Text block depends directly on:

- Typography — heading and body roles;
- Spacing — internal element relationships;
- Iconography — inline icons and icon blocks;
- Colour — eyebrow and text roles.

Read the relevant foundation files before overriding any shared styling.

## Runtime notes

The current compiled CSS applies:

```css
.text-block {
  --eyebrow: var(--text-tertiary);
  max-width: var(--text-max-width);
}

.eyebrow {
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 0.25px;
  line-height: 1.25rem;
  color: var(--eyebrow);
  margin-bottom: 1rem;
  display: block;
}
```

Treat these as the current runtime implementation. The documentation remains the primary source for intended composition and usage.

## Accessibility

- Use semantic heading levels based on document structure.
- Do not skip heading levels simply to obtain a smaller visual heading.
- Decorative/supporting icons should use `aria-hidden="true"` when they do not add independent meaning.
- Do not rely on an icon alone to communicate the content of the heading or block.
- Keep explanatory content as real text rather than encoding meaning only in visual styling.

## Agent rules

When generating Buckholt Text blocks:

1. Use `.text-block` as the component wrapper.
2. Include at least a heading, a paragraph, or both.
3. Choose semantic heading level first, then select the documented Buckholt typography class.
4. Put each paragraph in its own `<p>` element.
5. Use `.eyebrow` only above a heading.
6. Use `<span class="icon">` for inline heading icons.
7. Use `.icon-block` / `.icon-block-xl` only according to the documented Text block rules.
8. Never combine eyebrow text with an icon block.
9. Never combine an icon block with an inline heading icon in the same Text block.
10. Use inline icons, not icon blocks, with display-sized headings.
11. Do not manually recreate Text block widths or internal paragraph/heading spacing with custom CSS.
12. Read Typography, Spacing and Iconography foundations before introducing visual variants.
