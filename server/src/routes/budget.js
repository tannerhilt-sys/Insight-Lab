import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import {
  getBudgetEntries,
  addBudgetEntry,
  getBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
  getSavingsGoals,
  addSavingsGoal,
} from '../data/store.js';
import { CLAUDE_MODEL, VALID_BUDGET_TYPES } from '../constants.js';
import { validateAmount, validateDate, validateMonth } from '../utils/validation.js';

const router = Router();

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

/** Compute income/expense totals and per-category sums from a list of entries. */
function calcBudgetTotals(entries) {
  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = {};
  entries
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
  return { totalIncome, totalExpenses, netSavings: totalIncome - totalExpenses, categoryTotals };
}

// GET /entries?month=YYYY-MM
router.get('/entries', authenticate, (req, res) => {
  try {
    const { month } = req.query;

    const monthError = validateMonth(month);
    if (monthError) return res.status(400).json({ error: monthError });

    let entries = getBudgetEntries(req.user.id);
    if (month) {
      entries = entries.filter((e) => e.date && e.date.startsWith(month));
    }
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    const { totalIncome, totalExpenses, netSavings } = calcBudgetTotals(entries);
    res.json({ entries, totalIncome, totalExpenses, netSavings });
  } catch (err) {
    console.error('Get budget entries error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /entries
router.post('/entries', authenticate, (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || amount === undefined || amount === null || !category) {
      return res.status(400).json({ error: 'type, amount, and category are required' });
    }
    if (!VALID_BUDGET_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${VALID_BUDGET_TYPES.join(', ')}` });
    }
    const amountError = validateAmount(amount);
    if (amountError) return res.status(400).json({ error: amountError });

    if (typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ error: 'category must be a non-empty string' });
    }
    const dateError = validateDate(date);
    if (dateError) return res.status(400).json({ error: dateError });

    const entry = {
      id: uuidv4(),
      userId: req.user.id,
      type,
      amount: Math.round(Number(amount) * 100) / 100,
      category: category.trim(),
      description: typeof description === 'string' ? description.trim().slice(0, 200) : '',
      date: date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };

    addBudgetEntry(entry);
    res.status(201).json(entry);
  } catch (err) {
    console.error('Create budget entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /entries/:id
router.put('/entries/:id', authenticate, (req, res) => {
  try {
    const entry = getBudgetEntry(req.params.id);
    if (!entry || entry.userId !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const updates = {};

    if (req.body.type !== undefined) {
      if (!VALID_BUDGET_TYPES.includes(req.body.type)) {
        return res.status(400).json({ error: `type must be one of: ${VALID_BUDGET_TYPES.join(', ')}` });
      }
      updates.type = req.body.type;
    }
    if (req.body.amount !== undefined) {
      const amountError = validateAmount(req.body.amount);
      if (amountError) return res.status(400).json({ error: amountError });
      updates.amount = Math.round(Number(req.body.amount) * 100) / 100;
    }
    if (req.body.category !== undefined) {
      if (typeof req.body.category !== 'string' || req.body.category.trim().length === 0) {
        return res.status(400).json({ error: 'category must be a non-empty string' });
      }
      updates.category = req.body.category.trim();
    }
    if (req.body.description !== undefined) {
      updates.description = String(req.body.description).trim().slice(0, 200);
    }
    if (req.body.date !== undefined) {
      const dateError = validateDate(req.body.date);
      if (dateError) return res.status(400).json({ error: dateError });
      updates.date = req.body.date;
    }

    const updated = updateBudgetEntry(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    console.error('Update budget entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /entries/:id
router.delete('/entries/:id', authenticate, (req, res) => {
  try {
    const entry = getBudgetEntry(req.params.id);
    if (!entry || entry.userId !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    deleteBudgetEntry(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete budget entry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /insight
router.get('/insight', authenticate, async (req, res) => {
  try {
    const entries = getBudgetEntries(req.user.id);
    const { totalIncome, totalExpenses, netSavings, categoryTotals } = calcBudgetTotals(entries);

    const client = getAnthropicClient();
    if (!client) {
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const insight = totalExpenses > 0
        ? `You've spent $${totalExpenses.toFixed(2)} across ${Object.keys(categoryTotals).length} categories this period.${topCategory ? ` Your biggest expense is ${topCategory[0]} at $${topCategory[1].toFixed(2)}.` : ''} ${netSavings >= 0 ? `Great news — you're saving $${netSavings.toFixed(2)}!` : 'Consider looking for areas to cut back.'}`
        : 'Start by adding your income and expenses to get personalized budget insights!';
      return res.json({ insight });
    }

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      system: 'You are Finance Buddy. Analyze budget data and provide a concise 2-3 sentence insight. Be encouraging and educational. Use plain language.',
      messages: [
        {
          role: 'user',
          content: `Analyze this budget:\n- Total Income: $${totalIncome}\n- Total Expenses: $${totalExpenses}\n- Net: $${netSavings}\n- Expense categories: ${JSON.stringify(categoryTotals)}\n\nGive a 2-3 sentence insight.`,
        },
      ],
    });

    const responseText = message.content?.[0]?.text;
    if (!responseText) {
      return res.status(502).json({ error: 'AI returned an empty response' });
    }

    res.json({ insight: responseText });
  } catch (err) {
    console.error('Budget insight error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /goals
router.get('/goals', authenticate, (req, res) => {
  try {
    res.json(getSavingsGoals(req.user.id));
  } catch (err) {
    console.error('Get savings goals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /goals
router.post('/goals', authenticate, (req, res) => {
  try {
    const { label, targetAmount, deadline } = req.body;

    if (!label || targetAmount === undefined || targetAmount === null) {
      return res.status(400).json({ error: 'label and targetAmount are required' });
    }
    if (typeof label !== 'string' || label.trim().length === 0) {
      return res.status(400).json({ error: 'label must be a non-empty string' });
    }
    const amountError = validateAmount(targetAmount);
    if (amountError) return res.status(400).json({ error: amountError });

    const deadlineError = validateDate(deadline);
    if (deadlineError) return res.status(400).json({ error: `deadline: ${deadlineError}` });

    const goal = {
      id: uuidv4(),
      userId: req.user.id,
      label: label.trim(),
      targetAmount: Math.round(Number(targetAmount) * 100) / 100,
      currentAmount: 0,
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
    };

    addSavingsGoal(goal);
    res.status(201).json(goal);
  } catch (err) {
    console.error('Create savings goal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
