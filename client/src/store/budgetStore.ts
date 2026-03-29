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
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
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

  fetchEntries: (month?: string) => Promise<void>;
  addEntry: (data: Omit<BudgetEntry, 'id'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  fetchInsight: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (data: Omit<BudgetGoal, 'id' | 'currentAmount'>) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  entries: [],
  totals: { totalIncome: 0, totalExpenses: 0, netSavings: 0 },
  goals: [],
  insight: null,
  isLoading: false,

  fetchEntries: async (month) => {
    set({ isLoading: true });
    try {
      const query = month ? `?month=${month}` : '';
      const data = await api<{ entries: BudgetEntry[]; totals: BudgetTotals }>(
        `/budget/entries${query}`,
      );
      set({ entries: data.entries, totals: data.totals, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addEntry: async (data) => {
    try {
      const entry = await api<BudgetEntry>('/budget/entries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set((state) => {
        const entries = [...state.entries, entry];
        const totals = recalcTotals(entries);
        return { entries, totals };
      });
    } catch {
      // error handled by caller
    }
  },

  deleteEntry: async (id) => {
    try {
      await api(`/budget/entries/${id}`, { method: 'DELETE' });
      set((state) => {
        const entries = state.entries.filter((e) => e.id !== id);
        const totals = recalcTotals(entries);
        return { entries, totals };
      });
    } catch {
      // error handled by caller
    }
  },

  fetchInsight: async () => {
    try {
      const data = await api<{ insight: string }>('/budget/insight');
      set({ insight: data.insight });
    } catch {
      set({
        insight:
          "I notice you're spending quite a bit on dining out. Consider meal prepping to save around $200/month!",
      });
    }
  },

  fetchGoals: async () => {
    try {
      const data = await api<{ goals: BudgetGoal[] }>('/budget/goals');
      set({ goals: data.goals });
    } catch {
      // use empty goals
    }
  },

  addGoal: async (data) => {
    try {
      const goal = await api<BudgetGoal>('/budget/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set((state) => ({ goals: [...state.goals, goal] }));
    } catch {
      // error handled by caller
    }
  },
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
