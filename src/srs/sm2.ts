/**
 * Thuật toán SM-2 (SuperMemo 2) — cùng họ với Anki/Mochi.
 * Các hàm thuần, không phụ thuộc React/storage để dễ kiểm thử.
 */

import type { Rating, SrsCard } from './types';

export const DEFAULT_EASE = 2.5;
export const MIN_EASE = 1.3;

/** Ánh xạ mức tự chấm sang 'quality' 0–5 của SM-2. */
export function ratingToQuality(rating: Rating): number {
  switch (rating) {
    case 'again':
      return 1;
    case 'hard':
      return 3;
    case 'good':
      return 4;
    case 'easy':
      return 5;
  }
}

/** Cộng số ngày vào một mốc thời gian, trả về ISO date (chuẩn hoá về đầu ngày). */
export function addDays(fromISO: string, days: number): string {
  const d = new Date(fromISO);
  d.setDate(d.getDate() + Math.round(days));
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Giá trị SR khởi tạo cho một thẻ mới (đến hạn ngay hôm nay). */
export function initialSrsState(nowISO: string): Pick<
  SrsCard,
  'easeFactor' | 'interval' | 'repetitions' | 'due'
> {
  return {
    easeFactor: DEFAULT_EASE,
    interval: 0,
    repetitions: 0,
    due: addDays(nowISO, 0),
  };
}

export interface Sm2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: string;
}

/**
 * Tính trạng thái mới sau một lần ôn.
 * @param card thẻ hiện tại
 * @param rating mức tự chấm
 * @param nowISO thời điểm ôn (mặc định hiện tại) — truyền vào để kiểm thử tất định
 */
export function review(
  card: Pick<SrsCard, 'easeFactor' | 'interval' | 'repetitions'>,
  rating: Rating,
  nowISO: string = new Date().toISOString()
): Sm2Result {
  const quality = ratingToQuality(rating);

  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Quên → làm lại từ đầu, ôn lại sau 1 ngày.
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Cập nhật hệ số dễ theo công thức SM-2.
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE;
  // Làm tròn 2 chữ số cho gọn.
  easeFactor = Math.round(easeFactor * 100) / 100;

  return {
    easeFactor,
    interval,
    repetitions,
    due: addDays(nowISO, interval),
  };
}

/** Thẻ có đến hạn tại thời điểm nowISO không? */
export function isDue(card: Pick<SrsCard, 'due' | 'suspended'>, nowISO: string): boolean {
  if (card.suspended) return false;
  return new Date(card.due).getTime() <= new Date(nowISO).getTime();
}
