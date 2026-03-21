import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/auth/AuthContext';
import { Text } from '../../src/components/ui';
import { colors, fonts, fontSizes, spacing } from '../../src/theme';

export default function LoginScreen() {
  const { signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top decorative rule */}
      <View style={styles.topRule} />

      {/* Monogram */}
      <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.monogramContainer}>
        <Text style={styles.monogram}>K</Text>
      </Animated.View>

      {/* Title block */}
      <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.titleBlock}>
        <Text style={styles.nameText}>KARA TOONE</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitleText}>for Utah House District 14</Text>
      </Animated.View>

      {/* Campaign tagline */}
      <Animated.View entering={FadeInUp.duration(800).delay(600)} style={styles.taglineBlock}>
        <Text style={styles.tagline}>Campaign Command Center</Text>
      </Animated.View>

      {/* Sign in button */}
      <Animated.View entering={FadeInDown.duration(800).delay(800)} style={styles.signInBlock}>
        {Platform.OS === 'ios' ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={handleSignIn}
          />
        ) : (
          <View style={styles.fallbackNotice}>
            <Text variant="caption">Apple Sign In requires an iOS device</Text>
          </View>
        )}
      </Animated.View>

      {/* Dateline */}
      <Animated.View entering={FadeInDown.duration(800).delay(1000)} style={styles.dateline}>
        <View style={styles.datelineRule} />
        <Text style={styles.datelineText}>Republican Convention 2026</Text>
        <View style={styles.datelineRule} />
      </Animated.View>

      {/* Bottom decorative */}
      <View style={styles.bottomDecoration}>
        <Text style={styles.paidFor}>
          Paid for by Kara Toone for Utah House District 14
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  topRule: {
    position: 'absolute',
    top: 60,
    left: spacing['2xl'],
    right: spacing['2xl'],
    height: 2,
    backgroundColor: colors.deep,
  },
  monogramContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.deep,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  monogram: {
    fontFamily: fonts.serif,
    fontSize: 56,
    color: colors.deep,
    lineHeight: 64,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  nameText: {
    fontFamily: fonts.display,
    fontSize: fontSizes['3xl'],
    color: colors.deep,
    letterSpacing: 4,
    textAlign: 'center',
  },
  rule: {
    width: 60,
    height: 1,
    backgroundColor: colors.red,
    marginVertical: spacing.md,
  },
  subtitleText: {
    fontFamily: fonts.serif,
    fontSize: fontSizes.lg,
    color: colors.navy,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  taglineBlock: {
    marginBottom: spacing['3xl'],
  },
  tagline: {
    fontFamily: fonts.accent,
    fontSize: fontSizes['2xl'],
    color: colors.red,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  signInBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  appleButton: {
    width: 280,
    height: 50,
  },
  fallbackNotice: {
    padding: spacing.base,
  },
  dateline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  datelineRule: {
    width: 30,
    height: 1,
    backgroundColor: colors.gray,
  },
  datelineText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.gray,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  paidFor: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.gray,
    textAlign: 'center',
  },
});
