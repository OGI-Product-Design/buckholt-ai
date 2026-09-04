# Buckholt Button

## Status

Complete Button guidance rebuilt from the three Buckholt Button documentation pages supplied by Product Design, checked against `../../css/buckholt.css` for runtime implementation.

There are no known missing Button documentation inputs for this component.

## Sources of truth

- Usage: `https://buck.88mph.design/components/forms-inputs/button/`
- Style: `https://buck.88mph.design/components/forms-inputs/button/style/`
- Code & specs: `https://buck.88mph.design/components/forms-inputs/button/code-specs/`
- Runtime implementation: `../../css/buckholt.css`

Use the documentation for intended usage, hierarchy, anatomy, canonical markup and accessibility guidance. Use `buckholt.css` for actual runtime selectors, styling and state behaviour. Do not use old SCSS, Figma-derived assumptions or previous AI specifications.

## Purpose

Buttons trigger actions. Their labels should clearly indicate the action that will take place when the user interacts with them.

Use buttons for actions. Use links for navigation.

## Canonical base markup

Use a native `<button>` element with `.btn` plus a documented button type. Labelled buttons wrap their visible label in `.button-label`.

```html
<button type="button" class="btn btn-primary">
  <span class="button-label">Primary</span>
</button>
```

## Button types

Buckholt documents three standard button types:

- `.btn-primary` — highest emphasis; used for the principal action.
- `.btn-secondary` — medium emphasis; used for supporting actions.
- `.btn-ghost` — lowest emphasis; used for supplementary or opposing actions.

### Primary

Primary buttons draw the most attention. Normally use one primary action per screen or page context. A separate contained context such as a modal or side panel can have its own primary action.

A page does not need a primary button when there is no principal action.

### Secondary

Secondary buttons have less prominence than primary buttons. They can be used alone or alongside a primary action. In a button set containing one primary action and two other actions of equal importance, secondary buttons can be used for the two secondary actions.

### Ghost

Ghost buttons have the least prominence. They are suitable for supplementary actions and opposing/negative actions such as Cancel or Delete, especially alongside a primary action or within a group of controls.

## Danger modifier

Danger is a modifier, not a separate button type.

Add `.btn-danger` to any standard button type:

```html
<button type="button" class="btn btn-primary btn-danger">
  <span class="button-label">Primary</span>
</button>

<button type="button" class="btn btn-secondary btn-danger">
  <span class="button-label">Secondary</span>
</button>

<button type="button" class="btn btn-ghost btn-danger">
  <span class="button-label">Ghost</span>
</button>
```

Use danger styling for destructive or dangerous actions where the documentation hierarchy calls for it.

## Sizes

Documented size modifiers:

- `.btn-sm` — small.
- no size modifier — default/medium.
- `.btn-lg` — large.

Code & specs explicitly defines `.btn-sm` and `.btn-lg` as the modifiers for smaller and larger buttons.

Usage guidance:

- small: use where vertical space is limited or the layout is confined;
- medium/default: standard size for most UI;
- large: use where greater emphasis or a larger touch target is appropriate, for example at the end of a form.

Do not create custom button dimensions when one of the supported sizes should be used.

## Runtime dimensions

`buckholt.css` is authoritative for runtime values. The current compiled implementation defines:

- default minimum height: 40px;
- default minimum width: 64px;
- default horizontal padding: 16px;
- default vertical padding: 4px;
- default content gap: 8px;
- default border width: 1px;
- default radius: 8px;
- default action type: 16px / 24px;
- small minimum height: 32px;
- small horizontal padding: 12px;
- small type: 14px / 20px;
- large minimum height: 48px;
- large horizontal padding: 20px.

Do not recreate the previously interpreted 3px bottom-border treatment. It is not the current compiled runtime implementation.

## Labels

- Use sentence case.
- Prefer an action label that communicates what will happen.
- Prefer `{verb} + {noun}` when useful, for example `Create document`.
- Familiar actions such as Done, Close, Cancel, Add and Delete can be a single word.
- Avoid noun-only labels where an action label would be clearer.
- Prefer a single line, but wrap rather than truncate when space is genuinely limited.

## Icons in labelled buttons

Icons are optional and should be used sparingly.

The documented structure places a `.btn-icon` before `.button-label`:

```html
<button type="button" class="btn btn-primary">
  <div class="btn-icon">
    <i class="fa-regular fa-ghost"></i>
  </div>
  <span class="button-label">Button label</span>
</button>
```

Rules from the usage documentation:

