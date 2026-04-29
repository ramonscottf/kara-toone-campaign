import { Platform, TextStyle } from 'react-native';

/**
 * iOS Dynamic Type scale using system fonts (SF Pro on iOS, Roboto on Android).
 * No custom fonts — aligns with iOS 26 design language.
 */

const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
})!;

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    lineHeight: 41,
  } as TextStyle,
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
    lineHeight: 34,
  } as TextStyle,
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    lineHeight: 28,
  } as TextStyle,
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    lineHeight: 25,
  } as TextStyle,
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    lineHeight: 22,
  } as TextStyle,
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    lineHeight: 21,
  } as TextStyle,
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    lineHeight: 20,
  } as TextStyle,
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    lineHeight: 18,
  } as TextStyle,
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
  } as TextStyle,
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.07,
    lineHeight: 13,
  } as TextStyle,
} as const;

// Backward-compat: old code references fonts.display etc. as family name strings
export const fonts = {
  display: systemFont,
  displaySemiBold: systemFont,
  body: systemFont,
  bodyMedium: systemFont,
  bodySemiBold: systemFont,
  bodyBold: systemFont,
  accent: systemFont,
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
};

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
