import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { LedgerEntry } from '../../../types/ledger';
import { theme } from '../../../theme/theme';

interface Props {
  transactions: LedgerEntry[];
}

export const LedgerTable: React.FC<Props> = ({ transactions }) => {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 3 }]}>Description</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cellText, { flex: 1.2, color: theme.colors.textSecondary }]}>{item.date}</Text>
            <Text style={[styles.cellText, { flex: 3, fontWeight: '600' }]} numberOfLines={1}>
              {item.description}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text
              style={[
                styles.cellText,
                {
                  flex: 1.5,
                  textAlign: 'right',
                  fontWeight: 'bold',
                  color: item.type === 'income' ? theme.colors.accentGreen : theme.colors.accentPink,
                },
              ]}
            >
              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No ledger records found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHeader,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerCell: {
    color: theme.colors.accentPurple,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.rowBorder,
  },
  cellText: {
    color: '#F1F5F9',
    fontSize: 14,
  },
  categoryBadge: {
    flex: 2,
    backgroundColor: theme.colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});