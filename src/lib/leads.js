export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
export const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
export const configured = Boolean(supabaseUrl && publicKey);
export const privacyVersion = '2026-10-23';

export async function request(path, { token, ...options } = {}) {
  if (!configured) throw new Error('Supabase ainda não configurado.');
  const response = await fetch(`${supabaseUrl}${path}`, { ...options, headers: { apikey: publicKey, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', ...options.headers } });
  if (!response.ok) {
    const messages = { 400: 'Confira os dados informados e tente novamente.', 401: 'E-mail ou senha inválidos, ou sessão expirada.', 403: 'Acesso não autorizado.', 429: 'Muitas tentativas. Aguarde um minuto e tente novamente.', 503: 'Serviço temporariamente indisponível. Tente novamente mais tarde.' };
    throw new Error(messages[response.status] || 'Não foi possível concluir. Tente novamente.');
  }
  return response.status === 204 ? null : response.json();
}
export function saveLead(answers, language, requestId) {
  return request('/functions/v1/lead-intake', { method: 'POST', body: JSON.stringify({ name: answers[0], project: answers[1], timeline: answers[2], contact: answers[3], language, privacy_version: privacyVersion, acknowledged: true, request_id: requestId }) });
}
