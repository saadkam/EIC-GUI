import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { CostingTable, FormulationItem } from './CostingTable';
import { CostingReportScreen } from './CostingReportScreen';

export default function CostingScreen() {
  const [currentView, setCurrentView] = useState<'formulator' | 'report'>('formulator');
  
  // Formulation State
  const [items, setItems] = useState<FormulationItem[]>([]);
  const [yieldWeight, setYieldWeight] = useState<string>(''); 
  
  // Input Form State
  const [newMaterial, setNewMaterial] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Refs for direct native UI manipulation
  const materialInputRef = useRef<TextInput>(null);
  const qtyInputRef = useRef<TextInput>(null);
  const priceInputRef = useRef<TextInput>(null);

  // Calculations
  const { totalInputQty, totalCost } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalInputQty += item.qty;
        acc.totalCost += item.qty * item.unitPrice;
        return acc;
      },
      { totalInputQty: 0, totalCost: 0 }
    );
  }, [items]);

  const parsedYieldWeight = parseFloat(yieldWeight) || 0;
  const effectiveYield = parsedYieldWeight > 0 ? parsedYieldWeight : totalInputQty;
  const finalUnitCost = effectiveYield > 0 ? totalCost / effectiveYield : 0;

  const handleAddItem = () => {
    if (!newMaterial.trim()) return;
    
    const newItem: FormulationItem = {
      id: Date.now().toString(),
      material: newMaterial.trim(),
      qty: parseFloat(newQty) || 0, 
      unitPrice: parseFloat(newPrice) || 0, 
    };
    
    setItems([...items, newItem]);
    
    // 1. Reset React State
    setNewMaterial('');
    setNewQty('');
    setNewPrice('');

    // 2. Force Native UI to clear (Bypasses the focus bug)
    materialInputRef.current?.clear();
    qtyInputRef.current?.clear();
    priceInputRef.current?.clear();
    
    // Optional: Send focus back to the first input for fast data entry
    materialInputRef.current?.focus();
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (currentView === 'report') {
    return (
      <CostingReportScreen 
        data={items} 
        yieldWeight={parsedYieldWeight}
        totalCost={totalCost}
        totalInputQty={totalInputQty}
        finalUnitCost={finalUnitCost}
        onBack={() => setCurrentView('formulator')} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.screenTitle}>Product Costing & Yield</Text>
          <Text style={styles.subtitle}>Formulation Economics Engine</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => setCurrentView('report')}
          disabled={items.length === 0}
        >
          <Text style={styles.actionBtnText}>Generate Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topMetricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TOTAL BATCH SIZE</Text>
          <Text style={[styles.metricValue, { color: theme.colors.cyanGlow }]}>
            {totalInputQty.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TOTAL BATCH COST</Text>
          <Text style={[styles.metricValue, { color: theme.colors.pinkGlow }]}>
            Rs. {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>FINAL UNIT COST</Text>
          <Text style={[styles.metricValue, { color: theme.colors.mintGlow }]}>
            Rs. {finalUnitCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 2 }]}>
          <Text style={styles.label}>Material</Text>
          <TextInput 
            ref={materialInputRef}
            style={styles.input} 
            placeholder="e.g. Phenol" 
            placeholderTextColor={theme.colors.textMuted}
            cursorColor={theme.colors.cyanGlow}
            selectionColor="rgba(6, 182, 212, 0.3)"
            value={newMaterial}
            onChangeText={setNewMaterial}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Qty</Text>
          <TextInput 
            ref={qtyInputRef}
            style={styles.input} 
            placeholder="0.00" 
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textMuted}
            cursorColor={theme.colors.cyanGlow}
            selectionColor="rgba(6, 182, 212, 0.3)"
            value={newQty}
            onChangeText={setNewQty}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Unit Price</Text>
          <TextInput 
            ref={priceInputRef}
            style={styles.input} 
            placeholder="Rs. 0.00" 
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textMuted}
            cursorColor={theme.colors.cyanGlow}
            selectionColor="rgba(6, 182, 212, 0.3)"
            value={newPrice}
            onChangeText={setNewPrice}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <CostingTable data={items} totalQty={totalInputQty} onRemoveItem={handleRemoveItem} />

      <View style={styles.footerContainer}>
        <Text style={styles.footerLabel}>ACTUAL YIELD (WEIGHT)</Text>
        <TextInput
          style={styles.yieldInput}
          value={yieldWeight}
          onChangeText={setYieldWeight}
          keyboardType="numeric"
          placeholder={totalInputQty > 0 ? totalInputQty.toString() : "0.00"}
          placeholderTextColor={theme.colors.textMuted}
          cursorColor={theme.colors.cyanGlow}
          selectionColor="rgba(6, 182, 212, 0.3)"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 },
  screenTitle: { fontSize: theme.typography.fontSizeXl, fontWeight: 'bold', color: theme.colors.textPrimary },
  subtitle: { fontSize: theme.typography.fontSizeMd, color: theme.colors.textMuted, paddingTop: 4 },
  
  actionBtn: { backgroundColor: theme.colors.cyanGlow, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  actionBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },

  topMetricsGrid: { flexDirection: 'row', gap: 16, paddingBottom: 20 },
  metricCard: { flex: 1, backgroundColor: theme.colors.surfaceHeader, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  metricLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted, paddingBottom: 8, letterSpacing: 0.5 },
  metricValue: { fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingBottom: 20 },
  inputGroup: { flexDirection: 'column' },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', paddingBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 14, fontSize: 14 },
  
  addBtn: { backgroundColor: 'rgba(6, 182, 212, 0.1)', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8 },
  addBtnText: { color: theme.colors.cyanGlow, fontWeight: 'bold', fontSize: 14 },

  footerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 20, gap: 16 },
  footerLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, letterSpacing: 0.5 },
  yieldInput: { backgroundColor: theme.colors.surfaceHeader, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 14, fontSize: 18, fontWeight: 'bold', minWidth: 160, textAlign: 'left' }
});