import { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Tv,
  Heart,
  Zap,
  Gift,
  Scissors,
  Phone,
  CreditCard,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Modal from '@/components/Modal';
import { useAuthStore } from '@/store/authStore';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  recurring: 'one-time' | 'weekly' | 'monthly' | 'yearly';
  tags: string[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  'Housing',
  'Food & Groceries',
  'Dining Out',
  'Transportation',
  'Gas',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Insurance',
  'Subscriptions',
  'Personal Care',
  'Education',
  'Gifts',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Housing: 'bg-indigo-100 text-indigo-700',
  'Food & Groceries': 'bg-orange-100 text-orange-700',
  'Dining Out': 'bg-amber-100 text-amber-700',
  Transportation: 'bg-blue-100 text-blue-700',
  Gas: 'bg-cyan-100 text-cyan-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Utilities: 'bg-teal-100 text-teal-700',
  Healthcare: 'bg-rose-100 text-rose-700',
  Insurance: 'bg-sky-100 text-sky-700',
  Subscriptions: 'bg-violet-100 text-violet-700',
  'Personal Care': 'bg-fuchsia-100 text-fuchsia-700',
  Education: 'bg-lime-100 text-lime-700',
  Gifts: 'bg-red-100 text-red-700',
  Other: 'bg-slate-100 text-slate-700',
};

const CATEGORY_PIE_COLORS: Record<string, string> = {
  Housing: '#6366f1',
  'Food & Groceries': '#f97316',
  'Dining Out': '#f59e0b',
  Transportation: '#3b82f6',
  Gas: '#06b6d4',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Utilities: '#14b8a6',
  Healthcare: '#f43f5e',
  Insurance: '#0ea5e9',
  Subscriptions: '#8b5cf6',
  'Personal Care': '#d946ef',
  Education: '#84cc16',
  Gifts: '#ef4444',
  Other: '#64748b',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Housing: <Home className="w-4 h-4" />,
  'Food & Groceries': <ShoppingBag className="w-4 h-4" />,
  'Dining Out': <Utensils className="w-4 h-4" />,
  Transportation: <Car className="w-4 h-4" />,
  Gas: <Car className="w-4 h-4" />,
  Entertainment: <Tv className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Healthcare: <Heart className="w-4 h-4" />,
  Insurance: <CreditCard className="w-4 h-4" />,
  Subscriptions: <RefreshCw className="w-4 h-4" />,
  'Personal Care': <Scissors className="w-4 h-4" />,
  Education: <Receipt className="w-4 h-4" />,
  Gifts: <Gift className="w-4 h-4" />,
  Other: <CreditCard className="w-4 h-4" />,
};

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', amount: 1200, category: 'Housing', description: 'Rent', date: '2026-03-01', recurring: 'monthly', tags: ['essential'] },
  { id: '2', amount: 180, category: 'Food & Groceries', description: 'Groceries', date: '2026-03-03', recurring: 'one-time', tags: ['essential'] },
  { id: '3', amount: 45, category: 'Dining Out', description: 'Uber Eats', date: '2026-03-04', recurring: 'one-time', tags: ['discretionary', 'avoidable'] },
  { id: '4', amount: 52, category: 'Gas', description: 'Gas', date: '2026-03-05', recurring: 'one-time', tags: ['essential'] },
  { id: '5', amount: 15.99, category: 'Subscriptions', description: 'Netflix', date: '2026-03-01', recurring: 'monthly', tags: ['discretionary'] },
  { id: '6', amount: 10.99, category: 'Subscriptions', description: 'Spotify', date: '2026-03-01', recurring: 'monthly', tags: ['discretionary'] },
  { id: '7', amount: 75, category: 'Healthcare', description: 'Gym membership', date: '2026-03-01', recurring: 'monthly', tags: ['essential'] },
  { id: '8', amount: 95, category: 'Utilities', description: 'Electric bill', date: '2026-03-07', recurring: 'monthly', tags: ['essential'] },
  { id: '9', amount: 120, category: 'Shopping', description: 'New shoes', date: '2026-03-10', recurring: 'one-time', tags: ['discretionary'] },
  { id: '10', amount: 32, category: 'Entertainment', description: 'Movie tickets', date: '2026-03-08', recurring: 'one-time', tags: ['discretionary'] },
  { id: '11', amount: 145, category: 'Insurance', description: 'Car insurance', date: '2026-03-01', recurring: 'monthly', tags: ['essential'] },
  { id: '12', amount: 35, category: 'Personal Care', description: 'Haircut', date: '2026-03-12', recurring: 'one-time', tags: ['essential'] },
  { id: '13', amount: 48, category: 'Dining Out', description: 'Coffee shops', date: '2026-03-15', recurring: 'one-time', tags: ['discretionary', 'avoidable'] },
  { id: '14', amount: 67, category: 'Shopping', description: 'Amazon purchase', date: '2026-03-14', recurring: 'one-time', tags: ['discretionary'] },
  { id: '15', amount: 85, category: 'Utilities', description: 'Phone bill', date: '2026-03-07', recurring: 'monthly', tags: ['essential'] },
  { id: '16', amount: 40, category: 'Healthcare', description: 'Doctor copay', date: '2026-03-18', recurring: 'one-time', tags: ['essential'] },
  { id: '17', amount: 50, category: 'Gifts', description: 'Birthday gift', date: '2026-03-20', recurring: 'one-time', tags: ['discretionary'] },
];

