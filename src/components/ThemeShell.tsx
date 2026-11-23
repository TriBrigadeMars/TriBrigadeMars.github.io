import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ResolvedColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: ResolvedColorMode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeShell({ children }: { children: ReactNode }) {
  // Start with 'light' for SSR + hydration parity; the <head> anti-flash script
  // already sets class="dark" and data-theme on <html> before hydration.
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    const active: ResolvedColorMode = isDark ? 'dark' : 'light';
    setResolvedMode(active);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', active);
    document.documentElement.setAttribute('data-astryx-theme', 'front-range-civic');
  }, []);

  const toggleMode = () => {
    const next: ResolvedColorMode = resolvedMode === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.setAttribute('data-theme', next);
    setResolvedMode(next);
  };

  return (
    <ColorModeContext.Provider value={{ mode: resolvedMode, toggleMode }}>
      <div data-astryx-theme="front-range-civic">{children}</div>
    </ColorModeContext.Provider>
  );
}
