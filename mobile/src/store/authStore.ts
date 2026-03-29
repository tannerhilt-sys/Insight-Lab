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
      // Handle both {user:{id,...}} and legacy flat {id, email, buddyName} formats
      const data = await api<{ user?: User; id?: string; email?: string; buddyName?: string }>('/auth/me');
      const user: User = {
        id: data.user?.id ?? data.id ?? '',
        email: data.user?.email ?? data.email ?? '',
        buddyName: data.user?.buddyName ?? data.buddyName ?? 'Buddy',
      };
      set({ token, user, isAuthenticated: true, isReady: true });
    } catch {
      await removeToken();
      set({ isReady: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Handle both nested {user:{id,email,buddyName}} and flat {userId,buddyName} formats
      const data = await api<{ token: string; user?: User; userId?: string; buddyName?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      });
      const user: User = {
        id: data.user?.id ?? data.userId ?? '',
        email: data.user?.email ?? email,
        buddyName: data.user?.buddyName ?? data.buddyName ?? 'Buddy',
      };
      await setToken(data.token);
      set({ token: data.token, user, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signup: async (email, password, buddyName, ageConfirmed) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api<{ token: string; user?: User; userId?: string; buddyName?: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, buddyName, ageConfirmed }),
        skipAuth: true,
      });
      const user: User = {
        id: data.user?.id ?? data.userId ?? '',
        email: data.user?.email ?? email,
        buddyName: data.user?.buddyName ?? data.buddyName ?? buddyName ?? 'Buddy',
      };
      await setToken(data.token);
      set({ token: data.token, user, isAuthenticated: true, isLoading: false });
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
