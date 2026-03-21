import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { pillarColors } from '../../theme/colors';
import type { PillarId } from '../../config/brand';

interface GradientBackgroundProps {
  pillarId: PillarId;
  style?: ViewStyle;
  children?: React.ReactNode;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientBackground({
  pillarId,
  style,
  children,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientBackgroundProps) {
  const pc = pillarColors[pillarId];

  return (
    <LinearGradient
      colors={[pc.gradientStart, pc.gradientEnd]}
      start={start}
      end={end}
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </LinearGradient>
  );
}
