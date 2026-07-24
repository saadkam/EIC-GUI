import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const salesData = [
    { value: 1200, label: 'Jan' },
    { value: 1900, label: 'Feb' },
    { value: 1500, label: 'Mar' },
    { value: 2400, label: 'Apr' },
    { value: 2100, label: 'May' },
    { value: 3000, label: 'Jun' },
  ];

  const expensesData = [
    { value: 800, label: 'Jan' },
    { value: 1400, label: 'Feb' },
    { value: 1100, label: 'Mar' },
    { value: 1800, label: 'Apr' },
    { value: 1600, label: 'May' },
    { value: 2000, label: 'Jun' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.mainContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance & Operations Overview</Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={[styles.card, { borderLeftColor: '#4CAF50', borderLeftWidth: 5 }]}>
          <Text style={styles.cardLabel}>Total Sales</Text>
          <Text style={[styles.cardValue, { color: '#4CAF50' }]}>Rs.12,100</Text>
        </View>
        <View style={[styles.card, { borderLeftColor: '#F44336', borderLeftWidth: 5 }]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={[styles.cardValue, { color: '#F44336' }]}>Rs.8,700</Text>
        </View>
      </View>

      {/* --- GRAPH CONTAINER --- */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Financial Overview (Sales vs. Expenses)</Text>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Sales</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Expenditure</Text>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <LineChart
            data={salesData}
            data2={expensesData}
            height={220}
            width={width - 160} // Adjusted width to fit desktop split-view
            spacing={45}
            initialSpacing={15}
            color1="#4CAF50"
            color2="#F44336"
            thickness={3}
            dataPointsColor1="#388E3C"
            dataPointsColor2="#D32F2F"
            yAxisColor="#ccc"
            xAxisColor="#ccc"
            yAxisTextStyle={{ color: '#666', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#666', fontSize: 10 }}
            noOfSections={4}
            isAnimated
            animateOnDataChange
            animationDuration={1500}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#1e1e20',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#eaedf3',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#050518',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  graphCard: {
    backgroundColor: '#050518',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  chartWrapper: {
    alignItems: 'center',
  },
});