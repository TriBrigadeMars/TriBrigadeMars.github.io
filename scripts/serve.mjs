#!/usr/bin/env node
/**
 * Serve the repository root exactly the way GitHub Pages does for this site.
 *
 * The deployable output of this repo is the repository root: `index.html`,
 * `education.html`, `404.html`, `assets/`, `llms*.txt`, `sitemap.xml`. GitHub
 * Pages "legacy" publishing serves that tree directly, so `npm run dev` (Vite on
 * `src/templates/`) is not the same thing. This server lets you check the real
 * prerendered pages, and `scripts/a11y.mjs` reuses it in CI.
 *
 * Usage:
 *   node scripts/serve.mjs [--port 4173] [--host 127.0.0.1] [--root .] [--quiet]
 *
 * Stdlib only, no dependencies, no build step.
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function resolveFile(root, urlPath) {
  // Reject anything that escapes the served root after normalisation.
  const relative = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const target = path.resolve(root, `.${path.sep}${relative}`);
  if (target !== root && !target.startsWith(root + path.sep)) {
    return null;
  }
  return target;
}

function statOrNull(target) {
  try {
    return fs.statSync(target);
  } catch {
    return null;
  }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'text/plain; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-cache',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  res.end(body);
}

/**
 * @param {{root?: string, port?: number, host?: string, quiet?: boolean}} options
 * @returns {Promise<{server: http.Server, port: number, url: string, close: () => Promise<void>}>}
 */
export async function createSiteServer({ root = DEFAULT_ROOT, port = 0, host = '127.0.0.1', quiet = true } = {}) {
  const documentRoot = path.resolve(root);
  const notFoundPage = path.join(documentRoot, '404.html');

  const server = http.createServer((req, res) => {
    const started = Date.now();
    const log = (status) => {
      if (!quiet) {
        console.log(`${req.method} ${req.url} → ${status} (${Date.now() - started}ms)`);
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('allow', 'GET, HEAD');
      send(res, 405, 'Method Not Allowed\n');
      log(405);
      return;
    }

    let urlPath;
    try {
      urlPath = new URL(req.url, 'http://localhost').pathname;
    } catch {
      send(res, 400, 'Bad Request\n');
      log(400);
      return;
    }
    if (urlPath.endsWith('/')) {
      urlPath += 'index.html';
    }

    const target = resolveFile(documentRoot, urlPath);
    const stat = target ? statOrNull(target) : null;

    if (target && stat?.isFile()) {
      const body = fs.readFileSync(target);
      res.writeHead(200, {
        'content-type': MIME[path.extname(target).toLowerCase()] ?? 'application/octet-stream',
        'content-length': body.length,
        'cache-control': 'no-cache',
        'x-content-type-options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : body);
      log(200);
      return;
    }

    if (target && stat?.isDirectory()) {
      const index = path.join(target, 'index.html');
      if (statOrNull(index)?.isFile()) {
        res.writeHead(301, { location: `${urlPath}/`.replace(/\/index\.html$/, '/') });
        res.end();
        log(301);
        return;
      }
    }

    // Extensionless routes: /education → /education.html
    if (target && !path.extname(target)) {
      const withExtension = `${target}.html`;
      if (statOrNull(withExtension)?.isFile()) {
        const body = fs.readFileSync(withExtension);
        res.writeHead(200, {
          'content-type': MIME['.html'],
          'content-length': body.length,
          'cache-control': 'no-cache',
        });
        res.end(req.method === 'HEAD' ? undefined : body);
        log(200);
        return;
      }
    }

    const fallback = statOrNull(notFoundPage)?.isFile()
      ? fs.readFileSync(notFoundPage)
      : Buffer.from('404 Not Found\n');
    res.writeHead(404, {
      'content-type': MIME['.html'],
      'content-length': fallback.length,
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : fallback);
    log(404);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.removeListener('error', reject);
      resolve();
    });
  });

  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  return {
    server,
    port: actualPort,
    url: `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${actualPort}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

function readFlag(argv, name, fallback) {
  const index = argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  const value = argv[index + 1];
  if (value === undefined) {
    console.error(`✗ --${name} needs a value`);
    process.exit(2);
  }
  return value;
}

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntryPoint) {
  const argv = process.argv.slice(2);
  const port = Number(readFlag(argv, 'port', process.env.PORT ?? '4173'));
  const host = readFlag(argv, 'host', '127.0.0.1');
  const root = path.resolve(readFlag(argv, 'root', DEFAULT_ROOT));
  const quiet = argv.includes('--quiet');

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error(`✗ invalid port: ${port}`);
    process.exit(2);
  }
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`✗ ${root} has no index.html — run \`npm run build\` first.`);
    process.exit(1);
  }

  try {
    const site = await createSiteServer({ root, port, host, quiet });
    console.log(`Serving ${root}`);
    console.log(`  ${site.url}/`);
    console.log(`  ${site.url}/education.html`);
    console.log('Press Ctrl+C to stop.');
    const shutdown = async () => {
      await site.close();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    if (error?.code === 'EADDRINUSE') {
      console.error(`✗ port ${port} is already in use — try \`npm run preview -- --port ${port + 1}\``);
      process.exit(1);
    }
    throw error;
  }
}
