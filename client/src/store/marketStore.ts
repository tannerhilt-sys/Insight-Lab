import { create } from 'zustand';
import { api } from '@/lib/api';

// Matches what server/src/routes/market.js actually returns
export interface StockQuote {
  ticker: string;
  companyName: string;   // server sends companyName, not name
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

export interface SearchResult {
  ticker: string;
  companyName: string;  // server sends companyName, not name
  sector: string;       // server sends sector, not exchange
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  tickers: string[];
}

interface MarketState {
  quotes: Map<string, StockQuote>;
  searchResults: SearchResult[];
  news: NewsItem[];
  isSearching: boolean;
  error: string | null;

  fetchQuote: (ticker: string) => Promise<StockQuote | null>;
  searchStocks: (query: string) => Promise<void>;
  fetchNews: () => Promise<void>;
  clearError: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  quotes: new Map(),
  searchResults: [],
  news: [],
  isSearching: false,
  error: null,

  fetchQuote: async (ticker) => {
    try {
      const quote = await api<StockQuote>(`/market/quote/${encodeURIComponent(ticker)}`);
      set((state) => {
        const quotes = new Map(state.quotes);
        quotes.set(ticker.toUpperCase(), quote);
        return { quotes };
      });
      return quote;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quote';
      set({ error: message });
      return null;
    }
  },

  searchStocks: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true, error: null });
    try {
      const data = await api<{ results: SearchResult[] }>(
        `/market/search?q=${encodeURIComponent(query)}`,
      );
      set({ searchResults: data.results, isSearching: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      set({ isSearching: false, error: message });
    }
  },

  fetchNews: async () => {
    try {
      const data = await api<{ news: NewsItem[] }>('/market/news');
      set({ news: data.news });
    } catch {
      // keep existing news; non-critical
    }
  },

  clearError: () => set({ error: null }),
}));
