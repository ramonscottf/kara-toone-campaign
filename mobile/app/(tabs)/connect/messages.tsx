import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text, Card, Badge } from '../../../src/components/ui';
import { fetchMessageLog, MessageLogEntry } from '../../../src/api/messages';
import { colors, spacing, fonts, fontSizes } from '../../../src/theme';

export default function MessagesScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['messageLog'],
    queryFn: () => fetchMessageLog(),
  });

  const messages = data || [];

  const renderMessage = ({ item }: { item: MessageLogEntry }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Badge
          label={item.channel}
          type={item.channel === 'email' ? 'info' : 'accent'}
          size="sm"
        />
        <Text variant="caption">
          {new Date(item.sent_at).toLocaleDateString()}
        </Text>
      </View>
      <Text variant="body" numberOfLines={2}>
        {item.message_preview}
      </Text>
      <Text variant="caption" style={styles.status}>
        Status: {item.status}
      </Text>
    </Card>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item, i) => `${item.contact_id}-${item.sent_at}-${i}`}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text variant="h3" color={colors.textSecondary}>No Messages Yet</Text>
          <Text variant="caption">Communication log will appear here after sending blasts.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.navy} />
      }
    />
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
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
});
