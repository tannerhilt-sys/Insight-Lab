import { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trash2,
  DollarSign,
  TrendingDown,
  PiggyBank,
  Target,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Modal from '@/components/Modal';
import type { BudgetEntry, BudgetGoal } from '@/store/budgetStore';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping',
  'Utilities', 'Healthcare', 'Education', 'Salary', 'Freelance', 'Investment', 'Other',
];

// Mock data
const mockEntries: BudgetEntry[] = [
  { id: '1', type: 'income', amount: 4200, category: 'Salary', description: 'Monthly salary', date: '2026-03-01' },
  { id: '2', type: 'income', amount: 450, category: 'Freelance', description: 'Web design project', date: '2026-03-05' },
  { id: '3', type: 'expense', amount: 1200, category: 'Housing', description: 'Rent payment', date: '2026-03-01' },
  { id: '4', type: 'expense', amount: 350, category: 'Food', description: 'Groceries', date: '2026-03-03' },
  { id: '5', type: 'expense', amount: 120, category: 'Transportation', description: 'Gas & transit', date: '2026-03-04' },
  { id: '6', type: 'expense', amount: 85, category: 'Entertainment', description: 'Streaming & movies', date: '2026-03-06' },
  { id: '7', type: 'expense', amount: 200, category: 'Shopping', description: 'New headphones', date: '2026-03-08' },
  { id: '8', type: 'expense', amount: 150, category: 'Utilities', description: 'Electric & internet', date: '2026-03-10' },
  { id: '9', type: 'expense', amount: 250, category: 'Food', description: 'Dining out', date: '2026-03-12' },
  { id: '10', type: 'expense', amount: 75, category: 'Healthcare', description: 'Gym membership', date: '2026-03-15' },
];

const mockGoals: BudgetGoal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 7300, deadline: '2026-06-01' },
  { id: '2', name: 'Vacation Fund', targetAmount: 3000, currentAmount: 1200, deadline: '2026-08-01' },
  { id: '3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: '2026-05-01' },
];

const monthlyComparison = [
  { month: 'Oct', income: 4200, expenses: 3100 },
  { month: 'Nov', income: 4500, expenses: 2600 },
  { month: 'Dec', income: 5100, expenses: 3400 },
  { month: 'Jan', income: 4200, expenses: 2900 },
  { month: 'Feb', income: 4200, expenses: 2700 },
  { month: 'Mar', income: 4650, expenses: 2430 },
];

export default function BudgetPage() {
  const [entries, setEntries] = useState<BudgetEntry[]>(mockEntries);
  const [goals] = useState<BudgetGoal[]>(mockGoals);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: CATEGORIES[0],
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totals = useMemo(() => {
    const income = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const expenses = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [entries]);

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    entries
      .filter((e) => e.type === 'expense')
      .forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const handleAddEntry = () => {
    const entry: BudgetEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      amount: parseFloat(newEntry.amount) || 0,
      category: newEntry.category,
      description: newEntry.description,
      date: newEntry.date,
    };
    setEntries((prev) => [...prev, entry]);
    setShowAddModal(false);
    setNewEntry({ type: 'expense', amount: '', category: CATEGORIES[0], description: '', date: new Date().toISOString().split('T')[0] });
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const monthStr = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 min-w-[200px] text-center">{monthStr}</h2>
          <button
            onClick={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-200/60 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-sm font-medium text-emerald-700">Total Income</span>
          </div>
          <p className="text-3xl font-bold text-emerald-800">${totals.income.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-200/60 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-700" />
            </div>
            <span className="text-sm font-medium text-red-700">Total Expenses</span>
          </div>
          <p className="text-3xl font-bold text-red-800">${totals.expenses.toLocaleString()}</p>
        </div>

        <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-200/60 rounded-xl">
              <PiggyBank className="w-5 h-5 text-primary-700" />
            </div>
            <span className="text-sm font-medium text-primary-700">Net Savings</span>
          </div>
          <p className="text-3xl font-bold text-primary-800">${totals.net.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No expenses yet</div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">AI Budget Insight</h3>
            {showInsight ? (
              <p className="text-sm text-slate-600 leading-relaxed">
                Great news! Your spending this month is 12% lower than last month. Your biggest savings came from
                reducing dining out expenses. I'd recommend putting that extra $200 towards your Emergency Fund goal --
                you'd hit it a month earlier! Also, your Entertainment spending has been consistent, which shows good discipline.
                One area to watch: Transportation costs have been creeping up. Consider carpooling or public transit to save an
                additional $50-80/month.
              </p>
            ) : (
              <p className="text-sm text-slate-500">Click below to get personalized insights about your spending.</p>
            )}
            {!showInsight && (
              <button onClick={() => setShowInsight(true)} className="mt-3 btn-primary text-sm py-2">
                Get AI Insight
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{entry.description}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {entry.category}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm font-semibold text-right ${entry.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Savings Goals */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600" />
          Savings Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div key={goal.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">{goal.name}</h4>
                  <span className="text-sm font-medium text-primary-600">{pct}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">${goal.currentAmount.toLocaleString()}</span>
                  <span className="text-slate-500">${goal.targetAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Entry Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Entry">
        <div className="space-y-5">
          {/* Type toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setNewEntry((e) => ({ ...e, type: 'income' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                newEntry.type === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setNewEntry((e) => ({ ...e, type: 'expense' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                newEntry.type === 'expense'
                  ? 'bg-white text-red-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry((n) => ({ ...n, amount: e.target.value }))}
                className="input pl-8"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={newEntry.category}
              onChange={(e) => setNewEntry((n) => ({ ...n, category: e.target.value }))}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <input
              type="text"
              value={newEntry.description}
              onChange={(e) => setNewEntry((n) => ({ ...n, description: e.target.value }))}
              className="input"
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry((n) => ({ ...n, date: e.target.value }))}
              className="input"
            />
          </div>

          <button onClick={handleAddEntry} className="btn-primary w-full">
            Add {newEntry.type === 'income' ? 'Income' : 'Expense'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
