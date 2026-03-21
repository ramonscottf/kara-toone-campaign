import { apiClient } from './client';

export type FormType =
  | 'volunteer'
  | 'yardsign'
  | 'contact'
  | 'cottage_meeting'
  | 'delegate_interest';

export interface FormSubmission {
  form_type: FormType;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  precinct?: string;
  notes?: string;
}

export async function submitForm(data: FormSubmission): Promise<{ success: boolean; message?: string }> {
  const res = await apiClient.post('/api/forms/submit', data);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Form submission failed');
  }
  return res.json();
}
