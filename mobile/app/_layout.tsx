import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/auth/AuthContext';
import { ThemeProvider } from '../src/theme';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

let SplashScreen: any = null;
if (Platform.OS !== 'web') {
  SplashScreen = require('expo-splash-screen');
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen?.hideAsync().catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="donate"
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'Donate',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
