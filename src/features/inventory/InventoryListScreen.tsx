import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';
import { theme } from '../../theme/theme';
import { InventoryItem, InventoryType } from './InventoryModule';

interface Props {
  onNavigateToForm: (item?: InventoryItem) => void;
}

const INITIAL_ITEMS: InventoryItem[] = [
  { id: '1', sku: 'RM-SOY-001', name: 'Whole Soybean Oil', nameUrdu: 'سویابین کا تیل', type: 'Raw Material', hsCode: '1507.1000', stock: '5000', uom: 'Liters', cost: '1.25' },
  { id: '2', sku: 'FG-PET-100', name: 'Textile-Grade Polyester Chips', nameUrdu: 'پالئیےسٹر چپس', type: 'Finished Good', hsCode: '3907.6100', stock: '1200', uom: 'Kg', cost: '3.50' },
];

export default function InventoryListScreen({ onNavigateToForm }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<InventoryType | 'All'>('All');

  const filteredItems = useMemo(() => {
    return INITIAL_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'All' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType]);

  const renderItemCard: ListRenderItem<InventoryItem> = ({ item }) => (
    <TouchableOpacity 
      style={styles.glassCard} 
      activeOpacity={0.7}
      onPress={() => onNavigateToForm(item)}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemUrdu}>{item.nameUrdu}</Text>
        </View>
        <View style={styles.stockContainer}>
          <Text style={styles.stockNumber}>{item.stock}</Text>
          <Text style={styles.stockUom}>{item.uom}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsRow}>
        <View style={[styles.badge, item.type === 'Raw Material' ? styles.badgeRaw : item.type === 'Finished Good' ? styles.badgeFinished : styles.badgeConsumable]}>
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
        <Text style={styles.detailLabel}> SKU:</Text>
        <Text style={styles.detailText}>{item.sku}</Text>
        <Text style={styles.detailLabel}> | HS CODE:</Text>
        <Text style={styles.detailText}>{item.hsCode || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Master Inventory</Text>
        
        {/* Inline Filter Bar */}
        <View style={styles.headerContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or SKU..."
            placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterRow}>
            {(['All', 'Raw Material', 'Finished Good', 'Consumable'] as const).map(type => (
              <TouchableOpacity 
                key={type}
                style={[styles.filterChip, filterType === type && styles.filterChipActive]}
                onPress={() => setFilterType(type as InventoryType | 'All')}
              >
                <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItemCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.fab} onPress={() => onNavigateToForm()}>
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
  headerContainer: { paddingBottom: 24 },
  searchInput: { backgroundColor: 'rgba(15, 12, 29, 0.65)', color: '#F1F5F9', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  filterChipActive: { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.5)' },
  filterText: { color: '#CBD5E1', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  filterTextActive: { color: theme.colors?.cyanGlow || '#06B6D4' },
  listContent: { paddingBottom: 100, gap: 16 },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', padding: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { color: '#F1F5F9', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  itemUrdu: { color: theme.colors?.textMuted || '#94A3B8', fontSize: 16, marginTop: 4, fontFamily: 'sans-serif' },
  stockContainer: { alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  stockNumber: { color: theme.colors?.cyanGlow || '#06B6D4', fontSize: 20, fontWeight: '900' },
  stockUom: { color: '#CBD5E1', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1, marginRight: 12 },
  badgeRaw: { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: 'rgba(244, 67, 54, 0.3)' },
  badgeFinished: { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' },
  badgeConsumable: { backgroundColor: 'rgba(156, 39, 176, 0.1)', borderColor: 'rgba(156, 39, 176, 0.3)' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 16 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  detailLabel: { color: '#CBD5E1', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginRight: 6 },
  detailText: { color: '#F1F5F9', fontSize: 13, marginRight: 16 },
  fab: { position: 'absolute', bottom: 40, right: 40, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors?.cyanGlow || '#06B6D4', justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors?.cyanGlow || '#06B6D4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  fabIcon: { color: '#000', fontSize: 32, fontWeight: '400', marginTop: -4 },
});