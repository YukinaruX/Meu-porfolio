import { useEffect, useState } from 'react';
import LogoLoop from './react-bits/LogoLoop';
import { stackTechnologies } from '../content';
import { useLanguage } from '../Language';

const logos = stackTechnologies.map(({ id, name }) => ({ src: `/assets/stack/${id}.svg`, alt: name, title: name, width: 32, height: 32 }));

export default function TechStack() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <section id="stack" className="tech-stack" aria-labelledby="stack-title">
    <div className="page-shell tech-stack-heading"><div><h2 id="stack-title" className="eyebrow">{en ? 'My stack' : 'Minha stack'}</h2><p>{en ? 'Technologies & tools I work with' : 'Tecnologias e ferramentas com que trabalho'}</p></div></div>
    {reduced ? <ul className="page-shell stack-static">{stackTechnologies.map(({ id, name }) => <li key={id}><img src={`/assets/stack/${id}.svg`} alt="" width="32" height="32" decoding="async" /><span>{name}</span></li>)}</ul> : <LogoLoop className="stack-loop" logos={logos} logoHeight={32} gap={48} speed={42} direction="left" pauseOnHover labels="inline" intro={false} fadeOut fadeOutWidth={0.06} ariaLabel={en ? 'Technologies I work with' : 'Tecnologias com que trabalho'} />}
  </section>;
}
