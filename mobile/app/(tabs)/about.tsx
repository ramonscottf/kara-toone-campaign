import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { fontFamilies } from '../../src/theme/typography';
import { brand } from '../../src/config/brand';
import { CampaignFooter } from '../../src/components/sections/CampaignFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_SIZE = (SCREEN_WIDTH - 24 * 2 - 12) / 2;

const familyPhotos = [
  { uri: brand.images.familyFormal, caption: 'The Toone family' },
  { uri: brand.images.familyOutdoor, caption: 'Outdoors together' },
  { uri: brand.images.coupleOutdoors, caption: 'Kara & Logan' },
  { uri: brand.images.familyIceCream, caption: 'Family fun' },
];

const communityPhotos = [
  { uri: brand.images.americanFlag, caption: 'With students' },
  { uri: brand.images.communityParade, caption: 'Community parade' },
  { uri: brand.images.bestOfState, caption: 'Best of State award' },
  { uri: brand.images.politicalEvent, caption: 'Community event' },
  { uri: brand.images.communityEvent, caption: 'In the community' },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: brand.images.headshot }}
          style={styles.heroImage}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['rgba(21,46,84,0.7)', 'rgba(21,46,84,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', 'rgba(21,46,84,0.9)']}
          start={{ x: 0, y: 0.6 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Red-to-gold accent stripe */}
        <LinearGradient
          colors={[colors.red, colors.gold]}
          style={styles.accentStripe}
        />
        {/* Logo */}
        <View style={[styles.logoContainer, { top: insets.top + 12 }]}>
          <Image source={{ uri: brand.logoUrl }} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.heroContent}>
          <View style={styles.eyebrow}>
            <View style={[styles.eyebrowLine, { backgroundColor: colors.gold }]} />
            <Text style={[styles.eyebrowText, { color: colors.gold }]}>MEET KARA</Text>
          </View>
          <Text style={styles.heroTitle}>About Kara</Text>
          <Text style={styles.heroSubtitle}>{brand.tagline}</Text>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bioSection}>
        {brand.about.bio.split('\n\n').map((paragraph, i) => (
          <Text key={i} style={styles.bioText}>{paragraph}</Text>
        ))}
      </View>

      {/* Family Photos */}
      <View style={styles.sectionHeader}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>FAMILY</Text>
        </View>
        <Text style={styles.sectionTitle}>Family & Community</Text>
        <Text style={styles.sectionSubtitle}>{brand.about.familyText}</Text>
      </View>
      <View style={styles.photoGrid}>
        {familyPhotos.map((photo, i) => (
          <View key={i} style={styles.photoItem}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.gridPhoto}
              contentFit="cover"
              transition={300}
            />
            <Text style={styles.photoCaption}>{photo.caption}</Text>
          </View>
        ))}
      </View>

      {/* Community Involvement */}
      <View style={[styles.sectionHeader, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>COMMUNITY</Text>
        </View>
        <Text style={styles.sectionTitle}>Community Involvement</Text>
      </View>
      <View style={[styles.communityGrid, { backgroundColor: '#FFFFFF' }]}>
        {communityPhotos.map((photo, i) => (
          <View key={i} style={[
            styles.communityItem,
            i === 0 && styles.communityItemWide,
          ]}>
            <Image
              source={{ uri: photo.uri }}
              style={[
                styles.communityPhoto,
                i === 0 && styles.communityPhotoWide,
              ]}
              contentFit="cover"
              transition={300}
            />
            <Text style={styles.photoCaption}>{photo.caption}</Text>
          </View>
        ))}
      </View>

      <CampaignFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  heroContainer: {
    height: 480,
    overflow: 'hidden',
    backgroundColor: colors.deep,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    zIndex: 2,
  },
  logoContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 3,
  },
  logo: {
    width: 120,
    height: 36,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 32,
    zIndex: 3,
  },
  heroTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 40,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
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
  bioSection: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: colors.cream,
    gap: 16,
  },
  bioText: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 28,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: colors.cream,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.navy,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: colors.gray,
    lineHeight: 24,
  },
  photoGrid: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: colors.cream,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    width: GALLERY_SIZE,
  },
  gridPhoto: {
    width: GALLERY_SIZE,
    height: GALLERY_SIZE,
    borderRadius: 4,
    backgroundColor: colors.light,
  },
  photoCaption: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray,
    marginTop: 6,
  },
  communityGrid: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  communityItem: {
    width: GALLERY_SIZE,
  },
  communityItemWide: {
    width: '100%',
  },
  communityPhoto: {
    width: GALLERY_SIZE,
    height: GALLERY_SIZE * 0.75,
    borderRadius: 4,
    backgroundColor: colors.light,
  },
  communityPhotoWide: {
    width: '100%',
    height: 200,
  },
});
