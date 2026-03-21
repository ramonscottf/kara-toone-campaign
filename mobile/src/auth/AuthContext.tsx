import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  saveToken,
  getToken,
  deleteToken,
  saveUser,
  getUser,
  deleteUser,
  UserData,
} from './storage';
import { apiClient } from '../api/client';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
}

interface AuthContextType extends AuthState {
  signInWithApple: () => Promise<void>;
  signInAsPreview: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  signInWithApple: async () => {},
  signInAsPreview: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        if (token && user) {
          setState({ isLoading: false, isAuthenticated: true, user });
        } else {
          setState({ isLoading: false, isAuthenticated: false, user: null });
        }
      } catch {
        setState({ isLoading: false, isAuthenticated: false, user: null });
      }
    })();
  }, []);

  const signInWithApple = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    try {
      const AppleAuthentication = require('expo-apple-authentication');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send identity token to our backend
      const response = await apiClient.post('/api/auth/apple', {
        identityToken: credential.identityToken,
        fullName: credential.fullName,
        email: credential.email,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Authentication failed');
      }

      const data = await response.json();

      // Store token and user data
      await saveToken(data.token);
      await saveUser(data.user);

      setState({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      throw error;
    }
  }, []);

  // Preview mode: skip auth for web/development previews
  const signInAsPreview = useCallback(async () => {
    const previewUser: UserData = {
      id: 'preview',
      email: 'preview@karatoone.com',
      name: 'Preview User',
      role: 'admin', // Show all tabs in preview
    };
    await saveToken('preview-token');
    await saveUser(previewUser);
    setState({ isLoading: false, isAuthenticated: true, user: previewUser });
  }, []);

  const signOut = useCallback(async () => {
    await deleteToken();
    await deleteUser();
    setState({ isLoading: false, isAuthenticated: false, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithApple,
        signInAsPreview,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
