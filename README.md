# Portfolio & Resume

Personal portfolio and resume website for **Mars Cruz, MPH, CHES**, built with React 19, Vite, Meta Astryx (`@astryxdesign/core`), and Tailwind CSS, prerendered to static HTML for GitHub Pages.

Live site: https://tribrigademars.github.io/

## Prerequisites

| Tool | Version | Needed for |
| --- | --- | --- |
| Node.js | 20.19 or newer (`22` is what CI and `.nvmrc` use) | everything |
| Python | 3.9 or newer | `npm run build` (`llms-full.txt`) and `npm run check` (`facts.json`, `llms.txt`) |
| Chrome or Edge | current | `npm run a11y` only (optional locally) |
| `pdftotext` | any (poppler-utils) | optional: enables the résumé-PDF rules in `npm run check`; skipped with a warning when absent |

Check what you have:

```bash
node --version && npm --version
python3 --version        # Windows: py -3 --version
```

Python is not assumed to be called `python`. `scripts/py.mjs` picks the first
working interpreter from `PYTHON`, `python3`, `python`, then `py -3` (Windows), and
prints an actionable message if none of them is a usable Python 3.9+.

## Quick start

```bash
npm ci                  # reproducible install from package-lock.json
npm run build           # Vite client + SSR, prerender the three pages, regenerate llms-full.txt
npm run check           # facts.json privacy/evidence rules + llms freshness
npm run check:html      # links, anchors, a11y structure, metadata, sitemap, robots
npm run preview         # serve the built site the way GitHub Pages does → http://127.0.0.1:4173
```

`npm run verify` runs the whole gate in order: `typecheck → build → check →
check:html → check:artifacts → test`. `npm run a11y` is separate because it needs a
browser.

Windows (PowerShell) is the same:

