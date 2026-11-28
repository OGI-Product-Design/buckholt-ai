// Diagram 1: the workflow.
//
// Rebuilt from content/diagrams/01-workflow.png for layout and content only.
// Every colour comes from a Buckholt token through a class in
// css/extensions.css; nothing is coloured inline. Agent boxes are links to the
// agent pages. Below the diagram breakpoint the SVG is hidden and the same
// content is shown as an ordered list.
//
// highlight: an agent id to mark, for the agent pages ("Where it sits").

import { esc, agentTag } from '../components.mjs';
import { diagramFigure } from './kit.mjs';
import { stackSvg } from './stack.mjs';

const W = 1100;          // viewBox width
const LOOP = 56;         // room either side for the fast track and test loop
const X0 = LOOP;
const X1 = W - LOOP;
const CW = X1 - X0;      // content width
const PAD = 20;          // group padding
const GAP = 16;          // gap between boxes in a group
const ARROW = 36;        // vertical space for a connecting arrow

const GROUPS = [
  { id: 'discover', label: 'Discover', tools: 'Copilot, Lucid',
    items: [['brief', 'UX problem, route, measures'], ['insight', 'Research and LogRocket evidence'], ['map', 'Flows and worklist in Lucid']] },
  { id: 'explore', label: 'Explore', tools: 'Cursor sandbox',
    items: [['range', 'Greybox explorations in the sandbox'], ['critic', 'Stress-tests the concepts']] },
  { id: 'design', label: 'Design', tools: 'Cursor and Figma MCP',
    items: [['extend', 'Builds out from anchors (Figma write)'], ['align', 'Consistency checks (Figma read)']] },
  { id: 'prototype', label: 'Prototype and handoff', tools: 'Cursor',
    items: [['build', 'Prototypes in repo'], ['audit', 'WCAG, Buckholt drift'], ['observe', 'Usability testing'], ['relay', 'Handoff to stories']] }
];

const FOUNDATIONS = [
  { name: 'SharePoint', sub: 'Discovery and pack copy' },
  { name: 'Azure DevOps', sub: 'Design board, stage status' },
  { agent: 'archive', sub: 'Design context in the repo' }
];

function peopleText(gate) {
  return gate.people.map(p => (p === 'PM' ? p : p.toLowerCase())).join(', ');
}

let instance = 0;

