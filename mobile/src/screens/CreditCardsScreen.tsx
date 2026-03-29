import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const scoreFactors = [
  { name: 'Payment History', weight: 35, score: 95, color: colors.emerald[500] },
  { name: 'Credit Utilization', weight: 30, score: 72, color: colors.amber[500] },
  { name: 'Credit Age', weight: 15, score: 60, color: colors.blue[500] },
  { name: 'Credit Mix', weight: 10, score: 80, color: colors.purple[500] },
  { name: 'New Inquiries', weight: 10, score: 90, color: colors.primary[600] },
];

const cards = [
  { name: 'Chase Freedom Flex', reward: '5% rotating categories', fee: '$0', limit: '$5,000', bonus: '$200 signup bonus', gradient: ['#f97316', '#ef4444'] },
  { name: 'Citi Double Cash', reward: '2% on everything', fee: '$0', limit: '$7,500', bonus: '$200 cash back', gradient: [colors.blue[500], colors.primary[600]] },
  { name: 'Capital One Savor', reward: '4% dining & entertainment', fee: '$95/yr', limit: '$10,000', bonus: '$300 bonus', gradient: [colors.slate[600], colors.slate[800]] },
  { name: 'Discover it Cash Back', reward: '5% rotating + 1% all', fee: '$0', limit: '$3,000', bonus: 'Cashback match year 1', gradient: [colors.emerald[500], '#14b8a6'] },
];

const tips = [
  { title: 'Pay on time, every time', impact: 'High', color: colors.red[400] },
  { title: 'Keep utilization under 30%', impact: 'High', color: colors.red[400] },
  { title: 'Don\'t close old cards', impact: 'Medium', color: colors.blue[500] },
  { title: 'Limit new applications', impact: 'Medium', color: colors.blue[500] },
  { title: 'Check reports for errors', impact: 'Medium', color: colors.blue[500] },
];

const scenarios = [
  { label: 'Pay all bills on time for 6 months', effect: +15 },
  { label: 'Reduce utilization to 10%', effect: +25 },
  { label: 'Open a new credit card', effect: -10 },
];

const educationSections = [
  { title: 'How to Build Good Credit', icon: 'construct-outline' as const, color: colors.emerald[500], items: ['Pay every bill on time', 'Keep balances low (under 30%)', 'Don\'t close old accounts', 'Mix credit types (cards + loans)', 'Only apply when needed'] },
  { title: 'Credit Utilization Guide', icon: 'speedometer-outline' as const, color: colors.blue[500], items: ['0-10%: Excellent', '10-30%: Good', '30-50%: Fair — try to lower', '50-75%: Poor — pay down ASAP', '75%+: Very poor — urgent action'] },
  { title: 'Why Multiple Cards Help', icon: 'card-outline' as const, color: colors.purple[500], items: ['Increases total available credit', 'Lowers overall utilization', 'Builds diverse credit mix', 'Different rewards for categories'] },
];

const activeCards = [
  { name: 'Chase Freedom Unlimited', balance: 1247, limit: 5000, rewards: 89.50, number: '•••• 3821', color: '#1a73e8', dueDate: 'Apr 15', minPayment: '$35' },
  { name: 'Discover it', balance: 432, limit: 3000, rewards: 156.20, number: '•••• 6442', color: '#f97316', dueDate: 'Apr 22', minPayment: '$25' },
];

