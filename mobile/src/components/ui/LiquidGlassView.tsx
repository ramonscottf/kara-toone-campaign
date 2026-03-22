import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

let GlassViewNative: any = null;
let GlassContainerNative: any = null;
let checkLiquidGlass: (() => boolean) | null = null;
let checkGlassAPI: (() => boolean) | null = null;

try {
  const glassEffect = require('expo-glass-effect');
  GlassViewNative = glassEffect.GlassView;
  GlassContainerNative = glassEffect.GlassContainer;
  checkLiquidGlass = glassEffect.isLiquidGlassAvailable;
  checkGlassAPI = glassEffect.isGlassEffectAPIAvailable;
} catch {
  // expo-glass-effect not available
}

export function isLiquidGlassSupported(): boolean {
  if (Platform.OS !== 'ios') return false;
  try {
    return (checkLiquidGlass?.() ?? false) && (checkGlassAPI?.() ?? false);
  } catch {
    return false;
  }
}

interface LiquidGlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  glassStyle?: 'clear' | 'regular' | 'none';
  tintColor?: string;
  isInteractive?: boolean;
  /** Fallback blur intensity when liquid glass is unavailable */
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
}

export function LiquidGlassView({
  children,
  style,
  glassStyle = 'regular',
  tintColor,
  isInteractive = false,
  blurIntensity = 80,
  blurTint = 'light',
}: LiquidGlassViewProps) {
  if (isLiquidGlassSupported() && GlassViewNative) {
    return (
      <GlassViewNative
        style={style}
        glassEffectStyle={glassStyle}
        tintColor={tintColor}
        isInteractive={isInteractive}
      >
        {children}
      </GlassViewNative>
    );
  }

  // Fallback: BlurView on iOS, plain View on Android
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, style]}>
        <BlurView intensity={blurIntensity} tint={blurTint} style={StyleSheet.absoluteFill} />
        <View style={styles.border} />
        <View style={StyleSheet.absoluteFill}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.androidFallback, style]}>
      {children}
    </View>
  );
}

interface LiquidGlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

export function LiquidGlassContainer({
  children,
  style,
  spacing,
}: LiquidGlassContainerProps) {
  if (isLiquidGlassSupported() && GlassContainerNative) {
    return (
      <GlassContainerNative style={style} spacing={spacing}>
        {children}
      </GlassContainerNative>
    );
  }

  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  androidFallback: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    overflow: 'hidden',
  },
});
