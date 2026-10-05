import {
  BASIC_CONSONANTS,
  BASIC_VOWELS,
  BATCHIM_DISPLAY,
  COMPOUND_VOWELS,
  DOUBLE_CONSONANTS,
  getBatchimGroupedBySound,
  getAlphabetSoundExample,
  getAlphabetSpeakText,
} from './hangul';

describe('alphabet pronunciation', () => {
  it('reads standard consonant names followed by a sound example', () => {
    expect(getAlphabetSpeakText('ㄱ', 'initial')).toBe('기역');
    expect(getAlphabetSoundExample('ㄱ', 'initial')).toBe('가');
    expect(getAlphabetSpeakText('ㅇ', 'initial')).toBe('이응');
    expect(getAlphabetSoundExample('ㅇ', 'initial')).toBe('아');
    expect(getAlphabetSpeakText('ㅉ', 'initial')).toBe('쌍지읒');

    for (const { char } of [...BASIC_CONSONANTS, ...DOUBLE_CONSONANTS]) {
      expect(getAlphabetSpeakText(char, 'initial')).toMatch(/^[가-힣]+$/);
      expect(getAlphabetSoundExample(char, 'initial')).toMatch(/^[가-힣]$/);
    }
  });

  it('reads every vowel as a standalone syllable', () => {
    expect(getAlphabetSpeakText('ㅏ', 'vowel')).toBe('아');
    expect(getAlphabetSpeakText('ㅢ', 'vowel')).toBe('의');
    for (const { char } of [...BASIC_VOWELS, ...COMPOUND_VOWELS]) {
      expect(getAlphabetSpeakText(char, 'vowel')).toMatch(/^[가-힣]$/);
    }
  });

  it('uses real words for all final consonants, including clusters', () => {
    expect(getAlphabetSpeakText('ㄳ', 'final')).toBe('국');
    expect(getAlphabetSpeakText('ㄻ', 'final')).toBe('밤');
    expect(getAlphabetSpeakText('ㅎ', 'final')).toBe('옷');
    for (const { char } of BATCHIM_DISPLAY) {
      expect(getAlphabetSpeakText(char, 'final')).toMatch(/^[가-힣]+$/);
    }
    expect(getBatchimGroupedBySound()[0].items.map(({ char }) => char)).toEqual(['ㄱ', 'ㄲ', 'ㄳ', 'ㄺ', 'ㅋ']);
  });
});
