import en from './content/en.json';
import zh from './content/zh.json';
import hi from './content/hi.json';
import es from './content/es.json';
import fr from './content/fr.json';
import ja from './content/ja.json';
import type { Locale } from './locale';

type Catalog = { fromVietnamese: Record<string, string>; fromEnglish: Record<string, string> };
const catalogs: Record<Exclude<Locale, 'vi'>, Catalog> = { en, zh, hi, es, fr, ja };

/** Offline lesson translations. Korean examples and formulas remain Korean. */
export function translateVietnamese(text: string, locale: Locale): string {
  if (locale === 'vi') return text;
  return catalogs[locale].fromVietnamese[text] ?? catalogs.en.fromVietnamese[text] ?? text;
}

export function translateEnglish(text: string, locale: Locale): string {
  if (locale === 'en' || locale === 'vi') return text;
  return catalogs[locale].fromEnglish[text] ?? text;
}

export type VocabularyEntry = { word: string; meaning: string; vi?: string; pos: string; illust?: string };

export function getVocabularyMeaning(entry: VocabularyEntry, locale: Locale): string {
  return locale === 'vi' ? entry.vi || entry.meaning : translateEnglish(entry.meaning, locale);
}

const uiEnglish = {
  aboutDescription: 'KKorea Hangul helps you learn Korean with the Hangul alphabet, reading and pronunciation practice, TOPIK I and II grammar and vocabulary, and spaced repetition (SM2). Lessons and the interface follow your selected language. The app supports seven languages, text to speech, and light or dark mode.',
  alphabetSubtitle: 'Korean letters and pronunciation',
  vocabEmptyHint: 'No vocabulary is available for this level yet.',
};
const uiVietnamese: typeof uiEnglish = {
  aboutDescription: 'KKorea Hangul giúp bạn học tiếng Hàn qua bảng chữ Hangul, luyện đọc và phát âm, ngữ pháp và từ vựng TOPIK I và II, cùng phương pháp lặp lại ngắt quãng (SM2). Bài học và giao diện hiển thị theo ngôn ngữ bạn chọn. Ứng dụng hỗ trợ bảy ngôn ngữ, giọng đọc và chế độ sáng hoặc tối.',
  alphabetSubtitle: 'Chữ cái tiếng Hàn và cách phát âm',
  vocabEmptyHint: 'Chưa có từ vựng cho cấp độ này.',
};

export function getLearningUiText(key: string, locale: Locale): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(uiEnglish, key)) return undefined;
  const typedKey = key as keyof typeof uiEnglish;
  return locale === 'vi' ? uiVietnamese[typedKey] : translateEnglish(uiEnglish[typedKey], locale);
}

export const CARD_TYPE_LABELS: Record<Locale, Record<'vocab' | 'sentence' | 'grammar' | 'custom', string>> = {
  en: { vocab: 'Vocabulary', sentence: 'Sentence', grammar: 'Grammar', custom: 'Custom' },
  vi: { vocab: 'Từ vựng', sentence: 'Câu', grammar: 'Ngữ pháp', custom: 'Tự tạo' },
  zh: { vocab: '词汇', sentence: '句子', grammar: '语法', custom: '自定义' },
  hi: { vocab: 'शब्दावली', sentence: 'वाक्य', grammar: 'व्याकरण', custom: 'कस्टम' },
  es: { vocab: 'Vocabulario', sentence: 'Oración', grammar: 'Gramática', custom: 'Personalizada' },
  fr: { vocab: 'Vocabulaire', sentence: 'Phrase', grammar: 'Grammaire', custom: 'Personnalisée' },
  ja: { vocab: '語彙', sentence: '文', grammar: '文法', custom: 'カスタム' },
};
