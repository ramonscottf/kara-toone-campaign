import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function EndorsementsSection() {
  return (
    <View style={styles.container}>
      {/* Gold blob decoration */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />

      <View style={styles.header}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>ENDORSEMENTS</Text>
        </View>
        <Text style={styles.title}>Trusted by Our Community</Text>
        <Text style={styles.subtitle}>
          Leaders across Davis County support Kara's vision for District 14.
        </Text>
      </View>

      <View style={styles.grid}>
        {brand.endorsements.map((endorsement, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.quote}>"{endorsement.quote}"</Text>
            <View style={styles.divider} />
            <Text style={styles.name}>{endorsement.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navy,
    paddingVertical: 56,
    paddingHorizontal: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  blobTopLeft: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,216,51,0.06)',
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -40,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,216,51,0.04)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
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
    backgroundColor: colors.gold,
  },
  eyebrowText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.gold,
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 22,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    padding: 28,
  },
  quote: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: colors.gold,
    marginBottom: 12,
  },
  name: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
});