- icons match the font size of the label;
- icons appear to the left of the label;
- icons directly relate to the action;
- icon colour matches the label colour;
- use recognisable icons for recognisable actions;
- do not repurpose a familiar icon for an unrelated action;
- use the default icon variation unless the icon is a defined status icon.

The documentation identifies common recognisable actions such as Add, Copy, Delete, Download, Edit, External link, Logout, Save, Search, Settings and Upload.

## Icon-only buttons

The Code & specs page creates an icon-only button by placing `.btn-icon` inside `.btn` and omitting `.button-label`:

```html
<button type="button" class="btn btn-primary">
  <div class="btn-icon">
    <i class="fa-regular fa-ghost"></i>
  </div>
</button>
```

Usage rules:

- use only when the icon is standardised and clearly recognisable;
- use sparingly;
- medium/default and small are the documented icon-only sizes;
- primary, secondary and ghost styling can be used, with primary and ghost being common;
- for several compact icon actions, prefer a toolbar pattern;
- an icon-only button must have an accessible text name;
- an icon-only button must have a visible tooltip explaining the action.

Do not treat the bare Code & specs example as sufficient accessibility by itself; apply the usage/accessibility requirements when implementing a real icon-only control.

## Button sets

When two or more related buttons need to be grouped, place them inside `.button-set`.

```html
<div class="button-set">
  <button type="button" class="btn btn-primary">
    <span class="button-label">Accept all</span>
  </button>
  <button type="button" class="btn btn-secondary">
    <span class="button-label">Customise</span>
  </button>
  <button type="button" class="btn btn-ghost">
    <span class="button-label">Reject all</span>
  </button>
</div>
```

For a vertical full-width set, add `.button-set-stacked`:

```html
<div class="button-set button-set-stacked">
  ...
</div>
```

### Button-set structure

The Style documentation defines these layout recommendations and built-in pattern behaviours:

- primary button sits on the outer edge of the set;
- secondary and ghost buttons sit inside;
- default spacing between buttons is 8px / 0.5rem;
- stacked row spacing is 8px / 0.5rem;
- sets containing icon-only buttons use 4px / 0.25rem horizontal spacing while retaining 8px / 0.5rem row spacing.

Usage guidance:

- group only contextually related actions;
- do not use multiple primary/high-emphasis buttons in the same set;
- if there are more than three calls to action, ghost buttons may be more appropriate than several secondary buttons;
- do not mix icon-only buttons with labelled buttons in the same button set;
- keep icon usage consistent across comparable labelled buttons in the same set;
- on left-aligned full-page layouts, place the primary action on the left/outer edge;
- on right-aligned contained layouts, place the primary action on the right/outer edge.

## Alignment

- full-page layouts generally left-align the main action;
- modals, data rows, repeat groups and similar contained patterns commonly right-align actions;
- short forms or small screens may use full-width buttons.

## States

The documentation covers resting, hover, focus, active and disabled styling. `buckholt.css` is the runtime source of truth for the actual state values.

Do not hard-code state colours into generated pages.

### Disabled

To disable a button, add the native `disabled` attribute to `<button>`:

```html
<button type="button" class="btn btn-primary" disabled>
  <span class="button-label">Primary</span>
</button>
```

The Style documentation states that disabled primary, secondary and ghost buttons retain their resting colours at 65% opacity. The runtime stylesheet prevents interaction for disabled buttons.

### Focus and keyboard

Preserve the focus treatment supplied by Buckholt. Native buttons remain keyboard operable and can be activated using Enter or Space when focused.

In modal contexts the primary action may be the default focused action. In forms, Enter may trigger the primary form action where the focused control does not consume Enter itself. Prefer native form semantics over custom JavaScript.

## Runtime dependencies

Standalone Buckholt tests use the repository-level dependencies documented in `CLAUDE.md`: Proxima Nova, Font Awesome, and `css/buckholt.css` in the approved runtime order.

For button icons use Font Awesome markup that is documented by Buckholt, such as the `fa-regular` examples in `examples.html`. Do not substitute another icon library.

## Do not

- do not use a button when the interaction is navigation;
- do not invent Button variants or classes;
- do not recreate Buckholt Button styling with custom CSS;
- do not override state colours to make a screenshot look right;
- do not use multiple primary actions in one button set;
- do not put labelled-button icons after the label;
- do not mix icon-only and labelled controls in one button set;
- do not truncate button labels;
- do not omit accessible naming and tooltip guidance for icon-only controls.
