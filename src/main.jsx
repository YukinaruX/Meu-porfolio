import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo';
import '@fontsource-variable/geist';
import './styles.css';
import './studio.css';
import App from './App';
import { LanguageProvider } from './Language';
import AdminPanel from './components/AdminPanel';

createRoot(document.getElementById('root')).render(<LanguageProvider>{window.location.pathname.replace(/\/$/, '') === '/painel' ? <AdminPanel /> : <App />}</LanguageProvider>);
