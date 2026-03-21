import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, Card, Button, Badge } from '../../../../src/components/ui';
import { fetchContact, updateContact } from '../../../../src/api/contacts';
import { getSupportConfig } from '../../../../src/utils/supportColors';
import { useTheme } from '../../../../src/theme/ThemeContext';
import { typography } from '../../../../src/theme/typography';
import { spacing, borderRadius } from '../../../../src/theme';

const supportLevels = [
  'strong-support',
  'leaning-support',
  'undecided',
  'leaning-opponent',
  'strong-opponent',
  'not-contacted',
];

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { sys } = useTheme();

  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchContact(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (updates: Record<string, string>) => updateContact(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', id] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  if (isLoading || !contact) {
    return (
      <View style={[styles.loading, { backgroundColor: sys.background }]}>
        <Text variant="body" color={sys.secondaryLabel}>Loading...</Text>
      </View>
    );
  }

  const support = getSupportConfig(contact.support_level);
  const fullName = `${contact.first_name} ${contact.last_name}`.trim();

  return (
    <>
      <Stack.Screen options={{ headerTitle: fullName || 'Contact' }} />
      <ScrollView style={[styles.container, { backgroundColor: sys.background }]} contentContainerStyle={styles.content}>
        {/* Header card */}
        <Card style={styles.headerCard}>
          <View style={[styles.avatar, { backgroundColor: support.color + '20' }]}>
            <Text style={[styles.avatarText, { color: support.color }]}>
              {(contact.first_name?.[0] || '') + (contact.last_name?.[0] || '')}
            </Text>
          </View>
          <Text variant="h2">{fullName}</Text>
          {contact.type && (
            <Badge label={contact.type} type="info" />
          )}
        </Card>

        {/* Contact Info */}
        <Card style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>Contact Info</Text>
          {contact.email ? (
            <Button
              title={contact.email}
              variant="ghost"
              size="sm"
              onPress={() => Linking.openURL(`mailto:${contact.email}`)}
            />
          ) : null}
          {contact.phone ? (
            <Button
              title={contact.phone}
              variant="ghost"
              size="sm"
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
            />
          ) : null}
          {contact.address && (
            <Text variant="caption">{contact.address}, {contact.city} {contact.zip}</Text>
          )}
          {contact.precinct && (
            <Text variant="caption">Precinct: {contact.precinct}</Text>
          )}
        </Card>

        {/* Support Level */}
        <Card style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>Support Level</Text>
          <View style={styles.supportGrid}>
            {supportLevels.map(level => {
              const config = getSupportConfig(level);
              const isActive = contact.support_level === level;
              return (
                <Button
                  key={level}
                  title={config.label}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="sm"
                  style={[
                    styles.supportButton,
                    isActive && { backgroundColor: config.color },
                  ]}
                  onPress={() => mutation.mutate({ support_level: level })}
                />
              );
            })}
          </View>
        </Card>

        {/* Opt-in Status */}
        <Card style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>Communication Preferences</Text>
          <View style={styles.optRow}>
            <Text variant="body">Email opt-in:</Text>
            <Badge
              label={contact.opt_email === 'TRUE' || contact.opt_email === '1' ? 'Yes' : 'No'}
              type={contact.opt_email === 'TRUE' || contact.opt_email === '1' ? 'info' : 'default'}
              size="sm"
            />
          </View>
          <View style={styles.optRow}>
            <Text variant="body">Text opt-in:</Text>
            <Badge
              label={contact.opt_text === 'TRUE' || contact.opt_text === '1' ? 'Yes' : 'No'}
              type={contact.opt_text === 'TRUE' || contact.opt_text === '1' ? 'info' : 'default'}
              size="sm"
            />
          </View>
        </Card>

        {/* Notes */}
        {contact.notes ? (
          <Card style={styles.section}>
            <Text variant="label" style={styles.sectionLabel}>Notes</Text>
            <Text variant="body">{contact.notes}</Text>
          </Card>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
    gap: spacing.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title1,
  },
  section: {
    padding: spacing.base,
    gap: spacing.sm,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  supportButton: {
    minWidth: '45%',
  },
  optRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
