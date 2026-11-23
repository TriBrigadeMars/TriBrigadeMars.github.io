import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { ThemeShell } from '../components/ThemeShell';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export function NotFoundPage() {
  return (
    <ThemeShell>
      <div className="min-h-screen flex flex-col bg-white text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="notFound" maxWidthClass="max-w-4xl" />

        <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-4 py-20 flex items-center justify-center">
          <Card className="w-full max-w-xl border border-sandstone-200 dark:border-skyline-800 bg-sandstone-50/80 dark:bg-skyline-800/30 p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="angle-slash" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-teal-700 dark:text-teal-300">
                404 &middot; Page Not Found
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-sandstone-50 mb-3">
              That page isn&rsquo;t on this portfolio.
            </h1>

            <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed mb-6">
              The link may have moved or been mistyped. Return to the main portfolio, explore the Interactive Curriculum Lab, or fetch the machine-readable site manual.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                label="Back to Main Portfolio"
                variant="primary"
                size="md"
                href="/"
                className="bg-skyline-700 hover:bg-skyline-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
              />
              <Button
                label="Interactive Curriculum Lab →"
                variant="secondary"
                size="md"
                href="/education.html"
              />
              <Button
                label="llms.txt"
                variant="ghost"
                size="md"
                href="/llms.txt"
              />
            </div>
          </Card>
        </main>

        <SiteFooter variant="notFound" />
      </div>
    </ThemeShell>
  );
}
