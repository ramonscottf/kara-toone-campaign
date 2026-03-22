import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

export function TickerStrip() {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [scrollX]);

  const items = [...brand.tickerItems, ...brand.tickerItems]; // duplicate for seamless loop

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.ticker, { transform: [{ translateX: scrollX }] }]}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.text}>{item}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  ticker: {
    flexDirection: 'row',
    width: 3000,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  star: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
  },
  text: {
    fontFamily: fontFamilies.accent,
    fontSize: 14,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.9)',
  },
});
