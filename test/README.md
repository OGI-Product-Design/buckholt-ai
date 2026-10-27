# Tests

Everything here passes or fails and runs from the command line. Pages you
open and look at are in [`../tools/`](../tools/), not here.

| File | Checks | Assertions |
| --- | --- | --- |
| `source-parity.py` | `components/*/examples.html` against the saved Buckholt Code & specs pages in `code-specs-html/`, **in both directions** — nothing documented dropped, nothing invented. | — |
| `calendar-data.js` | The collection-day rules in `prototypes/shared/data/calendar.js`. Pure Node, no browser. | 42 |
| `calendar-flows.js` | BACS Calendar CA-00 to CA-06: cell states, month navigation, the picker, bank holidays. | 59 |
| `calendar-modal.js` | The collection schedule modal end to end, the toasts and Undo. | 66 |
| `calendar-tokens.js` | The day-cell fills, strokes, padding and badge type against the dev-annotated Figma — and the white content surface the translucent ones need. | 34 |
| `accessibility.js` | Accessible names, `aria-pressed`, non-focusable cells, keyboard operation, focus rings, overflow. | 32 |
| `responsive.js` | Fifteen widths from 1920 to 320. | 47 |
| `regression.js` | Originators and BACS Import still work, and the shared layer has not broken them. | 20 |
| `ch-shell.js` | Configuration Hub shell: every acceptance criterion in `prototypes/CH-SHELL/ch-shell-spec.md`, its accessibility requirements, the feature contract and breadcrumb truncation. | 301 |
| `ch-users.js` | Configuration Hub users: every acceptance criterion in `prototypes/CH-USERS/ch-users-spec.md`, the variants, its accessibility requirements, and that the shell override stays local. | 408 |

**1009 assertions.** `source-parity.py` is the one to run after touching
anything in `components/`; it needs nothing but Python.

## Running the browser suites

They drive a real browser against a served copy of the repository. The
prototypes load Proxima Soft, the Font Awesome Pro kit and the Bootstrap
bundle over the network, which a build container usually cannot reach, so
`build-mirror.py` makes a copy with those three swapped for local
equivalents. **The repository itself is never modified.**

```sh
npm i -D playwright && npx playwright install chromium   # once

python3 test/build-mirror.py                             # writes ../buckholt-mirror
cd ../buckholt-mirror && python3 -m http.server 8098 &
cd -

node test/calendar-data.js
node test/calendar-flows.js
node test/calendar-modal.js
node test/calendar-tokens.js
node test/accessibility.js
node test/responsive.js
node test/regression.js
node test/ch-shell.js
```

Each prints `N pass, M fail` and exits non-zero on a failure.

`config.js` holds everything environment-specific — it is not a suite.
Override it when your setup differs:

```sh
BASE_URL=http://localhost:3000 node test/calendar-flows.js
CHROMIUM=/path/to/chrome       node test/calendar-flows.js
```

`build-mirror.py` vendors Bootstrap and Font Awesome into `test/.vendor/`
once, with `npm pack`. That folder is gitignored.

## What the mirror cannot tell you

Proxima Soft is not available offline, so the mirror falls back to Arial,
and Font Awesome Free does not carry the Pro-only glyphs — `fa-swap-arrows`
does not render. Buckholt sets every line height in rem, so vertical rhythm
and every box measurement are unaffected and can be trusted. **Text widths
and icons cannot.** Do not compare either against a design in the mirror;
open the real page instead.

## Source parity, in more detail

```sh
python3 test/source-parity.py        # -v for a per-component list
```

Exit `0` passes, `1` fails and names every mismatch. It reads the 40 saved
documentation pages in `code-specs-html/`, pulls the canonical markup out of
their `<pre class="wp-block-code">` blocks, and compares structurally —
comments stripped, whitespace normalised — so indentation may be tidied but
hierarchy, classes, element order, attributes and icon placement may not.

Non-HTML documented blocks, such as the Breadcrumb Sass snippet, are
reported separately and are not failures: SCSS is not an implementation
source.
