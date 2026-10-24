const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const dir = path.resolve('docs/private/aloft-reference');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: 'pt-BR' });
  const results = { routes: [], interactions: [], failures: [] };
  async function clickMouse(locator) {
    await locator.scrollIntoViewIfNeeded({ timeout: 6000 });
    await page.waitForTimeout(350);
    const box = await locator.boundingBox();
    if (!box) throw new Error('Target not visible');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(800);
  }
  try {
    await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const carousel = page.locator('#alcSec');
    await carousel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(dir, 'carousel-before.png') });
    results.carouselMarkup = (await carousel.innerHTML()).slice(0, 35000);
    const next = page.locator('.alc-next').first();
    await clickMouse(next);
    await page.screenshot({ path: path.join(dir, 'carousel-next.png') });
    results.interactions.push({ action: 'next project page', text: (await carousel.innerText()).slice(0, 600) });
    const card = page.locator('.alc-card').first();
    results.carouselElements = await carousel.locator('[class]').evaluateAll(nodes => [...new Set(nodes.map(n => n.className))]);
    const box = await carousel.boundingBox();
    if (box) {
      await page.mouse.move(Math.min(1100, box.x + box.width * .7), Math.max(150, box.y + 220));
      await page.mouse.down();
      await page.mouse.move(350, Math.max(150, box.y + 220), { steps: 25 });
      await page.mouse.up();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(dir, 'carousel-drag.png') });
      results.interactions.push({ action: 'mouse drag across project carousel' });
    }
    await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
    for (const href of ['/#servicos', '/#cases', '/#quem-somos', '/#processo', '/#faq']) {
      try {
        await clickMouse(page.locator(`header a[href=${JSON.stringify(href)}]`).first());
        results.routes.push({ click: href, landed: page.url(), scrollY: await page.evaluate(() => scrollY) });
      } catch(e) { results.failures.push({ href, message: e.message.slice(0, 150) }); }
    }
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const faq = page.locator('#faq details summary, #faq .fq-q').first();
    if (await faq.count()) { await clickMouse(faq); results.interactions.push({ action: 'open FAQ', text: (await page.locator('#faq').innerText()).slice(0, 1000) }); }
    await clickMouse(page.locator('header a[href="/ferramentas/"]').first());
    await page.waitForLoadState('domcontentloaded');
    results.routes.push({ click: 'tools', landed: page.url() });
    await page.screenshot({ path: path.join(dir, 'tools.png'), fullPage: true });
    const tools = await page.locator('a[href]').evaluateAll(nodes => nodes.filter(a => a.href.startsWith('https://aloftagencia.com/ferramentas/') && new URL(a.href).pathname !== '/ferramentas/').map(a => ({ href: a.getAttribute('href'), url: a.href, text: a.innerText.trim() })));
    for (const [i, tool] of [...new Map(tools.map(a => [a.url, a])).values()].entries()) {
      try {
        if (page.url() !== 'https://aloftagencia.com/ferramentas/') await page.goto('https://aloftagencia.com/ferramentas/', { waitUntil: 'domcontentloaded' });
        await clickMouse(page.locator(`a[href=${JSON.stringify(tool.href)}]`).first());
        await page.waitForLoadState('domcontentloaded');
        results.routes.push({ click: tool.text, landed: page.url(), headings: await page.locator('h1,h2').allTextContents(), controls: await page.locator('input,select,button').evaluateAll(nodes => nodes.slice(0, 20).map(n => ({ tag: n.tagName, type: n.type, label: n.getAttribute('aria-label') || n.placeholder || n.innerText }))) });
        await page.screenshot({ path: path.join(dir, `tool-${i}.png`) });
        console.log('TOOL', page.url());
      } catch(e) { results.failures.push({ href: tool.href, message: e.message.slice(0, 150) }); }
    }
    for (const locale of ['en', 'es']) {
      try {
        await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
        await clickMouse(page.locator('.ls-btn').first());
        await clickMouse(page.locator(`a[href="/${locale}/"]`).first());
        await page.waitForLoadState('domcontentloaded');
        results.routes.push({ click: `language ${locale}`, landed: page.url(), h1: await page.locator('h1').allTextContents() });
      } catch(e) { results.failures.push({ locale, message: e.message.slice(0, 150) }); }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://aloftagencia.com/', { waitUntil: 'domcontentloaded' });
    await clickMouse(page.getByRole('button', { name: 'Abrir menu', exact: true }));
    await page.screenshot({ path: path.join(dir, 'mobile-menu.png') });
    results.interactions.push({ action: 'mobile menu', links: await page.locator('nav').allTextContents() });
    fs.writeFileSync(path.join(dir, 'details.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ routes: results.routes, interactions: results.interactions, failures: results.failures, carouselElements: results.carouselElements }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
