import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

LocaleConfig.locales['tr'] = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  currentDate: Date;
}

export default function CalendarPicker({ visible, onClose, onSelect, currentDate }: CalendarPickerProps) {
  const today = new Date();
  const currentYear = today.getFullYear();

  function onDayPress(day: any) {
    const selectedDate = new Date(currentYear, day.month - 1, day.day);
    onSelect(selectedDate);
    onClose();
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color={Colors.light.tint} />
          </TouchableOpacity>
          <Calendar
            current={currentDate.toISOString().split('T')[0]}
            onDayPress={onDayPress}
            monthFormat={'MMMM yyyy'}
            hideExtraDays={true}
            firstDay={1}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: Colors.light.tint,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.light.tint,
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: Colors.light.tint,
              selectedDotColor: '#ffffff',
              arrowColor: Colors.light.tint,
              monthTextColor: Colors.light.text,
              indicatorColor: 'blue',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    zIndex: 1,
  },
});
