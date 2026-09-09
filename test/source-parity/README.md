# Source parity check

Answers one question:

> Does `components/*/examples.html` still match the Buckholt Code & specs HTML it was transcribed from?

```
python3 test/source-parity/check-source-parity.py      # add -v for a per-component list
```

Exit code `0` passes, `1` fails and names every mismatch.

## Why both directions matter

| Direction | What it catches |
| --- | --- |
| **Forward** — every documented block is in `examples.html` | A documented example dropped, truncated, or altered. |
| **Reverse** — every `examples.html` block is in the documented source | Markup **invented, inferred, or borrowed from another component**. |

The reverse direction is the important one. It is what stops a plausible-looking example that
Buckholt never documented from becoming canonical, and it is why `CANONICAL-MARKUP.md`'s rules are
now enforceable rather than aspirational.

## What it compares

Evidence is `code-specs-html/*.html` — the saved Buckholt documentation pages, committed to this
repository. Each embeds its canonical examples as escaped HTML inside
`<pre class="wp-block-code"><code>…</code></pre>`.

Comparison is **structural**: comments are stripped and whitespace between and inside tags is
normalised. So indentation may be cleaned for readability, but hierarchy, classes, element order,
attributes and icon placement must match exactly. Deliberate `…` elisions are preserved and
compared like any other content.

## What it deliberately does not fail on

- **Non-HTML documented blocks.** Reported and skipped: the Breadcrumb Sass snippet, a Progress CSS
  comment, the Tooltip initialisation JavaScript. SCSS is not an implementation source.
- **Table.** No Code & specs page was supplied, which is why it alone is `SOURCE PARTIAL`. It has no
  entry in the checker's page-to-component map.
- **Repeated ids across examples.** Each `examples.html` holds several separately transcribed
  examples, so a repeated id reflects the source and must not be normalised away.

## When it fails

Fix the repository, not the check, and never the source. If a documented example genuinely cannot be
reproduced, record the gap in `discrepancies/known-issues.md` rather than editing `code-specs-html/`
or inventing markup to close it.

Three gaps found in the documented source itself are already recorded there: the Modal trigger
targeting an id no documented modal carries, `label[for]` group labels with no matching control, and
Tabs carrying documentation-site wrapper classes inside its own documented block. All three are
faithful transcriptions of an upstream problem.
