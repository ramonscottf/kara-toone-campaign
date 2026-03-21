import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function PrioritiesLayout() {
  const { sys } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: sys.background },
        headerTintColor: '#0EA5E9',
        headerTitleStyle: { fontWeight: '600', fontSize: 17, color: sys.label },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Priorities' }} />
      <Stack.Screen name="[pillar]" options={{ headerTitle: '' }} />
      <Stack.Screen name="details/[pillar]" options={{ headerTitle: 'Details' }} />
    </Stack>
  );
}
