// Narrow layout for every diagram (extension x-diagram): one column, drawn at
// phone width, so the whole diagram is visible and readable without
// scrolling sideways. Each diagram describes its narrow version as a list of
// nodes, top to bottom:
//
//   { box: { title, lines, tone, href, current, dashed } }
//   { group: { title, tone, items: [box, ...] } }
//   { arrow: { label, up, both } }
//
// Colours come from the same classes as the wide diagrams.

import { esc } from '../components.mjs';

const W = 360;          // drawing width, close to a phone's content width
const PAD = 12;         // padding inside groups
const GAP = 8;          // gap between boxes in a group
const ARROW = 30;       // height of an arrow between nodes
const TITLE_H = 20;     // line height for titles
const SUB_H = 18;       // line height for lighter lines
const BOX_PAD_Y = 12;

// Rough characters per line for the font sizes used in the narrow layout.
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function boxLines(b, width) {
  const titleLines = b.title ? wrap(b.title, Math.floor((width - 32) / 8.8)) : [];
  const subLines = (b.lines || []).flatMap(l => wrap(l, Math.floor((width - 32) / 7.4)));
  return { titleLines, subLines };
}

function boxHeight(b, width) {
  const { titleLines, subLines } = boxLines(b, width);
  return BOX_PAD_Y * 2 + titleLines.length * TITLE_H + subLines.length * SUB_H - 4;
}

function drawBox(b, x, y, width) {
  const h = boxHeight(b, width);
  const { titleLines, subLines } = boxLines(b, width);
  const tone = b.stage ? '' : ` x-d-tone-${b.tone || 'plain'}`;
  const cls = `x-d-box${tone}${b.stage ? ` x-d-stage-${b.stage}` : ''}${b.agent ? ' x-d-agent' : ''}${b.dashed ? ' x-d-people' : ''}${b.gate ? ' x-d-gate' : ''}${b.emphasis ? ' x-d-emphasis' : ''}${b.current ? ' x-d-current' : ''}`;
  const cx = x + width / 2;
  let ty = y + BOX_PAD_Y + 14;
  let inner = `<rect class="${cls}" x="${x}" y="${y}" width="${width}" height="${h}" rx="8"/>`;
  for (const t of titleLines) {
    inner += `<text class="x-d-title${b.mono ? ' x-d-mono' : ''}" x="${cx}" y="${ty}" text-anchor="middle">${esc(t)}</text>`;
    ty += TITLE_H;
  }
  for (const t of subLines) {
    inner += `<text class="x-d-sub" x="${cx}" y="${ty - 2}" text-anchor="middle">${esc(t)}</text>`;
    ty += SUB_H;
  }
  if (b.href) {
    const label = [b.title, ...(b.lines || [])].join(', ');
    return { h, svg: `<a href="${b.href}" class="x-d-link" aria-label="${esc(label)}${b.current ? ' (this agent)' : ''}"${b.current ? ' aria-current="page"' : ''}>${inner}</a>` };
  }
  return { h, svg: `<g>${inner}</g>` };
}

export function stackSvg({ id, title, desc, nodes }) {
  const parts = [];
  let y = 0;
  for (const n of nodes) {
    if (n.box) {
      const width = n.box.width ? Math.min(n.box.width, W) : W;
      const { h, svg } = drawBox(n.box, (W - width) / 2, y, width);
      parts.push(svg);
      y += h;
    } else if (n.group) {
      const g = n.group;
      const titleLines = wrap(g.title, 38);
      const top = y;
      let iy = y + PAD + titleLines.length * 20 + 6;
      const items = [];
      for (const it of g.items) {
        const { h, svg } = drawBox(it, PAD, iy, W - PAD * 2);
        items.push(svg);
        iy += h + GAP;
      }
      const h = iy - GAP + PAD - top;
      const groupTone = g.stage ? `x-d-stage-${g.stage}` : `x-d-tone-${g.tone || 'neutral'}`;
      parts.push(`<rect class="x-d-group ${groupTone}" x="0" y="${top}" width="${W}" height="${h}" rx="12"/>`);
      titleLines.forEach((t, i) => parts.push(`<text class="x-d-group-title" x="${PAD + 4}" y="${top + PAD + 15 + i * 20}">${esc(t)}</text>`));
      parts.push(...items);
      y += h;
    } else if (n.space) {
      y += n.space;
    } else if (n.arrow) {
      const a = n.arrow;
      const cx = W / 2;
      const [y1, y2] = a.up ? [y + ARROW - 2, y + 3] : [y + 2, y + ARROW - 3];
      parts.push(`<path class="x-d-line" d="M ${cx} ${y1} L ${cx} ${y2}" fill="none" marker-end="url(#${id}-head)"${a.both ? ` marker-start="url(#${id}-head)"` : ''}/>`);
      if (a.label) parts.push(`<text class="x-d-label x-d-label-sm" x="${cx + 12}" y="${y + ARROW / 2 + 5}">${esc(a.label)}</text>`);
      y += ARROW;
    }
  }
  const m = 4;
  return `<svg class="x-diagram-svg x-diagram-narrow" viewBox="${-m} ${-m} ${W + 2 * m} ${y + 2 * m}" role="group" aria-labelledby="${id}-title ${id}-desc" focusable="false">
  <title id="${id}-title">${esc(title)}</title>
  <desc id="${id}-desc">${esc(desc)}</desc>
  <defs>
    <marker id="${id}-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path class="x-d-head" d="M 0 0 L 10 5 L 0 10 z"/>
    </marker>
  </defs>
  ${parts.join('\n  ')}
</svg>`;
}
