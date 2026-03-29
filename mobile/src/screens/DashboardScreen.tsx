import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

interface SavingsGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

interface InsightCard {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
}

interface BudgetEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

// Spending breakdown for stacked bar — derived from live entries
const CATEGORY_COLORS: Record<string, string> = {
  Housing: colors.primary[600],
  Rent: colors.primary[600],
  Food: colors.emerald[500],
  Groceries: colors.emerald[500],
  'Dining Out': colors.emerald[500],
  Shopping: colors.amber[500],
  Transportation: colors.blue[500],
  Utilities: colors.red[400],
  Entertainment: colors.purple[500],
  Subscriptions: colors.slate[400],
};

const serviceGroups = [
  {
    title: 'Spending & Budget',
    icon: 'wallet-outline' as const,
    color: colors.primary[600],
    items: [
      { label: 'Expenses', icon: 'receipt-outline' as const, color: colors.red[400], screen: 'Expenses', desc: 'Track all spending' },
      { label: 'Budget Tracker', icon: 'wallet-outline' as const, color: colors.primary[600], screen: 'Budget', desc: 'Monthly categories' },
    ],
  },
  {
    title: 'Banking & Savings',
    icon: 'business-outline' as const,
    color: colors.blue[500],
    items: [
      { label: 'Banking', icon: 'business-outline' as const, color: colors.blue[500], screen: 'Banking', desc: 'Accounts & rates' },
      { label: 'Savings Goals', icon: 'flag-outline' as const, color: colors.emerald[500], screen: 'Savings', desc: 'Track your targets' },
      { label: 'Loans', icon: 'cash-outline' as const, color: colors.slate[600], screen: 'Loans', desc: 'Manage debt' },
    ],
  },
  {
    title: 'Investing & Retirement',
    icon: 'trending-up-outline' as const,
    color: colors.emerald[500],
    items: [
      { label: 'Portfolio', icon: 'trending-up-outline' as const, color: colors.primary[600], screen: 'Portfolio', desc: 'Paper trading' },
      { label: 'Roth IRA', icon: 'cash-outline' as const, color: colors.purple[500], screen: 'RothIRA', desc: 'Tax-free retirement' },
      { label: '401(K)', icon: 'business-outline' as const, color: colors.slate[600], screen: 'FourOhOneK', desc: 'Employer plan' },
    ],
  },
  {
    title: 'Tools & Protection',
    icon: 'shield-checkmark-outline' as const,
    color: colors.red[400],
    items: [
      { label: 'Credit Cards', icon: 'card-outline' as const, color: colors.amber[500], screen: 'CreditCards', desc: 'Score & cards' },
      { label: 'Fraud Protection', icon: 'shield-checkmark-outline' as const, color: colors.red[400], screen: 'FraudProtection', desc: 'Security center' },
      { label: 'Settings', icon: 'settings-outline' as const, color: colors.slate[500], screen: 'Settings', desc: 'Profile & prefs' },
    ],
  },
];

interface Props {
  navigation: any;
}

