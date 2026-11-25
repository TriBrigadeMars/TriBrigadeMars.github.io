#!/usr/bin/env node
/**
 * Static quality gate for the prerendered site: links, anchors, ids, images,
 * headings, meta/Open Graph/canonical, JSON-LD, sitemap and robots.txt.
 *
 * Runs on the root HTML files exactly as GitHub Pages serves them, needs no
 * browser and no dependencies, and works the same on Linux and Windows.
 *
 * Usage: node scripts/check_html.mjs [repo_root]
 * Exit:  0 = no errors (warnings allowed), 1 = errors found.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const SITEMAP = 'sitemap.xml';
const ROBOTS = 'robots.txt';

const errors = [];
const warnings = [];

function error(page, message) {
  errors.push({ page, message });
}
function warn(page, message) {
  warnings.push({ page, message });
}

/* ------------------------------------------------------------------ parsing */

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', middot: '·', mdash: '—', ndash: '–', hellip: '…',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', times: '×', bull: '•',
};

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

function parseAttributes(raw) {
  const attrs = {};
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attrs;
}

/** All tags with this name, in document order. */
function tags(html, name) {
  const found = [];
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
  let match;
  while ((match = re.exec(html)) !== null) {
    found.push({ raw: match[0], attrs: parseAttributes(match[1]), index: match.index });
  }
  return found;
}

function hasTag(html, name) {
  return new RegExp(`<${name}\\b`, 'i').test(html);
}

function textContent(html) {
  return decodeEntities(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
}

/** Remove script/style bodies and comments so tag scanning cannot trip on JS strings. */
function scannable(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, '<script$1></script>')
    .replace(/<style\b([^>]*)>[\s\S]*?<\/style>/gi, '<style$1></style>')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, (svg) => svg.replace(/<[^>]+>/g, ' '));
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tagName = (tag) => /^<([a-z0-9]+)/i.exec(tag.raw)?.[1]?.toLowerCase() ?? '';

/** Content between a tag's opening tag and the first matching closing tag. */
function innerHtml(html, tag, name) {
  const close = html.toLowerCase().indexOf(`</${name}`, tag.index + tag.raw.length);
  return close === -1 ? '' : html.slice(tag.index + tag.raw.length, close);
}

/** Visible text of the element that owns this id. */
function textById(html, id) {
  const open = new RegExp(`<([a-z0-9]+)\\b[^>]*\\bid="${escapeRegExp(id)}"`, 'i').exec(html);
  if (!open) return '';
  return textContent(innerHtml(html, { index: open.index, raw: open[0] }, open[1]));
}

/** Accessible name for a link/button, or '' when it has none. */
function accessibleName(tag, html, name) {
  if (tag.attrs['aria-label']?.trim()) return tag.attrs['aria-label'].trim();
  const labelledBy = tag.attrs['aria-labelledby'];
  if (labelledBy) {
    const label = labelledBy.split(/\s+/).map((id) => textById(html, id)).join(' ').trim();
    if (label) return label;
  }
  const inner = innerHtml(html, tag, name);
  if (/<img\b/i.test(inner)) {
    const alt = tags(inner, 'img').map((img) => img.attrs.alt ?? '').join(' ').trim();
    if (alt) return alt;
  }
  return textContent(inner);
}

/* ---------------------------------------------------------------- resolving */

function localTarget(root, page, reference) {
  const clean = reference.split('#')[0].split('?')[0].trim();
  if (!clean) return null; // in-page anchor or empty
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(clean)) return null; // absolute URL / mailto / data
  const base = clean.startsWith('/') ? root : path.dirname(path.join(root, page));
  const candidate = path.resolve(base, clean.replace(/^[/\\]+/, ''));
  const candidates = [candidate];
  if (clean.endsWith('/')) {
    candidates.push(path.join(candidate, 'index.html'));
  } else if (!path.extname(candidate)) {
    candidates.push(`${candidate}.html`, path.join(candidate, 'index.html'));
  }
  const found = candidates.find((file) => {
    try {
      return fs.statSync(file).isFile();
    } catch {
      return false;
    }
  });
  return found ?? candidates[0];
}

/** Ids defined in a page, for fragment validation. */
function idsOf(html) {
  const ids = new Set();
  for (const tag of tags(html, '[a-z0-9]+')) {
    if (tag.attrs.id) ids.add(tag.attrs.id);
  }
  return ids;
}

/* ------------------------------------------------------------------- checks */

const htmlFiles = fs.readdirSync(ROOT)
  .filter((file) => file.endsWith('.html'))
  .sort();

