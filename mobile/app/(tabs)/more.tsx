import React from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';
import { colors } from '../../src/theme/colors';
import { fontFamilies } from '../../src/theme/typography';
import { brand } from '../../src/config/brand';
import Constants from 'expo-constants';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Image source={{ uri: brand.logoUrl }} style={styles.logo} contentFit="contain" />
        <Text style={styles.headerTitle}>{brand.campaignTitle}</Text>
      </View>

      {/* Auth Section */}
      <View style={styles.section}>
        {isAuthenticated ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginTitle}>Campaign Team</Text>
            <Text style={styles.loginDesc}>
              Sign in to access the War Room, Connect tools, and social media dashboard.
            </Text>
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.loginBtnText}>SIGN IN →</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK LINKS</Text>

        <MenuItem
          icon="❤️"
          title="Donate"
          subtitle="Support the campaign"
          onPress={() => router.push('/donate')}
        />
        <MenuItem
          icon="📸"
          title="Instagram"
          subtitle="@karatooneforutah"
          onPress={() => Linking.openURL(brand.socialLinks.instagram)}
        />
        <MenuItem
          icon="📘"
          title="Facebook"
          subtitle="Kara Toone for Utah"
          onPress={() => Linking.openURL(brand.socialLinks.facebook)}
        />
        <MenuItem
          icon="💰"
          title="Venmo"
          subtitle="@electkaratoone"
          onPress={() => Linking.openURL(brand.socialLinks.venmo)}
        />
        <MenuItem
          icon="🌐"
          title="Website"
          subtitle="kara.wickowaypoint.com"
          onPress={() => Linking.openURL(brand.websiteUrl)}
        />
        <MenuItem
          icon="✉️"
          title="Contact"
          subtitle={brand.contactEmail}
          onPress={() => Linking.openURL(`mailto:${brand.contactEmail}`)}
        />
      </View>

      {/* Sign Out */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Pressable
            style={styles.signOutBtn}
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut },
              ]);
            }}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      )}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>
          Version {Constants.expoConfig?.version || '1.0.0'}
        </Text>
        <Text style={styles.disclaimer}>{brand.footerDisclaimer}</Text>
        <Text style={styles.poweredBy}>{brand.poweredBy}</Text>
      </View>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F0',
  },
  logo: {
    width: 140,
    height: 42,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.gray,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E8F0',
    gap: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 22,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.navy,
  },
  profileEmail: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
  },
  roleText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.gold,
  },
  loginPrompt: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  loginTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loginDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 2,
  },
  loginBtnText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F0',
    gap: 14,
  },
  menuIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.navy,
  },
  menuSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  menuArrow: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    color: colors.gray,
  },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: 4,
  },
  signOutText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.red,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  appVersion: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
  },
  disclaimer: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 4,
  },
  poweredBy: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    color: colors.gray,
    textAlign: 'center',
  },
});
