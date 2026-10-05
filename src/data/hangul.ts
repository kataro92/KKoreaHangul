/**
 * Hangul alphabet and romanization (Vietnamese).
 * Array order must match the indices used in the Unicode decomposition formula.
 */

export interface HangulChar {
  char: string;
  pronunciation: string;
  name?: string;
}

// ============ INITIAL CONSONANTS (Chosung) - 19 chars, Unicode order ============
export const CHOSUNG: HangulChar[] = [
  { char: 'ㄱ', pronunciation: 'g/k', name: 'Giyeok' },
  { char: 'ㄲ', pronunciation: 'kk', name: 'Ssanggiyeok' },
  { char: 'ㄴ', pronunciation: 'n', name: 'Nieun' },
  { char: 'ㄷ', pronunciation: 'd/t', name: 'Digeut' },
  { char: 'ㄸ', pronunciation: 'tt', name: 'Ssangdigeut' },
  { char: 'ㄹ', pronunciation: 'r/l', name: 'Rieul' },
  { char: 'ㅁ', pronunciation: 'm', name: 'Mieum' },
  { char: 'ㅂ', pronunciation: 'b/p', name: 'Bieup' },
  { char: 'ㅃ', pronunciation: 'pp', name: 'Ssangbieup' },
  { char: 'ㅅ', pronunciation: 's', name: 'Siot' },
  { char: 'ㅆ', pronunciation: 'ss', name: 'Ssangsiot' },
  { char: 'ㅇ', pronunciation: '(câm)', name: 'Ieung' },
  { char: 'ㅈ', pronunciation: 'j', name: 'Jieut' },
  { char: 'ㅉ', pronunciation: 'jj', name: 'Ssangjieut' },
  { char: 'ㅊ', pronunciation: 'ch', name: 'Chieut' },
  { char: 'ㅋ', pronunciation: 'k', name: 'Kieuk' },
  { char: 'ㅌ', pronunciation: 't', name: 'Tieut' },
  { char: 'ㅍ', pronunciation: 'p', name: 'Pieup' },
  { char: 'ㅎ', pronunciation: 'h', name: 'Hieut' },
];

// ============ VOWELS (Jungseong) - 21 chars ============
export const JUNGSEONG: HangulChar[] = [
  { char: 'ㅏ', pronunciation: 'a', name: 'A' },
  { char: 'ㅐ', pronunciation: 'ae', name: 'Ae' },
  { char: 'ㅑ', pronunciation: 'ya', name: 'Ya' },
  { char: 'ㅒ', pronunciation: 'yae', name: 'Yae' },
  { char: 'ㅓ', pronunciation: 'eo', name: 'Eo' },
  { char: 'ㅔ', pronunciation: 'e', name: 'E' },
  { char: 'ㅕ', pronunciation: 'yeo', name: 'Yeo' },
  { char: 'ㅖ', pronunciation: 'ye', name: 'Ye' },
  { char: 'ㅗ', pronunciation: 'o', name: 'O' },
  { char: 'ㅘ', pronunciation: 'wa', name: 'Wa' },
  { char: 'ㅙ', pronunciation: 'wae', name: 'Wae' },
  { char: 'ㅚ', pronunciation: 'oe', name: 'Oe' },
  { char: 'ㅛ', pronunciation: 'yo', name: 'Yo' },
  { char: 'ㅜ', pronunciation: 'u', name: 'U' },
  { char: 'ㅝ', pronunciation: 'wo', name: 'Wo' },
  { char: 'ㅞ', pronunciation: 'we', name: 'We' },
  { char: 'ㅟ', pronunciation: 'wi', name: 'Wi' },
  { char: 'ㅠ', pronunciation: 'yu', name: 'Yu' },
  { char: 'ㅡ', pronunciation: 'eu', name: 'Eu' },
  { char: 'ㅢ', pronunciation: 'ui', name: 'Ui' },
  { char: 'ㅣ', pronunciation: 'i', name: 'I' },
];

