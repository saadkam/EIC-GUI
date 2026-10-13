import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { theme } from '../../theme/theme';
import { PrintIcon } from '../../components/common/icons/MenuIcon';
import { print } from 'react-native-unified-print';
import { CompanyLogoIcon, RAW_COMPANY_LOGO_SVG } from '../../assets/CompanyLogo'; 

interface VoucherPrintProps {
  voucherData: any; 
  onBack: () => void;
}

const numberToWords = (num: number) => {
  if (!num) return '';
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  
  if ((num = num.toString()).length > 9) return 'Overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; 
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() + ' Only';
};

export const CreditVoucherPrintScreen: React.FC<VoucherPrintProps> = ({ voucherData, onBack }) => {
  const creditTo = voucherData.creditTo || 'Accounts Receivable';
  const [accountCode, setAccountCode] = useState(voucherData.accountCode || '');
  
  const isCash = voucherData.paymentMethod === 'Cash';
  const isBank = voucherData.paymentMethod === 'Bank Transfer';

  const defaultRefLabel = isBank ? 'BANK A/C :' : 'CHEQUE NO :';
  const defaultRefValue = isBank ? (voucherData.iban || '') : (voucherData.chequeNo || '');

  const [refValue, setRefValue] = useState(defaultRefValue);
  
  const [showItemDetails, setShowItemDetails] = useState(true);

  const displayDescription = showItemDetails && voucherData.itemsSummary
    ? `${voucherData.baseDescription || voucherData.description}\nItems: ${voucherData.itemsSummary}`
    : (voucherData.baseDescription || voucherData.description || '');

  const amountNum = parseFloat(voucherData.amount || '0');
  const rs = Math.floor(amountNum);
  const np = Math.round((amountNum % 1) * 100);
  const amountInWords = numberToWords(rs).toUpperCase();

  const triggerPrint = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            @page { size: A5 landscape; margin: 10mm; }
            body { font-family: Arial, sans-serif; color: #000; max-width: 96%; margin: 0 auto; line-height: 1.4; font-size: 13px; box-sizing: border-box; }
            
            .top-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
            .logo-section { width: 200px; }
            .logo-container { width: 100px; height: 65px; margin-bottom: 5px; }
            .logo-container svg { width: 100%; height: 100%; display: block; }
            
            .header-text { text-align: right; position: relative; }
            .company-name { font-size: 20px; font-weight: 900; letter-spacing: 1px; margin-bottom: 2px; color: #000; }
            .doc-title { font-size: 15px; font-weight: bold; letter-spacing: 2px; }
            .internal-label { position: absolute; right: 0; top: 100%; margin-top: 4px; font-size: 11px; font-weight: bold; letter-spacing: 4px; color: #64748B; }
            
            .parallel-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .left-col { flex: 1; padding-right: 20px; }
            .right-col { width: 220px; }
            
            .line-group { display: flex; align-items: flex-end; margin-bottom: 12px; }
            .line-group.align-top { align-items: flex-start; }
            
            .label { font-weight: bold; margin-right: 8px; white-space: nowrap; font-size: 12px; text-transform: uppercase; }
            .label-top { padding-top: 5px; } 
            
            .line { flex-grow: 1; border-bottom: 1px solid #000; min-height: 18px; padding-left: 8px; font-family: monospace; font-size: 13px; display: flex; align-items: flex-end; }
            .short-line { width: 120px; flex-grow: 0; }
            
            .multi-line-container { flex: 1; position: relative; }
            .lines-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; z-index: 1; }
            .bg-line { flex: 1; border-bottom: 1px solid #000; }
            .multi-line-text { position: relative; z-index: 2; line-height: 25px; font-family: monospace; font-size: 13px; padding-left: 8px; margin: 0; padding-top: 4px; color: #000; white-space: pre-wrap; }
            
            .bottom-ref-amount { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 15px; margin-bottom: 55px; }
            .ref-block { padding-top: 6px; }
            .amount-matrix { border-collapse: collapse; width: 180px; text-align: center; }
            .amount-matrix th, .amount-matrix td { border: 1px solid #000; padding: 6px; font-weight: bold; }
            .amount-matrix th { font-size: 11px; }
            
            .signatures { display: flex; justify-content: space-between; margin-top: 25px; }
            .sig-line { width: 25%; text-align: center; border-top: 1px solid #000; padding-top: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          </style>
        </head>
        <body>
          
          <div class="top-header">
            <div class="logo-section">
              <div class="logo-container">
                ${RAW_COMPANY_LOGO_SVG}
              </div>
              <div class="line-group" style="margin-bottom: 0;">
                <div class="label">NO</div>
                <div class="line" style="width: 100px; flex-grow: 0;">${voucherData.id || ''}</div>
              </div>
            </div>
            
            <div class="header-text">
              <div class="company-name">NIC CHEMICALS (PRIVATE) LIMITED</div>
              <div class="doc-title">CREDIT VOUCHER</div>
              ${!voucherData.isTaxLogged ? `<div class="internal-label">INTERNAL</div>` : ''}
            </div>
          </div>

          <div class="parallel-row">
            <div class="left-col">
              <div class="line-group" style="margin-bottom: 0;">
                <div class="label">CREDIT TO</div>
                <div class="line">${creditTo}${accountCode ? ` &nbsp;&nbsp;(A/C: ${accountCode})` : ''}</div>
              </div>
            </div>
            
            <div class="right-col">
              <div class="line-group" style="justify-content: flex-end; margin-bottom: 0;">
                <div class="label">DATE :</div>
                <div class="line short-line">${voucherData.date || ''}</div>
              </div>
            </div>
          </div>

          <div class="line-group">
            <div class="label">RECEIVED FROM</div>
            <div class="line">${voucherData.payer || ''}</div>
          </div>

          <div class="line-group align-top">
            <div class="label label-top">ON ACCOUNT OF</div>
            <div class="multi-line-container" style="height: 75px;">
              <div class="lines-bg">
                <div class="bg-line"></div>
                <div class="bg-line"></div>
                <div class="bg-line"></div>
              </div>
              <div class="multi-line-text">${displayDescription}</div>
            </div>
          </div>

          <div class="line-group align-top" style="margin-bottom: 5px;">
            <div class="label label-top">RUPEES</div>
            <div class="multi-line-container" style="height: 50px;">
              <div class="lines-bg">
                <div class="bg-line"></div>
                <div class="bg-line"></div>
              </div>
              <div class="multi-line-text">${amountInWords}</div>
            </div>
          </div>

          <div class="bottom-ref-amount">
            <div class="ref-block">
              ${isCash ? `
                <div style="font-weight: bold; font-size: 13px; letter-spacing: 1px; text-align: left;">*** RECEIVED IN CASH ***</div>
              ` : `
                <div class="line-group" style="margin-bottom: 0; width: 300px;">
                  <div class="label">${defaultRefLabel}</div>
                  <div class="line" style="flex-grow: 1;">${refValue}</div>
                </div>
              `}
            </div>
            
            <table class="amount-matrix">
              <tr>
                <th style="width: 70%;">RS</th>
                <th style="width: 30%;">NP</th>
              </tr>
              <tr>
                <td>${rs.toLocaleString('en-US')}</td>
                <td>${np === 0 ? '00' : np}</td>
              </tr>
            </table>
          </div>

          <div class="signatures">
            <div class="sig-line">PAYER SIGNATURE</div>
            <div class="sig-line">ACCOUNT</div>
            <div class="sig-line">DIRECTOR / G.M</div>
          </div>

        </body>
      </html>
    `;

    try {
      await print({ html: htmlContent });
    } catch (error) {
      console.error("Failed to execute print job:", error);
    }
  };

  const Checkbox = ({ label, value, onToggle, disabled = false }: { label: string, value: boolean, onToggle: () => void, disabled?: boolean }) => (
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
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back to Form</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={triggerPrint} style={styles.printBtn}>
          <PrintIcon size={16} />
          <Text style={styles.printBtnText}>Print A5 Receipt</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.splitView}>
        <View style={styles.designerSidebar}>
          <Text style={styles.sidebarTitle}>Print Settings</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>A/C (Ledger Code)</Text>
            <TextInput style={styles.input} value={accountCode} onChangeText={setAccountCode} placeholder="e.g. 1010" placeholderTextColor="#666" />
          </View>

          {!isCash && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{isBank ? 'Bank Account / IBAN' : 'Cheque Number'}</Text>
              <TextInput style={styles.input} value={refValue} onChangeText={setRefValue} />
            </View>
          )}

          <View style={styles.divider} />
          
          <Checkbox 
            label="Include SO Item Summary" 
            value={showItemDetails} 
            onToggle={() => setShowItemDetails(!showItemDetails)}
            disabled={!voucherData.itemsSummary || voucherData.itemsSummary === ''}
          />

        </View>

        <ScrollView style={styles.previewArea} contentContainerStyle={styles.previewContent}>
          <View style={styles.a5LandscapePage}>
            
            <View style={styles.topHeader}>
              <View style={styles.logoSection}>
                <CompanyLogoIcon size={75} />
                <View style={[styles.lineGroup, { marginBottom: 0, marginTop: 4 }]}>
                  <Text style={styles.labelText}>NO</Text>
                  <View style={[styles.line, { width: 100, flex: 0 }]}><Text style={styles.lineText}>{voucherData.id}</Text></View>
                </View>
              </View>
              
              <View style={styles.headerTextRight}>
                <Text style={styles.companyName}>NIC CHEMICALS (PRIVATE) LIMITED</Text>
                <Text style={styles.docTitle}>CREDIT VOUCHER</Text>
                {!voucherData.isTaxLogged && (
                  <Text style={styles.internalLabel}>INTERNAL</Text>
                )}
              </View>
            </View>

            <View style={styles.parallelRow}>
              <View style={styles.leftCol}>
                <View style={[styles.lineGroup, { marginBottom: 0 }]}>
                  <Text style={styles.labelText}>CREDIT TO</Text>
                  <View style={styles.line}>
                    <Text style={styles.lineText}>
                      {creditTo} {accountCode ? ` (A/C: ${accountCode})` : ''}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.rightCol}>
                <View style={[styles.lineGroup, { justifyContent: 'flex-end', marginBottom: 0 }]}>
                  <Text style={styles.labelText}>DATE :</Text>
                  <View style={[styles.line, styles.shortLine]}><Text style={styles.lineText}>{voucherData.date}</Text></View>
                </View>
              </View>
            </View>

            <View style={styles.lineGroup}>
              <Text style={styles.labelText}>RECEIVED FROM</Text>
              <View style={styles.line}><Text style={styles.lineText}>{voucherData.payer}</Text></View>
            </View>

            <View style={[styles.lineGroup, styles.alignTop]}>
              <Text style={[styles.labelText, styles.labelTop]}>ON ACCOUNT OF</Text>
              <View style={[styles.multiLineContainer, { height: 75 }]}>
                <View style={styles.linesBg}>
                  <View style={styles.bgLine} />
                  <View style={styles.bgLine} />
                  <View style={styles.bgLine} />
                </View>
                <Text style={styles.multiLineText}>{displayDescription}</Text>
              </View>
            </View>

            <View style={[styles.lineGroup, styles.alignTop, { marginBottom: 5 }]}>
              <Text style={[styles.labelText, styles.labelTop]}>RUPEES</Text>
              <View style={[styles.multiLineContainer, { height: 50 }]}>
                <View style={styles.linesBg}>
                  <View style={styles.bgLine} />
                  <View style={styles.bgLine} />
                </View>
                <Text style={styles.multiLineText}>{amountInWords}</Text>
              </View>
            </View>

            <View style={styles.bottomRefAmount}>
              <View style={styles.refBlock}>
                {isCash ? (
                  <Text style={styles.cashStamp}>*** RECEIVED IN CASH ***</Text>
                ) : (
                  <View style={[styles.lineGroup, { marginBottom: 0, width: 300 }]}>
                    <Text style={styles.labelText}>{defaultRefLabel}</Text>
                    <View style={styles.line}><Text style={styles.lineText}>{refValue}</Text></View>
                  </View>
                )}
              </View>

              <View style={styles.amountMatrix}>
                <View style={styles.matrixHeader}>
                  <Text style={[styles.matrixCell, { flex: 2, fontWeight: 'bold' }]}>RS</Text>
                  <Text style={[styles.matrixCell, { flex: 1, fontWeight: 'bold' }]}>NP</Text>
                </View>
                <View style={styles.matrixRow}>
                  <Text style={[styles.matrixCell, { flex: 2 }]}>{Math.floor(parseFloat(voucherData.amount || '0')).toLocaleString('en-US')}</Text>
                  <Text style={[styles.matrixCell, { flex: 1 }]}>{Math.round((parseFloat(voucherData.amount || '0') % 1) * 100) || '00'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.signatures}>
              <View style={styles.sigLine}><Text style={styles.sigText}>PAYER SIGNATURE</Text></View>
              <View style={styles.sigLine}><Text style={styles.sigText}>ACCOUNT</Text></View>
              <View style={styles.sigLine}><Text style={styles.sigText}>DIRECTOR / G.M</Text></View>
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
  printBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.cyanGlow, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  printBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  
  splitView: { flex: 1, flexDirection: 'row' },
  designerSidebar: { width: 300, backgroundColor: theme.colors.surface, borderRightWidth: 1, borderRightColor: theme.colors.surfaceBorder, padding: 20 },
  sidebarTitle: { color: '#06B6D4', fontSize: 18, fontWeight: 'bold', marginBottom: 24, textTransform: 'uppercase' },
  inputGroup: { marginBottom: 20 },
  label: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: theme.colors.glassInput, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.surfaceBorder, borderRadius: 8, padding: 10, fontSize: 13 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceBorder, marginVertical: 24 },
  
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.glassInput, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#06B6D4', borderColor: '#06B6D4' },
  checkMark: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  checkboxLabel: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '500' },
  
  previewArea: { flex: 1 },
  previewContent: { padding: 40, alignItems: 'center' },
  a5LandscapePage: { width: 750, minHeight: 529, backgroundColor: '#FFFFFF', padding: 35, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  logoSection: { width: 220 },
  headerTextRight: { alignItems: 'flex-end', position: 'relative' },
  companyName: { color: '#000', fontSize: 19, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  docTitle: { color: '#000', fontSize: 15, fontWeight: 'bold', letterSpacing: 2 },
  internalLabel: { position: 'absolute', top: '100%', right: 0, marginTop: 4, color: '#64748B', fontSize: 11, fontWeight: 'bold', letterSpacing: 4 },
  
  parallelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  leftCol: { flex: 1, paddingRight: 20 },
  rightCol: { width: 220 },
  
  lineGroup: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  alignTop: { alignItems: 'flex-start' },
  labelText: { color: '#000', fontSize: 11, fontWeight: 'bold', marginRight: 8, textTransform: 'uppercase' },
  labelTop: { paddingTop: 6 },
  
  line: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', minHeight: 18, paddingHorizontal: 5, justifyContent: 'flex-end' },
  shortLine: { width: 120, flex: 0 },
  lineText: { color: '#000', fontSize: 12, fontFamily: 'monospace', paddingBottom: 2 },
  
  multiLineContainer: { flex: 1, position: 'relative' },
  linesBg: { ...StyleSheet.absoluteFillObject, flexDirection: 'column', zIndex: 1 },
  bgLine: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#000' },
  multiLineText: { position: 'relative', zIndex: 2, lineHeight: 25, fontSize: 12, fontFamily: 'monospace', paddingLeft: 8, paddingTop: 4, color: '#000' },

  bottomRefAmount: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 15, marginBottom: 55 },
  refBlock: { paddingTop: 6 },
  cashStamp: { color: '#000', fontSize: 13, fontWeight: 'bold', letterSpacing: 1, textAlign: 'left' },

  amountMatrix: { width: 170, borderWidth: 1, borderColor: '#000' },
  matrixHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  matrixRow: { flexDirection: 'row' },
  matrixCell: { paddingVertical: 6, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center', color: '#000', fontSize: 12 },
  
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  sigLine: { width: '28%', borderTopWidth: 1, borderTopColor: '#000', paddingTop: 6, alignItems: 'center' },
  sigText: { color: '#000', fontSize: 11, fontWeight: 'bold' },
});