import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2')]; }));
const url = env.VITE_SUPABASE_URL;
const headers = { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:5173' };
assert.ok(url && headers.apikey, 'Configure as variáveis públicas no .env');
const endpoint = `${url}/functions/v1/lead-intake`;
const preflight = await fetch(endpoint, { method: 'OPTIONS', headers });
assert.equal(preflight.status, 204);
assert.equal(preflight.headers.get('access-control-allow-origin'), headers.Origin);
const blocked = await fetch(endpoint, { method: 'OPTIONS', headers: { ...headers, Origin: 'https://untrusted.example' } });
assert.equal(blocked.status, 403);
const anonymous = await fetch(`${url}/rest/v1/leads?select=id`, { headers });
assert.ok([401, 403].includes(anonymous.status), 'Visitante não pode ler pedidos');
const sync = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ action: 'sync' }) });
assert.equal(sync.status, 400);
const requestId = crypto.randomUUID();
const body = { request_id: requestId, name: 'Verificação técnica da integração', contact: 'integration-test@example.com', project: 'Registro sintético de teste; pode ser excluído.', timeline: 'Teste técnico', language: 'pt', privacy_version: '2026-10-23', acknowledged: true };
const invalid = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ ...body, contact: 'inválido' }) });
assert.equal(invalid.status, 400);
for (let attempt = 0; attempt < 2; attempt++) {
  const saved = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
  assert.equal(saved.status, 200, await saved.text());
}
console.log(JSON.stringify({ result: 'PASS: CORS, origem bloqueada, leitura anônima bloqueada, sincronizacao removida, validação e reenvio idempotente.', testLeadId: requestId }));