export default function CreditCardsScreen() {
  const score = 720;
  const [expandedEdu, setExpandedEdu] = useState<number[]>([]);
  const [scenarioToggles, setScenarioToggles] = useState<boolean[]>([false, false, false]);
  const [showCardNumbers, setShowCardNumbers] = useState<boolean[]>([false, false]);

  const simScore = score + scenarios.reduce((s, sc, i) => s + (scenarioToggles[i] ? sc.effect : 0), 0);

  const toggleEdu = (i: number) => {
    setExpandedEdu((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const toggleScenario = (i: number) => {
    setScenarioToggles((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const getScoreColor = (s: number) => s >= 740 ? colors.emerald[500] : s >= 670 ? colors.blue[500] : s >= 580 ? colors.amber[500] : colors.red[400];
  const getScoreLabel = (s: number) => s >= 740 ? 'Excellent' : s >= 670 ? 'Good' : s >= 580 ? 'Fair' : 'Poor';

  const toggleCardNumber = (i: number) => {
    setShowCardNumbers((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Active Credit Cards */}
      <Text style={styles.sectionTitle}>Active Credit Cards</Text>
      {activeCards.map((card, i) => {
        const utilization = Math.round((card.balance / card.limit) * 100);
        return (
          <View key={i} style={styles.activeCardContainer}>
            <View style={[styles.activeCardTop, { backgroundColor: card.color }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.activeCardName}>{card.name}</Text>
                <TouchableOpacity onPress={() => toggleCardNumber(i)}>
                  <Ionicons name={showCardNumbers[i] ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </View>
              <Text style={styles.activeCardNumber}>
                {showCardNumbers[i] ? '4532 1234 5678 ' + card.number.slice(-4) : card.number}
              </Text>
            </View>
            <View style={styles.activeCardBody}>
              <View style={styles.activeCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeCardLabel}>Balance</Text>
                  <Text style={styles.activeCardValue}>${card.balance.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.activeCardLabel}>Limit</Text>
                  <Text style={styles.activeCardValue}>${card.limit.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.activeCardLabel}>Rewards</Text>
                  <Text style={[styles.activeCardValue, { color: colors.emerald[500] }]}>${card.rewards.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.utilizationBarBg}>
                <View style={[styles.utilizationBarFill, { width: `${utilization}%`, backgroundColor: utilization > 30 ? colors.amber[500] : colors.emerald[500] }]} />
              </View>
              <Text style={styles.utilizationText}>{utilization}% utilization</Text>
            </View>
          </View>
        );
      })}

      {/* Payment Tracker */}
      <Text style={styles.sectionTitle}>Payment Tracker</Text>
      <View style={styles.paymentCard}>
        {activeCards.map((card, i) => (
          <View key={i} style={[styles.paymentRow, i < activeCards.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.slate[100] }]}>
            <View style={[styles.paymentDot, { backgroundColor: card.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentCardName}>{card.name}</Text>
              <Text style={styles.paymentDueDate}>Due: {card.dueDate}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.paymentMin}>Min: {card.minPayment}</Text>
              <View style={styles.paymentStatus}>
                <Ionicons name="time-outline" size={12} color={colors.amber[500]} />
                <Text style={styles.paymentStatusText}>Upcoming</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Credit Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>{score}</Text>
          <Text style={styles.scoreLabel}>{getScoreLabel(score)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.scoreTitle}>Credit Score</Text>
          {scoreFactors.map((f, i) => (
            <View key={i} style={styles.factorRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.factorName}>{f.name} ({f.weight}%)</Text>
                <View style={styles.factorBarBg}>
                  <View style={[styles.factorBarFill, { width: `${f.score}%`, backgroundColor: f.color }]} />
                </View>
              </View>
              <Text style={[styles.factorScore, { color: f.color }]}>{f.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Improvement Tips */}
      <Text style={styles.sectionTitle}>Improvement Tips</Text>
      {tips.map((tip, i) => (
        <View key={i} style={styles.tipCard}>
          <View style={[styles.tipDot, { backgroundColor: tip.color }]} />
          <Text style={styles.tipText}>{tip.title}</Text>
          <View style={[styles.impactBadge, { backgroundColor: tip.color + '15' }]}>
            <Text style={[styles.impactText, { color: tip.color }]}>{tip.impact}</Text>
          </View>
        </View>
      ))}

      {/* Card Recommendations */}
      <Text style={styles.sectionTitle}>Recommended Cards</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
        {cards.map((card, i) => (
          <View key={i} style={styles.cardRec}>
            <View style={[styles.cardGradient, { backgroundColor: card.gradient[0] }]}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardReward}>{card.reward}</Text>
            </View>
            <View style={styles.cardDetails}>
              <View style={styles.cardDetailRow}>
                <Text style={styles.cardDetailLabel}>Annual Fee</Text>
                <Text style={styles.cardDetailValue}>{card.fee}</Text>
              </View>
              <View style={styles.cardDetailRow}>
                <Text style={styles.cardDetailLabel}>Credit Limit</Text>
                <Text style={styles.cardDetailValue}>{card.limit}</Text>
              </View>
              <View style={styles.cardDetailRow}>
                <Text style={styles.cardDetailLabel}>Bonus</Text>
                <Text style={[styles.cardDetailValue, { color: colors.emerald[500] }]}>{card.bonus}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Score Simulator */}
      <Text style={styles.sectionTitle}>Score Simulator</Text>
      <View style={styles.simCard}>
        <View style={styles.simScoreRow}>
          <View>
            <Text style={styles.simLabel}>Current</Text>
            <Text style={styles.simScoreValue}>{score}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={colors.slate[300]} />
          <View>
            <Text style={styles.simLabel}>Simulated</Text>
            <Text style={[styles.simScoreValue, { color: getScoreColor(simScore) }]}>{simScore}</Text>
          </View>
        </View>
        {scenarios.map((sc, i) => (
          <View key={i} style={styles.scenarioRow}>
            <Text style={styles.scenarioText}>{sc.label}</Text>
            <View style={styles.scenarioRight}>
              <Text style={[styles.scenarioEffect, { color: sc.effect > 0 ? colors.emerald[500] : colors.red[400] }]}>
                {sc.effect > 0 ? '+' : ''}{sc.effect}
              </Text>
              <Switch
                value={scenarioToggles[i]}
                onValueChange={() => toggleScenario(i)}
                trackColor={{ true: colors.primary[300], false: colors.slate[200] }}
                thumbColor={scenarioToggles[i] ? colors.primary[600] : '#fff'}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Education */}
      <Text style={styles.sectionTitle}>Credit Education</Text>
      {educationSections.map((section, i) => {
        const expanded = expandedEdu.includes(i);
        return (
          <View key={i} style={styles.eduCard}>
            <TouchableOpacity style={styles.eduHeader} onPress={() => toggleEdu(i)}>
              <View style={[styles.eduIcon, { backgroundColor: section.color + '15' }]}>
                <Ionicons name={section.icon} size={18} color={section.color} />
              </View>
              <Text style={styles.eduTitle}>{section.title}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.slate[400]} />
            </TouchableOpacity>
            {expanded && (
              <View style={styles.eduContent}>
                {section.items.map((item, j) => (
                  <View key={j} style={styles.eduItem}>
                    <View style={styles.eduBullet} />
                    <Text style={styles.eduItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },

  activeCardContainer: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  activeCardTop: { padding: 16, paddingBottom: 20 },
  activeCardName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  activeCardNumber: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8, letterSpacing: 1 },
  activeCardBody: { padding: 16 },
  activeCardRow: { flexDirection: 'row', marginBottom: 12 },
  activeCardLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 2 },
  activeCardValue: { fontSize: 16, fontWeight: '700', color: colors.slate[900] },
  utilizationBarBg: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  utilizationBarFill: { height: '100%', borderRadius: 3 },
  utilizationText: { fontSize: 11, color: colors.slate[500], marginTop: 4, textAlign: 'right' },

  paymentCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  paymentDot: { width: 10, height: 10, borderRadius: 5 },
  paymentCardName: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  paymentDueDate: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  paymentMin: { fontSize: 13, fontWeight: '600', color: colors.slate[800] },
  paymentStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  paymentStatusText: { fontSize: 11, color: colors.amber[500], fontWeight: '500' },

  scoreCard: { flexDirection: 'row', gap: 16, margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  scoreCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: colors.primary[200], alignItems: 'center', justifyContent: 'center' },
  scoreValue: { fontSize: 28, fontWeight: '800' },
  scoreLabel: { fontSize: 10, color: colors.slate[500] },
  scoreTitle: { fontSize: 15, fontWeight: '700', color: colors.slate[900], marginBottom: 8 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  factorName: { fontSize: 11, color: colors.slate[600], marginBottom: 2 },
  factorBarBg: { height: 4, backgroundColor: colors.slate[100], borderRadius: 2, overflow: 'hidden' },
  factorBarFill: { height: '100%', borderRadius: 2 },
  factorScore: { fontSize: 12, fontWeight: '700', width: 24, textAlign: 'right' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },

  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 6, backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  tipDot: { width: 8, height: 8, borderRadius: 4 },
  tipText: { flex: 1, fontSize: 13, fontWeight: '500', color: colors.slate[800] },
  impactBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  impactText: { fontSize: 11, fontWeight: '600' },

  cardsScroll: { paddingHorizontal: 16, gap: 12 },
  cardRec: { width: 220, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  cardGradient: { padding: 16, paddingBottom: 20 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardReward: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cardDetails: { padding: 12 },
  cardDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  cardDetailLabel: { fontSize: 12, color: colors.slate[500] },
  cardDetailValue: { fontSize: 12, fontWeight: '600', color: colors.slate[800] },

  simCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  simScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  simLabel: { fontSize: 11, color: colors.slate[500], textAlign: 'center' },
  simScoreValue: { fontSize: 32, fontWeight: '800', color: colors.slate[900], textAlign: 'center' },
  scenarioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.slate[50] },
  scenarioText: { flex: 1, fontSize: 13, color: colors.slate[700] },
  scenarioRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scenarioEffect: { fontSize: 13, fontWeight: '700' },

  eduCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  eduHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  eduIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  eduTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  eduContent: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.slate[100] },
  eduItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  eduBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.slate[300] },
  eduItemText: { fontSize: 13, color: colors.slate[600] },
});
