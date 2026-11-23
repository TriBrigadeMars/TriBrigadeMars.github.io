import React from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ThemeShell } from '../components/ThemeShell';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import {
  AI_FILES,
  EDUCATIONS,
  EXPERIENCES,
  HERO_PILLARS,
  PROJECTS,
  SKILL_GROUPS,
} from '../data/portfolio';

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
      <h2 id={id} className="text-2xl font-bold tracking-tight text-ink-900 dark:text-sandstone-50">
        {title}
      </h2>
    </div>
  );
}

export function HomePage() {
  return (
    <ThemeShell>
      <div className="min-h-screen bg-white text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="home" maxWidthClass="max-w-4xl" />

        <main id="main-content" className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero / About Section */}
          <section id="about" className="mb-20" aria-labelledby="about-heading">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700 dark:bg-gold-700/30 dark:text-gold-300 border border-gold-300 dark:border-gold-600/50 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" aria-hidden="true" />
              Public Health &amp; Applied Informatics
            </div>

            <h1
              id="about-heading"
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-ink-900 dark:text-sandstone-50"
            >
              Mars Cruz, MPH, CHES
            </h1>

            <p className="text-xl text-teal-700 dark:text-teal-300 font-semibold mb-3">
              Public Health Educator &middot; Program Implementation &amp; Evaluation &middot; Community Partnerships
            </p>

            <p className="text-sm text-ink-600 dark:text-ink-300 mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Denver, CO (Remote &amp; Hybrid)</span>
              <span aria-hidden="true">&middot;</span>
              <a href="mailto:nalcs.mika@gmail.com" className="text-teal-700 dark:text-teal-300 hover:underline font-medium">
                nalcs.mika@gmail.com
              </a>
            </p>

            <p className="text-lg text-ink-700 dark:text-sandstone-100 leading-relaxed mb-6 max-w-3xl">
              Public health educator and program coordinator with 8+ years of experience translating regulatory compliance and prevention science into plain-language training and measurable operations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {HERO_PILLARS.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="p-4 border border-sandstone-200 dark:border-skyline-800 bg-sandstone-50/80 dark:bg-skyline-800/40"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-skyline-700 dark:text-gold-300 mb-1">
                    {pillar.title}
                  </p>
                  <p className="text-xs text-ink-700 dark:text-ink-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                label="Interactive Curriculum Lab →"
                variant="primary"
                size="lg"
                href="education.html"
                className="bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
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
                href="assets/resume.pdf"
                target="_blank"
                rel="noopener"
              />
              <Button
                label="GitHub"
                variant="ghost"
                size="lg"
                href="https://github.com/TriBrigadeMars"
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
              <p className="text-sm text-ink-600 dark:text-ink-300 mt-1.5">
                Prevention curriculum engineering, compliance analytics, plain-language policy translation, and local-first AI work samples.
              </p>
            </div>

            {/* Featured Interactive Curriculum Lab Banner */}
            <Card className="mb-8 border-2 border-gold-300 dark:border-gold-600/60 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-sandstone-50 via-white to-gold-100/70 dark:from-skyline-800/80 dark:via-ink-950 dark:to-skyline-700/40 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Badge
                  variant="teal"
                  label="Interactive Showcase · Prevention Pedagogy & Program Evaluation"
                />
                <span className="text-xs font-medium text-ink-600 dark:text-ink-300">
                  5 Initiatives &bull; Slides, Tabletop Activities &amp; Pre/Post Instruments
                </span>
              </div>
              <h3 className="text-2xl font-bold text-ink-900 dark:text-sandstone-50 mb-2">
                Educational Initiatives &amp; Interactive Curriculum Lab
              </h3>
              <p className="text-ink-700 dark:text-ink-300 text-sm md:text-base mb-5 leading-relaxed max-w-3xl">
                Explore the full curriculum engineering portfolio across higher-education student services, academic medicine, graduate public health, and public-interest AI literacy. Inspect approved slide decks with facilitator walkthroughs, filter Bloom&rsquo;s Taxonomy learning objectives paired with CDC 6-step pre/post evaluations, and test interactive tabletop bystander simulators (<em>Two Rooms, One Behavior</em> and <em>Close the Loop</em>).
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  label="Explore Interactive Slide Decks →"
                  variant="primary"
                  size="md"
                  href="education.html#slide-decks"
                  className="bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
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

            {/* 8 Case-Study Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((proj) => (
                <Card
                  key={proj.id}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-6 bg-sandstone-50/70 dark:bg-skyline-800/30 hover:border-teal-600 dark:hover:border-teal-300 transition shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant={proj.badgeVariant} label={proj.category} />
                      <span className="text-xs font-medium text-ink-600 dark:text-ink-300">
                        {proj.originLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 dark:text-sandstone-50 mb-3">
                      {proj.title}
                    </h3>

                    <dl className="space-y-2.5 text-xs mb-5">
                      <div>
                        <dt className="font-bold uppercase tracking-wider text-skyline-700 dark:text-gold-300 inline">
                          Problem:
                        </dt>{' '}
                        <dd className="text-ink-700 dark:text-ink-300 inline leading-relaxed">
                          {proj.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold uppercase tracking-wider text-skyline-700 dark:text-gold-300 inline">
                          Role / Approach:
                        </dt>{' '}
                        <dd className="text-ink-700 dark:text-ink-300 inline leading-relaxed">
                          {proj.roleApproach}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 inline">
                          Verified Outcome:
                        </dt>{' '}
                        <dd className="text-ink-700 dark:text-ink-300 inline leading-relaxed">
                          {proj.verifiedOutcome}
                        </dd>
                      </div>
                    </dl>

                    <div className="flex flex-wrap gap-1.5 mb-6">
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
              ))}
            </div>
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
                  className="border-l-2 border-sandstone-200 dark:border-skyline-700 pl-6 relative"
                >
                  <div
                    className="absolute -left-[9px] top-0 w-4 h-4 bg-gold-500 rounded-full border-4 border-white dark:border-ink-950"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl font-bold text-ink-900 dark:text-sandstone-50">
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
                    {role.meta}
                  </p>
                  <ul className="list-disc list-outside ml-4 text-ink-700 dark:text-ink-300 space-y-2 text-sm leading-relaxed">
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
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-5 bg-sandstone-50/70 dark:bg-skyline-800/30"
                >
                  <h3 className="font-bold text-ink-900 dark:text-sandstone-50 text-base mb-3 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${group.dotClass}`} aria-hidden="true" />
                    <span>{group.title}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white dark:bg-ink-950 border border-sandstone-200 dark:border-skyline-700 text-ink-900 dark:text-sandstone-100 px-3 py-1.5 rounded-lg text-xs font-medium"
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
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-6 bg-sandstone-50/70 dark:bg-skyline-800/30"
                >
                  <div className="mb-2">
                    <Badge variant={edu.badgeVariant} label={edu.badge} />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 dark:text-sandstone-50 mb-1">
                    {edu.degree}
                  </h3>
                  <p
                    className={`text-sm font-medium mb-1 ${
                      edu.fieldHighlight
                        ? 'text-teal-700 dark:text-teal-300'
                        : 'text-ink-700 dark:text-ink-300'
                    }`}
                  >
                    {edu.field}
                  </p>
                  <p className="text-xs text-ink-600 dark:text-ink-300">{edu.institution}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-20" aria-labelledby="contact-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="contact-heading" title="Get in Touch" />
            </div>

            <p className="text-ink-700 dark:text-ink-300 mb-8 leading-relaxed max-w-2xl">
              I am open to conversations about prevention education, training design, program implementation, and evaluation. Portfolio projects above are work samples, not a claim of software-engineering tenure. Feel free to connect via any of the channels below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:nalcs.mika@gmail.com"
                className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-sandstone-50/60 dark:bg-skyline-800/30 flex items-center gap-3 hover:border-teal-600 dark:hover:border-teal-300 transition group focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-skyline-700 flex items-center justify-center text-teal-700 dark:text-teal-300 group-hover:scale-105 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">Direct Email</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    nalcs.mika@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/mars-cruz-6099b930a/"
                target="_blank"
                rel="noopener"
                className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-sandstone-50/60 dark:bg-skyline-800/30 flex items-center gap-3 hover:border-teal-600 dark:hover:border-teal-300 transition group focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-skyline-700 flex items-center justify-center text-teal-700 dark:text-teal-300 group-hover:scale-105 transition">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">LinkedIn Profile</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    mars-cruz-6099b930a
                  </p>
                </div>
              </a>

              <a
                href="https://github.com/TriBrigadeMars"
                target="_blank"
                rel="noopener"
                className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-sandstone-50/60 dark:bg-skyline-800/30 flex items-center gap-3 hover:border-teal-600 dark:hover:border-teal-300 transition group focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                <div className="w-10 h-10 rounded-lg bg-sandstone-100 dark:bg-skyline-700 flex items-center justify-center text-ink-900 dark:text-sandstone-50 group-hover:scale-105 transition">
                  <GitHubIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-ink-600 dark:text-ink-300">GitHub</p>
                  <p className="text-sm font-semibold text-ink-900 dark:text-sandstone-50">
                    TriBrigadeMars
                  </p>
                </div>
              </a>
            </div>
          </section>

          {/* Machine-readable layer for assistants and agents */}
          <section id="ai" className="mb-20" aria-labelledby="ai-heading">
            <div className="border-b border-sandstone-200 dark:border-skyline-800 pb-3 mb-8">
              <SectionHeading id="ai-heading" title="For AI Agents & Machines" />
            </div>

            <p className="text-ink-700 dark:text-ink-300 mb-6 leading-relaxed max-w-2xl">
              This page is meant to be read by assistants as well as people. Rather than parsing the markup, take the canonical files: one holds the whole page as Markdown, one explains how to use it, and one lists the privacy and evidence rules any summary of Mars should respect.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AI_FILES.map((item) => (
                <a
                  key={item.filename}
                  href={item.filename}
                  className="border border-sandstone-200 dark:border-skyline-800 rounded-xl p-4 bg-sandstone-50/60 dark:bg-skyline-800/30 hover:border-teal-600 dark:hover:border-teal-300 transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
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
              <a href="assets/resume.pdf" className="text-teal-700 dark:text-teal-300 hover:underline font-medium">
                PDF r&eacute;sum&eacute;
              </a>
              , or the repositories.
            </p>
          </section>
        </main>

        <SiteFooter variant="home" />
      </div>
    </ThemeShell>
  );
}
