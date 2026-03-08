import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CategorySection } from '../../src/components/CategorySection';
import { colors } from '../../src/constants/colors';
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
  const batchimBySound = useMemo(() => getBatchimGroupedBySound(), []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>{t('alphabetTitle')}</Text>
      <Text style={styles.subheader}>{t('alphabetSubtitle')}</Text>

      <CategorySection title={t('alphabetBasicConsonants')} items={BASIC_CONSONANTS} />
      <CategorySection title={t('alphabetDoubleConsonants')} items={DOUBLE_CONSONANTS} />
      <CategorySection title={t('alphabetBasicVowels')} items={BASIC_VOWELS} />
      <CategorySection title={t('alphabetCompoundVowels')} items={COMPOUND_VOWELS} />

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeButton, mode === 'default' && styles.modeButtonActive]}
          onPress={() => setMode('default')}
        >
          <Text style={[styles.modeButtonText, mode === 'default' && styles.modeButtonTextActive]}>
            {t('alphabetModeDefault')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'bySound' && styles.modeButtonActive]}
          onPress={() => setMode('bySound')}
        >
          <Text style={[styles.modeButtonText, mode === 'bySound' && styles.modeButtonTextActive]}>
            {t('alphabetModeBySound')}
          </Text>
        </Pressable>
      </View>

      {mode === 'default' ? (
        <CategorySection title={t('alphabetBatchim')} items={BATCHIM_DISPLAY} />
      ) : (
        <>
          <Text style={styles.batchimSectionLabel}>{t('alphabetBatchimBySound')}</Text>
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
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.primary,
  },
  batchimSectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
});
