import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { GlassView } from '../../src/components/glass/GlassView';
import { GlassCard } from '../../src/components/glass/GlassCard';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import { getGrammarById } from '../../src/data/grammar';

export default function GrammarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { getSpeechOptions } = useSpeechConfig();
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const item = getGrammarById(String(id));

  useEffect(() => {
    navigation.setOptions({ title: item?.title ?? t('grammarTitle'), headerBackTitle: t('tabGrammar') });
  }, [navigation, item, t]);

  const speak = (text: string, index: number) => {
    if (speakingIndex === index) {
      Speech.stop();
      setSpeakingIndex(null);
      return;
    }
    Speech.stop();
    setSpeakingIndex(index);
    Speech.speak(text, {
      ...getSpeechOptions({
        onDone: () => setSpeakingIndex(null),
        onStopped: () => setSpeakingIndex(null),
        onError: () => setSpeakingIndex(null),
      }),
    });
  };

  if (!item) {
    return (
      <GlassScreen>
        <View style={styles.container}>
          <Text style={[styles.missing, { color: c.textSecondary }]}>{t('grammarEmpty')}</Text>
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: c.text }]}>{item.title}</Text>
      {item.tags.length > 0 && (
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <Text key={tag} style={[styles.tag, { color: c.primary, backgroundColor: c.primary + '1A' }]}>
              {tag}
            </Text>
          ))}
        </View>
      )}

      <GlassView radius={theme.radius.md} style={styles.structureCard}>
        <Text style={[styles.structureText, { color: c.text }]}>{item.structure}</Text>
      </GlassView>

      <Text style={[styles.paragraph, { color: c.text }]}>{item.explanation}</Text>

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('grammarUsage')}</Text>
      <Text style={[styles.paragraph, { color: c.text }]}>{item.usage}</Text>

      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('grammarExamples')}</Text>
      {item.examples.map((ex, index) => (
        <GlassCard key={index} style={styles.exampleWrap} contentStyle={styles.exampleContent}>
          <View style={styles.exampleHeader}>
            <Text style={[styles.exampleKo, { color: c.text }]}>{ex.ko}</Text>
            <Pressable
              onPress={() => speak(ex.ko, index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('speakButton')}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Ionicons name={speakingIndex === index ? 'stop-circle' : 'volume-high'} size={24} color={c.primary} />
            </Pressable>
          </View>
          <Text style={[styles.exampleVi, { color: c.textSecondary }]}>{ex.vi}</Text>
          {ex.note ? <Text style={[styles.exampleNote, { color: c.primary }]}>{ex.note}</Text> : null}
        </GlassCard>
      ))}
    </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  missing: { padding: 24, textAlign: 'center' },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  tag: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  structureCard: { padding: 16, marginBottom: 16 },
  structureText: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  paragraph: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  exampleWrap: { marginBottom: 12 },
  exampleContent: { padding: 16 },
  exampleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  exampleKo: { fontSize: 20, flex: 1, marginRight: 8 },
  exampleVi: { fontSize: 15, marginTop: 6 },
  exampleNote: { fontSize: 13, marginTop: 6, fontStyle: 'italic' },
});
