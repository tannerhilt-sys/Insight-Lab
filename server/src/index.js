import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import budgetRoutes from './routes/budget.js';
import portfolioRoutes from './routes/portfolio.js';
import chatRoutes from './routes/chat.js';
import marketRoutes from './routes/market.js';
import insightsRoutes from './routes/insights.js';

import store, {
  addUser,
  setProfile,
  addBudgetEntry,
  addHolding,
  addSavingsGoal,
  addWatchlistItem,
  addInsightCard,
} from './data/store.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --------------- Middleware ---------------
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

// --------------- Routes ---------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/budget', budgetRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/insights', insightsRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Seed Data ---------------
async function seedDemoData() {
  const demoUserId = 'demo-user-001';
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Demo user
  addUser({
    id: demoUserId,
    email: 'demo@financebuddy.com',
    password: hashedPassword,
    buddyName: 'Alex',
    ageConfirmed: true,
    createdAt: '2025-01-15T10:00:00.000Z',
  });

  // Profile
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

  // Budget entries — current month
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const budgetSeed = [
    { type: 'income', amount: 4500, category: 'Salary', description: 'Monthly paycheck', date: `${month}-01` },
    { type: 'income', amount: 200, category: 'Freelance', description: 'Side project payment', date: `${month}-05` },
    { type: 'expense', amount: 1200, category: 'Rent', description: 'Monthly rent', date: `${month}-01` },
    { type: 'expense', amount: 350, category: 'Groceries', description: 'Weekly groceries', date: `${month}-03` },
    { type: 'expense', amount: 120, category: 'Utilities', description: 'Electric + internet', date: `${month}-05` },
    { type: 'expense', amount: 85, category: 'Transportation', description: 'Gas and transit', date: `${month}-07` },
    { type: 'expense', amount: 60, category: 'Entertainment', description: 'Streaming + movies', date: `${month}-10` },
    { type: 'expense', amount: 200, category: 'Dining Out', description: 'Restaurants', date: `${month}-12` },
    { type: 'expense', amount: 150, category: 'Shopping', description: 'Clothes and misc', date: `${month}-15` },
    { type: 'expense', amount: 45, category: 'Subscriptions', description: 'Apps and services', date: `${month}-08` },
  ];

  for (const entry of budgetSeed) {
    addBudgetEntry({
      id: uuidv4(),
      userId: demoUserId,
      ...entry,
      createdAt: new Date().toISOString(),
    });
  }

  // Holdings (paper trades)
  const holdingsSeed = [
    { ticker: 'AAPL', shares: 10, avgCost: 178.50 },
    { ticker: 'SPY', shares: 5, avgCost: 498.20 },
    { ticker: 'MSFT', shares: 3, avgCost: 405.30 },
    { ticker: 'NVDA', shares: 2, avgCost: 820.00 },
  ];

  for (const h of holdingsSeed) {
    addHolding({
      id: uuidv4(),
      userId: demoUserId,
      ...h,
      createdAt: '2025-02-01T10:00:00.000Z',
      updatedAt: '2025-02-01T10:00:00.000Z',
    });
  }

  // Watchlist
  const watchlistSeed = [
    { ticker: 'GOOGL', companyName: 'Alphabet Inc.' },
    { ticker: 'AMZN', companyName: 'Amazon.com Inc.' },
    { ticker: 'TSLA', companyName: 'Tesla Inc.' },
  ];

  for (const w of watchlistSeed) {
    addWatchlistItem({
      id: uuidv4(),
      userId: demoUserId,
      ...w,
      addedAt: new Date().toISOString(),
    });
  }

  // Savings goals
  addSavingsGoal({
    id: uuidv4(),
    userId: demoUserId,
    label: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 3200,
    deadline: '2025-12-31',
    createdAt: new Date().toISOString(),
  });

  addSavingsGoal({
    id: uuidv4(),
    userId: demoUserId,
    label: 'Vacation Fund',
    targetAmount: 3000,
    currentAmount: 800,
    deadline: '2025-08-01',
    createdAt: new Date().toISOString(),
  });

  // Insight cards
  addInsightCard({
    id: uuidv4(),
    userId: demoUserId,
    type: 'BUDGET',
    title: 'Great Savings Rate!',
    body: 'You\'re saving about 40% of your income this month. That\'s well above the recommended 20%. Keep it up and consider putting the extra into your Emergency Fund goal.',
    priority: 'high',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  addInsightCard({
    id: uuidv4(),
    userId: demoUserId,
    type: 'PORTFOLIO',
    title: 'Portfolio is Tech-Heavy',
    body: 'Your current holdings are concentrated in the technology sector. Consider diversifying into other sectors like healthcare, consumer staples, or financials to reduce risk.',
    priority: 'medium',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  addInsightCard({
    id: uuidv4(),
    userId: demoUserId,
    type: 'MARKET',
    title: 'Market Opportunity: Index Funds',
    body: 'As a beginner investor, index funds like SPY offer broad market exposure with low fees. You already own some — consider adding to this position regularly through dollar-cost averaging.',
    priority: 'low',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log('Demo data seeded: demo@financebuddy.com / password123');
}

// --------------- Start Server ---------------
seedDemoData().then(() => {
  app.listen(PORT, () => {
    console.log(`Finance Buddy server running on http://localhost:${PORT}`);
    console.log(`API base: http://localhost:${PORT}/api/v1`);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Note: ANTHROPIC_API_KEY not set — AI features will use mock responses');
    }
  });
});
