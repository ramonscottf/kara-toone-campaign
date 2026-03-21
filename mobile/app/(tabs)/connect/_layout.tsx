import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function ConnectLayout() {
  const { sys } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: sys.background },
        headerTitleStyle: { fontWeight: '600', fontSize: 17, color: sys.label },
        headerShadowVisible: false,
        headerTintColor: '#0EA5E9',
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
