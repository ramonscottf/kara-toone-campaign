import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text, Button, FilterChipGroup } from '../../../../src/components/ui';
import { sendEmail } from '../../../../src/api/messages';
import { audienceOptions } from '../../../../src/utils/supportColors';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../../src/theme';

const mergeFields = ['{first_name}', '{last_name}', '{precinct}', '{city}'];

export default function EmailBlastScreen() {
  const router = useRouter();
  const [audience, setAudience] = useState('all-optin');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const insertMergeField = (field: string) => {
    setBody(prev => prev + field);
    Haptics.selectionAsync();
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      Alert.alert('Missing Fields', 'Please enter a subject and message body.');
      return;
    }

    Alert.alert(
      'Send Email Blast',
      `Send to "${audience}" audience?\n\nSubject: ${subject}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          style: 'destructive',
          onPress: async () => {
            setSending(true);
            try {
              const result = await sendEmail({
                audience,
                subject,
                body,
                from_name: 'Kara Toone Campaign',
                reply_to: 'votekaratoone@gmail.com',
              });
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                'Blast Sent!',
                `Sent: ${result.sent}\nFailed: ${result.failed}`,
                [{ text: 'Done', onPress: () => router.back() }]
              );
            } catch (err: any) {
              Alert.alert('Error', err.message);
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Audience */}
        <Text variant="label" style={styles.label}>Audience</Text>
        <FilterChipGroup options={audienceOptions} selected={audience} onSelect={setAudience} />

        {/* Subject */}
        <Text variant="label" style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Email subject line..."
          placeholderTextColor={colors.gray}
        />

        {/* Merge Fields */}
        <Text variant="label" style={styles.label}>Insert Merge Field</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mergeRow}>
          {mergeFields.map(field => (
            <Button
              key={field}
              title={field}
              variant="ghost"
              size="sm"
              onPress={() => insertMergeField(field)}
            />
          ))}
        </ScrollView>

        {/* Body */}
        <Text variant="label" style={styles.label}>Message Body</Text>
        <TextInput
          style={[styles.input, styles.bodyInput]}
          value={body}
          onChangeText={setBody}
          placeholder="Write your email message..."
          placeholderTextColor={colors.gray}
          multiline
          textAlignVertical="top"
        />

        {/* Send */}
        <Button
          title={sending ? 'Sending...' : 'Send Email Blast'}
          variant="primary"
          size="lg"
          onPress={handleSend}
          loading={sending}
          disabled={sending}
          style={styles.sendButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  label: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.base,
    color: colors.text,
  },
  bodyInput: {
    height: 200,
    paddingTop: spacing.md,
  },
  mergeRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sendButton: {
    marginTop: spacing.xl,
  },
});
