// Page definitions. Section pages are Markdown files in content/pages/;
// agent pages come from data/agents.json; guides come from content/guides/.

import fs from 'node:fs';
import path from 'node:path';
import { esc, agentTag, codeBlock, stageTagClass, tagSet, pendingNote } from './components.mjs';
import { frame, pageHeading, NAV } from './layout.mjs';
import { workflowDiagram } from './diagrams/workflow.mjs';
import { toolsetDiagram, dependenciesDiagram, repoZonesDiagram, artifactFlowDiagram, adoDiagram, contractDiagram } from './diagrams/others.mjs';
import { parseFrontMatter, renderMarkdown, inline } from './markdown.mjs';

export const REPO_URL = 'https://github.com/OGI-Product-Design/buckholt-ai';

export const DIAGRAMS = {
  workflow: workflowDiagram,
  toolset: toolsetDiagram,
  dependencies: dependenciesDiagram,
  'repo-zones': repoZonesDiagram,
  'artifact-flow': artifactFlowDiagram,
  'azure-devops': adoDiagram,
  'product-contract': contractDiagram
};

function agentsByStage(ctx) {
  return ctx.data.stages
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(stage => ({ stage, agents: ctx.data.agents.filter(a => a.stage === stage.id).sort((a, b) => a.order - b.order) }));
}

function orderedAgents(ctx) {
  return ctx.data.agents.slice().sort((a, b) => a.order - b.order);
}

// The 12 agents as tag sets grouped by stage, in a Bootstrap grid.
function agentGrid(ctx, headingLevel = 3) {
  const h = `h${headingLevel}`;
  const cols = agentsByStage(ctx).map(({ stage, agents }) => `    <div class="col-12 col-sm-6 col-lg-4">
      <div class="x-stage-group" data-buckholt="false">
        <${h} class="title-01">${esc(stage.name)}</${h}>
        ${tagSet(agents.map(a => agentTag(a, ctx)))}
      </div>
    </div>`).join('\n');
  return `<div class="row x-row-gap" data-buckholt="false">\n${cols}\n</div>`;
}

function arrowLink(href, text) {
  return `<a class="link-standalone" href="${href}">
    <span class="icon">
        <i class="fa-regular fa-arrow-right" aria-hidden="true"></i>
    </span>
    ${text}
</a>`;
}

function breadcrumb(items) {
  const last = items[items.length - 1];
  return `<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        ${items.slice(0, -1).map(([t, href]) => `<li class="breadcrumb-item">
            <a class="breadcrumb-link" href="${href}">${esc(t)}</a>
        </li>`).join('\n        ')}
        <li class="breadcrumb-item active" aria-current="page">${esc(last[0])}</li>
    </ol>
</nav>`;
}

// Previous and next links (x-pager).
function pager(prev, next, noun) {
  const side = (item, dir) => {
    if (!item) return '<span></span>';
    const icon = dir === 'prev' ? 'fa-arrow-left' : 'fa-arrow-right';
    return `<a class="link-standalone" href="${item.href}" rel="${dir}">
    <span class="icon">
        <i class="fa-regular ${icon}" aria-hidden="true"></i>
    </span>
    <span><span class="x-pager-label">${dir === 'prev' ? 'Previous' : 'Next'} ${noun}</span> ${esc(item.title)}</span>
</a>`;
  };
  return `<nav class="x-pager" data-buckholt="false" aria-label="Previous and next ${noun}">
  ${side(prev, 'prev')}
  ${side(next, 'next')}
</nav>`;
}

// "On this page" contents, shown at xl widths only (x-on-this-page).
function onThisPage(toc) {
  return `<nav class="x-on-this-page" data-buckholt="false" aria-label="On this page">
  <p class="label-01 x-on-this-page-title">On this page</p>
  <ul>
    ${toc.map(t => `<li><a href="#${t.id}">${esc(t.title)}</a></li>`).join('\n    ')}
  </ul>
</nav>`;
}

