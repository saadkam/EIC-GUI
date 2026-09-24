import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { print } from 'react-native-unified-print';
import { theme } from '../../theme/theme';
import { FormulationItem } from './CostingTable';
import { PrintIcon } from '../../components/common/icons/MenuIcon';

interface Props {
  data: FormulationItem[];
  yieldWeight: number;
  totalCost: number;
  totalInputQty: number;
  finalUnitCost: number;
  onBack: () => void;
}

export const CostingReportScreen: React.FC<Props> = ({ 
  data, yieldWeight, totalCost, totalInputQty, finalUnitCost, onBack 
}) => {
  const [reportTitle, setReportTitle] = useState('Formulation Costing Report');
  const [preparedBy, setPreparedBy] = useState('Saad');
  
  const [showPercentages, setShowPercentages] = useState(true);
  const [showUnitPrice, setShowUnitPrice] = useState(true);

  const printDate = new Date().toISOString().split('T')[0];

  const triggerPrint = async () => {
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
            .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 2px solid #1E293B; padding-top: 16px; }
            .metric-box { background: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px solid #E2E8F0; }
            .metric-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .metric-label { font-size: 12px; color: #64748B; font-weight: 700; text-transform: uppercase; }
            .metric-value { font-size: 14px; font-weight: 900; color: #0F172A; }
            .metric-highlight { font-size: 24px; color: #059669; font-weight: 900; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title" style="color: #059669;">NIC CHEMICALS (PVT) LTD</h1>
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
                <th>MATERIAL</th>
                <th class="right">QTY</th>
                ${showUnitPrice ? '<th class="right">UNIT PRICE</th>' : ''}
                <th class="right">TOTAL (Rs)</th>
                ${showPercentages ? '<th class="right">%</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${data.map(item => {
                const itemTotal = item.qty * item.unitPrice;
                const pct = totalInputQty > 0 ? ((item.qty / totalInputQty) * 100).toFixed(2) : '0.00';
                return `
                <tr>
                  <td><b>${item.material}</b></td>
                  <td class="right">${item.qty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>${showUnitPrice ? `<td class="right">${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>` : ''}
                  <td class="right">${itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>${showPercentages ? `<td class="right">${pct}%</td>` : ''}
                </tr>
              `}).join('')}
            </tbody>
          </table>
          <div class="footer-grid">
            <div class="metric-box">
              <div class="metric-row">
                <span class="metric-label">Total Input Mass</span>
                <span class="metric-value">${totalInputQty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div class="metric-row" style="border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px;">
                <span class="metric-label">Actual Yield (Weight)</span>
                <span class="metric-value">${yieldWeight > 0 ? yieldWeight.toLocaleString('en-US', { minimumFractionDigits: 2 }) : totalInputQty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div class="metric-box" style="text-align: right;">
              <div class="metric-label">Total Batch Cost</div>
              <div class="metric-value" style="font-size: 16px;">Rs. ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div class="metric-label" style="margin-top: 16px; color: #059669;">Final Unit Cost</div>
              <div class="metric-highlight">Rs. ${finalUnitCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await print({ html: htmlContent });
    } catch (error) {
      console.error("Print execution failed:", error);
    }
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
          <Text style={styles.backBtnText}>← Back to Formulation</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={triggerPrint} style={styles.printBtn}>
          <PrintIcon size={16} />
          <Text style={styles.printBtnText}>Print Costing</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.splitView}>
        <View style={styles.designerSidebar}>
          <Text style={styles.sidebarTitle}>Report Settings</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Title</Text>
            <TextInput 
              style={styles.input} 
              value={reportTitle} 
              onChangeText={setReportTitle}
              cursorColor={theme.colors.cyanGlow}
              selectionColor="rgba(6, 182, 212, 0.3)" 
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepared By</Text>
            <TextInput 
              style={styles.input} 
              value={preparedBy} 
              onChangeText={setPreparedBy}
              cursorColor={theme.colors.cyanGlow}
              selectionColor="rgba(6, 182, 212, 0.3)" 
            />
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>Visible Columns</Text>
          <Checkbox label="Percentages (%)" value={showPercentages} onToggle={() => setShowPercentages(!showPercentages)} />
          <Checkbox label="Unit Prices" value={showUnitPrice} onToggle={() => setShowUnitPrice(!showUnitPrice)} />
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
                <Text style={[styles.th, { flex: 2 }]}>MATERIAL</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>QTY</Text>
                {showUnitPrice && <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>UNIT PRICE</Text>}
                <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>TOTAL (Rs)</Text>
                {showPercentages && <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>%</Text>}
              </View>
              {data.map((item) => {
                const itemTotal = item.qty * item.unitPrice;
                const pct = totalInputQty > 0 ? ((item.qty / totalInputQty) * 100).toFixed(2) : '0.00';
                return (
                  <View key={item.id} style={styles.tableDataRow}>
                    <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]}>{item.material}</Text>
                    <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{item.qty}</Text>
                    {showUnitPrice && <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{item.unitPrice}</Text>}
                    <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                    {showPercentages && <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{pct}%</Text>}
                  </View>
                );
              })}
            </View>

            <View style={styles.docFooter}>
              <View style={styles.metricBlock}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 6 }}>
                  <Text style={styles.metricLabel}>Total Input Mass</Text>
                  <Text style={styles.metricValue}>{totalInputQty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
                  <Text style={styles.metricLabel}>Actual Yield (Weight)</Text>
                  <Text style={styles.metricValue}>
                    {yieldWeight > 0 ? yieldWeight.toLocaleString('en-US', { minimumFractionDigits: 2 }) : totalInputQty.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
              <View style={[styles.metricBlock, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                <Text style={styles.metricLabel}>Final Unit Cost</Text>
                <Text style={[styles.metricValue, { color: '#059669', fontSize: 24, paddingTop: 8 }]}>
                  Rs. {finalUnitCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
              </View>
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
  backBtn: { padding: 12, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surfaceBorder },
  backBtnText: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  printBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.cyanGlow, padding: 12, borderRadius: 8 },
  printBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  splitView: { flex: 1, flexDirection: 'row' },
  designerSidebar: { width: 300, backgroundColor: theme.colors.surface, borderRightWidth: 1, borderRightColor: theme.colors.surfaceBorder, padding: 20 },
  sidebarTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 24 },
  inputGroup: { paddingBottom: 20 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', paddingBottom: 8 },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 12, fontSize: 13 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 20 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, gap: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: theme.colors.cyanGlow, borderColor: theme.colors.cyanGlow },
  checkMark: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14 },
  previewArea: { flex: 1 },
  previewContent: { padding: 40, alignItems: 'center' },
  a4Page: { width: 800, minHeight: 1131, backgroundColor: '#FFFFFF', padding: 48, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#1E293B', paddingBottom: 24, marginBottom: 32 },
  companyName: { color: '#059669', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  docTitle: { color: '#475569', fontSize: 16, fontWeight: '700', paddingTop: 4 },
  metaText: { color: '#334155', fontSize: 13, fontWeight: '500', paddingBottom: 4 },
  table: { width: '100%', borderTopWidth: 1, borderTopColor: '#CBD5E1' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 2, borderBottomColor: '#94A3B8' },
  th: { color: '#1E293B', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  tableDataRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  td: { color: '#334155', fontSize: 12 },
  docFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', marginTop: 32, paddingTop: 16, borderTopWidth: 2, borderTopColor: '#1E293B' },
  metricBlock: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', flex: 1, marginHorizontal: 8 },
  metricLabel: { color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  metricValue: { color: '#0F172A', fontSize: 14, fontWeight: '900' },
});