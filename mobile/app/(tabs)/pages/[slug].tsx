import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { LandingPageRenderer } from '../../../src/components/landing/LandingPageRenderer';
import { landingPages } from '../../../src/data/landingPages';
import { landingContent } from '../../../src/data/landingContent';
import { Text } from '../../../src/components/ui';
import { colors, spacing } from '../../../src/theme';

export default function LandingPageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const meta = landingPages.find(p => p.slug === slug);
  const content = slug ? landingContent[slug] : undefined;

  if (!meta || !content) {
    return (
      <View style={styles.notFound}>
        <Text variant="h2">Page Not Found</Text>
        <Text variant="body" color={colors.textSecondary}>
          Landing page "{slug}" could not be found.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: meta.title }} />
      <LandingPageRenderer content={content} meta={meta} />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: spacing.xl,
    gap: spacing.sm,
  },
});
