---
title: Onboard a legacy product
lead: Bring a product that is not on Buckholt into the workflow without changing how it looks.
---

## What a legacy product needs

- **Captured legacy CSS** in `/legacy/[product]`. It is locked like Buckholt: no agent writes to it, and changing it needs the owner's approval.
- **A product pack** that records the product's styling mode: Legacy or Hybrid.
- **Its legacy Figma library**, connected so designers can make anchor screens and {{agent:extend}} and {{agent:align}} can use it.
- **A migration map** in `/context`, which {{agent:archive}} keeps and {{agent:build}} and {{agent:align}} read.

## How the agents treat it

- {{agent:brief}} stops if a product pack is missing.
- {{agent:build}} uses the legacy CSS in Legacy mode. In Hybrid mode it follows the pack and labels every Buckholt element.
- {{agent:align}} flags styling-mode mismatches, such as Buckholt parts in a legacy screen.
- {{agent:audit}} checks markup against the legacy CSS instead of the Buckholt reference.

> To come: The step-by-step onboarding procedure will be added from the source doc.
