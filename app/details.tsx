import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Linking, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { View, Text } from '@/components/Themed';
import { HistoryItem } from '@/types/history';
import { SafeAreaView } from 'react-native-safe-area-context';
import { translateText } from '@/services/translationService';

export default function DetailsScreen() {
  const { event: eventString } = useLocalSearchParams<{ event: string }>();
  const router = useRouter();
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  if (!eventString) {
    return (
      <View style={styles.center}>
        <Text>Olay bilgisi bulunamadı.</Text>
      </View>
    );
  }

  const event: HistoryItem = JSON.parse(eventString);

  useEffect(() => {
    async function getTranslation() {
      setIsTranslating(true);
      const translation = await translateText(event.text);
      setTranslatedText(translation);
      setIsTranslating(false);
    }

    getTranslation();
  }, [event.text]);

  function handleWikipediaLink() {
    const link = event.links[event.links.length - 1]?.link;
    if (link) {
      Linking.openURL(link);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${event.year}/800/600` }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.imageOverlay} />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tarihte Bugün</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.imageTitle}>{`${event.year} - ${event.text}`}</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{event.text}</Text>
          <View style={styles.divider} />
          {isTranslating ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="small" />
          ) : (
            <Text style={styles.descriptionText}>{translatedText}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: StatusBar.currentHeight || 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    height: 350,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'transparent',
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  descriptionContainer: {
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 24,
  },
  footer: {
    padding: 16,
    paddingBottom: 32, // For safe area
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
