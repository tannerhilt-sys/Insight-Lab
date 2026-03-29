import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Minus,
  Eye,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Sparkles,
  DollarSign,
  BarChart3,
  BookOpen,
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  PieChart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Modal from '@/components/Modal';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import type { Holding } from '@/store/portfolioStore';

const portfolioHistory = [
  { date: 'Oct', value: 10200 },
  { date: 'Nov', value: 10800 },
  { date: 'Dec', value: 11500 },
  { date: 'Jan', value: 11200 },
  { date: 'Feb', value: 12100 },
  { date: 'Mar', value: 12847 },
];

// Live market simulation data
const MARKET_INDICES = [
  { name: 'S&P 500', ticker: 'SPX', basePrice: 5248.72 },
  { name: 'Dow Jones', ticker: 'DJI', basePrice: 39807.37 },
  { name: 'NASDAQ', ticker: 'IXIC', basePrice: 16379.46 },
  { name: 'Russell 2000', ticker: 'RUT', basePrice: 2124.55 },
];

const LIVE_STOCKS = [
  { ticker: 'AAPL', name: 'Apple', basePrice: 192.45 },
  { ticker: 'MSFT', name: 'Microsoft', basePrice: 415.60 },
  { ticker: 'GOOGL', name: 'Alphabet', basePrice: 155.72 },
  { ticker: 'AMZN', name: 'Amazon', basePrice: 195.80 },
  { ticker: 'NVDA', name: 'NVIDIA', basePrice: 525.30 },
  { ticker: 'TSLA', name: 'Tesla', basePrice: 242.50 },
  { ticker: 'META', name: 'Meta', basePrice: 512.40 },
  { ticker: 'JPM', name: 'JPMorgan', basePrice: 198.30 },
  { ticker: 'V', name: 'Visa', basePrice: 295.60 },
  { ticker: 'NFLX', name: 'Netflix', basePrice: 895.30 },
  { ticker: 'AMD', name: 'AMD', basePrice: 168.75 },
  { ticker: 'DIS', name: 'Disney', basePrice: 112.80 },
  { ticker: 'BA', name: 'Boeing', basePrice: 178.92 },
  { ticker: 'KO', name: 'Coca-Cola', basePrice: 61.34 },
  { ticker: 'WMT', name: 'Walmart', basePrice: 172.15 },
  { ticker: 'PFE', name: 'Pfizer', basePrice: 27.45 },
  { ticker: 'INTC', name: 'Intel', basePrice: 31.20 },
  { ticker: 'UBER', name: 'Uber', basePrice: 78.50 },
  { ticker: 'SQ', name: 'Block', basePrice: 82.40 },
  { ticker: 'COIN', name: 'Coinbase', basePrice: 225.80 },
];

const TRADE_FEED_TEMPLATES = [
  { action: 'BUY', size: 'Large' },
  { action: 'SELL', size: 'Large' },
  { action: 'BUY', size: 'Block' },
  { action: 'BUY', size: 'Medium' },
  { action: 'SELL', size: 'Medium' },
  { action: 'BUY', size: 'Small' },
];

