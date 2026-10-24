const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const { projects } = await import('../src/content.js');
  const ids = ['anfc-cardapios', 'riclick', 'stockalto'];
  for (const id of ['naveg', 'creci-ba', 'quiz-9ano']) assert.equal(projects.some(project => project.id === id), false);
  for (const id of ids) {
    const capture = JSON.parse(fs.readFileSync(`docs/private/local-captures/${id}.json`, 'utf8'));
    assert.equal(capture.serverClosed, true);
    for (const mode of ['desktop', 'mobile']) {
      const project = projects.find(item => item.id === id);
      const png = fs.readFileSync(`public/assets/projects/${id}-${mode}.png`);
      assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], project.images[mode]);
    }
  }
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4189', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch('http://127.0.0.1:4189')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ locale: 'pt-BR', reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    for (const id of ids) {
      await page.goto(`http://127.0.0.1:4189/#projeto/${id}/desktop`);
      await page.locator('.project-dialog[open]').waitFor();
      assert.equal(await page.locator('#reader-title').textContent(), projects.find(item => item.id === id).name);
      await page.locator('.reader-canvas img').evaluate(image => image.decode());
      assert.equal(await page.locator('.project-dialog').getByRole('link', { name: 'Abrir site', exact: true }).count(), 0);
      assert.equal(await page.locator('.project-dialog').getByRole('link', { name: 'Ver código', exact: true }).count(), 0);
      await page.locator('.project-dialog').getByRole('button', { name: 'Celular', exact: true }).click();
      await page.locator('.reader-canvas img').evaluate(image => image.decode());
      await page.keyboard.press('Escape');
    }
    assert.equal(await page.locator('.showcase-card').count(), projects.length);
    assert.equal(await page.locator('a[href*="127.0.0.1"], a[href*="localhost"], a[href^="C:"]').count(), 0);
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.goto('http://127.0.0.1:4189/#projeto/stockalto/desktop');
    await page.locator('.project-dialog[open]').waitFor();
    await page.locator('.reader-note').filter({ hasText: 'Screenshot of the local demo mode' }).waitFor();
    await page.keyboard.press('Escape');
    for (const id of ['naveg', 'creci-ba', 'quiz-9ano']) {
      await page.goto(`http://127.0.0.1:4189/#projeto/${id}/desktop`);
      assert.equal(await page.locator('.project-dialog[open]').count(), 0);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: selected local captures, PNG dimensions, desktop/mobile readers, hidden projects unavailable, local-only links and English notes.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
