#!/usr/bin/env node
/**
 * Verify that the build output committed to the branch matches a fresh build.
 *
 * This repository publishes with GitHub Pages "legacy" mode: the site is served
 * straight from `main` / root, so `index.html`, `education.html`, `404.html`,
 * `assets/app/*` and `llms-full.txt` must be rebuilt and committed with every
 * source change. Nothing else notices when that step is skipped.
 *
 * Bundle file names contain a content hash that legitimately differs between
 * build machines, so the comparison is hash-insensitive:
 *   - page HTML and `llms-full.txt` are compared as text, with `/assets/app/*`
 *     references rewritten to their positional placeholder;
 *   - bundle and font assets are compared by content hash, ignoring file names.
 *
 * Usage: node scripts/check_artifacts.mjs   (run `npm run build` first)
 * Exit:  0 = committed output is current, 1 = stale, 0 with a skip notice when
 *        git is unavailable (e.g. a source archive without history).
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const PAGES = ['index.html', 'education.html', '404.html'];
const GENERATED_TEXT = [...PAGES, 'llms-full.txt'];
const ASSET_DIR = 'assets/app';
const ASSET_NAMES = /\.(?:css|js|mjs|svg|ico|png|webp|woff2?)$/i;

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, maxBuffer: 128 * 1024 * 1024 });
}

function headFile(relative) {
  try {
    return git(['show', `HEAD:${relative}`]);
  } catch {
    return null;
  }
}

function normalizeAssetRefs(html) {
  let index = 0;
  return html.replace(/\/assets\/app\/[A-Za-z0-9._-]+/g, (match) => {
    index += 1;
    return `/assets/app/asset-${index}${path.extname(match)}`;
  });
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function firstDifferences(before, after, limit = 3) {
  const left = before.split(/(?<=>)/);
  const right = after.split(/(?<=>)/);
  const differences = [];
  for (let i = 0; i < Math.max(left.length, right.length) && differences.length < limit; i += 1) {
    if (left[i] !== right[i]) {
      const trim = (text) => (text ?? '(missing)').replace(/\s+/g, ' ').trim().slice(0, 120);
      differences.push(`  committed: ${trim(left[i])}\n  rebuilt:   ${trim(right[i])}`);
    }
  }
  return differences.join('\n');
}

function fail(lines) {
  console.error('✗ FAIL — the committed build output is not what this source builds.\n');
  for (const line of lines) console.error(line);
  console.error('\nFix: run `npm run build` and commit the regenerated files:');
  console.error(`  ${GENERATED_TEXT.join(', ')} and ${ASSET_DIR}/`);
  process.exit(1);
}

try {
  git(['rev-parse', '--verify', 'HEAD']);
} catch {
  console.log('⚠ skip: no git history here — cannot compare committed build output with a fresh build');
  process.exit(0);
}

const problems = [];

for (const relative of GENERATED_TEXT) {
  const committed = headFile(relative);
  if (committed === null) {
    console.log(`⚠ skip: ${relative} does not exist in HEAD yet`);
    continue;
  }
  const working = fs.existsSync(path.join(ROOT, relative)) ? fs.readFileSync(path.join(ROOT, relative)) : null;
  if (working === null) {
    problems.push(`✗ ${relative} is tracked but missing from the working tree`);
    continue;
  }
  const before = relative.endsWith('.html')
    ? normalizeAssetRefs(committed.toString('utf8'))
    : committed.toString('utf8');
  const after = relative.endsWith('.html')
    ? normalizeAssetRefs(working.toString('utf8'))
    : working.toString('utf8');
  if (before !== after) {
    problems.push(`✗ ${relative} differs from the committed version\n${firstDifferences(before, after)}`);
  }
}

let committedAssets = [];
try {
  committedAssets = git(['ls-tree', '-r', '--name-only', 'HEAD', '--', ASSET_DIR])
    .toString('utf8')
    .split('\n')
    .filter((file) => file && ASSET_NAMES.test(file));
} catch {
  committedAssets = [];
}

const committedByHash = new Map();
for (const relative of committedAssets) {
  const content = headFile(relative);
  if (content === null) continue;
  const hash = sha256(content);
  if (!committedByHash.has(hash)) committedByHash.set(hash, relative);
}

const diskDir = path.join(ROOT, ASSET_DIR);
const diskAssets = fs.existsSync(diskDir)
  ? fs.readdirSync(diskDir).map((name) => path.join(ASSET_DIR, name)).filter((file) => ASSET_NAMES.test(file))
  : [];

if (committedAssets.length === 0) {
  problems.push(`✗ no committed build assets under ${ASSET_DIR}/ — run \`npm run build\` and commit them`);
}
if (diskAssets.length === 0) {
  problems.push(`✗ no build assets on disk under ${ASSET_DIR}/ — run \`npm run build\` first`);
}

const diskByHash = new Map();
for (const relative of diskAssets) {
  const hash = sha256(fs.readFileSync(path.join(ROOT, relative)));
  if (!diskByHash.has(hash)) diskByHash.set(hash, relative);
}

for (const [hash, relative] of diskByHash) {
  if (!committedByHash.has(hash)) {
    problems.push(`✗ ${relative} is not in the committed build (new or changed bundle)`);
  }
}
for (const [hash, relative] of committedByHash) {
  if (!diskByHash.has(hash)) {
    problems.push(`✗ ${relative} is committed but this build no longer produces it`);
  }
}

if (problems.length > 0) {
  fail(problems);
}

console.log(`✓ PASS — committed pages, ${ASSET_DIR}/ bundles and llms-full.txt match a fresh build`);
