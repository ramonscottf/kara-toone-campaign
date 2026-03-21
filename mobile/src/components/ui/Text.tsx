import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { typography } from '../../theme/typography';
import { useTheme } from '../../theme/ThemeContext';

type Variant =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption1'
  | 'caption2'
  // Backward-compat aliases
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyBold'
  | 'caption'
  | 'label'
  | 'accent'
  | 'editorial';

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  secondary?: boolean;
}

const aliasMap: Record<string, keyof typeof typography> = {
  hero: 'largeTitle',
  h1: 'title1',
  h2: 'title2',
  h3: 'title3',
  bodyBold: 'headline',
  caption: 'footnote',
  label: 'caption1',
  accent: 'title3',
  editorial: 'callout',
};

export function Text({ variant = 'body', color, secondary, style, ...props }: TextProps) {
  const { sys } = useTheme();
  const resolved = aliasMap[variant] ?? variant;
  const typo = typography[resolved as keyof typeof typography] ?? typography.body;

  const textColor = color ?? (secondary ? sys.secondaryLabel : sys.label);

  return (
    <RNText
      style={[
        typo,
        { color: textColor },
        variant === 'label' && {
          letterSpacing: 0.5,
          textTransform: 'uppercase' as const,
        },
        variant === 'editorial' && { fontStyle: 'italic' as const },
        style,
      ]}
      {...props}
    />
  );
}
