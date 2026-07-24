import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: 'all' | 'income' | 'expense';
  onFilterChange: (type: 'all' | 'income' | 'expense') => void;
  onOpenAddModal: () => void;
}

export const LedgerFilterBar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onOpenAddModal,
}) => {
  return (
    <View style={styles.actionsBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by description or category..."
        placeholderTextColor={theme.colors.textMuted}
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.filterGroup}>
        {(['all', 'income', 'expense'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterChip, filterType === t && styles.activeFilterChip]}
            onPress={() => onFilterChange(t)}
          >
            <Text style={[styles.filterChipText, filterType === t && styles.activeFilterText]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={onOpenAddModal}>
        <Text style={styles.addBtnText}>+ Log Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 2,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 3,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.surfaceBorder,
  },
  filterChipText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: theme.colors.textPrimary,
  },
  addBtn: {
    backgroundColor: theme.colors.accentGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 14,
  },
});