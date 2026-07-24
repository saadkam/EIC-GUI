import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// --- TYPES ---
export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

// --- INITIAL MOCK DATA ---
const INITIAL_TRANSACTIONS: LedgerEntry[] = [
  { id: '1', date: '2026-07-20', description: 'Batch #104 Caustic Soda Purchase', category: 'Raw Material', type: 'expense', amount: 1450.00 },
  { id: '2', date: '2026-07-21', description: 'Sale - Epoxy 128 500Kg', category: 'Finished Goods', type: 'income', amount: 3200.00 },
  { id: '3', date: '2026-07-22', description: 'Xylene purchase', category: 'Maintenance', type: 'expense', amount: 350.00 },
  { id: '4', date: '2026-07-23', description: 'Alkyd', category: 'Finished Goods', type: 'income', amount: 1850.00 },
  { id: '5', date: '2026-07-24', description: 'Phenol', category: 'Raw Material', type: 'expense', amount: 2100.00 },
];

export default function LedgerScreen() {
  const [transactions, setTransactions] = useState<LedgerEntry[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // --- FINANCIAL CALCULATIONS ---
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

  // --- FILTERED TRANSACTIONS ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  // --- HANDLERS ---
  const handleAddTransaction = () => {
    if (!description || !amount) return;

    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      category: category || 'General',
      type,
      amount: parseFloat(amount) || 0,
    };

    setTransactions([newEntry, ...transactions]);
    setIsAddModalOpen(false);
    setDescription('');
    setCategory('');
    setAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER & SUMMARY CARDS */}
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Financial Ledger</Text>
        
        <View style={styles.kpiContainer}>
          <View style={[styles.kpiCard, { borderLeftColor: '#00F5A0' }]}>
            <Text style={styles.kpiLabel}>Total Revenue</Text>
            <Text style={[styles.kpiValue, { color: '#00F5A0' }]}>
              +Rs.{summary.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#FF2E93' }]}>
            <Text style={styles.kpiLabel}>Total Expenses</Text>
            <Text style={[styles.kpiValue, { color: '#FF2E93' }]}>
              -Rs.{summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: summary.balance >= 0 ? '#38BDF8' : '#FF2E93' }]}>
            <Text style={styles.kpiLabel}>Net Balance</Text>
            <Text style={[styles.kpiValue, { color: summary.balance >= 0 ? '#38BDF8' : '#FF2E93' }]}>
              Rs.{summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      {/* FILTER & ACTIONS BAR */}
      <View style={styles.actionsBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by description or category..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterGroup}>
          {(['all', 'income', 'expense'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, filterType === t && styles.activeFilterChip]}
              onPress={() => setFilterType(t)}
            >
              <Text style={[styles.filterChipText, filterType === t && styles.activeFilterText]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setIsAddModalOpen(true)}>
          <Text style={styles.addBtnText}>+ Log Entry</Text>
        </TouchableOpacity>
      </View>

      {/* DATA GRID TABLE */}
      <View style={styles.gridContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Date</Text>
          <Text style={[styles.headerCell, { flex: 3 }]}>Description</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
          <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
        </View>

        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.cellText, { flex: 1.2, color: '#94A3B8' }]}>{item.date}</Text>
              <Text style={[styles.cellText, { flex: 3, fontWeight: '600' }]} numberOfLines={1}>
                {item.description}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text
                style={[
                  styles.cellText,
                  {
                    flex: 1.5,
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: item.type === 'income' ? '#00F5A0' : '#FF2E93',
                  },
                ]}
              >
                {item.type === 'income' ? '+' : '-'}Rs.{item.amount.toFixed(2)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No ledger records found.</Text>
            </View>
          }
        />
      </View>

      {/* NEW ENTRY MODAL */}
      <Modal visible={isAddModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Ledger Entry</Text>

            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'expense' && { backgroundColor: '#FF2E93' }]}
                onPress={() => setType('expense')}
              >
                <Text style={styles.typeBtnText}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === 'income' && { backgroundColor: '#00F5A0' }]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.typeBtnText, type === 'income' && { color: '#0F172A' }]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Raw Solvent Purchase"
              placeholderTextColor="#64748B"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Raw Material, Utilities"
              placeholderTextColor="#64748B"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.fieldLabel}>Amount (Rs.)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0.00"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#334155' }]}
                onPress={() => setIsAddModalOpen(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#00F5A0' }]}
                onPress={handleAddTransaction}
              >
                <Text style={[styles.modalBtnText, { color: '#0F172A' }]}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- STYLES (Neon Cyber Slate Theme) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#180227', // Base dark plum background
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#220B38',
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
  actionsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 2,
    backgroundColor: '#220B38',
    color: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3B1754',
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: '#220B38',
    borderRadius: 8,
    padding: 3,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeFilterChip: {
    backgroundColor: '#3B1754',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
  },
  addBtn: {
    backgroundColor: '#00F5A0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: '#220B38',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3B1754',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2E0F4B',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3B1754',
  },
  headerCell: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C0E43',
  },
  cellText: {
    color: '#F1F5F9',
    fontSize: 14,
  },
  categoryBadge: {
    flex: 2,
    backgroundColor: '#33124D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 480,
    backgroundColor: '#220B38',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3B1754',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  typeBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#180227',
    color: '#FFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3B1754',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});