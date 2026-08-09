import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FinancialSummary } from '../../../types/ledger';
import { theme } from '../../../theme/theme';

interface Props {
  summary: FinancialSummary;
}

export const LedgerKPICards: React.FC<Props> = ({ summary }) => {
  return (
    <View style={styles.kpiContainer}>
      <View style={[styles.kpiCard, { borderLeftColor: theme.colors.accentGreen }]}>
        <Text style={styles.kpiLabel}>Total Revenue</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.accentGreen }]}>
          +${summary.income.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={[styles.kpiCard, { borderLeftColor: theme.colors.accentPink }]}>
        <Text style={styles.kpiLabel}>Total Expenses</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.accentPink }]}>
          -${summary.expense.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={[styles.kpiCard, { borderLeftColor: summary.balance >= 0 ? theme.colors.accentBlue : theme.colors.accentPink }]}>
        <Text style={styles.kpiLabel}>Net Balance</Text>
        <Text style={[styles.kpiValue, { color: summary.balance >= 0 ? theme.colors.accentBlue : theme.colors.accentPink }]}>
          ${summary.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});