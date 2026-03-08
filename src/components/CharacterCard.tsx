import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { HangulChar } from '../data/hangul';
import { colors } from '../constants/colors';

interface CharacterCardProps {
  item: HangulChar;
}

export function CharacterCard({ item }: CharacterCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.char}>{item.char}</Text>
      <Text style={styles.pronunciation}>{item.pronunciation}</Text>
      {item.name ? (
        <Text style={styles.name}>{item.name}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontSize: 32,
    color: colors.text,
    marginBottom: 4,
  },
  pronunciation: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  name: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
