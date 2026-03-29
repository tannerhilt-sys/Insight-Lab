/**
 * Shared server-side constants.
 * All route files import from here to ensure consistency.
 * Never hardcode these values inline — update them here so every endpoint stays in sync.
 */

/** Anthropic Claude model used for all AI endpoints (chat, insights, onboarding, budget insight, stock explain). */
export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

/** JWT token lifetime. Matches the frontend's token refresh expectation. */
export const JWT_EXPIRY = '7d';

// ─── Enum-style validation arrays ────────────────────────────────────────────
// Each array below is the exhaustive set of accepted values for its field.
// Routes validate incoming data against these with `.includes()`.

/** Onboarding quiz: user's self-reported financial knowledge level. */
export const VALID_KNOWLEDGE_LEVELS = ['beginner', 'intermediate', 'advanced'];

/** Budget entry type — only income and expense are supported. */
export const VALID_BUDGET_TYPES = ['income', 'expense'];

/** AI insight card categories — maps to the three data surfaces (budget, portfolio, market) plus general recommendations. */
export const VALID_INSIGHT_TYPES = ['BUDGET', 'PORTFOLIO', 'MARKET', 'RECOMMENDATION'];

/** Insight card lifecycle states (PENDING → ACCEPTED or DISMISSED by user). */
export const VALID_INSIGHT_STATUSES = ['PENDING', 'ACCEPTED', 'DISMISSED'];

/** Onboarding quiz: user's financial goals (multi-select). */
export const VALID_GOALS = ['emergency_fund', 'investing', 'retirement', 'debt_payoff', 'education', 'vacation', 'house'];

/** Onboarding quiz: how often the user currently saves. */
export const VALID_SAVINGS_HABITS = ['never', 'sometimes', 'usually', 'always'];

/** Onboarding quiz: investment types the user is interested in learning about. */
export const VALID_INVESTING_INTERESTS = ['stocks', 'etfs', 'crypto', 'real_estate', 'bonds', 'index_funds'];

/** Supported stock tickers in the simulated market (used by market quotes and portfolio). */
export const VALID_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX',
  'AMD', 'INTC', 'ORCL', 'CRM', 'ADBE', 'PYPL', 'SQ', 'SHOP',
  'JPM', 'BAC', 'V', 'MA',
];

/** Suggested budget categories for expense/income tagging in the budget tracker. */
export const BUDGET_CATEGORIES = [
  'Food', 'Dining', 'Transport', 'Housing', 'Entertainment', 'Healthcare',
  'Education', 'Shopping', 'Utilities', 'Insurance', 'Subscriptions',
  'Travel', 'Fitness', 'Personal', 'Income', 'Salary', 'Freelance', 'Other',
];

// ─── Numeric bounds ──────────────────────────────────────────────────────────
// These prevent abuse (e.g., billion-dollar transactions) and overflow.
// Shared by validateAmount(), validatePrice(), and validateShares().

/** Maximum monetary amount per transaction ($10M ceiling prevents abuse). */
export const MAX_AMOUNT = 10_000_000;

/** Minimum monetary amount per transaction (1 cent — no zero or negative amounts). */
export const MIN_AMOUNT = 0.01;

/** Maximum shares per trade (100K prevents unrealistic paper positions). */
export const MAX_SHARES = 100_000;

/** Maximum character length for the user's buddy display name. */
export const MAX_BUDDY_NAME_LENGTH = 50;

/** Maximum character length for a single chat message (prevents token overuse in Claude API). */
export const MAX_CHAT_MESSAGE_LENGTH = 2000;

/** Maximum conversation turns sent as context to Claude (keeps prompt within token budget). */
export const MAX_CHAT_HISTORY_ITEMS = 20;

/** Express body-parser limit — rejects payloads larger than this to prevent DoS. */
export const MAX_BODY_SIZE = '100kb';
