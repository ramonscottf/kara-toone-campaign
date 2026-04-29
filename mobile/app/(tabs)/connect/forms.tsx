import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text, Card, Button } from '../../../src/components/ui';
import { useTheme } from '../../../src/theme/ThemeContext';
import { typography } from '../../../src/theme/typography';
import { spacing, borderRadius } from '../../../src/theme/spacing';
import { submitForm, FormType } from '../../../src/api/forms';

interface FormConfig {
  type: FormType;
  title: string;
  description: string;
  icon: string;
  fields: { key: string; label: string; placeholder: string; required?: boolean; multiline?: boolean }[];
}

const formConfigs: FormConfig[] = [
  {
    type: 'volunteer',
    title: 'Volunteer Sign-Up',
    description: 'Join the campaign team.',
    icon: '✋',
    fields: [
      { key: 'first_name', label: 'First Name', placeholder: 'Jane', required: true },
      { key: 'last_name', label: 'Last Name', placeholder: 'Smith', required: true },
      { key: 'email', label: 'Email', placeholder: 'jane@example.com', required: true },
      { key: 'phone', label: 'Phone', placeholder: '(801) 555-1234' },
    ],
  },
  {
    type: 'yardsign',
    title: 'Yard Sign Request',
    description: 'Get a yard sign for your home or business.',
    icon: '🪧',
    fields: [
      { key: 'first_name', label: 'First Name', placeholder: 'Jane', required: true },
      { key: 'last_name', label: 'Last Name', placeholder: 'Smith', required: true },
      { key: 'address', label: 'Address', placeholder: '123 Main St', required: true },
      { key: 'city', label: 'City', placeholder: 'Bountiful' },
      { key: 'zip', label: 'ZIP Code', placeholder: '84010' },
    ],
  },
  {
    type: 'cottage_meeting',
    title: 'Cottage Meeting RSVP',
    description: 'RSVP for a neighborhood meet-and-greet.',
    icon: '🏡',
    fields: [
      { key: 'first_name', label: 'First Name', placeholder: 'Jane', required: true },
      { key: 'last_name', label: 'Last Name', placeholder: 'Smith', required: true },
      { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
      { key: 'phone', label: 'Phone', placeholder: '(801) 555-1234' },
      { key: 'notes', label: 'Notes', placeholder: 'Any dietary needs or questions?', multiline: true },
    ],
  },
  {
    type: 'delegate_interest',
    title: 'Delegate Interest',
    description: 'Express interest in being a delegate.',
    icon: '🗳️',
    fields: [
      { key: 'first_name', label: 'First Name', placeholder: 'Jane', required: true },
      { key: 'last_name', label: 'Last Name', placeholder: 'Smith', required: true },
      { key: 'email', label: 'Email', placeholder: 'jane@example.com', required: true },
      { key: 'phone', label: 'Phone', placeholder: '(801) 555-1234' },
      { key: 'precinct', label: 'Precinct', placeholder: 'HD14-01' },
    ],
  },
];

export default function FormsScreen() {
  const { sys } = useTheme();
  const [activeForm, setActiveForm] = useState<FormConfig | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!activeForm) return;
    const missing = activeForm.fields
      .filter((f) => f.required && !values[f.key]?.trim())
      .map((f) => f.label);
    if (missing.length) {
      Alert.alert('Missing Fields', `Please fill in: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      await submitForm({ form_type: activeForm.type, ...values } as any);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Your form has been submitted.');
      setActiveForm(null);
      setValues({});
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (activeForm) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: sys.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.formContent}>
          <Text variant="title2" style={styles.formTitle}>
            {activeForm.icon} {activeForm.title}
          </Text>
          <Text variant="footnote" secondary style={styles.formDesc}>
            {activeForm.description}
          </Text>

          {activeForm.fields.map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text variant="caption1" style={{ color: sys.secondaryLabel, marginBottom: 6 }}>
                {field.label}
                {field.required ? ' *' : ''}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: sys.secondaryBackground,
                    color: sys.label,
                    borderColor: sys.separator,
                  },
                  field.multiline && styles.multiline,
                ]}
                placeholder={field.placeholder}
                placeholderTextColor={sys.tertiaryLabel}
                value={values[field.key] || ''}
                onChangeText={(t) => setValues((v) => ({ ...v, [field.key]: t }))}
                multiline={field.multiline}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                keyboardType={
                  field.key === 'email'
                    ? 'email-address'
                    : field.key === 'phone'
                      ? 'phone-pad'
                      : field.key === 'zip'
                        ? 'number-pad'
                        : 'default'
                }
              />
            </View>
          ))}

          <View style={styles.formActions}>
            <Button title="Submit" variant="primary" size="lg" loading={loading} onPress={handleSubmit} style={{ flex: 1 }} />
            <Button
              title="Cancel"
              variant="ghost"
              size="lg"
              onPress={() => {
                setActiveForm(null);
                setValues({});
              }}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: sys.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="footnote" secondary style={styles.intro}>
        Submit forms directly from the app. Responses sync to the CRM automatically.
      </Text>

      {formConfigs.map((form) => (
        <Card key={form.type} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIcon}>{form.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="title3">{form.title}</Text>
              <Text variant="footnote" secondary>{form.description}</Text>
            </View>
          </View>
          <Button
            title="Fill Out"
            variant="primary"
            size="sm"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveForm(form);
            }}
          />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: 120 },
  intro: { marginBottom: spacing.lg },
  card: { padding: spacing.base, marginBottom: spacing.md, gap: spacing.md },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardIcon: { fontSize: 32 },
  formContent: { padding: 20, paddingBottom: 120 },
  formTitle: { marginBottom: 4 },
  formDesc: { marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  input: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...typography.body,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: spacing.sm, marginTop: 24 },
});
