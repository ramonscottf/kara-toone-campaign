export const colors = {
  // Campaign brand
  navy: '#1B3A69',
  deep: '#152E54',
  red: '#ED2631',
  redBright: '#F03A44',
  gold: '#FFD833',
  cream: '#F7F3EE',
  white: '#FFFFFF',
  gray: '#8A9AB0',
  light: '#E8EFF7',

  // Semantic
  background: '#F7F3EE',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#152E54',
  textSecondary: '#8A9AB0',
  textInverse: '#FFFFFF',
  accent: '#ED2631',
  highlight: '#FFD833',
  border: '#E8EFF7',
  divider: '#E0E0E0',

  // Support levels (war room)
  supportStrong: '#2e7d32',
  supportLeaning: '#66BB6A',
  supportUndecided: '#FFC958',
  supportOpponent: '#EF6C00',
  supportStrongOpponent: '#C62828',
  supportNotContacted: '#9E9E9E',

  // Status
  success: '#2e7d32',
  warning: '#FFC958',
  error: '#C62828',
  info: '#1B3A69',
} as const;

export type ColorName = keyof typeof colors;
