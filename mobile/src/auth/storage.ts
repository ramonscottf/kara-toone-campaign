import { Platform } from 'react-native';

const TOKEN_KEY = 'app_jwt_token';
const USER_KEY = 'app_user_data';

// Web-safe storage: use localStorage on web, expo-secure-store on native
let SecureStore: any = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

function webGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function webSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function webDelete(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    webSet(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webGet(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
  if (Platform.OS === 'web') {
    webDelete(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'volunteer';
}

export async function saveUser(user: UserData): Promise<void> {
  const data = JSON.stringify(user);
  if (Platform.OS === 'web') {
    webSet(USER_KEY, data);
  } else {
    await SecureStore.setItemAsync(USER_KEY, data);
  }
}

export async function getUser(): Promise<UserData | null> {
  let data: string | null;
  if (Platform.OS === 'web') {
    data = webGet(USER_KEY);
  } else {
    data = await SecureStore.getItemAsync(USER_KEY);
  }
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function deleteUser(): Promise<void> {
  if (Platform.OS === 'web') {
    webDelete(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}
