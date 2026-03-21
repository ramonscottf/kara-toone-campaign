/** iOS system color tokens + pillar color worlds + backward-compat campaign colors */

export const systemColors = {
  light: {
    background: '#F2F2F7',
    secondaryBackground: '#FFFFFF',
    tertiaryBackground: '#F2F2F7',
    groupedBackground: '#F2F2F7',
    secondaryGroupedBackground: '#FFFFFF',
    label: '#000000',
    secondaryLabel: 'rgba(60,60,67,0.6)',
    tertiaryLabel: 'rgba(60,60,67,0.3)',
    separator: 'rgba(60,60,67,0.29)',
    opaqueSeparator: '#C6C6C8',
    fill: 'rgba(120,120,128,0.2)',
    secondaryFill: 'rgba(120,120,128,0.16)',
    systemBlue: '#007AFF',
    systemRed: '#FF3B30',
    systemGreen: '#34C759',
    systemOrange: '#FF9500',
    systemYellow: '#FFCC00',
    systemPurple: '#AF52DE',
    systemTeal: '#5AC8FA',
  },
  dark: {
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    tertiaryBackground: '#2C2C2E',
    groupedBackground: '#000000',
    secondaryGroupedBackground: '#1C1C1E',
    label: '#FFFFFF',
    secondaryLabel: 'rgba(235,235,245,0.6)',
    tertiaryLabel: 'rgba(235,235,245,0.3)',
    separator: 'rgba(84,84,88,0.65)',
    opaqueSeparator: '#38383A',
    fill: 'rgba(120,120,128,0.36)',
    secondaryFill: 'rgba(120,120,128,0.32)',
    systemBlue: '#0A84FF',
    systemRed: '#FF453A',
    systemGreen: '#30D158',
    systemOrange: '#FF9F0A',
    systemYellow: '#FFD60A',
    systemPurple: '#BF5AF2',
    systemTeal: '#64D2FF',
  },
} as const;

export const pillarColors = {
  growth: { primary: '#0EA5E9', gradientStart: '#0EA5E9', gradientEnd: '#0369A1', light: '#E0F2FE' },
  housing: { primary: '#F97316', gradientStart: '#F97316', gradientEnd: '#C2410C', light: '#FFF7ED' },
  safety: { primary: '#EF4444', gradientStart: '#EF4444', gradientEnd: '#B91C1C', light: '#FEF2F2' },
  education: { primary: '#10B981', gradientStart: '#10B981', gradientEnd: '#047857', light: '#ECFDF5' },
  fiscal: { primary: '#8B5CF6', gradientStart: '#8B5CF6', gradientEnd: '#6D28D9', light: '#F5F3FF' },
} as const;

// Backward-compatible campaign colors (used by War Room / Connect)
export const colors = {
  navy: '#1B3A69',
  deep: '#152E54',
  red: '#ED2631',
  redBright: '#F03A44',
  gold: '#FFD833',
  cream: '#F7F3EE',
  white: '#FFFFFF',
  gray: '#8A9AB0',
  light: '#E8EFF7',

  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#000000',
  textSecondary: 'rgba(60,60,67,0.6)',
  textInverse: '#FFFFFF',
  accent: '#0EA5E9',
  highlight: '#FFD833',
  border: 'rgba(60,60,67,0.29)',
  divider: 'rgba(60,60,67,0.29)',

  // Support levels (war room) — unchanged
  supportStrong: '#2e7d32',
  supportLeaning: '#66BB6A',
  supportUndecided: '#FFC958',
  supportOpponent: '#EF6C00',
  supportStrongOpponent: '#C62828',
  supportNotContacted: '#9E9E9E',

  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
} as const;

export type ColorName = keyof typeof colors;
