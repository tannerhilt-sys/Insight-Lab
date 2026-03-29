import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const categories = [
  { name: 'Housing', budget: 1200, spent: 1200, icon: 'home-outline' as const, color: colors.primary[600] },
  { name: 'Food & Dining', budget: 500, spent: 423, icon: 'restaurant-outline' as const, color: colors.emerald[500] },
  { name: 'Transportation', budget: 300, spent: 187, icon: 'car-outline' as const, color: colors.blue[500] },
  { name: 'Entertainment', budget: 200, spent: 156, icon: 'game-controller-outline' as const, color: colors.purple[500] },
  { name: 'Shopping', budget: 250, spent: 312, icon: 'bag-outline' as const, color: colors.amber[500] },
  { name: 'Utilities', budget: 150, spent: 134, icon: 'flash-outline' as const, color: colors.red[400] },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function BudgetScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [monthIndex, setMonthIndex] = useState(2); // March
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;

  const totalIncome = 4650;
  const totalExpenses = 2700;
  const netSavings = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => setMonthIndex((prev) => Math.max(prev - 1, 0))}>
          <Ionicons name="chevron-back" size={22} color={monthIndex === 0 ? colors.slate[300] : colors.primary[600]} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[monthIndex]} 2024</Text>
        <TouchableOpacity onPress={() => setMonthIndex((prev) => Math.min(prev + 1, 11))}>
          <Ionicons name="chevron-forward" size={22} color={monthIndex === 11 ? colors.slate[300] : colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: colors.emerald[500] }]}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryValue, { color: colors.emerald[500] }]}>${totalIncome.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: colors.red[400] }]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryValue, { color: colors.red[400] }]}>${totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: colors.primary[600] }]}>
          <Text style={styles.summaryLabel}>Net Savings</Text>
          <Text style={[styles.summaryValue, { color: colors.primary[600] }]}>${netSavings.toLocaleString()}</Text>
        </View>
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewRow}>
          <View>
            <Text style={styles.overviewLabel}>Monthly Budget</Text>
            <Text style={styles.overviewValue}>${totalBudget.toLocaleString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={[styles.overviewValue, { color: remaining >= 0 ? colors.emerald[500] : colors.red[400] }]}>
              ${Math.abs(remaining).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                backgroundColor: totalSpent > totalBudget ? colors.red[400] : colors.primary[600],
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()} spent ({Math.round((totalSpent / totalBudget) * 100)}%)
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {categories.map((cat, i) => {
        const pct = Math.min((cat.spent / cat.budget) * 100, 100);
        const over = cat.spent > cat.budget;
        return (
          <View key={i} style={styles.categoryCard}>
            <View style={styles.catHeader}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + '15' }]}>
                <Ionicons name={cat.icon} size={20} color={cat.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catDetail}>
                  ${cat.spent} / ${cat.budget}
                </Text>
              </View>
              {over && (
                <View style={styles.overBadge}>
                  <Text style={styles.overBadgeText}>Over budget</Text>
                </View>
              )}
            </View>
            <View style={styles.catProgressBg}>
              <View
                style={[
                  styles.catProgressFill,
                  { width: `${pct}%`, backgroundColor: over ? colors.red[400] : cat.color },
                ]}
              />
            </View>
          </View>
        );
      })}

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
            <TextInput style={styles.modalInput} placeholder="Description" placeholderTextColor={colors.slate[400]} />
            <TextInput style={styles.modalInput} placeholder="Amount" keyboardType="decimal-pad" placeholderTextColor={colors.slate[400]} />
            <TextInput style={styles.modalInput} placeholder="Category" placeholderTextColor={colors.slate[400]} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalButtonText}>Add Expense</Text>
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
  monthText: { fontSize: 17, fontWeight: '700', color: colors.slate[900], minWidth: 140, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderLeftWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  summaryLabel: { fontSize: 11, color: colors.slate[500], marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  overviewCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
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

  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  catIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 15, fontWeight: '600', color: colors.slate[800] },
  catDetail: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  catProgressBg: { height: 6, backgroundColor: colors.slate[100], borderRadius: 3, overflow: 'hidden' },
  catProgressFill: { height: '100%', borderRadius: 3 },
  overBadge: { backgroundColor: colors.red[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  overBadgeText: { fontSize: 11, fontWeight: '600', color: colors.red[500] },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.slate[900] },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.slate[900],
    backgroundColor: colors.slate[50],
    marginBottom: 12,
  },
  modalButton: { backgroundColor: colors.primary[600], borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