```powershell
npm ci
npm run build
npm run verify
npm run preview
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `src/templates/*.html` (fast iteration, not the Pages output) |
| `npm run build` | Client build → SSR build → `scripts/prerender.mjs` writes `index.html`, `education.html`, `404.html` and `assets/app/*` → `scripts/build_llms.py` regenerates `llms-full.txt` |
| `npm run typecheck` | `tsc --noEmit` over `src/` and `vite.config.mts` |
| `npm run check` | `scripts/check_facts.py` against `facts.json` (all root HTML pages + `assets/resume.pdf`), then `scripts/build_llms.py --check` for `llms.txt` links and `llms-full.txt` freshness |
| `npm run check:html` | `scripts/check_html.mjs`: local link and `#anchor` targets, duplicate ids, `alt`/label/accessible-name checks, heading order, canonical/OG/Twitter/JSON-LD, sitemap and robots consistency, résumé PDF sanity |
| `npm run check:artifacts` | `scripts/check_artifacts.mjs`: the committed pages, `assets/app/*` and `llms-full.txt` must equal a fresh build (bundle hashes ignored) |
| `npm test` | Self-tests for the two gates above (`node --test scripts/`) |
| `npm run a11y` | axe-core WCAG 2.2 A/AA on `/`, `/education.html`, `/404.html` in light and dark mode, in a real browser |
| `npm run preview` | Dependency-free static server over the repository root with Pages semantics (`404.html`, MIME types, no directory traversal). `--port`, `--host`, `--root`, `--quiet` |
| `npm run verify` | The full local gate |
| `npm run build:llms` | Regenerate `llms-full.txt` only |

## Quality gates

| Gate | Fails when |
| --- | --- |
| `typecheck` | TypeScript errors in `src/` or `vite.config.mts` |
| `check` | A `facts.json` forbidden pattern appears, a required claim disappears, `llms.txt` points at a missing file, or `llms-full.txt` is stale |
| `check:html` | A local link/asset or `page.html#anchor` target is missing; duplicate ids; `<img>` without `alt`; a link/button without an accessible name; a `target="_blank"` link without `rel="noopener"`; missing canonical/description/OG/Twitter metadata on a public page; a JSON-LD block that does not parse; a sitemap entry that does not map to a file, is missing a public page, or lists `404.html`; robots.txt without a sitemap pointer |
| `check:artifacts` | Someone changed `src/` (or a dependency) and forgot to commit the rebuilt pages/bundles — Pages would keep serving the old ones |
| `a11y` | Any axe WCAG 2.2 A/AA violation (the site currently has none, light or dark) |

`check:html` reports some non-blocking warnings: descriptions or titles over the
recommended length, `<img>` without `width`/`height`, `og:image:alt` absence,
bundles over 250 kB.

## Publishing

GitHub Pages publishes this repository in **legacy mode: branch `main`, folder `/`**.
There is no deploy workflow, and CI does not push. A push to `main` is the deploy,
so **the generated files must be committed with the source**:

```bash
npm run build
git add index.html education.html 404.html assets/app llms-full.txt
git commit -m "build: regenerate prerequisites"
```

`npm run check:artifacts` (and the CI job of the same name) fails if they are not,
which is the point: without it, a source change can sit in the repository while
the live site keeps serving the previous bundle.

If the site is ever moved to `actions/deploy-pages`, three things change: Pages
settings must switch to "GitHub Actions", the committed build output is no longer
needed, and `check:artifacts` can be deleted. That migration is deliberately not
applied here.

## Layout

- `src/pages/`, `src/components/`, `src/data/`, `src/theme/` — React 19 + Meta Astryx source and Front Range Civic tokens
- `src/templates/` — the three Vite entry HTML shells (`<!--app-html-->` placeholder)
- `scripts/prerender.mjs` — renders the SSR bundle into the root HTML files and syncs `assets/app/`
- `scripts/py.mjs` — cross-platform Python launcher used by `build`/`check`
- `scripts/serve.mjs` — static server used by `npm run preview` and the a11y gate
- `scripts/check_html.mjs`, `scripts/check_artifacts.mjs` — static quality gates (+ `*.test.mjs` self-tests)
- `scripts/build_llms.py`, `scripts/check_facts.py` — machine-readable layer and facts guardrails (stdlib Python only)
- `index.html`, `education.html`, `404.html` — prerendered pages served by GitHub Pages (do not edit by hand)
- `llms.txt` — hand-written site manual for AI agents; `llms-full.txt` — generated from `<main>`
- `facts.json` — machine-checked privacy/evidence rules
- `robots.txt`, `sitemap.xml` — crawl metadata (checked by `check:html`)
- `assets/resume.pdf` — the résumé employers receive
- `assets/app/` — generated Vite CSS/JS bundles
- `.github/workflows/ci.yml` — Ubuntu + Windows quality and accessibility jobs

## Windows notes

The toolchain is path-agnostic (`node:path`, `fs.cpSync`) and the npm scripts are
plain Node/`tsc`/`vite` invocations, so nothing depends on bash. Two Windows
specifics are handled deliberately:

- **Python** — `py -3` is preferred there; the Microsoft Store `python` alias is
  rejected unless it is a real interpreter.
- **Line endings** — `.gitattributes` forces LF so a `core.autocrlf=true` checkout
  does not make the generated files look modified after every build.

Windows was not executed during the last toolchain change; the `windows-latest`
CI job is what verifies it.

## Troubleshooting

- **`No Python 3.9+ interpreter found`** — install Python 3 from
  <https://www.python.org/downloads/> (tick "Add python.exe to PATH"), or set
  `PYTHON` to the interpreter: `PYTHON=/usr/bin/python3 npm run check` /
  `$env:PYTHON = "C:\Python313\python.exe"; npm run check`.
- **`check:artifacts` fails after a dependency or Node upgrade** — bundle bytes can
  change with the toolchain. Run `npm run build` and commit the result.
- **`npm run a11y` says no browser found** — install Chrome/Edge, or point
  `A11Y_EXECUTABLE_PATH` at a Chromium binary, and use `A11Y_CHANNEL=msedge` to
  force Edge.
- **`npm run preview` says port in use** — `npm run preview -- --port 4174`.
