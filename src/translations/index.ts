import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as resources from './resources';

const ns = Object.keys(Object.values(resources)[0]);
export const defaultNS = ns[0];

i18n.use(initReactI18next).init({
  ns,
  defaultNS,
  resources: Object.entries(resources).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {},
  ),
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4', // hoặc bỏ dòng này nếu không cần
});

export default i18n;
