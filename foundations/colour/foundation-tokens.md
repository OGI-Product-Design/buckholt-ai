# Buckholt foundation colour tokens

These are the functional colour roles exposed by the current compiled `../../css/buckholt.css`. Use these roles instead of raw palette values when implementing components.

## Text

| Variable | Runtime value |
| --- | --- |
| `--text-primary` | `#1a1a1a` |
| `--text-secondary` | `#454545` |
| `--text-tertiary` | `#595959` |
| `--text-muted` | `rgba(26, 26, 26, 0.625)` |
| `--text-light` | `#ffffff` |
| `--text-active` | `#1748d0` |
| `--text-success` | `#168914` |
| `--text-error` | `#d7050c` |

## UI surfaces

| Variable | Runtime value |
| --- | --- |
| `--ui-background-01` | `#ffffff` |
| `--ui-background-02` | `#fbfbfb` |
| `--ui-background-03` | `#f7f7f7` |
| `--ui-background-04` | `#efefef` |
| `--ui-overlay-01` | `rgba(26, 26, 26, 0.015)` |
| `--ui-overlay-02` | `rgba(26, 26, 26, 0.04)` |
| `--ui-overlay-03` | `rgba(26, 26, 26, 0.07)` |
| `--ui-overlay-04` | `rgba(26, 26, 26, 0.48)` |
| `--ui-border-01` | `#919191` |
| `--ui-border-02` | `#dadada` |
| `--ui-border-03` | `rgba(26, 26, 26, 0.07)` |
| `--ui-border-04` | `#ffffff` |

## Actions

| Variable | Runtime value |
| --- | --- |
| `--action-01` | `#0f40c5` |
| `--action-02` | `#3f66d1` |
| `--action-03` | `#092676` |
| `--action-04` | `rgba(15, 64, 197, 0.1)` |
| `--action-05` | `rgba(26, 26, 26, 0.07)` |
| `--action-06` | `#919191` |
| `--action-07` | `#ffffff` |
| `--action-08` | `#04133b` |
| `--action-text-01` | `#0f40c5` |
| `--action-text-02` | `#ffffff` |
| `--action-text-03` | `rgba(26, 26, 26, 0.625)` |
| `--action-text-04` | `#595959` |
| `--action-text-05` | `#454545` |

## Danger actions

| Variable | Runtime value |
| --- | --- |
| `--action-danger-01` | `#d7050c` |
| `--action-danger-02` | `#ae0a09` |
| `--action-danger-03` | `#590407` |
| `--action-danger-04` | `rgba(215, 5, 12, 0.1)` |
| `--action-text-danger-01` | `#d7050c` |

## Disabled and state

| Variable | Runtime value |
| --- | --- |
| `--disabled-overlay-01` | `rgba(26, 26, 26, 0.07)` |
| `--disabled-overlay-02` | `rgba(26, 26, 26, 0.16)` |
| `--disabled-overlay-03` | `rgba(26, 26, 26, 0.3)` |
| `--disabled-01` | `#efefef` |
| `--disabled-02` | `#dadada` |
| `--disabled-03` | `#bababa` |
| `--disabled-04` | `#ffffff` |
| `--focus-01` | `#1748d0` |
| `--success-01` | `#168914` |
| `--error-01` | `#d7050c` |

## Feedback

### Information

| Role | Variable | Value |
| --- | --- | --- |
| background | `--feedback-background-info` | `#e7ecf9` |
| overlay | `--feedback-overlay-info` | `rgba(23, 72, 208, 0.1)` |
| border | `--feedback-border-info` | `#3f66d1` |
| message | `--feedback-message-info` | `#1748d0` |
| body | `--feedback-body-info` | `#04133b` |

### Success

| Role | Variable | Value |
| --- | --- | --- |
| background | `--feedback-background-success` | `#e7f3e7` |
| overlay | `--feedback-overlay-success` | `rgba(22, 137, 20, 0.1)` |
| border | `--feedback-border-success` | `#168914` |
| message | `--feedback-message-success` | `#136e11` |
| body | `--feedback-body-success` | `#041b04` |

### Warning

| Role | Variable | Value |
| --- | --- | --- |
| background | `--feedback-background-warning` | `#fff3e7` |
| overlay | `--feedback-overlay-warning` | `rgba(255, 122, 0, 0.1)` |
| border | `--feedback-border-warning` | `#b35400` |
| message | `--feedback-message-warning` | `#b35400` |
| body | `--feedback-body-warning` | `#4c2400` |

### Error

| Role | Variable | Value |
| --- | --- | --- |
| background | `--feedback-background-error` | `#fbe7e8` |
| overlay | `--feedback-overlay-error` | `rgba(215, 5, 12, 0.1)` |
| border | `--feedback-border-error` | `#d7050c` |
| message | `--feedback-message-error` | `#d7050c` |
| body | `--feedback-body-error` | `#2a0202` |

## Expressive roles

Buckholt exposes four expressive families. The primary family is the unprefixed default; secondary, tertiary and quaternary are selected by their documented modifiers on components that support them. These are tone/emphasis roles and must not replace semantic action or feedback tokens.

### Primary expressive family — default

| Role | Variable | Value |
| --- | --- | --- |
| pale | `--expressive-pale` | `#e7ecf9` |
| soft | `--expressive-soft` | `#b7c6ee` |
| deep | `--expressive-deep` | `#1748d0` |
| rich | `--expressive-rich` | `#092676` |
| pale overlay | `--expressive-pale-overlay` | `rgba(15, 64, 197, 0.1)` |
| soft overlay | `--expressive-soft-overlay` | `rgba(15, 64, 197, 0.3)` |

There is no `.expressive-primary` runtime modifier. Primary is already the default.

### Secondary expressive family

| Role | Variable | Value |
| --- | --- | --- |
| pale | `--expressive-secondary-pale` | `#EEEAFB` |
| soft | `--expressive-secondary-soft` | `#CDC1F1` |
| deep | `--expressive-secondary-deep` | `#5731D6` |
| rich | `--expressive-secondary-rich` | `#2C196B` |
| pale overlay | `--expressive-secondary-pale-overlay` | `rgba(87, 49, 214, 0.1)` |
| soft overlay | `--expressive-secondary-soft-overlay` | `rgba(87, 49, 214, 0.3)` |

### Tertiary expressive family

| Role | Variable | Value |
| --- | --- | --- |
| pale | `--expressive-tertiary-pale` | `#FBE8EE` |
| soft | `--expressive-tertiary-soft` | `#F3B8CC` |
| deep | `--expressive-tertiary-deep` | `#DB1256` |
| rich | `--expressive-tertiary-rich` | `#570722` |
| pale overlay | `--expressive-tertiary-pale-overlay` | `rgba(219, 18, 86, 0.1)` |
| soft overlay | `--expressive-tertiary-soft-overlay` | `rgba(219, 18, 86, 0.3)` |

### Quaternary expressive family

| Role | Variable | Value |
| --- | --- | --- |
| pale | `--expressive-quaternary-pale` | `#E7F2F6` |
| soft | `--expressive-quaternary-soft` | `#B7D9E3` |
| deep | `--expressive-quaternary-deep` | `#0E80A4` |
| rich | `--expressive-quaternary-rich` | `#053342` |
| pale overlay | `--expressive-quaternary-pale-overlay` | `rgba(14, 128, 164, 0.1)` |
| soft overlay | `--expressive-quaternary-soft-overlay` | `rgba(14, 128, 164, 0.3)` |

## Implementation rule

Do not copy these hex values into component CSS unless there is no Buckholt variable available. Components should reference the variables so the design system remains connected and themeable.
