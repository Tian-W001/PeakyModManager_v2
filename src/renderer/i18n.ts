import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './translations/en';
import zh from "./translations/zh";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export async function updateCharacterTranslations() {

  const { translationList } = await window.electron.getCharacters();

  Object.entries(translationList).forEach(([lang, translations]) => {
    i18n.addResourceBundle(
      lang, 
      "translation",
      { Characters: translations }
    );
  });
}

export default i18n;