// Tool cards for the Toolset page (x-tool). Logos are single-colour brand
// marks from Simple Icons (data/tool-logos.json), drawn in a Buckholt text
// colour. Tools with no mark in that set show their name only.
const TOOLS = {
  m365: [
    [null, 'Copilot', 'Runs {{agent:brief}}, {{agent:insight}} and {{agent:map}}.'],
    ['microsoftsharepoint', 'SharePoint', 'Holds the discovery master copy and a copy of each product pack.'],
    ['microsoftteams', 'Teams', 'Holds recordings and transcripts.'],
    ['azuredevops', 'Azure DevOps', 'Holds the design board, the stage status and the links between work items.'],
    ['lucid', 'Lucid', 'Holds journey and process maps. Also reached from Cursor.']
  ],
  cursor: [
    ['cursor', 'Cursor', 'Runs the other nine agents.'],
    ['figma', 'Figma MCP', '{{agent:extend}} writes; {{agent:align}}, {{agent:build}} and {{agent:relay}} only read.'],
    [null, 'LogRocket MCP', 'Used by the {{agent:insight}} Cursor step, {{agent:observe}} and {{agent:relay}}.'],
    ['github', 'Buckholt prototyping repo', 'Holds Buckholt core, extensions, the sandbox and the context {{agent:archive}} maintains.'],
    ['playwright', 'Playwright and axe', 'Run the automated checks for {{agent:audit}}.'],
    ['lucid', 'Lucid MCP', 'Used by {{agent:range}} for rough flows.']
  ]
};

function toolCards(ctx, group) {
  const logos = JSON.parse(fs.readFileSync(path.join(ctx.site, 'data/tool-logos.json'), 'utf8'));
  return `<div class="row x-row-gap" data-buckholt="false">
${TOOLS[group].map(([logo, name, text]) => {
    const mark = logo
      ? `<svg class="x-tool-logo" viewBox="${logos.viewBox}" aria-hidden="true" focusable="false">${logos.logos[logo].body}</svg>`
      : '';
    return `  <div class="col-12 col-md-6 col-xxl-4">
    <div class="card h-100">
        <div class="card-body">
            <div class="text-block">
                <h3 class="title-02 x-tool" data-buckholt="false">${mark}<span>${esc(name)}</span></h3>
                <p>${inline(text, ctx)}</p>
            </div>
        </div>
    </div>
  </div>`;
  }).join('\n')}
</div>`;
}

// Generated blocks that Markdown content can place with {{block:name}}.
const BLOCKS = {
  'agent-grid': ctx => agentGrid(ctx),
  'tools-m365': ctx => toolCards(ctx, 'm365'),
  'tools-cursor': ctx => toolCards(ctx, 'cursor'),
  gates: ctx => `<div class="row x-row-gap" data-buckholt="false">
${ctx.data.gates.map(g => `  <div class="col-12 col-lg-6">
    <div class="card h-100">
        <div class="card-body">
            <div class="text-block">
                <p><span class="tag tag-sm tag-status tag-status-warning">
                    <span class="tag-label">Gate</span>
                </span></p>
                <h3 class="title-03">${esc(g.name)}</h3>
                <p>After ${g.after.map(id => agentTag(ctx.agentsById[id], ctx)).join(' and ')}.</p>
            </div>
            <div class="key-value-list">
                <div class="key-value">
                    <span class="key">Who decides</span>
                    <span class="value">${esc(g.people.join(', '))}</span>
                </div>
                <div class="key-value">
                    <span class="key">Decides</span>
                    <span class="value">${esc(g.decides)}</span>
                </div>
                <div class="key-value">
                    <span class="key">Evidence</span>
                    <span class="value">${esc(g.evidence.join(', '))}</span>
                </div>
                <div class="key-value">
                    <span class="key">Status when passed</span>
                    <span class="value">${esc(g.status)}</span>
                </div>
            </div>
        </div>
    </div>
  </div>`).join('\n')}
</div>`,
  statuses: ctx => `<ol class="list">
${ctx.data.statuses.map(s => `    <li class="list-item">${esc(s)}</li>`).join('\n')}
</ol>`,
  'setup-guide-list': ctx => guideList(ctx, 'setup-guides'),
  'how-to-list': ctx => guideList(ctx, 'how-to-guides')
};

// Content pages ------------------------------------------------------------

