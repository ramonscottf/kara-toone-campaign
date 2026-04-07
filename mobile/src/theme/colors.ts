/** 
 * Color tokens matched to kara.wickowaypoint.com campaign aesthetic.
 * Gold accent (#C9A84C), dark-mode-first, iOS system color foundations.
 */

export const systemColors = {
  light: {
    background: '#F8F8F6',
    secondaryBackground: '#FFFFFF',
    tertiaryBackground: '#F2F2F0',
    groupedBackground: '#F8F8F6',
    secondaryGroupedBackground: '#FFFFFF',
    label: '#1A1A1A',
    secondaryLabel: '#71717A',
    tertiaryLabel: 'rgba(60,60,67,0.3)',
    separator: '#E4E4E7',
    opaqueSeparator: '#D4D4D8',
    fill: 'rgba(120,120,128,0.2)',
    secondaryFill: 'rgba(120,120,128,0.16)',
    systemBlue: '#2563EB',
    systemRed: '#DC2626',
    systemGreen: '#16A34A',
    systemOrange: '#EA580C',
    systemYellow: '#B8962E',
    systemPurple: '#7C3AED',
    systemTeal: '#0891B2',
  },
  dark: {
    background: '#09090B',
    secondaryBackground: '#111113',
    tertiaryBackground: '#18181B',
    groupedBackground: '#09090B',
    secondaryGroupedBackground: '#111113',
    label: '#E4E4E7',
    secondaryLabel: '#71717A',
    tertiaryLabel: 'rgba(235,235,245,0.3)',
    separator: '#1E1E21',
    opaqueSeparator: '#27272A',
    fill: 'rgba(120,120,128,0.36)',
    secondaryFill: 'rgba(120,120,128,0.32)',
    systemBlue: '#3B82F6',
    systemRed: '#EF4444',
    systemGreen: '#22C55E',
    systemOrange: '#F97316',
    systemYellow: '#C9A84C',
    systemPurple: '#8B5CF6',
    systemTeal: '#06B6D4',
  },
} as const;

export const pillarColors = {
  growth: { primary: '#2563EB', gradientStart: '#1E40AF', gradientEnd: '#3B82F6', light: '#DBEAFE' },
  housing: { primary: '#C2410C', gradientStart: '#9A3412', gradientEnd: '#EA580C', light: '#FFF7ED' },
  safety: { primary: '#DC2626', gradientStart: '#991B1B', gradientEnd: '#EF4444', light: '#FEF2F2' },
  education: { primary: '#059669', gradientStart: '#065F46', gradientEnd: '#10B981', light: '#ECFDF5' },
  fiscal: { primary: '#7C3AED', gradientStart: '#5B21B6', gradientEnd: '#8B5CF6', light: '#F5F3FF' },
} as const;

// Campaign colors — gold-accent system matching website
export const colors = {
  navy: '#0F2238',
  deep: '#1A0D2E',
  red: '#DC2626',
  redBright: '#EF4444',
  gold: '#C9A84C',
  goldLight: '#B8962E',
  cream: '#F8F8F6',
  white: '#FFFFFF',
  gray: '#71717A',
  light: '#E4E4E7',

  background: '#F8F8F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#71717A',
  textInverse: '#FFFFFF',
  accent: '#C9A84C',
  highlight: '#C9A84C',
  border: '#E4E4E7',
  divider: '#E4E4E7',

  // Support levels (war room)
  supportStrong: '#16A34A',
  supportLeaning: '#22C55E',
  supportUndecided: '#C9A84C',
  supportOpponent: '#EA580C',
  supportStrongOpponent: '#DC2626',
  supportNotContacted: '#71717A',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export type ColorName = keyof typeof colors;
