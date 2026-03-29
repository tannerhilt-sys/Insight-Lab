import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Base stock data with realistic prices
const STOCKS = {
  AAPL:  { name: 'Apple Inc.',                  sector: 'Technology',        basePrice: 189.84 },
  GOOGL: { name: 'Alphabet Inc.',               sector: 'Technology',        basePrice: 176.43 },
  MSFT:  { name: 'Microsoft Corporation',       sector: 'Technology',        basePrice: 420.55 },
  AMZN:  { name: 'Amazon.com Inc.',             sector: 'Consumer Cyclical', basePrice: 186.49 },
  TSLA:  { name: 'Tesla Inc.',                  sector: 'Automotive',        basePrice: 248.42 },
  NVDA:  { name: 'NVIDIA Corporation',          sector: 'Technology',        basePrice: 875.28 },
  META:  { name: 'Meta Platforms Inc.',          sector: 'Technology',        basePrice: 505.95 },
  JPM:   { name: 'JPMorgan Chase & Co.',        sector: 'Financial',         basePrice: 198.47 },
  V:     { name: 'Visa Inc.',                   sector: 'Financial',         basePrice: 279.08 },
  DIS:   { name: 'The Walt Disney Company',     sector: 'Communication',     basePrice: 112.03 },
  NFLX:  { name: 'Netflix Inc.',                sector: 'Communication',     basePrice: 628.12 },
  KO:    { name: 'The Coca-Cola Company',       sector: 'Consumer Staples',  basePrice: 61.35 },
  PEP:   { name: 'PepsiCo Inc.',                sector: 'Consumer Staples',  basePrice: 172.74 },
  WMT:   { name: 'Walmart Inc.',                sector: 'Consumer Staples',  basePrice: 165.23 },
  JNJ:   { name: 'Johnson & Johnson',           sector: 'Healthcare',        basePrice: 156.74 },
  UNH:   { name: 'UnitedHealth Group Inc.',     sector: 'Healthcare',        basePrice: 527.40 },
  BA:    { name: 'The Boeing Company',          sector: 'Industrials',       basePrice: 204.89 },
  INTC:  { name: 'Intel Corporation',           sector: 'Technology',        basePrice: 43.89 },
  AMD:   { name: 'Advanced Micro Devices Inc.', sector: 'Technology',        basePrice: 174.53 },
  SPY:   { name: 'SPDR S&P 500 ETF Trust',     sector: 'ETF',               basePrice: 511.68 },
};

function generateQuote(ticker) {
  const stock = STOCKS[ticker];
  if (!stock) return null;

  const changePercent = (Math.random() - 0.48) * 4; // -1.92% to +2.08% range
  const change = Math.round(stock.basePrice * (changePercent / 100) * 100) / 100;
  const price = Math.round((stock.basePrice + change) * 100) / 100;
  const high = Math.round((price + Math.random() * price * 0.015) * 100) / 100;
  const low = Math.round((price - Math.random() * price * 0.015) * 100) / 100;
  const volume = Math.floor(5_000_000 + Math.random() * 45_000_000);

  return {
    ticker,
    companyName: stock.name,
    sector: stock.sector,
    price,
    change,
    changePercent: Math.round(changePercent * 100) / 100,
    high,
    low,
    open: Math.round((stock.basePrice + (Math.random() - 0.5) * 2) * 100) / 100,
    previousClose: stock.basePrice,
    volume,
    marketCap: Math.round(price * (1_000_000_000 + Math.random() * 2_000_000_000)),
    timestamp: new Date().toISOString(),
  };
}

