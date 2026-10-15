# Tools

Pages you open in a browser and look at. Nothing here passes or fails —
the things that do are in [`../test/`](../test/).

| Folder | What it is |
| --- | --- |
| `style-guide/` | A visual catalogue of every documented Buckholt component, rendered against the real `css/buckholt.css`. Open it to see what the system actually looks like. |
| `runtime-verification/` | A harness that renders the source-verified markup against the runtime, so rendering can be checked by eye and a status recorded. |

Open either `index.html` directly; both are no-build.

## The two questions, kept apart

`runtime-verification/` answers **"does the canonical markup render and
behave correctly?"** It does *not* answer whether the markup is faithful to
Buckholt — that is source verification, it is automated in
[`../test/source-parity.py`](../test/source-parity.py), and its status lives
in `verification/component-source-status.md`.

Keeping the two apart matters: **a runtime defect must never be "fixed" by
rewriting source-verified canonical markup.** The harness has its own
detailed notes in
[`runtime-verification/README.md`](runtime-verification/README.md) — how its
three layers work, what each status means, and why the summary is measured
rather than asserted. Read
`verification/runtime-verification-framework.md` before using it to change
any status.

Neither page is published — `.assetsignore` keeps `tools/` off the
deployment, which serves only the prototypes.
