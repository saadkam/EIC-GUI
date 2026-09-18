import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
  pendingPOs: number;
  totalPayables: number;
  vouchersCleared: number;
}

export const ProcurementKPICards: React.FC<Props> = ({
  pendingPOs,
  totalPayables,
  vouchersCleared,
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.kpiContainer}>
      <View style={[styles.kpiCard, styles.cyanCard]}>
        <View style={styles.specularTopBorderCyan} />
        <Text style={styles.kpiLabel}>PENDING POs</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.cyanGlow }]}>
          {pendingPOs}
        </Text>
      </View>
      <View style={[styles.kpiCard, styles.pinkCard]}>
        <View style={styles.specularTopBorderPink} />
        <Text style={styles.kpiLabel}>TOTAL PAYABLES</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.pinkGlow }]}>
          Rs. {formatCurrency(totalPayables)}
        </Text>
      </View>
      <View style={[styles.kpiCard, styles.mintCard]}>
        <View style={styles.specularTopBorderMint} />
        <Text style={styles.kpiLabel}>VOUCHERS CLEARED</Text>
        <Text style={[styles.kpiValue, { color: theme.colors.mintGlow }]}>
          {vouchersCleared}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cyanCard: {
    borderColor: theme.colors.cyanGlowBorder,
    shadowColor: theme.colors.cyanGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  pinkCard: {
    borderColor: theme.colors.pinkGlowBorder,
    shadowColor: theme.colors.pinkGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  mintCard: {
    borderColor: theme.colors.mintGlowBorder,
    shadowColor: theme.colors.mintGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  specularTopBorderCyan: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.cyanGlow,
    opacity: 0.8,
  },
  specularTopBorderPink: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.pinkGlow,
    opacity: 0.8,
  },
  specularTopBorderMint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.mintGlow,
    opacity: 0.8,
  },
  kpiLabel: {
    fontSize: theme.typography.fontSizeSm,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: theme.typography.fontSizeXl,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});