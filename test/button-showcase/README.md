# Button showcase validation

This is the first controlled implementation test for the Buckholt AI specification.

## Test objective

Confirm that an AI coding agent can implement Buckholt buttons accurately by using the real Buckholt classes and shared specification rather than recreating the design system.

## Claude test instruction

Open this repository in Claude Code and ask:

> Review `CLAUDE.md`, `design.md`, `components/button.md` and `tokens.json`. Then review `test/button-showcase/index.html`. Use the real `css/buckholt.css` implementation. Do not recreate Buckholt button styling or add visual override CSS. Check that the showcase correctly demonstrates primary, secondary and ghost buttons at small, default and large sizes, disabled states and a stacked button set. Identify any mismatch between the implementation, the Buckholt specification and the available runtime dependencies. If Proxima Soft or Font Awesome is missing, report that separately rather than substituting another design asset.

## First-pass rule

Do not add custom CSS to make the page look closer to Figma. First determine whether a mismatch comes from:

1. missing `css/buckholt.css`;
2. missing Proxima Soft;
3. missing Font Awesome;
4. incorrect Buckholt class usage;
5. an error/gap in the shared AI specification.

The shared specification should be corrected when necessary instead of teaching one agent a one-off workaround.
