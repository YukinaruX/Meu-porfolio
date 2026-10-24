const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const portrait = fs.readFileSync(path.resolve('public/assets/rikelme-chat.png')).toString('base64');
    await page.setContent(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#05070c;color:#f5f7ff;font-family:Arial,sans-serif;overflow:hidden}
      main{height:100%;padding:66px 72px;background:radial-gradient(ellipse at 96% 30%,#16398488,transparent 60%);position:relative;border-bottom:8px solid #376df6}
      .brand{display:flex;align-items:center;gap:16px;font-size:24px;font-weight:700}.brand img{width:58px;height:58px;border-radius:50%;object-fit:cover;border:1px solid #6175a5}
      .label{font-size:14px;letter-spacing:3px;color:#a0afd0;margin-top:42px;text-transform:uppercase}h1{font-size:70px;line-height:1.07;letter-spacing:-3px;margin:20px 0 24px;font-weight:700}h1 span{color:#6391ff}p{font-size:22px;line-height:1.5;color:#aeb9ce;margin:0;max-width:750px}.bottom{position:absolute;bottom:48px;left:72px;right:72px;display:flex;justify-content:space-between;font-size:15px;color:#aeb9ce}.arrow{position:absolute;right:76px;top:70px;font-size:48px;color:#6391ff}
      </style><main><div class="brand"><img src="data:image/png;base64,${portrait}" alt="">Rikelme Batista</div><span class="arrow">↗</span><div class="label">Desenvolvedor & fundador da A-NFC</div><h1>Sua próxima ideia.<br><span>Pronta para o mundo.</span></h1><p>Sites, sistemas e automações.<br>Da primeira conversa ao projeto no ar.</p><div class="bottom"><span>PORTFÓLIO · PROJETOS REAIS</span><span>Software · Produtos · Automação</span></div></main></html>`);
    await page.locator('img').evaluate(image => image.decode());
    await page.screenshot({ path: 'public/social-preview.png' });
    console.log('Generated public/social-preview.png (1200 x 630).');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
