---
title: Set-up guides
slug: setup-guides/
lead: Set up the foundations first, then connectors and access, then the agents. Each guide builds on the one before.
---

## The order

{{diagram:dependencies}}

1. **Foundations**: the repo and its locks, product packs, the design board and the SharePoint site.
2. **Connectors and access**: Figma MCP (write for {{agent:extend}}, read and Code Connect for the others), LogRocket MCP, Lucid MCP, the Azure DevOps connector and the legacy Figma libraries.
3. **Agents**: create the nine Cursor agents and the three Microsoft 365 Copilot agents (guides 10 and 11).

## The guides

{{block:setup-guide-list}}

## Adding a guide

Each guide is a Markdown file in `agentic/content/guides/setup-guides/`, named with its position, for example `03-figma-mcp.md`. The site numbers them, shows progress and links each one to the next.

```markdown "Guide file template"
---
title: Connect Figma MCP
lead: One sentence on why this matters.
---

## Steps

1. First step.
2. Second step.

## Docs

- [Link text](https://example.com/docs)

## Watch

- [Video title](https://example.com/video)
```
