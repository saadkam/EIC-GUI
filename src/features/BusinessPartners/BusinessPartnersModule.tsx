import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BusinessPartner } from '../../types/navigation';
import BusinessPartnersListScreen from './BusinessPartnersListScreen';
import BusinessPartnerFormScreen from './BusinessPartnersFormsScreen';

export default function BusinessPartnersModule() {
  // State to track which screen to show
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  
  // State to hold the partner data if we are editing (null if creating new)
  const [editingPartner, setEditingPartner] = useState<BusinessPartner | null>(null);

  // This is the function the ListScreen was complaining about missing!
  const handleNavigateToForm = (partner?: BusinessPartner) => {
    setEditingPartner(partner || null);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingPartner(null);
    setCurrentView('list');
  };

  return (
    <View style={styles.container}>
      {currentView === 'list' ? (
        <BusinessPartnersListScreen onNavigateToForm={handleNavigateToForm} />
      ) : (
        <BusinessPartnerFormScreen partner={editingPartner} onBack={handleBackToList} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});