import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';

const riskLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
const knowledgeLevels = ['Beginner', 'Intermediate', 'Advanced'];

const notifications = [
  { label: 'Budget Alerts', desc: 'When you\'re close to budget limits', key: 'budget' },
  { label: 'Portfolio Updates', desc: 'Daily market & portfolio changes', key: 'portfolio' },
  { label: 'Weekly Report', desc: 'Summary of your financial week', key: 'weekly' },
  { label: 'AI Insights', desc: 'Personalized tips and suggestions', key: 'ai' },
  { label: 'Price Alerts', desc: 'When watched stocks hit targets', key: 'price' },
];

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [buddyName, setBuddyName] = useState(user?.buddyName || 'Finance Buddy');
  const [email, setEmail] = useState(user?.email || '');
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [knowledge, setKnowledge] = useState('Intermediate');
  const [autoPortfolio, setAutoPortfolio] = useState(false);
  const [notifState, setNotifState] = useState<Record<string, boolean>>({
    budget: true, portfolio: true, weekly: false, ai: true, price: false,
  });
  const [saved, setSaved] = useState(false);

  const toggleNotif = (key: string) => {
    setNotifState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle-outline" size={20} color={colors.primary[600]} />
          <Text style={styles.sectionTitle}>Profile</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Buddy Name</Text>
          <TextInput style={styles.input} value={buddyName} onChangeText={setBuddyName} />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="options-outline" size={20} color={colors.purple[500]} />
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Risk Tolerance</Text>
          <View style={styles.riskRow}>
            {riskLabels.map((label, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.riskChip, riskTolerance === i + 1 && styles.riskChipActive]}
                onPress={() => setRiskTolerance(i + 1)}
              >
                <Text style={[styles.riskNum, riskTolerance === i + 1 && styles.riskNumActive]}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.riskLabel}>{riskLabels[riskTolerance - 1]}</Text>

          <Text style={[styles.label, { marginTop: 16 }]}>Knowledge Level</Text>
          <View style={styles.knowledgeRow}>
            {knowledgeLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.knowledgeChip, knowledge === level && styles.knowledgeChipActive]}
                onPress={() => setKnowledge(level)}
              >
                <Text style={[styles.knowledgeText, knowledge === level && styles.knowledgeTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Auto Portfolio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flash-outline" size={20} color={colors.emerald[500]} />
          <Text style={styles.sectionTitle}>Auto Portfolio</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Auto-Rebalance</Text>
              <Text style={styles.toggleDesc}>Automatically rebalance portfolio quarterly</Text>
            </View>
            <Switch
              value={autoPortfolio}
              onValueChange={setAutoPortfolio}
              trackColor={{ true: colors.primary[300], false: colors.slate[200] }}
              thumbColor={autoPortfolio ? colors.primary[600] : '#fff'}
              disabled
            />
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="notifications-outline" size={20} color={colors.blue[500]} />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <View style={styles.card}>
          {notifications.map((notif, i) => (
            <View key={notif.key} style={[styles.toggleRow, i < notifications.length - 1 && styles.toggleBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{notif.label}</Text>
                <Text style={styles.toggleDesc}>{notif.desc}</Text>
              </View>
              <Switch
                value={notifState[notif.key]}
                onValueChange={() => toggleNotif(notif.key)}
                trackColor={{ true: colors.primary[300], false: colors.slate[200] }}
                thumbColor={notifState[notif.key] ? colors.primary[600] : '#fff'}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnSaved]} onPress={handleSave}>
        {saved ? (
          <>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Saved!</Text>
          </>
        ) : (
          <Text style={styles.saveBtnText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.red[500]} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.red[500]} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },

  section: { marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.slate[900] },

  card: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },

  label: { fontSize: 13, fontWeight: '600', color: colors.slate[700], marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.slate[200], borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.slate[900], backgroundColor: colors.slate[50], marginBottom: 12 },

  riskRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  riskChip: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.slate[100], alignItems: 'center', justifyContent: 'center' },
  riskChipActive: { backgroundColor: colors.primary[600] },
  riskNum: { fontSize: 15, fontWeight: '700', color: colors.slate[500] },
  riskNumActive: { color: '#fff' },
  riskLabel: { fontSize: 12, color: colors.slate[500] },

  knowledgeRow: { flexDirection: 'row', gap: 8 },
  knowledgeChip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: colors.slate[100] },
  knowledgeChipActive: { backgroundColor: colors.primary[600] },
  knowledgeText: { fontSize: 13, fontWeight: '600', color: colors.slate[500] },
  knowledgeTextActive: { color: '#fff' },

  comingSoonBadge: { backgroundColor: colors.amber[100], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 'auto' },
  comingSoonText: { fontSize: 10, fontWeight: '600', color: colors.amber[600] },

  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  toggleBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  toggleDesc: { fontSize: 12, color: colors.slate[500], marginTop: 1 },

  saveBtn: { marginHorizontal: 16, marginTop: 20, backgroundColor: colors.primary[600], borderRadius: 12, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  saveBtnSaved: { backgroundColor: colors.emerald[500] },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  dangerSection: { margin: 16, marginTop: 24, padding: 16, backgroundColor: colors.red[50], borderRadius: 14, borderWidth: 1, borderColor: colors.red[100] },
  dangerTitle: { fontSize: 14, fontWeight: '700', color: colors.red[500], marginBottom: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.red[100] },
  logoutText: { fontSize: 14, fontWeight: '600', color: colors.red[500] },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  deleteText: { fontSize: 14, fontWeight: '600', color: colors.red[500] },
});
