import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { View, Text } from '@/components/Themed';
import { HistoryItem } from '@/types/history';
import { fetchHistoryData } from '@/services/historyService';
import {
  getDetailedExplanation,
  getRelatedEvents,
  RelatedEvent,
  translateText,
  findBestMatch,
} from '@/services/translationService';
import { useWikipediaImage } from '@/hooks/useWikipediaImage';
import { Colors } from '@/constants/Colors';
import { formatTurkishDate } from '@/utils/dateUtils';

function DetailsContent({ event, date }: { event: HistoryItem; date?: string }) {
  const { imageUrl: wikipediaImageUrl } = useWikipediaImage(event.links);
  const [translatedText, setTranslatedText] = useState('');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();


  useEffect(() => {
    async function getContent() {
      setIsLoading(true);
      const [translation, explanation, related] = await Promise.all([
        translateText(event.text),
        getDetailedExplanation(event.text),
        getRelatedEvents(event.text),
      ]);
      setTranslatedText(translation);
      setDetailedExplanation(explanation);
      setRelatedEvents(related);
      setIsLoading(false);
    }
    getContent();
  }, [event]);

  async function handleRelatedEventPress(relatedEvent: RelatedEvent) {
    setIsNavigating(true);
    try {
      const { month, day } = relatedEvent.date;
      const targetDate = new Date(new Date().getFullYear(), month - 1, day);

      const newData = await fetchHistoryData(targetDate);
      const allItems = [...(newData.data.Events || []), ...(newData.data.Births || []), ...(newData.data.Deaths || [])];
      const eventTexts = allItems.map(e => e.text).filter(Boolean) as string[];

      const bestMatchText = await findBestMatch(relatedEvent.text, eventTexts);

      const foundEvent = bestMatchText ? allItems.find(e => e.text === bestMatchText) : null;

      if (foundEvent) {
        router.push({
          pathname: '/details',
          params: {
            event: JSON.stringify(foundEvent),
            date: newData.date,
          },
        });
      } else {
        Alert.alert('Bulunamadı', 'İlgili olayın detayı getirilemedi.');
      }
    } catch (error) {
      Alert.alert('Hata', 'İlgili olaya gidilirken bir sorun oluştu.');
    } finally {
      setIsNavigating(false);
    }
  }

  function handleWikipediaLink() {
    const link = event.links[event.links.length - 1]?.link;
    if (link) {
      Linking.openURL(link);
    }
  }

  return (
    <>
      {isNavigating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.card} />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.headerText} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tarihte Bugün</Text>
          {date && <Text style={styles.headerDate}>{` - ${formatTurkishDate(date)}`}</Text>}
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={wikipediaImageUrl ? { uri: wikipediaImageUrl } : require('@/assets/images/icon.png')}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.eventTitle}>{event.text}</Text>

          <View style={[styles.sectionContainer, { borderLeftColor: '#FF3B30' }]}>
            <Text style={styles.sectionTitle}>Orijinal Metin</Text>
            <Text style={styles.descriptionText}>{event.text}</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="small" />
          ) : (
            <>
              <View style={[styles.sectionContainer, { borderLeftColor: '#34C759' }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Türkçe Çeviri</Text>
                  <View style={styles.geminiChip}>
                    <Ionicons name="sparkles" size={12} color="#6B46C1" />
                    <Text style={styles.geminiChipText}>Gemini AI</Text>
                  </View>
                </View>
                <Text style={styles.descriptionText}>{translatedText}</Text>
              </View>

              {detailedExplanation && (
                <View style={[styles.sectionContainer, { borderLeftColor: '#007AFF' }]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Detaylı Anlatım</Text>
                    <View style={styles.geminiChip}>
                      <Ionicons name="sparkles" size={12} color="#6B46C1" />
                      <Text style={styles.geminiChipText}>Gemini AI</Text>
                    </View>
                  </View>
                  <Text style={styles.descriptionText}>{detailedExplanation}</Text>
                </View>
              )}

              {relatedEvents.length > 0 && (
                <View style={[styles.sectionContainer, { borderLeftColor: '#FF9500' }]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>İlgili Olaylar</Text>
                    <View style={styles.geminiChip}>
                      <Ionicons name="sparkles" size={12} color="#6B46C1" />
                      <Text style={styles.geminiChipText}>Gemini AI</Text>
                    </View>
                  </View>
                  {relatedEvents.map((relatedEvent, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.relatedCard}
                      onPress={() => handleRelatedEventPress(relatedEvent)}>
                      <View style={styles.relatedTextContainer}>
                        <Text style={styles.relatedTitle} numberOfLines={2}>
                          {relatedEvent.text}
                        </Text>
                        <Text style={styles.relatedYear}>{relatedEvent.year}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color={Colors.light.chevronColor} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleWikipediaLink}
          style={styles.wikipediaButton}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
          <Text style={styles.wikipediaButtonText}>Wikipedia'da Oku</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function DetailsScreen() {
  const { event: eventString, date } = useLocalSearchParams<{ event: string; date?: string }>();

  if (!eventString) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text>Olay bilgisi bulunamadı.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const event: HistoryItem = JSON.parse(eventString);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <DetailsContent event={event} date={date} />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.headerText,
  },
  headerDate: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.secondaryText,
    marginLeft: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.light.headerText,
    lineHeight: 32,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingLeft: 16,
    borderLeftWidth: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.eventText,
  },
  geminiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.geminiChipBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  geminiChipText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.geminiChipText,
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 28,
    color: Colors.light.descriptionText,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.relatedCardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  relatedTextContainer: {
    flex: 1,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.eventText,
    lineHeight: 22,
  },
  relatedYear: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  footer: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.footerBorder,
  },
  wikipediaButton: {
    backgroundColor: Colors.light.wikipediaButtonBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  wikipediaButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
