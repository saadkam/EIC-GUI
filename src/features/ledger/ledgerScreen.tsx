import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { LedgerEntry } from '../../types/ledger';
import { theme } from '../../theme/theme';
import { INITIAL_TRANSACTIONS } from './data/mockLedgerData';
import { LedgerKPICards } from './components/LedgerKPICards';
import { LedgerFilterBar } from './components/LedgerFilterBar';
import { LedgerTable } from './components/LedgerTable';
import { AddTransactionModal } from './components/AddTransactionModel';

export default function LedgerScreen() {
  const [transactions, setTransactions] = useState<LedgerEntry[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Financial Summary Calculation
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.income += t.amount;
          acc.balance += t.amount;
        } else {
          acc.expense += t.amount;
          acc.balance -= t.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  // Add Handler
  const handleAddTransaction = (newEntryData: Omit<LedgerEntry, 'id' | 'date'>) => {
    const newEntry: LedgerEntry = {
      ...newEntryData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newEntry, ...transactions]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Financial Ledger</Text>
        <LedgerKPICards summary={summary} />
      </View>

      <LedgerFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <LedgerTable transactions={filteredTransactions} />

      <AddTransactionModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
});