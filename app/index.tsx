import React, { useState } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import EventCard from '@/components/EventCard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarPicker from '@/components/CalendarPicker';
import YearFilterModal from '@/components/YearFilterModal';

import { View, Text } from '@/components/Themed';
import { useHistoryData } from '@/hooks/useHistoryData';
import { HistoryItem } from '@/types/history';
import { Colors } from '@/constants/Colors';
import { formatTurkishDate } from '@/utils/dateUtils';
import { useRandomEvent } from '@/hooks/useRandomEvent';

type Category = 'Events' | 'Births' | 'Deaths';

const filterCategories: { label: string; category: Category }[] = [
  { label: 'Olaylar', category: 'Events' },
  { label: 'Doğumlar', category: 'Births' },
  { label: 'Ölümler', category: 'Deaths' },
];

export default function HomeScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showYearFilter, setShowYearFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Events');
  const [yearFilter, setYearFilter] = useState('');
  const { data, loading, error } = useHistoryData(date);
  const { isFetching: isFetchingRandom, fetchRandomEvent } = useRandomEvent();
  const router = useRouter();

  function handleDateChange(newDate: Date) {
    setDate(newDate);
  }

  function handlePress(item: HistoryItem) {
    router.push({
      pathname: '/details',
      params: {
        event: JSON.stringify(item),
        date: data?.date,
      },
    });
  }


  function renderItem({ item }: { item: HistoryItem }) {
    return <EventCard item={item} onPress={() => handlePress(item)} />;
  }

  const listData = (data?.data[selectedCategory] ?? []).filter(
    (item) => !yearFilter || item.year === yearFilter
  );

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
        <Text style={styles.errorText}>Veri yüklenirken bir hata oluştu.</Text>
        <Text style={styles.errorText}>Lütfen daha sonra tekrar deneyin.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCenterContainer}>
            <Text style={styles.headerTitle}>Tarihte Bugün</Text>
            <Text style={styles.subHeader}>{` - ${formatTurkishDate(data?.date)}`}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.calendarButton}>
              <Ionicons name="calendar-outline" size={24} color={Colors.light.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.searchIcon}>
              <Ionicons name="search-outline" size={24} color={Colors.light.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowYearFilter(true)} style={styles.filterIcon}>
              <Ionicons
                name={yearFilter ? 'funnel' : 'funnel-outline'}
                size={24}
                color={yearFilter ? Colors.light.tint : Colors.light.secondaryText}
              />
            </TouchableOpacity>
                        <TouchableOpacity onPress={fetchRandomEvent} disabled={isFetchingRandom} style={styles.randomButton}>
              {isFetchingRandom ? (
                <ActivityIndicator size="small" color={Colors.light.tint} />
              ) : (
                <Ionicons name="shuffle-outline" size={24} color={Colors.light.secondaryText} />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                {yearFilter ? `${yearFilter} yılı için sonuç bulunamadı.` : 'Bu tarih için veri yok.'}
              </Text>
            </View>
          )}
        />
        <CalendarPicker
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={handleDateChange}
          currentDate={date}
        />
        <YearFilterModal
          visible={showYearFilter}
          onClose={() => setShowYearFilter(false)}
          onApply={setYearFilter}
          currentYear={yearFilter}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.light.secondaryText,
  },
  header: {
    paddingVertical: 16,
  },
  headerCenterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.headerText,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.secondaryText,
    marginLeft: 8,
  },
  calendarButton: {
    marginLeft: 16,
  },
  searchIcon: {
    marginLeft: 16,
  },
  filterIcon: {
    marginLeft: 16,
  },
  randomButton: {
    marginLeft: 16,
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
    backgroundColor: Colors.light.filterButtonBg,
  },
  selectedFilterButton: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonText: {
    color: Colors.light.filterButtonText,
    fontWeight: '600',
  },
  selectedFilterButtonText: {
    color: Colors.light.card,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
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
    color: Colors.light.eventText,
    lineHeight: 20,
  },
  yearText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
});
