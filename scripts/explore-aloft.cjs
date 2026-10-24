const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const dir = path.resolve('docs/private/aloft-reference');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: 'pt-BR' });
  const findings = { routes: [], interactions: [], failed: [] };
  try {
    await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(dir, 'home.png') });
    const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href'), absolute: a.href })));
    findings.links = links;
    findings.buttons = await page.locator('button').evaluateAll(nodes => nodes.map(b => ({ text: b.innerText.trim(), label: b.getAttribute('aria-label'), class: b.className })));
    findings.sections = await page.locator('section').evaluateAll(nodes => nodes.map(n => ({ id: n.id, heading: n.querySelector('h1,h2,h3')?.textContent?.trim(), class: n.className })));
    const targets = [...new Map(links.filter(a => a.absolute.startsWith('https://aloftagencia.com/') && !/\.(pdf|png|jpg|svg|webp|mp4)/i.test(a.absolute)).map(a => [a.absolute, a])).values()];
    for (const [i, link] of targets.entries()) {
      try {
        if (new URL(page.url()).pathname !== '/') await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
        const locator = page.locator('a[href]').filter({ visible: true });
        const target = page.locator('a').filter({ has: undefined });
        const match = page.locator(`a[href=${JSON.stringify(link.href)}]`).first();
        await match.scrollIntoViewIfNeeded({ timeout: 5000 });
        const box = await match.boundingBox();
        if (!box) throw new Error('No visible click target');
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(1300);
        findings.routes.push({ clicked: link, landed: page.url(), heading: await page.locator('h1').allTextContents() });
        await page.screenshot({ path: path.join(dir, `route-${i}.png`) });
        console.log('CLICK', link.text.slice(0, 55), link.href, '->', page.url());
      } catch (error) { findings.failed.push({ href: link.href, error: error.message.slice(0, 180) }); }
    }
    await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
    const cases = page.locator('#cases, #projetos, [id*=case]').first();
    if (await cases.count()) await cases.scrollIntoViewIfNeeded();
    findings.finalButtons = await page.locator('button').evaluateAll(nodes => nodes.map(b => ({ text: b.innerText.trim(), label: b.getAttribute('aria-label'), class: b.className })));
    fs.writeFileSync(path.join(dir, 'exploration.json'), JSON.stringify(findings, null, 2));
    console.log(JSON.stringify({ routes: findings.routes.length, failed: findings.failed, sections: findings.sections, buttons: findings.buttons }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
