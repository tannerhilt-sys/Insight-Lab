import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Holding {
  id: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  companyName: string;
  addedAt: string;
}

interface PortfolioState {
  holdings: Holding[];
  watchlist: WatchlistItem[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  isLoading: boolean;
  error: string | null;

  fetchHoldings: () => Promise<void>;
  buyStock: (ticker: string, shares: number, price: number) => Promise<void>;
  sellStock: (ticker: string, shares: number) => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (ticker: string, companyName: string) => Promise<void>;
  removeFromWatchlist: (ticker: string) => Promise<void>;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: [],
  watchlist: [],
  totalValue: 0,
  totalCost: 0,
  totalGainLoss: 0,
  isLoading: false,
  error: null,

  fetchHoldings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api<{
        holdings: Holding[];
        totalValue: number;
        totalCost: number;
        totalGainLoss: number;
      }>('/portfolio/holdings');
      set({
        holdings: data.holdings,
        totalValue: data.totalValue,
        totalCost: data.totalCost,
        totalGainLoss: data.totalGainLoss,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load holdings';
      set({ isLoading: false, error: message });
    }
  },

  buyStock: async (ticker, shares, price) => {
    set({ error: null });
    try {
      // Server returns the updated/created holding directly (not wrapped in { holding })
      const holding = await api<Holding>('/portfolio/buy', {
        method: 'POST',
        body: JSON.stringify({ ticker, shares, price }),
      });
      // Re-fetch holdings so totals are recalculated server-side
      set((state) => {
        const idx = state.holdings.findIndex((h) => h.ticker === ticker.toUpperCase());
        const holdings =
          idx >= 0
            ? state.holdings.map((h, i) => (i === idx ? holding : h))
            : [...state.holdings, holding];
        const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue ?? 0), 0);
        const totalCost = holdings.reduce((sum, h) => sum + (h.costBasis ?? 0), 0);
        const totalGainLoss = Math.round((totalValue - totalCost) * 100) / 100;
        return { holdings, totalValue, totalCost, totalGainLoss };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to buy stock';
      set({ error: message });
      throw err;
    }
  },

  sellStock: async (ticker, shares) => {
    set({ error: null });
    try {
      // Wait for server confirmation before updating state
      await api<{ message: string; remainingShares: number }>('/portfolio/sell', {
        method: 'POST',
        body: JSON.stringify({ ticker, shares }),
      });
      // Update state only after successful server response
      set((state) => {
        const holdings = state.holdings
          .map((h) => (h.ticker === ticker.toUpperCase() ? { ...h, shares: h.shares - shares } : h))
          .filter((h) => h.shares > 0);
        const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue ?? 0), 0);
        const totalCost = holdings.reduce((sum, h) => sum + (h.costBasis ?? 0), 0);
        const totalGainLoss = Math.round((totalValue - totalCost) * 100) / 100;
        return { holdings, totalValue, totalCost, totalGainLoss };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sell stock';
      set({ error: message });
      throw err;
    }
  },

  fetchWatchlist: async () => {
    try {
      // Server returns WatchlistItem[] directly
      const items = await api<WatchlistItem[]>('/portfolio/watchlist');
      set({ watchlist: Array.isArray(items) ? items : [] });
    } catch {
      // keep existing watchlist
    }
  },

  addToWatchlist: async (ticker, companyName) => {
    set({ error: null });
    try {
      const item = await api<WatchlistItem>('/portfolio/watchlist', {
        method: 'POST',
        body: JSON.stringify({ ticker, companyName }),
      });
      set((state) => ({ watchlist: [...state.watchlist, item] }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add to watchlist';
      set({ error: message });
      throw err;
    }
  },

  removeFromWatchlist: async (ticker) => {
    set({ error: null });
    try {
      await api(`/portfolio/watchlist/${ticker}`, { method: 'DELETE' });
      set((state) => ({
        watchlist: state.watchlist.filter((w) => w.ticker !== ticker),
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove from watchlist';
      set({ error: message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
