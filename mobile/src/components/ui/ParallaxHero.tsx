import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { typography } from '../../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 360;

interface ParallaxHeroProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  gradientColors: [string, string];
  scrollY: SharedValue<number>;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function ParallaxHero({
  imageUrl,
  title,
  subtitle,
  gradientColors,
  scrollY,
}: ParallaxHeroProps) {
  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.3],
    );
    const scale = interpolate(
      scrollY.value,
      [-HERO_HEIGHT, 0, HERO_HEIGHT],
      [2, 1, 1],
    );
    return { transform: [{ translateY }, { scale }] };
  });

  return (
    <View style={styles.container}>
      <AnimatedImage
        source={{ uri: imageUrl }}
        style={[styles.image, imageStyle]}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={[
          'transparent',
          `${gradientColors[1]}88`,
          gradientColors[1],
        ]}
        locations={[0, 0.55, 1]}
        style={styles.gradient}
      />
      <View style={styles.textContainer}>
        <Animated.Text style={styles.title}>{title}</Animated.Text>
        <Animated.Text style={styles.subtitle}>{subtitle}</Animated.Text>
      </View>
    </View>
  );
}

export { HERO_HEIGHT };

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  title: {
    ...typography.largeTitle,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.subheadline,
    color: 'rgba(255,255,255,0.85)',
  },
});