// ============ FINAL CONSONANTS (Jongseong) - 28 values (0 = none) ============
export const JONGSEONG: HangulChar[] = [
  { char: '', pronunciation: '', name: 'Không có' },
  { char: 'ㄱ', pronunciation: 'k', name: 'Giyeok' },
  { char: 'ㄲ', pronunciation: 'k', name: 'Ssanggiyeok' },
  { char: 'ㄳ', pronunciation: 'k', name: 'Giyeok-siot' },
  { char: 'ㄴ', pronunciation: 'n', name: 'Nieun' },
  { char: 'ㄵ', pronunciation: 'n', name: 'Nieun-jieut' },
  { char: 'ㄶ', pronunciation: 'n', name: 'Nieun-hieut' },
  { char: 'ㄷ', pronunciation: 't', name: 'Digeut' },
  { char: 'ㄹ', pronunciation: 'l', name: 'Rieul' },
  { char: 'ㄺ', pronunciation: 'k', name: 'Rieul-giyeok' },
  { char: 'ㄻ', pronunciation: 'm', name: 'Rieul-mieum' },
  { char: 'ㄼ', pronunciation: 'l', name: 'Rieul-bieup' },
  { char: 'ㄽ', pronunciation: 'l', name: 'Rieul-siot' },
  { char: 'ㄾ', pronunciation: 'l', name: 'Rieul-tieut' },
  { char: 'ㄿ', pronunciation: 'p', name: 'Rieul-pieup' },
  { char: 'ㅀ', pronunciation: 'l', name: 'Rieul-hieut' },
  { char: 'ㅁ', pronunciation: 'm', name: 'Mieum' },
  { char: 'ㅂ', pronunciation: 'p', name: 'Bieup' },
  { char: 'ㅄ', pronunciation: 'p', name: 'Bieup-siot' },
  { char: 'ㅅ', pronunciation: 't', name: 'Siot' },
  { char: 'ㅆ', pronunciation: 't', name: 'Ssangsiot' },
  { char: 'ㅇ', pronunciation: 'ng', name: 'Ieung' },
  { char: 'ㅈ', pronunciation: 't', name: 'Jieut' },
  { char: 'ㅊ', pronunciation: 't', name: 'Chieut' },
  { char: 'ㅋ', pronunciation: 'k', name: 'Kieuk' },
  { char: 'ㅌ', pronunciation: 't', name: 'Tieut' },
  { char: 'ㅍ', pronunciation: 'p', name: 'Pieup' },
  { char: 'ㅎ', pronunciation: 't', name: 'Hieut' },
];

/** Batchim grouped by pronunciation (for "Group by sound" mode) */
export interface BatchimBySoundGroup {
  pronunciation: string;
  items: HangulChar[];
}

const BATCHIM_SOUND_ORDER = ['k', 'n', 't', 'l', 'm', 'p', 'ng'];

export function getBatchimGroupedBySound(): BatchimBySoundGroup[] {
  const bySound = new Map<string, HangulChar[]>();
  for (const item of BATCHIM_DISPLAY) {
    const key = item.pronunciation.trim();
    if (!bySound.has(key)) bySound.set(key, []);
    bySound.get(key)!.push(item);
  }
  const result: BatchimBySoundGroup[] = [];
  for (const pron of BATCHIM_SOUND_ORDER) {
    const items = bySound.get(pron);
    if (items?.length) result.push({ pronunciation: pron, items });
  }
  for (const [pron, items] of bySound) {
    if (!BATCHIM_SOUND_ORDER.includes(pron))
      result.push({ pronunciation: pron, items });
  }
  return result;
}

// ============ Groups for Alphabet tab (displayed by section) ============

