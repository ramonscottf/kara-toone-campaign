import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../theme';

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export function HeroSection({ eyebrow, title, subtitle, badge }: HeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowLine} />
        <Text style={styles.eyebrow}>{eyebrow}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deep,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['2xl'],
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  eyebrowLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.gold,
  },
  eyebrow: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSizes['4xl'],
    color: colors.white,
    lineHeight: fontSizes['4xl'] * 1.1,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    color: colors.light,
    lineHeight: fontSizes.base * 1.5,
    marginBottom: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 216, 51, 0.15)',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
