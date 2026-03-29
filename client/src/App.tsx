import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import BudgetPage from '@/pages/BudgetPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ChatPage from '@/pages/ChatPage';
import LearnPage from '@/pages/LearnPage';
import SettingsPage from '@/pages/SettingsPage';
import BankingPage from '@/pages/BankingPage';
import SavingsPage from '@/pages/SavingsPage';
import RothIRAPage from '@/pages/RothIRAPage';
import FourOhOneKPage from '@/pages/FourOhOneKPage';
import CreditCardsPage from '@/pages/CreditCardsPage';
import FraudProtectionPage from '@/pages/FraudProtectionPage';
import ExpensesPage from '@/pages/ExpensesPage';
import LoansPage from '@/pages/LoansPage';

function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, []);

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected routes with layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/roth-ira" element={<RothIRAPage />} />
          <Route path="/401k" element={<FourOhOneKPage />} />
          <Route path="/credit-cards" element={<CreditCardsPage />} />
          <Route path="/fraud-protection" element={<FraudProtectionPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/loans" element={<LoansPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
