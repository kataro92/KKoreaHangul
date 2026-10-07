import { emptyCounts, mergeCounts, parseCounts, parseReceipt, parseStoreProducts } from './catalog';

describe('Hangmi support store boundary', () => {
  test('unconfigured/foreign products and prices never become checkout options', () => {
    expect(parseStoreProducts(undefined)).toEqual([]);
    expect(parseStoreProducts([
      { id: 'support_tea', displayPrice: '29.000 ₫' },
      { id: 'hangmi_kibble', displayPrice: '' },
      { id: 'hangmi_toy', displayPrice: '£2.49' },
      { id: 'hangmi_toy', displayPrice: '£3.49' },
    ])).toEqual([{ id: 'hangmi_toy', displayPrice: '£2.49' }]);
  });
  test('invalid receipts/counts cannot trigger thanks or corrupt the history', () => {
    expect(parseCounts({ kibble: -1, pate: 0, toy: 0 })).toBeNull();
    expect(parseCounts({ kibble: 0.5, pate: 0, toy: 0 })).toBeNull();
    expect(parseCounts({ kibble: Number.MAX_SAFE_INTEGER + 1, pate: 0, toy: 0 })).toBeNull();
    expect(parseReceipt({ productId: 'hangmi_pate', transactionId: 'raw-token', counts: emptyCounts() })).toBeNull();
    expect(parseReceipt({ productId: 'premium', transactionId: 'play:' + 'a'.repeat(64), counts: emptyCounts() })).toBeNull();
  });
  test('older recovery callbacks do not reduce newer totals', () => {
    expect(mergeCounts({ kibble: 2, pate: 1, toy: 0 }, { kibble: 1, pate: 0, toy: 3 })).toEqual({ kibble: 2, pate: 1, toy: 3 });
  });
});
