import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Text as RNText } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/auth/AuthContext';
import { Text, Card, Button, Badge } from '../../src/components/ui';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useTheme } from '../../src/theme/ThemeContext';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { brand } from '../../src/config/brand';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const { sys, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await signOut();
        },
      },
    ]);
  };

  const handleClearCache = async () => {
    queryClient.clear();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Cache Cleared', 'All cached data has been cleared.');
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    staff: 'Campaign Staff',
    volunteer: 'Volunteer',
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.groupedBackground }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <RNText style={[styles.pageTitle, { color: sys.label }]}>Settings</RNText>

      {/* Profile */}
      <GlassCard style={styles.profileCard} tint={isDark ? 'dark' : 'light'}>
        <View style={styles.avatar}>
          <RNText style={styles.avatarText}>
            {user?.name?.[0] || 'U'}
          </RNText>
        </View>
        <Text variant="title2">{user?.name || 'Campaign User'}</Text>
        <Text variant="footnote" secondary>
          {user?.email || 'No email'}
        </Text>
        <Badge
          label={roleLabel[user?.role || 'volunteer'] || 'Volunteer'}
          type="info"
        />
      </GlassCard>

      {/* Access Level */}
      <Card style={styles.section}>
        <Text variant="label">Your Access Level</Text>
        <Text variant="body" secondary style={styles.roleDescription}>
          {user?.role === 'admin' &&
            'Full access to all features including War Room, Campaign Connect, and all campaign tools.'}
          {user?.role === 'staff' &&
            'Access to War Room and Campaign Connect. Contact an admin for additional access.'}
          {user?.role === 'volunteer' &&
            'Access to Priorities and Campaign Connect. Contact campaign leadership for additional access.'}
        </Text>
      </Card>

      {/* Actions */}
      <Card style={styles.section}>
        <Text variant="label">App Management</Text>
        <Button
          title="Clear Cached Data"
          variant="secondary"
          onPress={handleClearCache}
          style={styles.actionButton}
        />
        <Button
          title="Sign Out"
          variant="danger"
          onPress={handleSignOut}
          style={styles.actionButton}
        />
      </Card>

      {/* About */}
      <Card style={styles.section}>
        <Text variant="label">About</Text>
        <View style={styles.aboutRow}>
          <Text variant="body">Version</Text>
          <Text variant="footnote" secondary>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text variant="body">Build</Text>
          <Text variant="footnote" secondary>
            {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
        <View style={styles.aboutRow}>
          <Text variant="body">SDK</Text>
          <Text variant="footnote" secondary>
            Expo {Constants.expoConfig?.sdkVersion || '55'}
          </Text>
        </View>
      </Card>

      <RNText style={[styles.footer, { color: sys.tertiaryLabel }]}>
        {brand.footerDisclaimer}
      </RNText>
      <RNText style={[styles.poweredBy, { color: sys.tertiaryLabel }]}>
        {brand.poweredBy}
      </RNText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 120, gap: 12 },
  pageTitle: {
    ...typography.largeTitle,
    marginBottom: 8,
  },
  profileCard: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title1,
    color: '#FFFFFF',
  },
  section: {
    padding: spacing.base,
    gap: spacing.md,
  },
  roleDescription: {
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    ...typography.caption1,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  poweredBy: {
    ...typography.caption2,
    textAlign: 'center',
    marginTop: 4,
  },
});