function contentPage(ctx, file) {
  const { meta, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
  const slug = meta.slug;
  const { sections, toc } = renderMarkdown(body, ctx, { diagrams: DIAGRAMS, blocks: BLOCKS });
  const head = pageHeading({ title: meta.title, lead: esc(meta.lead || '') });
  const panels = [head, ...sections.map(s => s.html)];
  const body2 = toc.length >= 3 ? withToc(panels, toc) : frame([panels]);
  return { slug, section: meta.section || slug, title: meta.title, description: meta.lead, body: body2, searchText: body };
}

function withToc(panels, toc) {
  return `      <div class="page-frame">
        <div class="container">
          <div class="row">
            <div class="col-12 col-xl-9">
              <div class="page-pane">
${panels.map(p => `                <div class="page-panel">\n<div class="content-group">\n${p}\n</div>\n                </div>`).join('\n')}
              </div>
            </div>
            <div class="col-xl-3 d-none d-xl-block">
${onThisPage(toc)}
            </div>
          </div>
        </div>
      </div>`;
}

// Home ---------------------------------------------------------------------

function home(ctx) {
  const principles = [
    ['Designers lead', 'Designers set the direction, make the anchor screens and decide at both gates.'],
    ['Agents extend and check', 'Agents do the work between the gates: they explore, extend from the anchors, check and hand over. People review what they produce.'],
    ['Buckholt never changes', 'Agents build with Buckholt as it is. Anything Buckholt does not have is a flagged extension, registered for review.']
  ];
  const cards = principles.map(([title, text]) => `    <div class="col-12 col-md-4">
      <div class="card h-100">
          <div class="card-body">
              <div class="text-block">
                  <h3 class="title-03">${esc(title)}</h3>
                  <p>${esc(text)}</p>
              </div>
          </div>
      </div>
    </div>`).join('\n');

  const body = frame([
    [
      pageHeading({
        eyebrow: 'OGI UX team · proposed workflow',
        title: 'Designers decide at two gates; agents do the work in between',
        lead: 'How the OGI UX team proposes to run design with twelve agents: what each agent does, where people decide, and how the work reaches product and engineering.'
      }),
      `<div class="text-block">
    <h2 class="headline-01">The workflow</h2>
    <p>Work moves down the page. The two gates are where designers, the PM and an engineer decide; agents do everything between them.</p>
</div>
${workflowDiagram(ctx)}`
    ],
    [
      `<div class="text-block">
    <h2 class="headline-01">Three principles</h2>
</div>
<div class="row x-row-gap" data-buckholt="false">
${cards}
</div>`
    ],
    [
      `<div class="text-block">
    <h2 class="headline-01">The twelve agents</h2>
    <p>Each agent has one job and a rules file. Select an agent to see its rules.</p>
</div>
${agentGrid(ctx)}`
    ],
    [
      `<div class="text-block">
    <h2 class="headline-01">Start here</h2>
</div>
<ul class="link-set link-set-stacked">
    <li class="linkset-item">
        ${arrowLink(`${ctx.root}workflow/`, 'Workflow: stages, gates and statuses')}
    </li>
    <li class="linkset-item">
        ${arrowLink(`${ctx.root}setup-guides/`, 'Set-up guides: get your tools ready')}
    </li>
    <li class="linkset-item">
        ${arrowLink(`${ctx.root}agents/`, 'Agent rules: what each agent does and never does')}
    </li>
</ul>`
    ]
  ]);
  return { slug: '', section: '', title: 'Home', body, searchText: principles.flat().join(' ') };
}

// Agents -------------------------------------------------------------------

function agentsIndex(ctx) {
  const groups = agentsByStage(ctx).map(({ stage, agents }) => `<div class="text-block">
    <h2 class="headline-01" id="${stage.id}">${esc(stage.name)}</h2>
</div>
<div class="row x-row-gap" data-buckholt="false">
${agents.map(a => `  <div class="col-12 col-md-6 col-xl-4">
    <div class="card h-100">
        <div class="card-body">
            <div class="text-block">
                <p>${agentTag(a, ctx, { link: false })}</p>
                <h3 class="title-03"><a href="${ctx.root}agents/${a.id}/">${esc(a.name)}</a></h3>
                <p>${esc(a.job)}</p>
                <p class="support-01 x-card-meta">Tool: ${esc(a.tool)}</p>
            </div>
        </div>
    </div>
  </div>`).join('\n')}
</div>`);
  const body = frame([[
    pageHeading({ title: 'Agents', lead: 'Twelve agents, grouped by stage. Each one has a single job, reads defined sources, and stops at a human check.' }),
    ...groups
  ]]);
  return { slug: 'agents/', section: 'agents/', title: 'Agents', body, searchText: ctx.data.agents.map(a => `${a.name} ${a.job}`).join(' ') };
}

// The rules file: the live /agents/[id].md if it exists, otherwise one
// generated from agents.json in the same shape.
function rulesFile(ctx, agent) {
  const rel = agent.rulesFile.replace(/^\//, '');
  const candidates = [path.join(ctx.repo, rel), path.join(ctx.site, rel)];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      return { text: fs.readFileSync(file, 'utf8'), live: true, href: `${REPO_URL}/blob/main/${path.relative(ctx.repo, file)}` };
    }
  }
  const lines = [
    `# ${agent.name}`,
    '',
    `Stage: ${ctx.data.stages.find(s => s.id === agent.stage).name}`,
    `Tool: ${agent.tool}`,
    `Job: ${agent.job}`,
    '',
    '## Triggered by',
    ...agent.triggeredBy.map(t => `- ${t}`),
    '',
    '## Reads',
    ...agent.reads.map(t => `- ${t}`),
    '',
    '## Steps',
    ...agent.steps.map((t, i) => `${i + 1}. ${t}`),
    '',
    '## Produces',
    ...agent.produces.map(t => `- ${t}`),
    '',
    '## Human gate',
    agent.gate,
    '',
    '## Never',
    ...agent.never.map(t => `- ${t}`),
    '',
    '## Done when',
    agent.doneWhen,
    ''
  ];
  return { text: lines.join('\n'), live: false, href: `${REPO_URL}/blob/main/agentic/data/agents.json` };
}

