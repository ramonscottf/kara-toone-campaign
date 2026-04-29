import React, { useEffect } from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingDonateButton() {
  const router = useRouter();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(500, withSpring(1, { damping: 12, stiffness: 200 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/donate');
      }}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={styles.blur}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </BlurView>
      ) : (
        <Animated.View style={styles.fallback}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blur: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.7)',
  },
  fallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
