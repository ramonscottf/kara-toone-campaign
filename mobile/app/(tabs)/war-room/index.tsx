import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, StatCard, Card, Button } from '../../../src/components/ui';
import { fetchContacts, Contact } from '../../../src/api/contacts';
import { fetchMessageLog } from '../../../src/api/messages';
import { getSupportConfig, supportLevelConfig } from '../../../src/utils/supportColors';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../src/theme';

export default function WarRoomDashboard() {
  const router = useRouter();

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

  // Compute KPIs
  const totalContacts = contacts.length;
  const donors = contacts.filter(c => c.type?.includes('donor')).length;
  const totalRaised = '$0'; // Would come from a donations endpoint
  const volunteers = contacts.filter(c => c.type?.includes('volunteer')).length;
  const delegates = contacts.filter(c => c.type?.includes('delegate')).length;
  const yardSigns = contacts.filter(c => c.type?.includes('yardsign')).length;
  const commsSent = log.length;

  // Support breakdown
  const supportBreakdown = Object.entries(supportLevelConfig)
    .filter(([key]) => key !== '')
    .map(([key, config]) => ({
      key,
      label: config.label,
      color: config.color,
      count: contacts.filter(c => c.support_level === key).length,
    }))
    .filter(item => item.count > 0);

  const totalSupport = supportBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.navy} />
      }
    >
      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Total Contacts" value={totalContacts} accentColor={colors.navy} />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Volunteers" value={volunteers} accentColor={colors.red} />
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Delegates" value={delegates} accentColor={colors.gold} />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Yard Signs" value={yardSigns} accentColor={colors.navy} />
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <StatCard label="Donors" value={donors} accentColor={colors.red} />
          </View>
          <View style={styles.kpiItem}>
            <StatCard label="Comms Sent" value={commsSent} accentColor={colors.navy} />
          </View>
        </View>
      </View>

      {/* Delegate Support Breakdown */}
      <Card style={styles.chartCard}>
        <Text variant="h3" style={styles.chartTitle}>Delegate Support</Text>
        <View style={styles.chartBar}>
          {supportBreakdown.map(item => (
            <View
              key={item.key}
              style={[
                styles.barSegment,
                {
                  backgroundColor: item.color,
                  flex: item.count / totalSupport,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.legend}>
          {supportBreakdown.map(item => (
            <View key={item.key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}: {item.count}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Actions */}
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
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  kpiGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  kpiItem: {
    flex: 1,
  },
  chartCard: {
    padding: spacing.base,
    marginBottom: spacing.lg,
  },
  chartTitle: {
    marginBottom: spacing.md,
  },
  chartBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  barSegment: {
    height: '100%',
  },
  legend: {
    gap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});
