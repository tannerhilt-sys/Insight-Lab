import { Lightbulb, TrendingUp, DollarSign, BarChart3, X, Check } from 'lucide-react';

interface InsightCardProps {
  type: 'BUDGET' | 'PORTFOLIO' | 'MARKET' | 'RECOMMENDATION';
  title: string;
  body: string;
  riskLabel?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
}

const typeConfig = {
  BUDGET: {
    icon: DollarSign,
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  PORTFOLIO: {
    icon: TrendingUp,
    gradient: 'from-primary-400 to-primary-600',
    bg: 'bg-primary-50',
    badge: 'bg-primary-100 text-primary-700',
  },
  MARKET: {
    icon: BarChart3,
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
  },
  RECOMMENDATION: {
    icon: Lightbulb,
    gradient: 'from-purple-400 to-pink-500',
    bg: 'bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
  },
};

const riskColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function InsightCard({
  type,
  title,
  body,
  riskLabel,
  onAccept,
  onDismiss,
}: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${config.gradient} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-sm`}
      />

      <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`p-2 rounded-xl ${config.bg} shrink-0`}
          >
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
              >
                {type}
              </span>
              {riskLabel && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    riskColors[riskLabel.toLowerCase()] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {riskLabel} risk
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{body}</p>

        {/* Actions */}
        {(onAccept || onDismiss) && (
          <div className="flex items-center gap-2">
            {onAccept && (
              <button
                onClick={onAccept}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg
                           hover:bg-primary-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg
                           hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
