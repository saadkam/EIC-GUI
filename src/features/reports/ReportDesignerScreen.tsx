import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme'; 
import { PrintIcon } from '../../components/common/icons/MenuIcon'; 

interface ReportItem {
  name: string;
  qty: number;
  price: number;
}

interface ReportData {
  id: string;
  date: string;
  vendor: string;
  items: ReportItem[];
  status: string;
}

type ReportTemplate = 'invoice' | 'purchase-order' | 'summary';

interface Props {
  data?: ReportData;
  onBack: () => void;
}

const MOCK_REPORT_DATA: ReportData = {
  id: 'INV-2026-089',
  date: new Date().toISOString().split('T')[0],
  vendor: 'Logistics Pro',
  status: 'Paid',
  items: [
    { name: 'Industrial Solvent V', qty: 50, price: 120 },
    { name: 'Freight Charge', qty: 1, price: 450 },
  ],
};

export const ReportDesignerScreen: React.FC<Props> = ({ data = MOCK_REPORT_DATA, onBack }) => {
  const [activeTemplate, setActiveTemplate] = useState<ReportTemplate>('invoice');
  const [documentTitle, setDocumentTitle] = useState('TAX INVOICE');
  const [preparedBy, setPreparedBy] = useState('Admin');
  const [notes, setNotes] = useState('Thank you for your business.');

  const totalAmount = data.items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  // Generate perfectly aligned monospace text for POS/Notepad printing
  const printReadyText = useMemo(() => {
    const pad = (str: string, length: number, align: 'left' | 'right' = 'left') => {
      const s = String(str).substring(0, length);
      return align === 'left' ? s.padEnd(length, ' ') : s.padStart(length, ' ');
    };

    const divider = `========================================================\n`;
    const thinDivider = `--------------------------------------------------------\n`;

    let text = `\n`;
    text += `                NIC CHEMICALS (PVT) LTD                 \n`;
    text += `                  ${pad(documentTitle.toUpperCase(), 16, 'left')}                  \n`;
    text += divider;
    text += `Date: ${pad(data.date, 16)} Ref ID: ${data.id}\n`;
    text += `Prepared By: ${pad(preparedBy, 9)} Status: ${data.status}\n`;
    text += thinDivider;
    text += `${activeTemplate === 'purchase-order' ? 'Vendor / Supplier:' : 'Bill To:'}\n`;
    text += `${data.vendor}\n`;
    text += thinDivider;
    
    // Table Headers (56 chars total width)
    text += `${pad('DESCRIPTION', 28, 'left')}${pad('QTY', 6, 'right')}${pad('PRICE', 10, 'right')}${pad('TOTAL', 12, 'right')}\n`;
    text += thinDivider;

    // Table Rows
    data.items.forEach(item => {
      const itemTotal = item.qty * item.price;
      text += `${pad(item.name, 28, 'left')}${pad(item.qty.toString(), 6, 'right')}${pad(item.price.toString(), 10, 'right')}${pad(itemTotal.toString(), 12, 'right')}\n`;
    });

    text += thinDivider;
    text += `${pad('TOTAL AMOUNT:', 44, 'left')}${pad(`Rs. ${totalAmount}`, 12, 'right')}\n`;
    text += divider;

    if (notes) {
      text += `NOTES:\n${notes}\n`;
      text += divider;
    }

    return text;
  }, [data, activeTemplate, documentTitle, preparedBy, notes, totalAmount]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back to Hub</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <PrintIcon size={16} />
          <Text style={styles.headerTitle}>Plain Text Export</Text>
        </View>
        <View style={{ width: 100 }} />
      </View>

      <View style={styles.splitView}>
        {/* LEFT PANE: Designer Controls */}
        <View style={styles.designerSidebar}>
          <Text style={styles.sidebarTitle}>Document Setup</Text>
          
          <Text style={styles.label}>Template Type</Text>
          <View style={styles.templateSwitcher}>
            {(['invoice', 'purchase-order', 'summary'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.segmentBtn, activeTemplate === type && styles.segmentBtnActive]}
                onPress={() => {
                  setActiveTemplate(type);
                  setDocumentTitle(type === 'invoice' ? 'TAX INVOICE' : type === 'purchase-order' ? 'PURCHASE ORDER' : 'SUMMARY');
                }}
              >
                <Text style={[styles.segmentText, activeTemplate === type && styles.segmentTextActive]}>
                  {type.toUpperCase().replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Title</Text>
            <TextInput style={styles.input} value={documentTitle} onChangeText={setDocumentTitle} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepared By</Text>
            <TextInput style={styles.input} value={preparedBy} onChangeText={setPreparedBy} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Footer Notes</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline textAlignVertical="top" />
          </View>
          
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>How to Print</Text>
            <Text style={styles.instructionText}>1. Click inside the receipt box.</Text>
            <Text style={styles.instructionText}>2. Press Ctrl + A to Select All.</Text>
            <Text style={styles.instructionText}>3. Press Ctrl + C to Copy.</Text>
            <Text style={styles.instructionText}>4. Paste into Notepad and Print.</Text>
          </View>
        </View>

        {/* RIGHT PANE: Plain Text Receipt Area */}
        <View style={styles.previewArea}>
          <View style={styles.receiptWrapper}>
            <TextInput
              style={styles.receiptEditor}
              multiline={true}
              value={printReadyText}
              editable={true} // Allows user to easily click and Ctrl+A
              textAlignVertical="top"
              scrollEnabled={true}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  
  splitView: { flex: 1, flexDirection: 'row' },
  designerSidebar: { width: 320, backgroundColor: theme.colors.surface, borderRightWidth: 1, borderRightColor: theme.colors.surfaceBorder, padding: 20 },
  sidebarTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 10, fontSize: 13 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 20 },
  
  templateSwitcher: { backgroundColor: theme.colors.glassInput, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.surfaceBorder, padding: 4, marginBottom: 12 },
  segmentBtn: { paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  segmentBtnActive: { backgroundColor: theme.colors.cyanGlowBorder, borderWidth: 1, borderColor: theme.colors.cyanGlow },
  segmentText: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },
  segmentTextActive: { color: '#000' },

  instructionCard: { marginTop: 20, backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' },
  instructionTitle: { color: theme.colors.cyanGlow, fontWeight: 'bold', marginBottom: 8 },
  instructionText: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4 },

  previewArea: { flex: 1, padding: 40, alignItems: 'center', backgroundColor: 'transparent' },
  receiptWrapper: { width: 500, minHeight: 600, backgroundColor: '#FFFFFF', padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  receiptEditor: { flex: 1, color: '#000000', fontSize: 14, fontFamily: 'Consolas', lineHeight: 20 },
});