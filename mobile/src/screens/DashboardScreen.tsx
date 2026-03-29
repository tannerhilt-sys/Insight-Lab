import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const summaryCards = [
  { title: 'Budget Health', value: '$4,200', badge: '+$1,500', icon: 'wallet-outline' as const, color: colors.emerald[500], bgColor: colors.emerald[50], screen: 'Budget' },
  { title: 'Portfolio', value: '$12,847', badge: '+4.2%', icon: 'trending-up-outline' as const, color: colors.primary[600], bgColor: colors.primary[50], screen: 'Portfolio' },
  { title: 'Emergency Fund', value: '$7,300', badge: '73%', icon: 'flag-outline' as const, color: colors.amber[500], bgColor: colors.amber[50], screen: 'Savings' },
  { title: 'Banking', value: '$24,448', badge: '3 accts', icon: 'business-outline' as const, color: colors.blue[500], bgColor: colors.blue[50], screen: 'Banking' },
];

const recentActivity = [
  { id: '1', desc: 'Grocery shopping', amount: -87.52, time: '2h ago', positive: false },
  { id: '2', desc: 'Freelance payment', amount: 450, time: '5h ago', positive: true },
  { id: '3', desc: 'Bought 5 shares AAPL', amount: -875.50, time: '1d ago', positive: false },
  { id: '4', desc: 'Netflix subscription', amount: -15.99, time: '2d ago', positive: false },
  { id: '5', desc: 'Salary deposit', amount: 4200, time: '3d ago', positive: true },
];

// Spending breakdown for donut visual
const spendingBreakdown = [
  { label: 'Housing', pct: 44, amount: 1200, color: colors.primary[600] },
  { label: 'Food', pct: 19, amount: 510, color: colors.emerald[500] },
  { label: 'Shopping', pct: 15, amount: 402, color: colors.amber[500] },
  { label: 'Transport', pct: 10, amount: 268, color: colors.blue[500] },
  { label: 'Other', pct: 12, amount: 320, color: colors.purple[500] },
];

// Weekly spending spark data
const weeklySpend = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 120 },
  { day: 'Wed', amount: 30 },
  { day: 'Thu', amount: 87 },
  { day: 'Fri', amount: 210 },
  { day: 'Sat', amount: 65 },
  { day: 'Sun', amount: 15 },
];

