import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';
import { useReadingDisplay } from '../contexts/ReadingDisplayContext';
import { getPartPronunciations } from '../data/phonetics';
import type { DecomposedSyllable } from '../utils/decompose';

interface PokerSyllableCardProps {
  data: DecomposedSyllable;
}

const CARD_W = 96;
const CARD_H = 132;

/**
 * Thẻ kiểu poker: mặt trước chữ Hàn + phiên âm;
 * bấm để lật — mặt sau hiện cách ghép từng jamo → phát âm.
 */
export function PokerSyllableCard({ data }: PokerSyllableCardProps) {
  const theme = useTheme();
  const { phoneticSystem } = useReadingDisplay();
  const pron = getPartPronunciations(data, phoneticSystem);
  const isDark = theme.scheme === 'dark';
  const face = isDark ? '#1E2238' : '#FFFBF0';
  const ink = isDark ? '#F4F5FF' : '#1A1520';
  const border = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(26,21,32,0.12)';
  const c = theme.colors;

  const [flipped, setFlipped] = useState(false);
  const scaleX = useRef(new Animated.Value(1)).current;
  const flipping = useRef(false);

  useEffect(() => {
    setFlipped(false);
    scaleX.setValue(1);
    flipping.current = false;
  }, [data.syllable, data.initialIndex, data.medialIndex, data.finalIndex, phoneticSystem, scaleX]);

  const toggle = () => {
    if (flipping.current) return;
    flipping.current = true;
    Animated.timing(scaleX, { toValue: 0, duration: 120, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) {
        flipping.current = false;
        return;
      }
      setFlipped((f) => !f);
      Animated.timing(scaleX, { toValue: 1, duration: 120, useNativeDriver: true }).start(() => {
        flipping.current = false;
      });
    });
  };

  const hasFinal = data.finalChar.length > 0;
  const silent = '—';

  const parts: { char: string; sound: string; color: string }[] = [
    { char: data.initialChar, sound: pron.initial || silent, color: c.consonant },
    { char: data.medialChar, sound: pron.medial || silent, color: c.vowel },
  ];
  if (hasFinal) {
    parts.push({ char: data.finalChar, sound: pron.final || silent, color: c.batchim });
  }

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityState={{ checked: flipped }}
      accessibilityLabel={
        flipped
          ? `${data.syllable} ${parts.map((p) => `${p.char} ${p.sound}`).join(' ')}`
          : `${data.syllable} ${pron.syllable}`
      }
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: face,
            borderColor: border,
            shadowColor: '#000',
            transform: [{ scaleX }],
          },
        ]}
      >
        {flipped ? (
          <View style={styles.backGrid}>
            {parts.map((p, i) => (
              <View key={`${p.char}-${i}`} style={styles.backRow}>
                <Text style={[styles.partChar, { color: ink }]}>{p.char}</Text>
                <Text style={[styles.partSound, { color: p.color }]} numberOfLines={1}>
                  {p.sound}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            <Text style={[styles.hangul, { color: ink }]} numberOfLines={1}>
              {data.syllable}
            </Text>
            <View style={[styles.divider, { backgroundColor: c.vowel + '55' }]} />
            <Text style={[styles.phonetic, { color: c.vowel }]} numberOfLines={2}>
              {pron.syllable}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  hangul: { fontSize: 34, lineHeight: 40, fontWeight: '600' },
  divider: { width: 28, height: 1.5, borderRadius: 1, marginVertical: 8 },
  phonetic: { fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 15 },
  backGrid: { gap: 4 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  partChar: { fontSize: 16, fontWeight: '600', lineHeight: 20, minWidth: 20, textAlign: 'center' },
  partSound: { fontSize: 11, fontWeight: '700', lineHeight: 14, minWidth: 28, textAlign: 'left' },
});