function useLiveMarket() {
  const [prices, setPrices] = useState(() => {
    const initial: Record<string, { price: number; change: number; changePercent: number; prevPrice: number }> = {};
    LIVE_STOCKS.forEach((s) => {
      const change = (Math.random() - 0.48) * s.basePrice * 0.03;
      initial[s.ticker] = {
        price: s.basePrice + change,
        change,
        changePercent: (change / s.basePrice) * 100,
        prevPrice: s.basePrice,
      };
    });
    return initial;
  });

  const [indices, setIndices] = useState(() =>
    MARKET_INDICES.map((idx) => {
      const change = (Math.random() - 0.45) * idx.basePrice * 0.012;
      return { ...idx, price: idx.basePrice + change, change, changePercent: (change / idx.basePrice) * 100 };
    }),
  );

  const [trades, setTrades] = useState<{ id: number; ticker: string; action: string; shares: number; price: number; time: string }[]>([]);
  const tradeId = useRef(0);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setPrices((prev) => {
        const updated = { ...prev };
        // Update 3-5 random stocks each tick
        const count = 3 + Math.floor(Math.random() * 3);
        const tickers = Object.keys(updated);
        for (let i = 0; i < count; i++) {
          const ticker = tickers[Math.floor(Math.random() * tickers.length)];
          const stock = LIVE_STOCKS.find((s) => s.ticker === ticker)!;
          const delta = (Math.random() - 0.5) * stock.basePrice * 0.004;
          const prevPrice = updated[ticker].price;
          const newPrice = Math.max(stock.basePrice * 0.9, Math.min(stock.basePrice * 1.1, prevPrice + delta));
          const totalChange = newPrice - stock.basePrice;
          updated[ticker] = {
            price: newPrice,
            change: totalChange,
            changePercent: (totalChange / stock.basePrice) * 100,
            prevPrice,
          };
        }
        return updated;
      });

      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.5) * idx.basePrice * 0.001;
          const newPrice = idx.price + delta;
          const totalChange = newPrice - idx.basePrice;
          return { ...idx, price: newPrice, change: totalChange, changePercent: (totalChange / idx.basePrice) * 100 };
        }),
      );
    }, 2000);

    const tradeInterval = setInterval(() => {
      const stock = LIVE_STOCKS[Math.floor(Math.random() * LIVE_STOCKS.length)];
      const template = TRADE_FEED_TEMPLATES[Math.floor(Math.random() * TRADE_FEED_TEMPLATES.length)];
      const shares = template.size === 'Block' ? Math.floor(Math.random() * 5000) + 1000 :
                     template.size === 'Large' ? Math.floor(Math.random() * 500) + 100 :
                     template.size === 'Medium' ? Math.floor(Math.random() * 100) + 25 :
                     Math.floor(Math.random() * 25) + 1;
      const now = new Date();
      tradeId.current += 1;
      setTrades((prev) => [
        { id: tradeId.current, ticker: stock.ticker, action: template.action, shares, price: stock.basePrice + (Math.random() - 0.5) * 2, time: now.toLocaleTimeString() },
        ...prev.slice(0, 14),
      ]);
    }, 3000);

    return () => { clearInterval(priceInterval); clearInterval(tradeInterval); };
  }, []);

  return { prices, indices, trades };
}

