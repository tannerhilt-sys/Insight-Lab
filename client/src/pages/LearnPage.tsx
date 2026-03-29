import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Receipt,
  Landmark,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Trophy,
  Zap,
  Search,
  BookOpen,
  ExternalLink,
  Filter,
  Play,
  Award,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Lesson {
  id: string;
  category: string;
  icon: typeof Wallet;
  color: string;
  bgColor: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  progress: number;
  content: string;
}

const lessons: Lesson[] = [
  {
    id: 'budgeting',
    category: 'Budgeting Basics',
    icon: Wallet,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    title: 'Budgeting Basics',
    description: 'Learn how to create and maintain a budget that works for your lifestyle.',
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    progress: 65,
    content: `**The 50/30/20 Rule**

One of the most popular budgeting frameworks is the 50/30/20 rule:

- **50% Needs**: Rent, utilities, groceries, insurance, minimum debt payments
- **30% Wants**: Dining out, entertainment, hobbies, subscriptions
- **20% Savings & Debt**: Emergency fund, investments, extra debt payments

**Getting Started:**
1. Track your income for a month
2. Categorize every expense
3. Identify areas where you can cut back
4. Set realistic goals for each category
5. Review and adjust monthly

**Pro Tips:**
- Automate your savings - "pay yourself first"
- Use the envelope method for variable expenses
- Review subscriptions quarterly and cancel unused ones
- Build a 1-month buffer in your checking account`,
  },
  {
    id: 'investing',
    category: 'Investing 101',
    icon: TrendingUp,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    title: 'Investing 101',
    description: 'Understand the basics of investing, from stocks to ETFs.',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    progress: 30,
    content: `**What is Investing?**

Investing is putting your money to work by purchasing assets that you expect to grow in value over time.

**Common Investment Types:**
- **Stocks**: Ownership shares in a company. Higher risk, higher potential reward.
- **Bonds**: Loans to companies or governments. Lower risk, steady income.
- **ETFs**: Bundles of stocks/bonds that trade like a single stock. Great for diversification.
- **Index Funds**: Track a market index like the S&P 500. Low fees, broad exposure.

**Key Concepts:**
- **Diversification**: Don't put all eggs in one basket
- **Compound Interest**: Your earnings earn their own earnings
- **Dollar-Cost Averaging**: Invest a fixed amount regularly, regardless of price
- **Risk vs. Reward**: Higher potential returns = higher risk

**The Power of Starting Early:**
If you invest $200/month starting at age 20 with 8% average returns, by age 60 you'd have approximately $700,000. Starting at 30? Only about $300,000. Time is your greatest asset!`,
  },
  {
    id: 'credit',
    category: 'Understanding Credit',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    title: 'Understanding Credit',
    description: 'Master your credit score and learn responsible credit card usage.',
    difficulty: 'Intermediate',
    estimatedTime: '18 min',
    progress: 0,
    content: `**Credit Score Breakdown:**

Your FICO score (300-850) is calculated from:
- **Payment History (35%)**: Pay on time, every time
- **Credit Utilization (30%)**: Keep below 30% of your limit
- **Length of History (15%)**: Older accounts help
- **Credit Mix (10%)**: Having different types of credit
- **New Credit (10%)**: Avoid opening too many accounts at once

**Building Good Credit:**
1. Always pay at least the minimum on time
2. Keep credit utilization under 30% (under 10% is ideal)
3. Don't close old credit cards
4. Limit hard inquiries
5. Check your credit report annually for errors

**Credit Card Best Practices:**
- Treat it like a debit card - only spend what you can pay off
- Pay the full balance every month to avoid interest
- Use rewards strategically (cashback, points)
- Set up autopay for at least the minimum payment`,
  },
  {
    id: 'saving',
    category: 'Saving Strategies',
    icon: PiggyBank,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    title: 'Saving Strategies',
    description: 'Effective strategies to save more money and build your emergency fund.',
    difficulty: 'Beginner',
    estimatedTime: '12 min',
    progress: 100,
    content: `**Emergency Fund: Your Financial Safety Net**

Aim for 3-6 months of essential expenses. Start with a $1,000 mini emergency fund.

**High-Yield Savings Accounts:**
Traditional banks offer 0.01% interest. High-yield savings accounts offer 4-5%! That's $400-500/year on a $10,000 balance vs. $1.

**Saving Strategies That Work:**
- **Pay Yourself First**: Automate transfers on payday
- **Round-Up Savings**: Round purchases up and save the difference
- **No-Spend Challenges**: Try a week or month with minimal spending
- **The 24-Hour Rule**: Wait 24 hours before any purchase over $50
- **Cash Envelope System**: Physical cash helps control spending

**Savings Goals Priority:**
1. Mini emergency fund ($1,000)
2. Employer 401k match (free money!)
3. Pay off high-interest debt
4. Full emergency fund (3-6 months)
5. Additional investing`,
  },
  {
    id: 'taxes',
    category: 'Tax Basics',
    icon: Receipt,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    title: 'Tax Basics',
    description: 'Understand tax brackets, deductions, and how to file your taxes.',
    difficulty: 'Intermediate',
    estimatedTime: '25 min',
    progress: 10,
    content: `**How Tax Brackets Work:**

Tax brackets are MARGINAL, meaning you only pay the higher rate on income ABOVE each threshold. Example (2024 Single):
- 10%: $0 - $11,600
- 12%: $11,601 - $47,150
- 22%: $47,151 - $100,525

If you earn $50,000, you DON'T pay 22% on everything. You pay:
- 10% on first $11,600 = $1,160
- 12% on $11,601-$47,150 = $4,266
- 22% on $47,151-$50,000 = $627
- Total: $6,053 (effective rate ~12.1%)

**Common Deductions & Credits:**
- Standard deduction ($14,600 single, 2024)
- Student loan interest (up to $2,500)
- IRA contributions
- Education credits

**Tax-Advantaged Accounts:**
- 401(k): Pre-tax contributions, tax-deferred growth
- Roth IRA: After-tax contributions, tax-free growth
- HSA: Triple tax advantage for healthcare`,
  },
  {
    id: 'retirement',
    category: 'Retirement Planning',
    icon: Landmark,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    title: 'Retirement Planning',
    description: 'Plan for your future with smart retirement strategies.',
    difficulty: 'Advanced',
    estimatedTime: '22 min',
    progress: 0,
    content: `**Retirement Account Types:**

**401(k) / 403(b):**
- Employer-sponsored, pre-tax contributions
- 2024 limit: $23,000 ($30,500 if 50+)
- Many employers match contributions (FREE MONEY!)
- Always contribute enough to get the full match

**Traditional IRA:**
- Individual account, may be tax-deductible
- 2024 limit: $7,000 ($8,000 if 50+)
- Withdrawals taxed as income in retirement

**Roth IRA:**
- After-tax contributions, TAX-FREE withdrawals
- Same contribution limits as Traditional
- Income limits apply
- Best if you expect higher taxes in retirement

**The 4% Rule:**
A common guideline: you can safely withdraw 4% of your portfolio annually in retirement. This means:
- Need $40,000/year? Save $1,000,000
- Need $60,000/year? Save $1,500,000

**Start NOW**: Even $100/month invested at age 25 can grow to $350,000+ by 65!`,
  },
];

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  students: number;
  description: string;
  gradient: string;
  progress?: number;
  comingSoon?: boolean;
}

