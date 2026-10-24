import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, DownloadSimple, List, X, Plus, Desktop, DeviceMobile, Pause, Play, FileText, MagnifyingGlass, CheckSquare, Package, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import AnimatedContent from './components/react-bits/AnimatedContent';
import Magnet from './components/react-bits/Magnet';
import { contact, projects, systems, previousExperience } from './content';
import BudgetChat from './components/BudgetChat';
import Privacy from './components/Privacy';
import HomeHero from './components/HomeHero';
import ProjectShowcase from './components/ProjectShowcase';
import TechStack from './components/TechStack';
import { Services, Process, Faq, openQuote } from './components/StudioSections';
import { LanguageSwitcher, useLanguage } from './Language';


const nav = [['projetos', 'Projetos'], ['servicos', 'Serviços'], ['sistemas', 'Sistemas'], ['processo', 'Processo'], ['sobre', 'Sobre'], ['contato', 'Contato']];
const Arrow = ({ className = '', ...props }) => <ArrowUpRight size={20} weight="regular" aria-hidden="true" className={className} {...props} />;
const Reveal = ({ children, className = '', delay = 0 }) => <AnimatedContent distance={36} duration={0.85} delay={delay} threshold={0.08} className={className}>{children}</AnimatedContent>;

function Navigation() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    }
    window.addEventListener('keydown', onKey);
    const desktop = window.matchMedia('(min-width: 768px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', onResize);
    return () => { window.removeEventListener('keydown', onKey); desktop.removeEventListener('change', onResize); };
  }, [open]);
  return <header className="site-header">
    <div className="header-inner page-shell">
      <a className="wordmark" href="#inicio" onClick={() => setOpen(false)}><img className="wordmark-avatar" src="/assets/rikelme-chat.png" width="36" height="36" alt="" decoding="async" /><span>Rikelme <span className="wordmark-last">Batista</span></span></a>
      <LanguageSwitcher />
      <button className={`menu-toggle icon-button${open ? ' is-open' : ''}`} ref={toggle} type="button" aria-expanded={open} aria-controls="primary-nav" aria-label={open ? t("Fechar menu") : t("Abrir menu")} onClick={() => setOpen(value => !value)}><span className="menu-glyph menu-glyph-list"><List size={24} aria-hidden="true" /></span><span className="menu-glyph menu-glyph-close"><X size={24} aria-hidden="true" /></span></button>
      <nav id="primary-nav" aria-label={t("Navegação principal")} className={open ? 'navigation is-open' : 'navigation'}>
        {nav.map(([id, label], index) => <a key={id} href={`#${id}`} style={{ '--menu-index': index }} onClick={() => setOpen(false)}>{t(label)}</a>)}
      </nav>
    </div>
  </header>;
}

function ProjectImage({ project, mode = 'desktop', className = '' }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('loading');
  const dimensions = project.images[mode];
  return <div className={`project-image ${className} ${status === 'loading' ? 'is-loading' : ''}`}>
    {status === 'error' ? <p className="image-error" role="status">{t("Não foi possível carregar a prévia. Use o link para abrir o site.")}</p> : <img key={`${project.id}-${mode}`} src={`/assets/projects/${project.id}-${mode}.png`} alt={t("Captura real de {name} em {mode}", { name: t(project.name), mode: mode === 'desktop' ? 'desktop' : t("celular") })} width={dimensions[0]} height={dimensions[1]} loading="lazy" decoding="async" onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />}
  </div>;
}

