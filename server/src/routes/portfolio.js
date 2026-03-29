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

const router = Router();

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

// Simulate a current price with slight random variation from avgCost
function simulateCurrentPrice(avgCost) {
  const variation = (Math.random() - 0.45) * 0.1; // slight upward bias
  return Math.round((avgCost * (1 + variation)) * 100) / 100;
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

    const totalValue = enriched.reduce((s, h) => s + h.marketValue, 0);
    const totalCost = enriched.reduce((s, h) => s + h.costBasis, 0);
    const totalGainLoss = Math.round((totalValue - totalCost) * 100) / 100;

    res.json({ holdings: enriched, totalValue: Math.round(totalValue * 100) / 100, totalCost: Math.round(totalCost * 100) / 100, totalGainLoss });
  } catch (err) {
    console.error('Get holdings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /buy (paper trade)
router.post('/buy', authenticate, (req, res) => {
  try {
    const { ticker, shares, price } = req.body;

    if (!ticker || !shares || !price) {
      return res.status(400).json({ error: 'ticker, shares, and price are required' });
    }

    const numShares = Number(shares);
    const numPrice = Number(price);
    const existing = getHoldingByTicker(req.user.id, ticker.toUpperCase());

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
      ticker: ticker.toUpperCase(),
      shares: numShares,
      avgCost: numPrice,
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

    if (!ticker || !shares) {
      return res.status(400).json({ error: 'ticker and shares are required' });
    }

    const existing = getHoldingByTicker(req.user.id, ticker.toUpperCase());
    if (!existing) {
      return res.status(404).json({ error: 'You do not hold this stock' });
    }

    const numShares = Number(shares);
    if (numShares > existing.shares) {
      return res.status(400).json({ error: `You only hold ${existing.shares} shares of ${ticker.toUpperCase()}` });
    }

    if (numShares === existing.shares) {
      removeHolding(existing.id);
      return res.json({ message: `Sold all ${numShares} shares of ${ticker.toUpperCase()}`, remainingShares: 0 });
    }

    existing.shares -= numShares;
    existing.updatedAt = new Date().toISOString();
    res.json({ message: `Sold ${numShares} shares of ${ticker.toUpperCase()}`, remainingShares: existing.shares });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /watchlist
router.get('/watchlist', authenticate, (req, res) => {
  try {
    const items = getWatchlist(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /watchlist
router.post('/watchlist', authenticate, (req, res) => {
  try {
    const { ticker, companyName } = req.body;
    if (!ticker) {
      return res.status(400).json({ error: 'ticker is required' });
    }

    const item = {
      id: uuidv4(),
      userId: req.user.id,
      ticker: ticker.toUpperCase(),
      companyName: companyName || ticker.toUpperCase(),
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
    const removed = removeWatchlistByTicker(req.user.id, req.params.ticker.toUpperCase());
    if (!removed) {
      return res.status(404).json({ error: 'Ticker not found in watchlist' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Remove watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /explain/:ticker
router.get('/explain/:ticker', authenticate, async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const client = getAnthropicClient();

    if (!client) {
      return res.json({
        ticker,
        explanation: `${ticker} is a publicly traded company listed on a major stock exchange. When you buy shares of ${ticker}, you own a small piece of that company. The stock price goes up when more people want to buy it than sell it, and goes down when the opposite happens. Before investing, it's important to understand what the company does, how it makes money, and whether it fits your financial goals and risk tolerance. Remember: past performance doesn't guarantee future results, and it's wise to diversify your investments across different companies and sectors.`,
      });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: 'You are Finance Buddy, an educational financial companion. Explain stocks to beginners in plain, friendly language. Include what the company does, why people invest in it, and one risk to be aware of. Keep it to 2-3 short paragraphs.',
      messages: [
        {
          role: 'user',
          content: `Explain the stock ${ticker} to a beginner investor. What does the company do, why might someone invest in it, and what's one risk?`,
        },
      ],
    });

    res.json({ ticker, explanation: message.content[0].text });
  } catch (err) {
    console.error('Stock explain error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
