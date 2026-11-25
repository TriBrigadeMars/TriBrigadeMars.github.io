# site-product — audit, comparison, plan

Lane: `swarm/product` in `lanes/site-product`. Scope per SWARM.md: competitive research (portfolio/résumé
sites), content structure, UX, résumé download/print. `scripts/`, CI and build config belong to `site-platform`.

## 1. Audit (baseline, unmodified clone at a232bb0)

What works, verified by running it:

| Check | Result |
| --- | --- |
| `npm ci` | pass (235 packages; 3 install-script warnings from the registry allow-list, build unaffected) |
| `npm run build` | pass — Vite client + SSR, prerender of `index.html`, `education.html`, `404.html`, `llms-full.txt` (301 lines) |
| `npm run check` | pass — facts rules + llms freshness |
| `npm run typecheck` | **fails on the untouched clone**: `vite.config.mts` cannot resolve `node:path` / `node:url` (`@types/node` not installed). Build-tooling/config issue → `site-platform`, not edited here. |
| axe-core 4.10.2 (injected at runtime) on `index.html`, `education.html`, `404.html`, light and dark | 0 violations |
| Dark mode | present: `class` strategy, anti-flash `<head>` script, persisted in `localStorage`, token overrides in `front-range-civic.css` |
| Skip link + landmarks | present (`nav[aria-label=Primary]`, `main#main-content`, `footer`) |
| Reduced motion | handled in `brand.css` |
| Print | **unstyled**: `page.pdf()` on `index.html` = 9 pages containing the sticky nav, hero portrait, interactive buttons, filter controls and the AI-agent disclosure |

Gaps found by measurement (numbers below are from the baseline, before changes):

1. **No print stylesheet.** The portfolio is a résumé site; `Ctrl+P` / "Save as PDF" produces an
   interactive-page dump. Dark mode prints light text on white (browsers drop backgrounds by default).
2. **Reflow failures.** `document.documentElement.scrollWidth` at 320 CSS px was 374 (viewport 320) and
   at 360 was 374. At 200 % text size (root font 32 px) on a 390 px viewport it was 730. Cause: the mobile
   header row (brand + Curriculum Lab + theme toggle + Menu) has no shrinkable child, and long headings do
   not wrap. WCAG 1.4.4 (resize text) / 1.4.10 (reflow).
3. **Invisible keyboard focus** on all five `<details><summary>` toggles: `focus:outline-none` with no
   replacement ring (`HomePage.tsx` ×2, `EducationPage.tsx` ×3). WCAG 2.4.7.
4. **Skip link target is not focusable**: `main#main-content` has no `tabindex="-1"`; Safari/older engines
   move the scroll but not focus.
5. **Hardcoded filter counts** in the projects toolbar ("All Work (8)", "… (3)", "… (5)") duplicate
   `PROJECTS`; adding or reclassifying a project silently desynchronises the UI from the data.
6. **No machine-readable résumé.** `llms.txt` points agents at `llms-full.txt` only; there is no JSON
   Résumé export even though the page data is already fully structured in `src/data/portfolio.ts`.

## 2. Comparison with well-regarded open-source portfolio/résumé projects

| Project | URL | Relevant features | Adopt / reject |
| --- | --- | --- | --- |
| al-folio (Jekyll academic starter, ~16 k★) | https://github.com/alshedivat/al-folio | light/dark persisted, CV rendered **from `resume.json` (JSON Resume) or RenderCV**, `/repositories` page via github-stats, schema.org + OG, Axe checks run manually | Adopt: JSON Resume as the portable résumé format. Reject: JS-driven GitHub stats page — runtime third-party dependency, rate limits, and it would surface repos the site has not vetted. |
| mldangelo/personal-site (Next.js + Tailwind, ~1.7 k★) | https://github.com/mldangelo/personal-site | "a résumé that **prints cleanly** and is also published as **JSON Resume**"; layouts hold at **320 px**, **200 % text**, high contrast; CI checks links/drafts; `llms.txt` | Adopt: print stylesheet, 320 px + 200 % reflow, JSON Resume. Reject: RSS/blog machinery — not a résumé site. |
| saadpasta/developerFolio (React, ~6.7 k★, unmaintained) | https://github.com/saadpasta/developerFolio | GitHub-API project cards, sections for achievements/certifications, global colour config | Reject the GitHub API cards (same reasons as al-folio); the measured gaps above are cheaper and more durable. |
| Yakovyakov/react-portfolio-template | https://github.com/Yakovyakov/react-portfolio-template | "ATS-friendly" framing, SEO, dark mode, i18n, EmailJS contact | Adopt the ATS angle only insofar as print/plain output; reject EmailJS (third-party form handler, unnecessary here) and i18n (single-language site, no evidence of need). |
| JSON Resume schema / registry (~2.4 k★) | https://github.com/jsonresume/jsonresume.org (schema moved from jsonresume/resume-schema) | `basics`, `work`, `education`, `skills`, `projects`, `certificates`; a single document that themes and tools can consume | Adopt shape for the export. |

