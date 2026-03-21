import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { systemColors, pillarColors } from './colors';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  isDark: boolean;
  sys: (typeof systemColors)['light'];
  pillar: (id: keyof typeof pillarColors) => (typeof pillarColors)[keyof typeof pillarColors];
}

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  isDark: false,
  sys: systemColors.light,
  pillar: (id) => pillarColors[id],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const colorScheme: ColorScheme = scheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      isDark: colorScheme === 'dark',
      sys: systemColors[colorScheme],
      pillar: (id: keyof typeof pillarColors) => pillarColors[id],
    }),
    [colorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
