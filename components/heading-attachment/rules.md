# Buckholt Heading attachment

## Status

Complete Heading attachment guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Sources of truth

- Usage: `https://buck.88mph.design/components/text-data-display/heading-attachment/`
- Style: `https://buck.88mph.design/components/text-data-display/heading-attachment/style/`
- Code & specs: `https://buck.88mph.design/components/text-data-display/heading-attachment/code-specs/`
- Runtime implementation: `../../css/buckholt.css`

Heading attachment extends the Text block component. Read `../text-block/rules.md` first when using it.

## Purpose

A Heading attachment allows one secondary element to appear inline with a heading. It provides a place for closely related contextual actions or supporting information while keeping the heading as the primary focus.

Use it when a section needs an action or indicator that users may need immediately while scanning the heading.

Common documented uses include:

- navigation links such as View all, Browse all or See more;
- dismiss or close actions for removable content;
- contextual actions directly related to the section;
- status or supporting indicators such as Tags or Badges.

Do not use it for unrelated actions, primary page actions, large/complex controls or multiple competing actions. Move larger action groups into the content area instead.

## Relationship to Text block

Heading attachment is not a separate heading system. It extends `.text-block` by wrapping the heading content and attachment inside `.heading`.

Canonical structure:

```html
<div class="text-block">
  <div class="heading">
    <div class="heading-content">
      <h3 class="headline-02">Heading text</h3>
    </div>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <p>Supporting body content.</p>
</div>
```

The attachment must appear after `.heading-content` inside `.heading`.

## Supported content

The heading-content area follows the normal Text block rules and may contain the same supported heading-related elements, including heading text and, where documented by Text block, eyebrow or icon treatment.

The Heading attachment pattern may add one attached component such as:

- Link;
- Button / close control;
- Tag or Badge;
- related metadata.

The attachment must relate directly to the section content and support the next logical action or interpretation.

Do not add several unrelated controls into the attachment area.

## Canonical close-action example

```html
<div class="text-block">
  <div class="heading">
    <div class="heading-content">
      <h3 class="headline-02">Heading text</h3>
    </div>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <p>Vivamus non arcu tincidunt, congue massa at, porttitor velit.</p>
</div>
```

If the close button is wired to a Bootstrap behaviour such as dismissing a modal, use the relevant documented Bootstrap attributes for that containing component. Do not add dismissal behaviour when no dismissible parent exists.

## Icon block within heading content

The documentation also shows Heading attachment composed with an Icon block inside `.heading-content`:

```html
<div class="text-block">
  <div class="heading">
    <div class="heading-content">
      <div class="icon-block icon-block-xl">
        <i class="fa-regular fa-ghost" aria-hidden="true"></i>
      </div>
      <h3 class="headline-02">Heading text</h3>
    </div>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <p>Supporting body content.</p>
</div>
```

Follow both Text block and Icon block composition rules rather than treating this example as permission to invent new combinations.

## Colour and typography

The Style documentation states that Heading attachment inherits the same colour and typography rules as Text block.

Read:

- `../text-block/rules.md`
- `../../foundations/colour/`
- `../../foundations/typography/rules.md`
- `../../foundations/typography/type-sets.md`

Do not create a separate Heading attachment colour or type system.

## Structure and spacing

Runtime CSS applies the heading-row relationship:

```css
.text-block .heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}
```

This creates a 16px / 1rem separation between heading content and the attachment while keeping the attachment aligned to the top by default.

The runtime also exposes heading attachment alignment helpers for the attached element. Treat these as runtime capability unless a supplied Buckholt page explicitly calls for a specific alternate alignment; do not promote them as the default design decision simply because they exist.

Do not recreate the heading row with custom flex or spacing CSS.

## Content rules

- The heading remains the primary visual and semantic focus.
- Use a single closely related attachment.
- Keep the attachment compact.
- Keep the body/content structure below the heading row consistent with Text block.
- Do not use the attachment area as a general toolbar.
- Choose the semantic heading level from the page hierarchy, independently of the visual Buckholt type-set class.

## Accessibility

The attachment retains the accessibility contract of the component used there.

Examples:

- a close control needs an accessible name such as `aria-label="Close"`;
- a Link needs meaningful destination text;
- a Button must follow the Button component rules;
- decorative/supporting icons should use `aria-hidden="true"` where appropriate.

Do not rely on position alone to explain what an attachment does. Its label, icon and accessible name must make its purpose understandable.

## Agent rules

- Start from `.text-block`; Heading attachment extends it.
- Use `.heading` as the inline row wrapper.
- Put heading-related content inside `.heading-content`.
- Place exactly one closely related attachment after `.heading-content`.
- Preserve semantic heading hierarchy independently of visual type style.
- Reuse the documented Link, Button, Tag, Icon block or other component rather than recreating it.
- Inherit Text block colour, typography and content rules.
- Do not use Heading attachment for primary page actions, complex controls or crowded action groups.
- Do not recreate the heading row, gap or alignment with custom CSS.
