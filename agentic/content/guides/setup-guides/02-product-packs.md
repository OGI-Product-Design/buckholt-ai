---
title: Product packs
lead: Every agent reads the product pack, so each product needs one before any feature for it can start.
---

## Who does it

A designer who knows the product, with Laurence or Jon approving.

## What you need

- The product's styling mode: Buckholt, Hybrid or Legacy
- Its navigation pattern, key screens and terms
- The repo set up, with `/context` in place

## Steps

1. Create the pack in `/context`, one file per product, from the outline below.
2. Record the styling mode. {{agent:build}} follows it and {{agent:align}} checks against it.
3. List the product's terms, so {{agent:align}} can check wording.
4. Open a pull request. Laurence or Jon approves it.
5. Once it is merged, {{agent:archive}} copies the pack to SharePoint.

```markdown "Product pack outline"
# Product pack: [product]

Styling mode: [Buckholt, Hybrid or Legacy]
Owner: [name]   Last reviewed: [date]

## Users
## Navigation pattern
## Key screens
## Terms
| Use | Not |
|---|---|

## Figma library
## Legacy CSS (Legacy and Hybrid only)
```

## Done when

Each product in scope has an approved pack in `/context` and a matching copy in SharePoint.

## Used by

All agents. {{agent:brief}} stops if a pack is missing.
