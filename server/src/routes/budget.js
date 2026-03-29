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

const router = Router();

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

// GET /entries?month=YYYY-MM
router.get('/entries', authenticate, (req, res) => {
  try {
    const { month } = req.query;
    let entries = getBudgetEntries(req.user.id);

    if (month) {
      entries = entries.filter((e) => e.date && e.date.startsWith(month));
    }

    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpenses = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const netSavings = totalIncome - totalExpenses;

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

    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'type, amount, and category are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be "income" or "expense"' });
    }

    const entry = {
      id: uuidv4(),
      userId: req.user.id,
      type,
      amount: Number(amount),
      category,
      description: description || '',
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

    const allowedFields = ['type', 'amount', 'category', 'description', 'date'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'amount' ? Number(req.body[field]) : req.body[field];
      }
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
    const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpenses = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

    const categoryTotals = {};
    entries
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });

    const client = getAnthropicClient();
    if (!client) {
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const insight = totalExpenses > 0
        ? `You've spent $${totalExpenses.toFixed(2)} across ${Object.keys(categoryTotals).length} categories this period. ${topCategory ? `Your biggest expense category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}.` : ''} ${totalIncome > totalExpenses ? `Great news — you're saving $${(totalIncome - totalExpenses).toFixed(2)}!` : 'Consider looking for areas to cut back to boost your savings.'}`
        : 'Start by adding your income and expenses to get personalized budget insights!';
      return res.json({ insight });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: 'You are Finance Buddy. Analyze budget data and provide a concise 2-3 sentence insight. Be encouraging and educational. Use plain language.',
      messages: [
        {
          role: 'user',
          content: `Analyze this budget:\n- Total Income: $${totalIncome}\n- Total Expenses: $${totalExpenses}\n- Net: $${totalIncome - totalExpenses}\n- Expense categories: ${JSON.stringify(categoryTotals)}\n\nGive a 2-3 sentence insight.`,
        },
      ],
    });

    res.json({ insight: message.content[0].text });
  } catch (err) {
    console.error('Budget insight error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /goals
router.get('/goals', authenticate, (req, res) => {
  try {
    const goals = getSavingsGoals(req.user.id);
    res.json(goals);
  } catch (err) {
    console.error('Get savings goals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /goals
router.post('/goals', authenticate, (req, res) => {
  try {
    const { label, targetAmount, deadline } = req.body;

    if (!label || !targetAmount) {
      return res.status(400).json({ error: 'label and targetAmount are required' });
    }

    const goal = {
      id: uuidv4(),
      userId: req.user.id,
      label,
      targetAmount: Number(targetAmount),
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
