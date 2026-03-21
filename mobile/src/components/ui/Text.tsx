import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, fonts, fontSizes, lineHeights } from '../../theme';

type Variant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'label'
  | 'accent'
  | 'editorial';

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
}

const variantStyles: Record<Variant, object> = {
  hero: {
    fontFamily: fonts.display,
    fontSize: fontSizes['5xl'],
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
    color: colors.text,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    color: colors.text,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.snug,
    color: colors.text,
  },
  h3: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.snug,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    color: colors.text,
  },
  bodyBold: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    color: colors.textSecondary,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
  },
  accent: {
    fontFamily: fonts.accent,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: colors.text,
  },
  editorial: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
    color: colors.text,
    fontStyle: 'italic' as const,
  },
};

export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  return (
    <RNText
      style={[variantStyles[variant], color ? { color } : undefined, style]}
      {...props}
    />
  );
}
