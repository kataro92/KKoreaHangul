import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { useLanguage } from '../contexts/LanguageContext';
import type { DecomposedSyllable } from '../utils/decompose';

interface DecomposedResultProps {
  data: DecomposedSyllable;
}

export function DecomposedResult({ data }: DecomposedResultProps) {
  const { t } = useLanguage();
  const hasFinal = data.finalChar.length > 0;
  return (
    <View style={styles.container}>
      <Text style={styles.syllable}>{data.syllable}</Text>
      <View style={styles.partsRow}>
        <View style={[styles.partBadge, styles.initial]}>
          <Text style={styles.partChar}>{data.initialChar}</Text>
          <Text style={styles.partLabel}>{t('decompInitial')}</Text>
          <Text style={styles.partPronInitial}>{data.initialPronunciation}</Text>
        </View>
        <Text style={styles.plus}>+</Text>
        <View style={[styles.partBadge, styles.medial]}>
          <Text style={styles.partChar}>{data.medialChar}</Text>
          <Text style={styles.partLabel}>{t('decompMedial')}</Text>
          <Text style={styles.partPronMedial}>{data.medialPronunciation}</Text>
        </View>
        {hasFinal && (
          <>
            <Text style={styles.plus}>+</Text>
            <View style={[styles.partBadge, styles.final]}>
              <Text style={styles.partChar}>{data.finalChar}</Text>
              <Text style={styles.partLabel}>{t('decompFinal')}</Text>
              <Text style={styles.partPronFinal}>{data.finalPronunciation}</Text>
            </View>
          </>
        )}
      </View>
      <Text style={styles.reading}>
        {t('decompRead')}<Text style={styles.readingValue}>{data.syllablePronunciation}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  syllable: {
    fontSize: 40,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  partsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  partBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 64,
  },
  initial: {
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
  },
  medial: {
    backgroundColor: 'rgba(232, 93, 117, 0.2)',
  },
  final: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  partChar: {
    fontSize: 24,
    color: colors.text,
  },
  partLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  partPronInitial: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    color: colors.consonant,
  },
  partPronMedial: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    color: colors.vowel,
  },
  partPronFinal: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    color: colors.batchim,
  },
  plus: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  reading: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  readingValue: {
    fontWeight: '700',
    color: colors.primary,
  },
});
