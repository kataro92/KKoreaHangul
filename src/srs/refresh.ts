import vocabularyData from '../data/vocabulary.json';
import { SENTENCES_TOPIK1, SENTENCES_TOPIK2, getSentenceMeaning, getSentencePronunciation } from '../data/sentences';
import { getGrammarById } from '../data/grammar';
import { getVocabularyMeaning, type VocabularyEntry } from '../localization/learningContent';
import type { Locale } from '../localization/locale';
import type { PhoneticSystem } from '../data/phonetics';
import type { SrsCard } from './types';

const vocabByWord = new Map<string, VocabularyEntry>();
for (const level of ['topik1', 'topik2'] as const) {
  vocabularyData[level].entries.forEach((entry) => vocabByWord.set(entry.word, entry));
}
const sentences = [...SENTENCES_TOPIK1, ...SENTENCES_TOPIK2];
const sentById = new Map(sentences.map((sentence) => [sentence.id, sentence]));
const sentByKo = new Map(sentences.map((sentence) => [sentence.ko, sentence]));
const findSentence = (card: SrsCard) =>
  (card.extra?.sourceId ? sentById.get(card.extra.sourceId) : undefined) ?? sentByKo.get(card.front);

/** Resolve built-in cards at render time, including cards saved in another language. */
export function getCardMeaning(card: SrsCard, locale: Locale): string {
  if (card.type === 'vocab') {
    const entry = vocabByWord.get(card.front);
    if (entry) return getVocabularyMeaning(entry, locale);
  } else if (card.type === 'sentence') {
    const sentence = findSentence(card);
    if (sentence) return getSentenceMeaning(sentence, locale);
  } else if (card.type === 'grammar' && card.extra?.sourceId) {
    const grammar = getGrammarById(card.extra.sourceId, locale);
    if (grammar) return grammar.explanation;
  }
  // User-authored or unknown imported content has no built-in translation.
  return card.back;
}

export function getCardPronunciation(card: SrsCard, locale: Locale, system: PhoneticSystem): string | undefined {
  if (card.type === 'sentence') {
    const sentence = findSentence(card);
    if (sentence) return getSentencePronunciation(sentence, locale, system);
  }
  return card.extra?.phonetic;
}

export function freshBack(card: SrsCard, locale: Locale = 'en'): string | null {
  const next = getCardMeaning(card, locale);
  return next !== card.back ? next : null;
}

/** Explicitly refresh saved meanings without changing scheduling or custom cards. */
export function syncMeanings(cards: SrsCard[], locale: Locale = 'en'): { cards: SrsCard[]; changed: number } {
  let changed = 0;
  const nextCards = cards.map((card) => {
    const back = freshBack(card, locale);
    if (back !== null) {
      changed += 1;
      return { ...card, back };
    }
    return card;
  });
  return { cards: changed ? nextCards : cards, changed };
}
