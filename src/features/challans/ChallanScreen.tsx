import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/theme'; // Adjust import path as needed
import { DatePickerDropdown } from '../../components/common/datepicker';

interface AccountItem {
  id: string;
  name: string;
  hsCode: string;
}

export default function PaymentChallanScreen() {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Core Form State
  const [challanNo, setChallanNo] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [debitTo, setDebitTo] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [amount, setAmount] = useState('');
  const [chequeNo, setChequeNo] = useState('');

  // Dynamic 'On Account Of' State
  const [accountItems, setAccountItems] = useState<AccountItem[]>([
    { id: Date.now().toString(), name: '', hsCode: '' }
  ]);

  // Calendar State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Handlers
  const handleAmountChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, '');
    if ((sanitized.match(/\./g) || []).length <= 1) {
      setAmount(sanitized);
    }
  };

  const addAccountItem = () => {
    setAccountItems([...accountItems, { id: Date.now().toString(), name: '', hsCode: '' }]);
  };

  const updateAccountItem = (id: string, field: keyof AccountItem, value: string) => {
    setAccountItems(items =>
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeAccountItem = (id: string) => {
    if (accountItems.length > 1) {
      setAccountItems(items => items.filter(item => item.id !== id));
    }
  };

  // Auto-concatenated Description String
  const derivedDescription = accountItems
    .filter(item => item.name.trim() !== '')
    .map(item => `${item.name.trim()}${item.hsCode.trim() ? ` (HS: ${item.hsCode.trim()})` : ''}`)
    .join(' | ');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Glassmorphic Document Form */}
        <View style={styles.formCard}>
          
          {/* Header Section based on 18688.jpg */}
          <View style={styles.headerRow}>
            <View style={styles.companyInfo}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>NIC</Text>
              </View>
              <View>
                <Text style={styles.companyName}>NIC CHEMICALS</Text>
                <Text style={styles.companySubName}>(PRIVATE) LIMITED</Text>
                <Text style={styles.documentType}>DEBIT VOUCHER</Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <View style={[styles.inputGroup, { width: 150 }]}>
                <Text style={styles.label}>No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter ID..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={challanNo}
                  onChangeText={setChallanNo}
                />
              </View>
              <View style={[styles.inputGroup, { position: 'relative', zIndex: 101, flex: 1, marginRight: 16 }]}>
              <Text style={styles.label}>Date:</Text>
              <TouchableOpacity
                style={styles.datePickerTrigger}
                onPress={() => setIsDatePickerOpen(!isDatePickerOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.datePickerText}>{date}</Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>

              <DatePickerDropdown 
                visible={isDatePickerOpen}
                currentDate={date}
                onSelectDate={(newDate) => {
                  setDate(newDate);
                  setIsDatePickerOpen(false);
                }}
                onClose={() => setIsDatePickerOpen(false)}
                containerStyle={{ position: 'absolute', top: 75, left: 0, zIndex: 9999 }}
              />
            </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Debit & Paid To */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { marginRight: 16 }]}>
              <Text style={styles.label}>Debit To:</Text>
              <TextInput
                style={styles.input}
                placeholder="Account/Department"
                placeholderTextColor={theme.colors.textMuted}
                value={debitTo}
                onChangeText={setDebitTo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paid To:</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient Name"
                placeholderTextColor={theme.colors.textMuted}
                value={paidTo}
                onChangeText={setPaidTo}
              />
            </View>
          </View>

          {/* Dynamic On Account Of Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>On Account Of (Items)</Text>
            
            {accountItems.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={[styles.inputGroup, { flex: 3, marginRight: 12 }]}>
                  {index === 0 && <Text style={styles.label}>Item Name</Text>}
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Raw Solvent"
                    placeholderTextColor={theme.colors.textMuted}
                    value={item.name}
                    onChangeText={(val) => updateAccountItem(item.id, 'name', val)}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1.5, marginRight: 12 }]}>
                  {index === 0 && <Text style={styles.label}>HS Code</Text>}
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 2901.1000"
                    placeholderTextColor={theme.colors.textMuted}
                    value={item.hsCode}
                    onChangeText={(val) => updateAccountItem(item.id, 'hsCode', val)}
                  />
                </View>
                <View style={styles.actionColumn}>
                  {index === 0 && <Text style={styles.label}> </Text>}
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeAccountItem(item.id)}
                    disabled={accountItems.length === 1}
                  >
                    <Text style={[
                      styles.deleteButtonText,
                      accountItems.length === 1 && { opacity: 0.3 }
                    ]}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addItemButton} onPress={addAccountItem}>
              <Text style={styles.addItemButtonText}>+ Add Another Item</Text>
            </TouchableOpacity>
          </View>

          {/* Auto-Generated Description */}
          <View style={styles.inputGroupFull}>
            <Text style={styles.label}>Generated Description:</Text>
            <View style={styles.readOnlyBox}>
              <Text style={[styles.readOnlyText, !derivedDescription && { color: theme.colors.textMuted }]}>
                {derivedDescription || "Items will appear here once entered..."}
              </Text>
            </View>
          </View>

          {/* Date, Cheque & Amount */}
          <View style={styles.row}>
            

            <View style={[styles.inputGroup, { flex: 1, marginRight: 16, zIndex: 1 }]}>
              <Text style={styles.label}>Cheque No:</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                placeholderTextColor={theme.colors.textMuted}
                value={chequeNo}
                onChangeText={setChequeNo}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1.5, zIndex: 1 }]}>
              <Text style={styles.label}>Rupees (Amount):</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>Rs.</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={handleAmountChange}
                />
              </View>
            </View>
          </View>

          {/* Signatures based on 18688.jpg */}
          <View style={styles.signaturesRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>DIRECTOR / G.M</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>PAYEES SIGNATURE</Text>
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Save Debit Voucher</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#0B0813', 
  },
  scrollContent: {
    padding: 32,
    alignItems: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    zIndex: 10, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    zIndex: 1,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1,
  },
  companyName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F1F5F9',
    letterSpacing: 1.5,
  },
  companySubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBD5E1',
    letterSpacing: 1,
  },
  documentType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.accentPurple,
    marginTop: 4,
    letterSpacing: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 32,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
    zIndex: 100, 
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupFull: {
    width: '100%',
    marginBottom: 24,
    zIndex: 1,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(15, 12, 29, 0.65)',
    color: '#F1F5F9',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
    zIndex: 1,
  },
  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  actionColumn: {
    height: 50,
    justifyContent: 'flex-end',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addItemButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  addItemButtonText: {
    color: theme.colors.cyanGlow,
    fontSize: 13,
    fontWeight: '700',
  },
  readOnlyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    minHeight: 80,
  },
  readOnlyText: {
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 22,
  },
  datePickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 12, 29, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  datePickerText: {
    color: '#F1F5F9',
    fontSize: 15,
  },
  calendarIcon: {
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 12, 29, 0.65)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.mintGlowBorder || '#4CAF50',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    color: theme.colors.mintGlow || '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: theme.colors.mintGlow || '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
    zIndex: 1,
  },
  signatureBlock: {
    alignItems: 'center',
    width: 250,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
  },
  signatureLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  submitButton: {
    marginTop: 32,
    backgroundColor: theme.colors.cyanGlow || '#06B6D4',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    shadowColor: theme.colors.cyanGlow || '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});