import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { DecomposedResult } from '../../src/components/DecomposedResult';
import { GlassCard } from '../../src/components/glass/GlassCard';
import { GlassButton } from '../../src/components/glass/GlassButton';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import type { TranslationMap } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import { useSrs } from '../../src/contexts/SrsContext';
import vocabularyData from '../../src/data/vocabulary.json';
import { decomposeString } from '../../src/utils/decompose';

type VocabEntry = { word: string; meaning: string; pos: string; vi?: string };
type LevelKey = 'topik1' | 'topik2';

const topik1Entries: VocabEntry[] = vocabularyData.topik1?.entries ?? [];
const topik2Entries: VocabEntry[] = vocabularyData.topik2?.entries ?? [];

const POS_LABEL_KEYS: Record<string, keyof TranslationMap> = {
  n: 'posNoun',
  v: 'posVerb',
  adj: 'posAdj',
  adv: 'posAdv',
  conj: 'posConj',
  pron: 'posPron',
  phrase: 'posPhrase',
  particle: 'posParticle',
};

function getRandomEntry(level: LevelKey): VocabEntry | null {
  const entries = level === 'topik1' ? topik1Entries : topik2Entries;
  if (entries.length === 0) return null;
  return entries[Math.floor(Math.random() * entries.length)];
}

export default function VocabularyScreen() {
  const [level, setLevel] = useState<LevelKey>('topik1');
  const [entry, setEntry] = useState<VocabEntry | null>(() =>
    topik1Entries.length > 0 ? getRandomEntry('topik1') : null
  );
  const [speaking, setSpeaking] = useState(false);
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { getSpeechOptions } = useSpeechConfig();
  const { addCard, hasCard } = useSrs();

  const inReview = entry ? hasCard('vocab', entry.word) : false;

  const addToReview = useCallback(() => {
    if (!entry) return;
    addCard({ type: 'vocab', front: entry.word, back: entry.vi || entry.meaning, extra: { pos: entry.pos } });
  }, [entry, addCard]);

  const lastEntryByLevelRef = useRef<Record<LevelKey, VocabEntry | null>>({ topik1: null, topik2: null });

  const changeLevel = useCallback((newLevel: LevelKey) => {
    setLevel((currentLevel) => {
      setEntry((currentEntry) => {
        lastEntryByLevelRef.current[currentLevel] = currentEntry;
        const saved = lastEntryByLevelRef.current[newLevel];
        if (saved != null) return saved;
        const next = getRandomEntry(newLevel);
        lastEntryByLevelRef.current[newLevel] = next;
        return next;
      });
      return newLevel;
    });
  }, []);

  const decomposed = useMemo(() => (entry ? decomposeString(entry.word) : []), [entry?.word]);

  const nextWord = useCallback(() => setEntry(getRandomEntry(level)), [level]);

  const speak = useCallback(() => {
    if (!entry) return;
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(entry.word, {
      ...getSpeechOptions({
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      }),
    });
  }, [entry, speaking, getSpeechOptions]);

  const levelBtn = (lv: LevelKey, label: string) => {
    const active = level === lv;
    return (
      <Pressable
        style={[styles.levelBtn, { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' }]}
        onPress={() => changeLevel(lv)}
      >
        <Text style={[styles.levelBtnText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <GlassScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('vocabLevelTitle')}</Text>
      <View style={styles.levelRow}>
        {levelBtn('topik1', t('vocabLevel1'))}
        {levelBtn('topik2', t('vocabLevel2'))}
      </View>

      {!entry ? (
        <Text style={[styles.emptyHint, { color: c.textSecondary }]}>{t('vocabEmptyHint')}</Text>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('vocabNewWord')}</Text>
          <GlassCard style={styles.card} contentStyle={styles.cardContent}>
            <Text style={[styles.word, { color: c.text }]}>{entry.word}</Text>
            <View style={styles.meaningRow}>
              <Text style={[styles.pos, { color: c.primary }]}>
                {POS_LABEL_KEYS[entry.pos] ? t(POS_LABEL_KEYS[entry.pos]) : entry.pos}
              </Text>
              <Text style={[styles.meaning, { color: c.text }]}>{entry.vi || entry.meaning}</Text>
            </View>
            <GlassButton onPress={speak} style={styles.speakBtn} label={speaking ? undefined : t('speakButton')}>
              {speaking ? <ActivityIndicator size="small" color={c.onPrimary} /> : undefined}
            </GlassButton>
            <GlassButton
              variant="outline"
              color={inReview ? c.batchim : c.primary}
              onPress={addToReview}
              disabled={inReview}
              label={inReview ? t('srsAlreadyAdded') : t('srsAddToReview')}
              style={styles.addBtn}
            />
          </GlassCard>

          <Text style={[styles.sectionTitle, { color: c.text }]}>{t('vocabReadingTitle')}</Text>
          {decomposed.length === 0 ? (
            <Text style={[styles.hint, { color: c.textSecondary }]}>{t('vocabNoSyllableHint')}</Text>
          ) : (
            decomposed.map((item, index) => <DecomposedResult key={`${item.syllable}-${index}`} data={item} />)
          )}

          <GlassButton variant="glass" onPress={nextWord} label={t('nextWordButton')} style={styles.nextButton} />
        </>
      )}
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 110 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  levelRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  levelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
  levelBtnText: { fontSize: 14, fontWeight: '600' },
  emptyHint: { fontSize: 15, textAlign: 'center', marginTop: 24 },
  card: { marginBottom: 24 },
  cardContent: { padding: 20 },
  word: { fontSize: 40, marginBottom: 12 },
  meaningRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  pos: { fontSize: 12, fontWeight: '700' },
  meaning: { fontSize: 18, flex: 1 },
  speakBtn: {},
  addBtn: { marginTop: 10 },
  hint: { fontSize: 14, marginBottom: 16 },
  nextButton: { marginTop: 8 },
});
