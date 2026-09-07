# Avatar

## Verification

Source-verified against the Buckholt Avatar Usage, Style and Code & specs HTML pages supplied on 7 September 2026. For exact DOM structure, use `examples.html`.

## Purpose

Avatar represents a user or account visually. Buckholt supports image, initials and icon treatments and documents Avatar sets as a usage concept for compact groups of users.

## Base forms

Buckholt's Code & specs page documents three base forms:

```html
<div class="avatar">
    <div class="avatar-icon">
        <i class="fa-regular fa-user"></i>
    </div>
</div>

<div class="avatar">
    <div class="avatar-initials">
        MF
    </div>
</div>

<div class="avatar">
    <img class="avatar-img" src="..." alt="...">
</div>
```

Use exactly one of `.avatar-icon`, `.avatar-initials` or `.avatar-img` inside `.avatar`.

## Size

Buckholt documents three sizes:

- medium/default — `.avatar`
- small — `.avatar.avatar-sm`
- extra small — `.avatar.avatar-xs`

The Code & specs examples use `.avatar-sm` and `.avatar-xs` exactly as shown in `examples.html`.

## Expressive colours

The primary expressive palette is applied by default. Buckholt documents:

- `.expressive-dark`
- `.expressive-secondary`
- `.expressive-tertiary`
- `.expressive-quaternary`

The palette modifiers may be combined with `.expressive-dark` as shown in the exact source examples.

## Avatar sets

The Usage page documents Avatar sets as a way to group multiple Avatars into a compact visual element for shared ownership, collaboration or participation.

The supplied Code & specs page does **not** provide canonical Avatar-set HTML. Therefore this repository must not invent an `.avatar-set` DOM structure and call it Buckholt canonical markup. If Avatar-set implementation is required, use an additional Buckholt source that explicitly provides its HTML or report the gap.

## Content and accessibility

- Images, initials and icons are visual identity treatments; the surrounding interface should still communicate the person's actual identity where that matters.
- Keep initials to the documented compact representation (up to two initials in Usage guidance).
- Use image alternative text according to the actual semantic context; do not change the canonical Code & specs placeholder markup in `examples.html`.

## Agent rules

- Use `examples.html` as the canonical Avatar DOM source.
- Use exactly one content form inside `.avatar`: `.avatar-icon`, `.avatar-initials` or `.avatar-img`.
- Use `.avatar-sm` and `.avatar-xs` only for the documented smaller sizes.
- Use the documented expressive modifiers exactly as shown.
- Do not invent canonical Avatar-set markup; Usage documents the concept but the supplied Code & specs source does not supply its HTML.
- Do not recreate Avatar sizing, cropping, radius or expressive colours with local CSS.
