import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementEntry } from '../procurement/components/ProcurementTable';
import { DebitVoucherPrintScreen } from './DebitVoucherPrintScreen';

interface Props {
  initialData: ProcurementEntry | null;
  onBack: () => void;
  onVoucherIssued?: (payload: any) => void;
}

type VoucherType = 'Against PO' | 'General Expense' | 'Advance';
type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque';
type PaymentScope = 'Full' | 'Partial';

const VOUCHER_TYPES: VoucherType[] = ['Against PO', 'General Expense', 'Advance'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Cheque'];
const PAYMENT_SCOPES: PaymentScope[] = ['Full', 'Partial'];

export const DebitVoucherScreen: React.FC<Props> = ({ initialData, onBack, onVoucherIssued }) => {
  const isReadOnly = initialData?.type === 'Debit Voucher';
  
  const [voucherType, setVoucherType] = useState<VoucherType>('General Expense');
  const [paymentScope, setPaymentScope] = useState<PaymentScope>('Full');
  
  const [payee, setPayee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [referencePO, setReferencePO] = useState('');
  
  const [baseDescription, setBaseDescription] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');
  
  const [iban, setIban] = useState('');
  const [chequeNo, setChequeNo] = useState('');

  const [isTaxLogged, setIsTaxLogged] = useState(false);
  const [isTaxLocked, setIsTaxLocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printPayload, setPrintPayload] = useState<any>(null);

  const getRemainingBalance = () => {
    return 666;
  };

  // 1. Core Data Initialization Hook
  useEffect(() => {
    if (initialData) {
      if (initialData.type === 'Purchase Order' || initialData.type === 'Debit Voucher') {
        setVoucherType('Against PO');
        setPaymentScope('Full');
        setPayee(initialData.vendor);
        setReferencePO(initialData.id);
        setAmount(initialData.amount.toString());
        
        const extractedItems = (initialData.items && initialData.items.length > 0)
          ? initialData.items.map((i: any) => `${i.qty}x ${i.material}`).join(', ') 
          : 'Bulk Materials / Chemicals';
        setItemsSummary(extractedItems);
        
        // DYNAMIC TAX LOGIC: If it has GRNI, it is UNINVOICED (Internal = true, Tax = false)
        const isInvoiced = !initialData.id.includes('GRNI');
        setIsTaxLogged(isInvoiced);
        setIsTaxLocked(true); // Always lock for POs

        if (initialData.type === 'Debit Voucher') {
          setDate(initialData.date);
        }
      }
    }
  }, [initialData]);

  // 2. Dynamic Description Hook (Reacts to Scope changes without wiping items)
  useEffect(() => {
    if (voucherType === 'Against PO' && referencePO) {
      if (paymentScope === 'Full') {
        setBaseDescription(`Full payment against ${referencePO}`);
      } else {
        setBaseDescription(`Partial payment against ${referencePO}. Balance: Rs. ${getRemainingBalance()}`);
      }
      // Safety catch: if user types a PO manually and items Summary is empty, assign a default
      if (!itemsSummary) setItemsSummary('Bulk Materials / Chemicals');
    } else {
      setBaseDescription(voucherType === 'Advance' ? 'Advance Payment' : 'General Payment');
      setItemsSummary(''); // Only clear if we explicitly switch away from Against PO
    }
  }, [paymentScope, referencePO, voucherType, itemsSummary]);

  const handleIssueVoucher = async () => {
    if (isSubmitting || isReadOnly) return;
    setIsSubmitting(true);
    
    const payload = {
      id: `DV-${Date.now().toString().slice(-4)}`,
      type: 'Debit Voucher',
      voucherType,
      paymentScope,
      payee,
      date,
      amount: parseFloat(amount) || 0,
      paymentMethod,
      referencePO: voucherType === 'Against PO' ? referencePO : null,
      description: baseDescription, 
      baseDescription, 
      itemsSummary,
      iban: paymentMethod === 'Bank Transfer' ? iban : null,
      chequeNo: paymentMethod === 'Cheque' ? chequeNo : null,
      isTaxLogged,
      status: 'Paid'
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onVoucherIssued) onVoucherIssued(payload);
      setPrintPayload(payload);
    } catch (error) {
      console.error("Failed to issue voucher:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPrint = () => {
    setPrintPayload({
      id: initialData?.id,
      type: 'Debit Voucher',
      voucherType: 'Against PO',
      payee: initialData?.vendor,
      date: initialData?.date,
      amount: initialData?.amount,
      paymentMethod: 'Bank Transfer',
      baseDescription: `Historical payment record against ${initialData?.vendor}`,
      itemsSummary: itemsSummary || 'Bulk Materials / Chemicals', // Ensure fallback
      isTaxLogged: true
    });
  };

  if (printPayload) {
    return <DebitVoucherPrintScreen voucherData={printPayload} onBack={onBack} />;
  }

  const Checkbox = ({ label, value, onToggle, disabled }: { label: string, value: boolean, onToggle: () => void, disabled: boolean }) => (
    <TouchableOpacity 
      style={[styles.checkboxRow, disabled && { opacity: 0.5 }]} 
      onPress={onToggle} 
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} disabled={isSubmitting}>
          <Text style={styles.backBtnText}>← Back to Payables</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isReadOnly ? `View ${initialData?.id}` : 'Issue Debit Voucher'}
        </Text>
        
        {isReadOnly ? (
          <TouchableOpacity onPress={handleViewPrint} style={styles.viewPrintBtn}>
            <Text style={styles.viewPrintBtnText}>View Print</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>DRAFT</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          
          <Text style={styles.sectionTitle}>Voucher Category</Text>
          <View style={styles.segmentedControl}>
            {VOUCHER_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.segment,
                  voucherType === type && styles.segmentActive,
                  isReadOnly && styles.inputDisabled
                ]}
                onPress={() => !isReadOnly && setVoucherType(type)}
                disabled={isReadOnly}
              >
                <Text style={[
                  styles.segmentText,
                  voucherType === type && styles.segmentTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payee / Vendor Name</Text>
              <TextInput 
                style={[styles.input, isReadOnly && styles.inputDisabled]} 
                value={payee} 
                onChangeText={setPayee} 
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isReadOnly}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput 
                style={[styles.input, isReadOnly && styles.inputDisabled]} 
                value={date} 
                onChangeText={setDate} 
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isReadOnly}
              />
            </View>
          </View>

          <View style={styles.row}>
            {voucherType === 'Against PO' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reference PO Number</Text>
                <TextInput 
                  style={[styles.input, isReadOnly && styles.inputDisabled]} 
                  value={referencePO} 
                  onChangeText={setReferencePO} 
                  placeholder="e.g., PO-1042"
                  placeholderTextColor={theme.colors.textMuted} 
                  editable={!isSubmitting && !isReadOnly}
                />
              </View>
            )}
            
            {voucherType === 'Against PO' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Scope</Text>
                <View style={[styles.segmentedControl, { marginBottom: 0 }]}>
                  {PAYMENT_SCOPES.map((scope) => (
                    <TouchableOpacity
                      key={scope}
                      style={[
                        styles.segment,
                        paymentScope === scope && styles.segmentActive,
                        isReadOnly && styles.inputDisabled
                      ]}
                      onPress={() => !isReadOnly && setPaymentScope(scope)}
                      disabled={isReadOnly}
                    >
                      <Text style={[
                        styles.segmentText,
                        paymentScope === scope && styles.segmentTextActive
                      ]}>
                        {scope}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Amount (Rs)</Text>
              <TextInput 
                style={[styles.input, styles.amountInput, isReadOnly && styles.inputDisabled]} 
                value={amount} 
                onChangeText={setAmount} 
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isReadOnly}
              />
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.radioGroup}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity 
                key={method} 
                style={styles.radioOption}
                onPress={() => !isReadOnly && setPaymentMethod(method)}
                disabled={isReadOnly}
                activeOpacity={isReadOnly ? 1 : 0.7}
              >
                <View style={[styles.radioCircle, paymentMethod === method && styles.radioCircleActive]}>
                  {paymentMethod === method && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {paymentMethod === 'Bank Transfer' && (
            <View style={[styles.inputGroup, { marginTop: 20 }]}>
              <Text style={styles.label}>IBAN / Account Number</Text>
              <TextInput 
                style={[styles.input, isReadOnly && styles.inputDisabled]} 
                value={iban} 
                onChangeText={setIban} 
                placeholder="PK..."
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isReadOnly}
              />
            </View>
          )}

          {paymentMethod === 'Cheque' && (
            <View style={[styles.inputGroup, { marginTop: 20 }]}>
              <Text style={styles.label}>Cheque Number</Text>
              <TextInput 
                style={[styles.input, isReadOnly && styles.inputDisabled]} 
                value={chequeNo} 
                onChangeText={setChequeNo} 
                placeholder="e.g., 00145829"
                placeholderTextColor={theme.colors.textMuted} 
                editable={!isSubmitting && !isReadOnly}
              />
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>On Account Of (Auto-Generated)</Text>
            <View style={[styles.input, { height: 80, backgroundColor: 'rgba(0,0,0,0.1)', borderColor: 'transparent' }]}>
              <Text style={{ color: theme.colors.textPrimary, lineHeight: 20 }}>
                {baseDescription}{'\n'}{itemsSummary ? `Items: ${itemsSummary}` : ''}
              </Text>
            </View>
          </View>
          
          <View style={{ marginTop: 20 }}>
            <Checkbox 
              label="Log for Tax Purposes (Official Invoice)" 
              value={isTaxLogged} 
              onToggle={() => setIsTaxLogged(!isTaxLogged)} 
              disabled={isReadOnly || isTaxLocked} 
            />
          </View>

          {!isReadOnly && (
            <View style={styles.footer}>
              <View>
                <Text style={styles.totalLabel}>Total Outbound</Text>
                <Text style={styles.totalValue}>Rs. {parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
              </View>
              <TouchableOpacity style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} onPress={handleIssueVoucher}>
                {isSubmitting ? (
                   <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.submitBtnText}>Issue & Print Voucher</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder, zIndex: 100 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: '#FB7185', fontSize: 14, fontWeight: 'bold' }, 
  title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, borderWidth: 1, borderColor: '#FB7185' },
  statusBadgeText: { fontWeight: 'bold', fontSize: 13, color: '#FB7185', textTransform: 'uppercase' },
  
  viewPrintBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FB7185', borderRadius: 8 },
  viewPrintBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 850, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 32 },
  
  segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 4, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: 'rgba(251, 113, 133, 0.15)', borderWidth: 1, borderColor: 'rgba(251, 113, 133, 0.3)' },
  segmentText: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 13 },
  segmentTextActive: { color: '#FB7185', fontWeight: 'bold' },
  
  row: { flexDirection: 'row', gap: 16, marginBottom: 20, alignItems: 'flex-end' },
  inputGroup: { flex: 1, gap: 8 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 14, fontSize: 14 },
  amountInput: { color: '#FB7185', fontWeight: 'bold', fontSize: 16 },
  inputDisabled: { opacity: 0.5 },
  
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  sectionTitle: { color: '#FB7185', fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  
  radioGroup: { flexDirection: 'row', gap: 24 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: '#FB7185' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FB7185' },
  radioText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '500' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#FB7185', borderColor: '#FB7185' },
  checkMark: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.colors.surfaceBorder },
  totalLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: '#FB7185', fontSize: 28, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  submitBtn: { backgroundColor: '#FB7185', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});