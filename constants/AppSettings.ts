import { GEMINI_API_KEY } from './ApiKeys';

interface AppSettingsType {
  GEMINI_API_KEY: string;
}

const AppSettings: AppSettingsType = {
  GEMINI_API_KEY: GEMINI_API_KEY,
};

export default AppSettings;
