import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';

export interface ProcurementEntry {
  id: string;
  date: string;
  vendor: string;
  type: string;
  amount: number;
  status: string;
}

interface Props {
  data: ProcurementEntry[];
  onRowPress?: (item: ProcurementEntry) => void;
}

export const ProcurementTable: React.FC<Props> = ({ data, onRowPress }) => {
  
  // Dynamic color mapping for the 4-tier PO pipeline
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Finalized': 
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34D399' }; // Mint
      case 'Approved': 
        return { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' }; // Blue
      case 'Pending': 
        return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#FBBF24' }; // Amber
      case 'Issued':
      default: 
        return { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', text: '#38BDF8' }; // Cyan
    }
  };

  return (
    <View style={styles.tableCard}>
      {/* HEADER */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>ID</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>DATE</Text>
        <Text style={[styles.headerCell, { flex: 2.5 }]}>VENDOR / SUPPLIER</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>TYPE</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>AMOUNT</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'center' }]}>STATUS</Text>
      </View>

      {/* DATA LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);

          return (
            <TouchableOpacity 
              style={styles.tableRow}
              activeOpacity={0.7}
              onPress={() => onRowPress && onRowPress(item)}
            >
              <Text style={[styles.cellText, { flex: 1.2, color: '#FFFFFF', fontWeight: 'bold' }]}>
                {item.id}
              </Text>
              
              <Text style={[styles.cellText, { flex: 1.5, color: 'rgba(255, 255, 255, 0.65)' }]}>
                {item.date}
              </Text>
              
              <Text style={[styles.cellText, { flex: 2.5, fontWeight: '500' }]}>
                {item.vendor}
              </Text>
              
              <Text style={[styles.cellText, { flex: 1.5, color: 'rgba(255, 255, 255, 0.45)' }]}>
                {item.type}
              </Text>
              
              {/* Amounts glow pink/rose as they are payables (cash out) */}
              <Text style={[styles.cellText, styles.amountCell, { color: '#FB7185' }]}>
                Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              
              <View style={{ flex: 1.5, alignItems: 'center' }}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: statusConfig.bg, borderColor: statusConfig.border }
                ]}>
                  <Text style={[styles.statusText, { color: statusConfig.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No procurement records found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerCell: {
    color: theme.colors.accentPurple || '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  cellText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  amountCell: {
    flex: 1.5,
    textAlign: 'right',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 90,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  }
});