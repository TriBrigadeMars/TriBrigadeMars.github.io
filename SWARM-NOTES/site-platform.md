# site-platform lane — audit, comparison, plan

Repo: `TriBrigadeMars.github.io` (React 19 + Vite 8 + Astryx + Tailwind, prerendered to root HTML)
Lane branch: `swarm/platform` · Worktree: `~/Projects/tribrigade-swarm/lanes/site-platform`
Date: 2026-11-25 · Local verification platform: Linux (Node 26.13.1, Python 3.14.10). Windows **not executed locally**.

## 1. Audit

### What works on a Linux dev box

- `npm ci` — 235 packages, no native build step.
- `npm run build` — Vite client build → SSR build → `scripts/prerender.mjs` writes `index.html`,
  `education.html`, `404.html`, copies hashed bundles into `assets/app/`, deletes `dist/` and
  `.vite-ssr/` → `scripts/build_llms.py` regenerates `llms-full.txt`.
- `npm run check` — `scripts/check_facts.py` (facts.json privacy/evidence rules + optional
  `pdftotext` scan of `assets/resume.pdf`) then `scripts/build_llms.py --check`.
- Output is deterministic across consecutive builds and across checkout paths (verified by
  building in a second worktree: identical bundle bytes and hashes).

### What is broken or missing (measured, not guessed)

| # | Problem | Evidence |
|---|---|---|
| A1 | **`npm run typecheck` fails on a clean clone.** `vite.config.mts` imports `node:path` / `node:url` but there is no `@types/node` and no `types` entry. | `vite.config.mts(1,25): error TS2591: Cannot find name 'node:path'` (exit 1) |
| A2 | **Scripts hardcode `python`.** Any distro where only `python3` exists (Debian 12, Ubuntu 24.04 minimal, many CI images) fails; on Windows the `python` name can be the Microsoft Store alias stub, and the reliable launcher is `py -3`. | Reproduced by shadowing `python` with a failing stub → `sh: python: command not found` (exit 127) |
| A3 | **No CI at all.** `.github/` does not exist; the only workflow is the implicit `pages-build-deployment` from GitHub Pages. | `gh api repos/.../pages` → `build_type: legacy`, `source: main /` |
| A4 | **Committed build output is stale relative to the toolchain,** and nothing notices. A fresh build produces different bundle hashes (content identical in this case, so no live breakage today) — but if a commit ever changes `src/` without rebuilding, Pages keeps serving the old markup/bundle forever. | `git status` after `npm run build`: 5 deleted + 5 new `assets/app/*` files, 3 modified pages |
| A5 | **No link/anchor check.** `index.html` links to `education.html#slide-decks`, `#visual-frameworks`, … Nothing verifies those anchors still exist after a content edit. | manual grep |
| A6 | **No accessibility gate.** The site claims WCAG 2.2 AA work (and axe agrees today — 0 violations, light *and* dark), but a regression is invisible until someone looks. | axe-core 4.14 + Chrome 155 probe: 0 violations on /, /education.html, /404.html in both colour schemes |
| A7 | **No way to preview the real prerendered output.** `npm run dev` serves `src/templates/*.html` through Vite; `dist/` is deleted by `prerender.mjs`, so there is no local "what GitHub Pages actually serves" server. | reading `scripts/prerender.mjs:62` |
| A8 | **No `.gitattributes`.** With `core.autocrlf=true` (Git for Windows default) the generated HTML is checked out as CRLF and rebuilt as LF → every generated file shows as modified after every build. | reasoned from CRLF default; cannot execute Windows |
| A9 | **No Node/Python version contract.** No `engines`, README says "Node.js and Python 3" with no minimums, while Vite 8 needs Node ≥ 20.19. | `package.json`, `README.md` |
| A10 | `npm audit`: 1 moderate advisory (`postcss-selector-parser < 6.1.5`, dev-only, via Tailwind/PostCSS). | `npm audit` |
| A11 | SEO metadata is present but unverified: canonical vs `og:url` vs `sitemap.xml` are three hand-maintained copies; `education.html` description is 181 chars (over the ~160 display budget). | parsing the three HTML files |

### Windows blockers (read, not run)

- A2 (`python` vs `py -3`) is the only hard blocker for `npm run build` / `npm run check`.
- A8 makes every build look dirty in `git status`.
- Everything else in the toolchain is Node + `path.join` / `node:path` / `fs.cpSync` and is
  already path-agnostic (`scripts/prerender.mjs`, `vite.config.mts`); `package.json` scripts use
  `&&`, which npm executes through `cmd.exe`, so that is fine.
- No bash-only script is in a user flow (the only shell snippets are in docs).

## 2. Comparison with comparable open-source projects

