import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Holding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface WatchlistItem {
  ticker: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

interface PortfolioState {
  holdings: Holding[];
  watchlist: WatchlistItem[];
  totalValue: number;
  totalGainLoss: number;
  isLoading: boolean;

  fetchHoldings: () => Promise<void>;
  buyStock: (ticker: string, shares: number, price: number) => Promise<void>;
  sellStock: (ticker: string, shares: number) => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (ticker: string, name: string) => Promise<void>;
  removeFromWatchlist: (ticker: string) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: [],
  watchlist: [],
  totalValue: 0,
  totalGainLoss: 0,
  isLoading: false,

  fetchHoldings: async () => {
    set({ isLoading: true });
    try {
      const data = await api<{
        holdings: Holding[];
        totalValue: number;
        totalGainLoss: number;
      }>('/portfolio/holdings');
      set({
        holdings: data.holdings,
        totalValue: data.totalValue,
        totalGainLoss: data.totalGainLoss,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  buyStock: async (ticker, shares, price) => {
    try {
      const data = await api<{ holding: Holding }>('/portfolio/buy', {
        method: 'POST',
        body: JSON.stringify({ ticker, shares, price }),
      });
      set((state) => {
        const idx = state.holdings.findIndex((h) => h.ticker === ticker);
        const holdings =
          idx >= 0
            ? state.holdings.map((h, i) => (i === idx ? data.holding : h))
            : [...state.holdings, data.holding];
        const totalValue = holdings.reduce(
          (sum, h) => sum + h.currentPrice * h.shares,
          0,
        );
        const totalGainLoss = holdings.reduce((sum, h) => sum + h.gainLoss, 0);
        return { holdings, totalValue, totalGainLoss };
      });
    } catch {
      // error handled by caller
    }
  },

  sellStock: async (ticker, shares) => {
    try {
      await api('/portfolio/sell', {
        method: 'POST',
        body: JSON.stringify({ ticker, shares }),
      });
      set((state) => {
        const holdings = state.holdings
          .map((h) =>
            h.ticker === ticker ? { ...h, shares: h.shares - shares } : h,
          )
          .filter((h) => h.shares > 0);
        const totalValue = holdings.reduce(
          (sum, h) => sum + h.currentPrice * h.shares,
          0,
        );
        const totalGainLoss = holdings.reduce((sum, h) => sum + h.gainLoss, 0);
        return { holdings, totalValue, totalGainLoss };
      });
    } catch {
      // error handled by caller
    }
  },

  fetchWatchlist: async () => {
    try {
      const data = await api<{ watchlist: WatchlistItem[] }>(
        '/portfolio/watchlist',
      );
      set({ watchlist: data.watchlist });
    } catch {
      // error handled by caller
    }
  },

  addToWatchlist: async (ticker, name) => {
    try {
      await api('/portfolio/watchlist', {
        method: 'POST',
        body: JSON.stringify({ ticker, name }),
      });
      set((state) => ({
        watchlist: [...state.watchlist, { ticker, name }],
      }));
    } catch {
      // error handled by caller
    }
  },

  removeFromWatchlist: async (ticker) => {
    try {
      await api(`/portfolio/watchlist/${ticker}`, { method: 'DELETE' });
      set((state) => ({
        watchlist: state.watchlist.filter((w) => w.ticker !== ticker),
      }));
    } catch {
      // error handled by caller
    }
  },
}));
