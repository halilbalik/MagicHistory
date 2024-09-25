import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { View, Text } from '@/components/Themed';
import { HistoryItem } from '@/types/history';
import { getDetailedExplanation, translateText } from '@/services/translationService';
import { useWikipediaImage } from '@/hooks/useWikipediaImage';
import { Colors } from '@/constants/Colors';

function DetailsContent({ event, date }: { event: HistoryItem; date?: string }) {
  const { imageUrl: wikipediaImageUrl } = useWikipediaImage(event.links);
  const [translatedText, setTranslatedText] = useState('');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    async function getContent() {
      setIsTranslating(true);
      const [translation, explanation] = await Promise.all([
        translateText(event.text),
        getDetailedExplanation(event.text),
      ]);
      setTranslatedText(translation);
      setDetailedExplanation(explanation);
      setIsTranslating(false);
    }
    getContent();
  }, [event]);

  function handleWikipediaLink() {
    const link = event.links[event.links.length - 1]?.link;
    if (link) {
      Linking.openURL(link);
    }
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={'#111827'} />
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

          {isTranslating ? (
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
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    color: '#111827',
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
    color: '#111827',
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
    color: '#1F2937',
  },
  geminiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  geminiChipText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B46C1',
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#374151',
  },
  footer: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  wikipediaButton: {
    backgroundColor: '#1F2937',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
