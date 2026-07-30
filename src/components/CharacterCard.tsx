import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Speech from 'expo-speech';
import type { AlphabetSpeakRole, HangulChar } from '../data/hangul';
import { getAlphabetSpeakText } from '../data/hangul';
import { useTheme } from '../constants/theme';
import { useSpeechConfig } from '../contexts/SpeechConfigContext';
import { GlassView } from './glass/GlassView';

interface CharacterCardProps {
  item: HangulChar;
  speakRole: AlphabetSpeakRole;
}

export function CharacterCard({ item, speakRole }: CharacterCardProps) {
  const theme = useTheme();
  const { getSpeechOptions } = useSpeechConfig();

  const speak = useCallback(() => {
    const text = getAlphabetSpeakText(item.char, speakRole);
    if (!text) return;
    Speech.stop();
    Speech.speak(text, getSpeechOptions());
  }, [item.char, speakRole, getSpeechOptions]);

  return (
    <Pressable
      onPress={speak}
      accessibilityRole="button"
      accessibilityLabel={`${item.char}${item.pronunciation ? `, ${item.pronunciation}` : ''}`}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <GlassView radius={theme.radius.md} strong style={styles.card}>
        <Text style={[styles.char, { color: theme.colors.text }]}>{item.char}</Text>
        <Text style={[styles.pronunciation, { color: theme.colors.primary }]}>{item.pronunciation}</Text>
        {item.name ? <Text style={[styles.name, { color: theme.colors.textSecondary }]}>{item.name}</Text> : null}
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  char: { fontSize: 32, marginBottom: 4 },
  pronunciation: { fontSize: 14, fontWeight: '600' },
  name: { fontSize: 11, marginTop: 2 },
});
