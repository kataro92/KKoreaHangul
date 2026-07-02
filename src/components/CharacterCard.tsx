import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { HangulChar } from '../data/hangul';
import { useTheme } from '../constants/theme';
import { GlassView } from './glass/GlassView';

interface CharacterCardProps {
  item: HangulChar;
}

export function CharacterCard({ item }: CharacterCardProps) {
  const theme = useTheme();
  return (
    <GlassView radius={theme.radius.md} strong style={styles.card}>
      <Text style={[styles.char, { color: theme.colors.text }]}>{item.char}</Text>
      <Text style={[styles.pronunciation, { color: theme.colors.primary }]}>{item.pronunciation}</Text>
      {item.name ? <Text style={[styles.name, { color: theme.colors.textSecondary }]}>{item.name}</Text> : null}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: { fontSize: 32, marginBottom: 4 },
  pronunciation: { fontSize: 14, fontWeight: '600' },
  name: { fontSize: 11, marginTop: 2 },
});
