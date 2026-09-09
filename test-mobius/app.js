/*
  Mobius client search exploration — prototype behaviour.

  This is application-layer code for a design exploration. It is not Buckholt
  and must not be treated as a Buckholt API. Every piece of markup it produces
  is canonical Buckholt component markup; this file only decides which
  component to use, with what content, and when.
*/
(function () {
  'use strict';

  var DATA = window.MOBIUS_DATA;
  var STATUS = DATA.STATUS;
  var TODAY = new Date(2026, 8, 8); // 08 September 2026, matching the screenshots

  var state = { query: 'John Smith', selected: null, refine: '', holding: '' };

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function parseDate(d) {
    if (!d) return null;
    var p = d.split('/');
    return new Date(+p[2], +p[1] - 1, +p[0]);
  }

  function money(n) {
    return n == null ? null : '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // How far through its term a policy is. Turns "renews 12/03/2027" into a
  // glanceable signal, which is what a renewal conversation actually needs.
  function termProgress(policy) {
    var s = parseDate(policy.start), e = parseDate(policy.end);
    if (!s || !e) return null;
    var pct = Math.round(((TODAY - s) / (e - s)) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  function daysUntil(dateStr) {
    var d = parseDate(dateStr);
    if (!d) return null;
    return Math.round((d - TODAY) / 86400000);
  }

  // --------------------------------------------------------------------------
  // The identity signature.
  //
  // The supplied references decode as SMI/J/<ddmmyyyy>/<sequence>, so a large
  // share of results share name, date of birth AND address and differ only in
  // the sequence. Grouping on that signature turns "43 results" into "a handful
  // of people, some holding duplicate records" — which is the truth, and is far
  // easier to scan. The group is a scanning aid, not an interaction gate: the
  // records inside stay directly selectable.
  // --------------------------------------------------------------------------
  function signature(c) { return c.name + '|' + c.dob + '|' + c.postcode; }

  function group(clients) {
    var map = {}, order = [];
    clients.forEach(function (c) {
      var k = signature(c);
      if (!map[k]) { map[k] = { key: k, name: c.name, dob: c.dob, postcode: c.postcode,
                                address: c.address, records: [] }; order.push(k); }
      map[k].records.push(c);
    });
    return order.map(function (k) { return map[k]; }).sort(function (a, b) {
      // People with live business first — most calls are about a live policy.
      var liveA = a.records.some(hasLive), liveB = b.records.some(hasLive);
      if (liveA !== liveB) return liveA ? -1 : 1;
      return b.records.length - a.records.length;
    });
  }

  // Documented catalogue entries only.
  function coverIcon(c) {
    if (!c.policies.length) return 'fa-regular fa-user';
    return hasLive(c) ? 'fa-regular fa-shield-check' : 'fa-regular fa-shield';
  }

  function hasLive(c) {
    return c.policies.some(function (p) { return p.status === 'active' || p.status === 'renewal'; });
  }

  // Which fields differ between records inside one group? When records are
  // near-identical, showing what DIFFERS is more useful than showing every
  // field again. Drives the "what tells these apart" line in the detail pane.
  function differentiators(grp) {
    if (grp.records.length < 2) return [];
    var out = [];
    function varies(fn) {
      var seen = grp.records.map(fn);
      return seen.some(function (v) { return v !== seen[0]; });
    }
    if (varies(function (c) { return c.policies.length ? c.policies[0].product : ''; })) out.push('products held');
    if (varies(function (c) { return c.policies.length; })) out.push('number of policies');
    if (varies(function (c) { return c.email || ''; })) out.push('email');
    if (varies(function (c) { return c.phone || ''; })) out.push('telephone');
    return out;
  }

  // --------------------------------------------------------------------------
  // The policy fingerprint.
  //
  // The single most important change from the current product. A broker gets a
  // call ABOUT A POLICY, so product / status / registration is what identifies
  // the record — not the name and address every candidate shares. This puts
  // that signal in the scannable row instead of behind an expand step.
  // --------------------------------------------------------------------------
  function fingerprint(c) {
    if (!c.policies.length) return { text: 'No policies held', tags: [] };

    var ranked = c.policies.slice().sort(function (a, b) { return STATUS[a.status].rank - STATUS[b.status].rank; });
    var lead = ranked[0];
    var products = [];
    c.policies.forEach(function (p) { if (products.indexOf(p.product) === -1) products.push(p.product); });

    var parts = [products.join(' · ')];
    if (lead.reg) parts.push(lead.reg);

    var live = c.policies.filter(function (p) { return p.status === 'active' || p.status === 'renewal'; });
    if (live.length) {
      var d = daysUntil(live[0].end);
      if (d != null && d > 0 && d < 120) parts.push('renews in ' + d + ' days');
    }

    // At most two tags in a row: the leading status, plus a count if there is more.
    var tags = [{ label: STATUS[lead.status].label, cls: STATUS[lead.status].tag }];
    if (c.policies.length > 1) tags.push({ label: '+' + (c.policies.length - 1) + ' more', cls: '' });

    return { text: parts.join(' · '), tags: tags };
  }

  function tagMarkup(t) {
    return '<span class="tag ' + t.cls + ' tag-sm"><span class="tag-label">' + esc(t.label) + '</span></span>';
  }

  // --------------------------------------------------------------------------
  // Filtering
  // --------------------------------------------------------------------------
  function matches(c) {
    var name = state.query.trim().toLowerCase();
    if (name && c.name.toLowerCase().indexOf(name) === -1) return false;

    var q = state.refine.trim().toLowerCase();
    if (q) {
      var hay = [c.ref, c.dob, c.postcode, c.address, c.email, c.phone].join(' ');
      c.policies.forEach(function (p) { hay += ' ' + p.no + ' ' + p.product + ' ' + (p.reg || '') + ' ' + (p.insurer || ''); });
      if (hay.toLowerCase().indexOf(q) === -1) return false;
    }
    if (state.holding === 'none') return c.policies.length === 0;
    if (state.holding) return c.policies.some(function (p) { return p.status === state.holding; });
    return true;
  }

  // --------------------------------------------------------------------------
  // Master list
  // --------------------------------------------------------------------------
  function renderResults() {
    var visible = DATA.clients.filter(matches);
    var groups = group(visible);
    var host = document.getElementById('mxResults');

    document.getElementById('mxResultsEmpty').hidden = visible.length > 0;

    document.getElementById('mxResultSummary').innerHTML =
      visible.length + ' matching record' + (visible.length === 1 ? '' : 's') +
      ' across <strong>' + groups.length + ' ' + (groups.length === 1 ? 'person' : 'people') +
      '</strong>. Records are grouped where name, date of birth and postcode all agree.';

    host.innerHTML = groups.map(function (g) {
      var dupes = g.records.length > 1
        ? '<span class="tag tag-sm"><span class="tag-label">' + g.records.length + ' records</span></span>'
        : '';

      // Group heading. Date of birth is promoted to the identity line because
      // it is the field that actually separates one John Smith from another.
      var head =
        '<div class="mx-group-head">' +
          '<div class="text-block">' +
            '<div class="heading">' +
              '<div class="heading-content">' +
                '<span class="eyebrow">' + esc(g.name) + '</span>' +
                '<h2 class="title-02">Born ' + esc(g.dob) + '</h2>' +
              '</div>' + dupes +
            '</div>' +
            '<p class="support-01">' + esc(g.address) + ', ' + esc(g.postcode) + '</p>' +
          '</div>' +
        '</div>';

      var rows = g.records.map(function (c) {
        var fp = fingerprint(c);
        var on = state.selected === c.ref;
        // A native button: real focus, real Enter/Space, and `aria-pressed`
        // states the selection honestly. A `listbox`/`option` pair was the other
        // candidate, but ARIA requires options to be owned directly by the
        // listbox, which the visual grouping below breaks.
        return '' +
          '<button type="button" class="mx-result" data-ref="' + esc(c.ref) + '"' +
               ' aria-pressed="' + on + '">' +
            '<div class="versatile">' +
              '<div class="versatile-content">' +
                '<div class="versatile-body">' +
                  '<div class="icon-block icon-block-sm' + (hasLive(c) ? ' expressive-light' : '') + '">' +
                    '<i class="' + coverIcon(c) + '" aria-hidden="true"></i>' +
                  '</div>' +
                  '<div class="versatile-meta">' +
                    '<div class="versatile-label">' + esc(c.ref) + '</div>' +
                    '<p class="versatile-text">' + esc(fp.text) + '</p>' +
                  '</div>' +
                '</div>' +
                '<div class="versatile-actions">' +
                  '<div class="tag-set">' + fp.tags.map(tagMarkup).join('') + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</button>';
      }).join('');

      return '<div class="mx-group">' + head + '<div class="mx-group-records">' + rows + '</div></div>';
    }).join('');
  }

  // --------------------------------------------------------------------------
  // Detail pane — the persistent preview
  // --------------------------------------------------------------------------
  function renderDetail() {
    var host = document.getElementById('mxDetailInner');
    var c = DATA.clients.filter(function (x) { return x.ref === state.selected; })[0];

    if (!c) {
      host.innerHTML =
        '<div class="card mx-empty">' +
          '<div class="card-body">' +
            '<div class="icon-block icon-block-xl">' +
              '<i class="fa-regular fa-magnifying-glass" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="text-block">' +
              '<h2 class="title-02">Choose a record to compare</h2>' +
              '<p class="body-02">Selecting a record shows what they hold without leaving the ' +
                'results, so you can move between similar clients until you are confident.</p>' +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var grp = group(DATA.clients).filter(function (g) { return g.key === signature(c); })[0];
    var diffs = differentiators(grp);

    var identity =
      '<div class="summary-meta">' +
        '<div class="icon-block icon-block-xxl expressive-dark expressive-primary">' +
          '<i class="fa-regular fa-user" aria-hidden="true"></i>' +
        '</div>' +
        '<div class="summary-meta-body">' +
          '<h2 class="summary-meta-headline">' + esc(c.name) + '</h2>' +
          '<div class="summary-meta-label">' + esc(c.ref) + '</div>' +
          '<p class="summary-meta-text">Born ' + esc(c.dob) + ' · ' + esc(c.address) + ', ' + esc(c.postcode) + '</p>' +
        '</div>' +
      '</div>';

    // Only shown when records genuinely collide. Tells the broker what to look
    // at rather than repeating fields that are identical across candidates.
    var ambiguity = grp.records.length > 1
      ? '<div class="alert alert-info" role="alert">' +
          '<div class="alert-content">' +
            '<span class="alert-icon"><i class="fa-solid fa-circle-info" aria-hidden="true"></i></span>' +
            '<div class="alert-body">' +
              '<div class="alert-message"><h6>' + grp.records.length + ' records share this name, date of birth and postcode</h6></div>' +
              '<div class="alert-note">' +
                (diffs.length
                  ? 'They differ by ' + esc(diffs.join(', ')) + '. Compare the policies below.'
                  : 'Nothing on file separates them. Confirm with the client before proceeding.') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      : '';

    var contact =
      '<div class="key-value-table">' +
        kv('Telephone', c.phone || 'Not held') +
        kv('Email', c.email || 'Not held') +
        kv('Client reference', c.ref) +
      '</div>';

    var policies = c.policies.length
      ? c.policies.slice().sort(function (a, b) { return STATUS[a.status].rank - STATUS[b.status].rank; })
          .map(policyTile).join('')
      : '<p class="body-02 mx-quiet">No policies held. This record has never been converted.</p>';

    // Below lg the panes stack, so the preview needs its own way back up to the
    // list. Above lg both are on screen and the control would be noise.
    var backUp =
      '<a class="link-standalone mx-detail-back" href="#mxResults">' +
        '<span class="icon"><i class="fa-regular fa-arrow-left"></i></span>' +
        'Back to results' +
      '</a>';

    // The actions sit directly under the identity they act on, not at the foot
    // of the card: the pane is pinned, so anything below the fold of a long
    // policy list would be out of reach.
    var actions =
      '<div class="button-set button-set-no-offset">' +
        '<button type="button" class="btn btn-primary" id="mxOpen">' +
          '<span class="button-label">Open client</span>' +
          '<div class="btn-icon"><i class="fa-regular fa-arrow-right" aria-hidden="true"></i></div>' +
        '</button>' +
        '<button type="button" class="btn btn-secondary" id="mxQuote">' +
          '<span class="button-label">New quote</span>' +
        '</button>' +
      '</div>';

    // Card supplies the surface, the padding and the 1.5rem body rhythm, so the
    // application layer contributes no surface of its own here.
    host.innerHTML =
      '<div class="card">' +
        '<div class="card-body">' +
          backUp +
          identity +
          actions +
          ambiguity +

          '<div class="mx-detail-section">' +
            '<div class="text-block">' +
              '<div class="heading">' +
                '<div class="heading-content"><h3 class="title-02">Policies</h3></div>' +
                '<span class="tag tag-sm"><span class="tag-label">' + c.policies.length + '</span></span>' +
              '</div>' +
            '</div>' +
            '<div class="mx-policy-list">' + policies + '</div>' +
          '</div>' +

          '<div class="mx-detail-section">' +
            '<div class="text-block">' +
              '<div class="heading"><div class="heading-content"><h3 class="title-02">Contact</h3></div></div>' +
            '</div>' +
            contact +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('mxOpen').addEventListener('click', function () { openClient(c.ref); });
    document.getElementById('mxQuote').addEventListener('click', function () { openClient(c.ref); });
  }

  function kv(k, v) {
    return '<div class="key-value"><span class="key">' + esc(k) + '</span>' +
           '<span class="value">' + esc(v) + '</span></div>';
  }

  // A policy as a Versa-tile. The documented progress-bar variant carries term
  // elapsed, so "how close is this to renewal" is legible without reading dates.
  function policyTile(p) {
    var st = STATUS[p.status];
    var pct = termProgress(p);

    var line = [p.insurer, money(p.premium), p.reg].filter(Boolean).join(' · ');
    var dates = p.end ? p.start + ' – ' + p.end : 'Started ' + p.start;

    return '' +
      '<div class="versatile mx-policy">' +
        '<div class="versatile-content">' +
          '<div class="versatile-body">' +
            '<div class="icon-block icon-block-sm">' +
              '<i class="fa-regular fa-shield" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="versatile-meta">' +
              '<div class="versatile-label">' + esc(p.product) + '</div>' +
              '<p class="versatile-text">' + esc(p.no) + (line ? ' · ' + esc(line) : '') + '</p>' +
              '<p class="versatile-text mx-quiet">' + esc(dates) + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="versatile-actions">' +
            '<div class="tag-set">' +
              '<span class="tag ' + st.tag + ' tag-sm"><span class="tag-label">' + esc(st.label) + '</span></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        (pct != null && (p.status === 'active' || p.status === 'renewal')
          ? '<div class="progress progress-sm" role="progressbar" aria-label="Policy term elapsed"' +
            ' aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
              '<div class="progress-bar" style="width: ' + pct + '%"></div>' +
            '</div>'
          : '') +
      '</div>';
  }

  // --------------------------------------------------------------------------
  // Client summary — anchored on holdings, not on a stack of equal panels
  // --------------------------------------------------------------------------
  function openClient(ref) {
    var c = DATA.clients.filter(function (x) { return x.ref === ref; })[0];
    if (!c) return;

    document.getElementById('viewSearch').hidden = true;
    document.getElementById('viewClient').hidden = false;
    document.getElementById('mxContext').hidden = false;

    document.getElementById('mxContextIdentity').innerHTML =
      '<span class="label-01 mx-context-name">' + esc(c.name) + '</span>' +
      '<span class="mx-context-sep" aria-hidden="true">·</span>' +
      '<span class="support-01">Born ' + esc(c.dob) + '</span>' +
      '<span class="mx-context-sep" aria-hidden="true">·</span>' +
      '<span class="support-01">' + esc(c.ref) + '</span>';

    var live = c.policies.filter(function (p) { return p.status === 'active' || p.status === 'renewal'; });
    var gwp = live.reduce(function (t, p) { return t + (p.premium || 0); }, 0);
    var needsAttention = c.policies.filter(function (p) {
      return p.status === 'renewal' || p.status === 'incomplete';
    });

    var policies = c.policies.length
      ? c.policies.slice().sort(function (a, b) { return STATUS[a.status].rank - STATUS[b.status].rank; })
          .map(policyTile).join('')
      : '<p class="body-02 mx-quiet">No policies held.</p>';

    document.getElementById('viewClient').innerHTML =
      // Panel 1 — identity and the actions the broker most likely came for.
      '<div class="page-panel">' +
        '<div class="row mx-client-head">' +
          '<div class="col-12 col-lg-7">' +
            '<div class="summary-meta">' +
              '<div class="icon-block icon-block-xxl expressive-dark expressive-primary">' +
                '<i class="fa-regular fa-user" aria-hidden="true"></i>' +
              '</div>' +
              '<div class="summary-meta-body">' +
                '<h1 class="summary-meta-headline">' + esc(c.name) + '</h1>' +
                '<div class="summary-meta-label">' + esc(c.ref) + '</div>' +
                '<p class="summary-meta-text">Born ' + esc(c.dob) + ' · ' + esc(c.address) + ', ' + esc(c.postcode) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="col-12 col-lg-5 mx-client-actions">' +
            '<div class="button-set button-set-no-offset">' +
              '<div class="menu">' +
                '<button type="button" class="btn btn-secondary menu-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                  '<span class="button-label">Client actions</span>' +
                  '<div class="btn-icon"><i class="fa-solid fa-caret-down" aria-hidden="true"></i></div>' +
                '</button>' +
                '<div class="menu-panel dropdown-menu dropdown-menu-end">' +
                  '<ul class="menu-body" role="menu">' +
                    '<li><button class="menu-item" type="button"><i class="fa-regular fa-pencil"></i>Edit client details</button></li>' +
                    '<li><button class="menu-item" type="button"><i class="fa-regular fa-user-group"></i>Link another client</button></li>' +
                    '<li><button class="menu-item" type="button"><i class="fa-regular fa-shield"></i>View claims</button></li>' +
                    '<li><hr class="menu-divider"></li>' +
                    '<li><button class="menu-item menu-item-danger" type="button"><i class="fa-regular fa-trash-can"></i>Delete record</button></li>' +
                  '</ul>' +
                '</div>' +
              '</div>' +
              '<button type="button" class="btn btn-primary">' +
                '<div class="btn-icon"><i class="fa-regular fa-plus" aria-hidden="true"></i></div>' +
                '<span class="button-label">New quote</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Panel 2 — the standing position, in three numbers rather than three panels.
      '<div class="page-panel">' +
        '<div class="grid key-value-grid mx-stats">' +
          '<div class="key-value-item">' +
            '<div class="key-value key-value-stacked key-value-flipped key-value-lg">' +
              '<span class="key">Live policies</span>' +
              '<span class="value">' + live.length + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="key-value-item">' +
            '<div class="key-value key-value-stacked key-value-flipped key-value-lg">' +
              '<span class="key">Annual premium</span>' +
              '<span class="value">' + (gwp ? money(gwp) : '£0.00') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="key-value-item">' +
            '<div class="key-value key-value-stacked key-value-flipped key-value-lg">' +
              '<span class="key">Open claims</span>' +
              '<span class="value">' + c.claims + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Panel 3 — holdings anchor the page. Everything else is disclosed by tab.
      '<div class="page-panel">' +
        '<div class="tabs">' +
          '<div class="tab-items">' +
            '<div class="tab-items-scroll">' +
              '<ul class="nav nav-underline" role="tablist">' +
                tab('policies', 'Policies', true, c.policies.length) +
                tab('attention', 'Needs attention', false, needsAttention.length) +
                tab('relationships', 'Relationships', false, c.connected) +
                tab('admin', 'Admin', false, null) +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="tab-content">' +

            pane('policies', true,
              '<div class="mx-policy-list">' + policies + '</div>') +

            pane('attention', false, needsAttention.length
              ? '<div class="mx-policy-list">' + needsAttention.map(policyTile).join('') + '</div>'
              : '<p class="body-02 mx-quiet">Nothing needs attention on this client.</p>') +

            pane('relationships', false,
              (c.connected
                ? '<div class="mx-policy-list">' +
                    '<div class="versatile">' +
                      '<div class="versatile-content"><div class="versatile-body">' +
                        '<div class="icon-block icon-block-sm"><i class="fa-regular fa-user-group" aria-hidden="true"></i></div>' +
                        '<div class="versatile-meta">' +
                          '<div class="versatile-label">Darran Hancox</div>' +
                          '<p class="versatile-text">Company · darran.hancox@opengi.co.uk · B50 4DP</p>' +
                        '</div>' +
                      '</div></div>' +
                    '</div>' +
                  '</div>'
                : '<p class="body-02 mx-quiet">No connected clients.</p>') +
              (grpDupeNote(c))) +

            pane('admin', false,
              '<div class="key-value-table">' +
                kv('Client reference', c.ref) +
                kv('Date of birth', c.dob) +
                kv('Address', c.address + ', ' + c.postcode) +
                kv('Telephone', c.phone || 'Not held') +
                kv('Email', c.email || 'Not held') +
                kv('Customer portal access', c.portal ? 'On' : 'Off') +
              '</div>') +

          '</div>' +
        '</div>' +
      '</div>';

    window.scrollTo(0, 0);
  }

  // Duplicate records are surfaced here, on the client page, where they are a
  // data-quality task — not on the search screen where they are noise.
  function grpDupeNote(c) {
    var grp = group(DATA.clients).filter(function (g) { return g.key === signature(c); })[0];
    if (!grp || grp.records.length < 2) return '';
    return '<div class="mx-detail-section">' +
      '<div class="alert alert-warning" role="alert">' +
        '<div class="alert-content">' +
          '<span class="alert-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></span>' +
          '<div class="alert-body">' +
            '<div class="alert-message"><h6>' + (grp.records.length - 1) + ' other record' +
              (grp.records.length === 2 ? '' : 's') + ' share this identity</h6></div>' +
            '<div class="alert-note">Same name, date of birth and postcode. Review whether these should be merged.</div>' +
            '<div class="alert-contextbar">' +
              '<button type="button" class="btn btn-secondary btn-sm"><span class="button-label">Review duplicates</span></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>';
  }

  function tab(id, label, active, count) {
    var badge = count != null && count > 0
      ? ' <span class="tag tag-sm"><span class="tag-label">' + count + '</span></span>' : '';
    return '<li class="nav-item" role="presentation">' +
      '<button class="nav-link' + (active ? ' active' : '') + '" id="mx-' + id + '-tab" data-bs-toggle="pill"' +
      ' data-bs-target="#mx-' + id + '" type="button" role="tab" aria-controls="mx-' + id + '"' +
      ' aria-selected="' + active + '">' + label + badge + '</button></li>';
  }

  function pane(id, active, body) {
    return '<div class="tab-pane fade' + (active ? ' active show' : '') + '" id="mx-' + id + '"' +
      ' role="tabpanel" aria-labelledby="mx-' + id + '-tab" tabindex="0">' + body + '</div>';
  }

  // --------------------------------------------------------------------------
  // Wiring
  // --------------------------------------------------------------------------
  function select(ref) {
    state.selected = ref;
    renderResults();
    renderDetail();
    // Below lg the panes are stacked, so bring the preview into view rather than
    // leaving the broker to wonder whether anything happened.
    if (window.matchMedia('(max-width: 991.98px)').matches) {
      document.getElementById('mxDetail').scrollIntoView({ block: 'start' });
    }
  }

  document.getElementById('mxResults').addEventListener('click', function (e) {
    var row = e.target.closest('.mx-result');
    if (row) select(row.getAttribute('data-ref'));
  });

  // Enter and Space come free with the native button; only roving arrow-key
  // movement is added, because a broker comparing near-identical records moves
  // up and down the list far more than they tab through it.
  document.getElementById('mxResults').addEventListener('keydown', function (e) {
    var row = e.target.closest('.mx-result');
    if (!row) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var all = [].slice.call(document.querySelectorAll('.mx-result'));
      var i = all.indexOf(row) + (e.key === 'ArrowDown' ? 1 : -1);
      if (all[i]) { all[i].focus(); select(all[i].getAttribute('data-ref')); }
    }
  });

  document.getElementById('mxRefineText').addEventListener('input', function (e) {
    state.refine = e.target.value;
    renderResults();
  });

  document.getElementById('mxRefineHolding').addEventListener('change', function (e) {
    state.holding = e.target.value;
    renderResults();
  });

  document.getElementById('mxBack').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('viewClient').hidden = true;
    document.getElementById('viewSearch').hidden = false;
    document.getElementById('mxContext').hidden = true;
    window.scrollTo(0, 0);
  });

  function runSearch() {
    var v = document.getElementById('mxSearch').value.trim();
    state.query = v;
    state.selected = null;
    document.getElementById('mxResultHeading').textContent = v || 'All clients';
    renderResults();
    renderDetail();
  }

  document.getElementById('mxSearchGo').addEventListener('click', runSearch);
  document.getElementById('mxSearch').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
  });

  renderResults();
  renderDetail();
})();
