import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  GraduationCap,
  Car,
  Home,
  HandCoins,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  TrendingDown,
  Calculator,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Target,
  Zap,
} from 'lucide-react';

interface LoanSection {
  id: string;
  title: string;
  icon: typeof GraduationCap;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  balance: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  lender: string;
  tips: string[];
  strategies: { title: string; desc: string; impact: string; impactColor: string }[];
  keyFacts: { label: string; value: string }[];
  educationPoints: string[];
}

const loanSections: LoanSection[] = [
  {
    id: 'student',
    title: 'Student Loans',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-indigo-700',
    balance: 28450,
    interestRate: 5.5,
    monthlyPayment: 320,
    remainingMonths: 108,
    lender: 'Federal Student Aid',
    tips: [
      'Look into income-driven repayment (IDR) plans if your payments feel unmanageable',
      'Check if you qualify for Public Service Loan Forgiveness (PSLF) after 120 qualifying payments',
      'Never miss a payment — set up autopay for a 0.25% interest rate reduction',
      'Consider refinancing if you have good credit and stable income (but you lose federal protections)',
      'Pay more than the minimum when possible — even $50 extra/month saves thousands in interest',
      'Apply extra payments to the highest-interest loan first (avalanche method)',
    ],
    strategies: [
      { title: 'Avalanche Method', desc: 'Pay minimums on all loans, put extra money toward the highest interest rate loan first. Saves the most money over time.', impact: 'Saves $4,200+ in interest', impactColor: 'text-emerald-600 bg-emerald-50' },
      { title: 'Snowball Method', desc: 'Pay off the smallest balance first for quick psychological wins, then roll that payment to the next smallest.', impact: 'Best for motivation', impactColor: 'text-blue-600 bg-blue-50' },
      { title: 'Refinancing', desc: 'Combine multiple loans into one with a lower interest rate. Best if you have good credit (700+) and stable income.', impact: 'Could save 1-2% APR', impactColor: 'text-purple-600 bg-purple-50' },
      { title: 'Employer Repayment Programs', desc: 'Some employers offer student loan repayment assistance as a benefit. Check with your HR department.', impact: 'Up to $5,250/yr tax-free', impactColor: 'text-amber-600 bg-amber-50' },
    ],
    keyFacts: [
      { label: 'Federal Loan Types', value: 'Direct Subsidized, Unsubsidized, PLUS, Consolidation' },
      { label: 'Grace Period', value: '6 months after graduation before payments start' },
      { label: 'Tax Deduction', value: 'Up to $2,500/year in student loan interest is tax-deductible' },
      { label: 'Forgiveness Programs', value: 'PSLF (10 years public service), IDR forgiveness (20-25 years)' },
    ],
    educationPoints: [
      'Federal loans have fixed interest rates set by Congress each year',
      'Subsidized loans don\'t accrue interest while you\'re in school — unsubsidized do',
      'Income-driven repayment plans cap payments at 10-20% of discretionary income',
      'Deferment and forbearance are options during financial hardship, but interest may still accrue',
      'Private student loans typically have fewer protections and higher rates than federal loans',
      'Student loan debt is rarely dischargeable in bankruptcy — plan your repayment carefully',
    ],
  },
  {
    id: 'auto',
    title: 'Auto Loans',
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-700',
    balance: 12800,
    interestRate: 6.9,
    monthlyPayment: 385,
    remainingMonths: 36,
    lender: 'Capital One Auto',
    tips: [
      'Try to keep your auto loan term to 48 months or less to avoid being underwater',
      'A 20% down payment helps you avoid negative equity from day one',
      'Get pre-approved before visiting the dealership for better negotiating power',
      'Avoid rolling negative equity from an old car into a new loan',
      'Consider certified pre-owned (CPO) vehicles for the best value — like-new with warranty',
      'Gap insurance is worth it if you owe more than the car is worth',
    ],
    strategies: [
      { title: 'Biweekly Payments', desc: 'Pay half your monthly payment every two weeks. You make 26 half-payments (13 full payments) per year instead of 12.', impact: 'Pays off ~1 year early', impactColor: 'text-emerald-600 bg-emerald-50' },
      { title: 'Round Up Payments', desc: 'Round your $385 payment up to $400 or $450. The extra goes directly to principal.', impact: 'Saves $800+ in interest', impactColor: 'text-blue-600 bg-blue-50' },
      { title: 'Refinance for Lower Rate', desc: 'If your credit score has improved since you got the loan, refinancing could lower your rate by 1-3%.', impact: 'Save $50-100/month', impactColor: 'text-purple-600 bg-purple-50' },
      { title: 'Lump Sum Payments', desc: 'Apply tax refunds, bonuses, or windfalls directly to your loan principal to shorten the payoff timeline.', impact: 'Could save years', impactColor: 'text-amber-600 bg-amber-50' },
    ],
    keyFacts: [
      { label: 'Average New Car Rate', value: '6.5-7.5% APR (2026)' },
      { label: 'Average Used Car Rate', value: '8-11% APR (varies by credit)' },
      { label: 'Ideal Loan Term', value: '36-48 months (avoid 72-84 month loans)' },
      { label: 'Depreciation', value: 'New cars lose ~20% value in year 1, ~60% by year 5' },
    ],
    educationPoints: [
      'Your credit score significantly impacts your auto loan rate — 750+ gets the best rates',
      'Dealership financing is often more expensive than bank or credit union pre-approval',
      'The total cost of a car = purchase price + interest + insurance + maintenance + fuel',
      'Longer loan terms mean lower monthly payments but significantly more total interest paid',
      'Negative equity (owing more than the car is worth) is a common trap with low down payments',
      'Consider the 20/4/10 rule: 20% down, 4-year term max, total car costs under 10% of income',
    ],
  },
  {
    id: 'mortgage',
    title: 'Mortgage',
    icon: Home,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-emerald-700',
    balance: 245000,
    interestRate: 6.75,
    monthlyPayment: 1842,
    remainingMonths: 324,
    lender: 'Wells Fargo Home Mortgage',
    tips: [
      'One extra mortgage payment per year can cut 4-5 years off a 30-year mortgage',
      'Refinance when rates drop 1%+ below your current rate to save substantially',
      'PMI (Private Mortgage Insurance) adds $100-300/month — get to 20% equity to remove it',
      'Consider biweekly payments to make 13 payments per year instead of 12',
      'Review your escrow account annually to ensure you\'re not overpaying property tax/insurance',
      'A 15-year mortgage has higher payments but saves 50%+ in total interest vs 30-year',
    ],
    strategies: [
      { title: 'Extra Monthly Principal', desc: 'Adding even $100/month to your mortgage payment goes directly to principal and significantly reduces total interest.', impact: 'Save $40,000+ in interest', impactColor: 'text-emerald-600 bg-emerald-50' },
      { title: 'Refinance to Lower Rate', desc: 'If rates drop 0.75-1% below your current rate, refinancing could save hundreds per month. Factor in closing costs.', impact: 'Save $200-400/month', impactColor: 'text-blue-600 bg-blue-50' },
      { title: 'Recast Your Mortgage', desc: 'Make a large lump sum payment and ask your lender to recast — this lowers your monthly payment without refinancing.', impact: 'Lower monthly payment', impactColor: 'text-purple-600 bg-purple-50' },
      { title: 'Remove PMI', desc: 'Once you reach 20% equity, request PMI removal. At 22% equity, it should be removed automatically.', impact: 'Save $150-300/month', impactColor: 'text-amber-600 bg-amber-50' },
    ],
    keyFacts: [
      { label: 'Average 30-Year Rate', value: '6.5-7.0% APR (2026)' },
      { label: 'Recommended Down Payment', value: '20% to avoid PMI' },
      { label: 'Mortgage Interest Deduction', value: 'Deductible on loans up to $750,000' },
      { label: 'Total Interest on 30-Year', value: 'Often 1.5-2x the original loan amount' },
    ],
    educationPoints: [
      'Pre-approval shows sellers you\'re serious and gives you a clear budget',
      'Fixed-rate mortgages keep payments steady; ARMs start lower but can increase',
      'Closing costs typically run 2-5% of the purchase price',
      'Your debt-to-income ratio (DTI) should be below 43% for most lenders',
      'Property taxes, insurance, and HOA fees are on top of your mortgage payment',
      'Building equity in your home is a form of forced savings and wealth building',
    ],
  },
  {
    id: 'personal',
    title: 'Personal Loans',
    icon: HandCoins,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-700',
    balance: 5200,
    interestRate: 11.5,
    monthlyPayment: 245,
    remainingMonths: 24,
    lender: 'SoFi',
    tips: [
      'Personal loans are best for consolidating high-interest credit card debt',
      'Never use a personal loan for discretionary spending — it\'s still debt',
      'Compare rates from at least 3 lenders before committing',
      'Check if your lender charges prepayment penalties before paying extra',
      'A shorter term (2-3 years) keeps interest costs much lower than 5-7 year terms',
      'Use a personal loan calculator to see total interest before borrowing',
    ],
    strategies: [
      { title: 'Pay Off ASAP', desc: 'Personal loans typically have the highest interest rates. Prioritize paying these off before lower-rate debt.', impact: 'Save $1,500+ in interest', impactColor: 'text-emerald-600 bg-emerald-50' },
      { title: 'Debt Consolidation', desc: 'If you have multiple high-interest debts, a personal loan at a lower rate can simplify and reduce total payments.', impact: 'Simplify payments', impactColor: 'text-blue-600 bg-blue-50' },
      { title: 'Negotiate Rate', desc: 'If your credit has improved since taking the loan, ask your lender about a rate reduction or refinance with a competitor.', impact: 'Could save 2-5% APR', impactColor: 'text-purple-600 bg-purple-50' },
      { title: 'Automate Payments', desc: 'Many lenders offer a 0.25-0.50% rate discount for setting up autopay. Never miss a payment.', impact: 'Save 0.25-0.50% APR', impactColor: 'text-amber-600 bg-amber-50' },
    ],
    keyFacts: [
      { label: 'Typical Rate Range', value: '6-36% APR depending on credit' },
      { label: 'Common Terms', value: '2-7 years' },
      { label: 'Best Use Cases', value: 'Debt consolidation, medical bills, home improvement' },
      { label: 'Avoid Using For', value: 'Vacations, shopping, or anything you can save for instead' },
    ],
    educationPoints: [
      'Personal loans are unsecured — no collateral needed, but rates are higher because of it',
      'Your credit score is the #1 factor in the rate you\'ll receive',
      'Origination fees (1-8%) are often deducted from the loan amount upfront',
      'Some lenders allow co-signers to help you qualify for a better rate',
      'Personal loans appear as installment credit on your report, which can improve your credit mix',
      'Beware of predatory lenders offering "guaranteed approval" — they often have very high rates and fees',
    ],
  },
];

