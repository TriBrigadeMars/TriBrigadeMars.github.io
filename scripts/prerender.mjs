import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_DIR = path.join(ROOT, '.vite-ssr');
const APP_ASSETS_SRC = path.join(DIST, 'assets', 'app');
const APP_ASSETS_DEST = path.join(ROOT, 'assets', 'app');

async function main() {
  // 1. Copy compiled Vite JS/CSS bundles into /assets/app/
  if (fs.existsSync(APP_ASSETS_DEST)) {
    fs.rmSync(APP_ASSETS_DEST, { recursive: true, force: true });
  }
  if (fs.existsSync(APP_ASSETS_SRC)) {
    fs.mkdirSync(APP_ASSETS_DEST, { recursive: true });
    for (const entry of fs.readdirSync(APP_ASSETS_SRC)) {
      if (
        /^favicon-.*\.ico$/.test(entry) ||
        /^favicon-.*\.svg$/.test(entry) ||
        /^apple-touch-icon-.*\.png$/.test(entry)
      ) {
        continue;
      }
      fs.cpSync(path.join(APP_ASSETS_SRC, entry), path.join(APP_ASSETS_DEST, entry), {
        recursive: true,
      });
    }
  }

  // 2. Load SSR renderer (.mjs when package.json is CommonJS, .js otherwise)
  const ssrMjs = path.join(SSR_DIR, 'prerender.mjs');
  const ssrJs = path.join(SSR_DIR, 'prerender.js');
  const ssrPath = fs.existsSync(ssrMjs) ? ssrMjs : ssrJs;
  const { renderPage } = await import(pathToFileURL(ssrPath).href);

  const pages = [
    { template: 'index.html', route: 'home', out: 'index.html' },
    { template: 'education.html', route: 'education', out: 'education.html' },
    { template: '404.html', route: 'notFound', out: '404.html' },
  ];

  for (const page of pages) {
    const tplPath = path.join(DIST, 'src', 'templates', page.template);
    let html = fs.readFileSync(tplPath, 'utf8');
    const appHtml = renderPage(page.route);
    if (!html.includes('<!--app-html-->')) {
      throw new Error(`Template ${page.template} missing <!--app-html--> placeholder`);
    }
    html = html
      .replace('<!--app-html-->', appHtml)
      .replace(/\/assets\/app\/favicon-[^"']+\.ico/g, '/favicon.ico')
      .replace(/\/assets\/app\/favicon-[^"']+\.svg/g, '/assets/favicon.svg')
      .replace(/\/assets\/app\/apple-touch-icon-[^"']+\.png/g, '/assets/apple-touch-icon.png');
    fs.writeFileSync(path.join(ROOT, page.out), html, 'utf8');
    console.log(`✓ prerendered ${page.out}`);
  }

  // 3. Remove temporary build directories
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.rmSync(SSR_DIR, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
