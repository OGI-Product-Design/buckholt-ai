// Diagrams 2 to 7. Rebuilt from content/diagrams/02 to 07 for layout and
// content only. See kit.mjs for how colour is applied.

import { esc, agentTag } from '../components.mjs';
import { uid, box, group, label, arrow, figure } from './kit.mjs';

const W = 1100;

const li = items => items.map(t => `<li>${t}</li>`).join('');
const tags = (ctx, ids) => `<ul class="x-diagram-list-tags">${ids.map(id => `<li>${agentTag(ctx.agentsById[id], ctx)}</li>`).join('')}</ul>`;

// 2. Toolset bridge ---------------------------------------------------------
export function toolsetDiagram(ctx) {
  const id = uid('tb');
  const left = [
    ['Copilot', 'Runs Brief, Insight and Map'],
    ['SharePoint', 'Discovery master copy, product pack copy'],
    ['Teams', 'Recordings and transcripts'],
    ['Azure DevOps', 'Design board, stage status, links'],
    ['Lucid', 'Journey and process maps (also in Cursor)']
  ];
  const right = [
    ['Cursor', 'Runs the other nine agents'],
    ['Figma MCP', 'Extend writes; Align, Build, Relay read'],
    ['LogRocket MCP', 'Insight step, Observe, Relay'],
    ['Buckholt prototyping repo', 'Core, extensions, sandbox, Archive'],
    ['Playwright and axe', 'Automated checks run by Audit'],
    ['Lucid MCP', 'Used by Range for rough flows']
  ];
  const colW = 510, gap = W - colW * 2, bh = 68, bg = 14, top = 56;
  const gh = top + right.length * bh + (right.length - 1) * bg + 24;
  const parts = [
    group(0, 0, colW, gh, { title: 'Microsoft 365 · discovery', tone: 'primary' }),
    group(colW + gap, 0, colW, gh, { title: 'Cursor · explore, design, prototype', tone: 'quaternary' })
  ];
  left.forEach(([t, s], i) => parts.push(box(24, top + i * (bh + bg), colW - 48, bh, { title: t, lines: [s] })));
  right.forEach(([t, s], i) => parts.push(box(colW + gap + 24, top + i * (bh + bg), colW - 48, bh, { title: t, lines: [s] })));
  const by = gh + 56, bw = 600, bx = (W - bw) / 2;
  parts.push(box(bx, by, bw, 92, { title: 'The bridge', lines: ['Archive copies product packs into SharePoint', 'and pulls approved discovery into the repo'], tone: 'bridge' }));
  parts.push(arrow(id, [[colW / 2, gh + 2], [colW / 2, by - 2]], { both: true }));
  parts.push(arrow(id, [[colW + gap + colW / 2, gh + 2], [colW + gap + colW / 2, by - 2]], { both: true }));

  const fallback = `<ul class="x-diagram-list">
    <li><strong>Microsoft 365, for discovery</strong><ul>${li(left.map(([t, s]) => `${esc(t)}: ${esc(s)}`))}</ul></li>
    <li><strong>Cursor, to explore, design and prototype</strong><ul>${li(right.map(([t, s]) => `${esc(t)}: ${esc(s)}`))}</ul></li>
    <li><strong>The bridge</strong>: Archive copies product packs into SharePoint and pulls approved discovery into the repo.${tags(ctx, ['archive'])}</li>
  </ul>`;
  return figure({
    id, width: W, height: by + 96,
    title: 'Toolset: two platforms, joined by one bridge',
    desc: 'Microsoft 365 (Copilot, SharePoint, Teams, Azure DevOps, Lucid) handles discovery. Cursor (Cursor, Figma MCP, LogRocket MCP, the Buckholt prototyping repo, Playwright and axe, Lucid MCP) handles explore, design and prototype. The bridge between them is kept in sync by the Archive agent.',
    parts, fallback
  });
}

