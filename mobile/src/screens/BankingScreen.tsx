import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

type Transaction = { id: string; desc: string; amount: number; date: string; type: string };
type BankAccount = { checking: { balance: string; number: string }; savings: { balance: string; number: string }; transactions: Transaction[] };

const bankAccounts: Record<string, BankAccount> = {
  Chase: {
    checking: { balance: '$3,247.89', number: '•••• 4521' },
    savings: { balance: '$12,450.00', number: '•••• 7832' },
    transactions: [
      { id: '1', desc: 'Direct Deposit - Salary', amount: 4200, date: 'Mar 15', type: 'credit' },
      { id: '2', desc: 'Rent Payment', amount: -1200, date: 'Mar 1', type: 'debit' },
      { id: '3', desc: 'Whole Foods Market', amount: -87.52, date: 'Mar 14', type: 'debit' },
      { id: '4', desc: 'Transfer to Savings', amount: -500, date: 'Mar 10', type: 'debit' },
      { id: '5', desc: 'Freelance Payment', amount: 450, date: 'Mar 12', type: 'credit' },
      { id: '6', desc: 'Electric Company', amount: -85, date: 'Mar 5', type: 'debit' },
      { id: '7', desc: 'Amazon Purchase', amount: -64.99, date: 'Mar 3', type: 'debit' },
      { id: '8', desc: 'Gas Station', amount: -42.30, date: 'Mar 2', type: 'debit' },
      { id: '9', desc: 'Venmo Transfer', amount: 150, date: 'Mar 8', type: 'credit' },
    ],
  },
  'Ally Bank': {
    checking: { balance: '$8,920.45', number: '•••• 9103' },
    savings: { balance: '$22,310.00', number: '•••• 5547' },
    transactions: [
      { id: '1', desc: 'Transfer from Chase', amount: 2000, date: 'Mar 14', type: 'credit' },
      { id: '2', desc: 'Interest Payment', amount: 78.42, date: 'Mar 1', type: 'credit' },
      { id: '3', desc: 'Online Bill Pay - Insurance', amount: -245, date: 'Mar 10', type: 'debit' },
      { id: '4', desc: 'ACH Deposit', amount: 1500, date: 'Mar 5', type: 'credit' },
      { id: '5', desc: 'Zelle Payment', amount: -300, date: 'Mar 7', type: 'debit' },
    ],
  },
};

const bankOptions = Object.keys(bankAccounts);

const savingsComparisons = [
  { bank: 'Chase', apy: '0.01%', fees: '$5/mo', min: '$300', recommended: false, color: '#1a73e8' },
  { bank: 'Ally Bank', apy: '4.25%', fees: '$0', min: '$0', recommended: true, color: '#7c3aed' },
  { bank: 'Marcus', apy: '4.15%', fees: '$0', min: '$0', recommended: false, color: colors.slate[600] },
  { bank: 'Discover', apy: '4.00%', fees: '$0', min: '$0', recommended: false, color: '#f97316' },
];

