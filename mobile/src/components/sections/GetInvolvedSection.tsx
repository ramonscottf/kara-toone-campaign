import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

export function GetInvolvedSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Involved</Text>

      <View style={styles.grid}>
        {brand.getInvolved.map((item, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => {
              if (item.title === 'Donate') router.push('/donate');
            }}
          >
            <View style={styles.topBorder} />
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.cardLink}>{item.action.toUpperCase()} →</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: colors.cream,
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.navy,
    marginBottom: 28,
    maxWidth: 300,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E0E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  cardPressed: {
    transform: [{ translateY: -4 }],
    shadowColor: 'rgba(13,31,60,0.1)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 60,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.red,
  },
  icon: {
    fontSize: 28,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 18,
    color: colors.navy,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: 20,
  },
  cardLink: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.red,
  },
});
