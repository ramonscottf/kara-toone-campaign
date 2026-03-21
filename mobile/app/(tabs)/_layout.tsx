import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../src/auth/AuthContext';
import { colors, fonts, fontSizes } from '../../src/theme';

// SF Symbol names for tab icons (iOS)
// We use emoji as cross-platform fallback; on a real iOS build these would be SF Symbols
const TAB_ICONS: Record<string, string> = {
  pages: '📄',
  'war-room': '🛡️',
  connect: '👥',
  cms: '✏️',
  settings: '⚙️',
};

export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role || 'volunteer';

  // Role hierarchy: admin > staff > volunteer
  const canSeeWarRoom = role === 'admin' || role === 'staff';
  const canSeeCms = role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemiBold,
          fontSize: fontSizes.xs,
        },
        headerStyle: {
          backgroundColor: colors.cream,
        },
        headerTitleStyle: {
          fontFamily: fonts.display,
          fontSize: fontSizes.lg,
          color: colors.deep,
        },
        headerShadowVisible: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      <Tabs.Screen
        name="pages"
        options={{
          title: 'Pages',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TAB_ICONS.pages} focused={focused} />
          ),
          headerTitle: 'Landing Pages',
        }}
      />
      <Tabs.Screen
        name="war-room"
        options={{
          title: 'War Room',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TAB_ICONS['war-room']} focused={focused} />
          ),
          headerTitle: 'War Room',
          href: canSeeWarRoom ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Connect',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TAB_ICONS.connect} focused={focused} />
          ),
          headerTitle: 'Campaign Connect',
        }}
      />
      <Tabs.Screen
        name="cms"
        options={{
          title: 'CMS',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TAB_ICONS.cms} focused={focused} />
          ),
          headerTitle: 'Content Manager',
          href: canSeeCms ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TAB_ICONS.settings} focused={focused} />
          ),
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  const React = require('react');
  const { Text: RNText } = require('react-native');
  return (
    <RNText style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icon}
    </RNText>
  );
}
