import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { CostingTable, FormulationItem } from './CostingTable';
import { CostingReportScreen } from './CostingReportScreen';

export default function CostingScreen() {
  const [currentView, setCurrentView] = useState<'formulator' | 'report'>('formulator');
  
  // Formulation State
  const [items, setItems] = useState<FormulationItem[]>([]);
  const [yieldPercentage, setYieldPercentage] = useState<string>('85'); // Defaulting to a realistic yield %
  
  // Input Form State
  const [newMaterial, setNewMaterial] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');

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

  const parsedYieldPct = parseFloat(yieldPercentage) || 0;
  const actualOutputQty = totalInputQty * (parsedYieldPct / 100);
  const finalUnitCost = actualOutputQty > 0 ? totalCost / actualOutputQty : 0;

  const handleAddItem = () => {
    if (!newMaterial || !newQty || !newPrice) return;
    
    const newItem: FormulationItem = {
      id: Date.now().toString(),
      material: newMaterial,
      qty: parseFloat(newQty) || 0,
      unitPrice: parseFloat(newPrice) || 0,
    };
    
    setItems([...items, newItem]);
    setNewMaterial('');
    setNewQty('');
    setNewPrice('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (currentView === 'report') {
    return (
      <CostingReportScreen 
        data={items} 
        yieldPercentage={parsedYieldPct}
        actualOutputQty={actualOutputQty}
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
          <Text style={styles.metricLabel}>TOTAL BATCH COST</Text>
          <Text style={[styles.metricValue, { color: theme.colors.pinkGlow }]}>
            Rs. {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>PRODUCTION YIELD (%)</Text>
          <TextInput
            style={styles.yieldInput}
            value={yieldPercentage}
            onChangeText={setYieldPercentage}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={theme.colors.textMuted}
          />
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
            style={styles.input} 
            placeholder="e.g. Phenol" 
            placeholderTextColor={theme.colors.textMuted}
            value={newMaterial}
            onChangeText={setNewMaterial}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Qty</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0.00" 
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textMuted}
            value={newQty}
            onChangeText={setNewQty}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Unit Price</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Rs. 0.00" 
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textMuted}
            value={newPrice}
            onChangeText={setNewPrice}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <CostingTable data={items} totalQty={totalInputQty} onRemoveItem={handleRemoveItem} />
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
  
  yieldInput: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: 20, fontWeight: 'bold' },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingBottom: 20 },
  inputGroup: { flexDirection: 'column' },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', paddingBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 14, fontSize: 14 },
  
  addBtn: { backgroundColor: 'rgba(6, 182, 212, 0.1)', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8 },
  addBtnText: { color: theme.colors.cyanGlow, fontWeight: 'bold', fontSize: 14 }
});