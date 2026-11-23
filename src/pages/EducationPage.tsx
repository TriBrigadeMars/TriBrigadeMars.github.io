import React, { useState, type KeyboardEvent } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Tab, TabList } from '@astryxdesign/core/TabList';
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
      <h2 id={id} className="text-2xl font-bold tracking-tight text-ink-900 dark:text-sandstone-50">
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
      navigator.clipboard.writeText(out).then(() => {
        setCopyStatus('Copied to clipboard!');
        window.setTimeout(() => setCopyStatus(''), 2500);
      });
    } else {
      setCopyStatus('Ready to copy from fields above.');
    }
  }

  return (
    <ThemeShell>
      <div className="min-h-screen bg-white text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="education" maxWidthClass="max-w-5xl" />

        <main id="main-content" className="max-w-5xl mx-auto px-4 py-12">
          {/* Section 1: Hero & Curriculum Philosophy */}
          <section id="overview" className="mb-16" aria-labelledby="overview-heading">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700 dark:bg-gold-700/30 dark:text-gold-300 border border-gold-300 dark:border-gold-600/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-500" aria-hidden="true" />
              Curriculum Sample &middot; Prevention Pedagogy &amp; Program Evaluation
            </div>

            <h1
              id="overview-heading"
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-ink-900 dark:text-sandstone-50"
            >
              Educational Initiatives &amp; Interactive Curriculum Lab
            </h1>

            <p className="text-lg text-ink-700 dark:text-sandstone-100 leading-relaxed max-w-3xl mb-6">
              How I translate statutory mandates (Title VI, Title VII, Title IX, ADA, PWFA, FMLA/FAMLI, Clery/VAWA) and peer-reviewed prevention science into trauma-informed, WCAG 2.2 AA accessible curricula, tabletop behavioral simulations, and psychometrically paired pre/post evaluations across student services, academic medicine, graduate public health, and AI literacy workshops.
            </p>

            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              {[
                '5 Curriculum Initiatives',
                '41 Slide & Visual Previews',
                '8 Custom SVG Pedagogical Models',
                'Bloom\u2019s Taxonomy + CDC 6-Step Evaluation',
                'WCAG 2.2 AA & APA 7 Audited',
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 rounded-lg bg-sandstone-50 dark:bg-skyline-800 border border-sandstone-200 dark:border-skyline-700 text-ink-900 dark:text-sandstone-50"
                >
                  {pill}
                </span>
              ))}
            </div>
          </section>

          {/* Section 2: Interactive Slide Deck Showcase */}
          <section id="slide-decks" className="mb-20" aria-labelledby="slide-decks-heading">
            <div className="flex flex-wrap items-end justify-between border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-6 gap-2">
              <div>
                <SectionHeading id="slide-decks-heading" title="Interactive Slide Deck Showcase" />
                <p className="text-sm text-ink-600 dark:text-ink-300 mt-1.5">
                  Select an educational initiative to step through approved visual slides, facilitator talking points, and accessibility/evidence notes.
                </p>
              </div>
              <span
                id="deck-slide-counter"
                className="text-xs font-mono px-2.5 py-1 rounded bg-sandstone-100 dark:bg-skyline-800 text-ink-900 dark:text-sandstone-50 border border-sandstone-200 dark:border-skyline-700"
              >
                Slide {activeSlideIdx + 1} of {currentDeck.slides.length}
              </span>
            </div>

            {/* WAI-ARIA Astryx TabList for Slide Decks */}
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
                className="lg:col-span-8 border border-sandstone-200 dark:border-skyline-800 rounded-xl bg-sandstone-50 dark:bg-skyline-800/40 overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="relative bg-ink-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px]">
                  <img
                    id="slide-main-img"
                    src={currentSlide.src}
                    alt={`${currentSlide.title} slide preview`}
                    width={1280}
                    height={720}
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-auto max-h-[520px] object-contain"
                  />
                  <button
                    id="slide-zoom-btn"
                    type="button"
                    onClick={() =>
                      setZoomItem({ src: currentSlide.src, title: currentSlide.title })
                    }
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-ink-950/90 border border-gold-500/50 text-white text-xs font-semibold hover:bg-skyline-800 focus:outline-none focus:ring-2 focus:ring-gold-500 transition"
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
                      className="bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
                    />
                  </div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">
                    Tip: Focus the slide viewer and use Left / Right arrow keys to step through slides.
                  </p>
                </div>
              </div>

              {/* Dynamic Facilitator Side Panel */}
              <Card className="lg:col-span-4 border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/80 dark:bg-skyline-800/30 space-y-4">
                <div>
                  <p
                    id="slide-deck-badge"
                    className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-1"
                  >
                    {currentDeck.badge}
                  </p>
                  <h3
                    id="slide-title"
                    className="text-xl font-bold text-ink-900 dark:text-sandstone-50"
                  >
                    {currentSlide.title}
                  </h3>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1">
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
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1">
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
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1">
                    Accessibility &amp; Evidence Guardrails
                  </h4>
                  <p
                    id="slide-qa-notes"
                    className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed"
                  >
                    {currentSlide.qa}
                  </p>
                </div>
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
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-1.5">
                Curriculum alignment linking Bloom&rsquo;s Taxonomy objectives, matched pre/post items (Wilcoxon signed-rank / Cohen&rsquo;s <em>d</em>), and the CDC 6-Step evaluation framework.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="lo-initiative-filter"
                  className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5"
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
                  className="block text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-1.5"
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
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/70 dark:bg-skyline-800/30 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <Badge variant="teal" label={o.bloomLabel} />
                      <span className="text-xs font-mono text-ink-600 dark:text-ink-300">
                        {o.initLabel} &middot; {o.code}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50 leading-relaxed">
                      {o.statement}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-sandstone-200 dark:border-skyline-800 text-xs space-y-1.5 text-ink-600 dark:text-ink-300">
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
            <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-6 bg-sandstone-50/80 dark:bg-skyline-800/30">
              <div className="mb-4">
                <div className="mb-2">
                  <Badge variant="yellow" label="Interactive Evaluation Instrument Sample" />
                </div>
                <h3 className="text-lg font-bold text-ink-900 dark:text-sandstone-50">
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
                      className={
                        active
                          ? 'bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500'
                          : ''
                      }
                    />
                  );
                })}
              </div>

              <div id="construct-panel" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-white dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-wider text-skyline-700 dark:text-teal-300 mb-1.5">
                    1. Baseline (T0 Pre-Test)
                  </p>
                  <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentConstruct.pre}
                  </p>
                </div>
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-white dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1.5">
                    2. Summative (T3 Post-Test)
                  </p>
                  <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentConstruct.post}
                  </p>
                </div>
                <div className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-4 bg-white dark:bg-ink-950">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-300 mb-1.5">
                    3. CDC 6-Step Rationale
                  </p>
                  <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
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
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-1.5">
                Rehearse bystander intervention and systemic reporting routes without canned scripts. Ground rules: practice space only; 4 of the 5 Ds are indirect by design.
              </p>
            </div>

            {/* WAI-ARIA Astryx TabList for Activity Modules */}
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
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-2">
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
                          ? 'border-2 border-gold-500 bg-gold-100/70 dark:bg-skyline-800/80'
                          : 'border border-sandstone-200 dark:border-skyline-800 bg-sandstone-50/70 dark:bg-skyline-800/30 hover:border-teal-600'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-semibold ${
                          isSel
                            ? 'text-skyline-700 dark:text-gold-300'
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
                <Card className="lg:col-span-7 border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="yellow" label={currentScenario.badge} />
                    <span id="sc-ds" className="text-xs font-mono text-ink-600 dark:text-ink-300">
                      {currentScenario.ds}
                    </span>
                  </div>
                  <h3 id="sc-title" className="text-xl font-bold text-ink-900 dark:text-sandstone-50">
                    {currentScenario.title}
                  </h3>
                  <p id="sc-context" className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {currentScenario.context}
                  </p>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-300 mb-2">
                      Four Tabletop Seats
                    </h4>
                    <div id="sc-seats" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentScenario.seats.map((seat) => (
                        <div
                          key={seat.role}
                          className="p-2.5 rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950"
                        >
                          <p className="text-xs font-bold text-ink-900 dark:text-sandstone-50">
                            {seat.role}
                          </p>
                          <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5">
                            {seat.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l-4 border-gold-500 bg-sandstone-50 dark:bg-ink-950 p-4 rounded-r-lg space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-skyline-700 dark:text-gold-300">
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
                      className="text-xs font-bold text-cherry dark:text-sunset pt-2"
                    >
                      &#9654; {currentScenario.freeze}
                    </p>
                  </div>
                </Card>

                {/* Right: Interactive Room Switcher & Practice Scratchpad */}
                <div className="lg:col-span-5 space-y-5">
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/80 dark:bg-skyline-800/30">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                        The Two-Rooms Switcher
                      </h4>
                      <div className="inline-flex rounded-lg border border-sandstone-200 dark:border-skyline-700 p-0.5 bg-white dark:bg-ink-950">
                        <button
                          type="button"
                          id="room-public-btn"
                          aria-pressed={activeRoomMode === 'public'}
                          onClick={() => setActiveRoomMode('public')}
                          className={`px-3 py-1 rounded-md text-xs transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                            activeRoomMode === 'public'
                              ? 'font-semibold bg-skyline-700 text-white dark:bg-teal-600'
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
                              ? 'font-semibold bg-skyline-700 text-white dark:bg-teal-600'
                              : 'font-medium text-ink-700 dark:text-ink-300'
                          }`}
                        >
                          Round 2: Private
                        </button>
                      </div>
                    </div>
                    <div id="room-analysis" className="space-y-3 text-sm">
                      <div className="p-3 rounded-lg bg-white dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700">
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-1">
                          What the Room Gives You
                        </p>
                        <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                          {currentRoom.gives}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700">
                        <p className="text-xs font-semibold text-cherry dark:text-sunset uppercase tracking-wider mb-1">
                          What the Room Takes Away
                        </p>
                        <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                          {currentRoom.takes}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gold-100/70 dark:bg-skyline-800 border border-gold-300 dark:border-gold-600/50">
                        <p className="text-xs font-semibold text-skyline-700 dark:text-gold-300 uppercase tracking-wider mb-1">
                          Best-Fit 5 Ds Move
                        </p>
                        <p className="text-xs text-ink-900 dark:text-sandstone-50 leading-relaxed">
                          {currentRoom.moves}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Participant-Authored Practice Scratchpad */}
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/30 space-y-3">
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
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button
                        id="copy-practice-btn"
                        label="Copy Practice Notes"
                        variant="primary"
                        size="sm"
                        onClick={handleCopyPractice}
                        className="bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
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
                <Card className="lg:col-span-7 border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/30 space-y-4">
                  <div>
                    <Badge variant="teal" label="Three-Layer Resolution Ladder" />
                    <h3
                      id="actb-title"
                      className="text-xl font-bold text-ink-900 dark:text-sandstone-50 mt-2"
                    >
                      Resolution Map: {currentScenario.title}
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-ink-300 mt-1">
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
                        <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
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
                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/80 dark:bg-skyline-800/30 space-y-3">
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
                          className="border border-sandstone-200 dark:border-skyline-700 rounded-lg p-3 bg-white dark:bg-ink-950 cursor-pointer"
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

                  <Card className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/30 space-y-2.5">
                    <h4 className="text-sm font-bold text-ink-900 dark:text-sandstone-50">
                      Duty to Report: Private vs. Confidential
                    </h4>
                    <ul className="text-xs text-ink-700 dark:text-ink-300 space-y-2 leading-relaxed list-disc ml-4">
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
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-1.5">
                Deterministic SVG diagrams designed for WCAG 2.2 AA contrast alongside the multi-agent quality assurance pipeline documented across Antigravity, Hermes Agent, Claude Code, Codex, and LM Studio Bionic sessions.
              </p>
            </div>

            <h3 className="text-lg font-bold text-ink-900 dark:text-sandstone-50 mb-4">
              Deterministic Instructional SVG Diagrams (8 Models)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {SVG_DIAGRAMS.map((d) => (
                <button
                  key={d.src}
                  type="button"
                  onClick={() => setZoomItem({ src: d.src, title: d.zoomTitle })}
                  className="diagram-card text-left border border-sandstone-200 dark:border-skyline-800 rounded-xl p-3 bg-white dark:bg-skyline-800/30 hover:border-teal-600 dark:hover:border-teal-300 transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
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

            <h3 className="text-lg font-bold text-ink-900 dark:text-sandstone-50 mb-4">
              Multi-Harness Curriculum Engineering &amp; Quality Gates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QA_CARDS.map((card) => (
                <Card
                  key={card.src}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/70 dark:bg-skyline-800/30"
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
                      className="w-full h-44 object-contain bg-white rounded-lg p-2 border border-sandstone-200 dark:border-skyline-700"
                    />
                  </button>
                  <h4 className="font-bold text-ink-900 dark:text-sandstone-50 text-base">
                    {card.title}
                  </h4>
                  <p className="text-xs text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </main>

        {/* Native <dialog> Zoom Modal via Meta Astryx Dialog */}
        <Dialog
          id="zoom-modal"
          isOpen={Boolean(zoomItem)}
          onOpenChange={(open) => {
            if (!open) setZoomItem(null);
          }}
          width="min(64rem, calc(100vw - 2rem))"
          maxHeight="90dvh"
          purpose="info"
        >
          <Layout
            height="auto"
            header={
              <DialogHeader
                title={zoomItem?.title ?? 'Preview'}
                onOpenChange={(open) => {
                  if (!open) setZoomItem(null);
                }}
                hasDivider
              />
            }
            content={
              <LayoutContent>
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
              </LayoutContent>
            }
          />
        </Dialog>

        <SiteFooter variant="education" />
      </div>
    </ThemeShell>
  );
}
