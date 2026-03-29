import { useState, useEffect, useRef } from 'react';
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
  StarOff,
  Sparkles,
  DollarSign,
  BarChart3,
  BookOpen,
  Activity,
  Clock,
  Zap,
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
import type { Holding, WatchlistItem } from '@/store/portfolioStore';

// Mock data
const mockHoldings: Holding[] = [
  { id: '1', ticker: 'AAPL', companyName: 'Apple Inc.', shares: 10, avgCost: 175.20, currentPrice: 192.45, gainLoss: 172.50, gainLossPercent: 9.84 },
  { id: '2', ticker: 'GOOGL', companyName: 'Alphabet Inc.', shares: 5, avgCost: 138.50, currentPrice: 155.72, gainLoss: 86.10, gainLossPercent: 12.44 },
  { id: '3', ticker: 'MSFT', companyName: 'Microsoft Corp.', shares: 8, avgCost: 380.00, currentPrice: 415.60, gainLoss: 284.80, gainLossPercent: 9.37 },
  { id: '4', ticker: 'TSLA', companyName: 'Tesla Inc.', shares: 3, avgCost: 260.00, currentPrice: 242.50, gainLoss: -52.50, gainLossPercent: -6.73 },
  { id: '5', ticker: 'AMZN', companyName: 'Amazon.com Inc.', shares: 6, avgCost: 178.30, currentPrice: 195.80, gainLoss: 105.00, gainLossPercent: 9.81 },
  { id: '6', ticker: 'NVDA', companyName: 'NVIDIA Corp.', shares: 4, avgCost: 480.00, currentPrice: 525.30, gainLoss: 181.20, gainLossPercent: 9.44 },
];

const mockWatchlist: WatchlistItem[] = [
  { ticker: 'META', name: 'Meta Platforms', price: 512.40, change: 8.20, changePercent: 1.63 },
  { ticker: 'NFLX', name: 'Netflix Inc.', price: 895.30, change: -12.50, changePercent: -1.38 },
  { ticker: 'AMD', name: 'AMD Inc.', price: 168.75, change: 3.45, changePercent: 2.09 },
  { ticker: 'DIS', name: 'Walt Disney Co.', price: 112.80, change: -1.20, changePercent: -1.05 },
];

const portfolioHistory = [
  { date: 'Oct', value: 10200 },
  { date: 'Nov', value: 10800 },
  { date: 'Dec', value: 11500 },
  { date: 'Jan', value: 11200 },
  { date: 'Feb', value: 12100 },
  { date: 'Mar', value: 12847 },
];

const searchableStocks = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 192.45 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 155.72 },
  { ticker: 'META', name: 'Meta Platforms', price: 512.40 },
  { ticker: 'NFLX', name: 'Netflix Inc.', price: 895.30 },
  { ticker: 'AMZN', name: 'Amazon.com', price: 195.80 },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 242.50 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 525.30 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 415.60 },
  { ticker: 'AMD', name: 'AMD Inc.', price: 168.75 },
  { ticker: 'DIS', name: 'Walt Disney', price: 112.80 },
  { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.30 },
  { ticker: 'V', name: 'Visa Inc.', price: 295.60 },
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
  const [holdings, setHoldings] = useState(mockHoldings);
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Holding | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<typeof searchableStocks[0] | null>(null);
  const [shares, setShares] = useState('');

  const totalValue = holdings.reduce((s, h) => s + h.currentPrice * h.shares, 0);
  const totalGainLoss = holdings.reduce((s, h) => s + h.gainLoss, 0);
  const totalCost = holdings.reduce((s, h) => s + h.avgCost * h.shares, 0);
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const filteredStocks = searchQuery
    ? searchableStocks.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleBuy = () => {
    if (!selectedStock || !shares) return;
    const numShares = parseInt(shares);
    const existing = holdings.find((h) => h.ticker === selectedStock.ticker);
    if (existing) {
      setHoldings((prev) =>
        prev.map((h) =>
          h.ticker === selectedStock.ticker
            ? {
                ...h,
                shares: h.shares + numShares,
                avgCost: (h.avgCost * h.shares + selectedStock.price * numShares) / (h.shares + numShares),
              }
            : h,
        ),
      );
    } else {
      setHoldings((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ticker: selectedStock.ticker,
          companyName: selectedStock.name,
          shares: numShares,
          avgCost: selectedStock.price,
          currentPrice: selectedStock.price,
          gainLoss: 0,
          gainLossPercent: 0,
        },
      ]);
    }
    setShowBuyModal(false);
    setSelectedStock(null);
    setSearchQuery('');
    setShares('');
  };

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist((prev) => prev.filter((w) => w.ticker !== ticker));
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm text-slate-500">Total Value</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
          <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-1 ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </p>
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
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setShowDetail(h)}
                >
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-semibold text-slate-900">{h.ticker}</span>
                      <p className="text-xs text-slate-400">{h.companyName}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-slate-700">{h.shares}</td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600">${h.avgCost.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-sm font-medium text-slate-900">${h.currentPrice.toFixed(2)}</td>
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
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDetail(h); }}
                      className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watchlist */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          Watchlist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {watchlist.map((item) => (
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
              <p className="text-xs text-slate-400 mb-2">{item.name}</p>
              <p className="font-semibold text-slate-900">${item.price?.toFixed(2)}</p>
              {item.changePercent !== undefined && (
                <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${item.changePercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </p>
              )}
            </div>
          ))}
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
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => { setSelectedStock(stock); setSearchQuery(stock.ticker); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-left">
                      <span className="font-semibold text-slate-900">{stock.ticker}</span>
                      <p className="text-xs text-slate-400">{stock.name}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">${stock.price.toFixed(2)}</span>
                  </button>
                ))}
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

              <button onClick={handleBuy} disabled={!shares || parseInt(shares) <= 0} className="btn-primary w-full">
                Buy {shares || 0} Shares
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Stock Detail Modal */}
      <Modal
        isOpen={!!showDetail}
        onClose={() => setShowDetail(null)}
        title={showDetail ? `${showDetail.ticker} - ${showDetail.companyName}` : ''}
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
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">AI Analysis</h4>
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
          </div>
        )}
      </Modal>
    </div>
  );
}
