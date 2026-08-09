import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { LedgerEntry } from '../../../types/ledger';
import { theme } from '../../../theme/theme';

interface Props {
  transactions: LedgerEntry[];
  onAddTransaction?: (entry: Omit<LedgerEntry, 'id'>) => void;
}

export const LedgerTable: React.FC<Props> = ({ transactions, onAddTransaction }) => {
  // Local state for the inline quick-entry row
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddRow = () => {
    if (!description.trim() || !amount.trim()) return;

    if (onAddTransaction) {
      onAddTransaction({
        date: new Date().toISOString().split('T')[0],
        description: description.trim(),
        category: category.trim() || 'General',
        amount: parseFloat(amount) || 0,
        type: 'expense',
      });
    }

    // Clear inputs after submit
    setDescription('');
    setCategory('');
    setAmount('');
  };

  return (
    <View style={styles.gridContainer}>
      {/* 1. TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Description</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
        <Text style={[styles.headerCell, { flex: 0.8, textAlign: 'center' }]}>Action</Text>
      </View>

      {/* 2. INLINE COLUMN-WISE ENTRY ROW */}
      <View style={styles.entryRow}>
        <Text style={[styles.cellText, { flex: 1.2, color: theme.colors.textMuted }]}>Today</Text>
        
        <View style={{ flex: 3, paddingRight: 8 }}>
          <TextInput
            style={styles.inlineInput}
            placeholder="Add Description..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={{ flex: 2, paddingRight: 8 }}>
          <TextInput
            style={styles.inlineInput}
            placeholder="Category..."
            placeholderTextColor={theme.colors.textMuted}
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={{ flex: 1.5, paddingRight: 6 }}>
          <TextInput
            style={[styles.inlineInput, { textAlign: 'right' }]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            onSubmitEditing={handleAddRow}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* 3. TRANSACTION LIST */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cellText, { flex: 1.2, color: theme.colors.textSecondary }]}>{item.date}</Text>
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
                  color: item.type === 'income' ? theme.colors.accentGreen : theme.colors.accentPink,
                },
              ]}
            >
              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <View style={{ flex: 0.8 }} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No ledger records found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHeader,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerCell: {
    color: theme.colors.accentPurple,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1E1530',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  inlineInput: {
    backgroundColor: '#12041D',
    color: '#F1F5F9',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  amountInput: {
  textAlign: 'right',
  paddingLeft: 4,     // Reduced left padding so long numbers aren't clipped
  paddingRight: 8,    // Crisp right alignment
  },
  addButton: {
    flex: 0.8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rowBorder,
  },
  cellText: {
    color: '#F1F5F9',
    fontSize: 14,
  },
  categoryBadge: {
    flex: 2,
    backgroundColor: theme.colors.badgeBg,
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
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});