const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ locale: 'pt-BR', reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:5174');
    await page.getByRole('button', { name: 'Abrir chat de orçamento', exact: true }).click();
    for (const answer of ['Teste técnico porta 5174', 'Verificação de envio pelo navegador', 'Teste técnico', 'browser-test@example.com']) {
      await page.locator('#budget-answer').fill(answer, { timeout: 15000 });
      await page.getByRole('button', { name: 'Enviar resposta', exact: true }).click();
    }
    const send = page.getByRole('button', { name: 'Solicitar orçamento', exact: true });
    await send.waitFor();
    await page.getByRole('checkbox').check();
    const responsePromise = page.waitForResponse(response => response.url().includes('/functions/v1/lead-intake') && response.request().method() === 'POST');
    await send.click();
    const response = await responsePromise;
    assert.equal(response.status(), 200, await response.text());
    await page.getByRole('status').filter({ hasText: 'Recebi seu pedido!' }).waitFor();
    const sent = response.request().postDataJSON();
    console.log(JSON.stringify({ result: 'PASS: browser chat submitted from port 5174 and confirmed saved', testLeadId: sent.request_id }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
