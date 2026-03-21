import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';

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
  const { sys } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: sys.secondaryBackground },
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
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
