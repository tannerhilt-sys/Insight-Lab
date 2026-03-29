import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  Target,
  Sparkles,
  Plus,
  ShoppingCart,
  MessageCircle,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  Shield,
  Landmark,
  DollarSign,
  Banknote,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useBudgetStore } from '@/store/budgetStore';
import InsightCard from '@/components/InsightCard';

// Mock data for the dashboard
const monthlyData = [
  { month: 'Sep', income: 4200, expenses: 2800 },
  { month: 'Oct', income: 4200, expenses: 3100 },
  { month: 'Nov', income: 4500, expenses: 2600 },
  { month: 'Dec', income: 5100, expenses: 3400 },
  { month: 'Jan', income: 4200, expenses: 2900 },
  { month: 'Feb', income: 4200, expenses: 2700 },
];

const recentActivity = [
  { id: '1', type: 'expense', desc: 'Grocery shopping', amount: -87.52, time: '2 hours ago', category: 'Food' },
  { id: '2', type: 'income', desc: 'Freelance payment', amount: 450, time: '5 hours ago', category: 'Income' },
  { id: '3', type: 'trade', desc: 'Bought 5 shares AAPL', amount: -875.50, time: '1 day ago', category: 'Invest' },
  { id: '4', type: 'expense', desc: 'Netflix subscription', amount: -15.99, time: '2 days ago', category: 'Entertainment' },
  { id: '5', type: 'income', desc: 'Salary deposit', amount: 4200, time: '3 days ago', category: 'Salary' },
];

const insights = [
  {
    type: 'BUDGET' as const,
    title: 'Dining expenses up 23%',
    body: "Your restaurant spending increased $127 compared to last month. Consider cooking at home 2 more nights per week to save approximately $200/month.",
    riskLabel: 'medium',
  },
  {
    type: 'PORTFOLIO' as const,
    title: 'Tech sector rally',
    body: "Your tech holdings are up 8.2% this week. Consider taking some profits or rebalancing if tech exceeds 40% of your portfolio.",
  },
  {
    type: 'RECOMMENDATION' as const,
    title: 'Emergency fund milestone',
    body: "You're 73% towards your emergency fund goal. At your current savings rate, you'll reach it in about 2 months. Keep it up!",
    riskLabel: 'low',
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [dismissedInsights, setDismissedInsights] = useState<number[]>([]);

  const buddyName = user?.buddyName || 'Finance Buddy';

  const quickActions = [
    { label: 'Add Expense', icon: Plus, color: 'bg-red-500', to: '/budget' },
    { label: 'Buy Stock', icon: ShoppingCart, color: 'bg-primary-600', to: '/portfolio' },
    { label: `Ask ${buddyName}`, icon: MessageCircle, color: 'bg-purple-500', to: '/chat' },
    { label: 'Start Lesson', icon: GraduationCap, color: 'bg-accent-500', to: '/learn' },
    { label: 'Credit Cards', icon: CreditCard, color: 'bg-amber-500', to: '/credit-cards' },
    { label: 'Fraud Protection', icon: Shield, color: 'bg-red-500', to: '/fraud-protection' },
    { label: 'Add Income', icon: DollarSign, color: 'bg-emerald-500', to: '/budget' },
    { label: 'View Loans', icon: Banknote, color: 'bg-orange-500', to: '/loans' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Hey there! {buddyName} here 👋
          </h1>
          <p className="text-slate-500">Here's your financial overview for today.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Budget Health */}
        <div className="card group cursor-pointer" onClick={() => navigate('/budget')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +$1,500
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Budget Health</p>
          <p className="text-2xl font-bold text-slate-900">$4,200</p>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-emerald-600">Income: $4,200</span>
            <span className="text-red-500">Expenses: $2,700</span>
          </div>
        </div>

        {/* Portfolio */}
        <div className="card group cursor-pointer" onClick={() => navigate('/portfolio')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-primary-100 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              +4.2%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Portfolio Value</p>
          <p className="text-2xl font-bold text-slate-900">$12,847</p>
          <p className="text-xs text-emerald-600 mt-1">+$518.32 all time</p>
        </div>

        {/* Savings Goal */}
        <div className="card group cursor-pointer" onClick={() => navigate('/budget')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              73%
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Emergency Fund</p>
          <p className="text-2xl font-bold text-slate-900">$7,300</p>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '73%' }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">of $10,000 goal</p>
        </div>

        {/* Banking */}
        <div className="card group cursor-pointer" onClick={() => navigate('/banking')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              3 accounts
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">Banking</p>
          <p className="text-2xl font-bold text-slate-900">$24,448</p>
          <p className="text-xs text-slate-500 mt-1">Checking + Savings + IRA</p>
        </div>

        {/* AI Insights */}
        <div className="card group cursor-pointer" onClick={() => navigate('/chat')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              3 new
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-1">{buddyName}'s Tips</p>
          <p className="text-lg font-semibold text-slate-900 leading-snug">
            "You're on track to save $1.5k this month!"
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200
                         hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className={`p-2 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="xl:col-span-2 card">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'
                  }`}
                >
                  {item.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    item.amount > 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{buddyName}'s Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {insights
            .filter((_, i) => !dismissedInsights.includes(i))
            .map((insight, i) => (
              <InsightCard
                key={i}
                {...insight}
                onAccept={() => {}}
                onDismiss={() => setDismissedInsights((prev) => [...prev, i])}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
