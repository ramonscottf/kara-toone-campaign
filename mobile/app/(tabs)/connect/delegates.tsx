import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Badge } from '../../../src/components/ui';
import { fetchContacts, Contact } from '../../../src/api/contacts';
import { getSupportConfig } from '../../../src/utils/supportColors';
import { useTheme } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme';

export default function DelegatesScreen() {
  const { sys } = useTheme();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const delegates = useMemo(() => {
    return (data?.contacts || []).filter(c => c.type?.includes('delegate'));
  }, [data]);

  const renderDelegate = ({ item }: { item: Contact }) => {
    const support = getSupportConfig(item.support_level);
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: support.color }]} />
          <View style={styles.info}>
            <Text variant="bodyBold">
              {item.first_name} {item.last_name}
            </Text>
            {item.precinct && (
              <Text variant="caption">Precinct {item.precinct}</Text>
            )}
          </View>
          <Badge label={support.label} size="sm" />
        </View>
        {item.phone && <Text variant="caption" style={styles.contact}>{item.phone}</Text>}
        {item.email && <Text variant="caption" style={styles.contact}>{item.email}</Text>}
      </Card>
    );
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
      data={delegates}
      renderItem={renderDelegate}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <Text variant="caption" style={styles.count}>
          {delegates.length} delegates tracked
        </Text>
      }
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={'#0EA5E9'} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  count: {
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  info: {
    flex: 1,
  },
  contact: {
    marginTop: spacing.xs,
    marginLeft: spacing.lg,
  },
});
