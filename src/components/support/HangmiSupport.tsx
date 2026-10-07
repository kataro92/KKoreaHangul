import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../glass/GlassCard';
import { GlassButton } from '../glass/GlassButton';
import { HangmiFigure } from '../mascot/HangmiFigure';
import { useTheme } from '../../constants/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { SUPPORT_COPY } from '../../support/copy';
import { SUPPORT_PRODUCTS, emptyCounts, mergeCounts, type StoreProduct, type SupportCounts, type SupportProductId, type SupportReceipt, type PurchaseStatus } from '../../support/catalog';
import { claimSupportThanks, isSupportAvailable, loadSupportProducts, loadSupportSummary, purchaseSupport, subscribeSupport } from '../../support/billing';

const ICONS = { kibble: 'nutrition-outline', pate: 'fish-outline', toy: 'game-controller-outline' } as const;

/** Closed by default: no prompts, badges, or price requests until deliberately opened. */
export function HangmiSupport() {
  const [open, setOpen] = useState(false);
  const { locale } = useLanguage();
  const { colors: c } = useTheme();
  return (
    <GlassCard style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }}
        onPress={() => setOpen(value => !value)} style={({ pressed }) => [styles.heading, { opacity: pressed ? 0.6 : 1 }]}>
        <Ionicons name="paw-outline" size={22} color={c.primary} />
        <Text style={[styles.title, { color: c.text }]}>{SUPPORT_COPY[locale].title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={c.textSecondary} />
      </Pressable>
      {open && <SupportContents />}
    </GlassCard>
  );
}

function SupportContents() {
  const { locale } = useLanguage();
  const copy = SUPPORT_COPY[locale];
  const { colors: c } = useTheme();
  const native = isSupportAvailable();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [counts, setCounts] = useState<SupportCounts>(emptyCounts);
  const [unsettled, setUnsettled] = useState<SupportProductId[]>([]);
  const [loading, setLoading] = useState(native);
  const [buying, setBuying] = useState(false);
  const [notice, setNotice] = useState<PurchaseStatus | null>(null);
  const [thanks, setThanks] = useState<SupportReceipt | null>(null);
  const mounted = useRef(true);
  const inFlight = useRef(false);
  const refreshFlight = useRef(false);

  const receive = useCallback((receipt: SupportReceipt) => {
    if (!mounted.current) return;
    setCounts(previous => mergeCounts(previous, receipt.counts));
    setUnsettled(previous => previous.filter(id => id !== receipt.productId));
    if (claimSupportThanks(receipt.transactionId)) {
      setThanks(receipt);
      setNotice(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!native || refreshFlight.current || inFlight.current) return;
    refreshFlight.current = true;
    setLoading(true);
    const available = await loadSupportProducts();
    const summary = await loadSupportSummary();
    refreshFlight.current = false;
    if (!mounted.current) return;
    setProducts(available);
    if (summary.counts) setCounts(previous => mergeCounts(previous, summary.counts!));
    setUnsettled(summary.unsettled);
    setLoading(false);
  }, [native]);

  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribeSupport(receive);
    void refresh();
    const foreground = AppState.addEventListener('change', state => { if (state === 'active') void refresh(); });
    return () => { mounted.current = false; unsubscribe(); foreground.remove(); };
  }, [receive, refresh]);

  const buy = async (id: SupportProductId) => {
    if (inFlight.current || loading || unsettled.includes(id) || !products.some(row => row.id === id)) return;
    inFlight.current = true;
    setBuying(true);
    setThanks(null);
    setNotice(null);
    const result = await purchaseSupport(id);
    inFlight.current = false;
    if (!mounted.current) return;
    setBuying(false);
    if (result.receipt) receive(result.receipt);
    else if (result.status !== 'cancelled') {
      setNotice(result.status);
      if (result.status === 'pending' || result.status === 'processing') setUnsettled(previous => [...new Set([...previous, id])]);
    }
  };

  const thankedProduct = thanks && SUPPORT_PRODUCTS.find(row => row.id === thanks.productId);
  const thanksText = thanks && thankedProduct && copy.thanks[thankedProduct.item][(Math.max(1, thanks.counts[thankedProduct.item]) - 1) % copy.thanks[thankedProduct.item].length];
  const statusText = notice === 'pending' ? copy.pending : notice === 'processing' ? copy.processing : notice === 'failed' ? copy.failed : notice === 'unavailable' ? copy.unavailable : null;

  return (
    <View style={styles.contents}>
      <HangmiFigure pose={thanks ? 'celebrate' : 'wave'} size={104} />
      <Text style={[styles.body, { color: c.textSecondary }]}>{copy.intro}</Text>
      {thanksText && <Text accessibilityLiveRegion="polite" style={[styles.thanks, { color: c.primary, backgroundColor: c.primary + '12' }]}>{thanksText}</Text>}
      {loading && <Text accessibilityLiveRegion="polite" style={[styles.body, { color: c.textSecondary }]}>{copy.loading}</Text>}
      {SUPPORT_PRODUCTS.map(product => {
        const store = products.find(row => row.id === product.id);
        return (
          <View key={product.id} style={[styles.item, { borderColor: c.hairline }]}>
            <View style={styles.itemName}>
              <Ionicons name={ICONS[product.item]} size={22} color={c.primary} />
              <Text style={[styles.itemText, { color: c.text }]}>{copy.items[product.item]}</Text>
            </View>
            {store && <GlassButton compact variant="outline" label={store.displayPrice} accessibilityLabel={`${copy.items[product.item]}, ${store.displayPrice}`} disabled={buying || loading || unsettled.includes(product.id)} onPress={() => { void buy(product.id); }} />}
          </View>
        );
      })}
      {!loading && products.length === 0 && <Text style={[styles.body, { color: c.textSecondary }]}>{native ? copy.unavailable : copy.nativeOnly}</Text>}
      {(statusText || (!notice && unsettled.length > 0)) && <Text accessibilityLiveRegion="polite" style={[styles.body, { color: c.primary }]}>{statusText ?? copy.processing}</Text>}
      {native && !loading && <GlassButton compact variant="outline" label={copy.retry} disabled={buying} onPress={() => { void refresh(); }} />}
      {SUPPORT_PRODUCTS.some(row => counts[row.item] > 0) && (
        <View style={styles.history}>
          <Text style={[styles.body, { color: c.textSecondary }]}>{copy.history}</Text>
          {SUPPORT_PRODUCTS.map(row => counts[row.item] > 0 && <Text key={row.id} style={[styles.body, { color: c.text }]}>{copy.items[row.item]} × {counts[row.item]}</Text>)}
        </View>
      )}
      <Text style={[styles.footnote, { color: c.textSecondary }]}>{copy.footnote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 24 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  title: { flex: 1, fontSize: 17, lineHeight: 24, fontWeight: '700' },
  contents: { marginTop: 12, gap: 12 },
  body: { fontSize: 14, lineHeight: 21 },
  item: { padding: 12, borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, gap: 12 },
  itemName: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemText: { flex: 1, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  footnote: { fontSize: 12, lineHeight: 18 },
  thanks: { fontSize: 15, lineHeight: 23, fontWeight: '600', padding: 12, borderRadius: 12 },
  history: { gap: 4 },
});
