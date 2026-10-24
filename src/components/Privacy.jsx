import { useRef, useState } from 'react';
import { contact } from '../content';
import { useLanguage } from '../Language';

export default function Privacy() {
  const dialog = useRef(null);
  const { language } = useLanguage();
  const en = language === 'en';
  const [preferences, setPreferences] = useState(() => { try { return localStorage.getItem('portfolio-preferences') === 'yes'; } catch { return false; } });
  function save(value) {
    setPreferences(value);
    try {
      localStorage.setItem('portfolio-preferences', value ? 'yes' : 'no');
      if (!value) localStorage.removeItem('portfolio-language');
    } catch { /* Preferences remain in memory. */ }
  }
  return <div className="privacy-controls">
    <button type="button" onClick={() => dialog.current.showModal()}>{en ? 'Privacy & cookies' : 'Privacidade e cookies'}</button>
    <dialog ref={dialog} className="privacy-dialog" aria-labelledby="privacy-title">
      <button type="button" onClick={() => dialog.current.close()}>{en ? 'Close' : 'Fechar'}</button>
      <h2 id="privacy-title">{en ? 'Privacy notice & storage preferences' : 'Aviso de privacidade e preferências de armazenamento'}</h2>
      <p>{en ? 'Updated October 23, 2026. I am Rikelme Batista, responsible for the personal data submitted through this portfolio.' : 'Atualizado em 23/10/2026. Sou Rikelme Batista, responsável pelos dados pessoais enviados por este portfólio.'}</p>
      <h3>{en ? 'Project requests' : 'Pedidos de orçamento'}</h3>
      <p>{en ? 'When you submit the chat form, I receive your name, project description, timeline and email or phone number, plus submission time, language and the privacy notice version. I use this information to respond to your request and prepare a proposal, as preliminary steps toward a contract at your request. Please do not submit sensitive data or passwords. The chat uses predefined messages in my voice.' : 'Ao enviar o formulário do chat, recebo seu nome, descrição do projeto, prazo e e-mail ou telefone, além da data do envio, idioma e versão deste aviso. Uso esses dados para responder ao pedido e preparar uma proposta, em procedimentos preliminares a um contrato a seu pedido. Não envie dados sensíveis ou senhas. O chat usa mensagens predefinidas na minha voz.'}</p>
      <h3>{en ? 'Storage and sharing' : 'Armazenamento e compartilhamento'}</h3>
      <p>{en ? 'Submitted requests are stored in Supabase with access restricted to authorized administrators. WhatsApp only receives your summary when you choose to open it and send the message. These providers may process data in other countries under their own terms. There is no sale of your data or automatic marketing subscription.' : 'Os pedidos enviados são armazenados no Supabase, com acesso restrito a administradores autorizados. O WhatsApp só recebe seu resumo quando você escolhe abri-lo e enviar a mensagem. Esses fornecedores podem tratar dados em outros países, conforme seus próprios termos. Não vendo seus dados nem faço inscrição automática em marketing.'}</p>
      <h3>{en ? 'Retention and your rights' : 'Retenção e seus direitos'}</h3>
      <p>{en ? 'My retention policy is to review requests after 12 months without interaction and delete unnecessary records, unless an ongoing contract or legal obligation requires retention. You can request access, correction, information about sharing or deletion by emailing me. Deletion also takes provider backup cycles into account.' : 'Minha política é revisar pedidos após 12 meses sem interação e excluir registros desnecessários, salvo contrato em andamento ou obrigação legal de conservação. Você pode solicitar acesso, correção, informações sobre compartilhamento ou exclusão por e-mail. A exclusão considera também os ciclos de backup dos fornecedores.'} <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
      <h3>{en ? 'Cookies and browser storage' : 'Cookies e armazenamento no navegador'}</h3>
      <p>{en ? 'This site does not set advertising or analytics cookies. Your answers stay in memory until you submit them or reload the page. The portfolio-preferences key stores your storage choice until you change it or clear browser data. If you enable preferences, portfolio-language remembers PT/EN until you disable it or clear browser data. Administrator login tokens stay in memory for the session. Hosting and data providers may process connection metadata for security; it is not added to your request record.' : 'Este site não define cookies de publicidade ou análise. Suas respostas ficam na memória até você enviá-las ou recarregar a página. A chave portfolio-preferences guarda sua escolha de armazenamento até você alterá-la ou limpar os dados do navegador. Se habilitar preferências, portfolio-language lembra PT/EN até você desabilitar ou limpar os dados. Tokens de login do painel ficam na memória durante a sessão. Hospedagem e provedores de dados podem tratar metadados de conexão para segurança; eles não são adicionados ao registro do pedido.'}</p>
      <div className="privacy-actions"><button type="button" aria-pressed={!preferences} onClick={() => save(false)}>{en ? 'Essential only' : 'Somente essenciais'}</button><button type="button" aria-pressed={preferences} onClick={() => save(true)}>{en ? 'Remember language' : 'Lembrar idioma'}</button></div>
      <h3>{en ? 'Use of the portfolio' : 'Uso do portfólio'}</h3><p>{en ? 'Submitting a request does not establish a contract or guarantee price or availability. Scope, delivery dates and payment are agreed separately. External services have their own privacy policies.' : 'O envio de um pedido não estabelece contrato nem garante preço ou disponibilidade. Escopo, datas de entrega e pagamento são combinados separadamente. Serviços externos possuem políticas de privacidade próprias.'}</p>
    </dialog>
  </div>;
}
