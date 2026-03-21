import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { colors, spacing, fonts, fontSizes } from '../../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, accentColor = colors.navy, icon }: StatCardProps) {
  return (
    <Card accentColor={accentColor} padding={spacing.md}>
      <View style={styles.header}>
        {icon}
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      </View>
      <Text
        style={[styles.value, { color: accentColor }]}
      >
        {String(value)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  label: {
    flex: 1,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * 1.1,
  },
});