// 3. Dependencies ------------------------------------------------------------
export function dependenciesDiagram(ctx) {
  const id = uid('dp');
  const agents = [['Discover', ['Brief, Insight, Map']], ['Explore', ['Range, Critic']], ['Design', ['Extend, Align']], ['Prototype', ['Build, Audit,', 'Observe, Relay']]];
  const connectors = [
    ['Figma MCP, write', 'Extend; needs a Full seat'], ['LogRocket MCP', 'Insight, Observe, Relay'], ['Lucid MCP', 'Map, Range'],
    ['ADO connector', 'Brief reads features'], ['Legacy Figma libraries', 'Anchors, Extend, Align'], ['Figma read, Code Connect', 'Align, Build, Relay']
  ];
  const foundations = [['Repo and locks', ['Buckholt core and', 'legacy CSS locked']], ['Product packs', ['One per product,', 'with styling mode']], ['Design board', ['Stage statuses', 'trigger each agent']], ['SharePoint site', ['Discovery master', 'and pack copy']]];
  const parts = [];
  const four = (items, y, h, tone) => {
    const bw = (W - 48 - 3 * 16) / 4;
    items.forEach(([t, l], i) => parts.push(box(24 + i * (bw + 16), y, bw, h, { title: t, lines: l, tone })));
  };
  // Agents band
  parts.push(group(0, 0, W, 196, { title: 'Agents, by stage', tone: 'neutral' }));
  four(agents, 56, 116);
  // Connectors band
  const cy = 196 + 56;
  parts.push(group(0, cy, W, 56 + 2 * 76 + 16 + 24, { title: 'Connectors and access', tone: 'neutral' }));
  const cw = (W - 48 - 2 * 16) / 3;
  connectors.forEach(([t, s], i) => parts.push(box(24 + (i % 3) * (cw + 16), cy + 56 + Math.floor(i / 3) * 92, cw, 76, { title: t, lines: [s] })));
  const cEnd = cy + 56 + 2 * 76 + 16 + 24;
  // Foundations band
  const fy = cEnd + 56;
  parts.push(group(0, fy, W, 196, { title: 'Foundations, set up first', tone: 'primary' }));
  four(foundations, fy + 56, 116);
  parts.push(arrow(id, [[W / 2, cy - 2], [W / 2, 198]]));
  parts.push(arrow(id, [[W / 2, fy - 2], [W / 2, cEnd + 2]]));

  const fallback = `<ol class="x-diagram-list">
    <li><strong>Foundations, set up first</strong><ul>${li(foundations.map(([t, l]) => `${esc(t)}: ${esc(l.join(' '))}`))}</ul></li>
    <li><strong>Then connectors and access</strong><ul>${li(connectors.map(([t, s]) => `${esc(t)}: ${esc(s)}`))}</ul></li>
    <li><strong>Then the agents, by stage</strong><ul>${li(agents.map(([t, l]) => `${esc(t)}: ${esc(l.join(' '))}`))}</ul></li>
  </ol>`;
  return figure({
    id, width: W, height: fy + 196,
    title: 'Dependencies: four foundations unblock everything else',
    desc: 'Foundations come first: the repo and its locks, product packs, the design board and the SharePoint site. They unblock connectors and access: Figma MCP write, LogRocket MCP, Lucid MCP, the Azure DevOps connector, legacy Figma libraries, and Figma read with Code Connect. Those unblock the agents, by stage.',
    parts, fallback
  });
}

