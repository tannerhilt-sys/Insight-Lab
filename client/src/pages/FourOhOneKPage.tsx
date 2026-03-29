import { useState } from 'react';
import {
  Building2,
  Shield,
  Calculator,
  DollarSign,
  TrendingUp,
  Landmark,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const fundOptions = [
  { name: 'Target Date 2060', ticker: 'VTTSX', returns1Y: '12.4%', returns5Y: '9.8%', expense: '0.08%' },
  { name: 'S&P 500 Index', ticker: 'VFIAX', returns1Y: '15.2%', returns5Y: '11.3%', expense: '0.04%' },
  { name: 'Total Bond Index', ticker: 'VBTLX', returns1Y: '3.1%', returns5Y: '2.8%', expense: '0.05%' },
  { name: 'International Index', ticker: 'VTIAX', returns1Y: '8.7%', returns5Y: '6.4%', expense: '0.11%' },
  { name: 'Small Cap Index', ticker: 'VSMAX', returns1Y: '10.9%', returns5Y: '8.1%', expense: '0.05%' },
];

const vestingSchedule = [
  { year: 1, percent: 25 },
  { year: 2, percent: 50 },
  { year: 3, percent: 75 },
  { year: 4, percent: 100 },
];

const currentVestingYear = 3;

export default function FourOhOneKPage() {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [contributionRate, setContributionRate] = useState(6);
  const salary = 65000;
  const employeeContribution = (salary * contributionRate) / 100;
  const employerMatch = (Math.min(contributionRate, 6) * salary) / 100;
  const totalAnnual = employeeContribution + employerMatch;
  const taxSavings = Math.round(employeeContribution * 0.22);

  const limit2026 = 23500;
  const limitUsed = employeeContribution;
  const limitPercent = Math.min(Math.round((limitUsed / limit2026) * 100), 100);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">401K Retirement Plan</h1>
        <p className="text-slate-400 text-lg">Build your retirement with employer-matched contributions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm text-slate-500">Current Balance</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">$8,750.00</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">Employer</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">Acme Corp</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Employer Match</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">100% up to 6%</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">Vested Amount</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">$6,562.50</p>
          <p className="text-sm text-slate-400 mt-1">75% vested (Year 3)</p>
        </div>
      </div>

      {/* AI Insight - Maximize Your Match */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-xl">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">{buddyName}'s Tip: Maximize Your Match</h4>
            <p className="text-sm text-slate-700 mt-1">
              {contributionRate < 6 ? (
                <>
                  You're currently contributing {contributionRate}%, but your employer matches up to 6%. By increasing to 6%, you'd get an additional{' '}
                  <span className="font-bold text-emerald-600">
                    ${((6 - contributionRate) * salary / 100).toLocaleString()}/year
                  </span>{' '}
                  in free money. That's{' '}
                  <span className="font-bold text-emerald-600">
                    ${Math.round(((6 - contributionRate) * salary / 100) / 12).toLocaleString()}/month
                  </span>{' '}
                  you're leaving on the table!
                </>
              ) : (
                <>
                  Great job! You're contributing at least 6%, which means you're getting your full employer match of{' '}
                  <span className="font-bold text-emerald-600">${employerMatch.toLocaleString()}/year</span> in free money. Consider increasing further for even more tax advantages. Every additional percent contributed reduces your taxable income by{' '}
                  <span className="font-bold text-indigo-600">${(salary / 100).toLocaleString()}</span>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Contribution Rate Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Contribution Rate</h3>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="range"
            min={1}
            max={25}
            value={contributionRate}
            onChange={(e) => setContributionRate(parseInt(e.target.value))}
            className="flex-1 accent-indigo-600 h-2"
          />
          <span className="text-3xl font-bold text-indigo-600 w-20 text-right">{contributionRate}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Your Contribution</p>
            <p className="text-2xl font-bold text-indigo-600">${employeeContribution.toLocaleString()}/yr</p>
            <p className="text-sm text-slate-400">${Math.round(employeeContribution / 12).toLocaleString()}/mo</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Employer Match</p>
            <p className="text-2xl font-bold text-emerald-600">${employerMatch.toLocaleString()}/yr</p>
            <p className="text-sm text-slate-400">${Math.round(employerMatch / 12).toLocaleString()}/mo</p>
          </div>
        </div>

        {/* Total annual contribution bar */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 font-medium">Total Annual Contribution</span>
            <span className="text-lg font-bold text-slate-900">${totalAnnual.toLocaleString()}/yr</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 transition-all"
                style={{ width: `${(employeeContribution / totalAnnual) * 100}%` }}
              />
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${(employerMatch / totalAnnual) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-400">
            <span>You: ${employeeContribution.toLocaleString()}</span>
            <span>Employer: ${employerMatch.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Vesting Schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Vesting Schedule</h3>
        <div className="flex items-end gap-4 justify-around">
          {vestingSchedule.map((v) => (
            <div key={v.year} className="text-center flex-1">
              <div className="relative mx-auto w-full max-w-[60px]">
                <div className="bg-slate-100 rounded-lg h-28 relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-500 ${
                      v.year === currentVestingYear
                        ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                        : v.year < currentVestingYear
                        ? 'bg-gradient-to-t from-indigo-500 to-indigo-400'
                        : 'bg-gradient-to-t from-slate-300 to-slate-200'
                    }`}
                    style={{ height: `${v.percent}%` }}
                  />
                </div>
              </div>
              <p className={`text-sm font-bold mt-2 ${v.year === currentVestingYear ? 'text-emerald-600' : 'text-slate-900'}`}>
                {v.percent}%
              </p>
              <p className={`text-xs ${v.year === currentVestingYear ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
                Year {v.year}
                {v.year === currentVestingYear && ' (Current)'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fund Options */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Fund Options</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Fund Name</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Ticker</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">1Y Return</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">5Y Return</th>
                <th className="text-right px-6 py-3 text-slate-500 font-medium">Expense Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fundOptions.map((f) => (
                <tr key={f.ticker} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">{f.name}</td>
                  <td className="px-4 py-3 text-slate-500">{f.ticker}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-medium">{f.returns1Y}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-medium">{f.returns5Y}</td>
                  <td className="px-6 py-3 text-right text-slate-500">{f.expense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traditional 401K vs Roth 401K */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Traditional 401K vs Roth 401K</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Traditional 401K</h4>
            </div>
            <ul className="space-y-2">
              {[
                { text: 'Pre-tax contributions lower taxable income now', pro: true },
                { text: 'Tax-deferred growth on investments', pro: true },
                { text: 'Taxed as ordinary income when you withdraw', pro: false },
                { text: 'Required minimum distributions at age 73', pro: false },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 font-bold ${item.pro ? 'text-emerald-500' : 'text-red-400'}`}>
                    {item.pro ? '+' : '-'}
                  </span>
                  <span className="text-slate-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 ring-2 ring-indigo-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-slate-900">Roth 401K</h4>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                Popular
              </span>
            </div>
            <ul className="space-y-2">
              {[
                { text: 'Tax-free withdrawals in retirement', pro: true },
                { text: 'No RMDs (after rollover to Roth IRA)', pro: true },
                { text: 'Great if you expect higher taxes later', pro: true },
                { text: 'No immediate tax benefit on contributions', pro: false },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 font-bold ${item.pro ? 'text-emerald-500' : 'text-red-400'}`}>
                    {item.pro ? '+' : '-'}
                  </span>
                  <span className="text-slate-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tax Advantage Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Tax Advantage Calculator</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Based on your {contributionRate}% contribution rate and a 22% marginal tax bracket
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Annual Tax Savings</p>
            <p className="text-2xl font-bold text-emerald-600">${taxSavings.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Monthly Tax Savings</p>
            <p className="text-2xl font-bold text-indigo-600">${Math.round(taxSavings / 12).toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Annual Contribution</p>
            <p className="text-2xl font-bold text-purple-600">${totalAnnual.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Employee + Employer</p>
          </div>
        </div>
      </div>

      {/* 401K Contribution Limits */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">2026 Contribution Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Under 50</p>
            <p className="text-2xl font-bold text-indigo-600">$23,500</p>
            <p className="text-xs text-slate-400 mt-1">Employee contribution limit</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Age 50+</p>
            <p className="text-2xl font-bold text-purple-600">$31,000</p>
            <p className="text-xs text-slate-400 mt-1">Includes $7,500 catch-up</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Your usage of the limit</span>
            <span className="text-sm font-semibold text-slate-900">
              ${employeeContribution.toLocaleString()} / ${limit2026.toLocaleString()} ({limitPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${limitPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ${(limit2026 - employeeContribution).toLocaleString()} remaining capacity
          </p>
        </div>
      </div>

    </div>
  );
}
