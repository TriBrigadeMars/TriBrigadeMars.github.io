import React, { useState } from 'react';
import { Badge, Button, Card } from '../components/ui';
import { ThemeShell } from '../components/ThemeShell';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import {
  AI_FILES,
  BASICS,
  EDUCATIONS,
  EXPERIENCES,
  HERO_PILLARS,
  LAB_PREVIEW_STRIP,
  PROJECTS,
  SKILL_GROUPS,
  experienceMeta,
  type ProjectCaseStudy,
} from '../data/portfolio';
import { downloadResumeJson, serializeResumeJson } from '../data/resumeJson';

type ProjectFilter = 'all' | 'public-health' | 'tooling';

const PROJECT_FILTERS: Array<{ key: ProjectFilter; label: string; count: number }> = [
  { key: 'all', label: 'All Work', count: PROJECTS.length },
  {
    key: 'public-health',
    label: 'Public Health & Compliance',
    count: PROJECTS.filter((p) => p.filterGroup === 'public-health').length,
  },
  {
    key: 'tooling',
    label: 'Local-First AI & Field Tooling',
    count: PROJECTS.filter((p) => p.filterGroup === 'tooling').length,
  },
];

function GitHubIcon({ className = 'w-4 h-4 fill-current' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

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

function HeroTopoBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute -top-6 right-0 w-full max-w-2xl h-80 text-gold-500 opacity-[0.07] dark:opacity-[0.1] print:hidden"
      viewBox="0 0 600 320"
      fill="none"
      aria-hidden="true"
    >
      {/* 78-degree Front Range structural diagonals */}
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1="180" y1="0" x2="112" y2="320" />
        <line x1="260" y1="0" x2="192" y2="320" />
        <line x1="340" y1="0" x2="272" y2="320" />
        <line x1="420" y1="0" x2="352" y2="320" />
        <line x1="500" y1="0" x2="432" y2="320" />
        <line x1="580" y1="0" x2="512" y2="320" />
      </g>
      {/* Denver topographic contour lines */}
      <g stroke="#258991" strokeWidth="1.4">
        <path d="M210 290C270 230 330 220 400 175C460 136 520 96 595 82" />
        <path d="M245 305C305 245 365 236 435 190C495 152 548 118 598 106" />
        <path d="M285 316C345 260 402 252 468 208C524 172 565 144 600 134" />
        <path d="M332 320C390 274 445 266 504 228C548 198 576 176 600 168" />
      </g>
    </svg>
  );
}