export const BASIC_CONSONANTS: HangulChar[] = [
  { char: 'ㄱ', pronunciation: 'g/k', name: 'Giyeok' },
  { char: 'ㄴ', pronunciation: 'n', name: 'Nieun' },
  { char: 'ㄷ', pronunciation: 'd/t', name: 'Digeut' },
  { char: 'ㄹ', pronunciation: 'r/l', name: 'Rieul' },
  { char: 'ㅁ', pronunciation: 'm', name: 'Mieum' },
  { char: 'ㅂ', pronunciation: 'b/p', name: 'Bieup' },
  { char: 'ㅅ', pronunciation: 's', name: 'Siot' },
  { char: 'ㅇ', pronunciation: '(câm)', name: 'Ieung' },
  { char: 'ㅈ', pronunciation: 'j', name: 'Jieut' },
  { char: 'ㅊ', pronunciation: 'ch', name: 'Chieut' },
  { char: 'ㅋ', pronunciation: 'k', name: 'Kieuk' },
  { char: 'ㅌ', pronunciation: 't', name: 'Tieut' },
  { char: 'ㅍ', pronunciation: 'p', name: 'Pieup' },
  { char: 'ㅎ', pronunciation: 'h', name: 'Hieut' },
];

export const DOUBLE_CONSONANTS: HangulChar[] = [
  { char: 'ㄲ', pronunciation: 'kk', name: 'Ssanggiyeok' },
  { char: 'ㄸ', pronunciation: 'tt', name: 'Ssangdigeut' },
  { char: 'ㅃ', pronunciation: 'pp', name: 'Ssangbieup' },
  { char: 'ㅆ', pronunciation: 'ss', name: 'Ssangsiot' },
  { char: 'ㅉ', pronunciation: 'jj', name: 'Ssangjieut' },
];

export const BASIC_VOWELS: HangulChar[] = [
  { char: 'ㅏ', pronunciation: 'a', name: 'A' },
  { char: 'ㅑ', pronunciation: 'ya', name: 'Ya' },
  { char: 'ㅓ', pronunciation: 'eo', name: 'Eo' },
  { char: 'ㅕ', pronunciation: 'yeo', name: 'Yeo' },
  { char: 'ㅗ', pronunciation: 'o', name: 'O' },
  { char: 'ㅛ', pronunciation: 'yo', name: 'Yo' },
  { char: 'ㅜ', pronunciation: 'u', name: 'U' },
  { char: 'ㅠ', pronunciation: 'yu', name: 'Yu' },
  { char: 'ㅡ', pronunciation: 'eu', name: 'Eu' },
  { char: 'ㅣ', pronunciation: 'i', name: 'I' },
];

export const COMPOUND_VOWELS: HangulChar[] = [
  { char: 'ㅐ', pronunciation: 'ae', name: 'Ae' },
  { char: 'ㅒ', pronunciation: 'yae', name: 'Yae' },
  { char: 'ㅔ', pronunciation: 'e', name: 'E' },
  { char: 'ㅖ', pronunciation: 'ye', name: 'Ye' },
  { char: 'ㅘ', pronunciation: 'wa', name: 'Wa' },
  { char: 'ㅙ', pronunciation: 'wae', name: 'Wae' },
  { char: 'ㅚ', pronunciation: 'oe', name: 'Oe' },
  { char: 'ㅝ', pronunciation: 'wo', name: 'Wo' },
  { char: 'ㅞ', pronunciation: 'we', name: 'We' },
  { char: 'ㅟ', pronunciation: 'wi', name: 'Wi' },
  { char: 'ㅢ', pronunciation: 'ui', name: 'Ui' },
];

