import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, price: 178.72, change: 2.34, changePct: 1.33 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 3, price: 141.80, change: -1.25, changePct: -0.87 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, price: 378.91, change: 5.12, changePct: 1.37 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, price: 248.48, change: -3.67, changePct: -1.46 },
  { symbol: 'AMZN', name: 'Amazon.com', shares: 4, price: 185.07, change: 1.89, changePct: 1.03 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 2, price: 875.28, change: 15.43, changePct: 1.79 },
];

const watchlist = [
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, change: 3.21, changePct: 0.64 },
  { symbol: 'NFLX', name: 'Netflix', price: 628.40, change: -2.15, changePct: -0.34 },
  { symbol: 'DIS', name: 'Walt Disney', price: 112.33, change: 0.78, changePct: 0.70 },
];

export default function PortfolioScreen() {
  const [tab, setTab] = useState<'holdings' | 'watchlist'>('holdings');

  const totalValue = holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const totalChange = holdings.reduce((s, h) => s + h.shares * h.change, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Paper Trading Portfolio</Text>
        <Text style={styles.summaryValue}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        <View style={styles.changeRow}>
          <Ionicons
            name={totalChange >= 0 ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={totalChange >= 0 ? colors.emerald[500] : colors.red[400]}
          />
          <Text style={[styles.changeText, { color: totalChange >= 0 ? colors.emerald[500] : colors.red[400] }]}>
            ${Math.abs(totalChange).toFixed(2)} today
          </Text>
        </View>

        {/* Mini allocation bars */}
        <View style={styles.allocRow}>
          {holdings.slice(0, 4).map((h, i) => {
            const pct = ((h.shares * h.price) / totalValue) * 100;
            const barColors = [colors.primary[600], colors.emerald[500], colors.amber[500], colors.purple[500]];
            return (
              <View key={i} style={{ flex: pct }}>
                <View style={[styles.allocBar, { backgroundColor: barColors[i] }]} />
                <Text style={styles.allocLabel}>{h.symbol} {Math.round(pct)}%</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'holdings' && styles.tabActive]}
          onPress={() => setTab('holdings')}
        >
          <Text style={[styles.tabText, tab === 'holdings' && styles.tabTextActive]}>Holdings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'watchlist' && styles.tabActive]}
          onPress={() => setTab('watchlist')}
        >
          <Text style={[styles.tabText, tab === 'watchlist' && styles.tabTextActive]}>Watchlist</Text>
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      {tab === 'holdings' ? (
        <View style={styles.listCard}>
          {holdings.map((stock, i) => (
            <View key={i} style={[styles.stockRow, i < holdings.length - 1 && styles.stockRowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                <Text style={styles.stockName}>{stock.name}</Text>
                <Text style={styles.stockShares}>{stock.shares} shares</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stockPrice}>${(stock.shares * stock.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                <View style={[styles.changeBadge, { backgroundColor: stock.change >= 0 ? colors.emerald[50] : colors.red[50] }]}>
                  <Text style={[styles.changeBadgeText, { color: stock.change >= 0 ? colors.emerald[500] : colors.red[400] }]}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.listCard}>
          {watchlist.map((stock, i) => (
            <View key={i} style={[styles.stockRow, i < watchlist.length - 1 && styles.stockRowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                <Text style={styles.stockName}>{stock.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
                <View style={[styles.changeBadge, { backgroundColor: stock.change >= 0 ? colors.emerald[50] : colors.red[50] }]}>
                  <Text style={[styles.changeBadgeText, { color: stock.change >= 0 ? colors.emerald[500] : colors.red[400] }]}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Buy/Sell Buttons */}
      <View style={styles.tradeButtons}>
        <TouchableOpacity style={[styles.tradeBtn, { backgroundColor: colors.emerald[500] }]}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.tradeBtnText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tradeBtn, { backgroundColor: colors.red[400] }]}>
          <Ionicons name="remove-circle-outline" size={18} color="#fff" />
          <Text style={styles.tradeBtnText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  summaryCard: {
    margin: 20,
    backgroundColor: colors.primary[600],
    borderRadius: 20,
    padding: 24,
  },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  changeText: { fontSize: 14, fontWeight: '600' },
  allocRow: { flexDirection: 'row', gap: 4, marginTop: 20 },
  allocBar: { height: 4, borderRadius: 2 },
  allocLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 },

  tabRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.slate[100], borderRadius: 12, padding: 3, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.slate[500] },
  tabTextActive: { color: colors.slate[900] },

  listCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  stockRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  stockSymbol: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  stockName: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  stockShares: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  stockPrice: { fontSize: 15, fontWeight: '600', color: colors.slate[900] },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  changeBadgeText: { fontSize: 12, fontWeight: '600' },

  tradeButtons: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 16 },
  tradeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12 },
  tradeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
