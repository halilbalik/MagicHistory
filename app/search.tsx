import React, { useState } from 'react';
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { searchEvents, RelatedEvent, findBestMatch } from '@/services/translationService';
import { fetchHistoryData } from '@/services/historyService';
import { Colors } from '@/constants/Colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RelatedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [failedItems, setFailedItems] = useState<string[]>([]);
  const router = useRouter();

  async function handleSearch() {
    if (!query) return;
    setLoading(true);
    setResults([]);
    const searchResults = await searchEvents(query);
    setResults(searchResults);
    setLoading(false);
  }

  async function handleResultPress(item: RelatedEvent) {
    if (!item?.date?.month || !item?.date?.day) {
      setFailedItems((prev) => [...prev, item.text]);
      return;
    }

    setIsNavigating(true);
    try {
      const targetDate = new Date(new Date().getFullYear(), item.date.month - 1, item.date.day);
      const newData = await fetchHistoryData(targetDate);
      const allItems = [...(newData.data.Events || []), ...(newData.data.Births || []), ...(newData.data.Deaths || [])];
      const eventTexts = allItems.map(e => e.text).filter(Boolean) as string[];

      const bestMatchText = await findBestMatch(item.text, eventTexts);

      const foundEvent = bestMatchText ? allItems.find(e => e.text === bestMatchText) : null;

      if (foundEvent) {
        router.push({
          pathname: '/details',
          params: { event: JSON.stringify(foundEvent), date: newData.date },
        });
      } else {
        setFailedItems((prev) => [...prev, item.text]);
      }
    } catch (error: any) {
      console.error('Failed to handle result press:', error);
      Alert.alert('Hata', `Detaylar getirilirken bir sorun oluştu: ${error.message}`);
    } finally {
      setIsNavigating(false);
    }
  }

  function renderItem({ item }: { item: RelatedEvent }) {
    const isFailed = failedItems.includes(item.text);
    return (
      <TouchableOpacity
        style={[styles.resultCard, isFailed && styles.failedCard]}
        onPress={() => handleResultPress(item)}
        disabled={isFailed}>
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultText} numberOfLines={2}>{item.text}</Text>
          <Text style={styles.resultYear}>{item.year}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.light.chevronColor} />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder='Olay, kişi veya yıl ara...'
            placeholderTextColor={Colors.light.secondaryText}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color={Colors.light.secondaryText} />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" />
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.year}-${index}`}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Tarihte bir yolculuğa çıkın.</Text>
                <Text style={styles.emptySubText}>Yukarıdaki alana bir anahtar kelime yazarak başlayın.</Text>
              </View>
            )}
          />
        )}

        {isNavigating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.card} />
          </View>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.filterButtonBg,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: Colors.light.text,
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  resultYear: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '30%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: Colors.light.secondaryText,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  failedCard: {
    opacity: 0.5,
  },
});
