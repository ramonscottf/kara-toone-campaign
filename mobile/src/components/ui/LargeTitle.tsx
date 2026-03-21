import React, { useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../theme/typography';
import { useTheme } from '../../theme/ThemeContext';

interface LargeTitleProps {
  title: string;
  children: React.ReactNode;
  scrollY?: Animated.SharedValue<number>;
  onRefresh?: () => void;
  refreshing?: boolean;
  contentPaddingBottom?: number;
}

export function LargeTitle({
  title,
  children,
  scrollY: externalScrollY,
  onRefresh,
  refreshing = false,
  contentPaddingBottom = 100,
}: LargeTitleProps) {
  const insets = useSafeAreaInsets();
  const { sys } = useTheme();
  const internalScrollY = useSharedValue(0);
  const scrollY = externalScrollY ?? internalScrollY;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 60],
      [0, -10],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={[styles.container, { backgroundColor: sys.background }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: contentPaddingBottom,
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <Animated.Text
          style={[styles.title, { color: sys.label }, titleStyle]}
        >
          {title}
        </Animated.Text>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...typography.largeTitle,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});
