import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import { getProfile, setProfile } from '../data/store.js';
import {
  CLAUDE_MODEL,
  VALID_KNOWLEDGE_LEVELS,
  VALID_GOALS,
  VALID_SAVINGS_HABITS,
  MAX_BUDDY_NAME_LENGTH,
} from '../constants.js';

const router = Router();

const MIN_RISK_SCORE = 1;
const MAX_RISK_SCORE = 10;

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

async function generateProfileSummary(profile) {
  const client = getAnthropicClient();
  if (!client) {
    return `Welcome to Finance Buddy, ${profile.buddyName}! Based on your profile, you're a ${profile.knowledgeLevel}-level investor with a risk score of ${profile.riskScore}/10. Your goals include ${(profile.goals || []).join(', ') || 'building financial literacy'}.\n\nThis is a great starting point! We'll tailor your experience to help you learn at your own pace. Whether you're interested in budgeting, saving, or investing, we've got you covered.\n\nYour first step: Head to the Budget tab and log your income and expenses for this month. Understanding your cash flow is the foundation of all good financial planning.`;
  }

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      system: 'You are Finance Buddy, an educational financial companion. Generate a warm, encouraging 3-paragraph financial profile summary. Use plain language. Mention their goals and risk tolerance. End with one concrete, actionable first step.',
      messages: [
        {
          role: 'user',
          content: `Generate a financial profile summary for this user:\n- Name: ${profile.buddyName}\n- Goals: ${(profile.goals || []).join(', ')}\n- Knowledge Level: ${profile.knowledgeLevel}\n- Risk Score: ${profile.riskScore}/10\n- Savings Habit: ${profile.savingsHabit}\n- Investing Interest: ${profile.investingInterest}`,
        },
      ],
    });
    const text = message.content?.[0]?.text;
    if (!text) throw new Error('Empty response from Claude');
    return text;
  } catch (err) {
    console.error('Claude profile summary error:', err instanceof Error ? err.message : err);
    return `Welcome, ${profile.buddyName}! We're excited to help you on your financial journey. Based on your profile, we'll customize your experience to match your ${profile.knowledgeLevel} knowledge level and risk tolerance of ${profile.riskScore}/10.\n\nYour goals are inspiring, and Finance Buddy will provide insights and tools tailored just for you.\n\nYour first step: Head to the Budget tab and log your income and expenses for this month. Understanding your cash flow is the foundation of all good financial planning.`;
  }
}

function validateProfileBody(body) {
  const { buddyName, knowledgeLevel, riskScore, goals } = body;

  if (buddyName !== undefined) {
    if (typeof buddyName !== 'string' || buddyName.trim().length === 0) {
      return 'buddyName must be a non-empty string';
    }
    if (buddyName.trim().length > MAX_BUDDY_NAME_LENGTH) {
      return `buddyName must be ${MAX_BUDDY_NAME_LENGTH} characters or fewer`;
    }
  }
  if (knowledgeLevel !== undefined && !VALID_KNOWLEDGE_LEVELS.includes(knowledgeLevel)) {
    return `knowledgeLevel must be one of: ${VALID_KNOWLEDGE_LEVELS.join(', ')}`;
  }
  if (riskScore !== undefined) {
    const score = Number(riskScore);
    if (!isFinite(score) || score < MIN_RISK_SCORE || score > MAX_RISK_SCORE || !Number.isInteger(score)) {
      return `riskScore must be an integer between ${MIN_RISK_SCORE} and ${MAX_RISK_SCORE}`;
    }
  }
  if (goals !== undefined) {
    if (!Array.isArray(goals)) return 'goals must be an array';
    const invalidGoal = goals.find((g) => !VALID_GOALS.includes(g));
    if (invalidGoal) return `Invalid goal: "${invalidGoal}". Valid goals: ${VALID_GOALS.join(', ')}`;
  }
  return null;
}

// POST / — create profile
router.post('/', authenticate, async (req, res) => {
  try {
    const validationError = validateProfileBody(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { buddyName, goals, knowledgeLevel, riskScore, savingsHabit, investingInterest } = req.body;

    if (savingsHabit !== undefined && !VALID_SAVINGS_HABITS.includes(savingsHabit)) {
      return res.status(400).json({ error: `savingsHabit must be one of: ${VALID_SAVINGS_HABITS.join(', ')}` });
    }

    const profile = {
      userId: req.user.id,
      buddyName: buddyName ? buddyName.trim() : (req.user.buddyName || 'Buddy'),
      goals: goals || [],
      knowledgeLevel: knowledgeLevel || 'beginner',
      riskScore: riskScore !== undefined ? Number(riskScore) : 5,
      savingsHabit: savingsHabit || 'sometimes',
      investingInterest: investingInterest || 'curious',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfile(req.user.id, profile);

    const aiSummary = await generateProfileSummary(profile);
    res.status(201).json({ profile, aiSummary });
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /
router.get('/', authenticate, (req, res) => {
  try {
    const profile = getProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Complete onboarding first.' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /
router.put('/', authenticate, (req, res) => {
  try {
    const existing = getProfile(req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Profile not found. Complete onboarding first.' });
    }

    const validationError = validateProfileBody(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { buddyName, goals, knowledgeLevel, riskScore, savingsHabit, investingInterest } = req.body;

    if (savingsHabit !== undefined && !VALID_SAVINGS_HABITS.includes(savingsHabit)) {
      return res.status(400).json({ error: `savingsHabit must be one of: ${VALID_SAVINGS_HABITS.join(', ')}` });
    }

    if (buddyName !== undefined) existing.buddyName = buddyName.trim();
    if (goals !== undefined) existing.goals = goals;
    if (knowledgeLevel !== undefined) existing.knowledgeLevel = knowledgeLevel;
    if (riskScore !== undefined) existing.riskScore = Number(riskScore);
    if (savingsHabit !== undefined) existing.savingsHabit = savingsHabit;
    if (investingInterest !== undefined) existing.investingInterest = investingInterest;
    existing.updatedAt = new Date().toISOString();

    setProfile(req.user.id, existing);
    res.json(existing);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
