# Component responsive guidance

> **Application-level guidance, not canonical Buckholt.** Read `README.md` first. Nothing here may
> be cited as documented Buckholt behaviour unless the Evidence column says Buckholt documents or
> implements it.

Audited at 320px, 375px, 768px and 1400px against `test/style-guide/index.html` on 7 September 2026,
with Proxima Soft, the Buckholt Font Awesome kit, `css/buckholt.css`, `css/buckholt-ai-fixes.css`,
the Bootstrap 5.1.3 **JavaScript** bundle, jQuery and the three Buckholt component scripts loaded.

At every audited width the style guide reports **zero document-level horizontal overflow**,
re-confirmed 9 September 2026.

> **Two caveats on the per-component observations below.**
>
> 1. **They predate the dependency-model correction.** The 7 September audit ran with a separate
>    `bootstrap.min.css` loaded underneath Buckholt, which was removed on 8 September. The
>    zero-overflow headline has been re-confirmed since, at all four widths, under the corrected
>    contract — but the individual component notes have not each been re-derived.
> 2. **They were measured on the local breakpoint scale, which is not the reference.**
>    `css/buckholt.css` uses stock Bootstrap breakpoints (`576/768/992/1200/1400`); the live
>    `compiled.css?v=2.3` uses `896/1088/1312/1520/1720`. **Mark confirmed on 9 September 2026 that
>    the live build is the reference**, so every width named below is the local width and does not
>    describe reference behaviour. Treat the *observations* as sound and the *widths* as needing
>    re-measurement against the reference scale. See `discrepancies/build-provenance.md`.

## Summary

| Status | Count |
| --- | --- |
| `DOCUMENTED RESPONSIVE` | 2 |
| `RUNTIME RESPONSIVE` | 8 |
| `APPLICATION GUIDANCE REQUIRED` | 4 |
| `NO ISSUE FOUND` | 27 |

---

## Buckholt already handles these

Do not add application guidance for these. Use what Buckholt provides.

### Modal — `RUNTIME RESPONSIVE`

**Evidence.** The runtime ships `.modal-fullscreen-sm-down` through `.modal-fullscreen-xxl-down`,
each in its own `max-width` media query. Measured: the dialog is 359px inside a 375px viewport and
304px inside 320px, inset 8px on both sides, at every audited width.

**Use.** Nothing extra is needed for a standard dialog. Where a form genuinely needs the full screen
on a phone, use the documented `.modal-fullscreen-{breakpoint}-down` modifier rather than custom
sizing.

### Tabs — `RUNTIME RESPONSIVE`

**Evidence.** `.tab-items-scroll` computes `overflow-x: auto`, and `components/tabs/tabs.js` supplies
the `.tab-scroll-left` / `.tab-scroll-right` controls when the strip overflows.

**Use.** Load `tabs.js`. Do not rebuild tab overflow with custom CSS, and do not convert Tabs to a
Select on small screens — that is a different component with different semantics.

### Table — `RUNTIME RESPONSIVE`

**Evidence.** `.table-content { width: 100%; overflow-x: auto }`. Measured at 375px: a 602px table
scrolls inside its container with no page-level overflow.

**Use.** Keep the documented `.table-container > .table-content > table.table` wrapper — the
scrolling depends on it. `components/table/rules.md` explicitly forbids removing semantic table
structure to achieve a responsive layout, so do not transpose rows into cards.

### Card and Versa-tile in a grid — `RUNTIME RESPONSIVE`

**Evidence.** The runtime carries a `@media (max-width: 767.98px)` rule matching a `.row` whose
columns contain only `.card` or `.versatile`, plus a `.card-lg .card-body` padding reduction at the
same breakpoint.

**Use.** Place cards in a Bootstrap `.row` / `.col` grid and the stacking is handled.

### Link set — `RUNTIME RESPONSIVE`

**Evidence.** `.link-set-sm-stacked`, `-md-`, `-lg-`, `-xl-` and `-xxl-stacked` each have their own
`max-width` media query. The base `.link-set` inherits `flex-wrap: wrap` from `[class$=-set]`;
measured, it wraps to two rows at 375px.

**Use.** Add the documented `.link-set-{breakpoint}-stacked` modifier when a set should stack rather
than wrap.

### Button set — `RUNTIME RESPONSIVE`

**Evidence.** `[class$=-set]` sets `display: flex; flex-wrap: wrap`. Measured: the three-button set
wraps to two rows at 375px and 320px. `.button-set-nowrap` is the documented opt-out and
`.button-set-stacked` the documented full-width stack.

**Use.** Wrapping is the default. Reach for `.button-set-stacked` when the actions should be
full-width on a phone. Note `.table [class$=-set] { flex-wrap: nowrap }` — action sets inside a table
deliberately do not wrap, and the table's own scroller handles the width.

### Dropdown and Menu — `RUNTIME RESPONSIVE`

**Evidence.** Measured at 375px and 320px, the open panel sits fully inside the viewport (351px wide
at left 12px; 296px at left 12px) — Bootstrap's Popper positioning, which Buckholt relies on.

**Use.** Load the Bootstrap bundle. Do not add custom repositioning.

### Input row — `DOCUMENTED RESPONSIVE`

