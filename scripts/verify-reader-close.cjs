const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4195', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) { try { if ((await fetch('http://127.0.0.1:4195')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, locale: 'pt-BR' });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:4195');
      assert.equal(await page.getByRole('button', { name: /pausar|retomar|pause|resume/i }).count(), 0);
      const opener = page.locator('.showcase-card--riclick').first().getByRole('link', { name: 'Explorar projeto Riclick', exact: true });
      for (const method of ['button', 'escape', 'backdrop', 'button']) {
        await opener.hover({ force: true });
        await opener.click();
        await page.locator('.project-dialog[open]').waitFor();
        assert.equal(await page.locator('#reader-title').textContent(), 'Riclick');
        if (method === 'button') await page.getByRole('button', { name: 'Fechar prévia do projeto', exact: true }).click();
        if (method === 'escape') await page.keyboard.press('Escape');
        if (method === 'backdrop') await page.mouse.click(3, 3);
        await page.locator('.project-dialog[open]').waitFor({ state: 'hidden' });
        await page.waitForTimeout(650);
        assert.equal(await page.locator('.project-dialog[open]').count(), 0, `${method} must stay closed at ${width}`);
        assert.ok(page.url().endsWith('#projetos'));
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
      }
      await page.goto('http://127.0.0.1:4195/#projeto/riclick/mobile');
      await page.locator('.project-dialog[open]').waitFor();
      await page.getByRole('button', { name: 'Fechar prévia do projeto', exact: true }).click();
      await page.waitForTimeout(650);
      assert.equal(await page.locator('.project-dialog[open]').count(), 0, 'Direct link must remain closed');
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log('PASS: no pause buttons; Riclick closes and stays closed by X, Escape and backdrop on desktop/mobile; reopening, direct links and page scrolling work.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
