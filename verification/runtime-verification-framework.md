# Buckholt runtime verification framework

This framework is the controlled process for verifying that source-verified Buckholt markup actually renders and behaves correctly with the repository runtime.

## Purpose

Source verification answers: **Is the canonical HTML faithful to Buckholt documentation?**

Runtime verification answers: **Does that exact documented HTML render and behave correctly with the required Buckholt dependencies?**

Do not mix these two questions. A runtime defect must never be "fixed" by rewriting source-verified canonical markup.

## Required runtime contract

Load styles in this order:

```html
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="css/buckholt.css">
<link rel="stylesheet" href="css/buckholt-ai-fixes.css">
```

> **No separate Bootstrap stylesheet.** `buckholt.css` is a complete, self-contained
> Bootstrap 5.3 build with Buckholt as the theme, and the live Buckholt documentation
> site loads only its own compiled CSS. Bootstrap **JavaScript** is still required for
> the ten components with `data-bs-*` hooks; its correct version is not yet verified.
> See `CLAUDE.md` → Runtime dependencies.


Load behaviour dependencies only where required. The controlled full-suite harness should load:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="components/dropdown/dropdown.js"></script>
<script src="components/form/form.js"></script>
<script src="components/tabs/tabs.js"></script>
```

`form.js` depends on jQuery. Do not test Number input, Text area counting, Checkbox/Radio read-only behaviour or other Form-script enhancements without jQuery present.

## Evidence inputs

For each component, use:

1. `components/<component>/examples.html` — source-verified canonical HTML where status is HTML VERIFIED.
2. `components/<component>/rules.md` — documented usage/state expectations.
3. `css/buckholt.css` — runtime implementation.
4. `css/buckholt-ai-fixes.css` — verified compatibility corrections.
5. supplied component JavaScript where relevant.
6. `discrepancies/known-issues.md` — already verified runtime/documentation differences.

Do not use SCSS, Figma, screenshots or inferred markup as runtime implementation evidence.

## Verification sequence

For every component:

1. **Source gate** — confirm its source status. HTML VERIFIED components may proceed. SOURCE PARTIAL components may be runtime-tested only for the exact markup already evidenced; do not treat missing variants as verified.
2. **Dependency gate** — confirm required CSS, fonts, Font Awesome, Bootstrap JS and component JS are present in the expected order.
3. **Resting render** — compare the canonical example with the Buckholt documentation presentation and component Style guidance.
4. **State verification** — exercise only states documented for that component: hover, focus-visible, active/selected, disabled/read-only, error/success, open/expanded, etc.
5. **Behaviour verification** — test Bootstrap and component-JS interactions where relevant.
6. **Cascade inspection** — when a visual mismatch exists, inspect the winning declaration before deciding the cause. Never infer a Bootstrap conflict from appearance alone.
7. **Classify the result** using the categories below.
8. **Record evidence** in `verification/runtime-status.md` and, for genuine issues, in `discrepancies/known-issues.md`.
9. **Apply a compatibility fix only when verified** and only in `css/buckholt-ai-fixes.css`.

## Allowed result classifications

Every mismatch must be classified as one of:

- **PASS** — documented markup, appearance and behaviour agree sufficiently for the tested state set.
- **DEPENDENCY ISSUE** — required CSS/font/icon/JS dependency is absent, wrong version or wrong order.
- **BOOTSTRAP BLEED-THROUGH** — Bootstrap wins a property/state that Buckholt intends to control.
- **BUCKHOLT RUNTIME DEFECT** — `buckholt.css` does not implement documented Buckholt behaviour correctly and the cause is not Bootstrap.
- **DOCUMENTATION/RUNTIME MISMATCH** — documentation and current runtime materially disagree; neither should be silently rewritten.
- **MISSING BUCKHOLT JS** — documentation/runtime expects behaviour but the necessary script is not present in the repository.
- **PRODUCT-LEVEL BEHAVIOUR** — Buckholt supplies structure/style but leaves application logic to the consuming product.
- **SOURCE PARTIAL** — exact markup/state cannot be fully tested because the relevant documentation source was not supplied.
- **NEEDS INVESTIGATION** — evidence is insufficient; do not guess.

Do not use "wrong HTML" as a runtime fix path for an HTML VERIFIED component. If the canonical file is later proven to have been extracted incorrectly, move it back through source verification first.

## State checklist

Test only applicable documented states:

| Area | Checks |
| --- | --- |
| Resting | typography, colour, border, radius, spacing, icon placement, dimensions |
| Pointer | hover, pressed/active, release while hovered, pointer-away after focus |
| Keyboard | tab order, `:focus-visible`, Enter/Space where documented |
| Selection | checked/selected/active/indeterminate states where documented |
| Availability | disabled and read-only presentation/behaviour |
| Validation | error/invalid and success/valid states where documented |
| Disclosure | expanded/collapsed/open/closed state and ARIA synchronisation |
| Responsive | documented size/breakpoint behaviour only; do not invent expectations |
| JS | documented Bootstrap or Buckholt enhancement behaviour |

## Cascade rule

A visual difference is not enough to call something a Bootstrap conflict.

For any suspected cascade issue, identify:

- property;
- winning selector;
- winning stylesheet;
- losing Buckholt selector, if one exists;
- specificity/order/state reason;
- exact tested component/state.

Phrase conclusions narrowly: **"No remaining Bootstrap cascade conflicts were found in the tested component/state set"**, never as a universal permanent claim.

## Compatibility-fix rule

`css/buckholt-ai-fixes.css` is executable correction, not a styling playground.

A new fix requires all of:

1. source-verified intended behaviour;
2. reproducible runtime mismatch;
3. identified technical cause;
4. narrow selector scoped to the defect;
5. regression check against relevant resting/hover/focus/active/disabled states;
6. entry in `discrepancies/known-issues.md`.

Never edit `css/buckholt.css` to make the AI reference look right. It remains the upstream runtime snapshot.

## Test-harness principle

A full-suite test page should compose the exact snippets from `components/*/examples.html` without rewriting their internal DOM. Test/demo wrappers may be added *around* canonical examples only to give them page spacing or a stable viewport.

Demo CSS must not style inside Buckholt components or compensate for visual defects.

## Completion standard

A component can move from `RUNTIME PENDING` to `RUNTIME VERIFIED` only when:

- exact source-verified markup was tested;
- required dependencies were present;
- applicable documented states were exercised;
- known JS behaviour was exercised where applicable;
- any differences were classified and recorded;
- any compatibility fix was regression-tested.

`RUNTIME VERIFIED` means verified for the recorded state set and runtime versions, not guaranteed against all future Bootstrap/Buckholt changes.
