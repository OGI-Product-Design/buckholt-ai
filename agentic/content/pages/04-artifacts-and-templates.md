---
title: Artifacts and templates
slug: artifacts-and-templates/
lead: Seven artifacts carry the work between agents. Each has one writer, one home, and named readers.
---

## The seven artifacts

{{diagram:artifact-flow}}

| Artifact | Written by | Where it lives | Read by |
|---|---|---|---|
| Product pack | {{agent:archive}}, with Laurence's approval | Repo `/context`, copy in SharePoint | All agents |
| UX brief | {{agent:brief}} | SharePoint, linked on the design item | {{agent:insight}}, {{agent:map}}, the PM |
| Discovery summary | {{agent:insight}} and {{agent:map}} | SharePoint, summary copy in the repo | {{agent:range}}, {{agent:critic}}, {{agent:build}}, {{agent:observe}} |
| Decision log | {{agent:archive}}, from gate outcomes | Repo `/context` | All agents, Jim, PMs |
| Extensions register | {{agent:extend}} and {{agent:build}} | Repo `/context` | {{agent:align}}, {{agent:audit}}, {{agent:relay}} |
| Migration map | {{agent:archive}} | Repo `/context` | {{agent:build}}, {{agent:align}} |
| Agent definition | Laurence | Repo `/agents` | The agent itself |

## Where each one comes from

- **Product pack**: one per product, including its styling mode. A change is merged in the repo, then {{agent:archive}} updates the SharePoint copy. Laurence or Jon approves every change.
- **UX brief**: {{agent:brief}} writes it from the template once the feature has everything it needs, and links it on the design item.
- **Discovery summary**: {{agent:insight}} lists every source, anonymises personal details and groups findings into themes with evidence. On Discovery approved, {{agent:archive}} writes the repo copy to `/context/discovery/[feature].md`.
- **Decision log**: after each gate, {{agent:archive}} adds the decision to `decision-log.md` from the gate notes.
- **Extensions register**: one entry per extension, with a Figma half and a code half.
- **Agent definition**: one file per agent in `/agents`, changed by pull request.

## Templates

The agents work from shared templates. These are named in the agents' rules:

- **UX brief template**, used by {{agent:brief}}
- **Extensions register template**, used by {{agent:extend}} and {{agent:build}}
- **Prototype build spec**, read by {{agent:build}}
- **Greybox stylesheet** (`greybox.css`), the only styling {{agent:range}} may use

> To come: The template contents, each with a copy button, will be added from the source doc.
