// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: {
      جستجو: "جستجو",
      // سایر ترجمه‌ها
    },
  },
  en: {
    translation: {
      جستجو: "Search",
      // سایر ترجمه‌ها
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
