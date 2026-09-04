# Buckholt documentation/runtime notes

The Buckholt documentation website is the primary source of truth for intended Digital Product design-system behaviour.

`css/buckholt.css` is the current runtime implementation. It may also contain additional helpers or values added while Buckholt was used to build the company website. Those additions can provide useful flexibility, but they should not automatically be promoted to canonical Buckholt guidance.

Only record an issue here when a runtime difference is likely to mislead an agent implementing documented Buckholt behaviour.

## Radius runtime extensions

The Radius documentation defines the intended documented scale through `full` at `2rem` / `32px`.

The runtime CSS additionally exposes:

```css
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

Treat these as runtime extensions unless and until the documentation explicitly adopts them. Do not block implementation merely because they exist.

For normal Buckholt design decisions, follow the documented Radius scale. A component may still use an additional runtime radius if its own documented/runtime implementation requires it.

## Link visited state is not implemented

The Link Style documentation defines the visited state for both link text and icon as **Expressive secondary deep (`#5731d6`)**.

The current compiled runtime contains no `:visited` rule at all, so a visited link is indistinguishable from an unvisited one. The tokens that would drive the state exist but are never consumed, and carry Text active blue rather than the documented colour:

```css
--link-visited: #1748d0;
--link-icon-visited: #1748d0;
```

The documented colour is present in the runtime as `--expressive-secondary-deep: #5731D6`, but nothing wires it to the link visited tokens.

This supersedes an earlier note describing a specific `a.link-standalone:visited .icon { color: #1748D0 }` rule. That rule is no longer present in the current stylesheet; the gap is now broader, because visited is unstyled entirely rather than styled with the wrong colour.

For design intent, treat `#5731d6` as canonical because it is the documented Link state. Do not create local one-off overrides in generated product UI merely to compensate; the underlying runtime should be corrected deliberately if the team chooses to align implementation with the documentation.

## Button focus state falls through to Bootstrap on mouse click

Buckholt styles the Button focus state only through `:focus-visible`:

```css
.btn:focus-visible {
  color: var(--button-label-focus);
  background-color: var(--button-background-focus);
  border-color: var(--button-border-focus);
  outline: 0;
  box-shadow: var(--button-shadow-focus);
}
```

Bootstrap 5.1.3, which Buckholt loads on top of, styles plain `:focus` for the button classes Buckholt reuses:

```css
.btn-check:focus+.btn,.btn:focus{outline:0;box-shadow:0 0 0 .25rem rgba(13,110,253,.25)}
.btn-primary:focus{color:#fff;background-color:#0b5ed7;border-color:#0a58ca;box-shadow:0 0 0 .25rem rgba(49,132,253,.5)}
.btn-secondary:focus{color:#fff;background-color:#5c636a;border-color:#565e64;box-shadow:0 0 0 .25rem rgba(130,138,145,.5)}
.btn-danger:focus{color:#fff;background-color:#bb2d3b;border-color:#b02a37;box-shadow:0 0 0 .25rem rgba(225,83,97,.5)}
```

A mouse click sets `:focus` but deliberately not `:focus-visible`, which browsers reserve for keyboard and programmatic focus. Buckholt's focus rule therefore never matches after a click, and Bootstrap's `:focus` styling applies unopposed. Loading Buckholt after Bootstrap does not help, because Buckholt defines no plain `:focus` rule for Bootstrap's to override.

Measured after a mouse click, with the pointer moved off the button:

| Variant | Rendered after click | Documented Buckholt resting/focus role |
| --- | --- | --- |
| `.btn-primary` | `#0b5ed7` | `--action-02` (`#3f66d1`) |
| `.btn-secondary` | `#5c636a` with white label | `--action-04` on `--action-07`, `--action-text-01` label |
| `.btn-ghost` | transparent with `rgba(13,110,253,.25)` glow | `--action-07`, Buckholt focus ring |
| `.btn-danger` combinations | `#bb2d3b` | `--action-danger-02` (`#ae0a09`) |

While the pointer remains over the button, Buckholt's `:hover` rule still wins the background, so only the Bootstrap focus ring is visible. Once the pointer leaves, the full Bootstrap fill appears. Secondary is the most obvious case because Bootstrap's grey diverges furthest from the Buckholt palette, but every variant is affected. Keyboard focus is unaffected and renders the documented Buckholt treatment, including the `#1748d0` focus ring.

Treat the Buckholt focus tokens as canonical; the Bootstrap colours are not a Buckholt state. Do not add local one-off `:focus` overrides in generated product UI to compensate, and do not override the state colours in test pages to make a screenshot look right. The runtime should be corrected deliberately, by having Buckholt style `:focus` alongside `:focus-visible` for `.btn`, or by explicitly neutralising Bootstrap's `:focus` treatment for the reused button classes.
