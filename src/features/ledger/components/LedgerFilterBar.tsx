import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedFilter: 'all' | 'income' | 'expense';
  onSelectFilter: (filter: 'all' | 'income' | 'expense') => void;
  onOpenAddModal: () => void;
}

export const LedgerFilterBar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onSelectFilter,
  onOpenAddModal,
}) => {
  return (
    <View style={styles.barContainer}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by description or category..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      <View style={styles.segmentContainer}>
        {(['all', 'income', 'expense'] as const).map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
              onPress={() => onSelectFilter(filter)}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.logButton} onPress={onOpenAddModal}>
        <Text style={styles.logButtonText}>+ Log Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchWrapper: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: theme.colors.glassInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    color: theme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: theme.typography.fontSizeMd,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  segmentTextActive: {
    color: theme.colors.textPrimary,
  },
  logButton: {
    backgroundColor: theme.colors.mintGlow,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: theme.colors.mintGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  logButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizeMd,
  },
});