// Shared server-side constants — never hardcode these inline

export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

export const JWT_EXPIRY = '7d';

export const VALID_KNOWLEDGE_LEVELS = ['beginner', 'intermediate', 'advanced'];
export const VALID_BUDGET_TYPES = ['income', 'expense'];
export const VALID_INSIGHT_TYPES = ['BUDGET', 'PORTFOLIO', 'MARKET', 'RECOMMENDATION'];
export const VALID_INSIGHT_STATUSES = ['PENDING', 'ACCEPTED', 'DISMISSED'];
export const VALID_GOALS = ['emergency_fund', 'investing', 'retirement', 'debt_payoff', 'education', 'vacation', 'house'];
export const VALID_SAVINGS_HABITS = ['never', 'sometimes', 'usually', 'always'];
export const VALID_INVESTING_INTERESTS = ['stocks', 'etfs', 'crypto', 'real_estate', 'bonds', 'index_funds'];
export const VALID_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX',
  'AMD', 'INTC', 'ORCL', 'CRM', 'ADBE', 'PYPL', 'SQ', 'SHOP',
  'JPM', 'BAC', 'V', 'MA',
];

export const BUDGET_CATEGORIES = [
  'Food', 'Dining', 'Transport', 'Housing', 'Entertainment', 'Healthcare',
  'Education', 'Shopping', 'Utilities', 'Insurance', 'Subscriptions',
  'Travel', 'Fitness', 'Personal', 'Income', 'Salary', 'Freelance', 'Other',
];

// Bounds
export const MAX_AMOUNT = 10_000_000;
export const MIN_AMOUNT = 0.01;
export const MAX_SHARES = 100_000;
export const MAX_BUDDY_NAME_LENGTH = 50;
export const MAX_CHAT_MESSAGE_LENGTH = 2000;
export const MAX_CHAT_HISTORY_ITEMS = 20;
export const MAX_BODY_SIZE = '100kb';
