import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { View, Text } from '@/components/Themed';
import { useHistoryData } from '@/hooks/useHistoryData';
import { HistoryItem } from '@/types/history';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { data, loading, error } = useHistoryData();
  const router = useRouter();

  function handlePress(item: HistoryItem) {
    router.push({
      pathname: '/details',
      params: { event: JSON.stringify(item) },
    });
  }

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
    return (
      <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${item.year}/100/100` }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.textContainer}>
          <Text style={styles.eventText} numberOfLines={2}>
            {item.text}
          </Text>
          <Text style={styles.yearText}>{item.year}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bugün</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color={Colors.light.secondaryText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subHeader}>{data?.date}</Text>
        <FlatList
          data={data?.data.Events}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.year}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 16,
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
