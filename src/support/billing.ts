import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { isSupportId, parseCounts, parseReceipt, parseStoreProducts, type PurchaseStatus, type SupportProductId, type SupportReceipt } from './catalog';

interface SupportBridge {
  loadProducts(): Promise<{ products?: unknown }>;
  getSummary(): Promise<{ counts?: unknown; unsettled?: unknown }>;
  recoverIfNeeded(): Promise<void>;
  purchase(id: string): Promise<{ status?: unknown }>;
  addListener(name: 'onSupportPurchased', callback: (receipt: unknown) => void): { remove(): void };
}
function bridge(): SupportBridge | null {
  if (Platform.OS !== 'android') return null;
  try { return requireOptionalNativeModule<SupportBridge>('HangmiSupport'); }
  catch { return null; }
}
export function isSupportAvailable() { return bridge() !== null; }
export async function recoverSupportIfNeeded() {
  try { await bridge()?.recoverIfNeeded(); } catch { /* Free learning always works. */ }
}
export async function loadSupportProducts() {
  try { return parseStoreProducts((await bridge()?.loadProducts())?.products); } catch { return []; }
}
export async function loadSupportSummary() {
  try {
    const summary = await bridge()?.getSummary();
    return { counts: parseCounts(summary?.counts), unsettled: Array.isArray(summary?.unsettled) ? summary.unsettled.filter(isSupportId) : [] };
  } catch { return { counts: null, unsettled: [] }; }
}
export async function purchaseSupport(id: SupportProductId): Promise<{ status: PurchaseStatus; receipt: SupportReceipt | null }> {
  const native = bridge();
  if (!native || !isSupportId(id)) return { status: 'unavailable', receipt: null };
  try {
    const result = await native.purchase(id);
    const status = result.status;
    const receipt = status === 'purchased' ? parseReceipt(result) : null;
    if (status === 'purchased' && !receipt) return { status: 'processing', receipt: null };
    return {
      status: status === 'purchased' || status === 'cancelled' || status === 'pending' || status === 'processing' || status === 'unavailable' ? status : 'failed',
      receipt,
    };
  } catch { return { status: 'processing', receipt: null }; }
}
// The Promise and event can contain the same completed purchase.
const celebrated = new Set<string>();
export function claimSupportThanks(id: string) {
  if (celebrated.has(id)) return false;
  celebrated.add(id);
  return true;
}
export function subscribeSupport(callback: (receipt: SupportReceipt) => void): () => void {
  try {
    const listener = bridge()?.addListener('onSupportPurchased', value => {
      const receipt = parseReceipt(value);
      if (receipt) callback(receipt);
    });
    return () => listener?.remove();
  } catch { return () => {}; }
}
