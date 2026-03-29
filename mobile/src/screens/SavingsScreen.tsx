import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const goals = [
  { name: 'Emergency Fund', current: 7300, target: 10000, icon: 'shield-checkmark-outline' as const, color: '#f97316', monthly: 450 },
  { name: 'Vacation Fund', current: 1800, target: 3000, icon: 'airplane-outline' as const, color: colors.blue[500], monthly: 200 },
  { name: 'New Car', current: 4500, target: 15000, icon: 'car-outline' as const, color: colors.purple[500], monthly: 350 },
  { name: 'College Fund', current: 2100, target: 25000, icon: 'school-outline' as const, color: colors.primary[600], monthly: 300 },
];

const hysa = [
  { bank: 'Ally Bank', apy: '4.25%', min: '$0', highlight: 'No minimum, no fees' },
  { bank: 'Marcus by GS', apy: '4.15%', min: '$0', highlight: 'Goldman Sachs backed' },
  { bank: 'Discover', apy: '4.00%', min: '$0', highlight: 'ATM card included' },
];

const tips = [
  { title: '50/30/20 Rule', desc: '50% needs, 30% wants, 20% savings', icon: 'pie-chart-outline' as const, color: colors.primary[600] },
  { title: 'Pay Yourself First', desc: 'Save before you spend, not after', icon: 'wallet-outline' as const, color: colors.emerald[500] },
  { title: 'Automate Savings', desc: 'Set up automatic transfers on payday', icon: 'sync-outline' as const, color: colors.purple[500] },
  { title: 'Emergency Fund', desc: 'Save 3-6 months of expenses first', icon: 'shield-outline' as const, color: colors.amber[500] },
];

