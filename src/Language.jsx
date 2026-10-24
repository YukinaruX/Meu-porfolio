import { createContext, useContext, useEffect, useState } from 'react';
import english from './translations.en.json';

const LanguageContext = createContext(null);
function initialLanguage() {
  try {
    const saved = localStorage.getItem('portfolio-preferences') === 'yes' ? localStorage.getItem('portfolio-language') : null;
    if (saved === 'pt' || saved === 'en') return saved;
  } catch { /* Storage is optional. */ }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'pt';
}
const title = 'Rikelme Batista | Desenvolvedor & Fundador da A-NFC';
const description = 'Desenvolvedor de software e fundador da A-NFC. Backend Go, React, integrações e automação. Explore projetos, experiência e sites reais.';
const socialDescription = 'Backend Go, interfaces e automações que conectam operação e produto. Conheça meus trabalhos.';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  function t(text, values = {}) {
    const translated = language === 'en' ? (english[text] ?? text) : text;
    return translated.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
  }
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
    document.title = language === 'en' ? english[title] : title;
    for (const [selector, text] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', socialDescription],
    ]) document.querySelector(selector)?.setAttribute('content', language === 'en' ? english[text] : text);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'en' ? 'en_US' : 'pt_BR');
    try { if (localStorage.getItem('portfolio-preferences') === 'yes') localStorage.setItem('portfolio-language', language); } catch { /* Keep the selected language in memory. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <div className="site-languages" role="group" aria-label={language === 'en' ? 'Website language' : 'Idioma do site'}>
    <button type="button" lang="pt-BR" aria-label="Português" aria-pressed={language === 'pt'} onClick={() => setLanguage('pt')}>PT</button>
    <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
  </div>;
}
