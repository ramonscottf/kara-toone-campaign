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
import { sendSms } from '../../../../src/api/messages';
import { audienceOptions } from '../../../../src/utils/supportColors';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../../src/theme';

const SMS_LIMIT = 160;
const mergeFields = ['{first_name}', '{last_name}', '{precinct}', '{city}'];

export default function SmsBlastScreen() {
  const router = useRouter();
  const [audience, setAudience] = useState('all-optin');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const charCount = message.length;
  const isOverLimit = charCount > SMS_LIMIT;

  const insertMergeField = (field: string) => {
    setMessage(prev => prev + field);
    Haptics.selectionAsync();
  };

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter a message.');
      return;
    }

    Alert.alert(
      'Send SMS Blast',
      `Send to "${audience}" audience?\n\n${charCount} characters`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          style: 'destructive',
          onPress: async () => {
            setSending(true);
            try {
              const result = await sendSms({ audience, message });
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

        {/* Message */}
        <Text variant="label" style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your SMS message..."
          placeholderTextColor={colors.gray}
          multiline
          textAlignVertical="top"
          maxLength={320}
        />
        <Text
          style={[styles.charCount, isOverLimit && styles.charCountOver]}
        >
          {charCount}/{SMS_LIMIT} characters
          {isOverLimit && ' (will be split into multiple messages)'}
        </Text>

        {/* Send */}
        <Button
          title={sending ? 'Sending...' : 'Send SMS Blast'}
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
  messageInput: {
    height: 150,
    paddingTop: spacing.md,
  },
  mergeRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  charCount: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  charCountOver: {
    color: colors.red,
  },
  sendButton: {
    marginTop: spacing.xl,
  },
});
