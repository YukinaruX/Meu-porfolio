const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:5174/');
    await page.getByRole('button', { name: 'Privacidade e cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Lembrar idioma', exact: true }).click();
    await page.getByRole('button', { name: 'Fechar', exact: true }).click();
    await page.getByRole('button', { name: 'English', exact: true }).click();
    if (await page.locator('html').getAttribute('lang') !== 'en') throw Error('Document language');
    if (!(await page.locator('#hero-title').textContent()).includes('Your next idea.')) throw Error('Hero translation');
    const keys = Object.keys(JSON.parse(fs.readFileSync('src/translations.en.json', 'utf8').replace(/^\uFEFF/, '')));
    const leftovers = await page.evaluate(keys => {
      const set = new Set(keys);
      const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT);
      const found = [];
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        if (set.has(text)) found.push(text);
      }
      for (const node of document.querySelectorAll('[aria-label],[alt]')) {
        for (const attr of ['aria-label', 'alt']) if (set.has(node.getAttribute(attr))) found.push(node.getAttribute(attr));
      }
      return found;
    }, keys);
    if (leftovers.length) throw Error('Untranslated: ' + JSON.stringify(leftovers));
    await page.evaluate(() => location.hash = '#projeto/alice-vieira/desktop');
    await page.locator('#reader-title').waitFor();
    await page.locator('.project-dialog').getByRole('button', { name: 'Mobile', exact: true }).click();
    await page.getByRole('button', { name: 'Close project preview', exact: true }).click();
    await page.locator('.budget-launcher').click();
    await page.waitForFunction(() => !document.querySelector('#budget-answer')?.disabled);
    await page.locator('#budget-answer').fill('John');
    await page.locator('.budget-compose button').click();
    await page.waitForFunction(() => !document.querySelector('#budget-answer')?.disabled);
    await page.locator('#budget-answer').fill('Draft project');
    await page.getByRole('button', { name: 'Português', exact: true }).click();
    if (await page.locator('#budget-answer').inputValue() !== 'Draft project') throw Error('Lost draft');
    if (!(await page.locator('.budget-message--sent').textContent()).includes('John')) throw Error('Lost answer');
    if (await page.locator('.budget-chat button[aria-label="English"]').count()) throw Error('Chat switch remains');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Open quote chat', exact: true }).waitFor();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.getByRole('button', { name: 'English', exact: true }).waitFor({ state: 'visible' });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Overflow at ' + width);
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await page.getByRole('navigation').getByRole('link', { name: 'About', exact: true }).waitFor({ state: 'visible' });
      await page.getByRole('button', { name: 'Close menu', exact: true }).click();
    }
    await page.screenshot({ path: 'docs/private/english-mobile.png' });
    if (errors.length) throw Error(errors.join('\n'));
    console.log('PASS: global PT/EN, translated sections and labels, project modal, synchronized chat, preserved answers and draft, saved preference, mobile navigation at 320/390px, no overflow or browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
