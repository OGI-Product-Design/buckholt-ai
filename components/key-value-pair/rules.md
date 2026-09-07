# Buckholt Key-value pair

## Status

Complete Key-value pair guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Sources of truth

- Usage: `https://buck.88mph.design/components/text-data-display/key-value/`
- Style: `https://buck.88mph.design/components/text-data-display/key-value/style/`
- Code & specs: `https://buck.88mph.design/components/text-data-display/key-value/code-specs/`
- Runtime implementation: `../../css/buckholt.css`

Use documentation for intended structure, grouping and presentation. Use runtime CSS for actual selectors and behaviour.

## Purpose

A Key-value pair displays a label and its associated value together to present structured information clearly. It is suited to attributes, properties and details that benefit from a consistent label/value relationship.

## Canonical single pair

```html
<div class="key-value">
  <span class="key">Key</span>
  <span class="value">Value</span>
</div>
```

`.key` is the label. `.value` is the associated data.

Use real text rather than visual positioning alone so the relationship remains understandable and adaptable.

## Orientation

The default Key-value pair is horizontal.

Use `.key-value-stacked` for a vertical label-over-value arrangement:

```html
<div class="key-value key-value-stacked">
  <span class="key">Policy number</span>
  <span class="value">FPM60129587462HI</span>
</div>
```

The runtime removes the horizontal gap in the stacked form.

## Grouping: Key-value list

Wrap multiple pairs in `.key-value-list` to create a vertical list:

```html
<div class="key-value-list">
  <div class="key-value">
    <span class="key">Key</span>
    <span class="value">Value</span>
  </div>
  <div class="key-value">
    <span class="key">Key</span>
    <span class="value">Value</span>
  </div>
</div>
```

Add `.key-value-list-row` to change the group from column to wrapping row layout:

```html
<div class="key-value-list key-value-list-row">
  ...
</div>
```

The runtime uses 16px / 1rem spacing for the vertical list and 24px / 1.5rem spacing for the row variant.

## Grouping: Key-value grid

Use `.grid .key-value-grid` with `.key-value-item` wrappers for a panelled grid of pairs:

```html
<div class="grid key-value-grid" style="--columns: 3;">
  <div class="key-value-item">
    <div class="key-value key-value-stacked">
      <span class="key">Key</span>
      <span class="value">Value</span>
    </div>
  </div>
</div>
```

The documentation explicitly allows the column count to be adjusted with the `--columns` custom property.

The runtime defaults to three columns, uses 4px gaps, an 8px radius, UI overlay background and component-controlled padding for each item.

Do not replace the grid with arbitrary card styling when this documented pattern fits.

## Grouping: Key-value table

Use `.key-value-table` when structured data benefits from consistent label and value columns without requiring a traditional HTML table:

```html
<div class="key-value-table">
  <div class="key-value">
    <span class="key">Name</span>
    <span class="value">Rick Deckard</span>
  </div>
  <div class="key-value">
    <span class="key">Date of birth</span>
    <span class="value">23rd January 1986</span>
  </div>
</div>
```

The documentation permits `<hr>` between pairs to create a divider:

```html
<div class="key-value-table">
  <div class="key-value">...</div>
  <hr>
  <div class="key-value">...</div>
</div>
```

The runtime lays this out as two grid columns and makes each nested `.key-value` contribute its children directly to the grid.

Use a real semantic `<table>` instead when the content is genuinely tabular with row/column relationships that require table semantics.

## Size modifiers

Buckholt documents multiple Key-value size treatments. The Code & specs examples include:

- `.key-value-xs`
- `.key-value-sm`
- default / no size modifier
- `.key-value-lg`
- `.key-value-xl`
- `.key-value-display`

These modifiers change the Key and Value typography. Use the documented class rather than manually changing font size or weight.

The size modifiers can be combined with `.key-value-stacked`, as shown in the documentation.

## Colour

Runtime component variables map the Key to `--text-secondary` and Value to `--text-primary` by default.

Use the Colour foundation and existing component variables. Do not hard-code replacement colours for Key or Value text.

## Typography

Key-value typography is a distinct Buckholt content role. Read `../../foundations/typography/type-sets.md` and use the component size modifiers where documented.

Do not substitute Bootstrap font-size or heading utilities to imitate a Key-value size.

## Content

- Keep the Key concise and descriptive.
- Put the actual associated data in Value.
- Avoid using a Key-value pair when there is no meaningful label/value relationship.
- Use consistent labels across comparable data sets.
- Choose stacked presentation when horizontal space is limited or the Value needs stronger visual emphasis.

## Accessibility and semantics

The visible Key and Value must both be represented as real text.

For simple display metadata the documented `div`/`span` structure is canonical. If the information needs richer semantic relationships for a specific product context, do not alter Buckholt styling by imitation; use the appropriate semantic container while preserving the documented visual contract where possible.

## Runtime implementation

The runtime base component uses flexbox and an 8px / 0.5rem gap:

```css
.key-value {
  --keyvalue-gap: 0.5rem;
  --keyvalue-key: var(--text-secondary);
  --keyvalue-value: var(--text-primary);
  display: flex;
  gap: var(--keyvalue-gap);
}
```

It also implements the documented stacked, list, row, grid, table and size variants.

Do not recreate these layouts with local CSS.

## Agent rules

- Use `.key-value` with one `.key` and one `.value` for the base component.
- Use `.key-value-stacked` only for the documented vertical variant.
- Use `.key-value-list` for grouped lists and add `.key-value-list-row` for horizontal wrapping.
- Use `.grid.key-value-grid` and `.key-value-item` for the documented grid pattern; `--columns` is the documented configuration point.
- Use `.key-value-table` for the documented two-column metadata presentation, not as a substitute for semantic data tables where true table semantics are required.
- Use documented size modifiers rather than custom typography.
- Keep labels and values concise and structurally paired.
- Do not recreate Key-value colours, spacing, typography or layout with custom CSS.