if (htmlFiles.length === 0) {
  console.error(`✗ no HTML files in ${ROOT} — run it from the repository root`);
  process.exit(1);
}

const documents = new Map();
for (const file of htmlFiles) {
  documents.set(file, fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

const idIndex = new Map([...documents].map(([file, html]) => [file, idsOf(scannable(html))]));
const titles = new Map();
const sitemapOrigin = readSitemapOrigin();

for (const [file, html] of documents) {
  checkDocument(file, html);
}

function checkDocument(file, html) {
  const body = scannable(html);
  const isPrerendered = html.includes('<!--app-html-->') === false;

  if (!/^<!DOCTYPE html>/i.test(html.trimStart())) {
    error(file, 'missing <!DOCTYPE html>');
  }
  if (!isPrerendered) {
    error(file, 'still contains <!--app-html--> — the page was not prerendered, run `npm run build`');
  }

  const htmlTag = tags(html, 'html')[0];
  const lang = htmlTag?.attrs.lang ?? '';
  if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/.test(lang)) {
    error(file, `<html lang="${lang}"> is missing or not a valid language tag`);
  }
  if (htmlTag?.attrs['aria-hidden'] === 'true') {
    error(file, '<html> must not be aria-hidden');
  }

  if (!tags(html, 'meta').some((meta) => (meta.attrs.charset ?? '').toLowerCase() === 'utf-8')) {
    error(file, 'missing <meta charset="utf-8">');
  }

  const viewport = tags(html, 'meta').find((meta) => meta.attrs.name === 'viewport');
  if (!viewport) {
    error(file, 'missing <meta name="viewport">');
  } else if ((viewport.attrs.content ?? '').includes('user-scalable=no')) {
    error(file, 'viewport disables zoom (user-scalable=no)');
  }

  // Head metadata ---------------------------------------------------------
  const meta = {};
  for (const tag of tags(html, 'meta')) {
    const key = tag.attrs.property ?? tag.attrs.name;
    if (key) meta[key.toLowerCase()] = tag.attrs.content ?? '';
  }
  const canonical = tags(html, 'link').filter((link) => (link.attrs.rel ?? '').toLowerCase() === 'canonical');
  const noindex = /(?:^|,)\s*noindex\b/i.test(meta.robots ?? '');

  const pageTitles = tags(html, 'title');
  if (pageTitles.length !== 1) {
    error(file, `expected exactly one <title>, found ${pageTitles.length}`);
  } else {
    const title = textContent(innerHtml(html, pageTitles[0], 'title'));
    if (!title) error(file, '<title> is empty');
    if (title.length > 70) warn(file, `<title> is ${title.length} chars (search results truncate around 60-70)`);
    if (titles.has(title) && titles.get(title) !== file) {
      error(file, `duplicate <title> shared with ${titles.get(title)}`);
    }
    titles.set(title, file);
  }

  if (noindex) {
    if (canonical.length > 0) warn(file, 'noindex page also declares a canonical URL');
  } else {
    if (canonical.length === 0) error(file, 'public page is missing <link rel="canonical">');
    if (canonical.length > 1) error(file, `${canonical.length} canonical links found`);

    const description = meta.description ?? '';
    if (!description) {
      error(file, 'public page is missing <meta name="description">');
    } else if (description.length < 40 || description.length > 160) {
      warn(file, `meta description is ${description.length} chars (recommended 40-160)`);
    }

    for (const key of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:site_name', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      if (!meta[key]) error(file, `missing <meta property/name="${key}">`);
    }

    if (canonical[0] && meta['og:url'] && canonical[0].attrs.href !== meta['og:url']) {
      error(file, `og:url (${meta['og:url']}) does not match canonical (${canonical[0].attrs.href})`);
    }
    if (canonical[0]) {
      const href = canonical[0].attrs.href ?? '';
      if (!/^https:\/\//.test(href)) error(file, `canonical is not an absolute https URL: ${href}`);
      if (sitemapOrigin && !href.startsWith(sitemapOrigin)) {
        error(file, `canonical ${href} is outside the sitemap origin ${sitemapOrigin}`);
      }
    }
    for (const key of ['og:image', 'twitter:image']) {
      const value = meta[key];
      if (!value) continue;
      if (!/^https?:\/\//.test(value)) {
        error(file, `${key} must be an absolute URL: ${value}`);
        continue;
      }
      const target = localTarget(ROOT, file, value.replace(/^(?:https?:)?\/\/[^/]+/, ''));
      if (target && !exists(target)) error(file, `${key} points at a missing file: ${value}`);
    }
    for (const key of ['og:image', 'twitter:image']) {
      if (meta[key] && !meta[`${key}:alt`] && !meta['og:image:alt']) {
        warn(file, `${key} has no accompanying :alt text`);
      }
    }
  }

  // JSON-LD ---------------------------------------------------------------
  for (const tag of tags(html, 'script')) {
    if ((tag.attrs.type ?? '').toLowerCase() !== 'application/ld+json') continue;
    const start = tag.index + tag.raw.length;
    const end = html.indexOf('</script>', start);
    const payload = html.slice(start, end === -1 ? undefined : end).trim();
    try {
      JSON.parse(payload);
    } catch (parseError) {
      error(file, `JSON-LD does not parse: ${parseError.message}`);
    }
  }

  // Structure and ids ------------------------------------------------------
  const headings = [...body.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  if (headings.length === 0) {
    error(file, 'no headings — page has no document outline');
  }
  if (headings.filter((level) => level === 1).length !== 1) {
    error(file, `expected exactly one <h1>, found ${headings.filter((level) => level === 1).length}`);
  }
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] > headings[i - 1] + 1) {
      warn(file, `heading order jumps from h${headings[i - 1]} to h${headings[i]}`);
    }
  }
  if (tags(body, 'main').length !== 1) {
    error(file, `expected exactly one <main>, found ${tags(body, 'main').length}`);
  }

  const seenIds = new Map();
  for (const tag of tags(body, '[a-z0-9]+')) {
    const id = tag.attrs.id;
    if (!id) continue;
    if (/\s/.test(id)) error(file, `id contains whitespace: "${id}"`);
    if (seenIds.has(id)) {
      error(file, `duplicate id "${id}"`);
    } else {
      seenIds.set(id, true);
    }
  }

  // Accessibility primitives ----------------------------------------------
  for (const img of tags(body, 'img')) {
    if (!('alt' in img.attrs)) {
      error(file, `<img> without alt: ${img.attrs.src ?? img.raw.slice(0, 60)}`);
    }
  }
  for (const link of tags(body, 'a')) {
    if (!link.attrs.href) continue;
    if (!accessibleName(link, body, 'a')) {
      error(file, `<a href="${link.attrs.href}"> has no accessible name`);
    }
    if (link.attrs.target === '_blank') {
      const rel = (link.attrs.rel ?? '').split(/\s+/);
      if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
        error(file, `target="_blank" link without rel="noopener": ${link.attrs.href}`);
      }
    }
  }
  for (const button of tags(body, 'button')) {
    if (!accessibleName(button, body, 'button')) {
      error(file, '<button> has no accessible name');
    }
  }
  for (const input of tags(body, 'input')) {
    const type = (input.attrs.type ?? 'text').toLowerCase();
    if (type === 'hidden') continue;
    const id = input.attrs.id;
    const labelled = input.attrs['aria-label'] || input.attrs['aria-labelledby'] ||
      (id && tags(body, 'label').some((label) => label.attrs.for === id));
    if (!labelled) {
      error(file, `<input${id ? ` id="${id}"` : ''}> has no associated <label>`);
    }
  }

  for (const tag of tags(body, '[a-z0-9]+')) {
    for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
      const value = tag.attrs[attribute];
      if (!value) continue;
      for (const id of value.split(/\s+/)) {
        if (id && !seenIds.has(id)) {
          error(file, `${attribute}="${value}" references missing id "${id}"`);
        }
      }
    }
    const tabindex = Number.parseInt(tag.attrs.tabindex ?? '', 10);
    if (Number.isFinite(tabindex) && tabindex > 0) {
      error(file, `tabindex="${tabindex}" forces a positive tab order`);
    }
    const role = tag.attrs.role;
    if (role === 'tab' && !('aria-selected' in tag.attrs)) {
      error(file, 'role="tab" without aria-selected');
    }
    if (role === 'tablist' && !accessibleName(tag, body, tagName(tag))) {
      error(file, 'role="tablist" without an accessible name');
    }
    if (role === 'tabpanel' && !tag.attrs['aria-labelledby'] && !tag.attrs['aria-label']) {
      warn(file, 'role="tabpanel" without a label');
    }
    if (tagName(tag) === 'dialog' && !tag.attrs['aria-label'] && !tag.attrs['aria-labelledby']) {
      warn(file, '<dialog> without aria-label/aria-labelledby');
    }
  }

  // Links and references ---------------------------------------------------
  const references = [];
  for (const name of ['a', 'area', 'link', 'script', 'img', 'source', 'video', 'audio', 'iframe', 'embed', 'track']) {
    for (const tag of tags(body, name)) {
      const value = tag.attrs.href ?? tag.attrs.src ?? tag.attrs.data;
      if (value) references.push({ value, name });
    }
  }
  for (const tag of tags(body, 'form')) {
    if (tag.attrs.action) references.push({ value: tag.attrs.action, name: 'form' });
  }

  const imagesWithoutSize = [];
  for (const tag of tags(body, 'img')) {
    if (!tag.attrs.width || !tag.attrs.height) imagesWithoutSize.push(tag.attrs.src ?? '(inline)');
  }
  if (imagesWithoutSize.length > 0) {
    warn(file, `${imagesWithoutSize.length} <img> without width/height (layout shift risk)`);
  }

  for (const { value, name } of references) {
    if (/^(?:javascript|data|vbscript):/i.test(value)) {
      error(file, `<${name}> uses a non-navigable scheme: ${value.slice(0, 60)}`);
      continue;
    }
    if (/^(?:mailto|tel):/i.test(value)) continue;
    if (value === '#' || value === '') {
      error(file, `<${name}> has an empty target`);
      continue;
    }
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;

    const [pathPart, fragment] = value.split('#');
    const target = localTarget(ROOT, file, pathPart || pageFor(file));
    if (target && !exists(target)) {
      error(file, `<${name}> points at a missing file: ${value}`);
      continue;
    }
    if (fragment) {
      const targetFile = pageFor(target);
      const idSet = idIndex.get(targetFile);
      if (idSet && !idSet.has(fragment)) {
        error(file, `anchor not found: ${value}`);
      }
    }
  }
}

