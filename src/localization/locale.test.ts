import { localeForPlayCountry, resolveInitialLocale, SUPPORTED_LOCALES } from './locale';

describe('initial app language', () => {
  it.each(SUPPORTED_LOCALES)('keeps the saved %s choice without detecting again', async (locale) => {
    const detect = jest.fn(() => 'vi');
    expect(await resolveInitialLocale(locale, detect)).toBe(locale);
    expect(detect).not.toHaveBeenCalled();
  });

  it('detects Vietnamese for a fresh install', async () => {
    expect(await resolveInitialLocale(null, () => 'vi')).toBe('vi');
  });

  it.each([null, undefined, '', 'de', 'ko', { locale: 'vi' }])(
    'uses English when detection returns unsupported or missing data: %p',
    async (detected) => {
      expect(await resolveInitialLocale(null, () => detected)).toBe('en');
    },
  );

  it('ignores an invalid saved value and detects the default again', async () => {
    expect(await resolveInitialLocale('broken', () => 'ja')).toBe('ja');
  });

  it('uses English if detection fails', async () => {
    expect(await resolveInitialLocale(null, async () => { throw new Error('Unavailable'); })).toBe('en');
  });
});

describe('Google Play country defaults', () => {
  it.each([
    ['VN', 'vi'], ['CN', 'zh'], ['TW', 'zh'], ['HK', 'zh'], ['MO', 'zh'],
    ['IN', 'hi'], ['JP', 'ja'], ['FR', 'fr'], ['ES', 'es'], ['MX', 'es'],
    ['US', 'en'], ['GB', 'en'], ['DE', 'en'], ['KR', 'en'],
  ])('maps %s to %s', (country, locale) => {
    expect(localeForPlayCountry(country)).toBe(locale);
  });

  it.each([null, undefined, '', 'unknown', 84, {}, 'toString', '__proto__'])('%p falls back to English', (country) => {
    expect(localeForPlayCountry(country)).toBe('en');
  });

  it('normalizes the country code', () => {
    expect(localeForPlayCountry(' vn ')).toBe('vi');
  });

  it('keeps a manual English choice for a Vietnamese Play account', async () => {
    expect(await resolveInitialLocale('en', () => localeForPlayCountry('VN'))).toBe('en');
  });
});
