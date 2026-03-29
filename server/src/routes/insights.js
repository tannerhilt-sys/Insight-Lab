import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import {
  getInsightCards,
  addInsightCard,
  getInsightCard,
  getBudgetEntries,
  getHoldings,
  getProfile,
} from '../data/store.js';

const router = Router();

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

// GET / — return user's insight cards
router.get('/', authenticate, (req, res) => {
  try {
    const cards = getInsightCards(req.user.id);
    cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(cards);
  } catch (err) {
    console.error('Get insight cards error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /:id/accept
router.post('/:id/accept', authenticate, (req, res) => {
  try {
    const card = getInsightCard(req.params.id);
    if (!card || card.userId !== req.user.id) {
      return res.status(404).json({ error: 'Insight card not found' });
    }
    card.status = 'ACCEPTED';
    card.updatedAt = new Date().toISOString();
    res.json(card);
  } catch (err) {
    console.error('Accept insight error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /:id/dismiss
router.post('/:id/dismiss', authenticate, (req, res) => {
  try {
    const card = getInsightCard(req.params.id);
    if (!card || card.userId !== req.user.id) {
      return res.status(404).json({ error: 'Insight card not found' });
    }
    card.status = 'DISMISSED';
    card.updatedAt = new Date().toISOString();
    res.json(card);
  } catch (err) {
    console.error('Dismiss insight error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /generate — generate new insight cards
router.post('/generate', authenticate, async (req, res) => {
  try {
    const profile = getProfile(req.user.id);
    const entries = getBudgetEntries(req.user.id);
    const holdings = getHoldings(req.user.id);

    const totalExpenses = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const holdingTickers = holdings.map((h) => h.ticker).join(', ');

    const client = getAnthropicClient();

    let cards;

    if (client) {
      try {
        const message = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: 'You are Finance Buddy. Generate exactly 3 financial insight cards in JSON format. Each card should have: type (BUDGET, PORTFOLIO, or MARKET), title (short), body (2-3 sentences of actionable, educational advice), and priority (high, medium, low). Return a JSON array of objects. Only output the JSON array, nothing else.',
          messages: [
            {
              role: 'user',
              content: `Generate 3 insight cards for this user:
- Knowledge Level: ${profile?.knowledgeLevel || 'beginner'}
- Monthly Income: $${totalIncome}
- Monthly Expenses: $${totalExpenses}
- Net Savings: $${totalIncome - totalExpenses}
- Holdings: ${holdingTickers || 'none'}
- Goals: ${(profile?.goals || []).join(', ') || 'general'}
- Risk Score: ${profile?.riskScore ?? 5}/10`,
            },
          ],
        });

        const text = message.content[0].text;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          cards = parsed.map((c) => ({
            id: uuidv4(),
            userId: req.user.id,
            type: c.type || 'BUDGET',
            title: c.title,
            body: c.body,
            priority: c.priority || 'medium',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
        }
      } catch (apiErr) {
        console.error('Claude insight generation error:', apiErr.message);
      }
    }

    // Fallback mock cards
    if (!cards || cards.length === 0) {
      cards = [
        {
          id: uuidv4(),
          userId: req.user.id,
          type: 'BUDGET',
          title: 'Track Your Spending Patterns',
          body: totalExpenses > 0
            ? `You've spent $${totalExpenses.toFixed(2)} this period. Try categorizing your expenses to identify areas where you can save. Even small reductions in daily spending can add up to significant savings over time.`
            : 'Start logging your expenses to get personalized budget insights. Knowing where your money goes is the first step to financial health.',
          priority: 'high',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          userId: req.user.id,
          type: 'PORTFOLIO',
          title: holdings.length > 0 ? 'Diversify Your Portfolio' : 'Start Your Investment Journey',
          body: holdings.length > 0
            ? `You currently hold ${holdings.length} position(s): ${holdingTickers}. Consider whether your portfolio is diversified across different sectors to reduce risk. A mix of stocks, bonds, and index funds is generally recommended for beginners.`
            : 'You haven\'t made any paper trades yet. Try buying a few shares of an index fund like SPY to get started. Paper trading is a great way to learn without risking real money.',
          priority: 'medium',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          userId: req.user.id,
          type: 'MARKET',
          title: 'Market Insight: Think Long-Term',
          body: 'Markets fluctuate daily, but historically the S&P 500 has returned about 10% annually over long periods. Focus on your long-term goals rather than short-term market movements. Consistent investing over time — known as dollar-cost averaging — can help smooth out market volatility.',
          priority: 'low',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    // Save cards to store
    for (const card of cards) {
      addInsightCard(card);
    }

    res.status(201).json(cards);
  } catch (err) {
    console.error('Generate insights error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
