/** Kiểu dữ liệu + truy cập cho ngân hàng câu luyện đọc. */
import sentencesData from './sentences.json';
import sentenceRomanization from './sentenceRomanization.json';
import type { Locale } from '../localization/locale';
import { translateVietnamese } from '../localization/learningContent';
import { getTextPronunciation, resolvePhoneticSystem, type PhoneticSystem } from './phonetics';

export type SentenceLevel = 'topik1' | 'topik2';

export interface Sentence {
  id: string;
  ko: string;
  vi: string;
  phonetic_vi: string;
  tags: string[];
}

export const SENTENCES_TOPIK1: Sentence[] =
  (sentencesData.topik1 as Sentence[]) ?? [];
export const SENTENCES_TOPIK2: Sentence[] =
  (sentencesData.topik2 as Sentence[]) ?? [];

export function getSentenceMeaning(sentence: Sentence, locale: Locale): string {
  return translateVietnamese(sentence.vi, locale);
}

export function getSentencePronunciation(sentence: Sentence, locale: Locale, system: PhoneticSystem = 'default'): string {
  if (locale === 'vi' && system === 'default') return sentence.phonetic_vi;
  if (resolvePhoneticSystem(system, locale) === 'romanization') {
    const guide = (sentenceRomanization as Record<string, string>)[sentence.id];
    if (guide) return guide;
  }
  return getTextPronunciation(sentence.ko, system, locale);
}

export function getSentencesByLevel(level: SentenceLevel): Sentence[] {
  return level === 'topik1' ? SENTENCES_TOPIK1 : SENTENCES_TOPIK2;
}

/** Lấy câu ngẫu nhiên, tránh trùng câu hiện tại nếu có thể. */
export function getRandomSentence(
  level: SentenceLevel,
  excludeId?: string
): Sentence | null {
  const list = getSentencesByLevel(level);
  if (list.length === 0) return null;
  if (list.length === 1) return list[0];
  let next = list[Math.floor(Math.random() * list.length)];
  let guard = 0;
  while (excludeId && next.id === excludeId && guard < 10) {
    next = list[Math.floor(Math.random() * list.length)];
    guard += 1;
  }
  return next;
}
