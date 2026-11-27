---
title: Azure DevOps
slug: azure-devops/
lead: Design has its own board in Azure DevOps. Each design item links into the product feature above it and the engineering stories after it.
---

## How the work items link

{{diagram:azure-devops}}

## The design board

The UX design board belongs to the UX team. Its stage statuses trigger the agents, so the board is how the workflow runs, not just a record of it.

## The design item

There is one design item per feature. UX owns it and its columns.

- Its parent is the product feature.
- It is the predecessor of the engineering stories.
- It links to the SharePoint UX brief, the Figma file and the prototype.
- Agents post their outputs on it: the {{agent:range}} index, the {{agent:critic}} review, {{agent:align}} and {{agent:audit}} reports, and the prototype preview.

## Fields

Before design starts, {{agent:brief}} checks the feature has these fields complete. If any are missing, it comments the gaps on the feature and stops.

- Problem
- Outcome
- Products
- Users
- Priority
- Quarter
- Constraints

The feature also carries a **Design status** field. The design item's status rolls up to it, and {{agent:relay}} sets it to Handed over.

## Columns

The design item moves through the stage statuses:

{{block:statuses}}

See the [workflow](/workflow/) for what each status starts.

## Links to product and engineering

- The portfolio epic is the parent of the feature. Both belong to product.
- The feature is planned per quarter and triggers design when it is set to Ready for design.
- Engineering stories are ready only when design is Handed over. {{agent:relay}} adds a linked UX section to each story, with UX acceptance criteria, Figma and prototype links, and sets the predecessor link.

{{agent:relay}} never changes engineering statuses or the PM's story text.

## Swimlanes and Delivery Plans

> To come: How the design board uses swimlanes, and how design items appear in Delivery Plans, will be added from the source doc.
