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
  return (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1 }]}>ID</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>DATE</Text>
        <Text style={[styles.headerCell, { flex: 2.5 }]}>VENDOR / PAYEE</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>TYPE</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>AMOUNT</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'center' }]}>STATUS</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.tableRow}
            activeOpacity={0.7}
            onPress={() => onRowPress && onRowPress(item)}
          >
            <Text style={[styles.cellText, { flex: 1, color: theme.colors.textPrimary, fontWeight: 'bold' }]}>
              {item.id}
            </Text>
            <Text style={[styles.cellText, { flex: 1.5, color: theme.colors.textSecondary }]}>
              {item.date}
            </Text>
            <Text style={[styles.cellText, { flex: 2.5 }]}>
              {item.vendor}
            </Text>
            <Text style={[styles.cellText, { flex: 1.5, color: theme.colors.textSecondary }]}>
              {item.type}
            </Text>
            <Text style={[styles.cellText, styles.amountCell, { color: theme.colors.pinkGlow }]}>
              Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            
            <View style={{ flex: 1.5, alignItems: 'center' }}>
              <View style={[
                styles.statusBadge, 
                item.status === 'Approved' || item.status === 'Paid' ? styles.badgeSuccess : styles.badgePending
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'Approved' || item.status === 'Paid' ? styles.textSuccess : styles.textPending
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHeader,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerCell: {
    color: theme.colors.accentPurple,
    fontSize: theme.typography.fontSizeMd,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rowBorder,
  },
  cellText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeMd,
  },
  amountCell: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: theme.colors.mintGlowBorder,
  },
  badgePending: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: theme.colors.pinkGlowBorder,
  },
  statusText: {
    fontSize: theme.typography.fontSizeSm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textSuccess: {
    color: theme.colors.mintGlow,
  },
  textPending: {
    color: theme.colors.pinkGlow,
  }
});