export default function LoansPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [enabledLoans, setEnabledLoans] = useState<Record<string, boolean>>({
    student: true,
    auto: true,
    mortgage: false,
    personal: true,
  });
  const [expandedLoan, setExpandedLoan] = useState<string | null>('student');
  const [expandedStrategy, setExpandedStrategy] = useState<Record<string, string | null>>({});

  const toggleLoan = (id: string) => {
    setEnabledLoans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedLoan((prev) => (prev === id ? null : id));
  };

  const toggleStrategy = (loanId: string, strategyTitle: string) => {
    setExpandedStrategy((prev) => ({
      ...prev,
      [loanId]: prev[loanId] === strategyTitle ? null : strategyTitle,
    }));
  };

  const enabledLoansList = loanSections.filter((l) => enabledLoans[l.id]);
  const totalBalance = enabledLoansList.reduce((s, l) => s + l.balance, 0);
  const totalMonthly = enabledLoansList.reduce((s, l) => s + l.monthlyPayment, 0);
  const weightedRate = enabledLoansList.length > 0
    ? enabledLoansList.reduce((s, l) => s + l.interestRate * l.balance, 0) / totalBalance
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HandCoins className="w-7 h-7 text-indigo-600" />
          My Loans
        </h1>
        <p className="text-slate-500 mt-1">Manage your loans, learn payoff strategies, and track your progress to debt freedom</p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-200/60 rounded-xl">
              <DollarSign className="w-5 h-5 text-red-700" />
            </div>
            <span className="text-sm font-medium text-red-700">Total Debt</span>
          </div>
          <p className="text-3xl font-bold text-red-800">${totalBalance.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-1">{enabledLoansList.length} active loans</p>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-200/60 rounded-xl">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-sm font-medium text-amber-700">Monthly Payments</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">${totalMonthly.toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-1">Combined minimum payments</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-200/60 rounded-xl">
              <TrendingDown className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-blue-700">Avg Interest Rate</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{weightedRate.toFixed(2)}%</p>
          <p className="text-xs text-blue-600 mt-1">Weighted average APR</p>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-200/60 rounded-xl">
              <Target className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-sm font-medium text-emerald-700">Debt-Free Target</span>
          </div>
          <p className="text-3xl font-bold text-emerald-800">2035</p>
          <p className="text-xs text-emerald-600 mt-1">At current payment rate</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">{buddyName}'s Payoff Recommendation</h3>
            <p className="text-sm text-slate-700 mt-1">
              Based on your loan balances and interest rates, I recommend the <strong>avalanche method</strong> — focus extra payments on your
              <strong className="text-red-600"> Personal Loan (11.5% APR)</strong> first while paying minimums on everything else.
              Paying just <strong className="text-emerald-600">$100 extra/month</strong> toward that loan would save you
              <strong className="text-emerald-600"> $680 in interest</strong> and pay it off 8 months early.
              After that, redirect everything to your Auto Loan.
            </p>
          </div>
        </div>
      </div>

      {/* Loan Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Your Loan Types</h2>
        <p className="text-sm text-slate-500">Toggle off any loan types that don't apply to you</p>

        {loanSections.map((loan) => {
          const isEnabled = enabledLoans[loan.id];
          const isExpanded = expandedLoan === loan.id;
          const Icon = loan.icon;

          return (
            <div
              key={loan.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                isEnabled ? 'border-slate-100' : 'border-slate-100 opacity-60'
              }`}
            >
              {/* Loan Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={() => isEnabled && toggleExpand(loan.id)}
                  className="flex items-center gap-4 flex-1 text-left"
                  disabled={!isEnabled}
                >
                  <div className={`p-2.5 ${loan.bgColor} rounded-xl`}>
                    <Icon className={`w-5 h-5 ${loan.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{loan.title}</h3>
                    {isEnabled && (
                      <div className="flex items-center gap-4 mt-0.5">
                        <span className="text-sm text-slate-500">Balance: <strong className="text-slate-900">${loan.balance.toLocaleString()}</strong></span>
                        <span className="text-sm text-slate-500">Rate: <strong className="text-slate-900">{loan.interestRate}%</strong></span>
                        <span className="text-sm text-slate-500">Payment: <strong className="text-slate-900">${loan.monthlyPayment}/mo</strong></span>
                      </div>
                    )}
                    {!isEnabled && (
                      <p className="text-sm text-slate-400">This loan type is turned off</p>
                    )}
                  </div>
                  {isEnabled && (
                    <span className="ml-auto mr-4">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </span>
                  )}
                </button>

                {/* Toggle */}
                <button
                  onClick={() => toggleLoan(loan.id)}
                  className="shrink-0"
                  title={isEnabled ? 'Disable this loan type' : 'Enable this loan type'}
                >
                  {isEnabled ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-300" />
                  )}
                </button>
              </div>

              {/* Expanded Content */}
              {isEnabled && isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 space-y-6">
                  {/* Loan Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                    {loan.keyFacts.map((fact) => (
                      <div key={fact.label} className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">{fact.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{fact.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payoff Progress */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        Payoff Progress
                      </h4>
                      <span className="text-sm text-slate-500">{loan.remainingMonths} months remaining</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${loan.gradientFrom} ${loan.gradientTo} transition-all`}
                        style={{ width: `${Math.max(5, 100 - (loan.remainingMonths / (loan.id === 'mortgage' ? 360 : loan.id === 'student' ? 120 : loan.id === 'auto' ? 60 : 36)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Paid off: ${(loan.id === 'mortgage' ? 55000 : loan.id === 'student' ? 11550 : loan.id === 'auto' ? 10200 : 3800).toLocaleString()}</span>
                      <span>Remaining: ${loan.balance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payoff Strategies */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Payoff Strategies
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {loan.strategies.map((strategy) => (
                        <button
                          key={strategy.title}
                          onClick={() => toggleStrategy(loan.id, strategy.title)}
                          className="text-left p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900 text-sm">{strategy.title}</h5>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${strategy.impactColor}`}>
                              {strategy.impact}
                            </span>
                          </div>
                          {expandedStrategy[loan.id] === strategy.title && (
                            <p className="text-sm text-slate-600 mt-1">{strategy.desc}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Tips & Best Practices
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {loan.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50/50 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-slate-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What You Should Know */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      What You Should Know
                    </h4>
                    <div className="space-y-2">
                      {loan.educationPoints.map((point, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-xl">
                          <span className="text-xs font-bold text-blue-600 mt-0.5 shrink-0 w-5">{i + 1}.</span>
                          <p className="text-sm text-slate-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-200">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-amber-900 text-sm">Important Reminder</h5>
                      <p className="text-sm text-amber-800 mt-0.5">
                        {loan.id === 'student' && 'Never default on federal student loans — it can lead to wage garnishment, tax refund seizure, and credit score damage. Contact your servicer about hardship options before missing payments.'}
                        {loan.id === 'auto' && 'If you miss payments, your car can be repossessed. If you\'re struggling, contact your lender about hardship programs before falling behind.'}
                        {loan.id === 'mortgage' && 'Falling behind on mortgage payments can lead to foreclosure. If you\'re struggling, contact your lender immediately — most have loss mitigation programs to help.'}
                        {loan.id === 'personal' && 'Personal loan debt can be sent to collections if unpaid, severely damaging your credit. If struggling, contact your lender about modified payment plans.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
