# Responsive layer

> **This layer is not canonical Buckholt.**
>
> It contains **application-level responsive guidance** for situations where the Buckholt
> documentation does not define responsive behaviour. It is **not** a Buckholt component
> specification, and nothing in it may be cited as documented Buckholt behaviour.

## Why this exists

Buckholt documents responsive behaviour for some components and is silent for others. Silence is
not the same as a defect, and it is not permission to invent a specification. Where Buckholt is
silent, a product still has to render something sensible on a phone — so this layer records what a
consuming application should do, clearly separated from what Buckholt actually says.

## What belongs here

Only recommendations for a **consuming application**, each carrying the evidence that Buckholt does
not already cover the case.

## What does not belong here

- Anything Buckholt documents. If Buckholt or its runtime already handles it, record the evidence
  in `component-guidance.md` and stop.
- Media queries added to `css/buckholt.css`. That file is the runtime implementation as shipped and is
  never edited.
- Compatibility corrections. Those go in `css/buckholt-ai-fixes.css`, which is for verified
  mismatches between documented intent and runtime behaviour — not for behaviour Buckholt never
  defined.
- Style-guide presentation. `test/style-guide/` carries its own shell CSS for page layout; it is
  marked as such in that file and is not guidance about Buckholt.

## Evidence order

A recommendation may only be written here after every earlier source has been checked and found
silent:

1. the component's exact Code & specs source;
2. the component's Usage / Style documentation;
3. the current Buckholt runtime (`css/buckholt.css`);
4. Bootstrap behaviour Buckholt already relies on;
5. minimal application-level responsive guidance — this layer.

## Classifications used

| Status | Meaning |
| --- | --- |
| `DOCUMENTED RESPONSIVE` | Buckholt documentation states the responsive behaviour. |
| `RUNTIME RESPONSIVE` | `css/buckholt.css` (or a Buckholt script) implements it, whether or not prose describes it. |
| `APPLICATION GUIDANCE REQUIRED` | Buckholt is silent and a real constraint exists at small widths. |
| `NO ISSUE FOUND` | Tested at 320, 375, 768 and desktop with nothing to report. |

## How the audit was run

`test/style-guide/index.html` was rendered at **320px, 375px, 768px and 1400px** and every component
section measured for: document-level horizontal overflow, elements wider than the viewport, elements
escaping their container, and demo frames scrolling unexpectedly. Overlay and navigation behaviour —
Modal sizing, Dropdown and Menu placement, Tabs overflow, button and link set wrapping — was
exercised directly at each width rather than inferred.

Findings are in `component-guidance.md`.
