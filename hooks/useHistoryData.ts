import { useState, useEffect } from 'react';
import { ApiResponse } from '../types/history';

const API_BASE_URL = 'https://history.muffinlabs.com/date';

export function useHistoryData(date: Date) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const url = `${API_BASE_URL}/${month}/${day}`;

      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        setData(result);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [date]);

  return { data, loading, error };
}
