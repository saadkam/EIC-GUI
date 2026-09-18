import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';


export type ProcurementTab = 'All' | 'Purchase Orders' | 'Debit Vouchers';

interface Props {
  activeTab: ProcurementTab;
  onTabChange: (tab: ProcurementTab) => void;
  onNewPO: () => void;
  onNewVoucher: () => void;
}

export const ProcurementFilterBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onNewPO,
  onNewVoucher,
}) => {
  const tabs: ProcurementTab[] = ['All', 'Purchase Orders', 'Debit Vouchers'];

  return (
    <View style={styles.filterBar}>
      <View style={styles.segmentContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
              onPress={() => onTabChange(tab)}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={onNewPO}>
          <Text style={styles.actionButtonText}>+ New PO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.voucherButton]} onPress={onNewVoucher}>
          <Text style={styles.actionButtonText}>+ New Voucher</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  segmentText: {
    fontSize: theme.typography.fontSizeMd,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  segmentTextActive: {
    color: theme.colors.textPrimary,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: theme.colors.cyanGlow,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  voucherButton: {
    backgroundColor: theme.colors.mintGlow,
  },
  actionButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizeMd,
  },
});