import { GoogleGenerativeAI } from '@google/generative-ai';
import AppSettings from '@/constants/AppSettings';

let genAI: GoogleGenerativeAI | null = null;

if (AppSettings.GEMINI_API_KEY && AppSettings.GEMINI_API_KEY !== 'YAPI_ANAHTARINIZI_BURAYA_GIRIN') {
  genAI = new GoogleGenerativeAI(AppSettings.GEMINI_API_KEY);
}

export async function translateText(text: string): Promise<string> {
  if (!genAI) {
    return 'API anahtarı geçerli değil. Lütfen .env dosyasını kontrol edin.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Translate the following English text to Turkish: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return 'Metin çevrilirken bir hata oluştu.';
  }
}

export interface RelatedEvent {
  year: string;
  text: string;
  date: {
    month: number;
    day: number;
  };
}

export async function getDetailedExplanation(text: string): Promise<string> {
  if (!genAI) {
    return ''; 
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Aşağıdaki tarihi olay hakkında Türkçe olarak, bir paragraf halinde daha detaylı bir açıklama yaz: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const detailedText = response.text();
    return detailedText;
  } catch (error) {
    console.error('Detailed explanation error:', error);
    return 'Detaylı açıklama alınırken bir hata oluştu.';
  }
}

export async function getRelatedEvents(text: string): Promise<RelatedEvent[]> {
  if (!genAI) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Tarihi olayla ilgili 3 tane daha olay öner: \"${text}\". Cevabını sadece aşağıdaki JSON formatında bir dizi olarak ver. Başka hiçbir metin ekleme. Örnek: [{ \"year\": \"1969\", \"text\": \"Apollo 11 aya indi\", \"date\": { \"month\": 7, \"day\": 20 } }]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().replace(/```json|```/g, '').trim();
    const relatedEvents: RelatedEvent[] = JSON.parse(responseText);
    return relatedEvents;
  } catch (error) {
    console.error('Related events error:', error);
    return [];
  }
}
