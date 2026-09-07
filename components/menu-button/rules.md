# Buckholt Menu button

## Status

Menu button guidance rebuilt from the supplied Buckholt Overview, Style and Code & specs documentation and checked against the current compiled runtime.

## Purpose

Menu buttons provide access to multiple related actions while keeping the interface compact. Buckholt documents three trigger variants:

- **Menu button** - all actions in the menu have broadly equal importance.
- **Combo button** - a primary action remains immediately available while related alternatives sit behind the adjacent menu trigger.
- **Overflow menu button** - secondary or less frequent actions are hidden behind an icon-only trigger, usually for a smaller object such as a table row or Card.

Use these patterns when screen space is limited and exposing every action at once would add clutter.

## Placement guidance

Menu and combo buttons are typically suited to page headers where multiple actions apply to the whole page or a large object such as a canvas, diagram or full data table.

Use an overflow menu for actions scoped to a smaller item such as an individual table row or Card.

## Menu button

The Menu button uses the same menu structure as Buckholt Menu, with a Button inserted as the first child of `.menu`.

```html
<div class="menu">
  <button type="button"
          class="btn btn-primary menu-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false">
    <span class="button-label">Actions</span>
    <div class="btn-icon">
      <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
    </div>
  </button>

  <div class="menu-panel dropdown-menu">
    <ul class="menu-body" role="menu">
      <li><button class="menu-item" type="button">Duplicate</button></li>
      <li><button class="menu-item" type="button">Share</button></li>
      <li><button class="menu-item" type="button">Export</button></li>
    </ul>
  </div>
</div>
```

The trigger may use `.btn-primary`, `.btn-secondary` or `.btn-ghost` according to the documented Button hierarchy and UI context.

## Combo button

A combo button separates the direct action from the menu trigger:

```html
<div class="menu">
  <div class="btn-combo">
    <button type="button" class="btn btn-primary">
      <span class="button-label">Create</span>
    </button>
    <button type="button"
            class="btn btn-primary menu-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="More create options">
      <div class="btn-icon">
        <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
      </div>
    </button>

    <div class="menu-panel dropdown-menu dropdown-menu-end">
      <ul class="menu-body" role="menu">
        <li><button class="menu-item" type="button">Duplicate</button></li>
        <li><button class="menu-item" type="button">Share</button></li>
      </ul>
    </div>
  </div>
</div>
```

The documentation uses `.btn-combo` as the structural wrapper because the menu panel must remain in the correct position relative to both Buttons. `.dropdown-menu-end` aligns the menu to the right of the caret Button.

Combo buttons are documented in primary and secondary styles.

## Overflow menu button

Use a ghost icon Button with the vertical ellipsis icon:

```html
<div class="menu">
  <button type="button"
          class="btn btn-ghost menu-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="More actions">
    <div class="btn-icon">
      <i class="fa-regular fa-ellipsis-vertical" aria-hidden="true"></i>
    </div>
  </button>

  <div class="menu-panel dropdown-menu dropdown-menu-end">
    <ul class="menu-body" role="menu">
      <li><button class="menu-item" type="button">Edit</button></li>
      <li><button class="menu-item" type="button">Share</button></li>
      <li><hr class="menu-divider"></li>
      <li>
        <button class="menu-item menu-item-danger" type="button">Delete</button>
      </li>
    </ul>
  </div>
</div>
```

Because the overflow trigger is icon-only, give it an accessible name. Use the documented Tooltip pattern as well when a visible tooltip is required by the Button guidance.

## Menu content

Use `.menu-panel.dropdown-menu` with `.menu-body` and `.menu-item`. The supplied documentation also demonstrates:

- icons inside menu items;
- `.menu-divider` to separate groups;
- `.menu-item-danger` for destructive actions;
- nested submenu triggers using `.submenu-toggle` and `aria-haspopup="menu"`.

Do not use divs styled to look like menu actions when the item is an actual action; use semantic `<button>` elements as shown in the canonical examples.

## Labels

Menu-button labels must make the available action or action group understandable. A generic label is acceptable only when the context already makes the group obvious; prefer clear task language.

The menu trigger should make it obvious that activating it reveals additional actions.

## Size and content growth

The documentation states that menu/combo trigger size remains based on the Button rather than expanding to match long menu-item labels. Menu content can be wider than its trigger where needed.

Do not enlarge the trigger simply because a menu option is long.

## Positioning

Menus normally open below their associated trigger. Depending on available space/layout, menus may be positioned above, left or right. Use the documented Bootstrap dropdown positioning classes rather than custom absolute positioning.

Use `.dropdown-menu-end` where the documented pattern requires right alignment, especially combo and overflow variants.

## States

Trigger states follow the Button component:

- Menu button: primary, secondary or ghost.
- Combo button: primary or secondary.
- Overflow menu: icon-only ghost Button.

Do not create a separate state system for Menu button.

## Interaction

Menu button users can open the menu by clicking the trigger or focusing it and pressing Enter/Return.

For Combo button, keyboard focus reaches the labelled action first and the caret trigger second. The labelled Button performs the direct action; the caret trigger opens the menu.

Overflow menu users can click the icon Button or focus it and press Enter/Return.

## Accessibility

- Use a real `<button>` for menu triggers and menu actions.
- Keep `aria-expanded` on the dropdown trigger so Bootstrap can expose state.
- Give icon-only overflow and combo-caret Buttons an accessible name where their purpose is not conveyed by visible text.
- Preserve `role="menu"` on the documented `.menu-body` structure.
- Use `aria-haspopup="menu"` on submenu triggers as documented.
- Do not rely on destructive colour alone; use explicit text such as Delete.
- Follow Button accessibility and Tooltip guidance for icon-only controls.

## Runtime implementation

Menu button relies on Bootstrap dropdown JavaScript and Buckholt's Menu/Button runtime selectors. Load the Bootstrap bundle in working prototypes.

Do not recreate dropdown opening, positioning, Button styling, panel styling, dividers or menu-item states with custom CSS.

## Agent rules

- Choose the variant by action hierarchy and scope, not aesthetics.
- Use `.menu` as the outer composition.
- Use `.menu-toggle` with `data-bs-toggle="dropdown"` and `aria-expanded="false"` for the dropdown trigger.
- Use `.menu-panel.dropdown-menu` and `.menu-body` with semantic menu actions.
- Menu button may be primary, secondary or ghost.
- Combo button uses `.btn-combo`, two Buttons, and primary/secondary styling only.
- Overflow uses a ghost icon Button and `fa-regular fa-ellipsis-vertical`.
- Use `.dropdown-menu-end` for the documented right-aligned combo/overflow patterns.
- Use `.menu-item-danger` only for genuinely destructive actions.
- Reuse Button, Menu, Iconography and Tooltip guidance rather than inventing local equivalents.
