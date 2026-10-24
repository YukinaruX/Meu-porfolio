import { ArrowUpRight, Browser, BracketsCurly, PlugsConnected, ChatCircle, Code, RocketLaunch, PencilSimple, Plus } from '@phosphor-icons/react';
import AnimatedContent from './react-bits/AnimatedContent';
import SpotlightCard from './react-bits/SpotlightCard';
import { useLanguage } from '../Language';

export function openQuote() { window.dispatchEvent(new Event('portfolio:open-quote')); }

export function Services() {
  const { language } = useLanguage(); const en = language === 'en';
  const services = [
    { Icon: Browser, title: en ? 'Websites & landing pages' : 'Sites & landing pages', text: en ? 'Your business presented clearly. Responsive pages with an identity of their own and a clear path to contact.' : 'Seu negócio bem apresentado. Páginas responsivas, com identidade própria e um caminho claro até o contato.', tags: 'React · Next.js · UI/UX', number: '01' },
    { Icon: BracketsCurly, title: en ? 'Custom systems' : 'Sistemas sob medida', text: en ? 'From business rules to daily operations. Applications that bring workflows, people and information together.' : 'Da regra de negócio à operação do dia a dia. Aplicações que conectam processos, pessoas e informação.', tags: 'Go · TypeScript · PostgreSQL', number: '02' },
    { Icon: PlugsConnected, title: en ? 'Automation & integrations' : 'Automação & integrações', text: en ? 'Connect the tools you already use. Fewer repetitive tasks and more time to focus on your business.' : 'Conecte as ferramentas que você já usa. Menos tarefas repetitivas e mais tempo para cuidar do negócio.', tags: 'APIs · IA · Webhooks', number: '03' },
  ];
  return <section id="servicos" className="section page-shell studio-services" aria-labelledby="services-title"><AnimatedContent distance={25}><div className="studio-heading"><p className="eyebrow">02 / {en ? 'What I do' : 'O que eu faço'}</p><h2 id="services-title">{en ? 'Your idea deserves' : 'Sua ideia merece'}<br /><em>{en ? 'a good execution.' : 'uma boa execução.'}</em></h2><p>{en ? 'Design, development and business context working together, from the very first conversation.' : 'Design, desenvolvimento e contexto de negócio trabalhando juntos, desde a primeira conversa.'}</p></div></AnimatedContent><div className="service-grid">{services.map(({ Icon, title, text, tags, number }) => <SpotlightCard key={number} className="service-card" spotlightColor="#6291ff" intensity={0.12} ambient={false}><div className="service-symbol"><Icon size={32} weight="light" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p><span className="service-tags">{tags}</span><button onClick={openQuote} className="text-link">{en ? 'Talk about your project' : 'Conversar sobre seu projeto'} <ArrowUpRight size={17} /></button></SpotlightCard>)}</div></section>;
}

export function Process() {
  const { language } = useLanguage(); const en = language === 'en';
  const steps = en ? [
    [ChatCircle, 'A good conversation', 'We discuss your idea, the problem to solve and what matters to your business.'],
    [PencilSimple, 'A clear direction', 'We agree on scope, priorities, design and a proposal tailored to the project.'],
    [Code, 'Time to build', 'I turn the plan into a working product, with progress updates and room for feedback.'],
    [RocketLaunch, 'Ready for the world', 'We review the experience, test on desktop and mobile, and prepare the launch.'],
  ] : [
    [ChatCircle, 'Uma boa conversa', 'Entendemos sua ideia, o problema a resolver e o que importa para o seu negócio.'],
    [PencilSimple, 'Um caminho claro', 'Alinhamos escopo, prioridades, design e uma proposta pensada para o projeto.'],
    [Code, 'Hora de construir', 'Transformo o plano em produto, com acompanhamento da evolução e espaço para feedback.'],
    [RocketLaunch, 'Pronto para o mundo', 'Revisamos a experiência, testamos em desktop e celular e preparamos a publicação.'],
  ];
  return <section id="processo" className="section process-section" aria-labelledby="process-title"><div className="page-shell"><AnimatedContent distance={25}><div className="studio-heading"><p className="eyebrow">04 / {en ? 'How we work' : 'Como funciona'}</p><h2 id="process-title">{en ? 'From the first hello' : 'Do primeiro oi'}<br /><em>{en ? 'to the launch.' : 'ao projeto no ar.'}</em></h2></div></AnimatedContent><div className="process-grid">{steps.map(([Icon, title, description], index) => <AnimatedContent key={index} distance={25} delay={index * 0.07}><article className="process-card"><div className="process-illustration"><Icon size={52} weight="light" /><span>0{index + 1}</span><i aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article></AnimatedContent>)}</div></div></section>;
}

export function Faq() {
  const { language } = useLanguage(); const en = language === 'en';
  const items = en ? [
    ['What kind of project can we build?', 'Websites, landing pages, web applications, internal systems and integrations. We start with the problem you need to solve and define the right scope together.'],
    ['How much does a project cost?', 'The investment depends on the scope, integrations and complexity. Send your idea through the quote chat so I can understand the details and prepare a proposal.'],
    ['How long does development take?', 'The timeline is agreed upon after reviewing the requirements and priorities. Your preferred date helps us plan a realistic delivery.'],
    ['Can you improve an existing system?', 'Yes. I can assess the current application and discuss improvements to its interface, workflows or integrations. Access and scope are agreed upon before starting.'],
    ['How do I request a quote?', 'Use the quote chat to share your name, project, timeline and contact. Review the summary and submit it. I will get back to you using the details you provided.'],
  ] : [
    ['Que tipo de projeto podemos construir?', 'Sites, landing pages, aplicações web, sistemas internos e integrações. Começamos pelo problema que você precisa resolver e definimos o escopo juntos.'],
    ['Quanto custa um projeto?', 'O investimento depende do escopo, das integrações e da complexidade. Envie sua ideia pelo chat de orçamento para eu entender os detalhes e preparar uma proposta.'],
    ['Qual é o prazo de desenvolvimento?', 'O prazo é alinhado após entendermos os requisitos e as prioridades. Sua data desejada ajuda a planejar uma entrega realista.'],
    ['Você pode melhorar um sistema existente?', 'Sim. Posso avaliar a aplicação atual e conversar sobre melhorias na interface, nos fluxos ou nas integrações. Acesso e escopo são combinados antes do início.'],
    ['Como solicito um orçamento?', 'Use o chat para informar seu nome, projeto, prazo e contato. Confira o resumo e envie o pedido. Vou responder pelo endereço ou número informado.'],
  ];
  return <div className="faq-section" aria-labelledby="faq-title"><div><p className="eyebrow">06 / {en ? 'Good questions' : 'Antes de começar'}</p><h2 id="faq-title">{en ? 'Any' : 'Ficou com'}<br /><em>{en ? 'questions?' : 'dúvidas?'}</em></h2></div><div className="faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div>;
}
