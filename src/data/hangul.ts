/**
 * Bảng chữ cái Hangul và phiên âm tiếng Việt.
 * Thứ tự mảng phải khớp với chỉ số dùng trong công thức phân tách Unicode.
 */

export interface HangulChar {
  char: string;
  pronunciation: string;
  name?: string;
}

// ============ PHỤ ÂM ĐẦU (Chosung) - 19 ký tự, thứ tự Unicode ============
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

// ============ NGUYÊN ÂM (Jungseong) - 21 ký tự ============
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

// ============ PHỤ ÂM CUỐI (Jongseong) - 28 giá trị (0 = không có) ============
export const JONGSEONG: HangulChar[] = [
  { char: '', pronunciation: '', name: 'Không có' },
  { char: 'ㄱ', pronunciation: 'k/g', name: 'Giyeok' },
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

/** Nhóm Batchim theo cách đọc (dùng cho chế độ "Nhóm theo âm") */
export interface BatchimBySoundGroup {
  pronunciation: string;
  items: HangulChar[];
}

const BATCHIM_SOUND_ORDER = ['k/g', 'k', 'n', 't', 'l', 'm', 'p', 'ng'];

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

// ============ Nhóm cho Tab Bảng chữ cái (hiển thị theo từng section) ============

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

// Bổ sung các batchim kép dạng 2 ký tự riêng cho hiển thị
export const BATCHIM_DISPLAY: HangulChar[] = [
  { char: 'ㄱ', pronunciation: 'k/g', name: 'Giyeok' },
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
