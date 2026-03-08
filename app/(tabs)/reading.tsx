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
import { colors } from '../../src/constants/colors';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSpeechConfig } from '../../src/contexts/SpeechConfigContext';
import { decomposeString } from '../../src/utils/decompose';

export default function ReadingScreen() {
  const [input, setInput] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const { t } = useLanguage();
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.inputSection}>
        <Text style={styles.label}>{t('readingInputLabel')}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('readingPlaceholder')}
          placeholderTextColor="#999"
          multiline
        />
        <Pressable
          style={[
            styles.speakButton,
            !canSpeak && styles.speakButtonDisabled,
            speaking && styles.speakButtonActive,
          ]}
          onPress={handleSpeak}
          disabled={!canSpeak}
        >
          {speaking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.speakButtonText}>{t('speakButton')}</Text>
          )}
        </Pressable>
      </View>
      <ScrollView
        style={styles.results}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {decomposed.length === 0 ? (
          <Text style={styles.hint}>
            {input.trim().length === 0
              ? t('readingHintEmpty')
              : t('readingHintNoHangul')}
          </Text>
        ) : (
          decomposed.map((item, index) => (
            <DecomposedResult key={`${item.syllable}-${index}`} data={item} />
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputSection: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: colors.text,
    minHeight: 52,
    textAlignVertical: 'top',
  },
  speakButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  speakButtonDisabled: {
    backgroundColor: '#aaa',
    opacity: 0.8,
  },
  speakButtonActive: {
    opacity: 0.9,
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
