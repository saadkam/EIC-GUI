import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { GlobalFilterBar, DateFilterType } from '../../components/common/GlobalFilterBar';
import { ProcurementTable, ProcurementEntry } from '../procurement/components/ProcurementTable'; 
import { PayablesKPICards } from './components/PayablesKPICards';
import { PayablesReportScreen } from './PayablesReportScreen';
import { DebitVoucherScreen } from './DebitVoucherScreen';

const MOCK_PAYABLES_DATA: ProcurementEntry[] = [
  { id: 'PO-GRNI-0043', date: '2026-09-25', vendor: 'Logistics Pro', type: 'Purchase Order', amount: 15000.00, status: 'Unpaid' },
  { id: 'PO-GRNI-0044', date: '2026-09-28', vendor: 'Alpha Solvents', type: 'Purchase Order', amount: 88000.00, status: 'Partial' },
  { id: 'DV-1089', date: '2026-09-30', vendor: 'Logistics Pro', type: 'Debit Voucher', amount: 15000.00, status: 'Paid' },
  { id: 'DV-1090', date: '2026-10-02', vendor: 'K-Electric (Utility)', type: 'Debit Voucher', amount: 45000.00, status: 'Paid' },
];

type PayablesTab = 'All' | 'Uninvoiced' | 'Invoiced';
const PAYABLES_TABS = ['All', 'Uninvoiced', 'Invoiced'] as const;

type ViewState = 'list' | 'voucher-form' | 'report';

export default function PayablesHubScreen() {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<ProcurementEntry | null>(null);
  
  // Filter States
  const [activeTab, setActiveTab] = useState<PayablesTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_PAYABLES_DATA.filter((item) => {
      const isUninvoiced = item.id.includes('GRNI');
      if (activeTab === 'Uninvoiced' && !isUninvoiced) return false;
      if (activeTab === 'Invoiced' && isUninvoiced) return false;

      // Grouped Unpaid and Partial filter logic
      if (activeStatus === 'Unpaid/Partial') {
        if (item.status !== 'Unpaid' && item.status !== 'Partial') return false;
      } else if (activeStatus !== 'All' && item.status !== activeStatus) {
        return false;
      }
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.id.toLowerCase().includes(query) || item.vendor.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      const itemDate = new Date(item.date);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;

      return true;
    });
  }, [activeTab, searchQuery, activeStatus, startDate, endDate]);

  const handleRowPress = (item: ProcurementEntry) => {
    setSelectedItem(item);
    setCurrentView('voucher-form');
  };

  const navigateToList = () => {
    setCurrentView('list');
    setSelectedItem(null);
  };

  // Sub-Screen View Switcher
  if (currentView === 'voucher-form') {
    return (
      <DebitVoucherScreen 
        initialData={selectedItem} 
        onBack={navigateToList} 
      />
    );
  }

  if (currentView === 'report') {
    return (
      <PayablesReportScreen
        data={filteredData}
        onBack={navigateToList}
      />
    );
  }

  // Dynamic KPI Calculations based on FILTERED data
  const payablePoCount = filteredData.filter(item => item.type === 'Purchase Order').length;
  
  const invoicedAmount = filteredData
    .filter(item => !item.id.includes('GRNI'))
    .reduce((sum, item) => sum + item.amount, 0);

  const outstandingAmount = filteredData
    .filter(item => item.status === 'Unpaid' || item.status === 'Partial')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Accounts Payable</Text>
        <Text style={styles.subtitle}>Outbound Cash Flow & Vendor Liabilities</Text>
      </View>

      <PayablesKPICards 
        payablePoCount={payablePoCount} 
        invoicedAmount={invoicedAmount} 
        outstandingAmount={outstandingAmount} 
      />

      <GlobalFilterBar<PayablesTab>
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by PO/DV Ref or Payee..."
        tabs={PAYABLES_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusOptions={['All', 'Unpaid/Partial', 'Paid']}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        startDate={startDate}
        endDate={endDate}
        onCustomRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onPrintReport={() => setCurrentView('report')}
        actions={[
          {
            label: '+ Direct Debit Voucher',
            onPress: () => { setSelectedItem(null); setCurrentView('voucher-form'); },
            buttonStyle: { backgroundColor: theme.colors.pinkGlow }
          }
        ]}
      />

      <ProcurementTable data={filteredData} onRowPress={handleRowPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 20, zIndex: 1 },
  headerContainer: { marginBottom: 20, zIndex: 1 },
  screenTitle: { fontSize: theme.typography.fontSizeXl, fontWeight: 'bold', color: theme.colors.textPrimary },
  subtitle: { fontSize: theme.typography.fontSizeMd, color: theme.colors.textMuted, marginTop: 4 },
});