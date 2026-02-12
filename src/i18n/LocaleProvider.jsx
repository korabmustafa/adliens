import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const LocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale] || translations.en,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
