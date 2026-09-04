# Buckholt colour foundation

## Status

Built from the supplied Buckholt Colour documentation pages and checked against `../../css/buckholt.css`.

Sources:

- Overview: `https://buck.88mph.design/styles/colour/`
- Global palette: `https://buck.88mph.design/styles/colour/palette/`
- Foundation colours: `https://buck.88mph.design/styles/colour/foundation-colours/`
- Colour contrast: `https://buck.88mph.design/styles/colour/colour-contrast/`
- Runtime implementation: `../../css/buckholt.css`

## Colour architecture

Buckholt colour is organised into three tiers:

1. **Global palette** — raw colour values: neutrals, primary, three accent families, and status families for danger, caution, valid and information.
2. **Foundation layer** — functional roles are assigned to global colours through semantic tokens such as `text-primary`, `action-01` and `success-01`.
3. **Component colours** — components map foundation tokens to component-specific roles. Components should consume the documented foundation/component mapping rather than choosing raw palette colours directly.

The documentation describes colour as supporting communication, brand continuity, status/feedback, visual balance and accessibility.

## Agent rule

When implementing Buckholt UI:

- prefer an existing component class over applying colours manually;
- when a component requires a colour role, use the semantic/foundation variable documented for that role;
- do not choose a visually similar raw hex value when a Buckholt variable exists;
- do not invent new semantic colour names;
- do not treat Bootstrap colours such as `primary`, `secondary`, `success`, `warning` or `danger` as interchangeable with Buckholt roles;
- if component documentation and runtime CSS disagree, report the discrepancy rather than silently replacing the runtime behaviour.

## Global palette use

The global palette is the source layer, not the normal implementation API for components. See `palette.md` for the complete runtime palette.

The families present in the current runtime are:

- `white`, `black`, `transparent`
- `neutral-10` through `neutral-100`
- `primary-10` through `primary-100`
- `accent-01-10` through `accent-01-100`
- `accent-02-10` through `accent-02-100`
- `accent-03-10` through `accent-03-100`
- `danger-10` through `danger-100`
- `caution-10` through `caution-100`
- `valid-10` through `valid-100`
- `info-10` through `info-100`
- tint/overlay families derived from black, white and the colour families.

## Foundation roles

The compiled stylesheet exposes the documented functional groups:

- text colours;
- UI backgrounds, overlays and borders;
- action colours and action text colours;
- danger action colours;
- disabled colours/overlays;
- focus, success and error states;
- feedback palettes for info, success, warning and error;
- expressive colour roles.

See `foundation-tokens.md` for the current runtime values.

## Feedback colours

The documentation defines the feedback palette for key UI states: **info, success, warning and error**. These should be used consistently across feedback components such as alerts and toasts rather than creating component-specific status colours.

## Expressive colours

Expressive colours add tone, personality, emphasis and visual interest beyond core functional colours. They should support the interface rather than overwhelm the functional hierarchy. Do not substitute expressive colours for semantic feedback/action roles simply because they are visually similar.

## Accessibility

Colour must not be the only way important meaning is communicated.

Buckholt documents these minimum contrast targets:

- text below 24px: **4.5:1**;
- large text at 24px and above: **3:1**;
- visual elements such as icons and charts: **3:1**.

The dedicated contrast documentation tests the palette at 4.5:1 and shows the closest palette pair that passes. See `contrast.md`.

## Runtime/source relationship

The documentation defines intended roles and usage. `css/buckholt.css` defines the values and rendering actually shipped in the repository.

Do not silently hard-code documentation hex values into components. Use CSS variables so later Buckholt updates propagate through the system.