const DAILY_SPENDING = [
  { day: 'Mar 1', amount: 1542.98 },
  { day: 'Mar 3', amount: 180 },
  { day: 'Mar 4', amount: 45 },
  { day: 'Mar 5', amount: 52 },
  { day: 'Mar 7', amount: 180 },
  { day: 'Mar 8', amount: 32 },
  { day: 'Mar 10', amount: 120 },
  { day: 'Mar 12', amount: 35 },
  { day: 'Mar 14', amount: 67 },
  { day: 'Mar 15', amount: 48 },
  { day: 'Mar 18', amount: 40 },
  { day: 'Mar 20', amount: 50 },
];

const LAST_MONTH_BY_CATEGORY: Record<string, number> = {
  Housing: 1200,
  'Food & Groceries': 220,
  'Dining Out': 130,
  Gas: 60,
  Subscriptions: 26.98,
  Healthcare: 75,
  Utilities: 170,
  Shopping: 250,
  Entertainment: 55,
  Insurance: 145,
  'Personal Care': 30,
  Gifts: 0,
  Transportation: 40,
  Education: 0,
  Other: 0,
};

const AI_SUGGESTIONS: Record<string, string> = {
  'Dining Out': 'Your dining out is 40% above your 3-month average. Consider meal prepping 2 days a week to save ~$100/month.',
  Shopping: 'You spent $187 on shopping this month. Try implementing a 48-hour rule before non-essential purchases.',
  Subscriptions: 'You have 2 active subscriptions totaling $26.98/mo. Review if you use both regularly - bundling could save $5/mo.',
  'Food & Groceries': 'Your grocery spending is 18% lower than last month. Great job! Keep using shopping lists to stay on track.',
  Utilities: 'Your utilities are $10 higher than your 3-month average. Check for energy-saving opportunities.',
  Entertainment: 'Entertainment spending is well controlled at $32. Nice budgeting!',
  Healthcare: 'Consider using your FSA/HSA for the $40 copay to save on taxes.',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type SortKey = 'date' | 'amount' | 'category';
type SortDir = 'asc' | 'desc';

const emptyForm = {
  amount: '',
  category: CATEGORIES[0],
  description: '',
  date: '2026-03-28',
  recurring: 'one-time' as 'one-time' | 'weekly' | 'monthly' | 'yearly',
  tags: '',
};

export default function ExpensesPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Filters & sort
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Expandable category deep dive
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  /* ---- derived data ---- */

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const avgDaily = useMemo(() => Math.round((totalExpenses / 30) * 100) / 100, [totalExpenses]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const highestCategory = byCategory[0] ?? { name: '-', value: 0 };

  const recurringExpenses = useMemo(
    () => expenses.filter((e) => e.recurring !== 'one-time'),
    [expenses],
  );
  const totalRecurring = useMemo(
    () => recurringExpenses.reduce((s, e) => s + e.amount, 0),
    [recurringExpenses],
  );

  const filteredSorted = useMemo(() => {
    let list = [...expenses];
    if (filterCategory !== 'All') list = list.filter((e) => e.category === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [expenses, filterCategory, search, sortKey, sortDir]);

  /* ---- handlers ---- */

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setForm({
      amount: exp.amount.toString(),
      category: exp.category,
      description: exp.description,
      date: exp.date,
      recurring: exp.recurring,
      tags: exp.tags.join(', '),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (editingId) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, amount: parseFloat(form.amount) || 0, category: form.category, description: form.description, date: form.date, recurring: form.recurring, tags }
            : e,
        ),
      );
    } else {
      setExpenses((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          amount: parseFloat(form.amount) || 0,
          category: form.category,
          description: form.description,
          date: form.date,
          recurring: form.recurring,
          tags,
        },
      ]);
    }
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? (
        <ChevronUp className="w-3.5 h-3.5 inline ml-1" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 inline ml-1" />
      )
    ) : null;

  const assumedIncome = 4650;
  const flexBudget = assumedIncome - totalRecurring;
  const budgetRemaining = assumedIncome - totalExpenses;
  const dayOfMonth = 28;
  const expectedPace = (totalExpenses / dayOfMonth) * 30;

  /* ---- render ---- */

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-indigo-600" />
            My Expenses
          </h1>
          <p className="text-slate-500 mt-1">Track, categorize, and optimize your spending</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-200/60 rounded-xl">
              <DollarSign className="w-5 h-5 text-red-700" />
            </div>
            <span className="text-sm font-medium text-red-700">Total Expenses</span>
          </div>
          <p className="text-3xl font-bold text-red-800">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-red-600 mt-1">March 2026</p>
        </div>

        <div className="card bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-200/60 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-sm font-medium text-slate-700">Avg Daily Spending</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">${avgDaily.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">Per day this month</p>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-200/60 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-sm font-medium text-amber-700">Highest Category</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">${highestCategory.value.toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-1">{highestCategory.name}</p>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-200/60 rounded-xl">
              <TrendingDown className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-sm font-medium text-emerald-700">vs Last Month</span>
          </div>
          <p className="text-3xl font-bold text-emerald-800">-12%</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> Lower spending
          </p>
        </div>
      </div>

      {/* Spending Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {buddyName}'s Spending Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top 3 Areas to Save */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
            <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Top 3 Areas to Save
            </h4>
            <ol className="space-y-2 text-sm text-amber-900">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span><strong>Dining Out ($93):</strong> Cut back on food delivery to save ~$50/mo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span><strong>Shopping ($187):</strong> Implement a 48-hour wait rule for non-essentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span><strong>Subscriptions ($26.98):</strong> Review if you use all services regularly</span>
              </li>
            </ol>
          </div>

          {/* Spending Velocity */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Spending Velocity
            </h4>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-emerald-800">${(totalExpenses / dayOfMonth).toFixed(0)}/day</p>
              <p className="text-sm text-emerald-700">
                {expectedPace < assumedIncome ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    On track to stay within budget
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Pace exceeds monthly income
                  </span>
                )}
              </p>
              <p className="text-xs text-emerald-600">Projected monthly total: ${expectedPace.toFixed(0)}</p>
            </div>
          </div>

          {/* Budget Remaining */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Budget Remaining
            </h4>
            <p className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-indigo-800' : 'text-red-700'}`}>
              ${budgetRemaining.toFixed(2)}
            </p>
            <p className="text-sm text-indigo-700 mt-1">
              {budgetRemaining >= 0
                ? `You can spend ~$${(budgetRemaining / (30 - dayOfMonth || 1)).toFixed(0)}/day for the rest of the month`
                : 'You have exceeded your monthly budget'}
            </p>
            <div className="mt-3 w-full bg-indigo-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all"
                style={{ width: `${Math.min((totalExpenses / assumedIncome) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-indigo-500 mt-1">{((totalExpenses / assumedIncome) * 100).toFixed(0)}% of income spent</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={byCategory}
                cx="50%"
                cy="50%"
                outerRadius={115}
                innerRadius={65}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                paddingAngle={2}
              >
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_PIE_COLORS[entry.name] ?? '#64748b'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4">
            {byCategory.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_PIE_COLORS[entry.name] ?? '#64748b' }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending Trends</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={DAILY_SPENDING}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recurring Expenses Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          Recurring Expenses Summary
        </h3>
        <div className="space-y-2 mb-4">
          {recurringExpenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[e.category] ?? 'bg-slate-100 text-slate-700'}`}>
                  {CATEGORY_ICONS[e.category]}
                  {e.category}
                </span>
                <span className="text-sm text-slate-900">{e.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 capitalize">{e.recurring}</span>
                <span className="font-semibold text-slate-900">${e.amount.toFixed(2)}</span>
                <button
                  onClick={() => openEdit(e)}
                  className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Edit recurring expense"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Monthly Recurring</p>
            <p className="text-xl font-bold text-slate-900">${totalRecurring.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">% of Income (Recurring)</p>
            <p className="text-xl font-bold text-slate-900">{((totalRecurring / assumedIncome) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Flexible Budget Remaining</p>
            <p className="text-xl font-bold text-emerald-700">${flexBudget.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          These are your fixed costs. Your flexible spending budget is <span className="font-semibold text-slate-700">${flexBudget.toFixed(2)}</span> after recurring expenses.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="card overflow-hidden !p-0">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Purchase History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th
                  className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => toggleSort('date')}
                >
                  Date
                  <SortIcon col="date" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Description</th>
                <th
                  className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => toggleSort('category')}
                >
                  Category
                  <SortIcon col="category" />
                </th>
                <th
                  className="text-right px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => toggleSort('amount')}
                >
                  Amount
                  <SortIcon col="amount" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Tags</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Recurring</th>
              </tr>
            </thead>
            <tbody>
              {filteredSorted.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(exp.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{exp.description}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[exp.category] ?? 'bg-slate-100 text-slate-700'}`}>
                      {CATEGORY_ICONS[exp.category]}
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">${exp.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {exp.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {exp.recurring !== 'one-time' && (
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                        <RefreshCw className="w-3 h-3" />
                        {exp.recurring}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Deep Dive */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Category Deep Dive
        </h3>
        <div className="space-y-3">
          {byCategory.map((cat) => {
            const pct = ((cat.value / totalExpenses) * 100).toFixed(1);
            const lastMonth = LAST_MONTH_BY_CATEGORY[cat.name] ?? 0;
            const diff = lastMonth > 0 ? (((cat.value - lastMonth) / lastMonth) * 100).toFixed(0) : null;
            const isUp = diff !== null && parseFloat(diff) > 0;
            const isExpanded = expandedCategory === cat.name;
            const catExpenses = expenses.filter((e) => e.category === cat.name);

            return (
              <div key={cat.name} className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: (CATEGORY_PIE_COLORS[cat.name] ?? '#64748b') + '20', color: CATEGORY_PIE_COLORS[cat.name] ?? '#64748b' }}
                    >
                      {CATEGORY_ICONS[cat.name]}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{cat.name}</p>
                      <p className="text-xs text-slate-500">{pct}% of total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-slate-900">${cat.value.toFixed(2)}</p>
                    {diff !== null && (
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(parseFloat(diff))}%
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-slate-100">
                    <div className="mt-3 space-y-2">
                      {catExpenses.map((e) => (
                        <div key={e.id} className="flex items-center justify-between text-sm py-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">
                              {new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-slate-900">{e.description}</span>
                            {e.recurring !== 'one-time' && (
                              <span className="text-xs text-indigo-500 flex items-center gap-0.5">
                                <RefreshCw className="w-3 h-3" />
                                {e.recurring}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-slate-900">${e.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {AI_SUGGESTIONS[cat.name] && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-xl flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-indigo-700">{AI_SUGGESTIONS[cat.name]}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? 'Edit Expense' : 'Add Expense'} maxWidth="max-w-md">
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What was this expense for?"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Recurring */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recurring</label>
            <div className="flex gap-2 flex-wrap">
              {(['one-time', 'weekly', 'monthly', 'yearly'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setForm({ ...form, recurring: freq })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    form.recurring === freq
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags <span className="text-slate-400 font-normal">(comma separated, optional)</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="essential, discretionary, avoidable"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
          >
            {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
