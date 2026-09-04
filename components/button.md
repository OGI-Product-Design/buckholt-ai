# Buckholt Button Component — v0.3

> Status: **SCSS, compiled CSS, Figma and Buckholt documentation reconciled; ready for implementation testing.**

## Purpose

AI agents should use Buckholt's existing browser-facing button classes rather than recreate button styling. Load `css/buckholt.css` in the consuming application.

## Supported variants

- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`
- `.btn-response`

Danger is an override treatment layered onto primary, secondary and ghost. Do not substitute Bootstrap `btn-outline-*` or `btn-link` patterns.

## Base button

Use `.btn`. The compiled CSS confirms:

- display: flex; centrally aligned content
- minimum width: 64px
- default minimum height: 40px
- default padding: 4px 16px
- content gap: 8px
- default radius: 8px
- Action 02 typography: 16px / 24px, weight 400, letter-spacing 0.16px

### Small — `.btn-sm`

- 32px minimum height
- 4px 12px padding
- 14px / 20px Action 01 typography
- 6px radius

### Large — `.btn-lg`

- 48px minimum height
- 4px 20px padding
- Action 02 typography

## Icons

Use `.icon` inside the button. Icon-only buttons use `.btn-icon`.

- default icon-only width: 40px
- small icon-only width: 32px
- default icon minimum width: 16px
- small labelled icon minimum width: 14px
- leading/trailing icons reduce adjacent padding by 4px

Documentation guidance:

- icon-only buttons may be primary, secondary or ghost; primary and ghost are most common
- icon-only buttons are limited to default/medium and small sizes
- use icon-only actions sparingly
- always provide an accessible text label
- **always provide a tooltip for an icon-only button**
- use the default icon variation unless the icon is explicitly a status icon
- do not repurpose Buckholt icons for unrelated actions

## Interaction states

The compiled CSS implements hover, focus-visible, active/checked/show and disabled behaviour using CSS custom properties. Preserve those states. Disabled buttons use native `disabled` behaviour and pointer events are removed.

## Variant behaviour

### Primary

Resting uses `action-01`; hover uses `action-02`; active uses `action-03`; focus uses `action-02` with the Buckholt focus border/ring.

### Secondary

Resting uses white/action-07 with action-01 border/text; hover uses action-04; active becomes action-01 with white text.

### Ghost

Resting is transparent with action text; hover uses action-04; active uses action-01 with white text.

### Response

Special response/selectable treatment. `.btn-response` is 44px minimum height; `.btn-response-lg` is 80px minimum height and 120px minimum width with vertical content.

## Danger

The danger treatment partially overrides the matching base variant. The Figma danger family maps to filled (primary + danger), bordered/light (secondary + danger) and text-like (ghost + danger). Do not create independent one-off red button CSS.

## Combo button

Use `.btn-combo` for split/menu actions. It is a real joined component with collapsed adjacent borders/radii and open-state handling.

## Button sets

The compiled CSS resolves the Button set implementation through generic `*-set` rules:

- default gap: 8px
- row gap: 8px
- top margin: 8px
- gap becomes 4px when icon buttons are present
- `.button-set-stacked` stacks controls vertically and makes direct child buttons full width

Buckholt documentation additionally says icons in a button set are optional but should be used consistently across the set. A standalone link can also be included.

## Runtime dependencies

Buckholt uses `"Proxima-soft", Arial, sans-serif`. The compiled CSS also uses Font Awesome both as embedded SVG data and as font glyphs via variables such as `--fa-font-regular` and `--fa-font-solid`; some rules explicitly reference Font Awesome 6 Pro.

## AI implementation rules

1. Load and use `css/buckholt.css`.
2. Use Buckholt classes rather than recreating styles.
3. Use semantic Buckholt variants and tokens, not arbitrary raw colours.
4. Use `.btn-sm` / `.btn-lg` for supported sizing.
5. Use `.btn-icon` for icon-only buttons and provide accessible text + tooltip.
6. Use `.btn-combo` for split/menu actions.
7. Preserve hover, focus-visible, active and disabled behaviour.
8. Keep icon usage consistent inside button sets.
9. Do not use Bootstrap outline/link button patterns as substitutes.
10. If a requested variant cannot be mapped to Buckholt, flag the gap rather than guessing.

## Validation status

Ready for the first cross-agent implementation test. Any mismatch should be corrected in this shared specification, not hidden with one-off prompt instructions.
