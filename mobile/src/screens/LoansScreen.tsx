import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const loans = [
  {
    type: 'Student Loan',
    icon: 'school-outline' as const,
    color: colors.primary[600],
    balance: 28450,
    rate: 5.5,
    monthlyPayment: 320,
    term: '10 years',
    origAmount: 45000,
    startDate: 'Sep 2020',
    lender: 'Federal Direct',
    payoffDate: 'Sep 2030',
    strategies: [
      'Make extra payments of $100/mo to save $3,200 in interest',
      'Apply for income-driven repayment if needed',
      'Check for employer student loan assistance programs',
    ],
  },
  {
    type: 'Auto Loan',
    icon: 'car-outline' as const,
    color: colors.blue[500],
    balance: 12800,
    rate: 6.9,
    monthlyPayment: 425,
    term: '5 years',
    origAmount: 22000,
    startDate: 'Mar 2022',
    lender: 'Capital One Auto',
    payoffDate: 'Mar 2027',
    strategies: [
      'Refinance to a lower rate (currently possible at ~5.2%)',
      'Bi-weekly payments reduce term by 6 months',
      'Round up payments to $450 to save $680 in interest',
    ],
  },
  {
    type: 'Mortgage',
    icon: 'home-outline' as const,
    color: colors.emerald[500],
    balance: 245000,
    rate: 6.75,
    monthlyPayment: 1850,
    term: '30 years',
    origAmount: 280000,
    startDate: 'Jan 2023',
    lender: 'Wells Fargo',
    payoffDate: 'Jan 2053',
    strategies: [
      'One extra payment per year saves 4+ years off the loan',
      'Refinance when rates drop below 5.5%',
      'Consider recasting after large lump sum payments',
    ],
  },
  {
    type: 'Personal Loan',
    icon: 'person-outline' as const,
    color: colors.amber[500],
    balance: 5200,
    rate: 11.5,
    monthlyPayment: 252,
    term: '2 years',
    origAmount: 8000,
    startDate: 'Jun 2023',
    lender: 'SoFi',
    payoffDate: 'Jun 2025',
    strategies: [
      'Priority payoff - highest interest rate loan',
      'Pay $400/mo to eliminate 5 months early',
      'Consider balance transfer to 0% APR card',
    ],
  },
];

const totalDebt = 291450;
const totalMonthly = 2847;
const avgRate = 6.8;

