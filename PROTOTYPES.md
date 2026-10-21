# Live prototypes

Click and go. No build, no checkout.

## BACS — GitHub Pages

Three tabs of one application; they link to each other, so you can start
anywhere.

| Prototype | Link |
| --- | --- |
| **Originators** | https://ogi-product-design.github.io/buckholt-ai/prototypes/Originators/ |
| **BACS Import** | https://ogi-product-design.github.io/buckholt-ai/prototypes/BACS-import/ |
| **BACS Calendar** | https://ogi-product-design.github.io/buckholt-ai/prototypes/BACS-calendar/ |

Process is still a placeholder inside BACS Import.

## Configuration Hub — GitHub Pages

| Prototype | Link |
| --- | --- |
| **CH shell** | https://ogi-product-design.github.io/buckholt-ai/prototypes/CH-SHELL/ |

Seed variants: add `?seed=long-names`, `all-apps`, `test-only`,
`staged-rollout` or `live-only`.

## Mobius navigation — Cloudflare

| Prototype | Link |
| --- | --- |
| **Mobius navigation** | the `mobius-nav` Worker, at `/prototypes/Mobius-navigation/` |

This one is deployed separately, from `wrangler.jsonc`. Its old URL,
`/Mobius-navigation/`, still works: `_redirects` sends it on with a 301.

## Reference pages

| Page | Link |
| --- | --- |
| **Buckholt style guide** — every documented component, rendered against the real runtime | https://ogi-product-design.github.io/buckholt-ai/tools/style-guide/ |
| **Runtime verification harness** — what renders correctly and what needs attention | https://ogi-product-design.github.io/buckholt-ai/tools/runtime-verification/ |

## If an old link 404s

The prototypes moved into `prototypes/` on 15 October 2026, so the three
BACS URLs changed. GitHub Pages has no redirect mechanism, so `404.html` at
the repository root forwards the old paths to the new ones. Nothing to do —
old links land in the right place.

## Running them locally instead

Open any `prototypes/*/index.html` straight from a checkout. Everything is
relative and nothing is compiled.
