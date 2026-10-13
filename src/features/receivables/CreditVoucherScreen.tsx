import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementEntry as SalesEntry } from '../procurement/components/ProcurementTable'; // Reusing shared table type
import { CreditVoucherPrintScreen } from './CreditVoucherPrintScreen';

interface Props {
  initialData: SalesEntry | null;
  onBack: () => void;
  onVoucherIssued?: (payload: any) => void;
}

type VoucherType = 'Against SO' | 'General Income' | 'Advance Receipt';
type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque';
type PaymentScope = 'Full' | 'Partial';

const VOUCHER_TYPES: VoucherType[] = ['Against SO', 'General Income', 'Advance Receipt'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Cheque'];
const PAYMENT_SCOPES: PaymentScope[] = ['Full', 'Partial'];

export const CreditVoucherScreen: React.FC<Props> = ({ initialData, onBack, onVoucherIssued }) => {
  const isReadOnly = initialData?.type === 'Credit Voucher';
  
  const [voucherType, setVoucherType] = useState<VoucherType>('General Income');
  const [paymentScope, setPaymentScope] = useState<PaymentScope>('Full');
  
  const [payer, setPayer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [referenceSO, setReferenceSO] = useState('');
  
  const [baseDescription, setBaseDescription] = useState('');
  const [itemsSummary, setItemsSummary] = useState('');
  
  const [iban, setIban] = useState('');
  const [chequeNo, setChequeNo] = useState('');

  const [isTaxLogged, setIsTaxLogged] = useState(false);
  const [isTaxLocked, setIsTaxLocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printPayload, setPrintPayload] = useState<any>(null);

  const getRemainingBalance = () => {
    return 666; // Placeholder logic
  };

  useEffect(() => {
    if (initialData) {
      if (initialData.type === 'Sales Order' || initialData.type === 'Credit Voucher') {
        setVoucherType('Against SO');
        setPaymentScope('Full');
        setPayer(initialData.vendor); 
        setReferenceSO(initialData.id);
        setAmount(initialData.amount.toString());
        
        const extractedItems = (initialData.items && initialData.items.length > 0)
          ? initialData.items.map((i: any) => `${i.qty}x ${i.material}`).join(', ') 
          : 'Finished Goods / Products';
        setItemsSummary(extractedItems);
        
        // DYNAMIC TAX LOGIC: If it has UNINV, it is UNINVOICED (Internal = true, Tax = false)
        const isInvoiced = !initialData.id.includes('UNINV');
        setIsTaxLogged(isInvoiced);
        setIsTaxLocked(true); // Always lock for SOs

        if (initialData.type === 'Credit Voucher') {
          setDate(initialData.date);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (voucherType === 'Against SO' && referenceSO) {
      if (paymentScope === 'Full') {
        setBaseDescription(`Full receipt against ${referenceSO}`);
      } else {
        setBaseDescription(`Partial receipt against ${referenceSO}. Balance: Rs. ${getRemainingBalance()}`);
      }
      if (!itemsSummary) setItemsSummary('Finished Goods / Products');
    } else {
      setBaseDescription(voucherType === 'Advance Receipt' ? 'Advance Receipt' : 'General Income');
      setItemsSummary(''); 
    }
  }, [paymentScope, referenceSO, voucherType, itemsSummary]); // <-- Added itemsSummary here

  const handleIssueVoucher = async () => {
    if (isSubmitting || isReadOnly) return;
    setIsSubmitting(true);
    
    const payload = {
      id: `CV-${Date.now().toString().slice(-4)}`,
      type: 'Credit Voucher',
      voucherType,
      paymentScope,
      payer, // Maps to 'Received From' in print
      date,
      amount: parseFloat(amount) || 0,
      paymentMethod,
      referenceSO: voucherType === 'Against SO' ? referenceSO : null,
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
      type: 'Credit Voucher',
      voucherType: 'Against SO',
      payer: initialData?.vendor,
      date: initialData?.date,
      amount: initialData?.amount,
      paymentMethod: 'Bank Transfer',
      baseDescription: `Historical receipt against ${initialData?.vendor}`,
      itemsSummary: itemsSummary || 'Finished Goods / Products',
      isTaxLogged: true
    });
  };

  if (printPayload) {
    return <CreditVoucherPrintScreen voucherData={printPayload} onBack={onBack} />;
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
          <Text style={styles.backBtnText}>← Back to Receivables</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isReadOnly ? `View ${initialData?.id}` : 'Issue Credit Voucher'}
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
              <Text style={styles.label}>Payer / Customer Name</Text>
              <TextInput 
                style={[styles.input, isReadOnly && styles.inputDisabled]} 
                value={payer} 
                onChangeText={setPayer} 
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
            {voucherType === 'Against SO' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reference SO Number</Text>
                <TextInput 
                  style={[styles.input, isReadOnly && styles.inputDisabled]} 
                  value={referenceSO} 
                  onChangeText={setReferenceSO} 
                  placeholder="e.g., SO-UNINV-1042"
                  placeholderTextColor={theme.colors.textMuted} 
                  editable={!isSubmitting && !isReadOnly}
                />
              </View>
            )}
            
            {voucherType === 'Against SO' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Receipt Scope</Text>
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
              <Text style={styles.label}>Received Amount (Rs)</Text>
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
              <Text style={styles.label}>Deposited To (IBAN / Account)</Text>
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
              label="Log for Tax Purposes (Official Receipt)" 
              value={isTaxLogged} 
              onToggle={() => setIsTaxLogged(!isTaxLogged)} 
              disabled={isReadOnly || isTaxLocked} 
            />
          </View>

          {!isReadOnly && (
            <View style={styles.footer}>
              <View>
                <Text style={styles.totalLabel}>Total Inbound</Text>
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

// Cyan-themed styles for Inbound Cash
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder, zIndex: 100 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: '#06B6D4', fontSize: 14, fontWeight: 'bold' }, 
  title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
  
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, borderWidth: 1, borderColor: '#06B6D4' },
  statusBadgeText: { fontWeight: 'bold', fontSize: 13, color: '#06B6D4', textTransform: 'uppercase' },
  
  viewPrintBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#06B6D4', borderRadius: 8 },
  viewPrintBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 850, backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 32 },
  
  segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 4, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' },
  segmentText: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 13 },
  segmentTextActive: { color: '#06B6D4', fontWeight: 'bold' },
  
  row: { flexDirection: 'row', gap: 16, marginBottom: 20, alignItems: 'flex-end' },
  inputGroup: { flex: 1, gap: 8 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 14, fontSize: 14 },
  amountInput: { color: '#06B6D4', fontWeight: 'bold', fontSize: 16 },
  inputDisabled: { opacity: 0.5 },
  
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  sectionTitle: { color: '#06B6D4', fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  
  radioGroup: { flexDirection: 'row', gap: 24 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: '#06B6D4' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#06B6D4' },
  radioText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '500' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#06B6D4', borderColor: '#06B6D4' },
  checkMark: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.colors.surfaceBorder },
  totalLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: '#06B6D4', fontSize: 28, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  submitBtn: { backgroundColor: '#06B6D4', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});