export default function LoansScreen() {
  const [expandedLoans, setExpandedLoans] = useState<number[]>([]);
  const [enabledLoans, setEnabledLoans] = useState<boolean[]>([true, true, true, true]);

  const toggleLoan = (i: number) => {
    setExpandedLoans((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const toggleEnabled = (i: number) => {
    setEnabledLoans((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const activeDebt = loans.reduce((s, l, i) => s + (enabledLoans[i] ? l.balance : 0), 0);
  const activeMonthly = loans.reduce((s, l, i) => s + (enabledLoans[i] ? l.monthlyPayment : 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIcon, { backgroundColor: colors.red[50] }]}>
            <Ionicons name="trending-down-outline" size={18} color={colors.red[400]} />
          </View>
          <Text style={styles.kpiLabel}>Total Debt</Text>
          <Text style={styles.kpiValue}>${(activeDebt).toLocaleString()}</Text>
        </View>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIcon, { backgroundColor: colors.blue[50] }]}>
            <Ionicons name="calendar-outline" size={18} color={colors.blue[500]} />
          </View>
          <Text style={styles.kpiLabel}>Monthly</Text>
          <Text style={styles.kpiValue}>${activeMonthly.toLocaleString()}</Text>
        </View>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIcon, { backgroundColor: colors.amber[50] }]}>
            <Ionicons name="stats-chart-outline" size={18} color={colors.amber[500]} />
          </View>
          <Text style={styles.kpiLabel}>Avg Rate</Text>
          <Text style={styles.kpiValue}>{avgRate}%</Text>
        </View>
      </View>

      {/* Toggle Panel */}
      <Text style={styles.sectionTitle}>Loan Types</Text>
      <View style={styles.togglePanel}>
        {loans.map((loan, i) => (
          <View key={i} style={[styles.toggleRow, i < loans.length - 1 && styles.toggleRowBorder]}>
            <View style={[styles.toggleDot, { backgroundColor: loan.color }]} />
            <Text style={styles.toggleLabel}>{loan.type}</Text>
            <Switch
              value={enabledLoans[i]}
              onValueChange={() => toggleEnabled(i)}
              trackColor={{ true: loan.color + '80', false: colors.slate[200] }}
              thumbColor={enabledLoans[i] ? loan.color : '#fff'}
            />
          </View>
        ))}
      </View>

      {/* Loan Details */}
      <Text style={styles.sectionTitle}>Loan Details</Text>
      {loans.map((loan, i) => {
        if (!enabledLoans[i]) return null;
        const expanded = expandedLoans.includes(i);
        const paidPct = Math.round(((loan.origAmount - loan.balance) / loan.origAmount) * 100);
        return (
          <View key={i} style={styles.loanCard}>
            <TouchableOpacity style={styles.loanHeader} onPress={() => toggleLoan(i)}>
              <View style={[styles.loanIcon, { backgroundColor: loan.color + '15' }]}>
                <Ionicons name={loan.icon} size={20} color={loan.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.loanType}>{loan.type}</Text>
                <Text style={styles.loanSummary}>
                  ${loan.balance.toLocaleString()} @ {loan.rate}%
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.loanPayment}>${loan.monthlyPayment}/mo</Text>
              </View>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.slate[400]} style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Progress bar */}
            <View style={styles.loanProgressBg}>
              <View style={[styles.loanProgressFill, { width: `${paidPct}%`, backgroundColor: loan.color }]} />
            </View>
            <Text style={styles.loanProgressText}>{paidPct}% paid off</Text>

            {expanded && (
              <View style={styles.loanDetails}>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Original Amount</Text>
                    <Text style={styles.detailValue}>${loan.origAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Remaining</Text>
                    <Text style={styles.detailValue}>${loan.balance.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Lender</Text>
                    <Text style={styles.detailValue}>{loan.lender}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Term</Text>
                    <Text style={styles.detailValue}>{loan.term}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Start Date</Text>
                    <Text style={styles.detailValue}>{loan.startDate}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payoff Date</Text>
                    <Text style={styles.detailValue}>{loan.payoffDate}</Text>
                  </View>
                </View>

                <Text style={styles.strategiesTitle}>Payoff Strategies</Text>
                {loan.strategies.map((strategy, j) => (
                  <View key={j} style={styles.strategyRow}>
                    <View style={[styles.strategyBullet, { backgroundColor: loan.color }]} />
                    <Text style={styles.strategyText}>{strategy}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      {/* AI Recommendation */}
      <View style={styles.aiCard}>
        <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Recommendation: Avalanche Method</Text>
          <Text style={styles.aiBody}>
            Pay minimums on all loans, then put extra money toward the Personal Loan (11.5% APR) first. After that, target the Auto Loan (6.9%). This saves you $4,830 in interest compared to the snowball method.
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },

  kpiRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 8 },
  kpiCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  kpiIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  kpiLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 2 },
  kpiValue: { fontSize: 18, fontWeight: '800', color: colors.slate[900] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },

  togglePanel: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  toggleRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  toggleDot: { width: 10, height: 10, borderRadius: 5 },
  toggleLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.slate[800] },

  loanCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  loanHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loanIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  loanType: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  loanSummary: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  loanPayment: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },

  loanProgressBg: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden', marginTop: 12 },
  loanProgressFill: { height: '100%', borderRadius: 3 },
  loanProgressText: { fontSize: 11, color: colors.slate[500], marginTop: 4, textAlign: 'right' },

  loanDetails: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.slate[100], paddingTop: 12 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  detailItem: { width: '48%', paddingVertical: 6 },
  detailLabel: { fontSize: 11, color: colors.slate[500] },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.slate[800], marginTop: 1 },

  strategiesTitle: { fontSize: 13, fontWeight: '700', color: colors.slate[700], marginTop: 12, marginBottom: 6 },
  strategyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 4 },
  strategyBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  strategyText: { flex: 1, fontSize: 13, color: colors.slate[600], lineHeight: 18 },

  aiCard: { flexDirection: 'row', gap: 12, margin: 16, padding: 16, backgroundColor: colors.purple[100] + '60', borderRadius: 14, borderWidth: 1, borderColor: colors.purple[100] },
  aiTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  aiBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },
});
