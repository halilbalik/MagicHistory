import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Themed';
import { HistoryItem } from '@/types/history';
import { useWikipediaImage } from '@/hooks/useWikipediaImage';
import { Colors } from '@/constants/Colors';

interface EventCardProps {
  item: HistoryItem;
  onPress: () => void;
}

const placeholderImage = require('@/assets/images/icon.png');

export default function EventCard({ item, onPress }: EventCardProps) {
  const { imageUrl, loading } = useWikipediaImage(item.links);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Image
            source={imageUrl ? { uri: imageUrl } : placeholderImage}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        )}
      </View>
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

const styles = StyleSheet.create({
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
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
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
