---
title: Azure DevOps
slug: azure-devops/
lead: Design has its own board in Azure DevOps. Each design item links into the product feature above it and the engineering stories after it.
---

## How the work items link

{{diagram:azure-devops}}

## The design board

The UX design board belongs to the UX team. Its stage statuses trigger the agents, so the board is how the workflow runs, not just a record of it.

## One board for the whole team

All six designers share one UX design board. One board means one view of everything in design, one Delivery Plan, and one place the agents watch for status changes. Separate boards would split all three.

The proposal for making one board work for six people:

| Setting | How it is used |
|---|---|
| Assigned to | The lead designer for the design item. Filter the board by person to see one designer's work. |
| Reviewing designer | A field on the design item naming the second designer. |
| Area path | One per product, so the board can be filtered by product, and product teams see their own design items. |
| Swimlanes | By route: Full route, Fast track and Blocked (below). |
| Work in progress limits | On Designing and on Prototyping and testing, so no one carries too many items at once. |

At stand-up, walk the board right to left: items closest to Handed over first.

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

## Swimlanes

The proposed swimlanes on the design board:

| Swimlane | What goes in it |
|---|---|
| Full route | Features that go through Explore and both gates. |
| Fast track | Features {{agent:brief}} has fast-tracked: from Discover straight to Design. |
| Blocked | Items waiting on something outside UX, such as missing feature fields, a missing product pack or access. The item keeps its status; the swimlane shows why it is not moving. |

## Delivery Plans

One Delivery Plan shows the three boards together by sprint:

- product features, from the product board
- design items, from the UX design board
- engineering stories, from the engineering boards

Each design item's target date is the end of the sprint before its engineering stories start. That makes the one-sprint offset visible, and shows straight away when design is at risk of holding up engineering.
