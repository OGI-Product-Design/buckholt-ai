# Buckholt runtime verification harness

## Purpose

This harness answers one question:

> Does the source-verified Buckholt markup render and behave correctly against the required runtime?

It does **not** answer whether the markup is faithful to Buckholt. That is source verification, and it is already recorded in `verification/component-source-status.md`. Keep the two questions apart. A runtime defect must never be "fixed" by rewriting source-verified canonical markup.

Read `verification/runtime-verification-framework.md` before using this page to change any status.

## Three layers

The page is deliberately layered, so raw evidence never becomes the primary interface.

| Layer | Where | What it answers |
| --- | --- | --- |
| 1 · Style guide | [`test/style-guide/`](../style-guide/index.html) | What Buckholt looks like. Start there. |
| 2 · Runtime summary | the top of `index.html` | What works and what needs attention — one row per component. |
| 3 · Raw diagnostics | `<details>` sections and `window.rvDiagnostics` | Why the verifier reached that conclusion. |

The summary is a table of `Component | Source | Runtime | Behaviour | Notes`, with statuses:

`PASS` · `VERIFIED RUNTIME ISSUE` · `APPLICATION BEHAVIOUR REQUIRED` · `SOURCE PARTIAL` ·
`NEEDS INVESTIGATION`

Every verbose section — the dependency check, the compatibility-fix verification, the harness
artefacts and the full diagnostic list — sits behind a closed disclosure. Nothing is discarded; it
is just not the front page.

### The summary is measured, not asserted

Every correction in `css/buckholt-ai-fixes.css` is re-checked against the live runtime on load, so a
fix that stops working — because an upstream build changed, or the stylesheet was not loaded — shows
up as a `VERIFIED RUNTIME ISSUE` on the affected component rather than passing silently.

Three different counts appear around the compatibility layer and they are not interchangeable:

| Count | What it counts |
| --- | --- |
| **14** | documented corrections — the numbered issues in `css/buckholt-ai-fixes.css` |
| **22** | CSS rules — some corrections need several selectors (Accordion needs five) |
| **15** | runtime assertions — some corrections are asserted more than once (Button close is checked for both its geometry and its background image; Alert and Toast are asserted separately against one shared rule) |

The summary header reports the assertion count; `window.rvFixChecks` holds the detail.

### Harness artefacts are separated from component defects

Composing separately-authored examples onto one page creates conditions that do not exist in the
components. Every diagnostic carries a `scope`, and only `scope: "component"` can change a
component's status. The rest are collected under **Harness artefacts** and summarised rather than
listed one by one:

- documented `…` elisions — counted, with the components they appear in, not shown as dozens of
  separate failures;
- documented `src="..."` image placeholders that cannot load;
- ids reused across separately-authored examples;
- the documented modal trigger targeting an id its own documented example does not define;
- group `label[for]` values with no single control to point at.

### Behaviour is described at component level

Where a documented interaction has no shipped script, the summary says so in the Behaviour column
rather than reporting it as a defect. For example:

- **Tag** — visual component present; selection and dismiss are product behaviour
- **Slider** — range and number field are not synchronised by any shipped script
- **Table** — the `data-cdt-*` controller implied by the source is not supplied

## What is on the page

`index.html` carries every component that has a source-verified `examples.html`: **41 components**,
composed into **217 documented examples**.

Each component section shows a heading, its source and runtime gates, the behaviour dependencies its
markup exercises, and the canonical markup framed one documented example at a time.

## The markup is copied, not rewritten

Every block is copied **byte-for-byte** from `components/<component>/examples.html`. Nothing inside a canonical block has been reformatted, normalised, completed, corrected or reindented.

Each block is delimited in the source of `index.html` by:

```html
<!-- rv:begin:<component> -->
…exact contents of components/<component>/examples.html…
<!-- rv:end:<component> -->
```

Those markers make the copy checkable. To prove it, extract each region and compare it with its source file — the two must be identical.

When `examples.html` changes, re-copy the file contents between the markers. Do not hand-edit the copy, and do not edit `examples.html` to suit this page.

## The wrappers are test-only

Everything that is not inside an `rv:begin`/`rv:end` region is harness chrome:

- every harness element carries a class prefixed `rv-` and the attribute `data-rv-harness="true"`;
- the per-example frames, labels, badges, notes and buttons are created by `runtime-verification.js` at load time and wrap canonical nodes from **outside**;
- none of it is Buckholt markup, and none of it should ever be described as Buckholt markup or copied into product code.

The example frames use the `<!-- Code & specs example N -->` comments that the source files already carry, so the grouping comes from the documentation rather than from a harness invention.

### Test-only CSS

The `<style>` block in `index.html` covers page background, section separation, headings, test-case spacing and inspection aids only. Every selector is prefixed `rv-`, and none reaches inside a Buckholt component.

It must never set padding, colour, border, radius, typography, icon placement, component dimensions or interaction states on a Buckholt class. **If a component looks wrong, record the issue — do not patch it here.**

### Test-only JavaScript

`runtime-verification.js` contains harness logic only. It:

- checks the dependency contract, including stylesheet order;
- frames each documented example and badges the ones that cannot be judged on appearance;
- initialises Bootstrap Tooltips using the options Buckholt documents in `components/tooltip/examples.html`;
- adds buttons to show modals and toasts, which render hidden at rest, by driving the documented Bootstrap API from outside rather than adding `.show` to canonical markup;
- reports duplicate ids, unresolved `label[for]` and unresolved `data-bs-target`;
- logs focus and Bootstrap state transitions to the console;
- reports documented interactions that no shipped script implements.

