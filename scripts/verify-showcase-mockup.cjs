const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4190', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch('http://127.0.0.1:4190')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ locale: 'pt-BR', viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:4190');
      const card = page.locator('.showcase-card--riclick').first();
      const frame = card.locator('.showcase-browser');
      await frame.scrollIntoViewIfNeeded();
      const capture = card.locator('.carousel-slide[data-current="true"] .showcase-capture');
      assert.equal(await card.locator('.carousel-slide[data-current="true"] .showcase-screen--mobile').count(), 1);
      assert.ok((await card.getByRole('link', { name: 'Explorar projeto Riclick', exact: true }).getAttribute('href')).endsWith('/mobile'));
      await capture.locator('img').evaluate(el => { el.loading = 'eager'; return el.decode(); });
      const frameBox = await frame.boundingBox();
      const captureBox = await capture.boundingBox();
      const controlsBox = await card.locator('.carousel-controls').boundingBox();
      assert.ok(Math.abs(captureBox.width - frameBox.width) <= 2, 'Mobile capture must fill the frame without side gutters');
      assert.ok(controlsBox.y > frameBox.y && controlsBox.y + controlsBox.height < frameBox.y + frameBox.height, 'Controls must float inside the frame');
      assert.equal(await card.locator('.showcase-browser-bar').count(), 0);
      assert.ok(await capture.locator('img').evaluate(el => el.getBoundingClientRect().height + 1 >= el.parentElement.getBoundingClientRect().height), 'Image must fill the frame height');
      await frame.screenshot({ path: `docs/private/riclick-mockup-${width}.png` });
      await card.getByRole('link', { name: 'Explorar projeto Riclick', exact: true }).click();
      await page.locator('.project-dialog[open]').waitFor();
      assert.equal(await page.locator('.project-dialog').getByRole('button', { name: 'Celular', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.keyboard.press('Escape');
      await card.getByRole('button', { name: 'Desktop', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.showcase-card--riclick .carousel-slide[data-current="true"] .showcase-screen--desktop'));
      await capture.locator('img').evaluate(el => { el.loading = 'eager'; return el.decode(); });
      assert.ok(await capture.locator('img').evaluate(el => el.getBoundingClientRect().height + 1 >= el.parentElement.getBoundingClientRect().height), 'Short desktop capture must not leave a blank area');
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log('PASS: mobile-first Riclick on desktop/mobile, full-width frame, overlay controls, correct reader mode, desktop fill and no JavaScript errors.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
