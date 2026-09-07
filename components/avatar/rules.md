# Avatar

## Purpose

Avatar provides a compact representation of a user. Buckholt supports image, initials and icon treatments, plus compact Avatar sets for showing several people together.

## Base forms

### Initials

```html
<div class="avatar">
  <div class="avatar-initials">MF</div>
</div>
```

### Image

```html
<div class="avatar">
  <img class="avatar-img" src="..." alt="...">
</div>
```

### Icon

```html
<div class="avatar">
  <div class="avatar-icon">
    <i class="fa-regular fa-user"></i>
  </div>
</div>
```

Choose the representation according to available identity data and context. Do not mix image, initials and icon content inside the same Avatar.

## Size

Buckholt documents three sizes:

- medium/default: `.avatar`
- small: `.avatar.avatar-sm`
- extra small: `.avatar.avatar-xs`

Use the default medium size unless the surrounding component or layout calls for a smaller Avatar.

## Expressive colours

The primary expressive palette is used by default for non-image Avatars. To select another palette, add one of:

- `.expressive-secondary`
- `.expressive-tertiary`
- `.expressive-quaternary`

To use the dark version of the selected expressive palette, add `.expressive-dark` on the same `.avatar` element.

Examples:

```html
<div class="avatar expressive-secondary">
  <div class="avatar-initials">HS</div>
</div>

<div class="avatar expressive-tertiary expressive-dark">
  <div class="avatar-initials">CP</div>
</div>
```

Use Colour foundation guidance rather than hard-coding equivalent expressive colours.

## Avatar set

Use `.avatar-set` to group several Avatars into one compact visual element when communicating shared ownership, collaboration or participation.

```html
<div class="avatar-set">
  <div class="avatar">
    <img class="avatar-img" src="..." alt="">
  </div>
  <div class="avatar expressive-quaternary">
    <div class="avatar-initials">RD</div>
  </div>
</div>
```

Avatar sets are for concise identity indication, not a replacement for a full people list when names/details are required.

## Images and accessibility

The documentation examples often show an empty `alt` on profile imagery because the surrounding UI is expected to provide identity/context separately. Treat image alternative text according to meaning:

- if the Avatar image is purely decorative because the person's name is already adjacent and programmatically available, use empty `alt=""`;
- if the image itself is needed to identify the person in context, provide meaningful alternative text;
- do not duplicate the same nearby visible name unnecessarily in alt text.

Initials and icons are visual identity representations. Ensure the surrounding interface supplies the person's actual accessible name where identity matters.

When using a generic user icon, select a documented icon from the Iconography foundation where a mapping exists. Do not invent a product-specific icon meaning simply to vary the visual.

## Runtime notes

The compiled Buckholt runtime supplies Avatar dimensions, clipping, radius, image fitting, initials/icon alignment, expressive colour variables and Avatar-set overlap/alignment. Do not recreate those visual rules locally.

## Agent rules

1. Use `.avatar` as the base element.
2. Use exactly one content form: `.avatar-img`, `.avatar-initials` or `.avatar-icon`.
3. Use `.avatar-sm` or `.avatar-xs` only for the documented smaller sizes.
4. Use the default expressive palette unless a documented secondary, tertiary or quaternary palette is intentionally needed.
5. Add `.expressive-dark` on the Avatar for the documented dark expressive treatment.
6. Use `.avatar-set` for compact groups of Avatars.
7. Make sure the surrounding UI exposes the user's actual identity accessibly; an Avatar alone should not be the only accessible naming mechanism where identity matters.
8. Do not recreate Avatar sizing, cropping, radius, overlap or expressive colours with custom CSS.
