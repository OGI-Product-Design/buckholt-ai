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

## Steps

The proposed procedure:

1. **Capture the legacy CSS** into `/legacy/[product]`, and add the folder to the locks so no agent can write to it. The product owner approves the capture.
2. **Write the product pack** in `/context`: the styling mode (Legacy or Hybrid), the product's terms, its navigation pattern and its key screens. Laurence or Jon approves it, and {{agent:archive}} copies it to SharePoint.
3. **Connect the legacy Figma library**, so designers can make anchor screens and {{agent:extend}} and {{agent:align}} can use it.
4. **Start the migration map**: each legacy component and its Buckholt equivalent, or "none yet".
5. **Run one feature as a pilot.** Use {{agent:align}}'s styling-mode checks and {{agent:audit}}'s checks against the legacy CSS to find gaps in the pack and the map.
6. **Fix the gaps**, then open the workflow to every feature for that product.
