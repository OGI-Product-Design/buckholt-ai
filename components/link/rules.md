# Buckholt Link

## Purpose

Links are navigation. Use them to move users to another page, website, location on the current page, email address or telephone number.

Do not use a link for an action that modifies data, changes state, alters the display or triggers an event. Use a Button for those actions instead.

Links are intentionally lightweight. Avoid overusing them, particularly inline links, because too many links make the next step harder to identify.

## Types

### Inline link

Use an inline link inside a sentence or paragraph.

Canonical structure:

```html
<a href="#">Inline link</a>
```

Inline links:
- use the normal anchor element with no Link-specific class;
- are underlined so they remain distinguishable from surrounding text;
- should not be used in isolation;
- should not be paired with icons.

### Standalone link

Use a standalone link independently, directly after or alongside supporting content rather than embedding it inside a sentence.

Canonical structure:

```html
<a class="link-standalone" href="#">
  Standalone link
</a>
```

Standalone links use `.link-standalone`. Their default presentation has no underline; the underline appears for hover, focus and active interaction states.

Standalone links may include an icon when it helps communicate navigation or distinguish the link from nearby ghost buttons or inline links.

## Icons

When a standalone link has an icon, wrap the icon in `.icon`:

```html
<a class="link-standalone" href="#">
  <span class="icon">
    <i class="fa-regular fa-arrow-right"></i>
  </span>
  Continue
</a>
```

The icon should follow the link text colour through the interaction states.

Use the documented Buckholt icon catalogue rather than choosing an arbitrary icon when a defined navigation icon exists. `fa-regular fa-arrow-right` is the documented forward-navigation icon and is used in Link examples.

### Links that open a new tab

When a link opens content in a new tab, use the external-link icon whether the destination is within the same product or is an external web resource:

```html
<span class="icon">
  <i class="fa-regular fa-arrow-up-right-from-square"></i>
</span>
```

The link label and surrounding context must make the destination clear. The icon is supplementary; it must not carry the destination meaning by itself.

## States

Buckholt documents distinct default, hover, focus, active and visited states for links.

Important documented behaviour:
- inline links remain underlined by default;
- standalone links add the underline on hover, focus and active states;
- active link text and icon use Text primary (`#1a1a1a`);
- visited link text and icon use Expressive secondary deep (`#5731d6`);
- focus uses the Buckholt active/focus treatment and must remain clearly visible for keyboard users.

Do not reproduce these states with custom styling. Use the runtime Link implementation in `css/buckholt.css`.

## Link sets

Use a Link set when several standalone links form a related group.

Canonical structure:

```html
<ul class="link-set">
  <li class="linkset-item">
    <a class="link-standalone" href="#">First link</a>
  </li>
  <li class="linkset-item">
    <a class="link-standalone" href="#">Second link</a>
  </li>
</ul>
```

Add `.link-set-stacked` to the `<ul>` for the vertical form:

```html
<ul class="link-set link-set-stacked">
  ...
</ul>
```

Documented usage:
- horizontal Link sets are useful in main content and may include suitable accompanying icons;
- stacked Link sets are typically used for resource navigation at the side of a page or supplementary links within tiles.

Runtime behaviour already supplied by Buckholt:
- Link sets use flex layout and wrap;
- horizontal gap is `1rem`;
- row gap is `0.5rem`;
- the list removes default margin, padding and list markers;
- `.link-set-stacked` changes the direction to column;
- Link elements inside `.linkset-item` are rendered inline-block.

Do not recreate Link set spacing with custom layout CSS.

## Spacing and anatomy

The documented standalone-link anatomy uses a 16px icon and 8px space between the icon and text. The runtime implementation applies that spacing through the existing Link/icon rules, so agents should use the canonical `.icon` structure rather than manually adding margins.

The documented Link-set spacing is built into `.link-set`; use the component classes rather than hard-coded gaps.

## Accessibility and content

- Use an actual `<a>` element with a meaningful `href` for navigation.
- Link text should communicate the destination or result clearly from its wording and surrounding context.
- Preserve a visible keyboard focus state.
- Do not rely on an icon alone to explain where a link goes.
- Keep inline links visibly distinct from body copy through their documented underline treatment.

## Runtime note

The documentation is the source of truth for intended Link state colours. The current compiled CSS contains one material difference: the standalone visited icon is currently rendered as `#1748D0`, while the Link Style documentation specifies Expressive secondary deep (`#5731d6`) for both visited link text and icon.

For design intent, follow the documented visited state. Do not add a local CSS override merely to force the documented value unless the product team has decided to correct the runtime; see `discrepancies/known-issues.md`.

## Agent rules

When generating Buckholt Links:

1. Use plain `<a href="…">` for inline links.
2. Add `.link-standalone` only for standalone links.
3. Never use a link as a substitute for a Button action.
4. Do not pair icons with inline links.
5. For standalone icons, use `<span class="icon">` and the documented Buckholt icon mapping.
6. Use `fa-regular fa-arrow-up-right-from-square` when the link opens content in a new tab.
7. Use `.link-set` + `.linkset-item` for groups and `.link-set-stacked` for vertical groups.
8. Preserve native anchor semantics, focus behaviour and meaningful destination text.
9. Do not use generic Bootstrap `link-*` utilities as Buckholt Link design guidance unless a Buckholt component explicitly documents them.
10. Do not create custom CSS to imitate Link states or Link-set spacing that Buckholt already implements.
