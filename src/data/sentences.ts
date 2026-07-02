/** Kiểu dữ liệu + truy cập cho ngân hàng câu luyện đọc. */
import sentencesData from './sentences.json';

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
