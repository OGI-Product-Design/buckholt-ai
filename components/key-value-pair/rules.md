# Key-value pair

## Purpose

A Key-value pair displays a label and its associated value together to present clear, structured information. Use it for attributes, properties, summary/reference data and related details with a clear label-value relationship.

Do not use it for editable form inputs, long rich content, data that needs comparison across many rows/columns, or information without a clear label-value relationship.

## Base structure

```html
<div class="key-value">
    <span class="key">Key</span>
    <span class="value">Value</span>
</div>
```

`.key` is the label and `.value` is its associated information.

## Key-value list

Wrap multiple `.key-value` pairs in `.key-value-list`:

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
    <div class="key-value">
        <span class="key">Key</span>
        <span class="value">Value</span>
    </div>
</div>
```

Add `.key-value-list-row` to change the list direction from column to row:

```html
<div class="key-value-list key-value-list-row">
    ...
</div>
```

## Key-value grid

Use `.grid.key-value-grid` with `.key-value-item` wrappers. The documented grid keeps each nested pair as the base `.key-value` structure; do not add `.key-value-stacked` unless that modifier is separately required.

```html
<div class="grid key-value-grid" style="--columns: 3;">
    <div class="key-value-item">
        <div class="key-value">
            <span class="key">Key</span>
            <span class="value">Value</span>
        </div>
    </div>
    <div class="key-value-item">
        <div class="key-value">
            <span class="key">Key</span>
            <span class="value">Value</span>
        </div>
    </div>
    <div class="key-value-item">
        <div class="key-value">
            <span class="key">Key</span>
            <span class="value">Value</span>
        </div>
    </div>
</div>
```

The column count may be adjusted with the documented `--columns` variable.

## Key-value table

Wrap pairs in `.key-value-table`:

```html
<div class="key-value-table">
    <div class="key-value">
        <span class="key">Key</span>
        <span class="value">Value</span>
    </div>
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

Use `<hr>` between pairs when the documented divider treatment is required.

## Size

Size options apply to stacked Key-value pairs. Buckholt documents:

- `.key-value-xs`
- `.key-value-sm`
- default medium with no size modifier
- `.key-value-lg`
- `.key-value-xl`
- `.key-value-display`

Example:

```html
<div class="key-value key-value-stacked key-value-xs">
    <span class="key">Key</span>
    <span class="value">Value</span>
</div>
```

## Stacked and flipped

Stack one pair with `.key-value-stacked`; stack a whole list with `.key-value-list-stacked`.

```html
<div class="key-value key-value-stacked">
    <span class="key">Key</span>
    <span class="value">Value</span>
</div>
```

Flip the visual order with `.key-value-flipped`. Buckholt documents both inline and stacked flipped forms.

## Expressive colours

Add `.expressive` to apply the primary expressive palette:

```html
<div class="key-value expressive">
    <span class="key">Key</span>
    <span class="value">Value</span>
</div>
```

The primary palette is the default expressive palette. Use `.expressive-secondary`, `.expressive-tertiary` or `.expressive-quaternary` to switch palette.

## Content

- Keep Keys short and descriptive; one or two words is preferred where possible.
- Values should be concise and formatted appropriately for the data.
- Values may wrap to multiple lines; do not truncate just to preserve one-line presentation.
- Use stacked orientation when longer values need more room or stronger emphasis.

## Agent rules

- Use exactly one `.key` and one `.value` inside the base `.key-value`.
- Use the documented list, row, grid and table wrappers exactly as shown in `examples.html`.
- Do not add `.key-value-stacked` to grid items unless explicitly required; it is not part of the documented grid example.
- Use documented size modifiers only with the stacked presentation shown by Buckholt.
- Use `.key-value-list-stacked` for a stacked list and `.key-value-flipped` for reversed key/value emphasis.
- Use `.expressive` plus the documented palette modifiers for expressive colours.
- Do not recreate Key-value spacing, typography, colour or layout with local CSS.
