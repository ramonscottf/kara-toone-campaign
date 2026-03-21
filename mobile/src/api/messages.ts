import { apiClient } from './client';

export interface SendEmailPayload {
  audience: string;
  subject: string;
  body: string;
  from_name?: string;
  reply_to?: string;
}

export interface SendSmsPayload {
  audience: string;
  message: string;
}

export interface SendResult {
  sent: number;
  failed: number;
  errors?: string[];
}

export interface MessageLogEntry {
  contact_id: string;
  channel: 'email' | 'sms';
  message_preview: string;
  sent_at: string;
  status: string;
}

export async function sendEmail(payload: SendEmailPayload): Promise<SendResult> {
  const res = await apiClient.post('/api/messages/email', payload);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to send email');
  }
  return res.json();
}

export async function sendSms(payload: SendSmsPayload): Promise<SendResult> {
  const res = await apiClient.post('/api/messages/sms', payload);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to send SMS');
  }
  return res.json();
}

export async function fetchMessageLog(params?: {
  contact_id?: string;
  channel?: string;
  since?: string;
}): Promise<MessageLogEntry[]> {
  const query = new URLSearchParams();
  if (params?.contact_id) query.set('contact_id', params.contact_id);
  if (params?.channel) query.set('channel', params.channel);
  if (params?.since) query.set('since', params.since);

  const path = `/api/messages/log${query.toString() ? '?' + query.toString() : ''}`;
  const res = await apiClient.get(path);
  if (!res.ok) throw new Error('Failed to fetch message log');
  const data = await res.json();
  return data.log || data;
}
