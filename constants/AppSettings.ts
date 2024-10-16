import Constants from 'expo-constants';

interface AppSettingsType {
  GEMINI_API_KEY: string;
}

const AppSettings: AppSettingsType = {
  GEMINI_API_KEY: Constants.expoConfig?.extra?.geminiApiKey || 'YAPI_ANAHTARINIZI_BURAYA_GIRIN',
};

export default AppSettings;
