# Link

## Verification

Source-verified against the Buckholt Link Usage, Style and Code & specs HTML pages supplied on 7 September 2026. `examples.html` is the canonical source for exact Link DOM structure.

## Purpose

Links are for navigation: another page, website, location, email address or telephone number. Do not use a Link for an action that modifies data, changes state or triggers an event; use Button instead.

## Types

Buckholt documents Inline and Standalone links.

Inline Link canonical source:

```html
<a href="#">Inline link</a>
```

Standalone Link canonical source:

```html
<a class="link-standalone" href="#">
    Standalone link
</a>
```

Use `examples.html` rather than replacing `#` with invented product URLs in canonical examples.

## Icons

The Code & specs source demonstrates an icon only on a Standalone Link and wraps it in `.icon`:

```html
<a class="link-standalone" href="#"> 
    <span class="icon">
        <i class="fa-regular fa-arrow-right"></i>
    </span>
    Standalone link
</a>
```

Usage guidance says Inline Links should not be paired with icons. Usage also describes the external-link icon for links that open content in a new tab. That is valid usage guidance, but it is **not** an additional canonical block example in the supplied Code & specs HTML. Do not manufacture one inside `examples.html`.

## Link sets

The Code & specs source documents the set wrappers but intentionally uses `...` placeholders for the items:

```html
<ul class="link-set link-set-stacked">
    <li class="linkset-item">...</li>
    <li class="linkset-item">...</li>
    <li class="linkset-item">...</li>
</ul>

<ul class="link-set">
    <li class="linkset-item">...</li>
    <li class="linkset-item">...</li>
    <li class="linkset-item">...</li>
</ul>
```

Do not expand those placeholders into invented destinations or labels in the canonical source file.

## States

Buckholt documents default, hover, focus, active and visited treatments. Use `buckholt.css` and the verified compatibility correction for the documented visited colour where applicable; do not recreate Link states locally.

## Content and accessibility

Use meaningful link text in real product UI and preserve visible focus. If a real implementation opens a new tab, follow the documented usage guidance and accessibility requirements, but keep application-specific attributes and destinations separate from the canonical source examples.

## Agent rules

- Use `examples.html` as canonical DOM evidence.
- Use plain `<a>` for Inline Links and `.link-standalone` for Standalone Links.
- Use `.icon` exactly where the source shows it.
- Do not add icons to Inline Links.
- Keep source `...` placeholders in Link-set canonical examples.
- Do not invent destination URLs, `target` attributes or extra icon examples and call them canonical Buckholt markup.
- Use Button for actions and Link for navigation.
- Do not recreate Link styling or states with local CSS.
