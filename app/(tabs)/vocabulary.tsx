import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { DecomposedResult } from '../../src/components/DecomposedResult';
import { colors } from '../../src/constants/colors';
import { useLanguage } from '../../src/contexts/LanguageContext';
import type { TranslationMap } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import vocabularyData from '../../src/data/vocabulary.json';
import { decomposeString } from '../../src/utils/decompose';

type VocabEntry = { word: string; meaning: string; pos: string };
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
  const { getSpeechOptions } = useSpeechConfig();

  // Khi đổi trình độ, chọn từ mới từ danh sách đó
  const changeLevel = useCallback((newLevel: LevelKey) => {
    setLevel(newLevel);
    const next = getRandomEntry(newLevel);
    setEntry(next);
  }, []);

  const decomposed = useMemo(
    () => (entry ? decomposeString(entry.word) : []),
    [entry?.word]
  );

  const nextWord = useCallback(() => {
    const next = getRandomEntry(level);
    setEntry(next);
  }, [level]);

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

  const label1 = t('vocabLevel1');
  const label2 = t('vocabLevel2');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{t('vocabLevelTitle')}</Text>
      <View style={styles.levelRow}>
        <Pressable
          style={[styles.levelBtn, level === 'topik1' && styles.levelBtnActive]}
          onPress={() => changeLevel('topik1')}
        >
          <Text
            style={[
              styles.levelBtnText,
              level === 'topik1' && styles.levelBtnTextActive,
            ]}
          >
            {label1}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.levelBtn, level === 'topik2' && styles.levelBtnActive]}
          onPress={() => changeLevel('topik2')}
        >
          <Text
            style={[
              styles.levelBtnText,
              level === 'topik2' && styles.levelBtnTextActive,
            ]}
          >
            {label2}
          </Text>
        </Pressable>
      </View>

      {!entry ? (
        <Text style={styles.emptyHint}>{t('vocabEmptyHint')}</Text>
      ) : (
        <>
          <Text style={styles.sectionTitle}>{t('vocabNewWord')}</Text>
          <View style={styles.card}>
            <Text style={styles.word}>{entry.word}</Text>
            <View style={styles.meaningRow}>
              <Text style={styles.pos}>{POS_LABEL_KEYS[entry.pos] ? t(POS_LABEL_KEYS[entry.pos]) : entry.pos}</Text>
              <Text style={styles.meaning}>{entry.meaning}</Text>
            </View>
            <Pressable
              style={[styles.speakBtn, speaking && styles.speakBtnActive]}
              onPress={speak}
            >
              {speaking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.speakBtnText}>{t('speakButton')}</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>{t('vocabReadingTitle')}</Text>
          {decomposed.length === 0 ? (
            <Text style={styles.hint}>{t('vocabNoSyllableHint')}</Text>
          ) : (
            decomposed.map((item, index) => (
              <DecomposedResult key={`${item.syllable}-${index}`} data={item} />
            ))
          )}

          <Pressable style={styles.nextButton} onPress={nextWord}>
            <Text style={styles.nextButtonText}>{t('nextWordButton')}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  levelBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#4A90D920',
  },
  levelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  levelBtnTextActive: {
    color: colors.primary,
  },
  emptyHint: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  word: {
    fontSize: 36,
    color: colors.text,
    marginBottom: 12,
  },
  meaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pos: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  meaning: {
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  speakBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  speakBtnActive: {
    opacity: 0.9,
  },
  speakBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
