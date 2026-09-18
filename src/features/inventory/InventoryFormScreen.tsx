import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { InventoryItem, InventoryType } from './InventoryModule';

interface Props {
  item?: InventoryItem | null;
  onBack: () => void;
}

const INVENTORY_TYPES: InventoryType[] = ['Raw Material', 'Finished Good', 'Consumable'];

export default function InventoryFormScreen({ item, onBack }: Props) {
  const [sku, setSku] = useState(item?.sku || '');
  const [name, setName] = useState(item?.name || '');
  const [nameUrdu, setNameUrdu] = useState(item?.nameUrdu || '');
  const [type, setType] = useState<InventoryType>(item?.type || 'Raw Material');
  const [hsCode, setHsCode] = useState(item?.hsCode || '');
  const [stock, setStock] = useState(item?.stock || '0');
  const [uom, setUom] = useState(item?.uom || '');
  const [cost, setCost] = useState(item?.cost || '0.00');

  const handleSave = () => {
    console.log({ sku, name, nameUrdu, type, hsCode, stock, uom, cost });
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.formCard}>
          
          <View style={styles.headerRow}>
            <View style={styles.companyInfo}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>NIC</Text>
              </View>
              <View>
                <Text style={styles.companyName}>NIC CHEMICALS</Text>
                <Text style={styles.companySubName}>(PRIVATE) LIMITED</Text>
                <Text style={styles.documentType}>
                  {item ? 'EDIT ITEM MASTER' : 'NEW ITEM MASTER'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Identity Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Item Identification</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 2, marginRight: 16 }]}>
                <Text style={styles.label}>English Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Whole Soybean Oil"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Urdu Name (اردو):</Text>
                <TextInput
                  style={[styles.input, styles.urduInput]}
                  placeholder="نام درج کریں"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  value={nameUrdu}
                  onChangeText={setNameUrdu}
                />
              </View>
            </View>

            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Item Type:</Text>
              <View style={styles.row}>
                {INVENTORY_TYPES.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Tracking & Pricing */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Stock & Taxation</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { marginRight: 16 }]}>
                <Text style={styles.label}>SKU / Item Code:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., RM-SOY-001"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  value={sku}
                  onChangeText={setSku}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>HS Code (FBR/Customs):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1507.1000"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  keyboardType="numeric"
                  value={hsCode}
                  onChangeText={setHsCode}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 16 }]}>
                <Text style={styles.label}>Initial Stock:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginRight: 16 }]}>
                <Text style={styles.label}>Unit of Measure:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Liters, Kg"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  value={uom}
                  onChangeText={setUom}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Cost Per Unit:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={cost}
                  onChangeText={setCost}
                />
              </View>
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>SAVE INVENTORY ITEM</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: 'transparent', marginTop: 16, shadowOpacity: 0, elevation: 0 }]} onPress={onBack}>
          <Text style={[styles.submitButtonText, { color: theme.colors?.textMuted || '#CBD5E1' }]}>CANCEL</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 900, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', padding: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, zIndex: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, zIndex: 1 },
  companyInfo: { flexDirection: 'row', alignItems: 'center' },
  logoPlaceholder: { width: 60, height: 60, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  logoText: { color: '#FFF', fontWeight: '900', fontSize: 20, letterSpacing: 1 },
  companyName: { fontSize: 26, fontWeight: '900', color: '#F1F5F9', letterSpacing: 1.5 },
  companySubName: { fontSize: 16, fontWeight: '600', color: '#CBD5E1', letterSpacing: 1 },
  documentType: { fontSize: 14, fontWeight: 'bold', color: theme.colors?.accentPurple || '#A855F7', marginTop: 4, letterSpacing: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 32, zIndex: 1 },
  row: { flexDirection: 'row', zIndex: 100 },
  inputGroup: { flex: 1 },
  inputGroupFull: { width: '100%', marginBottom: 24, zIndex: 1 },
  label: { color: '#CBD5E1', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { backgroundColor: 'rgba(15, 12, 29, 0.65)', color: '#F1F5F9', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 20 },
  urduInput: { textAlign: 'right', fontFamily: 'sans-serif', fontSize: 16 }, // Aligns text RTL for Urdu input
  sectionContainer: { backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24, zIndex: 1 },
  sectionTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: '700', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  typeBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: 'rgba(15, 12, 29, 0.65)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', alignItems: 'center', marginRight: 8 },
  typeBtnActive: { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.5)' },
  typeBtnText: { color: '#CBD5E1', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  typeBtnTextActive: { color: theme.colors?.cyanGlow || '#06B6D4' },
  submitButton: { marginTop: 32, backgroundColor: theme.colors?.cyanGlow || '#06B6D4', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 10, shadowColor: theme.colors?.cyanGlow || '#06B6D4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  submitButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
});