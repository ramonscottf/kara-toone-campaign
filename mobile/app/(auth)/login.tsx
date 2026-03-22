import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Pressable,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/auth/AuthContext';
import { Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { fontFamilies } from '../../src/theme/typography';
import { brand } from '../../src/config/brand';

export default function LoginScreen() {
  const { signInWithApple, signInAsPreview } = useAuth();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

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
      {/* Background image */}
      <Image
        source={{ uri: brand.images.heroFullBody }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      {/* Navy overlay */}
      <LinearGradient
        colors={['rgba(21,46,84,0.92)', 'rgba(21,46,84,0.85)', 'rgba(21,46,84,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      {/* Red-to-gold accent stripe */}
      <LinearGradient
        colors={[colors.red, colors.gold]}
        style={styles.accentStripe}
      />

      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Logo */}
        <Image
          source={{ uri: brand.logoUrl }}
          style={styles.logo}
          contentFit="contain"
        />

        {/* Title */}
        <Text style={styles.nameText}>CAMPAIGN</Text>
        <Text style={styles.nameText}>COMMAND CENTER</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitleText}>{brand.district}</Text>

        {/* Sign in */}
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

          {Platform.OS === 'ios' && (
            <Pressable onPress={handlePreview} style={styles.previewLink}>
              <Text style={styles.previewText}>Preview without signing in</Text>
            </Pressable>
          )}
        </View>

        {/* Dateline */}
        <View style={styles.dateline}>
          <View style={styles.datelineRule} />
          <Text style={styles.datelineText}>Republican Convention 2026</Text>
          <View style={styles.datelineRule} />
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.paidFor}>{brand.footerDisclaimer}</Text>
      </View>
    </View>
  );
}

function AppleSignInButton({ onPress }: { onPress: () => void }) {
  const AppleAuthentication = require('expo-apple-authentication');
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={4}
      style={{ width: 280, height: 50 }}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deep,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    zIndex: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 3,
  },
  logo: {
    width: 160,
    height: 48,
    marginBottom: 40,
  },
  nameText: {
    fontFamily: fontFamilies.display,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 38,
  },
  rule: {
    width: 60,
    height: 2,
    backgroundColor: colors.red,
    marginVertical: 16,
  },
  subtitleText: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 16,
    color: colors.gold,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
  },
  signInBlock: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  previewLink: {
    marginTop: 12,
    padding: 8,
  },
  previewText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'underline',
  },
  dateline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datelineRule: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  datelineText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 3,
  },
  paidFor: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
});