// GET /quote/:ticker
router.get('/quote/:ticker', authenticate, (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const quote = generateQuote(ticker);

    if (!quote) {
      return res.status(404).json({ error: `No data found for ticker: ${ticker}` });
    }

    res.json(quote);
  } catch (err) {
    console.error('Quote error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /search?q=
router.get('/search', authenticate, (req, res) => {
  try {
    const query = (req.query.q || '').toUpperCase().trim();
    if (!query) {
      // Return all stocks as default results
      const results = Object.entries(STOCKS).map(([ticker, data]) => ({
        ticker,
        companyName: data.name,
        sector: data.sector,
      }));
      return res.json({ results });
    }

    const results = Object.entries(STOCKS)
      .filter(([ticker, data]) =>
        ticker.includes(query) || data.name.toUpperCase().includes(query)
      )
      .map(([ticker, data]) => ({
        ticker,
        companyName: data.name,
        sector: data.sector,
      }));

    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /news
router.get('/news', authenticate, (req, res) => {
  try {
    const now = new Date();
    const news = [
      {
        id: 'news-1',
        title: 'S&P 500 Reaches New All-Time High on Strong Earnings',
        summary: 'The S&P 500 index surged to a record high as major tech companies reported better-than-expected quarterly earnings, boosting investor confidence.',
        source: 'Finance Daily',
        category: 'MARKET',
        publishedAt: new Date(now - 2 * 3600000).toISOString(),
        tickers: ['SPY', 'AAPL', 'MSFT'],
      },
      {
        id: 'news-2',
        title: 'Federal Reserve Signals Potential Rate Cut in Coming Months',
        summary: 'Fed officials indicated they may lower interest rates if inflation continues to cool, a move that could stimulate borrowing and economic growth.',
        source: 'Market Watch',
        category: 'ECONOMY',
        publishedAt: new Date(now - 5 * 3600000).toISOString(),
        tickers: ['JPM', 'V'],
      },
      {
        id: 'news-3',
        title: 'NVIDIA Surpasses Expectations with Record AI Chip Sales',
        summary: 'NVIDIA reported record revenue driven by unprecedented demand for its AI-focused GPU chips, with data center revenue tripling year-over-year.',
        source: 'Tech Investor',
        category: 'TECHNOLOGY',
        publishedAt: new Date(now - 8 * 3600000).toISOString(),
        tickers: ['NVDA', 'AMD'],
      },
      {
        id: 'news-4',
        title: 'Tesla Announces Affordable New Model for Mass Market',
        summary: 'Tesla unveiled plans for a new entry-level electric vehicle priced under $30,000, aiming to capture a broader consumer market segment.',
        source: 'Auto Finance News',
        category: 'AUTOMOTIVE',
        publishedAt: new Date(now - 12 * 3600000).toISOString(),
        tickers: ['TSLA'],
      },
      {
        id: 'news-5',
        title: 'Beginner Investing: Why Index Funds Are a Great Starting Point',
        summary: 'Financial experts explain why low-cost index funds remain one of the best options for new investors looking to build long-term wealth with minimal effort.',
        source: 'Finance Buddy Education',
        category: 'EDUCATION',
        publishedAt: new Date(now - 24 * 3600000).toISOString(),
        tickers: ['SPY'],
      },
      {
        id: 'news-6',
        title: 'Amazon Expands Healthcare Services with New AI Diagnostics',
        summary: 'Amazon announced a major expansion of its healthcare business, leveraging artificial intelligence for diagnostic tools and telemedicine.',
        source: 'Health Tech Weekly',
        category: 'HEALTHCARE',
        publishedAt: new Date(now - 30 * 3600000).toISOString(),
        tickers: ['AMZN', 'UNH'],
      },
      {
        id: 'news-7',
        title: 'Budget Tips: How the 50/30/20 Rule Can Transform Your Finances',
        summary: 'Learn how allocating 50% to needs, 30% to wants, and 20% to savings can create a simple but effective framework for managing your money.',
        source: 'Finance Buddy Education',
        category: 'EDUCATION',
        publishedAt: new Date(now - 48 * 3600000).toISOString(),
        tickers: [],
      },
    ];

    res.json({ news });
  } catch (err) {
    console.error('News error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
