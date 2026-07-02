import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategorySection } from '../../src/components/CategorySection';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import {
  BASIC_CONSONANTS,
  DOUBLE_CONSONANTS,
  BASIC_VOWELS,
  COMPOUND_VOWELS,
  BATCHIM_DISPLAY,
  getBatchimGroupedBySound,
} from '../../src/data/hangul';

type AlphabetMode = 'default' | 'bySound';

export default function AlphabetScreen() {
  const [mode, setMode] = useState<AlphabetMode>('default');
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const batchimBySound = useMemo(() => getBatchimGroupedBySound(), []);

  const modeBtn = (m: AlphabetMode, label: string) => {
    const active = mode === m;
    return (
      <Pressable
        style={[
          styles.modeButton,
          { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' },
        ]}
        onPress={() => setMode(m)}
      >
        <Text style={[styles.modeButtonText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <GlassScreen>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.header, { color: c.text }]}>{t('alphabetTitle')}</Text>
      <Text style={[styles.subheader, { color: c.textSecondary }]}>{t('alphabetSubtitle')}</Text>

      <CategorySection title={t('alphabetBasicConsonants')} items={BASIC_CONSONANTS} />
      <CategorySection title={t('alphabetDoubleConsonants')} items={DOUBLE_CONSONANTS} />
      <CategorySection title={t('alphabetBasicVowels')} items={BASIC_VOWELS} />
      <CategorySection title={t('alphabetCompoundVowels')} items={COMPOUND_VOWELS} />

      <View style={styles.modeRow}>
        {modeBtn('default', t('alphabetModeDefault'))}
        {modeBtn('bySound', t('alphabetModeBySound'))}
      </View>

      {mode === 'default' ? (
        <CategorySection title={t('alphabetBatchim')} items={BATCHIM_DISPLAY} />
      ) : (
        <>
          <Text style={[styles.batchimSectionLabel, { color: c.text }]}>{t('alphabetBatchimBySound')}</Text>
          {batchimBySound.map((group) => (
            <CategorySection
              key={group.pronunciation}
              title={`${t('alphabetReadPrefix')}${group.pronunciation}`}
              items={group.items}
            />
          ))}
        </>
      )}
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 110 },
  header: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subheader: { fontSize: 14, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  modeButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
  modeButtonText: { fontSize: 14, fontWeight: '600' },
  batchimSectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 8 },
});
