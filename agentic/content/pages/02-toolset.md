---
title: Toolset
slug: toolset/
lead: Discovery happens in Microsoft 365. Exploring, designing and prototyping happen in Cursor. Archive keeps the two in step.
---

## Two platforms and a bridge

{{diagram:toolset}}

## Microsoft 365 side

- **Copilot** runs {{agent:brief}}, {{agent:insight}} and {{agent:map}}.
- **SharePoint** holds the discovery master copy and a copy of each product pack.
- **Teams** holds recordings and transcripts.
- **Azure DevOps** holds the design board, the stage status and the links between work items.
- **Lucid** holds journey and process maps. It is also reached from Cursor.

## Cursor side

- **Cursor** runs the other nine agents.
- **Figma MCP**: {{agent:extend}} writes; {{agent:align}}, {{agent:build}} and {{agent:relay}} only read.
- **LogRocket MCP** is used by the {{agent:insight}} Cursor step, {{agent:observe}} and {{agent:relay}}.
- **The Buckholt prototyping repo** holds Buckholt core, extensions, the sandbox and the context {{agent:archive}} maintains.
- **Playwright and axe** run the automated checks for {{agent:audit}}.
- **Lucid MCP** is used by {{agent:range}} for rough flows.

## The bridge

{{agent:archive}} keeps the two sides in step. It copies product packs into SharePoint after a change is merged, and pulls approved discovery into the repo as `/context/discovery/[feature].md`.

## Access needed

Foundations come first, then connectors and access, then the agents.

{{diagram:dependencies}}

| Access | Who needs it |
|---|---|
| Figma MCP, write | {{agent:extend}}. Needs a Full seat. |
| Figma read and Code Connect | {{agent:align}}, {{agent:build}}, {{agent:relay}} |
| Legacy Figma libraries | Anchor screens, {{agent:extend}}, {{agent:align}} |
| LogRocket MCP | {{agent:insight}}, {{agent:observe}}, {{agent:relay}} |
| Lucid MCP | {{agent:map}}, {{agent:range}} |
| Azure DevOps connector | {{agent:brief}}, to read features |

{{agent:archive}} tracks daily Figma MCP calls and warns the team at 80% of the limit.

The [set-up guides](/setup-guides/) take you through each one in order.
