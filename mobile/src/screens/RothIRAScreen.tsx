import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const allocations = [
  { name: 'US Stocks', pct: 50, color: colors.primary[600], holdings: [
    { ticker: 'VTI', name: 'Vanguard Total Market', shares: 15, price: 245.32, change: 1.2 },
    { ticker: 'AAPL', name: 'Apple Inc.', shares: 5, price: 178.72, change: 2.3 },
  ]},
  { name: 'Int\'l Stocks', pct: 20, color: colors.purple[500], holdings: [
    { ticker: 'VXUS', name: 'Vanguard Int\'l', shares: 20, price: 58.45, change: -0.5 },
  ]},
  { name: 'Bonds', pct: 20, color: colors.primary[300], holdings: [
    { ticker: 'BND', name: 'Vanguard Bond', shares: 25, price: 72.15, change: 0.1 },
  ]},
  { name: 'REITs', pct: 10, color: colors.primary[200], holdings: [
    { ticker: 'VNQ', name: 'Vanguard Real Estate', shares: 8, price: 84.22, change: -0.8 },
  ]},
];

const rules = [
  { title: 'Contribution Limit', value: '$7,000/year', desc: 'Under 50 ($8,000 if 50+)', icon: 'cash-outline' as const, color: colors.primary[600] },
  { title: 'Income Limit', value: '$161,000', desc: 'Single filer phase-out starts', icon: 'alert-circle-outline' as const, color: colors.amber[500] },
  { title: 'Withdrawals', value: 'Tax-Free', desc: 'After 59½ with 5yr rule', icon: 'checkmark-circle-outline' as const, color: colors.emerald[500] },
  { title: '5-Year Rule', value: 'Required', desc: 'Account must be open 5+ years', icon: 'time-outline' as const, color: colors.purple[500] },
];

