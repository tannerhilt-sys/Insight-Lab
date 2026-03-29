import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticate } from '../middleware/auth.js';
import { getProfile, appendChatMessage } from '../data/store.js';
import { CLAUDE_MODEL, MAX_CHAT_MESSAGE_LENGTH, MAX_CHAT_HISTORY_ITEMS } from '../constants.js';

const router = Router();

const VALID_ROLES = ['user', 'assistant'];

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

function buildSystemPrompt(profile) {
  const name = profile?.buddyName || 'friend';
  const level = profile?.knowledgeLevel || 'beginner';
  const goals = (profile?.goals || []).join(', ') || 'general financial literacy';
  const risk = profile?.riskScore ?? 5;

  return `You are Finance Buddy, a friendly and educational AI financial companion. You are chatting with ${name}, who has a ${level} knowledge level in finance. Their goals include: ${goals}. Their risk tolerance is ${risk}/10.

Your personality:
- Warm, encouraging, and patient
- You explain financial concepts in simple, plain language
- You use real-world analogies to make concepts relatable
- You never give specific investment advice or guarantees
- You always remind users that you're an educational tool, not a financial advisor
- You keep responses concise (2-4 paragraphs max unless asked for detail)
- When discussing investments, always mention diversification and risk

If asked about something outside of finance, gently steer the conversation back to financial topics.`;
}

/** Sanitize and validate a client-supplied history array. */
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-MAX_CHAT_HISTORY_ITEMS)
    .filter(
      (msg) =>
        msg &&
        typeof msg === 'object' &&
        VALID_ROLES.includes(msg.role) &&
        typeof msg.content === 'string' &&
        msg.content.length > 0,
    )
    .map((msg) => ({ role: msg.role, content: msg.content.slice(0, MAX_CHAT_MESSAGE_LENGTH) }));
}

/**
 * POST /message
 * Send a chat message and receive a streaming SSE response from Claude.
 * The system prompt is personalized using the user's onboarding profile
 * (knowledge level, goals, risk tolerance).
 *
 * SSE event format: data: {"type":"content_block_delta","text":"..."}\n\n
 * Terminal event:   data: {"type":"message_stop"}\n\n
 * Error event:      data: {"type":"error","error":"..."}\n\n
 *
 * Falls back to a mock word-by-word stream when ANTHROPIC_API_KEY is absent.
 *
 * @body {string} message - User message (max 2000 chars)
 * @body {ChatMessage[]} [history] - Prior conversation (max 20 items, each sanitized)
 * @returns {200} text/event-stream
 * @returns {400} Validation error (returns JSON before headers are sent)
 */
router.post('/message', authenticate, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (typeof message !== 'string') {
      return res.status(400).json({ error: 'message must be a string' });
    }
    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'message must not be empty' });
    }
    if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `message must not exceed ${MAX_CHAT_MESSAGE_LENGTH} characters` });
    }

    const sanitizedMessage = message.trim();
    const profile = getProfile(req.user.id);

    appendChatMessage(req.user.id, {
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date().toISOString(),
    });

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const client = getAnthropicClient();

    if (!client) {
      const mockResponse = `That's a great question, ${profile?.buddyName || 'friend'}! Let me break it down simply. In personal finance, understanding where your money goes is the essential first step. Try tracking your expenses for a week — you might be surprised by what you find! Once you know your spending patterns, you can start making small adjustments that add up over time. Building good financial habits is a marathon, not a sprint.`;
      const words = mockResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        res.write(`data: ${JSON.stringify({ type: 'content_block_delta', text: chunk })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
      appendChatMessage(req.user.id, { role: 'assistant', content: mockResponse, timestamp: new Date().toISOString() });
      return res.end();
    }

    const messages = sanitizeHistory(history);
    messages.push({ role: 'user', content: sanitizedMessage });

    let fullResponse = '';

    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(profile),
      messages,
    });

    stream.on('text', (text) => {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ type: 'content_block_delta', text })}\n\n`);
    });

    stream.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
      appendChatMessage(req.user.id, {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date().toISOString(),
      });
      res.end();
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Stream interrupted' })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error('Chat message error:', err);
    if (res.headersSent) return res.end();
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /suggestions
 * Return 3 personalized starter prompts based on the user's knowledge level,
 * goals, and risk tolerance from their onboarding profile.
 * Falls back to generic suggestions for users without a profile.
 * @returns {200} { suggestions: string[] }
 */
router.get('/suggestions', authenticate, (req, res) => {
  try {
    const profile = getProfile(req.user.id);

    const baseSuggestions = [
      'What is a stock and how does it work?',
      'How should I start budgeting as a beginner?',
      'What is the difference between saving and investing?',
    ];

    if (!profile) return res.json({ suggestions: baseSuggestions });

    const suggestions = [];

    if (profile.knowledgeLevel === 'beginner') {
      suggestions.push('Can you explain what an index fund is in simple terms?');
    } else if (profile.knowledgeLevel === 'intermediate') {
      suggestions.push('What are the pros and cons of growth vs. value investing?');
    } else {
      suggestions.push("How do I evaluate a company's price-to-earnings ratio?");
    }

    if (profile.goals?.includes('retirement')) {
      suggestions.push('How much should I be saving for retirement at my age?');
    } else if (profile.goals?.includes('emergency_fund')) {
      suggestions.push('How do I build an emergency fund from scratch?');
    } else {
      suggestions.push('What are the best ways to save money each month?');
    }

    if (profile.riskScore >= 7) {
      suggestions.push('What are some growth-oriented investment strategies?');
    } else if (profile.riskScore <= 3) {
      suggestions.push('What are the safest investment options for beginners?');
    } else {
      suggestions.push('How can I balance risk and reward in my portfolio?');
    }

    res.json({ suggestions });
  } catch (err) {
    console.error('Get suggestions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
