import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Desktop, DeviceMobile, Globe, ArrowsHorizontal } from '@phosphor-icons/react';
import Carousel from './react-bits/Carousel';
import AnimatedContent from './react-bits/AnimatedContent';
import { projects } from '../content';
import { useLanguage } from '../Language';

function ShowcaseCard({ project, index, onHover }) {
  const { t, language } = useLanguage();
  const en = language === 'en';
  const initialIndex = project.previewMode === 'mobile' ? 1 : 0;
  const [active, setActive] = useState(initialIndex);
  const modes = ['desktop', 'mobile'];
  const mode = modes[active];
  return <article className={`work-item showcase-card showcase-card--${project.id}`} aria-label={t(project.name)} onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse') onHover(false); }}>
    <div className="showcase-identity"><span className="project-monogram" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{t(project.name)}</h3><p>{t(project.category)}</p></div><a href={project.url || `#projeto/${project.id}/${mode}`} target={project.url ? "_blank" : undefined} rel={project.url ? "noopener noreferrer" : undefined} className="showcase-visit" aria-label={project.url ? (en ? `Visit ${project.name}` : `Visitar ${project.name}`) : (en ? `Explore ${project.name}` : `Explorar ${project.name}`)}>{project.url ? <Globe size={20} /> : <ArrowUpRight size={20} />}</a></div>
    <div className="showcase-browser">
      <Carousel baseWidth="100%" aspectRatio={0.64} initialIndex={initialIndex} frame={false} effect="slide" arrows indicator="dots" draggable={false} onChange={setActive} labels={{ name: en ? `Screens of ${project.name}` : `Telas de ${project.name}`, previous: en ? 'Previous screen' : 'Tela anterior', next: en ? 'Next screen' : 'Próxima tela', slide: i => i === 0 ? 'Desktop' : en ? 'Mobile' : 'Celular' }} items={modes.map(format => <div className={`showcase-screen showcase-screen--${format}`} key={format}>
        <div className="showcase-format">{format === 'desktop' ? <Desktop size={14} /> : <DeviceMobile size={14} />}{format === 'desktop' ? 'Desktop' : t('Celular')}</div>
        <div data-preview-scroll className="showcase-capture" tabIndex={0} role="region" aria-label={en ? `Scroll through ${project.name} ${format}` : `Role para explorar ${project.name} em ${format === 'mobile' ? 'celular' : 'desktop'}`}>
          <img draggable={false} src={`/assets/projects/${project.id}-${format}.png`} width={project.images[format][0]} height={project.images[format][1]} alt={t('Captura real de {name} em {mode}', { name: t(project.name), mode: format === 'desktop' ? 'desktop' : t('celular') })} loading="lazy" decoding="async" />
        </div>
      </div>)} />
    </div>
    <div className="showcase-bottom"><span>{en ? 'Scroll inside the preview' : 'Role dentro da prévia'}</span><span>{active + 1} / 2</span></div>
    <div className="showcase-links"><a href={`#projeto/${project.id}/${mode}`} className="text-link" aria-label={t('Explorar projeto {name}', { name: t(project.name) })}>{en ? 'Explore project' : 'Explorar projeto'} <ArrowUpRight size={17} /></a><span>{t(project.stack)}</span></div>
  </article>;
}

