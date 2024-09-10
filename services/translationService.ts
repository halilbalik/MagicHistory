import { GoogleGenerativeAI } from '@google/generative-ai';
import AppSettings from '../appsettings';

const genAI = new GoogleGenerativeAI(AppSettings.GEMINI_API_KEY);

export async function translateText(text: string): Promise<string> {
  if (!AppSettings.GEMINI_API_KEY || AppSettings.GEMINI_API_KEY === 'YAPI_ANAHTARINIZI_BURAYA_GIRIN') {
    return 'API anahtarı geçerli değil. Lütfen appsettings.js dosyasını kontrol edin.';
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
