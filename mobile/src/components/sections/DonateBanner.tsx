import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

export function DonateBanner() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.red, colors.redBright]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.eyebrow}>SUPPORT THE CAMPAIGN</Text>
      <Text style={styles.title}>Help Kara Win</Text>
      <Text style={styles.desc}>
        Every dollar makes a difference. Your contribution helps us reach more voters across District 14.
      </Text>
      <Pressable
        style={styles.btn}
        onPress={() => router.push('/donate')}
      >
        <Text style={styles.btnText}>DONATE NOW →</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 2,
  },
  btnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.red,
  },
});
