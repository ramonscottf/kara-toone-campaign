import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, StatCard, Card } from '../../../src/components/ui';
import { fetchContacts } from '../../../src/api/contacts';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { colors, spacing, borderRadius } from '../../../src/theme';

const menuItems = [
  { label: 'Delegates', route: '/(tabs)/connect/delegates', icon: '\uD83D\uDDF3\uFE0F', description: 'Track delegate contacts and support levels' },
  { label: 'Messages', route: '/(tabs)/connect/messages', icon: '\uD83D\uDCAC', description: 'Communication log and templates' },
  { label: 'Precincts', route: '/(tabs)/connect/precincts', icon: '\uD83D\uDCCD', description: 'Geographic canvassing data' },
  { label: 'Playbook', route: '/(tabs)/connect/playbook', icon: '\uD83D\uDCCB', description: 'Campaign strategy and messaging guide' },
  { label: 'Forms', route: '/(tabs)/connect/forms', icon: '\uD83D\uDCDD', description: 'Volunteer, yard sign, and contact forms' },
];

export default function ConnectDashboard() {
  const router = useRouter();
  const { sys } = useTheme();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const contacts = data?.contacts || [];
  const totalContacts = contacts.length;
  const delegates = contacts.filter((c: any) => c.type?.includes('delegate')).length;
  const supportVotes = contacts.filter(
    (c: any) => c.support_level === 'strong-support' || c.support_level === 'leaning-support',
  ).length;
  const voteGap = delegates > 0 ? Math.round(delegates / 2 + 1) - supportVotes : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#0EA5E9" />
      }
    >
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <RNText style={styles.statNumber}>{Math.round(delegates / 2 + 1) || 0}</RNText>
          <RNText style={styles.statLabel}>Win Number</RNText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <RNText style={[styles.statNumber, { color: '#34C759' }]}>{supportVotes}</RNText>
          <RNText style={styles.statLabel}>Safe Votes</RNText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <RNText style={[styles.statNumber, { color: voteGap > 0 ? '#FF3B30' : '#34C759' }]}>
            {voteGap > 0 ? `-${voteGap}` : `+${Math.abs(voteGap)}`}
          </RNText>
          <RNText style={styles.statLabel}>Vote Gap</RNText>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={{ flex: 1 }}>
          <StatCard label="Total Contacts" value={totalContacts} accentColor="#0EA5E9" />
        </View>
        <View style={{ flex: 1 }}>
          <StatCard label="Delegates" value={delegates} accentColor="#F97316" />
        </View>
      </View>

      <Text variant="label" style={styles.sectionLabel}>Campaign Tools</Text>
      {menuItems.map((item) => (
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
              <RNText style={styles.menuIcon}>{item.icon}</RNText>
              <View style={styles.menuText}>
                <Text variant="title3">{item.label}</Text>
                <Text variant="footnote" secondary>{item.description}</Text>
              </View>
              <RNText style={[styles.chevron, { color: sys.tertiaryLabel }]}>{'›'}</RNText>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: 120 },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: {
    ...typography.title1,
    color: '#FFFFFF',
  },
  statLabel: {
    ...typography.caption1,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  sectionLabel: { marginBottom: spacing.md },
  menuCard: { padding: spacing.base, marginBottom: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuIcon: { fontSize: 28 },
  menuText: { flex: 1, gap: spacing.xxs },
  chevron: { fontSize: 24, fontWeight: '300' },
});
