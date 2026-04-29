import { Stack } from 'expo-router';
import { colors, fonts, fontSizes } from '../../../src/theme';

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTitleStyle: { fontFamily: fonts.display, fontSize: fontSizes.lg, color: colors.deep },
        headerShadowVisible: false,
        headerTintColor: colors.navy,
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Landing Pages' }} />
      <Stack.Screen name="[slug]" options={{ headerTitle: '' }} />
    </Stack>
  );
}
