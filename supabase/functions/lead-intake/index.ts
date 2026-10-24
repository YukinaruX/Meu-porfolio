import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

// Public intake validates its body; database access remains server-side.
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const origins = (Deno.env.get('ALLOWED_ORIGINS') || 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:5174,http://localhost:5174,http://127.0.0.1:4185,http://127.0.0.1:4173,http://localhost:4173').split(',').map(value => value.trim()).filter(Boolean);
  const headers = { 'Access-Control-Allow-Origin': origins.includes(origin) ? origin : 'null', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (!origins.includes(origin)) return json({ error: 'Origin not allowed' }, 403);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 12000) return json({ error: 'Request too large' }, 413);
    const body = JSON.parse(raw);
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (body.action !== undefined) return json({ error: 'Invalid action' }, 400);
    if (!uuid.test(body.request_id || '') || body.acknowledged !== true || body.privacy_version !== '2026-10-23' || !['pt', 'en'].includes(body.language)) return json({ error: 'Invalid request' }, 400);
    for (const key of ['name', 'contact', 'project', 'timeline']) {
      if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > 2000) return json({ error: 'Invalid fields' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contact.trim()) && body.contact.replace(/\D/g, '').length < 8) return json({ error: 'Invalid contact' }, 400);
    const { data: allowed, error: limitError } = await db.rpc('take_intake_slot');
    if (limitError || !allowed) return json({ error: 'Please retry later' }, 429);
    const { error } = await db.from('leads').insert({ id: body.request_id, name: body.name.trim(), contact: body.contact.trim(), project: body.project.trim(), timeline: body.timeline.trim(), language: body.language, privacy_version: body.privacy_version });
    if (error && error.code !== '23505') return json({ error: 'Unable to save' }, 500);
    return json({ saved: true });
  } catch { return json({ error: 'Unable to process request' }, 400); }
});