function pageFor(fileOrTarget) {
  const base = path.basename(fileOrTarget);
  return base.endsWith('.html') && idIndex.has(base) ? base : 'index.html';
}

function exists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ sitemap */

function readSitemapOrigin() {
  const file = path.join(ROOT, SITEMAP);
  if (!fs.existsSync(file)) return null;
  const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(fs.readFileSync(file, 'utf8'));
  if (!loc) return null;
  try {
    return new URL(loc[1]).origin;
  } catch {
    return null;
  }
}

function checkSitemap(publicPages) {
  const file = path.join(ROOT, SITEMAP);
  if (!fs.existsSync(file)) {
    error(SITEMAP, 'missing — crawlers cannot discover the pages');
    return;
  }
  const xml = fs.readFileSync(file, 'utf8');
  if (!/<urlset\b/i.test(xml)) error(SITEMAP, 'missing <urlset> root element');

  const entries = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = match[1];
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(block)?.[1];
    if (!loc) {
      error(SITEMAP, '<url> without <loc>');
      continue;
    }
    entries.push({
      loc,
      lastmod: /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(block)?.[1] ?? '',
      changefreq: /<changefreq>\s*([^<\s]+)\s*<\/changefreq>/.exec(block)?.[1] ?? '',
      priority: /<priority>\s*([^<\s]+)\s*<\/priority>/.exec(block)?.[1] ?? '',
    });
  }
  if (entries.length === 0) error(SITEMAP, 'no <url> entries');

  const seen = new Set();
  const listed = [];
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  for (const entry of entries) {
    if (seen.has(entry.loc)) error(SITEMAP, `duplicate <loc> ${entry.loc}`);
    seen.add(entry.loc);

    if (!/^https:\/\//.test(entry.loc)) {
      error(SITEMAP, `<loc> is not an absolute https URL: ${entry.loc}`);
      continue;
    }
    const url = new URL(entry.loc);
    const target = localTarget(ROOT, path.basename(url.pathname) || 'index.html', url.pathname);
    if (!target || !exists(target)) {
      error(SITEMAP, `<loc> does not map to a file in the repo: ${entry.loc}`);
      continue;
    }
    const page = path.basename(target);
    listed.push(page);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
      error(SITEMAP, `<lastmod> missing or not YYYY-MM-DD for ${entry.loc}`);
    } else {
      const date = new Date(`${entry.lastmod}T00:00:00Z`);
      if (Number.isNaN(date.getTime())) {
        error(SITEMAP, `invalid <lastmod> date for ${entry.loc}`);
      } else if (date > today) {
        error(SITEMAP, `<lastmod> is in the future for ${entry.loc}`);
      }
    }
    if (entry.changefreq && !['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(entry.changefreq)) {
      error(SITEMAP, `invalid <changefreq> "${entry.changefreq}"`);
    }
    const priority = Number.parseFloat(entry.priority);
    if (entry.priority && (Number.isNaN(priority) || priority < 0 || priority > 1)) {
      error(SITEMAP, `invalid <priority> "${entry.priority}"`);
    }
  }

  for (const page of publicPages) {
    if (!listed.includes(page)) error(SITEMAP, `public page ${page} is missing from the sitemap`);
  }
  if (listed.includes('404.html')) {
    error(SITEMAP, 'error page 404.html must not be listed in the sitemap');
  }
}

