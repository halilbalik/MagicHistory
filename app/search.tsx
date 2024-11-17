import React, { useState } from 'react';
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { searchAndValidateEvents, RelatedEvent } from '@/services/translationService';
import { Colors } from '@/constants/Colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RelatedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleTextChange(text: string) {
    setQuery(text);
  }

  async function handleSearch() {
    if (query.length < 2) return;
    setLoading(true);
    setResults([]);
    const searchResults = await searchAndValidateEvents(query);
    setResults(searchResults);
    setLoading(false);
  }

  function handleResultPress(item: RelatedEvent) {
    const eventForDetails = {
      year: item.year,
      text: item.text,
      links: item.links || [],
      html: '',
      no_year_html: '',
    };

    const dateString = new Date(2000, item.date.month - 1, item.date.day).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });

    router.push({
      pathname: '/details',
      params: {
        event: JSON.stringify(eventForDetails),
        date: dateString,
      },
    });
  }

  function renderItem({ item }: { item: RelatedEvent }) {
    return (
      <TouchableOpacity style={styles.resultCard} onPress={() => handleResultPress(item)}>
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
            onChangeText={handleTextChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            onPress={handleSearch} 
            style={[styles.searchButton, !query && styles.searchButtonDisabled]}
            disabled={!query}
          >
            <Ionicons name="search" size={20} color={query ? Colors.light.card : Colors.light.secondaryText} />
          </TouchableOpacity>
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
                <Text style={styles.emptyText}>
                  {query.length > 2 ? 'Sonuç bulunamadı' : 'Tarihte bir yolculuğa çıkın.'}
                </Text>
                <Text style={styles.emptySubText}>
                  {query.length > 2
                    ? 'Farklı bir anahtar kelime deneyin.'
                    : 'Olay, kişi veya yıl araması yapın.'}
                </Text>
              </View>
            )}
          />
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
  searchButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  searchButtonDisabled: {
    backgroundColor: Colors.light.background,
    opacity: 0.5,
  },
});
