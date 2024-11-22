import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchHistoryData } from '@/services/historyService';
import { ApiResponse, HistoryItem } from '@/types/history';

type Category = 'Events' | 'Births' | 'Deaths';

export function useRandomEvent() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRandomEvent = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    try {
      let eventData: HistoryItem | null = null;
      let randomDateData: ApiResponse | null = null;

      while (!eventData) {
        const randomDayOfYear = Math.floor(Math.random() * 365) + 1;
        const randomDate = new Date(new Date().getFullYear(), 0, randomDayOfYear);
        const fetchedData = await fetchHistoryData(randomDate);

        const categories = Object.keys(fetchedData.data).filter(
          (key) => fetchedData.data[key as Category].length > 0
        ) as Category[];

        if (categories.length > 0) {
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          const events = fetchedData.data[randomCategory];
          if (events.length > 0) {
            const randomIndex = Math.floor(Math.random() * events.length);
            eventData = events[randomIndex];
            randomDateData = fetchedData;
          }
        }
      }

      if (eventData && randomDateData) {
        router.push({
          pathname: '/details',
          params: {
            event: JSON.stringify(eventData),
            date: randomDateData.date,
          },
        });
      }
    } catch (err) {
      console.error('Failed to fetch random event', err);
      const errorMessage = 'Rastgele olay getirilemedi. Lütfen tekrar deneyin.';
      setError(errorMessage);
      Alert.alert('Hata', errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, [router]);

  return { isFetching, error, fetchRandomEvent };
}
