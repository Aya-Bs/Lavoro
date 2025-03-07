// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import arTranslations from './locales/ar/translation.json';
import deTranslations from './locales/de/translation.json';
import zhTranslations from './locales/zh/translation.json';
import itTranslations from './locales/it/translation.json';
import ruTranslations from './locales/ru/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      ar: { translation: arTranslations },
      de: { translation: deTranslations },
      zh: { translation: zhTranslations },
      it: { translation: itTranslations },
      ru: { translation: ruTranslations },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;