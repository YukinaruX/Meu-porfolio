const { chromium } = require('../.portfolio-tools/node_modules/playwright');
const fs = require('node:fs');
const projects = [
  { id: 'alice-vieira', url: 'https://alice-vieira.vercel.app/' },
  { id: 'everton-editor', url: 'https://landing-page-everton-editor-6nvp.vercel.app/' },
  { id: 'creci-ba', url: 'https://sistema-pessoal-pra-estudo-de-concu.vercel.app/' },
  { id: 'quiz-9ano', url: 'https://quiz-9ano.vercel.app/' },
];
(async () => {
  fs.mkdirSync('public/assets/projects', { recursive: true });
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const manifest = [];
  try {
    for (const project of projects) {
      const entry = { ...project, capturedAt: new Date().toISOString(), images: [] };
      for (const [mode, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: mode === 'mobile', hasTouch: mode === 'mobile' });
        try {
          const page = await context.newPage();
          const response = await page.goto(project.url, { waitUntil: 'networkidle', timeout: 60000 });
          if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(async () => {
            const max = Math.min(document.documentElement.scrollHeight, 16000);
            for (let y = 0; y < max; y += 700) {
              window.scrollTo(0, y);
              await new Promise(resolve => setTimeout(resolve, 80));
            }
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(1000);
          const file = `public/assets/projects/${project.id}-${mode}.png`;
          await page.screenshot({ path: file, type: 'png', fullPage: true, animations: 'disabled', timeout: 60000 });
          const png = fs.readFileSync(file);
          const height = png.readUInt32BE(20);
          entry.images.push({ mode, file, width: viewport.width, height });
          console.log(`${file} — ${viewport.width} x ${height}`);
        } finally { await context.close(); }
      }
      manifest.push(entry);
      fs.writeFileSync('docs/project-captures.json', JSON.stringify(manifest, null, 2));
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