function ProjectCard({ proj }: { proj: ProjectCaseStudy }) {
  const isFlagship = Boolean(proj.isFlagship);
  if (isFlagship) {
    return (
      <Card className="fr-card-hover border border-sandstone-200 dark:border-skyline-700 border-t-4 border-t-gold-500 rounded-xl p-6 shadow-sm bg-white dark:bg-skyline-800/40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 print:hidden">
                <Badge variant={proj.badgeVariant} label={proj.category} />
                <span className="text-xs font-mono font-medium text-ink-600 dark:text-ink-300">
                  Featured · {proj.originLabel}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-2">
                {proj.title}
              </h3>
              <p className="text-base font-medium text-ink-900 dark:text-sandstone-100 leading-relaxed mb-4">
                {proj.summary}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4 print:hidden">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-sandstone-100 dark:bg-skyline-800 text-ink-900 dark:text-sandstone-100 border border-sandstone-200 dark:border-skyline-700 text-xs px-2.5 py-1 rounded font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-sandstone-200 dark:border-skyline-800 flex items-center gap-4 text-sm font-semibold">
                <a
                  href={proj.ctaHref}
                  target={proj.isExternal ? '_blank' : undefined}
                  rel={proj.isExternal ? 'noopener' : undefined}
                  className="text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded"
                >
                  {proj.isExternal && <GitHubIcon className="w-4 h-4 fill-current" />}
                  <span>{proj.ctaLabel} &rarr;</span>
                </a>
              </div>
            </div>
          </div>

          <dl className="md:col-span-7 space-y-3 text-sm md:text-base md:border-l md:border-sandstone-200 dark:md:border-skyline-700/80 md:pl-6 print:hidden">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600 dark:text-gold-300 mb-0.5">
                Problem:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">{proj.problem}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600 dark:text-gold-300 mb-0.5">
                Role &amp; Approach:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">
                {proj.roleApproach}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300 mb-0.5">
                Verified Outcome:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">
                {proj.verifiedOutcome}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 hover:border-gold-500 dark:hover:border-gold-300 rounded-xl p-6 shadow-sm flex flex-col justify-between bg-white dark:bg-skyline-800/40">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 print:hidden">
          <Badge variant={proj.badgeVariant} label={proj.category} />
          <span className="text-xs font-mono font-medium text-ink-600 dark:text-ink-300">
            {proj.originLabel}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-2">
          {proj.title}
        </h3>

        <p className="text-base font-medium text-ink-900 dark:text-sandstone-100 leading-relaxed mb-4">
          {proj.summary}
        </p>

        <details className="group mb-5 rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50/80 dark:bg-ink-950/60 px-3.5 py-2.5 print:hidden">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-ink-700 dark:text-ink-300 hover:text-teal-700 dark:hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded">
            Case Study Details (Problem, Approach &amp; Outcome)
          </summary>
          <dl className="space-y-2.5 text-sm md:text-[15px] mt-3 pt-2.5 border-t border-sandstone-200 dark:border-skyline-800">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold-600 dark:text-gold-300">
                Problem:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">{proj.problem}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gold-600 dark:text-gold-300">
                Role &amp; Approach:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">
                {proj.roleApproach}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
                Verified Outcome:
              </dt>
              <dd className="text-ink-700 dark:text-ink-300 leading-relaxed">
                {proj.verifiedOutcome}
              </dd>
            </div>
          </dl>
        </details>

        <div className="flex flex-wrap gap-1.5 mb-5 print:hidden">
          {proj.tags.map((tag) => (
            <span
              key={tag}
              className="bg-sandstone-100 dark:bg-skyline-800 text-ink-900 dark:text-sandstone-100 border border-sandstone-200 dark:border-skyline-700 text-xs px-2.5 py-1 rounded font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-sandstone-200 dark:border-skyline-800 flex items-center gap-4 text-sm font-semibold">
        <a
          href={proj.ctaHref}
          target={proj.isExternal ? '_blank' : undefined}
          rel={proj.isExternal ? 'noopener' : undefined}
          className="text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded"
        >
          {proj.isExternal && <GitHubIcon className="w-4 h-4 fill-current" />}
          <span>{proj.ctaLabel} &rarr;</span>
        </a>
      </div>
    </Card>
  );
}

export function HomePage() {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [emailCopyStatus, setEmailCopyStatus] = useState<string>('');

  const filteredProjects = PROJECTS.filter(
    (p) => projectFilter === 'all' || p.filterGroup === projectFilter,
  );
  const flagshipProjects = filteredProjects.filter((p) => p.isFlagship);
  const sampleProjects = filteredProjects.filter((p) => !p.isFlagship);

  function handleCopyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(BASICS.email)
        .then(() => {
          setEmailCopyStatus('Email copied to clipboard.');
          window.setTimeout(() => setEmailCopyStatus(''), 2500);
        })
        .catch(() => {
          setEmailCopyStatus('Copy blocked — select address to copy.');
        });
    } else {
      setEmailCopyStatus(`Select ${BASICS.email} to copy.`);
    }
  }

  return (
    <ThemeShell>
      <div className="min-h-screen bg-alabaster text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="home" maxWidthClass="max-w-4xl" />

        <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-4 py-12 focus:outline-none">
          {/* Hero / About Section */}
          <section id="about" className="relative mb-20" aria-labelledby="about-heading">
            <HeroTopoBackdrop />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700 dark:bg-gold-700/30 dark:text-gold-300 border border-gold-300 dark:border-gold-600/50 mb-4 tracking-[0.06em]">
                  <svg className="w-2.5 h-2.5 text-gold-600 dark:text-gold-300 shrink-0" viewBox="0 0 12 10" fill="currentColor" aria-hidden="true">
                    <polygon points="6,0 12,10 0,10" />
                  </svg>
                  <span>{BASICS.eyebrow}</span>
                </div>

                <h1
                  id="about-heading"
                  className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 text-ink-900 dark:text-sandstone-50"
                >
                  {BASICS.name}
                </h1>

                <p className="text-lg md:text-xl text-ink-900 dark:text-sandstone-50 font-semibold mb-4 border-l-4 border-gold-500 pl-3.5">
                  {BASICS.headline}
                </p>

                <div className="text-sm text-ink-600 dark:text-ink-300 mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span>{BASICS.location}</span>
                  <span aria-hidden="true">&middot;</span>
                  <a
                    href={`mailto:${BASICS.email}`}
                    className="text-teal-700 dark:text-teal-300 hover:underline font-medium"
                  >
                    {BASICS.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2.5 py-0.5 rounded border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800 text-xs font-semibold text-ink-700 dark:text-sandstone-100 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 transition-colors print:hidden"
                  >
                    Copy email
                  </button>
                  <span className="text-xs font-medium text-teal-700 dark:text-teal-300" aria-live="polite">
                    {emailCopyStatus}
                  </span>
                </div>

                <p className="text-base md:text-lg text-ink-700 dark:text-sandstone-100 leading-relaxed max-w-2xl">
                  {BASICS.summary}
                </p>
              </div>

              <div className="md:col-span-4 flex justify-start md:justify-end print:hidden">
                <figure className="angle-frame max-w-[240px] sm:max-w-[260px] w-full">
                  <div className="relative z-10 rounded-xl overflow-hidden border-2 border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800 shadow-md">
                    <img
                      src="assets/mars-cruz-portrait.webp"
                      alt={`Portrait of ${BASICS.name}, wearing glasses and a dark patterned button-up shirt in an office setting`}
                      width={560}
                      height={608}
                      fetchPriority="high"
                      className="w-full h-auto object-cover block"
                    />
                    <figcaption className="px-3 py-2 bg-white dark:bg-skyline-900 border-t border-sandstone-200 dark:border-skyline-700 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-ink-900 dark:text-sandstone-50">
                        {BASICS.name}
                      </span>
                      <span aria-hidden="true" className="text-sandstone-200 dark:text-skyline-700">·</span>
                      <span className="text-xs font-mono text-gold-600 dark:text-gold-300">
                        Denver, CO
                      </span>
                    </figcaption>
                  </div>
                </figure>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 print:hidden">
              {HERO_PILLARS.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="p-4 rounded-xl border border-sandstone-200 dark:border-skyline-700 border-t-2 border-t-gold-500 bg-white dark:bg-skyline-800/50 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600 dark:text-gold-300 mb-1.5">
                    {pillar.title}
                  </p>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 print:hidden">
              <Button
                label="Interactive Curriculum Lab →"
                variant="primary"
                size="lg"
                href="education.html"
              />
              <Button
                label="Explore Projects & Demos"
                variant="secondary"
                size="lg"
                href="#projects"
              />
              <Button
                label="View Resume (PDF)"
                variant="secondary"
                size="lg"
                href={BASICS.resumePdf}
                target="_blank"
                rel="noopener"
              />
              <Button
                label="Print / Save as PDF"
                variant="secondary"
                size="lg"
                onClick={() => window.print()}
              />
              <Button
                label="GitHub"
                variant="ghost"
                size="lg"
                href={BASICS.githubUrl}
                target="_blank"
                rel="noopener"
                icon={<GitHubIcon className="w-4 h-4 fill-current" />}
              />
            </div>
          </section>

          {/* Featured Projects & Case Studies Section */}
          <section id="projects" className="mb-20" aria-labelledby="projects-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="projects-heading" title="Featured Projects & Case Studies" />
              <p className="text-base text-ink-600 dark:text-ink-300 mt-1.5 leading-relaxed">
                Prevention curriculum engineering, compliance analytics, plain-language policy translation, and local-first AI work samples.
              </p>
            </div>

            {/* Featured Interactive Curriculum Lab Banner */}
            <Card className="mb-10 border-2 border-gold-500/80 dark:border-gold-500/60 rounded-2xl p-6 md:p-8 bg-white dark:bg-skyline-800/50 shadow-sm print:hidden">
              <div className="angle-divider mb-5 rounded-full" aria-hidden="true" />
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Badge
                  variant="yellow"
                  label="Interactive Showcase · Prevention Pedagogy & Evaluation"
                />
                <span className="text-xs font-mono font-medium text-ink-600 dark:text-ink-300">
                  5 Initiatives &bull; Slides, Tabletop Activities &amp; Pre/Post Instruments
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-2">
                Educational Initiatives &amp; Interactive Curriculum Lab
              </h3>
              <p className="text-ink-700 dark:text-ink-300 text-base mb-6 leading-relaxed max-w-3xl">
                Explore the curriculum engineering portfolio across student services, academic medicine, graduate public health, and AI literacy. Inspect annotated slide decks, filter Bloom&rsquo;s Taxonomy objectives paired with CDC 6-step pre/post evaluations, and test interactive bystander simulators.
              </p>

              {/* 3-Up Artifact Visual Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {LAB_PREVIEW_STRIP.map((item) => (
                  <a
                    key={item.src}
                    href={item.href}
                    className="fr-card-hover group rounded-xl border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950 overflow-hidden hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                  >
                    <div className="h-32 bg-white dark:bg-skyline-900 border-b border-sandstone-200 dark:border-skyline-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className={
                          item.isSvg
                            ? 'w-full h-full object-contain p-2 bg-sandstone-50'
                            : 'w-full h-full object-cover'
                        }
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold-600 dark:text-gold-300">
                        {item.title}
                      </p>
                      <p className="text-xs font-semibold text-ink-900 dark:text-sandstone-50 mt-0.5 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                        {item.caption} &rarr;
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  label="Explore Interactive Slide Decks →"
                  variant="primary"
                  size="md"
                  href="education.html#slide-decks"
                />
                <Button
                  label="Launch Tabletop Activity Simulator"
                  variant="secondary"
                  size="md"
                  href="education.html#activity-lab"
                />
                <Button
                  label="View Learning Objectives & Pre/Post Matrix"
                  variant="secondary"
                  size="md"
                  href="education.html#learning-objectives"
                />
              </div>
            </Card>

            {/* Category Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by focus area">
                {PROJECT_FILTERS.map((tab) => {
                  const active = projectFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setProjectFilter(tab.key)}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 ${
                        active
                          ? 'bg-skyline-700 text-white dark:bg-teal-300 dark:text-ink-950 border border-skyline-700 dark:border-teal-300 border-b-2 border-b-gold-500'
                          : 'bg-white dark:bg-skyline-800/50 text-ink-700 dark:text-ink-300 border border-sandstone-200 dark:border-skyline-700 hover:border-gold-500'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono text-ink-600 dark:text-ink-300" aria-live="polite">
                Showing {filteredProjects.length} of {PROJECTS.length}
              </span>
            </div>

            {/* Tier 1: Flagship Evidence & Policy Initiatives */}
            {flagshipProjects.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-600 dark:text-gold-300 mb-3">
                  Featured Public Health, Policy &amp; Curriculum Work
                </p>
                <div className="grid grid-cols-1 gap-5">
                  {flagshipProjects.map((proj) => (
                    <ProjectCard key={proj.id} proj={proj} />
                  ))}
                </div>
              </div>
            )}

            {/* Tier 2: Compact Applied Local-First Work Samples */}
            {sampleProjects.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-600 dark:text-ink-300 mb-3">
                  Applied Local-First AI &amp; Field Tooling Work Samples
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sampleProjects.map((proj) => (
                    <ProjectCard key={proj.id} proj={proj} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Work Experience Section */}
          <section id="experience" className="mb-20" aria-labelledby="experience-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="experience-heading" title="Work Experience" />
            </div>

            <div className="space-y-12">
              {EXPERIENCES.map((role) => (
                <div
                  key={`${role.title}-${role.period}`}
                  className="border-l-2 border-gold-300 dark:border-gold-600/60 pl-6 relative"
                >
                  <div
                    className="absolute -left-[9px] top-0 w-4 h-4 bg-gold-500 rounded-full border-4 border-alabaster dark:border-ink-950"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50">
                      {role.title}
                    </h3>
                    <span
                      className={
                        role.isCurrent
                          ? 'text-xs font-semibold px-2.5 py-0.5 rounded bg-gold-100 text-gold-700 border border-gold-300 dark:bg-gold-700/30 dark:text-gold-300 dark:border-gold-600/50'
                          : 'text-xs font-semibold px-2.5 py-0.5 rounded bg-sandstone-100 dark:bg-skyline-800 text-ink-700 dark:text-ink-300'
                      }
                    >
                      {role.period}
                    </span>
                  </div>
                  <p className="text-sm text-ink-600 dark:text-ink-300 mb-4 font-medium">
                    {experienceMeta(role)}
                  </p>
                  <ul className="list-disc list-outside ml-4 text-ink-700 dark:text-ink-300 space-y-2.5 text-base leading-relaxed">
                    {role.bullets.map((b, idx) => (
                      <li key={idx}>
                        {b.before}
                        {b.strong && <strong>{b.strong}</strong>}
                        {b.after}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="mb-20" aria-labelledby="skills-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="skills-heading" title="Technical & Domain Expertise" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKILL_GROUPS.map((group) => (
                <Card
                  key={group.title}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-white dark:bg-skyline-800/40 shadow-sm"
                >
                  <h3 className="font-bold text-ink-900 dark:text-sandstone-50 text-base mb-3 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${group.dotClass}`} aria-hidden="true" />
                    <span>{group.title}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-sandstone-50 dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700 text-ink-900 dark:text-sandstone-100 px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Education & Credentials Section */}
          <section id="education" className="mb-20" aria-labelledby="education-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="education-heading" title="Education & Credentials" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EDUCATIONS.map((edu) => (
                <Card
                  key={edu.degree}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-6 bg-white dark:bg-skyline-800/40 shadow-sm"
                >
                  <div className="mb-2.5">
                    <Badge variant={edu.badgeVariant} label={edu.badge} />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 mb-1">
                    {edu.degree}
                  </h3>
                  <p
                    className={`text-sm mb-1 ${
                      edu.fieldHighlight
                        ? 'font-semibold text-gold-600 dark:text-gold-300'
                        : 'font-medium text-ink-700 dark:text-ink-300'
                    }`}
                  >
                    {edu.field}
                  </p>
                  <p className="text-xs text-ink-600 dark:text-ink-300">{edu.institution}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Section (Balanced 2x2 Grid) */}
          <section id="contact" className="mb-16" aria-labelledby="contact-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="contact-heading" title="Get in Touch" />
            </div>

            <p className="text-base text-ink-700 dark:text-ink-300 mb-8 leading-relaxed max-w-2xl">
              I am open to conversations about prevention education, training design, program implementation, and evaluation. Portfolio projects above are work samples, not a claim of software-engineering tenure. Connect via any of the channels below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-white dark:bg-skyline-800/40 flex items-center justify-between gap-3 hover:border-gold-500 dark:hover:border-gold-300">
                <a
                  href={`mailto:${BASICS.email}`}
                  className="flex items-center gap-3 min-w-0 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded"
                >
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-teal-100 dark:bg-skyline-700 flex items-center justify-center text-teal-700 dark:text-teal-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-600 dark:text-ink-300">Direct Email</p>
                    <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 truncate hover:underline">
                      {BASICS.email}
                    </p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-sandstone-50 dark:bg-ink-950 text-xs font-semibold text-ink-900 dark:text-sandstone-50 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 transition-colors print:hidden"
                >
                  Copy
                </button>
              </div>

              <a
                href={BASICS.linkedinUrl}
                target="_blank"
                rel="noopener"
                className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-white dark:bg-skyline-800/40 flex items-center gap-3 hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-teal-100 dark:bg-skyline-700 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">LinkedIn Profile</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    {BASICS.linkedinHandle}
                  </p>
                </div>
              </a>

              <a
                href={BASICS.githubUrl}
                target="_blank"
                rel="noopener"
                className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-white dark:bg-skyline-800/40 flex items-center gap-3 hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-sandstone-100 dark:bg-skyline-700 flex items-center justify-center text-ink-900 dark:text-sandstone-50">
                  <GitHubIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">GitHub</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    {BASICS.githubHandle}
                  </p>
                </div>
              </a>

              <a
                href={BASICS.resumePdf}
                target="_blank"
                rel="noopener"
                className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-white dark:bg-skyline-800/40 flex items-center gap-3 hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 print:hidden"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-gold-100 dark:bg-gold-700/30 flex items-center justify-center text-gold-700 dark:text-gold-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">Print Résumé</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    Download PDF (MPH, CHES)
                  </p>
                </div>
              </a>

              <button
                type="button"
                onClick={downloadResumeJson}
                className="fr-card-hover border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-white dark:bg-skyline-800/40 flex items-center gap-3 text-left hover:border-gold-500 dark:hover:border-gold-300 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 print:hidden"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-teal-100 dark:bg-skyline-700 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">Machine-Readable Résumé</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    Download JSON (JSON Resume)
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* Subordinated Machine-Readable Disclosure Band */}
          <section id="ai" className="mb-8 print:hidden" aria-labelledby="ai-heading">
            <details className="rounded-xl border border-sandstone-200 dark:border-skyline-800 bg-white dark:bg-skyline-800/30 p-5">
              <summary className="cursor-pointer flex flex-wrap items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded">
                <div className="flex items-center gap-3">
                  <span className="angle-slash" aria-hidden="true" />
                  <h2
                    id="ai-heading"
                    className="font-display text-xl font-bold uppercase tracking-wide text-ink-900 dark:text-sandstone-50"
                  >
                    For AI Agents &amp; Machines
                  </h2>
                </div>
                <span className="text-xs font-mono text-ink-600 dark:text-ink-300">
                  llms.txt &middot; llms-full.txt &middot; facts.json &middot; AGENTS.md
                </span>
              </summary>

              <div className="mt-4 pt-4 border-t border-sandstone-200 dark:border-skyline-800">
                <p className="text-sm text-ink-700 dark:text-ink-300 mb-5 leading-relaxed max-w-2xl">
                  This page is meant to be read by assistants as well as people. Rather than parsing the markup, use the canonical files below: one holds the page as Markdown, one explains how to use it, and one lists privacy and evidence rules any summary of Mars should respect.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AI_FILES.map((item) => (
                    <a
                      key={item.filename}
                      href={item.filename}
                      className="border border-sandstone-200 dark:border-skyline-700 rounded-xl p-4 bg-sandstone-50/70 dark:bg-ink-950/60 hover:border-gold-500 dark:hover:border-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                    >
                      <p className="text-xs text-ink-600 dark:text-ink-300 mb-1">{item.eyebrow}</p>
                      <p className="text-sm font-semibold font-mono text-ink-900 dark:text-sandstone-50 mb-1">
                        {item.filename}
                      </p>
                      <p className="text-xs text-ink-700 dark:text-ink-300">{item.description}</p>
                    </a>
                  ))}
                </div>

                <p className="text-xs text-ink-600 dark:text-ink-300 mt-4">
                  Generated artifacts are not career evidence. Cite this site, the{' '}
                  <a href={BASICS.resumePdf} className="text-teal-700 dark:text-teal-300 hover:underline font-medium">
                    PDF r&eacute;sum&eacute;
                  </a>
                  , or the repositories.
                </p>
              </div>
            </details>
          </section>
        </main>

        <SiteFooter variant="home" />

        {/* JSON Resume mirror of the page data, for tools and assistants that prefer structured input. */}
        <script
          type="application/json"
          id="resume-json"
          dangerouslySetInnerHTML={{ __html: serializeResumeJson() }}
        />
      </div>
    </ThemeShell>
  );
}
