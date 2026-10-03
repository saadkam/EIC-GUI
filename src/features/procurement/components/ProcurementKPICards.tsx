import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
  pendingPOs: number;
  issuedPOs: number;
  totalPendingAmmount: number;
}

export const ProcurementKPICards: React.FC<Props> = ({
  pendingPOs,
  issuedPOs,
  totalPendingAmmount,
}) => {
  const formatCurrency = (val: number) => {
    return Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.kpiContainer}>
      {/* PENDING POs (CYAN GLOW) */}
      <View style={[styles.kpiCard, styles.issuedCard]}>
        <View style={styles.specularTopBorderMint} />
        <Text style={styles.kpiLabel}>Issued POs</Text>
        <Text style={[styles.kpiValue, { color: '#34D399' }]}>
          {issuedPOs}
        </Text>
      </View>

      {/* FINALIZED POs (MINT GLOW) */}
      <View style={[styles.kpiCard, styles.pendingCard]}>
        <View style={styles.specularTopBorderCyan} />
        <Text style={styles.kpiLabel}>Pending POs</Text>
        <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
          {pendingPOs}
        </Text>
      </View>

      {/* TOTAL PO VALUE (ROSE / PINK GLOW) */}
      <View style={[styles.kpiCard, styles.valueCard]}>
        <View style={styles.specularTopBorderPink} />
        <Text style={styles.kpiLabel}>TOTAL PENDING PO</Text>
        <Text style={[styles.kpiValue, { color: '#FB7185' }]}>
          Rs. {formatCurrency(totalPendingAmmount)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 22,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  pendingCard: {
    borderColor: 'rgba(56, 189, 248, 0.45)',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  issuedCard: {
    borderColor: 'rgba(52, 211, 153, 0.45)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  valueCard: {
    borderColor: 'rgba(251, 113, 133, 0.45)',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderCyan: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#7DD3FC',
    opacity: 0.8,
  },
  specularTopBorderMint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6EE7B7',
    opacity: 0.8,
  },
  specularTopBorderPink: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FDA4AF',
    opacity: 0.8,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.55)',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});