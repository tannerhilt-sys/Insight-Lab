import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import * as Clipboard from 'expo-clipboard';

const emergencyNumbers = [
  { label: 'Bank Fraud Line', number: '1-800-555-0199', icon: 'call-outline' as const },
  { label: 'Credit Card Fraud', number: '1-800-555-0177', icon: 'card-outline' as const },
  { label: 'Identity Theft', number: '1-877-438-4338', icon: 'person-outline' as const },
];

const bureaus = [
  { name: 'Equifax', phone: '1-800-349-9960' },
  { name: 'Experian', phone: '1-888-397-3742' },
  { name: 'TransUnion', phone: '1-800-916-8800' },
];

const securityBreakdown = [
  { label: 'Password Strength', score: 90, color: colors.emerald[500] },
  { label: 'Two-Factor Auth', score: 100, color: colors.emerald[500] },
  { label: 'Account Monitoring', score: 75, color: colors.amber[500] },
  { label: 'Alert Settings', score: 70, color: colors.amber[500] },
];

const activityLog = [
  { desc: 'Password changed', time: '2 days ago', status: 'success', icon: 'key-outline' as const },
  { desc: 'New device login (iPhone)', time: '5 days ago', status: 'info', icon: 'phone-portrait-outline' as const },
  { desc: 'Unusual login attempt blocked', time: '1 week ago', status: 'warning', icon: 'shield-outline' as const },
  { desc: '2FA enabled on savings', time: '2 weeks ago', status: 'success', icon: 'lock-closed-outline' as const },
];

const checklist = [
  { label: 'Enable 2FA on all accounts', done: true },
  { label: 'Set up transaction alerts', done: true },
  { label: 'Review linked devices', done: false },
  { label: 'Update recovery email', done: true },
  { label: 'Freeze credit at all 3 bureaus', done: false },
  { label: 'Set up credit monitoring', done: false },
  { label: 'Create unique passwords', done: true },
  { label: 'Review account statements', done: false },
];

const fraudTips = [
  { title: 'Phishing Protection', icon: 'mail-outline' as const, color: colors.blue[500], tips: ['Never click links in unexpected emails', 'Check sender addresses carefully', 'Banks never ask for passwords via email', 'Hover over links before clicking'] },
  { title: 'Card Skimming', icon: 'card-outline' as const, color: colors.purple[500], tips: ['Inspect ATMs before use', 'Cover PIN pad when entering', 'Use tap-to-pay when possible', 'Monitor statements weekly'] },
  { title: 'Identity Theft', icon: 'person-outline' as const, color: colors.red[400], tips: ['Shred sensitive documents', 'Monitor credit reports regularly', 'Use unique passwords everywhere', 'Freeze credit when not applying'] },
  { title: 'Online Safety', icon: 'globe-outline' as const, color: colors.emerald[500], tips: ['Use a password manager', 'Enable 2FA everywhere', 'Avoid public WiFi for banking', 'Keep software updated'] },
];

