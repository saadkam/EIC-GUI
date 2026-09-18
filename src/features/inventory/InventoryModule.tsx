import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import InventoryListScreen from './InventoryListScreen';
import InventoryFormScreen from './InventoryFormScreen';

export type InventoryType = 'Raw Material' | 'Finished Good' | 'Consumable';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  nameUrdu: string;
  type: InventoryType;
  hsCode: string;
  stock: string;
  uom: string;
  cost: string;
}

export default function InventoryModule() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleNavigateToForm = (item?: InventoryItem) => {
    setEditingItem(item || null);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingItem(null);
    setCurrentView('list');
  };

  return (
    <View style={styles.container}>
      {currentView === 'list' ? (
        <InventoryListScreen onNavigateToForm={handleNavigateToForm} />
      ) : (
        <InventoryFormScreen item={editingItem} onBack={handleBackToList} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});