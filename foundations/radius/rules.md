# Radius

## Purpose

Buckholt uses border radius to create softer, more approachable UI while maintaining consistency across components.

Source documentation:
- https://buck.88mph.design/styles/radius/

## Usage principle

The size of a component determines its border radius. Larger components, especially those that may contain other elements, typically use a larger radius. Components should use the radius already assigned by Buckholt by default rather than inventing a new value.

## Documented scale

The Buckholt documentation defines this radius scale:

| Documentation token | rem | px |
| --- | ---: | ---: |
| `$border-radius-xs` | 0.25rem | 4px |
| `$border-radius-sm` | 0.375rem | 6px |
| `$border-radius-md` | 0.5rem | 8px |
| `$border-radius-lg` | 1rem | 16px |
| `$border-radius-xl` | 1.5rem | 24px |
| `$border-radius-full` | 2rem | 32px |

The documentation uses `$...` token notation. Do not infer SCSS implementation from that notation; this repository does not use SCSS as an implementation source.

## Current runtime CSS variables

The compiled `css/buckholt.css` currently defines:

```css
--border-radius-0: 0;
--border-radius-xs: 0.25rem;
--border-radius-sm: 0.375rem;
--border-radius-md: 0.5rem;
--border-radius-lg: 1rem;
--border-radius-xl: 1.5rem;
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

The runtime values for xs, sm, md, lg and xl agree with the documented scale.

The documentation's `full = 2rem` does **not** agree with the runtime variable named `--border-radius-full`, which is `625rem`. Runtime instead exposes `--border-radius-xxl: 2rem`. This is a recorded discrepancy; do not silently remap one name to the other.

## Runtime utility classes

The compiled CSS provides radius utilities including:

- `.border-radius-0`
- `.border-radius-xs`
- `.border-radius-sm`
- `.border-radius-md`
- `.border-radius-lg`
- `.border-radius-xl`
- `.border-radius-xxl`
- `.border-radius-full`
- `.border-radius-round`

It also provides corresponding top-only and bottom-only radius utilities.

These are runtime implementation details. Prefer the radius already built into a Buckholt component before adding a radius utility manually.

## Agent rules

- Use a component's documented/default Buckholt radius first.
- Do not hard-code arbitrary radius values when a Buckholt variable or component rule exists.
- Do not infer a missing radius from Bootstrap defaults.
- Do not treat the documentation's `$border-radius-full` and runtime `--border-radius-full` as equivalent while the naming/value discrepancy remains unresolved.
- If a design requires a fully pill-shaped or circular treatment, use the component's own documented behaviour where available; otherwise inspect the relevant component documentation before choosing `--border-radius-full` or `--border-radius-round`.
