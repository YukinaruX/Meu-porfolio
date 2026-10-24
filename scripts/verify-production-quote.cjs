const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

// Explicit opt-in: writes one clearly identified synthetic request to production.
// The UUID is saved privately so that only that request can be inspected/removed.
if (!process.argv.includes('--live')) throw new Error('Use --live to verify a real production submission.');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let submitted;
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', locale: 'pt-BR' });
    await page.goto('https://rikfazlp.online/');
    await page.locator('.budget-launcher').click();
    for (const answer of ['Verificacao tecnica de producao', 'Registro sintetico para validar orcamento; remover apos teste.', 'Teste tecnico', 'production-check@example.com']) {
      await page.locator('#budget-answer').fill(answer, { timeout: 15000 });
      await page.locator('.budget-compose button').click();
    }
    const send = page.locator('.budget-send-summary');
    await send.waitFor({ timeout: 15000 });
    assert.equal(await send.isDisabled(), true, 'Requires privacy acknowledgement');
    await page.locator('.lead-acknowledgement input').check();
    assert.equal(await send.isEnabled(), true, 'Production build must configure Supabase without local .env');
    page.on('request', request => {
      if (request.url().endsWith('/functions/v1/lead-intake') && request.method() === 'POST') {
        submitted = request.postDataJSON();
        fs.mkdirSync('docs/private', { recursive: true });
        fs.writeFileSync('docs/private/production-quote-test.json', JSON.stringify({ requestId: submitted.request_id }, null, 2));
      }
    });
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/functions/v1/lead-intake') && response.request().method() === 'POST');
    await send.click();
    const response = await responsePromise;
    assert.equal(response.status(), 200, await response.text());
    assert.deepEqual(await response.json(), { saved: true });
    await page.locator('.budget-review [role="status"]').waitFor();
    assert.equal(await send.count(), 0, 'Successful request replaces submission button');
    console.log(JSON.stringify({ result: 'PASS: production privacy acknowledgement, enabled submit, real HTTP save and confirmation', requestId: submitted.request_id }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