const topStocks = [
  { symbol: 'AAPL', change: +2.34, pct: '+1.33%', positive: true },
  { symbol: 'MSFT', change: +5.12, pct: '+1.37%', positive: true },
  { symbol: 'TSLA', change: -3.67, pct: '-1.46%', positive: false },
  { symbol: 'NVDA', change: +15.43, pct: '+1.79%', positive: true },
];

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

  const maxWeekly = Math.max(...weeklySpend.map((d) => d.amount));

  const toggleGroup = (i: number) => {
    setExpandedGroups((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

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

      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
        {summaryCards.map((card, i) => (
          <TouchableOpacity key={i} style={styles.summaryCard} onPress={() => navigation.navigate(card.screen)}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: card.bgColor }]}>
                <Ionicons name={card.icon} size={20} color={card.color} />
              </View>
              <View style={[styles.badge, { backgroundColor: card.bgColor }]}>
                <Text style={[styles.badgeText, { color: card.color }]}>{card.badge}</Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>{card.title}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ====== VISUAL SECTION: Monthly Spending Breakdown ====== */}
      <View style={styles.vizCard}>
        <Text style={styles.vizTitle}>Monthly Spending</Text>
        <Text style={styles.vizSubtitle}>$2,700 of $4,200 budget</Text>
        {/* Horizontal stacked bar */}
        <View style={styles.stackedBar}>
          {spendingBreakdown.map((seg, i) => (
            <View key={i} style={[styles.stackedSegment, { flex: seg.pct, backgroundColor: seg.color }]} />
          ))}
        </View>
        {/* Legend */}
        <View style={styles.legendGrid}>
          {spendingBreakdown.map((seg, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <Text style={styles.legendLabel}>{seg.label}</Text>
              <Text style={styles.legendValue}>${seg.amount}</Text>
            </View>
          ))}
        </View>
        {/* Budget remaining */}
        <View style={styles.budgetRemaining}>
          <Ionicons name="checkmark-circle" size={16} color={colors.emerald[500]} />
          <Text style={styles.budgetRemainingText}>$1,500 remaining this month</Text>
        </View>
      </View>

      {/* ====== VISUAL SECTION: Weekly Spending Bar Chart ====== */}
      <View style={styles.vizCard}>
        <View style={styles.vizHeaderRow}>
          <View>
            <Text style={styles.vizTitle}>This Week</Text>
            <Text style={styles.vizSubtitle}>$572 spent across 7 days</Text>
          </View>
          <View style={styles.weekAvgBadge}>
            <Text style={styles.weekAvgText}>Avg $82/day</Text>
          </View>
        </View>
        <View style={styles.barChart}>
          {weeklySpend.map((day, i) => {
            const height = Math.max((day.amount / maxWeekly) * 100, 6);
            const isHighest = day.amount === maxWeekly;
            return (
              <View key={i} style={styles.barCol}>
                <Text style={[styles.barValue, isHighest && { color: colors.primary[600], fontWeight: '700' }]}>
                  ${day.amount}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${height}%` },
                      isHighest ? { backgroundColor: colors.primary[600] } : { backgroundColor: colors.primary[300] },
                    ]}
                  />
                </View>
                <Text style={[styles.barDay, isHighest && { color: colors.primary[600], fontWeight: '700' }]}>{day.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ====== VISUAL SECTION: Portfolio Movers ====== */}
      <View style={styles.vizCard}>
        <View style={styles.vizHeaderRow}>
          <View>
            <Text style={styles.vizTitle}>Portfolio Movers</Text>
            <Text style={styles.vizSubtitle}>Today's top changes</Text>
          </View>
          <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Portfolio')}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
        <View style={styles.stocksRow}>
          {topStocks.map((stock, i) => (
            <TouchableOpacity key={i} style={styles.stockChip} onPress={() => navigation.navigate('Portfolio')}>
              <Text style={styles.stockSymbol}>{stock.symbol}</Text>
              <View style={[styles.stockChangeBadge, { backgroundColor: stock.positive ? colors.emerald[50] : colors.red[50] }]}>
                <Ionicons
                  name={stock.positive ? 'arrow-up' : 'arrow-down'}
                  size={10}
                  color={stock.positive ? colors.emerald[500] : colors.red[400]}
                />
                <Text style={[styles.stockChangeText, { color: stock.positive ? colors.emerald[500] : colors.red[400] }]}>
                  {stock.pct}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ====== AI Insight Banner ====== */}
      <TouchableOpacity style={styles.insightBanner} onPress={() => navigation.navigate('Chat')}>
        <View style={styles.insightIcon}>
          <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.insightTitle}>AI Insight</Text>
          <Text style={styles.insightBody}>
            You're on track to save $1.5k this month! Dining expenses are up 23% — consider cooking at home more.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.purple[400]} />
      </TouchableOpacity>

      {/* ====== VISUAL SECTION: Savings Progress Ring ====== */}
      <View style={styles.savingsCard}>
        <View style={styles.savingsLeft}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Text style={styles.ringPct}>73%</Text>
            </View>
          </View>
        </View>
        <View style={styles.savingsRight}>
          <Text style={styles.savingsTitle}>Emergency Fund</Text>
          <Text style={styles.savingsAmount}>$7,300 <Text style={styles.savingsOf}>of $10,000</Text></Text>
          <View style={styles.savingsMiniBar}>
            <View style={[styles.savingsMiniBarFill, { width: '73%' }]} />
          </View>
          <Text style={styles.savingsEta}>~6 months to goal at $450/mo</Text>
        </View>
      </View>

      {/* ====== Recent Activity ====== */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        {recentActivity.map((item) => (
          <View key={item.id} style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: item.positive ? colors.emerald[100] : colors.red[100] }]}>
              <Ionicons
                name={item.positive ? 'arrow-up' : 'arrow-down'}
                size={14}
                color={item.positive ? colors.emerald[500] : colors.red[400]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityDesc}>{item.desc}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
            <Text style={[styles.activityAmount, { color: item.positive ? colors.emerald[500] : colors.red[400] }]}>
              {item.positive ? '+' : ''}${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      {/* ====== SERVICES DROPDOWN SECTION ====== */}
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

  cardsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  summaryCard: { width: 160, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  cardLabel: { fontSize: 12, color: colors.slate[500], marginBottom: 2 },
  cardValue: { fontSize: 20, fontWeight: '700', color: colors.slate[900] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 20, marginTop: 16, marginBottom: 12 },

  // ====== Spending Breakdown Visual ======
  vizCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 18, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  vizTitle: { fontSize: 16, fontWeight: '700', color: colors.slate[900] },
  vizSubtitle: { fontSize: 13, color: colors.slate[500], marginTop: 1 },
  vizHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },

  stackedBar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2, marginTop: 14 },
  stackedSegment: { borderRadius: 7, minWidth: 4 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '48%', paddingVertical: 3 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: colors.slate[500], flex: 1 },
  legendValue: { fontSize: 12, fontWeight: '600', color: colors.slate[800] },
  budgetRemaining: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.slate[100] },
  budgetRemainingText: { fontSize: 13, fontWeight: '600', color: colors.emerald[500] },

  // ====== Weekly Bar Chart ======
  weekAvgBadge: { backgroundColor: colors.primary[50], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  weekAvgText: { fontSize: 12, fontWeight: '600', color: colors.primary[600] },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4 },
  barCol: { flex: 1, alignItems: 'center' },
  barValue: { fontSize: 10, color: colors.slate[400], marginBottom: 4 },
  barTrack: { width: '70%', height: 100, backgroundColor: colors.slate[50], borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
  barDay: { fontSize: 11, color: colors.slate[500], marginTop: 6, fontWeight: '500' },

  // ====== Portfolio Movers ======
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.primary[600] },
  stocksRow: { flexDirection: 'row', gap: 8 },
  stockChip: { flex: 1, backgroundColor: colors.slate[50], borderRadius: 12, padding: 12, alignItems: 'center' },
  stockSymbol: { fontSize: 14, fontWeight: '700', color: colors.slate[900], marginBottom: 6 },
  stockChangeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  stockChangeText: { fontSize: 12, fontWeight: '600' },

  // ====== AI Insight ======
  insightBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 4, marginBottom: 4, backgroundColor: colors.purple[100] + '80', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.purple[100] },
  insightIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  insightBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },

  // ====== Savings Ring ======
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
  savingsEta: { fontSize: 11, color: colors.slate[400], marginTop: 6 },

  // ====== Activity ======
  activityCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  activityDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  activityDesc: { fontSize: 14, fontWeight: '500', color: colors.slate[800] },
  activityTime: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  activityAmount: { fontSize: 14, fontWeight: '600' },

  // ====== Service Dropdowns ======
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
