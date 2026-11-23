/**
 * Front Range Civic personal design tokens.
 *
 * Distinct personal palette with CU Denver kinship: warm Alabaster/Linen canvas,
 * Charcoal Ink prose, structural Burnished Ochre rules, and Front Range Teal actions.
 */
export const frontRangeTheme = {
  name: 'front-range-civic',
  typography: {
    display: {
      family: 'Barlow Condensed',
      fallbacks: '"Public Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    body: {
      family: 'Public Sans',
      fallbacks: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    code: {
      family: 'IBM Plex Mono',
      fallbacks: 'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
    },
  },
  tokens: {
    '--color-background-body': ['#FAF8F3', '#121E24'],
    '--color-background-surface': ['#FFFFFF', '#17313B'],
    '--color-background-card': ['#FAF8F3', '#17313B'],
    '--color-background-muted': ['#EFE9DC', '#121E24'],
    '--color-background-popover': ['#FFFFFF', '#17313B'],
    '--color-text-primary': ['#1B2428', '#FAF8F3'],
    '--color-text-secondary': ['#525C61', '#C4CED2'],
    '--color-accent': ['#1B5E63', '#6EC4C9'],
    '--color-accent-hover': ['#154D52', '#8FD4D8'],
    '--color-accent-muted': ['#D8ECEE', '#1F4350'],
    '--color-on-accent': ['#FFFFFF', '#121E24'],
    '--color-text-accent': ['#1B5E63', '#6EC4C9'],
    '--color-gold-accent': ['#C8A24A', '#DEC484'],
    '--color-gold-text': ['#7A5C18', '#DEC484'],
    '--color-gold-surface': ['#F5EEDB', '#342A14'],
    '--color-gold-border': ['#C8A24A', '#DEC484'],
    '--color-border': ['#DFD5C0', '#275260'],
    '--color-border-emphasized': ['#C8A24A', '#6EC4C9'],
    '--color-terracotta': ['#C4533A', '#E87451'],
  },
} as const;

export const cuDenverBrandTheme = frontRangeTheme;
export default frontRangeTheme;
