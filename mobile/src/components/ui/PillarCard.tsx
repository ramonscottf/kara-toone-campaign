import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { typography } from '../../theme/typography';
import { pillarColors } from '../../theme/colors';
import type { PillarId } from '../../config/brand';

interface PillarCardProps {
  pillarId: PillarId;
  title: string;
  statNumber: string;
  statLabel: string;
  onPress: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PillarCard({
  pillarId,
  title,
  statNumber,
  statLabel,
  onPress,
  compact = false,
}: PillarCardProps) {
  const scale = useSharedValue(1);
  const pc = pillarColors[pillarId];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <AnimatedPressable
      style={[styles.container, compact && styles.compact, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[pc.gradientStart, pc.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statContainer}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={30} tint="light" style={styles.statBlur}>
              <Text style={styles.statNumber}>{statNumber}</Text>
              <Text style={styles.statLabel}>{statLabel}</Text>
            </BlurView>
          ) : (
            <View style={styles.statFallback}>
              <Text style={styles.statNumber}>{statNumber}</Text>
              <Text style={styles.statLabel}>{statLabel}</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  compact: {
    height: 130,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    ...typography.title3,
    color: '#FFFFFF',
  },
  statContainer: {
    alignSelf: 'flex-start',
  },
  statBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statFallback: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statNumber: {
    ...typography.title2,
    color: '#FFFFFF',
  },
  statLabel: {
    ...typography.caption1,
    color: 'rgba(255,255,255,0.85)',
  },
});
