# Menu

## Purpose

A Menu is a disclosure component that presents actions relevant to a control, interface area, data element or view. The options shown should be relevant to the user's current context or selection.

Menus may be opened from a trigger such as a Menu button or from a contextual interaction such as right-click.

Use Menu together with `components/menu-button/` when the trigger is a Buckholt Menu button, Combo button or Overflow menu button.

## When to use

Use a Menu to:

- keep less-common or advanced actions out of the main interface;
- show context-specific actions for a selected object or area;
- provide contextual actions from right-click interactions;
- group related actions where showing every action directly would create clutter.

Do not use Menu to hide essential primary actions simply to reduce visible UI. The available actions should remain understandable and relevant to the context in which the Menu appears.

## Base structure

The documented Menu panel uses Buckholt Menu classes together with the existing dropdown surface:

```html
<div class="menu-panel dropdown-menu show position-relative">
  <ul class="menu-body" role="menu">
    <li>
      <button class="menu-item" type="button">Action</button>
    </li>
    <li>
      <button class="menu-item" type="button">Another action</button>
    </li>
  </ul>
</div>
```

`show position-relative` appears in documentation examples so the panel is visibly demonstrated in-page. Do not treat those two classes as a requirement for a normally triggered production Menu unless the surrounding documented trigger pattern requires them.

## Menu items

Use semantic interactive elements for actions. Buckholt's canonical action item is a button:

```html
<li>
  <button class="menu-item" type="button">Action</button>
</li>
```

Menu items should use concise action labels. Do not replace the documented `.menu-item` styling with locally recreated padding, typography, hover or focus states.

## Submenus

Use `.submenu-toggle` on an item that opens a nested Menu and provide `aria-haspopup="menu"`:

```html
<li>
  <button class="menu-item submenu-toggle" type="button" aria-haspopup="menu">
    Share
  </button>
  <ul class="submenu" role="menu">
    <li><button class="menu-item" type="button">Email</button></li>
    <li><button class="menu-item" type="button">Message</button></li>
  </ul>
</li>
```

Keep submenu labels and actions directly related to the parent item. Do not create deeply nested Menu structures when a clearer information architecture is available.

## Selectable submenu items

Buckholt documents submenu items that can have selection behaviour using native radio or checkbox controls. Use radio controls for single selection and checkboxes for multiple selection. Preserve the documented native input + label relationship rather than simulating selection with visual state alone.

## Dividers and grouping

Use `.menu-divider` in its documented list-item structure to separate meaningful groups of actions:

```html
<li>
  <hr class="menu-divider">
</li>
```

Dividers should clarify grouping, not become decoration between every item.

## Destructive actions

Use the documented danger treatment only for destructive actions such as delete or remove. Danger styling is a semantic action state, not a general emphasis treatment.

## Disabled actions

Buckholt documents disabled state for actions that are temporarily unavailable but may become available later.

If an action is permanently unavailable, including because the user does not have permission to perform it, hide the action instead of leaving it disabled.

## States

Buckholt documents six Menu item states:

- resting;
- hover;
- focus;
- active;
- danger hover;
- disabled.

Opening a Menu gives the first item focus by default according to the component guidance. Preserve visible focus styling from the runtime.

## Interaction

Documented mouse behaviour includes:

- click an item to select or deselect it where the item is selectable;
- hover an item with a caret/submenu affordance to reveal its submenu;
- click outside the Menu to close it.

When implementing keyboard interaction, preserve the documented Menu semantics and focus behaviour. Do not remove keyboard access or visible focus in order to simplify implementation.

## Icons

Where Menu documentation uses icons, choose icons from `foundations/iconography/catalogue.md`. Icons supplement the action label and should not replace a meaningful text label unless another documented Buckholt pattern explicitly supports an icon-only trigger.

## Accessibility

- use `role="menu"` on the documented Menu and submenu containers;
- use native `<button>` controls for actions;
- use `aria-haspopup="menu"` on documented submenu triggers;
- preserve native radio/checkbox semantics for selectable items;
- preserve visible keyboard focus;
- do not communicate destructive or disabled meaning through colour alone.

## Foundation relationships

Read:

- `foundations/colour/` for action, danger, disabled and focus colours;
- `foundations/iconography/` when icons are used;
- `foundations/spacing/rules.md` before altering spacing;
- `foundations/typography/` before altering Menu typography;
- `foundations/shadows/rules.md` before changing Menu elevation.

## Runtime notes

The compiled stylesheet also contains broader dropdown classes and additional Menu helpers such as `.menu-body` and `.menu-section`. Runtime availability does not automatically make an undocumented helper canonical design-system guidance.

Use documented Menu structures first and treat additional runtime helpers as implementation flexibility only where an existing Buckholt implementation requires them.

## Agent rules

- Use Menu for contextual groups of actions.
- Use `.menu-panel`, `.menu-body` and `.menu-item` according to documented structure.
- Use `.submenu-toggle` + `aria-haspopup="menu"` for submenu parents and `.submenu[role="menu"]` for nested menus.
- Preserve native inputs for radio/checkbox selectable Menu items.
- Use `.menu-divider` only for meaningful grouping.
- Use danger treatment only for destructive actions.
- Disable only temporarily unavailable actions; hide permanently unavailable actions.
- Preserve focus and keyboard operability.
- Do not recreate Menu styling locally when Buckholt already provides it.
