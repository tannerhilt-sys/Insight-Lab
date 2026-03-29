import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import budgetRoutes from './routes/budget.js';
import portfolioRoutes from './routes/portfolio.js';
import chatRoutes from './routes/chat.js';
import marketRoutes from './routes/market.js';
import insightsRoutes from './routes/insights.js';

import { getUserByEmail, addUser, setProfile, addBudgetEntry, addHolding, addSavingsGoal, addWatchlistItem, addInsightCard } from './data/store.js';
import { MAX_BODY_SIZE } from './constants.js';

// --------------- Env Validation ---------------
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set — using insecure default. Set this in production.');
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('WARNING: ANTHROPIC_API_KEY not set — AI features will use mock responses.');
}

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',');

// --------------- Security Middleware ---------------
app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled for dev; enable in production
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: MAX_BODY_SIZE }));

// Global rate limit: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// Stricter limit for auth endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

// --------------- Routes ---------------
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/budget', budgetRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/insights', insightsRoutes);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// --------------- Seed Data (idempotent) ---------------
async function seedDemoData() {
  const DEMO_EMAIL = 'demo@financebuddy.com';

  // Idempotency check — skip if demo user already exists
  if (getUserByEmail(DEMO_EMAIL)) return;

  const demoUserId = 'demo-user-001';
  const hashedPassword = await bcrypt.hash('password123', 10);

  addUser({
    id: demoUserId,
    email: DEMO_EMAIL,
    password: hashedPassword,
    buddyName: 'Alex',
    ageConfirmed: true,
    createdAt: '2025-01-15T10:00:00.000Z',
  });

  setProfile(demoUserId, {
    userId: demoUserId,
    buddyName: 'Alex',
    goals: ['emergency_fund', 'investing', 'retirement'],
    knowledgeLevel: 'beginner',
    riskScore: 5,
    savingsHabit: 'sometimes',
    investingInterest: 'curious',
    createdAt: '2025-01-15T10:05:00.000Z',
    updatedAt: '2025-01-15T10:05:00.000Z',
  });

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const budgetSeed = [
    { type: 'income',  amount: 4500, category: 'Salary',         description: 'Monthly paycheck',       date: `${month}-01` },
    { type: 'income',  amount: 200,  category: 'Freelance',       description: 'Side project payment',   date: `${month}-05` },
    { type: 'expense', amount: 1200, category: 'Rent',            description: 'Monthly rent',           date: `${month}-01` },
    { type: 'expense', amount: 350,  category: 'Groceries',       description: 'Weekly groceries',       date: `${month}-03` },
    { type: 'expense', amount: 120,  category: 'Utilities',       description: 'Electric + internet',    date: `${month}-05` },
    { type: 'expense', amount: 85,   category: 'Transportation',  description: 'Gas and transit',        date: `${month}-07` },
    { type: 'expense', amount: 60,   category: 'Entertainment',   description: 'Streaming + movies',     date: `${month}-10` },
    { type: 'expense', amount: 200,  category: 'Dining Out',      description: 'Restaurants',            date: `${month}-12` },
    { type: 'expense', amount: 150,  category: 'Shopping',        description: 'Clothes and misc',       date: `${month}-15` },
    { type: 'expense', amount: 45,   category: 'Subscriptions',   description: 'Apps and services',      date: `${month}-08` },
  ];

  for (const entry of budgetSeed) {
    addBudgetEntry({ id: uuidv4(), userId: demoUserId, ...entry, createdAt: new Date().toISOString() });
  }

  const holdingsSeed = [
    { ticker: 'AAPL', shares: 10, avgCost: 178.50 },
    { ticker: 'SPY',  shares: 5,  avgCost: 498.20 },
    { ticker: 'MSFT', shares: 3,  avgCost: 405.30 },
    { ticker: 'NVDA', shares: 2,  avgCost: 820.00 },
  ];

  for (const h of holdingsSeed) {
    addHolding({ id: uuidv4(), userId: demoUserId, ...h, createdAt: '2025-02-01T10:00:00.000Z', updatedAt: '2025-02-01T10:00:00.000Z' });
  }

  for (const w of [
    { ticker: 'GOOGL', companyName: 'Alphabet Inc.' },
    { ticker: 'AMZN',  companyName: 'Amazon.com Inc.' },
    { ticker: 'TSLA',  companyName: 'Tesla Inc.' },
  ]) {
    addWatchlistItem({ id: uuidv4(), userId: demoUserId, ...w, addedAt: new Date().toISOString() });
  }

  addSavingsGoal({ id: uuidv4(), userId: demoUserId, label: 'Emergency Fund', targetAmount: 10000, currentAmount: 3200, deadline: '2025-12-31', createdAt: new Date().toISOString() });
  addSavingsGoal({ id: uuidv4(), userId: demoUserId, label: 'Vacation Fund',  targetAmount: 3000,  currentAmount: 800,  deadline: '2025-08-01', createdAt: new Date().toISOString() });

  addInsightCard({ id: uuidv4(), userId: demoUserId, type: 'BUDGET',     title: 'Great Savings Rate!',          body: "You're saving about 40% of your income this month. That's well above the recommended 20%. Keep it up and consider putting the extra into your Emergency Fund goal.", priority: 'high',   status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  addInsightCard({ id: uuidv4(), userId: demoUserId, type: 'PORTFOLIO',  title: 'Portfolio is Tech-Heavy',      body: 'Your current holdings are concentrated in the technology sector. Consider diversifying into other sectors like healthcare, consumer staples, or financials to reduce risk.',        priority: 'medium', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  addInsightCard({ id: uuidv4(), userId: demoUserId, type: 'MARKET',     title: 'Market Opportunity: Index Funds', body: 'As a beginner investor, index funds like SPY offer broad market exposure with low fees. You already own some — consider adding to this position regularly through dollar-cost averaging.', priority: 'low', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

  console.log('Demo data seeded: demo@financebuddy.com / password123');
}

// --------------- Start Server ---------------
seedDemoData().then(() => {
  app.listen(PORT, () => {
    console.log(`Finance Buddy server running on http://localhost:${PORT}`);
    console.log(`API base: http://localhost:${PORT}/api/v1`);
  });
});
