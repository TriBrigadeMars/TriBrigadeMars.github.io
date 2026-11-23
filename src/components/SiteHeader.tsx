import React, { useEffect, useRef, useState } from 'react';
import { Badge } from './ui';
import { useColorMode } from './ThemeShell';

export interface NavLink {
  label: string;
  href: string;
  isPrimary?: boolean;
}

interface SiteHeaderProps {
  variant: 'home' | 'education' | 'notFound';
  maxWidthClass?: 'max-w-4xl' | 'max-w-5xl';
}

const HOME_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Educational Initiatives', href: 'education.html', isPrimary: true },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const EDUCATION_LINKS: NavLink[] = [
  { label: 'Slide Decks', href: '#slide-decks' },
  { label: 'Learning Objectives', href: '#learning-objectives' },
  { label: 'Activity Simulator', href: '#activity-lab' },
  { label: 'Visual Models & QA', href: '#visual-frameworks' },
];

const NOT_FOUND_LINKS: NavLink[] = [
  { label: 'Main Portfolio', href: '/' },
  { label: 'Curriculum Lab', href: '/education.html', isPrimary: true },
  { label: 'llms.txt', href: '/llms.txt' },
];

export function SiteHeader({
  variant,
  maxWidthClass = variant === 'education' ? 'max-w-5xl' : 'max-w-4xl',
}: SiteHeaderProps) {
  const { mode, toggleMode } = useColorMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    variant === 'home' ? 'about' : variant === 'education' ? 'slide-decks' : '',
  );
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks =
    variant === 'education'
      ? EDUCATION_LINKS
      : variant === 'notFound'
        ? NOT_FOUND_LINKS
        : HOME_LINKS;

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (variant === 'notFound' || typeof IntersectionObserver === 'undefined') return;
    const sectionIds = navLinks
      .filter((item) => item.href.startsWith('#'))
      .map((item) => item.href.slice(1));

    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -64% 0px', threshold: 0.01 },
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [variant, navLinks]);

  const badgeText = variant === 'education' ? 'Curriculum Lab' : 'MPH, CHES';
  const brandHref = variant === 'home' ? '#about' : variant === 'education' ? '#overview' : '/';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 fr-btn-primary px-3.5 py-2 z-50 rounded-lg shadow-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
      >
        Skip to main content
      </a>

      <nav
        className="border-b border-sandstone-200 dark:border-skyline-800 sticky top-0 bg-alabaster/95 dark:bg-ink-950/95 backdrop-blur z-40"
        aria-label="Primary"
      >
        <div className={`${maxWidthClass} mx-auto px-4 py-3.5 flex items-center justify-between gap-3`}>
          {/* Brand identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            {variant === 'education' && (
              <>
                <a
                  href="index.html"
                  className="hidden sm:inline-flex items-center text-xs lg:text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded px-1"
                >
                  &larr; Main Portfolio
                </a>
                <span className="hidden sm:inline text-sandstone-200 dark:text-skyline-700" aria-hidden="true">
                  |
                </span>
              </>
            )}
            <a
              href={brandHref}
              className="font-display text-xl sm:text-2xl font-bold tracking-wide text-ink-900 dark:text-sandstone-50 flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded"
            >
              <span>Mars Cruz</span>
              <Badge variant="yellow" label={badgeText} className="hidden sm:inline-flex whitespace-nowrap" />
            </a>
          </div>

          {/* Desktop single-row navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex items-center gap-x-3.5 lg:gap-x-4 text-xs lg:text-sm font-medium text-ink-700 dark:text-ink-300">
              {navLinks.map((item) => {
                const isActive = item.href.startsWith('#') && item.href.slice(1) === activeSectionId;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'location' : undefined}
                      className={
                        item.isPrimary
                          ? 'whitespace-nowrap text-teal-700 dark:text-teal-300 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded px-1 py-1'
                          : isActive
                            ? 'whitespace-nowrap text-ink-900 dark:text-sandstone-50 font-semibold border-b-2 border-gold-500 pb-1 px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded-t'
                            : 'whitespace-nowrap hover:text-teal-700 dark:hover:text-teal-300 border-b-2 border-transparent pb-1 px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 rounded-t'
                      }
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              id="theme-toggle"
              type="button"
              onClick={toggleMode}
              className="p-2 rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800/60 text-ink-700 dark:text-ink-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 transition-colors"
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Combo Navigation: High-priority destination + Theme Toggle + Labeled Menu button */}
          <div className="flex md:hidden items-center gap-2">
            {variant === 'home' && (
              <a
                href="education.html"
                className="fr-btn-primary px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] inline-flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                Curriculum Lab
              </a>
            )}
            {variant === 'education' && (
              <a
                href="index.html"
                className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-sandstone-200 dark:border-skyline-700 text-teal-700 dark:text-teal-300 hover:bg-sandstone-100 dark:hover:bg-skyline-800 transition-colors min-h-[40px] inline-flex items-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              >
                &larr; Portfolio
              </a>
            )}
            {variant === 'notFound' && (
              <a
                href="/"
                className="fr-btn-primary px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] inline-flex items-center whitespace-nowrap"
              >
                Home
              </a>
            )}

            <button
              id="mobile-theme-toggle"
              type="button"
              onClick={toggleMode}
              className="p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800/60 text-ink-700 dark:text-ink-300 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {mode === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              ref={menuBtnRef}
              id="mobile-menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-sandstone-200 dark:border-skyline-700 bg-white dark:bg-skyline-800 text-ink-900 dark:text-sandstone-50 text-xs font-semibold hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Drawer with smooth grid-row transition */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={`fr-drawer md:hidden grid overflow-hidden border-sandstone-200 dark:border-skyline-800 bg-sandstone-50/95 dark:bg-ink-950/95 ${
            menuOpen
              ? 'grid-rows-[1fr] opacity-100 border-t'
              : 'grid-rows-[0fr] opacity-0 pointer-events-none border-t-0'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    tabIndex={menuOpen ? undefined : -1}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300 ${
                      item.isPrimary
                        ? 'font-semibold text-teal-700 dark:text-teal-300 bg-teal-100/50 dark:bg-skyline-800/70'
                        : 'font-medium text-ink-900 dark:text-sandstone-50 hover:bg-sandstone-100 dark:hover:bg-skyline-800/50'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {variant === 'education' && (
                <li>
                  <a
                    href="index.html"
                    tabIndex={menuOpen ? undefined : -1}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-semibold text-teal-700 dark:text-teal-300 hover:bg-sandstone-100 dark:hover:bg-skyline-800/50 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-300"
                  >
                    &larr; Main Portfolio
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
