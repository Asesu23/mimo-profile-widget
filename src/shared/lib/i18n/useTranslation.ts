'use client';

import { useState } from 'react';
import { STRINGS, type Locale } from './strings';

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');
  const t = (key: string) => STRINGS[locale][key] ?? key;
  return { locale, setLocale, t };
}
