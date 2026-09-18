import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementKPICards } from './components/ProcurementKPICards';
import { ProcurementTable, ProcurementEntry } from './components/ProcurementTable';
import { GlobalFilterBar, DateFilterType } from '../../components/common/GlobalFilterBar';
import { ReportDesignerScreen } from '../reports/ReportDesignerScreen';
// Full-Screen Views
import { PurchaseOrderScreen } from './PurchaseOrderScreen';
import { ProcurementReportScreen } from './ProcurementReportScreen';
// import { DebitVoucherScreen } from './DebitVoucherScreen';

const MOCK_DATA: ProcurementEntry[] = [
  { id: 'PO-1042', date: '2026-09-10', vendor: 'NIC Chemicals', type: 'Purchase Order', amount: 125000.00, status: 'Approved' },
  { id: 'DV-089', date: '2026-08-11', vendor: 'Logistics Pro', type: 'Debit Voucher', amount: 15000.00, status: 'Paid' },
  { id: 'PO-1043', date: '2026-07-12', vendor: 'Soya Extracts Ltd', type: 'Purchase Order', amount: 45000.00, status: 'Draft' },
  { id: 'PO-1044', date: '2025-11-20', vendor: 'Alpha Solvents', type: 'Purchase Order', amount: 88000.00, status: 'Pending' },
];

type ProcurementTab = 'All' | 'Purchase Orders' | 'Debit Vouchers';
const PROCUREMENT_TABS = ['All', 'Purchase Orders', 'Debit Vouchers'] as const;

type ViewState = 'list' | 'po-form' | 'voucher-form' | 'report';

export default function ProcurementHubScreen() {
  // Local Screen Router
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<ProcurementEntry | null>(null);

  // Filter States
  const [activeTab, setActiveTab] = useState<ProcurementTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      // FIX: Map the plural tab name to the singular item.type string
      if (activeTab !== 'All') {
        const expectedType = activeTab === 'Purchase Orders' ? 'Purchase Order' : 'Debit Voucher';
        if (item.type !== expectedType) return false;
      }

      if (activeStatus !== 'All' && item.status !== activeStatus) return false;
      
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
    setCurrentView(item.type === 'Purchase Order' ? 'po-form' : 'voucher-form');
  };

  const navigateToList = () => {
    setCurrentView('list');
    setSelectedItem(null);
  };

  // Sub-Screen View Switcher
  if (currentView === 'po-form') {
    return <PurchaseOrderScreen initialData={selectedItem} onBack={navigateToList} />;
  }
  if (currentView === 'report') {
    return <ReportDesignerScreen onBack={navigateToList} />;
    //return <ProcurementReportScreen data={filteredData} onBack={navigateToList} />;
  }
  // if (currentView === 'voucher-form') return <DebitVoucherScreen initialData={selectedItem} onBack={navigateToList} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Procurement & Payables</Text>
        <Text style={styles.subtitle}>Inbound Operations Hub</Text>
      </View>

      <ProcurementKPICards pendingPOs={14} totalPayables={450200} vouchersCleared={89} />

      <GlobalFilterBar<ProcurementTab>
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ID or Vendor..."
        tabs={PROCUREMENT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusOptions={['All', 'Approved', 'Draft', 'Pending', 'Paid']}
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
            label: '+ New PO',
            onPress: () => { setSelectedItem(null); setCurrentView('po-form'); },
            buttonStyle: { backgroundColor: theme.colors.cyanGlow }
          },
          {
            label: '+ New Voucher',
            onPress: () => { setSelectedItem(null); setCurrentView('voucher-form'); },
            buttonStyle: { backgroundColor: theme.colors.mintGlow }
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