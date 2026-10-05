import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';
import { FALLBACK_LOCALE, localeForPlayCountry, type Locale } from './locale';

type PlayCountryModule = { getCountryCode: () => Promise<string | null> };

/** Uses the Google Play account country, never the device region or store listing language. */
export async function detectDefaultLocale(): Promise<Locale> {
  if (Platform.OS !== 'android') return FALLBACK_LOCALE;
  try {
    const native = requireOptionalNativeModule<PlayCountryModule>('PlayCountry');
    if (!native) return FALLBACK_LOCALE;
    return localeForPlayCountry(await native.getCountryCode());
  } catch {
    return FALLBACK_LOCALE;
  }
}
