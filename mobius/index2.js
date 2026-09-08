/*
  Mobius PAS — Buckholt UI reskin (index2)
  ---------------------------------------
  Application behaviour only. It decides which documented Buckholt component to
  emit and with what content; it makes no styling decisions. Interaction intent
  is copied from the existing Mobius screen: expandable client rows, expandable
  policy rows within them, and navigation into the client homepage.

  Isolated from app.js — the two share no globals.
*/
(function () {
  'use strict';

  var D = window.MOBIUS_LEGACY;
  var uid = 0;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Buckholt Button, ghost, icon-only — the row disclosure control.
  // NOT DOCUMENTED: Buckholt Table documents no expandable-row pattern. The
  // control itself is a documented Button; the detail row beneath it is plain
  // table semantics.
  function expander(targetId, label) {
    return '<button type="button" class="btn btn-ghost btn-sm mx2-expander"' +
      ' aria-expanded="false" aria-controls="' + targetId + '" aria-label="' + esc(label) + '">' +
      '<div class="btn-icon"><i class="fa-regular fa-chevron-right" aria-hidden="true"></i></div>' +
      '</button>';
  }

  // Buckholt Key-value pair, grid variant.
  function kvItem(key, value) {
    return '<div class="key-value-item">' +
      '<div class="key-value key-value-stacked">' +
        '<span class="key">' + esc(key) + '</span>' +
        '<span class="value">' + esc(value) + '</span>' +
      '</div>' +
    '</div>';
  }

  // Buckholt Key-value pair, stacked and flipped: value above label, as the
  // Mobius statistic tiles present them.
  function statItem(label, value) {
    return '<div class="key-value-item">' +
      '<div class="key-value key-value-stacked key-value-flipped key-value-lg">' +
        '<span class="key">' + esc(label) + '</span>' +
        '<span class="value">' + esc(value) + '</span>' +
      '</div>' +
    '</div>';
  }

  // Buckholt Menu button, icon-only ghost toggle — the "..." row action.
  function rowMenu(name) {
    var id = 'mx2menu' + (++uid);
    return '<div class="menu">' +
      '<button type="button" class="btn btn-ghost menu-toggle" id="' + id + '"' +
        ' data-bs-toggle="dropdown" aria-expanded="false" aria-label="Actions for ' + esc(name) + '">' +
        '<div class="btn-icon"><i class="fa-regular fa-ellipsis" aria-hidden="true"></i></div>' +
      '</button>' +
      '<div class="menu-panel dropdown-menu dropdown-menu-end">' +
        '<ul class="menu-body" role="menu">' +
          '<li><button class="menu-item" type="button">View Client</button></li>' +
          '<li><button class="menu-item" type="button">Add Client Link</button></li>' +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  // ---------------------------------------------------------------------------
  // SCREEN 1 — Search results
  // ---------------------------------------------------------------------------

  // The expanded policy row: Policy Expiry / Brand-Agent / Premium / Scheme,
  // then Timewarp and the View split button. Field order preserved.
  function policyDetail(p, id) {
    var d = p.detail;
    return '<tr class="mx2-detail-row" id="' + id + '" hidden>' +
      '<td colspan="7">' +
        '<div class="mx2-detail-inner">' +
          '<div class="grid key-value-grid mx2-detail-grid">' +
            kvItem('Policy Expiry', d.expiry) +
            kvItem('Brand / Agent', d.agent) +
            kvItem('Premium', d.premium) +
            kvItem('Scheme', d.scheme) +
          '</div>' +
          '<div class="button-set button-set-no-offset">' +
            '<button type="button" class="btn btn-secondary">' +
              '<span class="button-label">Timewarp</span>' +
            '</button>' +
            // Buckholt Menu button, combo (split) variant
            '<div class="menu">' +
              '<div class="btn-combo">' +
                '<button type="button" class="btn btn-primary">' +
                  '<span class="button-label">View</span>' +
                '</button>' +
                '<button type="button" class="btn btn-primary menu-toggle" data-bs-toggle="dropdown"' +
                  ' aria-expanded="false" aria-label="More view options">' +
                  '<div class="btn-icon"><i class="fa-solid fa-caret-down" aria-hidden="true"></i></div>' +
                '</button>' +
                '<div class="menu-panel dropdown-menu dropdown-menu-end">' +
                  '<ul class="menu-body" role="menu">' +
                    '<li><button class="menu-item" type="button">View documents</button></li>' +
                    '<li><button class="menu-item" type="button">View history</button></li>' +
                  '</ul>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }

  // The nested Client Policies table inside an expanded client row.
  function clientPoliciesTable() {
    var rows = D.clientDetail.policies.map(function (p) {
      var id = 'mx2pol' + (++uid);
      var hasDetail = !!p.detail;
      return '<tr>' +
          '<td class="col-fit">' + (hasDetail ? expander(id, 'Show details for policy ' + p.no) : '') + '</td>' +
          '<td>' + esc(p.no) + '</td>' +
          '<td>' + esc(p.start) + '</td>' +
          '<td>' + esc(p.status) + '</td>' +
          '<td>' + esc(p.product) + '</td>' +
          '<td>' + esc(p.insurer) + '</td>' +
          '<td>' + esc(p.risk) + '</td>' +
        '</tr>' +
        (hasDetail ? policyDetail(p, id) : '');
    }).join('');

    return '<div class="text-block mx2-subheading">' +
        '<div class="heading"><div class="heading-content"><h3 class="title-03">Client Policies</h3></div></div>' +
      '</div>' +
      '<div class="table-container">' +
        '<div class="table-content">' +
          '<table class="table no-italics">' +
            '<thead><tr>' +
              '<th scope="col" class="col-fit"><div class="table-header-label"><span class="visually-hidden">Expand</span></div></th>' +
              '<th scope="col"><div class="table-header-label">Quote/Policy Number</div></th>' +
              '<th scope="col"><div class="table-header-label">Policy Start Date</div></th>' +
              '<th scope="col"><div class="table-header-label">Policy Status</div></th>' +
              '<th scope="col"><div class="table-header-label">Product Name</div></th>' +
              '<th scope="col"><div class="table-header-label">Insurer</div></th>' +
              '<th scope="col"><div class="table-header-label">Risk Info</div></th>' +
            '</tr></thead>' +
            '<tbody><tr class="table-gap"><td colspan="100%"></td></tr>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function renderResults() {
    var host = document.getElementById('mx2ResultRows');

    var html = '<tr class="table-gap"><td colspan="100%"></td></tr>';
    D.results.forEach(function (r, i) {
      var id = 'mx2row' + i;
      html +=
        '<tr>' +
          '<td class="col-fit">' + expander(id, 'Show details for ' + r.ref) + '</td>' +
          '<td>' + esc(r.name) + '</td>' +
          '<td>' + esc(r.ref) + '</td>' +
          '<td>' + esc(r.address) + '</td>' +
          '<td>' + esc(r.postcode) + '</td>' +
        '</tr>' +
        '<tr class="mx2-detail-row" id="' + id + '" hidden>' +
          '<td colspan="5">' +
            '<div class="mx2-detail-inner">' +
              '<div class="grid key-value-grid mx2-detail-grid">' +
                kvItem('Email Address', D.clientDetail.email) +
                kvItem('DOB/Date Established', D.clientDetail.dob) +
              '</div>' +
              '<div class="button-set button-set-no-offset">' +
                // Buckholt Menu button, combo (split) variant
                '<div class="menu">' +
                  '<div class="btn-combo">' +
                    '<button type="button" class="btn btn-secondary mx2-view-client" data-ref="' + esc(r.ref) + '">' +
                      '<span class="button-label">View Client</span>' +
                    '</button>' +
                    '<button type="button" class="btn btn-secondary menu-toggle" data-bs-toggle="dropdown"' +
                      ' aria-expanded="false" aria-label="More client options">' +
                      '<div class="btn-icon"><i class="fa-solid fa-caret-down" aria-hidden="true"></i></div>' +
                    '</button>' +
                    '<div class="menu-panel dropdown-menu dropdown-menu-end">' +
                      '<ul class="menu-body" role="menu">' +
                        '<li><button class="menu-item" type="button">View client details</button></li>' +
                        '<li><button class="menu-item" type="button">View documents</button></li>' +
                      '</ul>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<button type="button" class="btn btn-secondary">' +
                  '<span class="button-label">Add New Quote</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
            clientPoliciesTable() +
          '</td>' +
        '</tr>';
    });

    host.innerHTML = html;
    document.getElementById('mx2Showing').innerHTML = D.showing;
  }

  // ---------------------------------------------------------------------------
  // SCREEN 2 — Client homepage
  // ---------------------------------------------------------------------------
  function renderClient() {
    var c = D.client;

    document.getElementById('mx2ClientBarText').textContent = c.banner;

    document.getElementById('mx2Details').innerHTML =
      c.details.map(function (d) { return kvItem(d[0], d[1]); }).join('');

    document.getElementById('mx2ClientPolicyRows').innerHTML =
      '<tr class="table-gap"><td colspan="100%"></td></tr>' +
      c.policies.map(function (p) {
        var id = 'mx2cpol' + (++uid);
        var d = p.detail || {};
        return '<tr>' +
            '<td class="col-fit">' + expander(id, 'Show details for policy ' + p.no) + '</td>' +
            '<td>' + esc(p.no) + '</td>' +
            '<td>' + esc(p.start) + '</td>' +
            '<td>' + esc(p.renewal) + '</td>' +
            '<td>' + esc(p.status) + '</td>' +
            '<td>' + esc(p.product) + '</td>' +
            '<td>' + esc(p.risk) + '</td>' +
          '</tr>' +
          // The reference screens show the disclosure control on this table but
          // never show it open, so the field set is taken from the disclosure
          // that IS evidenced (on Search Results) and the values the reference
          // does not supply are shown as the screen's own "N/A" placeholder.
          '<tr class="mx2-detail-row" id="' + id + '" hidden>' +
            '<td colspan="7">' +
              '<div class="mx2-detail-inner">' +
                '<div class="grid key-value-grid mx2-detail-grid">' +
                  kvItem('Policy Expiry', d.expiry || 'N/A') +
                  kvItem('Brand / Agent', d.agent || 'N/A') +
                  kvItem('Premium', d.premium || 'N/A') +
                  kvItem('Scheme', d.scheme || 'N/A') +
                '</div>' +
              '</div>' +
            '</td>' +
          '</tr>';
      }).join('');
    document.getElementById('mx2PoliciesShowing').innerHTML = c.policiesShowing;

    document.getElementById('mx2SuggestedRows').innerHTML =
      '<tr class="table-gap"><td colspan="100%"></td></tr>' +
      c.suggestedLinks.map(function (s) {
        return '<tr>' +
          '<td>' + esc(s.name) + '</td>' +
          '<td>' + esc(s.email) + '</td>' +
          '<td>' + esc(s.dob) + '</td>' +
          '<td>' + esc(s.postcode) + '</td>' +
          '<td class="col-fit cell-data-right">' + rowMenu(s.name) + '</td>' +
        '</tr>';
      }).join('');

    document.getElementById('mx2ConnectedRows').innerHTML =
      '<tr class="table-gap"><td colspan="100%"></td></tr>' +
      c.connectedClients.map(function (s) {
        return '<tr>' +
          '<td>' + esc(s.name) + '</td>' +
          '<td>' + esc(s.linkType) + '</td>' +
          '<td>' + esc(s.email) + '</td>' +
          '<td>' + esc(s.dob) + '</td>' +
          '<td>' + esc(s.postcode) + '</td>' +
          '<td class="col-fit cell-data-right">' + rowMenu(s.name) + '</td>' +
        '</tr>';
      }).join('');

    document.getElementById('mx2Statistics').innerHTML =
      c.statistics.map(function (s) { return statItem(s[0], s[1]); }).join('');
    document.getElementById('mx2OpenClaims').innerHTML = statItem(c.openClaims[0], c.openClaims[1]);
    document.getElementById('mx2AdditionalInfo').innerHTML =
      c.additionalInfo.map(function (s) { return statItem(s[0], s[1]); }).join('');
  }

  // ---------------------------------------------------------------------------
  // Interaction
  // ---------------------------------------------------------------------------
  function toggleRow(btn) {
    var row = document.getElementById(btn.getAttribute('aria-controls'));
    if (!row) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    row.hidden = open;
    btn.closest('tr').classList.toggle('mx2-row-open', !open);
    var icon = btn.querySelector('i');
    icon.classList.toggle('fa-chevron-right', open);
    icon.classList.toggle('fa-chevron-up', !open);
  }

  document.addEventListener('click', function (e) {
    var exp = e.target.closest('.mx2-expander');
    if (exp) { e.preventDefault(); toggleRow(exp); return; }

    var view = e.target.closest('.mx2-view-client');
    if (view) { e.preventDefault(); showClient(); return; }
  });

  function showClient() {
    document.getElementById('mx2ViewResults').hidden = true;
    document.getElementById('mx2ViewClient').hidden = false;
    document.getElementById('mx2ClientBar').hidden = false;
    window.scrollTo(0, 0);
  }

  document.getElementById('mx2Back').addEventListener('click', function () {
    document.getElementById('mx2ViewClient').hidden = true;
    document.getElementById('mx2ViewResults').hidden = false;
    document.getElementById('mx2ClientBar').hidden = true;
    window.scrollTo(0, 0);
  });

  document.getElementById('mx2Clear').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('mx2Brand').value = '';
    document.getElementById('mx2Lob').value = '';
  });

  document.getElementById('mx2Build').textContent = D.build;

  renderResults();
  renderClient();

  // Documented Buckholt Tooltip initialisation.
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    function (el) { new bootstrap.Tooltip(el, { offset: [0, 4], delay: { show: 800, hide: 100 } }); }
  );
})();