// 4. Repo zones ----------------------------------------------------------------
export function repoZonesDiagram(ctx) {
  const id = uid('rz');
  const cols = [
    { title: 'Locked: no agent writes', tone: 'locked', items: [['/buckholt', 'Buckholt core', 'Owner approval to change'], ['/legacy/[product]', 'Captured legacy CSS', 'Owner approval to change']] },
    { title: 'Agents create here', tone: 'tertiary', items: [['/extensions/[product]', 'Build, Extend; tokens only', 'Flagged and registered'], ['/sandbox/[product]', 'Range; greybox only', 'Never promoted'], ['/prototypes/[product]', 'Build; by styling mode', 'Checked by Audit, Align']] },
    { title: 'Context and control', tone: 'primary', items: [['/context', 'Archive: packs, logs,', 'register, migration map'], ['/agents', 'One file per agent', 'Changed by pull request'], ['/.cursor/rules', 'Rules every agent follows', 'Changed by pull request'], ['/tests', 'Playwright and axe', 'Run by Audit']] }
  ];
  const cw = (W - 2 * 32) / 3, bh = 104, bg = 16, top = 56;
  const h = top + 4 * bh + 3 * bg + 24;
  const parts = [];
  cols.forEach((c, ci) => {
    const x = ci * (cw + 32);
    parts.push(group(x, 0, cw, h, { title: c.title, tone: c.tone }));
    c.items.forEach(([t, a, b], i) => parts.push(box(x + 20, top + i * (bh + bg), cw - 40, bh, { title: t, lines: [a, b], mono: true })));
  });
  const fallback = `<ul class="x-diagram-list">${cols.map(c => `<li><strong>${esc(c.title)}</strong><ul>${li(c.items.map(([t, a, b]) => `<code>${esc(t)}</code>: ${esc(a)}. ${esc(b)}.`))}</ul></li>`).join('')}</ul>`;
  return figure({
    id, width: W, height: h,
    title: 'Repo zones: two folders are locked; agents create only in three',
    desc: 'Locked, no agent writes: /buckholt (Buckholt core) and /legacy (captured legacy CSS), both changed only with owner approval. Agents create in /extensions, /sandbox and /prototypes. Context and control: /context, /agents, /.cursor/rules and /tests.',
    parts, fallback
  });
}

// 5. Artifact flow ---------------------------------------------------------------
export const ARTIFACTS = [
  { name: 'Product pack', where: 'Repo /context, copy in SharePoint', writtenBy: ['archive'], writtenNote: 'Laurence approves', readBy: 'All agents' },
  { name: 'UX brief', where: 'SharePoint, linked on the design item', writtenBy: ['brief'], readBy: 'Insight, Map, PM', readIds: ['insight', 'map'] },
  { name: 'Discovery summary', where: 'SharePoint, summary copy in repo', writtenBy: ['insight', 'map'], readBy: 'Range, Critic, Build, Observe', readIds: ['range', 'critic', 'build', 'observe'] },
  { name: 'Decision log', where: 'Repo /context', writtenBy: ['archive'], writtenNote: 'from gate outcomes', readBy: 'All agents, Jim, PMs' },
  { name: 'Extensions register', where: 'Repo /context', writtenBy: ['extend', 'build'], readBy: 'Align, Audit, Relay', readIds: ['align', 'audit', 'relay'] },
  { name: 'Migration map', where: 'Repo /context', writtenBy: ['archive'], readBy: 'Build, Align', readIds: ['build', 'align'] },
  { name: 'Agent definition', where: 'Repo /agents', writtenBy: [], writtenNote: 'Laurence', readBy: 'The agent itself' }
];

