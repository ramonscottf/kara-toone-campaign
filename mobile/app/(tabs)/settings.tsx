import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useAuth } from '../../src/auth/AuthContext';
import { Text, Card, Button, Badge } from '../../src/components/ui';
import { colors, spacing, fonts, fontSizes } from '../../src/theme';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await signOut();
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    queryClient.clear();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Cache Cleared', 'All cached data has been cleared.');
  };

  const roleLabel = {
    admin: 'Administrator',
    staff: 'Campaign Staff',
    volunteer: 'Volunteer',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0] || 'U'}
          </Text>
        </View>
        <Text variant="h2">{user?.name || 'Campaign User'}</Text>
        <Text variant="caption">{user?.email || 'No email'}</Text>
        <Badge
          label={roleLabel[user?.role || 'volunteer'] || 'Volunteer'}
          type="info"
        />
      </Card>

      {/* Role Info */}
      <Card style={styles.section}>
        <Text variant="label">Your Access Level</Text>
        <Text variant="body" style={styles.roleDescription}>
          {user?.role === 'admin' && 'Full access to all features including War Room, Campaign Connect, CMS editing, and all campaign tools.'}
          {user?.role === 'staff' && 'Access to War Room and Campaign Connect. Contact an admin for CMS editing access.'}
          {user?.role === 'volunteer' && 'Access to Landing Pages and Campaign Connect. Contact campaign leadership for additional access.'}
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
          <Text variant="caption">1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text variant="body">Build</Text>
          <Text variant="caption">{Constants.expoConfig?.version || '1.0.0'}</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text variant="body">SDK</Text>
          <Text variant="caption">Expo {Constants.expoConfig?.sdkVersion || '55'}</Text>
        </View>
      </Card>

      <Text style={styles.footer}>
        Paid for by Kara Toone for Utah House District 14
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.base, paddingBottom: spacing['3xl'], gap: spacing.md },
  profileCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.display,
    fontSize: fontSizes.xl,
    color: colors.white,
  },
  section: {
    padding: spacing.base,
    gap: spacing.md,
  },
  roleDescription: {
    color: colors.textSecondary,
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
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
