import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const expenses = [
  { id: '1', desc: 'Rent Payment', amount: 1200, category: 'Housing', date: '2024-03-01', recurring: true },
  { id: '2', desc: 'Whole Foods', amount: 87.52, category: 'Food & Groceries', date: '2024-03-15', recurring: false },
  { id: '3', desc: 'Chipotle', amount: 14.25, category: 'Dining Out', date: '2024-03-14', recurring: false },
  { id: '4', desc: 'Shell Gas', amount: 45.00, category: 'Gas', date: '2024-03-13', recurring: false },
  { id: '5', desc: 'Netflix', amount: 15.99, category: 'Subscriptions', date: '2024-03-01', recurring: true },
  { id: '6', desc: 'Spotify', amount: 9.99, category: 'Subscriptions', date: '2024-03-01', recurring: true },
  { id: '7', desc: 'Amazon Purchase', amount: 67.43, category: 'Shopping', date: '2024-03-12', recurring: false },
  { id: '8', desc: 'Electric Bill', amount: 85.00, category: 'Utilities', date: '2024-03-05', recurring: true },
  { id: '9', desc: 'Gym Membership', amount: 49.99, category: 'Healthcare', date: '2024-03-01', recurring: true },
  { id: '10', desc: 'Movie Tickets', amount: 28.00, category: 'Entertainment', date: '2024-03-10', recurring: false },
  { id: '11', desc: 'Uber Ride', amount: 22.50, category: 'Transportation', date: '2024-03-11', recurring: false },
  { id: '12', desc: 'Target Run', amount: 134.87, category: 'Shopping', date: '2024-03-09', recurring: false },
  { id: '13', desc: 'Car Insurance', amount: 145.00, category: 'Insurance', date: '2024-03-01', recurring: true },
  { id: '14', desc: 'Haircut', amount: 35.00, category: 'Personal Care', date: '2024-03-08', recurring: false },
  { id: '15', desc: 'Coursera Sub', amount: 39.99, category: 'Education', date: '2024-03-01', recurring: true },
];

const categoryColors: Record<string, string> = {
  'Housing': colors.primary[600],
  'Food & Groceries': '#f97316',
  'Dining Out': colors.blue[500],
  'Gas': colors.purple[500],
  'Subscriptions': '#ec4899',
  'Shopping': colors.amber[500],
  'Utilities': '#14b8a6',
  'Healthcare': '#f43f5e',
  'Entertainment': '#0ea5e9',
  'Transportation': '#8b5cf6',
  'Insurance': '#84cc16',
  'Personal Care': '#06b6d4',
  'Education': '#a855f7',
};

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Housing': 'home-outline',
  'Food & Groceries': 'cart-outline',
  'Dining Out': 'restaurant-outline',
  'Gas': 'car-outline',
  'Subscriptions': 'repeat-outline',
  'Shopping': 'bag-outline',
  'Utilities': 'flash-outline',
  'Healthcare': 'fitness-outline',
  'Entertainment': 'game-controller-outline',
  'Transportation': 'bus-outline',
  'Insurance': 'shield-outline',
  'Personal Care': 'cut-outline',
  'Education': 'school-outline',
};

