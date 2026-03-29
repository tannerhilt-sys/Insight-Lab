import { useState } from 'react';
import {
  Landmark,
  PiggyBank,
  DollarSign,
  Building2,
  ArrowUpRight,
  Plus,
  Sparkles,
  Check,
  Info,
  ChevronRight,
} from 'lucide-react';

const transactions = [
  { id: 1, desc: 'Direct Deposit - Payroll', amount: 2100.0, date: 'Mar 27', type: 'credit' },
  { id: 2, desc: 'Whole Foods Market', amount: -67.43, date: 'Mar 26', type: 'debit' },
  { id: 3, desc: 'Netflix Subscription', amount: -15.99, date: 'Mar 25', type: 'debit' },
  { id: 4, desc: 'Venmo Transfer', amount: -45.0, date: 'Mar 24', type: 'debit' },
  { id: 5, desc: 'Freelance Payment', amount: 350.0, date: 'Mar 23', type: 'credit' },
  { id: 6, desc: 'Gas Station', amount: -52.18, date: 'Mar 22', type: 'debit' },
];

const savingsComparisons = [
  {
    name: 'Chase',
    apy: '0.01%',
    monthlyFee: '$5/mo',
    minBalance: '$300',
    bestFor: 'Best for: Large bank with branch access',
    features: ['16,000+ ATMs', 'Mobile banking', 'Branch access nationwide'],
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Ally Bank',
    apy: '4.25%',
    monthlyFee: '$0',
    minBalance: '$0',
    bestFor: 'Best for: High-yield savings with no fees',
    features: ['High-yield savings', 'No monthly fees', '24/7 customer support'],
    gradient: 'from-purple-500 to-purple-700',
    recommended: true,
  },
  {
    name: 'Marcus by Goldman Sachs',
    apy: '4.15%',
    monthlyFee: '$0',
    minBalance: '$0',
    bestFor: 'Best for: No-penalty CDs and competitive APY',
    features: ['No-penalty CDs', 'High APY', 'No fees or minimums'],
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    name: 'Discover',
    apy: '4.00%',
    monthlyFee: '$0',
    minBalance: '$0',
    bestFor: 'Best for: Cashback rewards and FDIC coverage',
    features: ['Cashback debit card', 'No monthly fees', 'FDIC insured'],
    gradient: 'from-orange-500 to-orange-700',
  },
];

const checkingComparisons = [
  {
    name: 'Chase',
    apy: '0.01%',
    monthlyFee: '$12/mo (waivable)',
    minBalance: '$1,500',
    atmAccess: '16,000 ATMs',
    bestFor: 'Best for: Large ATM & branch network',
    features: ['Nationwide branches', 'Zelle built-in', 'Overdraft protection'],
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Ally Bank',
    apy: '0.25%',
    monthlyFee: '$0',
    minBalance: '$0',
    atmAccess: '43,000+ ATMs (Allpoint)',
    bestFor: 'Best for: No-fee online banking',
    features: ['Interest-bearing checking', 'No overdraft fees', 'Mobile deposit'],
    gradient: 'from-purple-500 to-purple-700',
    recommended: true,
  },
  {
    name: 'Marcus by Goldman Sachs',
    apy: null,
    monthlyFee: null,
    minBalance: null,
    atmAccess: null,
    bestFor: 'No checking account offered',
    features: [],
    gradient: 'from-slate-600 to-slate-800',
    unavailable: true,
  },
  {
    name: 'Discover',
    apy: '0.01%',
    monthlyFee: '$0',
    minBalance: '$0',
    atmAccess: '60,000+ ATMs',
    bestFor: 'Best for: Cashback debit card rewards',
    features: ['1% cashback on debit purchases', 'No monthly fees', 'Free checks'],
    gradient: 'from-orange-500 to-orange-700',
  },
];

export default function BankingPage() {
  const [showToast, setShowToast] = useState(false);

  const handleLinkAccount = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
          <Info className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium">Coming soon! Account linking is under development.</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Banking</h1>
        <p className="text-slate-500 mt-1">Manage your bank accounts and find the best rates</p>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              <span className="text-indigo-200 text-sm">Checking Account</span>
            </div>
            <span className="text-xs text-indigo-200">****4829</span>
          </div>
          <p className="text-3xl font-bold">$3,247.89</p>
          <p className="text-indigo-200 text-sm mt-1">Available Balance</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5" />
              <span className="text-emerald-200 text-sm">Savings Account</span>
            </div>
            <span className="text-xs text-emerald-200">****7312</span>
          </div>
          <p className="text-3xl font-bold">$12,450.00</p>
          <p className="text-emerald-200 text-sm mt-1">Available Balance</p>
        </div>
      </div>

      {/* Link Account Button */}
      <button
        onClick={handleLinkAccount}
        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-medium text-sm"
      >
        <Plus className="w-4 h-4" />
        Link New Account
      </button>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <div key={t.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-100' : 'bg-red-50'}`}>
                  {t.type === 'credit' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.desc}</p>
                  <p className="text-xs text-slate-400">{t.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.amount >= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Savings Accounts */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Find the Best Savings Account</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Compare high-yield savings accounts to maximize your interest earnings. Here's how top banks stack up for growing your money.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {savingsComparisons.map((bank) => (
            <div key={bank.name} className={`relative bg-white rounded-2xl shadow-sm border ${bank.recommended ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'} overflow-hidden hover:shadow-md transition-shadow`}>
              {bank.recommended && (
                <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Recommended
                </div>
              )}
              <div className={`h-2 bg-gradient-to-r ${bank.gradient}`} />
              <div className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3">{bank.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Savings APY</span>
                    <span className="font-semibold text-emerald-600">{bank.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Fee</span>
                    <span className="font-medium text-slate-900">{bank.monthlyFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum Balance</span>
                    <span className="font-medium text-slate-900">{bank.minBalance}</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-3">{bank.bestFor}</p>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {bank.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <Check className="w-3 h-3 text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Checking Accounts */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Find the Best Checking Account</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Compare checking accounts for everyday banking — fees, ATM access, and features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {checkingComparisons.map((bank) => (
            <div key={bank.name} className={`relative bg-white rounded-2xl shadow-sm border ${bank.recommended ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'} overflow-hidden hover:shadow-md transition-shadow`}>
              {bank.recommended && (
                <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Recommended
                </div>
              )}
              <div className={`h-2 bg-gradient-to-r ${bank.gradient}`} />
              <div className="p-5">
                <h4 className="font-semibold text-slate-900 mb-3">{bank.name}</h4>
                {bank.unavailable ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-slate-400 italic">No checking account offered</p>
                    <p className="text-xs text-slate-300 mt-1">N/A</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Checking APY</span>
                        <span className="font-semibold text-emerald-600">{bank.apy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monthly Fee</span>
                        <span className="font-medium text-slate-900">{bank.monthlyFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Minimum Balance</span>
                        <span className="font-medium text-slate-900">{bank.minBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ATM Access</span>
                        <span className="font-medium text-slate-900 text-right text-xs">{bank.atmAccess}</span>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-600 font-medium mt-3">{bank.bestFor}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      {bank.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Check className="w-3 h-3 text-emerald-500" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Recommendation</h3>
            <p className="text-sm text-slate-600 mt-1">
              Based on your spending patterns and savings goals, we recommend <span className="font-semibold text-indigo-600">Ally Bank</span> for its high APY savings and zero fees. You could earn an extra <span className="font-semibold text-emerald-600">$498/year</span> in interest on your current savings balance.
            </p>
            <button className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Learn more <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
