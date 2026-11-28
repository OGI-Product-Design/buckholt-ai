---
title: Create agents in Cursor
lead: Nine of the twelve agents run in Cursor. Each one is a rules file that points Cursor's Agent at that agent's definition.
---

## Who does it

Laurence writes and approves the agent definitions. Each of the six designers sets up Cursor on their own machine; because the rules live in the repo, everyone runs the same agents.

## What you need

- Cursor installed, signed in to the OGI team account
- The repo set up, with `/agents` and `/.cursor/rules` in place ([guide 1](/setup-guides/repo-and-locks/))
- The connectors the agent uses (guides 5 to 9)

## How it fits together

- **The agent definition** lives in `/agents/[agent].md`. It is the source of truth: job, triggers, what it reads, steps, never, done when. Each agent page on this site shows it.
- **A project rule** in `/.cursor/rules/[agent].mdc` tells Cursor's Agent when to use that definition. Project rules are `.mdc` files, kept in git with the code.
- **A shared rule** in `/.cursor/rules` applies to every agent, every time: the locks, Buckholt first, and the extension rules.
- **MCP servers** in `/.cursor/mcp.json` give the agents their tools: Figma, LogRocket, Lucid and Azure DevOps.

The nine Cursor agents are {{agent:archive}}, {{agent:range}}, {{agent:critic}}, {{agent:extend}}, {{agent:align}}, {{agent:build}}, {{agent:audit}}, {{agent:observe}} and {{agent:relay}}. {{agent:insight}} also has a Cursor step for LogRocket.

## Steps

1. **Write the agent definition** in `/agents/[agent].md` from the [agent definition template](/artifacts-and-templates/), and open a pull request. Laurence approves it.
2. **Add the shared rule** once, in `/.cursor/rules/workflow.mdc`, set to always apply.
3. **Add a project rule for the agent** in `/.cursor/rules/[agent].mdc`. Give it a clear description, so Agent knows when it is relevant, and point it at the definition file. You can type `/create-rule` in Agent and describe the rule to have Cursor draft it.
4. **Scope it** where that helps. {{agent:range}}'s rule, for example, applies to files in `/sandbox`.
5. **Add the MCP servers** the agent needs to `/.cursor/mcp.json`, using each provider's own set-up instructions.
6. **Try it** on a test design item: open Agent, name the agent and the design item, and check it follows its steps and stops at its human gate.
7. **Change it only by pull request**, so every change to an agent is reviewed and recorded.

```markdown "Shared rule: /.cursor/rules/workflow.mdc"
---
description: Rules every UX agent follows
alwaysApply: true
---

- Never edit /buckholt or /legacy.
- Check Buckholt core and its documentation before making anything new.
- Anything Buckholt does not have goes in /extensions/[product]/:
  Buckholt tokens only, class prefix x-, data-buckholt="false",
  and an entry in the extensions register.
- Stop at your human gate. Post what you produced on the design item.
```

```markdown "Agent rule: /.cursor/rules/range.mdc"
---
description: Range agent. Use when a full-route design item reaches Discovery approved and needs rough directions explored.
globs: sandbox/**
alwaysApply: false
---

You are the Range agent. Follow @agents/range.md exactly.
Work only in /sandbox/[product]/[feature]/ and use greybox.css only.
```

```json "MCP servers: /.cursor/mcp.json"
{
  "mcpServers": {
    "figma": { "url": "[server address from Figma's set-up instructions]" },
    "logrocket": { "url": "[server address from LogRocket's set-up instructions]" },
    "lucid": { "url": "[server address from Lucid's set-up instructions]" },
    "azure-devops": { "command": "[command from the Azure DevOps MCP set-up instructions]" }
  }
}
```

## Done when

Each Cursor agent has a definition in `/agents`, a project rule in `/.cursor/rules`, and has run once on a test design item, stopping at its human gate.

## Docs (external sites)

- [Rules, Cursor Docs](https://cursor.com/docs/rules)
- [Model Context Protocol (MCP), Cursor Docs](https://cursor.com/docs/mcp)

## Learn (external sites)

- [Customizing agents, Cursor Learn](https://cursor.com/learn/customizing-agents)
