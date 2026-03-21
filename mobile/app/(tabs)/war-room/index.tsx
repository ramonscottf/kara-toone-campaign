import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, StatCard, Card, Button } from '../../../src/components/ui';
import { fetchContacts } from '../../../src/api/contacts';
import { fetchMessageLog } from '../../../src/api/messages';
import { supportLevelConfig } from '../../../src/utils/supportColors';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { spacing, borderRadius } from '../../../src/theme/spacing';

export default function WarRoomDashboard() {
  const router = useRouter();
  const { sys } = useTheme();

  const { data: contactsData, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const { data: logData } = useQuery({
    queryKey: ['messageLog'],
    queryFn: () => fetchMessageLog(),
  });

  const contacts = contactsData?.contacts || [];
  const log = logData || [];

  const totalContacts = contacts.length;
  const donors = contacts.filter((c: any) => c.type?.includes('donor')).length;
  const volunteers = contacts.filter((c: any) => c.type?.includes('volunteer')).length;
  const delegates = contacts.filter((c: any) => c.type?.includes('delegate')).length;
  const yardSigns = contacts.filter((c: any) => c.type?.includes('yardsign')).length;
  const commsSent = log.length;

  const supportBreakdown = Object.entries(supportLevelConfig)
    .filter(([key]) => key !== '')
    .map(([key, config]: [string, any]) => ({
      key,
      label: config.label,
      color: config.color,
      count: contacts.filter((c: any) => c.support_level === key).length,
    }))
    .filter((item) => item.count > 0);

  const totalSupport = supportBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#0EA5E9" />
      }
    >
      <View style={styles.kpiGrid}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Total Contacts" value={totalContacts} accentColor="#0EA5E9" />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Volunteers" value={volunteers} accentColor="#EF4444" />
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Delegates" value={delegates} accentColor="#F97316" />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Yard Signs" value={yardSigns} accentColor="#10B981" />
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Donors" value={donors} accentColor="#8B5CF6" />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Comms Sent" value={commsSent} accentColor="#0EA5E9" />
          </View>
        </View>
      </View>

      <Card style={styles.chartCard}>
        <Text variant="title3">Delegate Support</Text>
        <View style={styles.chartBar}>
          {supportBreakdown.map((item) => (
            <View
              key={item.key}
              style={[
                styles.barSegment,
                { backgroundColor: item.color, flex: item.count / totalSupport },
              ]}
            />
          ))}
        </View>
        <View style={styles.legend}>
          {supportBreakdown.map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text variant="footnote" secondary>
                {item.label}: {item.count}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="View Contacts"
          variant="secondary"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/war-room/contacts');
          }}
          style={styles.actionButton}
        />
        <Button
          title="Email Blast"
          variant="primary"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/war-room/blast/email');
          }}
          style={styles.actionButton}
        />
        <Button
          title="SMS Blast"
          variant="primary"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/war-room/blast/sms');
          }}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: 120 },
  kpiGrid: { gap: spacing.sm, marginBottom: spacing.lg },
  kpiRow: { flexDirection: 'row', gap: spacing.sm },
  kpiItem: { flex: 1 },
  chartCard: { padding: spacing.base, marginBottom: spacing.lg, gap: spacing.md },
  chartBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barSegment: { height: '100%' },
  legend: { gap: spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  actions: { gap: spacing.sm },
  actionButton: { width: '100%' },
});
