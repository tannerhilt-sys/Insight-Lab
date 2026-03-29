import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import { getProfile, setProfile } from '../data/store.js';

const router = Router();

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

async function generateProfileSummary(profile) {
  const client = getAnthropicClient();
  if (!client) {
    return `Welcome to Finance Buddy, ${profile.buddyName || 'friend'}! Based on your profile, you're a ${profile.knowledgeLevel || 'beginner'}-level investor with a risk score of ${profile.riskScore || 5}/10. Your goals include ${(profile.goals || []).join(', ') || 'building financial literacy'}.\n\nThis is a great starting point! We'll tailor your experience to help you learn at your own pace while working toward your financial goals. Whether you're interested in budgeting, saving, or investing, we've got you covered.\n\nHere's your first step: Set up your monthly budget by adding your income and key expenses. This will give us a baseline to work from and help you see where your money goes each month.`;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are Finance Buddy, an educational financial companion. Generate a warm, encouraging 3-paragraph financial profile summary for a beginner. Use plain language. Mention their goals and risk tolerance. End with one actionable first step.',
      messages: [
        {
          role: 'user',
          content: `Generate a financial profile summary for this user:\n- Name: ${profile.buddyName}\n- Goals: ${(profile.goals || []).join(', ')}\n- Knowledge Level: ${profile.knowledgeLevel}\n- Risk Score: ${profile.riskScore}/10\n- Savings Habit: ${profile.savingsHabit}\n- Investing Interest: ${profile.investingInterest}`,
        },
      ],
    });
    return message.content[0].text;
  } catch (err) {
    console.error('Claude API error:', err.message);
    return `Welcome, ${profile.buddyName}! We're excited to help you on your financial journey. Based on your profile, we'll customize your experience to match your ${profile.knowledgeLevel} knowledge level and risk tolerance of ${profile.riskScore}/10.\n\nYour goals are inspiring, and we're here to guide you every step of the way. Finance Buddy will provide insights, explanations, and tools tailored just for you.\n\nYour first step: Head to the Budget tab and log your income and expenses for this month. Understanding your cash flow is the foundation of all good financial planning.`;
  }
}

// POST /profile
router.post('/', authenticate, async (req, res) => {
  try {
    const { buddyName, goals, knowledgeLevel, riskScore, savingsHabit, investingInterest } = req.body;

    const profile = {
      userId: req.user.id,
      buddyName: buddyName || req.user.buddyName || 'Buddy',
      goals: goals || [],
      knowledgeLevel: knowledgeLevel || 'beginner',
      riskScore: riskScore ?? 5,
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

// GET /profile
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

// PUT /profile
router.put('/', authenticate, (req, res) => {
  try {
    const existing = getProfile(req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Profile not found. Complete onboarding first.' });
    }

    const allowedFields = ['buddyName', 'goals', 'knowledgeLevel', 'riskScore', 'savingsHabit', 'investingInterest'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        existing[field] = req.body[field];
      }
    }
    existing.updatedAt = new Date().toISOString();

    setProfile(req.user.id, existing);
    res.json(existing);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
