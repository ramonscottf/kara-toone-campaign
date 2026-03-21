import React from 'react';
import { ScrollView, View, StyleSheet, Share } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { Text, Card, Button } from '../../../src/components/ui';
import { colors, spacing } from '../../../src/theme';

const forms = [
  {
    title: 'Volunteer Sign-Up',
    description: 'Join the campaign team — canvassing, events, phone banks, and more.',
    url: 'https://kara.wickowaypoint.com/forms/get-involved',
  },
  {
    title: 'Yard Sign Request',
    description: "Request a Kara Toone yard sign for your home or business.",
    url: 'https://kara.wickowaypoint.com/forms/yard-sign',
  },
  {
    title: 'Contact Form',
    description: 'General contact and questions for the campaign.',
    url: 'https://kara.wickowaypoint.com/forms/contact',
  },
];

export default function FormsScreen() {
  const openForm = async (url: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(url);
  };

  const shareForm = async (title: string, url: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `${title} — Kara Toone for Utah House District 14`,
        url,
      });
    } catch {
      // User cancelled
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="caption" style={styles.intro}>
        Share these forms with voters, volunteers, and supporters. Submissions automatically sync to the CRM.
      </Text>

      {forms.map((form, i) => (
        <Card key={i} style={styles.card}>
          <Text variant="h3">{form.title}</Text>
          <Text variant="caption" style={styles.desc}>{form.description}</Text>
          <View style={styles.buttons}>
            <Button
              title="Open Form"
              variant="secondary"
              size="sm"
              onPress={() => openForm(form.url)}
              style={{ flex: 1 }}
            />
            <Button
              title="Share"
              variant="primary"
              size="sm"
              onPress={() => shareForm(form.title, form.url)}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  intro: { marginBottom: spacing.lg },
  card: { padding: spacing.base, marginBottom: spacing.md, gap: spacing.sm },
  desc: { marginBottom: spacing.xs },
  buttons: { flexDirection: 'row', gap: spacing.sm },
});