export default function FraudProtectionScreen() {
  const [checkState, setCheckState] = useState(checklist.map((c) => c.done));
  const [expandedTips, setExpandedTips] = useState<number[]>([]);

  const securityScore = 85;
  const checkProgress = Math.round((checkState.filter(Boolean).length / checkState.length) * 100);

  const toggleCheck = (i: number) => {
    setCheckState((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const toggleTip = (i: number) => {
    setExpandedTips((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const copyNumber = async (num: string) => {
    try {
      await Clipboard.setStringAsync(num);
      Alert.alert('Copied', `${num} copied to clipboard`);
    } catch {
      Alert.alert('Info', num);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View style={styles.banner}>
        <Ionicons name="checkmark-circle" size={20} color={colors.emerald[600]} />
        <Text style={styles.bannerText}>All Clear — No suspicious activity detected</Text>
      </View>

      {/* Emergency Numbers */}
      <Text style={styles.sectionTitle}>Emergency Numbers</Text>
      <View style={styles.numbersCard}>
        {emergencyNumbers.map((num, i) => (
          <TouchableOpacity key={i} style={[styles.numberRow, i < emergencyNumbers.length - 1 && styles.numberBorder]} onPress={() => copyNumber(num.number)}>
            <Ionicons name={num.icon} size={18} color={colors.red[400]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.numberLabel}>{num.label}</Text>
              <Text style={styles.numberValue}>{num.number}</Text>
            </View>
            <Ionicons name="copy-outline" size={16} color={colors.slate[400]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Credit Bureaus */}
      <View style={styles.bureausRow}>
        {bureaus.map((b, i) => (
          <TouchableOpacity key={i} style={styles.bureauChip} onPress={() => copyNumber(b.phone)}>
            <Text style={styles.bureauName}>{b.name}</Text>
            <Text style={styles.bureauPhone}>{b.phone}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Security Score */}
      <Text style={styles.sectionTitle}>Security Score</Text>
      <View style={styles.securityCard}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{securityScore}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <View style={{ flex: 1 }}>
            {securityBreakdown.map((item, i) => (
              <View key={i} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <View style={styles.breakdownBarBg}>
                  <View style={[styles.breakdownBarFill, { width: `${item.score}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.breakdownScore, { color: item.color }]}>{item.score}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Activity Log */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.logCard}>
        {activityLog.map((log, i) => {
          const statusColor = log.status === 'success' ? colors.emerald[500] : log.status === 'warning' ? colors.amber[500] : colors.blue[500];
          return (
            <View key={i} style={[styles.logRow, i < activityLog.length - 1 && styles.logBorder]}>
              <View style={[styles.logIcon, { backgroundColor: statusColor + '15' }]}>
                <Ionicons name={log.icon} size={16} color={statusColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.logDesc}>{log.desc}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{log.status}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Protection Checklist */}
      <Text style={styles.sectionTitle}>Protection Checklist</Text>
      <View style={styles.checkCard}>
        <View style={styles.checkProgressRow}>
          <View style={styles.checkProgressBg}>
            <View style={[styles.checkProgressFill, { width: `${checkProgress}%` }]} />
          </View>
          <Text style={styles.checkProgressText}>{checkProgress}%</Text>
        </View>
        {checkState.map((done, i) => (
          <TouchableOpacity key={i} style={styles.checkRow} onPress={() => toggleCheck(i)}>
            <Ionicons
              name={done ? 'checkbox' : 'square-outline'}
              size={20}
              color={done ? colors.primary[600] : colors.slate[300]}
            />
            <Text style={[styles.checkLabel, done && styles.checkLabelDone]}>{checklist[i].label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fraud Prevention Tips */}
      <Text style={styles.sectionTitle}>Prevention Tips</Text>
      {fraudTips.map((section, i) => {
        const expanded = expandedTips.includes(i);
        return (
          <View key={i} style={styles.tipSection}>
            <TouchableOpacity style={styles.tipHeader} onPress={() => toggleTip(i)}>
              <View style={[styles.tipIcon, { backgroundColor: section.color + '15' }]}>
                <Ionicons name={section.icon} size={18} color={section.color} />
              </View>
              <Text style={styles.tipTitle}>{section.title}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.slate[400]} />
            </TouchableOpacity>
            {expanded && (
              <View style={styles.tipContent}>
                {section.tips.map((tip, j) => (
                  <View key={j} style={styles.tipItem}>
                    <View style={styles.tipBullet} />
                    <Text style={styles.tipItemText}>{tip}</Text>
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

  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, padding: 14, backgroundColor: colors.emerald[50], borderRadius: 12, borderWidth: 1, borderColor: colors.emerald[100] },
  bannerText: { fontSize: 13, fontWeight: '600', color: colors.emerald[600] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },

  numbersCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  numberBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  numberLabel: { fontSize: 13, fontWeight: '600', color: colors.slate[800] },
  numberValue: { fontSize: 12, color: colors.slate[500], marginTop: 1 },

  bureausRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginTop: 10 },
  bureauChip: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  bureauName: { fontSize: 12, fontWeight: '700', color: colors.slate[800] },
  bureauPhone: { fontSize: 10, color: colors.slate[400], marginTop: 2 },

  securityCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  scoreRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  scoreCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: colors.emerald[200], alignItems: 'center', justifyContent: 'center' },
  scoreValue: { fontSize: 26, fontWeight: '800', color: colors.emerald[500] },
  scoreLabel: { fontSize: 10, color: colors.slate[400] },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  breakdownLabel: { fontSize: 11, color: colors.slate[600], width: 100 },
  breakdownBarBg: { flex: 1, height: 4, backgroundColor: colors.slate[100], borderRadius: 2, overflow: 'hidden' },
  breakdownBarFill: { height: '100%', borderRadius: 2 },
  breakdownScore: { fontSize: 11, fontWeight: '700', width: 22, textAlign: 'right' },

  logCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  logBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  logIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logDesc: { fontSize: 13, fontWeight: '500', color: colors.slate[800] },
  logTime: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },

  checkCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  checkProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkProgressBg: { flex: 1, height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  checkProgressFill: { height: '100%', backgroundColor: colors.primary[600], borderRadius: 3 },
  checkProgressText: { fontSize: 13, fontWeight: '700', color: colors.primary[600] },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  checkLabel: { fontSize: 14, color: colors.slate[700] },
  checkLabelDone: { textDecorationLine: 'line-through', color: colors.slate[400] },

  tipSection: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  tipIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  tipContent: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.slate[100] },
  tipItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  tipBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.slate[300] },
  tipItemText: { fontSize: 13, color: colors.slate[600] },
});
