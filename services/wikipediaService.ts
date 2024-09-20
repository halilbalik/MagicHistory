import axios from 'axios';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

export async function getWikipediaImage(pageTitle: string): Promise<string | null> {
  const params = {
    action: 'query',
    prop: 'pageimages',
    format: 'json',
    pithumbsize: '500',
    titles: pageTitle,
    origin: '*',
  };

  try {
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params,
      headers: {
        'User-Agent': 'MagicHistoryApp/1.0 (https://github.com/your-repo; your-email@example.com)',
      },
    });

    const data = response.data;
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === '-1' || !pages[pageId].thumbnail) {
      return null;
    }

    return pages[pageId].thumbnail.source;
  } catch (error) {
    console.error(`Wikipedia image fetch error for title "${pageTitle}":`, error);
    return null;
  }
}
