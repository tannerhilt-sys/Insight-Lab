import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  PiggyBank,
  Target,
  TrendingUp,
  DollarSign,
  Plus,
  Sparkles,
  Shield,
  Calculator,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';

const savingsGoals = [
  {
    name: 'Emergency Fund',
    current: 7300,
    target: 10000,
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    monthlyContribution: 400,
    estimatedCompletion: 'Jul 2026',
  },
  {
    name: 'Vacation Fund',
    current: 1200,
    target: 3000,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    monthlyContribution: 200,
    estimatedCompletion: 'Dec 2026',
  },
  {
    name: 'New Car',
    current: 4500,
    target: 15000,
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    monthlyContribution: 350,
    estimatedCompletion: 'Apr 2028',
  },
  {
    name: 'College Fund',
    current: 2100,
    target: 25000,
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    monthlyContribution: 150,
    estimatedCompletion: 'Sep 2039',
  },
];

const hysaRecommendations = [
  {
    name: 'Ally Bank',
    apy: '4.25%',
    minBalance: '$0',
    highlight: 'FDIC Insured',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Marcus by Goldman Sachs',
    apy: '4.15%',
    minBalance: '$0',
    highlight: 'No-Penalty CDs',
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    name: 'Discover',
    apy: '4.00%',
    minBalance: '$0',
    highlight: 'Cashback Debit',
    gradient: 'from-orange-500 to-orange-700',
  },
];

const monthlySavingsData = [
  { month: 'Oct', amount: 720, trend: 720 },
  { month: 'Nov', amount: 680, trend: 710 },
  { month: 'Dec', amount: 910, trend: 770 },
  { month: 'Jan', amount: 800, trend: 790 },
  { month: 'Feb', amount: 850, trend: 810 },
  { month: 'Mar', amount: 890, trend: 850 },
];

export default function SavingsPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [monthlyExpenses, setMonthlyExpenses] = useState(2700);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Savings Hub</h1>
        <p className="text-slate-500 mt-1">Track your savings, set goals, and grow your wealth</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-5 h-5 text-emerald-200" />
            <span className="text-emerald-200 text-sm">Total Savings</span>
          </div>
          <p className="text-3xl font-bold">$19,750</p>
          <p className="text-emerald-200 text-sm mt-1">Across all accounts</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-200" />
            <span className="text-blue-200 text-sm">Monthly Savings Rate</span>
          </div>
          <p className="text-3xl font-bold">$850/mo</p>
          <p className="text-blue-200 text-sm mt-1">Average over 6 months</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-purple-200" />
            <span className="text-purple-200 text-sm">Interest Earned (YTD)</span>
          </div>
          <p className="text-3xl font-bold">$312.47</p>
          <p className="text-purple-200 text-sm mt-1">From high-yield accounts</p>
        </div>
      </div>

      {/* AI Savings Insight */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900">{buddyName}'s Savings Insight</h4>
            <p className="text-sm text-slate-700 mt-1">
              At your current savings rate of <span className="font-bold text-indigo-600">$850/month</span>, you'll reach your Emergency Fund goal by{' '}
              <span className="font-bold text-indigo-600">July 2026</span>. Consider increasing by{' '}
              <span className="font-bold text-emerald-600">$150/month</span> to hit it by May instead! You're doing great
              — your savings rate is in the top 30% of users your age.
            </p>
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Savings Goals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((goal) => {
            const percent = Math.round((goal.current / goal.target) * 1000) / 10;
            const remaining = goal.target - goal.current;
            const monthsLeft = Math.ceil(remaining / goal.monthlyContribution);
            return (
              <div
                key={goal.name}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{goal.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${goal.bgColor} ${goal.textColor}`}>
                    {percent}%
                  </span>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-xl font-bold text-slate-900">
                    ${goal.current.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400 mb-0.5">
                    / ${goal.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
                  <div
                    className={`bg-gradient-to-r ${goal.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Est. completion: {goal.estimatedCompletion}</span>
                  <span>${goal.monthlyContribution}/mo needed</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {monthsLeft} months remaining at current rate
                </div>
              </div>
            );
          })}

          {/* Add New Goal */}
          <button className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[180px]">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Plus className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-indigo-600">Add New Goal</span>
          </button>
        </div>
      </div>

      {/* High-Yield Savings Account Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">High-Yield Savings Accounts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hysaRecommendations.map((acct) => (
            <div
              key={acct.name}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`h-2 bg-gradient-to-r ${acct.gradient}`} />
              <div className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3">{acct.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">APY</span>
                    <span className="font-semibold text-emerald-600">{acct.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Balance</span>
                    <span className="font-medium text-slate-900">{acct.minBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Highlight</span>
                    <span className="font-medium text-slate-900">{acct.highlight}</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Tips */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Savings Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 50/30/20 Rule */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-3">The 50/30/20 Rule</h4>
            <p className="text-sm text-slate-600 mb-4">
              Allocate your after-tax income into three categories for balanced financial health.
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Needs</span>
                  <span className="text-slate-500">50%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2.5 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Wants</span>
                  <span className="text-slate-500">30%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2.5 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">Savings</span>
                  <span className="text-slate-500">20%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2.5 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pay Yourself First */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-3">Pay Yourself First</h4>
            <p className="text-sm text-slate-600 mb-3">
              Before paying bills or spending on wants, transfer a fixed amount to savings as soon as you get paid.
            </p>
            <ul className="space-y-2">
              {[
                'Set up automatic transfers on payday',
                'Start with 10% of your income',
                'Increase by 1% every quarter',
                'Treat savings like a non-negotiable bill',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Automate Savings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-3">Automate Your Savings</h4>
            <p className="text-sm text-slate-600 mb-3">
              Remove the temptation to spend by automating your savings. Here's how to set it up:
            </p>
            <ol className="space-y-2">
              {[
                'Open a separate high-yield savings account',
                'Set up direct deposit splits with your employer',
                'Schedule recurring transfers for each goal',
                'Use round-up apps for passive savings',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Emergency Fund Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-slate-900">Emergency Fund Calculator</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Enter your monthly expenses to see how much you need in your emergency fund.
            </p>
            <div className="mb-4">
              <label className="text-sm text-slate-500 mb-1 block">Monthly Expenses</label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">3-Month Fund</p>
                <p className="text-lg font-bold text-amber-600">
                  ${(monthlyExpenses * 3).toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">6-Month Fund</p>
                <p className="text-lg font-bold text-emerald-600">
                  ${(monthlyExpenses * 6).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Growth Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Monthly Savings Growth</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlySavingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`$${value}`, '']}
            />
            <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} name="Saved" />
            <Line type="monotone" dataKey="trend" stroke="#10b981" strokeWidth={2} dot={false} name="Trend" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
