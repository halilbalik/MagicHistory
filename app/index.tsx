import React, { useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import EventCard from '@/components/EventCard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthDayPicker from '@/components/MonthDayPicker';

import { View, Text } from '@/components/Themed';
import { useHistoryData } from '@/hooks/useHistoryData';
import { HistoryItem } from '@/types/history';
import { Colors } from '@/constants/Colors';

type Category = 'Events' | 'Births' | 'Deaths';

const filterCategories: { label: string; category: Category }[] = [
  { label: 'Olaylar', category: 'Events' },
  { label: 'Doğumlar', category: 'Births' },
  { label: 'Ölümler', category: 'Deaths' },
];

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Events');
  const { data, loading, error } = useHistoryData(date);
  const router = useRouter();

  function handleDateChange(selected: { month: number; day: number }) {
    const newDate = new Date();
    newDate.setMonth(selected.month);
    newDate.setDate(selected.day);
    setDate(newDate);
  }

  function handlePress(item: HistoryItem) {
    router.push({
      pathname: '/details',
      params: { 
        event: JSON.stringify(item),
        date: data?.date 
      },
    });
  }

  function formatTurkishDate(dateString?: string): string {
    if (!dateString) return '';
    const [month, day] = dateString.split(' ');
    const monthTranslations: { [key: string]: string } = {
      January: 'Ocak',
      February: 'Şubat',
      March: 'Mart',
      April: 'Nisan',
      May: 'Mayıs',
      June: 'Haziran',
      July: 'Temmuz',
      August: 'Ağustos',
      September: 'Eylül',
      October: 'Ekim',
      November: 'Kasım',
      December: 'Aralık',
    };
    const turkishMonth = monthTranslations[month] || month;
    return `${day} ${turkishMonth}`;
  }

  const listData = data?.data[selectedCategory] ?? [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Veriler alınırken bir hata oluştu.</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  function renderItem({ item }: { item: HistoryItem }) {
    return <EventCard item={item} onPress={() => handlePress(item)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tarihte Bugün</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color={Colors.light.secondaryText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeader}>{formatTurkishDate(data?.date)}</Text>
        <View style={styles.filterContainer}>
          {filterCategories.map(({ label, category }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.selectedFilterButtonText,
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.year}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <MonthDayPicker
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={handleDateChange}
          currentDate={date}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.light.secondaryText,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
    marginLeft: 48, // To center the title, accounting for the button width
  },
  calendarButton: {
    width: 48,
    alignItems: 'flex-end',
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  selectedFilterButton: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'transparent',
  },
  eventText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
  yearText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
});
