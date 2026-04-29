import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { Text, Button } from '../../src/components/ui';
import { colors, fonts, fontSizes, spacing } from '../../src/theme';

export default function LoginScreen() {
  const { signInWithApple, signInAsPreview } = useAuth();
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

  const handlePreview = async () => {
    setLoading(true);
    try {
      await signInAsPreview();
    } catch {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top decorative rule */}
      <View style={styles.topRule} />

      {/* Monogram */}
      <View style={styles.monogramContainer}>
        <Text style={styles.monogram}>K</Text>
      </View>

      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={styles.nameText}>KARA TOONE</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitleText}>for Utah House District 14</Text>
      </View>

      {/* Campaign tagline */}
      <View style={styles.taglineBlock}>
        <Text style={styles.tagline}>Campaign Command Center</Text>
      </View>

      {/* Sign in button */}
      <View style={styles.signInBlock}>
        {Platform.OS === 'ios' ? (
          <AppleSignInButton onPress={handleSignIn} />
        ) : (
          <Button
            title="Preview App (Admin View)"
            variant="primary"
            size="lg"
            onPress={handlePreview}
            loading={loading}
            style={{ width: 280 }}
          />
        )}

        {/* Preview mode for iOS dev too */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity onPress={handlePreview} style={styles.previewLink}>
            <Text style={styles.previewText}>Preview without signing in</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dateline */}
      <View style={styles.dateline}>
        <View style={styles.datelineRule} />
        <Text style={styles.datelineText}>Republican Convention 2026</Text>
        <View style={styles.datelineRule} />
      </View>

      {/* Bottom decorative */}
      <View style={styles.bottomDecoration}>
        <Text style={styles.paidFor}>
          Paid for by Kara Toone for Utah House District 14
        </Text>
      </View>
    </View>
  );
}

// Lazy-loaded Apple Sign In button (only on iOS)
function AppleSignInButton({ onPress }: { onPress: () => void }) {
  const AppleAuthentication = require('expo-apple-authentication');
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{ width: 280, height: 50 }}
      onPress={onPress}
    />
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
  previewLink: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  previewText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.gray,
    textDecorationLine: 'underline',
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
