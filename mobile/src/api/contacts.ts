import { apiClient } from './client';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  precinct: string;
  type: string;
  source: string;
  confirmed: string;
  support_level: string;
  priority: string;
  contacted: string;
  contact_attempts: string;
  last_contact_date: string;
  email_opened: string;
  phone_answered: string;
  opt_email: string;
  opt_text: string;
  notes: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
}

export async function fetchContacts(params?: {
  search?: string;
  support?: string;
  type?: string;
  precinct?: string;
  priority?: string;
}): Promise<ContactsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.support) query.set('support', params.support);
  if (params?.type) query.set('type', params.type);
  if (params?.precinct) query.set('precinct', params.precinct);
  if (params?.priority) query.set('priority', params.priority);

  const path = `/api/contacts${query.toString() ? '?' + query.toString() : ''}`;
  const res = await apiClient.get(path);
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
}

export async function fetchContact(id: string): Promise<Contact> {
  const res = await apiClient.get(`/api/contacts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch contact');
  const data = await res.json();
  return data.contact || data;
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
  const res = await apiClient.patch(`/api/contacts/${id}`, updates);
  if (!res.ok) throw new Error('Failed to update contact');
  return res.json();
}

export async function deleteContact(id: string): Promise<void> {
  const res = await apiClient.delete(`/api/contacts/${id}`);
  if (!res.ok) throw new Error('Failed to delete contact');
}
