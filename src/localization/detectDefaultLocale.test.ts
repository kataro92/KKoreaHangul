jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn() }));
jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));

import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';
import { detectDefaultLocale } from './detectDefaultLocale';

const nativeModule = requireOptionalNativeModule as jest.Mock;

beforeEach(() => {
  nativeModule.mockReset();
  Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });
});

it('uses Play country without consulting device language or region', async () => {
  nativeModule.mockReturnValue({ getCountryCode: jest.fn().mockResolvedValue('VN') });
  expect(await detectDefaultLocale()).toBe('vi');
  expect(nativeModule).toHaveBeenCalledWith('PlayCountry');
});

it.each(['DE', null, ''])('falls back to English for Play country %p', async (country) => {
  nativeModule.mockReturnValue({ getCountryCode: jest.fn().mockResolvedValue(country) });
  expect(await detectDefaultLocale()).toBe('en');
});

it('falls back to English when native code is unavailable (Expo Go or older binary)', async () => {
  nativeModule.mockReturnValue(null);
  expect(await detectDefaultLocale()).toBe('en');
});

it('falls back to English when the native query fails', async () => {
  nativeModule.mockReturnValue({ getCountryCode: jest.fn().mockRejectedValue(new Error('Offline')) });
  expect(await detectDefaultLocale()).toBe('en');
});

it('falls back to English if native module lookup fails', async () => {
  nativeModule.mockImplementation(() => { throw new Error('Unavailable'); });
  expect(await detectDefaultLocale()).toBe('en');
});

it.each(['ios', 'web'])('uses English on %s without querying Google Play', async (platform) => {
  Object.defineProperty(Platform, 'OS', { value: platform, configurable: true });
  expect(await detectDefaultLocale()).toBe('en');
  expect(nativeModule).not.toHaveBeenCalled();
});
