# Buckholt Icon block

## Status

Complete Icon block guidance rebuilt from the Buckholt Usage, Style and Code & specs documentation supplied by Product Design, checked against `../../css/buckholt.css` for runtime implementation.

## Sources of truth

- Usage: `https://buck.88mph.design/components/imagery/icon-block/`
- Style: `https://buck.88mph.design/components/imagery/icon-block/style/`
- Code & specs: `https://buck.88mph.design/components/imagery/icon-block/code-specs/`
- Runtime implementation: `../../css/buckholt.css`

Use the documentation for intended purpose, sizing, colour treatment and canonical markup. Use `buckholt.css` for actual runtime selectors and variables. Choose icons from `../../foundations/iconography/catalogue.md` rather than guessing.

## Purpose

An Icon block is a prominent contained icon used alongside content to draw attention and visually emphasise the message or context.

It can help users understand the tone, purpose, context or categorisation of nearby content and can make important information easier to scan.

The supplied Usage page appears to have its `When to use` and `When not to use` headings reversed. The bullet content itself is clear:

Use an Icon block when:

- you want to draw attention to key content;
- a visual cue helps explain or reinforce the message;
- establishing tone is important, for example information, warning or success.

Avoid an Icon block when:

- the content is already clear without a visual aid;
- repeated icons would distract or clutter the layout;
- a display-sized heading is being used, where an inline icon is more appropriate.

## Canonical base markup

```html
<div class="icon-block">
  <i class="fa-regular fa-ghost" aria-hidden="true"></i>
</div>
```

`.icon-block` is the container. The chosen Font Awesome icon sits inside it.

`fa-ghost` is a documentation/example glyph, not a generic recommendation for product UI. Use the exact Buckholt icon mapping from the Iconography catalogue when one exists.

When the icon is decorative or only reinforces adjacent text, hide it from assistive technology with `aria-hidden="true"` so the nearby text carries the meaning.

## Anatomy

The documented anatomy has two parts:

- container;
- icon.

The runtime centres the icon within a fixed square container using flexbox.

## Sizes

Buckholt documents six Icon block sizes:

| Size | Class | Container | Icon | Radius |
| --- | --- | ---: | ---: | ---: |
| Extra small | `.icon-block-xs` | 32px / 2rem | 16px / 1rem | 6px / 0.375rem |
| Small | `.icon-block-sm` | 44px / 2.75rem | 24px / 1.5rem | 6px / 0.375rem |
| Medium/default | `.icon-block` | 48px / 3rem | 24px / 1.5rem | 8px / 0.5rem |
| Large | `.icon-block-lg` | 56px / 3.5rem | 24px / 1.5rem | 8px / 0.5rem |
| Extra large | `.icon-block-xl` | 64px / 4rem | 32px / 2rem | 8px / 0.5rem |
| Extra extra large | `.icon-block-xxl` | 80px / 5rem | 32px / 2rem | 8px / 0.5rem |

Examples:

```html
<div class="icon-block icon-block-xs">
  <i class="fa-solid fa-sparkles" aria-hidden="true"></i>
</div>

<div class="icon-block icon-block-sm">
  <i class="fa-regular fa-car" aria-hidden="true"></i>
</div>

<div class="icon-block">
  <i class="fa-regular fa-ghost" aria-hidden="true"></i>
</div>

<div class="icon-block icon-block-lg">
  <i class="fa-regular fa-flag" aria-hidden="true"></i>
</div>

<div class="icon-block icon-block-xl">
  <i class="fa-regular fa-flag" aria-hidden="true"></i>
</div>

<div class="icon-block icon-block-xxl">
  <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
</div>
```

Do not invent intermediate Icon block sizes when one of the documented sizes fits.

## Default colour treatment

The default Icon block is neutral:

- icon: Text secondary;
- container background: UI overlay 03;
- documented border colour: transparent.

