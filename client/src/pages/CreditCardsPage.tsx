import { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Star,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const cardRecommendations = [
  {
    category: 'Food & Dining',
    name: 'Capital One SavorOne',
    gradient: 'from-orange-500 to-red-500',
    cashback: '3% cashback on dining',
    annualFee: '$0',
    creditLimit: '$3,000 - $10,000',
    bonusPoints: '— ',
    why: 'Your dining spending is your top category. This card gives you 3% back on every meal out with no annual fee.',
  },
  {
    category: 'Travel',
    name: 'Chase Sapphire Preferred',
    gradient: 'from-blue-600 to-indigo-700',
    cashback: '2x points on travel & dining',
    annualFee: '$95',
    creditLimit: '$5,000 - $15,000',
    bonusPoints: '60,000 bonus points',
    why: 'If you travel even twice a year, the 60k bonus points (worth $750) more than offset the annual fee.',
  },
  {
    category: 'Shopping',
    name: 'Amazon Prime Visa',
    gradient: 'from-slate-700 to-slate-900',
    cashback: '5% at Amazon, 2% at restaurants',
    annualFee: '$0',
    creditLimit: '$3,000 - $12,000',
    bonusPoints: '$200 gift card',
    why: 'You shop online frequently. 5% back at Amazon adds up fast, especially with no annual fee.',
  },
  {
    category: 'Gas & Transport',
    name: 'Citi Custom Cash',
    gradient: 'from-emerald-500 to-teal-600',
    cashback: '5% on top category (auto)',
    annualFee: '$0',
    creditLimit: '$2,000 - $8,000',
    bonusPoints: '$200 bonus',
    why: 'This card automatically gives 5% on your highest spending category each month. Perfect for gas and commuting costs.',
  },
];

const creditTips = [
  { action: 'Pay bills on time', impact: 'High', color: 'text-red-600', bg: 'bg-red-50' },
  { action: 'Lower credit utilization', impact: 'High', color: 'text-red-600', bg: 'bg-red-50' },
  { action: "Don't close old accounts", impact: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50' },
  { action: 'Limit hard inquiries', impact: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50' },
  { action: 'Diversify credit types', impact: 'Low', color: 'text-blue-600', bg: 'bg-blue-50' },
  { action: 'Become an authorized user', impact: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50' },
  { action: 'Dispute errors on report', impact: 'High', color: 'text-red-600', bg: 'bg-red-50' },
];

const scenarios = [
  { label: 'Pay off $2,000 in credit card debt', effect: '+15 to +25 points', positive: true },
  { label: 'Open a new credit card', effect: '-5 to -10 points initially', positive: false },
  { label: 'Miss a payment', effect: '-60 to -100 points', positive: false },
];

const checklist = [
  'Pay on time every month',
  'Keep utilization below 30%',
  "Don't close your oldest card",
  'Review statements for errors',
  'Set up autopay for minimums',
  'Monitor your credit report',
];

export default function CreditCardsPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<boolean[]>(new Array(checklist.length).fill(false));
  const [scenarioToggles, setScenarioToggles] = useState<boolean[]>(new Array(scenarios.length).fill(false));
  const [mockScore] = useState(720);

  const recommendedLimit = Math.round((monthlyIncome * 12 * 0.25) / 100) * 100;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleChecklist = (index: number) => {
    const updated = [...checklistState];
    updated[index] = !updated[index];
    setChecklistState(updated);
  };

  const toggleScenario = (index: number) => {
    const updated = [...scenarioToggles];
    updated[index] = !updated[index];
    setScenarioToggles(updated);
  };

  // Calculate simulated score
  let simulatedScore = mockScore;
  if (scenarioToggles[0]) simulatedScore += 20;
  if (scenarioToggles[1]) simulatedScore -= 7;
  if (scenarioToggles[2]) simulatedScore -= 80;

  const getScoreLabel = (score: number) => {
    if (score >= 800) return { label: 'Excellent', color: 'text-emerald-600' };
    if (score >= 740) return { label: 'Very Good', color: 'text-green-600' };
    if (score >= 670) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 580) return { label: 'Fair', color: 'text-amber-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const scoreInfo = getScoreLabel(simulatedScore);

  // Gauge calculations
  const scorePercent = ((simulatedScore - 300) / 550) * 100;

  const utilizationExampleLimit = 5000;
  const utilizationZones = [
    { label: 'Excellent', range: '0-10%', max: 10, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: 'Good', range: '10-30%', max: 30, color: 'bg-yellow-400', textColor: 'text-yellow-700' },
    { label: 'Fair', range: '30-50%', max: 50, color: 'bg-orange-400', textColor: 'text-orange-700' },
    { label: 'Poor', range: '50%+', max: 100, color: 'bg-red-500', textColor: 'text-red-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Credit Cards</h1>
        <p className="text-slate-500 mt-1">Smart recommendations, credit education, and score tools</p>
      </div>

      {/* Your Credit Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Your Credit Score</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Display */}
          <div className="text-center">
            {/* Circular gauge */}
            <div className="relative inline-block">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="78" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="90" cy="90" r="78"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${((mockScore - 300) / 550) * 490} 490`}
                  transform="rotate(-90 90 90)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-slate-900">{mockScore}</p>
                <p className={`text-lg font-semibold ${scoreInfo.color}`}>{scoreInfo.label}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Last updated: March 15, 2026</p>
            <p className="text-xs text-slate-400">Source: TransUnion</p>
          </div>

          {/* Score Factors - Why Your Score Is What It Is */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-3">Why Your Score is {mockScore}</h3>
            <p className="text-sm text-slate-500 mb-4">These factors make up your credit score, ranked by importance:</p>
            <div className="space-y-3">
              {[
                {
                  factor: 'Payment History',
                  weight: '35%',
                  status: 'Excellent',
                  statusColor: 'text-emerald-600',
                  barColor: 'bg-emerald-500',
                  barWidth: '95%',
                  detail: 'You\'ve made 24 consecutive on-time payments. Keep it up — this is the single biggest factor in your score.',
                },
                {
                  factor: 'Credit Utilization',
                  weight: '30%',
                  status: 'Good',
                  statusColor: 'text-blue-600',
                  barColor: 'bg-blue-500',
                  barWidth: '75%',
                  detail: 'You\'re using 22% of your available credit ($1,650 of $7,500). Under 30% is good, but under 10% is ideal.',
                },
                {
                  factor: 'Credit Age',
                  weight: '15%',
                  status: 'Fair',
                  statusColor: 'text-amber-600',
                  barColor: 'bg-amber-500',
                  barWidth: '45%',
                  detail: 'Your average account age is 2 years, 4 months. Longer history = better score. Don\'t close old accounts.',
                },
                {
                  factor: 'Credit Mix',
                  weight: '10%',
                  status: 'Fair',
                  statusColor: 'text-amber-600',
                  barColor: 'bg-amber-500',
                  barWidth: '40%',
                  detail: 'You have 2 credit cards but no installment loans. Having diverse credit types (cards, auto loan, student loan) helps.',
                },
                {
                  factor: 'New Inquiries',
                  weight: '10%',
                  status: 'Good',
                  statusColor: 'text-blue-600',
                  barColor: 'bg-blue-500',
                  barWidth: '80%',
                  detail: 'You have 1 hard inquiry in the past 12 months. Each inquiry typically drops your score 5-10 points temporarily.',
                },
              ].map((f) => (
                <div key={f.factor} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{f.factor}</span>
                      <span className="text-xs text-slate-400">({f.weight})</span>
                    </div>
                    <span className={`text-xs font-semibold ${f.statusColor}`}>{f.status}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div className={`${f.barColor} h-2 rounded-full transition-all`} style={{ width: f.barWidth }} />
                  </div>
                  <p className="text-xs text-slate-500">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How to Improve Your Score */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">{buddyName}'s Tips to Improve Your Score</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Lower Your Utilization to 10%',
              impact: '+20-30 pts',
              impactColor: 'text-emerald-600 bg-emerald-50',
              desc: 'Pay down $900 of your current $1,650 balance to get under 10% utilization. This could boost your score significantly within 1-2 billing cycles.',
              priority: 'High Priority',
              priorityColor: 'bg-red-100 text-red-700',
            },
            {
              title: 'Keep Your Oldest Card Open',
              impact: '+5-15 pts over time',
              impactColor: 'text-blue-600 bg-blue-50',
              desc: 'Your oldest card is 3 years old. Never close it — even if you rarely use it. Put a small recurring charge on it and set up autopay.',
              priority: 'Medium Priority',
              priorityColor: 'bg-amber-100 text-amber-700',
            },
            {
              title: 'Wait Before New Applications',
              impact: 'Prevent -5-10 pts',
              impactColor: 'text-purple-600 bg-purple-50',
              desc: 'You had 1 inquiry recently. Wait at least 6 months before applying for new credit to let your score recover and show stability.',
              priority: 'Low Priority',
              priorityColor: 'bg-blue-100 text-blue-700',
            },
          ].map((tip) => (
            <div key={tip.title} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tip.priorityColor}`}>{tip.priority}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tip.impactColor}`}>{tip.impact}</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Card Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Smart Credit Card Picks For You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardRecommendations.map((card) => (
            <div key={card.name} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`bg-gradient-to-r ${card.gradient} px-5 py-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wide">{card.category}</p>
                    <h3 className="font-bold text-lg mt-0.5">{card.name}</h3>
                  </div>
                  <CreditCard className="w-8 h-8 text-white/30" />
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs">Rewards</p>
                    <p className="font-semibold text-slate-900">{card.cashback}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Annual Fee</p>
                    <p className="font-semibold text-slate-900">{card.annualFee}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Credit Limit Range</p>
                    <p className="font-semibold text-slate-900">{card.creditLimit}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Signup Bonus</p>
                    <p className="font-semibold text-indigo-600">{card.bonusPoints}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-indigo-700">Why this card?</p>
                      <p className="text-xs text-slate-600 mt-0.5">{card.why}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affordable Credit Limits */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-900">Affordable Credit Limit Calculator</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Financial experts recommend keeping your total credit limit to 20-30% of your annual income.
        </p>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-slate-600 shrink-0">Monthly Income:</label>
          <input
            type="range"
            min={1000}
            max={15000}
            step={500}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
            className="flex-1 accent-indigo-600 h-2"
          />
          <span className="text-lg font-bold text-indigo-600 w-24 text-right">${monthlyIncome.toLocaleString()}</span>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500">Recommended Total Credit Limit</p>
          <p className="text-3xl font-bold text-emerald-600">${recommendedLimit.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">~25% of ${(monthlyIncome * 12).toLocaleString()} annual income</p>
        </div>
        <div className="mt-4 bg-amber-50 rounded-xl p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600">A higher credit limit can help your utilization ratio, but only if you don't increase spending. Request increases after 6+ months of on-time payments.</p>
        </div>
      </div>

      {/* Credit Score Education - Expandable Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Credit Score Education</h2>
        <div className="space-y-3">
          {/* Build Good Credit */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button onClick={() => toggleSection('build')} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">How to Build Good Credit</h3>
              </div>
              {expandedSection === 'build' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSection === 'build' && (
              <div className="px-6 pb-5 space-y-2">
                {checklist.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={checklistState[i]}
                      onChange={() => toggleChecklist(i)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className={`text-sm ${checklistState[i] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Credit Utilization Guide */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button onClick={() => toggleSection('utilization')} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Credit Utilization Guide</h3>
              </div>
              {expandedSection === 'utilization' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSection === 'utilization' && (
              <div className="px-6 pb-5">
                <p className="text-sm text-slate-600 mb-4">
                  <span className="font-semibold">Recommended:</span> Keep usage below 30% of your limit.
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Example: If your limit is <span className="font-semibold">${utilizationExampleLimit.toLocaleString()}</span>, try to keep your balance under <span className="font-semibold">${(utilizationExampleLimit * 0.3).toLocaleString()}</span>.
                </p>
                {/* Utilization Gauge */}
                <div className="flex rounded-lg overflow-hidden h-6 mb-3">
                  <div className="bg-emerald-500 flex-[10] flex items-center justify-center text-[10px] font-bold text-white">0-10%</div>
                  <div className="bg-yellow-400 flex-[20] flex items-center justify-center text-[10px] font-bold text-white">10-30%</div>
                  <div className="bg-orange-400 flex-[20] flex items-center justify-center text-[10px] font-bold text-white">30-50%</div>
                  <div className="bg-red-500 flex-[50] flex items-center justify-center text-[10px] font-bold text-white">50%+</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {utilizationZones.map((zone) => (
                    <div key={zone.label} className="text-center">
                      <p className={`text-xs font-semibold ${zone.textColor}`}>{zone.label}</p>
                      <p className="text-xs text-slate-400">{zone.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Why Multiple Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button onClick={() => toggleSection('multiple')} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Why Have Multiple Credit Cards?</h3>
              </div>
              {expandedSection === 'multiple' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSection === 'multiple' && (
              <div className="px-6 pb-5">
                <ul className="space-y-2 mb-4">
                  {[
                    'Build a stronger credit history',
                    'Maximize rewards across categories',
                    'Emergency backup payment method',
                    'Improve overall utilization ratio',
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-700 mb-2">Recommended for beginners: 2-3 cards</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>1. One card for daily spending (flat cashback)</li>
                    <li>2. One for specific categories (rotating or dining)</li>
                    <li>3. One as backup / emergency use</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Boost Credit Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button onClick={() => toggleSection('boost')} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900">How to Boost Your Credit Score</h3>
              </div>
              {expandedSection === 'boost' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSection === 'boost' && (
              <div className="px-6 pb-5 space-y-2">
                {creditTips.map((tip) => (
                  <div key={tip.action} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <span className="text-sm text-slate-700">{tip.action}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tip.bg} ${tip.color}`}>
                      {tip.impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Score Simulator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900">Credit Score Simulator</h3>
        </div>

        {/* Score Display */}
        <div className="text-center mb-6">
          <p className="text-6xl font-bold text-slate-900">{simulatedScore}</p>
          <p className={`text-lg font-semibold ${scoreInfo.color}`}>{scoreInfo.label}</p>
        </div>

        {/* Score Gauge */}
        <div className="mb-6">
          <div className="relative">
            <div className="flex rounded-full overflow-hidden h-4">
              <div className="bg-red-500 flex-[280]" />
              <div className="bg-orange-400 flex-[90]" />
              <div className="bg-yellow-400 flex-[70]" />
              <div className="bg-green-400 flex-[60]" />
              <div className="bg-emerald-500 flex-[50]" />
            </div>
            {/* Pointer */}
            <div
              className="absolute top-0 -mt-1 transition-all duration-500"
              style={{ left: `${Math.min(Math.max(scorePercent, 2), 98)}%` }}
            >
              <div className="w-0.5 h-6 bg-slate-800 mx-auto" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>300 Poor</span>
            <span>580 Fair</span>
            <span>670 Good</span>
            <span>740 Very Good</span>
            <span>800+ Excellent</span>
          </div>
        </div>

        {/* What-if Scenarios */}
        <h4 className="font-semibold text-slate-900 mb-3">What-If Scenarios</h4>
        <div className="space-y-3">
          {scenarios.map((s, i) => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleScenario(i)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${scenarioToggles[i] ? (s.positive ? 'bg-emerald-500' : 'bg-red-500') : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${scenarioToggles[i] ? 'left-5' : 'left-1'}`} />
                </button>
                <span className="text-sm text-slate-700">{s.label}</span>
              </div>
              <span className={`text-sm font-semibold ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>{s.effect}</span>
            </div>
          ))}
        </div>
        {scenarioToggles.some(Boolean) && (
          <div className="mt-4 bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-600">Simulated Score: <span className="text-xl font-bold text-indigo-600">{simulatedScore}</span></p>
            <p className="text-xs text-slate-400 mt-1">This is an estimate. Actual impact may vary.</p>
          </div>
        )}
      </div>
    </div>
  );
}
