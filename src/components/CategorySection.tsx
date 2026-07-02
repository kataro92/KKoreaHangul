import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { HangulChar } from '../data/hangul';
import { useTheme } from '../constants/theme';
import { CharacterCard } from './CharacterCard';

interface CategorySectionProps {
  title: string;
  items: HangulChar[];
}

export function CategorySection({ title, items }: CategorySectionProps) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <CharacterCard key={`${item.char}-${index}`} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12, paddingHorizontal: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
