import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../theme';

const colorMap = {
  navy: colors.navy,
  red: colors.red,
  gold: colors.gold,
};

interface StatGridProps {
  items: { number: string; label: string; color: 'navy' | 'red' | 'gold' }[];
}

export function StatGrid({ items }: StatGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item, i) => (
          <View key={i} style={[styles.card, { borderTopColor: colorMap[item.color] }]}>
            <Text style={[styles.number, { color: colorMap[item.color] }]}>{item.number}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderTopWidth: 4,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  number: {
    fontFamily: fonts.display,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * 1.1,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});
