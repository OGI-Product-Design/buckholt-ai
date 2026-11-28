// Build the Agentic UX site into agentic/site.
//
//   node scripts/build.mjs        (or: npm run build:site, from agentic/)
//
// Reads agentic/data, agentic/content and agentic/css|js, plus the two
// Buckholt stylesheets in the repository's css/ folder, which are copied into
// the output unchanged. It writes only to agentic/site.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from './layout.mjs';
import { allPages } from './pages.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const REPO = path.resolve(SITE, '..');
const DIST = path.join(SITE, 'site');
const ROOT_TOKEN = '__X_ROOT__/';

// Searchable text: Markdown and tokens stripped down to words.
function plainText(source) {
  return source
    .replace(/^---[\s\S]*?---/, '')
    .replace(/\{\{agent:([a-z]+)\}\}/g, (m, id) => id.charAt(0).toUpperCase() + id.slice(1))
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`|>[\]()_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function build({ quiet = false } = {}) {
  const data = JSON.parse(fs.readFileSync(path.join(SITE, 'data/agents.json'), 'utf8'));
  const agentsById = Object.fromEntries(data.agents.map(a => [a.id, a]));
  const buildDate = new Date();

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const baseCtx = {
    data,
    agentsById,
    buildDate,
    root: ROOT_TOKEN,
    site: SITE,
    repo: REPO,
    description: 'How the OGI UX team proposes to run design with twelve agents, two gates and Buckholt.'
  };

  const written = [];
  const searchIndex = [];
  for (const make of allPages(baseCtx)) {
    const page = make(baseCtx);
    let html = renderPage(page, baseCtx);

    // Relative links, so the site works from any host, path or from disk.
    let file;
    let root;
    if (page.slug.endsWith('.html')) {
      file = page.slug;
      root = './';
    } else {
      file = path.join(page.slug, 'index.html');
      const depth = page.slug.split('/').filter(Boolean).length;
      root = depth === 0 ? './' : '../'.repeat(depth);
    }
    html = html.split(ROOT_TOKEN).join(root);
    // Every internal link names its index.html, so the site also works when
    // opened straight from disk, where a folder link would show a listing.
    html = html.replace(/(href|action)="((?:\.\.?\/)+(?:[^"#?:]*\/)?)"/g, '$1="$2index.html"');

    const out = path.join(DIST, file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    written.push(file);
    if (!page.noIndex) {
      searchIndex.push({
        title: page.title,
        url: page.slug.endsWith('.html') ? page.slug : `${page.slug}index.html`,
        description: page.description || '',
        text: plainText(page.searchText || '')
      });
    }
  }

  // Assets. Buckholt CSS is copied, never modified.
  const assets = path.join(DIST, 'assets');
  fs.mkdirSync(path.join(assets, 'buckholt'), { recursive: true });
  for (const f of ['buckholt.css', 'buckholt-ai-fixes.css']) {
    fs.copyFileSync(path.join(REPO, 'css', f), path.join(assets, 'buckholt', f));
  }
  fs.copyFileSync(path.join(SITE, 'css/extensions.css'), path.join(assets, 'extensions.css'));
  // A script rather than JSON, so search also works from disk (browsers
  // block fetch() on file:// pages).
  fs.writeFileSync(path.join(assets, 'search-index.js'), `window.X_SEARCH_INDEX = ${JSON.stringify(searchIndex)};\n`);
  fs.copyFileSync(path.join(SITE, 'js/site.js'), path.join(assets, 'site.js'));

  if (!quiet) console.log(`Built ${written.length} pages into ${path.relative(process.cwd(), DIST) || DIST}`);
  return written;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build();
}
