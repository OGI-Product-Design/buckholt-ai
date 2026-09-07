# Tag

## Purpose
Tags label, categorise or group items by keywords that describe their content, purpose or characteristics. Buckholt documents four variants: read-only, dismissible, selectable and status.

## When to use
Use Tags when:
- content belongs to multiple categories and users need a clear way to identify or filter between them;
- categorising, labelling or displaying concise read-only information;
- filtering data on a page, within a component or alongside search;
- guiding choices in chat/conversational flows;
- user-generated labels may need to be removed;
- revealing or summarising overflow tags in popovers, modals or detail views.

Do not use Tags as navigation links, and do not give one Tag multiple competing functions.

## Base structure
```html
<span class="tag">
  <span class="tag-label">Read-only tag</span>
</span>
```

`.tag` provides the component container and `.tag-label` wraps the visible label.

## Variants

### Read-only
Use the base `.tag` for non-interactive categorisation or labelling.

### Dismissible
Add `.tag-dismissible` and a small close button:
```html
<span class="tag tag-dismissible">
  <span class="tag-label">Dismissible tag</span>
  <button type="button" class="btn-close btn-close-sm" aria-label="Close"></button>
</span>
```
The documentation examples also show `data-bs-dismiss="tag"` in rendered markup. The close control must have an accessible name. Do not treat removal as navigation.

### Selectable
Add `.tag-selectable`. Use a native radio input for single selection or checkbox for multiple selection. The input comes before `.tag-label`.
```html
<span class="tag tag-selectable" type="option" aria-selected="false">
  <input type="checkbox" id="tag-option">
  <span class="tag-label">Option</span>
</span>
```
Keep native selection semantics and synchronize visual active/selected state with the actual input state. The documentation uses `aria-selected` as additional accessibility support; do not use ARIA as a substitute for the native input.

### Status
Use `.tag-status` plus exactly one semantic status modifier:
- `.tag-status-info`
- `.tag-status-success`
- `.tag-status-warning`
- `.tag-status-error`

```html
<span class="tag tag-status tag-status-success">
  <span class="tag-label">Success</span>
</span>
```
Status Tags indicate state or outcome through consistent messaging and semantic feedback colour. Text must communicate the status; do not rely on colour alone.

## Size
There are two documented sizes:
- medium/default: `.tag`
- small: `.tag-sm`

Small Tags are for tighter layouts and are only documented for read-only and status Tags. Do not use `.tag-sm` for selectable or dismissible Tags unless the documentation is updated.

The documentation states that icons do not appear in small Tags. Preserve that rule even where an example page contains icon markup that may be visually suppressed by runtime styling.

## Icons
A Tag may include a supporting icon before the label:
```html
<span class="tag">
  <span class="icon">
    <i class="fa-solid fa-sparkles" aria-hidden="true"></i>
  </span>
  <span class="tag-label">Tag with icon</span>
</span>
```
Choose meaningful icons from `foundations/iconography/catalogue.md` when a documented mapping exists. Icons are supplementary and should normally be `aria-hidden="true"` when the label already communicates the meaning.

Status Tags may use status-specific icons to reinforce info, success, warning and error states. Do not use an icon as the only status cue.

## Expressive colour
The documentation shows expressive light Tag treatments using `.expressive-light`, optionally combined with `.expressive-secondary`, `.expressive-tertiary` or `.expressive-quaternary`. Treat these as documented visual variants for categorisation, not semantic status. Use `.tag-status-*` when the colour communicates system state.

## Sets
The documentation uses `.tag-set` to group related Tags. Use it when several Tags belong together rather than recreating local wrapping/gap styles.

## Runtime notes
The compiled CSS defines a medium Tag at 2rem height with a 2rem radius, 0.875rem text and semantic variables for background, border, label and icon. Selectable Tags have documented hover/active styling and status Tags map to Buckholt feedback tokens.

Do not copy those values into local CSS; use the runtime component classes.

## Accessibility
- Keep visible labels concise and meaningful.
- Dismiss controls require an accessible name.
- Selectable Tags must preserve native radio/checkbox behaviour and keyboard access.
- Status meaning must be available in text, not colour alone.
- Do not use Tags as links.

## Agent rules
- Choose the variant by function, not appearance.
- Use `.tag` + `.tag-label` as the base contract.
- Use native form controls for selectable Tags.
- Use status modifiers only for real semantic states.
- Use small only for read-only/status Tags.
- Use Iconography guidance rather than inventing icon mappings.
- Do not recreate Tag spacing, radius, colour or state styling locally.
