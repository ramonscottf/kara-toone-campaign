import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { brand } from '../../config/brand';

export function EventsList() {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrow}>
        <View style={styles.eyebrowLine} />
        <Text style={styles.eyebrowText}>EVENTS</Text>
      </View>
      <Text style={styles.title}>Upcoming Events</Text>
      <Text style={styles.subtitle}>Meet Kara and get involved in the campaign.</Text>

      <View style={styles.list}>
        {brand.events.map((event, i) => (
          <View key={i} style={[styles.eventItem, i === 0 && styles.eventItemFirst]}>
            <View style={styles.dateCol}>
              <Text style={styles.month}>{event.month}</Text>
              <Text style={styles.day}>{event.day}</Text>
              <Text style={styles.weekday}>{event.weekday}</Text>
            </View>
            <View style={styles.detailsCol}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDesc}>{event.description}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>📍 {event.location}</Text>
                <Text style={styles.metaText}>🕐 {event.time}</Text>
              </View>
            </View>
            <Pressable style={styles.rsvpBtn}>
              <Text style={styles.rsvpText}>RSVP</Text>
            </Pressable>
          </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 15,
    color: colors.gray,
    marginBottom: 28,
    lineHeight: 22,
  },
  list: {
    gap: 0,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F0',
    gap: 20,
  },
  eventItemFirst: {
    borderTopWidth: 1,
    borderTopColor: '#E0E8F0',
  },
  dateCol: {
    width: 50,
    alignItems: 'center',
  },
  month: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.red,
  },
  day: {
    fontFamily: fontFamilies.accent,
    fontSize: 36,
    color: colors.navy,
    lineHeight: 40,
  },
  weekday: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  detailsCol: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 16,
    color: colors.navy,
    marginBottom: 4,
  },
  eventDesc: {
    fontFamily: fontFamilies.bodyLight,
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray,
  },
  rsvpBtn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 2,
  },
  rsvpText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.navy,
  },
});
