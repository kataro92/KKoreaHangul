import type { ImageSourcePropType } from 'react-native';
import { getVocabIllustrationSource } from '../data/vocabIllustrationMap';
import vocabularyData from '../data/vocabulary.json';

type VocabEntry = { word: string; meaning: string; pos: string; vi?: string; illust?: string };

const byWord = new Map<string, string>();
for (const level of ['topik1', 'topik2'] as const) {
  const entries = (vocabularyData as { [k: string]: { entries?: VocabEntry[] } })[level]?.entries ?? [];
  for (const e of entries) {
    if (e.illust && !byWord.has(e.word)) byWord.set(e.word, e.illust);
  }
}

/** Resolve illustration asset for a vocab illust slug or Korean word. */
export function resolveVocabIllustration(
  illustOrWord?: string | null
): ImageSourcePropType | null {
  if (!illustOrWord) return null;
  const direct = getVocabIllustrationSource(illustOrWord);
  if (direct) return direct;
  const slug = byWord.get(illustOrWord);
  return slug ? getVocabIllustrationSource(slug) : null;
}

export function illustSlugForWord(word: string): string | undefined {
  return byWord.get(word);
}