export function artifactFlowDiagram(ctx) {
  const id = uid('af');
  const A = ctx.agentsById;
  const c1 = 300, c2 = 420, gap = (W - c1 * 2 - c2) / 2, rh = 80, rg = 18, top = 48;
  const parts = [
    label(c1 / 2, 24, 'Written by'),
    label(c1 + gap + c2 / 2, 24, 'Artifact and where it lives'),
    label(W - c1 / 2, 24, 'Read by')
  ];
  ARTIFACTS.forEach((a, i) => {
    const y = top + i * (rh + rg);
    const writer = a.writtenBy.length ? a.writtenBy.map(w => A[w].name).join(', ') : a.writtenNote;
    const note = a.writtenBy.length && a.writtenNote ? [a.writtenNote.charAt(0).toUpperCase() + a.writtenNote.slice(1)] : [];
    parts.push(box(0, y, c1, rh, { title: writer, lines: note }));
    parts.push(box(c1 + gap, y, c2, rh, { title: a.name, lines: [a.where], tone: 'primary', emphasis: true }));
    parts.push(box(W - c1, y, c1, rh, { title: a.readBy }));
    parts.push(arrow(id, [[c1 + 2, y + rh / 2], [c1 + gap - 3, y + rh / 2]]));
    parts.push(arrow(id, [[c1 + gap + c2 + 2, y + rh / 2], [W - c1 - 3, y + rh / 2]]));
  });
  const fallback = `<ul class="x-diagram-list">${ARTIFACTS.map(a => {
    const writer = a.writtenBy.length ? a.writtenBy.map(w => A[w].name).join(' and ') + (a.writtenNote ? ` (${a.writtenNote})` : '') : a.writtenNote;
    return `<li><strong>${esc(a.name)}</strong>, in ${esc(a.where)}. Written by ${esc(writer)}; read by ${esc(a.readBy)}.</li>`;
  }).join('')}</ul>`;
  return figure({
    id, width: W, height: top + ARTIFACTS.length * (rh + rg),
    title: 'Artifact flow: seven artifacts carry the work between agents',
    desc: ARTIFACTS.map(a => `${a.name}, in ${a.where}, read by ${a.readBy}`).join('. ') + '.',
    parts, fallback
  });
}

// 6. Azure DevOps links -----------------------------------------------------------
export function adoDiagram(ctx) {
  const id = uid('ado');
  const bw = 236, gap = (W - 4 * bw) / 3, y = 132, bh = 108;
  const xs = [0, 1, 2, 3].map(i => i * (bw + gap));
  const items = [
    ['Portfolio epic', ['Owned by product']],
    ['Feature', ['Planned per quarter', 'Triggers design']],
    ['Design item', ['UX owns, our columns', 'One per feature']],
    ['Engineering stories', ['Ready only when design', 'is Handed over']]
  ];
  const parts = [
    label((xs[0] + xs[1] + bw) / 2, 24, 'Product board'),
    label(xs[2] + bw / 2, 24, 'UX design board'),
    label(xs[3] + bw / 2, 24, 'Engineering boards')
  ];
  items.forEach(([t, l], i) => parts.push(box(xs[i], y, bw, bh, { title: t, lines: l, tone: i === 2 ? 'primary' : 'plain', emphasis: i === 2 })));
  const mid = y + bh / 2;
  ['parent of', 'parent of', 'predecessor of'].forEach((t, i) => {
    parts.push(arrow(id, [[xs[i] + bw + 2, mid], [xs[i + 1] - 3, mid]]));
    parts.push(label(xs[i] + bw + gap / 2, y + bh + 30, t, { cls: 'x-d-label x-d-label-sm' }));
  });
  // Roll-up from the design item to the feature
  parts.push(arrow(id, [[xs[2] + bw / 2, y - 2], [xs[2] + bw / 2, 70], [xs[1] + bw / 2, 70], [xs[1] + bw / 2, y - 3]], { dashed: true }));
  parts.push(label((xs[1] + xs[2] + bw) / 2, 60, 'design status rolls up', { cls: 'x-d-label x-d-label-sm' }));
  // Hyperlinks from the design item
  const ly = y + bh + 80, lw = 230, lh = 64, lg = 24;
  const centre = Math.min(xs[2] + bw / 2, W - lw * 1.5 - lg);
  const linkXs = [centre - lw * 1.5 - lg, centre - lw / 2, centre + lw / 2 + lg];
  const busY = ly - 26;
  parts.push(`<path class="x-d-line" d="M ${xs[2] + bw / 2} ${y + bh} V ${busY} M ${Math.min(linkXs[0] + lw / 2, xs[2] + bw / 2)} ${busY} H ${Math.max(linkXs[2] + lw / 2, xs[2] + bw / 2)}" fill="none"/>`);
  ['SharePoint brief', 'Figma file', 'Prototype link'].forEach((t, i) => {
    parts.push(arrow(id, [[linkXs[i] + lw / 2, busY], [linkXs[i] + lw / 2, ly - 3]]));
    parts.push(box(linkXs[i], ly, lw, lh, { title: t }));
  });
  const fallback = `<ol class="x-diagram-list">
    <li><strong>Portfolio epic</strong> on the product board, owned by product. It is the parent of the feature.</li>
    <li><strong>Feature</strong> on the product board, planned per quarter. It triggers design and is the parent of the design item.</li>
    <li><strong>Design item</strong> on the UX design board: UX owns it and its columns, one per feature. Its design status rolls up to the feature. It links to the SharePoint brief, the Figma file and the prototype, and is the predecessor of the engineering stories.</li>
    <li><strong>Engineering stories</strong> on the engineering boards, ready only when design is Handed over.</li>
  </ol>`;
  return figure({
    id, width: W, height: ly + lh + 4,
    title: 'Azure DevOps: design has its own board, linked into the product feature',
    desc: 'Portfolio epic, parent of feature, parent of design item, predecessor of engineering stories. The design item\'s status rolls up to the feature, and the design item links to the SharePoint brief, the Figma file and the prototype.',
    parts, fallback
  });
}

