import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import Slider from '../components/SimpleSlider';

const funds = [
  { name: 'S&P 500 Index', ticker: 'VFIAX', return1y: '+26.3%', return5y: '+15.7%', expense: '0.04%', positive: true },
  { name: 'Total Bond Market', ticker: 'VBTLX', return1y: '+5.1%', return5y: '+1.2%', expense: '0.05%', positive: true },
  { name: 'Int\'l Stock Index', ticker: 'VTIAX', return1y: '+8.4%', return5y: '+4.8%', expense: '0.12%', positive: true },
  { name: 'Target Date 2060', ticker: 'VTTSX', return1y: '+20.1%', return5y: '+11.3%', expense: '0.08%', positive: true },
  { name: 'Small Cap Index', ticker: 'VSMAX', return1y: '+19.8%', return5y: '+9.4%', expense: '0.05%', positive: true },
];

const vestingSchedule = [
  { year: 1, pct: 25 },
  { year: 2, pct: 50 },
  { year: 3, pct: 75 },
  { year: 4, pct: 100 },
];

export default function FourOhOneKScreen() {
  const [contribRate, setContribRate] = useState(6);
  const salary = 65000;
  const yourContrib = Math.round((contribRate / 100) * salary);
  const matchPct = Math.min(contribRate, 6);
  const employerMatch = Math.round((matchPct / 100) * salary);
  const totalAnnual = yourContrib + employerMatch;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>401(K) Plan</Text>
        <Text style={styles.heroSubtitle}>Acme Corp Employer Plan</Text>
      </View>

      {/* KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Ionicons name="wallet-outline" size={18} color={colors.primary[600]} />
          <Text style={styles.kpiLabel}>Balance</Text>
          <Text style={styles.kpiValue}>$8,750</Text>
        </View>
        <View style={styles.kpiCard}>
          <Ionicons name="business-outline" size={18} color={colors.blue[500]} />
          <Text style={styles.kpiLabel}>Employer</Text>
          <Text style={styles.kpiValue}>Acme Corp</Text>
        </View>
        <View style={styles.kpiCard}>
          <Ionicons name="gift-outline" size={18} color={colors.emerald[500]} />
          <Text style={styles.kpiLabel}>Match</Text>
          <Text style={styles.kpiValue}>100% up to 6%</Text>
        </View>
        <View style={styles.kpiCard}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.purple[500]} />
          <Text style={styles.kpiLabel}>Vested</Text>
          <Text style={styles.kpiValue}>$6,563 (75%)</Text>
        </View>
      </ScrollView>

      {/* Contribution Rate */}
      <View style={styles.contribCard}>
        <Text style={styles.contribTitle}>Contribution Rate</Text>
        <Text style={styles.contribPct}>{contribRate}%</Text>
        <Slider value={contribRate} min={1} max={25} onValueChange={setContribRate} />
        <View style={styles.contribBreakdown}>
          <View style={[styles.contribBox, { backgroundColor: colors.primary[50] }]}>
            <Text style={styles.contribBoxLabel}>Your Contribution</Text>
            <Text style={[styles.contribBoxValue, { color: colors.primary[600] }]}>${yourContrib.toLocaleString()}/yr</Text>
          </View>
          <View style={[styles.contribBox, { backgroundColor: colors.emerald[50] }]}>
            <Text style={styles.contribBoxLabel}>Employer Match</Text>
            <Text style={[styles.contribBoxValue, { color: colors.emerald[500] }]}>${employerMatch.toLocaleString()}/yr</Text>
          </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Annual</Text>
          <Text style={styles.totalValue}>${totalAnnual.toLocaleString()}/yr</Text>
        </View>
        {contribRate < 6 && (
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={16} color={colors.amber[600]} />
            <Text style={styles.warningText}>You're leaving ${(3900 - employerMatch).toLocaleString()} in free employer match on the table!</Text>
          </View>
        )}
      </View>

      {/* Vesting Schedule */}
      <Text style={styles.sectionTitle}>Vesting Schedule</Text>
      <View style={styles.vestingCard}>
        <View style={styles.vestingRow}>
          {vestingSchedule.map((v) => (
            <View key={v.year} style={styles.vestingItem}>
              <View style={[styles.vestingBar, { height: `${v.pct}%` }, v.year <= 3 ? styles.vestingBarActive : styles.vestingBarFuture]} />
              <Text style={styles.vestingPct}>{v.pct}%</Text>
              <Text style={styles.vestingYear}>Year {v.year}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.vestingNote}>Currently in Year 3 — 75% vested</Text>
      </View>

      {/* Fund Options */}
      <Text style={styles.sectionTitle}>Fund Options</Text>
      <View style={styles.fundsCard}>
        {funds.map((fund, i) => (
          <View key={i} style={[styles.fundRow, i < funds.length - 1 && styles.fundBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fundName}>{fund.name}</Text>
              <Text style={styles.fundTicker}>{fund.ticker} · ER: {fund.expense}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.fundReturn, { color: colors.emerald[500] }]}>{fund.return1y}</Text>
              <Text style={styles.fundReturnLabel}>1Y return</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Limits */}
      <Text style={styles.sectionTitle}>2026 Limits</Text>
      <View style={styles.limitsRow}>
        <View style={[styles.limitCard, { borderLeftColor: colors.primary[600] }]}>
          <Text style={styles.limitLabel}>Under 50</Text>
          <Text style={styles.limitValue}>$23,500</Text>
        </View>
        <View style={[styles.limitCard, { borderLeftColor: colors.purple[500] }]}>
          <Text style={styles.limitLabel}>50 and Over</Text>
          <Text style={styles.limitValue}>$31,000</Text>
        </View>
      </View>

      {/* Tax Savings */}
      <View style={styles.taxCard}>
        <Ionicons name="receipt-outline" size={18} color={colors.emerald[500]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.taxTitle}>Estimated Tax Savings</Text>
          <Text style={styles.taxBody}>
            At {contribRate}% contribution with 22% tax bracket: ~${Math.round(yourContrib * 0.22).toLocaleString()}/yr saved in taxes (${Math.round((yourContrib * 0.22) / 12)}/mo)
          </Text>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.aiCard}>
        <Ionicons name="sparkles" size={20} color={colors.amber[500]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>Maximize Your Match</Text>
          <Text style={styles.aiBody}>
            {contribRate >= 6
              ? "You're maximizing your employer match — great job! Consider increasing to 15% for faster retirement growth."
              : `Increase to 6% to get the full employer match. That's an extra $${(3900 - employerMatch).toLocaleString()}/yr in free money!`}
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  hero: { backgroundColor: colors.slate[800], padding: 24, paddingTop: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: 13, color: colors.slate[400], marginTop: 2 },

  kpiRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 10 },
  kpiCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, width: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  kpiLabel: { fontSize: 11, color: colors.slate[500], marginTop: 6, marginBottom: 2 },
  kpiValue: { fontSize: 16, fontWeight: '700', color: colors.slate[900] },

  contribCard: { margin: 16, marginTop: 0, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  contribTitle: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  contribPct: { fontSize: 36, fontWeight: '800', color: colors.primary[600], marginVertical: 4 },
  contribBreakdown: { flexDirection: 'row', gap: 10, marginTop: 16 },
  contribBox: { flex: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  contribBoxLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 2 },
  contribBoxValue: { fontSize: 15, fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.slate[100] },
  totalLabel: { fontSize: 14, fontWeight: '600', color: colors.slate[700] },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.slate[900] },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: colors.amber[50], padding: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.amber[100] },
  warningText: { fontSize: 12, color: colors.amber[600], flex: 1 },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },

  vestingCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  vestingRow: { flexDirection: 'row', height: 120, alignItems: 'flex-end', gap: 12 },
  vestingItem: { flex: 1, alignItems: 'center' },
  vestingBar: { width: '80%', borderRadius: 6, minHeight: 10 },
  vestingBarActive: { backgroundColor: colors.emerald[500] },
  vestingBarFuture: { backgroundColor: colors.primary[300] },
  vestingPct: { fontSize: 13, fontWeight: '700', color: colors.slate[900], marginTop: 6 },
  vestingYear: { fontSize: 11, color: colors.slate[400], marginTop: 2 },
  vestingNote: { textAlign: 'center', fontSize: 12, color: colors.slate[500], marginTop: 12 },

  fundsCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  fundRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  fundBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  fundName: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  fundTicker: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  fundReturn: { fontSize: 14, fontWeight: '700' },
  fundReturnLabel: { fontSize: 10, color: colors.slate[400] },

  limitsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  limitCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  limitLabel: { fontSize: 12, color: colors.slate[500], marginBottom: 2 },
  limitValue: { fontSize: 20, fontWeight: '700', color: colors.slate[900] },

  taxCard: { flexDirection: 'row', gap: 12, margin: 16, padding: 16, backgroundColor: colors.emerald[50], borderRadius: 14, borderWidth: 1, borderColor: colors.emerald[100] },
  taxTitle: { fontSize: 14, fontWeight: '700', color: colors.emerald[600], marginBottom: 2 },
  taxBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },

  aiCard: { flexDirection: 'row', gap: 12, margin: 16, marginTop: 0, padding: 16, backgroundColor: colors.amber[50], borderRadius: 14, borderWidth: 1, borderColor: colors.amber[100] },
  aiTitle: { fontSize: 14, fontWeight: '700', color: colors.amber[600], marginBottom: 2 },
  aiBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },
});
