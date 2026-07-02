/** Kiểu dữ liệu cho hệ ôn tập lặp lại ngắt quãng (Spaced Repetition). */

export type CardType = 'vocab' | 'sentence' | 'grammar' | 'custom';

/** Mức tự chấm khi ôn (giống Anki/Mochi). */
export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface SrsCard {
  id: string;
  type: CardType;
  front: string; // mặt trước: từ / câu tiếng Hàn
  back: string; // mặt sau: nghĩa
  extra?: {
    pos?: string;
    phonetic?: string;
    sourceId?: string; // id nguồn (vd điểm ngữ pháp / câu)
  };
  // Trạng thái SM-2
  easeFactor: number; // hệ số dễ, mặc định 2.5
  interval: number; // khoảng cách (ngày)
  repetitions: number; // số lần nhớ liên tiếp
  due: string; // ISO date (ngày đến hạn)
  createdAt: string;
  lastReviewedAt?: string;
  suspended?: boolean;
}
