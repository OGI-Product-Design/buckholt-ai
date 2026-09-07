# Menu button

## Verification

Source-audited against the Buckholt Menu button Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`; do not reconstruct Menu button markup from prose.

## Purpose

Menu buttons reveal multiple related actions while keeping the interface compact. Buckholt documents three variants:

- **Menu button** — groups actions of broadly equal importance.
- **Combo button** — keeps the most common/default action directly available and places related alternatives behind the adjacent caret trigger.
- **Overflow menu** — uses an icon-only ghost trigger for less frequent actions, typically on smaller objects such as table rows or Cards.

## Usage

Use Menu and Combo buttons where multiple actions apply to a full page or a large object and space is limited. Use Overflow menus for actions scoped to smaller page elements.

The documentation states that Menu buttons may use primary, secondary or ghost Button styles; Combo buttons use primary or secondary; Overflow uses a ghost icon-only Button.

## Canonical markup

`examples.html` is authoritative for the three documented Code & specs structures.

Important source details:

- all three variants use `.menu` as the outer composition;
- the dropdown trigger uses `.menu-toggle`, `data-bs-toggle="dropdown"` and `aria-expanded="false"`;
- the Menu button example places `fa-solid fa-caret-down` inside `.btn-icon` after `.button-label`;
- Combo uses `.btn-combo`, a labelled Button, then a separate caret Button, with the Menu panel shown as a deliberate `...` placeholder in Code & specs;
- Overflow uses `.btn.btn-ghost.menu-toggle` with `fa-regular fa-ellipsis-vertical`, and its Menu panel is also deliberately abbreviated with `...` in the source.

Do not expand those `...` placeholders with inferred Menu items in canonical examples.

## Size and placement

Trigger size follows the Button component. Buckholt documents a Menu minimum width of 160px / 10rem and a maximum panel width of 288px / 18rem, while ensuring the Menu is not narrower than a longer trigger.

Open Menus normally sit adjacent to their trigger and may open above, below, left or right depending on available space/layout.

## Behaviour and dependencies

Interaction and visual states follow Button and Menu guidance. Bootstrap Dropdown JavaScript is required for the documented trigger behaviour.

## Accessibility

Keep real Button controls, `aria-expanded` on dropdown triggers, and the Menu component's documented semantics. In production, icon-only triggers need an accessible name and should follow Tooltip guidance where required; do not write additional attributes back into canonical Code & specs examples unless the source provides them.

## Agent rules

- Read `examples.html` for exact Menu button, Combo and Overflow DOM.
- Do not replace `.btn-icon`, caret/ellipsis placement, or source placeholders with another convention.
- Use Menu button for grouped equal-priority actions, Combo for a default action plus alternatives, and Overflow for less-frequent actions on smaller objects.
- Reuse the Button and Menu components rather than inventing local trigger/panel styles.
- Load Bootstrap's dropdown behaviour; do not recreate it with custom JavaScript.
