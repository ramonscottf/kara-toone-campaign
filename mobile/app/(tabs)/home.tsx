import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { brand } from '../../src/config/brand';
import { pillars } from '../../src/data/priorities';
import { PillarCard } from '../../src/components/ui/PillarCard';
import { DonateButton } from '../../src/components/ui/DonateButton';
import type { PillarId } from '../../src/config/brand';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - CARD_GAP) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sys } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const sorted = [...pillars].sort((a, b) => a.priorityNumber - b.priorityNumber);

  return (
    <View style={[styles.container, { backgroundColor: sys.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: brand.heroImage }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroContent, { paddingTop: insets.top + 16 }]}>
            <Text style={styles.heroName}>{brand.candidateName}</Text>
            <Text style={styles.heroDistrict}>{brand.district}</Text>
            <Text style={styles.heroTagline}>{brand.tagline}</Text>
          </View>
        </View>

        {/* Section: Priorities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sys.label }]}>
            Key Priorities
          </Text>

          <View style={styles.grid}>
            {sorted.slice(0, 4).map((pillar, i) => (
              <View key={pillar.id} style={styles.gridItem}>
                <PillarCard
                  pillarId={pillar.id as PillarId}
                  title={pillar.title}
                  statNumber={pillar.keyStat.number}
                  statLabel={pillar.keyStat.label}
                  onPress={() => router.push(`/(tabs)/priorities/${pillar.id}`)}
                  compact
                />
              </View>
            ))}
          </View>

          {/* Fifth pillar — full width */}
          {sorted[4] && (
            <View style={styles.fullWidth}>
              <PillarCard
                pillarId={sorted[4].id as PillarId}
                title={sorted[4].title}
                statNumber={sorted[4].keyStat.number}
                statLabel={sorted[4].keyStat.label}
                onPress={() => router.push(`/(tabs)/priorities/${sorted[4].id}`)}
              />
            </View>
          )}
        </View>

        {/* Donate */}
        <View style={styles.donateSection}>
          <DonateButton />
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: sys.tertiaryLabel }]}>
          {brand.footerDisclaimer}
        </Text>
        <Text style={[styles.poweredBy, { color: sys.tertiaryLabel }]}>
          {brand.poweredBy}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 380,
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 28,
  },
  heroName: {
    ...typography.largeTitle,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroDistrict: {
    ...typography.headline,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  heroTagline: {
    ...typography.subheadline,
    color: 'rgba(255,255,255,0.75)',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    ...typography.title2,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  gridItem: {
    width: CARD_WIDTH,
  },
  fullWidth: {
    marginTop: CARD_GAP,
  },
  donateSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  footer: {
    ...typography.caption1,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  poweredBy: {
    ...typography.caption2,
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 16,
  },
});
