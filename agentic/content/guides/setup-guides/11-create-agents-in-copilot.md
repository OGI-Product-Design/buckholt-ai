---
title: Create agents in Microsoft 365 Copilot
lead: Brief, Insight and Map run in Microsoft 365 Copilot, close to the SharePoint, Teams and Azure DevOps content they read.
---

## Who does it

Laurence creates the three agents and shares them with the UX team.

## What you need

- A Microsoft 365 Copilot licence. Agent Builder is part of Microsoft 365 Copilot; if you cannot see it, check your licence.
- The SharePoint site set up ([guide 4](/setup-guides/sharepoint-site/))
- Azure DevOps connected to Copilot ([guide 9](/setup-guides/azure-devops-connectors/))
- The agent definitions in `/agents`: `brief.md`, `insight.md` and `map.md`

## Two ways to build

- **Agent Builder**, inside the Microsoft 365 Copilot app. No code: describe the agent in plain language, or configure it by hand. This is the place to start.
- **Copilot Studio**, for more control: tools, triggers and connections to other systems. Use it if an agent should start by itself when a status changes, rather than when a designer asks.

The proposal is to build {{agent:brief}}, {{agent:insight}} and {{agent:map}} in Agent Builder first, and move them to Copilot Studio only if they need triggers.

## Steps

1. **Open the Microsoft 365 Copilot app** and choose **Create agent** (it may show as **New agent** under Agents).
2. **Choose to configure it yourself** rather than describe it, so the agent matches its definition exactly.
3. **Name and describe it**: for example "Brief" and "Turns a product feature into a UX problem and chooses the route."
4. **Paste the instructions** from the agent's definition in `/agents`: its job, steps, never and done when. Use the outline below.
5. **Add knowledge**: the SharePoint libraries it reads (UX briefs, Discovery, Product packs) and the Azure DevOps connection for {{agent:brief}}.
6. **Add starter prompts**, such as "Write the UX brief for feature [number]".
7. **Test it** in the preview on a test feature, and check it stops where its human gate says.
8. **Create it and share it** with the UX team: Laurence, Jon, Marijana, Katerina, Andrej and Mark.
9. **Repeat** for {{agent:insight}} and {{agent:map}}. The LogRocket step of {{agent:insight}} runs in Cursor ([guide 10](/setup-guides/create-agents-in-cursor/)).

```markdown "Instructions outline for a Copilot agent"
You are the [agent name] agent in the OGI UX agentic design workflow.

Job: [one sentence from /agents/[agent].md]

When you are asked to start: [triggered by]

Read: [sources]

Steps:
1. [step]
2. [step]

Never:
- [never]

You are done when: [done when]
Then stop. [Human gate] decides what happens next.
```

## Done when

{{agent:brief}}, {{agent:insight}} and {{agent:map}} exist in Microsoft 365 Copilot, are shared with the UX team, and have each run once on a test feature.

## Docs (external sites)

- [Build agents with Agent Builder in Microsoft 365 Copilot, Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-build-agents)
- [Build your own agent with Microsoft 365 Copilot, Microsoft Support](https://support.microsoft.com/en-us/microsoft-365-copilot/build-your-own-agent-with-microsoft-365-copilot)
- [Create and deploy an agent in Copilot Studio, Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started)

## Watch (external sites)

- [Create your first agent in Copilot Studio, Mastering Copilot Studio on Microsoft Learn](https://learn.microsoft.com/en-us/shows/mastering-copilot-studio/create-first-agent-copilot-studio)
- [Agent demo videos, Microsoft Adoption](https://adoption.microsoft.com/agents/success-kit/)
