import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { api } from '../lib/api';

interface Holding {
  id: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface WatchlistItem {
  id: string;
  ticker: string;
  companyName: string;
  addedAt: string;
}

interface PortfolioData {
  holdings: Holding[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
}

export default function PortfolioScreen() {
  const [tab, setTab] = useState<'holdings' | 'watchlist'>('holdings');
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [portfolioData, watchlistData] = await Promise.all([
        api<PortfolioData>('/portfolio/holdings'),
        api<WatchlistItem[]>('/portfolio/watchlist'),
      ]);
      setHoldings(portfolioData.holdings ?? []);
      setTotalValue(portfolioData.totalValue ?? 0);
      setTotalGainLoss(portfolioData.totalGainLoss ?? 0);
      setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Loading portfolio…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Paper Trading Portfolio</Text>
        <Text style={styles.summaryValue}>
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.changeRow}>
          <Ionicons
            name={totalGainLoss >= 0 ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={totalGainLoss >= 0 ? colors.emerald[500] : colors.red[400]}
          />
          <Text style={[styles.changeText, { color: totalGainLoss >= 0 ? colors.emerald[500] : colors.red[400] }]}>
            ${Math.abs(totalGainLoss).toFixed(2)} total gain/loss
          </Text>
        </View>

        {/* Mini allocation bars */}
        {holdings.length > 0 && (
          <View style={styles.allocRow}>
            {holdings.slice(0, 4).map((h, i) => {
              const pct = totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0;
              const barColors = [colors.primary[600], colors.emerald[500], colors.amber[500], colors.purple[500]];
              return (
                <View key={h.id} style={{ flex: Math.max(pct, 1) }}>
                  <View style={[styles.allocBar, { backgroundColor: barColors[i % barColors.length] }]} />
                  <Text style={styles.allocLabel}>{h.ticker} {Math.round(pct)}%</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'holdings' && styles.tabActive]}
          onPress={() => setTab('holdings')}
        >
          <Text style={[styles.tabText, tab === 'holdings' && styles.tabTextActive]}>
            Holdings {holdings.length > 0 ? `(${holdings.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'watchlist' && styles.tabActive]}
          onPress={() => setTab('watchlist')}
        >
          <Text style={[styles.tabText, tab === 'watchlist' && styles.tabTextActive]}>
            Watchlist {watchlist.length > 0 ? `(${watchlist.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Holdings List */}
      {tab === 'holdings' ? (
        <View style={styles.listCard}>
          {holdings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={36} color={colors.slate[300]} />
              <Text style={styles.emptyText}>No holdings yet</Text>
              <Text style={styles.emptySubtext}>Buy stocks on the web app to get started</Text>
            </View>
          ) : (
            holdings.map((stock, i) => (
              <View key={stock.id} style={[styles.stockRow, i < holdings.length - 1 && styles.stockRowBorder]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stockSymbol}>{stock.ticker}</Text>
                  <Text style={styles.stockShares}>{stock.shares} shares @ ${stock.avgCost.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.stockPrice}>
                    ${stock.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                  <View style={[
                    styles.changeBadge,
                    { backgroundColor: stock.gainLoss >= 0 ? colors.emerald[50] : colors.red[50] }
                  ]}>
                    <Text style={[
                      styles.changeBadgeText,
                      { color: stock.gainLoss >= 0 ? colors.emerald[500] : colors.red[400] }
                    ]}>
                      {stock.gainLoss >= 0 ? '+' : ''}{stock.gainLossPercent.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.listCard}>
          {watchlist.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="eye-outline" size={36} color={colors.slate[300]} />
              <Text style={styles.emptyText}>Watchlist is empty</Text>
              <Text style={styles.emptySubtext}>Add stocks to watch on the web app</Text>
            </View>
          ) : (
            watchlist.map((item, i) => (
              <View key={item.id} style={[styles.stockRow, i < watchlist.length - 1 && styles.stockRowBorder]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stockSymbol}>{item.ticker}</Text>
                  <Text style={styles.stockName}>{item.companyName}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.watchlistLabel}>Watching</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.slate[500] },
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

  errorBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.red[50],
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: { fontSize: 13, color: colors.red[400], flex: 1 },
  retryText: { fontSize: 13, fontWeight: '600', color: colors.primary[600], marginLeft: 8 },

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
  emptyState: { alignItems: 'center', padding: 40, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.slate[600] },
  emptySubtext: { fontSize: 13, color: colors.slate[400], textAlign: 'center' },
  stockRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  stockRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  stockSymbol: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  stockName: { fontSize: 12, color: colors.slate[500], marginTop: 1 },
  stockShares: { fontSize: 11, color: colors.slate[400], marginTop: 1 },
  stockPrice: { fontSize: 15, fontWeight: '600', color: colors.slate[900] },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  changeBadgeText: { fontSize: 12, fontWeight: '600' },
  watchlistLabel: { fontSize: 12, color: colors.slate[400], fontStyle: 'italic' },
});
