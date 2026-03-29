import { useState } from 'react';
import {
  User,
  Sliders,
  Bot,
  Bell,
  AlertTriangle,
  Save,
  Check,
  Crown,
  Zap,
  Star,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateBuddyName = useAuthStore((s) => s.updateBuddyName);

  const [buddyName, setBuddyName] = useState(user?.buddyName || 'Finance Buddy');
  const [email, setEmail] = useState(user?.email || '');
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [knowledgeLevel, setKnowledgeLevel] = useState('intermediate');
  const [autoPortfolio, setAutoPortfolio] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'plus' | 'pro'>('free');
  const [planSaved, setPlanSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    portfolioUpdates: true,
    weeklyReport: true,
    insightNotifications: true,
    priceAlerts: false,
  });

  const handleSave = () => {
    updateBuddyName(buddyName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const riskLabels = ['', 'Very Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-xl">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Buddy Name
            </label>
            <input
              type="text"
              value={buddyName}
              onChange={(e) => setBuddyName(e.target.value)}
              className="input max-w-md"
              placeholder="Your AI buddy's name"
            />
            <p className="text-xs text-slate-400 mt-1">This is what your AI companion calls itself</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input max-w-md"
              placeholder="your@email.com"
            />
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Sliders className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Risk Tolerance
            </label>
            <div className="max-w-md">
              <input
                type="range"
                min="1"
                max="5"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-400">Conservative</span>
                <span className="text-sm font-medium text-primary-600">{riskLabels[riskTolerance]}</span>
                <span className="text-xs text-slate-400">Aggressive</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Knowledge Level
            </label>
            <select
              value={knowledgeLevel}
              onChange={(e) => setKnowledgeLevel(e.target.value)}
              className="input max-w-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Adjusts the complexity of AI explanations
            </p>
          </div>
        </div>
      </section>

      {/* Auto Portfolio */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Bot className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Auto Portfolio</h2>
          <span className="text-xs font-medium px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <h3 className="font-medium text-slate-800">AI-Managed Portfolio</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Let your AI buddy automatically rebalance your paper trading portfolio based on market conditions.
            </p>
          </div>
          <button
            onClick={() => setAutoPortfolio(!autoPortfolio)}
            className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${
              autoPortfolio ? 'bg-primary-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                autoPortfolio ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <span className="text-xs font-medium px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
            Coming Soon
          </span>
        </div>

        <div className="space-y-3">
          {[
            { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when you approach spending limits' },
            { key: 'portfolioUpdates', label: 'Portfolio Updates', desc: 'Daily portfolio performance summary' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly financial health report from your buddy' },
            { key: 'insightNotifications', label: 'AI Insights', desc: 'New insights and recommendations' },
            { key: 'priceAlerts', label: 'Price Alerts', desc: 'Alerts when watchlist stocks hit target prices' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div>
                <h3 className="font-medium text-slate-800 text-sm">{item.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-primary-600'
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Subscription */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-xl">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Subscription</h2>
          {currentPlan !== 'free' && (
            <span className="text-xs font-medium px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full capitalize">
              {currentPlan} Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free */}
          <div
            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
              currentPlan === 'free'
                ? 'border-slate-400 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
            onClick={() => setCurrentPlan('free')}
          >
            {currentPlan === 'free' && (
              <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                Current
              </span>
            )}
            <div className="p-2 bg-slate-100 rounded-lg w-fit mb-3">
              <Star className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Free</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">$0<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Budget tracking</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Paper trading</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />5 AI chats / day</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Basic insights</li>
            </ul>
            <button
              onClick={() => setCurrentPlan('free')}
              className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPlan === 'free'
                  ? 'bg-slate-200 text-slate-500 cursor-default'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Plus */}
          <div
            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
              currentPlan === 'plus'
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-primary-300 bg-white'
            }`}
            onClick={() => setCurrentPlan('plus')}
          >
            {currentPlan === 'plus' && (
              <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                Current
              </span>
            )}
            <div className="p-2 bg-primary-100 rounded-lg w-fit mb-3">
              <Zap className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Plus</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">$7.99<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Everything in Free</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Unlimited AI chats</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Advanced insights</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Savings goal coaching</li>
            </ul>
            <button
              onClick={() => setCurrentPlan('plus')}
              className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPlan === 'plus'
                  ? 'bg-primary-200 text-primary-600 cursor-default'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {currentPlan === 'plus' ? 'Current Plan' : currentPlan === 'pro' ? 'Downgrade' : 'Upgrade to Plus'}
            </button>
          </div>

          {/* Pro */}
          <div
            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
              currentPlan === 'pro'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 hover:border-amber-300 bg-white'
            }`}
            onClick={() => setCurrentPlan('pro')}
          >
            <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
              {currentPlan === 'pro' ? 'Current' : 'Best Value'}
            </span>
            <div className="p-2 bg-amber-100 rounded-lg w-fit mb-3">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Pro</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">$14.99<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Everything in Plus</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />AI portfolio manager</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Real-time market alerts</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />Priority AI responses</li>
            </ul>
            <button
              onClick={() => setCurrentPlan('pro')}
              className={`mt-5 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPlan === 'pro'
                  ? 'bg-amber-200 text-amber-700 cursor-default'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {currentPlan !== 'free' && (
          <p className="text-xs text-slate-400 mt-4">
            Billing is simulated for demo purposes. No real charges will be made.
          </p>
        )}
      </section>

      {/* Danger Zone */}
      <section className="card border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-medium
                           hover:bg-red-50 transition-colors text-sm">
          Delete Account
        </button>
      </section>
    </div>
  );
}
