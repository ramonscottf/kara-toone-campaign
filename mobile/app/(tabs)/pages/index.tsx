import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text, Card, Badge } from '../../../src/components/ui';
import { delegatePages, communityPages, LandingPageMeta } from '../../../src/data/landingPages';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../src/theme';

function PageCard({ page }: { page: LandingPageMeta }) {
  const router = useRouter();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(tabs)/pages/${page.slug}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Badge
            label={page.category === 'delegate' ? 'Delegate' : 'Community'}
            type={page.category === 'delegate' ? 'info' : 'accent'}
            size="sm"
          />
        </View>
        <Text variant="h3" style={styles.cardTitle}>{page.title}</Text>
        <Text variant="caption" numberOfLines={2}>{page.subtitle}</Text>
      </Card>
    </TouchableOpacity>
  );
}

export default function PagesIndex() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Convention Delegates */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLine} />
        <Text style={styles.sectionLabel}>Convention Delegates</Text>
      </View>
      <View style={styles.grid}>
        {delegatePages.map(page => (
          <PageCard key={page.slug} page={page} />
        ))}
      </View>

      {/* Community & Neighbors */}
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionLine, { backgroundColor: colors.gold }]} />
        <Text style={styles.sectionLabel}>Community & Neighbors</Text>
      </View>
      <View style={styles.grid}>
        {communityPages.map(page => (
          <PageCard key={page.slug} page={page} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionLine: {
    width: 20,
    height: 3,
    backgroundColor: colors.navy,
    borderRadius: 2,
  },
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    gap: spacing.sm,
  },
  card: {
    padding: spacing.base,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
});
