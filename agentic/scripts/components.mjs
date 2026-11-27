// Shared helpers and components for the Agentic UX site.
//
// Buckholt components are written with their documented Code & specs markup
// (see components/<name>/examples.html at the repository root). Anything
// Buckholt does not have is an extension: class prefix `x-`, attribute
// data-buckholt="false", styled in agentic/css/extensions.css and listed in
// agentic/extensions-register.md.

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Stage colour families. Buckholt has four expressive families, so Foundation
// uses the neutral Tag and Handoff shares Prototype's family (diagram 1 groups
// them as "Prototype and handoff"). The stage is always named in text too.
export const STAGE_FAMILY = {
  foundation: null,
  discover: 'primary',
  explore: 'tertiary',
  design: 'quaternary',
  prototype: 'secondary',
  handoff: 'secondary'
};

// Buckholt Tag classes for a stage (Tag: Code & specs examples 1 and 8).
// Every tag on this site is Buckholt's small Tag (`tag-sm`).
export function stageTagClass(stageId) {
  const family = STAGE_FAMILY[stageId];
  if (!family) return 'tag tag-sm';
  if (family === 'primary') return 'tag tag-sm expressive-light';
  return `tag tag-sm expressive-light expressive-${family}`;
}

// Agent tag. The inner span is the canonical Buckholt Tag, unchanged; the
// link around it is the extension (Buckholt Tags are not links).
export function agentTag(agent, ctx, { link = true } = {}) {
  const tag = `<span class="${stageTagClass(agent.stage)}">
    <span class="tag-label">${esc(agent.name)}</span>
</span>`;
  if (!link) return tag;
  return `<a class="x-agent-tag" data-buckholt="false" href="${ctx.root}agents/${agent.id}/">${tag}</a>`;
}

// Turn {{agent:id}} tokens in a string into agent tags. Plain words are never
// replaced: "Map", "Build" and "Range" are ordinary words too.
export function agentTokens(html, ctx) {
  return html.replace(/\{\{agent:([a-z]+)\}\}/g, (match, id) => {
    const agent = ctx.agentsById[id];
    if (!agent) throw new Error(`Unknown agent token ${match}`);
    return agentTag(agent, ctx);
  });
}

// Code block with copy (extension). The copy control is a Buckholt ghost
// Button with the Common actions copy icon. It starts hidden and site.js shows
// it, so nothing is offered that cannot work with JavaScript off.
let codeBlockCount = 0;
export function codeBlock(code, { label = '', language = '' } = {}) {
  codeBlockCount += 1;
  const id = `code-${codeBlockCount}`;
  const lang = language ? ` data-language="${esc(language)}"` : '';
  return `<div class="x-code-block" data-buckholt="false">
  <div class="x-code-block-header">
    <span class="x-code-block-label">${esc(label || 'Code')}</span>
    <button type="button" class="btn btn-ghost btn-sm" data-x-copy="${id}" hidden>
        <div class="btn-icon">
            <i class="fa-regular fa-copy" aria-hidden="true"></i>
        </div>
        <span class="button-label">Copy<span class="visually-hidden"> ${esc(label || 'code')}</span></span>
    </button>
  </div>
  <pre class="x-code-block-body" tabindex="0" aria-label="${esc(label || 'Code')}"><code id="${id}"${lang}>${esc(code)}</code></pre>
</div>`;
}

// "Content to follow" marker for pages whose text is still to come from the
// source doc. Buckholt Tag, status info (Tag: Code & specs example 4).
export function pendingNote(text) {
  return `<div class="text-block">
    <p><span class="tag tag-sm tag-status tag-status-info">
        <span class="tag-label">Content to follow</span>
    </span></p>
    <p>${text}</p>
</div>`;
}

export function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Grouped tags. Buckholt documents `.tag-set` (Tag: Code & specs example 9)
// but the runtime only lays it out inside Dropdown, so the extension wrapper
// spaces the tags. The `.tag-set` markup inside is unchanged.
export function tagSet(tagsHtml) {
  return `<div class="x-tag-set" data-buckholt="false">
  <div class="tag-set">
    ${tagsHtml.join('\n    ')}
  </div>
</div>`;
}
