import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, borderRadius, spacing, fonts, fontSizes } from '../../theme';

const supportColors: Record<string, { bg: string; text: string }> = {
  strong: { bg: colors.supportStrong, text: colors.white },
  leaning: { bg: colors.supportLeaning, text: colors.white },
  undecided: { bg: colors.supportUndecided, text: colors.deep },
  opponent: { bg: colors.supportOpponent, text: colors.white },
  'strong-opponent': { bg: colors.supportStrongOpponent, text: colors.white },
  'not-contacted': { bg: colors.supportNotContacted, text: colors.white },
};

interface BadgeProps {
  label: string;
  type?: keyof typeof supportColors | 'default' | 'info' | 'accent';
  size?: 'sm' | 'md';
}

export function Badge({ label, type = 'default', size = 'md' }: BadgeProps) {
  let bg = colors.light;
  let textColor = colors.navy;

  if (type === 'info') {
    bg = colors.navy;
    textColor = colors.white;
  } else if (type === 'accent') {
    bg = colors.gold;
    textColor = colors.deep;
  } else if (supportColors[type]) {
    bg = supportColors[type].bg;
    textColor = supportColors[type].text;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.badgeSm]}>
      <Text
        style={[
          styles.text,
          { color: textColor },
          size === 'sm' && styles.textSm,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 9,
  },
});
