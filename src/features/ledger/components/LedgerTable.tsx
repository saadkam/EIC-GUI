import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LedgerEntry } from '../../../types/ledger';
import { theme } from '../../../theme/theme';

interface Props {
  transactions: LedgerEntry[];
  onAddTransaction?: (entry: Omit<LedgerEntry, 'id'>) => void;
}

export const LedgerTable: React.FC<Props> = ({ transactions, onAddTransaction }) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayString());
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  // Pure-JS date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Input Sanitization
  const handleAmountChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, '');
    if ((sanitized.match(/\./g) || []).length <= 1) {
      setAmount(sanitized);
    }
  };

  const handleAddRow = () => {
    if (!description.trim() || !amount.trim()) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (onAddTransaction) {
      onAddTransaction({
        date: date.trim() || getTodayString(),
        description: description.trim(),
        category: category.trim() || 'General',
        amount: parsedAmount,
        type: 'expense',
      });
    }

    setDate(getTodayString());
    setDescription('');
    setCategory('');
    setAmount('');
  };

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setDate(`${selectedYear}-${formattedMonth}-${formattedDay}`);
    setIsDatePickerOpen(false);
  };

  const changeMonth = (offset: number) => {
    let newMonth = selectedMonth + offset;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <View style={styles.gridContainer}>
      {/* 1. TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.3 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Description</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
        <Text style={[styles.headerCell, { flex: 1.6, textAlign: 'left' }]}>Amount</Text>
        <Text style={[styles.headerCell, { flex: 0.8, textAlign: 'center' }]}>Action</Text>
      </View>

      {/* 2. INLINE ENTRY ROW */}
      <View style={styles.entryRow}>
        {/* DATE SELECTOR */}
        <View style={styles.columnWrapperDate}>
          <TouchableOpacity
            style={[styles.inlineInput, styles.datePickerButton]}
            onPress={() => setIsDatePickerOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.datePickerText}>{date}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* MULTI-LINE DESCRIPTION */}
        <View style={styles.columnWrapperDescription}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Add Description..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* MULTI-LINE CATEGORY */}
        <View style={styles.columnWrapperCategory}>
          <TextInput
            style={[styles.inlineInput, styles.multilineInput]}
            placeholder="Category..."
            placeholderTextColor={theme.colors.textMuted}
            value={category}
            onChangeText={setCategory}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* AMOUNT (LEFT ALIGNED WITH EXTRA INTERNAL PADDING) */}
        <View style={styles.columnWrapperAmount}>
          <TextInput
            style={[styles.inlineInput, styles.amountInput]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={handleAmountChange}
            onSubmitEditing={handleAddRow}
            returnKeyType="done"
            multiline={false}
          />
        </View>

        {/* ADD ACTION BUTTON */}
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
            <Text style={[styles.cellText, { flex: 1.3, color: theme.colors.textSecondary }]}>
              {item.date}
            </Text>
            <Text style={[styles.cellText, { flex: 3, fontWeight: '600', paddingRight: 10 }]}>
              {item.description}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text
              style={[
                styles.cellText,
                {
                  flex: 1.6,
                  textAlign: 'left',
                  paddingLeft: 4,
                  paddingRight: 10,
                  fontWeight: 'bold',
                  color:
                    item.type === 'income'
                      ? theme.colors.accentGreen
                      : theme.colors.accentPink,
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

      {/* 4. POPUP DATE PICKER MODAL */}
      <Modal
        visible={isDatePickerOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDatePickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsDatePickerOpen(false)}
        >
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                <Text style={styles.navButtonText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>
                {monthNames[selectedMonth]} {selectedYear}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                <Text style={styles.navButtonText}>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekdaysRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <Text key={d} style={styles.weekdayText}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {Array.from({ length: firstDayOfMonth(selectedYear, selectedMonth) }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCell} />
              ))}
              {Array.from({ length: daysInMonth(selectedYear, selectedMonth) }).map((_, i) => {
                const day = i + 1;
                const formattedM = String(selectedMonth + 1).padStart(2, '0');
                const formattedD = String(day).padStart(2, '0');
                const isSelected = date === `${selectedYear}-${formattedM}-${formattedD}`;

                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                    onPress={() => handleSelectDay(day)}
                  >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 16,
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
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1E1530',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  columnWrapperDate: {
    flex: 1.3,
    paddingRight: 10,
  },
  columnWrapperDescription: {
    flex: 3,
    paddingRight: 10,
  },
  columnWrapperCategory: {
    flex: 2,
    paddingRight: 10,
  },
  columnWrapperAmount: {
    flex: 1.6,
    paddingRight: 10,
  },
  inlineInput: {
    backgroundColor: '#12041D',
    color: '#F1F5F9',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  datePickerText: {
    color: '#F1F5F9',
    fontSize: 13,
  },
  calendarIcon: {
    fontSize: 12,
  },
  multilineInput: {
    minHeight: 40,
    maxHeight: 90,
  },
  amountInput: {
    textAlign: 'left',
    height: 40,
    paddingLeft: 12,
    paddingRight: 12,
  },
  addButton: {
    flex: 0.8,
    backgroundColor: theme.colors.primary,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
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
    color: '#F1F5F9',
    fontSize: 14,
  },
  categoryBadge: {
    flex: 2,
    backgroundColor: theme.colors.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginRight: 10,
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
  /* Modal Calendar */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: 290,
    backgroundColor: '#1E1530',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 16,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  navButton: {
    padding: 6,
  },
  navButtonText: {
    color: theme.colors.accentPurple,
    fontSize: 14,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekdayText: {
    width: 32,
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: 36,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  dayText: {
    color: '#F1F5F9',
    fontSize: 12,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});