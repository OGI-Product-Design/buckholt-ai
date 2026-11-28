// Page shell: Buckholt base layout 03 (header across the top, sidebar and
// main, footer across the bottom), with Main holding Page body → Frame.
// Header, sidebar navigation and footer content are extensions: Buckholt
// documents the layout regions but no site header, global navigation or
// footer component (Page navigation is for sibling pages, not global
// navigation).

import { esc, formatDate } from './components.mjs';

export const NAV = [
  { slug: '', title: 'Home' },
  { slug: 'workflow/', title: 'Workflow' },
  { slug: 'agents/', title: 'Agents' },
  { slug: 'toolset/', title: 'Toolset' },
  { slug: 'repo-and-buckholt/', title: 'Repo and Buckholt' },
  { slug: 'artifacts-and-templates/', title: 'Artifacts and templates' },
  { slug: 'azure-devops/', title: 'Azure DevOps' },
  { slug: 'working-with-product/', title: 'Working with product' },
  { slug: 'setup-guides/', title: 'Set-up guides' },
  { slug: 'how-to-guides/', title: 'How-to guides' },
  { slug: 'governance/', title: 'Governance and rollout' }
];

const SITE_NAME = 'Agentic UX';

function navList(page, root) {
  return NAV.map(item => {
    const current = item.slug === page.section;
    const exact = item.slug === page.slug;
    const aria = current ? (exact ? ' aria-current="page"' : ' aria-current="true"') : '';
    return `<li><a class="action-01 x-site-nav-link" href="${root}${item.slug}"${aria}>${esc(item.title)}</a></li>`;
  }).join('\n          ');
}

export function renderPage(page, ctx) {
  const root = ctx.root;
  const title = page.slug === '' ? `${SITE_NAME}: OGI agentic design workflow` : `${page.title} · ${SITE_NAME}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description || ctx.description)}">
<meta name="robots" content="noindex, nofollow">
<script>document.documentElement.classList.add('x-js');</script>
<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">
<script src="https://kit.fontawesome.com/ca92816a31.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="${root}assets/buckholt/buckholt.css">
<link rel="stylesheet" href="${root}assets/buckholt/buckholt-ai-fixes.css">
<link rel="stylesheet" href="${root}assets/extensions.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" defer></script>
<script src="${root}assets/site.js" defer></script>
</head>
<body>
<a class="visually-hidden-focusable x-skip-link" data-buckholt="false" href="#main">Skip to main content</a>
<div class="layout x-site" data-layout="layout-03" data-layout-surface="flush">
  <header class="x-site-header" data-buckholt="false">
    <a class="x-site-name" href="${root}">
      <span class="title-02 x-site-name-title">${SITE_NAME}</span>
      <span class="body-01 x-site-name-sub">OGI agentic design workflow</span>
    </a>
    <span class="tag tag-sm tag-status tag-status-info">
        <span class="tag-label">Proposed</span>
    </span>
    <a class="link-standalone x-header-search" href="${root}search/">
        <span class="icon">
            <i class="fa-regular fa-magnifying-glass" aria-hidden="true"></i>
        </span>
        Search
    </a>
    <button type="button" class="btn btn-ghost x-nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="sidebar" data-bs-toggle="tooltip" data-bs-title="Menu" hidden>
        <div class="btn-icon">
            <svg class="x-icon x-icon-open" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            <svg class="x-icon x-icon-close" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </div>
    </button>
  </header>
  <aside id="sidebar" class="x-site-sidebar" data-buckholt="false">
    <nav class="x-site-nav" aria-label="Main">
      <ul>
          ${navList(page, root)}
      </ul>
    </nav>
  </aside>
  <main id="main" tabindex="-1">
    <div class="page-body">
${page.body}
    </div>
  </main>
  <footer class="body-01 x-site-footer" data-buckholt="false">
    <p>Proposed workflow, for review. Owner: ${esc(ctx.data.owner)}. Backup: ${esc(ctx.data.backup)}.</p>
    <p>Last updated ${esc(formatDate(ctx.buildDate))}. <a href="${root}extensions/">Extensions on this site</a></p>
  </footer>
</div>
<div class="modal fade x-diagram-modal" id="x-diagram-modal" tabindex="-1" aria-labelledby="x-diagram-modal-title" aria-hidden="true" data-buckholt="false">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <div class="text-block">
                    <div class="heading">
                        <div class="heading-content">
                            <h2 class="headline-02" id="x-diagram-modal-title">Diagram</h2>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
            </div>
            <div class="modal-body x-diagram-modal-body"></div>
        </div>
    </div>
</div>
</body>
</html>
`;
}

// Standard page frame: Frame → container → Pane(s). Each pane is an array of
// panel HTML strings.
export function frame(panes) {
  const paneHtml = panes.map(panels => `        <div class="page-pane">
${panels.map(p => `          <div class="page-panel">\n<div class="content-group">\n${p}\n</div>\n          </div>`).join('\n')}
        </div>`).join('\n');
  return `      <div class="page-frame">
        <div class="container">
${paneHtml}
        </div>
      </div>`;
}

// Page heading block: Buckholt Text block (Code & specs examples 1 and 3).
export function pageHeading({ eyebrow = '', title, lead = '' }) {
  return `<div class="text-block">
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
    <h1 class="display-02">${esc(title)}</h1>
    ${lead ? `<p class="body-02 x-lead">${lead}</p>` : ''}
</div>`;
}
