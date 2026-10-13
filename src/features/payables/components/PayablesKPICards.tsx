import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  payablePoCount: number;
  invoicedAmount: number;
  outstandingAmount: number;
}

export const PayablesKPICards: React.FC<Props> = ({
  payablePoCount,
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
      {/* 1. PAYABLE PO COUNT (GREEN / MINT GLOW) */}
      <View style={[styles.kpiCard, styles.greenCard]}>
        <View style={styles.specularTopBorderGreen} />
        <Text style={styles.kpiLabel}>PAYABLE POs</Text>
        <Text style={[styles.kpiValue, { color: '#34D399' }]}>
          {payablePoCount}
        </Text>
      </View>

      {/* 2. INVOICED PO PAYABLE (BLUE / CYAN GLOW) */}
      <View style={[styles.kpiCard, styles.blueCard]}>
        <View style={styles.specularTopBorderBlue} />
        <Text style={styles.kpiLabel}>INVOICED PAYABLE</Text>
        <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>
          Rs. {formatCurrency(invoicedAmount)}
        </Text>
      </View>

      {/* 3. OUTSTANDING PAYABLE (RED / PINK GLOW) */}
      <View style={[styles.kpiCard, styles.redCard]}>
        <View style={styles.specularTopBorderRed} />
        <Text style={styles.kpiLabel}>OUTSTANDING PAYABLE</Text>
        <Text style={[styles.kpiValue, { color: '#FB7185' }]}>
          Rs. {formatCurrency(outstandingAmount)}
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
  // Green/Mint Theme
  greenCard: {
    borderColor: 'rgba(52, 211, 153, 0.45)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderGreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6EE7B7',
    opacity: 0.8,
  },
  // Blue/Cyan Theme
  blueCard: {
    borderColor: 'rgba(56, 189, 248, 0.45)',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderBlue: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#7DD3FC',
    opacity: 0.8,
  },
  // Red/Pink Theme
  redCard: {
    borderColor: 'rgba(251, 113, 133, 0.45)',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  specularTopBorderRed: {
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