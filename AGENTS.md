# AGENTS.md — portfolio site

Static portfolio for **Mars Cruz, MPH, CHES** (`index.html`, `education.html`, and `404.html`). Built with React 19, Vite, Front Range Civic design tokens (`src/theme/frontRangeTheme.ts` + `src/components/ui.tsx`), and Tailwind CSS, statically prerendered to root HTML files for GitHub Pages.

Live site: https://tribrigademars.github.io/

## Sources of truth

| File | Role |
| --- | --- |
| `src/pages/HomePage.tsx` & `src/data/portfolio.ts` | Primary portfolio and résumé page source. |
| `src/data/resumeJson.ts` | JSON Résumé export derived from `portfolio.ts`; add no copy here. |
| `src/pages/EducationPage.tsx` & `src/data/education.ts` | Interactive Educational Initiatives & Curriculum Lab source. |
| `src/pages/NotFoundPage.tsx` | Custom 404 page source. |
| `src/theme/frontRangeTheme.ts` & `src/styles/front-range-civic.css` | Front Range Civic design tokens and semantic CSS variables. |
| `src/styles/brand.css` | Component classes, reduced-motion rules, and the `@media print` résumé stylesheet. |
| `src/components/ui.tsx` | Lightweight WAI-ARIA UI primitives (`Badge`, `Button`, `Card`, `TabList`, `ZoomDialog`). |
| `index.html`, `education.html`, `404.html` | Prerendered static HTML pages served by GitHub Pages. Do not edit by hand; run `npm run build`. |
| `facts.json` | Privacy and evidence guardrails. Machine-checked rules, not prose. |
| `llms.txt` | Hand-written manual for AI agents. Keep it true when sections change. |
| `assets/resume.pdf` | The résumé employers receive. |
| `assets/app/` | Compiled Vite CSS/JS bundles for hydration. Do not edit by hand. |
| `llms-full.txt` | Generated from `index.html`. Do not edit by hand. |

## Commands

```bash
npm ci               # reproducible install from the lockfile (npm install only when changing deps)
npm run build        # build Vite client + SSR, prerender root HTML, regenerate llms-full.txt
npm run check        # facts.json rules + llms freshness
npm run typecheck    # TypeScript check
npm run check:html   # links/anchors, a11y structure, meta, sitemap, robots
npm run check:artifacts  # committed build output must match a fresh build
npm test             # self-tests for the two static gates
npm run a11y         # axe WCAG 2.2 A/AA in a real browser (light + dark); needs Chrome/Edge
npm run preview      # serve the built site like GitHub Pages (http://127.0.0.1:4173)
npm run verify       # typecheck + build + check + check:html + check:artifacts + test
npm run dev          # local Vite dev server (serve src/templates/*.html)
```

Run `npm run build` after editing `src/` files, `npm run verify` before committing,
and commit the regenerated `index.html`, `education.html`, `404.html`,
`assets/app/` and `llms-full.txt` together with the source change. GitHub Pages
publishes this branch directly, so uncommitted build output is a stale live site —
`npm run check:artifacts` and the Ubuntu CI job exist to catch that.

`build`/`check` call Python through `scripts/py.mjs`, which resolves `python3`,
`python` or `py -3` (Windows) and requires Python 3.9+. Do not call `python`
directly from a script.

## Claim rules

Content is evidence-bound. The evidence ledger lives outside this repository, so treat the
current copy as the ceiling, not a starting point.

- Do not invent employers, dates, metrics, certifications, or outcomes.
- Do not strengthen a claim. "Supported the $750,000 initiative" is not "secured $750,000".
- Do not add a phone number or a CHES credential ID. Their absence is deliberate
  (`facts.json` → `forbidden_html`).
- Do not present the featured repositories as professional software-engineering employment.
  They are work samples.
- Keep the hero lane copy ("Public Health Educator", the `og:description` variant). Changing
  the positioning line is a decision for Mars, not a copy edit.
- Held items in `facts.json` are unresolved on purpose. Do not "fix" them.

## Machine-readable layer

`llms.txt` is written for assistants: what the site is, what it is not, canonical facts,
stable selectors, citation format, and the negative constraints above. `llms-full.txt` is
generated from `<main>` so it cannot drift from the page.

If you add or rename a section, update the page map in `llms.txt` and run `npm run check` —
it fails when `llms.txt` points at a missing file or `llms-full.txt` is stale.
