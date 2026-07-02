/**
 * Kiểm thử SM-2. Chạy được với Jest (khi dự án thêm test runner):
 *   npx jest src/srs/sm2.test.ts
 */
import { review, ratingToQuality, addDays, isDue, DEFAULT_EASE, MIN_EASE } from './sm2';

const NOW = '2026-07-01T00:00:00.000Z';

describe('ratingToQuality', () => {
  it('ánh xạ đúng', () => {
    expect(ratingToQuality('again')).toBe(1);
    expect(ratingToQuality('hard')).toBe(3);
    expect(ratingToQuality('good')).toBe(4);
    expect(ratingToQuality('easy')).toBe(5);
  });
});

describe('review', () => {
  const fresh = { easeFactor: DEFAULT_EASE, interval: 0, repetitions: 0 };

  it('lần đầu Good → interval 1 ngày, repetitions 1', () => {
    const r = review(fresh, 'good', NOW);
    expect(r.interval).toBe(1);
    expect(r.repetitions).toBe(1);
  });

  it('lần hai Good → interval 6 ngày', () => {
    const r1 = review(fresh, 'good', NOW);
    const r2 = review(r1, 'good', NOW);
    expect(r2.interval).toBe(6);
    expect(r2.repetitions).toBe(2);
  });

  it('lần ba Good → interval = round(6 * ease)', () => {
    let c = review(fresh, 'good', NOW);
    c = review(c, 'good', NOW);
    const r3 = review(c, 'good', NOW);
    expect(r3.interval).toBe(Math.round(6 * c.easeFactor));
    expect(r3.repetitions).toBe(3);
  });

  it('Again → reset repetitions về 0, interval 1', () => {
    let c = review(fresh, 'good', NOW);
    c = review(c, 'good', NOW);
    const again = review(c, 'again', NOW);
    expect(again.repetitions).toBe(0);
    expect(again.interval).toBe(1);
  });

  it('easeFactor không xuống dưới MIN_EASE', () => {
    let c = { easeFactor: 1.4, interval: 5, repetitions: 3 };
    for (let i = 0; i < 10; i++) c = { ...c, ...review(c, 'again', NOW) };
    expect(c.easeFactor).toBeGreaterThanOrEqual(MIN_EASE);
  });

  it('Easy tăng easeFactor', () => {
    const r = review(fresh, 'easy', NOW);
    expect(r.easeFactor).toBeGreaterThan(DEFAULT_EASE);
  });
});

describe('isDue', () => {
  it('đến hạn khi due <= now', () => {
    expect(isDue({ due: addDays(NOW, 0) }, NOW)).toBe(true);
    expect(isDue({ due: addDays(NOW, 3) }, NOW)).toBe(false);
  });
  it('thẻ suspended không đến hạn', () => {
    expect(isDue({ due: addDays(NOW, -1), suspended: true }, NOW)).toBe(false);
  });
});
