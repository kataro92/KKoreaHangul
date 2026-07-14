import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { loadJSON, saveJSON, StorageKeys } from '../storage/store';
import { initialSrsState, isDue, review } from '../srs/sm2';
import { syncMeanings } from '../srs/refresh';
import type { CardType, Rating, SrsCard } from '../srs/types';

type NewCardInput = {
  type: CardType;
  front: string;
  back: string;
  extra?: SrsCard['extra'];
};

type SrsStats = {
  total: number;
  due: number;
  learned: number; // repetitions >= 2 xem như đã vào trí nhớ
};

type SrsContextValue = {
  cards: SrsCard[];
  loaded: boolean;
  dueCards: SrsCard[];
  stats: SrsStats;
  /** Thêm 1 thẻ; trả về false nếu đã tồn tại (trùng front+type). */
  addCard: (input: NewCardInput) => boolean;
  addCardsBulk: (inputs: NewCardInput[]) => number;
  reviewCard: (id: string, rating: Rating) => void;
  removeCard: (id: string) => void;
  hasCard: (type: CardType, front: string) => boolean;
  /** Đồng bộ nghĩa thẻ vocab/sentence với dữ liệu nguồn; trả về số thẻ đã đổi. */
  refreshMeanings: () => number;
  /** Nạp lại thẻ từ storage — dùng sau khi khôi phục backup. */
  reloadFromStorage: () => Promise<void>;
};

const SrsContext = createContext<SrsContextValue | null>(null);

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SrsProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [loaded, setLoaded] = useState(false);
  // Tick để tính lại "đến hạn" theo thời gian mà không cần đổi cards.
  const [, setTick] = useState(0);
  const didLoad = useRef(false);

  // Nạp thẻ từ storage khi mở app.
  useEffect(() => {
    let active = true;
    loadJSON<SrsCard[]>(StorageKeys.srsCards, []).then((data) => {
      if (!active) return;
      // Đồng bộ nghĩa (vd cập nhật nghĩa tiếng Việt cho thẻ cũ) khi mở app.
      const { cards: synced } = syncMeanings(data);
      setCards(synced);
      setLoaded(true);
      didLoad.current = true;
    });
    return () => {
      active = false;
    };
  }, []);

  // Lưu mỗi khi cards đổi (sau khi đã nạp xong).
  useEffect(() => {
    if (!didLoad.current) return;
    saveJSON(StorageKeys.srsCards, cards);
  }, [cards]);

  // Cập nhật lại trạng thái đến hạn mỗi phút.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const hasCard = useCallback(
    (type: CardType, front: string) =>
      cards.some((c) => c.type === type && c.front === front),
    [cards]
  );

  const addCard = useCallback(
    (input: NewCardInput): boolean => {
      let added = false;
      setCards((prev) => {
        if (prev.some((c) => c.type === input.type && c.front === input.front)) {
          return prev;
        }
        added = true;
        const now = new Date().toISOString();
        const card: SrsCard = {
          id: makeId(),
          type: input.type,
          front: input.front,
          back: input.back,
          extra: input.extra,
          createdAt: now,
          ...initialSrsState(now),
        };
        return [...prev, card];
      });
      return added;
    },
    []
  );

  const addCardsBulk = useCallback((inputs: NewCardInput[]): number => {
    let count = 0;
    setCards((prev) => {
      const next = [...prev];
      const now = new Date().toISOString();
      for (const input of inputs) {
        if (next.some((c) => c.type === input.type && c.front === input.front)) continue;
        next.push({
          id: makeId(),
          type: input.type,
          front: input.front,
          back: input.back,
          extra: input.extra,
          createdAt: now,
          ...initialSrsState(now),
        });
        count += 1;
      }
      return next;
    });
    return count;
  }, []);

  const reviewCard = useCallback((id: string, rating: Rating) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const now = new Date().toISOString();
        return { ...c, ...review(c, rating, now), lastReviewedAt: now };
      })
    );
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const refreshMeanings = useCallback(() => {
    let changed = 0;
    setCards((prev) => {
      const result = syncMeanings(prev);
      changed = result.changed;
      return result.cards;
    });
    return changed;
  }, []);

  const reloadFromStorage = useCallback(async () => {
    const data = await loadJSON<SrsCard[]>(StorageKeys.srsCards, []);
    const { cards: synced } = syncMeanings(data);
    setCards(synced);
  }, []);

  const dueCards = useMemo(() => {
    const now = new Date().toISOString();
    return cards.filter((c) => isDue(c, now));
    // Phụ thuộc cards; tick khiến component tiêu thụ render lại qua context value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const stats: SrsStats = useMemo(
    () => ({
      total: cards.length,
      due: dueCards.length,
      learned: cards.filter((c) => c.repetitions >= 2).length,
    }),
    [cards, dueCards]
  );

  const value: SrsContextValue = {
    cards,
    loaded,
    dueCards,
    stats,
    addCard,
    addCardsBulk,
    reviewCard,
    removeCard,
    hasCard,
    refreshMeanings,
    reloadFromStorage,
  };

  return <SrsContext.Provider value={value}>{children}</SrsContext.Provider>;
}

export function useSrs(): SrsContextValue {
  const ctx = useContext(SrsContext);
  if (!ctx) throw new Error('useSrs must be used within SrsProvider');
  return ctx;
}
