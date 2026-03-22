import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

const PHOTO_SIZE = 200;

const photos = [
  { uri: brand.images.americanFlag, caption: 'With students' },
  { uri: brand.images.communityParade, caption: 'Community parade' },
  { uri: brand.images.familyFormal, caption: 'The Toone family' },
  { uri: brand.images.politicalEvent, caption: 'Community event' },
  { uri: brand.images.bestOfState, caption: 'Best of State' },
  { uri: brand.images.coupleOutdoors, caption: 'Kara & Logan' },
  { uri: brand.images.communityEvent, caption: 'Community event' },
  { uri: brand.images.familyIceCream, caption: 'Family fun' },
];

export function PhotoGallery() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrowText}>COMMUNITY</Text>
        </View>
        <Text style={styles.title}>In the Community</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={PHOTO_SIZE + 12}
      >
        {photos.map((photo, i) => (
          <View key={i} style={styles.photoCard}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.photo}
              contentFit="cover"
              transition={300}
            />
            <Text style={styles.caption}>{photo.caption}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: colors.red,
  },
  eyebrowText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.red,
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    color: colors.navy,
  },
  scroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  photoCard: {
    width: PHOTO_SIZE,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.2,
    borderRadius: 4,
    backgroundColor: colors.light,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.gray,
    marginTop: 8,
  },
});
