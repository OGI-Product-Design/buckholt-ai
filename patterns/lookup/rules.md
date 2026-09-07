# Lookup pattern

## Purpose

The Lookup pattern guides a user from entering a known value through to reviewing the information returned by the system. It is for focused retrieval, not open-ended search.

Use it when a user can provide a known identifier such as a postcode, ID or reference number and the system can retrieve reliable related data.

This pattern sits above `components/lookup/`. The component provides the focused input/action UI; this pattern explains the overall usage flow.

## When to use

Use Lookup when:

- the user can provide a known identifier;
- lookup can reduce manual data entry and improve accuracy;
- data can be retrieved from a reliable internal or external source;
- the system can return a small, relevant result set with confidence.

## When not to use

Do not use Lookup when:

- the user is exploring or does not know what they are looking for — use Search instead;
- no reliable data source exists;
- the likely result set is too large or ambiguous to select confidently;
- the lookup would not meaningfully reduce manual entry.

## Anatomy

The documented pattern includes:

- **Label** — explains what known information the user should enter and sets expectations.
- **Input field** — captures the lookup value; typically Text input, but grouped/formatted inputs may be used when needed.
- **Lookup actions** — trigger the lookup and may provide a genuine alternative path such as manual entry.

Reuse the canonical `components/lookup/` markup and the relevant nested input/Button/Link components.

## Lookup phases

### Phase 1 — Data input

The user enters a known value such as a postcode, reference number or identifier and initiates the lookup.

Keep this phase focused. Do not ask for information that the lookup itself is expected to retrieve.

### Result/refinement phase

Use the returned data to move the user toward a confident result. Where the system cannot confidently identify the intended result, allow the user to refine, choose or take an appropriate alternative route rather than silently assuming.

### Summary phase

Present the retrieved information clearly so the user can review and confirm it before continuing.

The summary should:

- prioritise readability and scanability;
- surface the key returned details;
- allow edit/retry where appropriate if the information is incorrect;
- keep the user in control of the flow.

When the documented lookup summary is shown, it **replaces the data-entry Lookup component** rather than appearing as a duplicate lookup underneath it.

Use the documented summary composition from the Lookup component guidance, including Versa-tile where applicable.

## Actions and alternatives

The main lookup action should use the documented Button hierarchy. Alternative/manual routes should use Link only when they genuinely navigate or move the user to another route.

Do not present Search as an equivalent alternative if the task is specifically a known-value lookup unless the product requirement actually needs an exploratory fallback.

## Agent rules

- Distinguish Lookup from Search: Lookup starts from a known value.
- Use `components/lookup/` for the actual input/action component.
- Structure the journey as input → result/refinement → confirmation/summary as supported by the product flow.
- Keep returned result sets small and meaningful; do not invent large result-browser behaviour.
- Replace the entry Lookup with the documented summary when moving to summary phase.
- Provide retry/edit routes when appropriate rather than hiding incorrect returned data.
- Reuse Buckholt input, Button, Link and Versa-tile guidance rather than creating local lookup UI.
- Do not invent data or matching confidence rules that the product has not defined.