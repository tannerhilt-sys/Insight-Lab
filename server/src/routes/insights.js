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
import { CLAUDE_MODEL, VALID_INSIGHT_TYPES } from '../constants.js';

const router = Router();

const VALID_PRIORITIES = ['high', 'medium', 'low'];

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

/** Safely parse a JSON array from an AI response string. Returns null on failure. */
function parseInsightJson(text) {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildFallbackCards(userId, totalExpenses, holdings, holdingTickers) {
  return [
    {
      id: uuidv4(),
      userId,
      type: 'BUDGET',
      title: 'Track Your Spending Patterns',
      body: totalExpenses > 0
        ? `You've spent $${totalExpenses.toFixed(2)} this period. Categorizing your expenses can reveal quick savings opportunities — even cutting $50/month in one category adds up to $600/year.`
        : 'Start logging your expenses to get personalized budget insights. Knowing where your money goes is the first step to financial health.',
      priority: 'high',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      userId,
      type: 'PORTFOLIO',
      title: holdings.length > 0 ? 'Diversify Your Portfolio' : 'Start Your Investment Journey',
      body: holdings.length > 0
        ? `You currently hold ${holdings.length} position(s): ${holdingTickers}. A diversified portfolio across sectors typically reduces volatility. Consider adding an index fund like SPY for broad market exposure.`
        : "You haven't made any paper trades yet. Try buying a few shares of an index fund like SPY. Paper trading is a great way to learn without risking real money.",
      priority: 'medium',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      userId,
      type: 'MARKET',
      title: 'Market Insight: Think Long-Term',
      body: 'The S&P 500 has historically returned ~10% annually over long periods. Rather than reacting to daily movements, focus on consistent investing through dollar-cost averaging — buying a fixed amount on a regular schedule regardless of price.',
      priority: 'low',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * GET /insights
 * Return all insight cards for the authenticated user, sorted newest-first.
 * @returns {200} InsightCard[] — { id, type, title, body, priority, status, createdAt }
 *   type: "BUDGET" | "PORTFOLIO" | "MARKET"
 *   status: "ACTIVE" | "ACCEPTED" | "DISMISSED"
 */
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

/**
 * POST /insights/:id/accept
 * Mark an insight card as accepted (user intends to act on it).
 * @returns {200} Updated InsightCard
 * @returns {404} Card not found or not owned by requester
 */
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

/**
 * POST /insights/:id/dismiss
 * Mark an insight card as dismissed.
 * @returns {200} Updated InsightCard
 * @returns {404} Card not found or not owned by requester
 */
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

/**
 * POST /insights/generate
 * Generate 3 personalized AI insight cards using the user's budget, portfolio,
 * and onboarding profile. Cards are persisted and returned.
 * Falls back to rule-based cards when ANTHROPIC_API_KEY is absent or Claude fails.
 * Claude response is a JSON array — parsed with bracket extraction for safety.
 * @returns {201} InsightCard[] (3 cards: BUDGET, PORTFOLIO, MARKET)
 */
router.post('/generate', authenticate, async (req, res) => {
  try {
    const profile = getProfile(req.user.id);
    const entries = getBudgetEntries(req.user.id);
    const holdings = getHoldings(req.user.id);

    const totalExpenses = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const holdingTickers = holdings.map((h) => h.ticker).join(', ');

    const client = getAnthropicClient();
    let cards = null;

    if (client) {
      try {
        const message = await client.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 1024,
          system: `You are Finance Buddy. Generate exactly 3 financial insight cards as a JSON array.
Each object must have:
- type: one of ${VALID_INSIGHT_TYPES.join(', ')}
- title: short string (max 60 chars)
- body: 2-3 sentences of actionable, educational advice
- priority: one of high, medium, low
Return ONLY the JSON array. No explanation, no markdown fences.`,
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

        const responseText = message.content?.[0]?.text;
        if (responseText) {
          const parsed = parseInsightJson(responseText);
          if (parsed && parsed.length > 0) {
            cards = parsed.map((c) => ({
              id: uuidv4(),
              userId: req.user.id,
              type: VALID_INSIGHT_TYPES.includes(c.type) ? c.type : 'BUDGET',
              title: typeof c.title === 'string' ? c.title.slice(0, 60) : 'Insight',
              body: typeof c.body === 'string' ? c.body : '',
              priority: VALID_PRIORITIES.includes(c.priority) ? c.priority : 'medium',
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }));
          }
        }
      } catch (apiErr) {
        console.error('Claude insight generation error:', apiErr instanceof Error ? apiErr.message : apiErr);
      }
    }

    if (!cards || cards.length === 0) {
      cards = buildFallbackCards(req.user.id, totalExpenses, holdings, holdingTickers);
    }

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
