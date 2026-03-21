import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, StatCard } from '../../../src/components/ui';
import { fetchContacts } from '../../../src/api/contacts';
import { useTheme } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme';

export default function PrecinctsScreen() {
  const { sys } = useTheme();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const contacts = data?.contacts || [];

  const precinctData = useMemo(() => {
    const map: Record<string, { total: number; contacted: number; support: number }> = {};
    contacts.forEach(c => {
      const p = c.precinct || 'Unknown';
      if (!map[p]) map[p] = { total: 0, contacted: 0, support: 0 };
      map[p].total++;
      if (c.contacted === 'TRUE' || c.contacted === '1') map[p].contacted++;
      if (c.support_level === 'strong-support' || c.support_level === 'leaning-support') {
        map[p].support++;
      }
    });
    return Object.entries(map)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, stats]) => ({ name, ...stats }));
  }, [contacts]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={'#0EA5E9'} />
      }
    >
      <View style={styles.summaryRow}>
        <View style={{ flex: 1 }}>
          <StatCard label="Total Precincts" value={precinctData.length} accentColor={'#0EA5E9'} />
        </View>
        <View style={{ flex: 1 }}>
          <StatCard label="Total Contacts" value={contacts.length} accentColor={'#EF4444'} />
        </View>
      </View>

      {precinctData.map(p => {
        const contactRate = p.total > 0 ? Math.round((p.contacted / p.total) * 100) : 0;
        return (
          <Card key={p.name} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text variant="h3">Precinct {p.name}</Text>
              <Text variant="caption">{p.total} contacts</Text>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.barBg, { backgroundColor: sys.fill }]}>
                <View style={[styles.barFill, { width: `${contactRate}%`, backgroundColor: '#0EA5E9' }]} />
              </View>
              <Text variant="caption">{contactRate}% contacted</Text>
            </View>
            <View style={styles.miniStats}>
              <Text variant="caption">Contacted: {p.contacted}</Text>
              <Text variant="caption">Supporting: {p.support}</Text>
            </View>
          </Card>
        );
      })}

      {precinctData.length === 0 && (
        <View style={styles.empty}>
          <Text variant="h3" color={sys.secondaryLabel}>No Precinct Data</Text>
          <Text variant="caption">Add precinct info to contacts to see breakdowns here.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  card: { padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  barContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  barBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  miniStats: { flexDirection: 'row', gap: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: spacing['3xl'], gap: spacing.sm },
});
