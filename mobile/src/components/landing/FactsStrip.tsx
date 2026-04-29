import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../theme';

interface FactsStripProps {
  items: { icon: string; text: string }[];
}

export function FactsStrip({ items }: FactsStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item, i) => (
        <View key={i} style={styles.chip}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.deep,
  },
});