export function workflowDiagram(ctx, { highlight = null } = {}) {
  instance += 1;
  const uid = `wf${instance}`;
  const A = ctx.agentsById;
  const gates = Object.fromEntries(ctx.data.gates.map(g => [g.id, g]));
  const parts = [];
  let y = 0;

  const href = id => `${ctx.root}agents/${id}/`;

  // A box with a title and an optional second line. Agent boxes are links.
  function box(x, yy, w, h, { title, sub, cls = '', agentId = null }) {
    const current = agentId && agentId === highlight;
    const rectCls = `x-d-box ${cls}${current ? ' x-d-current' : ''}`;
    const cx = x + w / 2;
    const titleY = sub ? yy + h / 2 - 5 : yy + h / 2 + 7;
    let inner = `<rect class="${rectCls}" x="${x}" y="${yy}" width="${w}" height="${h}" rx="8"/>`;
    inner += `<text class="x-d-title" x="${cx}" y="${titleY}" text-anchor="middle">${esc(title)}</text>`;
    if (sub) inner += `<text class="x-d-sub" x="${cx}" y="${yy + h / 2 + 20}" text-anchor="middle">${esc(sub)}</text>`;
    if (agentId) {
      const label = `${title}${current ? ' (this agent)' : ''}`;
      return `<a href="${href(agentId)}" class="x-d-link" aria-label="${esc(label)}: ${esc(sub || '')}"${current ? ' aria-current="page"' : ''}>${inner}</a>`;
    }
    return `<g>${inner}</g>`;
  }

  function arrowDown(fromY) {
    const cx = X0 + CW / 2;
    parts.push(`<line class="x-d-line" x1="${cx}" y1="${fromY}" x2="${cx}" y2="${fromY + ARROW - 2}" marker-end="url(#${uid}-head)"/>`);
  }

  // Foundations row
  const fh = 76;
  const fw = (CW - GAP * 2) / 3;
  FOUNDATIONS.forEach((f, i) => {
    const x = X0 + i * (fw + GAP);
    if (f.agent) {
      parts.push(box(x, y, fw, fh, { title: A[f.agent].name, sub: f.sub, cls: 'x-d-stage-foundation', agentId: f.agent }));
    } else {
      parts.push(box(x, y, fw, fh, { title: f.name, sub: f.sub, cls: 'x-d-plain' }));
    }
  });
  y += fh;

  const groupY = {};
  function group(g) {
    arrowDown(y);
    y += ARROW;
    const h = 156;
    groupY[g.id] = y + h / 2;
    parts.push(`<rect class="x-d-group x-d-stage-${g.id}" x="${X0}" y="${y}" width="${CW}" height="${h}" rx="12"/>`);
    parts.push(`<text class="x-d-group-title" x="${X0 + PAD}" y="${y + 34}">${esc(g.label)} <tspan class="x-d-group-tools">· ${esc(g.tools)}</tspan></text>`);
    const n = g.items.length;
    const bw = (CW - PAD * 2 - GAP * (n - 1)) / n;
    g.items.forEach(([id, sub], i) => {
      const x = X0 + PAD + i * (bw + GAP);
      parts.push(box(x, y + 56, bw, 80, { title: A[id].name, sub, cls: `x-d-agent x-d-stage-${A[id].stage}`, agentId: id }));
    });
    y += h;
  }

  function centreBox(h, opts) {
    arrowDown(y);
    y += ARROW;
    const w = opts.cls === 'x-d-gate' ? 760 : 560;
    parts.push(box(X0 + (CW - w) / 2, y, w, h, opts));
    y += h;
  }

  group(GROUPS[0]);
  group(GROUPS[1]);
  centreBox(64, { title: `Gate: shortlist · ${peopleText(gates.shortlist)}`, cls: 'x-d-gate' });
  centreBox(56, { title: 'Designers: anchor screens in Figma', cls: 'x-d-people' });
  group(GROUPS[2]);
  centreBox(64, { title: `Gate: design sign-off · ${peopleText(gates.signoff)}`, cls: 'x-d-gate' });
  group(GROUPS[3]);
  centreBox(64, { title: 'Engineering stories (one sprint behind)', cls: 'x-d-plain' });
  const H = y + 4;

  // Fast track: Discover straight to Design (right side)
  const rx = X1 + 26;
  parts.push(`<path class="x-d-loop" d="M ${X1} ${groupY.discover} H ${rx} V ${groupY.design} H ${X1 + 3}" marker-end="url(#${uid}-head)"/>`);
  const ftMid = (groupY.discover + groupY.design) / 2;
  parts.push(`<text class="x-d-loop-label" transform="translate(${rx + 18} ${ftMid}) rotate(90)" text-anchor="middle">Fast track</text>`);

  // Test loop: Prototype back to Design (left side)
  const lx = X0 - 26;
  parts.push(`<path class="x-d-loop" d="M ${X0} ${groupY.prototype} H ${lx} V ${groupY.design} H ${X0 - 3}" marker-end="url(#${uid}-head)"/>`);
  const tlMid = (groupY.prototype + groupY.design) / 2;
  parts.push(`<text class="x-d-loop-label" transform="translate(${lx - 10} ${tlMid}) rotate(-90)" text-anchor="middle">Test loop</text>`);

  const title = 'Workflow: designers decide at two gates; agents do the work in between';
  const desc = 'Foundations (SharePoint, Azure DevOps and the Archive agent) feed Discover (Brief, Insight, Map), then Explore (Range, Critic), then the shortlist gate, then designers make anchor screens, then Design (Extend, Align), then the design sign-off gate, then Prototype and handoff (Build, Audit, Observe, Relay), then engineering stories. A fast track goes from Discover straight to Design. A test loop goes from Prototype back to Design.';

  const svg = `<svg class="x-diagram-svg x-diagram-wide" viewBox="-4 -4 ${W + 8} ${H + 8}" role="group" aria-labelledby="${uid}-title ${uid}-desc" focusable="false">
  <title id="${uid}-title">${esc(title)}</title>
  <desc id="${uid}-desc">${esc(desc)}</desc>
  <defs>
    <marker id="${uid}-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path class="x-d-head" d="M 0 0 L 10 5 L 0 10 z"/>
    </marker>
  </defs>
  ${parts.join('\n  ')}
</svg>`;

  // The same content as a list, for narrow screens.
  const tagsFor = ids => ids.map(id => {
    const mark = id === highlight ? ' <span class="x-diagram-current">(this agent)</span>' : '';
    return `<li>${agentTag(A[id], ctx)}${mark}</li>`;
  }).join('');
  const gateItem = g => `<li class="x-diagram-list-gate"><span class="tag tag-sm tag-status tag-status-warning">
        <span class="tag-label">Gate</span>
    </span> <strong>${esc(g.name)}</strong> (${esc(peopleText(g))}). Decides: ${esc(g.decides.charAt(0).toLowerCase() + g.decides.slice(1))}.</li>`;
  const groupItem = g => `<li><strong>${esc(g.label)}</strong> (${esc(g.tools)})<ul class="x-diagram-list-tags">${tagsFor(g.items.map(i => i[0]))}</ul></li>`;

  const list = `<ol class="x-diagram-list">
    <li><strong>Foundations</strong>: SharePoint, Azure DevOps and the Archive agent.<ul class="x-diagram-list-tags">${tagsFor(['archive'])}</ul></li>
    ${groupItem(GROUPS[0])}
    ${groupItem(GROUPS[1])}
    ${gateItem(gates.shortlist)}
    <li><strong>Designers</strong> make the anchor screens in Figma.</li>
    ${groupItem(GROUPS[2])}
    ${gateItem(gates.signoff)}
    ${groupItem(GROUPS[3])}
    <li><strong>Engineering stories</strong>, one sprint behind.</li>
  </ol>
  <ul class="x-diagram-list-loops">
    <li><strong>Fast track</strong>: Discover can go straight to Design.</li>
    <li><strong>Test loop</strong>: Prototype can go back to Design.</li>
  </ul>`;

  // One-column version for phones.
  const agentBox = (id, sub) => ({ title: A[id].name, lines: [sub], stage: A[id].stage, agent: true, href: href(id), current: id === highlight });
  const groupNode = g => ({ group: { title: `${g.label} · ${g.tools}`, stage: g.id, items: g.items.map(([id, sub]) => agentBox(id, sub)) } });
  const narrow = [
    { group: { title: 'Foundations', items: [
      { title: 'SharePoint', lines: ['Discovery and pack copy'] },
      { title: 'Azure DevOps', lines: ['Design board, stage status'] },
      agentBox('archive', 'Design context in the repo')
    ] } },
    { arrow: {} }, groupNode(GROUPS[0]),
    { arrow: {} }, groupNode(GROUPS[1]),
    { arrow: {} }, { box: { title: `Gate: shortlist · ${peopleText(gates.shortlist)}`, gate: true } },
    { arrow: {} }, { box: { title: 'Designers: anchor screens in Figma', dashed: true } },
    { arrow: {} }, groupNode(GROUPS[2]),
    { arrow: {} }, { box: { title: `Gate: design sign-off · ${peopleText(gates.signoff)}`, gate: true } },
    { arrow: {} }, groupNode(GROUPS[3]),
    { arrow: {} }, { box: { title: 'Engineering stories (one sprint behind)' } },
    { space: 20 },
    { box: { title: 'Fast track', lines: ['Discover can go straight to Design'], dashed: true } },
    { space: 12 },
    { box: { title: 'Test loop', lines: ['Prototype can go back to Design'], dashed: true } }
  ];
  const narrowSvg = stackSvg({ id: `${uid}n`, title, desc, nodes: narrow });
  return diagramFigure({ title, svg, narrowSvg, list });
}
