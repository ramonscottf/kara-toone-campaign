import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Button, Text } from '../ui';
import { colors, spacing, fonts, fontSizes } from '../../theme';

interface ShareCTAProps {
  buttonText: string;
  shareText: string;
  shareUrl: string;
  title: string;
}

export function ShareCTA({ buttonText, shareText, shareUrl, title }: ShareCTAProps) {
  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: shareText,
        url: shareUrl,
        title: title,
      });
    } catch {
      // User cancelled or share failed
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.label}>Share this page</Text>
      <Button
        title={buttonText}
        variant="primary"
        size="lg"
        onPress={handleShare}
        style={styles.button}
      />
      <Text style={styles.hint}>
        Opens the share sheet — AirDrop, Messages, Mail, and more
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.gray,
    textAlign: 'center',
  },
});