What was deliberately **not** added: no new dependencies, no analytics, no GitHub API calls, no
client-side routing, no blog. The existing hand-curated, evidence-bound project copy stays the ceiling.

## 3. Ranked improvements (impact × effort)

| # | Improvement | Impact | Effort | Verdict |
| --- | --- | --- | --- | --- |
| 1 | Print stylesheet + "Print / Save as PDF" action, light-mode forced for printing | high | M | **do** |
| 2 | Reflow fixes for 320 px and 200 % text (header, headings) | high | S | **do** |
| 3 | JSON Résumé export generated from the page data, embedded + downloadable | medium-high | M | **do** |
| 4 | Visible focus on `<summary>` toggles; focusable `main` (skip link) | medium | S | **do** |
| 5 | Filter counts derived from `PROJECTS` | low-medium | S | **do** |
| 6 | Structured experience fields (`organization` / employment type / location) instead of one `meta` string, so the JSON export does not need string parsing | medium (maintainability) | S | **do** |
| 7 | GitHub-stats project cards | low | M | reject — third-party runtime dep, unvetted repos |
| 8 | Search / command palette | low | L | reject — page is one screen deep per section |
| 9 | i18n | none | L | reject — no evidence of need |

## 4. Chosen scope

Items 1–6. Constraints honoured: no new npm dependencies, no change to `scripts/`, CI, `vite.config.mts`,
`package.json`; no new claims — every visible sentence already exists in `facts.json`, the prerendered
pages, `llms.txt`, or the project READMEs (which is where the repository descriptions came from).

Verification: `npm run build`, `npm run check`, `tsc` (src-only until `site-platform` installs
`@types/node`), axe re-run, 320/360/390/414 + 200 % text overflow measurement, `page.pdf()` page count and
text extraction, served build inspected in Chromium.

## 5. Verification (after implementation)

| Command / check | Result |
| --- | --- |
| `npm ci` | pass (235 packages; same 3 allow-list warnings) |
| `npx tsc --noEmit -p <src-only tsconfig>` | pass (exit 0) |
| `npm run typecheck` | **still fails**, only on the two pre-existing `vite.config.mts` `node:path` / `node:url` errors — `@types/node` missing; owner `site-platform` |
| `npm run build` | pass; 29 client modules, SSR prerender of 3 pages, `llms-full.txt` |
| `npm run check` | pass — facts + llms freshness |
| Chromium (headless, served build) `index.html`, `education.html`, `404.html` | render, correct `h1`, zero console errors, zero hydration errors |
| axe-core 4.10.2, light + dark, all pages | 0 violations |
| Reflow: `scrollWidth` vs `clientWidth` | 320/320, 360/360, 375/375, 390/390 (was 320→374); 200 % text at 390 → 390 (was 730) |
| Print (`Page.printToPDF`, Letter) | 7 pages, starts with the name block; no nav, portrait, filter controls, AI disclosure or buttons; external project links annotated with URLs; dark-mode print flattens to #111 on white; experience roles not split |
| "Print / Save as PDF" button | calls `window.print()` |
| `beforeprint` / `afterprint` | removes `dark` for printing and restores it afterwards (verified from real dark state) |
| JSON Résumé | embedded `script#resume-json` parses; valid against the JSON Resume schema (`jsonschema`); download yields `mars-cruz-resume.json`, `application/json`, 13.4 KB, 7 roles / 2 degrees / 1 certificate / 8 projects, no phone field |
| Experience metadata | rendered strings byte-identical to the previous `meta` values |

Not verified: Windows execution of the build (out of scope for this lane; `site-platform` owns the `python` vs `python3`
script issue), and Safari/Firefox print rendering (Chromium only).