const courseCategories = ['All', 'Investing', 'Banking', 'Credit', 'Taxes', 'Insurance', 'Real Estate', 'Crypto', 'Business'] as const;

const categoryGradients: Record<string, string> = {
  Investing: 'from-indigo-500 to-blue-600',
  Banking: 'from-emerald-500 to-teal-600',
  Credit: 'from-purple-500 to-violet-600',
  Taxes: 'from-red-500 to-rose-600',
  Insurance: 'from-sky-500 to-cyan-600',
  'Real Estate': 'from-amber-500 to-orange-600',
  Crypto: 'from-fuchsia-500 to-pink-600',
  Business: 'from-lime-500 to-green-600',
};

const courses: Course[] = [
  // Investing
  {
    id: 'stock-market-fundamentals',
    title: 'Stock Market Fundamentals',
    instructor: 'Sarah Chen',
    category: 'Investing',
    difficulty: 'Beginner',
    duration: '45 min',
    rating: 4.8,
    students: 12340,
    description: 'Learn how the stock market works, from exchanges to order types.',
    gradient: categoryGradients['Investing'],
    progress: 20,
  },
  {
    id: 'etfs-index-funds',
    title: 'ETFs & Index Funds Explained',
    instructor: 'Michael Torres',
    category: 'Investing',
    difficulty: 'Beginner',
    duration: '30 min',
    rating: 4.9,
    students: 8920,
    description: 'Understand why index funds are the #1 recommendation for new investors.',
    gradient: categoryGradients['Investing'],
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Basics',
    instructor: 'David Park',
    category: 'Investing',
    difficulty: 'Intermediate',
    duration: '60 min',
    rating: 4.5,
    students: 5430,
    description: 'Read stock charts, identify patterns, and understand indicators.',
    gradient: categoryGradients['Investing'],
  },
  {
    id: 'options-trading',
    title: 'Options Trading 101',
    instructor: 'Rachel Kim',
    category: 'Investing',
    difficulty: 'Advanced',
    duration: '90 min',
    rating: 4.3,
    students: 3210,
    description: 'Introduction to calls, puts, and basic options strategies.',
    gradient: categoryGradients['Investing'],
    comingSoon: true,
  },
  {
    id: 'dividend-investing',
    title: 'Dividend Investing Strategy',
    instructor: 'James Wright',
    category: 'Investing',
    difficulty: 'Intermediate',
    duration: '40 min',
    rating: 4.7,
    students: 6780,
    description: 'Build passive income through dividend-paying stocks and REITs.',
    gradient: categoryGradients['Investing'],
  },
  // Banking
  {
    id: 'choosing-bank-account',
    title: 'Choosing the Right Bank Account',
    instructor: 'Lisa Patel',
    category: 'Banking',
    difficulty: 'Beginner',
    duration: '20 min',
    rating: 4.6,
    students: 15230,
    description: 'Compare checking, savings, CDs, and money market accounts.',
    gradient: categoryGradients['Banking'],
  },
  {
    id: 'understanding-interest-rates',
    title: 'Understanding Interest Rates',
    instructor: 'Tom Garcia',
    category: 'Banking',
    difficulty: 'Beginner',
    duration: '25 min',
    rating: 4.4,
    students: 9100,
    description: 'How APY, APR, and compound interest affect your money.',
    gradient: categoryGradients['Banking'],
  },
  {
    id: 'online-banking-safety',
    title: 'Online Banking Safety',
    instructor: 'Nina Gupta',
    category: 'Banking',
    difficulty: 'Beginner',
    duration: '15 min',
    rating: 4.7,
    students: 11450,
    description: 'Protect your accounts with best security practices.',
    gradient: categoryGradients['Banking'],
  },
  // Credit
  {
    id: 'credit-scores-decoded',
    title: 'Credit Scores Decoded',
    instructor: 'Amanda Foster',
    category: 'Credit',
    difficulty: 'Beginner',
    duration: '35 min',
    rating: 4.8,
    students: 18670,
    description: 'Everything you need to know about FICO scores and how to improve yours.',
    gradient: categoryGradients['Credit'],
  },
  {
    id: 'smart-credit-card-strategy',
    title: 'Smart Credit Card Strategy',
    instructor: 'Kevin Lee',
    category: 'Credit',
    difficulty: 'Intermediate',
    duration: '30 min',
    rating: 4.6,
    students: 7890,
    description: 'Maximize rewards, avoid debt traps, and build credit strategically.',
    gradient: categoryGradients['Credit'],
  },
  {
    id: 'debt-payoff-strategies',
    title: 'Debt Payoff Strategies',
    instructor: 'Maria Santos',
    category: 'Credit',
    difficulty: 'Beginner',
    duration: '40 min',
    rating: 4.9,
    students: 14320,
    description: 'Snowball vs avalanche methods and how to become debt-free faster.',
    gradient: categoryGradients['Credit'],
    progress: 45,
  },
  // Taxes
  {
    id: 'tax-filing-beginners',
    title: 'Tax Filing for Beginners',
    instructor: 'Robert Chen',
    category: 'Taxes',
    difficulty: 'Beginner',
    duration: '50 min',
    rating: 4.5,
    students: 22100,
    description: 'Step-by-step guide to filing your taxes and maximizing refunds.',
    gradient: categoryGradients['Taxes'],
  },
  {
    id: 'tax-advantaged-accounts',
    title: 'Tax-Advantaged Accounts',
    instructor: 'Jessica Huang',
    category: 'Taxes',
    difficulty: 'Intermediate',
    duration: '35 min',
    rating: 4.7,
    students: 8430,
    description: '401K, IRA, HSA, and 529 plans explained in plain English.',
    gradient: categoryGradients['Taxes'],
  },
  // Insurance
  {
    id: 'insurance-101',
    title: 'Insurance 101',
    instructor: 'Brian Murphy',
    category: 'Insurance',
    difficulty: 'Beginner',
    duration: '30 min',
    rating: 4.3,
    students: 6540,
    description: 'Health, auto, renters, and life insurance basics everyone should know.',
    gradient: categoryGradients['Insurance'],
  },
  {
    id: 'life-insurance-guide',
    title: 'Life Insurance Guide',
    instructor: 'Sandra Okafor',
    category: 'Insurance',
    difficulty: 'Intermediate',
    duration: '25 min',
    rating: 4.4,
    students: 4120,
    description: 'Term vs whole life, how much coverage you need, and when to buy.',
    gradient: categoryGradients['Insurance'],
    comingSoon: true,
  },
  // Real Estate
  {
    id: 'first-time-home-buying',
    title: 'First-Time Home Buying',
    instructor: 'Carlos Rivera',
    category: 'Real Estate',
    difficulty: 'Intermediate',
    duration: '60 min',
    rating: 4.8,
    students: 19870,
    description: 'From saving for a down payment to closing day, step by step.',
    gradient: categoryGradients['Real Estate'],
  },
  {
    id: 'renting-vs-buying',
    title: 'Renting vs Buying Calculator',
    instructor: 'Emily Watson',
    category: 'Real Estate',
    difficulty: 'Beginner',
    duration: '20 min',
    rating: 4.5,
    students: 12340,
    description: 'When does buying make more financial sense than renting?',
    gradient: categoryGradients['Real Estate'],
  },
  // Crypto
  {
    id: 'cryptocurrency-basics',
    title: 'Cryptocurrency Basics',
    instructor: 'Alex Novak',
    category: 'Crypto',
    difficulty: 'Beginner',
    duration: '35 min',
    rating: 4.2,
    students: 25670,
    description: 'What crypto is, how blockchain works, and the risks involved.',
    gradient: categoryGradients['Crypto'],
  },
  {
    id: 'defi-web3',
    title: 'DeFi & Web3 Introduction',
    instructor: 'Priya Sharma',
    category: 'Crypto',
    difficulty: 'Advanced',
    duration: '45 min',
    rating: 4.0,
    students: 3890,
    description: 'Decentralized finance, smart contracts, and the future of money.',
    gradient: categoryGradients['Crypto'],
    comingSoon: true,
  },
  // Business
  {
    id: 'starting-side-hustle',
    title: 'Starting a Side Hustle',
    instructor: 'Jordan Blake',
    category: 'Business',
    difficulty: 'Beginner',
    duration: '40 min',
    rating: 4.6,
    students: 16780,
    description: 'Turn your skills into income with practical business basics.',
    gradient: categoryGradients['Business'],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : star - 0.5 <= rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-slate-300'
          }`}
        />
      ))}
      <span className="text-xs font-medium text-slate-600 ml-1">{rating}</span>
    </div>
  );
}

export default function LearnPage() {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const buddyName = user?.buddyName || 'Finance Buddy';

  // Calculate XP
  const totalProgress = lessons.reduce((s, l) => s + l.progress, 0);
  const xp = Math.round((totalProgress / (lessons.length * 100)) * 1000);
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;

  const toggleLesson = (id: string) => {
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  // Lesson stats
  const completedLessons = lessons.filter((l) => l.progress === 100).length;

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learn with {buddyName}</h1>
            <p className="text-primary-100 max-w-lg">
              Build your financial literacy with interactive lessons, personalized to your level.
              Ask {buddyName} questions anytime!
            </p>
          </div>

          {/* XP Indicator */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-lg">Level {level}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{xp} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all"
                style={{ width: `${(xpInLevel / 200) * 100}%` }}
              />
            </div>
            <p className="text-xs text-primary-200 mt-1">{200 - xpInLevel} XP to next level</p>
          </div>
        </div>
      </div>

      {/* Lesson Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const Icon = lesson.icon;

          return (
            <div
              key={lesson.id}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${
                isExpanded ? 'md:col-span-2 xl:col-span-3' : 'hover:shadow-md hover:border-slate-200'
              }`}
            >
              {/* Card header */}
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${lesson.bgColor} shrink-0`}>
                    <Icon className={`w-6 h-6 ${lesson.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[lesson.difficulty]}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-slate-500">{lesson.description}</p>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs font-medium text-primary-600">{lesson.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 p-1">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-4 animate-[fadeIn_0.3s_ease-out]">
                  <div className="prose prose-sm max-w-none">
                    {lesson.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h4 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3">
                            {line.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('- **')) {
                        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                        if (match) {
                          return (
                            <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                              <p className="text-sm text-slate-700">
                                <strong className="text-slate-900">{match[1]}</strong>
                                {match[2] ? `: ${match[2]}` : ''}
                              </p>
                            </div>
                          );
                        }
                      }
                      if (line.match(/^\d+\./)) {
                        return (
                          <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                            <span className="text-xs font-bold text-primary-600 mt-0.5 shrink-0 w-4">
                              {line.match(/^(\d+)/)?.[1]}.
                            </span>
                            <p className="text-sm text-slate-700">{line.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <div key={i} className="flex items-start gap-2 ml-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                            <p className="text-sm text-slate-700">{line.replace('- ', '')}</p>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={i} className="h-2" />;
                      return (
                        <p key={i} className="text-sm text-slate-600 leading-relaxed mb-2">
                          {line}
                        </p>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => navigate('/chat')}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ask {buddyName} about this
                    </button>
                    {lesson.progress < 100 && (
                      <button className="btn-secondary flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4" />
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
              )}

              {lesson.progress === 100 && !isExpanded && (
                <div className="px-6 pb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-emerald-600" />
                    Completed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 shrink-0">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Lessons Completed</p>
            <p className="text-2xl font-bold text-slate-900">
              {completedLessons}
              <span className="text-sm font-normal text-slate-400"> / {lessons.length}</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Learning Time</p>
            <p className="text-2xl font-bold text-slate-900">47 min</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 shrink-0">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Current Streak</p>
            <p className="text-2xl font-bold text-slate-900">5 days <span className="text-lg">&#128293;</span></p>
          </div>
        </div>
      </div>

      {/* Browse More Courses Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore More Courses</h2>
            <p className="text-sm text-slate-500">Expand your financial knowledge with our complete course library</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {courseCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Catalog Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No courses found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300 flex flex-col"
              >
                {/* Gradient Header */}
                <div className={`h-2.5 bg-gradient-to-r ${course.gradient}`} />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}>
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <p className="text-xs text-slate-400 mb-3">by {course.instructor}</p>

                  {/* Description */}
                  <p className="text-sm text-slate-500 mb-4 flex-1">{course.description}</p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={course.rating} />
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar (if started) */}
                  {course.progress !== undefined && !course.comingSoon && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs font-medium text-indigo-600">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {course.comingSoon ? (
                    <div className="flex items-center justify-center py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium">
                      Coming Soon
                    </div>
                  ) : course.progress !== undefined ? (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-indigo-200">
                      <Play className="w-4 h-4" />
                      Continue Course
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-indigo-200">
                      <ExternalLink className="w-4 h-4" />
                      Enroll Free
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
