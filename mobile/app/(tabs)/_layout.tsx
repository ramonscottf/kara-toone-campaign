import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text as RNText, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { colors } from '../../src/theme/colors';
import { LiquidGlassView, isLiquidGlassSupported } from '../../src/components/ui/LiquidGlassView';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { user, isAuthenticated } = useAuth();
  const { sys, isDark } = useTheme();
  const role = user?.role || 'volunteer';
  const canSeeWarRoom = isAuthenticated && (role === 'admin' || role === 'staff');
  const canSeeConnect = isAuthenticated;
  const canSeeSocial = isAuthenticated && role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: isDark ? 'rgba(235,235,245,0.4)' : colors.gray,
        tabBarBackground: () => {
          if (Platform.OS !== 'ios') return null;
          // Use liquid glass for tab bar on iOS 26+
          if (isLiquidGlassSupported()) {
            return (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                glassStyle="regular"
              />
            );
          }
          // Fallback to blur
          return (
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          );
        },
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
          fontFamily: 'DMSans_500Medium',
          fontSize: 10,
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleStyle: {
          fontFamily: 'LeagueSpartan_700Bold',
          fontSize: 17,
          color: colors.navy,
        },
        headerShadowVisible: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      {/* ===== PUBLIC TABS ===== */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="priorities"
        options={{
          title: 'Priorities',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="⭐" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="•••" focused={focused} isText />,
        }}
      />

      {/* ===== ADMIN TABS (behind auth) ===== */}
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
          href: canSeeConnect ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon="📣" focused={focused} />,
          href: canSeeSocial ? undefined : null,
        }}
      />

      {/* ===== HIDDEN ROUTES ===== */}
      <Tabs.Screen name="settings" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="pages" options={{ href: null }} />
      <Tabs.Screen name="cms" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ icon, focused, isText }: { icon: string; focused: boolean; isText?: boolean }) {
  return (
    <RNText style={{
      fontSize: isText ? 16 : 22,
      opacity: focused ? 1 : 0.5,
      fontWeight: isText ? '900' : undefined,
      color: isText ? (focused ? colors.red : colors.gray) : undefined,
    }}>
      {icon}
    </RNText>
  );
}
