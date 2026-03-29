import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Wallet,
  GraduationCap,
  Landmark,
  Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const TOTAL_STEPS = 6;

const financialGoals = [
  { id: 'emergency', label: 'Save emergency fund', icon: PiggyBank },
  { id: 'invest', label: 'Start investing', icon: TrendingUp },
  { id: 'debt', label: 'Pay off debt', icon: CreditCard },
  { id: 'budget', label: 'Budget better', icon: Wallet },
  { id: 'learn', label: 'Learn about finance', icon: GraduationCap },
  { id: 'retirement', label: 'Retirement planning', icon: Landmark },
];

const knowledgeLevels = [
  { id: 'beginner', label: 'Beginner', desc: "I'm new to personal finance", emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: 'I know the basics', emoji: '📈' },
  { id: 'advanced', label: 'Advanced', desc: 'I actively manage my finances', emoji: '🎯' },
];

const riskLevels = [
  { value: 1, label: 'Very Conservative', desc: 'Preserve my capital above all' },
  { value: 2, label: 'Conservative', desc: 'Slow and steady growth' },
  { value: 3, label: 'Moderate', desc: 'Balance of growth and safety' },
  { value: 4, label: 'Aggressive', desc: 'Willing to take risks for growth' },
  { value: 5, label: 'Very Aggressive', desc: 'Maximum growth potential' },
];

const savingsHabits = [
  { id: 'none', label: 'None', desc: "I haven't started saving yet", emoji: '😅' },
  { id: 'occasional', label: 'Occasional', desc: 'I save when I can', emoji: '🤏' },
  { id: 'regular', label: 'Regular', desc: 'I save a set amount monthly', emoji: '💪' },
  { id: 'disciplined', label: 'Disciplined', desc: 'I follow strict saving rules', emoji: '🏆' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [buddyName, setBuddyName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [knowledgeLevel, setKnowledgeLevel] = useState('');
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [savingsHabit, setSavingsHabit] = useState('');

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return buddyName.trim().length > 0;
      case 2: return selectedGoals.length > 0;
      case 3: return knowledgeLevel !== '';
      case 4: return true;
      case 5: return savingsHabit !== '';
      case 6: return true;
      default: return false;
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-slate-900">Finance Buddy</span>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-sm font-medium text-primary-600">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pb-32">
        <div className="w-full max-w-2xl">
          {/* Step 1: Name your buddy */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Name your Finance Buddy</h2>
              <p className="text-slate-500 mb-8">
                Give your AI companion a name. It will be your personal finance assistant!
              </p>
              <input
                type="text"
                value={buddyName}
                onChange={(e) => setBuddyName(e.target.value)}
                className="input text-lg py-4"
                placeholder="e.g., Penny, Finley, Max, Sage..."
              />
              <div className="mt-4 flex gap-2 flex-wrap">
                {['Penny', 'Finley', 'Max', 'Sage', 'Nova', 'Atlas'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setBuddyName(name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${buddyName === name
                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Financial goals */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">What are your financial goals?</h2>
              <p className="text-slate-500 mb-8">Select all that apply. We'll personalize your experience.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {financialGoals.map((goal) => {
                  const selected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                        ${selected
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                    >
                      <div className={`p-2.5 rounded-xl ${selected ? 'bg-primary-100' : 'bg-slate-100'}`}>
                        <goal.icon className={`w-5 h-5 ${selected ? 'text-primary-600' : 'text-slate-500'}`} />
                      </div>
                      <span className={`font-medium ${selected ? 'text-primary-900' : 'text-slate-700'}`}>
                        {goal.label}
                      </span>
                      {selected && (
                        <Check className="w-5 h-5 text-primary-600 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Knowledge level */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">How much do you know about finance?</h2>
              <p className="text-slate-500 mb-8">This helps us tailor explanations to your level.</p>
              <div className="space-y-4">
                {knowledgeLevels.map((level) => {
                  const selected = knowledgeLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setKnowledgeLevel(level.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all
                        ${selected
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <h3 className={`font-semibold ${selected ? 'text-primary-900' : 'text-slate-800'}`}>
                          {level.label}
                        </h3>
                        <p className="text-sm text-slate-500">{level.desc}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-primary-600 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Risk tolerance */}
          {step === 4 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">What's your risk tolerance?</h2>
              <p className="text-slate-500 mb-8">How comfortable are you with investment risk?</p>
              <div className="space-y-3">
                {riskLevels.map((level) => {
                  const selected = riskTolerance === level.value;
                  return (
                    <button
                      key={level.value}
                      onClick={() => setRiskTolerance(level.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                        ${selected
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${selected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {level.value}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${selected ? 'text-primary-900' : 'text-slate-800'}`}>
                          {level.label}
                        </h3>
                        <p className="text-sm text-slate-500">{level.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Savings habits */}
          {step === 5 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Your savings habits</h2>
              <p className="text-slate-500 mb-8">No judgment! We're here to help you improve.</p>
              <div className="space-y-4">
                {savingsHabits.map((habit) => {
                  const selected = savingsHabit === habit.id;
                  return (
                    <button
                      key={habit.id}
                      onClick={() => setSavingsHabit(habit.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all
                        ${selected
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <span className="text-2xl">{habit.emoji}</span>
                      <div>
                        <h3 className={`font-semibold ${selected ? 'text-primary-900' : 'text-slate-800'}`}>
                          {habit.label}
                        </h3>
                        <p className="text-sm text-slate-500">{habit.desc}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-primary-600 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Summary */}
          {step === 6 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">You're all set! 🎉</h2>
              <p className="text-slate-500 mb-8">
                Here's your personalized profile. {buddyName} is ready to help you on your financial journey!
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Profile header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{buddyName}</h3>
                      <p className="text-primary-100">Your AI Financial Companion</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500">Financial Goals</span>
                    <span className="font-medium text-slate-800">
                      {selectedGoals.length} selected
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500">Knowledge Level</span>
                    <span className="font-medium text-slate-800 capitalize">{knowledgeLevel}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500">Risk Tolerance</span>
                    <span className="font-medium text-slate-800">
                      {riskLevels.find((r) => r.value === riskTolerance)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-500">Savings Habit</span>
                    <span className="font-medium text-slate-800 capitalize">{savingsHabit}</span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="p-4 bg-primary-50 rounded-xl">
                    <p className="text-sm text-primary-800">
                      <strong>{buddyName} says:</strong> "I'm excited to be your financial companion!
                      Based on your profile, I'll focus on helping you{' '}
                      {selectedGoals.includes('budget')
                        ? 'build better budgeting habits'
                        : selectedGoals.includes('invest')
                        ? 'start your investing journey'
                        : 'reach your financial goals'}
                      . Let's get started!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="btn-primary flex items-center gap-2"
            >
              Get Started
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