function ProjectReader({ selection, onClose, onModeChange }) {
  const { t } = useLanguage();
  const dialog = useRef(null);
  const scroller = useRef(null);
  const backdropPress = useRef(false);
  const project = selection?.project;
  const mode = selection?.mode || 'desktop';
  useEffect(() => {
    const element = dialog.current;
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, [project]);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; }, [project, mode]);
  function dismiss(event) { event.preventDefault(); event.stopPropagation(); backdropPress.current = false; onClose(); }
  function outside(event) { const rect = event.currentTarget.getBoundingClientRect(); return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; }
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="reader-title" onCancel={dismiss} onPointerDown={event => { backdropPress.current = event.target === event.currentTarget && outside(event); }} onPointerCancel={() => { backdropPress.current = false; }} onClick={event => { if (event.target === event.currentTarget && backdropPress.current && outside(event)) dismiss(event); backdropPress.current = false; }}>
    {project && <div className="reader-panel">
      <div className="reader-header"><div><p className="work-category">{t(project.category)}</p><h2 id="reader-title">{t(project.name)}</h2></div><button type="button" className="icon-button" onClick={dismiss} aria-label={t("Fechar prévia do projeto")}><X size={24} aria-hidden="true" /></button></div>
      <div className="reader-toolbar"><div className="view-options" role="group" aria-label={t("Formato da prévia")}><button type="button" aria-pressed={mode === 'desktop'} onClick={() => onModeChange('desktop')}><Desktop size={18} aria-hidden="true" /> Desktop</button><button type="button" aria-pressed={mode === 'mobile'} onClick={() => onModeChange('mobile')}><DeviceMobile size={18} aria-hidden="true" /> {t("Celular")}</button></div>{project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-link">{t("Abrir site")} <Arrow size={17} /></a> : <span className="reader-note">{t("Projeto em desenvolvimento")}</span>}</div>
      <div className={`reader-canvas reader-canvas--${mode}`} ref={scroller} tabIndex={0} role="region" aria-label={t("Captura completa de {name}; role para explorar", { name: t(project.name) })}><ProjectImage key={`${project.id}-${mode}`} project={project} mode={mode} /></div>
      <div className="reader-details"><p>{t(project.description)}</p>{project.note && <p className="reader-note">{t(project.note)}</p>}<div className="reader-bottom"><span>{t(project.stack)}</span>{project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-link">{t("Ver código")} <Arrow size={16} /></a>}</div></div>
    </div>}
  </dialog>;
}

function OperationsDiagram() {
  const { t } = useLanguage();
  const steps = [[FileText, t("Solicitação")], [MagnifyingGlass, t("Análise")], [CheckSquare, t("Aprovação")], [Package, t("Entrega")]];
  return <div className="operations-diagram" aria-label={t("Fluxo operacional: solicitação, análise, aprovação e entrega")}>
    {steps.map(([Icon, label], index) => <div className="operation-step" key={label}><Icon size={28} weight="light" aria-hidden="true" /><span>{label}</span>{index < steps.length - 1 && <span className="operation-connector" aria-hidden="true" />}</div>)}
  </div>;
}

function Systems() {
  const { t } = useLanguage();
  return <section id="sistemas" className="section systems-section" aria-labelledby="systems-title"><div className="page-shell">
    <Reveal><p className="eyebrow section-eyebrow">{t("Engenharia aplicada")}</p><h2 id="systems-title">{t("Por trás da interface,")}<br /><em>{t("o sistema.")}</em></h2><p className="systems-intro">{t("Soluções para organizar operações, integrar serviços e transformar regras de negócio em produto.")}</p></Reveal>
    <Reveal className="system-feature"><div className="system-flow"><OperationsDiagram /><p>{t("No Facilities MG, solicitações, aprovações e entrega fazem parte de um fluxo único e rastreável.")}</p></div><div className="system-feature-copy"><h3>Facilities MG</h3><p className="feature-label">{t("Gestão de facilities")}</p><p>{t("Fluxos de aprovação, inventário e rastreamento operacional.")}</p><span className="work-stack">Go · React · PostgreSQL</span></div></Reveal>
    <Reveal><div className="system-list-header"><p>{t("Cases de projetos privados")}</p><span>{t("Contexto, contribuição e tecnologia")}</span></div><div className="system-list">{systems.map(system => <details key={system.name} className="system-case"><summary><h3>{t(system.name)}</h3><span>{t(system.domain)}</span><Plus size={22} aria-hidden="true" /></summary><div className="system-details"><div><p className="detail-label">{t("O produto")}</p><p>{t(system.description)}</p></div><div><p className="detail-label">{t("Minha participação")}</p><p>{t(system.contribution)}</p></div><p className="system-technologies">{t(system.stack)}<span>{t(system.organization)} · {t("Código privado")}</span></p></div></details>)}</div></Reveal>
    <p className="section-footnote">{t("Os cases apresentam o contexto e as contribuições. Código, dados e ambientes internos permanecem privados.")}</p>
  </div></section>;
}

function FounderSpotlight() {
  const { t } = useLanguage();
  return <Reveal className="founder-spotlight-wrap"><article id="anfc" className="founder-spotlight" aria-labelledby="anfc-title"><div className="company-identity"><div className="company-lockup"><span className="brand-plate"><img src="/assets/brand/anfc-original.png" width="256" height="181" loading="lazy" alt={t("Marca original da A-NFC")} /></span><p translate="no">A-NFC</p></div><p>Rikelme Batista <span>{t("Fundador & desenvolvedor")}</span></p></div><div className="company-story"><p className="eyebrow">{t("Minha empresa")}</p><h2 id="anfc-title">{t("Da visão")}<br /><em>{t("ao produto.")}</em></h2><p>{t("Sou fundador da A-NFC. Desenvolvo soluções digitais sob demanda e produtos que conectam o físico ao digital.")}</p><ul className="company-services"><li>{t("Sites & aplicações")}</li><li>{t("Automação & integrações")}</li><li>NFC & QR Codes</li></ul><a href="https://anfc.shop" target="_blank" rel="noopener noreferrer" className="text-link">{t("Conheça a A-NFC")} <Arrow /></a></div></article></Reveal>;
}

function About() {
  const { t, language } = useLanguage();
  return <section id="sobre" className="section page-shell about-section" aria-labelledby="about-title">
    <FounderSpotlight />
    <Reveal className="about-copy"><p className="eyebrow section-eyebrow">{t("Sobre mim")}</p><h2 id="about-title">{t("Engenharia,")}<br /><em>{t("com contexto.")}</em></h2><p>{t("Sou Rikelme Batista, desenvolvedor de software e fundador da A-NFC. Minha experiência em operações orienta a forma como desenho e construo sistemas.")}</p><p>{t("Trabalho do backend à interface, conectando regras de negócio, integrações e infraestrutura.")}</p><h3 className="skill-heading">{t("Principais tecnologias")}</h3><ul className="skill-list">{['Go', 'React / Next.js', 'TypeScript', 'PostgreSQL / Supabase', 'Docker / CI/CD', 'Git / Jenkins', 'Kotlin / Java', 'Python / C#', t("IA e integrações")].map(skill => <li key={skill}>{skill}</li>)}</ul></Reveal>
    <Reveal className="career" delay={0.1}><h3 className="eyebrow section-eyebrow">{t("Experiência e formação")}</h3><ol className="timeline"><li><p className="career-date">{t("set/2026 – atual")}</p><h4>{t("Fundador")} <span>· A-NFC</span></h4><p>{t("Soluções digitais sob demanda: sites, landing pages e aplicações web.")}</p></li><li><p className="career-date">{t("mai/2026 – set/2026")}</p><h4>Software Developer <span>· Grupo Royalty / Mansão Green</span></h4><p>{t("Sistemas internos, integrações, arquitetura e CI/CD. Atuação full-stack com Go, React e TypeScript.")}</p></li><li><p className="career-date">{t("mar/2024 – dez/2027")} <span>{t("· previsão de conclusão")}</span></p><h4>{t("Engenharia de Software")} <span>· UNIFAN</span></h4><p>{t("Bacharelado em andamento no Centro Universitário Nobre.")}</p></li></ol><details className="earlier-career"><summary>{t("Ver trajetória anterior")} <Plus size={18} aria-hidden="true" /></summary><ul>{previousExperience.map(([role, company, dates]) => <li key={company}><strong>{t(role)}</strong><span>{company}</span><small>{t(dates)}</small></li>)}</ul></details><a className="text-link resume-link" href={language === 'en' ? contact.resumeEn : contact.resume} hrefLang={language === 'en' ? 'en' : 'pt-BR'} download><DownloadSimple size={19} aria-hidden="true" /> {t("Baixar currículo")}</a></Reveal>
  </section>;
}

function Contact() {
  const { t, language } = useLanguage();
  return <section id="contato" className="section contact-section" aria-labelledby="contact-title"><div className="page-shell">
    <Faq /><Reveal className="contact-main"><div><p className="eyebrow section-eyebrow">{t("Rikelme Batista · Fundador da A-NFC")}</p><h2 id="contact-title">{t("Seu próximo projeto")}<br /><em>{t("começa aqui.")}</em></h2><p>{t("Converse comigo sobre sites, sistemas e soluções")}<br className="desktop-break" /> {t("para o seu negócio.")}</p><a className="email-link" href={`mailto:${contact.email}`}>{contact.email}<Arrow size={26} /></a></div><Magnet padding={70} magnetStrength={8} maxOffset={10} wrapperClassName="contact-magnet"><a href={`mailto:${contact.email}`} className="contact-orbit" aria-label={t("Conversar com Rikelme por e-mail")}><Arrow size={64} weight="light" /></a></Magnet></Reveal>
    <button className="button button-primary contact-quote" onClick={openQuote}>{t("Começar um projeto")} <Arrow /></button>
    <div className="social-links"><a className="text-link" href={contact.github} target="_blank" rel="noopener noreferrer"><GithubLogo size={19} aria-hidden="true" /> GitHub <Arrow size={16} /></a><a className="text-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinLogo size={19} aria-hidden="true" /> LinkedIn <Arrow size={16} /></a><a className="text-link" href={language === 'en' ? contact.resumeEn : contact.resume} hrefLang={language === 'en' ? 'en' : 'pt-BR'} download><DownloadSimple size={19} aria-hidden="true" /> {t("Currículo")}</a></div>
    <footer className="site-footer"><a href="#inicio" className="footer-brand">Rikelme Batista</a><p>{t("A-NFC · Tecnologia & soluções digitais")}</p><Privacy /><a href="#inicio">{t("Voltar ao topo")} <ArrowUp size={16} aria-hidden="true" /></a></footer>
  </div></section>;
}

export default function App() {
  const { t } = useLanguage();
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    function readHash() {
      const [, id, requestedMode] = window.location.hash.match(/^#projeto\/([^/]+)(?:\/(desktop|mobile))?$/) || [];
      const project = projects.find(item => item.id === id);
      setSelection(project ? { project, mode: requestedMode || 'desktop' } : null);
    }
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);
  function closeReader() { window.history.replaceState(null, '', '#projetos'); setSelection(null); }
  function openReader(event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#projeto/"]');
    if (!link) return;
    const [, id, mode] = link.getAttribute('href').match(/^#projeto\/([^/]+)(?:\/(desktop|mobile))?$/) || [];
    const project = projects.find(item => item.id === id);
    if (!project) return;
    event.preventDefault();
    const selectedMode = mode || project.previewMode || 'desktop';
    window.history.pushState(null, '', `#projeto/${project.id}/${selectedMode}`);
    setSelection({ project, mode: selectedMode });
  }
  function changeMode(mode) { window.history.replaceState(null, '', `#projeto/${selection.project.id}/${mode}`); setSelection({ ...selection, mode }); }
  return <><a href="#conteudo" className="skip-link">{t("Pular para o conteúdo")}</a><Navigation /><main id="conteudo" onClick={openReader}><HomeHero /><TechStack /><ProjectShowcase /><Services /><Systems /><Process /><About /><Contact /></main><BudgetChat /><ProjectReader selection={selection} onClose={closeReader} onModeChange={changeMode} /></>;
}
