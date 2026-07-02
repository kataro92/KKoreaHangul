import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import type { DecomposedSyllable } from '../utils/decompose';
import { GlassCard } from './glass/GlassCard';

interface DecomposedResultProps {
  data: DecomposedSyllable;
}

export function DecomposedResult({ data }: DecomposedResultProps) {
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const hasFinal = data.finalChar.length > 0;

  const tint = (hex: string, a: number) => {
    // hex #RRGGBB → rgba
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  return (
    <GlassCard style={styles.wrap} contentStyle={styles.content}>
      <Text style={[styles.syllable, { color: c.text }]}>{data.syllable}</Text>
      <View style={styles.partsRow}>
        <View style={[styles.partBadge, { backgroundColor: tint(c.consonant, 0.18) }]}>
          <Text style={[styles.partChar, { color: c.text }]}>{data.initialChar}</Text>
          <Text style={[styles.partLabel, { color: c.textSecondary }]}>{t('decompInitial')}</Text>
          <Text style={[styles.partPron, { color: c.consonant }]}>{data.initialPronunciation}</Text>
        </View>
        <Text style={[styles.plus, { color: c.textSecondary }]}>+</Text>
        <View style={[styles.partBadge, { backgroundColor: tint(c.vowel, 0.18) }]}>
          <Text style={[styles.partChar, { color: c.text }]}>{data.medialChar}</Text>
          <Text style={[styles.partLabel, { color: c.textSecondary }]}>{t('decompMedial')}</Text>
          <Text style={[styles.partPron, { color: c.vowel }]}>{data.medialPronunciation}</Text>
        </View>
        {hasFinal && (
          <>
            <Text style={[styles.plus, { color: c.textSecondary }]}>+</Text>
            <View style={[styles.partBadge, { backgroundColor: tint(c.batchim, 0.18) }]}>
              <Text style={[styles.partChar, { color: c.text }]}>{data.finalChar}</Text>
              <Text style={[styles.partLabel, { color: c.textSecondary }]}>{t('decompFinal')}</Text>
              <Text style={[styles.partPron, { color: c.batchim }]}>{data.finalPronunciation}</Text>
            </View>
          </>
        )}
      </View>
      <Text style={[styles.reading, { color: c.textSecondary }]}>
        {t('decompRead')}
        <Text style={[styles.readingValue, { color: c.primary }]}>{data.syllablePronunciation}</Text>
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  content: { padding: 16 },
  syllable: { fontSize: 40, marginBottom: 12, textAlign: 'center' },
  partsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  partBadge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', minWidth: 64 },
  partChar: { fontSize: 24 },
  partLabel: { fontSize: 10, marginTop: 2 },
  partPron: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  plus: { fontSize: 16 },
  reading: { fontSize: 14, textAlign: 'center' },
  readingValue: { fontWeight: '700' },
});
