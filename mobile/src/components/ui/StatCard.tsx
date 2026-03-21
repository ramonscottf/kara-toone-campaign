import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { spacing } from '../../theme';
import { typography } from '../../theme/typography';
import { useTheme } from '../../theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, accentColor = '#0EA5E9', icon }: StatCardProps) {
  const { sys } = useTheme();

  return (
    <Card accentColor={accentColor} padding={spacing.md}>
      <View style={styles.header}>
        {icon}
        <Text style={[styles.label, { color: sys.secondaryLabel }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color: accentColor }]}>
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
    ...typography.caption1,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  value: {
    ...typography.largeTitle,
  },
});