export default function DashboardScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const buddyName = user?.buddyName || 'Finance Buddy';
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [recentEntries, setRecentEntries] = useState<BudgetEntry[]>([]);
  const [topGoal, setTopGoal] = useState<SavingsGoal | null>(null);
  const [insight, setInsight] = useState<InsightCard | null>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [budgetData, goalsData, insightsData] = await Promise.allSettled([
          api<BudgetSummary>(`/budget/entries?month=${monthStr}`),
          api<SavingsGoal[]>('/budget/goals'),
          api<{ cards: InsightCard[] }>('/insights'),
        ]);

        if (budgetData.status === 'fulfilled') {
          const b = budgetData.value as any;
          setBudget(b);
          const entries: BudgetEntry[] = b.entries ?? [];
          const sorted = [...entries].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentEntries(sorted.slice(0, 5));
        }

        if (goalsData.status === 'fulfilled') {
          const goals = goalsData.value as SavingsGoal[];
          if (goals.length > 0) {
            // Show the goal closest to completion
            const sorted = [...goals].sort(
              (a, b) => b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
            );
            setTopGoal(sorted[0]);
          }
        }

        if (insightsData.status === 'fulfilled') {
          const cards = (insightsData.value as { cards: InsightCard[] }).cards ?? [];
          const high = cards.find((c) => c.priority === 'high') ?? cards[0] ?? null;
          setInsight(high);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [monthStr]);

  const toggleGroup = (i: number) => {
    setExpandedGroups((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  // Build spending breakdown from real entries
  const spendingBreakdown = (() => {
    if (!recentEntries.length) return [];
    const map: Record<string, number> = {};
    for (const e of recentEntries) {
      if (e.type === 'expense') {
        map[e.category] = (map[e.category] ?? 0) + e.amount;
      }
    }
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([label, amount]) => ({
      label,
      pct: Math.round((amount / total) * 100),
      amount,
      color: CATEGORY_COLORS[label] ?? colors.slate[400],
    }));
  })();

  const goalPct = topGoal
    ? Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>Hey there! {buddyName} here</Text>
            <Text style={styles.welcomeSubtitle}>Here's your financial overview for today.</Text>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={20} color={colors.slate[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading your data...</Text>
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('Budget')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.emerald[50] }]}>
                  <Ionicons name="wallet-outline" size={20} color={colors.emerald[500]} />
                </View>
                <View style={[styles.badge, { backgroundColor: colors.emerald[50] }]}>
                  <Text style={[styles.badgeText, { color: colors.emerald[500] }]}>
                    {budget ? `+$${budget.netSavings.toLocaleString()}` : '--'}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardLabel}>Budget Health</Text>
              <Text style={styles.cardValue}>
                {budget ? `$${budget.totalIncome.toLocaleString()}` : '--'}
              </Text>
            </TouchableOpacity>

            {topGoal && (
              <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('Savings')}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: colors.amber[50] }]}>
                    <Ionicons name="flag-outline" size={20} color={colors.amber[500]} />
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.amber[50] }]}>
                    <Text style={[styles.badgeText, { color: colors.amber[500] }]}>{goalPct}%</Text>
                  </View>
                </View>
                <Text style={styles.cardLabel}>{topGoal.label}</Text>
                <Text style={styles.cardValue}>${topGoal.currentAmount.toLocaleString()}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('Portfolio')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: colors.primary[50] }]}>
                  <Ionicons name="trending-up-outline" size={20} color={colors.primary[600]} />
                </View>
              </View>
              <Text style={styles.cardLabel}>Portfolio</Text>
              <Text style={styles.cardValue}>Paper</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Monthly Spending Breakdown */}
          {spendingBreakdown.length > 0 && (
            <View style={styles.vizCard}>
              <Text style={styles.vizTitle}>Monthly Spending</Text>
              <Text style={styles.vizSubtitle}>
                ${(budget?.totalExpenses ?? 0).toLocaleString()} of ${(budget?.totalIncome ?? 0).toLocaleString()} income
              </Text>
              <View style={styles.stackedBar}>
                {spendingBreakdown.map((seg, i) => (
                  <View key={i} style={[styles.stackedSegment, { flex: seg.pct, backgroundColor: seg.color }]} />
                ))}
              </View>
              <View style={styles.legendGrid}>
                {spendingBreakdown.map((seg, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
                    <Text style={styles.legendLabel}>{seg.label}</Text>
                    <Text style={styles.legendValue}>${seg.amount.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
              {(budget?.netSavings ?? 0) > 0 && (
                <View style={styles.budgetRemaining}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.emerald[500]} />
                  <Text style={styles.budgetRemainingText}>
                    ${budget!.netSavings.toLocaleString()} saved this month
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* AI Insight Banner */}
          {insight && (
            <TouchableOpacity style={styles.insightBanner} onPress={() => navigation.navigate('Chat')}>
              <View style={styles.insightIcon}>
                <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightBody} numberOfLines={2}>{insight.body}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.purple[400]} />
            </TouchableOpacity>
          )}

          {/* Savings Goal Ring */}
          {topGoal && (
            <View style={styles.savingsCard}>
              <View style={styles.savingsLeft}>
                <View style={styles.ringOuter}>
                  <View style={styles.ringInner}>
                    <Text style={styles.ringPct}>{goalPct}%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.savingsRight}>
                <Text style={styles.savingsTitle}>{topGoal.label}</Text>
                <Text style={styles.savingsAmount}>
                  ${topGoal.currentAmount.toLocaleString()}{' '}
                  <Text style={styles.savingsOf}>of ${topGoal.targetAmount.toLocaleString()}</Text>
                </Text>
                <View style={styles.savingsMiniBar}>
                  <View style={[styles.savingsMiniBarFill, { width: `${goalPct}%` }]} />
                </View>
              </View>
            </View>
          )}

          {/* Recent Activity */}
          {recentEntries.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityCard}>
                {recentEntries.map((item) => (
                  <View key={item.id} style={styles.activityRow}>
                    <View style={[styles.activityDot, { backgroundColor: item.type === 'income' ? colors.emerald[100] : colors.red[100] }]}>
                      <Ionicons
                        name={item.type === 'income' ? 'arrow-up' : 'arrow-down'}
                        size={14}
                        color={item.type === 'income' ? colors.emerald[500] : colors.red[400]}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityDesc}>{item.description}</Text>
                      <Text style={styles.activityTime}>{item.category}</Text>
                    </View>
                    <Text style={[styles.activityAmount, { color: item.type === 'income' ? colors.emerald[500] : colors.red[400] }]}>
                      {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      )}

      {/* All Services Dropdown */}
      <Text style={styles.sectionTitle}>All Services</Text>
      {serviceGroups.map((group, gi) => {
        const expanded = expandedGroups.includes(gi);
        return (
          <View key={gi} style={styles.serviceGroup}>
            <TouchableOpacity style={styles.serviceGroupHeader} onPress={() => toggleGroup(gi)}>
              <View style={[styles.serviceGroupIcon, { backgroundColor: group.color + '15' }]}>
                <Ionicons name={group.icon} size={18} color={group.color} />
              </View>
              <Text style={styles.serviceGroupTitle}>{group.title}</Text>
              <View style={[styles.serviceGroupChevron, expanded && styles.serviceGroupChevronOpen]}>
                <Ionicons name="chevron-down" size={16} color={colors.slate[400]} />
              </View>
            </TouchableOpacity>
            {expanded && (
              <View style={styles.serviceGroupItems}>
                {group.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    style={[styles.serviceItem, ii < group.items.length - 1 && styles.serviceItemBorder]}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={[styles.serviceItemIcon, { backgroundColor: item.color + '12' }]}>
                      <Ionicons name={item.icon} size={18} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceItemLabel}>{item.label}</Text>
                      <Text style={styles.serviceItemDesc}>{item.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.slate[300]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  welcomeSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  welcomeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: colors.slate[900] },
  welcomeSubtitle: { fontSize: 14, color: colors.slate[500], marginTop: 2 },
  settingsBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },

  loadingBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { fontSize: 14, color: colors.slate[500], marginTop: 12 },

  cardsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  summaryCard: { width: 160, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardLabel: { fontSize: 12, color: colors.slate[500], marginBottom: 2 },
  cardValue: { fontSize: 20, fontWeight: '700', color: colors.slate[900] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 20, marginTop: 16, marginBottom: 12 },

  vizCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 18, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  vizTitle: { fontSize: 16, fontWeight: '700', color: colors.slate[900] },
  vizSubtitle: { fontSize: 13, color: colors.slate[500], marginTop: 1 },
  stackedBar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2, marginTop: 14 },
  stackedSegment: { borderRadius: 7, minWidth: 4 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '48%', paddingVertical: 3 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: colors.slate[500], flex: 1 },
  legendValue: { fontSize: 12, fontWeight: '600', color: colors.slate[800] },
  budgetRemaining: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.slate[100] },
  budgetRemainingText: { fontSize: 13, fontWeight: '600', color: colors.emerald[500] },

  insightBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 4, marginBottom: 4, backgroundColor: colors.purple[100] + '80', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.purple[100] },
  insightIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  insightBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },

  savingsCard: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 18, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  savingsLeft: {},
  ringOuter: { width: 72, height: 72, borderRadius: 36, borderWidth: 6, borderColor: colors.amber[400], alignItems: 'center', justifyContent: 'center', backgroundColor: colors.amber[50] },
  ringInner: { alignItems: 'center' },
  ringPct: { fontSize: 20, fontWeight: '800', color: colors.amber[600] },
  savingsRight: { flex: 1 },
  savingsTitle: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  savingsAmount: { fontSize: 14, fontWeight: '600', color: colors.slate[700], marginTop: 2 },
  savingsOf: { fontWeight: '400', color: colors.slate[400] },
  savingsMiniBar: { height: 5, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  savingsMiniBarFill: { height: '100%', backgroundColor: colors.amber[400], borderRadius: 3 },

  activityCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  activityDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  activityDesc: { fontSize: 14, fontWeight: '500', color: colors.slate[800] },
  activityTime: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  activityAmount: { fontSize: 14, fontWeight: '600' },

  serviceGroup: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  serviceGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  serviceGroupIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serviceGroupTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.slate[800] },
  serviceGroupChevron: { transform: [{ rotate: '0deg' }] },
  serviceGroupChevronOpen: { transform: [{ rotate: '180deg' }] },
  serviceGroupItems: { borderTopWidth: 1, borderTopColor: colors.slate[100] },
  serviceItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  serviceItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[50] },
  serviceItemIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  serviceItemLabel: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  serviceItemDesc: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
});
