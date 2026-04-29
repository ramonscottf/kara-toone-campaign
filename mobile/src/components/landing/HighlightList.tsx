import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../theme';

const colorMap = {
  navy: colors.navy,
  red: colors.red,
  gold: colors.gold,
};

interface HighlightListProps {
  title: string;
  items: { icon: string; title: string; description: string; color: 'navy' | 'red' | 'gold' }[];
}

export function HighlightList({ title, items }: HighlightListProps) {
  return (
    <View style={styles.container}>
      <Text variant="h2" style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={[styles.card, { borderLeftColor: colorMap[item.color] }]}>
          <View style={[styles.iconCircle, { backgroundColor: colorMap[item.color] + '15' }]}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.content}>
            <Text variant="h3" style={styles.itemTitle}>{item.title}</Text>
            <Text variant="body" style={styles.description}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
});
