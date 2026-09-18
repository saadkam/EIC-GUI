import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { theme } from '../../../theme/theme';
import { ProcurementEntry } from './ProcurementTable';

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: ProcurementEntry | null;
}

export const PurchaseOrderModal: React.FC<Props> = ({ visible, onClose, initialData }) => {
  const [vendor, setVendor] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [items, setItems] = useState([{ id: '1', material: '', qty: '', price: '' }]);

  // Auto-populate form when editing an existing record
  useEffect(() => {
    if (visible && initialData) {
      setVendor(initialData.vendor);
      setExpectedDate(initialData.date);
      // Mocking line items based on the top-level amount for demonstration
      setItems([
        { 
          id: '1', 
          material: 'Pre-filled Material', 
          qty: '1', 
          price: initialData.amount.toString() 
        }
      ]);
    } else if (visible && !initialData) {
      // Reset form for a fresh PO
      setVendor('');
      setExpectedDate('');
      setItems([{ id: '1', material: '', qty: '', price: '' }]);
    }
  }, [visible, initialData]);

  const addItemRow = () => {
    setItems([...items, { id: Date.now().toString(), material: '', qty: '', price: '' }]);
  };

  const updateItem = (id: string, field: 'material' | 'qty' | 'price', value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.price) || 0;
      return sum + (q * p);
    }, 0);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? `Edit ${initialData.id}` : 'Draft Purchase Order'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vendor / Supplier</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Select or enter vendor"
                  placeholderTextColor={theme.colors.textMuted}
                  value={vendor}
                  onChangeText={setVendor}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expected Delivery</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textMuted}
                  value={expectedDate}
                  onChangeText={setExpectedDate}
                />
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Requested Materials</Text>

            {items.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  {index === 0 && <Text style={styles.label}>Material Name</Text>}
                  <TextInput
                    style={styles.input}
                    placeholder="Raw Chemical..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={item.material}
                    onChangeText={(val) => updateItem(item.id, 'material', val)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  {index === 0 && <Text style={styles.label}>Qty</Text>}
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    value={item.qty}
                    onChangeText={(val) => updateItem(item.id, 'qty', val)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  {index === 0 && <Text style={styles.label}>Unit Price</Text>}
                  <TextInput
                    style={styles.input}
                    placeholder="Rs. 0.00"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    value={item.price}
                    onChangeText={(val) => updateItem(item.id, 'price', val)}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addRowBtn} onPress={addItemRow}>
              <Text style={styles.addRowText}>+ Add Material</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>Rs. {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={onClose}>
              <Text style={styles.submitBtnText}>
                {initialData ? 'Update PO' : 'Issue PO'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 800, maxHeight: '90%', backgroundColor: '#0F0C1D', borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  title: { color: theme.colors.textPrimary, fontSize: theme.typography.fontSizeLg, fontWeight: 'bold' },
  closeBtn: { padding: 8 },
  closeBtnText: { color: theme.colors.textMuted, fontSize: 16, fontWeight: 'bold' },
  scrollArea: { padding: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  inputGroup: { flex: 1, gap: 8, marginRight: 8 },
  label: { color: theme.colors.textSecondary, fontSize: theme.typography.fontSizeSm, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: theme.typography.fontSizeMd },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  sectionTitle: { color: theme.colors.cyanGlow, fontSize: theme.typography.fontSizeMd, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  itemRow: { flexDirection: 'row', marginBottom: 12 },
  addRowBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', marginTop: 8 },
  addRowText: { color: theme.colors.cyanGlow, fontWeight: '700', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderTopWidth: 1, borderTopColor: theme.colors.surfaceBorder },
  totalLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: theme.colors.mintGlow, fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  submitBtn: { backgroundColor: theme.colors.cyanGlow, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});