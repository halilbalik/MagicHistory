import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';

interface YearFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (year: string) => void;
  currentYear: string;
}

export default function YearFilterModal({ visible, onClose, onApply, currentYear }: YearFilterModalProps) {
  const [year, setYear] = useState(currentYear);

  function handleApply() {
    onApply(year);
    onClose();
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Yıla Göre Filtrele</Text>

          <TextInput
            style={styles.yearInput}
            placeholder="Yıl Girin (örn: 1990)"
            placeholderTextColor={Colors.light.secondaryText}
            keyboardType="number-pad"
            maxLength={4}
            value={year}
            onChangeText={setYear}
            autoFocus
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.headerText,
  },
  yearInput: {
    width: '100%',
    height: 50,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 24,
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: Colors.light.tint,
    marginRight: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: Colors.light.filterButtonBg,
    marginLeft: 8,
  },
  closeButtonText: {
    color: Colors.light.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
