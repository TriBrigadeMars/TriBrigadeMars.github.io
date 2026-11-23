import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

export const cuDenverBrandTheme = defineTheme({
  name: 'cu-denver-brand',
  extends: neutralTheme,
  typography: {
    body: {
      family: 'Public Sans',
      fallbacks:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    heading: {
      family: 'Public Sans',
      fallbacks:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    code: {
      family: 'ui-monospace',
      fallbacks:
        '"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  tokens: {
    '--color-accent': ['#244C5A', '#6FC3CB'],
    '--color-accent-muted': ['#DCE7EB', '#244C5A'],
    '--color-on-accent': ['#FFFFFF', '#14262E'],
    '--color-text-accent': ['#15545B', '#6FC3CB'],
    '--color-icon-accent': ['#15545B', '#6FC3CB'],
    '--color-background-body': ['#FFFFFF', '#14262E'],
    '--color-background-surface': ['#FBF8F1', '#1D3843'],
    '--color-background-card': ['#FBF8F1', '#1D3843'],
    '--color-background-muted': ['#F1EAD8', '#14262E'],
    '--color-background-popover': ['#FFFFFF', '#1D3843'],
    '--color-text-primary': ['#1F1F1F', '#FBF8F1'],
    '--color-text-secondary': ['#565A5C', '#CBD1D3'],
    '--color-border': ['#E3D9C2', '#2E5D6E'],
    '--color-border-emphasized': ['#DBC99E', '#6FC3CB'],
    '--color-background-teal': ['#D9EEF0', '#1D3843'],
    '--color-border-teal': ['#1B6B73', '#6FC3CB'],
    '--color-text-teal': ['#15545B', '#D9EEF0'],
    '--color-background-yellow': ['#F4EDDC', '#3E3317'],
    '--color-border-yellow': ['#8D7334', '#CFB87C'],
    '--color-text-yellow': ['#75602B', '#F4EDDC'],
  },
  components: {
    card: {
      base: {
        borderRadius: '0.75rem',
      },
      'variant:default': {
        borderColor: 'var(--color-border)',
      },
    },
    button: {
      base: {
        fontWeight: '600',
      },
      'variant:primary': {
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-on-accent)',
      },
    },
  },
});

export default cuDenverBrandTheme;
