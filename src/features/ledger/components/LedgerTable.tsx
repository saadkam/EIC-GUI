import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
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

  // Dropdown Calendar State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Input Sanitization (Allows unlimited digits and 1 decimal point)
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
    setIsDatePickerOpen(false);
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
        <Text style={[styles.headerCell, { flex: 1.3 }]}>DATE</Text>
        <Text style={[styles.headerCell, { flex: 3.2 }]}>DESCRIPTION</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>CATEGORY</Text>
        <Text style={[styles.headerCell, { flex: 1.6, textAlign: 'left' }]}>AMOUNT</Text>
        <Text style={[styles.headerCell, { flex: 0.8, textAlign: 'center' }]}>ACTION</Text>
      </View>

      {/* 2. INLINE ENTRY ROW */}
      <View style={styles.entryRow}>
        {/* DATE SELECTOR WITH FLYOUT */}
        <View style={styles.columnWrapperDate}>
          <TouchableOpacity
            style={[styles.inlineInput, styles.datePickerButton]}
            onPress={() => setIsDatePickerOpen(!isDatePickerOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.datePickerText}>{date}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {/* FLYOUT CALENDAR DROPDOWN */}
          {isDatePickerOpen && (
            <View style={styles.calendarFlyout}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                  <Text style={styles.navButtonText}>◀</Text>
                </TouchableOpacity>

                <Text style={styles.calendarTitle}>
                  {monthNames[selectedMonth]} {selectedYear}
                </Text>

                <View style={styles.headerRightControls}>
                  <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                    <Text style={styles.navButtonText}>▶</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsDatePickerOpen(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
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
          )}
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

        {/* UNCONSTRAINED AMOUNT INPUT */}
        <View style={styles.columnWrapperAmount}>
          <TextInput
            style={[styles.inlineInput, styles.amountInput]}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            onSubmitEditing={handleAddRow}
            returnKeyType="done"
            multiline={false}
          />
        </View>

        {/* ACTION ADD BUTTON */}
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
            <Text style={[styles.cellText, { flex: 3.2, fontWeight: '600', paddingRight: 8 }]}>
              {item.description}
            </Text>
            <View style={styles.categoryBadgeWrapper}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.cellText,
                {
                  flex: 1.6,
                  textAlign: 'left',
                  paddingLeft: 4,
                  fontWeight: 'bold',
                  fontVariant: ['tabular-nums'],
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
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    zIndex: 1,
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
    letterSpacing: 0.6,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    zIndex: 100,
  },
  columnWrapperDate: {
    flex: 1.3,
    marginRight: 8,
    position: 'relative',
    zIndex: 101,
  },
  columnWrapperDescription: {
    flex: 3.2,
    marginRight: 8,
  },
  columnWrapperCategory: {
    flex: 2,
    marginRight: 8,
  },
  columnWrapperAmount: {
    flex: 1.6,
    marginRight: 8,
  },
  inlineInput: {
    backgroundColor: theme.colors.glassInput,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeMd,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    width: '100%',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  datePickerText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeMd,
  },
  calendarIcon: {
    fontSize: 12,
  },
  multilineInput: {
    minHeight: 40,
    paddingTop: 8,
    paddingBottom: 8,
  },
  amountInput: {
    textAlign: 'left',
    height: 40,
  },
  addButton: {
    flex: 0.8,
    backgroundColor: theme.colors.cyanGlow,
    height: 40,
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
  },
  categoryBadgeWrapper: {
    flex: 2,
    paddingRight: 8,
  },
  categoryBadge: {
    backgroundColor: theme.colors.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.badgeBorder,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: theme.colors.textSecondary,
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
  calendarFlyout: {
    position: 'absolute',
    top: 45,
    left: 0,
    width: 270,
    backgroundColor: '#160E2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cyanGlowBorder,
    padding: 12,
    elevation: 20,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  navButton: {
    padding: 4,
  },
  navButtonText: {
    color: theme.colors.accentPurple,
    fontSize: 12,
  },
  closeButton: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  closeButtonText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
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
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
  },
  selectedDayCell: {
    backgroundColor: theme.colors.cyanGlow,
    borderRadius: 6,
  },
  dayText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
  },
  selectedDayText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});