/**
 * Đồng bộ mặt sau (nghĩa) của thẻ SR với dữ liệu nguồn mới nhất.
 * Dùng để cập nhật nghĩa tiếng Việt cho các thẻ đã thêm trước khi có bản dịch.
 * Chỉ áp dụng cho thẻ 'vocab' và 'sentence'; thẻ 'custom'/'grammar' giữ nguyên.
 */
import vocabularyData from '../data/vocabulary.json';
import sentencesData from '../data/sentences.json';
import type { SrsCard } from './types';

type Vocab = { word: string; meaning: string; vi?: string };
type Sent = { id: string; ko: string; vi: string };

const vocabByWord = new Map<string, string>();
for (const lv of ['topik1', 'topik2'] as const) {
  const entries = (vocabularyData as any)[lv]?.entries as Vocab[] | undefined;
  entries?.forEach((e) => vocabByWord.set(e.word, e.vi || e.meaning));
}

const sentById = new Map<string, string>();
const sentByKo = new Map<string, string>();
for (const lv of ['topik1', 'topik2'] as const) {
  const list = (sentencesData as any)[lv] as Sent[] | undefined;
  list?.forEach((s) => {
    sentById.set(s.id, s.vi);
    sentByKo.set(s.ko, s.vi);
  });
}

/** Trả về mặt sau mới nhất cho một thẻ, hoặc null nếu không cần đổi. */
export function freshBack(card: SrsCard): string | null {
  let next: string | undefined;
  if (card.type === 'vocab') {
    next = vocabByWord.get(card.front);
  } else if (card.type === 'sentence') {
    next = (card.extra?.sourceId && sentById.get(card.extra.sourceId)) || sentByKo.get(card.front);
  }
  if (next && next !== card.back) return next;
  return null;
}

/** Áp dụng đồng bộ cho danh sách thẻ. Trả về { cards, changed }. */
export function syncMeanings(cards: SrsCard[]): { cards: SrsCard[]; changed: number } {
  let changed = 0;
  const nextCards = cards.map((card) => {
    const nb = freshBack(card);
    if (nb) {
      changed += 1;
      return { ...card, back: nb };
    }
    return card;
  });
  return { cards: changed ? nextCards : cards, changed };
}
