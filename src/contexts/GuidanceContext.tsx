import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StorageKeys, loadJSON, saveJSON } from '../storage/store';

/**
 * Quản lý trạng thái "hướng dẫn người dùng mới":
 * - introSeen: đã xem màn giới thiệu lần đầu chưa (onboarding).
 * - dismissedHints: danh sách id thẻ gợi ý đã đóng trên từng màn hình.
 * Dữ liệu lưu trong AsyncStorage (key kkh:guidance) và tự vào backup.
 */

type GuidanceData = {
  introSeen: boolean;
  dismissedHints: string[];
};

type GuidanceContextValue = {
  /** true khi đã đọc xong dữ liệu từ AsyncStorage — dùng để gate splash/onboarding. */
  ready: boolean;
  /** true khi cần hiển thị màn giới thiệu (lần đầu mở app hoặc xem lại từ Cài đặt). */
  introVisible: boolean;
  /** Ẩn màn giới thiệu và ghi nhớ đã xem. */
  finishIntro: () => void;
  /** Mở lại màn giới thiệu (từ Cài đặt) — không xoá cờ đã xem. */
  replayIntro: () => void;
  /** Thẻ gợi ý với id này đã bị đóng chưa. */
  isHintDismissed: (id: string) => boolean;
  /** Đóng thẻ gợi ý và ghi nhớ. */
  dismissHint: (id: string) => void;
  /** Hiện lại toàn bộ thẻ gợi ý (từ Cài đặt). */
  resetHints: () => Promise<void>;
};

const DEFAULT_DATA: GuidanceData = { introSeen: false, dismissedHints: [] };

const GuidanceContext = createContext<GuidanceContextValue | null>(null);

export function GuidanceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  // Giữ bản dữ liệu mới nhất để ghi mà không phụ thuộc closure cũ.
  const dataRef = useRef<GuidanceData>(DEFAULT_DATA);

  useEffect(() => {
    let cancelled = false;
    loadJSON<GuidanceData>(StorageKeys.guidance, DEFAULT_DATA).then((data) => {
      if (cancelled) return;
      dataRef.current = {
        introSeen: data?.introSeen === true,
        dismissedHints: Array.isArray(data?.dismissedHints) ? data.dismissedHints : [],
      };
      setDismissedHints(dataRef.current.dismissedHints);
      setIntroVisible(!dataRef.current.introSeen);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(() => {
    // Fire-and-forget: lỗi ghi đã được saveJSON nuốt để không làm sập UI.
    void saveJSON(StorageKeys.guidance, dataRef.current);
  }, []);

  const finishIntro = useCallback(() => {
    setIntroVisible(false);
    if (!dataRef.current.introSeen) {
      dataRef.current = { ...dataRef.current, introSeen: true };
      persist();
    }
  }, [persist]);

  const replayIntro = useCallback(() => {
    setIntroVisible(true);
  }, []);

  const isHintDismissed = useCallback(
    (id: string) => dismissedHints.includes(id),
    [dismissedHints]
  );

  const dismissHint = useCallback(
    (id: string) => {
      if (dataRef.current.dismissedHints.includes(id)) return;
      const next = [...dataRef.current.dismissedHints, id];
      dataRef.current = { ...dataRef.current, dismissedHints: next };
      setDismissedHints(next);
      persist();
    },
    [persist]
  );

  const resetHints = useCallback(async () => {
    dataRef.current = { ...dataRef.current, dismissedHints: [] };
    setDismissedHints([]);
    await saveJSON(StorageKeys.guidance, dataRef.current);
  }, []);

  const value: GuidanceContextValue = {
    ready,
    introVisible,
    finishIntro,
    replayIntro,
    isHintDismissed,
    dismissHint,
    resetHints,
  };

  return <GuidanceContext.Provider value={value}>{children}</GuidanceContext.Provider>;
}

export function useGuidance(): GuidanceContextValue {
  const ctx = useContext(GuidanceContext);
  if (!ctx) throw new Error('useGuidance must be used within GuidanceProvider');
  return ctx;
}
