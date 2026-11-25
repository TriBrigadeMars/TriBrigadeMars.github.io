#!/usr/bin/env node
/**
 * Run one of the site's Python checker scripts with a usable Python 3 interpreter.
 *
 * `npm run build` and `npm run check` used to call `python scripts/*.py` directly.
 * That breaks on Linux distributions that only ship `python3` (Debian 12, Ubuntu
 * 24.04, slim CI images) and on Windows, where `python` may be the Microsoft Store
 * alias stub and `py -3` is the reliable launcher.
 *
 * Resolution order (first interpreter that reports Python >= 3.9 wins):
 *   PYTHON env var, then python3 / python, then `py -3` (Windows standard).
 *
 * Usage: node scripts/py.mjs <script.py> [args...]
 * Stdlib only, no network, no shell.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MIN_VERSION = '3.9';
const PROBE = 'import sys; sys.exit(0 if sys.version_info[:2] >= (3, 9) else 1)';

const CANDIDATES = process.platform === 'win32'
  ? [
      { command: 'py', prefix: ['-3'] },
      { command: 'python3', prefix: [] },
      { command: 'python', prefix: [] },
    ]
  : [
      { command: 'python3', prefix: [] },
      { command: 'python', prefix: [] },
    ];

function probe(candidate) {
  const result = spawnSync(
    candidate.command,
    [...candidate.prefix, '-c', PROBE],
    { stdio: 'ignore', windowsHide: true, timeout: 15000 },
  );
  return result.status === 0;
}

function findInterpreter() {
  const override = process.env.PYTHON?.trim();
  if (override) {
    const candidate = { command: override, prefix: [] };
    return probe(candidate) ? candidate : null;
  }
  return CANDIDATES.find(probe) ?? null;
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const script = process.argv[2];
if (!script) {
  console.error('usage: node scripts/py.mjs <script.py> [args...]');
  process.exit(2);
}

const scriptPath = path.resolve(script);
if (!fs.existsSync(scriptPath)) {
  fail(`Python script not found: ${scriptPath}`);
}

const interpreter = findInterpreter();
if (!interpreter) {
  const tried = process.env.PYTHON
    ? `PYTHON=${process.env.PYTHON}`
    : CANDIDATES.map((c) => [c.command, ...c.prefix].join(' ')).join(', ');
  console.error(`✗ No Python ${MIN_VERSION}+ interpreter found (tried: ${tried}).`);
  console.error('  Install Python 3 from https://www.python.org/downloads/ and make sure it is on PATH,');
  console.error('  or point the PYTHON environment variable at the interpreter, e.g.');
  console.error(process.platform === 'win32'
    ? '    $env:PYTHON = "C:\\Python313\\python.exe"; npm run check'
    : '    PYTHON=/usr/bin/python3 npm run check');
  process.exit(1);
}

const args = [scriptPath, ...process.argv.slice(3)];
const result = spawnSync(interpreter.command, [...interpreter.prefix, ...args], {
  stdio: 'inherit',
  windowsHide: true,
});

if (result.error) {
  fail(`Could not run ${interpreter.command}: ${result.error.message}`);
}
if (result.signal) {
  fail(`${interpreter.command} terminated by signal ${result.signal}`);
}
process.exit(result.status ?? 1);