// 7. Product contract ------------------------------------------------------------
export function contractDiagram(ctx) {
  const id = uid('pc');
  const pm = ['Epics and features', 'Outcomes, criteria', 'Story-writing agents', 'Quarterly priorities'];
  const ux = ['Design items and board', 'UX brief and measures', 'Agents and templates', 'UX sprint capacity'];
  const cw = 340, bh = 72, bg = 18, top = 56;
  const h = top + 4 * bh + 3 * bg + 24;
  const mx = cw + 60, mw = W - 2 * cw - 120;
  const parts = [
    group(0, 0, cw, h, { title: 'Product management owns', tone: 'primary' }),
    group(W - cw, 0, cw, h, { title: 'UX owns', tone: 'quaternary' })
  ];
  pm.forEach((t, i) => parts.push(box(24, top + i * (bh + bg), cw - 48, bh, { title: t })));
  ux.forEach((t, i) => parts.push(box(W - cw + 24, top + i * (bh + bg), cw - 48, bh, { title: t })));
  const r1 = top + 20, r2 = top + 2 * (bh + bg) + 20, mh = 116;
  parts.push(box(mx, r1, mw, mh, { title: 'Ready for design', lines: ['Feature fields complete', 'Status is the trigger'], tone: 'bridge' }));
  parts.push(box(mx, r2, mw, mh, { title: 'UX outputs on stories', lines: ['UX criteria, Figma, prototype', 'Status field on the feature'], tone: 'bridge' }));
  parts.push(arrow(id, [[cw + 2, r1 + mh / 2], [mx - 3, r1 + mh / 2]]));
  parts.push(arrow(id, [[mx + mw + 2, r1 + mh / 2], [W - cw - 3, r1 + mh / 2]]));
  parts.push(arrow(id, [[W - cw - 2, r2 + mh / 2], [mx + mw + 3, r2 + mh / 2]]));
  parts.push(arrow(id, [[mx - 2, r2 + mh / 2], [cw + 3, r2 + mh / 2]]));
  const fallback = `<ul class="x-diagram-list">
    <li><strong>Product management owns</strong><ul>${li(pm.map(esc))}</ul></li>
    <li><strong>UX owns</strong><ul>${li(ux.map(esc))}</ul></li>
    <li><strong>Ready for design</strong> crosses from product to UX: the feature fields are complete, and the status is the trigger.</li>
    <li><strong>UX outputs on stories</strong> cross from UX to product: UX criteria, Figma and prototype links, and the status field on the feature.</li>
  </ul>`;
  return figure({
    id, width: W, height: h,
    title: 'Product contract: product and UX meet through a contract, not through each other’s agents',
    desc: 'Product management owns epics and features, outcomes and criteria, story-writing agents and quarterly priorities. UX owns design items and the board, the UX brief and measures, agents and templates, and UX sprint capacity. Two things cross: Ready for design, from product to UX; and UX outputs on stories, from UX to product.',
    parts, fallback
  });
}
