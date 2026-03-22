import { Platform, TextStyle } from 'react-native';

/**
 * Typography matching kara.wickowaypoint.com:
 * - League Spartan: headlines/display (weight 900, 700)
 * - DM Sans: body/UI text (weight 300, 400, 500, 600)
 * - Bebas Neue: stats/accent numbers
 */

export const fontFamilies = {
  display: 'LeagueSpartan_900Black',
  displayBold: 'LeagueSpartan_700Bold',
  body: 'DMSans_400Regular',
  bodyLight: 'DMSans_300Light',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  accent: 'BebasNeue_400Regular',
  // Fallbacks for before fonts load
  system: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' })!,
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
};

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '900',
    fontFamily: fontFamilies.display,
    letterSpacing: 0.5,
    lineHeight: 41,
  } as TextStyle,
  title1: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fontFamilies.displayBold,
    letterSpacing: 0.36,
    lineHeight: 34,
  } as TextStyle,
  title2: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: fontFamilies.displayBold,
    letterSpacing: 0.35,
    lineHeight: 28,
  } as TextStyle,
  title3: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 0.38,
    lineHeight: 25,
  } as TextStyle,
  headline: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: -0.41,
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: -0.41,
    lineHeight: 22,
  } as TextStyle,
  bodyLight: {
    fontSize: 17,
    fontWeight: '300',
    fontFamily: fontFamilies.bodyLight,
    letterSpacing: -0.41,
    lineHeight: 26,
  } as TextStyle,
  callout: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: -0.32,
    lineHeight: 21,
  } as TextStyle,
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: -0.24,
    lineHeight: 20,
  } as TextStyle,
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: -0.08,
    lineHeight: 18,
  } as TextStyle,
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: 0,
    lineHeight: 16,
  } as TextStyle,
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: fontFamilies.body,
    letterSpacing: 0.07,
    lineHeight: 13,
  } as TextStyle,
  // Accent style for big stats/numbers (Bebas Neue)
  stat: {
    fontSize: 48,
    fontWeight: '400',
    fontFamily: fontFamilies.accent,
    letterSpacing: 1,
    lineHeight: 52,
  } as TextStyle,
  // Eyebrow labels (website style)
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 2,
    lineHeight: 16,
    textTransform: 'uppercase',
  } as TextStyle,
  // Ticker text (Bebas Neue)
  ticker: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fontFamilies.accent,
    letterSpacing: 1.5,
    lineHeight: 18,
  } as TextStyle,
} as const;

// Backward-compat: old code references fonts.display etc. as family name strings
export const fonts = {
  display: fontFamilies.display,
  displaySemiBold: fontFamilies.displayBold,
  body: fontFamilies.body,
  bodyMedium: fontFamilies.bodyMedium,
  bodySemiBold: fontFamilies.bodySemiBold,
  bodyBold: fontFamilies.bodySemiBold,
  accent: fontFamilies.accent,
  serif: fontFamilies.serif,
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
