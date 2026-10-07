import { getCardMeaning, getCardPronunciation, syncMeanings } from './refresh';
import type { SrsCard } from './types';

const card = (overrides: Partial<SrsCard> = {}): SrsCard => ({
  id: 'saved-card', type: 'vocab', front: '가게', back: 'cửa hàng',
  easeFactor: 2.5, interval: 6, repetitions: 2, due: '2026-10-10T00:00:00.000Z',
  createdAt: '2026-10-01T00:00:00.000Z', ...overrides,
});

it('renders old built-in cards in the current language without mutating saved data or progress', () => {
  const saved = card();
  expect(getCardMeaning(saved, 'en')).toBe('store, shop');
  expect(getCardMeaning(saved, 'vi')).toBe('cửa hàng');
  expect(saved.back).toBe('cửa hàng');
  const refreshed = syncMeanings([saved], 'en');
  expect(refreshed.changed).toBe(1);
  expect(refreshed.cards[0]).toEqual({ ...saved, back: 'store, shop' });
  expect(syncMeanings(refreshed.cards, 'en')).toEqual({ cards: refreshed.cards, changed: 0 });
});

it('resolves imported sentence cards with or without source IDs and updates their pronunciation', () => {
  const saved = card({ type: 'sentence', front: '안녕하세요.', back: 'Xin chào.', extra: { sourceId: 't1-01', phonetic: 'an-nyông-ha-xê-yô' } });
  expect(getCardMeaning(saved, 'en')).toBe('Hello.');
  expect(getCardPronunciation(saved, 'en', 'default')).toBe('annyeonghaseyo.');
  expect(getCardPronunciation(saved, 'vi', 'default')).toBe('an-nyông-ha-xê-yô');
  expect(getCardMeaning({ ...saved, extra: undefined }, 'en')).toBe('Hello.');
});

it('preserves user-authored and unknown imported cards', () => {
  const custom = card({ type: 'custom', back: 'My own explanation' });
  const unknown = card({ front: 'unknown', back: 'Imported meaning' });
  expect(getCardMeaning(custom, 'vi')).toBe('My own explanation');
  expect(getCardMeaning(unknown, 'en')).toBe('Imported meaning');
  const cards = [custom, unknown];
  expect(syncMeanings(cards, 'ja').cards).toBe(cards);
});
