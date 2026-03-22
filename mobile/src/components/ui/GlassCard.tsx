import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LiquidGlassView } from './LiquidGlassView';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  glassStyle?: 'clear' | 'regular' | 'none';
  padding?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 80,
  tint = 'light',
  glassStyle = 'regular',
  padding = 16,
}: GlassCardProps) {
  return (
    <LiquidGlassView
      style={{ ...styles.container, ...style } as any}
      glassStyle={glassStyle}
      blurIntensity={intensity}
      blurTint={tint}
    >
      <View style={[styles.content, { padding }]}>{children}</View>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
});
