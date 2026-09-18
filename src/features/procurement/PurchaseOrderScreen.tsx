import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementEntry } from './components/ProcurementTable';

interface Props {
  initialData: ProcurementEntry | null;
  onBack: () => void;
}

export const PurchaseOrderScreen: React.FC<Props> = ({ initialData, onBack }) => {
  const [vendor, setVendor] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [items, setItems] = useState([{ id: '1', material: '', qty: '', price: '' }]);

  useEffect(() => {
    if (initialData) {
      setVendor(initialData.vendor);
      setExpectedDate(initialData.date);
      setItems([{ id: '1', material: 'Populated Material', qty: '1', price: initialData.amount.toString() }]);
    }
  }, [initialData]);

  const updateItem = (id: string, field: 'material' | 'qty' | 'price', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back to List</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{initialData ? `Edit ${initialData.id}` : 'Draft Purchase Order'}</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vendor / Supplier</Text>
              <TextInput style={styles.input} value={vendor} onChangeText={setVendor} placeholderTextColor={theme.colors.textMuted} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Delivery (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} value={expectedDate} onChangeText={setExpectedDate} placeholderTextColor={theme.colors.textMuted} />
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Requested Materials</Text>

          {items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                {index === 0 && <Text style={styles.label}>Material Name</Text>}
                <TextInput style={styles.input} value={item.material} onChangeText={(val) => updateItem(item.id, 'material', val)} placeholderTextColor={theme.colors.textMuted} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Qty</Text>}
                <TextInput style={styles.input} keyboardType="numeric" value={item.qty} onChangeText={(val) => updateItem(item.id, 'qty', val)} placeholderTextColor={theme.colors.textMuted} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Unit Price</Text>}
                <TextInput style={styles.input} keyboardType="numeric" value={item.price} onChangeText={(val) => updateItem(item.id, 'price', val)} placeholderTextColor={theme.colors.textMuted} />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addRowBtn} onPress={() => setItems([...items, { id: Date.now().toString(), material: '', qty: '', price: '' }])}>
            <Text style={styles.addRowText}>+ Add Material</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>Rs. {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={onBack}>
              <Text style={styles.submitBtnText}>{initialData ? 'Update Document' : 'Issue PO'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 900, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 32 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  inputGroup: { flex: 1, gap: 8 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: 14 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  sectionTitle: { color: theme.colors.cyanGlow, fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  addRowBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', marginTop: 8 },
  addRowText: { color: theme.colors.cyanGlow, fontWeight: '700', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.colors.surfaceBorder },
  totalLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: theme.colors.mintGlow, fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  submitBtn: { backgroundColor: theme.colors.cyanGlow, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});