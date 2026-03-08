/**
 * Decompose Hangul syllables (Unicode U+AC00..U+D7A3) into initial consonant, vowel, and final consonant.
 */

import { CHOSUNG, JUNGSEONG, JONGSEONG } from '../data/hangul';

const HANGUL_BASE = 0xac00;
const CHOSUNG_COUNT = 19;
const JUNGSEONG_COUNT = 21;
const JONGSEONG_COUNT = 28;
const SYLLABLE_SIZE = JUNGSEONG_COUNT * JONGSEONG_COUNT; // 21 * 28

export interface DecomposedSyllable {
  syllable: string;
  initialIndex: number;
  medialIndex: number;
  finalIndex: number;
  initialChar: string;
  medialChar: string;
  finalChar: string;
  initialPronunciation: string;
  medialPronunciation: string;
  finalPronunciation: string;
  /** Syllable pronunciation (romanization) */
  syllablePronunciation: string;
}

function isHangulSyllable(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3;
}

/**
 * Decompose a single Hangul character into Chosung, Jungseong, Jongseong.
 */
function decomposeChar(char: string): DecomposedSyllable | null {
  if (char.length !== 1 || !isHangulSyllable(char)) {
    return null;
  }
  const code = char.charCodeAt(0) - HANGUL_BASE;
  const initialIndex = Math.floor(code / SYLLABLE_SIZE);
  const medialIndex = Math.floor((code % SYLLABLE_SIZE) / JONGSEONG_COUNT);
  const finalIndex = code % JONGSEONG_COUNT;

  const initial = CHOSUNG[initialIndex];
  const medial = JUNGSEONG[medialIndex];
  const final = JONGSEONG[finalIndex];

  const initialPron = initial.pronunciation === '(câm)' ? '' : initial.pronunciation;
  const medialPron = medial.pronunciation;
  const finalPron = final.pronunciation;
  const parts = [initialPron, medialPron, finalPron].filter(Boolean);
  const syllablePronunciation = parts.join(' ').trim() || char;

  return {
    syllable: char,
    initialIndex,
    medialIndex,
    finalIndex,
    initialChar: initial.char,
    medialChar: medial.char,
    finalChar: final.char,
    initialPronunciation: initial.pronunciation,
    medialPronunciation: medial.pronunciation,
    finalPronunciation: final.pronunciation,
    syllablePronunciation,
  };
}

/**
 * Split a string into Hangul syllables and other characters; returns the decomposed list.
 */
export function decomposeString(input: string): DecomposedSyllable[] {
  const result: DecomposedSyllable[] = [];
  for (const char of input) {
    if (isHangulSyllable(char)) {
      const d = decomposeChar(char);
      if (d) result.push(d);
    }
  }
  return result;
}