// Double batchim as separate 2-char forms for display
export const BATCHIM_DISPLAY: HangulChar[] = [
  { char: 'ㄱ', pronunciation: 'k', name: 'Giyeok' },
  { char: 'ㄲ', pronunciation: 'k', name: 'Ssanggiyeok' },
  { char: 'ㄳ', pronunciation: 'k', name: 'Giyeok-siot' },
  { char: 'ㄴ', pronunciation: 'n', name: 'Nieun' },
  { char: 'ㄵ', pronunciation: 'n', name: 'Nieun-jieut' },
  { char: 'ㄶ', pronunciation: 'n', name: 'Nieun-hieut' },
  { char: 'ㄷ', pronunciation: 't', name: 'Digeut' },
  { char: 'ㄹ', pronunciation: 'l', name: 'Rieul' },
  { char: 'ㄺ', pronunciation: 'k', name: 'Rieul-giyeok' },
  { char: 'ㄻ', pronunciation: 'm', name: 'Rieul-mieum' },
  { char: 'ㄼ', pronunciation: 'l', name: 'Rieul-bieup' },
  { char: 'ㄽ', pronunciation: 'l', name: 'Rieul-siot' },
  { char: 'ㄾ', pronunciation: 'l', name: 'Rieul-tieut' },
  { char: 'ㄿ', pronunciation: 'p', name: 'Rieul-pieup' },
  { char: 'ㅀ', pronunciation: 'l', name: 'Rieul-hieut' },
  { char: 'ㅁ', pronunciation: 'm', name: 'Mieum' },
  { char: 'ㅂ', pronunciation: 'p', name: 'Bieup' },
  { char: 'ㅄ', pronunciation: 'p', name: 'Bieup-siot' },
  { char: 'ㅅ', pronunciation: 't', name: 'Siot' },
  { char: 'ㅆ', pronunciation: 't', name: 'Ssangsiot' },
  { char: 'ㅇ', pronunciation: 'ng', name: 'Ieung' },
  { char: 'ㅈ', pronunciation: 't', name: 'Jieut' },
  { char: 'ㅊ', pronunciation: 't', name: 'Chieut' },
  { char: 'ㅋ', pronunciation: 'k', name: 'Kieuk' },
  { char: 'ㅌ', pronunciation: 't', name: 'Tieut' },
  { char: 'ㅍ', pronunciation: 'p', name: 'Pieup' },
  { char: 'ㅎ', pronunciation: 't', name: 'Hieut' },
];

// ============ Alphabet audio ============
// Letter names: National Institute of Korean Language, Hangul Orthography §4.
// https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5573&mn_id=217
// Final consonants have no independently pronounceable sound. Use a familiar
// word ending in one of the seven standard final sounds instead of inventing
// a syllable from the displayed jamo.
// https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

const CONSONANT_NAMES = [
  '기역', '쌍기역', '니은', '디귿', '쌍디귿', '리을', '미음', '비읍', '쌍비읍',
  '시옷', '쌍시옷', '이응', '지읒', '쌍지읒', '치읓', '키읔', '티읕', '피읖', '히읗',
] as const;

// In Unicode jongseong order. Each word ends in the final sound represented
// by the selected batchim (including clusters and neutralized final sounds).
const FINAL_SOUND_EXAMPLES = [
  '', '국', '국', '국', '산', '산', '산', '옷', '달', '국', '밤', '달', '달',
  '달', '밥', '달', '밤', '밥', '밥', '옷', '옷', '강', '옷', '옷', '국', '옷', '밥', '옷',
] as const;

const HANGUL_SYLLABLE_BASE = 0xac00;

function composeSyllable(chosung: number, jungseong: number, jongseong = 0): string {
  return String.fromCharCode(HANGUL_SYLLABLE_BASE + (chosung * 21 + jungseong) * 28 + jongseong);
}

export type AlphabetSpeakRole = 'initial' | 'vowel' | 'final';

/**
 * Text read when an alphabet card is tapped. Consonants use their standard
 * Korean names, vowels use their standalone syllables, and batchim use real
 * example words with the same final sound.
 */
export function getAlphabetSpeakText(char: string, role: AlphabetSpeakRole): string {
  if (role === 'vowel') {
    const i = JUNGSEONG.findIndex((j) => j.char === char);
    if (i >= 0) return composeSyllable(11, i, 0);
  } else if (role === 'initial') {
    const i = CHOSUNG.findIndex((c) => c.char === char);
    if (i >= 0) return CONSONANT_NAMES[i];
  } else if (role === 'final') {
    const i = JONGSEONG.findIndex((j) => j.char === char);
    if (i > 0) return FINAL_SOUND_EXAMPLES[i];
  }
  return char;
}

/** A simple open syllable makes the initial consonant audible after its name. */
export function getAlphabetSoundExample(char: string, role: AlphabetSpeakRole): string {
  if (role === 'initial') {
    const i = CHOSUNG.findIndex((c) => c.char === char);
    if (i >= 0) return composeSyllable(i, 0);
  }
  return getAlphabetSpeakText(char, role);
}
