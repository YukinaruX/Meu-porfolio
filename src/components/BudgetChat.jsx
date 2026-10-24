import { useEffect, useRef, useState } from 'react';
import { X, PaperPlaneRight, ChatCircleDots, ArrowUpRight } from '@phosphor-icons/react';
import { contact } from '../content';
import { useLanguage } from '../Language';
import { saveLead, configured } from '../lib/leads';
import AnimatedContent from './react-bits/AnimatedContent';

const copy = {
  pt: {
    questions: ['Oi! Que bom te ver por aqui 👋 Sou o Rikelme Batista. Como você se chama?', 'Prazer! Me conta: qual sistema você quer que eu desenvolva e o que ele precisa resolver?', 'Entendi! Para eu planejar o desenvolvimento, você tem um prazo ou uma data ideal para colocar esse sistema no ar?'],
    ready: 'Organizei sua ideia! Confira o resumo antes de solicitar seu orçamento.',
    title: 'Orçamento com Rikelme', subtitle: 'Vamos tirar sua ideia do papel', close: 'Fechar chat',
    note: 'Desenvolvimento de sistemas · contato pessoal', date: 'Solicitação de orçamento', recorded: 'Registrado',
    typingLabel: 'Rikelme digitando', typing: 'Digitando…', whatsapp: 'Continuar comigo no WhatsApp',
    hint: 'Ao abrir o WhatsApp, toque em enviar para me mandar o resumo.', restart: 'Começar outra conversa',
    labels: ['Seu nome', 'Descreva seu sistema', 'Prazo desejado'], waitSummary: 'Aguarde seu resumo',
    placeholders: ['Seu nome…', 'Conte sua ideia…', 'Qual é o prazo?'], wait: 'Aguarde a mensagem…', send: 'Enviar resposta',
    closeLauncher: 'Fechar chat de orçamento', openLauncher: 'Abrir chat de orçamento', invitation: 'Vamos criar seu sistema?',
    portrait: 'Retrato de Rikelme Batista',
    summary: 'Olá, Rikelme! Quero solicitar um orçamento de sistema.', fields: ['Nome', 'Projeto', 'Prazo'],
  },
  en: {
    questions: ["Hi! Glad you're here 👋 I'm Rikelme Batista. What's your name?", "Nice to meet you! Tell me about the system you'd like me to build and the problem it should solve.", 'Got it! To help me plan the development, do you have a deadline or an ideal launch date for your system?'],
    ready: "I've put your idea together! Review the summary before requesting your quote.",
    title: 'Get a quote from Rikelme', subtitle: "Let's bring your idea to life", close: 'Close chat',
    note: 'Custom software development · personal contact', date: 'Project quote', recorded: 'Recorded',
    typingLabel: 'Rikelme is typing', typing: 'Typing…', whatsapp: 'Continue with me on WhatsApp',
    hint: 'Once WhatsApp opens, tap send to share your summary with me.', restart: 'Start a new conversation',
    labels: ['Your name', 'Describe your system', 'Desired timeline'], waitSummary: 'Preparing your summary',
    placeholders: ['Your name…', 'Tell me your idea…', "What's your timeline?"], wait: 'Waiting for the message…', send: 'Send reply',
    closeLauncher: 'Close quote chat', openLauncher: 'Open quote chat', invitation: "Ready to build your system?",
    portrait: 'Portrait of Rikelme Batista',
    summary: "Hi, Rikelme! I'd like a quote for a custom software project.", fields: ['Name', 'Project', 'Timeline'],
  },
};
const contactQuestions = { pt: 'Qual é seu e-mail ou WhatsApp para eu te responder?', en: 'What email or WhatsApp number can I use to get back to you?' };
for (const language of ['pt', 'en']) copy[language].questions = [...copy[language].questions, contactQuestions[language]];
export default function BudgetChat() {
  const { language } = useLanguage();
  const t = copy[language];
  const questions = t.questions;
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [draft, setDraft] = useState('');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState([]);
  const requestId = useRef(crypto.randomUUID());
  const en = language === 'en';
  const launcher = useRef(null);
  const input = useRef(null);
  const conversation = useRef(null);
  const typing = visibleMessages <= answers.length;
  const complete = answers.length === questions.length && !typing;
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('portfolio:open-quote', show);
    return () => window.removeEventListener('portfolio:open-quote', show);
  }, []);
  useEffect(() => {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open || !typing) return;
    const message = questions[answers.length] || t.ready;
    const timer = window.setTimeout(() => setVisibleMessages(previous => previous + 1), Math.min(1900, Math.max(1000, message.length * 17)));
    return () => window.clearTimeout(timer);
  }, [open, typing, answers.length, questions, t.ready]);
  useEffect(() => {
    if (open && !typing) input.current?.focus({ preventScroll: true });
  }, [open, typing]);
  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [answers, open, visibleMessages, language, saved]);
  function close() { setOpen(false); launcher.current?.focus(); }
  function submit(event) {
    event.preventDefault();
    if (!draft.trim() || typing || complete) return;
    setAnswers(previous => [...previous, draft.trim()]);
    setDraft('');
  }
  async function store() {
    if (!acknowledged || saving || saved || editing) return;
    setSaving(true); setError('');
    try { await saveLead(answers, language, requestId.current); setSaved(true); }
    catch { setError(en ? 'I could not confirm your request. Please try again.' : 'Não consegui confirmar seu pedido. Tente novamente.'); }
    finally { setSaving(false); }
  }
  const summary = `${t.summary}\n\n${[...t.fields, en ? 'Contact' : 'Contato'].map((field, index) => `${field}: ${answers[index] || ''}`).join('\n')}`;
  return <aside className="budget-widget" lang={language === 'pt' ? 'pt-BR' : 'en'} aria-label={t.title}>
    {open && <AnimatedContent trigger="mount" distance={16} duration={0.28} scale={0.94} ease="power2.out" className="budget-chat-reveal"><section id="budget-chat" className="budget-chat" role="dialog" aria-modal="false" aria-labelledby="budget-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <header className="budget-header"><img src="/assets/rikelme-chat.png" alt="" /><div><h2 id="budget-title">Rikelme Batista</h2><p>{t.subtitle}</p></div><button type="button" onClick={close} aria-label={t.close}><X size={22} /></button></header>
      <p className="budget-note">{t.note}</p>
      <div className="budget-conversation" ref={conversation} role="log" aria-live="polite" aria-relevant="additions">
        <span className="budget-date">{t.date}</span>
        {questions.slice(0, Math.min(visibleMessages, questions.length)).map((question, index) => <div className="budget-exchange" key={index}><p className="budget-message budget-message--received">{question}</p>{answers[index] && <p className="budget-message budget-message--sent">{answers[index]}<span aria-label={t.recorded}>✓✓</span></p>}</div>)}
        {typing && <div className="budget-typing" role="status" aria-label={t.typingLabel}><span /><span /><span /><small>{t.typing}</small></div>}
        {complete && <div className="budget-message budget-message--received budget-review">
          {saved ? <>
            <p role="status">{en ? 'I received your request! I will contact you at the email address or phone number you provided.' : 'Recebi seu pedido! Vou entrar em contato pelo endereço ou número informado.'}</p>
            <a className="budget-secondary" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(summary)}`}>{en ? 'Prefer to chat now?' : 'Prefere conversar agora?'} <ArrowUpRight size={16} /></a>
            <small>{t.hint}</small>
          </> : <>
            <p>{t.ready}</p>
            {editing ? <form className="budget-edit" onSubmit={event => { event.preventDefault(); setAnswers(editedAnswers.map(value => value.trim())); setEditing(false); setAcknowledged(false); setError(''); }}>
              {[...t.fields, en ? 'Contact' : 'Contato'].map((field, index) => <label key={index}>{field}<textarea autoFocus={index === 0} required maxLength={2000} value={editedAnswers[index]} onChange={event => setEditedAnswers(previous => previous.map((value, position) => position === index ? event.target.value : value))} /></label>)}
              <button className="budget-send-summary" disabled={editedAnswers.some(value => !value.trim())}>{en ? 'Save changes' : 'Salvar alterações'}</button>
              <button className="budget-secondary" type="button" onClick={() => setEditing(false)}>{en ? 'Cancel' : 'Cancelar'}</button>
            </form> : <>
              <dl className="budget-summary">{[...t.fields, en ? 'Contact' : 'Contato'].map((field, index) => <div key={index}><dt>{field}</dt><dd>{answers[index]}</dd></div>)}</dl>
              <button className="budget-secondary" type="button" disabled={saving} onClick={() => { setEditedAnswers([...answers]); setEditing(true); }}>{en ? 'Edit answers' : 'Editar respostas'}</button>
              <p>{en ? 'I will use your details to respond to your quote request.' : 'Vou usar seus dados para responder ao seu pedido de orçamento.'} <a href="#contato" onClick={event => { event.preventDefault(); document.querySelector('.privacy-controls > button')?.click(); }}>{en ? 'Privacy notice' : 'Aviso de privacidade'}</a></p>
              <label className="lead-acknowledgement"><input type="checkbox" disabled={saving} checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} />{en ? 'I have read the privacy notice and want to submit this request.' : 'Li o aviso de privacidade e quero enviar este pedido.'}</label>
              <button className="budget-send-summary" type="button" disabled={!configured || !acknowledged || saving} onClick={store}>{saving ? (en ? 'Sending…' : 'Enviando…') : (en ? 'Request a quote' : 'Solicitar orçamento')}</button>
              {!configured && <small>{en ? 'Online submission is not available yet.' : 'O envio pelo site ainda não está disponível.'}</small>}
              {error && <p role="alert">{error}</p>}
              {(!configured || error) && <a className="budget-secondary" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(summary)}`}>{t.whatsapp} <ArrowUpRight size={16} /></a>}
            </>}
          </>}
        </div>}
      </div>
      {complete ? <div className="budget-restart"><button type="button" disabled={saving} onClick={() => { setAnswers([]); setDraft(''); setVisibleMessages(0); setAcknowledged(false); setSaved(false); setError(''); setEditing(false); setEditedAnswers([]); requestId.current = crypto.randomUUID(); }}>{t.restart}</button></div> : <form className="budget-compose" onSubmit={submit}><label className="sr-only" htmlFor="budget-answer">{t.labels[answers.length] || (en ? 'Your contact' : 'Seu contato')}</label><input ref={input} id="budget-answer" value={draft} disabled={typing} onChange={event => setDraft(event.target.value)} placeholder={typing ? t.wait : (t.placeholders[answers.length] || (en ? 'Email or WhatsApp' : 'E-mail ou WhatsApp'))} maxLength={2000} autoComplete={answers.length === 0 ? 'name' : 'off'} /><button type="submit" disabled={typing || !draft.trim()} aria-label={t.send}><PaperPlaneRight size={21} weight="fill" /></button></form>}
    </section></AnimatedContent>}
    <button ref={launcher} type="button" className="budget-launcher" aria-label={open ? t.closeLauncher : t.openLauncher} aria-expanded={open} aria-controls="budget-chat" onClick={() => open ? close() : setOpen(true)}>{atEnd && !open && <span className="budget-launcher-label">{t.invitation}</span>}<img src="/assets/rikelme-chat.png" alt={t.portrait} /><span className="budget-launcher-icon">{open ? <X size={18} /> : <ChatCircleDots size={19} weight="fill" />}</span></button>
  </aside>;
}
