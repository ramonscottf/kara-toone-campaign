import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

export function StatsBar() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {brand.stats.map((stat, i) => (
          <View key={i} style={[styles.item, i < brand.stats.length - 1 && styles.itemBorder]}>
            <Text style={styles.number}>{stat.number}</Text>
            <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navy,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  number: {
    fontFamily: fontFamilies.accent,
    fontSize: 40,
    color: colors.gold,
    lineHeight: 44,
    marginBottom: 6,
  },
  label: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
