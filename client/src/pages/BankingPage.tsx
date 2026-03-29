import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
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
  ChevronDown,
  X,
  CreditCard,
  Trash2,
} from 'lucide-react';
import Modal from '@/components/Modal';

interface BankAccount {
  id: string;
  bankName: string;
  bankColor: string;
  checking: { number: string; balance: number } | null;
  savings: { number: string; balance: number } | null;
  transactions: { id: number; desc: string; amount: number; date: string; type: 'credit' | 'debit' }[];
}

const INITIAL_BANKS: BankAccount[] = [
  {
    id: 'chase',
    bankName: 'Chase',
    bankColor: 'from-blue-600 to-blue-800',
    checking: { number: '****4829', balance: 3247.89 },
    savings: { number: '****7312', balance: 12450.0 },
    transactions: [
      { id: 1, desc: 'Direct Deposit - Payroll', amount: 2100.0, date: 'Mar 27', type: 'credit' },
      { id: 2, desc: 'Whole Foods Market', amount: -67.43, date: 'Mar 26', type: 'debit' },
      { id: 3, desc: 'Netflix Subscription', amount: -15.99, date: 'Mar 25', type: 'debit' },
      { id: 4, desc: 'Venmo Transfer', amount: -45.0, date: 'Mar 24', type: 'debit' },
      { id: 5, desc: 'Freelance Payment', amount: 350.0, date: 'Mar 23', type: 'credit' },
      { id: 6, desc: 'Gas Station', amount: -52.18, date: 'Mar 22', type: 'debit' },
    ],
  },
  {
    id: 'ally',
    bankName: 'Ally Bank',
    bankColor: 'from-purple-600 to-purple-800',
    checking: null,
    savings: { number: '****9201', balance: 8320.5 },
    transactions: [
      { id: 1, desc: 'Transfer from Chase', amount: 500.0, date: 'Mar 20', type: 'credit' },
      { id: 2, desc: 'Interest Payment', amount: 28.75, date: 'Mar 15', type: 'credit' },
      { id: 3, desc: 'Transfer from Chase', amount: 500.0, date: 'Feb 20', type: 'credit' },
      { id: 4, desc: 'Interest Payment', amount: 26.90, date: 'Feb 15', type: 'credit' },
    ],
  },
];

