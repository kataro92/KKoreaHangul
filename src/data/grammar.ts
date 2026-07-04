/** Kiểu dữ liệu cho ngữ pháp + truy cập tiện lợi vào grammar.json */
import grammarData from './grammar.json';

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

export function getGrammarByLevel(level: GrammarLevel): GrammarItem[] {
  if (level === 'basics') return GRAMMAR_BASICS;
  return level === 'topik1' ? GRAMMAR_TOPIK1 : GRAMMAR_TOPIK2;
}

export function getGrammarById(id: string): GrammarItem | undefined {
  return ALL_GRAMMAR.find((g) => g.id === id);
}
