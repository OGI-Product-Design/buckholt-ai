/* ============================================================================
   Mobius PAS usage dashboard — chart layer
   ============================================================================

   Buckholt documents no data-visualisation layer, so this file builds one. It
   is deliberately small and dependency-free: plain SVG, no charting library, no
   network request. Everything it draws is measured from the numbers in data.js.

   Rules it holds itself to:

     · one axis per chart, never two y-scales;
     · colour identifies an entity, never its rank, so sorting never repaints;
     · a missing figure is drawn as an explicit absence, never as zero;
     · thin marks, 4px rounded data-ends anchored to a square baseline, 2px
       rules, markers at or above 8px, a 2px surface gap between adjacent fills;
     · recessive grid and axes, selective direct labels;
     · every chart has a hover layer and a real table behind it;
     · identity is never carried by colour alone — a legend is always present
       for two or more series, and texture is available as a second channel.

   Charts re-render on resize rather than scaling a viewBox, so label type stays
   at its true size at every width instead of growing and shrinking with the
   plot.
   ============================================================================ */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* -------------------------------------------------------------------------
     Formatting
     ------------------------------------------------------------------------- */

  function fmtInt(n) {
    return n === null || n === undefined ? '—' : n.toLocaleString('en-GB');
  }

  function fmtPct(n, dp) {
    if (n === null || n === undefined) return '—';
    var d = dp === undefined ? 1 : dp;
    var sign = n > 0 ? '+' : (n < 0 ? '−' : '');
    return sign + Math.abs(n).toFixed(d) + '%';
  }

  function fmtShare(n) {
    return n === null || n === undefined ? '—' : n.toFixed(1) + '%';
  }

  function fmtMs(n) {
    return n === null || n === undefined ? '—' : n.toLocaleString('en-GB') + 'ms';
  }

  /* -------------------------------------------------------------------------
     SVG helpers
     ------------------------------------------------------------------------- */

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        node.setAttribute(k, String(attrs[k]));
      });
    }
    return node;
  }

  function text(x, y, str, cls, anchor, baseline) {
    var t = svgEl('text', {
      x: x, y: y, class: cls,
      'text-anchor': anchor || 'start',
      'dominant-baseline': baseline || 'auto'
    });
    t.textContent = str;
    return t;
  }

  /* A horizontal bar growing right from a square baseline, with the leading end
     rounded. The baseline edge stays square so the bar reads as anchored. */
  function barPathH(x, y, w, h, r) {
    if (w <= 0.5) return 'M' + x + ',' + y + ' h0.5 v' + h + ' h-0.5 Z';
    var rr = Math.min(r, w, h / 2);
    return 'M' + x + ',' + y +
      ' H' + (x + w - rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + w) + ',' + (y + rr) +
      ' V' + (y + h - rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + w - rr) + ',' + (y + h) +
      ' H' + x + ' Z';
  }

  /* A vertical bar growing up from a square baseline at y + h. */
  function barPathV(x, y, w, h, r) {
    if (h <= 0.5) return 'M' + x + ',' + (y + h) + ' h' + w + ' v-0.5 h-' + w + ' Z';
    var rr = Math.min(r, h, w / 2);
    return 'M' + x + ',' + (y + h) +
      ' V' + (y + rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + rr) + ',' + y +
      ' H' + (x + w - rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + w) + ',' + (y + rr) +
      ' V' + (y + h) + ' Z';
  }

  /* A stacked segment: square at both ends unless it is the run's leading or
     trailing member, so a stack reads as one bar rather than a row of pills. */
  function stackPathH(x, y, w, h, r, roundStart, roundEnd) {
    if (w <= 0.5) return '';
    var rr = Math.min(r, w / 2, h / 2);
    var d = 'M' + (x + (roundStart ? rr : 0)) + ',' + y;
    d += ' H' + (x + w - (roundEnd ? rr : 0));
    if (roundEnd) d += ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + w) + ',' + (y + rr) + ' V' + (y + h - rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + w - rr) + ',' + (y + h);
    else d += ' V' + (y + h);
    d += ' H' + (x + (roundStart ? rr : 0));
    if (roundStart) d += ' A' + rr + ',' + rr + ' 0 0 1 ' + x + ',' + (y + h - rr) + ' V' + (y + rr) +
      ' A' + rr + ',' + rr + ' 0 0 1 ' + (x + rr) + ',' + y;
    else d += ' V' + y;
    return d + ' Z';
  }

  /* Reads a chart-layer colour token off the page rather than hard-coding a
     hex, so the palette stays defined in one place, in CSS, in Buckholt terms. */
  var rootStyles = null;
  function token(name) {
    if (!rootStyles) rootStyles = getComputedStyle(document.body);
    return rootStyles.getPropertyValue(name).trim();
  }

  /* Measures a category label in the page's own face, so a category gutter can
     be sized to the longest label it actually has to hold rather than to a
     guessed constant. Charts re-render once the webfont has loaded, so the
     first measurement being taken against the fallback face is corrected. */
  function measureLabel(str) {
    var ctx = measureLabel._ctx;
    if (!ctx) {
      ctx = measureLabel._ctx = document.createElement('canvas').getContext('2d');
      var body = getComputedStyle(document.body);
      /* `.ud-axis-label` is 0.75rem, so resolve it against the root rather than
         assuming a 16px root. Letter spacing is inherited and canvas ignores it
         unless it is set explicitly. */
      var rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      measureLabel._font = (rootPx * 0.75) + 'px ' + body.fontFamily;
      measureLabel._spacing = body.letterSpacing === 'normal' ? '0px' : body.letterSpacing;
    }
    ctx.font = measureLabel._font;
    if ('letterSpacing' in ctx) ctx.letterSpacing = measureLabel._spacing;
    return ctx.measureText(str).width;
  }

  /* A category gutter wide enough for its longest label, or zero — in which
     case the caller stacks each label above its own mark instead. A gutter is
     refused past 42% of the plot, where it would leave the marks no room. */
  function categoryGutter(labels, plotW, minW) {
    if (plotW < (minW || 460)) return 0;
    var widest = 0;
    labels.forEach(function (l) { widest = Math.max(widest, measureLabel(l)); });
    var needed = Math.ceil(widest) + 20;
    return needed > plotW * 0.42 ? 0 : needed;
  }

  /* -------------------------------------------------------------------------
     Texture — the second channel
     -------------------------------------------------------------------------
     One hand-drawn "lines" fill, used at 45° and its 135° mirror only, inked
     tone-on-tone so it darkens whatever series colour sits beneath it. Series
     slot 0 stays solid; slots 1 and 2 take the two angles. Off unless the
     viewer turns it on, or the page is printed, or forced colours are active.
  */
  function textureDefs() {
    var defs = svgEl('defs');
    [['ud-lines-45', 45], ['ud-lines-135', 135]].forEach(function (pair) {
      var p = svgEl('pattern', {
        id: pair[0], width: 6, height: 6,
        patternUnits: 'userSpaceOnUse',
        patternTransform: 'rotate(' + pair[1] + ')'
      });
      p.appendChild(svgEl('line', {
        x1: 0, y1: 0, x2: 0, y2: 6,
        stroke: 'rgba(26,26,26,0.45)', 'stroke-width': 2
      }));
      defs.appendChild(p);
    });
    return defs;
  }

  var TEXTURES = [null, 'ud-lines-45', 'ud-lines-135'];

  /* Draws the mark, then the texture overlay on the identical geometry. The
     overlay is display:none until texture is on, so the underlying colour is
     never altered by the presence of the second channel. */
  function markWithTexture(group, d, fill, textureIndex) {
    group.appendChild(svgEl('path', { d: d, fill: fill, class: 'ud-mark' }));
    var tex = TEXTURES[textureIndex % TEXTURES.length];
    if (tex) {
      group.appendChild(svgEl('path', {
        d: d, fill: 'url(#' + tex + ')', class: 'ud-texture-overlay'
      }));
    }
  }

  /* -------------------------------------------------------------------------
     Tooltip
     ------------------------------------------------------------------------- */

  var tip = null;

  function tooltipNode() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'ud-tooltip body-01';
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);
    return tip;
  }

  function showTip(evt, spec) {
    var node = tooltipNode();
    var html = '';
    html += '<div class="ud-tooltip-title label-01">';
    if (spec.colour) html += '<span class="ud-tooltip-swatch" style="background-color:' + spec.colour + '"></span>';
    html += '<span>' + spec.title + '</span></div>';
    if (spec.rows && spec.rows.length) {
      html += '<dl class="ud-tooltip-rows" style="margin:0">';
      spec.rows.forEach(function (r) {
        html += '<div class="ud-tooltip-row body-01"><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
      });
      html += '</dl>';
    }
    if (spec.note) html += '<p class="ud-tooltip-note support-01">' + spec.note + '</p>';
    node.innerHTML = html;
    node.setAttribute('data-visible', 'true');
    node.setAttribute('aria-hidden', 'false');
    moveTip(evt);
  }

  function moveTip(evt) {
    if (!tip) return;
    var pad = 12;
    var rect = tip.getBoundingClientRect();
    var x = Math.min(Math.max(evt.clientX, rect.width / 2 + pad), window.innerWidth - rect.width / 2 - pad);
    var y = evt.clientY;
    /* Flip below the pointer when there is no room above. */
    if (y - rect.height - pad < 0) {
      tip.style.transform = 'translate(-50%, ' + pad + 'px)';
    } else {
      tip.style.transform = 'translate(-50%, calc(-100% - 12px))';
    }
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  function hideTip() {
    if (!tip) return;
    tip.setAttribute('data-visible', 'false');
    tip.setAttribute('aria-hidden', 'true');
  }

  /* A transparent hit area, always larger than the mark it serves. */
  function hit(group, box, spec, markNode) {
    var h = svgEl('rect', {
      x: box.x, y: box.y, width: Math.max(box.width, 1), height: Math.max(box.height, 1),
      class: 'ud-hit'
    });
    h.addEventListener('mouseenter', function (e) {
      if (markNode) markNode.classList.add('is-hovered');
      showTip(e, spec);
    });
    h.addEventListener('mousemove', moveTip);
    h.addEventListener('mouseleave', function () {
      if (markNode) markNode.classList.remove('is-hovered');
      hideTip();
    });
    group.appendChild(h);
    return h;
  }

  /* -------------------------------------------------------------------------
     Scales and ticks
     ------------------------------------------------------------------------- */

  /* How many tick intervals an axis of this width can carry legibly. */
  function tickTarget(plotW) {
    return Math.max(3, Math.min(7, Math.round(plotW / 140)));
  }

  /* Ticks from zero to a round value at or above `max`. The last tick is the
     scale's top, so it must never fall below the largest value — a domain that
     stops short of the data draws bars longer than the plot they sit in. */
  function niceTicks(max, target) {
    var t = Math.max(2, target || 4);
    var mag = Math.pow(10, Math.floor(Math.log10(max / t)));
    var candidates = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; });
    var step = candidates[candidates.length - 1];
    for (var i = 0; i < candidates.length; i++) {
      if (Math.ceil(max / candidates[i]) <= t) { step = candidates[i]; break; }
    }
    var ticks = [];
    var steps = Math.ceil(max / step);
    for (var k = 0; k <= steps; k++) ticks.push(k * step);
    return ticks;
  }

  /* A chart inside a hidden tab pane measures zero, so fall back to the nearest
     laid-out ancestor. The pane is re-rendered when it is shown, so this is the
     first-paint width, not the final one. */
  function plotWidth(host) {
    if (host.clientWidth) return host.clientWidth;
    var node = host.parentNode;
    while (node && node.nodeType === 1) {
      if (node.clientWidth) return node.clientWidth;
      node = node.parentNode;
    }
    return 0;
  }

  function newSvg(width, height) {
    var svg = svgEl('svg', {
      width: width, height: height,
      role: 'img',
      'aria-hidden': 'true'
    });
    svg.style.fontFamily = 'inherit';
    svg.appendChild(textureDefs());
    return svg;
  }

  /* =========================================================================
     Chart 1 — Share of combined sessions
     =========================================================================
     Two stacked bars, one per period. Three series, so a legend is present and
     each series is also directly labelled wherever its segment is wide enough
     to hold the label; the narrow ones carry their figures in the table and the
     hover layer. One 2px surface gap sits between adjacent fills.
  */
  function renderShare(host) {
    var w = plotWidth(host);
    if (!w) return;
    var rows = [PERIODS.p1, PERIODS.p2];
    var gutter = 34, barH = 44, rowGap = 28, top = 6;
    var h = top + rows.length * barH + (rows.length - 1) * rowGap + 8;
    var svg = newSvg(w, h);
    var plotX = gutter, plotW = w - gutter;
    var gap = parseFloat(token('--ud-fill-gap')) || 2;
    var radius = parseFloat(token('--ud-mark-radius')) || 4;
    var order = ['islands', 'greenlight', 'pizza'];

    rows.forEach(function (period, ri) {
      var y = top + ri * (barH + rowGap);
      var g = svgEl('g');
      var total = SESSIONS.combined[period.id];
      var x = plotX;

      svg.appendChild(text(0, y + barH / 2, period.short, 'ud-axis-label', 'start', 'middle'));

      order.forEach(function (segId, si) {
        var value = SESSIONS[segId][period.id];
        var frac = value / total;
        var segW = frac * (plotW - gap * (order.length - 1));
        var colour = token(SEGMENTS[segId].colourVar);
        var d = stackPathH(x, y, segW, barH, radius, si === 0, si === order.length - 1);
        var before = g.childNodes.length;
        markWithTexture(g, d, colour, si);
        var mark = g.childNodes[before];

        var pct = (frac * 100);
        /* Direct label only where the segment can hold it legibly. */
        if (segW > 62) {
          g.appendChild(text(x + segW / 2, y + barH / 2, fmtShare(pct),
            'ud-value-label-inverse', 'middle', 'middle'));
        }

        hit(g, { x: x, y: y - 6, width: segW, height: barH + 12 }, {
          title: SEGMENTS[segId].name,
          colour: colour,
          rows: [
            [period.label + ' sessions', fmtInt(value)],
            ['Share of combined', fmtShare(pct)]
          ],
          note: period.range
        }, mark);

        x += segW + gap;
      });

      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* =========================================================================
     Chart 2 — Sessions by segment, Period 1 to Period 2
     =========================================================================
     Small multiples rather than one plot. The three segments differ by a factor
     of nearly fifty, so a shared scale would flatten Pizza and Greenlight into
     the axis; a second y-scale would be worse still. Each panel therefore keeps
     its own scale from zero, and the panel heading carries the absolute figures
     so the panels can never be read as comparable heights.
  */
  function renderSegmentMultiples() {
    ['islands', 'greenlight', 'pizza'].forEach(function (segId) {
      var host = document.querySelector('[data-chart="segment-' + segId + '"]');
      if (!host) return;
      var w = plotWidth(host);
      if (!w) return;

      var h = 132, top = 8, bottom = 22;
      var plotH = h - top - bottom;
      var svg = newSvg(w, h);
      var values = [SESSIONS[segId].p1, SESSIONS[segId].p2];
      var max = Math.max.apply(null, values);
      var barW = Math.min(56, (w - 24) / 2 - 12);
      var slotW = w / 2;
      var radius = parseFloat(token('--ud-mark-radius')) || 4;
      var colours = [token(SEGMENTS[segId].lightVar), token(SEGMENTS[segId].colourVar)];

      svg.appendChild(svgEl('line', {
        x1: 0, y1: top + plotH, x2: w, y2: top + plotH, class: 'ud-baseline-rule'
      }));

      values.forEach(function (value, i) {
        var g = svgEl('g');
        var barH = (value / max) * plotH;
        var x = slotW * i + (slotW - barW) / 2;
        var y = top + plotH - barH;
        var d = barPathV(x, y, barW, barH, radius);
        var before = g.childNodes.length;
        markWithTexture(g, d, colours[i], 0);
        var mark = g.childNodes[before];

        g.appendChild(text(x + barW / 2, top + plotH + 14,
          i === 0 ? PERIODS.p1.short : PERIODS.p2.short, 'ud-tick-label', 'middle', 'hanging'));
        g.appendChild(text(x + barW / 2, y - 6, fmtInt(value), 'ud-value-label', 'middle', 'auto'));

        hit(g, { x: slotW * i, y: top, width: slotW, height: plotH + bottom }, {
          title: SEGMENTS[segId].name + ' · ' + (i === 0 ? PERIODS.p1.label : PERIODS.p2.label),
          colour: colours[i],
          rows: [
            ['Sessions', fmtInt(value)],
            ['Dates', i === 0 ? PERIODS.p1.range : PERIODS.p2.range]
          ],
          note: 'Each panel has its own scale from zero. Bar heights are not comparable between panels.'
        }, mark);

        svg.appendChild(g);
      });

      host.innerHTML = '';
      host.appendChild(svg);
    });
  }

  /* =========================================================================
     Chart 3 — Broker intent volume
     =========================================================================
     One measure, ten categories, so one series colour and no legend; the
     category axis names each row. Period 1 is drawn as a reference tick in an
     ink token rather than as a second coloured series, because it is a
     comparison mark, not a second thing being measured.

     Sorting is a view control. Colour identifies nothing here that a sort could
     scramble, and the reference tick travels with its row.
  */
  function renderIntentVolume(host, sortMode) {
    var w = plotWidth(host);
    if (!w) return;

    var data = INTENTS_WITH_CHANGE.slice();
    var labelFor = function (d) { return d.label + (d.kind === 'page-view' ? '  (page view)' : ''); };
    var gutter = categoryGutter(data.map(labelFor), w);
    var narrow = gutter === 0;
    var rowH = narrow ? 44 : 30;
    var barH = 16;
    var top = narrow ? 4 : 2;
    /* Room for the value label, plus the "first measured" annotation on any row
       that has no Period 1 figure. */
    var rightPad = 56 + (data.some(function (d) { return d.p1 === null; }) ? 78 : 0);

    if (sortMode === 'growth') {
      data.sort(function (a, b) {
        if (a.change === null) return 1;
        if (b.change === null) return -1;
        return b.change - a.change;
      });
    } else {
      data.sort(function (a, b) { return b.p2 - a.p2; });
    }

    var h = top + data.length * rowH + 26;
    var svg = newSvg(w, h);
    var plotX = gutter;
    var plotW = w - gutter - rightPad;
    var max = Math.max.apply(null, data.map(function (d) { return Math.max(d.p2, d.p1 || 0); }));
    var ticks = niceTicks(max, tickTarget(plotW));
    var scale = function (v) { return (v / ticks[ticks.length - 1]) * plotW; };
    var radius = parseFloat(token('--ud-mark-radius')) || 4;
    var colour = token('--ud-series-single');

    /* Recessive grid, drawn first so every mark sits above it. */
    ticks.forEach(function (t) {
      var x = plotX + scale(t);
      svg.appendChild(svgEl('line', {
        x1: x, y1: top, x2: x, y2: top + data.length * rowH, class: 'ud-gridline'
      }));
      svg.appendChild(text(x, top + data.length * rowH + 8, fmtInt(t), 'ud-tick-label', 'middle', 'hanging'));
    });

    data.forEach(function (d, i) {
      var g = svgEl('g');
      var rowY = top + i * rowH;
      var barY = narrow ? rowY + 22 : rowY + (rowH - barH) / 2;
      var bw = scale(d.p2);
      var path = barPathH(plotX, barY, bw, barH, radius);
      var before = g.childNodes.length;
      markWithTexture(g, path, colour, 0);
      var mark = g.childNodes[before];

      /* Period 1 reference tick. An ink token, not a series colour. Where there
         is no Period 1 figure the row says so, so a missing tick can never be
         read as a Period 1 value of zero. */
      if (d.p1 !== null) {
        var rx = plotX + scale(d.p1);
        g.appendChild(svgEl('line', {
          x1: rx, y1: barY - 4, x2: rx, y2: barY + barH + 4,
          stroke: token('--text-tertiary'), 'stroke-width': 2, 'stroke-linecap': 'round'
        }));
      }

      var label = labelFor(d);
      if (narrow) {
        g.appendChild(text(0, rowY + 2, label, 'ud-axis-label', 'start', 'hanging'));
      } else {
        g.appendChild(text(gutter - 16, rowY + rowH / 2, label, 'ud-axis-label', 'end', 'middle'));
      }
      g.appendChild(text(plotX + bw + 8, barY + barH / 2, fmtInt(d.p2), 'ud-value-label', 'start', 'middle'));
      if (d.p1 === null) {
        g.appendChild(text(plotX + bw + 12 + measureLabel(fmtInt(d.p2)), barY + barH / 2,
          'first measured', 'ud-tick-label', 'start', 'middle'));
      }

      hit(g, { x: 0, y: rowY, width: w, height: rowH }, {
        title: d.label,
        colour: colour,
        rows: [
          [PERIODS.p2.label, fmtInt(d.p2) + ' sessions'],
          [PERIODS.p1.label, d.p1 === null ? 'not built' : fmtInt(d.p1) + ' sessions'],
          ['Change', d.change === null ? 'first measured' : fmtPct(d.change)]
        ],
        note: d.kind === 'page-view' ? 'Page view event.' : 'Session containing the labelled click.'
      }, mark);

      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* =========================================================================
     Chart 4 — Growth against the session baseline
     =========================================================================
     The report's central claim: every intent grew faster than Islands sessions
     did. That is a statement about a reference line, so the chart is built
     around one — a dashed rule at +0.5%, with each intent's change as a dot on
     a connector from zero. Diary has no Period 1 figure and is absent rather
     than plotted at zero.
  */
  function renderIntentGrowth(host) {
    var w = plotWidth(host);
    if (!w) return;

    var data = INTENTS_WITH_CHANGE
      .filter(function (d) { return d.change !== null; })
      .sort(function (a, b) { return b.change - a.change; });

    var labelFor = function (d) { return d.label + (d.kind === 'page-view' ? '  (page view)' : ''); };
    var gutter = categoryGutter(data.map(labelFor), w);
    var narrow = gutter === 0;
    var rowH = narrow ? 40 : 28;
    var top = narrow ? 4 : 10;
    var rightPad = 52;


    var h = top + data.length * rowH + 30;
    var svg = newSvg(w, h);
    var plotX = gutter;
    var plotW = w - gutter - rightPad;
    /* Ticks decide the domain, not the other way round: the axis top is the
       last tick, so no dot can ever be plotted past the end of its own plot. */
    var ticks = niceTicks(Math.max.apply(null, data.map(function (d) { return d.change; })), tickTarget(plotW));
    var domain = ticks[ticks.length - 1];
    var scale = function (v) { return (v / domain) * plotW; };
    var colour = token('--ud-series-single');
    var markerR = (parseFloat(token('--ud-marker-size')) || 10) / 2;
    var baseline = DERIVED.islandsSessionChange;
    var plotBottom = top + data.length * rowH;

    /* A 2.5-point step rounded to whole percentages would print 0, 3, 5, 8 —
       an axis whose labels lie about their own spacing. Label to whatever
       precision the step actually needs. */
    var tickDp = ticks.some(function (t) { return Math.abs(t % 1) > 1e-9; }) ? 1 : 0;
    ticks.forEach(function (t) {
      var x = plotX + scale(t);
      svg.appendChild(svgEl('line', { x1: x, y1: top, x2: x, y2: plotBottom, class: 'ud-gridline' }));
      svg.appendChild(text(x, plotBottom + 8, fmtPct(t, tickDp), 'ud-tick-label', 'middle', 'hanging'));
    });

    /* The reference line and its label. */
    var bx = plotX + scale(baseline);
    svg.appendChild(svgEl('line', { x1: bx, y1: top - 6, x2: bx, y2: plotBottom, class: 'ud-reference-rule' }));
    svg.appendChild(text(bx + 6, top - 8, 'Islands sessions ' + fmtPct(baseline), 'ud-tick-label', 'start', 'auto'));

    data.forEach(function (d, i) {
      var g = svgEl('g');
      var rowY = top + i * rowH;
      var cy = narrow ? rowY + 28 : rowY + rowH / 2;
      var cx = plotX + scale(d.change);

      g.appendChild(svgEl('line', {
        x1: plotX, y1: cy, x2: cx, y2: cy,
        stroke: colour, class: 'ud-connector', 'stroke-linecap': 'round'
      }));
      var dot = svgEl('circle', { cx: cx, cy: cy, r: markerR, fill: colour, class: 'ud-mark' });
      g.appendChild(dot);

      var label = labelFor(d);
      if (narrow) {
        g.appendChild(text(0, rowY + 2, label, 'ud-axis-label', 'start', 'hanging'));
      } else {
        g.appendChild(text(gutter - 16, cy, label, 'ud-axis-label', 'end', 'middle'));
      }
      g.appendChild(text(cx + markerR + 6, cy, fmtPct(d.change), 'ud-value-label', 'start', 'middle'));

      hit(g, { x: 0, y: rowY, width: w, height: rowH }, {
        title: d.label,
        colour: colour,
        rows: [
          ['Change', fmtPct(d.change)],
          ['Against sessions', fmtPct(d.change - baseline) + ' points'],
          [PERIODS.p1.short + ' → ' + PERIODS.p2.short, fmtInt(d.p1) + ' → ' + fmtInt(d.p2)]
        ],
        note: d.kind === 'page-view' ? 'Page view event.' : 'Session containing the labelled click.'
      }, dot);

      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* =========================================================================
     Chart 5 — Average page load by segment
     =========================================================================
     One measure across three entities. Each bar wears its segment's colour, the
     same colour that segment wears everywhere else on the page, so the axis
     label and the fill say the same thing twice.
  */
  function renderLcp(host) {
    var w = plotWidth(host);
    if (!w) return;
    var order = ['islands', 'greenlight', 'pizza'];
    var gutter = Math.max(72, categoryGutter(order.map(function (s2) { return SEGMENTS[s2].name; }), w, 240));
    var rowH = 44, barH = 18, top = 4, rightPad = 64;
    var h = top + order.length * rowH + 26;
    var svg = newSvg(w, h);
    var plotX = gutter, plotW = w - gutter - rightPad;
    var max = Math.max.apply(null, order.map(function (s) { return LCP_MS[s].p2; }));
    var ticks = niceTicks(max, tickTarget(plotW));
    var scale = function (v) { return (v / ticks[ticks.length - 1]) * plotW; };
    var radius = parseFloat(token('--ud-mark-radius')) || 4;

    ticks.forEach(function (t) {
      var x = plotX + scale(t);
      svg.appendChild(svgEl('line', { x1: x, y1: top, x2: x, y2: top + order.length * rowH, class: 'ud-gridline' }));
      svg.appendChild(text(x, top + order.length * rowH + 8, fmtInt(t), 'ud-tick-label', 'middle', 'hanging'));
    });

    order.forEach(function (segId, i) {
      var g = svgEl('g');
      var rowY = top + i * rowH;
      var barY = rowY + (rowH - barH) / 2;
      var value = LCP_MS[segId].p2;
      var bw = scale(value);
      var colour = token(SEGMENTS[segId].colourVar);
      var d = barPathH(plotX, barY, bw, barH, radius);
      var before = g.childNodes.length;
      markWithTexture(g, d, colour, i);
      var mark = g.childNodes[before];

      /* Islands is the only segment with a Period 1 figure to compare against. */
      if (LCP_MS[segId].p1 !== null) {
        var rx = plotX + scale(LCP_MS[segId].p1);
        g.appendChild(svgEl('line', {
          x1: rx, y1: barY - 5, x2: rx, y2: barY + barH + 5,
          stroke: token('--text-tertiary'), 'stroke-width': 2, 'stroke-linecap': 'round'
        }));
      }

      g.appendChild(text(gutter - 16, rowY + rowH / 2, SEGMENTS[segId].name, 'ud-axis-label', 'end', 'middle'));
      g.appendChild(text(plotX + bw + 8, barY + barH / 2, fmtMs(value), 'ud-value-label', 'start', 'middle'));

      hit(g, { x: 0, y: rowY, width: w, height: rowH }, {
        title: SEGMENTS[segId].name,
        colour: colour,
        rows: [
          [PERIODS.p2.label, fmtMs(value)],
          [PERIODS.p1.label, LCP_MS[segId].p1 === null ? 'not built' : fmtMs(LCP_MS[segId].p1)]
        ],
        note: LCP_MS[segId].p1 === null
          ? 'Not built for this segment in Period 1 — LogRocket cannot split this chart type by segment without a duplicate metric per brand.'
          : 'Largest Contentful Paint, averaged across sessions.'
      }, mark);

      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* =========================================================================
     Chart 6 — Cancel Policy against Renewal
     =========================================================================
     Two intents across two periods. The two periods are an ordinal ramp of one
     hue, not two identities, and a legend names both.
  */
  function renderCancelRenewal(host) {
    var w = plotWidth(host);
    if (!w) return;
    var rows = [
      { id: 'cancel', label: 'Cancel Policy', p1: 380, p2: 424 },
      { id: 'renewal', label: 'Renewal', p1: 74, p2: 85 }
    ];
    var gutter = Math.max(84, categoryGutter(rows.map(function (r) { return r.label; }), w, 240));
    var groupH = 62, barH = 18, gap = 6, top = 4, rightPad = 48;
    var h = top + rows.length * groupH + 26;
    var svg = newSvg(w, h);
    var plotX = gutter, plotW = w - gutter - rightPad;
    var ticks = niceTicks(424, tickTarget(plotW));
    var scale = function (v) { return (v / ticks[ticks.length - 1]) * plotW; };
    var radius = parseFloat(token('--ud-mark-radius')) || 4;
    var colours = [token('--ud-series-single-soft'), token('--ud-series-single')];

    ticks.forEach(function (t) {
      var x = plotX + scale(t);
      svg.appendChild(svgEl('line', { x1: x, y1: top, x2: x, y2: top + rows.length * groupH, class: 'ud-gridline' }));
      svg.appendChild(text(x, top + rows.length * groupH + 8, fmtInt(t), 'ud-tick-label', 'middle', 'hanging'));
    });

    rows.forEach(function (row, i) {
      var groupY = top + i * groupH;
      var startY = groupY + (groupH - (barH * 2 + gap)) / 2;
      svg.appendChild(text(gutter - 16, groupY + groupH / 2, row.label, 'ud-axis-label', 'end', 'middle'));

      [PERIODS.p1, PERIODS.p2].forEach(function (period, pi) {
        var g = svgEl('g');
        var value = row[period.id];
        var y = startY + pi * (barH + gap);
        var bw = scale(value);
        var d = barPathH(plotX, y, bw, barH, radius);
        var before = g.childNodes.length;
        markWithTexture(g, d, colours[pi], 0);
        var mark = g.childNodes[before];
        g.appendChild(text(plotX + bw + 8, y + barH / 2, fmtInt(value), 'ud-value-label', 'start', 'middle'));

        hit(g, { x: 0, y: y - gap / 2, width: w, height: barH + gap }, {
          title: row.label + ' · ' + period.label,
          colour: colours[pi],
          rows: [['Sessions', fmtInt(value)], ['Dates', period.range]],
          note: 'Session containing the labelled click.'
        }, mark);

        svg.appendChild(g);
      });
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* =========================================================================
     Chart 7 — Reach, against the workflow it is usually compared with
     =========================================================================
     The claim is that Attachments runs about five times Retrieve Quote volume,
     so both are drawn on the same scale — the full width is every Islands
     session — and the ratio can be read rather than taken on trust. The
     remainder of each bar is a neutral: it is "the rest of the sessions", not a
     second measured thing, so it never takes a series colour.
  */
  function renderReach(host) {
    var w = plotWidth(host);
    if (!w) return;

    var total = SESSIONS.islands.p2;
    var rows = [
      { label: 'Attachments', p2: 3398, p1: 3279, tick: true },
      { label: 'Retrieve Quote', p2: 673, p1: 657, tick: true }
    ];
    var gutter = Math.max(84, categoryGutter(rows.map(function (r) { return r.label; }), w, 240));
    var barH = 34, rowGap = 30, top = 6;
    var h = top + rows.length * barH + (rows.length - 1) * rowGap + 22;
    var svg = newSvg(w, h);
    var plotX = gutter, plotW = w - gutter;
    var gapPx = parseFloat(token('--ud-fill-gap')) || 2;
    var radius = parseFloat(token('--ud-mark-radius')) || 4;
    var colour = token('--ud-series-single');

    rows.forEach(function (row, i) {
      var g = svgEl('g');
      var y = top + i * (barH + rowGap);
      var frac = row.p2 / total;
      var fillW = frac * (plotW - gapPx);
      var restW = (plotW - gapPx) - fillW;

      var d = stackPathH(plotX, y, fillW, barH, radius, true, false);
      var before = g.childNodes.length;
      markWithTexture(g, d, colour, 0);
      var mark = g.childNodes[before];

      g.appendChild(svgEl('path', {
        d: stackPathH(plotX + fillW + gapPx, y, restW, barH, radius, false, true),
        fill: token('--ui-overlay-02')
      }));

      g.appendChild(text(gutter - 16, y + barH / 2, row.label, 'ud-axis-label', 'end', 'middle'));

      /* The share label sits inside the fill where it fits, and beside it where
         it does not — never half-clipped by its own bar. */
      var shareText = fmtShare(frac * 100);
      if (fillW > measureLabel(shareText) + 24) {
        g.appendChild(text(plotX + 12, y + barH / 2, shareText, 'ud-value-label-inverse', 'start', 'middle'));
      } else {
        g.appendChild(text(plotX + fillW + 10, y + barH / 2, shareText, 'ud-value-label', 'start', 'middle'));
      }

      /* Period 1 reference tick, on the same rule as every other chart. */
      if (row.tick) {
        var rx = plotX + (row.p1 / total) * (plotW - gapPx);
        g.appendChild(svgEl('line', {
          x1: rx, y1: y - 5, x2: rx, y2: y + barH + 5,
          stroke: token('--text-tertiary'), 'stroke-width': 2, 'stroke-linecap': 'round'
        }));
        g.appendChild(text(rx, y + barH + 9, PERIODS.p1.short + ' ' + fmtShare((row.p1 / SESSIONS.islands.p1) * 100),
          'ud-tick-label', 'middle', 'hanging'));
      }

      hit(g, { x: 0, y: y - 6, width: w, height: barH + 12 }, {
        title: row.label,
        colour: colour,
        rows: [
          [PERIODS.p2.label, fmtInt(row.p2) + ' of ' + fmtInt(total) + ' · ' + fmtShare(frac * 100)],
          [PERIODS.p1.label, fmtInt(row.p1) + ' of ' + fmtInt(SESSIONS.islands.p1) + ' · ' + fmtShare((row.p1 / SESSIONS.islands.p1) * 100)]
        ],
        note: 'Share of Islands sessions containing the labelled click.'
      }, mark);

      svg.appendChild(g);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /* -------------------------------------------------------------------------
     Render orchestration
     ------------------------------------------------------------------------- */

  var intentSort = 'volume';

  function renderAll() {
    rootStyles = null;
    measureLabel._ctx = null;
    var share = document.querySelector('[data-chart="share"]');
    if (share) renderShare(share);
    renderSegmentMultiples();
    var vol = document.querySelector('[data-chart="intent-volume"]');
    if (vol) renderIntentVolume(vol, intentSort);
    var growth = document.querySelector('[data-chart="intent-growth"]');
    if (growth) renderIntentGrowth(growth);
    var lcp = document.querySelector('[data-chart="lcp"]');
    if (lcp) renderLcp(lcp);
    var cr = document.querySelector('[data-chart="cancel-renewal"]');
    if (cr) renderCancelRenewal(cr);
    var reach = document.querySelector('[data-chart="reach"]');
    if (reach) renderReach(reach);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    hideTip();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderAll, 120);
  });

  /* -------------------------------------------------------------------------
     Controls
     -------------------------------------------------------------------------
     The texture switch, the table-view toggles and the intent sort. All three
     act on markup that already exists; none of them creates or destroys the
     accessible content.
  */
  function wireControls() {
    var texture = document.getElementById('udTexture');
    if (texture) {
      texture.addEventListener('change', function () {
        document.body.setAttribute('data-texture', texture.checked ? 'on' : 'off');
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('.ud-toggle-tableview'), function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('aria-controls'));
        if (!target) return;
        var open = target.hidden;
        target.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        var label = btn.querySelector('.button-label');
        if (label) label.textContent = open ? 'Hide the figures' : 'Show the figures';
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-intent-sort]'), function (btn) {
      btn.addEventListener('shown.bs.tab', function () {
        intentSort = btn.getAttribute('data-intent-sort');
        var vol = document.querySelector('[data-chart="intent-volume"]');
        if (vol) renderIntentVolume(vol, intentSort);
        var growth = document.querySelector('[data-chart="intent-growth"]');
        if (growth) renderIntentGrowth(growth);
      });
    });
  }

  function start() {
    wireControls();
    var platformLcp = document.getElementById('platformLcp');
    if (platformLcp) {
      platformLcp.textContent = DERIVED.platformLcp.p2 === null
        ? 'not available'
        : fmtInt(Math.round(DERIVED.platformLcp.p2)) + 'ms';
    }
    renderAll();
    /* Webfont metrics change label widths, so lay the charts out again once the
       real face has loaded rather than measuring against the fallback. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(renderAll);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
