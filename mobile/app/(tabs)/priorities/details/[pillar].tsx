import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../src/theme/ThemeContext';
import { typography } from '../../../../src/theme/typography';
import { pillarColors } from '../../../../src/theme/colors';
import { getPillar } from '../../../../src/data/priorities';
import { brand } from '../../../../src/config/brand';
import type { PillarId } from '../../../../src/config/brand';

export default function PillarDetails() {
  const { pillar: pillarId } = useLocalSearchParams<{ pillar: string }>();
  const { sys } = useTheme();

  const pillar = getPillar(pillarId || '');
  if (!pillar) return null;

  const pc = pillarColors[pillar.id as PillarId];

  const handleShare = async () => {
    await Share.share({
      message: `${brand.candidateName} on ${pillar.title}: ${pillar.subtitle}. Learn more at ${brand.websiteUrl}`,
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: pc.primary }]}>
        <Text style={styles.headerTitle}>{pillar.title}</Text>
        <Text style={styles.headerSubtitle}>{pillar.subtitle}</Text>
      </View>

      {/* Sections */}
      {pillar.sections.map((section, i) => (
        <View key={i} style={styles.section}>
          <Text style={[styles.eyebrow, { color: pc.primary }]}>
            {section.eyebrow}
          </Text>
          <Text style={[styles.sectionTitle, { color: sys.label }]}>
            {section.title}
          </Text>
          <Text style={[styles.sectionContent, { color: sys.secondaryLabel }]}>
            {section.content}
          </Text>
        </View>
      ))}

      {/* Solutions Grid */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: sys.label }]}>
          Solutions
        </Text>
        <View style={styles.solutionsGrid}>
          {pillar.solutions.map((sol, i) => (
            <View
              key={i}
              style={[styles.solutionCard, { backgroundColor: sys.secondaryBackground }]}
            >
              <Text style={styles.solutionIcon}>{sol.icon}</Text>
              <Text style={[styles.solutionTitle, { color: sys.label }]}>
                {sol.title}
              </Text>
              <Text style={[styles.solutionDesc, { color: sys.secondaryLabel }]}>
                {sol.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Policy Commitments */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: sys.label }]}>
          Policy Commitments
        </Text>
        {pillar.policyCommitments.map((item, i) => (
          <View key={i} style={styles.commitmentRow}>
            <Ionicons name="checkmark-circle" size={20} color={pc.primary} />
            <Text style={[styles.commitmentText, { color: sys.label }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* Quotes */}
      {pillar.quotes.length > 0 && (
        <View style={styles.section}>
          {pillar.quotes.map((q, i) => (
            <View
              key={i}
              style={[styles.quoteBlock, { borderLeftColor: pc.primary }]}
            >
              <Text style={[styles.quoteText, { color: sys.label }]}>
                &ldquo;{q.quote}&rdquo;
              </Text>
              <Text style={[styles.quoteAttr, { color: sys.secondaryLabel }]}>
                — {q.attribution}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Share */}
      <Pressable style={[styles.shareBtn, { backgroundColor: pc.primary }]} onPress={handleShare}>
        <Ionicons name="share-outline" size={20} color="#FFFFFF" />
        <Text style={styles.shareBtnText}>Share This Priority</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    ...typography.title1,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    ...typography.subheadline,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  eyebrow: {
    ...typography.caption1,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionTitle: {
    ...typography.title3,
    marginBottom: 12,
  },
  sectionContent: {
    ...typography.body,
    lineHeight: 26,
  },
  solutionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  solutionCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  solutionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  solutionTitle: {
    ...typography.headline,
    marginBottom: 4,
  },
  solutionDesc: {
    ...typography.footnote,
    lineHeight: 18,
  },
  commitmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 12,
  },
  commitmentText: {
    ...typography.body,
    flex: 1,
    lineHeight: 24,
  },
  quoteBlock: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    marginTop: 16,
  },
  quoteText: {
    ...typography.callout,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAttr: {
    ...typography.footnote,
    marginTop: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  shareBtnText: {
    ...typography.headline,
    color: '#FFFFFF',
  },
});
