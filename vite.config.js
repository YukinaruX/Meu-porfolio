import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const configuredUrl = env.VITE_SITE_URL || 'https://rikfazlp.online';
  const origin = configuredUrl ? new URL(/^https?:\/\//.test(configuredUrl) ? configuredUrl : `https://${configuredUrl}`).origin : '';
  return {
  plugins: [react(), tailwindcss(), {
    name: 'portfolio-social-origin',
    transformIndexHtml(html) { return html.replaceAll('__SITE_ORIGIN__', origin); },
  }],
  server: { host: '127.0.0.1' },
  build: { sourcemap: false },
  };
});
