const { launch, BASE } = require('./config');
let pass = 0, fail = 0;
const is = (l,g,w) => { if (String(g)===String(w)) pass++; else { fail++; console.log('FAIL '+l+': got ['+g+'] want ['+w+']'); } };
const ok = (l,c) => { if (c) pass++; else { fail++; console.log('FAIL '+l); } };

(async () => {
  const b = await launch();
  for (const w of [1920, 1600, 1440, 1280, 1200, 1100, 992, 900, 768, 700, 576, 500, 414, 375, 320]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + '/prototypes/BACS-calendar/index.html', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
    const d = await p.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      weekday0: document.querySelector('.calendar-weekday').textContent,
      cols: getComputedStyle(document.querySelector('.calendar-grid')).gridTemplateColumns.split(' ').length,
      cellW: Math.round(document.querySelector('.calendar-cell').getBoundingClientRect().width),
      cellH: Math.round(document.querySelector('[data-date="2026-10-14"]').getBoundingClientRect().height),
      gridScrolls: (() => { const e = document.querySelector('.cal-grid-scroller'); return e.scrollWidth > e.clientWidth; })(),
      cardsPerRow: (() => { const cs = [...document.querySelectorAll('.col-12')]; const y = cs[0].getBoundingClientRect().y; return cs.filter(c => c.getBoundingClientRect().y === y).length; })()
    }));
    is('no page overflow @' + w, d.scrollW, d.clientW);
    ok('7 columns @' + w, d.cols === 7);
    const expectShort = w <= 767;
    is('weekday name @' + w, d.weekday0, expectShort ? 'Mon' : 'Monday');
    console.log(`  ${String(w).padStart(4)}  cell ${d.cellW}x${d.cellH}  cards/row ${d.cardsPerRow}  gridScrolls ${d.gridScrolls}`);
    await p.close();
  }

  // the modal at phone width
  const p = await b.newPage({ viewport: { width: 375, height: 760 } });
  await p.goto(BASE + '/prototypes/BACS-calendar/index.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
  await p.click('#cal-change-schedule');
  await p.waitForSelector('#cal-schedule-modal.show');
  await p.click('[data-schedule="days"]');
  is('modal no overflow @375', await p.evaluate(() => document.documentElement.scrollWidth), 375);
  ok('collect-on visible @375', await p.isVisible('#cal-collect-on'));
  await p.close();

  console.log('\n' + pass + ' pass, ' + fail + ' fail');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
