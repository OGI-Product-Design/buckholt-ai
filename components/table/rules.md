# Table

## Status
**Provisional / work in progress.**

Table is a key Buckholt component and should be used where tabular data is needed, but the current Buckholt documentation is not complete. The available source provides working HTML examples and base table styling, but does not yet provide a full Usage/Style/Code specification comparable with more mature components.

Agents must therefore:
- use the documented HTML and existing runtime table styles as the current Buckholt implementation;
- follow the cautious usage guidance below where it can be inferred from the provided examples and normal table semantics;
- not invent undocumented Table variants, responsive behaviour, pagination, density controls, column pinning or other data-grid behaviour;
- treat this file as provisional and update it when Buckholt Table documentation is completed.

Incomplete documentation does **not** mean Table should be avoided. Use the documented Table implementation when a table is the right structure.

## Intended use
Use Table for data that is genuinely tabular: records organised into consistent rows and columns where column relationships matter and users benefit from scanning or comparing values across records.

Do not use a Table merely to create visual alignment for unrelated content. Use other Buckholt layout/components when the content is not relational tabular data.

## Core structure
The current documented HTML wraps the native table in `.table-container` and `.table-content` and applies `.table` to the `<table>` element:

```html
<div class="table-container">
  <div class="table-content">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">
            <div class="table-header-label">Customer ID</div>
          </th>
          <th scope="col">
            <div class="table-header-label">Policy number</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-gap"><td colspan="100%"></td></tr>
        <tr>
          <td>CUST-10234</td>
          <td>POL-884291</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>` and `<td>` elements. Column headers in the provided source use `scope="col"`.

## Header labels
The provided HTML wraps visible header text in `.table-header-label`.

Keep header text concise and specific to the values in the column.

## Sortable columns
The WIP source includes sortable headers using `.table-sort-header` and a semantic button `.table-sort`:

```html
<th scope="col" class="table-sort-header">
  <button class="table-sort" type="button" data-col="1" data-sort-type="text" aria-label="Sort by User">
    <div class="table-header-label">User</div>
    <div class="table-sort-icon">
      <i class="fa-solid fa-sort" aria-hidden="true"></i>
    </div>
  </button>
</th>
```

Use a real `<button>` for sorting, with an accessible name that identifies the column. The sort icon is supplementary and should be hidden from assistive technology.

The enhanced example also uses `data-cdt-table`, `data-col`, `data-sort-type` and per-cell `data-sort-value`. These attributes appear to support the documented WIP table implementation. Use them when implementing the supplied sortable-table pattern rather than inventing a different API.

Do not infer sort-state classes or ARIA state beyond what has been documented. If implementing production sorting, the application should also expose the current sort state accessibly; that behaviour is not fully specified in the present Buckholt source.

## Selection
The enhanced example includes a checkbox column:
- header: `.table-checkbox-header.col-fit`
- native `.form-check-input` checkbox
- header checkbox uses `data-cdt-select-column="0"`
- row checkboxes remain native checkbox inputs.

Preserve native checkbox controls and their keyboard/accessibility behaviour. Reuse the Buckholt Checkbox component documentation once that component is available rather than styling checkboxes locally.

## Column sizing and alignment
The WIP HTML provides these implementation classes:
- `.col-fit` for content-width columns such as checkboxes, numbers or row actions;
- `.cell-data-right` for right-aligned data cells/headers;
- `.data-number` around numeric values;
- `.data-secondary` for secondary data within a cell.

Use these only where the documented HTML demonstrates the role. Do not extrapolate a new grid/column API from them.

## Row actions and nested components
The enhanced example shows Buckholt components embedded inside cells, including:
- Avatar;
- Tag/status Tag;
- Button set / icon-only ghost Buttons;
- Checkbox.

When a table cell contains another Buckholt component, use that component's own documented markup and rules. Table does not redefine those components.

Keep row actions scoped to that row and give icon-only actions accessible names/tooltips according to Button guidance.

## Standard visual treatment
The current table styling establishes:
- full-width table inside `.table` contexts;
- shared horizontal/vertical cell padding through table variables;
- styled header background and rounded outer header corners;
- 3.5rem header/standard-row minimum treatment;
- bottom borders between standard data rows;
- top alignment for standard `.table td` content;
- by default, the first standard data column is italic unless `.no-italics` is applied.

Use runtime styling. Do not duplicate these values in custom CSS.

## Simple table
The existing implementation includes `.simple_table` as a reduced visual treatment. It uses fixed layout, transparent headers, removes row/cell borders, removes outer horizontal padding and changes header/body typography.

The documentation site frequently uses:
```html
<table class="table no-italics simple_table">
```

Use `.simple_table` only when the lighter presentation shown by the existing Buckholt implementation is appropriate. Because formal usage guidance is not yet documented, do not invent additional semantic meaning for this modifier.

## First-column italics
The standard runtime uses italic styling on the first data column. Add `.no-italics` to `.table` where the documented example intentionally suppresses that behaviour.

Do not apply `.no-italics` automatically to every table; the distinction is part of the existing implementation even though its usage rationale has not yet been formally documented.

## Table gap
The HTML includes:
```html
<tr class="table-gap"><td colspan="100%"></td></tr>
```
following the table header. Preserve it when following the canonical examples unless updated documentation removes it.

## Accessibility
- Use native table semantics for real tabular data.
- Use `<th scope="col">` for column headers as shown in the source.
- Sorting must use semantic Buttons rather than clickable `<div>` elements.
- Sorting controls need meaningful accessible names.
- Selection must use native checkbox inputs.
- Icons must not be the only way a state/action is communicated.
- Give icon-only row actions accessible names according to Button guidance.
- Do not remove semantic table structure to achieve responsive layouts.

A `<caption>` is not shown in the current WIP source. Do not invent a visible Buckholt caption treatment. For production accessibility, ensure the table's purpose is available from surrounding context or an appropriately implemented accessible name/caption according to the product context.

## Runtime/source boundary
Base `.table` / `.simple_table` styling is present in Buckholt's current styling. The WIP Table page also loads a custom data-tables plugin and demonstrates richer sorting/selection markup. Until the Table component is fully documented, treat that supplied HTML as current implementation evidence, not permission to invent additional data-grid features.

## Agent rules
- Table is supported but explicitly provisional.
- Use it when content is genuinely relational/tabular.
- Start from the supplied `.table-container > .table-content > table.table` structure.
- Preserve semantic table elements and `scope="col"` headers.
- Preserve `.table-gap` when following the canonical HTML.
- Use `.table-sort-header` + button `.table-sort` for the supplied sortable pattern.
- Use `.col-fit`, `.cell-data-right`, `.data-number` and `.data-secondary` only for the roles evidenced by the source.
- Reuse Avatar, Tag, Button and Checkbox rather than creating table-specific imitations.
- Do not invent undocumented Table features or behaviour.
- If a requirement exceeds this documented WIP surface, flag the gap rather than pretending Buckholt already defines it.
