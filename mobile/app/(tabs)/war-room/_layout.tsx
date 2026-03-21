import { Stack } from 'expo-router';
import { colors, fonts, fontSizes } from '../../../src/theme';

export default function WarRoomLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTitleStyle: { fontFamily: fonts.display, fontSize: fontSizes.lg, color: colors.deep },
        headerShadowVisible: false,
        headerTintColor: colors.navy,
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
