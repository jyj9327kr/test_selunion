import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { getConfig } from './lib/local-config.mjs';

const config = getConfig();
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  server: { host: '127.0.0.1', port: config.sitePort, strictPort: true },
  plugins: [vinext(), sites()],
});
