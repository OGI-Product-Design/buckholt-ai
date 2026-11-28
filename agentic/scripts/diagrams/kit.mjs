// Shared drawing kit for the diagrams (extension x-diagram).
//
// Colours are never written here: every shape gets a class, and
// css/extensions.css colours the class with Buckholt tokens. Tones:
//   neutral, primary, secondary, tertiary, quaternary  (expressive families)
//   locked                                              (feedback error)
//   gate                                                (feedback warning)
//   bridge                                              (UI background 04)

import { esc } from '../components.mjs';

let count = 0;
export function uid(prefix) {
  count += 1;
  return `${prefix}${count}`;
}

// A box with a bold title and up to three lighter lines underneath.
export function box(x, y, w, h, { title = '', lines = [], tone = 'plain', href = null, current = false, mono = false, emphasis = false, align = 'middle' } = {}) {
  const cx = align === 'start' ? x + 20 : x + w / 2;
  const n = (title ? 1 : 0) + lines.length;
  const lineH = 24;
  let ty = y + h / 2 - ((n - 1) * lineH) / 2 + 6;
  const cls = `x-d-box x-d-tone-${tone}${emphasis ? ' x-d-emphasis' : ''}${current ? ' x-d-current' : ''}`;
  let inner = `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
  if (title) {
    inner += `<text class="x-d-title${mono ? ' x-d-mono' : ''}" x="${cx}" y="${ty}" text-anchor="${align}">${esc(title)}</text>`;
    ty += lineH;
  }
  for (const line of lines) {
    inner += `<text class="x-d-sub" x="${cx}" y="${ty}" text-anchor="${align}">${esc(line)}</text>`;
    ty += lineH;
  }
  if (href) {
    const label = [title, ...lines].join(', ');
    return `<a href="${href}" class="x-d-link" aria-label="${esc(label)}"${current ? ' aria-current="page"' : ''}>${inner}</a>`;
  }
  return `<g>${inner}</g>`;
}

// A group panel with a heading at the top left.
export function group(x, y, w, h, { title, tone = 'neutral' }) {
  return `<rect class="x-d-group x-d-tone-${tone}" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>
<text class="x-d-group-title" x="${x + 24}" y="${y + 34}">${esc(title)}</text>`;
}

// A plain label (column headings, edge labels).
export function label(x, y, text, { anchor = 'middle', cls = 'x-d-label' } = {}) {
  return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`;
}

// A line or elbow through the given points, with an arrowhead at the end
// (and optionally the start).
export function arrow(id, points, { both = false, dashed = false } = {}) {
  const d = points.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const start = both ? ` marker-start="url(#${id}-head)"` : '';
  return `<path class="x-d-line${dashed ? ' x-d-dashed' : ''}" d="${d}" fill="none" marker-end="url(#${id}-head)"${start}/>`;
}

// The SVG with its title, description and arrowhead marker, followed by the
// list version shown on narrow screens.
export function figure({ id, width, height, title, desc, parts, fallback }) {
  // A small margin round the drawing, so outlines on the edge are not cut.
  const m = 4;
  const svg = `<svg class="x-diagram-svg" viewBox="${-m} ${-m} ${width + 2 * m} ${height + 2 * m}" role="group" aria-labelledby="${id}-title ${id}-desc" focusable="false">
  <title id="${id}-title">${esc(title)}</title>
  <desc id="${id}-desc">${esc(desc)}</desc>
  <defs>
    <marker id="${id}-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path class="x-d-head" d="M 0 0 L 10 5 L 0 10 z"/>
    </marker>
  </defs>
  ${parts.join('\n  ')}
</svg>`;
  return diagramFigure({ title, svg, list: fallback });
}

// The figure around every diagram. On narrow screens the diagram keeps a
// readable size and scrolls sideways (the scroll area takes keyboard focus),
// and the same content is offered as a list behind a disclosure.
export function diagramFigure({ title, svg, list }) {
  return `<figure class="x-diagram" data-buckholt="false">
  <div class="x-diagram-tools">
    <p class="support-01 x-diagram-hint" aria-hidden="true">Scroll sideways to see the whole diagram.</p>
    <button type="button" class="btn btn-secondary btn-sm x-diagram-full" data-x-fullscreen hidden>
        <span class="button-label">View full screen<span class="visually-hidden">: ${esc(title)}</span></span>
    </button>
  </div>
  <div class="x-diagram-scroll" tabindex="0" role="region" aria-label="${esc(title)}">
  ${svg}
  </div>
  <details class="x-diagram-fallback">
    <summary>Show the diagram as a list</summary>
    ${list}
  </details>
</figure>`;
}