export default function RothIRAScreen() {
  const [selectedAlloc, setSelectedAlloc] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Roth IRA</Text>
        <Text style={styles.heroSubtitle}>Tax-free growth for retirement</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>$14,250</Text>
            <Text style={styles.heroStatLabel}>Balance</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatValue, { color: colors.emerald[100] }]}>+8.7%</Text>
            <Text style={styles.heroStatLabel}>YTD Return</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>2y 4m</Text>
            <Text style={styles.heroStatLabel}>Age</Text>
          </View>
        </View>
      </View>

      {/* Contribution Tracker */}
      <View style={styles.contribCard}>
        <Text style={styles.contribTitle}>2024 Contributions</Text>
        <View style={styles.contribRow}>
          <Text style={styles.contribValue}>$3,500</Text>
          <Text style={styles.contribOf}>of $7,000</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
        <View style={styles.contribFooter}>
          <Text style={styles.contribFooterText}>$3,500 remaining</Text>
          <Text style={styles.contribFooterText}>~$389/mo to max out</Text>
        </View>
      </View>

      {/* Allocation */}
      <Text style={styles.sectionTitle}>Investment Allocation</Text>
      <View style={styles.allocCard}>
        {/* Allocation Bar */}
        <View style={styles.allocBar}>
          {allocations.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.allocSegment, { flex: a.pct, backgroundColor: a.color }]}
              onPress={() => setSelectedAlloc(selectedAlloc === i ? null : i)}
            />
          ))}
        </View>
        {/* Legend */}
        <View style={styles.allocLegend}>
          {allocations.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.allocLegendItem, selectedAlloc === i && styles.allocLegendActive]}
              onPress={() => setSelectedAlloc(selectedAlloc === i ? null : i)}
            >
              <View style={[styles.allocDot, { backgroundColor: a.color }]} />
              <Text style={styles.allocName}>{a.name}</Text>
              <Text style={styles.allocPct}>{a.pct}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Holdings Detail */}
        {selectedAlloc !== null && (
          <View style={styles.holdingsSection}>
            <Text style={styles.holdingsTitle}>{allocations[selectedAlloc].name} Holdings</Text>
            {allocations[selectedAlloc].holdings.map((h, i) => (
              <View key={i} style={styles.holdingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.holdingTicker}>{h.ticker}</Text>
                  <Text style={styles.holdingName}>{h.name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.holdingValue}>${(h.shares * h.price).toFixed(2)}</Text>
                  <Text style={[styles.holdingChange, { color: h.change >= 0 ? colors.emerald[500] : colors.red[400] }]}>
                    {h.change >= 0 ? '+' : ''}{h.change}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Key Rules */}
      <Text style={styles.sectionTitle}>Key Rules</Text>
      <View style={styles.rulesGrid}>
        {rules.map((rule, i) => (
          <View key={i} style={styles.ruleCard}>
            <View style={[styles.ruleIcon, { backgroundColor: rule.color + '15' }]}>
              <Ionicons name={rule.icon} size={18} color={rule.color} />
            </View>
            <Text style={styles.ruleTitle}>{rule.title}</Text>
            <Text style={styles.ruleValue}>{rule.value}</Text>
            <Text style={styles.ruleDesc}>{rule.desc}</Text>
          </View>
        ))}
      </View>

      {/* Roth vs Traditional */}
      <Text style={styles.sectionTitle}>Roth vs Traditional IRA</Text>
      <View style={styles.compCard}>
        <View style={styles.compRow}>
          <Text style={styles.compFeature}>Tax Benefit</Text>
          <Text style={styles.compRoth}>Tax-free withdrawals</Text>
          <Text style={styles.compTrad}>Tax-deductible now</Text>
        </View>
        <View style={styles.compRow}>
          <Text style={styles.compFeature}>Best For</Text>
          <Text style={styles.compRoth}>Lower tax now</Text>
          <Text style={styles.compTrad}>Higher tax now</Text>
        </View>
        <View style={styles.compRow}>
          <Text style={styles.compFeature}>RMDs</Text>
          <Text style={[styles.compRoth, { color: colors.emerald[500] }]}>None</Text>
          <Text style={[styles.compTrad, { color: colors.red[400] }]}>Required at 73</Text>
        </View>
        <View style={styles.compRow}>
          <Text style={styles.compFeature}>Income Limit</Text>
          <Text style={[styles.compRoth, { color: colors.amber[500] }]}>Yes</Text>
          <Text style={[styles.compTrad, { color: colors.emerald[500] }]}>No</Text>
        </View>
      </View>

      {/* Add Funds */}
      <Text style={styles.sectionTitle}>Add Funds</Text>
      <View style={styles.addFundsCard}>
        <Text style={styles.addFundsLabel}>Quick contribution to your Roth IRA</Text>
        <View style={styles.addFundsRow}>
          {[100, 250, 500].map((amount) => (
            <TouchableOpacity key={amount} style={styles.addFundsBtn}>
              <Text style={styles.addFundsBtnText}>${amount}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addFundsCustomBtn}>
            <Text style={styles.addFundsCustomText}>Custom</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Withdrawal Status */}
      <View style={styles.withdrawalCard}>
        <View style={styles.withdrawalIcon}>
          <Ionicons name="lock-closed" size={20} color={colors.red[400]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.withdrawalTitle}>Withdrawal Status: Locked</Text>
          <Text style={styles.withdrawalDesc}>
            Earnings are locked until age 59 1/2 and the 5-year rule is met. Contributions can be withdrawn penalty-free.
          </Text>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.aiCard}>
        <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Insight</Text>
          <Text style={styles.aiBody}>
            You're 50% to your annual limit. Contributing $389/mo for the rest of the year will max it out. At 8% avg returns, this could grow to $150K+ by retirement!
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  hero: { backgroundColor: colors.purple[800], padding: 24, paddingTop: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  heroStats: { flexDirection: 'row', marginTop: 20 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  contribCard: { margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  contribTitle: { fontSize: 15, fontWeight: '700', color: colors.slate[900], marginBottom: 8 },
  contribRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 10 },
  contribValue: { fontSize: 28, fontWeight: '800', color: colors.primary[600] },
  contribOf: { fontSize: 14, color: colors.slate[400] },
  progressBg: { height: 8, backgroundColor: colors.slate[100], borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary[600], borderRadius: 4 },
  contribFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  contribFooterText: { fontSize: 12, color: colors.slate[500] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },

  allocCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  allocBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 },
  allocSegment: { borderRadius: 6 },
  allocLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  allocLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.slate[50] },
  allocLegendActive: { backgroundColor: colors.primary[50], borderWidth: 1, borderColor: colors.primary[200] },
  allocDot: { width: 8, height: 8, borderRadius: 4 },
  allocName: { fontSize: 12, color: colors.slate[600] },
  allocPct: { fontSize: 12, fontWeight: '700', color: colors.slate[800] },
  holdingsSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.slate[100], paddingTop: 12 },
  holdingsTitle: { fontSize: 13, fontWeight: '600', color: colors.slate[700], marginBottom: 8 },
  holdingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.slate[50] },
  holdingTicker: { fontSize: 14, fontWeight: '700', color: colors.slate[900] },
  holdingName: { fontSize: 11, color: colors.slate[400] },
  holdingValue: { fontSize: 14, fontWeight: '600', color: colors.slate[900] },
  holdingChange: { fontSize: 12, fontWeight: '600' },

  rulesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  ruleCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  ruleIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  ruleTitle: { fontSize: 12, color: colors.slate[500], marginBottom: 2 },
  ruleValue: { fontSize: 16, fontWeight: '700', color: colors.slate[900], marginBottom: 2 },
  ruleDesc: { fontSize: 11, color: colors.slate[400] },

  compCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  compRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.slate[100], padding: 12 },
  compFeature: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.slate[500] },
  compRoth: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.primary[600], textAlign: 'center' },
  compTrad: { flex: 1, fontSize: 12, color: colors.slate[600], textAlign: 'center' },

  addFundsCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  addFundsLabel: { fontSize: 13, color: colors.slate[500], marginBottom: 12 },
  addFundsRow: { flexDirection: 'row', gap: 10 },
  addFundsBtn: { flex: 1, backgroundColor: colors.primary[600], borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  addFundsBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  addFundsCustomBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.primary[300], borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  addFundsCustomText: { fontSize: 15, fontWeight: '700', color: colors.primary[600] },

  withdrawalCard: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 12, backgroundColor: colors.red[50], borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.red[100] },
  withdrawalIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  withdrawalTitle: { fontSize: 14, fontWeight: '700', color: colors.red[400], marginBottom: 2 },
  withdrawalDesc: { fontSize: 12, color: colors.slate[600], lineHeight: 17 },

  aiCard: { flexDirection: 'row', gap: 12, margin: 16, padding: 16, backgroundColor: colors.purple[100] + '60', borderRadius: 14, borderWidth: 1, borderColor: colors.purple[100] },
  aiTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  aiBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },
});
