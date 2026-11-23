import React, { useState, type KeyboardEvent } from 'react';
import { Badge, Button, Card, Tab, TabList, ZoomDialog } from '../components/ui';
import { ThemeShell } from '../components/ThemeShell';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import {
  BLOOM_FILTER_OPTIONS,
  COACHING_PROMPTS,
  CONSTRUCTS,
  DECK_ORDER,
  DECKS,
  INITIATIVE_FILTER_OPTIONS,
  OBJECTIVES,
  QA_CARDS,
  SCENARIO_ORDER,
  SCENARIOS,
  SVG_DIAGRAMS,
  type ConstructKey,
  type DeckKey,
  type ScenarioKey,
} from '../data/education';

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="angle-slash" aria-hidden="true" />
      <h2
        id={id}
        className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-ink-900 dark:text-sandstone-50"
      >
        {title}
      </h2>
    </div>
  );
}

export function EducationPage() {
  // 1. Slide Deck state
  const [activeDeckKey, setActiveDeckKey] = useState<DeckKey>('fa1');
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  // 2. Learning Objectives & SGIC state
  const [initiativeFilter, setInitiativeFilter] = useState<string>('all');
  const [bloomFilter, setBloomFilter] = useState<string>('all');
  const [activeConstructKey, setActiveConstructKey] = useState<ConstructKey>('conflict');

  // 3. Activity Simulator state
  const [activeActivityTab, setActiveActivityTab] = useState<'a' | 'b'>('a');
  const [activeScenarioKey, setActiveScenarioKey] = useState<ScenarioKey>('f1');
  const [activeRoomMode, setActiveRoomMode] = useState<'public' | 'private'>('public');
  const [practicePublic, setPracticePublic] = useState<string>('');
  const [practicePrivate, setPracticePrivate] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<string>('');

  // 4. Zoom Dialog state
  const [zoomItem, setZoomItem] = useState<{ src: string; title: string } | null>(null);

  const currentDeck = DECKS[activeDeckKey];
  const currentSlide = currentDeck.slides[activeSlideIdx] ?? currentDeck.slides[0];
  const slideProgressPct = Math.round(((activeSlideIdx + 1) / currentDeck.slides.length) * 100);

  const filteredObjectives = OBJECTIVES.filter(
    (o) =>
      (initiativeFilter === 'all' || o.initiative === initiativeFilter) &&
      (bloomFilter === 'all' || o.bloom === bloomFilter),
  );

  const currentConstruct =
    CONSTRUCTS.find((c) => c.key === activeConstructKey) ?? CONSTRUCTS[0];

  const currentScenario = SCENARIOS[activeScenarioKey];
  const currentRoom =
    activeRoomMode === 'public' ? currentScenario.publicRoom : currentScenario.privateRoom;

  function stepSlide(delta: number) {
    const len = currentDeck.slides.length;
    setActiveSlideIdx((prev) => (prev + delta + len) % len);
  }

  // Scoped strictly to #deck-stage so global document arrow keys are never hijacked.
  function handleStageKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.getAttribute('role') === 'tab')
    ) {
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepSlide(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepSlide(1);
    }
  }

  function handleCopyPractice() {
    const pub = practicePublic.trim() || '(not drafted yet)';
    const priv = practicePrivate.trim() || '(not drafted yet)';
    const out = `${currentScenario.title}\n- Public move: ${pub}\n- One-on-one / Delay move: ${priv}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(out)
        .then(() => {
          setCopyStatus('Copied to clipboard!');
          window.setTimeout(() => setCopyStatus(''), 2500);
        })
        .catch(() => {
          setCopyStatus('Copy was blocked. Select and copy your notes below.');
        });
    } else {
      setCopyStatus('Copy was blocked. Select and copy your notes below.');
    }
  }

  return (
    <ThemeShell>
      <div className="min-h-screen bg-alabaster text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="education" maxWidthClass="max-w-5xl" />

        <main id="main-content" className="max-w-5xl mx-auto px-4 py-12">
          {/* Section 1: Hero & Curriculum Philosophy */}
          <section id="overview" className="mb-16" aria-labelledby="overview-heading">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700 dark:bg-gold-700/30 dark:text-gold-300 border border-gold-300 dark:border-gold-600/50 mb-4 tracking-[0.06em]">
              <svg className="w-2.5 h-2.5 text-gold-600 dark:text-gold-300 shrink-0" viewBox="0 0 12 10" fill="currentColor" aria-hidden="true">
                <polygon points="6,0 12,10 0,10" />
              </svg>
              <span>Curriculum Sample &middot; Prevention Pedagogy &amp; Program Evaluation</span>
            </div>

            <h1
              id="overview-heading"
              className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-ink-900 dark:text-sandstone-50"
            >
              Educational Initiatives &amp; Interactive Curriculum Lab
            </h1>

            <p className="text-lg text-ink-700 dark:text-sandstone-100 leading-relaxed max-w-3xl mb-5 border-l-4 border-gold-500 pl-4">
              Explore training materials, practice scenarios, and evaluation tools for prevention education. Start with a slide deck below or try a workplace scenario in the tabletop simulator.
            </p>

            <div className="flex flex-wrap gap-2.5 text-xs font-semibold mb-6">
              {[
                '5 Curriculum Initiatives',
                '41 Slide & Visual Previews',
                '8 Custom SVG Pedagogical Models',
                'Bloom\u2019s Taxonomy + CDC 6-Step Evaluation',
                'WCAG 2.2 AA Target · APA 7 Citation-Verified (Oct 2026 Self-Audit)',
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-skyline-800 border border-sandstone-200 dark:border-skyline-700 text-ink-900 dark:text-sandstone-50"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Progressive Disclosure: Statutory Context + Reviewable Self-Audit Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <details className="rounded-xl border border-sandstone-200 dark:border-skyline-800 bg-white dark:bg-skyline-800/40 p-4">
                <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.12em] text-gold-600 dark:text-gold-300 focus:outline-none">
                  Statutory Scope, Pedagogy &amp; Psychometric Methodology
                </summary>
                <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed mt-3 pt-3 border-t border-sandstone-200 dark:border-skyline-700">
                  Translates statutory mandates (Title VI, Title VII, Title IX, ADA, PWFA, FMLA/FAMLI, Clery/VAWA) and peer-reviewed prevention science into trauma-informed curricula, tabletop behavioral simulations, and anonymous Self-Generated Identification Code (SGIC) pre/post evaluations across student services, academic medicine, graduate public health, and public-interest AI literacy workshops.
                </p>
              </details>

              <details
                id="audit-evidence"
                className="rounded-xl border border-sandstone-200 dark:border-skyline-800 bg-white dark:bg-skyline-800/40 p-4"
              >
                <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300 focus:outline-none">
                  Accessibility &amp; Citation Self-Audit Scope, Method &amp; Known Limits
                </summary>
                <dl className="text-sm text-ink-700 dark:text-ink-300 space-y-2 mt-3 pt-3 border-t border-sandstone-200 dark:border-skyline-700 leading-relaxed">
                  <div>
                    <dt className="font-semibold text-ink-900 dark:text-sandstone-50 inline">Audit Date &amp; Reviewer:</dt>{' '}
                    <dd className="inline">October–November 2026 internal multi-critic self-audit by Mars Cruz, MPH, CHES (not an independent third-party WCAG certification).</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-900 dark:text-sandstone-50 inline">Scope:</dt>{' '}
                    <dd className="inline">5 initiatives, 41 slide previews, 8 deterministic SVG models, and interactive controls across index.html and education.html.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-900 dark:text-sandstone-50 inline">Method:</dt>{' '}
                    <dd className="inline">Programmatic contrast verification (&ge;4.5:1 normal text, &ge;3:1 UI), 18pt minimum slide body typography, keyboard-scoped slide navigation, and 1-to-1 Crossref/OpenAlex APA 7 verification.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-900 dark:text-sandstone-50 inline">Known Limits &amp; Alternatives:</dt>{' '}
                    <dd className="inline">Deck previews are raster .webp exports; each slide includes descriptive alt text plus an HTML Slide Text &amp; Visual Transcript disclosure in the side panel.</dd>
                  </div>
                </dl>
              </details>
            </div>
          </section>

          {/* Section 2: Interactive Slide Deck Showcase */}
          <section id="slide-decks" className="mb-20" aria-labelledby="slide-decks-heading">
            <div className="flex flex-wrap items-end justify-between border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-6 gap-2">
              <div>
                <SectionHeading id="slide-decks-heading" title="Interactive Slide Deck Showcase" />
                <p className="text-base text-ink-600 dark:text-ink-300 mt-1.5">
                  Select an educational initiative to step through visual slides, structured transcripts, facilitator talking points, and evidence notes.
                </p>
              </div>
              <span
                id="deck-slide-counter"
                className="text-xs font-mono px-2.5 py-1 rounded bg-white dark:bg-skyline-800 text-ink-900 dark:text-sandstone-50 border border-sandstone-200 dark:border-skyline-700"
              >
                Slide {activeSlideIdx + 1} of {currentDeck.slides.length}
              </span>
            </div>

            {/* WAI-ARIA TabList for Slide Decks */}
            <div className="mb-6">
              <TabList
                id="deck-tabs"
                role="tablist"
                aria-label="Educational slide decks"
                value={activeDeckKey}
                onChange={(val) => {
                  setActiveDeckKey(val as DeckKey);
                  setActiveSlideIdx(0);
                }}
              >
                {DECK_ORDER.map((key) => (
                  <Tab
                    key={key}
                    id={`deck-tab-${key}`}
                    value={key}
                    panelId="deck-tabpanel"
                    label={DECKS[key].tabLabel}
                  />
                ))}
              </TabList>
            </div>

            {/* Deck Main Stage + Facilitator Side Panel */}
            <div
              id="deck-tabpanel"
              role="tabpanel"
              aria-labelledby={`deck-tab-${activeDeckKey}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              <div
                id="deck-stage"
                tabIndex={0}
                onKeyDown={handleStageKeyDown}
                aria-label="Slide preview stage. Focus here and press Left or Right arrow keys to change slides."
                className="lg:col-span-8 border border-sandstone-200 dark:border-skyline-800 rounded-xl bg-white dark:bg-skyline-800/40 overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                {/* 2px Burnished Ochre slide progress indicator */}
                <div className="h-[3px] w-full bg-sandstone-100 dark:bg-skyline-900" aria-hidden="true">
                  <div
                    className="h-full bg-gold-500 transition-[width] duration-200 ease-out"
                    style={{ width: `${slideProgressPct}%` }}
                  />
                </div>

                <div className="relative bg-ink-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px]">
                  <img
                    key={currentSlide.src}
                    id="slide-main-img"
                    src={currentSlide.src}
                    alt={`${currentSlide.title} — ${currentSlide.purpose}`}
                    width={1280}
                    height={720}
                    decoding="async"
                    fetchPriority="high"
                    className="fr-stage-fade w-full h-auto max-h-[520px] object-contain"
                  />
                  <button
                    id="slide-zoom-btn"
                    type="button"
                    onClick={() =>
                      setZoomItem({ src: currentSlide.src, title: currentSlide.title })
                    }
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-ink-950/90 border border-gold-500/60 text-white text-xs font-semibold hover:bg-skyline-800 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors"
                  >
                    Zoom View
                  </button>
                </div>

                <div className="p-4 border-t border-sandstone-200 dark:border-skyline-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-ink-950">
                  <div className="flex items-center gap-2">
                    <Button
                      id="slide-prev-btn"
                      label="← Prev"
                      variant="secondary"
                      size="md"
                      onClick={() => stepSlide(-1)}
                    />
                    <Button
                      id="slide-next-btn"
                      label="Next →"
                      variant="primary"
                      size="md"
                      onClick={() => stepSlide(1)}
                    />
                  </div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">
                    Tip: Focus the slide viewer and use Left / Right arrow keys to step through slides.
                  </p>
                </div>
              </div>

              {/* Dynamic Facilitator Side Panel */}
              <Card className="lg:col-span-4 border border-sandstone-200 dark:border-skyline-800 border-t-4 border-t-gold-500 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-4 shadow-sm">
                <div>
                  <p
                    id="slide-deck-badge"
                    className="text-xs font-bold text-gold-600 dark:text-gold-300 uppercase tracking-[0.12em] mb-1"
                  >
                    {currentDeck.badge}
                  </p>
                  <h3
                    id="slide-title"
                    className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50"
                  >
                    {currentSlide.title}
                  </h3>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-1">
                    Instructional Purpose &amp; Timing
                  </h4>
                  <p
                    id="slide-purpose"
                    className="text-sm text-ink-700 dark:text-sandstone-100 leading-relaxed"
                  >
                    {currentSlide.purpose}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-1">
                    Facilitator Talking Points
                  </h4>
                  <p
                    id="slide-talking-points"
                    className="text-sm text-ink-700 dark:text-sandstone-100 leading-relaxed"
                  >
                    {currentSlide.talking}
                  </p>
                </div>
                <div className="pt-3 border-t border-sandstone-200 dark:border-skyline-800">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-1">
                    Accessibility &amp; Evidence Guardrails
                  </h4>
                  <p
                    id="slide-qa-notes"
                    className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed"
                  >
                    {currentSlide.qa}
                  </p>
                </div>

                {/* Accessible HTML Transcript Disclosure for Non-Text Slide Content */}
                <details className="rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-teal-700 dark:text-teal-300 focus:outline-none">
                    Accessible HTML Slide Transcript
                  </summary>
                  <div className="mt-2 pt-2 border-t border-sandstone-200 dark:border-skyline-800 text-xs text-ink-700 dark:text-ink-300 space-y-1.5 leading-relaxed">
                    <p>
                      <strong>Heading:</strong> {currentSlide.title}
                    </p>
                    <p>
                      <strong>Visual Summary:</strong> {currentSlide.purpose}
                    </p>
                    <p>
                      <strong>Core Instructional Content:</strong> {currentSlide.talking}
                    </p>
                    <p>
                      <strong>Format &amp; Verification:</strong> {currentSlide.qa}
                    </p>
                  </div>
                </details>
              </Card>
            </div>

            {/* Thumbnail Strip (loads 320px WebP thumbs lazily) */}
            <div
              id="slide-thumbs"
              className="mt-4 flex gap-2.5 overflow-x-auto pb-2"
              aria-label="Slide thumbnails"
            >
              {currentDeck.slides.map((s, idx) => {
                const isSelected = idx === activeSlideIdx;
                return (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    title={s.title}
                    aria-label={`Slide ${idx + 1}: ${s.title}`}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 ${
                      isSelected
                        ? 'border-gold-500 ring-2 ring-gold-500/40'
                        : 'border-sandstone-200 dark:border-skyline-800 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.thumb}
                      alt={`Thumbnail ${idx + 1}: ${s.title}`}
                      loading="lazy"
                      decoding="async"
                      width={112}
                      height={64}
                      className="w-28 h-16 object-cover bg-sandstone-100 dark:bg-ink-950"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Learning Objectives & Pre/Post Evaluation Matrix */}
          <section id="learning-objectives" className="mb-20" aria-labelledby="lo-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-6">
              <SectionHeading
                id="lo-heading"
                title="Learning Objectives & Pre/Post Evaluation Matrix"
              />
              <p className="text-base text-ink-600 dark:text-ink-300 mt-1.5">
                Curriculum alignment linking Bloom&rsquo;s Taxonomy objectives, matched pre/post items (Wilcoxon signed-rank / Cohen&rsquo;s <em>d</em>), and the CDC 6-Step evaluation framework.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="lo-initiative-filter"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-1.5"
                >
                  Filter by Initiative
                </label>
                <select
                  id="lo-initiative-filter"
                  value={initiativeFilter}
                  onChange={(e) => setInitiativeFilter(e.target.value)}
                  className="w-full rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800 px-3 py-2 text-sm text-ink-900 dark:text-sandstone-50 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                >
                  {INITIATIVE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="lo-bloom-filter"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-1.5"
                >
                  Filter by Bloom&rsquo;s Taxonomy Tier
                </label>
                <select
                  id="lo-bloom-filter"
                  value={bloomFilter}
                  onChange={(e) => setBloomFilter(e.target.value)}
                  className="w-full rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800 px-3 py-2 text-sm text-ink-900 dark:text-sandstone-50 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                >
                  {BLOOM_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Objectives Grid */}
            <div id="lo-cards-container" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {filteredObjectives.map((o) => (
                <Card
                  key={`${o.initiative}-${o.code}`}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <Badge variant="teal" label={o.bloomLabel} />
                      <span className="text-xs font-mono text-ink-600 dark:text-ink-300">
                        {o.initLabel} &middot; {o.code}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-ink-900 dark:text-sandstone-50 leading-relaxed">
                      {o.statement}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-sandstone-200 dark:border-skyline-800 text-xs sm:text-sm space-y-1.5 text-ink-600 dark:text-ink-300">
                    <p>
                      <strong className="text-ink-900 dark:text-sandstone-50">Pre-Test:</strong>{' '}
                      {o.pre}
                    </p>
                    <p>
                      <strong className="text-ink-900 dark:text-sandstone-50">Post-Test:</strong>{' '}
                      {o.post}
                    </p>
                    <p>
                      <strong className="text-ink-900 dark:text-sandstone-50">Construct:</strong>{' '}
                      {o.construct}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Interactive Pre/Post Evaluation Self-Check & SGIC Protocol */}
            <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-6 bg-white dark:bg-skyline-800/40 shadow-sm">
              <div className="mb-4">
                <div className="mb-2">
                  <Badge variant="yellow" label="Interactive Evaluation Instrument Sample" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50">
                  Pre/Post Construct Pairing &amp; Anonymous SGIC Method
                </h3>
                <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">
                  Select a psychometric construct to inspect matched baseline/summative survey items and why anonymous Self-Generated Identification Codes (SGIC) replace superficial satisfaction polls.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {CONSTRUCTS.map((c) => {
                  const active = c.key === activeConstructKey;
                  return (
                    <Button
                      key={c.key}
                      label={c.label}
                      size="sm"
                      variant={active ? 'primary' : 'secondary'}
                      aria-pressed={active}
                      onClick={() => setActiveConstructKey(c.key)}
                    />
                  );
                })}
              </div>

              <div id="construct-panel" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-sandstone-50 dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-900 dark:text-sandstone-50 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-300" aria-hidden="true" />
                    <span>1. Baseline (T0 Pre-Test)</span>
                  </p>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentConstruct.pre}
                  </p>
                </div>
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-sandstone-50 dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-900 dark:text-sandstone-50 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-skyline-700 dark:bg-teal-300" aria-hidden="true" />
                    <span>2. Summative (T3 Post-Test)</span>
                  </p>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentConstruct.post}
                  </p>
                </div>
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-sandstone-50 dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-700 dark:text-gold-300 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-500" aria-hidden="true" />
                    <span>3. CDC 6-Step Rationale</span>
                  </p>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentConstruct.rationale}
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 4: Interactive Activity Materials & Tabletop Scenario Simulator */}
          <section id="activity-lab" className="mb-20" aria-labelledby="activity-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-6">
              <SectionHeading
                id="activity-heading"
                title="Interactive Activity Materials & Tabletop Simulator"
              />
              <p className="text-base text-ink-600 dark:text-ink-300 mt-1.5">
                Rehearse bystander intervention and systemic reporting routes without canned scripts. Ground rules: practice space only; 4 of the 5 Ds are indirect by design.
              </p>
            </div>

            {/* WAI-ARIA TabList for Activity Modules */}
            <div className="mb-6">
              <TabList
                id="activity-tabs"
                role="tablist"
                aria-label="Activity modules"
                value={activeActivityTab}
                onChange={(val) => setActiveActivityTab(val as 'a' | 'b')}
              >
                <Tab
                  id="tab-act-a"
                  value="a"
                  panelId="panel-act-a"
                  label="Activity A: Two Rooms, One Behavior (18 Min)"
                />
                <Tab
                  id="tab-act-b"
                  value="b"
                  panelId="panel-act-b"
                  label="Activity B: Close the Loop & Coaching Bank (12 Min)"
                />
              </TabList>
            </div>

            {/* Scenario Selector */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-2">
                Choose a Sanitized Tabletop Scenario Card
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" id="scenario-selector">
                {SCENARIO_ORDER.map((scKey) => {
                  const sc = SCENARIOS[scKey];
                  const isSel = scKey === activeScenarioKey;
                  return (
                    <button
                      key={scKey}
                      type="button"
                      aria-pressed={isSel}
                      onClick={() => setActiveScenarioKey(scKey)}
                      className={`scenario-card-btn text-left p-3.5 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 ${
                        isSel
                          ? 'border-2 border-gold-500 bg-gold-100/70 dark:bg-skyline-800/80 shadow-sm'
                          : 'border border-sandstone-200 dark:border-skyline-800 bg-white dark:bg-skyline-800/30 hover:border-gold-500'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-semibold ${
                          isSel
                            ? 'text-gold-700 dark:text-gold-300'
                            : 'text-ink-600 dark:text-ink-300'
                        }`}
                      >
                        {sc.cardLabel}
                      </span>
                      <p className="text-sm font-bold text-ink-900 dark:text-sandstone-50 mt-0.5">
                        {sc.cardTitle}
                      </p>
                      <p className="text-xs text-ink-600 dark:text-ink-300 mt-1">{sc.cardSub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity A Panel */}
            <div
              id="panel-act-a"
              role="tabpanel"
              aria-labelledby="tab-act-a"
              hidden={activeActivityTab !== 'a'}
              className={activeActivityTab === 'a' ? 'space-y-6' : 'hidden'}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Scenario Dialogue & 4 Seats */}
                <Card className="lg:col-span-7 border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="yellow" label={currentScenario.badge} />
                    <span id="sc-ds" className="text-xs font-mono text-ink-600 dark:text-ink-300">
                      {currentScenario.ds}
                    </span>
                  </div>
                  <h3 id="sc-title" className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50">
                    {currentScenario.title}
                  </h3>
                  <p id="sc-context" className="text-sm md:text-base text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentScenario.context}
                  </p>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-600 dark:text-ink-300 mb-2">
                      Four Tabletop Seats
                    </h4>
                    <div id="sc-seats" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentScenario.seats.map((seat) => (
                        <div
                          key={seat.role}
                          className="p-3 rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950"
                        >
                          <p className="text-xs font-bold text-ink-900 dark:text-sandstone-50">
                            {seat.role}
                          </p>
                          <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5 leading-relaxed">
                            {seat.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l-4 border-gold-500 bg-sandstone-50 dark:bg-ink-950 p-4 rounded-r-lg space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-700 dark:text-gold-300">
                      Scene Script Up to Freeze
                    </p>
                    <div
                      id="sc-dialogue"
                      className="text-sm text-ink-900 dark:text-sandstone-100 space-y-2 leading-relaxed"
                    >
                      {currentScenario.dialogue.map((line, i) => (
                        <p key={i}>
                          <strong>{line.speaker}</strong>{' '}
                          {line.italic ? <em>{line.line}</em> : line.line}
                        </p>
                      ))}
                    </div>
                    <p
                      id="sc-freeze"
                      className="border-l-4 border-terracotta pl-3 py-1 text-xs sm:text-sm font-bold text-ink-900 dark:text-sandstone-50"
                    >
                      &#9654; {currentScenario.freeze}
                    </p>
                  </div>
                </Card>

                {/* Right: Interactive Room Switcher & Practice Scratchpad */}
                <div className="lg:col-span-5 space-y-5">
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                        The Two-Rooms Switcher
                      </h4>
                      <div className="inline-flex rounded-lg border border-sandstone-200 dark:border-skyline-700 p-0.5 bg-sandstone-50 dark:bg-ink-950">
                        <button
                          type="button"
                          id="room-public-btn"
                          aria-pressed={activeRoomMode === 'public'}
                          onClick={() => setActiveRoomMode('public')}
                          className={`px-3 py-1 rounded-md text-xs transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            activeRoomMode === 'public'
                              ? 'font-semibold bg-skyline-700 text-white dark:bg-teal-300 dark:text-ink-950'
                              : 'font-medium text-ink-700 dark:text-ink-300'
                          }`}
                        >
                          Round 1: Public
                        </button>
                        <button
                          type="button"
                          id="room-private-btn"
                          aria-pressed={activeRoomMode === 'private'}
                          onClick={() => setActiveRoomMode('private')}
                          className={`px-3 py-1 rounded-md text-xs transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            activeRoomMode === 'private'
                              ? 'font-semibold bg-skyline-700 text-white dark:bg-teal-300 dark:text-ink-950'
                              : 'font-medium text-ink-700 dark:text-ink-300'
                          }`}
                        >
                          Round 2: Private
                        </button>
                      </div>
                    </div>
                    <div key={`${activeScenarioKey}-${activeRoomMode}`} id="room-analysis" className="fr-stage-fade space-y-3 text-sm">
                      <div className="p-3 rounded-lg bg-sandstone-50 dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700 border-l-4 border-l-teal-600 dark:border-l-teal-300">
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-[0.1em] mb-1">
                          What the Room Gives You
                        </p>
                        <p className="text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                          {currentRoom.gives}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-sandstone-50 dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700 border-l-4 border-l-terracotta">
                        <p className="text-xs font-semibold text-ink-900 dark:text-sandstone-50 uppercase tracking-[0.1em] mb-1 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" aria-hidden="true" />
                          <span>What the Room Takes Away</span>
                        </p>
                        <p className="text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                          {currentRoom.takes}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gold-100/70 dark:bg-skyline-800 border border-gold-300 dark:border-gold-600/50">
                        <p className="text-xs font-semibold text-gold-700 dark:text-gold-300 uppercase tracking-[0.1em] mb-1">
                          Best-Fit 5 Ds Move
                        </p>
                        <p className="text-xs sm:text-sm text-ink-900 dark:text-sandstone-50 leading-relaxed">
                          {currentRoom.moves}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Participant-Authored Practice Scratchpad */}
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                        Draft Your Own Words
                      </h4>
                      <span className="text-xs text-ink-600 dark:text-ink-300">
                        Local browser only
                      </span>
                    </div>
                    <p className="text-xs text-ink-600 dark:text-ink-300">
                      No canned scripts are handed out in training; participants adapt phrasing to their own authentic voice.
                    </p>
                    <div>
                      <label
                        htmlFor="practice-public"
                        className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1"
                      >
                        In public / group setting I would say:
                      </label>
                      <input
                        id="practice-public"
                        type="text"
                        value={practicePublic}
                        onChange={(e) => setPracticePublic(e.target.value)}
                        placeholder="e.g., Let's pause and check the cross-training schedule..."
                        className="w-full rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950 px-3 py-1.5 text-sm text-ink-900 dark:text-sandstone-50 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="practice-private"
                        className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1"
                      >
                        One-on-one / afterward (Delay + Document) I would say:
                      </label>
                      <input
                        id="practice-private"
                        type="text"
                        value={practicePrivate}
                        onChange={(e) => setPracticePrivate(e.target.value)}
                        placeholder="e.g., That wasn't okay. What do you want next, and who can I walk with you to?"
                        className="w-full rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950 px-3 py-1.5 text-sm text-ink-900 dark:text-sandstone-50 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <Button
                        id="copy-practice-btn"
                        label="Copy Practice Notes"
                        variant="primary"
                        size="sm"
                        onClick={handleCopyPractice}
                      />
                      <span
                        id="copy-practice-status"
                        className="text-xs text-teal-700 dark:text-teal-300 font-medium"
                        aria-live="polite"
                      >
                        {copyStatus}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Activity B Panel */}
            <div
              id="panel-act-b"
              role="tabpanel"
              aria-labelledby="tab-act-b"
              hidden={activeActivityTab !== 'b'}
              className={activeActivityTab === 'b' ? 'space-y-6' : 'hidden'}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-7 border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-4 shadow-sm">
                  <div>
                    <Badge variant="teal" label="Three-Layer Resolution Ladder" />
                    <h3
                      id="actb-title"
                      className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mt-2"
                    >
                      Resolution Map: {currentScenario.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 mt-1">
                      An interrupted incident without a routed follow-up leaves the harmed colleague carrying the burden alone.
                    </p>
                  </div>
                  <div id="actb-layers" className="space-y-3">
                    {currentScenario.layers.map((l) => (
                      <div
                        key={l.layer}
                        className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-3.5 bg-sandstone-50 dark:bg-ink-950 space-y-1"
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <span className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                            {l.layer}
                          </span>
                          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                            {l.owner}
                          </span>
                        </div>
                        <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                          {l.action}
                        </p>
                        <p className="text-xs font-mono text-ink-600 dark:text-ink-300">
                          Channel: {l.channel}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="lg:col-span-5 space-y-5">
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-3 shadow-sm">
                    <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                      Peer Coaching Question Bank (Ask, Don&rsquo;t Tell)
                    </h4>
                    <p className="text-xs text-ink-600 dark:text-ink-300">
                      Select any coaching prompt to reveal its facilitation objective during the 90-second paired exchange.
                    </p>
                    <div id="coaching-bank" className="space-y-2">
                      {COACHING_PROMPTS.map((item, idx) => (
                        <details
                          key={item.q}
                          open={idx === 0}
                          className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-3 bg-sandstone-50 dark:bg-ink-950 cursor-pointer"
                        >
                          <summary className="text-xs font-bold text-ink-900 dark:text-sandstone-50">
                            {item.q}
                          </summary>
                          <p className="text-xs text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">
                            {item.obj}
                          </p>
                        </details>
                      ))}
                    </div>
                  </Card>

                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 space-y-2.5 shadow-sm">
                    <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                      Duty to Report: Private vs. Confidential
                    </h4>
                    <ul className="text-xs sm:text-sm text-ink-700 dark:text-ink-300 space-y-2 leading-relaxed list-disc ml-4">
                      <li>
                        <strong>Responsible Employees:</strong> Promptly route potential protected-class discrimination, harassment, sexual misconduct, or retaliation to the{' '}
                        <strong>[Institutional Office of Equity]</strong>.
                      </li>
                      <li>
                        <strong>Honesty About Confidentiality:</strong> Supervisors and responsible employees operate <em>privately</em>, not legally confidentially. Explain what you can protect and share exact confidential options (e.g., Campus Ombuds, Employee Assistance Program, Confidential Victim Advocates).
                      </li>
                      <li>
                        <strong>Standalone Supportive Measures:</strong> Accommodations, schedule adjustments, and no-contact directives remain available without requiring a formal disciplinary complaint.
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Visual Pedagogical Diagrams & Multi-Agent QA Architecture */}
          <section id="visual-frameworks" className="mb-16" aria-labelledby="vf-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-6">
              <SectionHeading
                id="vf-heading"
                title="Visual Pedagogical Models & Multi-Harness QA Architecture"
              />
              <p className="text-base text-ink-600 dark:text-ink-300 mt-1.5">
                Deterministic SVG diagrams designed for WCAG 2.2 AA contrast alongside the multi-agent quality assurance pipeline documented across Antigravity, Hermes Agent, Claude Code, Codex, and LM Studio Bionic sessions.
              </p>
            </div>

            <h3 className="font-display text-xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-4">
              Deterministic Instructional SVG Diagrams (8 Models)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {SVG_DIAGRAMS.map((d) => (
                <button
                  key={d.src}
                  type="button"
                  onClick={() => setZoomItem({ src: d.src, title: d.zoomTitle })}
                  className="fr-card-hover diagram-card text-left border border-sandstone-200 dark:border-skyline-800 rounded-xl p-3 bg-white dark:bg-skyline-800/40 hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 shadow-sm"
                >
                  <img
                    src={d.src}
                    alt={d.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-36 object-contain bg-sandstone-50 rounded-lg mb-2.5 p-1"
                  />
                  <p className="text-sm font-bold text-ink-900 dark:text-sandstone-50">{d.title}</p>
                  <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5">{d.description}</p>
                </button>
              ))}
            </div>

            <h3 className="font-display text-xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-4">
              Multi-Harness Curriculum Engineering &amp; Quality Gates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QA_CARDS.map((card) => (
                <Card
                  key={card.src}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setZoomItem({ src: card.src, title: card.title })}
                    className="w-full block rounded-lg overflow-hidden mb-3 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                    aria-label={`Zoom ${card.title}`}
                  >
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-44 object-contain bg-sandstone-50 rounded-lg p-2 border border-sandstone-200 dark:border-skyline-700"
                    />
                  </button>
                  <h4 className="font-bold text-ink-900 dark:text-sandstone-50 text-base">
                    {card.title}
                  </h4>
                  <p className="text-sm text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </main>

        {/* Native <dialog> Zoom Modal */}
        <ZoomDialog
          id="zoom-modal"
          isOpen={Boolean(zoomItem)}
          onClose={() => setZoomItem(null)}
          title={zoomItem?.title ?? 'Preview'}
        >
          {zoomItem ? (
            <div className="p-3 bg-sandstone-50 dark:bg-ink-950 rounded-lg flex items-center justify-center">
              <img
                id="zoom-modal-img"
                src={zoomItem.src}
                alt={zoomItem.title}
                decoding="async"
                className="max-h-[72vh] w-auto object-contain rounded"
              />
            </div>
          ) : null}
        </ZoomDialog>

        <SiteFooter variant="education" />
      </div>
    </ThemeShell>
  );
}