It deliberately does **not** implement missing Buckholt behaviour. Where a documented interaction has no script in this repository, the harness reports `MISSING BUCKHOLT JS` and leaves it broken, because supplying it here would present harness code as design-system behaviour.

## Dependencies and load order

Styles, in this order:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="../../css/buckholt.css">
<link rel="stylesheet" href="../../css/buckholt-ai-fixes.css">
```

> **No separate Bootstrap stylesheet.** `buckholt.css` is a complete, self-contained
> Bootstrap 5.3 build with Buckholt as the theme, and the live Buckholt documentation
> site loads only its own compiled CSS. Bootstrap **JavaScript** is still required for
> the ten components with `data-bs-*` hooks; its correct version is not yet verified.
> See `CLAUDE.md` → Runtime dependencies.


Behaviour, at the end of the body:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="../../components/dropdown/dropdown.js"></script>
<script src="../../components/form/form.js"></script>
<script src="../../components/tabs/tabs.js"></script>
<script src="runtime-verification.js"></script>
```

**jQuery must load before `form.js`.** Without it, `form.js` fails silently and the Number input steppers, Text area counter, Checkbox/Radio read-only handling and Text input clear button all appear broken for the wrong reason.

The dependency panel at the top of the page reports each of these, and reports the stylesheet order separately from mere presence. **A failed dependency check voids every rendering judgement below it** — fix the dependency before classifying anything as a defect.

## How to view it

Open `test/runtime-verification/index.html` in a browser.

Loading it straight off the filesystem (`file://`) is enough for visual inspection. Note that the CDN dependencies need network access; if Bootstrap, Typekit or the Font Awesome kit are blocked, the dependency panel will say so and the page below it is not evidence of anything.

Open the console as well. The harness logs a summary, a `console.table` of every diagnostic, and each focus and Bootstrap state transition as you interact. `window.rvDiagnostics` holds the same data for scripted inspection.

## This is not the page to look at Buckholt with

`test/style-guide/` is the human-facing visual catalogue: foundations first, then every component grouped by what it does, showing the meaningful variants and states. That is where you go to see what Buckholt looks like.

This harness is the opposite by design. It is a mechanical composition of unmodified canonical source, so it deliberately shows deliberately-incomplete snippets, isolated fragments, `…` elisions and diagnostic badges. That makes it good evidence and a poor showroom.

The two coexist and neither replaces the other:

| | `test/style-guide/` | `test/runtime-verification/` |
| --- | --- | --- |
| Audience | anyone who needs to see Buckholt | whoever is verifying it |
| Markup | canonical, composed and completed for display | canonical, byte-for-byte, never touched |
| Elisions | filled in from verified markup of the same component | left in place and badged |
| Badges and diagnostics | none | the whole point |
| States | the meaningful ones, made visible | whatever the raw snippet renders |

Neither page may be used to justify changing canonical source. If something looks wrong on the style guide, reproduce it here first and classify it.

## Before adding a compatibility fix

A runtime mismatch must be **investigated and classified before anything is changed**, using the categories in `verification/runtime-verification-framework.md`:

`PASS` · `DEPENDENCY ISSUE` · `BOOTSTRAP BLEED-THROUGH` · `BUCKHOLT RUNTIME DEFECT` · `DOCUMENTATION/RUNTIME MISMATCH` · `MISSING BUCKHOLT JS` · `PRODUCT-LEVEL BEHAVIOUR` · `SOURCE PARTIAL` · `NEEDS INVESTIGATION`

Do not assume Bootstrap is responsible from appearance alone. For any suspected cascade issue, identify the property, the winning selector, the winning stylesheet, the losing Buckholt selector, and the specificity or order reason — then classify.

A new fix in `css/buckholt-ai-fixes.css` requires all of:

1. source-verified intended behaviour;
2. a reproducible runtime mismatch;
3. an identified technical cause;
4. a narrow selector scoped to the defect;
5. a regression check across the relevant resting, hover, focus, active and disabled states;
6. an entry in `discrepancies/known-issues.md`.

Never edit `css/buckholt.css`. It is the upstream runtime snapshot.

## Known limitations of composing examples onto one page

These are properties of the harness, not of Buckholt. The page reports each one at the top so it is not mistaken for a defect.

- **Duplicate ids.** Buckholt reuses ids across its own separately-authored examples, so composing them onto one page produces collisions. Every `label[for]`, `aria-labelledby`, `aria-controls` and `data-bs-target` resolves to the *first* match, which can make a correct control look broken. Verify affected examples in isolation.
- **Documented `…` elisions.** Nineteen components contain examples where `…` stands in for omitted content. Those render as incomplete components. They are `SOURCE PARTIAL` for the elided parts — appearance there is not evidence.
- **`src="..."` placeholders.** Documented image placeholders 404 by design. Expected, not a defect.
- **Cross-snippet references.** The documented modal trigger targets `#exampleModal`, which the documented modal example does not define — they are separate snippets on the Buckholt page. Verify against the component source; do not add ids to canonical markup to make them connect.
- **Documented script snippets.** Some Code & specs examples are JavaScript rather than HTML. They are shown as source in a test-only `<pre>` rather than rendered as stray page text.

## Table is source-partial

`components/table/examples.html` came from a Usage page only; no complete Code & specs source was supplied. It is included and badged `SOURCE PARTIAL`. Do not invent the missing variants, and do not promote Table to `RUNTIME VERIFIED` on the strength of this page.