export default function BankingScreen() {
  const [selectedBank, setSelectedBank] = useState('Chase');
  const [showBankPicker, setShowBankPicker] = useState(false);
  const bank = bankAccounts[selectedBank];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Bank Selector Dropdown */}
      <View style={styles.bankSelectorWrap}>
        <TouchableOpacity style={styles.bankSelector} onPress={() => setShowBankPicker(!showBankPicker)}>
          <Ionicons name="business-outline" size={18} color={colors.primary[600]} />
          <Text style={styles.bankSelectorText}>{selectedBank}</Text>
          <Ionicons name={showBankPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.slate[400]} />
        </TouchableOpacity>
        {showBankPicker && (
          <View style={styles.bankDropdown}>
            {bankOptions.map((name) => (
              <TouchableOpacity
                key={name}
                style={[styles.bankDropdownItem, selectedBank === name && styles.bankDropdownItemActive]}
                onPress={() => { setSelectedBank(name); setShowBankPicker(false); }}
              >
                <Text style={[styles.bankDropdownText, selectedBank === name && styles.bankDropdownTextActive]}>{name}</Text>
                {selectedBank === name && <Ionicons name="checkmark" size={16} color={colors.primary[600]} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Account Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountsRow}>
        <View style={[styles.accountCard, { backgroundColor: colors.primary[600] }]}>
          <View style={styles.accountHeader}>
            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.accountType}>Checking</Text>
          </View>
          <Text style={styles.accountBalance}>{bank.checking.balance}</Text>
          <Text style={styles.accountNumber}>{bank.checking.number}</Text>
        </View>
        <View style={[styles.accountCard, { backgroundColor: colors.emerald[500] }]}>
          <View style={styles.accountHeader}>
            <Ionicons name="wallet-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.accountType}>Savings</Text>
          </View>
          <Text style={styles.accountBalance}>{bank.savings.balance}</Text>
          <Text style={styles.accountNumber}>{bank.savings.number}</Text>
        </View>
      </ScrollView>

      {/* Link Account Button */}
      <TouchableOpacity style={styles.linkBtn}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary[600]} />
        <Text style={styles.linkBtnText}>Link New Account</Text>
      </TouchableOpacity>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.card}>
        {bank.transactions.map((tx, i) => (
          <View key={tx.id} style={[styles.txRow, i < bank.transactions.length - 1 && styles.txBorder]}>
            <View style={[styles.txDot, { backgroundColor: tx.amount > 0 ? colors.emerald[100] : colors.red[100] }]}>
              <Ionicons
                name={tx.amount > 0 ? 'arrow-down' : 'arrow-up'}
                size={14}
                color={tx.amount > 0 ? colors.emerald[500] : colors.red[400]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txDesc}>{tx.desc}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={[styles.txAmt, { color: tx.amount > 0 ? colors.emerald[500] : colors.red[400] }]}>
              {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      {/* Savings Account Comparisons */}
      <Text style={styles.sectionTitle}>Best Savings Rates</Text>
      {savingsComparisons.map((bank, i) => (
        <View key={i} style={[styles.bankCard, bank.recommended && styles.bankCardRecommended]}>
          {bank.recommended && (
            <View style={styles.recommendBadge}>
              <Ionicons name="star" size={10} color="#fff" />
              <Text style={styles.recommendText}>Recommended</Text>
            </View>
          )}
          <View style={styles.bankRow}>
            <View style={[styles.bankDot, { backgroundColor: bank.color }]}>
              <Text style={styles.bankInitial}>{bank.bank[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>{bank.bank}</Text>
              <Text style={styles.bankDetail}>Min: {bank.min} · Fees: {bank.fees}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.apyValue}>{bank.apy}</Text>
              <Text style={styles.apyLabel}>APY</Text>
            </View>
          </View>
        </View>
      ))}

      {/* AI Recommendation */}
      <View style={styles.aiCard}>
        <Ionicons name="sparkles" size={20} color={colors.purple[600]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>AI Recommendation</Text>
          <Text style={styles.aiBody}>
            Consider moving your savings to Ally Bank for 4.25% APY — that's $529/year in interest on your current balance vs $1.25 at Chase.
          </Text>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  bankSelectorWrap: { paddingHorizontal: 16, paddingTop: 16, zIndex: 10 },
  bankSelector: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.slate[200] },
  bankSelectorText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.slate[800] },
  bankDropdown: { marginTop: 4, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: colors.slate[200], overflow: 'hidden' },
  bankDropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  bankDropdownItemActive: { backgroundColor: colors.primary[50] },
  bankDropdownText: { fontSize: 14, fontWeight: '500', color: colors.slate[700] },
  bankDropdownTextActive: { color: colors.primary[600], fontWeight: '600' },
  accountsRow: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  accountCard: { width: 200, borderRadius: 20, padding: 20 },
  accountHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  accountType: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  accountBalance: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  accountNumber: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  linkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 16, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary[200], borderStyle: 'dashed' },
  linkBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary[600] },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 8, marginBottom: 10 },

  card: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  txDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontSize: 14, fontWeight: '500', color: colors.slate[800] },
  txDate: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  txAmt: { fontSize: 14, fontWeight: '600' },

  bankCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  bankCardRecommended: { borderWidth: 1.5, borderColor: colors.primary[300] },
  recommendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary[600], alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 10 },
  recommendText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  bankRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bankDot: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  bankInitial: { fontSize: 16, fontWeight: '800', color: '#fff' },
  bankName: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  bankDetail: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  apyValue: { fontSize: 18, fontWeight: '800', color: colors.emerald[500] },
  apyLabel: { fontSize: 10, color: colors.slate[400] },

  aiCard: { flexDirection: 'row', gap: 12, margin: 16, padding: 16, backgroundColor: colors.purple[100] + '60', borderRadius: 14, borderWidth: 1, borderColor: colors.purple[100] },
  aiTitle: { fontSize: 14, fontWeight: '700', color: colors.purple[800], marginBottom: 2 },
  aiBody: { fontSize: 13, color: colors.slate[600], lineHeight: 18 },
});
