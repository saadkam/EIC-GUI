import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { print } from 'react-native-unified-print';
import { theme } from '../../theme/theme';
import { PrintIcon } from '../../components/common/icons/MenuIcon';
import { ProcurementEntry } from './components/ProcurementTable'; // Adjust path if needed

interface Props {
  initialData: ProcurementEntry | null;
  onBack: () => void;
  onPOIssued: (poPayload: any) => void; // New prop for handoff
}

export const PurchaseOrderScreen: React.FC<Props> = ({ initialData, onBack, onPOIssued }) => {
  const [vendor, setVendor] = useState('');
  const [expectedDate, setExpectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ id: '1', material: '', qty: '', price: '' }]);
  const [description, setDescription] = useState('');
  const [invoiced, setInvoiced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const status = initialData ? initialData.status : 'Pending';

  // Calendar State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

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

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setExpectedDate(`${selectedYear}-${formattedMonth}-${formattedDay}`);
    setIsDatePickerOpen(false);
  };

  const changeMonth = (offset: number) => {
    let newMonth = selectedMonth + offset;
    let newYear = selectedYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; } 
    else if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  // The Server Push & Handoff
  const handleIssuePO = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      // If initialData exists, use its ID, otherwise it's a new draft
      id: initialData ? initialData.id : `PO-${Date.now().toString().slice(-4)}`,
      vendor,
      expectedDate,
      items,
      description,
      invoiced,
      status: 'Pending',
      total: calculateTotal()
    };
    
    try {
      // ---------------------------------------------------------
      // 🚀 YOUR SERVER SYNC LOGIC HERE
      // ---------------------------------------------------------
      // e.g., await axios.post('/api/purchase-orders', payload);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated network request
      
      console.log("Successfully pushed to server:", payload);
      
      // Handoff to the hub to switch to PurchaseOrderPrintScreen
      // (Ensure your ProcurementHubScreen router passes this down!)
      if (onPOIssued) {
        onPOIssued(payload);
      }
    } catch (error) {
      console.error("Failed to push to server:", error);
      setIsSubmitting(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} disabled={isSubmitting}>
          <Text style={styles.backBtnText}>← Back to List</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{initialData ? `Edit ${initialData.id}` : 'Draft Purchase Order'}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vendor / Supplier Address</Text>
              <TextInput 
                style={[styles.input, { height: 80 }]} 
                value={vendor} 
                onChangeText={setVendor} 
                multiline 
                textAlignVertical="top" 
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Delivery</Text>
              <View style={{ zIndex: 10 }}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerButton, isSubmitting && { opacity: 0.5 }]}
                  onPress={() => !isSubmitting && setIsDatePickerOpen(!isDatePickerOpen)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: theme.colors.textPrimary }}>{expectedDate}</Text>
                  <Text>📅</Text>
                </TouchableOpacity>

                {isDatePickerOpen && (
                  <View style={styles.calendarFlyout}>
                    <View style={styles.calendarHeader}>
                      <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}><Text style={styles.navButtonText}>◀</Text></TouchableOpacity>
                      <Text style={styles.calendarTitle}>{monthNames[selectedMonth]} {selectedYear}</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}><Text style={styles.navButtonText}>▶</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsDatePickerOpen(false)} style={styles.closeButton}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.weekdaysRow}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <Text key={d} style={styles.weekdayText}>{d}</Text>)}
                    </View>
                    <View style={styles.daysGrid}>
                      {Array.from({ length: firstDayOfMonth(selectedYear, selectedMonth) }).map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
                      {Array.from({ length: daysInMonth(selectedYear, selectedMonth) }).map((_, i) => {
                        const day = i + 1;
                        const fM = String(selectedMonth + 1).padStart(2, '0');
                        const fD = String(day).padStart(2, '0');
                        const isSelected = expectedDate === `${selectedYear}-${fM}-${fD}`;
                        return (
                          <TouchableOpacity key={day} style={[styles.dayCell, isSelected && styles.selectedDayCell]} onPress={() => handleSelectDay(day)}>
                            <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.checkboxWrapper}>
            <TouchableOpacity onPress={() => !isSubmitting && setInvoiced(!invoiced)} style={styles.checkboxContainer} activeOpacity={0.8}>
              <View style={[styles.checkbox, invoiced && styles.checkboxActive]}>
                {invoiced && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Mark as Invoiced</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Requested Materials</Text>

          {items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                {index === 0 && <Text style={styles.label}>Material Name</Text>}
                <TextInput style={styles.input} value={item.material} onChangeText={(val) => updateItem(item.id, 'material', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Qty</Text>}
                <TextInput style={styles.input} keyboardType="numeric" value={item.qty} onChangeText={(val) => updateItem(item.id, 'qty', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Unit Price</Text>}
                <TextInput style={styles.input} keyboardType="numeric" value={item.price} onChangeText={(val) => updateItem(item.id, 'price', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting} />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addRowBtn} onPress={() => !isSubmitting && setItems([...items, { id: Date.now().toString(), material: '', qty: '', price: '' }])}>
            <Text style={styles.addRowText}>+ Add Material</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description / Notes (Optional)</Text>
            <TextInput 
              style={[styles.input, { height: 80 }]} 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              textAlignVertical="top" 
              placeholderTextColor={theme.colors.textMuted}
              editable={!isSubmitting} 
            />
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>Rs. {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} onPress={handleIssuePO}>
              {isSubmitting ? (
                 <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.submitBtnText}>{initialData ? 'Update PO & Print' : 'Issue PO & Print'}</Text>
              )}
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
  backBtnText: { color: theme.colors.cyanGlow, fontSize: 14, fontWeight: 'bold' },
  title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: 6, borderWidth: 1, borderColor: theme.colors.cyanGlow },
  statusBadgeText: { color: theme.colors.cyanGlow, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 900, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 32, zIndex: 1 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16, zIndex: 2 },
  inputGroup: { flex: 1, gap: 8 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: 14 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  sectionTitle: { color: theme.colors.cyanGlow, fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  
  checkboxWrapper: { marginTop: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxActive: { backgroundColor: theme.colors.cyanGlow, borderColor: theme.colors.cyanGlow },
  checkmark: { color: '#000', fontSize: 14, fontWeight: 'bold', lineHeight: 18 },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },

  addRowBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', marginTop: 8 },
  addRowText: { color: theme.colors.cyanGlow, fontWeight: '700', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.colors.surfaceBorder },
  totalLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: theme.colors.mintGlow, fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  submitBtn: { backgroundColor: theme.colors.cyanGlow, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  
  // Calendar Flyout Styles
  datePickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calendarFlyout: { position: 'absolute', top: 55, left: 0, width: 270, backgroundColor: '#17112B', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.cyanGlowBorder, padding: 12, elevation: 20, zIndex: 9999, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 14 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  calendarTitle: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: '700' },
  navButton: { padding: 4 },
  navButtonText: { color: theme.colors.cyanGlow, fontSize: 12 },
  closeButton: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 6, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  closeButtonText: { color: theme.colors.textMuted, fontSize: 11, fontWeight: 'bold' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  weekdayText: { width: 32, textAlign: 'center', color: theme.colors.textMuted, fontSize: 11, fontWeight: 'bold' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: 35, height: 30, justifyContent: 'center', alignItems: 'center', marginVertical: 1 },
  selectedDayCell: { backgroundColor: theme.colors.cyanGlow, borderRadius: 6 },
  dayText: { color: theme.colors.textPrimary, fontSize: 12 },
  selectedDayText: { color: '#000', fontWeight: 'bold' },

  // Print Preview Card
  previewCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 40, borderWidth: 1, borderColor: theme.colors.surfaceBorder, alignItems: 'center', maxWidth: 580, alignSelf: 'center', marginTop: 40, gap: 12 },
  previewText: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  previewSubtext: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  errorText: { color: theme.colors.pinkGlow, fontSize: 12, fontWeight: '600' },
});