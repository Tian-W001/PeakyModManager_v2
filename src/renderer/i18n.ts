import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from './translations/en';
import zhTranslation from "./translations/zh";

const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
