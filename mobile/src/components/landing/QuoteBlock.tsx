import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../theme';

interface QuoteBlockProps {
  text: string;
  attribution: string;
}

export function QuoteBlock({ text, attribution }: QuoteBlockProps) {
  return (
    <View style={styles.container}>
      <View style={styles.quoteBar} />
      <Text style={styles.quoteText}>"{text}"</Text>
      <Text style={styles.attribution}>— {attribution}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deep,
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginVertical: spacing.base,
  },
  quoteBar: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    marginBottom: spacing.base,
  },
  quoteText: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.md,
    color: colors.cream,
    fontStyle: 'italic',
    lineHeight: fontSizes.md * 1.6,
    marginBottom: spacing.md,
  },
  attribution: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.gold,
  },
});