export default function SavingsScreen() {
  const [expenses, setExpenses] = useState('');

  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const monthlyRate = goals.reduce((s, g) => s + g.monthly, 0);
  const estInterest = Math.round(totalSaved * 0.0425);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overview KPIs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: colors.emerald[500] }]}>
          <Ionicons name="wallet" size={20} color="#fff" />
          <Text style={styles.kpiLabel2}>Total Savings</Text>
          <Text style={styles.kpiValue2}>${totalSaved.toLocaleString()}</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: colors.blue[500] }]}>
          <Ionicons name="trending-up" size={20} color="#fff" />
          <Text style={styles.kpiLabel2}>Monthly Rate</Text>
          <Text style={styles.kpiValue2}>${monthlyRate.toLocaleString()}/mo</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: colors.purple[500] }]}>
          <Ionicons name="cash" size={20} color="#fff" />
          <Text style={styles.kpiLabel2}>Est. Interest/yr</Text>
          <Text style={styles.kpiValue2}>${estInterest}</Text>
        </View>
      </ScrollView>

      {/* Savings Goals */}
      <Text style={styles.sectionTitle}>Savings Goals</Text>
      {goals.map((goal, i) => {
        const pct = Math.round((goal.current / goal.target) * 100);
        const remaining = goal.target - goal.current;
        const monthsLeft = Math.ceil(remaining / goal.monthly);
        return (
          <View key={i} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIcon, { backgroundColor: goal.color + '15' }]}>
                <Ionicons name={goal.icon} size={20} color={goal.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalMeta}>${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}</Text>
              </View>
              <Text style={[styles.goalPct, { color: goal.color }]}>{pct}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: goal.color }]} />
            </View>
            <View style={styles.goalFooter}>
              <Text style={styles.goalFooterText}>${goal.monthly}/mo contribution</Text>
              <Text style={styles.goalFooterText}>~{monthsLeft} months left</Text>
            </View>
          </View>
        );
      })}

      {/* Add Goal */}
      <TouchableOpacity style={styles.addGoalBtn}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary[600]} />
        <Text style={styles.addGoalText}>Add New Goal</Text>
      </TouchableOpacity>

      {/* High-Yield Accounts */}
      <Text style={styles.sectionTitle}>High-Yield Savings</Text>
      {hysa.map((account, i) => (
        <View key={i} style={styles.hysaCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hysaName}>{account.bank}</Text>
            <Text style={styles.hysaHighlight}>{account.highlight}</Text>
            <Text style={styles.hysaMin}>Min: {account.min}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.hysaApy}>{account.apy}</Text>
            <Text style={styles.hysaApyLabel}>APY</Text>
          </View>
        </View>
      ))}

      {/* Savings Tips */}
      <Text style={styles.sectionTitle}>Savings Tips</Text>
      <View style={styles.tipsGrid}>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color + '15' }]}>
              <Ionicons name={tip.icon} size={18} color={tip.color} />
            </View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        ))}
      </View>

      {/* Emergency Fund Calculator */}
      <View style={styles.calcCard}>
        <View style={styles.calcHeader}>
          <Ionicons name="calculator-outline" size={18} color={colors.primary[600]} />
          <Text style={styles.calcTitle}>Emergency Fund Calculator</Text>
        </View>
        <Text style={styles.calcLabel}>Monthly Expenses</Text>
        <TextInput
          style={styles.calcInput}
          placeholder="e.g. 3000"
          placeholderTextColor={colors.slate[400]}
          keyboardType="decimal-pad"
          value={expenses}
          onChangeText={setExpenses}
        />
        {expenses ? (
          <View style={styles.calcResults}>
            <View style={styles.calcResult}>
              <Text style={styles.calcResultLabel}>3-Month Fund</Text>
              <Text style={styles.calcResultValue}>${(parseFloat(expenses) * 3).toLocaleString()}</Text>
            </View>
            <View style={styles.calcResult}>
              <Text style={styles.calcResultLabel}>6-Month Fund</Text>
              <Text style={styles.calcResultValue}>${(parseFloat(expenses) * 6).toLocaleString()}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* AI Insight */}
      <View style={styles.aiCard}>
        <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Savings Insight</Text>
          <Text style={styles.aiBody}>
            At your current rate of ${monthlyRate}/mo, you'll reach your emergency fund goal in ~{Math.ceil((10000 - 7300) / 450)} months. Consider increasing by $50/mo to hit it even faster!
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  kpiRow: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  kpiCard: { width: 155, borderRadius: 16, padding: 16 },
  kpiLabel2: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  kpiValue2: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 2 },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 20, marginBottom: 10 },

  goalCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  goalIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalName: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  goalMeta: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  goalPct: { fontSize: 16, fontWeight: '800' },
  progressBg: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  goalFooterText: { fontSize: 11, color: colors.slate[400] },

  addGoalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginHorizontal: 16, marginBottom: 4, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary[200], borderStyle: 'dashed' },
  addGoalText: { fontSize: 14, fontWeight: '600', color: colors.primary[600] },

  hysaCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  hysaName: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  hysaHighlight: { fontSize: 12, color: colors.primary[600], marginTop: 2 },
  hysaMin: { fontSize: 11, color: colors.slate[400], marginTop: 2 },
  hysaApy: { fontSize: 20, fontWeight: '800', color: colors.emerald[500] },
  hysaApyLabel: { fontSize: 10, color: colors.slate[400] },

  tipsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  tipCard: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  tipIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: colors.slate[900], marginBottom: 2 },
  tipDesc: { fontSize: 11, color: colors.slate[500], lineHeight: 15 },

  calcCard: { margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.primary[100] },
  calcHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  calcTitle: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  calcLabel: { fontSize: 13, fontWeight: '600', color: colors.slate[700], marginBottom: 6 },
  calcInput: { borderWidth: 1, borderColor: colors.slate[200], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.slate[900], backgroundColor: colors.slate[50] },
  calcResults: { flexDirection: 'row', gap: 12, marginTop: 12 },
  calcResult: { flex: 1, backgroundColor: colors.primary[50], borderRadius: 10, padding: 12, alignItems: 'center' },
  calcResultLabel: { fontSize: 11, color: colors.primary[600], marginBottom: 2 },
  calcResultValue: { fontSize: 18, fontWeight: '700', color: colors.primary[800] },

  aiCard: { flexDirection: 'row', gap: 12, margin: 16, padding: 16, backgroundColor: colors.purple[100] + '60', borderRadius: 14, borderWidth: 1, borderColor: colors.purple[100] },
  aiTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  aiBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },
});
