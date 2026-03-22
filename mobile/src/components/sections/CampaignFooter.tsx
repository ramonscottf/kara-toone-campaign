import React from 'react';
import { View, StyleSheet, Text, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

export function CampaignFooter() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: brand.logoUrl }}
        style={styles.logo}
        contentFit="contain"
      />

      <Text style={styles.tagline}>{brand.tagline}</Text>

      <View style={styles.socialRow}>
        <SocialButton label="IG" url={brand.socialLinks.instagram} />
        <SocialButton label="FB" url={brand.socialLinks.facebook} />
        <SocialButton label="V" url={brand.socialLinks.venmo} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.disclaimer}>{brand.footerDisclaimer}</Text>
      <Text style={styles.poweredBy}>{brand.poweredBy}</Text>
    </View>
  );
}

function SocialButton({ label, url }: { label: string; url: string }) {
  return (
    <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(url)}>
      <Text style={styles.socialBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deep,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 36,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  disclaimer: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginBottom: 8,
  },
  poweredBy: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
