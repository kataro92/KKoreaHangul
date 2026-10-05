export const SUPPORTED_LOCALES = ['en', 'vi', 'zh', 'hi', 'es', 'fr', 'ja'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const FALLBACK_LOCALE: Locale = 'en';

// Product defaults by Play country, not a claim about every resident's language.
const COUNTRY_LOCALES: Readonly<Record<string, Locale>> = {
  VN: 'vi', CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', IN: 'hi', JP: 'ja', FR: 'fr',
  ES: 'es', AR: 'es', BO: 'es', CL: 'es', CO: 'es', CR: 'es', CU: 'es', DO: 'es',
  EC: 'es', GT: 'es', HN: 'es', MX: 'es', NI: 'es', PA: 'es', PE: 'es', PY: 'es',
  SV: 'es', UY: 'es', VE: 'es',
};

export function localeForPlayCountry(country: unknown): Locale {
  if (typeof country !== 'string') return FALLBACK_LOCALE;
  return COUNTRY_LOCALES[country.trim().toUpperCase()] ?? FALLBACK_LOCALE;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Keep an explicit choice; only detect a default when storage has no valid choice. */
export async function resolveInitialLocale(
  saved: unknown,
  detectDefault: () => unknown | Promise<unknown>,
): Promise<Locale> {
  if (isLocale(saved)) return saved;
  try {
    const detected = await detectDefault();
    return isLocale(detected) ? detected : FALLBACK_LOCALE;
  } catch {
    return FALLBACK_LOCALE;
  }
}
