import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { pillarColors } from '../../../src/theme/colors';
import { getPillarsSorted } from '../../../src/data/priorities';
import type { PillarId } from '../../../src/config/brand';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrioritiesIndex() {
  const router = useRouter();
  const { sys } = useTheme();
  const sorted = getPillarsSorted();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {sorted.map((pillar) => (
        <PriorityCard
          key={pillar.id}
          pillarId={pillar.id as PillarId}
          title={pillar.title}
          subtitle={pillar.subtitle}
          heroImage={pillar.heroImage}
          stats={pillar.stats.slice(0, 2)}
          onPress={() => router.push(`/(tabs)/priorities/${pillar.id}`)}
        />
      ))}
    </ScrollView>
  );
}

function PriorityCard({
  pillarId,
  title,
  subtitle,
  heroImage,
  stats,
  onPress,
}: {
  pillarId: PillarId;
  title: string;
  subtitle: string;
  heroImage: string;
  stats: { number: string; label: string }[];
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const pc = pillarColors[pillarId];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, animStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
    >
      <Image
        source={{ uri: heroImage }}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', `${pc.gradientEnd}CC`, pc.gradientEnd]}
        locations={[0, 0.5, 1]}
        style={styles.cardGradient}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.statRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statChip}>
              <Text style={styles.statNumber}>{s.number}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  card: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardTitle: {
    ...typography.title2,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    ...typography.footnote,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statNumber: {
    ...typography.headline,
    color: '#FFFFFF',
  },
  statLabel: {
    ...typography.caption2,
    color: 'rgba(255,255,255,0.85)',
  },
});