const AVAILABLE_BANKS = [
  { name: 'Bank of America', color: 'from-red-600 to-red-800' },
  { name: 'Wells Fargo', color: 'from-yellow-600 to-red-700' },
  { name: 'Capital One', color: 'from-slate-700 to-slate-900' },
  { name: 'Discover', color: 'from-orange-500 to-orange-700' },
  { name: 'Marcus by Goldman Sachs', color: 'from-slate-600 to-slate-800' },
  { name: 'Citibank', color: 'from-blue-500 to-blue-700' },
  { name: 'US Bank', color: 'from-indigo-600 to-indigo-800' },
  { name: 'PNC', color: 'from-orange-600 to-orange-800' },
  { name: 'TD Bank', color: 'from-green-600 to-green-800' },
  { name: 'USAA', color: 'from-blue-700 to-blue-900' },
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
    features: [] as string[],
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
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';

  const [banks, setBanks] = useState<BankAccount[]>(INITIAL_BANKS);
  const [selectedBankId, setSelectedBankId] = useState(INITIAL_BANKS[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addBankName, setAddBankName] = useState('');
  const [addBankColor, setAddBankColor] = useState('from-slate-600 to-slate-800');
  const [addHasChecking, setAddHasChecking] = useState(true);
  const [addHasSavings, setAddHasSavings] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);

  const selectedBank = banks.find((b) => b.id === selectedBankId) ?? banks[0];
  const totalAcrossAllBanks = banks.reduce(
    (s, b) => s + (b.checking?.balance ?? 0) + (b.savings?.balance ?? 0),
    0,
  );

  const handleAddBank = () => {
    if (!addBankName.trim()) return;
    const newBank: BankAccount = {
      id: Date.now().toString(),
      bankName: addBankName.trim(),
      bankColor: addBankColor,
      checking: addHasChecking ? { number: `****${Math.floor(1000 + Math.random() * 9000)}`, balance: 0 } : null,
      savings: addHasSavings ? { number: `****${Math.floor(1000 + Math.random() * 9000)}`, balance: 0 } : null,
      transactions: [],
    };
    setBanks((prev) => [...prev, newBank]);
    setSelectedBankId(newBank.id);
    setShowAddModal(false);
    setAddBankName('');
    setAddHasChecking(true);
    setAddHasSavings(true);
    setShowToast(`${addBankName} has been linked successfully!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const removeBank = (id: string) => {
    setBanks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBankId === id) {
      setSelectedBankId(banks.find((b) => b.id !== id)?.id ?? '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">{showToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Banking</h1>
          <p className="text-slate-500 mt-1">Manage your bank accounts and find the best rates</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Total across all banks</p>
          <p className="text-2xl font-bold text-slate-900">${totalAcrossAllBanks.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Bank Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedBank.bankColor} flex items-center justify-center`}>
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{selectedBank.bankName}</p>
                  <p className="text-xs text-slate-400">
                    {[selectedBank.checking && 'Checking', selectedBank.savings && 'Savings'].filter(Boolean).join(' & ')}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-30 overflow-hidden">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      bank.id === selectedBankId ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <button
                      className="flex items-center gap-3 flex-1 text-left"
                      onClick={() => {
                        setSelectedBankId(bank.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bank.bankColor} flex items-center justify-center`}>
                        <Landmark className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{bank.bankName}</p>
                        <p className="text-xs text-slate-400">
                          ${((bank.checking?.balance ?? 0) + (bank.savings?.balance ?? 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </button>
                    {banks.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBank(bank.id);
                          setDropdownOpen(false);
                        }}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove bank"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowAddModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium">Link New Bank</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bank
          </button>
        </div>
      </div>

      {/* Selected Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedBank.checking && (
          <div className={`bg-gradient-to-br ${selectedBank.bankColor} rounded-2xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span className="text-white/70 text-sm">Checking Account</span>
              </div>
              <span className="text-xs text-white/50">{selectedBank.checking.number}</span>
            </div>
            <p className="text-3xl font-bold">${selectedBank.checking.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-white/60 text-sm mt-1">Available Balance</p>
            <p className="text-xs text-white/40 mt-2">{selectedBank.bankName}</p>
          </div>
        )}
        {selectedBank.savings && (
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                <span className="text-emerald-200 text-sm">Savings Account</span>
              </div>
              <span className="text-xs text-emerald-200">{selectedBank.savings.number}</span>
            </div>
            <p className="text-3xl font-bold">${selectedBank.savings.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-emerald-200 text-sm mt-1">Available Balance</p>
            <p className="text-xs text-emerald-300/50 mt-2">{selectedBank.bankName}</p>
          </div>
        )}
        {!selectedBank.checking && !selectedBank.savings && (
          <div className="col-span-2 bg-slate-50 rounded-2xl p-8 text-center">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">No accounts linked for {selectedBank.bankName}</p>
          </div>
        )}
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{buddyName}'s Recommendation for {selectedBank.bankName}</h3>
            <p className="text-sm text-slate-600 mt-1">
              {selectedBank.id === 'chase' && (
                <>Your Chase checking has strong branch access, but your savings is earning almost nothing at <span className="font-semibold text-red-500">0.01% APY</span>. Consider moving some savings to a high-yield account like <span className="font-semibold text-indigo-600">Ally Bank (4.25% APY)</span> — you could earn an extra <span className="font-semibold text-emerald-600">$498/year</span> in interest on your current balance.</>
              )}
              {selectedBank.id === 'ally' && (
                <>Great choice keeping savings here! At <span className="font-semibold text-emerald-600">4.25% APY</span>, your ${selectedBank.savings?.balance.toLocaleString()} is earning roughly <span className="font-semibold text-emerald-600">$29/month</span> in interest. Consider setting up automatic transfers from your checking account to maximize growth. You're on track to earn <span className="font-semibold text-emerald-600">$353</span> in interest this year.</>
              )}
              {selectedBank.id !== 'chase' && selectedBank.id !== 'ally' && (
                <>Welcome to your new {selectedBank.bankName} account! Start by setting up direct deposit or recurring transfers to build your balance. Keep an eye on fees and make sure you're meeting any minimum balance requirements. As your balance grows, {buddyName} will provide personalized insights on how to make the most of this account.</>
              )}
            </p>
            <button className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Learn more <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions for Selected Bank */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{selectedBank.bankName}</span>
        </div>
        {selectedBank.transactions.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {selectedBank.transactions.map((t) => (
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
        ) : (
          <div className="px-6 py-10 text-center">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No transactions yet for {selectedBank.bankName}</p>
            <p className="text-xs text-slate-300 mt-1">Transactions will appear once your account is fully linked</p>
          </div>
        )}
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

      {/* Add Bank Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Link a New Bank">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Select a Bank</label>
            <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
              {AVAILABLE_BANKS.filter((ab) => !banks.some((b) => b.bankName === ab.name)).map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => { setAddBankName(bank.name); setAddBankColor(bank.color); }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                    addBankName === bank.name
                      ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bank.color} flex items-center justify-center shrink-0`}>
                    <Landmark className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900 truncate">{bank.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Or enter a bank name</label>
            <input
              type="text"
              value={addBankName}
              onChange={(e) => setAddBankName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Bank name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Types</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addHasChecking}
                  onChange={(e) => setAddHasChecking(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-sm text-slate-700">Checking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addHasSavings}
                  onChange={(e) => setAddHasSavings(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-sm text-slate-700">Savings</span>
              </label>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2 border border-amber-200">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              In the full version, linking a bank will securely connect via Plaid to import your real account data and transactions automatically.
            </p>
          </div>

          <button
            onClick={handleAddBank}
            disabled={!addBankName.trim() || (!addHasChecking && !addHasSavings)}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Link {addBankName || 'Bank'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
