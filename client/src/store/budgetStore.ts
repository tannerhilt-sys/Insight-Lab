import { create } from 'zustand';
import { api } from '@/lib/api';

export interface BudgetEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface BudgetGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

interface BudgetTotals {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

interface BudgetState {
  entries: BudgetEntry[];
  totals: BudgetTotals;
  goals: BudgetGoal[];
  insight: string | null;
  isLoading: boolean;
  error: string | null;

  fetchEntries: (month?: string) => Promise<void>;
  addEntry: (data: Omit<BudgetEntry, 'id'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  fetchInsight: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (data: Pick<BudgetGoal, 'label' | 'targetAmount' | 'deadline'>) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  entries: [],
  totals: { totalIncome: 0, totalExpenses: 0, netSavings: 0 },
  goals: [],
  insight: null,
  isLoading: false,
  error: null,

  fetchEntries: async (month) => {
    set({ isLoading: true, error: null });
    try {
      const query = month ? `?month=${encodeURIComponent(month)}` : '';
      // Server returns { entries, totalIncome, totalExpenses, netSavings }
      const data = await api<BudgetEntry[] & { entries: BudgetEntry[]; totalIncome: number; totalExpenses: number; netSavings: number }>(
        `/budget/entries${query}`,
      );
      set({
        entries: data.entries,
        totals: {
          totalIncome: data.totalIncome,
          totalExpenses: data.totalExpenses,
          netSavings: data.netSavings,
        },
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load budget entries';
      set({ isLoading: false, error: message });
    }
  },

  addEntry: async (data) => {
    set({ error: null });
    try {
      const entry = await api<BudgetEntry>('/budget/entries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set((state) => {
        const entries = [...state.entries, entry];
        return { entries, totals: recalcTotals(entries) };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add entry';
      set({ error: message });
      throw err;
    }
  },

  deleteEntry: async (id) => {
    set({ error: null });
    try {
      await api(`/budget/entries/${id}`, { method: 'DELETE' });
      set((state) => {
        const entries = state.entries.filter((e) => e.id !== id);
        return { entries, totals: recalcTotals(entries) };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete entry';
      set({ error: message });
      throw err;
    }
  },

  fetchInsight: async () => {
    try {
      const data = await api<{ insight: string }>('/budget/insight');
      set({ insight: data.insight });
    } catch {
      // Keep existing insight rather than overwriting with misleading hardcoded text
      if (!get().insight) {
        set({ insight: 'Add your income and expenses to get personalized budget insights.' });
      }
    }
  },

  fetchGoals: async () => {
    try {
      // Server returns BudgetGoal[] directly
      const goals = await api<BudgetGoal[]>('/budget/goals');
      set({ goals: Array.isArray(goals) ? goals : [] });
    } catch {
      // keep existing goals
    }
  },

  addGoal: async (data) => {
    set({ error: null });
    try {
      const goal = await api<BudgetGoal>('/budget/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set((state) => ({ goals: [...state.goals, goal] }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add goal';
      set({ error: message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

function recalcTotals(entries: BudgetEntry[]): BudgetTotals {
  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  return { totalIncome, totalExpenses, netSavings: totalIncome - totalExpenses };
}
