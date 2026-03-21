import { Stack } from 'expo-router';
import { colors, fonts, fontSizes } from '../../../src/theme';

export default function ConnectLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTitleStyle: { fontFamily: fonts.display, fontSize: fontSizes.lg, color: colors.deep },
        headerShadowVisible: false,
        headerTintColor: colors.navy,
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Campaign Connect' }} />
      <Stack.Screen name="delegates" options={{ headerTitle: 'Delegates' }} />
      <Stack.Screen name="messages" options={{ headerTitle: 'Messages' }} />
      <Stack.Screen name="precincts" options={{ headerTitle: 'Precincts' }} />
      <Stack.Screen name="playbook" options={{ headerTitle: 'Playbook' }} />
      <Stack.Screen name="forms" options={{ headerTitle: 'Forms' }} />
    </Stack>
  );
}
