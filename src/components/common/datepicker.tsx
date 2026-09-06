import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../theme/theme';

interface DatePickerDropdownProps {
  visible: boolean;
  currentDate: string; // Expected format: YYYY-MM-DD
  onSelectDate: (date: string) => void;
  onClose: () => void;
  containerStyle?: ViewStyle; // Allows the parent to dictate absolute positioning
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  visible,
  currentDate,
  onSelectDate,
  onClose,
  containerStyle,
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Sync internal calendar view with the provided date string when opened
  useEffect(() => {
    if (visible && currentDate) {
      const [year, month] = currentDate.split('-');
      if (year && month) {
        setSelectedYear(parseInt(year, 10));
        setSelectedMonth(parseInt(month, 10) - 1);
      }
    }
  }, [visible, currentDate]);

  if (!visible) return null;

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onSelectDate(`${selectedYear}-${formattedMonth}-${formattedDay}`);
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
    <View style={[styles.calendarFlyout, containerStyle]}>
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekdaysRow}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <Text key={d} style={styles.weekdayText}>{d}</Text>
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
          const isSelected = currentDate === `${selectedYear}-${formattedM}-${formattedD}`;

          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayCell, isSelected && styles.selectedDayCell]}
              onPress={() => handleSelectDay(day)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarFlyout: {
    width: 270,
    backgroundColor: '#160E2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cyanGlowBorder || theme.colors.primary,
    padding: 12,
    elevation: 20,
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
    backgroundColor: theme.colors.cyanGlow || theme.colors.primary,
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