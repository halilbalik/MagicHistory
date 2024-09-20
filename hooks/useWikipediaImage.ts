import { useState, useEffect } from 'react';
import { getWikipediaImage } from '@/services/wikipediaService';
import { HistoryLink } from '@/types/history';

export function useWikipediaImage(links: HistoryLink[]) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchImage() {
      if (!links || links.length === 0) {
        setLoading(false);
        return;
      }

      // Attempt to get an image from the last link, which is often the main subject
      const mainSubjectLink = links[links.length - 1];
      setLoading(true);
      const url = await getWikipediaImage(mainSubjectLink.title);
      setImageUrl(url);
      setLoading(false);
    }

    fetchImage();
  }, [links]);

  return { imageUrl, loading };
}
