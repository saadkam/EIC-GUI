import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// Sample state matching the Azure SQL schema
const INITIAL_MATERIALS = [
  { id: '1', name: 'Whole Soybean Oil', stock: 5000, unit: 'Liters' },
  { id: '2', name: 'Phthalic Anhydride', stock: 2000, unit: 'Kg' },
  { id: '3', name: 'Maleic Anhydride', stock: 1500, unit: 'Kg' },
  { id: '4', name: 'Propylene Glycol', stock: 3000, unit: 'Liters' },
];

export default function RawMaterialsScreen() {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [adjustmentValue, setAdjustmentValue] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdjustModal = (material) => {
    setSelectedMaterial(material);
    setAdjustmentValue(material.stock.toString());
    setAdjustModalVisible(true);
  };

  const saveAdjustment = () => {
    // In a real app, this would trigger: PUT /api/inventory/raw-materials/:id/stock
    setMaterials(materials.map(m => 
      m.id === selectedMaterial.id 
        ? { ...m, stock: parseFloat(adjustmentValue) || 0 } 
        : m
    ));
    setAdjustModalVisible(false);
  };

  const renderMaterialCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.glassCard} 
      onPress={() => openAdjustModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.materialName}>{item.name}</Text>
      </View>
      <View style={styles.stockContainer}>
        <Text style={styles.stockNumber}>{item.stock}</Text>
        <Text style={styles.unitText}>{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar - Corporate Glass Aesthetic */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredMaterials}
        keyExtractor={item => item.id}
        renderItem={renderMaterialCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Adjust Form Modal */}
      <Modal
        visible={adjustModalVisible}
        transparent={true}
        animationType="fade"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.glassModal}>
            <Text style={styles.modalTitle}>Adjust Stock</Text>
            <Text style={styles.modalSubTitle}>{selectedMaterial?.name}</Text>
            
            <View style={styles.inputRow}>
              <TextInput
                style={styles.adjustInput}
                keyboardType="numeric"
                value={adjustmentValue}
                onChangeText={setAdjustmentValue}
                selectTextOnFocus
              />
              <Text style={styles.modalUnit}>{selectedMaterial?.unit}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => setAdjustModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.saveBtn]} 
                onPress={saveAdjustment}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Deep slate backend canvas
  },
  searchContainer: {
    padding: 20,
    paddingTop: 60, // Adjust for mobile status bar
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    // Add expo-blur or @react-native-community/blur here for true background filtering
  },
  cardHeader: {
    marginBottom: 12,
  },
  materialName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '600',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  stockNumber: {
    color: '#38bdf8', // High-visibility accent for the factory floor
    fontSize: 42,
    fontWeight: '700',
  },
  unitText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 18,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glassModal: {
    width: '100%',
    backgroundColor: '#1e293b', // Solid fallback for the modal to avoid text clash
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalSubTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  adjustInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    borderRadius: 12,
    color: '#38bdf8',
    fontSize: 32,
    fontWeight: '700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 140,
    textAlign: 'center',
  },
  modalUnit: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  saveBtn: {
    backgroundColor: '#0284c7',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});