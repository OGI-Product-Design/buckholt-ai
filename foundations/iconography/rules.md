# Iconography

## Purpose

Icons visually represent actions or concepts, helping users navigate, understand and act quickly.

## Sources

- Buckholt Iconography documentation: `https://buck.88mph.design/styles/iconography/`
- Buckholt Icon catalogue: `https://buck.88mph.design/styles/iconography/icon-catalogue/`
- Runtime dependency: the approved Font Awesome kit recorded in `README.md` and `CLAUDE.md`

## Library and style

Buckholt uses the Font Awesome library. The supplied documentation links to Font Awesome v7 and states that the **regular** icon style is used for most applications.

Use the exact Buckholt mapping in `catalogue.md` when an icon is documented. Do not choose a different Font Awesome icon merely because it looks similar.

The catalogue also contains deliberate `solid` and `brands` entries. Preserve the documented style for those icons rather than converting everything to regular.

## Canonical markup

The catalogue expresses icons using Font Awesome classes, for example:

```html
<i class="fa-regular fa-magnifying-glass"></i>
```

```html
<i class="fa-solid fa-sparkles"></i>
```

```html
<i class="fa-brands fa-bootstrap"></i>
```

When a component's own documentation wraps the icon in additional Buckholt markup such as `.btn-icon`, follow that component documentation as well. Iconography defines the icon mapping; the component defines the surrounding structure.

## Choosing icons

1. Check `catalogue.md` first.
2. Match the Buckholt icon name and documented role to the intended action or concept.
3. Use the exact Font Awesome classes recorded for that entry.
4. Do not substitute an undocumented icon when a Buckholt catalogue entry already exists for the same concept.
5. If no documented icon covers the requirement, report the gap rather than inventing a Buckholt mapping.

## Roles and categories

The catalogue records a Buckholt name, Font Awesome class, style, category, Unicode value and, where supplied, a documented role. The role is the strongest evidence for semantic intent.

Some catalogue entries have no role text. Do not manufacture one. Their documented name, category and Font Awesome mapping may still be used.

## Accessibility

The general Iconography page supplied here does not define a single universal ARIA treatment for every icon. Accessibility requirements depend on the component and context in which the icon is used.

Follow the relevant component documentation for accessible names, tooltips and `aria-hidden` behaviour. For example, Button has its own icon-only accessibility rules.

Do not treat an icon alone as an accessible name unless the component documentation explicitly supports that pattern.

## Relationship to components

Icons are a shared foundation. Components should reference this catalogue for icon choice and then use their own canonical markup and accessibility rules.

Examples:

- Button decides whether `.btn-icon`, `.button-label`, a tooltip or accessible name is required.
- Iconography decides that the documented Search icon is the Font Awesome mapping recorded in `catalogue.md`.

This separation avoids duplicating icon mappings inside every component specification.

## Evidence discipline

The supplied catalogue is authoritative for Buckholt icon naming and mappings. Do not use generic Font Awesome search results, remembered icon names or a different icon library to override it.

If component documentation and the icon catalogue appear to disagree, report the discrepancy rather than silently changing either source.
