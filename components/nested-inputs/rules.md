# Nested inputs

## Verification

Source-audited against the Buckholt Nested inputs Usage, Style and Code & specs HTML pages supplied on 7 September 2026. Use `examples.html` for exact DOM structure.

## Purpose

Nested inputs reveal follow-up fields only when a parent response makes them relevant. Use them for progressive disclosure so forms remain easier to scan and irrelevant questions stay hidden.

Buckholt advises keeping nesting shallow; generally use one level rather than long chains of dependent questions.

## Canonical markup

The Code & specs source is intentionally minimal:

```text
.input
.nested-inputs
└─ .input
```

`examples.html` preserves the exact source, including deliberate `...` placeholders. Do not replace those placeholders with a reconstructed Form, trigger class, child control or conditional-JavaScript example and then call it canonical Buckholt markup.

The nested group appears directly after the parent input that controls its relevance.

## Behaviour

The supplied component documentation establishes the structural relationship but does not provide a separate Buckholt JavaScript API for conditional show/hide logic. Product code may supply that behaviour while preserving the canonical structure and the child components' own semantics.

## Child inputs

Each nested field remains a complete Buckholt input component and owns its own labels, validation and state behaviour.

## Agent rules

- Place `.nested-inputs` immediately after the parent input it belongs to.
- Preserve the exact minimal Code & specs structure in canonical examples.
- Do not promote documentation/demo helpers such as `.trigger-question` into the component API unless exact source evidence establishes them.
- Reuse complete Buckholt input components inside the nested wrapper.
- Do not invent a new Buckholt JavaScript API for conditional logic.
