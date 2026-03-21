import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: number;
  accentColor?: string;
}

export function Card({
  elevated = true,
  padding = spacing.base,
  accentColor,
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        { padding },
        accentColor && { borderTopWidth: 4, borderTopColor: accentColor },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
