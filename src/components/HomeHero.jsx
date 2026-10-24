import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Check } from '@phosphor-icons/react';
import AnimatedContent from './react-bits/AnimatedContent';
import Magnet from './react-bits/Magnet';
import { useLanguage } from '../Language';
import { openQuote } from './StudioSections';
const Threads = lazy(() => import('./react-bits/Threads'));

export default function HomeHero() {
  const { language } = useLanguage(); const en = language === 'en';
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduce(media.matches); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  return <section id="inicio" className="hero studio-hero" aria-labelledby="hero-title">
    <div className="hero-art" aria-hidden="true"><Suspense fallback={null}><Threads color="#2563eb" accentColor="#6291ff" amplitude={1.8} distance={0.25} lineCount={40} thickness={0.5} speed={0.25} angle={-12} opacity={0.5} enableMouseInteraction={!reduce} paused={reduce} /></Suspense></div>
    <div className="page-shell hero-inner">
      <div className="hero-copy">
        <AnimatedContent distance={20} duration={0.8}><p className="eyebrow hero-eyebrow"><span className="availability-dot" />Rikelme Batista <span>{en ? 'Developer & founder of A-NFC' : 'Desenvolvedor & fundador da A-NFC'}</span></p></AnimatedContent>
        <AnimatedContent distance={32} duration={0.9} delay={0.08}><h1 id="hero-title">{en ? 'Your next idea.' : 'Sua próxima ideia.'}<br /><em>{en ? 'Built for the real world.' : 'Pronta para o mundo.'}</em></h1></AnimatedContent>
        <div className="hero-details"><AnimatedContent distance={25} delay={0.16}><p className="hero-description">{en ? 'I build websites, systems and automations that connect your business to what comes next. From the first conversation to the launch.' : 'Crio sites, sistemas e automações que conectam seu negócio ao próximo passo. Da primeira conversa ao projeto no ar.'}</p><div className="hero-actions"><Magnet padding={40} magnetStrength={8} maxOffset={5} disabled={reduce}><button onClick={openQuote} className="button button-primary">{en ? 'Start a project' : 'Começar um projeto'} <ArrowUpRight size={19} /></button></Magnet><a href="#projetos" className="text-link">{en ? 'Explore the projects' : 'Explore os projetos'} <ArrowDown size={18} /></a></div><div className="hero-promises"><span><Check size={14} />{en ? 'Direct contact' : 'Contato direto'}</span><span><Check size={14} />{en ? 'Custom development' : 'Desenvolvimento sob medida'}</span></div></AnimatedContent>
        </div>
      </div>
      <div className="hero-meta"><p>{en ? 'Software · Products · Automation' : 'Software · Produtos · Automação'}</p><p className="hero-location">{en ? 'Feira de Santana, Brazil' : 'Feira de Santana, Brasil'}</p></div>
    </div>
  </section>;
}
