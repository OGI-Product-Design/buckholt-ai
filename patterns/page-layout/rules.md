# Page layout pattern

## Purpose

Page layout is the top-level composition guidance for building Buckholt product pages. Read this pattern **before assembling a page from components**.

Buckholt layouts are flexible, grid-based page structures. They combine a base page layout with nested layout containers so pages remain consistent, readable and adaptable as requirements change.

## Base page layouts

Buckholt documents eight base layouts. They vary the relationship between:

- Header — optional
- Sidebar / aside — optional, left or right depending on the layout
- Main — **required in every layout**
- Footer — optional

The base layouts are implemented with CSS Grid so areas can be repositioned through layout configuration rather than by rebuilding the content markup.

Do not assume every page needs a header, sidebar or footer. Use optional regions only when they support the user task.

## Start with page structure, then components

When creating a new Buckholt page, decide the structural hierarchy first. Do not begin by placing individual components onto an unstructured canvas.

Canonical structure map:

```text
Page
└─ Layout (CSS Grid)
   ├─ Header (optional)
   ├─ Sidebar (optional)
   ├─ Main (required)
   │  └─ Page body
   │     └─ Frame (one or more)
   │        ├─ Frame header (optional, once per frame)
   │        └─ Pane (one or more)
   │           └─ Panel (one or more)
   │              └─ Components & patterns
   └─ Footer (optional)
```

## Main-content hierarchy

Buckholt uses three nested layout containers inside the main content area: Panel → Pane → Frame.

### Panel — `.page-panel`

Panels are the smallest Buckholt layout container. Use them to group components and patterns that are directly related, such as a form and its supporting content.

- Contains: components and patterns
- Padding: none
- Gap between items: **2rem / 32px**

A panel answers: **which things belong together?**

### Pane — `.page-pane`

Panes group related panels into a meaningful section. They typically occupy most of the content area and can be paired with section headings or Bootstrap column layouts.

- Contains: panels
- Padding: none
- Gap between panels: **4rem / 64px**

A pane answers: **which groups belong in the same section?**

### Frame — `.page-frame`

Frames are the largest layout container inside Main. They wrap one or more panes, provide consistent outer spacing, and can visually separate major parts of a page through background/styling already provided by Buckholt.

- Contains: panes
- Padding: **4rem / 64px**
- Gap between panes: **4rem / 64px**

A frame may include one optional page-frame header used to introduce or label the content of that frame.

A frame answers: **which major sections belong in this region of the page?**

### Page body — `.page-body`

The Page body is the top-level wrapper for structured content inside Main. All page Frames sit inside it. It establishes the overall content area and keeps frames aligned consistently.

## Nested layout model

Use the hierarchy consistently:

```text
Frame
└─ Pane
   └─ Panel
      └─ Component / pattern
```

Do not skip directly to custom wrappers merely to create spacing. Prefer these documented layout containers so hierarchy and spacing remain predictable.

More than one pane or panel may exist at the same level when the information architecture requires it.

## Bootstrap grid and Buckholt layout

Buckholt is built on Bootstrap and continues to use Bootstrap's grid for foundational horizontal structure and responsive behaviour.

Use:

- `.container` for overall width and horizontal page alignment;
- `.row` for horizontal layout sections and gutters;
- `.col-*` for responsive columns and proportions.

Bootstrap and Buckholt have different responsibilities:

```text
Bootstrap grid
→ horizontal structure, width, columns, responsive breakpoints

Buckholt Frame / Pane / Panel
→ hierarchy, grouping, vertical rhythm and visual separation
```

They are intended to work together. Do not replace Buckholt's Frame/Pane/Panel hierarchy with arbitrary Bootstrap spacing utilities, and do not replace Bootstrap's grid with custom one-off layout CSS when its documented grid solves the structure.

## Semantic page HTML

Use semantic regions where the page content maps to them:

```html
<header>...</header>
<aside>...</aside>
<main>...</main>
<footer>...</footer>
```

Main is required. The other regions are conditional on the selected page layout and product need.

The page-layout diagrams document both left- and right-sidebar arrangements and variants where Header/Footer span different grid areas. Treat these as layout choices, not different information architectures; do not duplicate page content merely to switch layout.

## Page-building procedure for agents

Before generating a page:

1. Identify the user task and required page regions.
2. Select the closest documented base page layout.
3. Create semantic Header / Sidebar / Main / Footer regions only where needed.
4. Inside Main, create `.page-body`.
5. Divide major content regions into `.page-frame` containers.
6. Divide each frame into `.page-pane` sections.
7. Group closely related content inside `.page-panel` containers.
8. Use Bootstrap `.container`, `.row` and `.col-*` where horizontal/responsive structure is required.
9. Only then compose documented Buckholt components and other patterns inside Panels.
10. Use Buckholt spacing/components rather than adding local CSS to approximate the diagrams.

## Agent rules

- Read this pattern before creating a complete page or substantial page section.
- Main is the only required base-layout region.
- Preserve the Frame → Pane → Panel → Components hierarchy when structured page content needs those levels.
- Use the documented 32px panel item gap and 64px pane/frame rhythm; do not invent competing page-spacing values.
- Use Bootstrap grid for columns/responsiveness and Buckholt containers for hierarchy/spacing.
- Select layout according to content/task; do not force every optional region into every screen.
- Prefer semantic HTML for Header, Aside, Main and Footer.
- Do not create new layout primitives when Page body, Frame, Pane, Panel and Bootstrap grid cover the requirement.
- Components retain their own internal spacing and state rules when placed inside a Panel.
- Pattern documentation guides composition; it does not override component rules or foundations.