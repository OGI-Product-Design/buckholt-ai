# Spacing

## Source of truth

The Buckholt documentation website is the source of truth for intended spacing behaviour and token usage. `css/buckholt.css` is the runtime implementation and may contain additional implementation detail or website-specific flexibility.

## Purpose

Spacing defines the relationship between UI elements and creates hierarchy and balance. Buckholt says to use spacing tokens and utilities instead of hard-coded `px` or `rem` values so layouts remain consistent and flexible.

The Buckholt spacing scale is built on multiples of 2, 4 and 8 and is used both within components and between components.

## Core spacing scale

Use the core scale for consistent spatial relationships.

| Token | rem | px |
| --- | ---: | ---: |
| `--spacer-01` | 0.125 | 2 |
| `--spacer-02` | 0.25 | 4 |
| `--spacer-03` | 0.5 | 8 |
| `--spacer-04` | 1 | 16 |
| `--spacer-05` | 1.5 | 24 |
| `--spacer-06` | 2 | 32 |
| `--spacer-07` | 3 | 48 |
| `--spacer-08` | 4 | 64 |
| `--spacer-09` | 8 | 128 |

The runtime also defines `--spacer-0: 0`.

## Padding tokens

Buckholt provides dedicated padding tokens:

| Token | rem | px |
| --- | ---: | ---: |
| `--padding-01` | 0.25 | 4 |
| `--padding-02` | 0.375 | 6 |
| `--padding-03` | 0.5 | 8 |
| `--padding-04` | 0.75 | 12 |
| `--padding-05` | 1 | 16 |
| `--padding-06` | 1.25 | 20 |
| `--padding-07` | 1.5 | 24 |
| `--padding-08` | 2 | 32 |
| `--padding-09` | 4 | 64 |
| `--padding-10` | 8 | 128 |

The runtime also defines `--padding-0: 0`.

## Margin tokens

Buckholt provides dedicated margin tokens:

| Token | rem | px |
| --- | ---: | ---: |
| `--margin-01` | 0.25 | 4 |
| `--margin-02` | 0.5 | 8 |
| `--margin-03` | 1 | 16 |
| `--margin-04` | 1.5 | 24 |
| `--margin-05` | 2 | 32 |

The runtime also defines `--margin-0: 0`.

## Applying spacing

Spacing tokens may be applied to margin and padding on vertical and horizontal edges. Prefer the semantic spacing token already used by the relevant Buckholt component or pattern rather than selecting a value solely by appearance.

Component documentation remains authoritative for the actual spacing inside a component. This foundation provides the shared scale, not permission to restyle components arbitrarily.

## Agent rules

1. Do not hard-code spacing values where a Buckholt token provides the intended value.
2. Read the relevant component or pattern documentation before changing its spacing.
3. Use `--spacer-*` for the shared spacing scale and the dedicated `--padding-*` / `--margin-*` tokens where Buckholt documents them.
4. Preserve the documented relationships between elements rather than choosing a token because it merely looks close.
5. Treat extra runtime helpers or website-specific layout values as implementation flexibility unless the documentation promotes them as Buckholt guidance.
