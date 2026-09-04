# Buckholt button

## Status

Rebuilt from the live Buckholt button documentation and the compiled runtime stylesheet in `css/buckholt.css`.

The live Usage page is readable and has been used for behavioural/content guidance. The separate Style and Code & specs URLs are recorded below, but their page content could not be reliably retrieved by the current crawler, so this file does **not** invent any detail that depends on those pages.

## Sources

- Usage: https://buck.88mph.design/components/forms-inputs/button/
- Style: https://buck.88mph.design/components/forms-inputs/button/style/
- Code & specs: https://buck.88mph.design/components/forms-inputs/button/code-specs/
- Runtime implementation: `../../css/buckholt.css`

## Core implementation

Use a native `<button>` element for button actions.

Buckholt's runtime button API is based on `.btn`, with verified visual variants:

- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`

Verified size modifiers:

- `.btn-sm` — small
- default `.btn` — medium
- `.btn-lg` — large

Verified icon-only modifier:

- `.btn-icon`

Verified response-button classes also exist in the runtime stylesheet:

- `.btn-response`
- `.btn-response-lg`

These response buttons are a separate button behaviour and should not be substituted for primary/secondary/ghost buttons without component-specific guidance.

## Runtime dimensions

The compiled stylesheet defines the default button as:

- minimum height: 40px
- minimum width: 64px
- horizontal padding: 16px
- vertical padding: 4px
- content gap: 8px
- border width: 1px
- radius: 8px
- type: 16px / 24px, weight 400, letter-spacing 0.16px
- focus ring: 2px using Buckholt focus blue

Small buttons:

- minimum height: 32px
- horizontal padding: 12px
- vertical padding: 4px
- type: 14px / 20px, weight 400, letter-spacing 0.25px
- icon-only width: 32px

Large buttons:

- minimum height: 48px
- horizontal padding: 20px
- vertical padding: 4px
- type: 16px / 24px, weight 400

The current compiled CSS uses a normal 1px border. Do **not** recreate an older interpreted 3px bottom-border treatment.

## Runtime state behaviour

The compiled stylesheet is authoritative for visual states.

### Primary

`.btn-primary` uses Buckholt action variables for resting, hover, active and focus states. It has white text, a filled primary background, and a focus ring supplied by the base `.btn` implementation.

### Secondary

`.btn-secondary` uses primary action text with a white resting background and primary border. Hover uses the light action overlay; active becomes filled.

### Ghost

`.btn-ghost` has a transparent resting background and border. Hover uses the light action overlay; active becomes filled.

### Disabled

Buckholt disables pointer events and applies the base disabled opacity while preserving the variant's resting colour variables.

Do not recreate these state colours manually. Load `css/buckholt.css` and use the classes above.

## Usage hierarchy

Buttons trigger actions; they are not navigation. Use a link when the intended result is navigation to another page.

The live documentation defines the hierarchy as:

- **Primary** — high emphasis; the principal page action. Normally only one primary action per screen, with contextual exceptions such as a modal or side panel.
- **Secondary** — medium emphasis; supporting or lower-tier actions. May appear alone or with a primary action.
- **Ghost** — low emphasis; supplementary or opposing actions such as Cancel. Useful where several lower-emphasis actions are needed.

A page does not require a primary button if there is no principal action.

## Size guidance

- **Small** — use where vertical space is limited or the layout is confined.
- **Medium/default** — standard size for most UI buttons.
- **Large** — use where greater emphasis is appropriate, such as the bottom of a form.

## Labels

- Use sentence case.
- Prefer a clear `{verb} + {noun}` label, for example `Create document`.
- Common actions such as `Done`, `Close`, `Cancel`, `Add` and `Delete` may use a single word.
- Do not use a noun alone when an action label can be clearer.
- Prefer one line. If space is genuinely insufficient, wrap rather than truncate.

## Alignment

- Full-page layouts: primary actions are generally left aligned.
- Modals, data rows, repeat groups and similar contained patterns: actions are commonly right aligned.
- Short forms or smaller screens may use full-width buttons.

## Button sets

The runtime stylesheet implements Buckholt sets through generic `*-set` rules.

Verified button-set behaviour:

- a class matching `button-*-set`/`button-set` conventions receives a default 8px gap and 8px row gap;
- button sets receive an 8px top margin;
- sets containing icon buttons reduce the horizontal gap to 4px;
- `.button-set-stacked` changes the set to a column and makes its buttons full width.

Usage rules from the live documentation:

- group only contextually related actions;
- do not use multiple primary/high-emphasis buttons in the same set;
- with more than three calls to action, ghost buttons are often more appropriate than several secondary buttons;
- do not mix icon-only buttons with labelled buttons in the same set;
- on left-aligned full-page layouts, place the primary action to the left of lower-emphasis actions;
- on right-aligned layouts, place the primary action to the right.

## Icons

Icons are optional and should be used sparingly.

For labelled buttons:

- icon size should match the label size;
- icons go to the **left** of the label;
- icon and label colours should match;
- the icon must clearly relate to the action;
- do not repurpose a familiar icon for a different action.

The live documentation lists recognised actions including Add, Copy, Delete, Download, Edit, External link, Logout, Save, Search, Settings and Upload.

Within a button set, keep icon use consistent: either all comparable labelled buttons include icons or none do.

Use the default icon variation unless the icon is a defined status icon.

## Icon-only buttons

Icon-only buttons may use primary, secondary or ghost styling, though primary and ghost are most common.

Rules:

- supported only at medium/default and small sizes;
- use only when the icon is standardised and clearly recognisable;
- use sparingly;
- for several compact actions, prefer a toolbar pattern;
- provide an accessible text name;
- a visible tooltip explaining the action is always required.

The exact Font Awesome markup for Buckholt icons should be copied from the live Code & specs page or another verified Buckholt component example. Do not invent icon class names.

## Keyboard and focus

Native buttons must remain keyboard operable.

The live documentation states that users can activate a focused button with Enter or Space. Preserve Buckholt's `:focus-visible` treatment from the compiled stylesheet.

## Primary action behaviour

In modal contexts the primary button is typically the default focused action. In forms, pressing Enter may trigger the primary action where the currently focused control does not itself consume Enter.

Do not implement this behaviour with custom JavaScript unless the surrounding product/framework requires it; native form semantics should be preferred.

## Danger buttons

The compiled stylesheet exposes danger action tokens, and Buckholt design material includes danger button styling, but the exact canonical danger modifier/class combination has not yet been verified from the live Code & specs page in this rebuild.

Until that page is retrievable, **do not guess the danger class or markup**. If a task requests a danger button, report that the canonical modifier still needs to be verified.

## Do not

- do not use buttons as links/navigation;
- do not invent Bootstrap `btn-outline-*` or `btn-link` variants as Buckholt equivalents;
- do not redraw Buckholt button styling with custom CSS;
- do not override Buckholt state colours to make a screenshot look right;
- do not put an icon after a labelled button's text;
- do not mix icon-only and labelled buttons in the same button set;
- do not truncate button labels;
- do not guess danger or icon markup that has not been verified.
