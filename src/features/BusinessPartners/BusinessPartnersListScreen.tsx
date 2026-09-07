import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';
import { BusinessPartner, PartnerType } from '../../types/navigation';
import { theme } from '../../theme/theme';
import { PartnerFilterBar } from './components/PartnerFilterBar';

interface Props {
  // Custom function to handle moving to the form screen, optionally passing a partner to edit
  onNavigateToForm: (partner?: BusinessPartner) => void; 
}

const INITIAL_PARTNERS: BusinessPartner[] = [
  { id: '1', name: 'Alpha Resins Ltd', type: 'Customer', phone: '0300-1234567', ntn: '1234567-8' },
  { id: '2', name: 'Global Chemicals Inc', type: 'Supplier', phone: '021-9876543', ntn: '9876543-2' },
];

export default function BusinessPartnersListScreen({ onNavigateToForm }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<PartnerType | 'All'>('All');

  const filteredPartners = useMemo(() => {
    return INITIAL_PARTNERS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'All' || p.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType]);

  const renderPartnerCard: ListRenderItem<BusinessPartner> = ({ item }) => (
    <TouchableOpacity 
      style={styles.glassCard} 
      activeOpacity={0.7}
      onPress={() => onNavigateToForm(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.partnerName}>{item.name}</Text>
        <View style={[styles.badge, item.type === 'Supplier' ? styles.badgeSupplier : styles.badgeCustomer]}>
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>NTN:</Text>
        <Text style={styles.detailText}>{item.ntn || 'N/A'}</Text>
        <Text style={styles.detailLabel}> | PHONE:</Text>
        <Text style={styles.detailText}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Business Directory</Text>
        
        <PartnerFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        <FlatList
          data={filteredPartners}
          keyExtractor={item => item.id}
          renderItem={renderPartnerCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => onNavigateToForm()}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, padding: 32 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 24 },
  listContent: { paddingBottom: 100, gap: 16 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  partnerName: { color: '#F1F5F9', fontSize: 18, fontWeight: '900', letterSpacing: 1, flex: 1 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1 },
  badgeSupplier: { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: 'rgba(244, 67, 54, 0.3)' },
  badgeCustomer: { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 16 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  detailLabel: { color: '#CBD5E1', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginRight: 6 },
  detailText: { color: '#F1F5F9', fontSize: 13, marginRight: 16 },
  fab: {
    position: 'absolute', bottom: 40, right: 40,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: theme.colors?.cyanGlow || '#06B6D4',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: theme.colors?.cyanGlow || '#06B6D4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  fabIcon: { color: '#000', fontSize: 32, fontWeight: '400', marginTop: -4 },
});