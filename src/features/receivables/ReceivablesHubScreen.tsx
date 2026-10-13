import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { GlobalFilterBar, DateFilterType } from '../../components/common/GlobalFilterBar';
// Reusing the table structure, mapping 'vendor' field to 'customer' for sales
import { ProcurementTable as SalesTable, ProcurementEntry as SalesEntry } from '../procurement/components/ProcurementTable'; 
import { ReceivablesKPICards } from './components/ReceivablesKPICards';
// Sub-screens to build next
import { CreditVoucherScreen } from './CreditVoucherScreen';
// import { ReceivablesReportScreen } from './ReceivablesReportScreen';

const MOCK_RECEIVABLES_DATA: SalesEntry[] = [
  { id: 'SO-UNINV-1042', date: '2026-10-05', vendor: 'Crescent Textiles', type: 'Sales Order', amount: 125000.00, status: 'Unpaid' },
  { id: 'SO-UNINV-1045', date: '2026-10-08', vendor: 'Pioneer Plastics', type: 'Sales Order', amount: 450000.00, status: 'Partial' },
  { id: 'CV-4001', date: '2026-10-09', vendor: 'Crescent Textiles', type: 'Credit Voucher', amount: 125000.00, status: 'Paid' },
  { id: 'CV-4002', date: '2026-10-10', vendor: 'National Foods', type: 'Credit Voucher', amount: 85000.00, status: 'Paid' },
  { id: 'SO-45545', date: '2026-10-11', vendor: 'Something Foods', type: 'Credit Voucher', amount: 100000.00, status: 'Paid' },
];

type ReceivablesTab = 'All' | 'Uninvoiced' | 'Invoiced';
const RECEIVABLES_TABS = ['All', 'Uninvoiced', 'Invoiced'] as const;

type ViewState = 'list' | 'voucher-form' | 'report';

export default function ReceivablesHubScreen() {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<SalesEntry | null>(null);
  
  // Filter States
  const [activeTab, setActiveTab] = useState<ReceivablesTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_RECEIVABLES_DATA.filter((item) => {
      const isUninvoiced = item.id.includes('UNINV');
      if (activeTab === 'Uninvoiced' && !isUninvoiced) return false;
      if (activeTab === 'Invoiced' && isUninvoiced) return false;

      // Grouped Unpaid and Partial filter logic
      if (activeStatus === 'Unpaid/Partial') {
        if (item.status !== 'Unpaid' && item.status !== 'Partial') return false;
      } else if (activeStatus !== 'All' && item.status !== activeStatus) {
        return false;
      }
      
      const query = searchQuery.toLowerCase();
      // 'vendor' represents 'customer' in this shared structure
      const matchesSearch = item.id.toLowerCase().includes(query) || item.vendor.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      const itemDate = new Date(item.date);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;

      return true;
    });
  }, [activeTab, searchQuery, activeStatus, startDate, endDate]);

  const handleRowPress = (item: SalesEntry) => {
    setSelectedItem(item);
    setCurrentView('voucher-form');
  };

  const navigateToList = () => {
    setCurrentView('list');
    setSelectedItem(null);
  };

  if (currentView === 'voucher-form') {
    return <CreditVoucherScreen initialData={selectedItem} onBack={navigateToList} />;
  }
  
  // if (currentView === 'report') {
  //   return <ReceivablesReportScreen data={filteredData} onBack={navigateToList} />;
  // }

  // Dynamic KPI Calculations based on FILTERED data
  const pendingSoCount = filteredData.filter(item => item.type === 'Sales Order').length;
  
  const invoicedAmount = filteredData
    .filter(item => !item.id.includes('UNINV'))
    .reduce((sum, item) => sum + item.amount, 0);

  const outstandingAmount = filteredData
    .filter(item => item.status === 'Unpaid' || item.status === 'Partial')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Accounts Receivable</Text>
        <Text style={styles.subtitle}>Inbound Cash Flow & Customer Invoices</Text>
      </View>

      <ReceivablesKPICards 
        pendingSoCount={pendingSoCount} 
        invoicedAmount={invoicedAmount} 
        outstandingAmount={outstandingAmount} 
      />

      <GlobalFilterBar<ReceivablesTab>
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by SO/CV Ref or Customer..."
        tabs={RECEIVABLES_TABS}
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
            label: '+ Direct Credit Voucher',
            onPress: () => { setSelectedItem(null); setCurrentView('voucher-form'); },
            buttonStyle: { backgroundColor: theme.colors.cyanGlow } // Cyan/Blue denotes cash in
          }
        ]}
      />

      <SalesTable data={filteredData} onRowPress={handleRowPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 20, zIndex: 1 },
  headerContainer: { marginBottom: 20, zIndex: 1 },
  screenTitle: { fontSize: theme.typography.fontSizeXl, fontWeight: 'bold', color: theme.colors.textPrimary },
  subtitle: { fontSize: theme.typography.fontSizeMd, color: theme.colors.textMuted, marginTop: 4 },
});