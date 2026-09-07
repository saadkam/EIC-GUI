import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { BusinessPartner, PartnerType } from '../../types/navigation';
import { theme } from '../../theme/theme';

interface Props {
  partner?: BusinessPartner | null; 
  onBack: () => void; 
}

const PARTNER_TYPES: PartnerType[] = ['Customer', 'Supplier', 'Both'];

export default function BusinessPartnerFormScreen({ partner, onBack }: Props) {
  const existingPartner = partner;
  
  const [name, setName] = useState(existingPartner?.name || '');
  const [type, setType] = useState<PartnerType>(existingPartner?.type || 'Customer');
  const [ntn, setNtn] = useState(existingPartner?.ntn || '');
  const [phone, setPhone] = useState(existingPartner?.phone || '');
  const [email, setEmail] = useState(existingPartner?.email || '');
  
  // Explicitly matching the SQL schema for dual addresses
  const [billingAddress, setBillingAddress] = useState(existingPartner?.billingAddress || '');
  const [shippingAddress, setShippingAddress] = useState(existingPartner?.shippingAddress || '');

  const handleSave = () => {
    // API logic to save goes here
    console.log({ name, type, ntn, phone, email, billingAddress, shippingAddress });
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
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
                  {existingPartner ? 'EDIT BUSINESS PROFILE' : 'NEW BUSINESS PROFILE'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Identity & Type */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Identity & Type</Text>
            
            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Company Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Alpha Resins Ltd"
                placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Partner Type:</Text>
              <View style={styles.row}>
                {PARTNER_TYPES.map(t => (
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

          {/* Contact Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact & Tax Details</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { marginRight: 16 }]}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0300-XXXXXXX"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NTN / GST No:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Optional"
                  placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                  value={ntn}
                  onChangeText={setNtn}
                />
              </View>
            </View>

            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Email Address:</Text>
              <TextInput
                style={styles.input}
                placeholder="contact@company.com"
                placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Address Information mapped to BillingAddress and ShippingAddress */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            
            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Billing Address:</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Office Street, City, Province"
                placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                multiline
                value={billingAddress}
                onChangeText={setBillingAddress}
              />
            </View>

            <View style={styles.inputGroupFull}>
              <Text style={styles.label}>Shipping Address:</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Factory or Warehouse Location (if different)"
                placeholderTextColor={theme.colors?.textMuted || '#CBD5E1'}
                multiline
                value={shippingAddress}
                onChangeText={setShippingAddress}
              />
            </View>
          </View>

        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSave}
        >
          <Text style={styles.submitButtonText}>SAVE PROFILE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: 'transparent', marginTop: 16, shadowOpacity: 0, elevation: 0 }]}
          onPress={onBack}
        >
          <Text style={[styles.submitButtonText, { color: theme.colors?.textMuted || '#CBD5E1' }]}>CANCEL</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 32, alignItems: 'center' },
  formCard: {
    width: '100%', maxWidth: 900,
    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24,
    zIndex: 10, 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, zIndex: 1 },
  companyInfo: { flexDirection: 'row', alignItems: 'center' },
  logoPlaceholder: {
    width: 60, height: 60, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center',
    marginRight: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoText: { color: '#FFF', fontWeight: '900', fontSize: 20, letterSpacing: 1 },
  companyName: { fontSize: 26, fontWeight: '900', color: '#F1F5F9', letterSpacing: 1.5 },
  companySubName: { fontSize: 16, fontWeight: '600', color: '#CBD5E1', letterSpacing: 1 },
  documentType: { fontSize: 14, fontWeight: 'bold', color: theme.colors?.accentPurple || '#A855F7', marginTop: 4, letterSpacing: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 32, zIndex: 1 },
  row: { flexDirection: 'row', zIndex: 100 },
  inputGroup: { flex: 1 },
  inputGroupFull: { width: '100%', marginBottom: 24, zIndex: 1 },
  label: { color: '#CBD5E1', fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: {
    backgroundColor: 'rgba(15, 12, 29, 0.65)', color: '#F1F5F9', fontSize: 15,
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: 20, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24, zIndex: 1,
  },
  sectionTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: '700', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  typeBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: 'rgba(15, 12, 29, 0.65)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', alignItems: 'center', marginRight: 8,
  },
  typeBtnActive: { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.5)' },
  typeBtnText: { color: '#CBD5E1', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  typeBtnTextActive: { color: theme.colors?.cyanGlow || '#06B6D4' },
  submitButton: {
    marginTop: 32, backgroundColor: theme.colors?.cyanGlow || '#06B6D4',
    paddingVertical: 16, paddingHorizontal: 48, borderRadius: 10,
    shadowColor: theme.colors?.cyanGlow || '#06B6D4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  submitButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
});