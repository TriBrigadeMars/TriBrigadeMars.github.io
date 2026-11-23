import React from 'react';

interface SiteFooterProps {
  variant: 'home' | 'education' | 'notFound';
}

export function SiteFooter({ variant }: SiteFooterProps) {
  return (
    <footer className="border-t border-sandstone-200 dark:border-skyline-800 py-8 text-center text-sm text-ink-600 dark:text-ink-300">
      <p>
        &copy; 2026 Mars Cruz, MPH, CHES. Built with React, Meta Astryx, and Tailwind CSS on GitHub Pages.
      </p>
      <p className="mt-2 text-xs space-x-2">
        {variant === 'home' ? (
          <a href="#ai" className="hover:text-teal-700 dark:hover:text-teal-300 hover:underline">
            For AI agents
          </a>
        ) : (
          <a href="/" className="hover:text-teal-700 dark:hover:text-teal-300 hover:underline">
            Main Portfolio
          </a>
        )}
        <span aria-hidden="true">&middot;</span>
        <a href="/llms.txt" className="font-mono hover:text-teal-700 dark:hover:text-teal-300 hover:underline">
          llms.txt
        </a>
        <span aria-hidden="true">&middot;</span>
        <a href="/education.html" className="hover:text-teal-700 dark:hover:text-teal-300 hover:underline">
          Curriculum Lab
        </a>
      </p>
    </footer>
  );
}
