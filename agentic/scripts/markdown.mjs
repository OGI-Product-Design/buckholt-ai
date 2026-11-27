// A small Markdown renderer for this site's content files, with no
// dependencies. It covers what the content uses and outputs Buckholt markup:
//
//   ---                       front matter (key: value lines)
//   ## Heading / ### Heading  Text block headings; each ## starts a section
//   paragraphs, **bold**, `code`, [text](url)
//   - item / 1. item          Buckholt List (one nested level, two-space indent)
//   | a | b |                 Buckholt Table (first row is the header)
//   ```lang "Label"           x-code-block with copy
//   > Note: text              Buckholt Alert (info) for a note
//   {{agent:id}}              agent tag, inline
//   {{diagram:id}}            a diagram, on a line of its own
//   {{block:name}}            a generated block from data, on a line of its own
//
// Anything outside that is rendered as a paragraph, never as raw HTML.

import { esc, agentTokens, codeBlock } from './components.mjs';

export function parseFrontMatter(source) {
  const m = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: source };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: source.slice(m[0].length) };
}

export function slugify(text) {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Inline formatting. Text is escaped first; only the syntax below becomes HTML.
export function inline(text, ctx) {
  let out = esc(text);
  const codes = [];
  out = out.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
    const external = /^https?:/.test(href);
    const url = external ? href : href.replace(/^\//, ctx.root);
    if (external) {
      return `<a href="${url}" rel="noopener">${label}<span class="visually-hidden"> (external site)</span></a>`;
    }
    return `<a href="${url}">${label}</a>`;
  });
  out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[Number(i)]}</code>`);
  return agentTokens(out, ctx);
}

function table(rows, ctx) {
  const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  return `<div class="table-container">
  <div class="table-content" tabindex="0" role="region" aria-label="${esc(head.map(h => h.replace(/[`*{}]/g, '')).join(', '))}, table">
    <table class="table">
      <thead>
        <tr>
          ${head.map(h => `<th scope="col"><div class="table-header-label">${inline(h, ctx)}</div></th>`).join('\n          ')}
        </tr>
      </thead>
      <tbody>
        <tr class="table-gap"><td colspan="${head.length}"></td></tr>
        ${body.map(r => `<tr>\n          ${r.map(c => `<td>${inline(c, ctx)}</td>`).join('\n          ')}\n        </tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>
</div>`;
}

function list(lines, ctx) {
  const ordered = /^\d+\.\s/.test(lines[0]);
  const tag = ordered ? 'ol' : 'ul';
  const items = [];
  for (const line of lines) {
    const nested = /^\s{2,}(?:[-*]|\d+\.)\s+/.test(line);
    const text = line.replace(/^\s*(?:[-*]|\d+\.)\s+/, '');
    if (nested && items.length) items[items.length - 1].children.push(text);
    else items.push({ text, children: [] });
  }
  const li = it => {
    const kids = it.children.length
      ? `\n        <ul>\n${it.children.map(c => `            <li class="list-item">${inline(c, ctx)}</li>`).join('\n')}\n        </ul>\n    `
      : '';
    return `    <li class="list-item">${inline(it.text, ctx)}${kids}</li>`;
  };
  return `<${tag} class="list">\n${items.map(li).join('\n')}\n</${tag}>`;
}

// Alert, info status (Alert: Code & specs "Alert status" example). The
// message is a short title; the note carries the text.
function note(text, ctx) {
  const m = text.match(/^([^:]{1,40}):\s*(.*)$/);
  const title = m ? m[1] : 'Note';
  const body = m ? m[2] : text;
  return `<div class="alert alert-info" role="note">
    <div class="alert-content">
        <span class="alert-icon">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        </span>
        <div class="alert-body">
            <div class="alert-message">
                <p class="x-alert-title">${esc(title)}</p>
            </div>
            <div class="alert-note">
                ${inline(body, ctx)}
            </div>
        </div>
    </div>
</div>`;
}

// Render a Markdown body into sections. Returns { sections, toc } where each
// section is { id, title, html } and the first section may have no title.
export function renderMarkdown(body, ctx, { diagrams = {}, blocks = {} } = {}) {
  const lines = body.replace(/\r/g, '').split('\n');
  const sections = [{ id: null, title: null, items: [] }];
  let textBlock = [];
  const cur = () => sections[sections.length - 1];
  // Prose (text, lists, notes) is grouped so it flows at Buckholt's content
  // spacing; diagrams, tables and code sit at the panel's wider spacing.
  const prose = html => cur().items.push({ html, prose: true });
  const wide = html => cur().items.push({ html, prose: false });
  const flushText = () => {
    if (textBlock.length) prose(`<div class="text-block">\n    ${textBlock.join('\n    ')}\n</div>`);
    textBlock = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    let m;
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith('###')) {
      flushText();
      const id = slugify(m[1]);
      sections.push({ id, title: m[1], items: [] });
      textBlock.push(`<h2 class="headline-01" id="${id}">${inline(m[1], ctx)}</h2>`);
      i++; continue;
    }
    if ((m = line.match(/^###\s+(.+)$/))) {
      flushText();
      textBlock.push(`<h3 class="title-02" id="${slugify(m[1])}">${inline(m[1], ctx)}</h3>`);
      i++; continue;
    }
    if ((m = line.match(/^\{\{diagram:([a-z0-9-]+)(?:\s+([a-z]+))?\}\}$/))) {
      flushText();
      const make = diagrams[m[1]];
      if (!make) throw new Error(`Unknown diagram ${m[1]}`);
      wide(make(ctx, m[2] ? { highlight: m[2] } : {}));
      i++; continue;
    }
    if ((m = line.match(/^\{\{block:([a-z0-9-]+)\}\}$/))) {
      flushText();
      const make = blocks[m[1]];
      if (!make) throw new Error(`Unknown block ${m[1]}`);
      wide(make(ctx));
      i++; continue;
    }
    if ((m = line.match(/^```(\w*)\s*(?:"([^"]*)")?\s*$/))) {
      flushText();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      wide(codeBlock(code.join('\n'), { label: m[2] || '', language: m[1] }));
      continue;
    }
    if (line.startsWith('|')) {
      flushText();
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      wide(table(rows, ctx));
      continue;
    }
    if (/^(?:[-*]|\d+\.)\s+/.test(line)) {
      flushText();
      const items = [];
      while (i < lines.length && (/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i]))) items.push(lines[i++]);
      prose(list(items, ctx));
      continue;
    }
    if (line.startsWith('> ')) {
      flushText();
      const parts = [];
      while (i < lines.length && lines[i].startsWith('> ')) parts.push(lines[i++].slice(2));
      prose(note(parts.join(' '), ctx));
      continue;
    }
    // Paragraph: consecutive plain lines.
    const para = [];
    // Always take the current line, so a line no other rule claims can never
    // stop the renderer from moving on.
    para.push(lines[i++]);
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|\||>\s|\{\{(diagram|block):|\s*(?:[-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++]);
    textBlock.push(`<p>${inline(para.join(' '), ctx)}</p>`);
  }
  flushText();

  const group = items => {
    const out = [];
    for (const it of items) {
      const last = out[out.length - 1];
      if (it.prose && last && last.prose) last.parts.push(it.html);
      else out.push({ prose: it.prose, parts: [it.html] });
    }
    return out.map(g => (g.prose
      ? `<div class="content-group x-prose" data-buckholt="false">\n${g.parts.join('\n')}\n</div>`
      : g.parts[0])).join('\n');
  };
  const out = sections.filter(s => s.items.length).map(s => ({ id: s.id, title: s.title, html: group(s.items) }));
  return { sections: out, toc: out.filter(s => s.id).map(s => ({ id: s.id, title: s.title })) };
}
