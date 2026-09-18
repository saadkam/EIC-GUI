import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../theme/theme';
import { DatePickerDropdown } from './datepicker'; // Uses your original single-date version
import { CalendarDuotoneIcon } from './icons/MenuIcon'; 

export interface FilterAction {
  label: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
}

export type DateFilterType = 'all' | '1m' | '2m' | '3m' | '1y' | 'custom';

interface Props<T extends string> {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  actions?: FilterAction[];
  
  // Date Range
  dateFilter?: DateFilterType;
  onDateFilterChange?: (filter: DateFilterType) => void;
  startDate?: string;
  endDate?: string;
  onCustomRangeChange?: (start: string, end: string) => void;

  // Status Filter
  statusOptions?: string[];
  activeStatus?: string;
  onStatusChange?: (status: string) => void;

  // Print
  onPrintReport?: () => void;
}

export const GlobalFilterBar = <T extends string>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  tabs,
  activeTab,
  onTabChange,
  actions = [],
  dateFilter,
  onDateFilterChange,
  startDate = '',
  endDate = '',
  onCustomRangeChange,
  statusOptions = ['All', 'Paid', 'Unpaid', 'Pending'],
  activeStatus = 'All',
  onStatusChange,
  onPrintReport,
}: Props<T>) => {
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const dateTabs: { key: DateFilterType; label: string }[] = [
    { key: 'all', label: 'All Time' },
    { key: '1m', label: '1M' },
    { key: '2m', label: '2M' },
    { key: '3m', label: '3M' },
    { key: '1y', label: '1Y' },
  ];

  // Auto-calculate explicitly formatted date strings when a quick filter is pressed
  const handleQuickFilter = (key: DateFilterType) => {
    if (onDateFilterChange) onDateFilterChange(key);
    if (!onCustomRangeChange) return;

    if (key === 'all' || key === 'custom') {
      if (key === 'all') onCustomRangeChange('', '');
      return;
    }

    const end = new Date();
    const start = new Date();

    switch (key) {
      case '1m':
        start.setMonth(start.getMonth() - 1);
        break;
      case '2m':
        start.setMonth(start.getMonth() - 2);
        break;
      case '3m':
        start.setMonth(start.getMonth() - 3);
        break;
      case '1y':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    const format = (d: Date) => d.toISOString().split('T')[0];
    onCustomRangeChange(format(start), format(end));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        {onStatusChange && (
          <View style={styles.statusWrapper}>
            <TouchableOpacity 
              style={styles.dropdownBtn}
              onPress={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              <Text style={styles.dropdownBtnText}>Status: {activeStatus}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {isStatusDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {statusOptions.map(status => (
                  <TouchableOpacity 
                    key={status} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      onStatusChange(status);
                      setIsStatusDropdownOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, activeStatus === status && { color: theme.colors.cyanGlow }]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Quick Date Filters */}
        {onDateFilterChange && (
          <View style={styles.dateFilterGroup}>
            {dateTabs.map((tab) => {
              const isActive = dateFilter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.dateBtn, isActive && styles.dateBtnActive]}
                  onPress={() => handleQuickFilter(tab.key)}
                >
                  <Text style={[styles.dateText, isActive && styles.dateTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Dual Date Pickers */}
        {onCustomRangeChange && (
          <View style={styles.dualPickerGroup}>
            {/* Start Date */}
            <View style={styles.customDateWrapper}>
              <TouchableOpacity
                style={styles.dateFieldBtn}
                onPress={() => {
                  setIsStartPickerOpen(!isStartPickerOpen);
                  setIsEndPickerOpen(false);
                }}
              >
                <CalendarDuotoneIcon size={14} />
                <Text style={styles.dateFieldText}>
                  {startDate ? startDate : 'Start Date'}
                </Text>
              </TouchableOpacity>
              <DatePickerDropdown
                visible={isStartPickerOpen}
                currentDate={startDate || new Date().toISOString().split('T')[0]}
                onSelectDate={(date) => {
                  onCustomRangeChange(date, endDate);
                  if (onDateFilterChange) onDateFilterChange('custom');
                  setIsStartPickerOpen(false);
                }}
                onClose={() => setIsStartPickerOpen(false)}
                containerStyle={styles.flyoutCalendar}
              />
            </View>

            <Text style={styles.dateDivider}>to</Text>

            {/* End Date */}
            <View style={styles.customDateWrapper}>
              <TouchableOpacity
                style={styles.dateFieldBtn}
                onPress={() => {
                  setIsEndPickerOpen(!isEndPickerOpen);
                  setIsStartPickerOpen(false);
                }}
              >
                <CalendarDuotoneIcon size={14} />
                <Text style={styles.dateFieldText}>
                  {endDate ? endDate : 'End Date'}
                </Text>
              </TouchableOpacity>
              <DatePickerDropdown
                visible={isEndPickerOpen}
                currentDate={endDate || new Date().toISOString().split('T')[0]}
                onSelectDate={(date) => {
                  onCustomRangeChange(startDate, date);
                  if (onDateFilterChange) onDateFilterChange('custom');
                  setIsEndPickerOpen(false);
                }}
                onClose={() => setIsEndPickerOpen(false)}
                containerStyle={styles.flyoutCalendar}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.segmentContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                onPress={() => onTabChange(tab)}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionGroup}>
          {onPrintReport && (
            <TouchableOpacity style={styles.printButton} onPress={onPrintReport}>
              <Text style={styles.printButtonText}>🖨️ Print Report</Text>
            </TouchableOpacity>
          )}
          {actions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.actionButton, action.buttonStyle]} 
              onPress={action.onPress}
            >
              <Text style={styles.actionButtonText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, marginBottom: 20, zIndex: 101 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 102 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  searchWrapper: { flex: 1, minWidth: 200 },
  searchInput: { backgroundColor: theme.colors.glassInput, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, color: theme.colors.textPrimary, paddingHorizontal: 16, paddingVertical: 10, fontSize: theme.typography.fontSizeMd },
  statusWrapper: { position: 'relative', zIndex: 105 },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, paddingHorizontal: 16, paddingVertical: 10 },
  dropdownBtnText: { color: theme.colors.textPrimary, fontSize: theme.typography.fontSizeMd, fontWeight: '600', marginRight: 8 },
  dropdownArrow: { color: theme.colors.textMuted, fontSize: 10 },
  dropdownMenu: { position: 'absolute', top: 45, left: 0, width: 150, backgroundColor: '#17112B', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 8, elevation: 10, zIndex: 999 },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  dropdownItemText: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
  dateFilterGroup: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 3 },
  dateBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  dateBtnActive: { backgroundColor: theme.colors.cyanGlowBorder, borderWidth: 1, borderColor: theme.colors.cyanGlow },
  dateText: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted },
  dateTextActive: { color: '#000' },
  dualPickerGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, paddingHorizontal: 4, paddingVertical: 4 },
  customDateWrapper: { position: 'relative', zIndex: 105 },
  dateFieldBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.02)' },
  dateFieldText: { color: theme.colors.textPrimary, fontSize: 12, fontWeight: '600' },
  dateDivider: { color: theme.colors.textMuted, fontSize: 12, marginHorizontal: 4 },
  flyoutCalendar: { position: 'absolute', top: 40, right: 0, zIndex: 9999 },
  segmentContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 3 },
  segmentBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  segmentBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  segmentText: { fontSize: theme.typography.fontSizeMd, fontWeight: '600', color: theme.colors.textMuted },
  segmentTextActive: { color: theme.colors.textPrimary },
  actionGroup: { flexDirection: 'row', gap: 12 },
  actionButton: { backgroundColor: theme.colors.cyanGlow, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  actionButtonText: { color: '#000000', fontWeight: 'bold', fontSize: theme.typography.fontSizeMd },
  printButton: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  printButtonText: { color: theme.colors.textPrimary, fontWeight: 'bold', fontSize: theme.typography.fontSizeMd },
});