**Evidence.** `patterns/input-rows/rules.md`: *"Input rows are intended to display inline where
sufficient space exists and stack when space becomes constrained. Use Bootstrap breakpoint classes to
achieve this rather than custom layout CSS."*

**Use.** In application markup, give the columns breakpoint classes — `class="col-12 col-md-6"`
rather than bare `class="col"`. Measured, a bare `.col` / `.col-4` pair does not stack and needs
about 331px.

**Important.** `components/input-row/rules.md` forbids writing `.col-md-*` into the canonical
example, so `components/input-row/examples.html` and the style guide keep the documented bare
`.col`. The breakpoint classes belong to the application, not to the canonical source.

### Multi-field input — `DOCUMENTED RESPONSIVE`

**Evidence.** `components/multi-field-input/rules.md` documents `.multi-input-stacked` as the stacked
arrangement of the same component.

**Use.** Apply `.multi-input-stacked` where the parts do not fit side by side. It is a documented
variant, so this is a component choice rather than a responsive override.

---

## Buckholt is silent — application guidance

Each of these is a real measured constraint with no Buckholt documentation covering it. Treat the
recommendation as the application's decision, not as Buckholt behaviour.

### Progress bar — `APPLICATION GUIDANCE REQUIRED`

**Constraint.** `.progress` and `.progress-stacked` set `min-width: 22rem` (352px). Measured at
320px, every progress bar — including the small one inside a Versa-tile — is 352px in a viewport of
320px.

**Evidence of silence.** `components/progress-bar/rules.md` says nothing about small viewports, and
the runtime has no media query for `.progress`.

**Recommendation.** Do not override `min-width` globally; it is a deliberate legibility floor for a
bar that has to show a proportion. In a layout narrower than about 380px, either give the progress
bar its own full-bleed row outside the surrounding padding, or relax the minimum in a narrowly scoped
application rule and accept the reduced precision:

```css
/* application layer, not Buckholt */
@media (max-width: 24rem) {
  .app-narrow .progress { min-width: 0; }
}
```

**Upstream.** Worth asking Buckholt whether the 22rem floor is intended to hold on phones.

### Card — Emphasis tile, inline variant — `APPLICATION GUIDANCE REQUIRED`

**Constraint.** `.emphasis-tile-inline` sets `width: 20rem; min-width: 12rem` (320px). Inside a
`.card-body` with 2rem padding each side the card measures 384px, so it exceeds a 375px viewport.

**Evidence of silence.** `components/card/rules.md` documents the modifier and explicitly declines to
specify the tile's internals; there is no responsive statement.

**Recommendation.** Use the non-inline `.emphasis-tile` on small viewports — it is the documented
full-width sibling and needs no override. Reserve `.emphasis-tile-inline` for widths where 20rem plus
the card padding genuinely fits.

### Key-value pair — grid variant — `APPLICATION GUIDANCE REQUIRED`

**Constraint.** The documented grid example carries `style="--columns: 3;"`. The custom property is a
documented knob but the value is fixed in the markup, so three columns persist at 320px and each pair
is compressed.

**Evidence of silence.** `components/key-value-pair/rules.md` documents `.grid.key-value-grid` and the
`--columns` property but says nothing about varying it by width.

**Recommendation.** Set `--columns` responsively in the application, since it is the knob Buckholt
provides:

```css
/* application layer, not Buckholt */
@media (max-width: 48rem) { .app-kv-grid { --columns: 2; } }
@media (max-width: 30rem) { .app-kv-grid { --columns: 1; } }
```

The list (`.key-value-list`) and table (`.key-value-table`) variants need nothing — both measured
clean at every width.

### Long labels and values — `APPLICATION GUIDANCE REQUIRED`

**Constraint.** Buckholt sets no `overflow-wrap` on `.key`, `.value`, `.versatile-label`,
`.card-body` text or `.tag-label`. An unbroken token — a reference number, an email address, a URL —
will push its container wider than the viewport.

**Evidence of silence.** No component's rules discuss overflow of a single long word.

**Recommendation.** Apply `overflow-wrap: anywhere` in the application at the container that owns the
content, not to Buckholt classes globally, and prefer truncation with an accessible full value where
the identifier must stay on one line.

---

## No issue found

Measured clean at 320px, 375px, 768px and desktop:

Accordion · Alert · Avatar · Breadcrumb · Button · Checkbox · Collapse · Dropdown · Form ·
Heading attachment · Icon block · Input group · Link · List · Lookup · Menu · Menu button ·
Nested inputs · Number input · Page navigation · Radio · Response button · Select · Slider ·
Summary Meta · Switch · Tag · Text area · Text block · Text input · Toast · Tooltip · Versa-tile

Versa-tile appears here and above: the tile itself is fine at every width; only the optional progress
bar inside it carries the 22rem minimum.

---

## What the style guide does about this

`test/style-guide/` contains a small amount of **page-layout** CSS so the catalogue itself is usable
on a phone: the shell collapses to a single column, its padding reduces below 30rem, and a demo whose
component carries a documented minimum width scrolls inside its own frame (`.sg-demo-scroll`) rather
than pushing the page sideways.

That is containment of the demonstration. It does not override a component, and it is not a
recommendation — the recommendations are the ones above. Every rule is prefixed `sg-` and marked as
style-guide layout in the page source.