export default function ExpensesScreen() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const recurringTotal = expenses.filter((e) => e.recurring).reduce((s, e) => s + e.amount, 0);
  const categories = [...new Set(expenses.map((e) => e.category))];

  const filtered = expenses.filter((e) => {
    if (search && !e.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCat && e.category !== selectedCat) return false;
    return true;
  });

  const catTotals = categories.map((cat) => ({
    name: cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter((e) => e.category === cat).length,
  })).sort((a, b) => b.total - a.total);

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
        <View style={[styles.kpiCard, { borderLeftColor: colors.red[400] }]}>
          <Text style={styles.kpiLabel}>Total Expenses</Text>
          <Text style={styles.kpiValue}>${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={[styles.kpiCard, { borderLeftColor: colors.blue[500] }]}>
          <Text style={styles.kpiLabel}>Avg Daily</Text>
          <Text style={styles.kpiValue}>${(totalExpenses / 30).toFixed(2)}</Text>
        </View>
        <View style={[styles.kpiCard, { borderLeftColor: colors.amber[500] }]}>
          <Text style={styles.kpiLabel}>Recurring</Text>
          <Text style={styles.kpiValue}>${recurringTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.kpiCard, { borderLeftColor: colors.emerald[500] }]}>
          <Text style={styles.kpiLabel}>Categories</Text>
          <Text style={styles.kpiValue}>{categories.length}</Text>
        </View>
      </ScrollView>

      {/* Spending Insights */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="bulb" size={18} color={colors.amber[500]} />
          <Text style={styles.insightTitle}>Spending Insights</Text>
        </View>
        <Text style={styles.insightText}>
          Housing takes up {Math.round((1200 / totalExpenses) * 100)}% of expenses. Subscriptions total ${recurringTotal.toFixed(0)}/mo in recurring charges.
        </Text>
        <View style={styles.insightBar}>
          <View style={[styles.insightBarFill, { width: `${Math.min((totalExpenses / 4650) * 100, 100)}%` }]} />
        </View>
        <Text style={styles.insightBarLabel}>${totalExpenses.toFixed(0)} of $4,650 monthly income ({Math.round((totalExpenses / 4650) * 100)}%)</Text>
      </View>

      {/* Search + Filter + Add */}
      <View style={styles.toolbarRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={colors.slate[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            placeholderTextColor={colors.slate[400]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <TouchableOpacity
          style={[styles.chip, !selectedCat && styles.chipActive]}
          onPress={() => setSelectedCat(null)}
        >
          <Text style={[styles.chipText, !selectedCat && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCat === cat && styles.chipActive]}
            onPress={() => setSelectedCat(selectedCat === cat ? null : cat)}
          >
            <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Breakdown (Collapsible) */}
      <Text style={styles.sectionTitle}>By Category</Text>
      {catTotals.map((cat) => {
        const expanded = expandedCats.includes(cat.name);
        const catExpenses = expenses.filter((e) => e.category === cat.name);
        const color = categoryColors[cat.name] || colors.slate[500];
        const icon = categoryIcons[cat.name] || 'ellipse-outline';
        return (
          <View key={cat.name} style={styles.catSection}>
            <TouchableOpacity style={styles.catHeader} onPress={() => toggleCat(cat.name)}>
              <View style={[styles.catIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={18} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catMeta}>{cat.count} expenses</Text>
              </View>
              <Text style={styles.catTotal}>${cat.total.toFixed(2)}</Text>
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.slate[400]} />
            </TouchableOpacity>
            {expanded && (
              <View style={styles.catExpenses}>
                {catExpenses.map((e) => (
                  <View key={e.id} style={styles.expenseRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.expenseDesc}>{e.desc}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.expenseDate}>{e.date}</Text>
                        {e.recurring && (
                          <View style={styles.recurBadge}>
                            <Text style={styles.recurText}>Recurring</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={styles.expenseAmt}>-${e.amount.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>All Transactions</Text>
      <View style={styles.listCard}>
        {filtered.map((e, i) => {
          const color = categoryColors[e.category] || colors.slate[500];
          const icon = categoryIcons[e.category] || 'ellipse-outline';
          return (
            <View key={e.id} style={[styles.txRow, i < filtered.length - 1 && styles.txBorder]}>
              <View style={[styles.txIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={16} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc}>{e.desc}</Text>
                <Text style={styles.txCat}>{e.category} · {e.date}</Text>
              </View>
              <Text style={styles.txAmt}>-${e.amount.toFixed(2)}</Text>
            </View>
          );
        })}
      </View>

      {/* Add Modal */}
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={24} color={colors.slate[500]} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.modalInput} placeholder="Description" placeholderTextColor={colors.slate[400]} />
            <TextInput style={styles.modalInput} placeholder="Amount" keyboardType="decimal-pad" placeholderTextColor={colors.slate[400]} />
            <TextInput style={styles.modalInput} placeholder="Category" placeholderTextColor={colors.slate[400]} />
            <TextInput style={styles.modalInput} placeholder="Date (YYYY-MM-DD)" placeholderTextColor={colors.slate[400]} />
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowAdd(false)}>
              <Text style={styles.modalBtnText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  kpiRow: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  kpiCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, width: 140, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  kpiLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 4 },
  kpiValue: { fontSize: 18, fontWeight: '700', color: colors.slate[900] },

  insightCard: { margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.amber[100] },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: colors.slate[900] },
  insightText: { fontSize: 13, color: colors.slate[600], lineHeight: 18, marginBottom: 12 },
  insightBar: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  insightBarFill: { height: '100%', backgroundColor: colors.primary[600], borderRadius: 3 },
  insightBarLabel: { fontSize: 11, color: colors.slate[500], marginTop: 4 },

  toolbarRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.slate[200] },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.slate[900] },
  addButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary[600], alignItems: 'center', justifyContent: 'center' },

  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.slate[100] },
  chipActive: { backgroundColor: colors.primary[600] },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.slate[500] },
  chipTextActive: { color: '#fff' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 16, marginTop: 12, marginBottom: 10 },

  catSection: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 14, fontWeight: '600', color: colors.slate[800] },
  catMeta: { fontSize: 11, color: colors.slate[400] },
  catTotal: { fontSize: 14, fontWeight: '700', color: colors.slate[900], marginRight: 4 },
  catExpenses: { borderTopWidth: 1, borderTopColor: colors.slate[100], paddingHorizontal: 14, paddingBottom: 8 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.slate[50] },
  expenseDesc: { fontSize: 13, fontWeight: '500', color: colors.slate[700] },
  expenseDate: { fontSize: 11, color: colors.slate[400] },
  recurBadge: { backgroundColor: colors.primary[50], paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  recurText: { fontSize: 10, fontWeight: '600', color: colors.primary[600] },
  expenseAmt: { fontSize: 13, fontWeight: '600', color: colors.red[400] },

  listCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  txIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontSize: 14, fontWeight: '500', color: colors.slate[800] },
  txCat: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  txAmt: { fontSize: 14, fontWeight: '600', color: colors.red[400] },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.slate[900] },
  modalInput: { borderWidth: 1, borderColor: colors.slate[200], borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.slate[900], backgroundColor: colors.slate[50], marginBottom: 12 },
  modalBtn: { backgroundColor: colors.primary[600], borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
