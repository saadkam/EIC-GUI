import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { theme } from '../../theme/theme';
import { PrintIcon } from '../../components/common/icons/MenuIcon';
import { print } from 'react-native-unified-print';

interface POPrintProps {
  poData: any; // The payload passed from the form after server success
  onBackToHub: () => void;
}

export const PurchaseOrderPrintScreen: React.FC<POPrintProps> = ({ poData, onBackToHub }) => {
  const [documentTitle, setDocumentTitle] = useState('PURCHASE ORDER');
  const [preparedBy, setPreparedBy] = useState('Admin');
  const [showDescription, setShowDescription] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showUninvoiced, setShowUninvoiced] = useState(true);
  
  const printDate = new Date().toISOString().split('T')[0];

  const triggerPrint = async () => {
    const formattedCompanyAddress = "NIC Chemicals<br/>Plot 111 Sector 27<br/>Korangi industrial area<br/>Karachi Sindh Pakistan, 75400";
    const formattedVendorAddress = poData.vendor?.replace(/\n/g, '<br/>') || 'N/A';

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0F172A; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #1E293B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: 900; margin: 0; }
            .subtitle { font-size: 16px; font-weight: 700; color: #475569; margin-top: 5px; }
            .meta { text-align: right; font-size: 13px; color: #334155; line-height: 1.6; }
            .address-block { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; line-height: 1.5; }
            .address-col { width: 45%; }
            .address-label { font-size: 11px; font-weight: 800; color: #64748B; margin-bottom: 4px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #F1F5F9; border-bottom: 2px solid #94A3B8; text-align: left; padding: 12px 8px; font-size: 12px; }
            td { border-bottom: 1px solid #E2E8F0; padding: 12px 8px; font-size: 13px; }
            .right { text-align: right; }
            .footer { border-top: 2px solid #1E293B; padding-top: 16px; text-align: right; font-size: 20px; font-weight: 900; }
            .notes { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #CBD5E1; font-size: 12px; color: #64748B; }
            
            /* Simple text label */
            .uninvoiced-text { text-align: left; margin-top: 30px; font-size: 13px; font-weight: 700; color: #0f172a; letter-spacing: 1px; }
            @media print {
              .uninvoiced-text {
                text-align: left;
                font-size: 13px;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: 1px;
                
                /* Anchoring properties */
                position: fixed;
                bottom: 0; /* Pushes it to the very bottom */
                left: 0;
                width: 100%; /* Ensures it spans the page width for alignment */
                
                /* Note: Removed margin-bottom: 5vh; as bottom: 0; handles the placement, 
                  but you can use bottom: 1cm; if you need a specific margin from the paper edge */
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">NIC CHEMICALS (PVT) LTD</h1>
              <div class="subtitle">${documentTitle.toUpperCase()}</div>
            </div>
            <div class="meta">
              <div>Date: ${printDate}</div>
              <div>PO Ref: ${poData.id}</div>
              <div>${showUser ? `Prepared By: ${preparedBy}`:''}</div>
            </div>
          </div>
          
          <div class="address-block">
            <div class="address-col">
              <div class="address-label">Company & Ship To:</div>
              <strong>${formattedCompanyAddress}</strong>
            </div>
            <div class="address-col">
              <div class="address-label">Vendor / Supplier:</div>
              <strong>${formattedVendorAddress}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>MATERIAL DESCRIPTION</th>
                <th class="right">QTY</th>
                <th class="right">UNIT PRICE</th>
                <th class="right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${poData.items.map((item: any) => `
                <tr>
                  <td><strong>${item.material}</strong></td>
                  <td class="right">${item.qty}</td>
                  <td class="right">Rs. ${parseFloat(item.price || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td class="right">Rs. ${(parseFloat(item.qty || '0') * parseFloat(item.price || '0')).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <span style="font-size: 14px; color: #475569; margin-right: 15px;">Total Amount:</span>
            Rs. ${poData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>

          ${(showDescription && poData.description) ? `<div class="notes"><strong>Description / Notes:</strong><br/>${poData.description.replace(/\n/g, '<br/>')}</div>` : ''}
          
          ${(!poData.invoiced && showUninvoiced) ? `<div class="uninvoiced-text">UNINVOICED</div>` : ''}
        </body>
      </html>
    `;

    try {
      await print({ html: htmlContent });
    } catch (error) {
      console.error("Failed to execute print job:", error);
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
        <TouchableOpacity onPress={onBackToHub} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back to Hub</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={triggerPrint} style={styles.printBtn}>
          <PrintIcon size={16} />
          <Text style={styles.printBtnText}>Print Document</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.splitView}>
        {/* LEFT PANE: Designer Sidebar */}
        <View style={styles.designerSidebar}>
          <Text style={styles.sidebarTitle}>Document Settings</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Document Title</Text>
            <TextInput style={styles.input} value={documentTitle} onChangeText={setDocumentTitle} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prepared By</Text>
            <TextInput style={styles.input} value={preparedBy} onChangeText={setPreparedBy} />
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>Visible Sections</Text>
          <Checkbox label="Show Notes/Description" value={showDescription} onToggle={() => setShowDescription(!showDescription)} />
          <Checkbox label="Show User" value={showUser} onToggle={() => setShowUser(!showUser)} />
          
          {!poData.invoiced && (
            <Checkbox label="Show 'Uninvoiced' Label" value={showUninvoiced} onToggle={() => setShowUninvoiced(!showUninvoiced)} />
          )}
        </View>

        {/* RIGHT PANE: A4 Preview */}
        <ScrollView style={styles.previewArea} contentContainerStyle={styles.previewContent}>
          <View style={styles.a4Page}>
            
            <View style={styles.docHeader}>
              <View>
                <Text style={styles.companyName}>NIC CHEMICALS (PVT) LTD</Text>
                <Text style={styles.docTitle}>{documentTitle.toUpperCase()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.metaText}>Date: {printDate}</Text>
                <Text style={styles.metaText}>PO Ref: {poData.id}</Text>
                {showUser && (
                  <Text style={styles.metaText}>Prepared By: {preparedBy}</Text>
                )}
              </View>
            </View>

            <View style={styles.addressBlock}>
              <View style={styles.addressCol}>
                <Text style={styles.addressLabel}>Company & Ship To:</Text>
                <Text style={styles.addressValue}>NIC Chemicals</Text>
                <Text style={styles.addressValue}>Plot 111 Sector 27</Text>
                <Text style={styles.addressValue}>Korangi industrial area</Text>
                <Text style={styles.addressValue}>Karachi Sindh Pakistan, 75400</Text>
              </View>
              <View style={styles.addressCol}>
                <Text style={styles.addressLabel}>Vendor / Supplier:</Text>
                <Text style={styles.addressValue}>{poData.vendor || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, { flex: 3 }]}>MATERIAL DESCRIPTION</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>QTY</Text>
                <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>UNIT PRICE</Text>
                <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>TOTAL</Text>
              </View>

              {poData.items.map((item: any, index: number) => (
                <View key={index} style={styles.tableDataRow}>
                  <Text style={[styles.td, { flex: 3, fontWeight: 'bold' }]}>{item.material}</Text>
                  <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{item.qty}</Text>
                  <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>
                    Rs. {parseFloat(item.price || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>
                    Rs. {(parseFloat(item.qty || '0') * parseFloat(item.price || '0')).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.docFooter}>
              <Text style={styles.footerTotalLabel}>Total Amount:</Text>
              <Text style={styles.footerTotalValue}>Rs. {poData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>

            {(showDescription && poData.description) ? (
              <View style={styles.docNotes}>
                <Text style={styles.addressLabel}>Description / Notes:</Text>
                <Text style={styles.td}>{poData.description}</Text>
              </View>
            ) : null}

            {/* Render the Uninvoiced label aligned to the bottom left */}
            {(!poData.invoiced && showUninvoiced) ? (
              <Text style={styles.uninvoicedText}>UNINVOICED</Text>
            ) : null}

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
  
  addressBlock: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  addressCol: { flex: 1 },
  addressLabel: { color: '#64748B', fontSize: 11, fontWeight: '800', marginBottom: 6, textTransform: 'uppercase' },
  addressValue: { color: '#0F172A', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  
  table: { width: '100%', borderTopWidth: 1, borderTopColor: '#CBD5E1' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 2, borderBottomColor: '#94A3B8' },
  th: { color: '#1E293B', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  tableDataRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  td: { color: '#334155', fontSize: 13 },
  
  docFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 32, paddingTop: 16, borderTopWidth: 2, borderTopColor: '#1E293B' },
  footerTotalLabel: { color: '#475569', fontSize: 14, fontWeight: '700', marginRight: 16 },
  footerTotalValue: { color: '#0F172A', fontSize: 20, fontWeight: '900', fontVariant: ['tabular-nums'] },
  
  docNotes: { marginTop: 40, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', borderStyle: 'dashed' },

  uninvoicedText: { marginTop: 30, color: '#0f172a', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});