| Project | What it does well | Taken / rejected |
|---|---|---|
| [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (17.8k★) | `.github/workflows/jekyll.yml`: documented Pages permissions (`contents: read`, `pages: write`, `id-token: write`), `concurrency: pages` that never cancels a production run, explicit build → `upload-pages-artifact` → `deploy-pages` split. | **Taken:** the concurrency/least-privilege shape and the "build once, gate on the artifact" idea, and a node-version-pinned setup. **Rejected:** switching this repo to `deploy-pages` — the live site is published from `main`/root by Pages "legacy" mode; changing the deploy model needs repo settings I must not touch. |
| [alshedivat/al-folio](https://github.com/alshedivat/al-folio) (16.4k★) | Separate `axe.yml` (axe-core CLI against a locally served build) and `broken-links.yml` (lychee on `**/*.html` + Markdown), plus a build/deploy split. | **Taken:** automated axe gate over the *built* pages, internal link checking as its own job. **Rejected:** lychee's network-dependent external-link checks (flaky, needs a token for GitHub URLs) and installing Chrome + chromedriver globally from npm. Internal links and anchors are checked locally with zero dependencies instead. |
| [cobiwave/simplefolio](https://github.com/cobiwave/simplefolio) (14.2k★) | Minimal single workflow: install → build → publish `dist` with a third-party Pages action. | **Rejected:** publishing with a third-party action that pushes to `gh-pages`. Demonstrates exactly the failure this repo is exposed to: the branch content and the source can drift with no gate. Kept branch publishing, added a staleness gate instead. |
| [adrianwedd/adrianwedd.com](https://github.com/adrianwedd/adrianwedd.com) | Quality-gate table in the README (typecheck, content validation with "descriptions ≤ 160 chars", build-size budget, internal-link 404 scan), and one workflow that validates on PR and only deploys on `main`. | **Taken:** description-length budget as a warning, bundle-size budget as a warning, PR validation + push validation in the same workflow, documented gate table. **Rejected:** Lighthouse/Pagefind/GA4 integrity jobs — no analytics, no search, and Lighthouse on a 2-page static site costs more than it catches here. |
| [gundyn/portfolio](https://github.com/gundyn/portfolio) | "The site ships itself": deploy workflow is the demo of the author's CI/CD skill. | **Taken (framing):** the README documents the deploy model and gates explicitly, so a stranger can tell what is automated. |

## 3. Ranked improvements (impact × effort)

| Rank | Improvement | Impact | Effort | In scope |
|---|---|---|---|---|
| 1 | Cross-platform Python launcher (`scripts/py.mjs`) so `build`/`check` work where only `python3` or only `py -3` exists, with an actionable failure message | Blocks every Windows user; blocks minimal Linux images | S | ✅ |
| 2 | Fix `npm run typecheck` (`@types/node` + `types: ["node"]`) | The only TypeScript gate is currently red | XS | ✅ |
| 3 | CI matrix (`ubuntu-latest`, `windows-latest`): `npm ci` → typecheck → build → facts/llms → HTML checks → a11y → artifact staleness | No automation today; A4 is a live-site risk | M | ✅ |
| 4 | `scripts/check_html.mjs`: zero-dep links, anchors, ids, alt text, heading order, meta/OG/canonical, sitemap, robots, PDF magic | Catches A5/A11 and future content regressions | M | ✅ |
| 5 | `scripts/check_artifacts.mjs`: hash-insensitive comparison of committed pages/bundles against a fresh build | Closes A4 without being fooled by bundle-hash churn | M | ✅ |
| 6 | `scripts/a11y.mjs`: axe-core in real Chrome (light + dark) across the three built pages | Turns the site's a11y claim into a gate; 0 violations today so it can be blocking | S | ✅ |
| 7 | `scripts/serve.mjs`: dependency-free static server of the repo root with GitHub-Pages semantics (404.html, MIME, no traversal) + `npm run preview` | Makes "what Pages serves" reproducible locally and in CI | S | ✅ |
| 8 | `.gitattributes` (LF everywhere, binary assets), docs with Node/Python minimums, Windows (PowerShell) instructions, gate table, deploy-model note | A8/A9; a stranger can install and run it | S | ✅ |
| 9 | `npm run verify` one-command gate + `npm audit fix` for the moderate dev advisory | Convenience; unblocks `npm audit` in CI if added later | XS | ✅ |
| 10 | Auto-generate `sitemap.xml` lastmod from git | Marginal; git history is shallow in CI | S | ❌ (documented instead) |
| 11 | Lighthouse CI / lychee external links / HTML validator storm | Noisy for a 2-page static site; external links rotate | M | ❌ |
| 12 | Migrate Pages deploy to `actions/deploy-pages` | Would change the live deploy model and needs repo settings | M | ❌ (documented as an opt-in, not applied) |

## 4. Chosen scope

Everything ranked ✅ (1–9), nothing under `src/` — page content, components and templates belong to
lane `site-product`. Generated root HTML/`assets/app` are only regenerated from the current source
so the committed artifact matches the toolchain; no factual text changes. Deploy stays on
GitHub Pages legacy branch publishing; CI never pushes.
