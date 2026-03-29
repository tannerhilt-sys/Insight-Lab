import { create } from 'zustand';
import { api, getToken, setToken, removeToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  buddyName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;

  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, buddyName: string, ageConfirmed: boolean) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isReady: false,
  error: null,

  init: async () => {
    const token = await getToken();
    if (!token) {
      set({ isReady: true });
      return;
    }
    try {
      const data = await api<{ user: User }>('/auth/me');
      set({ token, user: data.user, isAuthenticated: true, isReady: true });
    } catch {
      await removeToken();
      set({ isReady: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      });
      await setToken(data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signup: async (email, password, buddyName, ageConfirmed) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api<{ token: string; user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, buddyName, ageConfirmed }),
        skipAuth: true,
      });
      await setToken(data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await removeToken();
    set({ token: null, user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
