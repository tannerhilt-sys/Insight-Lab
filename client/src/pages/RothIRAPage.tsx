import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Shield,
  Calculator,
  Info,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const rothAllocation = [
  { name: 'US Stocks', value: 60, color: '#6366f1', amount: 8550 },
  { name: 'Bonds', value: 20, color: '#8b5cf6', amount: 2850 },
  { name: 'International', value: 15, color: '#a78bfa', amount: 2137.50 },
  { name: 'Cash', value: 5, color: '#c4b5fd', amount: 712.50 },
];

const stockHoldings = [
  { category: 'US Stocks', holdings: [
    { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', shares: 12, price: 478.25, value: 5739, allocation: 40.3, change: +2.4 },
    { name: 'Vanguard Total Stock Market', ticker: 'VTI', shares: 8, price: 268.50, value: 2148, allocation: 15.1, change: +1.8 },
    { name: 'Apple Inc.', ticker: 'AAPL', shares: 3, price: 192.45, value: 577.35, allocation: 4.1, change: +3.2 },
    { name: 'Microsoft Corp.', ticker: 'MSFT', shares: 0.2, price: 415.60, value: 83.12, allocation: 0.6, change: +1.1 },
  ]},
  { category: 'Bonds', holdings: [
    { name: 'Vanguard Total Bond Market', ticker: 'BND', shares: 20, price: 72.80, value: 1456, allocation: 10.2, change: -0.3 },
    { name: 'iShares Core US Aggregate Bond', ticker: 'AGG', shares: 14, price: 99.57, value: 1393.98, allocation: 9.8, change: -0.1 },
  ]},
  { category: 'International', holdings: [
    { name: 'Vanguard FTSE Developed Markets', ticker: 'VEA', shares: 30, price: 50.25, value: 1507.50, allocation: 10.6, change: +1.5 },
    { name: 'Vanguard FTSE Emerging Markets', ticker: 'VWO', shares: 15, price: 42.00, value: 630, allocation: 4.4, change: +2.1 },
  ]},
  { category: 'Cash', holdings: [
    { name: 'Money Market (Settlement Fund)', ticker: 'VMFXX', shares: 712.50, price: 1.00, value: 712.50, allocation: 5.0, change: 0 },
  ]},
];

const rothRules = [
  {
    title: 'Contribution Limits',
    desc: '$7,000/year (under 50) or $8,000/year (50+) for 2026',
    icon: DollarSign,
  },
  {
    title: 'Income Limits',
    desc: 'Single: $161,000 MAGI. Married filing jointly: $240,000 MAGI',
    icon: Calculator,
  },
  {
    title: 'Withdrawal Rules',
    desc: 'Contributions can be withdrawn anytime tax-free. Earnings after age 59 1/2',
    icon: Shield,
  },
  {
    title: '5-Year Rule',
    desc: 'Account must be open 5 years before withdrawing earnings tax-free',
    icon: Info,
  },
];

const growthData = [
  { age: 'Age 25', value: 0 },
  { age: 'Age 35', value: 36000 },
  { age: 'Age 45', value: 109000 },
  { age: 'Age 55', value: 246000 },
  { age: 'Age 65', value: 520000 },
];

export default function RothIRAPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [rothContributed] = useState(3500);
  const rothLimit = 7000;
  const rothPercent = Math.round((rothContributed / rothLimit) * 100);
  const remaining = rothLimit - rothContributed;
  const monthsRemaining = 9; // months left in the year
  const monthlyNeeded = Math.ceil(remaining / monthsRemaining);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Roth IRA</h1>
        <p className="text-purple-200 text-lg mb-6">Tax-free growth for your retirement future</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Tax-Free Growth', desc: 'Your investments grow without being taxed' },
            { title: 'Flexible Withdrawals', desc: 'Withdraw contributions anytime without penalty' },
            { title: 'No RMDs', desc: 'No required minimum distributions in retirement' },
          ].map((b) => (
            <div key={b.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-1">{b.title}</h4>
              <p className="text-sm text-purple-200">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm text-slate-500">Account Balance</span>
          </div>
          <p className="text-3xl font-bold text-indigo-600">$14,250.00</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">YTD Contributions</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${rothContributed.toLocaleString()}</p>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${rothPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{rothPercent}% of ${rothLimit.toLocaleString()} limit</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">YTD Returns</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">+$1,247.83</p>
          <p className="text-sm text-emerald-500 mt-1">+8.7% return</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">Account Age</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">2y 4m</p>
          <p className="text-sm text-slate-400 mt-1">Opened Nov 2023</p>
        </div>
      </div>

      {/* Contribution Tracker */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">2026 Contribution Tracker</h3>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-indigo-600">${rothContributed.toLocaleString()}</span>
          <span className="text-slate-400 text-sm mb-1">of ${rothLimit.toLocaleString()} limit</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${rothPercent}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mb-4">
          ${remaining.toLocaleString()} remaining &middot; {rothPercent}% complete
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Remaining to Max Out</p>
            <p className="text-xl font-bold text-indigo-600">${remaining.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Monthly Contribution Needed</p>
            <p className="text-xl font-bold text-purple-600">${monthlyNeeded}/mo</p>
            <p className="text-xs text-slate-400 mt-1">To max out by December</p>
          </div>
        </div>
      </div>

      {/* Investment Allocation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-2">Investment Allocation</h3>
        <p className="text-sm text-slate-500 mb-4">Click a segment or category to see the stocks inside</p>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-64 h-64 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rothAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(_, index) => {
                    const name = rothAllocation[index].name;
                    setSelectedCategory(selectedCategory === name ? null : name);
                  }}
                  cursor="pointer"
                >
                  {rothAllocation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={selectedCategory && selectedCategory !== entry.name ? 0.3 : 1}
                      stroke={selectedCategory === entry.name ? entry.color : 'transparent'}
                      strokeWidth={selectedCategory === entry.name ? 3 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full space-y-2">
            {rothAllocation.map((a) => (
              <button
                key={a.name}
                onClick={() => setSelectedCategory(selectedCategory === a.name ? null : a.name)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedCategory === a.name
                    ? 'bg-indigo-50 border border-indigo-200 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-sm font-medium text-slate-700">{a.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{a.value}%</span>
                  <p className="text-xs text-slate-400">${a.amount.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Holdings Detail */}
      {selectedCategory && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rothAllocation.find(a => a.name === selectedCategory)?.color }} />
              {selectedCategory} Holdings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {stockHoldings.find(s => s.category === selectedCategory)?.holdings.length} positions &middot;
              ${rothAllocation.find(a => a.name === selectedCategory)?.amount.toLocaleString()} total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-slate-500 font-medium">Holding</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Shares</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">Value</th>
                  <th className="text-right px-4 py-3 text-slate-500 font-medium">% of IRA</th>
                  <th className="text-right px-6 py-3 text-slate-500 font-medium">Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stockHoldings.find(s => s.category === selectedCategory)?.holdings.map((h) => (
                  <tr key={h.ticker} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-semibold text-slate-900">{h.ticker}</p>
                      <p className="text-xs text-slate-400">{h.name}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{h.shares}</td>
                    <td className="px-4 py-3 text-right text-slate-700">${h.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">${h.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{h.allocation}%</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                        h.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {h.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {h.change >= 0 ? '+' : ''}{h.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Rules */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Rules to Know</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rothRules.map((rule) => (
            <div
              key={rule.title}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <rule.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-slate-900">{rule.title}</h4>
              </div>
              <p className="text-sm text-slate-600">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compound Growth Projections */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Compound Growth Projections</h3>
        </div>
        <p className="text-sm text-slate-500 mb-6">Assuming $200/month contribution with 8% average annual return</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="age" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            />
            <Bar dataKey="value" fill="url(#rothGradient)" radius={[6, 6, 0, 0]} name="Balance" />
            <defs>
              <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Roth IRA vs Traditional IRA */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Roth IRA vs Traditional IRA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional IRA */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Traditional IRA</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Tax Treatment', value: 'Tax-deductible contributions now, taxed on withdrawal' },
                { label: 'Withdrawals', value: 'Taxed as ordinary income after 59 1/2' },
                { label: 'RMDs', value: 'Required starting at age 73' },
                { label: 'Income Limits', value: 'No income limit for contributions (deductibility may be limited)' },
                { label: 'Best For', value: 'Those expecting a lower tax bracket in retirement' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roth IRA */}
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 ring-2 ring-indigo-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Roth IRA</h4>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Tax Treatment', value: 'After-tax contributions, tax-free growth and withdrawals' },
                { label: 'Withdrawals', value: 'Contributions anytime tax-free; earnings after 59 1/2' },
                { label: 'RMDs', value: 'None - no required minimum distributions' },
                { label: 'Income Limits', value: 'Single: $161K MAGI, Married: $240K MAGI' },
                { label: 'Best For', value: 'Young earners expecting higher taxes in the future' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-indigo-900">AI Insight</h4>
            <p className="text-sm text-slate-700 mt-1">
              Starting a Roth IRA at age 22 with $200/month could grow to{' '}
              <span className="font-bold text-emerald-600">$500,000+</span> by age 65, assuming an 8% average annual return. That's the power of compound interest working for over 40 years! You've already contributed{' '}
              <span className="font-bold text-indigo-600">${rothContributed.toLocaleString()}</span> this year
              — consider setting up automatic monthly contributions of{' '}
              <span className="font-bold text-indigo-600">${monthlyNeeded}/mo</span> to max out your limit before year-end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
