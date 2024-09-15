import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from './Themed';
import { Colors } from '@/constants/Colors';

interface MonthDayPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: { month: number; day: number }) => void;
  currentDate: Date;
}

const months = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function MonthDayPicker({ visible, onClose, onSelect, currentDate }: MonthDayPickerProps) {
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  const currentYear = new Date().getFullYear();
  const daysInSelectedMonth = getDaysInMonth(selectedMonth, currentYear);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  function handleSelect() {
    onSelect({ month: selectedMonth, day: selectedDay });
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.buttonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSelect}>
              <Text style={styles.buttonText}>Seç</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickersRow}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}>
              {months.map((month, index) => (
                <Picker.Item key={index} label={month} value={index} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue) => setSelectedDay(itemValue)}
              style={styles.picker}>
              {days.map((day) => (
                <Picker.Item key={day} label={`${day}`} value={day} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  buttonText: {
    color: Colors.light.tint,
    fontSize: 16,
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
  },
});
