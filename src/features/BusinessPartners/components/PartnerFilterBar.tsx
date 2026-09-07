import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../../theme/theme';
import { PartnerType } from '../../../types/navigation';

interface Props {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  filterType: PartnerType | 'All';
  onFilterChange: (type: PartnerType | 'All') => void;
}

const FILTER_OPTIONS: (PartnerType | 'All')[] = ['All', 'Customer', 'Supplier', 'Both'];

export const PartnerFilterBar = ({ searchQuery, onSearchChange, filterType, onFilterChange }: Props) => {
  return (
    <View style={styles.headerContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search company name..."
        placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((type) => (
          <TouchableOpacity 
            key={type}
            style={[styles.filterChip, filterType === type && styles.filterChipActive]}
            onPress={() => onFilterChange(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { paddingBottom: 24 },
  searchInput: {
    backgroundColor: 'rgba(15, 12, 29, 0.65)',
    color: '#F1F5F9',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.5)' },
  filterText: { color: '#CBD5E1', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  filterTextActive: { color: theme.colors?.cyanGlow || '#06B6D4' },
});