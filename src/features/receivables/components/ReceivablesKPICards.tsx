import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  pendingSoCount: number;
  invoicedAmount: number;
  outstandingAmount: number;
}

export const ReceivablesKPICards: React.FC<Props> = ({
  pendingSoCount,
  invoicedAmount,
  outstandingAmount,
}) => {
  const formatCurrency = (val?: number) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : 0;
    return Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.kpiContainer}>
      {/* 1. PENDING SO COUNT (GREEN / MINT GLOW) */}
      <View style={[styles.kpiCard, styles.greenCard]}>
        <View style={styles.specularTopBorderGreen} />
        <Text style={styles.kpiLabel}>PENDING SALES ORDERS</Text>
        <Text style={[styles.kpiValue, { color: '#34D399' }]}>
          {pendingSoCount}
        </Text>
      </View>

      {/* 2. INVOICED RECEIVABLE (BLUE / CYAN GLOW) */}
      <View style={[styles.kpiCard, styles.blueCard]}>
        <View style={styles.specularTopBorderBlue} />
        <Text style={styles.kpiLabel}>INVOICED RECEIVABLE</Text>
        <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
          Rs. {formatCurrency(invoicedAmount)}
        </Text>
      </View>

      {/* 3. OUTSTANDING RECEIVABLE (RED / PINK GLOW) */}
      <View style={[styles.kpiCard, styles.redCard]}>
        <View style={styles.specularTopBorderRed} />
        <Text style={styles.kpiLabel}>OUTSTANDING RECEIVABLE</Text>
        <Text style={[styles.kpiValue, { color: '#FB7185' }]}>
          Rs. {formatCurrency(outstandingAmount)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiContainer: { flexDirection: 'row', gap: 16, marginBottom: 22 },
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
  greenCard: {
    borderColor: 'rgba(52, 211, 153, 0.45)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderGreen: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#6EE7B7', opacity: 0.8 },
  blueCard: {
    borderColor: 'rgba(56, 189, 248, 0.45)',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderBlue: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#7DD3FC', opacity: 0.8 },
  redCard: {
    borderColor: 'rgba(251, 113, 133, 0.45)',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderRed: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#FDA4AF', opacity: 0.8 },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255, 255, 255, 0.55)', letterSpacing: 1.1, marginBottom: 8 },
  kpiValue: { fontSize: 24, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
});