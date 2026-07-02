import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../constants/theme';
import { CountdownRing } from './CountdownRing';
import { GlassCard } from './glass/GlassCard';
import { GlassButton } from './glass/GlassButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechConfig } from '../contexts/SpeechConfigContext';
import { useSrs } from '../contexts/SrsContext';
import { getRandomSentence } from '../data/sentences';
import type { Sentence, SentenceLevel } from '../data/sentences';
import { loadJSON, saveJSON, StorageKeys } from '../storage/store';

const DURATION_OPTIONS = [15, 30, 45, 60] as const;

type SelfRating = 'bad' | 'ok' | 'good';
type HistoryEntry = { sentenceId: string; level: SentenceLevel; rating: SelfRating; at: string };

export function ReadingPractice() {
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { getSpeechOptions } = useSpeechConfig();
  const { addCard } = useSrs();

  const [level, setLevel] = useState<SentenceLevel>('topik1');
  const [duration, setDuration] = useState<number>(30);
  const [sentence, setSentence] = useState<Sentence | null>(() => getRandomSentence('topik1'));
  const [remaining, setRemaining] = useState<number>(30);
  const [revealed, setRevealed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rating, setRating] = useState<SelfRating | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!sentence || revealed) return;
    setRemaining(duration);
    clearTimer();
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence?.id, duration]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const reveal = useCallback(() => {
    clearTimer();
    setRevealed(true);
  }, [clearTimer]);

  const changeLevel = useCallback((next: SentenceLevel) => {
    setLevel(next);
    setRevealed(false);
    setRating(null);
    Speech.stop();
    setSpeaking(false);
    setSentence(getRandomSentence(next));
  }, []);

  const nextSentence = useCallback(() => {
    Speech.stop();
    setSpeaking(false);
    setRevealed(false);
    setRating(null);
    setSentence((cur) => getRandomSentence(level, cur?.id));
  }, [level]);

  const listen = useCallback(() => {
    if (!sentence) return;
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(sentence.ko, {
      ...getSpeechOptions({
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      }),
    });
  }, [sentence, speaking, getSpeechOptions]);

  const rate = useCallback(
    async (value: SelfRating) => {
      setRating(value);
      if (!sentence) return;
      const entry: HistoryEntry = { sentenceId: sentence.id, level, rating: value, at: new Date().toISOString() };
      const history = await loadJSON<HistoryEntry[]>(StorageKeys.readingHistory, []);
      history.push(entry);
      await saveJSON(StorageKeys.readingHistory, history.slice(-500));
      if (value === 'bad') {
        addCard({
          type: 'sentence',
          front: sentence.ko,
          back: sentence.vi,
          extra: { phonetic: sentence.phonetic_vi, sourceId: sentence.id },
        });
      }
    },
    [sentence, level, addCard]
  );

  const chip = (active: boolean, label: string, onPress: () => void, flexible = true) => (
    <Pressable
      style={[
        flexible ? styles.chip : styles.durChip,
        { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
    </Pressable>
  );

  const RateBtn = ({ label, color, val }: { label: string; color: string; val: SelfRating }) => (
    <GlassButton
      compact
      variant={rating === val ? 'primary' : 'outline'}
      color={color}
      label={label}
      onPress={() => rate(val)}
      style={styles.rateBtn}
    />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.row}>
        {chip(level === 'topik1', t('vocabLevel1'), () => changeLevel('topik1'))}
        {chip(level === 'topik2', t('vocabLevel2'), () => changeLevel('topik2'))}
      </View>

      <Text style={[styles.smallLabel, { color: c.textSecondary }]}>{t('practiceCountdownLabel')}</Text>
      <View style={styles.row}>
        {DURATION_OPTIONS.map((d) => chip(duration === d, String(d), () => setDuration(d), false))}
      </View>

      {!sentence ? (
        <Text style={[styles.empty, { color: c.textSecondary }]}>{t('practiceEmpty')}</Text>
      ) : (
        <>
          <GlassCard contentStyle={styles.sentenceCard}>
            <Text style={[styles.sentenceKo, { color: c.text }]}>{sentence.ko}</Text>
          </GlassCard>

          {!revealed ? (
            <View style={styles.centerBlock}>
              <Text style={[styles.instruction, { color: c.textSecondary }]}>{t('practiceInstruction')}</Text>
              <CountdownRing remaining={remaining} total={duration} />
              <GlassButton variant="outline" onPress={reveal} label={t('practiceReveal')} />
            </View>
          ) : (
            <View>
              <Text style={[styles.answerLabel, { color: c.textSecondary }]}>{t('practicePhonetic')}</Text>
              <Text style={[styles.phonetic, { color: c.primary }]}>{sentence.phonetic_vi}</Text>
              <Text style={[styles.answerLabel, { color: c.textSecondary }]}>{t('practiceMeaning')}</Text>
              <Text style={[styles.meaning, { color: c.text }]}>{sentence.vi}</Text>

              <GlassButton onPress={listen} style={styles.listenBtn} label={speaking ? undefined : t('practiceListen')}>
                {speaking ? <ActivityIndicator size="small" color={c.onPrimary} /> : undefined}
              </GlassButton>

              <Text style={[styles.selfRate, { color: c.text }]}>{t('practiceSelfRate')}</Text>
              <View style={styles.row}>
                <RateBtn label={t('rateBad')} color={c.danger} val="bad" />
                <RateBtn label={t('rateOk')} color={c.warning} val="ok" />
                <RateBtn label={t('rateGood')} color={c.batchim} val="good" />
              </View>
            </View>
          )}

          <GlassButton variant="glass" onPress={nextSentence} label={t('practiceNextSentence')} style={styles.nextBtn} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 110 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  smallLabel: { fontSize: 13, marginBottom: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
  durChip: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 2, alignItems: 'center' },
  chipText: { fontSize: 14, fontWeight: '600' },
  empty: { fontSize: 15, textAlign: 'center', marginTop: 24 },
  sentenceCard: { padding: 24, alignItems: 'center' },
  sentenceKo: { fontSize: 28, textAlign: 'center', lineHeight: 40 },
  centerBlock: { alignItems: 'center', gap: 16, marginTop: 8 },
  instruction: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  answerLabel: { fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 4 },
  phonetic: { fontSize: 22, fontWeight: '600' },
  meaning: { fontSize: 18 },
  listenBtn: { marginTop: 16 },
  selfRate: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  rateBtn: { flex: 1 },
  nextBtn: { marginTop: 24 },
});
