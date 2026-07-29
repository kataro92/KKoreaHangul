/**
 * Hệ thống phiên âm cho màn Đọc.
 * - default: bảng hiện có trong hangul.ts (ghép có khoảng trắng)
 * - romanization: Revised Romanization of Korean (ghép liền)
 * - ipa: IPA rút gọn cho người học (ghép liền, /.../)
 *
 * Thứ tự mảng khớp chỉ số Unicode chosung / jungseong / jongseong.
 */

import type { DecomposedSyllable } from '../utils/decompose';

export type PhoneticSystem = 'default' | 'romanization' | 'ipa';

/** Revised Romanization — phụ âm đầu (19) */
const RR_CHOSUNG = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
] as const;

/** Revised Romanization — nguyên âm (21) */
const RR_JUNGSEONG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
] as const;

/** Revised Romanization — phụ âm cuối (28, index 0 = không có) */
const RR_JONGSEONG = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't',
] as const;

/** IPA — phụ âm đầu */
const IPA_CHOSUNG = [
  'k', 'k͈', 'n', 't', 't͈', 'ɾ', 'm', 'p', 'p͈', 's', 's͈', '', 'tɕ', 't͈ɕ', 'tɕʰ', 'kʰ', 'tʰ', 'pʰ', 'h',
] as const;

/** IPA — nguyên âm */
const IPA_JUNGSEONG = [
  'a', 'ɛ', 'ja', 'jɛ', 'ʌ', 'e', 'jʌ', 'je', 'o', 'wa', 'wɛ', 'we', 'jo', 'u', 'wʌ', 'we', 'wi', 'ju', 'ɯ', 'ɰi', 'i',
] as const;

/** IPA — phụ âm cuối (dạng batchim thường gặp) */
const IPA_JONGSEONG = [
  '', 'k̚', 'k̚', 'k̚', 'n', 'n', 'n', 't̚', 'l', 'k̚', 'm', 'l', 'l', 'l', 'p̚', 'l', 'm', 'p̚', 'p̚', 't̚', 't̚', 'ŋ', 't̚', 't̚', 'k̚', 't̚', 'p̚', 't̚',
] as const;

export type PartPronunciations = {
  initial: string;
  medial: string;
  final: string;
  /** Phiên âm cả âm tiết */
  syllable: string;
};

function lookup(
  chosung: readonly string[],
  jungseong: readonly string[],
  jongseong: readonly string[],
  d: DecomposedSyllable,
  join: 'space' | 'concat',
  wrapIpa = false
): PartPronunciations {
  const initial = chosung[d.initialIndex] ?? '';
  const medial = jungseong[d.medialIndex] ?? '';
  const final = jongseong[d.finalIndex] ?? '';
  const raw =
    join === 'space'
      ? [initial, medial, final].filter(Boolean).join(' ')
      : `${initial}${medial}${final}`;
  const syllable = wrapIpa ? `/${raw || d.syllable}/` : raw || d.syllable;
  return { initial, medial, final, syllable };
}

/** Trả về phiên âm từng bộ phận + cả âm tiết theo hệ đã chọn. */
export function getPartPronunciations(d: DecomposedSyllable, system: PhoneticSystem): PartPronunciations {
  if (system === 'romanization') {
    return lookup(RR_CHOSUNG, RR_JUNGSEONG, RR_JONGSEONG, d, 'concat');
  }
  if (system === 'ipa') {
    return lookup(IPA_CHOSUNG, IPA_JUNGSEONG, IPA_JONGSEONG, d, 'concat', true);
  }
  // default — giữ đúng dữ liệu hiện có
  return {
    initial: d.initialPronunciation,
    medial: d.medialPronunciation,
    final: d.finalPronunciation,
    syllable: d.syllablePronunciation,
  };
}
