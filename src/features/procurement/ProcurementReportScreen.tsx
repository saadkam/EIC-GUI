import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
// import RNPrint from 'react-native-print';
import { theme } from '../../theme/theme';
import { ProcurementEntry } from './components/ProcurementTable';
import { PrintIcon } from '../../components/common/icons/MenuIcon';

interface Props {
  data: ProcurementEntry[];
  onBack: () => void;
}

export const ProcurementReportScreen: React.FC<Props> = ({ data, onBack }) => {
  const [reportTitle, setReportTitle] = useState('Procurement & Payables Summary');
  const [preparedBy, setPreparedBy] = useState('Admin');
  
  const [showDate, setShowDate] = useState(true);
  const [showVendor, setShowVendor] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const printDate = new Date().toISOString().split('T')[0];

  const triggerPrint = async () => {
    // Generate the raw HTML structure for the printer spooler
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0F172A; }
            .header { border-bottom: 2px solid #1E293B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: 900; margin: 0; }
            .subtitle { font-size: 16px; font-weight: 700; color: #475569; margin-top: 5px; }
            .meta { text-align: right; font-size: 13px; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #F1F5F9; border-bottom: 2px solid #94A3B8; text-align: left; padding: 12px 8px; font-size: 12px; }
            td { border-bottom: 1px solid #E2E8F0; padding: 12px 8px; font-size: 13px; }
            .right { text-align: right; }
            .footer { border-top: 2px solid #1E293B; padding-top: 16px; text-align: right; font-size: 20px; font-weight: 900; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">NIC CHEMICALS (PVT) LTD</h1>
              <div class="subtitle">${reportTitle.toUpperCase()}</div>
            </div>
            <div class="meta">
              <div>Date: ${printDate}</div>
              <div>Prepared By: ${preparedBy}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                ${showDate ? '<th>DATE</th>' : ''}
                ${showVendor ? '<th>VENDOR</th>' : ''}
                <th>TYPE</th>
                ${showStatus ? '<th>STATUS</th>' : ''}
                <th class="right">AMOUNT (Rs)</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td><b>${item.id}</b></td>
                  ${showDate ? `<td>${item.date}</td>` : ''}
                  ${showVendor ? `<td>${item.vendor}</td>` : ''}
                  <td>${item.type}</td>
                  ${showStatus ? `<td>${item.status}</td>` : ''}
                  <td class="right">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span style="font-size: 14px; color: #475569; margin-right: 15px;">Total Amount:</span>
            Rs. ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </body>
      </html>
    `;

    // try {
    //   await RNPrint.print({ html: htmlContent });
    // } catch (error) {
    //   console.error("Failed to execute print job:", error);
    // }
  };

  const Checkbox = ({ label, value, onToggle }: { label: string, value: boolean, onToggle: () => void }) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back to List</Text>
        </TouchableOpacity>
        
        {/* Print Button utilizing the custom SVG instead of Emoji */}
        <TouchableOpacity onPress={triggerPrint} style={styles.printBtn}>
          <PrintIcon size={16} />
          <Text style={styles.printBtnText}>Print Document</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.splitView}>
        <View style={styles.designerSidebar}>
          <Text style={styles.sidebarTitle}>Report Settings</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Title</Text>
            <TextInput style={styles.input} value={reportTitle} onChangeText={setReportTitle} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepared By</Text>
            <TextInput style={styles.input} value={preparedBy} onChangeText={setPreparedBy} />
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>Visible Columns</Text>
          <Checkbox label="Date" value={showDate} onToggle={() => setShowDate(!showDate)} />
          <Checkbox label="Vendor" value={showVendor} onToggle={() => setShowVendor(!showVendor)} />
          <Checkbox label="Status" value={showStatus} onToggle={() => setShowStatus(!showStatus)} />
        </View>

        <ScrollView style={styles.previewArea} contentContainerStyle={styles.previewContent}>
          <View style={styles.a4Page}>
            <View style={styles.docHeader}>
              <View>
                <Text style={styles.companyName}>NIC CHEMICALS (PVT) LTD</Text>
                <Text style={styles.docTitle}>{reportTitle.toUpperCase()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.metaText}>Date: {printDate}</Text>
                <Text style={styles.metaText}>Prepared By: {preparedBy}</Text>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, { flex: 1 }]}>ID</Text>
                {showDate && <Text style={[styles.th, { flex: 1.5 }]}>DATE</Text>}
                {showVendor && <Text style={[styles.th, { flex: 2.5 }]}>VENDOR</Text>}
                <Text style={[styles.th, { flex: 1.5 }]}>TYPE</Text>
                {showStatus && <Text style={[styles.th, { flex: 1.5 }]}>STATUS</Text>}
                <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>AMOUNT (Rs)</Text>
              </View>
              {data.map((item) => (
                <View key={item.id} style={styles.tableDataRow}>
                  <Text style={[styles.td, { flex: 1, fontWeight: 'bold' }]}>{item.id}</Text>
                  {showDate && <Text style={[styles.td, { flex: 1.5 }]}>{item.date}</Text>}
                  {showVendor && <Text style={[styles.td, { flex: 2.5 }]}>{item.vendor}</Text>}
                  <Text style={[styles.td, { flex: 1.5 }]}>{item.type}</Text>
                  {showStatus && <Text style={[styles.td, { flex: 1.5 }]}>{item.status}</Text>}
                  <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>
                    {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.docFooter}>
              <Text style={styles.footerTotalLabel}>Total Amount:</Text>
              <Text style={styles.footerTotalValue}>Rs. {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: theme.colors.surfaceHeader, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceBorder },
  backBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  
  // Updated Print Button Styles
  printBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.cyanGlow, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  printBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  
  splitView: { flex: 1, flexDirection: 'row' },
  designerSidebar: { width: 300, backgroundColor: theme.colors.surface, borderRightWidth: 1, borderRightColor: theme.colors.surfaceBorder, padding: 20 },
  sidebarTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 10, fontSize: 13 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: theme.colors.cyanGlow, borderColor: theme.colors.cyanGlow },
  checkMark: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14 },
  previewArea: { flex: 1 },
  previewContent: { padding: 40, alignItems: 'center' },
  a4Page: { width: 800, minHeight: 1131, backgroundColor: '#FFFFFF', padding: 48, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#1E293B', paddingBottom: 24, marginBottom: 32 },
  companyName: { color: '#0F172A', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  docTitle: { color: '#475569', fontSize: 16, fontWeight: '700', marginTop: 4 },
  metaText: { color: '#334155', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  table: { width: '100%', borderTopWidth: 1, borderTopColor: '#CBD5E1' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 2, borderBottomColor: '#94A3B8' },
  th: { color: '#1E293B', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  tableDataRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  td: { color: '#334155', fontSize: 12 },
  docFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 32, paddingTop: 16, borderTopWidth: 2, borderTopColor: '#1E293B' },
  footerTotalLabel: { color: '#475569', fontSize: 14, fontWeight: '700', marginRight: 16 },
  footerTotalValue: { color: '#0F172A', fontSize: 20, fontWeight: '900', fontVariant: ['tabular-nums'] },
});