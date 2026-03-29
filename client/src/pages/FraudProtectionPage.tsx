import { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Eye,
  Fingerprint,
  CreditCard,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const emergencyNumbers = [
  { label: 'Bank Fraud Hotline', number: '1-800-555-2265', display: '1-800-555-BANK' },
  { label: 'Credit Card Fraud', number: '1-800-555-2273', display: '1-800-555-CARD' },
  { label: 'Identity Theft (FTC)', number: '1-877-438-4338', display: '1-877-438-4338' },
];

const creditBureaus = [
  { name: 'Equifax', number: '1-800-525-6285' },
  { name: 'Experian', number: '1-888-397-3742' },
  { name: 'TransUnion', number: '1-800-680-7289' },
];

const securityActivity = [
  { desc: 'Login from new device - Chrome on Windows', time: '2 hours ago', status: 'Verified', statusColor: 'bg-emerald-100 text-emerald-700' },
  { desc: 'Password changed', time: '5 days ago', status: 'Completed', statusColor: 'bg-blue-100 text-blue-700' },
  { desc: 'Suspicious transaction flagged', time: '1 week ago', status: 'Resolved', statusColor: 'bg-amber-100 text-amber-700' },
  { desc: 'Credit monitoring alert', time: '2 weeks ago', status: 'Reviewed', statusColor: 'bg-slate-100 text-slate-700' },
];

const protectionChecklist = [
  'Enable two-factor authentication',
  'Set up transaction alerts',
  'Review account statements monthly',
  'Use unique passwords for financial accounts',
  'Enable biometric login',
  'Set up credit monitoring',
  'Freeze credit when not applying',
  'Check credit report annually',
];

const fraudTips = [
  {
    title: 'Phishing Scams',
    icon: Globe,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    content: [
      'Never click links in unexpected emails or texts claiming to be from your bank',
      'Check the sender email address carefully - look for misspellings',
      'Banks will never ask for your password, PIN, or full SSN via email',
      'When in doubt, call your bank directly using the number on your card',
      'Look for "https://" and a padlock icon before entering credentials',
    ],
  },
  {
    title: 'Card Skimming',
    icon: CreditCard,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    content: [
      'Wiggle the card reader before inserting - skimmers are often loose',
      'Cover the keypad when entering your PIN',
      'Use contactless/tap payments when available',
      'Prefer ATMs inside bank branches over standalone ones',
      'Monitor your accounts regularly for unauthorized charges',
    ],
  },
  {
    title: 'Identity Theft',
    icon: Fingerprint,
    color: 'text-red-600',
    bg: 'bg-red-50',
    content: [
      'Shred documents containing personal information',
      'Place a fraud alert or credit freeze with all three bureaus',
      'Monitor your credit report for unfamiliar accounts',
      'Be cautious sharing personal info on social media',
      'Use a password manager with strong, unique passwords',
    ],
  },
  {
    title: 'Online Shopping Safety',
    icon: Lock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    content: [
      'Shop only on trusted, well-known websites',
      'Use credit cards (not debit) for better fraud protection',
      'Avoid shopping on public Wi-Fi networks',
      'Enable purchase notifications for real-time alerts',
      'Use virtual card numbers when available',
    ],
  },
];

const securityBreakdown = [
  { label: 'Password Strength', score: 90 },
  { label: '2FA Enabled', score: 100 },
  { label: 'Account Monitoring', score: 80 },
  { label: 'Alerts Setup', score: 70 },
];

export default function FraudProtectionPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<boolean[]>([true, true, false, true, false, true, false, false]);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const securityScore = 85;
  const checklistCompleted = checklistState.filter(Boolean).length;
  const checklistPercent = Math.round((checklistCompleted / protectionChecklist.length) * 100);

  const handleCopy = (number: string, label: string) => {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleChecklist = (index: number) => {
    const updated = [...checklistState];
    updated[index] = !updated[index];
    setChecklistState(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Fraud Protection</h1>
        <p className="text-slate-500 mt-1">Monitor, protect, and secure your financial accounts</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">Your accounts are protected</p>
            <p className="text-xs text-emerald-600">Last security scan: Today at 9:42 AM</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">All Clear</span>
      </div>

      {/* Fraud Protection Numbers */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Phone className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-slate-900">Report Fraud Immediately</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {emergencyNumbers.map((n) => (
            <div key={n.label} className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-xs text-red-500 font-medium mb-1">{n.label}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900">{n.display}</p>
                <button
                  onClick={() => handleCopy(n.number, n.label)}
                  className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                >
                  {copied === n.label ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-red-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">Credit Bureaus</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {creditBureaus.map((b) => (
              <div key={b.name} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.number}</p>
                </div>
                <button
                  onClick={() => handleCopy(b.number, b.name)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {copied === b.name ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Score & Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Security Score</h3>
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={securityScore >= 80 ? '#10b981' : securityScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(securityScore / 100) * 352} 352`}
                />
              </svg>
              <div className="absolute">
                <p className="text-3xl font-bold text-slate-900">{securityScore}</p>
                <p className="text-xs text-slate-400">/100</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {securityBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Security Activity</h3>
          <div className="space-y-3">
            {securityActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.desc}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${a.statusColor}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protection Checklist */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Protection Checklist</h3>
          </div>
          <span className="text-sm font-semibold text-indigo-600">{checklistCompleted}/{protectionChecklist.length} completed</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${checklistPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {protectionChecklist.map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklistState[i]}
                onChange={() => toggleChecklist(i)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className={`text-sm ${checklistState[i] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fraud Prevention Tips */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Fraud Prevention Tips</h2>
        <div className="space-y-3">
          {fraudTips.map((tip) => (
            <div key={tip.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setExpandedTip(expandedTip === tip.title ? null : tip.title)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${tip.bg} rounded-xl`}>
                    <tip.icon className={`w-5 h-5 ${tip.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{tip.title}</h3>
                </div>
                {expandedTip === tip.title ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {expandedTip === tip.title && (
                <div className="px-6 pb-5 space-y-2">
                  {tip.content.map((line, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
