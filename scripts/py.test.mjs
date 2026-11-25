#!/usr/bin/env node
/**
 * Self-tests for `scripts/py.mjs`, the cross-platform Python launcher.
 *
 * The bug this guards against is real: `npm run build` used to call `python`,
 * which does not exist on Debian/Ubuntu images that only ship `python3`, and is
 * an unreliable name on Windows. Each test drives the launcher with a controlled
 * PATH / PYTHON so the resolution order and the failure message stay honest.
 *
 * Usage: node --test scripts/py.test.mjs
 */

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LAUNCHER = path.join(ROOT, 'scripts', 'py.mjs');

function tempScript() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-launcher-'));
  const script = path.join(dir, 'hello.py');
  fs.writeFileSync(script, 'import sys\nprint("hello-from-python")\nprint(sys.version_info[0])\n');
  return script;
}

function realPython() {
  for (const [command, prefix] of [['python3', []], ['python', []], ['py', ['-3']]]) {
    const result = spawnSync(command, [...prefix, '-c', 'import sys; print(sys.executable)'], { encoding: 'utf8' });
    if (result.status === 0) return result.stdout.trim();
  }
  return null;
}

test('runs a script with an auto-detected interpreter', () => {
  const result = spawnSync(process.execPath, [LAUNCHER, tempScript()], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /hello-from-python\r?\n3/);
});

test('honours the PYTHON override', (t) => {
  const python = realPython();
  if (!python) {
    t.skip('no Python 3 interpreter on this machine');
    return;
  }
  const result = spawnSync(process.execPath, [LAUNCHER, tempScript()], {
    encoding: 'utf8',
    env: { ...process.env, PYTHON: python },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /hello-from-python/);
});

test('fails with an actionable message when no interpreter is found', () => {
  const result = spawnSync(process.execPath, [LAUNCHER, tempScript()], {
    encoding: 'utf8',
    env: { ...process.env, PYTHON: path.join(os.tmpdir(), 'there-is-no-python-here') },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No Python 3\.9\+ interpreter found/);
  assert.match(result.stderr, /PYTHON/);
});

test('reports a missing script instead of crashing', () => {
  const result = spawnSync(process.execPath, [LAUNCHER, 'scripts/does-not-exist.py'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Python script not found/);
});

test('skips a broken `python` and falls back to `python3`', (t) => {
  if (process.platform === 'win32') {
    t.skip('shim-based PATH test is POSIX-only; Windows resolution is exercised by CI');
    return;
  }
  const python = realPython();
  if (!python) {
    t.skip('no Python 3 interpreter on this machine');
    return;
  }
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'py-shim-'));
  fs.writeFileSync(path.join(bin, 'python'), '#!/bin/sh\nexit 127\n', { mode: 0o755 });
  fs.symlinkSync(fs.realpathSync(python), path.join(bin, 'python3'));

  const result = spawnSync(process.execPath, [LAUNCHER, tempScript()], {
    encoding: 'utf8',
    env: { ...process.env, PATH: bin, PYTHON: '' },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /hello-from-python/);
});
