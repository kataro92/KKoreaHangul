export const SUPPORT_ITEMS = ['kibble', 'pate', 'toy'] as const;
export type SupportItem = typeof SUPPORT_ITEMS[number];
export const SUPPORT_PRODUCTS = [
  { id: 'hangmi_kibble', item: 'kibble', suggestedVnd: 29000 },
  { id: 'hangmi_pate', item: 'pate', suggestedVnd: 59000 },
  { id: 'hangmi_toy', item: 'toy', suggestedVnd: 99000 },
] as const;
export type SupportProductId = typeof SUPPORT_PRODUCTS[number]['id'];
export type SupportCounts = Record<SupportItem, number>;
export type PurchaseStatus = 'purchased' | 'cancelled' | 'pending' | 'processing' | 'unavailable' | 'failed';
export type StoreProduct = { id: SupportProductId; displayPrice: string };
export type SupportReceipt = { productId: SupportProductId; transactionId: string; counts: SupportCounts };
export const emptyCounts = (): SupportCounts => ({ kibble: 0, pate: 0, toy: 0 });

export function isSupportId(id: unknown): id is SupportProductId {
  return SUPPORT_PRODUCTS.some(product => product.id === id);
}

export function parseCounts(value: unknown): SupportCounts | null {
  if (!value || typeof value !== 'object') return null;
  const counts = value as Record<string, unknown>;
  if (!SUPPORT_ITEMS.every(item => Number.isSafeInteger(counts[item]) && (counts[item] as number) >= 0)) return null;
  return Object.fromEntries(SUPPORT_ITEMS.map(item => [item, counts[item]])) as SupportCounts;
}

export function parseReceipt(value: unknown): SupportReceipt | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  const counts = parseCounts(row.counts);
  if (!isSupportId(row.productId) || typeof row.transactionId !== 'string' || !/^play:[a-f0-9]{64}$/.test(row.transactionId) || !counts) return null;
  return { productId: row.productId, transactionId: row.transactionId, counts };
}

/** A delayed callback must never replace newer device-local totals. */
export function mergeCounts(previous: SupportCounts, next: SupportCounts): SupportCounts {
  return Object.fromEntries(SUPPORT_ITEMS.map(item => [item, Math.max(previous[item], next[item])])) as SupportCounts;
}

export function parseStoreProducts(value: unknown): StoreProduct[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((row): row is StoreProduct => {
    if (!row || !isSupportId(row.id) || typeof row.displayPrice !== 'string' || !row.displayPrice.trim() || seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}
