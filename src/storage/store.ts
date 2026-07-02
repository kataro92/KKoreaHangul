/**
 * Lớp bọc mỏng quanh AsyncStorage: đọc/ghi JSON có kiểu và versioned key.
 * Dùng chung cho SR, tiến độ ngữ pháp, lịch sử luyện đọc, cấu hình.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/** Namespace chung để tránh đụng key với thư viện khác. */
const NS = 'kkh:';

/** Phiên bản schema tổng — tăng khi cần migrate dữ liệu cũ. */
export const STORE_VERSION = 1;

export const StorageKeys = {
  srsCards: `${NS}srs:cards`,
  srsReviews: `${NS}srs:reviews`,
  grammarProgress: `${NS}grammar:progress`,
  readingHistory: `${NS}reading:history`,
  settings: `${NS}settings`,
} as const;

type Envelope<T> = { v: number; data: T };

/** Đọc JSON; trả về `fallback` nếu chưa có hoặc lỗi parse. */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as Envelope<T> | T;
    // Hỗ trợ cả dữ liệu có envelope lẫn dữ liệu thô cũ.
    if (parsed && typeof parsed === 'object' && 'v' in (parsed as object) && 'data' in (parsed as object)) {
      return (parsed as Envelope<T>).data;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** Ghi JSON kèm phiên bản schema. */
export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    const envelope: Envelope<T> = { v: STORE_VERSION, data: value };
    await AsyncStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Nuốt lỗi ghi (vd hết dung lượng) để không làm sập UI; có thể log về sau.
  }
}

/** Xoá một khóa. */
export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
