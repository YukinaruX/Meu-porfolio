import { useEffect, useState } from 'react';
import { configured, request } from '../lib/leads';

const statuses = ['Novo', 'Em contato', 'Proposta enviada', 'Fechado', 'Arquivado'];
export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function load(token = session?.access_token) {
    setLeads(await request('/rest/v1/leads?select=*&order=created_at.desc&limit=1000', { token }));
  }
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => { setSession(null); setLeads([]); setMessage('Sessão encerrada. Entre novamente.'); }, session.expires_in * 1000);
    return () => clearTimeout(timer);
  }, [session]);
  useEffect(() => {
    if (!session || busy) return;
    const controller = new AbortController();
    let refreshing = false;
    async function refresh() {
      if (document.visibilityState === 'hidden' || refreshing) return;
      refreshing = true;
      try {
        const rows = await request('/rest/v1/leads?select=*&order=created_at.desc&limit=1000', { token: session.access_token, signal: controller.signal });
        if (!controller.signal.aborted) setLeads(rows);
      } catch (error) {
        if (!controller.signal.aborted) setMessage(`Não consegui atualizar os pedidos. ${error.message}`);
      } finally { refreshing = false; }
    }
    const timer = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [session, busy]);
  async function login(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    const data = new FormData(event.currentTarget);
    try {
      const result = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) });
      const allowed = await request('/rest/v1/admin_users?select=user_id', { token: result.access_token });
      if (!allowed.length) throw new Error('Conta sem permissão para este painel.');
      await load(result.access_token); setSession(result);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }
  async function action(task) {
    setBusy(true); setMessage('');
    try { await task(); await load(); setMessage('Operação concluída.'); } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }
  return <main className="admin-panel" lang="pt-BR"><a href="/">← Voltar ao portfólio</a><p className="eyebrow">Rikelme Batista · Área privada</p><h1>Pedidos de orçamento</h1>
    {!configured && <p role="status">O Supabase ainda não foi configurado. Consulte docs/crm-setup.md.</p>}
    {message && <p role="status">{message}</p>}
    {!session ? <form onSubmit={login} className="admin-login"><label>E-mail<input name="email" type="email" autoComplete="username" required /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy || !configured}>Entrar no painel</button></form> : <>
      <div className="admin-tools"><label>Buscar<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome, contato ou projeto" /></label><label>Status<select value={filter} onChange={event => setFilter(event.target.value)}><option value="">Todos</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label><button disabled={busy} onClick={() => action(() => load())}>Atualizar</button><button onClick={async () => { const token = session.access_token; setSession(null); setLeads([]); try { await request('/auth/v1/logout', { method: 'POST', token }); } catch { /* Local session already cleared. */ } }}>Sair</button></div>
      <p>{leads.length} pedidos carregados (até 1.000 mais recentes). Atualização automática a cada 15 segundos enquanto o painel estiver visível e ao voltar para ele. Revise registros sem interação há 12 meses.</p>
      <div className="admin-leads">{leads.filter(lead => (!filter || lead.status === filter) && `${lead.name} ${lead.contact} ${lead.project}`.toLowerCase().includes(query.toLowerCase())).map(lead => <article key={lead.id}><p>{new Date(lead.created_at).toLocaleString('pt-BR')}</p><h2>{lead.name}</h2><p>{lead.contact}</p><p className="lead-project">{lead.project}</p><p>Prazo: {lead.timeline}</p><small>Aviso: {lead.privacy_version} · {lead.language}</small><label>Status<select disabled={busy} value={lead.status} onChange={event => action(() => request(`/rest/v1/leads?id=eq.${lead.id}`, { method: 'PATCH', token: session.access_token, headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: event.target.value, updated_at: new Date().toISOString() }) }))}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label><button disabled={busy} onClick={() => { if (window.confirm('Excluir este pedido? Esta ação não pode ser desfeita.')) action(() => request(`/rest/v1/leads?id=eq.${lead.id}`, { method: 'DELETE', token: session.access_token, headers: { Prefer: 'return=minimal' } })); }}>Excluir pedido</button></article>)}</div>{!leads.length && <p>Nenhum pedido recebido.</p>}
    </>}
  </main>;
}
