# Buckholt Versa-tile

## Status

Versa-tile guidance rebuilt from the supplied Buckholt Usage, Style and Code & specs documentation and checked against `../../css/buckholt.css`.

## Purpose

Versa-tile is a versatile card-like component for grouping and displaying individual items. Each tile contains its own details and may support item-specific actions such as edit or delete.

Use Versa-tile when presenting a repeatable item that needs compact metadata and optional actions. Do not treat it as a generic page container.

## Base structure

The documented structure uses `.versatile` with a content area, a body, metadata and an optional action area:

```html
<div class="versatile">
  <div class="versatile-content">
    <div class="versatile-body">
      <div class="icon-block">
        <i class="fa-regular fa-ghost" aria-hidden="true"></i>
      </div>

      <div class="versatile-meta">
        <div class="versatile-label">Versa-tile label</div>
        <div class="key-value">
          <span class="key">Key</span>
          <span class="value">Value</span>
        </div>
      </div>
    </div>

    <div class="versatile-actions"></div>
  </div>
</div>
```

The content is intentionally compositional. Reuse Icon block, Key-value, Button, Link, Tag and Progress bar where the documentation calls for them.

## Content

Versa-tile content can vary by use case. The documentation explicitly allows content such as:

- Icon block;
- Key-value pairs and lists;
- tags;
- interactive elements such as Buttons and Links.

Keep the item concise and scannable. Do not rebuild those nested components locally.

## Actions

Use `.versatile-actions` for item-specific actions. The runtime lays out actions consistently and hides the action wrapper when empty.

Actions should relate directly to that tile's item. Avoid turning the action area into a general toolbar.

## Progress composition

A Versa-tile may include a Progress bar beneath its main content. Use the documented Progress bar component and follow `../progress-bar/rules.md` rather than styling a local progress indicator.

```html
<div class="progress progress-sm" role="progressbar"
     aria-label="Versa-tile progress"
     aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 50%"></div>
</div>
```

## Interactive Versa-tiles

The runtime supports `a.versatile` as a navigational form with Buckholt hover/border behaviour. When the whole tile navigates, use an anchor and preserve normal link semantics.

Do not nest conflicting interactive controls inside a whole-tile link. If a tile needs multiple item-specific actions, use the non-link container with actions instead.

## Accessibility

- Preserve semantic controls for actions inside `.versatile-actions`.
- Whole-tile navigation must use a real anchor with a meaningful destination.
- Use documented accessible names for icon-only actions.
- Do not rely on icon, colour or truncation alone to communicate essential item information.
- Choose icons from the Buckholt Iconography catalogue when a documented mapping exists.

## Runtime implementation

The runtime supplies Versa-tile padding, gaps, border, radius, background, metadata sizing, action layout and link hover behaviour through `.versatile`, `.versatile-content`, `.versatile-body`, `.versatile-meta`, `.versatile-actions` and `.versatile-label`.

Do not recreate these dimensions or states with custom CSS.

## Agent rules

- Use `.versatile` as the base component.
- Structure content using `.versatile-content`, `.versatile-body`, `.versatile-meta` and optional `.versatile-actions`.
- Reuse documented nested Buckholt components instead of making Versa-tile-specific copies.
- Keep actions item-specific.
- Use the Progress bar component when progress is shown.
- Use `a.versatile` only for whole-tile navigation and avoid nested competing interactive controls.
- Do not invent local padding, border, radius, action spacing, typography or hover styling.
