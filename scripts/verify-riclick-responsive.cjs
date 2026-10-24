const { chromium } = require('playwright');
const { spawn, execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
const net = require('node:net');
(async () => {
  const occupied = await new Promise(resolve => { const socket = net.connect({ host: '127.0.0.1', port: 4302 }); socket.once('connect', () => { socket.destroy(); resolve(true); }); socket.once('error', () => resolve(false)); });
  assert.equal(occupied, false, 'Capture port must be free');
  const server = spawn(process.execPath, [path.resolve('scripts/serve-capture-static.cjs'), 'C:/Riclick/public', '4302'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch('http://127.0.0.1:4302')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const width of [390, 320, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce', isMobile: width < 600, hasTouch: width < 600 });
      await page.goto('http://127.0.0.1:4302', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, columns: getComputedStyle(document.querySelector('#tab-analytics .stats-strip')).gridTemplateColumns.split(' ').length, overflowing: [...document.querySelectorAll('#tab-analytics *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1 && !el.closest('.table-responsive')).slice(0, 10).map(el => ({ tag: el.tagName, class: el.className })) }));
      console.log(JSON.stringify(layout));
      assert.ok(layout.documentWidth <= width, `Riclick overflows at ${width}px`);
      assert.equal(layout.columns, width <= 600 ? 1 : width <= 900 ? 2 : 4, 'KPI grid must honor responsive breakpoints');
      await page.close();
    }
    console.log('PASS: Riclick layout at 320/390/768/1440px, KPI breakpoints and contained horizontal scrolling.');
  } finally { await browser?.close(); try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }); } catch { server.kill(); } }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
