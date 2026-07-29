import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { DecomposedSyllable } from '../utils/decompose';
import { PokerSyllableCard } from './PokerSyllableCard';

interface PokerSyllableRowProps {
  items: DecomposedSyllable[];
}

/** Hàng ngang các thẻ poker — vuốt ngang khi dài hơn màn hình. */
export function PokerSyllableRow({ items }: PokerSyllableRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {items.map((item, index) => (
        <View key={`${item.syllable}-${index}`} style={styles.item}>
          <PokerSyllableCard data={item} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -16 },
  row: { paddingHorizontal: 16, paddingVertical: 4, gap: 10, flexDirection: 'row', alignItems: 'center' },
  item: {},
});
