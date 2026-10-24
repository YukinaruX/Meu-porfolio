const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
  const { projects } = await import('../src/content.js');
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4188', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch('http://127.0.0.1:4188')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ locale: 'pt-BR', viewport: { width: 1440, height: 1000 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4188');
    await page.locator('.showcase-track').evaluate(el => window.scrollBy(0, el.getBoundingClientRect().top - 150));
    await page.mouse.move(0, 0);
    const x = () => page.locator('.showcase-track').evaluate(el => el.scrollLeft);
    await page.waitForTimeout(200);
    const start = await x();
    await page.waitForTimeout(900);
    assert.ok((await x()) > start + 12, 'Carousel must move automatically');
    const screen = await page.locator('.showcase-browser').first().boundingBox();
    await page.mouse.move(screen.x + 100, Math.min(screen.y + 150, 800));
    await page.waitForTimeout(100);
    const hovered = await x();
    await page.waitForTimeout(650);
    assert.ok(Math.abs((await x()) - hovered) <= 1, 'Hover must stop movement immediately');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(650);
    assert.ok((await x()) > hovered + 8, 'Leaving preview must resume movement');
    await page.locator('.showcase-track').evaluate((el, count) => { el.scrollLeft = (el.firstElementChild.getBoundingClientRect().width + 24) * count - 6; }, projects.length);
    await page.waitForTimeout(850);
    assert.ok((await x()) < 100, 'Loop must wrap without reaching the end of the track');
    assert.equal(await page.getByRole('button', { name: /pausar|retomar|pause|resume/i }).count(), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.showcase-card').count(), projects.length);
    const reducedX = await x(); await page.waitForTimeout(500);
    assert.equal(await x(), reducedX, 'Reduced motion must disable autoplay');
    assert.deepEqual(errors, []);
    console.log('PASS: continuous autoplay, immediate hover pause, hover exit resume, seamless wrap, no pause buttons and reduced motion.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
