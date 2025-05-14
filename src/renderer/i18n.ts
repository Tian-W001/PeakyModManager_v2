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

export function updateCharacterTranslations(
  charactersTranslations: Record<string, {
    fullnames: Record<string, string>,
    nicknames: Record<string, string>,
}>) {

  Object.entries(charactersTranslations).forEach(([lang, translations]) => {
    i18n.addResourceBundle(
      lang, 
      'characters', 
      {
        fullnames: translations.fullnames,
        nicknames: translations.nicknames,
      },
      true, //override existing
      true  //silent
    );
  });
}

export default i18n;
