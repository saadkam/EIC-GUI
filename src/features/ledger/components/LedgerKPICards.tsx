import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
  totalRevenue?: number;
  totalExpenses?: number;
  netBalance?: number;
}

export const LedgerKPICards: React.FC<Props> = ({
  totalRevenue = 0,
  totalExpenses = 0,
  netBalance = 0,
}) => {
  // Safe currency formatter with fallback to 0
  const formatCurrency = (val?: number) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.kpiContainer}>
      {/* TOTAL REVENUE */}
      <View style={[styles.kpiCard, styles.revenueGlow]}>
        <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.mintGlow }]}>
          +${formatCurrency(totalRevenue)}
        </Text>
      </View>

      {/* TOTAL EXPENSES */}
      <View style={[styles.kpiCard, styles.expenseGlow]}>
        <Text style={styles.kpiLabel}>TOTAL EXPENSES</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.pinkGlow }]}>
          -${formatCurrency(Math.abs(totalExpenses || 0))}
        </Text>
      </View>

      {/* NET BALANCE */}
      <View style={[styles.kpiCard, styles.balanceGlow]}>
        <Text style={styles.kpiLabel}>NET BALANCE</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.cyanGlow }]}>
          ${formatCurrency(netBalance)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  revenueGlow: {
    borderColor: theme.colors.mintGlowBorder,
    shadowColor: theme.colors.mintGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  expenseGlow: {
    borderColor: theme.colors.pinkGlowBorder,
    shadowColor: theme.colors.pinkGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  balanceGlow: {
    borderColor: theme.colors.cyanGlowBorder,
    shadowColor: theme.colors.cyanGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
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