import React from 'react';
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { colors, borderRadius, spacing, fonts, fontSizes } from '../../theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.text, active && styles.textActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FilterChipGroupProps {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChipGroup({ options, selected, onSelect }: FilterChipGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.group}
    >
      {options.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          active={selected === opt.value}
          onPress={() => onSelect(opt.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.navy,
  },
  textActive: {
    color: colors.white,
  },
  group: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});