Use the Colour foundation for semantic colour references rather than hard-coding the example values.

The runtime exposes these through component variables including `--icon-block-icon`, `--icon-block-background`, `--icon-block-border` and `--icon-block-radius`.

## Expressive colours

Icon blocks may use Buckholt's expressive colour palette where colour better supports the tone, context or importance of the content.

Two treatment classes are documented:

- `.expressive-light` — expressive deep icon on expressive pale-overlay background;
- `.expressive-dark` — Text light icon on expressive rich background.

The primary expressive palette is used by default.

```html
<div class="icon-block expressive-light">
  <i class="fa-regular fa-rocket" aria-hidden="true"></i>
</div>

<div class="icon-block expressive-dark">
  <i class="fa-regular fa-rocket" aria-hidden="true"></i>
</div>
```

To use another documented expressive palette, combine the treatment with one of:

- `.expressive-secondary`;
- `.expressive-tertiary`;
- `.expressive-quaternary`.

```html
<div class="icon-block expressive-light expressive-secondary">
  <i class="fa-regular fa-flag" aria-hidden="true"></i>
</div>

<div class="icon-block expressive-dark expressive-tertiary">
  <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
</div>

<div class="icon-block expressive-light expressive-quaternary">
  <i class="fa-regular fa-file" aria-hidden="true"></i>
</div>
```

Do not pick arbitrary palette colours directly. Use the documented expressive classes so the semantic palette variables drive the component.

## Icon choice

Read:

- `../../foundations/iconography/rules.md`
- `../../foundations/iconography/catalogue.md`

Rules:

- select an icon that supports the meaning of the content;
- use the exact documented Font Awesome style and name when a Buckholt catalogue entry exists;
- do not repurpose a familiar icon for an unrelated meaning;
- do not treat example icons in this component documentation as universal mappings.

## Composition with Text block

Icon blocks are also used by the Text block component. When used there, follow `../text-block/rules.md` as the composition authority.

In Text blocks:

- the Icon block appears above the heading;
- it must be followed by a heading;
- do not combine an Icon block with eyebrow text;
- do not combine an Icon block with an inline heading icon in the same Text block;
- do not use Icon blocks with display-sized headings;
- title-styled headings use the default/medium Icon block;
- headline-styled headings use `.icon-block-xl`.

The Text block runtime supplies its own spacing around the Icon block. Do not manually reproduce that spacing in generated product UI.

## Accessibility

An Icon block is primarily a visual-support component. The surrounding content should communicate the message without relying on the icon alone.

For decorative/supporting icons, use `aria-hidden="true"` on the Font Awesome element. Do not encode essential information only through the icon or expressive colour.

If an Icon block is used in another component with its own accessibility contract, follow that component's documentation as well.

## Runtime implementation

The current `buckholt.css` implementation provides all six documented sizes and the expressive-light/dark treatment classes. Palette modifier classes remap the shared expressive variables used by the Icon block.

Let the runtime provide size, radius, centring and colour treatment. Do not recreate the Icon block with local width, height, font-size, border-radius or background CSS.

## Agent rules

- Use `.icon-block` as the base component.
- Choose only documented size modifiers: `.icon-block-xs`, `.icon-block-sm`, `.icon-block-lg`, `.icon-block-xl`, `.icon-block-xxl`; no modifier means medium/default.
- Choose icons from the Buckholt Iconography catalogue where possible.
- Use `.expressive-light` or `.expressive-dark` only when an expressive treatment is appropriate.
- Use `.expressive-secondary`, `.expressive-tertiary` or `.expressive-quaternary` only as documented palette modifiers; primary is the default expressive palette.
- Preserve adjacent text as the source of meaning; do not rely on icon or colour alone.
- Use `aria-hidden="true"` for decorative/supporting icons.
- When the Icon block sits inside a Text block, follow the Text block composition rules.
- Do not invent custom Icon block sizes, colours, radius or layout CSS.
