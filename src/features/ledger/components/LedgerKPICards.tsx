import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../../theme/theme';

export interface LedgerSummary {
  income: number;
  expense: number;
  balance: number;
}

interface Props {
  summary?: LedgerSummary;
  totalRevenue?: number;
  totalExpenses?: number;
  netBalance?: number;
}

export const LedgerKPICards: React.FC<Props> = ({
  summary,
  totalRevenue,
  totalExpenses,
  netBalance,
}) => {
  const revenue = summary?.income ?? totalRevenue ?? 0;
  const expenses = summary?.expense ?? totalExpenses ?? 0;
  const balance = summary?.balance ?? netBalance ?? 0;

  const formatCurrency = (val: number) => {
    return Math.abs(val).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.kpiContainer}>
      {/* TOTAL REVENUE */}
      <View style={[styles.kpiCard, styles.revenueCard]}>
        <View style={styles.specularTopBorderMint} />
        <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.mintGlow }]}>
          + Rs.{formatCurrency(revenue)}
        </Text>
      </View>

      {/* TOTAL EXPENSES */}
      <View style={[styles.kpiCard, styles.expenseCard]}>
        <View style={styles.specularTopBorderPink} />
        <Text style={styles.kpiLabel}>TOTAL EXPENSES</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.pinkGlow }]}>
          - Rs.{formatCurrency(expenses)}
        </Text>
      </View>

      {/* NET BALANCE */}
      <View style={[styles.kpiCard, styles.balanceCard]}>
        <View style={styles.specularTopBorderCyan} />
        <Text style={styles.kpiLabel}>NET BALANCE</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.cyanGlow }]}>
          Rs.{formatCurrency(balance)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  revenueCard: {
    borderColor: theme.colors.mintGlowBorder,
    shadowColor: theme.colors.mintGlowGlass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  expenseCard: {
    borderColor: theme.colors.pinkGlowBorder,
    shadowColor: theme.colors.pinkGlowGlass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  balanceCard: {
    borderColor: theme.colors.cyanGlowBorder,
    shadowColor: theme.colors.cyanGlowGlass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  specularTopBorderMint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.mintGlow,
    opacity: 0.8,
  },
  specularTopBorderPink: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.pinkGlow,
    opacity: 0.8,
  },
  specularTopBorderCyan: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.cyanGlow,
    opacity: 0.8,
  },
  kpiLabel: {
    fontSize: theme.typography.fontSizeSm,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: theme.typography.fontSizeXl,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});