function agentPage(ctx, agent) {
  const stage = ctx.data.stages.find(s => s.id === agent.stage);
  const all = orderedAgents(ctx);
  const i = all.findIndex(a => a.id === agent.id);
  const link = a => a && { href: `${ctx.root}agents/${a.id}/`, title: a.name };
  const rules = rulesFile(ctx, agent);
  const glance = [
    ['Triggered by', agent.triggeredBy],
    ['Reads', agent.reads],
    ['Produces', agent.produces],
    ['Human gate', [agent.gate]]
  ];

  const panels = [
    breadcrumb([['Agents', `${ctx.root}agents/`], [agent.name]]),
    `<div class="text-block">
    <span class="eyebrow">${esc(stage.name)} stage</span>
    <h1 class="display-02 x-agent-title" data-buckholt="false"><span class="x-agent-title-tag" aria-hidden="true">${agentTag(agent, ctx, { link: false })}</span> ${esc(agent.name)}</h1>
    <p class="body-02 x-lead">${esc(agent.job)}</p>
</div>
<div class="key-value-list key-value-list-row">
    <div class="key-value">
        <span class="key">Stage</span>
        <span class="value">${esc(stage.name)}</span>
    </div>
    <div class="key-value">
        <span class="key">Tool</span>
        <span class="value">${esc(agent.tool)}</span>
    </div>
</div>`,
    `<div class="text-block">
    <h2 class="headline-01" id="at-a-glance">At a glance</h2>
</div>
<div class="row x-row-gap" data-buckholt="false">
${glance.map(([k, v]) => `  <div class="col-12 col-md-6">
    <div class="card card-secondary h-100">
        <div class="card-body">
            <div class="text-block">
                <h3 class="title-01">${esc(k)}</h3>
                <ul class="list">
                    ${v.map(x => `<li class="list-item">${esc(x)}</li>`).join('\n                    ')}
                </ul>
            </div>
        </div>
    </div>
  </div>`).join('\n')}
</div>`,
    `<div class="text-block">
    <h2 class="headline-01" id="steps">Steps</h2>
</div>
<ol class="list">
${agent.steps.map(s => `    <li class="list-item">${esc(s)}</li>`).join('\n')}
</ol>`,
    `<div class="x-constraint" data-buckholt="false">
  <div class="text-block">
      <h2 class="headline-01" id="never">Never</h2>
      <p>${esc(agent.name)} must never:</p>
  </div>
  <ul class="list">
${agent.never.map(n => `      <li class="list-item">
          <span class="list-icon text-error">
              <i class="fa-solid fa-ban" aria-hidden="true"></i>
          </span>
          ${esc(n)}
      </li>`).join('\n')}
  </ul>
</div>`,
    `<div class="text-block">
    <h2 class="headline-01" id="done-when">Done when</h2>
    <p>${esc(agent.doneWhen)}</p>
</div>`,
    `<div class="text-block">
    <h2 class="headline-01" id="owner">Owner and backup</h2>
</div>
<div class="key-value-list key-value-list-row">
    <div class="key-value">
        <span class="key">Owner</span>
        <span class="value">${esc(agent.owner || ctx.data.owner)}</span>
    </div>
    <div class="key-value">
        <span class="key">Backup</span>
        <span class="value">${esc(agent.backup || ctx.data.backup)}</span>
    </div>
</div>`,
    `<div class="text-block">
    <h2 class="headline-01" id="rules-file">Rules file</h2>
    <p>${rules.live
      ? `The current rules file, read from <code>${esc(agent.rulesFile)}</code> when the site was built.`
      : `<code>${esc(agent.rulesFile)}</code> is not in the repo yet, so this is generated from <code>agentic/data/agents.json</code>. The rules file replaces it once it exists.`}</p>
</div>
${codeBlock(rules.text, { label: agent.rulesFile, language: 'markdown' })}
<a class="link-standalone" href="${rules.href}" rel="noopener">
    <span class="icon">
        <i class="fa-regular fa-arrow-up-right-from-square" aria-hidden="true"></i>
    </span>
    View in repo<span class="visually-hidden"> (external site)</span>
</a>`,
    `<div class="text-block">
    <h2 class="headline-01" id="where-it-sits">Where it sits</h2>
    <p>${esc(agent.name)} is outlined in the workflow below.</p>
</div>
${workflowDiagram(ctx, { highlight: agent.id })}`,
    pager(link(all[i - 1]), link(all[i + 1]), 'agent')
  ];
  const toc = [['at-a-glance', 'At a glance'], ['steps', 'Steps'], ['never', 'Never'], ['done-when', 'Done when'], ['owner', 'Owner and backup'], ['rules-file', 'Rules file'], ['where-it-sits', 'Where it sits']].map(([id, title]) => ({ id, title }));
  return {
    slug: `agents/${agent.id}/`, section: 'agents/', title: agent.name, description: agent.job,
    body: withToc(panels, toc),
    searchText: [agent.job, agent.tool, ...agent.triggeredBy, ...agent.reads, ...agent.steps, ...agent.produces, agent.gate, ...agent.never, agent.doneWhen].join(' ')
  };
}

