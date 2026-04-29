import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card } from '../../../src/components/ui';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme';

const sections = [
  {
    title: 'Elevator Pitch',
    content: "Kara Toone is a lifelong Davis County resident, 30-year education leader, mother, and grandmother running for Utah House District 14. She brings real-world budget experience, deep community roots, and conservative values to the race. She's not a politician — she's your neighbor.",
  },
  {
    title: 'Key Talking Points',
    items: [
      '40+ years in Davis County — deep community roots',
      '30+ years in education — she knows the system from the inside',
      '$50M+ in budgets managed — real fiscal experience',
      'Lifelong Republican with proven conservative values',
      'Not a career politician — a public servant ready to serve',
    ],
  },
  {
    title: 'Contrast Messaging',
    content: "Focus on experience and roots. Kara has decades of real-world management experience, deep personal connections in every precinct, and a track record of fiscal responsibility. Ask: 'Who has actually balanced a budget? Who has actually served this community for decades?'",
  },
  {
    title: 'Delegate Approach',
    items: [
      'Lead with qualifications, not attacks',
      'Emphasize electability in the general election',
      'Highlight breadth of community support',
      "Share Kara's personal story — it resonates",
      'Ask for their support directly and confidently',
    ],
  },
  {
    title: 'Door-to-Door Tips',
    items: [
      'Introduce yourself as a neighbor supporting Kara',
      "Ask: 'What issues matter most to your family?'",
      'Connect their concerns to Kara\'s platform',
      'Leave a flyer or share a landing page link',
      "Follow up: 'Can Kara count on your support?'",
    ],
  },
  {
    title: 'Social Media Messaging',
    content: 'Share landing pages with personalized notes. Use the share button in the app — it opens AirDrop, Messages, and social apps. Focus on authenticity over polish. Real stories and real data beat flashy graphics.',
  },
];

export default function PlaybookScreen() {
  const { sys } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: sys.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="accent" color={'#EF4444'}>Campaign Playbook</Text>
        <Text variant="caption">Messaging guide for the Kara Toone campaign team</Text>
      </View>

      {sections.map((section, i) => (
        <Card key={i} style={styles.card}>
          <Text variant="h3" style={styles.cardTitle}>{section.title}</Text>
          {section.content && (
            <Text variant="body" style={[styles.cardBody, { color: sys.secondaryLabel }]}>{section.content}</Text>
          )}
          {section.items && (
            <View style={styles.list}>
              {section.items.map((item, j) => (
                <View key={j} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: '#EF4444' }]}>{'•'}</Text>
                  <Text variant="body" style={[styles.listText, { color: sys.secondaryLabel }]}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  header: { marginBottom: spacing.lg, gap: spacing.xs },
  card: { padding: spacing.base, marginBottom: spacing.md },
  cardTitle: { marginBottom: spacing.sm },
  cardBody: { lineHeight: 22 },
  list: { gap: spacing.sm },
  listItem: { flexDirection: 'row', gap: spacing.sm },
  bullet: { fontSize: 16, lineHeight: 22 },
  listText: { flex: 1, lineHeight: 22 },
});
