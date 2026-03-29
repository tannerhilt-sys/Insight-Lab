import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { api } from '../lib/api';

interface BudgetEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetSummary {
  entries: BudgetEntry[];
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  Housing:        { icon: 'home-outline',           color: colors.primary[600] },
  Rent:           { icon: 'home-outline',           color: colors.primary[600] },
  'Food & Dining':{ icon: 'restaurant-outline',     color: colors.emerald[500] },
  Groceries:      { icon: 'restaurant-outline',     color: colors.emerald[500] },
  'Dining Out':   { icon: 'restaurant-outline',     color: colors.emerald[500] },
  Transportation: { icon: 'car-outline',            color: colors.blue[500] },
  Entertainment:  { icon: 'game-controller-outline',color: colors.purple[500] },
  Shopping:       { icon: 'bag-outline',            color: colors.amber[500] },
  Utilities:      { icon: 'flash-outline',          color: colors.red[400] },
  Subscriptions:  { icon: 'repeat-outline',         color: colors.slate[500] },
  Salary:         { icon: 'briefcase-outline',      color: colors.emerald[600] },
  Freelance:      { icon: 'laptop-outline',         color: colors.emerald[500] },
};

const DEFAULT_ICON = { icon: 'wallet-outline', color: colors.slate[500] };

const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];

function getCategoryMeta(category: string) {
  return CATEGORY_ICONS[category] ?? DEFAULT_ICON;
}

function groupExpensesByCategory(entries: BudgetEntry[]) {
  const map: Record<string, number> = {};
  for (const e of entries) {
    if (e.type === 'expense') {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
  }
  return Object.entries(map).map(([name, spent]) => ({ name, spent }));
}

export default function BudgetScreen() {
  const now = new Date();
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [year] = useState(now.getFullYear());
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDescription, setAddDescription] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addCategory, setAddCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const monthStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

  const fetchBudget = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<BudgetSummary>(`/budget/entries?month=${monthStr}`);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget');
    } finally {
      setLoading(false);
    }
  }, [monthStr]);

  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const handleAddExpense = async () => {
    const amount = parseFloat(addAmount);
    if (!addDescription.trim() || isNaN(amount) || amount <= 0 || !addCategory.trim()) return;
    setSaving(true);
    try {
      await api('/budget/entries', {
        method: 'POST',
        body: JSON.stringify({
          type: 'expense',
          amount,
          category: addCategory.trim(),
          description: addDescription.trim(),
          date: new Date().toISOString().split('T')[0],
        }),
      });
      setShowAddModal(false);
      setAddDescription('');
      setAddAmount('');
      setAddCategory('');
      await fetchBudget();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  const categoryGroups = summary ? groupExpensesByCategory(summary.entries) : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => setMonthIndex((prev) => Math.max(prev - 1, 0))}>
          <Ionicons name="chevron-back" size={22} color={monthIndex === 0 ? colors.slate[300] : colors.primary[600]} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[monthIndex]} {year}</Text>
        <TouchableOpacity onPress={() => setMonthIndex((prev) => Math.min(prev + 1, 11))}>
          <Ionicons name="chevron-forward" size={22} color={monthIndex === 11 ? colors.slate[300] : colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading budget...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={32} color={colors.red[400]} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchBudget}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderLeftColor: colors.emerald[500] }]}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: colors.emerald[500] }]}>
                ${(summary?.totalIncome ?? 0).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.red[400] }]}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, { color: colors.red[400] }]}>
                ${(summary?.totalExpenses ?? 0).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.primary[600] }]}>
              <Text style={styles.summaryLabel}>Net Savings</Text>
              <Text style={[styles.summaryValue, { color: colors.primary[600] }]}>
                ${(summary?.netSavings ?? 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.overviewLabel}>Total Income</Text>
                <Text style={styles.overviewValue}>${(summary?.totalIncome ?? 0).toLocaleString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.overviewLabel}>Net Savings</Text>
                <Text style={[styles.overviewValue, { color: (summary?.netSavings ?? 0) >= 0 ? colors.emerald[500] : colors.red[400] }]}>
                  ${Math.abs(summary?.netSavings ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: summary?.totalIncome
                      ? `${Math.min(((summary.totalExpenses) / summary.totalIncome) * 100, 100)}%`
                      : '0%',
                    backgroundColor: (summary?.netSavings ?? 0) < 0 ? colors.red[400] : colors.primary[600],
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              ${(summary?.totalExpenses ?? 0).toLocaleString()} spent of ${(summary?.totalIncome ?? 0).toLocaleString()} income
            </Text>
          </View>

          {/* Categories */}
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          {categoryGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={32} color={colors.slate[300]} />
              <Text style={styles.emptyText}>No expenses recorded this month</Text>
            </View>
          ) : (
            categoryGroups.map((cat, i) => {
              const meta = getCategoryMeta(cat.name);
              const totalIncome = summary?.totalIncome ?? 1;
              const pct = Math.min((cat.spent / totalIncome) * 100, 100);
              return (
                <View key={i} style={styles.categoryCard}>
                  <View style={styles.catHeader}>
                    <View style={[styles.catIcon, { backgroundColor: meta.color + '15' }]}>
                      <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catDetail}>${cat.spent.toLocaleString()} spent</Text>
                    </View>
                  </View>
                  <View style={styles.catProgressBg}>
                    <View style={[styles.catProgressFill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                  </View>
                </View>
              );
            })
          )}
        </>
      )}

      {/* Add Expense Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.slate[500]} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              placeholderTextColor={colors.slate[400]}
              value={addDescription}
              onChangeText={setAddDescription}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Amount (e.g. 45.00)"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.slate[400]}
              value={addAmount}
              onChangeText={setAddAmount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Category (e.g. Groceries)"
              placeholderTextColor={colors.slate[400]}
              value={addCategory}
              onChangeText={setAddCategory}
            />
            <TouchableOpacity
              style={[styles.modalButton, saving && { opacity: 0.6 }]}
              onPress={handleAddExpense}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.modalButtonText}>Add Expense</Text>
              }
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
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 16 },
  monthText: { fontSize: 17, fontWeight: '700', color: colors.slate[900], minWidth: 160, textAlign: 'center' },

  centered: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { fontSize: 14, color: colors.slate[500], marginTop: 12 },
  errorText: { fontSize: 14, color: colors.red[400], marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { marginTop: 16, backgroundColor: colors.primary[600], paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  summaryLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700' },

  overviewCard: { margin: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  overviewLabel: { fontSize: 13, color: colors.slate[500], marginBottom: 2 },
  overviewValue: { fontSize: 24, fontWeight: '700', color: colors.slate[900] },
  progressBg: { height: 8, backgroundColor: colors.slate[100], borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.slate[500], marginTop: 8 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900] },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary[600], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 14, color: colors.slate[400], marginTop: 8 },

  categoryCard: { marginHorizontal: 20, marginBottom: 10, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 15, fontWeight: '600', color: colors.slate[800] },
  catDetail: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  catProgressBg: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  catProgressFill: { height: '100%', borderRadius: 3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.slate[900] },
  modalInput: { borderWidth: 1, borderColor: colors.slate[200], borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.slate[900], backgroundColor: colors.slate[50], marginBottom: 12 },
  modalButton: { backgroundColor: colors.primary[600], borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
