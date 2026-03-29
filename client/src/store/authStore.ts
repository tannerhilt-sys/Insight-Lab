import { create } from 'zustand';
import { api } from '@/lib/api';

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
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    buddyName: string,
    ageConfirmed: boolean,
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateBuddyName: (name: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('finance-buddy-token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('finance-buddy-token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Handle both nested {user:{id,email,buddyName}} and legacy flat {userId,buddyName} formats
      const data = await api<{
        token: string;
        user?: { id: string; email: string; buddyName: string };
        userId?: string;
        buddyName?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      });
      const id = data.user?.id ?? data.userId ?? '';
      const userEmail = data.user?.email ?? email;
      const userBuddyName = data.user?.buddyName ?? data.buddyName ?? 'Buddy';
      localStorage.setItem('finance-buddy-token', data.token);
      set({
        token: data.token,
        user: { id, email: userEmail, buddyName: userBuddyName },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signup: async (email, password, buddyName, ageConfirmed) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api<{
        token: string;
        user?: { id: string; email: string; buddyName: string };
        userId?: string;
        buddyName?: string;
      }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, buddyName, ageConfirmed }),
        skipAuth: true,
      });
      const id = data.user?.id ?? data.userId ?? '';
      const userEmail = data.user?.email ?? email;
      const userBuddyName = data.user?.buddyName ?? data.buddyName ?? buddyName ?? 'Buddy';
      localStorage.setItem('finance-buddy-token', data.token);
      set({
        token: data.token,
        user: { id, email: userEmail, buddyName: userBuddyName },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('finance-buddy-token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      // Handle both {user:{id,...}} and legacy flat {id, email, buddyName} formats
      const data = await api<{
        user?: { id: string; email: string; buddyName: string };
        id?: string;
        email?: string;
        buddyName?: string;
      }>('/auth/me');
      const id = data.user?.id ?? data.id ?? '';
      const email = data.user?.email ?? data.email ?? '';
      const buddyName = data.user?.buddyName ?? data.buddyName ?? 'Buddy';
      set({ user: { id, email, buddyName }, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('finance-buddy-token');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateBuddyName: (name: string) => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, buddyName: name } });
    }
  },

  clearError: () => set({ error: null }),
}));
