
export const languageMap = {
  en: "English",
  zh: "中文",
};

export type TLanguage = keyof typeof languageMap;
export const DEFAULT_LANGUAGE: TLanguage = "en";
