import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ChallanEntry } from '../types/challan';
import { theme } from '../theme/theme';

interface Props {
  challans: ChallanEntry[];
  onAddChallan: (entry: Omit<ChallanEntry, 'id'>) => void;
}

export const ChallanTable: React.FC<Props> = ({ challans, onAddChallan }) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayString());
  const [description, setDescription] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [category, setCategory] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');

  const handleAmountChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, '');
    if ((sanitized.match(/\./g) || []).length <= 1) {
      setAmount(sanitized);
    }
  };

  const handleAddRow = () => {
    if (!description.trim() || !amount.trim() || !to.trim() || !from.trim()) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddChallan({
      date: date.trim() || getTodayString(),
      description: description.trim(),
      to: to.trim(),
      from: from.trim(),
      category: category.trim() || 'General',
      purpose: purpose.trim(),
      amount: parsedAmount,
    });

    // Reset fields
    setDate(getTodayString());
    setDescription('');
    setTo('');
    setFrom('');
    setCategory('');
    setPurpose('');
    setAmount('');
  };

  return (
    <View style={styles.gridContainer}>
      {/* 1. TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Description</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>To</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>From</Text>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Category</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Purpose</Text>
        <Text style={[styles.headerCell, { flex: 1.2, textAlign: 'left' }]}>Amount</Text>
        <Text style={[styles.headerCell, { flex: 0.8, textAlign: 'center' }]}>Action</Text>
      </View>

      {/* 2. INLINE ENTRY ROW */}
      <View style={styles.entryRow}>
        <View style={{ flex: 1.2, paddingRight: 6 }}>
          <TextInput
            style={styles.inlineInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>
        <View style={{ flex: 2, paddingRight: 6 }}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Desc..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>
        <View style={{ flex: 1.5, paddingRight: 6 }}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Recipient..."
            placeholderTextColor={theme.colors.textMuted}
            value={to}
            onChangeText={setTo}
            multiline={true}
          />
        </View>
        <View style={{ flex: 1.5, paddingRight: 6 }}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Sender..."
            placeholderTextColor={theme.colors.textMuted}
            value={from}
            onChangeText={setFrom}
            multiline={true}
          />
        </View>
        <View style={{ flex: 1.2, paddingRight: 6 }}>
          <TextInput
            style={styles.inlineInput}
            placeholder="Category"
            placeholderTextColor={theme.colors.textMuted}
            value={category}
            onChangeText={setCategory}
          />
        </View>
        <View style={{ flex: 2, paddingRight: 6 }}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Purpose..."
            placeholderTextColor={theme.colors.textMuted}
            value={purpose}
            onChangeText={setPurpose}
            multiline={true}
          />
        </View>
        <View style={{ flex: 1.2, paddingRight: 6 }}>
          <TextInput
            style={styles.inlineInput}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={handleAmountChange}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* 3. CHALLAN LIST */}
      <FlatList
        data={challans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cellText, { flex: 1.2, color: theme.colors.textSecondary }]}>{item.date}</Text>
            <Text style={[styles.cellText, { flex: 2, fontWeight: '600' }]}>{item.description}</Text>
            <Text style={[styles.cellText, { flex: 1.5 }]}>{item.to}</Text>
            <Text style={[styles.cellText, { flex: 1.5 }]}>{item.from}</Text>
            
            <View style={{ flex: 1.2, paddingRight: 6 }}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            <Text style={[styles.cellText, { flex: 2, color: theme.colors.textSecondary }]}>{item.purpose}</Text>
            
            <Text style={[styles.cellText, styles.amountText]}>
              ${item.amount.toFixed(2)}
            </Text>
            <View style={{ flex: 0.8 }} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No payment challans logged.</Text>
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHeader,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerCell: {
    color: theme.colors.accentPurple,
    fontSize: theme.typography.fontSizeMd,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  inlineInput: {
    backgroundColor: theme.colors.glassInput,
    color: theme.colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  multilineInput: {
    minHeight: 36,
    maxHeight: 70,
    textAlignVertical: 'top',
  },
  addButton: {
    flex: 0.8,
    backgroundColor: theme.colors.cyanGlow,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.cyanGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rowBorder,
  },
  cellText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    paddingRight: 6,
  },
  amountText: {
    flex: 1.2,
    textAlign: 'left',
    fontWeight: 'bold',
    color: theme.colors.mintGlow,
    fontVariant: ['tabular-nums'],
  },
  categoryBadge: {
    backgroundColor: theme.colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.badgeBorder,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
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