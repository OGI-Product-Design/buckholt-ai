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

## If a link 404s

The prototypes moved into `prototypes/` on 15 October 2026. The three BACS
URLs above changed with them, and GitHub Pages has no redirect mechanism, so
a stub page sits at each old path and forwards you. Those stubs are the only
reason `Originators/`, `BACS-import/` and `BACS-calendar/` still exist at the
repository root — they hold nothing else and can go once nothing points at
them.

## Running them locally instead

Open any `prototypes/*/index.html` straight from a checkout. Everything is
relative and nothing is compiled.
