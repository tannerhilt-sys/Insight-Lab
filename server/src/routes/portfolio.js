import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import {
  getHoldings,
  getHoldingByTicker,
  addHolding,
  removeHolding,
  getWatchlist,
  addWatchlistItem,
  removeWatchlistByTicker,
} from '../data/store.js';
import { CLAUDE_MODEL, VALID_TICKERS, MIN_AMOUNT, MAX_AMOUNT, MAX_SHARES } from '../constants.js';

const router = Router();

// Allow seeded tickers (AAPL, SPY, etc.) plus basic format check for unknown tickers
const TICKER_REGEX = /^[A-Z]{1,5}$/;

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

/** Simulate a current price with slight random variation from avgCost. */
function simulateCurrentPrice(avgCost) {
  // Slight upward bias: range is roughly -4.5% to +5.5%
  const variation = (Math.random() - 0.45) * 0.1;
  return Math.round(avgCost * (1 + variation) * 100) / 100;
}

function validateShares(shares) {
  const num = Number(shares);
  if (!isFinite(num) || isNaN(num)) return 'shares must be a valid number';
  if (num <= 0) return 'shares must be greater than 0';
  if (num > MAX_SHARES) return `shares must not exceed ${MAX_SHARES.toLocaleString()}`;
  if (!Number.isInteger(num)) return 'shares must be a whole number';
  return null;
}

function validatePrice(price) {
  const num = Number(price);
  if (!isFinite(num) || isNaN(num)) return 'price must be a valid number';
  if (num < MIN_AMOUNT) return `price must be at least ${MIN_AMOUNT}`;
  if (num > MAX_AMOUNT) return `price must not exceed ${MAX_AMOUNT.toLocaleString()}`;
  return null;
}

function validateTicker(ticker) {
  if (!ticker || typeof ticker !== 'string') return 'ticker is required';
  const upper = ticker.toUpperCase().trim();
  if (!TICKER_REGEX.test(upper)) return 'ticker must be 1-5 uppercase letters';
  return null;
}

