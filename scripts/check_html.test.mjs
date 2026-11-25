#!/usr/bin/env node
/**
 * Self-tests for the static site gate (`scripts/check_html.mjs`).
 *
 * A checker that never fails is worthless, so each test breaks one thing in a
 * throwaway copy of the built site and asserts that the gate reports it.
 *
 * Usage: node --test scripts/check_html.test.mjs   (ci: `npm test`)
 */

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECKER = path.join(ROOT, 'scripts', 'check_html.mjs');
const PAGES = ['index.html', 'education.html', '404.html'];

/** Copy the built site into a temp root and materialise every referenced asset. */
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-gate-'));
  for (const file of [...PAGES, 'sitemap.xml', 'robots.txt']) {
    fs.copyFileSync(path.join(ROOT, file), path.join(dir, file));
  }
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'assets', 'resume.pdf'), path.join(dir, 'assets', 'resume.pdf'));

  const referenced = new Set();
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(dir, page), 'utf8');
    const local = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((value) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value));
    const socialImages = [...html.matchAll(/(?:og:image|twitter:image)" content="https?:\/\/[^/]+([^"]+)"/g)]
      .map((match) => match[1]);
    for (const raw of [...local, ...socialImages]) {
      const value = raw.split('#')[0].split('?')[0];
      if (!value) continue;
      const relative = value.replace(/^\/+/, '') || 'index.html';
      referenced.add(relative.endsWith('/') ? `${relative}index.html` : relative);
    }
  }
  for (const relative of referenced) {
    const target = path.join(dir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (!fs.existsSync(target)) fs.writeFileSync(target, '');
  }
  return dir;
}

function run(dir) {
  const result = spawnSync(process.execPath, [CHECKER, dir], { encoding: 'utf8' });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function mutate(dir, file, change) {
  const target = path.join(dir, file);
  const before = fs.readFileSync(target, 'utf8');
  const after = change(before);
  assert.notEqual(after, before, `mutation of ${file} changed nothing — update the test`);
  fs.writeFileSync(target, after);
}

test('clean build passes', () => {
  const result = run(fixture());
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /PASS/);
});

test('broken cross-page anchor fails', () => {
  const dir = fixture();
  mutate(dir, 'index.html', (html) => html.replace('education.html#slide-decks', 'education.html#no-such-anchor'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /anchor not found: education\.html#no-such-anchor/);
});

test('image without alt text fails', () => {
  const dir = fixture();
  mutate(dir, 'education.html', (html) => html.replace(/<img\b([^>]*?)\salt="[^"]*"/, '<img$1'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /<img> without alt/);
});

test('duplicate id fails', () => {
  const dir = fixture();
  mutate(dir, 'index.html', (html) => html.replace('<main', '<span id="about"></span><main'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /duplicate id "about"/);
});

test('page missing from the sitemap fails', () => {
  const dir = fixture();
  mutate(dir, 'sitemap.xml', (html) => html.replace(/<url>\s*<loc>https:\/\/[^<]*\/education\.html<\/loc>[\s\S]*?<\/url>/, ''));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /public page education\.html is missing from the sitemap/);
});

test('canonical/og:url mismatch fails', () => {
  const dir = fixture();
  mutate(dir, 'education.html', (html) => html.replace('property="og:url" content="https://tribrigademars.github.io/education.html"', 'property="og:url" content="https://tribrigademars.github.io/"'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /og:url .* does not match canonical/);
});

test('missing resume PDF fails', () => {
  const dir = fixture();
  fs.rmSync(path.join(dir, 'assets', 'resume.pdf'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /assets\/resume\.pdf: missing/);
});

test('target=_blank without noopener fails', () => {
  const dir = fixture();
  mutate(dir, 'index.html', (html) => html.replace('target="_blank" rel="noopener"', 'target="_blank"'));
  const result = run(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /target="_blank" link without rel="noopener"/);
});
