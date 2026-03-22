import React from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../ui/Text';
import { brand } from '../../config/brand';
import { colors } from '../../theme/colors';
import { typography, fontFamilies } from '../../theme/typography';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function HeroSection() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: brand.images.heroFullBody }}
        style={styles.heroImage}
        contentFit="cover"
        transition={500}
      />
      {/* Navy gradient overlay — matching website */}
      <LinearGradient
        colors={[
          'rgba(21,46,84,0.88)',
          'rgba(21,46,84,0.70)',
          'rgba(21,46,84,0.40)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(21,46,84,0.8)']}
        start={{ x: 0, y: 0.6 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Red-to-gold accent stripe (left edge) */}
      <LinearGradient
        colors={[colors.red, colors.gold]}
        style={styles.accentStripe}
      />

      {/* Logo */}
      <View style={[styles.logoContainer, { top: insets.top + 12 }]}>
        <Image
          source={{ uri: brand.logoUrl }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>UTAH HOUSE DISTRICT 14</Text>
        </View>

        <Text style={styles.heroName}>{brand.candidateName.toUpperCase()}</Text>
        <Text style={styles.heroTagline}>FOR UTAH</Text>
        <Text style={styles.heroDesc}>{brand.tagline}</Text>

        <View style={styles.ctas}>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => router.push('/donate')}
          >
            <Text style={styles.btnPrimaryText}>DONATE NOW →</Text>
          </Pressable>
          <Pressable
            style={styles.btnOutline}
            onPress={() => {/* scroll to get involved */}}
          >
            <Text style={styles.btnOutlineText}>GET INVOLVED →</Text>
          </Pressable>
        </View>
      </View>

      {/* Badge stats at bottom */}
      <View style={[styles.badges, { bottom: 20 }]}>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeNumber}>25+</Text>
          <Text style={styles.badgeLabel}>YEARS LOCAL</Text>
        </View>
        <View style={styles.badgeItem}>
          <Text style={styles.badgeNumber}>10K</Text>
          <Text style={styles.badgeLabel}>STUDENTS IMPACTED</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.75,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
    zIndex: 3,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: colors.gold,
  },
  eyebrowText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.gold,
  },
  heroName: {
    fontFamily: fontFamilies.display,
    fontSize: 48,
    color: '#FFFFFF',
    lineHeight: 50,
    marginBottom: 4,
  },
  heroTagline: {
    fontFamily: fontFamilies.accent,
    fontSize: 32,
    letterSpacing: 2,
    color: colors.red,
    lineHeight: 36,
    marginBottom: 20,
  },
  heroDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)',
    maxWidth: 320,
    marginBottom: 28,
  },
  ctas: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: colors.red,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  btnPrimaryText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  btnOutlineText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  badges: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    gap: 16,
    zIndex: 3,
  },
  badgeItem: {
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  badgeNumber: {
    fontFamily: fontFamilies.accent,
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  badgeLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.gray,
    marginTop: 2,
  },
});
