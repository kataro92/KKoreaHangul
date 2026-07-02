/**
 * Gợi ý từ vựng để thêm vào ôn tập (rule-based, không cần LLM).
 * Lọc các từ TOPIK chưa có trong bộ thẻ hiện tại và trả về ngẫu nhiên vài từ.
 */
import vocabularyData from '../data/vocabulary.json';

export interface VocabSuggestion {
  word: string;
  meaning: string;
  pos: string;
  vi?: string;
}

const topik1: VocabSuggestion[] = vocabularyData.topik1?.entries ?? [];
const topik2: VocabSuggestion[] = vocabularyData.topik2?.entries ?? [];
const ALL: VocabSuggestion[] = [...topik1, ...topik2];

/**
 * @param existingFronts tập từ đã có trong deck (front của thẻ type 'vocab')
 * @param count số lượng gợi ý mong muốn
 */
export function getSuggestions(
  existingFronts: Set<string>,
  count = 3
): VocabSuggestion[] {
  const pool = ALL.filter((e) => !existingFronts.has(e.word));
  if (pool.length <= count) return pool;
  // Trộn ngẫu nhiên nhẹ rồi lấy `count` phần tử đầu.
  const picked: VocabSuggestion[] = [];
  const used = new Set<number>();
  while (picked.length < count && used.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push(pool[idx]);
  }
  return picked;
}
