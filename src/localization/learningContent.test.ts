import en from './content/en.json';
import zh from './content/zh.json';
import hi from './content/hi.json';
import es from './content/es.json';
import fr from './content/fr.json';
import ja from './content/ja.json';
import vocabulary from '../data/vocabulary.json';
import { ALL_GRAMMAR, getGrammarById, getGrammarByLevel } from '../data/grammar';
import { SENTENCES_TOPIK1, SENTENCES_TOPIK2, getSentenceMeaning, getSentencePronunciation } from '../data/sentences';
import { getVocabularyMeaning, getLearningUiText } from './learningContent';
import { getPrivacyPolicy } from '../legal/privacy';
import policy from '../legal/privacy-policy.json';
import sentenceRomanization from '../data/sentenceRomanization.json';
import { SUPPORTED_LOCALES } from './locale';
import { getPartPronunciations, getTextPronunciation, resolvePhoneticSystem } from '../data/phonetics';
import { decomposeString } from '../utils/decompose';

const catalogs = { en, zh, hi, es, fr, ja };
const entries = [...vocabulary.topik1.entries, ...vocabulary.topik2.entries];
const sentences = [...SENTENCES_TOPIK1, ...SENTENCES_TOPIK2];
// Prose word order may change, but every Korean token must remain verbatim.
const korean = (text: string) => (text.match(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]+/g) ?? []).sort();

describe('offline learning content coverage', () => {
  it('has a romanized guide for every practice sentence, including compound final consonants', () => {
    const guides = sentenceRomanization as Record<string, string>;
    for (const sentence of sentences) expect(guides[sentence.id]?.length).toBeGreaterThan(0);
    const sentence = sentences.find((sentence) => sentence.ko === '여기 앉아도 돼요?')!;
    expect(getSentencePronunciation(sentence, 'en')).toBe('yeogi anj-ado dwaeyo?');
  });
  it.each(SUPPORTED_LOCALES.filter((locale) => locale !== 'vi'))('covers every grammar field and reading meaning in %s', (locale) => {
    const dictionary = catalogs[locale].fromVietnamese as Record<string, string>;
    for (const item of ALL_GRAMMAR) {
      const fields = [item.title, item.structure, item.explanation, item.usage, ...item.tags,
        ...item.examples.flatMap((example) => [example.vi, example.note]).filter((text): text is string => !!text)];
      for (const text of fields.filter(Boolean)) {
        expect(dictionary[text]).toEqual(expect.any(String));
        expect(dictionary[text].trim().length).toBeGreaterThan(0);
        expect(korean(dictionary[text])).toEqual(korean(text));
        expect(dictionary[text]).not.toMatch(/__K\d+__/);
      }
    }
    for (const sentence of sentences) expect(dictionary[sentence.vi]?.length).toBeGreaterThan(0);
  });

  it.each(['zh', 'hi', 'es', 'fr', 'ja'] as const)('covers all vocabulary and privacy text in %s', (locale) => {
    const dictionary = catalogs[locale].fromEnglish as Record<string, string>;
    const fields = [...entries.map((entry) => entry.meaning), policy.en.title,
      ...policy.en.sections.flatMap((section) => [section.title, ...section.paragraphs])];
    for (const text of fields) expect(dictionary[text]?.length).toBeGreaterThan(0);
  });
});

describe('switching the selected language', () => {
  it('selects English and Vietnamese vocabulary without preferring Vietnamese in English', () => {
    const entry = entries.find((entry) => entry.word === '가게')!;
    expect(getVocabularyMeaning(entry, 'en')).toBe('store, shop');
    expect(getVocabularyMeaning(entry, 'vi')).toBe('cửa hàng');
    expect(getVocabularyMeaning(entry, 'ja')).toBe('店、商店');
    expect(getVocabularyMeaning({ word: '가게', meaning: 'shop', pos: 'n' }, 'vi')).toBe('shop');
  });

  it('localizes grammar lists, search fields, details, notes and example meanings', () => {
    const item = getGrammarById('n-eun-neun', 'en')!;
    expect(item.title).toBe('N은/는');
    expect(item.explanation).toMatch(/topic/i);
    expect(item.tags).toContain('topic');
    expect(item.examples[0].translation).toMatch(/student/i);
    expect(item.examples[0].note).toMatch(/without|no/i);
    expect(getGrammarByLevel('topik1', 'en').filter((grammar) => grammar.tags.includes('topic')).length).toBeGreaterThan(0);
    expect(getGrammarById('n-eun-neun', 'vi')!.explanation).toBe(ALL_GRAMMAR.find((grammar) => grammar.id === 'n-eun-neun')!.explanation);
    expect(getGrammarById('missing', 'en')).toBeUndefined();
  });

  it.each(SUPPORTED_LOCALES)('preserves original Korean examples and data in %s', (locale) => {
    for (const original of ALL_GRAMMAR) {
      const translated = getGrammarById(original.id, locale)!;
      expect(translated.examples.map((example) => example.ko)).toEqual(original.examples.map((example) => example.ko));
      expect(translated.level).toBe(original.level);
    }
    expect(getPrivacyPolicy(locale).sections).toHaveLength(policy.en.sections.length);
    expect(getLearningUiText('aboutDescription', locale)?.length).toBeGreaterThan(0);
  });

  it('localizes reading meanings while honoring the selected pronunciation system', () => {
    const sentence = SENTENCES_TOPIK1[0];
    expect(getSentenceMeaning(sentence, 'en')).toBe('Hello.');
    expect(getSentenceMeaning(sentence, 'vi')).toBe('Xin chào.');
    expect(getSentencePronunciation(sentence, 'vi')).toBe(sentence.phonetic_vi);
    expect(getSentencePronunciation(sentence, 'en')).toBe('annyeonghaseyo.');
    expect(getSentencePronunciation(sentence, 'vi', 'romanization')).toBe('annyeonghaseyo.');
    expect(getTextPronunciation('하나 둘!', 'ipa', 'en')).toBe('/hana/ /tul/!');
    expect(resolvePhoneticSystem('ipa', 'vi')).toBe('ipa');
    const syllable = decomposeString('아')[0];
    expect(getPartPronunciations(syllable, resolvePhoneticSystem('default', 'en')).initial).toBe('');
  });
});
