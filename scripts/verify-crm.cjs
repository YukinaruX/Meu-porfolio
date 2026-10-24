const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
  const { productionSupabase } = await import('../src/lib/supabase-public.js');
  const configured = Boolean(productionSupabase.url && productionSupabase.publishableKey);
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4185', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    for (let i = 0; i < 40; i++) {
      try { if ((await fetch('http://127.0.0.1:4185')).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ locale: 'pt-BR', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4185');
    assert.equal(await page.evaluate(() => localStorage.getItem('portfolio-language')), null);
    await page.getByRole('button', { name: 'Privacidade e cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Lembrar idioma', exact: true }).click();
    await page.getByRole('button', { name: 'Fechar', exact: true }).click();
    await page.getByRole('button', { name: 'English', exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('portfolio-language')), 'en');
    await page.getByRole('button', { name: 'Privacy & cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Essential only', exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('portfolio-language')), null);
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('button', { name: 'Português', exact: true }).click();
    await page.getByRole('button', { name: 'Abrir chat de orçamento', exact: true }).click();
    for (const answer of ['Cliente exemplo', 'Sistema de agendamento', 'Em dois meses', 'cliente@example.com']) {
      const input = page.locator('#budget-answer');
      await input.fill(answer, { timeout: 10000 });
      await page.getByRole('button', { name: 'Enviar resposta', exact: true }).click();
    }
    const submit = page.getByRole('button', { name: 'Solicitar orçamento', exact: true });
    await submit.waitFor();
    assert.equal(await submit.isDisabled(), true);
    assert.equal(await page.getByRole('link', { name: 'Prefere conversar agora?' }).count(), 0);
    await page.getByRole('button', { name: 'Editar respostas', exact: true }).click();
    await page.getByRole('textbox', { name: 'Projeto', exact: true }).fill('Sistema de agendamento revisado');
    await page.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
    await page.locator('.budget-summary').getByText('Sistema de agendamento revisado', { exact: true }).waitFor();
    await page.getByRole('checkbox').check();
    if (configured) {
      assert.equal(await submit.isEnabled(), true);
      let submitted;
      let attempts = 0;
      await page.route('**/functions/v1/lead-intake', async route => {
        submitted = route.request().postDataJSON();
        attempts++;
        await route.fulfill({ status: attempts === 1 ? 500 : 200, contentType: 'application/json', body: JSON.stringify(attempts === 1 ? { error: 'test failure' } : { saved: true }) });
      });
      await submit.click();
      await page.getByRole('alert').filter({ hasText: 'Não consegui confirmar' }).waitFor();
      assert.equal(await page.getByText('Recebi seu pedido!', { exact: false }).count(), 0);
      const retryId = submitted.request_id;
      await submit.click();
      await page.getByRole('status').filter({ hasText: 'Recebi seu pedido!' }).waitFor();
      assert.equal(submitted.project, 'Sistema de agendamento revisado');
      assert.equal(submitted.request_id, retryId);
      assert.equal(attempts, 2);
      assert.equal(await submit.count(), 0);
      await page.getByRole('button', { name: 'English', exact: true }).click();
      await page.getByRole('status').filter({ hasText: 'I received your request!' }).waitFor();
      await page.getByRole('button', { name: 'Português', exact: true }).click();
    } else {
      await page.getByText('O envio pelo site ainda não está disponível.', { exact: false }).waitFor();
      assert.equal(await submit.isDisabled(), true);
    }
    const whatsapp = page.getByRole('link', { name: configured ? 'Prefere conversar agora?' : 'Continuar comigo no WhatsApp', exact: false });
    assert.ok(decodeURIComponent(await whatsapp.getAttribute('href')).includes('Contato: cliente@example.com'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto('http://127.0.0.1:4185/painel');
    await page.getByRole('heading', { name: 'Pedidos de orçamento' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Entrar no painel' }).isDisabled(), !configured);
    if (configured) {
      let reads = 0;
      await page.route('**/auth/v1/token?*', route => route.fulfill({ json: { access_token: 'mock-token', expires_in: 3600 } }));
      await page.route('**/rest/v1/admin_users?*', route => route.fulfill({ json: [{ user_id: 'mock-admin' }] }));
      await page.route('**/rest/v1/leads?*', route => {
        reads++;
        return route.fulfill({ json: reads === 1 ? [] : [{ id: 'mock-lead', name: 'Novo pedido automático', contact: 'test@example.com', project: 'Teste de atualização', timeline: 'Teste', status: 'Novo', created_at: new Date().toISOString(), privacy_version: '2026-10-23', language: 'pt' }] });
      });
      await page.clock.install();
      await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill('admin@example.com');
      await page.getByLabel('Senha', { exact: true }).fill('mock-password');
      await page.getByRole('button', { name: 'Entrar no painel', exact: true }).click();
      await page.getByText('Nenhum pedido recebido.', { exact: true }).waitFor();
      await page.clock.fastForward(15000);
      await page.getByRole('heading', { name: 'Novo pedido automático', exact: true }).waitFor();
      assert.equal(reads, 2);
      await page.getByRole('button', { name: 'Sair', exact: true }).click();
      await page.clock.fastForward(30000);
      assert.equal(reads, 2);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: privacy, editable summary, failed submission/retry, PT/EN confirmation, secondary WhatsApp, automatic admin refresh and cleanup on logout.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
