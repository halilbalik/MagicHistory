import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/history';
import { fetchHistoryData } from '@/services/historyService';

export function useHistoryData(date: Date) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchHistoryData(date);
        setData(result);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [date]);

  return { data, loading, error };
}
