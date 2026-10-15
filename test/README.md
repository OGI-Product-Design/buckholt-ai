# Tests

Four suites. Two check Buckholt itself, two check the prototypes built with
it.

| Folder | What it checks | How to run |
| --- | --- | --- |
| `source-parity/` | `components/*/examples.html` against the saved Buckholt Code & specs pages in `code-specs-html/`, **in both directions** — nothing documented has been dropped, nothing has been invented. | `python3 test/source-parity/check-source-parity.py` |
| `runtime-verification/` | A page that renders each component against `css/buckholt.css` so runtime behaviour can be checked by eye. | open `test/runtime-verification/index.html` |
| `style-guide/` | A visual catalogue of every documented component. | open `test/style-guide/index.html` |
| `prototypes/` | The Mobius PAS prototypes: flows, accessibility, responsive behaviour, and that each feature has not broken the others. 266 assertions. | see below |

`source-parity` is the one to run after touching any file in `components/`.
It needs nothing but Python.

## The prototype suites

These drive a real browser, so they need Playwright and a served copy of the
repository. The prototypes load Proxima Soft, the Font Awesome Pro kit and
the Bootstrap bundle over the network, which a build container usually
cannot reach, so `build-mirror.py` makes a copy with those three swapped for
local equivalents. **The repository itself is never modified.**

```sh
npm i -D playwright && npx playwright install chromium   # once

python3 test/prototypes/build-mirror.py                  # writes ../buckholt-mirror
cd ../buckholt-mirror && python3 -m http.server 8098 &
cd -

node test/prototypes/check-data.js     # 42   collection-day rules, in Node, no browser
node test/prototypes/flows.js          # 59   BACS Calendar CA-00 to CA-06
node test/prototypes/modal.js          # 66   the collection schedule modal end to end
node test/prototypes/a11y.js           # 32   names, keyboard, focus, overflow
node test/prototypes/resp.js           # 47   fifteen widths from 1920 to 320
node test/prototypes/regress.js        # 20   Originators and Import still work
```

Each prints `N pass, M fail` and exits non-zero on a failure.

`config.js` holds everything environment-specific. Override it if your setup
differs:

```sh
BASE_URL=http://localhost:3000 node test/prototypes/flows.js
CHROMIUM=/path/to/chrome       node test/prototypes/flows.js
```

### What the mirror cannot tell you

Proxima Soft is not available offline, so the mirror falls back to Arial, and
Font Awesome Free does not carry the Pro-only glyphs — `fa-swap-arrows` in
particular does not render. Buckholt sets every line height in rem, so
vertical rhythm and every box measurement are unaffected and can be trusted.
**Text widths and icons cannot.** Do not compare either against a design in
the mirror; open the real page instead.