function checkRobots(origin) {
  const file = path.join(ROOT, ROBOTS);
  if (!fs.existsSync(file)) {
    error(ROBOTS, 'missing — crawlers get no sitemap pointer');
    return;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (!/^\s*user-agent:\s*\*/im.test(text)) error(ROBOTS, 'no "User-agent: *" block');
  if (!/^\s*allow:\s*\/\s*$/im.test(text)) error(ROBOTS, 'no "Allow: /" directive');

  const sitemapLine = /^\s*sitemap:\s*(\S+)\s*$/im.exec(text)?.[1];
  if (!sitemapLine) {
    error(ROBOTS, 'no Sitemap: directive');
    return;
  }
  if (!/^https:\/\//.test(sitemapLine)) {
    error(ROBOTS, `Sitemap must be an absolute https URL: ${sitemapLine}`);
    return;
  }
  if (origin && !sitemapLine.startsWith(origin)) {
    error(ROBOTS, `Sitemap host does not match the sitemap origin ${origin}: ${sitemapLine}`);
  }
  const target = path.join(ROOT, path.basename(new URL(sitemapLine).pathname));
  if (!exists(target)) error(ROBOTS, `Sitemap points at a missing file: ${sitemapLine}`);
}

/* ------------------------------------------------------------------ assets */

function checkResume() {
  const file = path.join(ROOT, 'assets', 'resume.pdf');
  if (!fs.existsSync(file)) {
    error('assets/resume.pdf', 'missing — the résumé download link would 404');
    return;
  }
  const head = fs.readFileSync(file).subarray(0, 5).toString('latin1');
  if (head !== '%PDF-') error('assets/resume.pdf', 'is not a PDF (missing %PDF- header)');
  if (fs.statSync(file).size < 1024) warn('assets/resume.pdf', `only ${fs.statSync(file).size} bytes — looks truncated`);
}

function checkBundles(htmlByFile) {
  const referenced = new Set();
  for (const html of htmlByFile.values()) {
    for (const match of html.matchAll(/\/assets\/app\/[A-Za-z0-9._-]+/g)) referenced.add(match[0]);
  }
  const BUDGET = 250 * 1024;
  for (const relative of referenced) {
    const file = path.join(ROOT, relative.replace(/^\//, ''));
    if (!exists(file)) continue; // reported by the link check
    const size = fs.statSync(file).size;
    if (/\.(?:js|css)$/.test(relative) && size > BUDGET) {
      warn(path.relative(ROOT, file), `${(size / 1024).toFixed(0)} kB exceeds the 250 kB bundle budget`);
    }
  }
}

/* -------------------------------------------------------------------- main */

const publicPages = htmlFiles.filter((file) => {
  const html = documents.get(file);
  return !/(?:^|,)\s*noindex\b/i.test(
    tags(html, 'meta').find((meta) => meta.attrs.name === 'robots')?.attrs.content ?? '',
  );
});

checkSitemap(publicPages);
checkRobots(sitemapOrigin);
checkResume();
checkBundles(documents);

for (const [file, html] of documents) {
  const links = tags(scannable(html), 'a').length;
  const images = tags(scannable(html), 'img').length;
  const pageErrors = errors.filter((entry) => entry.page === file).length;
  console.log(`· ${file.padEnd(15)} ${String(links).padStart(3)} links · ${String(images).padStart(2)} images · ${pageErrors} error(s)`);
}

const report = (list, label) => {
  for (const entry of list) console.log(`${label} ${entry.page}: ${entry.message}`);
};

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  report(warnings, '⚠ ');
}
if (errors.length > 0) {
  console.log(`\n${errors.length} error(s):`);
  report(errors, '✗ ');
  console.log('\n✗ FAIL — site checks found errors');
  process.exit(1);
}
console.log(`\n✓ PASS — ${documents.size} pages, links, anchors, a11y structure, metadata, sitemap and robots are consistent${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
