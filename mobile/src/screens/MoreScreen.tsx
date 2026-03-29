import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';

interface Section {
  title: string;
  items: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; desc: string; screen: string }[];
}

const sections: Section[] = [
  {
    title: 'Spending & Budget',
    items: [
      { label: 'Expenses', icon: 'receipt-outline', color: colors.red[400], desc: 'Track all your spending', screen: 'Expenses' },
      { label: 'Budget Tracker', icon: 'wallet-outline', color: colors.primary[600], desc: 'Monthly budget categories', screen: 'Budget' },
    ],
  },
  {
    title: 'Banking & Savings',
    items: [
      { label: 'Banking', icon: 'business-outline', color: colors.blue[500], desc: 'Checking & savings accounts', screen: 'Banking' },
      { label: 'Savings Goals', icon: 'flag-outline', color: colors.emerald[500], desc: 'Track savings targets', screen: 'Savings' },
    ],
  },
  {
    title: 'Investing & Retirement',
    items: [
      { label: 'Portfolio', icon: 'trending-up-outline', color: colors.primary[600], desc: 'Paper trading portfolio', screen: 'Portfolio' },
      { label: 'Roth IRA', icon: 'cash-outline', color: colors.purple[500], desc: 'Tax-free retirement', screen: 'RothIRA' },
      { label: '401(K)', icon: 'business-outline', color: colors.slate[600], desc: 'Employer retirement plan', screen: 'FourOhOneK' },
    ],
  },
  {
    title: 'Tools & Protection',
    items: [
      { label: 'Credit Cards', icon: 'card-outline', color: colors.amber[500], desc: 'Smart card recommendations', screen: 'CreditCards' },
      { label: 'Fraud Protection', icon: 'shield-checkmark-outline', color: colors.red[400], desc: 'Monitor & protect accounts', screen: 'FraudProtection' },
    ],
  },
  {
    title: 'Learn & Support',
    items: [
      { label: 'Financial Education', icon: 'school-outline', color: colors.amber[500], desc: 'Courses and lessons', screen: 'Learn' },
      { label: 'AI Chat', icon: 'chatbubble-outline', color: colors.purple[600], desc: 'Ask your AI buddy', screen: 'Chat' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', icon: 'settings-outline', color: colors.slate[500], desc: 'Profile & preferences', screen: 'Settings' },
    ],
  },
];

interface Props {
  navigation: any;
}

export default function MoreScreen({ navigation }: Props) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const buddyName = user?.buddyName || 'Finance Buddy';

  const toggleSection = (i: number) => {
    setExpandedSections((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{buddyName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{buddyName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={20} color={colors.slate[500]} />
        </TouchableOpacity>
      </View>

      {/* Collapsible Sections */}
      {sections.map((section, si) => {
        const expanded = expandedSections.includes(si);
        return (
          <View key={si} style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(si)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.slate[400]}
              />
            </TouchableOpacity>
            {expanded && (
              <View style={styles.sectionContent}>
                {section.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuDesc}>{item.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.slate[300]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.red[500]} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Finance Buddy v1.0.0</Text>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 17, fontWeight: '700', color: colors.slate[900] },
  profileEmail: { fontSize: 13, color: colors.slate[500], marginTop: 1 },
  settingsBtn: { padding: 8, backgroundColor: colors.slate[50], borderRadius: 10 },

  section: { marginHorizontal: 16, marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: colors.slate[800] },
  menuDesc: { fontSize: 12, color: colors.slate[500], marginTop: 1 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.red[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.red[100],
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.red[500] },

  version: { textAlign: 'center', fontSize: 12, color: colors.slate[400], marginTop: 16 },
});
