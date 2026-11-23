import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

export default defineConfig({
  plugins: [react()],
  base: '/',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets/app',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/templates/index.html'),
        education: resolve(__dirname, 'src/templates/education.html'),
        '404': resolve(__dirname, 'src/templates/404.html'),
      },
    },
  },
  ssr: {
    noExternal: [
      '@astryxdesign/core',
      '@astryxdesign/theme-neutral',
      '@stylexjs/stylex',
    ],
  },
});