// Guides -------------------------------------------------------------------
// Each guide is a Markdown file in content/guides/<kind>/NN-slug.md, in order.

function loadGuides(ctx, kind) {
  const dir = path.join(ctx.site, 'content/guides', kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => /^\d+.*\.md$/.test(f)).sort().map(f => {
    const file = path.join(dir, f);
    const { meta } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
    return { file, slug: `${kind}/${f.replace(/^\d+-/, '').replace(/\.md$/, '')}/`, title: meta.title, lead: meta.lead };
  });
}

function guideList(ctx, kind) {
  const guides = loadGuides(ctx, kind);
  if (!guides.length) return pendingNote('No guides have been added yet.');
  return `<ol class="list">
${guides.map(g => `    <li class="list-item"><a href="${ctx.root}${g.slug}">${esc(g.title)}</a>${g.lead ? `: ${esc(g.lead.charAt(0).toLowerCase() + g.lead.slice(1))}` : ''}</li>`).join('\n')}
</ol>`;
}

function guidePage(ctx, kind, guides, i) {
  const g = guides[i];
  const { meta, body } = parseFrontMatter(fs.readFileSync(g.file, 'utf8'));
  const { sections, toc } = renderMarkdown(body, ctx, { diagrams: DIAGRAMS, blocks: BLOCKS });
  const nav = NAV.find(n => n.slug === `${kind}/`);
  const setup = kind === 'setup-guides';
  const noun = setup ? 'guide' : 'how-to guide';
  const link = x => x && { href: `${ctx.root}${x.slug}`, title: x.title };
  const progress = Math.round(((i + 1) / guides.length) * 100);
  const panels = [
    breadcrumb([[nav.title, `${ctx.root}${kind}/`], [g.title]]),
    `<div class="text-block">
    <span class="eyebrow">${setup ? 'Guide' : 'How-to guide'} ${i + 1} of ${guides.length}</span>
    <h1 class="display-02">${esc(g.title)}</h1>
    ${meta.lead ? `<p class="body-02 x-lead">${esc(meta.lead)}</p>` : ''}
</div>${setup ? `
<div class="progress" role="progressbar" aria-label="Guide ${i + 1} of ${guides.length}" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar" style="width: ${progress}%"></div>
</div>` : ''}`,
    ...sections.map(s => s.html),
    pager(link(guides[i - 1]), link(guides[i + 1]), noun)
  ];
  return {
    slug: g.slug, section: `${kind}/`, title: g.title, description: meta.lead,
    body: toc.length >= 3 ? withToc(panels, toc) : frame([panels]),
    searchText: body
  };
}

// Search, extensions, 404 ---------------------------------------------------

