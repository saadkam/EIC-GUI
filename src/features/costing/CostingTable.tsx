import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

export interface FormulationItem {
  id: string;
  material: string;
  qty: number;
  unitPrice: number;
}

interface Props {
  data: FormulationItem[];
  totalQty: number;
  onRemoveItem?: (id: string) => void;
}

export const CostingTable: React.FC<Props> = ({ data, totalQty, onRemoveItem }) => {
  return (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 2 }]}>MATERIAL</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>QTY</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>UNIT PRICE</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>TOTAL</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>%</Text>
        {onRemoveItem && <Text style={[styles.headerCell, { flex: 0.5 }]}></Text>}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const itemTotal = item.qty * item.unitPrice;
          const percentage = totalQty > 0 ? ((item.qty / totalQty) * 100).toFixed(2) : '0.00';

          return (
            <View style={styles.tableRow}>
              <Text style={[styles.cellText, { flex: 2, color: theme.colors.textPrimary, fontWeight: 'bold' }]}>
                {item.material}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: 'right' }]}>
                {item.qty.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: 'right' }]}>
                Rs. {item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.cellText, styles.amountCell, { flex: 1.5, color: theme.colors.mintGlow }]}>
                Rs. {itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: 'right', color: theme.colors.cyanGlow }]}>
                {percentage}%
              </Text>
              {onRemoveItem && (
                <TouchableOpacity 
                  style={{ flex: 0.5, alignItems: 'flex-end', padding: 8 }} 
                  onPress={() => onRemoveItem(item.id)}
                >
                  <Text style={{ color: theme.colors.pinkGlow, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
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
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizeMd,
  },
  amountCell: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  }
});