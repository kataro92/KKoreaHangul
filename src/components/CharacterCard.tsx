import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Speech from 'expo-speech';
import type { AlphabetSpeakRole, HangulChar } from '../data/hangul';
import { getAlphabetSoundExample, getAlphabetSpeakText } from '../data/hangul';
import { useTheme } from '../constants/theme';
import { useSpeechConfig } from '../contexts/SpeechConfigContext';
import { GlassView } from './glass/GlassView';
import { useLanguage } from '../contexts/LanguageContext';

interface CharacterCardProps {
  item: HangulChar;
  speakRole: AlphabetSpeakRole;
}

let latestAlphabetPlaybackId = 0;

export function CharacterCard({ item, speakRole }: CharacterCardProps) {
  const theme = useTheme();
  const { locale } = useLanguage();
  const pronunciation = item.pronunciation === '(câm)'
    ? ({ en: '(silent)', vi: '(câm)', zh: '（不发音）', hi: '(मूक)', es: '(muda)', fr: '(muette)', ja: '（無音）' }[locale])
    : item.pronunciation;
  const { getSpeechOptions } = useSpeechConfig();
  const spokenText = getAlphabetSpeakText(item.char, speakRole);
  const soundExample = getAlphabetSoundExample(item.char, speakRole);
  const label = speakRole === 'initial' ? `${spokenText} · ${soundExample}` : speakRole === 'final' ? `→ ${spokenText}` : spokenText;

  const speak = useCallback(() => {
    if (!spokenText) return;
    const id = ++latestAlphabetPlaybackId;
    const options = getSpeechOptions();
    const text = speakRole === 'initial' ? `${spokenText}. ${soundExample}.` : spokenText;
    void Speech.stop().catch(() => undefined).then(() => {
      if (id === latestAlphabetPlaybackId) {
        Speech.speak(text, { ...options, rate: Math.min(options.rate, 0.85) });
      }
    });
  }, [spokenText, soundExample, speakRole, getSpeechOptions]);

  return (
    <Pressable
      onPress={speak}
      accessibilityRole="button"
      accessibilityLabel={`${item.char}${pronunciation ? `, ${pronunciation}` : ''}, ${label}`}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <GlassView radius={theme.radius.md} strong style={styles.card}>
        <Text style={[styles.char, { color: theme.colors.text }]}>{item.char}</Text>
        <Text style={[styles.pronunciation, { color: theme.colors.primary }]}>{pronunciation}</Text>
        <Text style={[styles.name, { color: theme.colors.textSecondary }]}>{label}</Text>
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
