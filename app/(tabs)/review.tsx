import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { GlassCard } from '../../src/components/glass/GlassCard';
import { GlassView } from '../../src/components/glass/GlassView';
import { GlassButton } from '../../src/components/glass/GlassButton';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { ScreenHint } from '../../src/components/glass/ScreenHint';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import { useSrs } from '../../src/contexts/SrsContext';
import type { Rating } from '../../src/srs/types';
import { getSuggestions } from '../../src/srs/suggest';
import type { VocabSuggestion } from '../../src/srs/suggest';
import { resolveVocabIllustration } from '../../src/utils/vocabIllustration';

export default function ReviewScreen() {
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const router = useRouter();
  const { getSpeechOptions } = useSpeechConfig();
  const { cards, dueCards, stats, reviewCard, addCard } = useSrs();
  const [flipped, setFlipped] = useState(false);

  const current = dueCards[0] ?? null;

  const existingFronts = useMemo(
    () => new Set(cards.filter((x) => x.type === 'vocab').map((x) => x.front)),
    [cards]
  );
  const [suggestions, setSuggestions] = useState<VocabSuggestion[]>([]);
  const refreshSuggestions = useCallback(() => setSuggestions(getSuggestions(existingFronts, 3)), [existingFronts]);
  useEffect(() => {
    if (suggestions.length === 0) refreshSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSuggestion = useCallback(
    (s: VocabSuggestion) => {
      addCard({
        type: 'vocab',
        front: s.word,
        back: s.vi || s.meaning,
        extra: { pos: s.pos, illust: s.illust },
      });
      setSuggestions((prev) => prev.filter((x) => x.word !== s.word));
    },
    [addCard]
  );

  const reviewIllust =
    current?.type === 'vocab'
      ? resolveVocabIllustration(current.extra?.illust || current.front)
      : null;

  useEffect(() => setFlipped(false), [current?.id]);
  useEffect(() => () => Speech.stop(), []);

  const speak = () => {
    if (!current) return;
    Speech.stop();
    Speech.speak(current.front, { ...getSpeechOptions() });
  };

  const grade = (rating: Rating) => {
    if (!current) return;
    Speech.stop();
    reviewCard(current.id, rating);
    setFlipped(false);
  };

  const Stat = ({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) => (
    <GlassView radius={theme.radius.md} style={styles.stat}>
      <Text style={[styles.statValue, { color: highlight ? c.primary : c.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.textSecondary }]}>{label}</Text>
    </GlassView>
  );

  const Grade = ({ label, color, r }: { label: string; color: string; r: Rating }) => (
    <GlassButton compact color={color} label={label} onPress={() => grade(r)} style={styles.gradeBtn} />
  );

  return (
    <GlassScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHint id="review" hint={t('hintReview')} subtitle={t('subtitleReview')} />
      <View style={styles.statsRow}>
        <Stat label={t('srsStatsDue')} value={stats.due} highlight />
        <Stat label={t('srsStatsTotal')} value={stats.total} />
        <Stat label={t('srsStatsLearned')} value={stats.learned} />
      </View>

      <Pressable style={styles.manageBtn} onPress={() => router.push('/review-manage')}>
        <Ionicons name="albums-outline" size={18} color={c.primary} />
        <Text style={[styles.manageBtnText, { color: c.primary }]}>{t('srsManageTitle')}</Text>
      </Pressable>

      {!current ? (
        <View style={styles.emptyBlock}>
          <Ionicons name="checkmark-circle-outline" size={64} color={c.batchim} />
          <Text style={[styles.emptyText, { color: c.textSecondary }]}>{t('srsNoDue')}</Text>
        </View>
      ) : (
        <>
          <Pressable onPress={() => setFlipped((f) => !f)}>
            <GlassCard contentStyle={styles.cardContent}>
              <View style={styles.cardTop}>
                <Text style={[styles.typeTag, { color: c.textSecondary }]}>{current.type}</Text>
                <Pressable onPress={speak} hitSlop={8}>
                  <Ionicons name="volume-high" size={22} color={c.primary} />
                </Pressable>
              </View>
              {reviewIllust ? (
                <Image source={reviewIllust} style={styles.illust} resizeMode="contain" />
              ) : null}
              <Text style={[styles.front, { color: c.text }]}>{current.front}</Text>
              {flipped ? (
                <>
                  <View style={[styles.divider, { backgroundColor: c.hairline }]} />
                  {current.extra?.phonetic ? (
                    <Text style={[styles.phonetic, { color: c.primary }]}>{current.extra.phonetic}</Text>
                  ) : null}
                  <Text style={[styles.back, { color: c.text }]}>{current.back}</Text>
                </>
              ) : (
                <Text style={[styles.tapHint, { color: c.textSecondary }]}>{t('srsShowAnswer')}</Text>
              )}
            </GlassCard>
          </Pressable>

          {flipped ? (
            <View style={styles.gradeRow}>
              <Grade label={t('srsAgain')} color={c.danger} r="again" />
              <Grade label={t('srsHard')} color={c.warning} r="hard" />
              <Grade label={t('srsGood')} color={c.primary} r="good" />
              <Grade label={t('srsEasy')} color={c.batchim} r="easy" />
            </View>
          ) : (
            <GlassButton label={t('srsShowAnswer')} onPress={() => setFlipped(true)} style={styles.showBtn} />
          )}
        </>
      )}

      {suggestions.length > 0 && (
        <View style={[styles.suggestBlock, { borderTopColor: c.hairline }]}>
          <View style={styles.suggestHeader}>
            <Text style={[styles.suggestTitle, { color: c.text }]}>{t('srsSuggestTitle')}</Text>
            <Pressable onPress={refreshSuggestions} hitSlop={8}>
              <Ionicons name="refresh" size={20} color={c.primary} />
            </Pressable>
          </View>
          {suggestions.map((s) => (
            <GlassView key={s.word} radius={theme.radius.md} style={styles.suggestRow}>
              <View style={styles.suggestInfo}>
                <Text style={[styles.suggestWord, { color: c.text }]}>{s.word}</Text>
                <Text style={[styles.suggestMeaning, { color: c.textSecondary }]} numberOfLines={1}>
                  {s.vi || s.meaning}
                </Text>
              </View>
              <Pressable onPress={() => addSuggestion(s)} hitSlop={6}>
                <Ionicons name="add-circle" size={26} color={c.primary} />
              </Pressable>
            </GlassView>
          ))}
        </View>
      )}
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 110 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stat: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  manageBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, marginBottom: 16 },
  manageBtnText: { fontWeight: '600', fontSize: 14 },
  emptyBlock: { alignItems: 'center', gap: 12, marginTop: 48 },
  emptyText: { fontSize: 16, textAlign: 'center' },
  cardContent: { minHeight: 200, justifyContent: 'center', padding: 24 },
  cardTop: { position: 'absolute', top: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeTag: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  illust: { width: 120, height: 120, alignSelf: 'center', marginBottom: 12, marginTop: 20 },
  front: { fontSize: 34, textAlign: 'center', fontWeight: '700' },
  divider: { height: 1, marginVertical: 16 },
  phonetic: { fontSize: 18, textAlign: 'center', marginBottom: 6 },
  back: { fontSize: 20, textAlign: 'center' },
  tapHint: { fontSize: 13, textAlign: 'center', marginTop: 16 },
  showBtn: { marginTop: 16 },
  gradeRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  gradeBtn: { flex: 1 },
  suggestBlock: { marginTop: 32, borderTopWidth: 1, paddingTop: 16 },
  suggestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  suggestTitle: { fontSize: 15, fontWeight: '700' },
  suggestRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8 },
  suggestInfo: { flex: 1, marginRight: 8 },
  suggestWord: { fontSize: 18, fontWeight: '600' },
  suggestMeaning: { fontSize: 13, marginTop: 2 },
});
