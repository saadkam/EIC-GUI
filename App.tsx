import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainLayout from './src/components/MainLayout';
import Dashboard from './src/features/dashboard/DashnoardScreen';
import LedgerScreen from './src/features/ledger/ledgerScreen';
import ChallansScreen from './src/features/challans/ChallanScreen';
import RawMaterialsScreen from './src/features/inventory/RawMaterialsScreen';
import BusinessPartnersListScreen from './src/features/BusinessPartners/BusinessPartnersModule';

// TODO: Remove
// Placeholder screen for future modules
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{title} Module Under Construction 🧪</Text>
    </View>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'prices':
        return <PlaceholderScreen title="Price / Unit (Material Manager)" />;
      case 'formulas':
        return <PlaceholderScreen title="Formula Cookbook" />;
      case 'production':
        return <PlaceholderScreen title="Production Calculator" />;
      case 'inventory':
        return <RawMaterialsScreen/>;
      case 'ledger':
        return <LedgerScreen />;
      case 'challan':
        return <ChallansScreen />;
      case 'BusinessPartners':
        return <BusinessPartnersListScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout activeScreen={activeScreen} onNavigate={setActiveScreen}>
      {renderScreen()}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
});