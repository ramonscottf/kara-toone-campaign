import { Platform } from 'react-native';

export const fonts = {
  display: 'LeagueSpartan-Bold',
  displayMedium: 'LeagueSpartan-SemiBold',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
  bodyBold: 'DMSans-Bold',
  accent: 'BebasNeue-Regular',
  // For the NY Times editorial feel on login, use system serif
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 42,
  '5xl': 52,
} as const;

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export type FontFamily = keyof typeof fonts;
export type FontSize = keyof typeof fontSizes;
