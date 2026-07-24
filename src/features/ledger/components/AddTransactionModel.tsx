import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LedgerEntry, TransactionType } from '../../../types/ledger';
import { theme } from '../../../theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<LedgerEntry, 'id' | 'date'>) => void;
}

export const AddTransactionModal: React.FC<Props> = ({ visible, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');

  const handleSubmit = () => {
    if (!description || !amount) return;

    onAdd({
      description,
      category: category || 'General',
      type,
      amount: parseFloat(amount) || 0,
    });

    setDescription('');
    setCategory('');
    setAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Log Ledger Entry</Text>

          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && { backgroundColor: theme.colors.accentPink }]}
              onPress={() => setType('expense')}
            >
              <Text style={styles.typeBtnText}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && { backgroundColor: theme.colors.accentGreen }]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeBtnText, type === 'income' && { color: '#0F172A' }]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Raw Solvent Purchase"
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Raw Material, Utilities"
            placeholderTextColor={theme.colors.textMuted}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.fieldLabel}>Amount ($)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="0.00"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.cancelBg }]} onPress={onClose}>
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.colors.accentGreen }]} onPress={handleSubmit}>
              <Text style={[styles.modalBtnText, { color: '#0F172A' }]}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 480,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: theme.colors.cancelBg,
    alignItems: 'center',
  },
  typeBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalBtnText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
});