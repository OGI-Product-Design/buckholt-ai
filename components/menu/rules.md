# Menu

## Purpose

A Menu is a disclosure component that displays actions relevant to a control, interface area, data element or view. A trigger is required to control when the Menu is displayed; Buckholt documents Menu button triggers as well as contextual/right-click use.

Use Menu to keep less-common or advanced options out of the main interface, provide context-specific actions, or group related actions. Do not use it for static choice lists or filters; use Dropdown instead. For multiple or complex inputs, use a Popover rather than a Menu.

## Base structure

Buckholt documents `.menu` as the outer shell, `.menu-panel` as the tray, and `.menu-body` as the list of items:

```html
<div class="menu">
    <div class="menu-panel dropdown-menu">
        <ul class="menu-body" role="menu">
            <li>
                <button class="menu-item" type="button">Action</button>
            </li>
            <li>
                <button class="menu-item" type="button">Another action</button>
            </li>
            <li>
                <button class="menu-item" type="button">Something else here</button>
            </li>
        </ul>
    </div>
</div>
```

Do not replace this canonical structure with demo-only `show`, `position-relative` or other helper classes unless the product implementation genuinely requires them.

## Menu items

Action items use `.menu-item` on native Buttons. Links may also be Menu items when they navigate to another page or location:

```html
<a class="menu-item" href="#">Page link</a>
```

Keep labels concise; Buckholt recommends ideally three words or fewer.

## Section header and divider

Documented section header:

```html
<li>
    <h6 class="menu-section-header">Section header</h6>
</li>
```

Documented divider:

```html
<li>
    <hr class="menu-divider">
</li>
```

Use dividers sparingly to separate meaningful groups.

## Submenu

Keep `.submenu-toggle` and the sibling `.submenu` inside the same `<li>`:

```html
<li>
    <button class="menu-item submenu-toggle" type="button" aria-haspopup="menu">
        Submenu
    </button>
    <ul class="submenu" role="menu">
        <li>
            <button class="menu-item" type="button">Option 1</button>
        </li>
        <li>
            <button class="menu-item" type="button">Option 2</button>
        </li>
        <li>
            <button class="menu-item" type="button">Option 3</button>
        </li>
    </ul>
</li>
```

Buckholt recommends limiting menus to a single submenu level where possible.

## Selectable submenu items

Buckholt documents native radio inputs for single select and native checkbox inputs for multi select. Each selectable item uses an `<input>` followed by a `<label class="menu-item">` with the documented role/ARIA attributes. Preserve the exact examples in `examples.html`, including their source attributes; do not simulate selectable state with a Button alone.

## Icons and danger state

Icons may reinforce an action but do not replace its label. The documented icon markup places the Font Awesome `<i>` directly inside `.menu-item` before the label text.

Documented danger treatment:

```html
<li>
    <button class="menu-item menu-item-danger" type="button">
        <i class="fa-regular fa-trash-can"></i>Delete
    </button>
</li>
```

Use `.menu-item-danger` only for significant/destructive actions.

## States and behaviour

Buckholt documents resting, hover, focus, active, danger-hover and disabled Menu-item states. Disabled is for actions that may become available later; permanently unavailable/permission-restricted actions should be hidden.

Mouse behaviour includes selecting/deselecting selectable items, revealing a submenu from an item with a caret, and clicking outside to close the Menu. Keyboard guidance includes opening from the trigger with Enter/Return and moving between Menu items with Tab / Shift+Tab; a focused submenu item opens its submenu automatically.

## Sizing and elevation

Buckholt documents a Menu min-width of 160px and max-width of 288px, with `$shadow-sm` elevation when open. Use the existing Buckholt CSS rather than recreating these values locally.

## JavaScript

The Code & specs documentation states that Menu uses JavaScript enhancements (`menu.js`). If that supplied script is added to this repository, use the supplied implementation rather than recreating the behaviour. Until then, do not invent a different canonical Menu script.

## Agent rules

- Use `.menu > .menu-panel.dropdown-menu > .menu-body[role="menu"]` as the documented base structure.
- Use native Buttons for actions and anchors for genuine navigation items.
- Keep section headers, dividers, submenu markup and selectable items exactly as documented.
- Keep submenu toggle and submenu as siblings within the same `<li>`.
- Use native radio/checkbox inputs for selectable submenu items.
- Place documented action icons directly inside `.menu-item`; do not add an `.icon` wrapper unless another Buckholt source explicitly requires one.
- Use `.menu-item-danger` only for destructive/significant actions.
- Do not add demo-only helper classes to canonical markup.
- Do not recreate Menu styling or interaction logic locally when Buckholt provides it.
