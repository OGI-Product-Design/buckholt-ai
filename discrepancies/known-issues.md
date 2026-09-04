# Known Buckholt documentation/runtime discrepancies

This file records verified differences between Buckholt documentation and the current compiled `css/buckholt.css`.

Do not silently resolve these differences in agent-generated UI. Report them when relevant and follow an explicit project/design-system decision if one is provided later.

## Radius: `full`

**Documentation**

The Radius documentation defines `$border-radius-full` as `2rem` / `32px`.

**Current runtime CSS**

```css
--border-radius-xxl: 2rem;
--border-radius-full: 625rem;
--border-radius-round: 50%;
```

**Status**

Unresolved naming/value discrepancy.

**Agent behaviour**

Do not assume the documented `$border-radius-full` maps to the runtime `--border-radius-full`. Inspect the relevant component's documented/runtime behaviour and report the discrepancy if it affects implementation.
