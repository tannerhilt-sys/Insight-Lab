import { create } from 'zustand';
import { api } from '@/lib/api';

export interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface SearchResult {
  ticker: string;
  name: string;
  exchange: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface MarketState {
  quotes: Map<string, StockQuote>;
  searchResults: SearchResult[];
  news: NewsItem[];
  isSearching: boolean;

  fetchQuote: (ticker: string) => Promise<StockQuote | null>;
  searchStocks: (query: string) => Promise<void>;
  fetchNews: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  quotes: new Map(),
  searchResults: [],
  news: [],
  isSearching: false,

  fetchQuote: async (ticker) => {
    try {
      const quote = await api<StockQuote>(`/market/quote/${ticker}`);
      set((state) => {
        const quotes = new Map(state.quotes);
        quotes.set(ticker, quote);
        return { quotes };
      });
      return quote;
    } catch {
      return null;
    }
  },

  searchStocks: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    try {
      const data = await api<{ results: SearchResult[] }>(
        `/market/search?q=${encodeURIComponent(query)}`,
      );
      set({ searchResults: data.results, isSearching: false });
    } catch {
      set({ isSearching: false });
    }
  },

  fetchNews: async () => {
    try {
      const data = await api<{ news: NewsItem[] }>('/market/news');
      set({ news: data.news });
    } catch {
      // keep empty
    }
  },
}));
