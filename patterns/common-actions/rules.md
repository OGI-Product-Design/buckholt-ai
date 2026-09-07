# Common actions pattern

## Purpose

Common actions standardise familiar product actions so labels, icons and destructive treatment remain predictable across Buckholt interfaces.

Use this pattern when choosing wording/icon treatment for recurring actions. Read the Button, Menu and Iconography guidance for the component-specific implementation.

## Labels

Button labels should normally use a clear `{verb} + {noun}` construction. Buckholt allows concise single-word labels for established common actions such as **Done, Close, Cancel, Add and Delete**.

Use sentence case.

Do not shorten an unfamiliar action merely to make it fit. Clarity is more important than compactness.

## Recognised action/icon mappings

Buckholt documents a set of familiar actions whose icons are considered suitable alongside action labels:

| Action | Font Awesome class | Icon-library name |
| --- | --- | --- |
| Add | `fa-regular fa-plus` | Plus |
| Copy | `fa-regular fa-copy` | Copy |
| Delete | `fa-regular fa-trash-can` | Bin |
| Download | `fa-regular fa-arrow-down-to-bracket` | Download |
| Edit | `fa-regular fa-pencil` | Edit |
| External link | `fa-regular fa-arrow-up-right-from-square` | External-link |
| Logout | `fa-regular fa-arrow-right-from-bracket` | Logout |
| Save | `fa-regular fa-floppy-disk` | Save |
| Search | `fa-regular fa-magnifying-glass` | Search |
| Settings | `fa-regular fa-gear` | Settings |
| Upload | `fa-regular fa-arrow-up-from-bracket` | Upload |

For any action not listed here, consult `foundations/iconography/catalogue.md` and use an icon only when the meaning is clear and consistent.

## Do not repurpose recognised icons

Do not reuse an icon from the documented common-action set to represent a completely different action. Familiar mappings work because users learn and recognise them consistently.

## Delete

Delete permanently removes an object. Because this is usually irreversible:

- make the consequence clear;
- use the documented Bin icon where an icon is appropriate;
- use Button danger treatment or a Menu danger option as defined by those components.

Do not use ordinary neutral action treatment for destructive deletion merely because the action appears inside a compact UI.

## Edit

Edit changes an object's data or values and normally enters a state where the selected item/field can be modified.

Provide Edit as a documented Button or Menu action and use the documented Edit icon when an icon is appropriate.

## Icons in button sets

Icons in button sets are optional. For consistency, either all buttons in the set should include icons or none should.

Only use icons in button sets for documented common actions or where the icon is strongly recognised for the intended action.

Do not mix icon-only buttons with labelled buttons within the same Button set.

## Icon-only actions

Recognition does not remove the accessibility requirement. Icon-only Buttons still need an accessible name and the documented Tooltip treatment.

## Action hierarchy

Common-action wording/icon mapping does not decide visual emphasis. Use Button guidance to select Primary, Secondary, Ghost and Danger based on importance and consequence.

In particular:

- Primary is the principal call to action and is normally limited to one per screen context;
- Secondary is medium-emphasis;
- Ghost is low-emphasis and is often appropriate for lower-priority/cancel actions or compact icon-action sets;
- Danger is a modifier for actions with destructive effects and can be applied to primary, secondary or ghost Button types.

## Agent rules

- Prefer established common-action labels and icon mappings when they match the intended action.
- Do not invent alternative icons for a documented common action.
- Do not repurpose a documented common-action icon for a conflicting meaning.
- Keep action labels in sentence case.
- Use `{verb} + {noun}` for actions that are not safely understood as common single-word actions.
- Treat Delete/removal as destructive using documented danger treatment.
- Apply action hierarchy from Button/Menu guidance; the common-action pattern does not automatically make an action Primary.
- Keep Button-set icon usage consistent: all labelled actions with icons, or none.
- Icon-only actions require accessible naming and Tooltip guidance.