// GET /holdings
router.get('/holdings', authenticate, (req, res) => {
  try {
    const holdings = getHoldings(req.user.id);
    const enriched = holdings.map((h) => {
      const currentPrice = simulateCurrentPrice(h.avgCost);
      const marketValue = Math.round(currentPrice * h.shares * 100) / 100;
      const costBasis = Math.round(h.avgCost * h.shares * 100) / 100;
      const gainLoss = Math.round((marketValue - costBasis) * 100) / 100;
      const gainLossPercent = costBasis > 0 ? Math.round((gainLoss / costBasis) * 10000) / 100 : 0;
      return { ...h, currentPrice, marketValue, costBasis, gainLoss, gainLossPercent };
    });

    const totalValue = Math.round(enriched.reduce((s, h) => s + h.marketValue, 0) * 100) / 100;
    const totalCost = Math.round(enriched.reduce((s, h) => s + h.costBasis, 0) * 100) / 100;
    const totalGainLoss = Math.round((totalValue - totalCost) * 100) / 100;

    res.json({ holdings: enriched, totalValue, totalCost, totalGainLoss });
  } catch (err) {
    console.error('Get holdings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /buy
router.post('/buy', authenticate, (req, res) => {
  try {
    const { ticker, shares, price } = req.body;

    const tickerError = validateTicker(ticker);
    if (tickerError) return res.status(400).json({ error: tickerError });

    const sharesError = validateShares(shares);
    if (sharesError) return res.status(400).json({ error: sharesError });

    const priceError = validatePrice(price);
    if (priceError) return res.status(400).json({ error: priceError });

    const normalizedTicker = ticker.toUpperCase().trim();
    const numShares = Number(shares);
    const numPrice = Number(price);

    const existing = getHoldingByTicker(req.user.id, normalizedTicker);

    if (existing) {
      const totalShares = existing.shares + numShares;
      const totalCost = existing.shares * existing.avgCost + numShares * numPrice;
      existing.shares = totalShares;
      existing.avgCost = Math.round((totalCost / totalShares) * 100) / 100;
      existing.updatedAt = new Date().toISOString();
      return res.json(existing);
    }

    const holding = {
      id: uuidv4(),
      userId: req.user.id,
      ticker: normalizedTicker,
      shares: numShares,
      avgCost: Math.round(numPrice * 100) / 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addHolding(holding);
    res.status(201).json(holding);
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /sell
router.post('/sell', authenticate, (req, res) => {
  try {
    const { ticker, shares } = req.body;

    const tickerError = validateTicker(ticker);
    if (tickerError) return res.status(400).json({ error: tickerError });

    const sharesError = validateShares(shares);
    if (sharesError) return res.status(400).json({ error: sharesError });

    const normalizedTicker = ticker.toUpperCase().trim();
    const numShares = Number(shares);

    const existing = getHoldingByTicker(req.user.id, normalizedTicker);
    if (!existing) {
      return res.status(404).json({ error: 'You do not hold this stock' });
    }
    if (numShares > existing.shares) {
      return res.status(400).json({ error: `Insufficient shares. You hold ${existing.shares} share(s) of ${normalizedTicker}.` });
    }

    if (numShares === existing.shares) {
      removeHolding(existing.id);
      return res.json({ message: `Sold all ${numShares} share(s) of ${normalizedTicker}`, remainingShares: 0 });
    }

    existing.shares -= numShares;
    existing.updatedAt = new Date().toISOString();
    res.json({ message: `Sold ${numShares} share(s) of ${normalizedTicker}`, remainingShares: existing.shares });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /watchlist
router.get('/watchlist', authenticate, (req, res) => {
  try {
    res.json(getWatchlist(req.user.id));
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /watchlist
router.post('/watchlist', authenticate, (req, res) => {
  try {
    const { ticker, companyName } = req.body;

    const tickerError = validateTicker(ticker);
    if (tickerError) return res.status(400).json({ error: tickerError });

    const normalizedTicker = ticker.toUpperCase().trim();
    const item = {
      id: uuidv4(),
      userId: req.user.id,
      ticker: normalizedTicker,
      companyName: typeof companyName === 'string' ? companyName.trim().slice(0, 100) : normalizedTicker,
      addedAt: new Date().toISOString(),
    };

    addWatchlistItem(item);
    res.status(201).json(item);
  } catch (err) {
    console.error('Add watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /watchlist/:ticker
router.delete('/watchlist/:ticker', authenticate, (req, res) => {
  try {
    const tickerError = validateTicker(req.params.ticker);
    if (tickerError) return res.status(400).json({ error: tickerError });

    const removed = removeWatchlistByTicker(req.user.id, req.params.ticker.toUpperCase());
    if (!removed) return res.status(404).json({ error: 'Ticker not found in watchlist' });

    res.json({ success: true });
  } catch (err) {
    console.error('Remove watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /explain/:ticker
router.get('/explain/:ticker', authenticate, async (req, res) => {
  try {
    const tickerError = validateTicker(req.params.ticker);
    if (tickerError) return res.status(400).json({ error: tickerError });

    const ticker = req.params.ticker.toUpperCase().trim();
    const client = getAnthropicClient();

    if (!client) {
      return res.json({
        ticker,
        explanation: `${ticker} is a publicly traded company listed on a major stock exchange. When you buy shares, you own a small piece of that company. The stock price rises when demand outpaces supply and falls when the reverse is true. Before investing, understand what the company does, how it makes money, and whether it fits your financial goals and risk tolerance. Past performance does not guarantee future results — always diversify.`,
      });
    }

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      system: 'You are Finance Buddy, an educational financial companion. Explain stocks to beginners in plain, friendly language. Include what the company does, why people invest in it, and one risk to be aware of. Keep it to 2-3 short paragraphs.',
      messages: [
        {
          role: 'user',
          content: `Explain the stock ${ticker} to a beginner investor. What does the company do, why might someone invest in it, and what is one risk?`,
        },
      ],
    });

    const text = message.content?.[0]?.text;
    if (!text) return res.status(502).json({ error: 'AI returned an empty response' });

    res.json({ ticker, explanation: text });
  } catch (err) {
    console.error('Stock explain error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
