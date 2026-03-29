import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, TrendingUp, PiggyBank, Brain } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buddyName, setBuddyName] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password, buddyName, ageConfirmed);
        navigate('/onboarding');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch {
      // Error is handled by the store
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    clearError();
  };

  const features = [
    { icon: PiggyBank, title: 'Smart Budgeting', desc: 'AI-powered budget tracking and insights' },
    { icon: TrendingUp, title: 'Paper Trading', desc: 'Practice investing with zero risk' },
    { icon: Brain, title: 'Learn Finance', desc: 'Personalized financial education' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="Finance Buddy" className="h-12 brightness-0 invert" />
          </div>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Your AI Financial<br />Companion
          </h2>

          <p className="text-lg text-primary-100 mb-12 max-w-md">
            Take control of your finances with AI-powered insights, paper trading,
            budgeting tools, and personalized financial education.
          </p>

          <div className="space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-primary-200">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="Finance Buddy" className="h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-slate-500 mb-8">
            {isSignup
              ? 'Start your financial journey with AI'
              : 'Sign in to your Finance Buddy account'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name your AI Buddy
                  </label>
                  <input
                    type="text"
                    value={buddyName}
                    onChange={(e) => setBuddyName(e.target.value)}
                    className="input"
                    placeholder="e.g., Penny, Max, Finley..."
                    required
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <span className="text-sm text-slate-600">
                    I confirm that I am 13 years or older and agree to the Terms of Service
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-1">Demo Credentials</p>
            <p className="text-sm text-slate-700 font-mono">
              demo@financebuddy.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
