/** Kiểu dữ liệu cho ngữ pháp + truy cập tiện lợi vào grammar.json */
import grammarData from './grammar.json';
import type { Locale } from '../localization/locale';
import { translateVietnamese } from '../localization/learningContent';

export type GrammarLevel = 'topik1' | 'topik2' | 'basics';

export interface GrammarExample {
  ko: string;
  vi: string;
  note?: string;
}

export interface GrammarItem {
  id: string;
  title: string;
  level: GrammarLevel;
  tags: string[];
  structure: string;
  explanation: string;
  usage: string;
  examples: GrammarExample[];
}

export const GRAMMAR_TOPIK1: GrammarItem[] =
  (grammarData.topik1?.items as GrammarItem[]) ?? [];
export const GRAMMAR_TOPIK2: GrammarItem[] =
  (grammarData.topik2?.items as GrammarItem[]) ?? [];
export const GRAMMAR_BASICS: GrammarItem[] =
  ((grammarData as any).basics?.items as GrammarItem[]) ?? [];

export const ALL_GRAMMAR: GrammarItem[] = [...GRAMMAR_BASICS, ...GRAMMAR_TOPIK1, ...GRAMMAR_TOPIK2];

export type LocalizedGrammarItem = Omit<GrammarItem, 'examples'> & {
  examples: { ko: string; translation: string; note?: string }[];
};

const localized = new Map<Locale, LocalizedGrammarItem[]>();
function getLocalizedGrammar(locale: Locale): LocalizedGrammarItem[] {
  const cached = localized.get(locale);
  if (cached) return cached;
  const tr = (text: string) => translateVietnamese(text, locale);
  const items = ALL_GRAMMAR.map((item) => ({
    ...item,
    title: tr(item.title),
    structure: tr(item.structure),
    explanation: tr(item.explanation),
    usage: tr(item.usage),
    tags: item.tags.map(tr),
    examples: item.examples.map((example) => ({
      ko: example.ko,
      translation: tr(example.vi),
      note: example.note ? tr(example.note) : undefined,
    })),
  }));
  localized.set(locale, items);
  return items;
}

export function getGrammarByLevel(level: GrammarLevel, locale: Locale): LocalizedGrammarItem[] {
  return getLocalizedGrammar(locale).filter((item) => item.level === level);
}

export function getGrammarById(id: string, locale: Locale): LocalizedGrammarItem | undefined {
  return getLocalizedGrammar(locale).find((g) => g.id === id);
}