function searchPage(ctx) {
  const body = frame([[
    pageHeading({ title: 'Search', lead: 'Search every page of this site.' }),
    `<form class="x-search-form" data-buckholt="false" action="${ctx.root}search/" method="get" role="search">
<div class="input">
    <div class="input-label">
        <label for="search-input" class="form-label">Search the site</label>
    </div>
    <div class="input-group">
        <div class="response text-input">
            <input type="search" class="form-control" id="search-input" name="q" autocomplete="off">
        </div>
        <button type="submit" class="btn btn-response">
            <span class="button-label">Search</span>
        </button>
    </div>
</div>
</form>
<script src="${ctx.root}assets/search-index.js"></script>
<div class="x-search-results" data-buckholt="false" data-root="${ctx.root}">
  <p class="x-search-status" role="status">Search needs JavaScript. Every page is also linked from the navigation.</p>
  <ol class="list x-search-list"></ol>
</div>`
  ]]);
  return { slug: 'search/', section: null, title: 'Search', body, noIndex: true };
}

function extensionsPage(ctx) {
  const sample = ctx.agentsById.range;
  const tagMarkup = agentTag(sample, { ...ctx, root: '../' });
  const body = frame([[
    pageHeading({
      title: 'Extensions on this site',
      lead: 'This site is built with Buckholt as it is. These parts are not in Buckholt, so they are extensions: prefixed <code>x-</code>, marked <code>data-buckholt="false"</code>, styled only with Buckholt tokens, and listed in the extensions register.'
    }),
    `<div class="text-block">
    <h2 class="headline-01">Agent tag</h2>
    <p>The tag is the Buckholt Tag in its stage colour. The extension is the link around it, with its hover and focus states.</p>
</div>
${tagSet(orderedAgents(ctx).map(a => agentTag(a, ctx)))}
${codeBlock(tagMarkup, { label: 'Agent tag markup', language: 'html' })}`,
    `<div class="text-block">
    <h2 class="headline-01">Stage colours and contrast</h2>
    <p>Buckholt has four expressive colour families, so Foundation uses the neutral tag and Handoff shares Prototype’s family. The stage is always named in text as well.</p>
    <p>Buckholt’s light expressive Tag colours its label with the family’s deep colour, which is below WCAG AA contrast for two families. On this site the label uses the same family’s rich colour instead. Buckholt’s CSS is not changed.</p>
</div>
${tagSet(ctx.data.stages.map(s => `<span class="${stageTagClass(s.id)}">
        <span class="tag-label">${esc(s.name)}</span>
    </span>`))}`,
    `<div class="text-block">
    <h2 class="headline-01">Code block with copy</h2>
    <p>Buckholt has no code block. The copy control is a Buckholt ghost Button with the Common actions copy icon, shown only when JavaScript is available.</p>
</div>
${codeBlock('npm run build:site\nnpm run dev:site', { label: 'Build and preview the site', language: 'shell' })}`,
    `<div class="text-block">
    <h2 class="headline-01">Everything else</h2>
    <p>The full list, with the tokens each one uses, is in <code>agentic/extensions-register.md</code>.</p>
</div>
<ul class="list">
    <li class="list-item">Site header, sidebar navigation and footer.</li>
    <li class="list-item">Diagrams: inline SVG coloured with Buckholt tokens, with a list version on narrow screens.</li>
    <li class="list-item">“On this page” contents, previous and next links, and the “Never” constraint list.</li>
    <li class="list-item">Search results.</li>
</ul>`
  ]]);
  return { slug: 'extensions/', section: null, title: 'Extensions on this site', body, searchText: 'extensions agent tag code block diagram contrast' };
}

function notFound(ctx) {
  const body = frame([[
    pageHeading({ title: 'Page not found', lead: 'There is no page at this address. It may have moved.' }),
    arrowLink(ctx.root, 'Go to the home page')
  ]]);
  return { slug: '404.html', section: null, title: 'Page not found', body, noIndex: true };
}

export function allPages(ctx) {
  const pagesDir = path.join(ctx.site, 'content/pages');
  const contentFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md')).sort().map(f => path.join(pagesDir, f));
  const makers = [
    home,
    agentsIndex,
    ...orderedAgents(ctx).map(agent => c => agentPage(c, agent)),
    ...contentFiles.map(file => c => contentPage(c, file))
  ];
  for (const kind of ['setup-guides', 'how-to-guides']) {
    const guides = loadGuides(ctx, kind);
    guides.forEach((g, i) => makers.push(c => guidePage(c, kind, guides, i)));
  }
  makers.push(searchPage, extensionsPage, notFound);
  return makers;
}
