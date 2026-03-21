import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text as RNText } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';

export default function TabLayout() {
  const { user } = useAuth();
  const { sys, isDark } = useTheme();
  const role = user?.role || 'volunteer';
  const canSeeWarRoom = role === 'admin' || role === 'staff';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: isDark ? 'rgba(235,235,245,0.4)' : 'rgba(60,60,67,0.4)',
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarStyle: {
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: Platform.OS === 'ios'
            ? 'transparent'
            : isDark
              ? 'rgba(28,28,30,0.95)'
              : 'rgba(255,255,255,0.95)',
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: sys.background,
        },
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
          color: sys.label,
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
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="priorities"
        options={{
          title: 'Priorities',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="war-room"
        options={{
          title: 'War Room',
          tabBarIcon: ({ focused }) => <TabIcon icon="🛡️" focused={focused} />,
          headerTitle: 'War Room',
          href: canSeeWarRoom ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Connect',
          tabBarIcon: ({ focused }) => <TabIcon icon="👥" focused={focused} />,
          headerTitle: 'Campaign Connect',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
      {/* Hide old routes that still exist as files */}
      <Tabs.Screen name="pages" options={{ href: null }} />
      <Tabs.Screen name="cms" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <RNText style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icon}
    </RNText>
  );
}
