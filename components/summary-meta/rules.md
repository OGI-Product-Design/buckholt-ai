# Buckholt Summary Meta

## Status

Complete Summary Meta guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Sources of truth

- Usage: `https://buck.88mph.design/components/text-data-display/summary-meta/`
- Style: `https://buck.88mph.design/components/text-data-display/summary-meta/style/`
- Code & specs: `https://buck.88mph.design/components/text-data-display/summary-meta/code-specs/`
- Runtime implementation: `../../css/buckholt.css`

Use the documentation for intended composition and content. Use runtime CSS for actual selectors and layout behaviour.

## Purpose

Summary Meta is a flexible composition component for presenting important contextual information at a glance. It combines an Icon block with short supporting content such as a heading, label, body text or Key-value pair.

Use it for concise summaries where a strong visual cue helps users scan important information quickly, including dashboards, confirmations, overview sections and compact summary areas.

Avoid turning it into a dense content container. The content should remain short, essential and scannable.

## Canonical base markup

```html
<div class="summary-meta">
  <div class="icon-block icon-block-xxl expressive-dark expressive-primary">
    <i class="fa-regular fa-ghost" aria-hidden="true"></i>
  </div>
  <div class="summary-meta-body">
    <h4 class="summary-meta-headline">Headline</h4>
    <div class="summary-meta-label">Label</div>
    <p class="summary-meta-text">Body text content</p>
  </div>
</div>
```

The example icon is documentation/example content. Choose a meaningful icon from the Buckholt Iconography catalogue when a documented mapping exists.

## Anatomy

Summary Meta consists of:

- an Icon block;
- a `.summary-meta-body` content area.

The body may contain suitable short supporting content such as:

- `.summary-meta-headline`;
- `.summary-meta-label`;
- `.summary-meta-text`;
- a documented Key-value pair;
- another short content combination supported by the documentation and context.

All colour styling is inherited from the components used inside Summary Meta rather than being defined independently by Summary Meta.

## Default layout

The default `.summary-meta` layout places the Icon block and content horizontally with a 16px / 1rem gap.

The documentation commonly uses an extra-extra-large Icon block (`.icon-block-xxl`, 80px / 5rem). The default content model is designed around three short lines so the text aligns naturally with the 80px icon height.

This commonly means a heading plus two supporting content types, for example:

```html
<div class="summary-meta-body">
  <h4 class="summary-meta-headline">AK67 NLR</h4>
  <div class="summary-meta-label">Hyundai Santa Fe</div>
  <p class="summary-meta-text">2.0 TDI 4Motion R-Line 5dr DSG</p>
</div>
```

Other combinations and Icon block sizes may be appropriate where the documentation/context supports them.

## Stacked modifier

Add `.summary-meta-stacked` to arrange the Icon block and content vertically:

```html
<div class="summary-meta summary-meta-stacked">
  <div class="icon-block icon-block-xxl expressive-dark expressive-primary">
    <i class="fa-regular fa-house" aria-hidden="true"></i>
  </div>
  <div class="summary-meta-body">
    <div class="key-value">
      <span class="key">Policy number</span>
      <span class="value">FPM60129587462HI</span>
    </div>
    <p class="summary-meta-text">Insurance provided by <strong>Best Home Insurance</strong></p>
  </div>
</div>
```

The stacked variant is useful in narrower spaces or where a centred, more separated summary is appropriate, such as within a card.

Runtime behaviour centres the stacked body content and centres Key-value pairs within it.

## Content rules

- Keep headings, labels and values short and preferably on one line.
- Include only the essential information required to understand the summary.
- Avoid verbose descriptions and unnecessary line breaks.
- Use a Key-value pair when the content is naturally a label/value relationship; follow `../key-value-pair/rules.md`.
- Use `../icon-block/rules.md` for Icon block size, colour treatment and icon accessibility.
- Do not duplicate or locally restyle the typography supplied by the component classes.

## Typography

The documentation states that headings, labels and body text follow Buckholt headline, label and body typography respectively.

The current runtime implements:

- `.summary-meta-headline` as a 24px / 1.5rem semibold headline treatment at standard desktop size;
- `.summary-meta-label` as 16px / 1rem, medium, 24px / 1.5rem line height;
- `.summary-meta-text` using inherited body text styling with its margin reset to zero.

Read the Typography foundation before changing typography. Do not substitute arbitrary Bootstrap heading or font-size utilities.

## Accessibility

Summary Meta should remain understandable without its icon or colour treatment.

Use `aria-hidden="true"` for an Icon block glyph that only supports adjacent text. If another nested component has its own accessibility contract, follow that component as well.

Use a semantic heading element appropriate to the page structure. The documentation examples use `h4`, but the correct heading level must come from document hierarchy rather than copying the example level blindly.

## Runtime implementation

The runtime provides:

```css
.summary-meta {
  display: flex;
  gap: 1rem;
}

.summary-meta.summary-meta-stacked {
  flex-direction: column;
  align-items: center;
}
```

It also prevents the Icon block from shrinking, centres stacked child content, provides the documented headline/label typography and removes paragraph margin from `.summary-meta-text`.

Do not recreate this layout with local flex, gap, typography or alignment CSS.

## Agent rules

- Use `.summary-meta` as the base composition.
- Put the Icon block before `.summary-meta-body` in canonical markup.
- Use `.summary-meta-stacked` only for the documented vertical/centred variant.
- Keep content concise and scan-friendly.
- Use `.summary-meta-headline`, `.summary-meta-label` and `.summary-meta-text` where those content roles apply.
- Reuse the documented Icon block and Key-value components rather than rebuilding them inside Summary Meta.
- Choose semantic heading level from the surrounding page structure.
- Do not invent local Summary Meta colours, spacing or typography.
