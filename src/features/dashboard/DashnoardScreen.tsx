import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance & Operations Overview</Text>
      </View>

      {/* QUICK STATS GRID */}
      <View style={styles.statsContainer}>
        <View style={[styles.card, { borderLeftColor: theme.colors.accentGreen, borderLeftWidth: 4 }]}>
          <Text style={styles.cardLabel}>Total Sales</Text>
          <Text style={[styles.cardValue, { color: theme.colors.accentGreen }]}>
            Rs. 12,100
          </Text>
        </View>

        <View style={[styles.card, { borderLeftColor: theme.colors.accentPink, borderLeftWidth: 4 }]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={[styles.cardValue, { color: theme.colors.accentPink }]}>
            Rs. 8,700
          </Text>
        </View>
      </View>

      {/* GRAPH CONTAINER */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Financial Overview (Sales vs. Expenses)</Text>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: theme.colors.accentGreen }]} />
            <Text style={styles.legendText}>Sales</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: theme.colors.accentPink }]} />
            <Text style={styles.legendText}>Expenditure</Text>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <LineChart
            data={salesData}
            data2={expensesData}
            height={220}
            width={width - 180}
            spacing={45}
            initialSpacing={15}
            color1={theme.colors.accentGreen}
            color2={theme.colors.accentPink}
            thickness={3}
            dataPointsColor1={theme.colors.accentGreen}
            dataPointsColor2={theme.colors.accentPink}
            yAxisColor={theme.colors.surfaceBorder}
            xAxisColor={theme.colors.surfaceBorder}
            yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
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
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: theme.colors.surfaceHeader,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
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
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  cardLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  graphCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
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
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: -10,
  },
});