export default function PortfolioPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';

  const {
    holdings,
    watchlist,
    analytics,
    totalValue,
    totalCost,
    totalGainLoss,
    isLoading,
    error: portfolioError,
    fetchHoldings,
    fetchWatchlist,
    fetchAnalytics,
    buyStock,
    sellStock: sellStockAction,
    removeFromWatchlist: removeFromWatchlistAction,
    clearError,
  } = usePortfolioStore();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Holding | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellTarget, setSellTarget] = useState<Holding | null>(null);
  const [sellShares, setSellShares] = useState('');
  const [sellStep, setSellStep] = useState<'input' | 'confirm'>('input');
  const [sellResult, setSellResult] = useState<{ proceeds: number; gainLoss: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; name: string; price: number } | null>(null);
  const [shares, setShares] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  useEffect(() => {
    fetchHoldings();
    fetchWatchlist();
    fetchAnalytics();
  }, [fetchHoldings, fetchWatchlist, fetchAnalytics]);

  // Get company name for a ticker from LIVE_STOCKS lookup
  const getCompanyName = useCallback((ticker: string) => {
    const stock = LIVE_STOCKS.find((s) => s.ticker === ticker);
    return stock?.name ?? ticker;
  }, []);

  const filteredStocks = searchQuery
    ? LIVE_STOCKS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleBuy = async () => {
    if (!selectedStock || !shares) return;
    const numShares = parseInt(shares);
    if (isNaN(numShares) || numShares <= 0) return;
    setIsBuying(true);
    try {
      await buyStock(selectedStock.ticker, numShares, selectedStock.price);
      await fetchHoldings();
      await fetchAnalytics();
      setShowBuyModal(false);
      setSelectedStock(null);
      setSearchQuery('');
      setShares('');
    } catch {
      // error shown via portfolioError
    } finally {
      setIsBuying(false);
    }
  };

  const openSellModal = (holding: Holding) => {
    setSellTarget(holding);
    setSellShares('');
    setSellStep('input');
    setSellResult(null);
    setShowSellModal(true);
  };

  const handleSell = async () => {
    if (!sellTarget || !sellShares) return;
    const numShares = parseInt(sellShares);
    if (isNaN(numShares) || numShares <= 0) return;
    setIsSelling(true);
    try {
      const result = await sellStockAction(sellTarget.ticker, numShares);
      await fetchAnalytics();
      setSellResult({ proceeds: result.saleProceeds, gainLoss: result.realizedGainLoss });
      setSellStep('input'); // reset for next time
      setShowSellModal(false);
      setSellTarget(null);
      setSellShares('');
    } catch {
      // error shown via portfolioError
    } finally {
      setIsSelling(false);
    }
  };

  const removeFromWatchlist = async (ticker: string) => {
    try {
      await removeFromWatchlistAction(ticker);
    } catch {
      // error shown via portfolioError
    }
  };

  const { prices: livePrices, indices: liveIndices, trades: liveTrades } = useLiveMarket();
  const tickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-8">
      {/* Live Market Ticker Bar */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">LIVE MARKET</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        {/* Scrolling ticker */}
        <div className="overflow-hidden relative">
          <div
            ref={tickerRef}
            className="flex gap-6 px-4 py-3 animate-[scroll_30s_linear_infinite] whitespace-nowrap"
            style={{ animationName: 'scroll' }}
          >
            {[...LIVE_STOCKS, ...LIVE_STOCKS].map((stock, i) => {
              const data = livePrices[stock.ticker];
              if (!data) return null;
              const isUp = data.change >= 0;
              const flash = Math.abs(data.price - data.prevPrice) > 0.01;
              return (
                <div key={`${stock.ticker}-${i}`} className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-white">{stock.ticker}</span>
                  <span className={`text-xs font-mono ${flash ? (isUp ? 'text-emerald-300' : 'text-red-300') : 'text-slate-300'}`}>
                    ${data.price.toFixed(2)}
                  </span>
                  <span className={`text-xs font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
                  </span>
                  <span className="text-slate-700 mx-1">|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {liveIndices.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <div key={idx.ticker} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">{idx.name}</span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900">{idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className={`text-xs mt-0.5 ${isUp ? 'text-emerald-500' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{idx.change.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Stock Prices & Trade Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Prices Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900">Live Stock Prices</h3>
            </div>
            <span className="text-xs text-slate-400">Updates every 2s</span>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Symbol</th>
                  <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Company</th>
                  <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Price</th>
                  <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Change</th>
                  <th className="text-right px-4 py-2.5 text-slate-500 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {LIVE_STOCKS.map((stock) => {
                  const data = livePrices[stock.ticker];
                  if (!data) return null;
                  const isUp = data.change >= 0;
                  const justChanged = Math.abs(data.price - data.prevPrice) > 0.01;
                  return (
                    <tr
                      key={stock.ticker}
                      className={`border-b border-slate-50 transition-colors ${justChanged ? (isUp ? 'bg-emerald-50/50' : 'bg-red-50/50') : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-4 py-2.5 font-bold text-slate-900">{stock.ticker}</td>
                      <td className="px-4 py-2.5 text-slate-600">{stock.name}</td>
                      <td className={`px-4 py-2.5 text-right font-mono font-semibold ${justChanged ? (isUp ? 'text-emerald-600' : 'text-red-500') : 'text-slate-900'}`}>
                        ${data.price.toFixed(2)}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}{data.change.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {isUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Trade Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-900">Live Trade Feed</h3>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-auto" />
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
            {liveTrades.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Waiting for trades...
              </div>
            )}
            {liveTrades.map((trade) => (
              <div key={trade.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${trade.action === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {trade.action}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{trade.ticker}</p>
                    <p className="text-xs text-slate-400">{trade.shares.toLocaleString()} shares @ ${trade.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">${(trade.shares * trade.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-slate-400">{trade.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {portfolioError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700">{portfolioError}</span>
          <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-slate-500">Total Value</span>
          </div>
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-100 animate-pulse rounded-lg" />
          ) : (
            <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${totalGainLoss >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <span className="text-sm text-slate-500">Total Gain/Loss</span>
          </div>
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-100 animate-pulse rounded-lg" />
          ) : (
            <>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-sm mt-1 ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </p>
            </>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">Holdings</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{holdings.length}</p>
          <p className="text-sm text-slate-500 mt-1">{holdings.reduce((s, h) => s + h.shares, 0)} total shares</p>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Portfolio Value</h3>
          <button onClick={() => setShowBuyModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Buy Stock
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={portfolioHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={['auto', 'auto']} />
            <Tooltip
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Stock</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Shares</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Avg Cost</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Gain/Loss</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">%</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No holdings yet. Buy your first stock above!
                  </td>
                </tr>
              )}
              {holdings.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setShowDetail(h)}
                >
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-semibold text-slate-900">{h.ticker}</span>
                      <p className="text-xs text-slate-400">{getCompanyName(h.ticker)}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-slate-700">{h.shares}</td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600">${h.avgCost.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-slate-900">${(h.currentPrice ?? 0).toFixed(2)}</td>
                  <td className={`py-3 px-4 text-right text-sm font-semibold ${h.gainLoss >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {h.gainLoss >= 0 ? '+' : ''}${h.gainLoss.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                        h.gainLossPercent >= 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {h.gainLossPercent >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(h.gainLossPercent).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDetail(h); }}
                        className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openSellModal(h); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Sell shares"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portfolio Analytics */}
      {analytics && analytics.sectorAllocation.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Portfolio Analytics</h3>
            <span className="ml-auto text-xs text-slate-400">Diversification Score: <span className={`font-bold ${analytics.diversificationScore >= 7 ? 'text-emerald-600' : analytics.diversificationScore >= 4 ? 'text-amber-600' : 'text-red-500'}`}>{analytics.diversificationScore}/10</span></span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Sector Allocation</p>
              <div className="space-y-2">
                {analytics.sectorAllocation.map((s) => (
                  <div key={s.sector} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-28 shrink-0">{s.sector}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${s.percent}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-12 text-right">{s.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Top Holdings by Weight</p>
              <div className="space-y-2">
                {analytics.topHoldings.map((h) => (
                  <div key={h.ticker} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm font-semibold text-slate-900">{h.ticker}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">${h.marketValue.toFixed(2)}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.weight > 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{h.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {analytics.concentrationScore > 40 && (
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  High concentration detected. Consider diversifying across more sectors.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Watchlist */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Watchlist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {watchlist.length === 0 && (
            <p className="col-span-4 text-sm text-slate-400 py-4 text-center">No stocks on your watchlist yet.</p>
          )}
          {watchlist.map((item) => {
            const liveData = livePrices[item.ticker];
            return (
            <div
              key={item.ticker}
              className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900">{item.ticker}</span>
                <button
                  onClick={() => removeFromWatchlist(item.ticker)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2">{item.companyName}</p>
              {liveData ? (
                <>
                  <p className="font-semibold text-slate-900">${liveData.price.toFixed(2)}</p>
                  <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${liveData.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {liveData.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {liveData.change >= 0 ? '+' : ''}{liveData.changePercent.toFixed(2)}%
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400">Price data not available</p>
              )}
            </div>
          );
          })}
        </div>
      </div>

      {/* Understanding the Stock Market */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Understanding the Stock Market
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* What are Stocks */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="p-2 bg-indigo-50 rounded-xl w-fit mb-3">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">What are Stocks?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stocks represent ownership shares in a company. When you buy a stock, you own a tiny piece of that business.
              If the company grows and profits increase, your shares typically become more valuable. Companies sell stocks
              to raise money for growth, and investors buy them hoping the value will increase over time.
            </p>
          </div>

          {/* How the Market Works */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="p-2 bg-emerald-50 rounded-xl w-fit mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">How the Market Works</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The stock market is like an auction house where buyers and sellers agree on prices. Stock prices change based
              on supply and demand — when more people want to buy a stock, its price goes up. When more want to sell,
              it goes down. Major exchanges like NYSE and NASDAQ facilitate millions of trades every day.
            </p>
          </div>

          {/* Why Invest */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-50 rounded-xl w-fit mb-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Why Invest?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Investing helps your money grow faster than a savings account. Historically, the S&P 500 has returned
              about 10% annually over the long term. That means $10,000 invested could grow to ~$67,000 in 20 years
              through compound growth — without adding a single dollar more.
            </p>
          </div>
        </div>
      </div>

      {/* Key Investing Concepts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Key Investing Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              term: 'Diversification',
              definition: "Don't put all your eggs in one basket. Spread investments across different companies, sectors, and asset types to reduce risk. If one stock drops, others may hold steady or rise.",
              icon: '🎯',
            },
            {
              term: 'Market Cap',
              definition: 'The total value of a company\'s shares. Large-cap ($10B+) companies like Apple are more stable. Small-cap companies are riskier but may grow faster.',
              icon: '📊',
            },
            {
              term: 'P/E Ratio',
              definition: 'Price-to-Earnings ratio shows how much investors pay per dollar of earnings. A high P/E (30+) may mean a stock is overvalued or investors expect high growth. A low P/E (10-15) may signal a bargain or slow growth.',
              icon: '📈',
            },
            {
              term: 'ETFs vs Individual Stocks',
              definition: 'ETFs (Exchange-Traded Funds) bundle many stocks together, giving instant diversification. For beginners, index ETFs like SPY (S&P 500) or VTI (Total Market) are often recommended over picking individual stocks.',
              icon: '📦',
            },
            {
              term: 'Bull vs Bear Markets',
              definition: 'A bull market means prices are rising and confidence is high. A bear market means prices are falling 20%+ from recent highs. Both are normal parts of the market cycle — bear markets create buying opportunities for patient investors.',
              icon: '🐂',
            },
            {
              term: 'Dollar-Cost Averaging',
              definition: 'Investing a fixed amount at regular intervals (e.g., $200/month) regardless of price. This strategy reduces the impact of volatility because you buy more shares when prices are low and fewer when prices are high.',
              icon: '💰',
            },
          ].map((concept) => (
            <div key={concept.term} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{concept.icon}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{concept.term}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{concept.definition}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Getting Started with Investing</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Learn First', desc: 'Understand the basics before putting money in. Use our Learn section to build your knowledge.', color: 'bg-blue-500' },
            { step: '2', title: 'Start with Paper Trading', desc: "Practice with simulated money here in Finance Buddy. There's no risk while you learn.", color: 'bg-indigo-500' },
            { step: '3', title: 'Begin Small', desc: 'When ready, start with index ETFs like SPY or VTI. Even $50/month makes a difference over time.', color: 'bg-purple-500' },
            { step: '4', title: 'Stay Consistent', desc: "Set up automatic investments. Time in the market beats timing the market. Don't panic sell during dips.", color: 'bg-emerald-500' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl p-4">
              <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3`}>
                {s.step}
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Levels */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Levels Explained</h3>
        <div className="space-y-3">
          {[
            { level: 'Low Risk', examples: 'Government bonds, CDs, high-yield savings', returnRange: '2-5%', color: 'bg-emerald-500', desc: 'Stable but lower returns. Good for money you need within 1-3 years.' },
            { level: 'Medium Risk', examples: 'Index ETFs, blue-chip stocks, balanced funds', returnRange: '6-10%', color: 'bg-amber-500', desc: 'Moderate growth with some ups and downs. Ideal for 5-10 year goals.' },
            { level: 'High Risk', examples: 'Individual growth stocks, small-caps, crypto', returnRange: '10-20%+', color: 'bg-red-500', desc: 'Potential for big gains but also significant losses. Only use money you can afford to lose.' },
          ].map((r) => (
            <div key={r.level} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`w-3 h-full min-h-[60px] ${r.color} rounded-full shrink-0`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900">{r.level}</h4>
                  <span className="text-sm font-medium text-slate-500">Expected: {r.returnRange}/yr</span>
                </div>
                <p className="text-sm text-slate-600 mb-1">{r.desc}</p>
                <p className="text-xs text-slate-400">Examples: {r.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Modal */}
      <Modal isOpen={showBuyModal} onClose={() => { setShowBuyModal(false); setSelectedStock(null); setSearchQuery(''); }} title="Buy Stock">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Search stocks</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedStock(null); }}
                className="input pl-10"
                placeholder="Search by ticker or company name..."
              />
            </div>
            {filteredStocks.length > 0 && !selectedStock && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredStocks.map((stock) => {
                  const livePrice = livePrices[stock.ticker]?.price ?? stock.basePrice;
                  return (
                  <button
                    key={stock.ticker}
                    onClick={() => { setSelectedStock({ ticker: stock.ticker, name: stock.name, price: livePrice }); setSearchQuery(stock.ticker); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-left">
                      <span className="font-semibold text-slate-900">{stock.ticker}</span>
                      <p className="text-xs text-slate-400">{stock.name}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">${livePrice.toFixed(2)}</span>
                  </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedStock && (
            <>
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-900">{selectedStock.ticker}</p>
                    <p className="text-sm text-primary-600">{selectedStock.name}</p>
                  </div>
                  <p className="text-xl font-bold text-primary-900">${selectedStock.price.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="input"
                  placeholder="Enter number of shares"
                  min="1"
                />
              </div>

              {shares && parseInt(shares) > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Cost</span>
                    <span className="font-semibold text-slate-900">
                      ${(selectedStock.price * parseInt(shares)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              <button onClick={handleBuy} disabled={!shares || parseInt(shares) <= 0 || isBuying} className="btn-primary w-full flex items-center justify-center gap-2">
                {isBuying ? <><Loader2 className="w-4 h-4 animate-spin" /> Buying...</> : `Buy ${shares || 0} Shares`}
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Sell Modal — double-confirmation flow */}
      <Modal
        isOpen={showSellModal}
        onClose={() => { setShowSellModal(false); setSellTarget(null); setSellShares(''); setSellStep('input'); }}
        title={sellTarget ? `Sell ${sellTarget.ticker}` : 'Sell Stock'}
      >
        {sellTarget && (
          <div className="space-y-5">
            {sellStep === 'input' && (
              <>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Ticker</p>
                      <p className="font-semibold text-slate-900">{sellTarget.ticker}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Shares Owned</p>
                      <p className="font-semibold text-slate-900">{sellTarget.shares}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Current Price</p>
                      <p className="font-semibold text-slate-900">${(sellTarget.currentPrice ?? 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Avg Cost</p>
                      <p className="font-semibold text-slate-900">${sellTarget.avgCost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Shares to sell</label>
                  <input
                    type="number"
                    value={sellShares}
                    onChange={(e) => setSellShares(e.target.value)}
                    className="input"
                    placeholder={`Max: ${sellTarget.shares}`}
                    min="1"
                    max={sellTarget.shares}
                  />
                </div>
                {sellShares && parseInt(sellShares) > 0 && parseInt(sellShares) <= sellTarget.shares && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Estimated Proceeds</span>
                      <span className="font-semibold text-slate-900">
                        ${((sellTarget.currentPrice ?? 0) * parseInt(sellShares)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Est. Gain/Loss</span>
                      <span className={`font-semibold ${((sellTarget.currentPrice ?? 0) - sellTarget.avgCost) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {((sellTarget.currentPrice ?? 0) - sellTarget.avgCost) >= 0 ? '+' : ''}
                        ${(((sellTarget.currentPrice ?? 0) - sellTarget.avgCost) * parseInt(sellShares)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { if (sellShares && parseInt(sellShares) > 0 && parseInt(sellShares) <= sellTarget.shares) setSellStep('confirm'); }}
                  disabled={!sellShares || parseInt(sellShares) <= 0 || parseInt(sellShares) > sellTarget.shares}
                  className="btn-primary w-full bg-amber-600 hover:bg-amber-700"
                >
                  Preview Sale
                </button>
              </>
            )}

            {sellStep === 'confirm' && (
              <>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Confirm Sale</p>
                      <p className="text-xs text-red-600 mt-1">
                        You are about to sell <strong>{sellShares} share(s)</strong> of <strong>{sellTarget.ticker}</strong> for approximately{' '}
                        <strong>${((sellTarget.currentPrice ?? 0) * parseInt(sellShares)).toFixed(2)}</strong>. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSellStep('input')} className="flex-1 btn bg-slate-100 text-slate-700 hover:bg-slate-200">
                    Go Back
                  </button>
                  <button
                    onClick={handleSell}
                    disabled={isSelling}
                    className="flex-1 btn bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    {isSelling ? <><Loader2 className="w-4 h-4 animate-spin" /> Selling...</> : <><CheckCircle className="w-4 h-4" /> Confirm & Sell</>}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Stock Detail Modal */}
      <Modal
        isOpen={!!showDetail}
        onClose={() => setShowDetail(null)}
        title={showDetail ? `${showDetail.ticker} — ${getCompanyName(showDetail.ticker)}` : ''}
      >
        {showDetail && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Current Price</p>
                <p className="text-lg font-bold text-slate-900">${showDetail.currentPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Avg Cost</p>
                <p className="text-lg font-bold text-slate-900">${showDetail.avgCost.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Shares Owned</p>
                <p className="text-lg font-bold text-slate-900">{showDetail.shares}</p>
              </div>
              <div className={`p-3 rounded-xl ${showDetail.gainLoss >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <p className="text-xs text-slate-500">Gain/Loss</p>
                <p className={`text-lg font-bold ${showDetail.gainLoss >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {showDetail.gainLoss >= 0 ? '+' : ''}${showDetail.gainLoss.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{buddyName}'s Analysis</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {showDetail.ticker} has shown {showDetail.gainLossPercent >= 0 ? 'positive' : 'negative'} momentum
                    with a {Math.abs(showDetail.gainLossPercent).toFixed(1)}% {showDetail.gainLossPercent >= 0 ? 'gain' : 'loss'} from
                    your cost basis. {showDetail.gainLossPercent >= 5
                      ? 'Consider taking some profits if this position exceeds 20% of your portfolio.'
                      : showDetail.gainLossPercent < 0
                      ? 'This may be a buying opportunity if you still believe in the long-term thesis.'
                      : 'Hold steady and continue monitoring for entry/exit signals.'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowDetail(null); openSellModal(showDetail); }}
              className="w-full btn bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2"
            >
              <Minus className="w-4 h-4" />
              Sell Shares
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
