import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  MessageCircle,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  Landmark,
  CreditCard,
  Shield,
  PiggyBank,
  Building2,
  CircleDollarSign,
  Receipt,
  ChevronDown,
  ChevronRight,
  HandCoins,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  {
    to: '/portfolio', label: 'Portfolio', icon: TrendingUp,
    children: [
      { to: '/roth-ira', label: 'Roth IRA', icon: CircleDollarSign },
      { to: '/401k', label: '401K', icon: Building2 },
    ],
  },
  {
    to: '/banking', label: 'Banking', icon: Landmark,
    children: [
      { to: '/savings', label: 'Savings', icon: PiggyBank },
      { to: '/credit-cards', label: 'Credit Cards', icon: CreditCard },
      { to: '/loans', label: 'Loans', icon: HandCoins },
    ],
  },
  { to: '/fraud-protection', label: 'Fraud Protection', icon: Shield },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/budget': 'Budget Tracker',
  '/portfolio': 'Paper Trading Portfolio',
  '/chat': 'AI Chat',
  '/learn': 'Financial Education',
  '/settings': 'Settings',
  '/banking': 'Banking',
  '/savings': 'Savings',
  '/roth-ira': 'Roth IRA',
  '/401k': '401K',
  '/credit-cards': 'Smart Credit Cards',
  '/fraud-protection': 'Fraud Protection Center',
  '/expenses': 'My Expenses',
  '/loans': 'Loans',
};

const portfolioPaths = ['/portfolio', '/roth-ira', '/401k'];
const bankingPaths = ['/banking', '/savings', '/credit-cards', '/loans'];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const buddyName = user?.buddyName || 'Finance Buddy';
  const pageTitle = pageTitles[location.pathname] || 'Finance Buddy';
  const isDashboard = location.pathname === '/dashboard';

  // Track which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => ({
    '/portfolio': portfolioPaths.includes(location.pathname),
    '/banking': bankingPaths.includes(location.pathname),
  }));

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getGroupPaths = (item: NavItem): string[] => {
    const paths = [item.to];
    if (item.children) item.children.forEach((c) => paths.push(c.to));
    return paths;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-slate-900 text-white
          flex flex-col transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <img src="/logo-icon.svg" alt="Finance Buddy" className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-bold text-base leading-tight truncate">Finance Buddy</h1>
            <p className="text-xs text-indigo-400 truncate">{buddyName}</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1 hover:bg-slate-800 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              const groupPaths = getGroupPaths(item);
              const isChildActive = groupPaths.includes(location.pathname);
              const isOpen = openDropdowns[item.to] ?? false;

              return (
                <div key={item.to}>
                  {/* Parent toggle */}
                  <button
                    onClick={() => toggleDropdown(item.to)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isChildActive && !isOpen
                        ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                    <span className="ml-auto">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {/* Children */}
                  {isOpen && (
                    <div className="mt-1 ml-4 pl-4 border-l border-slate-700 space-y-1">
                      {/* Parent's own page */}
                      <NavLink
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.to === '/banking' ? 'My Bank' : item.label}
                      </NavLink>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`
                          }
                        >
                          <child.icon className="w-4 h-4 shrink-0" />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold">
              {buddyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {buddyName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 shrink-0">
          <button
            className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900">{pageTitle}</h2>
          {isDashboard && (
            <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download App
            </button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