export default function ProjectShowcase() {
  const { language } = useLanguage();
  const en = language === 'en';
  const track = useRef(null);
  const drag = useRef(null);
  const section = useRef(null);
  const hovered = useRef(false);
  const manualUntil = useRef(0);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const cycle = useRef(0);
  const [position, setPosition] = useState({ index: 0, end: false });
  useEffect(() => {
    const element = track.current;
    const update = () => { const step = element.firstElementChild?.getBoundingClientRect().width + 24 || 1; cycle.current = step * projects.length; const index = Math.round(element.scrollLeft / step) % projects.length; setPosition(previous => previous.index === index ? previous : { index, end: false }); };
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(element); update();
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const element = track.current;
    let frame;
    let last = 0;
    let remainder = 0;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    const tick = now => {
      const delta = last ? Math.min(now - last, 50) : 0;
      last = now;
      if (visible && document.visibilityState === 'visible' && !hovered.current && !drag.current && !section.current.contains(document.activeElement) && !document.querySelector('dialog[open], #budget-chat') && now >= manualUntil.current) {
        remainder += delta * 0.032;
        const pixels = Math.floor(remainder);
        remainder -= pixels;
        if (pixels && cycle.current) {
          element.scrollLeft += pixels;
          if (element.scrollLeft >= cycle.current) element.scrollLeft -= cycle.current;
        }
      } else remainder = 0;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [reduced]);
  function move(direction) {
    const element = track.current;
    const step = element.firstElementChild.getBoundingClientRect().width + 24;
    manualUntil.current = performance.now() + 1800;
    const next = Math.round(element.scrollLeft / step) + direction;
    element.scrollTo({ left: next < 0 ? cycle.current - step : next * step, behavior: reduced ? 'instant' : 'smooth' });
  }
  return <section id="projetos" ref={section} className="section showcase-section" aria-labelledby="projects-title">
    <div className="page-shell"><AnimatedContent distance={25} duration={0.7}><div className="showcase-heading"><div><p className="eyebrow">01 / {en ? 'Selected work' : 'Projetos selecionados'}</p><h2 id="projects-title">{en ? 'Made to be' : 'Feitos para'}<br /><em>{en ? 'experienced.' : 'explorar.'}</em></h2></div><div className="showcase-heading-aside"><p>{en ? 'Real projects, from the first idea to the last detail. Take a closer look.' : 'Projetos reais, da primeira ideia ao último detalhe. Veja de perto.'}</p><span><ArrowsHorizontal size={19} /> {en ? 'Drag to explore' : 'Arraste para explorar'}</span></div></div></AnimatedContent></div>
    <div className={`showcase-track${reduced ? '' : ' showcase-track--loop'}`} ref={track} tabIndex={0} role="region" aria-roledescription={en ? 'carousel' : 'carrossel'} aria-label={en ? 'Completed websites' : 'Sites desenvolvidos'} onWheel={() => { manualUntil.current = performance.now() + 1800; }} onTouchStart={() => { manualUntil.current = performance.now() + 1800; }} onTouchEnd={() => { manualUntil.current = performance.now() + 1800; }} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
      onPointerDown={event => { if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a,button')) return; const preview = event.target.closest('[data-preview-scroll]'); drag.current = { x: event.clientX, y: event.clientY, left: track.current.scrollLeft, top: preview?.scrollTop || 0, preview, axis: null }; }}
      onPointerMove={event => { const state = drag.current; if (!state) return; const dx = event.clientX - state.x; const dy = event.clientY - state.y; if (!state.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 6) { state.axis = Math.abs(dy) > Math.abs(dx) && state.preview ? 'y' : 'x'; track.current.setPointerCapture(event.pointerId); track.current.classList.add('is-dragging'); } if (state.axis === 'x') track.current.scrollLeft = state.left - dx; if (state.axis === 'y') state.preview.scrollTop = state.top - dy; }} onPointerUp={() => { drag.current = null; track.current.classList.remove('is-dragging'); }} onPointerCancel={() => { drag.current = null; track.current.classList.remove('is-dragging'); }}>
      {(reduced ? projects : [...projects, ...projects, ...projects]).map((project, index) => <ShowcaseCard key={`${project.id}-${Math.floor(index / projects.length)}`} project={project} index={index % projects.length} onHover={value => { hovered.current = value; }} />)}
    </div>
    <div className="page-shell showcase-navigation"><p>{en ? `${projects.length} projects. Different challenges.` : `${projects.length} projetos. Diferentes desafios.`}<span>{en ? 'Hover over a preview to pause' : 'Passe o mouse sobre uma tela para pausar'}</span></p><div className="showcase-counter"><span>{String(position.index + 1).padStart(2, '0')} <span>/ {String(projects.length).padStart(2, '0')}</span></span><button className="icon-button" onClick={() => move(-1)} disabled={reduced && position.index === 0} aria-label={en ? 'Previous projects' : 'Projetos anteriores'}><ArrowLeft size={20} /></button><button className="icon-button" onClick={() => move(1)} disabled={reduced && track.current?.scrollLeft + track.current?.clientWidth >= track.current?.scrollWidth - 3} aria-label={en ? 'Next projects' : 'Próximos projetos'}><ArrowRight size={20} /></button></div></div>
  </section>;
}
