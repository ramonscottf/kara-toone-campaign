import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, StatCard, Card } from '../../../src/components/ui';
import { fetchContacts } from '../../../src/api/contacts';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../src/theme';

const menuItems = [
  { label: 'Delegates', route: '/(tabs)/connect/delegates', icon: '🗳️', description: 'Track delegate contacts and support levels' },
  { label: 'Messages', route: '/(tabs)/connect/messages', icon: '💬', description: 'Communication log and templates' },
  { label: 'Precincts', route: '/(tabs)/connect/precincts', icon: '📍', description: 'Geographic canvassing data' },
  { label: 'Playbook', route: '/(tabs)/connect/playbook', icon: '📋', description: 'Campaign strategy and messaging guide' },
  { label: 'Forms', route: '/(tabs)/connect/forms', icon: '📝', description: 'Volunteer, yard sign, and contact forms' },
];

export default function ConnectDashboard() {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const contacts = data?.contacts || [];

  // KPIs
  const totalContacts = contacts.length;
  const delegates = contacts.filter(c => c.type?.includes('delegate')).length;
  const supportVotes = contacts.filter(
    c => c.support_level === 'strong-support' || c.support_level === 'leaning-support'
  ).length;
  const voteGap = delegates > 0 ? Math.round((delegates / 2) + 1) - supportVotes : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.navy} />
      }
    >
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.round((delegates / 2) + 1) || 0}</Text>
          <Text style={styles.statLabel}>Win Number</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.supportStrong }]}>{supportVotes}</Text>
          <Text style={styles.statLabel}>Safe Votes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: voteGap > 0 ? colors.red : colors.supportStrong }]}>
            {voteGap > 0 ? `-${voteGap}` : `+${Math.abs(voteGap)}`}
          </Text>
          <Text style={styles.statLabel}>Vote Gap</Text>
        </View>
      </View>

      {/* Quick KPIs */}
      <View style={styles.kpiRow}>
        <View style={{ flex: 1 }}>
          <StatCard label="Total Contacts" value={totalContacts} accentColor={colors.navy} />
        </View>
        <View style={{ flex: 1 }}>
          <StatCard label="Delegates" value={delegates} accentColor={colors.gold} />
        </View>
      </View>

      {/* Navigation Menu */}
      <Text variant="label" style={styles.sectionLabel}>Campaign Tools</Text>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(item.route as any);
          }}
          activeOpacity={0.7}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuRow}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuText}>
                <Text variant="h3">{item.label}</Text>
                <Text variant="caption">{item.description}</Text>
              </View>
              <Text style={styles.chevron}>{'›'}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
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
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: fonts.display,
    fontSize: fontSizes['2xl'],
    color: colors.white,
    lineHeight: fontSizes['2xl'] * 1.1,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.navy,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  menuCard: {
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 28,
  },
  menuText: {
    flex: 1,
    gap: spacing.xxs,
  },
  chevron: {
    fontSize: 24,
    color: colors.gray,
    fontWeight: '300',
  },
});
