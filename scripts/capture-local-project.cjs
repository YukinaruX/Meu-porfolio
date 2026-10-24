const { chromium } = require('playwright');
const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');

const [id, projectDir, portString, engine = 'next', route = '/'] = process.argv.slice(2);
const port = Number(portString);
if (!/^[a-z0-9-]+$/.test(id || '') || !path.isAbsolute(projectDir || '') || !Number.isInteger(port)) throw new Error('Usage: node scripts/capture-local-project.cjs ID ABSOLUTE_PROJECT_DIR PORT next|vite [ROUTE]');
const output = path.resolve('docs/private/local-captures');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync('public/assets/projects', { recursive: true });
const base = `http://127.0.0.1:${port}`;
const isOpen = (checkPort = port) => new Promise(resolve => { const socket = net.connect({ host: '127.0.0.1', port: checkPort }); socket.once('connect', () => { socket.destroy(); resolve(true); }); socket.once('error', () => resolve(false)); });
(async () => {
  if (await isOpen()) throw new Error(`Port ${port} already in use; existing process will not be touched`);
  if (engine === 'stockalto' && await isOpen(port + 1)) throw new Error('Stockalto capture API port already in use');
  const bin = engine === 'stockalto' ? path.resolve('scripts/serve-stockalto-capture.cjs') : engine === 'static' ? path.resolve('scripts/serve-capture-static.cjs') : path.join(projectDir, engine === 'vite' ? 'node_modules/vite/bin/vite.js' : 'node_modules/next/dist/bin/next');
  const args = ['stockalto', 'static'].includes(engine) ? [projectDir, String(port)] : engine === 'vite' ? ['--host', '127.0.0.1', '--port', String(port), '--strictPort'] : ['dev', '--hostname', '127.0.0.1', '--port', String(port)];
  const log = fs.openSync(path.join(output, `${id}-server.log`), 'a');
  const server = spawn(process.execPath, [bin, ...args], { cwd: projectDir, windowsHide: true, stdio: ['ignore', log, log] });
  let browser;
  const entry = { id, projectDir, route, port, serverPid: server.pid, startedAt: new Date().toISOString(), images: [], errors: [] };
  try {
    console.log(`${id}: started owned server PID ${server.pid}, port ${port}`);
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error(`Server exited with ${server.exitCode}; inspect private server log`);
      if (await isOpen()) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!(await isOpen())) throw new Error('Server did not become ready');
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const [mode, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, locale: 'pt-BR', deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: mode === 'mobile', hasTouch: mode === 'mobile' });
      try {
        const page = await context.newPage();
        page.on('pageerror', error => entry.errors.push({ mode, message: error.message.slice(0, 300) }));
        const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
        if (!response?.ok()) throw new Error(`Page HTTP ${response?.status()}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1800);
        await page.evaluate(async () => {
          const max = Math.min(document.documentElement.scrollHeight, 22000);
          for (let y = 0; y < max; y += 600) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 100)); }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(1000);
        if (id === 'riclick') await page.waitForFunction(() => document.querySelectorAll('.toast').length === 0, null, { timeout: 15000 });
        if (await page.locator('[data-nextjs-dialog-overlay]').count()) throw new Error('Next.js error overlay detected');
        await page.screenshot({ path: path.join(output, `${id}-${mode}-viewport.png`), animations: 'disabled' });
        const file = `public/assets/projects/${id}-${mode}.png`;
        await page.screenshot({ path: file, type: 'png', fullPage: true, animations: 'disabled', timeout: 60000 });
        const png = fs.readFileSync(file);
        const image = { mode, file, width: png.readUInt32BE(16), height: png.readUInt32BE(20), title: await page.title(), capturedUrl: page.url(), capturedAt: new Date().toISOString() };
        entry.images.push(image);
        console.log(`${id}: captured ${mode}, ${image.width}x${image.height}`);
      } finally { await context.close(); }
    }
  } finally {
    await browser?.close();
    if (server.exitCode === null && server.pid) {
      try { execFileSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }); } catch { server.kill(); }
    }
    fs.closeSync(log);
    for (let attempt = 0; attempt < 30 && await isOpen(); attempt++) await new Promise(resolve => setTimeout(resolve, 200));
    entry.serverClosed = !(await isOpen()) && (engine !== 'stockalto' || !(await isOpen(port + 1)));
    entry.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(output, `${id}.json`), JSON.stringify(entry, null, 2));
    console.log(`${id}: owned server stopped; port closed = ${entry.serverClosed}`);
    if (!entry.serverClosed) throw new Error('Owned server port still open; do not start next project');
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
