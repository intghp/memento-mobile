import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import pt from './pt.json';

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  pt: 'Português',
};

// Pega o idioma padrão do celular do usuário (ex: 'pt-BR' vira 'pt')
let systemLanguage = 'en';
try {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    systemLanguage = locales[0].languageCode || 'en';
  }
} catch (error) {
  console.log('Erro ao pegar idioma do sistema', error);
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    lng: systemLanguage, // Inicia com o idioma do celular
    fallbackLng: 'en', // Caso o idioma do celular não seja suportado, usa inglês como padrão
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;