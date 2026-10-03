import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementEntry } from './components/ProcurementTable'; 

interface Props {
  initialData: ProcurementEntry | null;
  onBack: () => void;
  onPOIssued: (poPayload: any) => void;
  readOnly?: boolean; 
}

const PO_STATUSES = ['Issued', 'Approved', 'Pending'];// 'Finalized']; Removed finalized as it can be only finalized once payments are completed

export const PurchaseOrderScreen: React.FC<Props> = ({ initialData, onBack, onPOIssued, readOnly = false }) => {
  const [vendor, setVendor] = useState('');
  const [expectedDate, setExpectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ id: '1', material: '', qty: '', price: '' }]);
  const [description, setDescription] = useState('');
  const [invoiced, setInvoiced] = useState(false);
  
  // Status & Lock States
  const [currentStatus, setCurrentStatus] = useState(initialData ? initialData.status : 'Issued');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic lock: Also locks if the user just finalized it in this session
  const isFormLocked = readOnly || currentStatus === 'Finalized';

  // Calendar State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (initialData) {
      setVendor(initialData.vendor);
      setExpectedDate(initialData.date);
      setCurrentStatus(initialData.status);
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

  // Color mapper for statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalized': return theme.colors.mintGlow; // Green
      case 'Approved': return '#3B82F6'; // Blue
      case 'Pending': return '#F59E0B'; // Amber
      case 'Issued':
      default: return theme.colors.cyanGlow;
    }
  };

  // Inline Server Update for Status Changes
  const handleStatusChange = async (newStatus: string) => {
    setIsStatusDropdownOpen(false);
    if (newStatus === currentStatus) return;

    setIsStatusUpdating(true); // Locks the screen
    try {
      // ---------------------------------------------------------
      // 🚀 YOUR SERVER SYNC LOGIC FOR STATUS UPDATE HERE
      // ---------------------------------------------------------
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status on server:", error);
    } finally {
      setIsStatusUpdating(false); // Unlocks the screen
    }
  };

  // Full Form Submission
  const handleIssuePO = async () => {
    if (isSubmitting || isStatusUpdating) return;

    const payload = {
      id: initialData ? initialData.id : `PO-${Date.now().toString().slice(-4)}`,
      vendor,
      expectedDate,
      items,
      description,
      invoiced,
      status: currentStatus,
      total: calculateTotal()
    };

    if (isFormLocked) {
      if (onPOIssued) onPOIssued(payload);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      if (onPOIssued) onPOIssued(payload);
    } catch (error) {
      console.error("Failed to push to server:", error);
      setIsSubmitting(false); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Full Screen Loading Overlay for Status Updates */}
      {isStatusUpdating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.cyanGlow} />
          <Text style={styles.loadingOverlayText}>Updating Server...</Text>
        </View>
      )}

      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} disabled={isSubmitting || isStatusUpdating}>
          <Text style={styles.backBtnText}>← Back to List</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{initialData ? `${isFormLocked ? 'View' : 'Edit'} ${initialData.id}` : 'Draft Purchase Order'}</Text>
        
        {/* Dynamic Dropdown Status Badge */}
        <View style={{ zIndex: 50 }}>
          <TouchableOpacity 
            style={[styles.statusBadge, { borderColor: getStatusColor(currentStatus) }]}
            onPress={() => !isFormLocked && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            disabled={isFormLocked || isStatusUpdating}
          >
            <Text style={[styles.statusBadgeText, { color: getStatusColor(currentStatus) }]}>
              {currentStatus} {!isFormLocked && ' ▼'}
            </Text>
          </TouchableOpacity>

          {isStatusDropdownOpen && (
            <View style={styles.statusDropdown}>
              {PO_STATUSES.map(s => (
                <TouchableOpacity key={s} style={styles.statusOption} onPress={() => handleStatusChange(s)}>
                  <Text style={[styles.statusOptionText, { color: getStatusColor(s) }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vendor / Supplier Address</Text>
              <TextInput 
                style={[styles.input, { height: 80 }, isFormLocked && styles.inputDisabled]} 
                value={vendor} 
                onChangeText={setVendor} 
                multiline 
                textAlignVertical="top" 
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isFormLocked}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Delivery</Text>
              <View style={{ zIndex: 10 }}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerButton, (isSubmitting || isFormLocked) && { opacity: 0.5 }]}
                  onPress={() => !isSubmitting && !isFormLocked && setIsDatePickerOpen(!isDatePickerOpen)}
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
            <TouchableOpacity onPress={() => !isSubmitting && !isFormLocked && setInvoiced(!invoiced)} style={styles.checkboxContainer} activeOpacity={isFormLocked ? 1 : 0.8}>
              <View style={[styles.checkbox, invoiced && styles.checkboxActive, isFormLocked && { opacity: 0.6 }]}>
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
                <TextInput style={[styles.input, isFormLocked && styles.inputDisabled]} value={item.material} onChangeText={(val) => updateItem(item.id, 'material', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting && !isFormLocked} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Qty</Text>}
                <TextInput style={[styles.input, isFormLocked && styles.inputDisabled]} keyboardType="numeric" value={item.qty} onChangeText={(val) => updateItem(item.id, 'qty', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting && !isFormLocked} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {index === 0 && <Text style={styles.label}>Unit Price</Text>}
                <TextInput style={[styles.input, isFormLocked && styles.inputDisabled]} keyboardType="numeric" value={item.price} onChangeText={(val) => updateItem(item.id, 'price', val)} placeholderTextColor={theme.colors.textMuted} editable={!isSubmitting && !isFormLocked} />
              </View>
            </View>
          ))}

          {!isFormLocked && (
            <TouchableOpacity style={styles.addRowBtn} onPress={() => !isSubmitting && setItems([...items, { id: Date.now().toString(), material: '', qty: '', price: '' }])}>
              <Text style={styles.addRowText}>+ Add Material</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description / Notes (Optional)</Text>
            <TextInput 
              style={[styles.input, { height: 80 }, isFormLocked && styles.inputDisabled]} 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              textAlignVertical="top" 
              placeholderTextColor={theme.colors.textMuted}
              editable={!isSubmitting && !isFormLocked} 
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
                <Text style={styles.submitBtnText}>
                  {isFormLocked ? '🖨️ Print Document' : (initialData ? 'Update PO & Print' : 'Issue PO & Print')}
                </Text>
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
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 9999, justifyContent: 'center', alignItems: 'center' },
  loadingOverlayText: { color: theme.colors.textPrimary, marginTop: 16, fontSize: 16, fontWeight: '600', letterSpacing: 1 },
  
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder, zIndex: 100 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: theme.colors.cyanGlow, fontSize: 14, fontWeight: 'bold' },
  title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  
  statusBadge: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, borderWidth: 1 },
  statusBadgeText: { fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
  statusDropdown: { position: 'absolute', top: 45, right: 0, width: 140, backgroundColor: theme.colors.surfaceHeader, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10 },
  statusOption: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  statusOptionText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 900, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 32, zIndex: 1 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16, zIndex: 2 },
  inputGroup: { flex: 1, gap: 8 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: 14 },
  inputDisabled: { opacity: 0.6 },
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
});