import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function WarRoomLayout() {
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
      <Stack.Screen name="index" options={{ headerTitle: 'War Room' }} />
      <Stack.Screen name="contacts/index" options={{ headerTitle: 'Contacts' }} />
      <Stack.Screen name="contacts/[id]" options={{ headerTitle: 'Contact Detail' }} />
      <Stack.Screen name="blast/email" options={{ headerTitle: 'Email Blast', presentation: 'modal' }} />
      <Stack.Screen name="blast/sms" options={{ headerTitle: 'SMS Blast', presentation: 'modal' }} />
    </Stack>
  );
}
