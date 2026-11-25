#!/usr/bin/env node
/**
 * Accessibility gate: axe-core WCAG 2.2 A/AA rules against the real prerendered
 * pages, in a real browser, in both colour schemes.
 *
 * Why a browser: the static checker can see alt text and ids, but contrast,
 * focusability and computed roles only exist once CSS and hydration have run.
 * Playwright's `core` build is used so no browser is downloaded; the script
 * drives an installed Chrome (or Edge on Windows).
 *
 * Usage:
 *   node scripts/a11y.mjs                 # needs `npm run build` first
 *   A11Y_CHANNEL=msedge node scripts/a11y.mjs
 *   A11Y_EXECUTABLE_PATH=/path/to/chrome node scripts/a11y.mjs
 *
 * Exit: 0 = no violations, 1 = violations found, 2 = browser/setup problem.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSiteServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROUTES = ['/', '/education.html', '/404.html'];
const SCHEMES = ['light', 'dark'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

function setupFailure(message, hint) {
  console.error(`✗ ${message}`);
  if (hint) console.error(hint);
  process.exit(2);
}

async function launchBrowser() {
  const executablePath = process.env.A11Y_EXECUTABLE_PATH;
  if (executablePath) {
    try {
      return { browser: await chromium.launch({ executablePath, headless: true }), label: executablePath };
    } catch (error) {
      setupFailure(`could not launch ${executablePath}: ${error.message.split('\n')[0]}`);
    }
  }

  const channels = process.env.A11Y_CHANNEL ? [process.env.A11Y_CHANNEL] : ['chrome', 'msedge'];
  const failures = [];
  for (const channel of channels) {
    try {
      return { browser: await chromium.launch({ channel, headless: true }), label: channel };
    } catch (error) {
      failures.push(`${channel}: ${error.message.split('\n')[0]}`);
    }
  }

  setupFailure(
    `no usable Chrome/Edge found (tried ${channels.join(', ')}).`,
    '  Install Google Chrome or Microsoft Edge, or set A11Y_EXECUTABLE_PATH to a Chromium binary.\n' +
    `  Details:\n    ${failures.join('\n    ')}`,
  );
}

const { browser, label } = await launchBrowser();
const site = await createSiteServer({ root: ROOT, quiet: true });
const violations = [];
const pageErrors = [];
let incomplete = 0;

console.log(`Accessibility check — ${site.url} (${label})`);

try {
  for (const scheme of SCHEMES) {
    const context = await browser.newContext({ colorScheme: scheme });
    await context.addInitScript((value) => {
      try {
        localStorage.setItem('theme', value);
      } catch {
        /* storage disabled: the page falls back to the media query */
      }
    }, scheme);

    for (const route of ROUTES) {
      const page = await context.newPage();
      page.on('pageerror', (error) => pageErrors.push({ route, scheme, message: error.message }));
      await page.goto(`${site.url}${route}`, { waitUntil: 'load', timeout: 30000 }).catch((error) => {
        console.log(`⚠ ${route}: page load warned: ${error.message.split('\n')[0]}`);
      });
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      incomplete += results.incomplete.length;

      const found = results.violations;
      found.forEach((violation) => violations.push({ route, scheme, violation }));
      const detail = found.length === 0
        ? '✓'
        : `✗ ${found.map((violation) => violation.id).join(', ')}`;
      console.log(`  ${detail} ${route.padEnd(16)} ${scheme.padEnd(5)} ${found.length} violation(s)`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  await site.close();
}

// A hydration crash still renders the prerendered HTML, so axe can pass while
// the page is broken. Treat uncaught errors as failures.
if (pageErrors.length > 0) {
  console.log(`\n${pageErrors.length} uncaught browser error(s) (hydration/JavaScript):`);
  for (const { route, scheme, message } of pageErrors.slice(0, 10)) {
    console.log(`  ✗ ${route} (${scheme}): ${message.split('\n')[0]}`);
  }
  process.exit(1);
}

if (violations.length > 0) {
  console.log(`\n${violations.length} violation(s):`);
  for (const { route, scheme, violation } of violations) {
    console.log(`  [${violation.impact ?? 'unknown'}] ${route} (${scheme}): ${violation.id} — ${violation.help}`);
    console.log(`    ${violation.helpUrl}`);
    for (const node of violation.nodes.slice(0, 5)) {
      console.log(`    → ${node.target.join(' ')}`);
    }
  }
  if (incomplete > 0) console.log(`\n${incomplete} rule(s) could not be decided automatically (see axe "incomplete").`);
  process.exit(1);
}

console.log(`\n✓ PASS — no axe WCAG 2.2 A/AA violations on ${ROUTES.length} pages × ${SCHEMES.length} colour schemes` +
  (incomplete > 0 ? ` (${incomplete} rule(s) undecided)` : ''));
