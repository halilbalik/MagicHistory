import { ApiResponse } from '@/types/history';

const API_BASE_URL = 'https://history.muffinlabs.com/date';

export async function fetchHistoryData(date: Date): Promise<ApiResponse> {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const response = await fetch(`${API_BASE_URL}/${month}/${day}`);
  if (!response.ok) {
    throw new Error('Failed to fetch history data');
  }
  return response.json();
}
