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
  const batchimBySound = useMemo(() => getBatchimGroupedBySound(), []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Bảng chữ cái Hangul</Text>
      <Text style={styles.subheader}>Chữ Hàn và cách phát âm tiếng Việt</Text>

      <CategorySection title="Phụ âm cơ bản (자음)" items={BASIC_CONSONANTS} />
      <CategorySection title="Phụ âm kép (쌍자음)" items={DOUBLE_CONSONANTS} />
      <CategorySection title="Nguyên âm cơ bản (모음)" items={BASIC_VOWELS} />
      <CategorySection title="Nguyên âm kép (복합 모음)" items={COMPOUND_VOWELS} />

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeButton, mode === 'default' && styles.modeButtonActive]}
          onPress={() => setMode('default')}
        >
          <Text style={[styles.modeButtonText, mode === 'default' && styles.modeButtonTextActive]}>
            Mặc định
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'bySound' && styles.modeButtonActive]}
          onPress={() => setMode('bySound')}
        >
          <Text style={[styles.modeButtonText, mode === 'bySound' && styles.modeButtonTextActive]}>
            Nhóm theo âm
          </Text>
        </Pressable>
      </View>

      {mode === 'default' ? (
        <CategorySection title="Phụ âm cuối - Batchim (받침)" items={BATCHIM_DISPLAY} />
      ) : (
        <>
          <Text style={styles.batchimSectionLabel}>Phụ âm cuối - Batchim (받침) — nhóm theo cách đọc</Text>
          {batchimBySound.map((group) => (
            <CategorySection
              key={group.pronunciation}
              title={`Đọc: ${group.pronunciation}`}
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
