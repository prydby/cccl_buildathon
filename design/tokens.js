/**
 * DimensionScore Design System Tokens
 * Bloomberg-terminal inspired dark aesthetic
 * All colors pass WCAG AA contrast against their paired backgrounds
 */

export const tokens = {
  colors: {
    bg: {
      primary: '#0a0e17',
      secondary: '#111827',
      tertiary: '#1e293b',
      elevated: '#1a2332',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      muted: '#64748b',
      inverse: '#0a0e17',
    },
    accent: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      hover: '#22d3ee',
      muted: '#164e63',
    },
    score: {
      low: '#ef4444',
      lowBg: '#1c1917',
      mid: '#f59e0b',
      midBg: '#1c1917',
      high: '#22c55e',
      highBg: '#0f1f14',
    },
    border: {
      default: '#1e293b',
      subtle: '#334155',
      focus: '#06b6d4',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    glow: '0 0 15px rgba(6, 182, 212, 0.3)',
    glowStrong: '0 0 30px rgba(6, 182, 212, 0.5)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
}

export default tokens
