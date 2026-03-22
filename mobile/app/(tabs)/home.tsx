import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme/ThemeContext';
import { brand } from '../../src/config/brand';
import { pillars } from '../../src/data/priorities';
import { colors } from '../../src/theme/colors';
import { fontFamilies } from '../../src/theme/typography';
import type { PillarId } from '../../src/config/brand';

// Section components
import { HeroSection } from '../../src/components/sections/HeroSection';
import { TickerStrip } from '../../src/components/sections/TickerStrip';
import { StatsBar } from '../../src/components/sections/StatsBar';
import { PhotoGallery } from '../../src/components/sections/PhotoGallery';
import { EndorsementsSection } from '../../src/components/sections/EndorsementsSection';
import { EventsList } from '../../src/components/sections/EventsList';
import { GetInvolvedSection } from '../../src/components/sections/GetInvolvedSection';
import { DonateBanner } from '../../src/components/sections/DonateBanner';
import { CampaignFooter } from '../../src/components/sections/CampaignFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const sorted = [...pillars].sort((a, b) => a.priorityNumber - b.priorityNumber);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Ticker Strip */}
        <TickerStrip />

        {/* 3. About Preview */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutGrid}>
            <Image
              source={{ uri: brand.images.heroBurgundy }}
              style={styles.aboutImage}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.aboutText}>
              <View style={styles.eyebrow}>
                <View style={styles.eyebrowLine} />
                <Text style={styles.eyebrowText}>ABOUT KARA</Text>
              </View>
              <Text style={styles.aboutTitle}>
                A Leader Who <Text style={{ color: colors.red, fontStyle: 'italic' }}>Listens</Text>
              </Text>
              <Text style={styles.aboutDesc}>
                {brand.about.bio.split('\n')[0]}
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/about')}>
                <Text style={styles.readMore}>READ MORE →</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 4. Stats Band */}
        <StatsBar />

        {/* 5. Priorities */}
        <View style={styles.prioritiesSection}>
          <View style={styles.prioritiesHeader}>
            <Text style={styles.prioritiesTitle}>Key Priorities</Text>
            <Text style={styles.prioritiesSubtitle}>
              Building a stronger future for Davis County families.
            </Text>
          </View>
          <View style={styles.prioritiesGrid}>
            {sorted.map((pillar, i) => (
              <Pressable
                key={pillar.id}
                style={[
                  styles.priorityCard,
                  i === sorted.length - 1 && styles.priorityCardFeatured,
                ]}
                onPress={() => router.push(`/(tabs)/priorities/${pillar.id}`)}
              >
                <Text style={[
                  styles.cardNum,
                  i === sorted.length - 1 && styles.cardNumFeatured,
                ]}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={[
                  styles.cardTitle,
                  i === sorted.length - 1 && styles.cardTitleFeatured,
                ]}>
                  {pillar.title}
                </Text>
                <Text style={[
                  styles.cardDesc,
                  i === sorted.length - 1 && styles.cardDescFeatured,
                ]}>
                  {pillar.subtitle}
                </Text>
                <Text style={[
                  styles.cardLink,
                  i === sorted.length - 1 && styles.cardLinkFeatured,
                ]}>
                  LEARN MORE →
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 6. Endorsements */}
        <EndorsementsSection />

        {/* 7. Events */}
        <EventsList />

        {/* 8. Get Involved */}
        <GetInvolvedSection />

        {/* 9. Photo Gallery */}
        <PhotoGallery />

        {/* 10. Donate Banner */}
        <DonateBanner />

        {/* 11. Footer */}
        <CampaignFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  // About section
  aboutSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: colors.cream,
  },
  aboutGrid: {
    gap: 24,
  },
  aboutImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 4,
    backgroundColor: colors.light,
  },
  aboutText: {
    gap: 0,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: colors.red,
  },
  eyebrowText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.red,
  },
  aboutTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.navy,
    lineHeight: 34,
    marginBottom: 16,
  },
  aboutDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 26,
    marginBottom: 16,
  },
  readMore: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.red,
  },
  // Priorities section
  prioritiesSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  prioritiesHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  prioritiesTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 10,
  },
  prioritiesSubtitle: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 22,
  },
  prioritiesGrid: {
    gap: 16,
  },
  priorityCard: {
    backgroundColor: colors.cream,
    borderRadius: 4,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E0E8F0',
  },
  priorityCardFeatured: {
    backgroundColor: colors.navy,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardNum: {
    fontFamily: fontFamilies.accent,
    fontSize: 36,
    color: '#E0E8F0',
    lineHeight: 40,
    marginBottom: 12,
  },
  cardNumFeatured: {
    color: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 18,
    color: colors.navy,
    marginBottom: 8,
    lineHeight: 24,
  },
  cardTitleFeatured: {
    color: '#FFFFFF',
  },
  cardDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardDescFeatured: {
    color: 'rgba(255,255,255,0.6)',
  },
  cardLink: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.red,
  },
  cardLinkFeatured: {
    color: colors.gold,
  },
});
