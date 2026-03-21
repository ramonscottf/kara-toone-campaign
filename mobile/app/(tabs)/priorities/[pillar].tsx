import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { pillarColors } from '../../../src/theme/colors';
import { getPillar } from '../../../src/data/priorities';
import { ParallaxHero, HERO_HEIGHT } from '../../../src/components/ui/ParallaxHero';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { Button } from '../../../src/components/ui/Button';
import type { PillarId } from '../../../src/config/brand';

export default function PillarOverview() {
  const { pillar: pillarId } = useLocalSearchParams<{ pillar: string }>();
  const router = useRouter();
  const { sys, isDark } = useTheme();
  const scrollY = useSharedValue(0);

  const pillar = getPillar(pillarId || '');
  if (!pillar) return null;

  const pc = pillarColors[pillar.id as PillarId];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: sys.background }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ParallaxHero
          imageUrl={pillar.heroImage}
          title={pillar.title}
          subtitle={pillar.subtitle}
          gradientColors={[pc.gradientStart, pc.gradientEnd]}
          scrollY={scrollY}
        />

        {/* Stats row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {pillar.stats.map((stat, i) => (
            <GlassCard key={i} style={styles.statCard} tint={isDark ? 'dark' : 'light'}>
              <Text style={[styles.statNumber, { color: pc.primary }]}>
                {stat.number}
              </Text>
              <Text style={[styles.statLabel, { color: sys.secondaryLabel }]}>
                {stat.label}
              </Text>
            </GlassCard>
          ))}
        </ScrollView>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={[styles.overviewTitle, { color: sys.label }]}>
            {pillar.overviewTitle}
          </Text>
          <Text style={[styles.overviewContent, { color: sys.secondaryLabel }]}>
            {pillar.overviewContent}
          </Text>
        </View>

        {/* Quote */}
        {pillar.quotes[0] && (
          <View style={[styles.quoteContainer, { borderLeftColor: pc.primary }]}>
            <Text style={[styles.quoteText, { color: sys.label }]}>
              &ldquo;{pillar.quotes[0].quote}&rdquo;
            </Text>
            <Text style={[styles.quoteAttribution, { color: sys.secondaryLabel }]}>
              — {pillar.quotes[0].attribution}
            </Text>
          </View>
        )}

        {/* Full Details button */}
        <View style={styles.detailsButton}>
          <Button
            title="View Full Details"
            variant="primary"
            size="lg"
            onPress={() =>
              router.push(`/(tabs)/priorities/details/${pillar.id}`)
            }
            style={{ backgroundColor: pc.primary }}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsRow: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    minWidth: 120,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.title1,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption1,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  overviewTitle: {
    ...typography.title2,
    marginBottom: 12,
  },
  overviewContent: {
    ...typography.body,
    lineHeight: 26,
  },
  quoteContainer: {
    marginHorizontal: 20,
    marginTop: 28,
    paddingLeft: 16,
    borderLeftWidth: 4,
  },
  quoteText: {
    ...typography.callout,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAttribution: {
    ...typography.footnote,
    marginTop: 8,
  },
  detailsButton: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});
