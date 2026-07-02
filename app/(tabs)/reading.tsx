import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import { DecomposedResult } from '../../src/components/DecomposedResult';
import { ReadingPractice } from '../../src/components/ReadingPractice';
import { GlassView } from '../../src/components/glass/GlassView';
import { GlassButton } from '../../src/components/glass/GlassButton';
import { GlassScreen } from '../../src/components/glass/GlassScreen';
import { useTheme } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import { decomposeString } from '../../src/utils/decompose';

type ReadingMode = 'analyze' | 'practice';

export default function ReadingScreen() {
  const [mode, setMode] = useState<ReadingMode>('analyze');
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const { t } = useLanguage();
  const theme = useTheme();
  const c = theme.colors;
  const { getSpeechOptions } = useSpeechConfig();

  const decomposed = decomposeString(input);

  const handleSpeak = useCallback(() => {
    const textToSpeak = input.trim();
    if (!textToSpeak) return;
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(textToSpeak, {
      ...getSpeechOptions({
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      }),
    });
  }, [input, speaking, getSpeechOptions]);

  const canSpeak = input.trim().length > 0;

  const modeBtn = (m: ReadingMode, label: string) => {
    const active = mode === m;
    return (
      <Pressable
        style={[styles.modeBtn, { borderColor: active ? c.primary : c.hairline, backgroundColor: active ? c.primary + '22' : 'transparent' }]}
        onPress={() => setMode(m)}
      >
        <Text style={[styles.modeBtnText, { color: active ? c.primary : c.textSecondary }]}>{label}</Text>
      </Pressable>
    );
  };

  const modeToggle = (
    <View style={styles.modeRow}>
      {modeBtn('analyze', t('readingModeAnalyze'))}
      {modeBtn('practice', t('readingModePractice'))}
    </View>
  );

  if (mode === 'practice') {
    return (
      <GlassScreen>
        <View style={styles.container}>
          {modeToggle}
          <ReadingPractice />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {modeToggle}
      <View style={styles.inputSection}>
        <Text style={[styles.label, { color: c.text }]}>{t('readingInputLabel')}</Text>
        <GlassView radius={theme.radius.md} style={styles.inputWrap}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            value={input}
            onChangeText={setInput}
            placeholder={t('readingPlaceholder')}
            placeholderTextColor={c.textSecondary}
            multiline
          />
        </GlassView>
        <GlassButton
          label={t('speakButton')}
          onPress={handleSpeak}
          disabled={!canSpeak}
          style={styles.speakBtn}
        >
          {speaking ? <ActivityIndicator size="small" color={c.onPrimary} /> : undefined}
        </GlassButton>
      </View>
      <ScrollView
        style={styles.results}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {decomposed.length === 0 ? (
          <Text style={[styles.hint, { color: c.textSecondary }]}>
            {input.trim().length === 0 ? t('readingHintEmpty') : t('readingHintNoHangul')}
          </Text>
        ) : (
          decomposed.map((item, index) => <DecomposedResult key={`${item.syllable}-${index}`} data={item} />)
        )}
      </ScrollView>
    </KeyboardAvoidingView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  modeRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, alignItems: 'center' },
  modeBtnText: { fontSize: 14, fontWeight: '600' },
  inputSection: { padding: 16, paddingBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputWrap: { padding: 2 },
  input: { padding: 14, fontSize: 18, minHeight: 52, textAlignVertical: 'top' },
  speakBtn: { marginTop: 12 },
  results: { flex: 1 },
  resultsContent: { padding: 16, paddingBottom: 110 },
  hint: { fontSize: 14, textAlign: 'center', paddingVertical: 24 },
});
