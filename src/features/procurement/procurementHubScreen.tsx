import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { ProcurementKPICards } from './components/ProcurementKPICards';
import { ProcurementTable, ProcurementEntry } from './components/ProcurementTable';
import { GlobalFilterBar, DateFilterType } from '../../components/common/GlobalFilterBar';
// Full-Screen Views
import { PurchaseOrderScreen } from './PurchaseOrderScreen';
import { ProcurementReportScreen } from './ProcurementReportScreen';
import { PurchaseOrderPrintScreen } from './PurchaseOrderPrintScreen';
import { GLOBAL_TAX_RATE } from '../../config/globals'; 

// Updated Mock Data with all 4 statuses and PO-GRNI format for uninvoiced
const MOCK_DATA: ProcurementEntry[] = [
  { id: 'PO-GRNI-0042', date: '2026-09-10', vendor: 'NIC Chemicals', type: 'Purchase Order', amount: 125000.00, status: 'Issued' },
  { id: 'PO-GRNI-0043', date: '2026-09-25', vendor: 'Logistics Pro', type: 'Purchase Order', amount: 15000.00, status: 'Approved' },
  { id: 'PO-GRNI-0044', date: '2026-09-28', vendor: 'Alpha Solvents', type: 'Purchase Order', amount: 88000.00, status: 'Pending' },
  { id: 'PO-1045', date: '2026-08-12', vendor: 'Soya Extracts Ltd', type: 'Purchase Order', amount: 45000.00, status: 'Finalized' },
];

type ProcurementTab = 'All' | 'Pending' | 'Finalized';
const PROCUREMENT_TABS = ['All', 'Pending', 'Finalized'] as const;

type ViewState = 'list' | 'po-form' | 'report' | 'po-print';

export default function ProcurementHubScreen() {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<ProcurementEntry | null>(null);
  const [poPrintData, setPoPrintData] = useState<any>(null);
  
  // Filter States
  const [activeTab, setActiveTab] = useState<ProcurementTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      // Tab Filtering
      if (activeTab === 'Pending' && item.status !== 'Pending') return false;
      if (activeTab === 'Finalized' && item.status !== 'Finalized') return false;

      // Dropdown Status Filtering (All 4 Statuses)
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
    setCurrentView('po-form');
  };

  const navigateToList = () => {
    setCurrentView('list');
    setSelectedItem(null);
  };

  // Catch the payload and trigger the print screen
  const handlePOIssued = (payload: any) => {
    setPoPrintData(payload);
    setCurrentView('po-print');
  };

  // Sub-Screen View Switcher
  if (currentView === 'po-form') {
    return (
      <PurchaseOrderScreen 
        initialData={selectedItem} 
        onBack={navigateToList} 
        onPOIssued={handlePOIssued} 
        readOnly={selectedItem?.status === 'Finalized'} 
      />
    );
  }
  
  if (currentView === 'po-print' && poPrintData) {
    return (
      <PurchaseOrderPrintScreen 
        poData={poPrintData} 
        onBackToHub={navigateToList} 
      />
    );
  }
  
  if (currentView === 'report') {
    return (
      <ProcurementReportScreen
        data={filteredData}
        onBack={navigateToList}
      />
    );
  }

  // Calculate dynamic metrics for KPI Cards based on MOCK_DATA
  const pendingCount = MOCK_DATA.filter(po => po.status === 'Pending').length;
  const issuedCount = MOCK_DATA.filter(po => po.status === 'Issued').length;
  const validStatuses = ['Pending'];//['Pending', 'Issued', 'Approved']; Only included pending

  const totalAmount = MOCK_DATA
    .filter(po => validStatuses.includes(po.status))
    .reduce((sum, po) => sum + po.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Procurement Hub</Text>
        <Text style={styles.subtitle}>Purchase Orders & Inbound Materials</Text>
      </View>

      <ProcurementKPICards 
        pendingPOs={pendingCount} 
        issuedPOs={issuedCount} 
        totalPendingAmmount={totalAmount} 
      />

      <GlobalFilterBar<ProcurementTab>
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by PO Ref or Vendor..."
        tabs={PROCUREMENT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusOptions={['All', 'Issued', 'Approved', 'Pending', 'Finalized']}
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
            label: '+ New Purchase Order',
            onPress: () => { setSelectedItem(null); setCurrentView('po-form'); },
            buttonStyle: { backgroundColor: theme.colors.cyanGlow }
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