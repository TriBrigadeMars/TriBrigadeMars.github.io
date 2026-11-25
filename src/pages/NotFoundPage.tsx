import React from 'react';
import { Button, Card } from '../components/ui';
import { ThemeShell } from '../components/ThemeShell';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export function NotFoundPage() {
  return (
    <ThemeShell>
      <div className="min-h-screen flex flex-col bg-alabaster text-ink-900 dark:bg-ink-950 dark:text-sandstone-50 transition-colors duration-200">
        <SiteHeader variant="notFound" maxWidthClass="max-w-4xl" />

        <main id="main-content" tabIndex={-1} className="flex-1 max-w-4xl mx-auto w-full px-4 py-20 flex items-center justify-center focus:outline-none">
          <Card className="w-full max-w-xl border border-sandstone-200 dark:border-skyline-800 border-t-4 border-t-gold-500 bg-white dark:bg-skyline-800/40 p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="angle-slash" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-[0.14em] font-semibold text-gold-600 dark:text-gold-300">
                404 &middot; Page Not Found
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-ink-900 dark:text-sandstone-50 mb-3">
              That page isn&rsquo;t on this portfolio.
            </h1>

            <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed mb-6">
              The link may have moved or been mistyped. Return to the main portfolio, explore the Interactive Curriculum Lab, or fetch the machine-readable site manual.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                label="Back to Main Portfolio"
                variant="primary"
                size="md"
                href="/"
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
