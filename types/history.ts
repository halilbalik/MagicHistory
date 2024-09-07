export interface HistoryLink {
  title: string;
  link: string;
}

export interface HistoryItem {
  year: string;
  text: string;
  html: string;
  no_year_html: string;
  links: HistoryLink[];
}

export interface HistoryData {
  Events: HistoryItem[];
  Births: HistoryItem[];
  Deaths: HistoryItem[];
}

export interface ApiResponse {
  date: string;
  url: string;
  data: HistoryData;
}
